import { GetServerSideProps, InferGetServerSidePropsType } from "next"

import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql, notInArray, isNotNull, desc } from "drizzle-orm"
import { inter } from "@/lib/utils/fonts"
import { Button } from "@/components/ui/button"
import {
	ApartmentsForSale,
	HousesForSale,
	apartmentsForRent,
	apartmentsForSale,
	housesForRent,
	housesForSale,
} from "@/lib/db/schema"
import { DataTable } from "@/components/ui/data-table/data-table"
import { totalOnSalePerCityColumns } from "@/components/ui/data-table/on-sale-per-city-columns"
import { SimpleTable } from "@/components/ui/simple-table"
import { propertyInfoColumns } from "@/components/ui/data-table/property-info"

type Props = {
	a: {
		totalSale: number
		totalRent: number
	}
	b: {
		totalSalePerCity: {
			city: string | null
			value: number
		}[]
	}
	c: {
		houses: {
			registered: number
			unregistered: number
		}
		apartments: {
			registered: number
			unregistered: number
		}
	}
	d: {
		top30Apartments: ApartmentsForSale[]
		top30Houses: HousesForSale[]
	}
	e: {
		top100Apartments: Array<
			Pick<ApartmentsForSale, "url" | "title" | "location" | "sqMeters" | "numOfRooms" | "numOfBathrooms" | "price"> & {
				rent: boolean
			}
		>
		top100Houses: Array<
			Pick<HousesForSale, "url" | "title" | "location" | "sqMeters" | "numOfRooms" | "numOfBathrooms" | "price"> & {
				rent: boolean
			}
		>
	}
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	// a)
	const aQuery = db.execute<{
		propertiesForSale: number
		propertiesForRent: number
	}>(sql`
	SELECT 
		((SELECT COUNT(*) FROM apartments_for_sale WHERE enabled=true) +
			(SELECT COUNT(*) FROM houses_for_sale WHERE enabled=true)) AS "propertiesForSale",
		((SELECT COUNT(*) FROM apartments_for_rent WHERE enabled=true) +
			(SELECT COUNT(*) FROM houses_for_rent WHERE enabled=true)) AS "propertiesForRent";`)

	// b)
	const bQuery = db.execute<{
		city: string | null
		value: number
	}>(sql`
	SELECT city, SUM(value) as value
	FROM 
		(
			(
				SELECT city, count(*) as value
				FROM houses_for_sale
				WHERE city NOT IN ('srbija', 'crna gora', 'hrvatska', 'bosna i hercegovina')
				GROUP BY city
			)
		UNION ALL 
			(
				SELECT city, count(*) as value
				FROM houses_for_sale
				WHERE city NOT IN ('srbija', 'crna gora', 'hrvatska', 'bosna i hercegovina')
				GROUP BY city
			)
		) as joined_properties
	GROUP BY joined_properties.city
	ORDER BY value desc`)

	// c)
	const registrationHousesForSaleQuery = db
		.select({ registration: housesForSale.registration, count: sql<string>`count(*)` })
		.from(housesForSale)
		.where(isNotNull(housesForSale.registration))
		.groupBy(housesForSale.registration)
	const registrationHousesForRentQuery = db
		.select({ registration: housesForRent.registration, count: sql<string>`count(*)` })
		.from(housesForRent)
		.where(isNotNull(housesForRent.registration))
		.groupBy(housesForRent.registration)
	const registrationApartmentsForSaleQuery = db
		.select({ registration: apartmentsForSale.registration, count: sql<string>`count(*)` })
		.from(apartmentsForSale)
		.where(isNotNull(apartmentsForSale.registration))
		.groupBy(apartmentsForSale.registration)
	const registrationApartmentsForRentQuery = db
		.select({ registration: apartmentsForRent.registration, count: sql<string>`count(*)` })
		.from(apartmentsForRent)
		.where(isNotNull(apartmentsForRent.registration))
		.groupBy(apartmentsForRent.registration)

	// d)
	const top30ApartmentsQuery = db.select().from(apartmentsForSale).orderBy(desc(apartmentsForSale.price)).limit(30)
	const top30HousesQuery = db.select().from(housesForSale).orderBy(desc(housesForSale.price)).limit(30)

	// e)
	const top100HousesQuery = db.execute<
		Pick<HousesForSale, "url" | "title" | "location" | "sqMeters" | "numOfRooms" | "numOfBathrooms" | "price"> & {
			rent: boolean
		}
	>(sql`
		SELECT url, title, location, sq_meters as "sqMeters", num_of_rooms as "numOfRooms", num_of_bathrooms as "numOfBathrooms", price, rent
		FROM (
			(
				SELECT url, title, location, sq_meters, num_of_rooms, num_of_bathrooms, price, enabled, FALSE as rent
				FROM houses_for_sale
			)
			UNION ALL
			(
				SELECT url, title, location, sq_meters, num_of_rooms, num_of_bathrooms, price, enabled, TRUE as rent
				FROM houses_for_rent
			)
		) AS joined_houses
		WHERE sq_meters IS NOT NULL and enabled=TRUE
		ORDER BY sq_meters DESC
		LIMIT 100`)

	const top100ApartmentsQuery = db.execute<
		Pick<ApartmentsForSale, "url" | "title" | "location" | "sqMeters" | "numOfRooms" | "numOfBathrooms" | "price"> & {
			rent: boolean
		}
	>(sql`
		SELECT url, title, location, sq_meters as "sqMeters", num_of_rooms as "numOfRooms", num_of_bathrooms as "numOfBathrooms", price, rent
		FROM (
			(
				SELECT url, title, location, sq_meters, num_of_rooms, num_of_bathrooms, price, enabled, FALSE as rent
				FROM apartments_for_sale
			)
			UNION ALL
			(
				SELECT url, title, location, sq_meters, num_of_rooms, num_of_bathrooms, price, enabled, TRUE as rent
				FROM apartments_for_rent
			)
		) AS joined_apartments
		WHERE sq_meters IS NOT NULL and enabled=TRUE
		ORDER BY sq_meters DESC
		LIMIT 100`)

	const [
		aRes,
		bRes,
		registrationHousesForSale,
		registrationHousesForRent,
		registrationApartmentsForSale,
		registrationApartmentsForRent,
		top30Apartments,
		top30Houses,
		top100Houses,
		top100Apartments,
	] = await Promise.all([
		aQuery,
		bQuery,
		registrationHousesForSaleQuery,
		registrationHousesForRentQuery,
		registrationApartmentsForSaleQuery,
		registrationApartmentsForRentQuery,
		top30ApartmentsQuery,
		top30HousesQuery,
		top100HousesQuery,
		top100ApartmentsQuery,
	])

	const a = aRes.rows[0]
	const b = bRes.rows
	const c = {
		houses: {
			registered:
				parseInt(registrationHousesForRent.find((val) => val.registration === true)?.count ?? "0") +
				parseInt(registrationHousesForSale.find((val) => val.registration === true)?.count ?? "0"),
			unregistered:
				parseInt(registrationHousesForRent.find((val) => val.registration === false)?.count ?? "0") +
				parseInt(registrationHousesForSale.find((val) => val.registration === false)?.count ?? "0"),
		},
		apartments: {
			registered:
				parseInt(registrationApartmentsForRent.find((val) => val.registration === true)?.count ?? "0") +
				parseInt(registrationApartmentsForSale.find((val) => val.registration === true)?.count ?? "0"),
			unregistered:
				parseInt(registrationApartmentsForRent.find((val) => val.registration === false)?.count ?? "0") +
				parseInt(registrationApartmentsForSale.find((val) => val.registration === false)?.count ?? "0"),
		},
	}
	return {
		props: {
			a: { totalSale: a.propertiesForSale, totalRent: a.propertiesForRent },
			b: { totalSalePerCity: b },
			c,
			d: { top30Apartments, top30Houses },
			e: { top100Apartments: top100Apartments.rows, top100Houses: top100Houses.rows },
		},
	}
}

export default function Task2({ a, b, c, d, e }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<main className={`p-24 ${inter.className}`}>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Zadatak 2 - Analiza podataka
			</h1>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				a) Broj nekretnina za prodaju i za iznajmljivanje
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<SimpleTable
					rows={[
						{ name: "Nekretnina na prodaju", value: a.totalSale },
						{ name: "Nekretnina na iznajmljivanje", value: a.totalRent },
					]}
				/>
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				b) Izlistati koliko nekretnina se prodaje u svakom od gradova
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<DataTable columns={totalOnSalePerCityColumns} data={b.totalSalePerCity} />
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				c) Izlistati koliko je uknjiženih, a koliko neuknjiženih kuća, a koliko stanova
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<SimpleTable
					rows={[
						{ name: "Uknjiženih stanova", value: c.apartments.registered },
						{ name: "Neuknjiženih stanova", value: c.apartments.unregistered },
						{ name: "Uknjiženih kuća", value: c.houses.registered },
						{ name: "Neuknjiženih kuća", value: c.houses.unregistered },
					]}
				/>
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				d) Rang lista &quot;top 30&quot; stanova i kuća na prodaju
			</h2>
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 stanova na prodaju</h3>
			<DataTable columns={propertyInfoColumns} data={d.top30Apartments} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 kuća na prodaju</h3>
			<DataTable columns={propertyInfoColumns} data={d.top30Houses} />

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				e) Rang lista &quot;top 100&quot; stanova i kuća po površini
			</h2>
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 100 stanova po površini</h3>
			<p className="text-sm text-muted-foreground">
				*Naznačene cene su prodajne ukoliko nije prikazana cena po mesecu.
			</p>
			<DataTable columns={propertyInfoColumns} data={e.top100Apartments} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 100 kuća po površini</h3>
			<p className="text-sm text-muted-foreground">
				*Naznačene cene su prodajne ukoliko nije prikazana cena po mesecu.
			</p>
			<DataTable columns={propertyInfoColumns} data={e.top100Houses} />
		</main>
	)
}
