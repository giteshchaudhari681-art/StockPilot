import { PrismaClient } from "@prisma/client";
import { config } from "../config/index.js";
import { logger } from "../logger.js";

/**
 * Options for configuring the Prisma Client instance.
 */
export interface PrismaClientOptions {
  datasources?: {
    db?: {
      url?: string;
    };
  };
  log?: Array<"query" | "info" | "warn" | "error">;
}

/**
 * Module-scoped singleton instance of PrismaClient.
 */
let prismaInstance: PrismaClient | null = null;

/**
 * Connection tracking state for the lifecycle manager.
 */
let isConnected = false;

/**
 * Factory function to create a new PrismaClient instance configured with application settings.
 * Does not establish a network connection until $connect() is called or a query is executed.
 *
 * @param customOptions Optional override options (primarily for testing)
 * @returns Configured PrismaClient instance
 */
export function createPrismaClient(
  customOptions?: PrismaClientOptions,
): PrismaClient {
  const isDevelopment = config.isDevelopment;
  const isProduction = config.isProduction;

  const defaultLogLevels: Array<"query" | "info" | "warn" | "error"> =
    isDevelopment ? ["warn", "error"] : isProduction ? ["error"] : ["error"];

  return new PrismaClient({
    datasources: {
      db: {
        url: customOptions?.datasources?.db?.url ?? config.database.url,
      },
    },
    log: customOptions?.log ?? defaultLogLevels,
  });
}

/**
 * Returns the application-owned singleton PrismaClient instance.
 * Initializes the client instance lazily upon first access.
 *
 * @returns Singleton PrismaClient instance
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
  }
  return prismaInstance;
}

/**
 * Checks whether the database connection has been established.
 *
 * @returns True if connected, false otherwise
 */
export function isDatabaseConnected(): boolean {
  return isConnected;
}

/**
 * Establishes a connection to the PostgreSQL database using Prisma Client.
 * Safe to call multiple times (idempotent when already connected).
 *
 * @param client Optional PrismaClient instance to connect (defaults to singleton)
 */
export async function connectDatabase(
  client: PrismaClient = getPrismaClient(),
): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    await client.$connect();
    isConnected = true;
    logger.info("PostgreSQL database connection established successfully.");
  } catch (error) {
    isConnected = false;
    logger.error(
      { err: error },
      "Failed to establish PostgreSQL database connection.",
    );
    throw error;
  }
}

/**
 * Gracefully disconnects the database client and releases connection resources.
 * Safe to call even if the client has not established a connection.
 *
 * @param client Optional PrismaClient instance to disconnect (defaults to singleton)
 */
export async function disconnectDatabase(
  client: PrismaClient = getPrismaClient(),
): Promise<void> {
  if (!isConnected && !prismaInstance) {
    return;
  }

  try {
    await client.$disconnect();
    isConnected = false;
    logger.info("PostgreSQL database connection closed.");
  } catch (error) {
    logger.error(
      { err: error },
      "Error disconnecting from PostgreSQL database.",
    );
    throw error;
  }
}

/**
 * Resets the singleton instance and connection state.
 * Primarily intended for test suites to ensure clean test isolation.
 */
export function resetPrismaClient(): void {
  prismaInstance = null;
  isConnected = false;
}

/**
 * Canonical application database client singleton.
 * Uses a lazy Proxy so that accessing properties forwards to the singleton instance
 * without eager construction at import time.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
