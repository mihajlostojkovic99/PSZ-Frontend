import Head from "next/head"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { distances } from "@/lib/municipalities"
import { Loader2 } from "lucide-react"

const checkboxes = [
	{
		id: "registered",
		label: "Uknjižen",
	},
	{
		id: "floorHeating",
		label: "Podno grejanje",
	},
	{
		id: "heatPumpHeating",
		label: "Toplotna pumpa",
	},
	{
		id: "centralHeating",
		label: "Centralno grejanje",
	},
	{
		id: "electricHeating",
		label: "Grejanje na struju",
	},
	{
		id: "solidFuelHeating",
		label: "Grejanje na čvrsta goriva",
	},
	{
		id: "gasHeating",
		label: "Grejanje na gas",
	},
	{
		id: "thermalStorage",
		label: "TA peć",
	},
	{
		id: "airCon",
		label: "Klima uređaj",
	},
	{
		id: "parking",
		label: "Parking",
	},
	{
		id: "garage",
		label: "Garaža",
	},
	{
		id: "elevator",
		label: "Lift",
	},
	{
		id: "balcony",
		label: "Balkon",
	},
	{
		id: "basement",
		label: "Podrum",
	},
	{
		id: "pool",
		label: "Bazen",
	},
	{
		id: "garden",
		label: "Bašta",
	},
	{
		id: "reception",
		label: "Recepcija",
	},
] as const

const apartmentFormSchema = z.object({
	mlBelgradeDistance: z.number().default(1000),
	numOfRooms: z.number().default(2),
	numOfBathrooms: z.number().default(1),
	sqMeters: z.number().default(30),
	yearBuilt: z.number().default(2023),
	floor: z.number().default(0),
	totalFloors: z.number().default(4),
	registered: z.number().default(0),
	floorHeating: z.number().default(0),
	heatPumpHeating: z.number().default(0),
	centralHeating: z.number().default(0),
	electricHeating: z.number().default(0),
	solidFuelHeating: z.number().default(0),
	gasHeating: z.number().default(0),
	thermalStorage: z.number().default(0),
	airCon: z.number().default(0),
	parking: z.number().default(0),
	garage: z.number().default(0),
	elevator: z.number().default(0),
	balcony: z.number().default(0),
	basement: z.number().default(0),
	pool: z.number().default(0),
	garden: z.number().default(0),
	reception: z.number().default(0),
})

export default function Task4() {
	const form = useForm<z.infer<typeof apartmentFormSchema>>({
		resolver: zodResolver(apartmentFormSchema),
		defaultValues: {
			mlBelgradeDistance: 0,
			numOfRooms: 1,
			numOfBathrooms: 1,
			sqMeters: 30,
			floor: 2,
			totalFloors: 4,
			yearBuilt: 2023,
		},
	})

	const [loading, setLoading] = useState(false)
	const [prediction, setPrediction] = useState<number | undefined>(undefined)

	const onSubmit = async (data: z.infer<typeof apartmentFormSchema>) => {
		console.log(data)
		setLoading(true)

		const response = await fetch("/api/linear-regression", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		const result = await response.json()
		setPrediction(result.predictedPrice)
		setLoading(false)
	}

	return (
		<main className="p-24">
			<Head>
				<title>Pronalaženje skrivenog znanja - Implementacija regresije</title>
				<meta property="og:title" content="Pronalaženje skrivenog znanja - Implementacija regresije" key="title" />
			</Head>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Zadatak 4 - Implementacija regresije
			</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8 w-[400px] mx-auto">
					<FormField
						control={form.control}
						name="mlBelgradeDistance"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Opština</FormLabel>
								<Select onValueChange={(value) => field.onChange(+value.split("_")[1])}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Odaberite opštinu" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="max-h-[200px] overflow-y-scroll">
										{Object.entries(distances).map(([municipality, distance], index) => (
											<SelectItem value={`${municipality}_${distance.toString()}`} key={index}>
												{municipality}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="yearBuilt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Godina izgradnje</FormLabel>
								<FormControl>
									<Input type="number" min={1800} {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="numOfRooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Broj soba</FormLabel>
								<FormControl>
									<Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="numOfBathrooms"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Broj toaleta</FormLabel>
								<FormControl>
									<Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="sqMeters"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Površina stana u m<sup>2</sup>
								</FormLabel>
								<FormControl>
									<Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="floor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sprat</FormLabel>
								<FormControl>
									<Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="totalFloors"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ukupno spratova u zgradi</FormLabel>
								<FormControl>
									<Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{checkboxes.map((checkbox, index) => (
						<FormField
							key={checkbox.id}
							control={form.control}
							name={checkbox.id}
							render={({ field }) => {
								return (
									<FormItem key={checkbox.id} className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value === 1 ? true : false}
												onCheckedChange={(checked) => {
													return checked ? field.onChange(1) : field.onChange(0)
												}}
											/>
										</FormControl>
										<FormLabel className="font-normal">{checkbox.label}</FormLabel>
									</FormItem>
								)
							}}
						/>
					))}
					<Button type="submit" disabled={loading} className="w-full bg-blue-400 hover:bg-blue-500">
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generiši cenu
					</Button>
				</form>
			</Form>
			<div className="mt-8 text-center scroll-m-20 text-2xl font-semibold tracking-tight">
				Predikcija cene:{" "}
				{prediction
					? new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR" }).format(prediction)
					: "No prediction."}
			</div>
		</main>
	)
}
