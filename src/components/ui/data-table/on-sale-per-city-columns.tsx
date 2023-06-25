import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../button"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
export type OnSalePerCity = {
	city: string | null
	value: number
}

export const totalOnSalePerCityColumns: ColumnDef<OnSalePerCity>[] = [
	{
		accessorKey: "city",
		header: "Grad",
		cell: ({ row }) => {
			const city: string | null = row.getValue("city")
			return <div>{city || "Ostalo"}</div>
		},
	},
	{
		accessorKey: "value",
		header: ({ column }) => {
			return (
				<div className="text-right">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Nekretnina u Prodaji
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			)
		},
		cell: ({ row }) => {
			const value: number = row.getValue("value")

			return <div className="text-right font-semibold">{value}</div>
		},
	},
]
