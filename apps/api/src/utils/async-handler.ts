import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an asynchronous Express route handler or middleware,
 * catching any rejected Promise and forwarding the error to next().
 * Prevents unhandled promise rejections in Express 4 applications.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
