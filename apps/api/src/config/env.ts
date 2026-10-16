import type { LogLevel } from "@stockpilot/shared";
import { APP_METADATA, VALID_LOG_LEVELS } from "@stockpilot/shared";
import { ConfigurationError, type ConfigurationIssue } from "./error.js";
import type { AppConfig, Environment, RawEnvironment } from "./types.js";

/**
 * Attempts to load environment variables from local .env file using Node's native loader
 * if present and running in non-production mode.
 */
export function tryLoadLocalEnvFile(): void {
  const currentEnv = process.env["NODE_ENV"];
  if (
    currentEnv !== "production" &&
    currentEnv !== "test" &&
    typeof process.loadEnvFile === "function"
  ) {
    try {
      process.loadEnvFile();
    } catch {
      // Gracefully ignore when .env file is absent (e.g. in container or CI runners)
    }
  }
}

/**
 * Parses and strictly validates raw environment variables into a frozen, typed AppConfig object.
 * Accumulates all configuration issues and throws a detailed ConfigurationError on failure.
 *
 * @param env Raw key-value dictionary of environment variables (defaults to process.env)
 * @returns Fully typed, immutable application configuration
 */
export function validateEnv(env: RawEnvironment = process.env): AppConfig {
  const issues: ConfigurationIssue[] = [];

  // 1. NODE_ENV validation
  const rawNodeEnv = env["NODE_ENV"];
  const nodeEnv: Environment = (rawNodeEnv || "development") as Environment;
  const allowedEnvs: Environment[] = ["development", "test", "production"];

  if (rawNodeEnv !== undefined && !allowedEnvs.includes(nodeEnv)) {
    issues.push({
      variable: "NODE_ENV",
      reason: `must be one of: ${allowedEnvs.join(", ")}`,
      received: rawNodeEnv,
    });
  }

  // 2. PORT validation
  const defaultPort = 4000;
  const rawPort = env["PORT"];
  let port = defaultPort;

  if (rawPort !== undefined && rawPort.trim() !== "") {
    const parsedPort = Number(rawPort);
    if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
      issues.push({
        variable: "PORT",
        reason: "must be an integer between 1 and 65535",
        received: rawPort,
      });
    } else {
      port = parsedPort;
    }
  }

  // 3. HOST validation
  const rawHost = env["HOST"];
  let host = nodeEnv === "test" ? "127.0.0.1" : "0.0.0.0";

  if (rawHost !== undefined) {
    if (rawHost.trim() === "") {
      issues.push({
        variable: "HOST",
        reason: "must be a non-empty string when defined",
        received: rawHost,
      });
    } else {
      host = rawHost.trim();
    }
  }

  // 4. LOG_LEVEL validation
  const defaultLogLevel: LogLevel =
    nodeEnv === "development" ? "debug" : nodeEnv === "test" ? "error" : "info";
  const rawLogLevel = env["LOG_LEVEL"];
  let logLevel: LogLevel = defaultLogLevel;

  if (rawLogLevel !== undefined && rawLogLevel.trim() !== "") {
    if (!VALID_LOG_LEVELS.includes(rawLogLevel as LogLevel)) {
      issues.push({
        variable: "LOG_LEVEL",
        reason: `must be one of: ${VALID_LOG_LEVELS.join(", ")}`,
        received: rawLogLevel,
      });
    } else {
      logLevel = rawLogLevel as LogLevel;
    }
  }

  // 5. CORS_ORIGIN validation
  const rawCorsOrigin = env["CORS_ORIGIN"];
  let corsOrigin: string | string[] = "http://localhost:3000";

  if (rawCorsOrigin !== undefined && rawCorsOrigin.trim() !== "") {
    corsOrigin = rawCorsOrigin.includes(",")
      ? rawCorsOrigin.split(",").map((s) => s.trim())
      : rawCorsOrigin.trim();
  }

  // 6. DATABASE_URL validation
  const isProduction = nodeEnv === "production";
  const isDevelopment = nodeEnv === "development";
  const isTest = nodeEnv === "test";

  const rawDatabaseUrl = env["DATABASE_URL"];
  let databaseUrl: string;

  if (rawDatabaseUrl !== undefined) {
    const trimmedUrl = rawDatabaseUrl.trim();
    if (trimmedUrl === "") {
      issues.push({
        variable: "DATABASE_URL",
        reason: "must be a non-empty string when defined",
        isSensitive: true,
      });
      databaseUrl = "";
    } else {
      try {
        const parsed = new URL(trimmedUrl);
        if (
          parsed.protocol !== "postgresql:" &&
          parsed.protocol !== "postgres:"
        ) {
          issues.push({
            variable: "DATABASE_URL",
            reason: "must use postgresql:// or postgres:// protocol",
            isSensitive: true,
          });
        }
      } catch {
        issues.push({
          variable: "DATABASE_URL",
          reason: "must be a valid PostgreSQL connection URL",
          isSensitive: true,
        });
      }
      databaseUrl = trimmedUrl;
    }
  } else if (isProduction) {
    issues.push({
      variable: "DATABASE_URL",
      reason: "is required in production environment",
      isSensitive: true,
    });
    databaseUrl = "";
  } else if (isTest) {
    databaseUrl =
      "postgresql://postgres:postgres@127.0.0.1:5432/stockpilot_test";
  } else {
    databaseUrl =
      "postgresql://postgres:postgres@localhost:5432/stockpilot_dev";
  }

  // If any configuration issues were found, halt immediately with aggregated diagnostic error
  if (issues.length > 0) {
    throw new ConfigurationError(issues);
  }

  const config: AppConfig = {
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
      origin: corsOrigin,
      credentials: true,
    }),
    metadata: Object.freeze({
      name: APP_METADATA.NAME,
      version: APP_METADATA.VERSION,
    }),
    database: Object.freeze({
      url: databaseUrl,
    }),

    // Flattened convenience accessors
    nodeEnv,
    port,
    host,
    logLevel,
    databaseUrl,
    isProduction,
    isDevelopment,
    isTest,
  };

  return Object.freeze(config);
}

/**
 * Loads and initializes the application configuration singleton.
 */
export function loadConfig(): AppConfig {
  tryLoadLocalEnvFile();
  return validateEnv(process.env);
}

// Export singleton config instance initialized at startup
export const config: AppConfig = loadConfig();
