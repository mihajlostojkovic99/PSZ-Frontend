// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "dotenv/config"
import type { NextApiRequest, NextApiResponse } from "next"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { Property, property } from "@/lib/db/schema"

export type Data = {
	data: Property[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)
	const result = await db.select().from(property).limit(5)
	res.status(200).json({ data: result })
}
