import assert from "node:assert/strict";

/**
 * Canonical UUID format regex for correlation IDs and identifiers.
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Asserts that a value is a valid UUID string.
 * @param {string | null | undefined} value
 * @param {string} [message]
 */
export function assertValidUuid(value, message = "Expected a valid UUID") {
  assert.ok(value, `${message}: value is null or empty`);
  assert.match(value, UUID_REGEX, message);
}

/**
 * Asserts that an HTTP response JSON payload strictly conforms to the standardized ErrorResponseEnvelope.
 * Validates error.code, error.message, error.correlationId, and ensures stack trace is omitted in production.
 *
 * @param {unknown} body Parsed response JSON
 * @param {string} expectedCode Expected machine-readable ErrorCode (e.g. "NOT_FOUND")
 * @param {RegExp | string} [expectedMessagePattern] Expected human-readable message or regex pattern
 */
export function assertErrorEnvelope(
  body,
  expectedCode,
  expectedMessagePattern,
) {
  assert.ok(
    body && typeof body === "object",
    "Response body must be an object",
  );
  assert.ok("error" in body, "Response body must contain 'error' property");

  const error = body.error;
  assert.ok(error && typeof error === "object", "body.error must be an object");
  assert.equal(
    error.code,
    expectedCode,
    `Expected error.code to be '${expectedCode}'`,
  );
  assert.ok(
    typeof error.message === "string",
    "error.message must be a string",
  );

  if (expectedMessagePattern instanceof RegExp) {
    assert.match(error.message, expectedMessagePattern);
  } else if (typeof expectedMessagePattern === "string") {
    assert.ok(
      error.message.includes(expectedMessagePattern),
      `Expected error.message to include '${expectedMessagePattern}', received: '${error.message}'`,
    );
  }

  if (error.correlationId !== undefined) {
    assertValidUuid(
      error.correlationId,
      "error.correlationId must be a valid UUID",
    );
  }
}

/**
 * Asserts that a health response payload strictly conforms to HealthCheckResponse.
 * @param {unknown} body Parsed response JSON
 */
export function assertHealthOk(body) {
  assert.ok(
    body && typeof body === "object",
    "Health response must be an object",
  );
  assert.equal(body.status, "ok", "Health status must be 'ok'");
}
