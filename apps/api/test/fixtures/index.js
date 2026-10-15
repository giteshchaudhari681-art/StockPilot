/**
 * Deterministic test fixtures and builders for StockPilot backend test suites.
 */

export const TEST_CONSTANTS = Object.freeze({
  MOCK_CORRELATION_ID: "12345678-1234-4234-8234-123456789abc",
  DEFAULT_PORT: 4000,
  DEFAULT_HOST: "127.0.0.1",
  DEFAULT_LOG_LEVEL: "error",
  APP_NAME: "StockPilot",
  APP_VERSION: "0.1.0",
});

/**
 * Creates a deterministic, complete, and frozen AppConfig fixture for tests.
 * Avoids reading or mutating process.env.
 *
 * @param {Record<string, unknown>} [overrides] Optional configuration overrides
 * @returns {import("../../src/config/types.js").AppConfig}
 */
export function createTestAppConfig(overrides = {}) {
  const nodeEnv = overrides.nodeEnv || "test";
  const port =
    overrides.port !== undefined
      ? Number(overrides.port)
      : TEST_CONSTANTS.DEFAULT_PORT;
  const host = overrides.host || TEST_CONSTANTS.DEFAULT_HOST;
  const logLevel = overrides.logLevel || TEST_CONSTANTS.DEFAULT_LOG_LEVEL;
  const isProduction = nodeEnv === "production";
  const isDevelopment = nodeEnv === "development";
  const isTest = nodeEnv === "test";

  const config = {
    server: Object.freeze({
      nodeEnv,
      port,
      host,
      isProduction,
      isDevelopment,
      isTest,
    }),
    logging: Object.freeze({
      level: logLevel,
    }),
    cors: Object.freeze({
      origin: overrides.corsOrigin || "http://localhost:3000",
      credentials: true,
    }),
    metadata: Object.freeze({
      name: TEST_CONSTANTS.APP_NAME,
      version: TEST_CONSTANTS.APP_VERSION,
    }),

    // Flattened convenience accessors
    nodeEnv,
    port,
    host,
    logLevel,
    isProduction,
    isDevelopment,
    isTest,
  };

  return Object.freeze(config);
}

/**
 * Creates a standard ErrorResponseEnvelope fixture for testing error consumers.
 *
 * @param {string} code Machine-readable error code (e.g. "NOT_FOUND")
 * @param {string} message Human-readable error message
 * @param {string} [correlationId] Request correlation UUID
 * @param {Record<string, unknown>} [details] Additional diagnostic details
 */
export function createTestErrorEnvelope(
  code = "BAD_REQUEST",
  message = "Invalid test request",
  correlationId = TEST_CONSTANTS.MOCK_CORRELATION_ID,
  details = undefined,
) {
  return {
    error: {
      code,
      message,
      ...(correlationId ? { correlationId } : {}),
      ...(details ? { details } : {}),
    },
  };
}
