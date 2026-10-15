import test from "node:test";
import assert from "node:assert/strict";
import express from "express";

import { correlationMiddleware } from "../dist/middleware/correlation.js";
import { errorHandler } from "../dist/middleware/error-handler.js";
import { asyncHandler } from "../dist/utils/async-handler.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../dist/errors/http-errors.js";
import {
  DomainError,
  InfrastructureError,
  ErrorCode,
} from "@stockpilot/shared";
import { createApp } from "../dist/app.js";
import { mapErrorToHttpResponse } from "../dist/errors/http-mapping.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("Error Architecture and HTTP Boundary Integration", async (t) => {
  // Build test Express server with correlation middleware, test error routes, and global error handler
  const testApp = express();
  testApp.use(correlationMiddleware);
  testApp.use(express.json());

  testApp.get("/test/bad-request", (_req, _res, next) => {
    next(
      new BadRequestError({
        message: "Invalid query parameter 'limit'",
        details: { limit: "-1" },
      }),
    );
  });

  testApp.get("/test/domain-error", (_req, _res, next) => {
    next(
      new DomainError({
        message: "SKU quantity cannot be reserved below safety threshold",
        details: { sku: "WIDGET-01", threshold: 10, requested: 15 },
      }),
    );
  });

  testApp.get("/test/infra-error", (_req, _res, next) => {
    const rawCause = new Error("Connection reset by peer: 10.0.0.4:5432");
    next(
      new InfrastructureError({
        message: "Primary PostgreSQL cluster unreachable",
        cause: rawCause,
      }),
    );
  });

  testApp.get("/test/unexpected-error", (_req, _res, next) => {
    next(new Error("Unexpected null pointer in payment token generation"));
  });

  testApp.get(
    "/test/async-rejection",
    asyncHandler(async (_req, _res) => {
      await Promise.resolve();
      throw new ConflictError("Concurrent modification conflict during commit");
    }),
  );

  testApp.get("/test/headers-sent", (_req, res, next) => {
    res.status(200).write("Partially sent");
    next(new Error("Error occurred after headers committed"));
  });

  testApp.use(errorHandler);

  let server;
  let baseUrl;

  await new Promise((resolve) => {
    server = testApp.listen(0, "127.0.0.1", () => {
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
    "operational BadRequestError maps to 400 with standardized envelope",
    async () => {
      const res = await fetch(`${baseUrl}/test/bad-request`);
      assert.equal(res.status, 400);

      const correlationId = res.headers.get("x-correlation-id");
      assert.ok(correlationId);

      const body = await res.json();
      assert.ok(body.error, "Response must contain 'error' object");
      assert.equal(body.error.code, ErrorCode.BAD_REQUEST);
      assert.equal(body.error.message, "Invalid query parameter 'limit'");
      assert.equal(body.error.correlationId, correlationId);
      assert.deepEqual(body.error.details, { limit: "-1" });
    },
  );

  await t.test(
    "DomainError maps to 422 with DOMAIN_RULE_VIOLATION and details",
    async () => {
      const res = await fetch(`${baseUrl}/test/domain-error`);
      assert.equal(res.status, 422);

      const body = await res.json();
      assert.equal(body.error.code, ErrorCode.DOMAIN_RULE_VIOLATION);
      assert.equal(
        body.error.message,
        "SKU quantity cannot be reserved below safety threshold",
      );
      assert.deepEqual(body.error.details, {
        sku: "WIDGET-01",
        threshold: 10,
        requested: 15,
      });
      assert.ok(body.error.correlationId);
    },
  );

  await t.test(
    "InfrastructureError maps to 503 and protects sensitive server details",
    async () => {
      const res = await fetch(`${baseUrl}/test/infra-error`);
      assert.equal(res.status, 503);

      const body = await res.json();
      assert.equal(body.error.code, ErrorCode.INFRASTRUCTURE_ERROR);
      // Must not expose the internal message containing IP address and DB details
      assert.equal(body.error.message, "A service dependency failure occurred");
      assert.equal(body.error.details, undefined);
    },
  );

  await t.test(
    "unexpected Error returns generic 500 without leaking message",
    async () => {
      const res = await fetch(`${baseUrl}/test/unexpected-error`);
      assert.equal(res.status, 500);

      const body = await res.json();
      assert.equal(body.error.code, ErrorCode.INTERNAL_ERROR);
      // Raw error message containing "payment token" must be suppressed
      assert.equal(body.error.message, "Internal Server Error");
      assert.ok(body.error.correlationId);
    },
  );

  await t.test(
    "mapErrorToHttpResponse omits stack trace in production and includes in development",
    () => {
      const sensitiveError = new Error("Database password secret leaked!");
      const prodResult = mapErrorToHttpResponse(
        sensitiveError,
        "trace-123",
        "production",
      );
      assert.equal(prodResult.statusCode, 500);
      assert.equal(
        prodResult.responseBody.error.message,
        "Internal Server Error",
      );
      assert.equal(prodResult.responseBody.error.stack, undefined);
      assert.equal(prodResult.responseBody.error.correlationId, "trace-123");

      const devResult = mapErrorToHttpResponse(
        sensitiveError,
        "trace-123",
        "development",
      );
      assert.equal(devResult.statusCode, 500);
      assert.ok(
        devResult.responseBody.error.stack,
        "Stack must be present in development",
      );
    },
  );

  await t.test(
    "asyncHandler catches Promise rejections and forwards to boundary",
    async () => {
      const res = await fetch(`${baseUrl}/test/async-rejection`);
      assert.equal(res.status, 409);

      const body = await res.json();
      assert.equal(body.error.code, ErrorCode.CONFLICT);
      assert.equal(
        body.error.message,
        "Concurrent modification conflict during commit",
      );
    },
  );

  await t.test(
    "malformed JSON request payload returns 400 BAD_REQUEST",
    async () => {
      const res = await fetch(`${baseUrl}/test/bad-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed json",
      });
      assert.equal(res.status, 400);

      const body = await res.json();
      assert.equal(body.error.code, ErrorCode.BAD_REQUEST);
      assert.equal(
        body.error.message,
        "Malformed JSON payload in request body",
      );
    },
  );

  await t.test(
    "existing createApp() health and 404 behavior remains intact",
    async () => {
      const prodApp = createApp();
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
        const healthRes = await fetch(`${prodBaseUrl}/health`);
        assert.equal(healthRes.status, 200);
        const healthData = await healthRes.json();
        assert.equal(healthData.status, "ok");

        const notFoundRes = await fetch(`${prodBaseUrl}/unmatched-path`);
        assert.equal(notFoundRes.status, 404);
        const notFoundData = await notFoundRes.json();
        assert.equal(notFoundData.error, "Not Found");
      } finally {
        if (prodServer) {
          prodServer.close();
        }
      }
    },
  );
});
