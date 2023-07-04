import { and, eq, isNotNull, sql } from "drizzle-orm"
import { db } from "../db/drizzle"
import { property } from "../db/schema"

const seriesNames = [
	"mlBelgradeDistance",
	"numOfRooms",
	"numOfBathrooms",
	"sqMeters",
	"yearBuilt",
	"floor",
	"totalFloors",
] as const

type NumberValues = {
	[K in (typeof seriesNames)[number]]: number
}

export async function normalize<T extends NumberValues>(data: T) {
	const factors = await Promise.all(
		seriesNames.map(async (name) => {
			const meanQuery = db
				.select({ mean: sql<number>`AVG(${property[name]})` })
				.from(property)
				.where(
					and(
						eq(property.enabled, true),
						eq(property.type, "apartment"),
						eq(property.forSale, true),
						isNotNull(property.mlMunicipality)
					)
				)
			const stdQuery = db
				.select({ std: sql<number>`STDDEV(${property[name]})` })
				.from(property)
				.where(
					and(
						eq(property.enabled, true),
						eq(property.type, "apartment"),
						eq(property.forSale, true),
						isNotNull(property.mlMunicipality)
					)
				)

			const [mean, std] = await Promise.all([meanQuery, stdQuery])

			return { name, mean: +mean[0].mean, std: +std[0].std }
		})
	)

	factors.forEach(({ name, mean, std }) => {
		data[name] = (data[name] - mean) / std
	})

	return data
}
