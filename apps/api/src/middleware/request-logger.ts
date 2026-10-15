import { Request, Response, NextFunction } from "express";

/**
 * HTTP request logging middleware.
 * Records request start and completion with response status code and execution duration.
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  const { method, originalUrl } = req;
  const log = req.log || req.app.get("logger");

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    const { statusCode } = res;

    const logMeta = {
      method,
      url: originalUrl,
      statusCode,
      durationMs,
    };

    if (statusCode >= 500) {
      log.error(
        logMeta,
        `HTTP ${method} ${originalUrl} ${statusCode} - ${durationMs}ms`,
      );
    } else if (statusCode >= 400) {
      log.warn(
        logMeta,
        `HTTP ${method} ${originalUrl} ${statusCode} - ${durationMs}ms`,
      );
    } else {
      log.info(
        logMeta,
        `HTTP ${method} ${originalUrl} ${statusCode} - ${durationMs}ms`,
      );
    }
  });

  next();
}
