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
			const city: string = row.getValue("city")
			const arr = city.split(" ")
			for (var i = 0; i < arr.length; i++) {
				arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
			}
			const formatted = arr.join(" ")

			return <div>{formatted}</div>
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
			const value = parseFloat(row.getValue("value"))

			return <div className="text-right font-semibold">{value}</div>
		},
	},
]
