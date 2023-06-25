import { ColumnDef } from "@tanstack/react-table"
import { Property } from "@/lib/db/schema"

export const propertyInfoColumns: ColumnDef<Property>[] = [
	{
		accessorKey: "id",
		header: "Pozicija",
		cell: ({ row }) => <div>{row.index + 1}</div>,
	},
	{
		accessorKey: "title",
		header: "Naslov Oglasa",
		cell: ({ row }) => {
			const title: string = row.getValue("title") ?? "Bez naslova."
			const url = row.original.url ?? "#"

			return (
				<a href={url} target="_blank" className="font-medium underline underline-offset-4">
					{title.length > 45 ? title.substring(0, 44).concat("...") : title}
				</a>
			)
		},
	},
	{
		accessorKey: "yearBuilt",
		header: () => <div className="text-center">Godina Izgradnje</div>,
		cell: ({ row }) => {
			const year: number | null = row.getValue("yearBuilt")

			return <div className="text-center">{year ?? "/"}</div>
		},
	},
	{
		accessorKey: "city",
		header: "Grad",
		cell: ({ row }) => {
			const city: string | null = row.getValue("city")
			return <div>{city || "/"}</div>
		},
	},
	{
		accessorKey: "municipality",
		header: "Opština",
		cell: ({ row }) => {
			const municipality: string | null = row.getValue("municipality")
			return <div>{municipality || "/"}</div>
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

			return <div className="text-center">{numOfRooms ?? "/"}</div>
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
			const forSale = row.original.forSale
			const formatted = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR" }).format(price)

			return forSale ? (
				<div className="text-center">{formatted}</div>
			) : (
				<div className="text-center">{formatted}/ mesečno</div>
			)
		},
	},
]
