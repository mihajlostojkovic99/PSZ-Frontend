// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "dotenv/config"
import type { NextApiRequest, NextApiResponse } from "next"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { property, linearRegression, LinearRegression } from "@/lib/db/schema"
import { normalize } from "@/lib/utils/normalize"
import { and, desc, eq, isNotNull, sql } from "drizzle-orm"

export type ResponseData = {
	predictedPrice: number
}

export type PropertyData = {
	intercept: number
	mlBelgradeDistance: number
	numOfRooms: number
	numOfBathrooms: number
	sqMeters: number
	yearBuilt: number
	floor: number
	totalFloors: number
	registered: number
	floorHeating: number
	heatPumpHeating: number
	centralHeating: number
	electricHeating: number
	solidFuelHeating: number
	gasHeating: number
	thermalStorage: number
	airCon: number
	parking: number
	garage: number
	elevator: number
	balcony: number
	basement: number
	pool: number
	garden: number
	reception: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	console.log("BODY: ", req.body)
	const body = req.body as PropertyData

	const normalizedData = await normalize(body)

	const [coefficients] = await db.select().from(linearRegression).orderBy(desc(linearRegression.dateCalculated))

	let prediction = 0
	for (const key in coefficients) {
		if (key === "id" || key === "dateCalculated") {
			continue
		}
		if (key === "intercept") {
			prediction += +coefficients[key]
		} else {
			prediction += +coefficients[key as keyof LinearRegression] * +normalizedData[key as keyof PropertyData]
		}
	}

	const [stdPrice, meanPrice] = await Promise.all([
		db
			.select({ std: sql<string>`STDDEV(${property.price})` })
			.from(property)
			.where(
				and(
					eq(property.enabled, true),
					eq(property.type, "apartment"),
					eq(property.forSale, true),
					isNotNull(property.mlMunicipality)
				)
			),
		db
			.select({ mean: sql<string>`AVG(${property.price})` })
			.from(property)
			.where(
				and(
					eq(property.enabled, true),
					eq(property.type, "apartment"),
					eq(property.forSale, true),
					isNotNull(property.mlMunicipality)
				)
			),
	])

	const predictedPrice = prediction * +stdPrice[0].std + +meanPrice[0].mean

	res.status(200).json({ predictedPrice })
}
