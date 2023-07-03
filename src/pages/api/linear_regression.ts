// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import "dotenv/config"
import type { NextApiRequest, NextApiResponse } from "next"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import { Property, property } from "@/lib/db/schema"

export type ResponseData = {
	pricePrediction: number
}

// export const normalize = (df: dfd.DataFrame, seriesName: string[]) => {
//   const factors: { [name: string]: { mi: number; sigma: number } } = {};
//   for (const name of seriesName) {
//     const series = df[name];
//     const mean = series.mean();
//     const std = series.std();
//     df.addColumn(
//       name,
//       series.apply((val: number) => (val - mean) / std),
//       { inplace: true }
//     );
//     factors[name] = { mi: mean, sigma: std };
//   }
//   return factors;
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const db = drizzle(pool)

	const body = req.body

	console.log("REQUEST BODY", body)

	const pricePrediction = 500
	res.status(200).json({ pricePrediction })
}
