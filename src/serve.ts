import { serve } from "@hono/node-server"
import { showRoutes } from "hono/dev"

import { app } from "."

showRoutes(app, {
  colorize: true,
  verbose: true,
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => console.log(`Listening on ${info.address}:${info.port}`)
)
