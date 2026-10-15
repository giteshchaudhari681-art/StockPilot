import type { LogLevel } from "./types.js";

/**
 * Default log level used when no level is explicitly configured.
 */
export const DEFAULT_LOG_LEVEL: LogLevel = "info";

/**
 * Valid supported log levels in strict order of descending severity.
 */
export const VALID_LOG_LEVELS: readonly LogLevel[] = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

/**
 * Numeric severity values for log levels matching RFC 5424 and Pino standards.
 */
export const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
} as const;

/**
 * Default keys automatically redacted from structured logs to protect credentials,
 * secrets, tokens, and sensitive headers.
 */
export const DEFAULT_REDACT_KEYS: readonly string[] = [
  "password",
  "passwordHash",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "jwtSecret",
  "apiKey",
  "api_key",
  "authorization",
  "cookie",
  "set-cookie",
  "creditCard",
  "databaseUrl",
  "DATABASE_URL",
  "*.password",
  "*.token",
  "*.secret",
  "*.authorization",
  "req.headers.authorization",
  "req.headers.cookie",
] as const;
