import type { LogLevel } from "@stockpilot/shared";

export type Environment = "development" | "test" | "production";

export interface ServerConfig {
  nodeEnv: Environment;
  port: number;
  host: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

export interface LogConfig {
  level: LogLevel;
}

export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
}

export interface AppMetadataConfig {
  name: string;
  version: string;
}

/**
 * Canonical centralized application configuration schema.
 */
export interface AppConfig {
  server: ServerConfig;
  logging: LogConfig;
  cors: CorsConfig;
  metadata: AppMetadataConfig;

  // Flattened convenience accessors preserving backward compatibility
  nodeEnv: Environment;
  port: number;
  host: string;
  logLevel: LogLevel;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

/**
 * Raw dictionary interface representing incoming environment variables.
 * Decouples parsing logic from global process.env for deterministic unit testing.
 */
export type RawEnvironment = Record<string, string | undefined>;
