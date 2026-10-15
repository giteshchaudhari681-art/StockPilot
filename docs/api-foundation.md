# StockPilot — API Foundation & Versioned Routing

**Document:** `docs/api-foundation.md`  
**PR:** PR 08 — API Foundation  
**Status:** Implemented  
**Classification:** Foundational Architecture Specification

---

## 1. Overview

The StockPilot API foundation establishes a versioned, structured, and resilient HTTP routing architecture for the `apps/api` service. It separates application bootstrap from routing composition, provides deterministic versioned entry points, standardizes error responses, and preserves complete backward compatibility with existing operational endpoints.

---

## 2. Architecture & Router Composition

The routing hierarchy uses hierarchical Express routers to ensure strict modularity:

```text
Express Application (createApp)
├── Foundational Middleware
│   ├── correlationMiddleware (X-Correlation-ID)
│   ├── requestLogger (Pino structured logging)
│   └── express.json() (Body parser)
│
├── Root / Health Routes
│   └── /health -> healthRouter (Status 200 OK)
│
├── Versioned API Router (/api -> createApiRouter)
│   ├── /v1 -> createApiV1Router
│   │   ├── GET / -> Version 1 API Metadata
│   │   ├── /health -> healthRouter (Status 200 OK)
│   │   └── * -> 404 NotFoundError (Standardized Error Envelope)
│   └── * -> 404 NotFoundError (Standardized Error Envelope)
│
├── Root Fallback (Non-API Routes)
│   └── * -> 404 { error: "Not Found" }
│
└── Global Error Boundary
    └── errorHandler (mapErrorToHttpResponse)
```

### Module Responsibilities

1. **`apps/api/src/routes/v1/index.ts` (`createApiV1Router`)**:
   - Represents the version 1 API tree (`/api/v1`).
   - Mounts resource routers (e.g., `healthRouter`).
   - Handles unmatched `/api/v1/*` routes by throwing a standardized `NotFoundError`.
   - Supports optional sub-router injection for modular domain composition and testing.

2. **`apps/api/src/routes/index.ts` (`createApiRouter`)**:
   - Primary API composition layer mounted at `/api`.
   - Mounts versioned sub-routers (`/v1`).
   - Handles unmatched `/api/*` routes (e.g., unsupported API versions like `/api/v2`).

3. **`apps/api/src/app.ts` (`createApp`)**:
   - Assembles middleware pipeline, root operational endpoints, and the API router.
   - Preserves legacy root `/health` for container orchestration and load balancers.
   - Provides a non-API 404 handler for root paths.
   - Mounts the global `errorHandler`.

---

## 3. HTTP Contracts

### 3.1 Health Check Endpoints

Both legacy root and versioned API paths are supported:

- `GET /health`
- `GET /api/v1/health`

**Response (`200 OK`):**

```json
{
  "status": "ok"
}
```

### 3.2 Version 1 Root Metadata

- `GET /api/v1`

**Response (`200 OK`):**

```json
{
  "name": "StockPilot API",
  "version": "v1",
  "status": "active"
}
```

### 3.3 Standardized API Error Envelope

All unmatched API routes (`/api/v1/*`, `/api/*`) and route-level failures return the standardized `ErrorResponseEnvelope`:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "API route not found: GET /api/v1/non-existent",
    "correlationId": "8b97a14c-526a-489b-8924-06d6f4c0ef55"
  }
}
```

#### Production Security Rules

- Internal stack traces are **never** returned in `production` mode.
- Unhandled server exceptions (`500`) mask raw internal error messages and return a generic `"Internal Server Error"` to API consumers while logging full diagnostics server-side.

---

## 4. Verification & Testing

Run all API foundation integration tests:

```bash
node --test apps/api/test/api-foundation.test.js
```

Run full monorepo validation:

```bash
npm run typecheck
npm test
npm run build
```
