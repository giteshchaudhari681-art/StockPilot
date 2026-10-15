import test from "node:test";
import assert from "node:assert/strict";

import {
  AppError,
  DomainError,
  InfrastructureError,
  ErrorCode,
} from "../dist/index.js";

test("Error Architecture Foundation - Unit Tests", async (t) => {
  await t.test("ErrorCode constants are frozen and distinct strings", () => {
    assert.equal(typeof ErrorCode, "object");
    assert.equal(ErrorCode.INTERNAL_ERROR, "INTERNAL_ERROR");
    assert.equal(ErrorCode.BAD_REQUEST, "BAD_REQUEST");
    assert.equal(ErrorCode.NOT_FOUND, "NOT_FOUND");
    assert.equal(ErrorCode.DOMAIN_RULE_VIOLATION, "DOMAIN_RULE_VIOLATION");
    assert.equal(ErrorCode.INFRASTRUCTURE_ERROR, "INFRASTRUCTURE_ERROR");

    // Ensure all values are non-empty unique strings
    const values = Object.values(ErrorCode);
    const uniqueValues = new Set(values);
    assert.equal(
      values.length,
      uniqueValues.size,
      "Error codes must be unique",
    );
  });

  await t.test("AppError initializes with default values", () => {
    const err = new AppError({ message: "Default error occurred" });

    assert.ok(err instanceof Error);
    assert.ok(err instanceof AppError);
    assert.equal(err.name, "AppError");
    assert.equal(err.message, "Default error occurred");
    assert.equal(err.code, ErrorCode.INTERNAL_ERROR);
    assert.equal(err.statusCode, 500);
    assert.equal(err.isOperational, true);
    assert.equal(err.clientMessage, "Internal Server Error");
    assert.equal(err.details, undefined);
    assert.ok(err.stack, "Stack trace must be captured");
  });

  await t.test(
    "AppError sets custom code, status, clientMessage, and details",
    () => {
      const err = new AppError({
        message: "Internal diagnostic message for logs",
        code: ErrorCode.VALIDATION_ERROR,
        statusCode: 400,
        clientMessage: "Invalid input fields",
        isOperational: true,
        details: { field: "email", reason: "Invalid format" },
      });

      assert.equal(err.name, "AppError");
      assert.equal(err.message, "Internal diagnostic message for logs");
      assert.equal(err.code, ErrorCode.VALIDATION_ERROR);
      assert.equal(err.statusCode, 400);
      assert.equal(err.isOperational, true);
      assert.equal(err.clientMessage, "Invalid input fields");
      assert.deepEqual(err.details, {
        field: "email",
        reason: "Invalid format",
      });
    },
  );

  await t.test("AppError preserves native Error cause", () => {
    const originalError = new Error("Database socket closed unexpectedly");
    const appErr = new AppError({
      message: "Data access failed",
      code: ErrorCode.DATABASE_ERROR,
      statusCode: 500,
      cause: originalError,
    });

    assert.equal(appErr.cause, originalError);
    assert.equal(appErr.cause.message, "Database socket closed unexpectedly");
  });

  await t.test("DomainError defaults to 422 and operational", () => {
    const domainErr = new DomainError({
      message: "Cannot reserve inventory for discontinued SKU",
      details: { sku: "SKU-999" },
    });

    assert.ok(domainErr instanceof Error);
    assert.ok(domainErr instanceof AppError);
    assert.ok(domainErr instanceof DomainError);
    assert.equal(domainErr.name, "DomainError");
    assert.equal(
      domainErr.message,
      "Cannot reserve inventory for discontinued SKU",
    );
    assert.equal(domainErr.code, ErrorCode.DOMAIN_RULE_VIOLATION);
    assert.equal(domainErr.statusCode, 422);
    assert.equal(domainErr.isOperational, true);
    assert.equal(
      domainErr.clientMessage,
      "Cannot reserve inventory for discontinued SKU",
    );
    assert.deepEqual(domainErr.details, { sku: "SKU-999" });
  });

  await t.test("DomainError accepts simple string constructor", () => {
    const domainErr = new DomainError("Order quantity exceeds available quota");

    assert.equal(domainErr.message, "Order quantity exceeds available quota");
    assert.equal(domainErr.code, ErrorCode.DOMAIN_RULE_VIOLATION);
    assert.equal(domainErr.statusCode, 422);
    assert.equal(domainErr.isOperational, true);
    assert.equal(
      domainErr.clientMessage,
      "Order quantity exceeds available quota",
    );
  });

  await t.test(
    "InfrastructureError defaults to 503 and non-operational",
    () => {
      const dbCause = new Error("Connection refused: 127.0.0.1:5432");
      const infraErr = new InfrastructureError({
        message: "Failed to connect to primary PostgreSQL replica",
        code: ErrorCode.SERVICE_UNAVAILABLE,
        cause: dbCause,
      });

      assert.ok(infraErr instanceof Error);
      assert.ok(infraErr instanceof AppError);
      assert.ok(infraErr instanceof InfrastructureError);
      assert.equal(infraErr.name, "InfrastructureError");
      assert.equal(
        infraErr.message,
        "Failed to connect to primary PostgreSQL replica",
      );
      assert.equal(infraErr.code, ErrorCode.SERVICE_UNAVAILABLE);
      assert.equal(infraErr.statusCode, 503);
      assert.equal(infraErr.isOperational, false);
      // Client message must not expose the sensitive connection string or port
      assert.equal(
        infraErr.clientMessage,
        "A service dependency failure occurred",
      );
      assert.equal(infraErr.cause, dbCause);
    },
  );

  await t.test("InfrastructureError accepts simple string constructor", () => {
    const infraErr = new InfrastructureError("Redis cluster unreachable");

    assert.equal(infraErr.message, "Redis cluster unreachable");
    assert.equal(infraErr.code, ErrorCode.INFRASTRUCTURE_ERROR);
    assert.equal(infraErr.statusCode, 503);
    assert.equal(infraErr.isOperational, false);
    assert.equal(
      infraErr.clientMessage,
      "A service dependency failure occurred",
    );
  });
});
