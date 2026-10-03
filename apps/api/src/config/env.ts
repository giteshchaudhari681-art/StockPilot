export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  host: string;
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

  return {
    nodeEnv: nodeEnv as "development" | "test" | "production",
    port,
    host,
  };
}

// Export a singleton config instance initialized at startup
export const config = validateEnv();
