import { test } from "node:test"
import assert from "node:assert/strict"
import { createApp } from "./app"

const app = createApp(1024)

test("App", async (t) => {
  await t.test("/healthcheck", async () => {
    const res = await app.request('/healthcheck', { method: 'GET' })
    assert.equal(res.status, 200, "Exptected 200 response")
    const body = await res.json()
    assert.equal(body.status, 'OK', "Expected response to have status: OK")
  });
})
