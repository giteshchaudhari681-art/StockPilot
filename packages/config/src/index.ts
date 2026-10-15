/**
 * @stockpilot/config
 * Centralized configuration contracts and utilities for the StockPilot monorepo.
 */

export type Environment = "development" | "test" | "production";

export interface BaseEnvironmentConfig {
  NODE_ENV?: Environment;
  PORT?: string;
  HOST?: string;
  LOG_LEVEL?: string;
}
