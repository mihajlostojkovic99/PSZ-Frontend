import { ColumnDef } from "@tanstack/react-table"
import { ApartmentsForSale, HousesForSale } from "@/lib/db/schema"

// This type is used to define the shape of our data.
export type PropertyInfo = Pick<
	HousesForSale,
	"url" | "title" | "location" | "sqMeters" | "numOfRooms" | "numOfBathrooms" | "price"
> & {
	rent?: boolean
}

export const propertyInfoColumns: ColumnDef<PropertyInfo>[] = [
	{
		accessorKey: "id",
		header: "Pozicija",
		cell: ({ row }) => <div>{row.index + 1}</div>,
	},
	{
		accessorKey: "title",
		header: "Naslov Oglasa",
		cell: ({ row }) => {
			const title: string = row.getValue("title")
			const url = row.original.url

			return (
				<a href={url ?? "#"} target="_blank" className="font-medium underline underline-offset-4">
					{title.length > 25 ? title.substring(0, 24).concat("...") : title}
				</a>
			)
		},
	},
	{
		accessorKey: "location",
		header: "Lokacija",
		cell: ({ row }) => {
			const location: string = row.getValue("location")
			const nicerLocation = location.replace(",", ", ")
			const arr = nicerLocation.split(" ")
			for (var i = 0; i < arr.length; i++) {
				arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
			}
			const formatted = arr.join(" ")
			return <div>{formatted}</div>
		},
	},
	{
		accessorKey: "sqMeters",
		header: "Površina",
		cell: ({ row }) => {
			const area: number = row.getValue("sqMeters")

			return (
				<div>
					{area} m<sup>2</sup>
				</div>
			)
		},
	},
	{
		accessorKey: "numOfRooms",
		header: () => <div className="text-center">Broj Soba</div>,
		cell: ({ row }) => {
			const numOfRooms: number = row.getValue("numOfRooms")

			return <div className="text-center">{numOfRooms}</div>
		},
	},
	{
		accessorKey: "numOfBathrooms",
		header: () => <div className="text-center">Broj Kupatila</div>,
		cell: ({ row }) => {
			const numOfBathrooms: number = row.getValue("numOfBathrooms")

			return <div className="text-center">{numOfBathrooms ?? "/"}</div>
		},
	},
	{
		accessorKey: "price",
		header: () => <div className="text-center">Cena</div>,
		cell: ({ row }) => {
			const price: number = row.getValue("price")
			const rent = row.original.rent
			const formatted = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR" }).format(price)

			return rent === undefined ? (
				<div className="text-center">{formatted}</div>
			) : (
				<div className="text-center">
					{formatted}
					{rent && " / mesečno"}
				</div>
			)
		},
	},
]
