import { OpenAPIHono } from "@hono/zod-openapi"
import { bodyLimit } from "hono/body-limit"
import { secureHeaders } from "hono/secure-headers"
import { requestId } from "hono/request-id"
import { HTTPException } from "hono/http-exception"
import { logger } from "./middleware/logger"
import { healthcheckRouter } from "./routers/healthcheck"
import { ratingsRouter } from "./routers/ratings"
import { registerDocs } from "./routers/docs"

// Extend the variables available to `c.get()`
declare module 'hono' {
  interface ContextVariableMap {
    log: (...data: any[]) => void
  }
}

export function createApp(maxBodySize: number): OpenAPIHono {
  const app = new OpenAPIHono()

  app.use("*", requestId())
  app.use(secureHeaders())
  app.use(logger)
  app.use(
    bodyLimit({
      maxSize: maxBodySize,
      onError: (c) => c.json({ error: "Request body is too large" }, 413),
    })
  )

  app.route("/healthcheck", healthcheckRouter)
  app.route("/ratings", ratingsRouter)
  registerDocs(app)

  app.onError((err, c) => {
    const log = c.get('log')
    if (err instanceof HTTPException) {
      log(`http exception: ${err.message}`)
      if (err.status >= 500) {
        return c.json({ error: "something went wrong" }, err.status)
      }
      return c.json({ error: err.message }, err.status)
    }
    log(`unhandled error: ${err.message}`)
    return c.json({ error: "internal server error" }, 500)
  })

  return app
}
