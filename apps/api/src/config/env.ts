import type { LogLevel } from "@stockpilot/shared";
import { VALID_LOG_LEVELS } from "@stockpilot/shared";

export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  host: string;
  logLevel: LogLevel;
}

export function validateEnv(): AppConfig {
  const nodeEnv = process.env["NODE_ENV"] || "development";
  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error(
      `Invalid NODE_ENV: must be 'development', 'test', or 'production'. Received: ${nodeEnv}`,
    );
  }

  const portStr = process.env["PORT"] || "4000";
  const port = parseInt(portStr, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid PORT: must be a positive integer between 1 and 65535. Received: ${portStr}`,
    );
  }

  const host = process.env["HOST"] || "0.0.0.0";
  if (typeof host !== "string" || host.trim() === "") {
    throw new Error(
      `Invalid HOST: must be a non-empty string. Received: ${host}`,
    );
  }

  const defaultLogLevel: LogLevel =
    nodeEnv === "development" ? "debug" : "info";
  const rawLogLevel = process.env["LOG_LEVEL"];
  let logLevel: LogLevel = defaultLogLevel;

  if (rawLogLevel) {
    if (!VALID_LOG_LEVELS.includes(rawLogLevel as LogLevel)) {
      throw new Error(
        `Invalid LOG_LEVEL: must be one of ${VALID_LOG_LEVELS.join(", ")}. Received: ${rawLogLevel}`,
      );
    }
    logLevel = rawLogLevel as LogLevel;
  }

  return {
    nodeEnv: nodeEnv as "development" | "test" | "production",
    port,
    host,
    logLevel,
  };
}

// Export a singleton config instance initialized at startup
export const config = validateEnv();
