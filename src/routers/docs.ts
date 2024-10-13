import { OpenAPIHono } from "@hono/zod-openapi"
import { apiReference } from '@scalar/hono-api-reference'

export function registerDocs(app: OpenAPIHono) {
  app.doc("/doc-json", {
    openapi: "3.0.0",
    info: { version: "0.1.0", title: "Hono API Example" },
  })

  app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
    type: "http",
    scheme: "bearer",
  })

  app.get("/doc", apiReference({ spec: { url: "/doc-json" }}))
}
