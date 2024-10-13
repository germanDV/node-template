import { serve } from "@hono/node-server"
import { createApp } from "./app"

const PORT = parseInt(process.env.HTTP_PORT || "3000")
const MAX_BODY_SIZE = parseInt(process.env.MAX_BODY_SIZE || "1048576")

const app = createApp(MAX_BODY_SIZE)

console.log('*** ========================== ***')
console.log(`Server is running on port ${PORT}`)
console.log(`Doc UI available at ${PORT}/doc`)
console.log(`JSON doc available at ${PORT}/doc-json`)
console.log('*** ========================== ***\n')

serve({ fetch: app.fetch, port: PORT })
