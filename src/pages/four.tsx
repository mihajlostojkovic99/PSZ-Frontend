import Head from "next/head"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useState } from "react"

import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface Props {
	hello?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	return {
		props: {
			hello: "world",
		},
	}
}

const apartmentFormSchema = z.object({
	municipality: z.string({ required_error: "Opstina je obavezno polje." }),
	numOfRooms: z.number({ required_error: "Broj soba je obavezno polje." }),
	numOfBathrooms: z.number({ required_error: "Broj kupatila je obavezno polje." }),
	sqMeters: z.number({ required_error: "Površina je obavezno polje." }),
	yearBuilt: z.number().optional(),
	floor: z.number({ required_error: "Sprat je obavezno polje." }),
	totalFloors: z.number().optional(),
	registered: z.boolean().optional(),
	floorHeating: z.boolean().optional(),
	heatPumpHeating: z.boolean().optional(),
	centralHeating: z.boolean().optional(),
	electricHeating: z.boolean().optional(),
	solidFuelHeating: z.boolean().optional(),
	gasHeating: z.boolean().optional(),
	thermalStorage: z.boolean().optional(),
	airCon: z.boolean().optional(),
	parking: z.boolean().optional(),
	garage: z.boolean().optional(),
	elevator: z.boolean().optional(),
	balcony: z.boolean().optional(),
	basement: z.boolean().optional(),
	pool: z.boolean().optional(),
	garden: z.boolean().optional(),
	reception: z.boolean().optional(),
})

export default function Task3({ hello }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const form = useForm<z.infer<typeof apartmentFormSchema>>({
		resolver: zodResolver(apartmentFormSchema),
		defaultValues: {
			municipality: "",
			numOfRooms: 1,
			numOfBathrooms: 1,
			sqMeters: 30,
			floor: 0,
		},
	})

	const [prediction, setPrediction] = useState<number | undefined>(undefined)

	const onSubmit = async (data: z.infer<typeof apartmentFormSchema>) => {
		console.log(data)

		const response = await fetch("/api/linear_regression", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		const result = await response.json()
		setPrediction(result.pricePrediction)
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
						name="municipality"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Opština</FormLabel>
								<FormControl>
									<Input placeholder="Vračar" {...field} />
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
					<Button type="submit" className="w-40 bg-blue-400 hover:bg-blue-500">
						Submit
					</Button>
				</form>
			</Form>
			Hello: {prediction ?? "No prediction."}
		</main>
	)
}
