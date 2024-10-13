import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi"

const HealthcheckStatus = {
  OK: "OK",
  ERR: "ERR",
} as const

const HealthcheckResDto = z
  .object({
    status: z
      .enum(
        Object.values(HealthcheckStatus) as [
          (typeof HealthcheckStatus)[keyof typeof HealthcheckStatus],
        ]
      )
      .openapi({ description: "the health status", example: "OK" }),
  })
  .openapi("HealthcheckRes")

const healthcheckRoute = createRoute({
  method: "get",
  path: "/",
  request: {},
  responses: {
    200: {
      description: "Health response",
      content: { "application/json": { schema: HealthcheckResDto } },
    },
  },
})

export const healthcheckRouter = new OpenAPIHono()

healthcheckRouter.openapi(healthcheckRoute, (c) => {
  return c.json({ status: HealthcheckStatus.OK }, 200)
})

