import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import "dotenv/config.js"

const connectionString = process.env.DATABASE_URL!

// for query purposes
const queryClient = postgres(connectionString, { ssl: "require" })
export const db: PostgresJsDatabase = drizzle(queryClient)
