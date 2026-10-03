import express, { Application, Request, Response, NextFunction } from "express";
import { healthRouter } from "./routes/health.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp(): Application {
  const app = express();

  // Middleware
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
