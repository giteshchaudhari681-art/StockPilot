import pino, { type LoggerOptions as PinoLoggerOptions } from "pino";

import {
  DEFAULT_LOG_LEVEL,
  DEFAULT_REDACT_KEYS,
  VALID_LOG_LEVELS,
} from "./constants.js";
import { serializeError } from "./serializers.js";
import type { Logger, LoggerOptions, LogLevel } from "./types.js";

/**
 * Creates and initializes a configured StockPilot Logger instance.
 *
 * Provides structured JSON logs in production, detailed debug logging in development,
 * automatic redaction of sensitive credentials and secrets, and child logger support
 * for request/operation correlation.
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const nodeEnv = options.nodeEnv || process.env["NODE_ENV"] || "development";
  const rawLevel = options.level;

  let level: LogLevel = DEFAULT_LOG_LEVEL;
  if (rawLevel && VALID_LOG_LEVELS.includes(rawLevel)) {
    level = rawLevel;
  } else if (nodeEnv === "development") {
    level = "debug";
  }

  const redactPaths = Array.from(
    new Set([...DEFAULT_REDACT_KEYS, ...(options.redact || [])]),
  );

  const pinoOptions: PinoLoggerOptions = {
    name: options.name || "stockpilot",
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    redact: {
      paths: redactPaths,
      censor: "[REDACTED]",
    },
    serializers: {
      err: (err) => serializeError(err, nodeEnv !== "production"),
      error: (err) => serializeError(err, nodeEnv !== "production"),
    },
  };

  const pinoInstance = options.destination
    ? pino(pinoOptions, options.destination)
    : pino(pinoOptions);

  return pinoInstance as unknown as Logger;
}
