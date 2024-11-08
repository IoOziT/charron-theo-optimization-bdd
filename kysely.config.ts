import { defineConfig } from "kysely-ctl"

import { kysely } from "./src/db/kysely"

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "src/db/migrations",
  },
  seeds: {
    seedFolder: "src/db/seeds",
  },
})
