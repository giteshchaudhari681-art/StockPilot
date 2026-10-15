import express, { Application, Request, Response, NextFunction } from "express";
import { correlationMiddleware } from "./middleware/correlation.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { healthRouter } from "./routes/health.js";

export function createApp(): Application {
  const app = express();

  // Foundational middleware
  app.use(correlationMiddleware);
  app.use(requestLogger);
  app.use(express.json());

  // Routes
  app.use("/health", healthRouter);

  // 404 handler for unknown routes
  app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global Error Boundary
  app.use(errorHandler);

  return app;
}
