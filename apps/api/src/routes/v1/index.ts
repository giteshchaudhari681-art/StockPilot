import { Router, Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../errors/index.js";
import { healthRouter } from "../health.js";

/**
 * Creates and configures the version 1 API router (/api/v1).
 * Mounts domain routers and enforces structured error handling for unmatched routes.
 *
 * @param customRoutes Optional router for extending v1 routes during testing or composition
 */
export function createApiV1Router(customRoutes?: Router): Router {
  const router = Router();

  // Version 1 Root Metadata / Health
  router.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      name: "StockPilot API",
      version: "v1",
      status: "active",
    });
  });

  // Mount versioned sub-routers
  router.use("/health", healthRouter);

  // Mount any domain or test sub-routers
  if (customRoutes) {
    router.use(customRoutes);
  }

  // Catch-all for unmatched /api/v1/* routes -> raises standardized NotFoundError
  router.use((req: Request, _res: Response, next: NextFunction) => {
    next(
      new NotFoundError(
        `API route not found: ${req.method} ${req.originalUrl || req.url}`,
      ),
    );
  });

  return router;
}
