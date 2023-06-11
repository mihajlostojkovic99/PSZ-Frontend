// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import "dotenv/config"
import { housesForRent } from "../../lib/db/schema"

export type Data = {
	data: {
		id: string
		url: string | null
	}[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)
	const result = await db
		.select({
			id: housesForRent.id,
			url: housesForRent.url,
		})
		.from(housesForRent)
		.limit(5)
	res.status(200).json({ data: result })
}
