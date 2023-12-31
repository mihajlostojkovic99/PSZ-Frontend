import { InferModel } from "drizzle-orm"
import {
	boolean,
	integer,
	pgTable,
	text,
	uniqueIndex,
	uuid,
	varchar,
	PgTableWithColumns,
	decimal,
	date,
	pgEnum,
} from "drizzle-orm/pg-core"

export const typeEnum = pgEnum("property_type", ["house", "apartment"])

export const property = pgTable(
	"property",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		originalId: varchar("original_id", { length: 14 }),
		url: varchar("url", { length: 255 }),
		dateUpdated: date("date_updated", { mode: "string" }),
		datePosted: date("date_created", { mode: "string" }),
		dateScraped: date("date_scraped").notNull().defaultNow(),
		title: text("title"),
		forSale: boolean("for_sale").notNull(),
		type: typeEnum("type").notNull(),
		country: varchar("country", { length: 255 }),
		region: varchar("region", { length: 255 }),
		city: varchar("city", { length: 255 }),
		municipality: varchar("municipality", { length: 255 }),
		mlMunicipality: varchar("ml_municipality", { length: 255 }),
		mlBelgradeDistance: decimal("ml_belgrade_distance"),
		street: varchar("street", { length: 255 }),
		numOfRooms: decimal("num_of_rooms"),
		numOfBathrooms: integer("num_of_bathrooms"),
		sqMeters: decimal("sq_meters"),
		landArea: decimal("land_area"),
		yearBuilt: integer("year_built"),
		floor: integer("floor"),
		totalFloors: integer("total_floors"),
		registered: boolean("registration").default(false),
		floorHeating: boolean("floor_heating").default(false),
		heatPumpHeating: boolean("heat_pump_heating").default(false),
		centralHeating: boolean("central_heating").default(false),
		electricHeating: boolean("electric_heating").default(false),
		solidFuelHeating: boolean("solid_fuel_heating").default(false),
		gasHeating: boolean("gas_heating").default(false),
		thermalStorage: boolean("thermal_storage").default(false),
		airCon: boolean("air_con").default(false),
		parking: boolean("parking").default(false),
		garage: boolean("garage").default(false),
		elevator: boolean("elevator").default(false),
		balcony: boolean("balcony").default(false),
		basement: boolean("basement").default(false),
		pool: boolean("pool").default(false),
		garden: boolean("garden").default(false),
		reception: boolean("reception").default(false),
		price: decimal("price").notNull(),
		enabled: boolean("enabled").notNull().default(true),
	},
	(property) => {
		return {
			urlIndex: uniqueIndex("idx_property_url").on(property.url),
		}
	}
)
export type Property = InferModel<typeof property>
export type NewProperty = InferModel<typeof property, "insert">

export const linearRegression = pgTable("linear_regression", {
	id: uuid("id").primaryKey().defaultRandom(),
	dateCalculated: date("date_scraped").notNull().defaultNow(),
	intercept: decimal("intercept").notNull(),
	mlBelgradeDistance: decimal("ml_belgrade_distance").notNull(),
	numOfRooms: decimal("num_of_rooms").notNull(),
	numOfBathrooms: decimal("num_of_bathrooms").notNull(),
	sqMeters: decimal("sq_meters").notNull(),
	yearBuilt: decimal("year_built").notNull(),
	floor: decimal("floor").notNull(),
	totalFloors: decimal("total_floors").notNull(),
	registered: decimal("registration").notNull(),
	floorHeating: decimal("floor_heating").notNull(),
	heatPumpHeating: decimal("heat_pump_heating").notNull(),
	centralHeating: decimal("central_heating").notNull(),
	electricHeating: decimal("electric_heating").notNull(),
	solidFuelHeating: decimal("solid_fuel_heating").notNull(),
	gasHeating: decimal("gas_heating").notNull(),
	thermalStorage: decimal("thermal_storage").notNull(),
	airCon: decimal("air_con").notNull(),
	parking: decimal("parking").notNull(),
	garage: decimal("garage").notNull(),
	elevator: decimal("elevator").notNull(),
	balcony: decimal("balcony").notNull(),
	basement: decimal("basement").notNull(),
	pool: decimal("pool").notNull(),
	garden: decimal("garden").notNull(),
	reception: decimal("reception").notNull(),
})
export type LinearRegression = InferModel<typeof linearRegression>
