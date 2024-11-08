import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely"
import pg from "pg"

const user = process.env.POSTGRES_USER ?? "postgres"
const password = process.env.POSTGRES_PASSWORD
const database = process.env.POSTGRES_DB ?? user
const host = process.env.NODE_ENV === "production" ? "db" : "localhost"

export const pool = new pg.Pool({
	user,
	password,
	database,
	host,
})

export const kysely = new Kysely({
	dialect: new PostgresDialect({
		pool,
	}),
	plugins: [new CamelCasePlugin()],
})
