import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[Error Boundary Caught Unhandled Exception]:", err);

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
