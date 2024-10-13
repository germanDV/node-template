import { createMiddleware } from 'hono/factory'

/** Logs requests and responses and attaches a logger to `c` */
export const logger = createMiddleware<{
  Variables: { logger: (...data: any[]) => void }
}>(async (c, next) => {
  const start = new Date()
  const reqId = c.get('requestId')

  c.set('log', (...data: any[]) => {
    console.log(`[${reqId}]`, ...data)
  })

  console.log(`[${reqId}] ${c.req.method} ${c.req.path}`)
  await next()
  
  const took = new Date().getTime() - start.getTime()
  console.log(`[${reqId}] ${c.req.method} ${c.req.path} ${c.res.status} ${took}ms`)
})
