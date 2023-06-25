import { ColumnDef } from "@tanstack/react-table"
import { Property } from "@/lib/db/schema"

export const houseInfoColumns: ColumnDef<Property>[] = [
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
		accessorKey: "landArea",
		header: () => <div className="text-center">Površina zemljišta</div>,
		cell: ({ row }) => {
			const area: number = row.getValue("landArea")

			return <div className="text-center">{area} ar</div>
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

// import { ColumnDef } from "@tanstack/react-table"
// import { HousesForSale } from "@/lib/db/schema"

// // This type is used to define the shape of our data.
// export type HouseInfo = Pick<
// 	HousesForSale,
// 	"url" | "title" | "yearBuilt" | "location" | "sqMeters" | "landArea" | "numOfRooms" | "numOfBathrooms" | "price"
// > & {
// 	rent?: boolean
// }

// export const houseInfoColumns: ColumnDef<HouseInfo>[] = [
// 	{
// 		accessorKey: "id",
// 		header: "Pozicija",
// 		cell: ({ row }) => <div>{row.index + 1}</div>,
// 	},
// 	{
// 		accessorKey: "title",
// 		header: "Naslov Oglasa",
// 		cell: ({ row }) => {
// 			const title: string = row.getValue("title")
// 			const url = row.original.url

// 			return (
// 				<a href={url ?? "#"} target="_blank" className="font-medium underline underline-offset-4">
// 					{title.length > 45 ? title.substring(0, 44).concat("...") : title}
// 				</a>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: "yearBuilt",
// 		header: () => <div className="text-center">Godina Izgradnje</div>,
// 		cell: ({ row }) => {
// 			const year: number = row.getValue("yearBuilt")

// 			return <div className="text-center">{year ?? "/"}</div>
// 		},
// 	},
// 	{
// 		accessorKey: "location",
// 		header: "Lokacija",
// 		cell: ({ row }) => {
// 			const location: string = row.getValue("location")
// 			const nicerLocation = location.replace(",", ", ")
// 			const arr = nicerLocation.split(" ")
// 			for (var i = 0; i < arr.length; i++) {
// 				arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
// 			}
// 			const formatted = arr.join(" ")
// 			return <div>{formatted}</div>
// 		},
// 	},
// 	{
// 		accessorKey: "sqMeters",
// 		header: () => <div className="text-center">Površina</div>,
// 		cell: ({ row }) => {
// 			const area: number = row.getValue("sqMeters")

// 			return (
// 				<div className="text-center">
// 					{area} m<sup>2</sup>
// 				</div>
// 			)
// 		},
// 	},
// 	{
// 		accessorKey: "landArea",
// 		header: () => <div className="text-center">Površina zemljišta</div>,
// 		cell: ({ row }) => {
// 			const area: number = row.getValue("landArea")

// 			return <div className="text-center">{area} ar</div>
// 		},
// 	},
// 	{
// 		accessorKey: "numOfRooms",
// 		header: () => <div className="text-center">Broj Soba</div>,
// 		cell: ({ row }) => {
// 			const numOfRooms: number = row.getValue("numOfRooms")

// 			return <div className="text-center">{numOfRooms}</div>
// 		},
// 	},
// 	{
// 		accessorKey: "numOfBathrooms",
// 		header: () => <div className="text-center">Broj Kupatila</div>,
// 		cell: ({ row }) => {
// 			const numOfBathrooms: number = row.getValue("numOfBathrooms")

// 			return <div className="text-center">{numOfBathrooms ?? "/"}</div>
// 		},
// 	},
// 	{
// 		accessorKey: "price",
// 		header: () => <div className="text-center">Cena</div>,
// 		cell: ({ row }) => {
// 			const price: number = row.getValue("price")
// 			const rent = row.original.rent
// 			const formatted = new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR" }).format(price)

// 			return rent === undefined ? (
// 				<div className="text-center">{formatted}</div>
// 			) : (
// 				<div className="text-center">
// 					{formatted}
// 					{rent && " / mesečno"}
// 				</div>
// 			)
// 		},
// 	},
// ]
