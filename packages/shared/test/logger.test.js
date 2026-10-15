import test from "node:test";
import assert from "node:assert/strict";

import {
  createLogger,
  DEFAULT_LOG_LEVEL,
  VALID_LOG_LEVELS,
  LOG_LEVEL_SEVERITY,
  serializeError,
} from "../dist/index.js";

test("Logging Foundation", async (t) => {
  await t.test("exports valid log levels and severity mapping", () => {
    assert.equal(DEFAULT_LOG_LEVEL, "info");
    assert.deepEqual(VALID_LOG_LEVELS, [
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ]);
    assert.equal(LOG_LEVEL_SEVERITY.fatal, 60);
    assert.equal(LOG_LEVEL_SEVERITY.error, 50);
    assert.equal(LOG_LEVEL_SEVERITY.warn, 40);
    assert.equal(LOG_LEVEL_SEVERITY.info, 30);
    assert.equal(LOG_LEVEL_SEVERITY.debug, 20);
    assert.equal(LOG_LEVEL_SEVERITY.trace, 10);
  });

  await t.test("creates logger with default level", () => {
    const logger = createLogger({
      name: "test-service",
      nodeEnv: "production",
    });
    assert.equal(logger.level, "info");
  });

  await t.test("creates logger with explicit custom level", () => {
    const logger = createLogger({
      name: "test-service",
      level: "warn",
      nodeEnv: "production",
    });
    assert.equal(logger.level, "warn");
  });

  await t.test("falls back to default level on invalid level", () => {
    // @ts-expect-error testing invalid level handling
    const logger = createLogger({
      level: "invalid-level",
      nodeEnv: "production",
    });
    assert.equal(logger.level, "info");
  });

  await t.test("defaults to debug level in development environment", () => {
    const logger = createLogger({ nodeEnv: "development" });
    assert.equal(logger.level, "debug");
  });

  await t.test("emits valid structured JSON logs with standard fields", () => {
    const chunks = [];
    const destination = {
      write(chunk) {
        chunks.push(chunk);
      },
    };

    const logger = createLogger({
      name: "json-test",
      level: "info",
      nodeEnv: "production",
      destination,
    });

    logger.info({ operationId: "op-123" }, "Operation started");

    assert.equal(chunks.length, 1);
    const parsed = JSON.parse(chunks[0]);

    assert.equal(parsed.name, "json-test");
    assert.equal(parsed.level, "info");
    assert.equal(parsed.operationId, "op-123");
    assert.equal(parsed.msg, "Operation started");
    assert.ok(parsed.time, "Timestamp should be present");
  });

  await t.test("redacts sensitive keys automatically", () => {
    const chunks = [];
    const destination = {
      write(chunk) {
        chunks.push(chunk);
      },
    };

    const logger = createLogger({
      name: "redact-test",
      level: "info",
      nodeEnv: "production",
      destination,
    });

    logger.info(
      {
        user: "admin",
        password: "super-secret-password",
        token: "jwt-token-12345",
        apiKey: "api-key-999",
        safeMeta: "public-value",
      },
      "Authentication event",
    );

    assert.equal(chunks.length, 1);
    const parsed = JSON.parse(chunks[0]);

    assert.equal(parsed.user, "admin");
    assert.equal(parsed.password, "[REDACTED]");
    assert.equal(parsed.token, "[REDACTED]");
    assert.equal(parsed.apiKey, "[REDACTED]");
    assert.equal(parsed.safeMeta, "public-value");
  });

  await t.test("child logger binds contextual correlation metadata", () => {
    const chunks = [];
    const destination = {
      write(chunk) {
        chunks.push(chunk);
      },
    };

    const parent = createLogger({
      name: "parent-service",
      level: "info",
      nodeEnv: "production",
      destination,
    });

    const child = parent.child({
      correlationId: "corr-uuid-777",
      module: "inventory",
    });
    child.info("Processing inventory update");

    assert.equal(chunks.length, 1);
    const parsed = JSON.parse(chunks[0]);

    assert.equal(parsed.correlationId, "corr-uuid-777");
    assert.equal(parsed.module, "inventory");
    assert.equal(parsed.msg, "Processing inventory update");
  });

  await t.test(
    "safely serializes Error objects without circular failure",
    () => {
      const err = new Error("Database timeout");
      // @ts-expect-error adding custom code
      err.code = "ETIMEDOUT";

      const serialized = serializeError(err, true);

      assert.equal(serialized.type, "Error");
      assert.equal(serialized.message, "Database timeout");
      assert.equal(serialized.code, "ETIMEDOUT");
      assert.ok(serialized.stack, "Stack should be present when requested");

      const nonError = serializeError("simple string error");
      assert.equal(nonError, "simple string error");
    },
  );
});
