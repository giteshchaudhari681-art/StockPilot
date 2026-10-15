import test from "node:test";
import assert from "node:assert/strict";
import { Router } from "express";
import { createApp } from "../dist/app.js";
import { createApiRouter } from "../dist/routes/index.js";
import { BadRequestError, ConflictError } from "../dist/errors/index.js";
import { asyncHandler } from "../dist/utils/async-handler.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("API Foundation, Versioned Routing & HTTP Contract - Integration Tests", async (t) => {
  let app;
  let server;
  let baseUrl;

  t.before(async () => {
    // Build test router with known error scenarios to verify API error propagation
    const testV1Routes = Router();

    testV1Routes.get(
      "/test-errors/known-bad-request",
      asyncHandler(async () => {
        throw new BadRequestError("Missing required inventory SKU filter");
      }),
    );

    testV1Routes.get(
      "/test-errors/known-conflict",
      asyncHandler(async () => {
        throw new ConflictError("Warehouse code already exists");
      }),
    );

    testV1Routes.get(
      "/test-errors/unexpected-throw",
      asyncHandler(async () => {
        throw new Error("Internal secret connection string failure");
      }),
    );

    const testApiRouter = createApiRouter(testV1Routes);
    app = createApp(testApiRouter);

    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  t.after(async () => {
    await new Promise((resolve) => {
      if (server) {
        server.close(resolve);
      } else {
        resolve();
      }
    });
  });

  await t.test(
    "Test A1: GET /health returns 200 OK with legacy contract",
    async () => {
      const res = await fetch(`${baseUrl}/health`);
      assert.equal(res.status, 200);
      assert.equal(
        res.headers.get("content-type")?.includes("application/json"),
        true,
      );

      const data = await res.json();
      assert.equal(data.status, "ok");

      const correlationId = res.headers.get("x-correlation-id");
      assert.match(correlationId ?? "", UUID_REGEX);
    },
  );

  await t.test(
    "Test A2: GET /api/v1/health returns 200 OK through versioned API router",
    async () => {
      const res = await fetch(`${baseUrl}/api/v1/health`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.status, "ok");

      const correlationId = res.headers.get("x-correlation-id");
      assert.match(correlationId ?? "", UUID_REGEX);
    },
  );

  await t.test(
    "Test A3: GET /api/v1 returns version 1 API metadata",
    async () => {
      const res = await fetch(`${baseUrl}/api/v1`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.name, "StockPilot API");
      assert.equal(data.version, "v1");
      assert.equal(data.status, "active");
    },
  );

  await t.test(
    "Test B1: GET /api/v1/unknown-route returns 404 with standardized ErrorResponseEnvelope",
    async () => {
      const res = await fetch(`${baseUrl}/api/v1/non-existent-subpath`);
      assert.equal(res.status, 404);

      const data = await res.json();
      assert.ok(data.error, "Must contain root error object");
      assert.equal(data.error.code, "NOT_FOUND");
      assert.match(data.error.message, /API route not found/);
      assert.match(data.error.correlationId, UUID_REGEX);
    },
  );

  await t.test(
    "Test B2: GET /api/v2/unsupported returns 404 with standardized ErrorResponseEnvelope",
    async () => {
      const res = await fetch(`${baseUrl}/api/v2/products`);
      assert.equal(res.status, 404);

      const data = await res.json();
      assert.ok(data.error);
      assert.equal(data.error.code, "NOT_FOUND");
      assert.match(data.error.message, /API route not found/);
    },
  );

  await t.test(
    "Test C1: Known BadRequestError in API route returns 400 and preserves clientMessage",
    async () => {
      const res = await fetch(
        `${baseUrl}/api/v1/test-errors/known-bad-request`,
      );
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.equal(data.error.code, "BAD_REQUEST");
      assert.equal(data.error.message, "Missing required inventory SKU filter");
      assert.match(data.error.correlationId, UUID_REGEX);
    },
  );

  await t.test(
    "Test C2: Known ConflictError in API route returns 409 with proper envelope",
    async () => {
      const res = await fetch(`${baseUrl}/api/v1/test-errors/known-conflict`);
      assert.equal(res.status, 409);

      const data = await res.json();
      assert.equal(data.error.code, "CONFLICT");
      assert.equal(data.error.message, "Warehouse code already exists");
    },
  );

  await t.test(
    "Test D: Unexpected server error in API route masks message and stack in production",
    async () => {
      const origEnv = process.env["NODE_ENV"];
      process.env["NODE_ENV"] = "production";

      try {
        const prodV1Routes = Router();
        prodV1Routes.get(
          "/test-errors/unexpected-throw",
          asyncHandler(async () => {
            throw new Error(
              "FATAL: leaked db credentials postgres://user:pass@10.0.0.1",
            );
          }),
        );

        const prodApiRouter = createApiRouter(prodV1Routes);
        const prodApp = createApp(prodApiRouter);
        prodApp.set("env", "production");

        let prodServer;
        let prodBaseUrl;

        await new Promise((resolve) => {
          prodServer = prodApp.listen(0, "127.0.0.1", () => {
            const address = prodServer.address();
            const port =
              typeof address === "object" && address ? address.port : 0;
            prodBaseUrl = `http://127.0.0.1:${port}`;
            resolve();
          });
        });

        try {
          const res = await fetch(
            `${prodBaseUrl}/api/v1/test-errors/unexpected-throw`,
          );
          assert.equal(res.status, 500);

          const data = await res.json();
          assert.equal(data.error.code, "INTERNAL_ERROR");
          assert.equal(data.error.message, "Internal Server Error");
          assert.equal(
            data.error.message.includes("leaked db credentials"),
            false,
            "Internal database credentials must never leak into client error response",
          );
          assert.equal(
            data.error.stack,
            undefined,
            "Stack trace must be strictly undefined in production",
          );
        } finally {
          prodServer.close();
        }
      } finally {
        process.env["NODE_ENV"] = origEnv;
      }
    },
  );

  await t.test(
    "Test E: Correlation ID propagation across custom headers",
    async () => {
      const customId = "trace-client-api-test-12345";
      const res = await fetch(`${baseUrl}/api/v1/health`, {
        headers: {
          "X-Correlation-ID": customId,
        },
      });

      assert.equal(res.status, 200);
      assert.equal(res.headers.get("x-correlation-id"), customId);
    },
  );

  await t.test(
    "Test F: Application import safety - createApp does not listen on import",
    () => {
      const instance = createApp();
      assert.ok(instance, "createApp must return an application instance");
      assert.equal(
        typeof instance.listen,
        "function",
        "Instance must provide standard listen method",
      );
    },
  );

  await t.test(
    "Test G: Non-API unmatched paths preserve legacy 404 response shape",
    async () => {
      const res = await fetch(`${baseUrl}/non-api-unmatched-route`);
      assert.equal(res.status, 404);

      const data = await res.json();
      assert.equal(data.error, "Not Found");
    },
  );
});
