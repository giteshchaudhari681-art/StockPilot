import { Server } from "http";
import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { disconnectDatabase } from "./db/index.js";
import { logger } from "./logger.js";

function startServer() {
  try {
    const app = createApp();
    const { port, host, nodeEnv, logLevel } = config;

    const server: Server = app.listen(port, host, () => {
      logger.info(
        { host, port, nodeEnv, logLevel },
        `Server listening at http://${host}:${port}`,
      );
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(
        { signal },
        `Received ${signal}. Shutting down gracefully...`,
      );

      try {
        await disconnectDatabase();
      } catch (dbErr) {
        logger.error(
          { err: dbErr },
          "Error disconnecting database during shutdown",
        );
      }

      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });

      // Force shutdown if it takes too long
      setTimeout(() => {
        logger.fatal("Forced shutdown due to timeout.");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

startServer();
