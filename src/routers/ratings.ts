import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { jwt } from "hono/jwt"

const JWT_SECRET = process.env.JWT_HS256_SECRET || ""
if (!JWT_SECRET) {
  console.error("Missing JWT secret")
  process.exit(1)
}

const CreateRatingReqDto = z.object({
  stars: z
    .number()
    .min(1)
    .max(5)
    .openapi({ description: "1-5 stars", example: 5 }),
  comment: z
    .string()
    .min(5)
    .max(100)
    .openapi({ description: "a review", example: "lovely thing" }),
}).openapi('CreateRatingReq')

const CreateRatingResDto = z.object({
  id: z.string().openapi({ description: "the ID of the created rating" }),
}).openapi('CreateRatingRes')

const GetRatingsReqDto = z
  .object({ articleId: z.string() })
  .openapi('GetRatingsReq')

const GetRatingsResDto = z.object({
  ratings: z.array(z.object({
    articleId: z.string().openapi({ description: "the ID of the article" }),
    id: z.string().openapi({ description: "the ID of the rating" }),
    stars: z.number().openapi({ description: "the number of stars", example: 5 }),
    comment: z.string().openapi("a review"),
  })),
}).openapi('GetRatingsRes')

const postRatingRoute = createRoute({
  method: "post",
  path: "/",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreateRatingReqDto } },
    },
  },
  responses: {
    201: {
      description: "Rating created",
      content: { "application/json": { schema: CreateRatingResDto } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: z.object({ message: z.string() }) } }
    },
  },
})

const getRatingsRoute = createRoute({
  method: "get",
  path: "/:articleId",
  security: [{ Bearer: [] }],
  request: {
    params: GetRatingsReqDto,
  },
  responses: {
    200: {
      description: "Ratings retrieved",
      content: { "application/json": { schema: GetRatingsResDto } },
    },
    404: {
      description: "Article not found",
      content: { "application/json": { schema: z.object({ message: z.string() }) } }
    },
  },
})

export const ratingsRouter = new OpenAPIHono()
ratingsRouter.use("*", jwt({ secret: JWT_SECRET, alg: "HS256" }))

ratingsRouter.openapi(postRatingRoute, async (c) => {
  c.get('log')(`User ID: ${c.get("jwtPayload").sub}`)
  const body = c.req.valid('json')
  const id = crypto.randomUUID()
  return c.json({ id }, 201)
})

ratingsRouter.openapi(getRatingsRoute, async (c) => {
  const { articleId } = c.req.valid('param')
  if (articleId === 'abc') {
    c.get('log')("hardcoded response for now")
    return c.json({ message: "article not found" }, 404)
  }
  return c.json({ ratings: [] }, 200)
})
