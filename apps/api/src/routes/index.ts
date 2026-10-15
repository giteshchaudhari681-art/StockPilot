import { Router, Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/index.js";
import { createApiV1Router } from "./v1/index.js";

/**
 * Creates the primary API router mounted at /api.
 * Composes versioned API routers (/v1, etc.) and provides a boundary for API-level routes.
 *
 * @param customV1Routes Optional router for extending v1 routes during testing or composition
 */
export function createApiRouter(customV1Routes?: Router): Router {
  const apiRouter = Router();

  // Mount versioned API routes
  apiRouter.use("/v1", createApiV1Router(customV1Routes));

  // Catch-all for unmatched /api/* routes (e.g. /api/v2/foo, /api/unknown)
  apiRouter.use((req: Request, _res: Response, next: NextFunction) => {
    next(
      new NotFoundError(
        `API route not found: ${req.method} ${req.originalUrl || req.url}`,
      ),
    );
  });

  return apiRouter;
}

export { healthRouter } from "./health.js";
export { createApiV1Router } from "./v1/index.js";
