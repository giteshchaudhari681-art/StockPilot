import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";

import { logger } from "../logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const log = req.log || logger;
  log.error({ err }, "Unhandled exception caught by error boundary");

  const statusCode = 500;
  const errorResponse: Record<string, unknown> = {
    error: "Internal Server Error",
  };

  // Expose stack trace only in development
  if (config.nodeEnv === "development") {
    errorResponse["message"] = err.message;
    errorResponse["stack"] = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}
