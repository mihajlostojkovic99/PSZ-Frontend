import { GetServerSideProps, InferGetServerSidePropsType } from "next"

import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql, notInArray } from "drizzle-orm"
import { inter } from "@/lib/utils/fonts"
import { Button } from "@/components/ui/button"
import { housesForSale } from "@/lib/db/schema"
import { DataTable } from "@/components/ui/task2-table/data-table"
import { columns } from "@/components/ui/task2-table/columns"

type Props = {
	totalSale: number
	totalRent: number
	totalSalePerCity: {
		city: string | null
		value: number
	}[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	const [aQuery, bQuery] = await Promise.all([
		db.execute<{
			propertiesForSale: number
			propertiesForRent: number
		}>(sql`
    SELECT 
      ((SELECT COUNT(*) FROM apartments_for_sale WHERE enabled=true) +
        (SELECT COUNT(*) FROM houses_for_sale WHERE enabled=true)) AS "propertiesForSale",
      ((SELECT COUNT(*) FROM apartments_for_rent WHERE enabled=true) +
        (SELECT COUNT(*) FROM houses_for_rent WHERE enabled=true)) AS "propertiesForRent";`),
		db.execute<{
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
    ORDER BY value desc`),
	])

	const a = aQuery.rows[0]
	const b = bQuery.rows
	return { props: { totalSale: a.propertiesForSale, totalRent: a.propertiesForRent, totalSalePerCity: b } }
}

export default function Task2({
	totalSale,
	totalRent,
	totalSalePerCity,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<main className={`p-24 ${inter.className}`}>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Zadatak 2 - Analiza podataka
			</h1>

			<h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				a) Broj nekretnina za prodaju i za iznajmljivanje
			</h2>
			<div className="my-6 w-full overflow-y-auto">
				<table className="w-full">
					<tbody>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Nekretnina na prodaju
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right font-bold">
								{totalSale}
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Nekretnina na iznajmljivanje
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right font-bold">
								{totalRent}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 className="mt-10 mb-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
				b) Izlistati koliko nekretnina se prodaje u svakom od gradova
			</h2>
			<DataTable columns={columns} data={totalSalePerCity} />
		</main>
	)
}
