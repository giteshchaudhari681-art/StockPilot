/**
 * Logging severity levels supported by the StockPilot logging foundation.
 * Follows RFC 5424 and standard Pino/Syslog log level ordering.
 */
export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

/**
 * Standard log function signature supporting both message-first and context-first calls.
 */
export interface LogFn {
  (msg: string, ...args: unknown[]): void;
  (obj: Record<string, unknown>, msg?: string, ...args: unknown[]): void;
}

/**
 * Standard Logger interface providing uniform logging operations across applications.
 */
export interface Logger {
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  child(bindings: Record<string, unknown>): Logger;
  level: LogLevel;
}

/**
 * Configuration options for initializing a Logger instance.
 */
export interface LoggerOptions {
  /**
   * Name of the application or service component emitting logs.
   * Default: "stockpilot"
   */
  name?: string;

  /**
   * Minimum severity level to emit. Logs below this level are discarded.
   * Default: "info" in production, "debug" in development.
   */
  level?: LogLevel;

  /**
   * Execution environment ("development", "test", "production").
   * Controls output formatting (human-readable vs structured JSON).
   */
  nodeEnv?: string;

  /**
   * Keys to automatically redact from log output to prevent secret leakage.
   */
  redact?: string[];

  /**
   * Optional custom destination stream (primarily for testing and specialized transports).
   */
  destination?: { write(chunk: string): void };
}
