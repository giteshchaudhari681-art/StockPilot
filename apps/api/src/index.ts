import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { Server } from "http";

function startServer() {
  try {
    const app = createApp();
    const { port, host, nodeEnv } = config;

    const server: Server = app.listen(port, host, () => {
      console.log(`[Backend] Server listening at http://${host}:${port}`);
      console.log(`[Backend] Environment: ${nodeEnv}`);
    });

    // Graceful shutdown handling
    const shutdown = (signal: string) => {
      console.log(
        `\n[Backend] Received ${signal}. Shutting down gracefully...`,
      );
      server.close(() => {
        console.log("[Backend] HTTP server closed.");
        process.exit(0);
      });

      // Force shutdown if it takes too long
      setTimeout(() => {
        console.error("[Backend] Forced shutdown due to timeout.");
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("[Backend] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
