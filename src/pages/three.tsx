import Head from "next/head"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import dynamic from "next/dynamic"

import { Pool } from "@neondatabase/serverless"
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { property } from "@/lib/db/schema"
import { data } from "autoprefixer"

enum SizeBracket {
	micro = "up to 35 sqm",
	small = "36-50 sqm",
	medium = "51-65 sqm",
	large = "66-80 sqm",
	veryLarge = "81-95 sqm",
	huge = "96-110 sqm",
	enormous = "111+ sqm",
}

enum AgeBracket {
	fifties = "1951-1960",
	sixties = "1961-1970",
	seventies = "1971-1980",
	eighties = "1981-1990",
	nineties = "1991-2000",
	twenties = "2001-2010",
	twentytens = "2011-2020",
	outisde = "outside",
}

enum PriceBracket {
	veryLow = "very_low",
	low = "low",
	moderate = "moderate",
	high = "high",
	veryHigh = "very_high",
	luxury = "luxury",
}

interface Props {
	a: {
		municipality: string | null
		count: number
	}[]
	b: {
		sizeBracket: SizeBracket
		count: number
	}[]
	c: {
		yearBracket: AgeBracket
		min: number
		max: number
		count: number
	}[]
	d: {
		city: string
		forSale: number
		forRent: number
	}[]
	e: {
		priceBracket: PriceBracket
		count: number
	}[]
	f: {
		parking: boolean | null
		count: number
	}[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	// a)
	const aQuery = db
		.select({ municipality: property.municipality, count: sql<string>`count(*)` })
		.from(property)
		.where(and(isNotNull(property.municipality), eq(property.city, "Beograd"), eq(property.enabled, true)))
		.groupBy(property.municipality)
		.orderBy(desc(sql`count(*)`))
		.limit(10)

	// b)
	const bQuery = db
		.select({
			size_bracket: sql<SizeBracket>`CASE
				WHEN sq_meters <= 35 THEN 'up to 35 sqm'
				WHEN sq_meters <= 50 THEN '36-50 sqm'
				WHEN sq_meters <= 65 THEN '51-65 sqm'
				WHEN sq_meters <= 80 THEN '66-80 sqm'
				WHEN sq_meters <= 95 THEN '81-95 sqm'
				WHEN sq_meters <= 110 THEN '96-110 sqm'
				ELSE '111+ sqm'
  		END as size_bracket`,
			count: sql<string>`count(*)`,
		})
		.from(property)
		.where(
			and(
				eq(property.type, "apartment"),
				eq(property.forSale, true),
				isNotNull(property.sqMeters),
				eq(property.enabled, true)
			)
		)
		.groupBy(sql`size_bracket`)
		.orderBy(desc(sql`count`))

	// c)
	const cQuery = db
		.select({
			year_bracket: sql<AgeBracket>`CASE
				WHEN year_built <= 1960 AND year_built >= 1951 THEN '1951-1960'
				WHEN year_built <= 1970 THEN '1961-1970'
				WHEN year_built <= 1980 THEN '1971-1980'
				WHEN year_built <= 1990 THEN '1981-1990'
				WHEN year_built <= 2000 THEN '1991-2000'
				WHEN year_built <= 2010 THEN '2001-2010'
				WHEN year_built <= 2020 THEN '2011-2020'
				ELSE 'outside'
			END as year_bracket`,
			count: sql<string>`count(*)`,
		})
		.from(property)
		.where(and(isNotNull(property.yearBuilt), eq(property.enabled, true)))
		.groupBy(sql`year_bracket`)
		.orderBy(desc(sql`count`))

	// d)
	const citySubQuery = db
		.select({ city: property.city })
		.from(property)
		.where(and(isNotNull(property.city), eq(property.enabled, true)))
		.groupBy(property.city)
		.orderBy(desc(sql`count(*)`))
		.limit(5)
	const dQuery = db
		.select({ city: property.city, forSale: property.forSale, count: sql<string>`count(*)` })
		.from(property)
		.where(and(inArray(property.city, citySubQuery), eq(property.enabled, true)))
		.groupBy(property.city, property.forSale)

	// e)
	const eQuery = db
		.select({
			price_bracket: sql<PriceBracket>`CASE
			WHEN price <= 49999 THEN 'very_low'
			WHEN price <= 99999 THEN 'low'
			WHEN price <= 149999 THEN 'moderate'
			WHEN price <= 199999 THEN 'high'
			WHEN price <= 499999 THEN 'very_high'
			ELSE 'luxury'
		END as price_bracket`,
			count: sql<string>`count(*)`,
		})
		.from(property)
		.where(and(eq(property.forSale, true), eq(property.enabled, true)))
		.groupBy(sql`price_bracket`)
		.orderBy(desc(sql`count`))

	// f)
	const fQuery = db
		.select({ parking: property.parking, count: sql<string>`count(*)` })
		.from(property)
		.where(and(isNotNull(property.parking), eq(property.city, "Beograd"), eq(property.enabled, true)))
		.groupBy(property.parking)
		.orderBy(desc(sql`count`))

	const [aRes, bRes, cRes, dRes, eRes, fRes] = await Promise.all([aQuery, bQuery, cQuery, dQuery, eQuery, fQuery])

	const c = cRes
		.filter((row) => row.year_bracket !== "outside")
		.map(({ year_bracket, count }) => {
			const [min, max] = year_bracket.split("-").map((x) => +x)
			return {
				yearBracket: year_bracket,
				min,
				max,
				count: +count,
			}
		})
		.sort((a, b) => a.min - b.min)

	const d = dRes
		.reduce<{ city: string; forSale: number; forRent: number }[]>((acc, { city, forSale, count }) => {
			const index = acc.findIndex((x) => x.city === city)
			if (index === -1) {
				forSale
					? acc.push({ city: city!, forSale: +count, forRent: 0 })
					: acc.push({ city: city!, forSale: 0, forRent: +count })
			} else {
				forSale ? (acc[index].forSale = +count) : (acc[index].forRent = +count)
			}
			return acc
		}, [])
		.sort((a, b) => b.forRent + b.forSale - (a.forRent + a.forSale))

	return {
		props: {
			a: aRes.map((row) => ({ municipality: row.municipality, count: +row.count })),
			b: bRes.map((row) => ({ sizeBracket: row.size_bracket, count: +row.count })),
			c,
			d,
			e: eRes.map((row) => ({ priceBracket: row.price_bracket, count: +row.count })),
			f: fRes.map((row) => ({ parking: row.parking, count: +row.count })),
		},
	}
}

const BarChart = dynamic(import("../components/charts/bar-chart"), { ssr: false })
const LineChart = dynamic(import("../components/charts/line-chart"), { ssr: false })
const PieChart = dynamic(import("../components/charts/pie-chart"), { ssr: false })

export default function Task3({ a, b, c, d, e, f }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<main className="p-24">
			<Head>
				<title>Pronalaženje skrivenog znanja - Vizuelizacija podataka</title>
				<meta property="og:title" content="Pronalaženje skrivenog znanja - Vizuelizacija podataka" key="title" />
			</Head>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Zadatak 3 - Vizuelizacija podataka
			</h1>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				a) 10 najzastupljenijih delova Beograda
			</h2>
			<BarChart
				data={a.map((data) => ({ label: data.municipality || "Ostalo", value: data.count }))}
				yLabel="Broj nekretnina"
			/>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				b) Broj stanova na prodaju prema kvadraturi
			</h2>
			<BarChart
				data={b.map((data) => {
					switch (data.sizeBracket) {
						case SizeBracket.micro:
							return { label: "do 35 m²", value: data.count }
						case SizeBracket.small:
							return { label: "36-50 m²", value: data.count }
						case SizeBracket.medium:
							return { label: "51-65 m²", value: data.count }
						case SizeBracket.large:
							return { label: "66-80 m²", value: data.count }
						case SizeBracket.veryLarge:
							return { label: "81-95 m²", value: data.count }
						case SizeBracket.huge:
							return { label: "96-110 m²", value: data.count }
						case SizeBracket.enormous:
						default:
							return { label: "111+ m²", value: data.count }
					}
				})}
				yLabel="Broj stanova na prodaju"
			/>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				c) Broj izgrađenih nekretnina po dekadama
			</h2>
			<LineChart
				data={c.map((data) => ({ label: data.yearBracket, value: data.count }))}
				yLabel="Broj izgrađenih nekretnina"
			/>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				d) Odnos izdavanja i prodaje u top 5 gradova
			</h2>
			<div className="flex flex-wrap">
				{d.map(({ city, forSale, forRent }) => (
					<div key={city} className="w-1/2 flex flex-col items-center">
						<h3 className="mt-5 scroll-m-20 text-2xl font-semibold tracking-tight text-center">{city}</h3>
						<p className="text-sm text-muted-foreground">Ukupno {forRent + forSale}</p>
						<PieChart
							data={[
								{ label: "Izdavanje", value: forRent },
								{ label: "Prodaja", value: forSale },
							]}
						/>
					</div>
				))}
			</div>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				e) Broj nekretnina na prodaju po cenovnim rangovima
			</h2>
			<PieChart
				height={450}
				data={e.map((data) => {
					switch (data.priceBracket) {
						case PriceBracket.veryLow:
							return { label: "0-49999", value: data.count }
						case PriceBracket.low:
							return { label: "50000-99999", value: data.count }
						case PriceBracket.moderate:
							return { label: "100000-149999", value: data.count }
						case PriceBracket.high:
							return { label: "150000-199999", value: data.count }
						case PriceBracket.veryHigh:
							return { label: "200000-499999", value: data.count }
						default:
							return { label: "500000+", value: data.count }
					}
				})}
			/>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				f) Broj nekretnina na prodaju sa parkingom u Beogradu
			</h2>
			<PieChart
				height={450}
				data={f.map((data) => ({ label: data.parking ? "Ima parking" : "Nema parking", value: data.count }))}
			/>
			<p className="text-sm text-center text-muted-foreground">
				Ukupno {f.reduce((acc, x) => acc + x.count, 0)} nekretnina na prodaju u Beogradu
			</p>
		</main>
	)
}
