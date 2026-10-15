import { createLogger, type Logger } from "@stockpilot/shared";
import { config } from "./config/env.js";

/**
 * Centralized backend logger instance for the StockPilot API service.
 */
export const logger: Logger = createLogger({
  name: "stockpilot-api",
  level: config.logLevel,
  nodeEnv: config.nodeEnv,
});
