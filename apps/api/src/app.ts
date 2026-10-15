import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import { correlationMiddleware } from "./middleware/correlation.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { healthRouter, createApiRouter } from "./routes/index.js";

/**
 * Creates and configures the Express application instance.
 *
 * @param apiRouter Optional custom router mounted at /api for testing or custom composition
 */
export function createApp(apiRouter?: Router): Application {
  const app = express();

  // Foundational middleware
  app.use(correlationMiddleware);
  app.use(requestLogger);
  app.use(express.json());

  // Root health check for orchestrators / load balancers
  app.use("/health", healthRouter);

  // Versioned API foundation router (/api/v1/...)
  app.use("/api", apiRouter || createApiRouter());

  // 404 handler for unknown non-API routes (preserves legacy root error format)
  app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global Error Boundary
  app.use(errorHandler);

  return app;
}
