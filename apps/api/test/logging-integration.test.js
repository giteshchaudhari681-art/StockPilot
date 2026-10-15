import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../dist/app.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("Backend Logging and Correlation Integration", async (t) => {
  const app = createApp();
  let server;
  let baseUrl;

  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  t.after(() => {
    if (server) {
      server.close();
    }
  });

  await t.test(
    "GET /health generates correlation ID and sets response header",
    async () => {
      const res = await fetch(`${baseUrl}/health`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.status, "ok");

      const correlationId = res.headers.get("x-correlation-id");
      assert.ok(correlationId, "X-Correlation-ID header must be present");
      assert.match(
        correlationId,
        UUID_REGEX,
        "Generated correlation ID must match UUID format",
      );
    },
  );

  await t.test(
    "GET /health preserves valid incoming X-Correlation-ID",
    async () => {
      const customId = "trace-req-client-98765";
      const res = await fetch(`${baseUrl}/health`, {
        headers: {
          "x-correlation-id": customId,
        },
      });

      assert.equal(res.status, 200);
      assert.equal(res.headers.get("x-correlation-id"), customId);
    },
  );

  await t.test(
    "GET /health preserves valid incoming X-Request-ID if correlation-id absent",
    async () => {
      const requestId = "request-uuid-445566";
      const res = await fetch(`${baseUrl}/health`, {
        headers: {
          "x-request-id": requestId,
        },
      });

      assert.equal(res.status, 200);
      assert.equal(res.headers.get("x-correlation-id"), requestId);
    },
  );

  await t.test(
    "GET /health sanitizes malformed incoming correlation ID",
    async () => {
      const badId = "invalid!characters#not$allowed*in^id";
      const res = await fetch(`${baseUrl}/health`, {
        headers: {
          "x-correlation-id": badId,
        },
      });

      assert.equal(res.status, 200);
      const correlationId = res.headers.get("x-correlation-id");
      assert.notEqual(correlationId, badId);
      assert.match(
        correlationId,
        UUID_REGEX,
        "Malformed correlation ID must be replaced with a valid UUID",
      );
    },
  );

  await t.test(
    "GET /health replaces oversized correlation ID (>64 chars)",
    async () => {
      const oversizedId = "a".repeat(65);
      const res = await fetch(`${baseUrl}/health`, {
        headers: {
          "x-correlation-id": oversizedId,
        },
      });

      assert.equal(res.status, 200);
      const correlationId = res.headers.get("x-correlation-id");
      assert.notEqual(correlationId, oversizedId);
      assert.match(
        correlationId,
        UUID_REGEX,
        "Oversized correlation ID must be replaced with a valid UUID",
      );
    },
  );

  await t.test("404 responses include correlation header", async () => {
    const res = await fetch(`${baseUrl}/non-existent-endpoint`);
    assert.equal(res.status, 404);

    const correlationId = res.headers.get("x-correlation-id");
    assert.ok(correlationId, "404 responses must include correlation ID");
  });
});
