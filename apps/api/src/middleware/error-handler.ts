import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";
import { mapErrorToHttpResponse } from "../errors/http-mapping.js";
import { logger } from "../logger.js";

/**
 * Global Express error handling middleware.
 *
 * Catches all errors propagated through next(err), maps them to safe,
 * standardized JSON error envelopes, logs diagnostic context using Pino,
 * and delegates to Express default handler if response headers are already committed.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // If headers have already been sent to client, delegate to built-in Express error handler
  if (res.headersSent) {
    next(err);
    return;
  }

  const log = req.log || logger;
  const correlationId = req.correlationId;
  const currentEnv = req.app?.get("env") || config.nodeEnv;
  const { statusCode, responseBody, logLevel } = mapErrorToHttpResponse(
    err,
    correlationId,
    currentEnv,
  );

  const errorMetadata = {
    err,
    statusCode,
    code: responseBody.error.code,
    correlationId,
  };

  if (logLevel === "warn") {
    const msg = err instanceof Error ? err.message : "Operational client error";
    log.warn(errorMetadata, `Operational request failure: ${msg}`);
  } else {
    log.error(errorMetadata, "Unhandled exception caught by error boundary");
  }

  res.status(statusCode).json(responseBody);
}
