import { GetServerSideProps, InferGetServerSidePropsType } from "next"

import { DataTable } from "@/components/ui/data-table/data-table"
import { houseInfoColumns } from "@/components/ui/data-table/house-info"
import { totalOnSalePerCityColumns } from "@/components/ui/data-table/on-sale-per-city-columns"
import { propertyInfoColumns } from "@/components/ui/data-table/property-info"
import { SimpleTable } from "@/components/ui/simple-table"
import { property, Property } from "@/lib/db/schema"
import { inter } from "@/lib/utils/fonts"
import { Pool } from "@neondatabase/serverless"
import { desc, isNotNull, sql, eq, and, inArray } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import Head from "next/head"

type Props = {
	a: {
		forSale: number
		forRent: number
	}
	b: {
		city: string | null
		value: number
	}[]
	c: {
		type: "house" | "apartment"
		registered: boolean | null
		count: number
	}[]
	d: {
		top30Apartments: Property[]
		top30Houses: Property[]
	}
	e: {
		top100Apartments: Property[]
		top100Houses: Property[]
	}
	f: {
		newConstructionSale: Property[]
		newConstructionRent: Property[]
	}
	g: {
		top30ByRooms: Property[]
		top30HousesByArea: Property[]
	}
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	// a)
	const aQuery = db
		.select({ forSale: property.forSale, count: sql<string>`count(*)` })
		.from(property)
		.where(eq(property.enabled, true))
		.groupBy(property.forSale)

	// b)
	const bQuery = db
		.select({ city: property.city, count: sql<string>`count(*)` })
		.from(property)
		.where(and(eq(property.forSale, true), eq(property.enabled, true)))
		.groupBy(property.city)
		.orderBy(desc(sql`count`), property.city)

	// c)
	const cQuery = db
		.select({ type: property.type, registered: property.registered, count: sql<string>`count(*)` })
		.from(property)
		.where(eq(property.enabled, true))
		.groupBy(property.type, property.registered)
		.orderBy(desc(sql`count`), property.type)

	// d)
	const top30ApartmentsQuery = db
		.select()
		.from(property)
		.where(and(eq(property.forSale, true), eq(property.type, "apartment"), eq(property.enabled, true)))
		.orderBy(desc(property.price), property.city)
		.limit(30)
	const top30HousesQuery = db
		.select()
		.from(property)
		.where(and(eq(property.forSale, true), eq(property.type, "house"), eq(property.enabled, true)))
		.orderBy(desc(property.price), property.city)
		.limit(30)

	// e)
	const top100ApartmentsQuery = db
		.select()
		.from(property)
		.where(and(eq(property.type, "apartment"), isNotNull(property.sqMeters), eq(property.enabled, true)))
		.orderBy(desc(property.sqMeters), property.city)
		.limit(100)
	const top100HousesQuery = db
		.select()
		.from(property)
		.where(and(eq(property.type, "house"), isNotNull(property.sqMeters), eq(property.enabled, true)))
		.orderBy(desc(property.sqMeters), property.city)
		.limit(100)

	// f)
	const newConstructionSaleQuery = db
		.select()
		.from(property)
		.where(and(eq(property.forSale, true), inArray(property.yearBuilt, [2022, 2023]), eq(property.enabled, true)))
		.orderBy(desc(property.price), property.yearBuilt)
	const newConstructionRentQuery = db
		.select()
		.from(property)
		.where(and(eq(property.forSale, false), inArray(property.yearBuilt, [2022, 2023]), eq(property.enabled, true)))
		.orderBy(desc(property.price), property.yearBuilt)

	// g)
	const top30ByRoomsQuery = db
		.select()
		.from(property)
		.where(and(isNotNull(property.numOfRooms), eq(property.enabled, true)))
		.orderBy(desc(property.numOfRooms), property.city)
		.limit(30)
	const top30HousesByAreaQuery = db
		.select()
		.from(property)
		.where(and(isNotNull(property.landArea), eq(property.enabled, true)))
		.orderBy(desc(property.landArea), property.city)
		.limit(30)

	const [
		aRes,
		bRes,
		cRes,
		top30Apartments,
		top30Houses,
		top100Houses,
		top100Apartments,
		newConstructionSale,
		newConstructionRent,
		top30ByRooms,
		top30HousesByArea,
	] = await Promise.all([
		aQuery,
		bQuery,
		cQuery,
		top30ApartmentsQuery,
		top30HousesQuery,
		top100HousesQuery,
		top100ApartmentsQuery,
		newConstructionSaleQuery,
		newConstructionRentQuery,
		top30ByRoomsQuery,
		top30HousesByAreaQuery,
	])

	return {
		props: {
			a: {
				forSale: +(aRes.find((val) => val.forSale)?.count || 0),
				forRent: +(aRes.find((val) => !val.forSale)?.count || 0),
			},
			b: bRes.map((row) => ({ city: row.city, value: +row.count })),
			c: cRes.map((row) => ({ type: row.type, registered: row.registered, count: +row.count })),
			d: { top30Apartments, top30Houses },
			e: { top100Apartments, top100Houses },
			f: { newConstructionSale, newConstructionRent },
			g: { top30ByRooms, top30HousesByArea },
		},
	}
}

export default function Task2({ a, b, c, d, e, f, g }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<main className={`p-24 ${inter.className}`}>
			<Head>
				<title>Zadatak 2 - Analiza podataka</title>
				<meta property="og:title" content="Zadatak 2 - Analiza podataka" key="title" />
			</Head>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Zadatak 2 - Analiza podataka
			</h1>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				a) Broj nekretnina za prodaju i za iznajmljivanje
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<SimpleTable
					rows={[
						{ name: "Nekretnina na prodaju", value: a.forSale },
						{ name: "Nekretnina na iznajmljivanje", value: a.forRent },
					]}
				/>
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				b) Izlistati koliko nekretnina se prodaje u svakom od gradova
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<DataTable columns={totalOnSalePerCityColumns} data={b} />
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				c) Izlistati koliko je uknjiženih, a koliko neuknjiženih kuća, a koliko stanova
			</h2>
			<div className="my-6 mx-auto w-1/2 overflow-y-auto">
				<SimpleTable
					rows={c.reduce<{ name: string; value: number }[]>((acc, data) => {
						if (data.type === "apartment" && data.registered) {
							acc.push({ name: "Uknjiženih stanova", value: data.count })
						} else if (data.type === "apartment" && !data.registered) {
							acc.push({ name: "Neuknjiženih stanova", value: data.count })
						} else if (data.type === "house" && data.registered) {
							acc.push({ name: "Uknjiženih kuća", value: data.count })
						} else if (data.type === "house" && !data.registered) {
							acc.push({ name: "Neuknjiženih kuća", value: data.count })
						}
						return acc
					}, [])}
				/>
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				d) Najskuplje nekretnine na oglasima u Srbiji
			</h2>
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 stanova na prodaju</h3>
			<DataTable columns={propertyInfoColumns} data={d.top30Apartments} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 kuća na prodaju</h3>
			<DataTable columns={propertyInfoColumns} data={d.top30Houses} />

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				e) Najveće nekretnine na oglasima u Srbiji
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

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				f) Rang lista nekretnina izgrađenih 2022. i 2023. godine
			</h2>
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Nekretnine na prodaju</h3>
			<p className="text-sm text-muted-foreground">
				* {f.newConstructionSale.length} nekretnina sortirano po ceni opadajuće.
			</p>
			<DataTable columns={propertyInfoColumns} data={f.newConstructionSale} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Nekretnine na iznajmljivanje</h3>
			<p className="text-sm text-muted-foreground">
				* {f.newConstructionRent.length} nekretnina sortirano po ceni opadajuće.
			</p>
			<DataTable columns={propertyInfoColumns} data={f.newConstructionRent} />

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				g) Top 30 liste po razlicitim kriterijumima
			</h2>
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 po broju soba</h3>
			<p className="text-sm text-muted-foreground">
				*Naznačene cene su prodajne ukoliko nije prikazana cena po mesecu.
			</p>
			<DataTable columns={propertyInfoColumns} data={g.top30ByRooms} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 stanova po površini</h3>
			<p className="text-sm text-muted-foreground">
				*Naznačene cene su prodajne ukoliko nije prikazana cena po mesecu.
			</p>
			<DataTable columns={propertyInfoColumns} data={e.top100Apartments.slice(0, 30)} />
			<h3 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">Top 30 kuća po površini placa</h3>
			<p className="text-sm text-muted-foreground">
				*Naznačene cene su prodajne ukoliko nije prikazana cena po mesecu.
			</p>
			<DataTable columns={houseInfoColumns} data={g.top30HousesByArea} />
		</main>
	)
}
