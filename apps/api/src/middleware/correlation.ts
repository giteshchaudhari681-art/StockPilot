import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { Request, Response, NextFunction } from "express";
import type { Logger } from "@stockpilot/shared";
import { logger } from "../logger.js";

// Augment Express Request interface with correlation properties
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      log: Logger;
    }
  }
}

export interface CorrelationContext {
  correlationId: string;
}

const correlationStorage = new AsyncLocalStorage<CorrelationContext>();

/**
 * Retrieves the current request correlation identifier from asynchronous context.
 */
export function getCorrelationId(): string | undefined {
  return correlationStorage.getStore()?.correlationId;
}

// Allowed correlation ID pattern: alphanumeric, hyphen, underscore, 1 to 64 chars
const CORRELATION_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

/**
 * Request correlation middleware.
 *
 * Validates or generates a correlation ID for every incoming HTTP request,
 * binds it to asynchronous execution context and a request-scoped child logger,
 * and sets the X-Correlation-ID response header.
 */
export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const incomingId =
    (req.headers["x-correlation-id"] as string | undefined) ||
    (req.headers["x-request-id"] as string | undefined);

  let correlationId: string;

  if (incomingId && CORRELATION_ID_REGEX.test(incomingId)) {
    correlationId = incomingId;
  } else {
    correlationId = randomUUID();
  }

  // Set response header
  res.setHeader("X-Correlation-ID", correlationId);

  // Attach to request object
  req.correlationId = correlationId;
  req.log = logger.child({ correlationId });

  // Run downstream handlers inside the AsyncLocalStorage context
  correlationStorage.run({ correlationId }, () => {
    next();
  });
}
