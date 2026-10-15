/**
 * Canonical machine-readable error codes for the StockPilot platform.
 * Provides stable identifiers for application, domain, and infrastructure failures.
 */
export const ErrorCode = {
  // General & Unexpected Errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",

  // Client & Input Errors
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",

  // Domain & Business Rule Errors
  DOMAIN_ERROR: "DOMAIN_ERROR",
  DOMAIN_RULE_VIOLATION: "DOMAIN_RULE_VIOLATION",
  DOMAIN_INVARIANT_VIOLATION: "DOMAIN_INVARIANT_VIOLATION",
  INVALID_STATE_TRANSITION: "INVALID_STATE_TRANSITION",

  // Infrastructure & Technical Errors
  INFRASTRUCTURE_ERROR: "INFRASTRUCTURE_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  TIMEOUT: "TIMEOUT",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
