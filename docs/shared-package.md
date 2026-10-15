# StockPilot — Shared Package Foundation

**Document:** `docs/shared-package.md`  
**PR:** 04 — Shared Package Foundation

---

## 1. Overview and Purpose

`packages/shared` (`@stockpilot/shared`) is the canonical shared package for the StockPilot monorepo. It provides domain-independent TypeScript types, contracts, and constants shared across application boundaries without coupling applications to each other or leaking framework/business-domain concerns.

---

## 2. Package Responsibilities

The shared package is responsible for:

- **Domain-independent utility types**: Generic primitives such as `Nullable<T>`, `Optional<T>`, `EntityId`, `ISODateString`, and `Timestamped`.
- **Generic pagination contracts**: Common parameters and metadata structures (`PaginationParams`, `PaginationMeta`, `PaginatedResult<T>`) and runtime defaults (`PAGINATION_DEFAULTS`).
- **Generic sorting contracts**: Standard sort direction types (`SortDirection`, `SortParams<TField>`) and runtime constants (`SORT_ORDER`).
- **Service health contracts**: Service status types (`HealthStatus`, `HealthCheckResponse`) and constants (`HEALTH_STATUS`).
- **Application metadata constants**: Baseline application descriptors (`APP_METADATA`).
- **Strict compilation**: Emitting ESM JavaScript and TypeScript declaration files (`.d.ts`) into `dist/`.

---

## 3. Explicitly Excluded Responsibilities

To preserve strict architectural boundaries, `packages/shared` **must not** contain:

- Domain business models (Product, Warehouse, Inventory, Supplier, Order, Customer, etc. — reserved for PR 41–PR 66).
- Database entities, Prisma types, or database client instances (reserved for PR 11–PR 30).
- Authentication or authorization logic/tokens (reserved for PR 31–PR 40).
- Error architecture, error classes, or HTTP status abstractions (reserved for PR 06).
- Configuration loading, environment variables, or secrets (reserved for PR 07).
- Logging infrastructure (reserved for PR 05).
- Framework-specific code (Express, React, Vite) or browser/DOM-specific APIs.
- API routing or endpoint handlers.

---

## 4. Public Exports

All public symbols are exported through the canonical package entry point `packages/shared/src/index.ts`:

### Constants

| Constant Export       | Type / Value                                                     | Description                                 |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| `APP_METADATA`        | `{ NAME: "StockPilot", VERSION: "0.1.0" }`                       | Application identity and version metadata.  |
| `PAGINATION_DEFAULTS` | `{ DEFAULT_PAGE: 1, DEFAULT_PAGE_SIZE: 25, MAX_PAGE_SIZE: 100 }` | Standard pagination query/display defaults. |
| `SORT_ORDER`          | `{ ASC: "asc", DESC: "desc" }`                                   | Standard sort direction constants.          |
| `HEALTH_STATUS`       | `{ OK: "ok", DEGRADED: "degraded", DOWN: "down" }`               | Health check operational status constants.  |

### Types and Contracts

| Type Export           | Category   | Description                                            |
| --------------------- | ---------- | ------------------------------------------------------ |
| `Nullable<T>`         | Common     | Represents `T \| null`.                                |
| `Optional<T>`         | Common     | Represents `T \| undefined`.                           |
| `EntityId`            | Common     | Generic entity identifier type (`string`).             |
| `ISODateString`       | Common     | ISO-8601 formatted date-time string.                   |
| `Timestamped`         | Common     | Interface requiring `createdAt` and `updatedAt`.       |
| `PaginationParams`    | Pagination | Optional `page` and `pageSize` parameters.             |
| `PaginationMeta`      | Pagination | Pagination response metadata (`page`, `total`, etc.).  |
| `PaginatedResult<T>`  | Pagination | Generic container wrapping `data: T[]` and pagination. |
| `SortDirection`       | Sorting    | Union type `"asc" \| "desc"`.                          |
| `SortParams<TField>`  | Sorting    | Generic sorting parameters specifying field and order. |
| `HealthStatus`        | Health     | Union type `"ok" \| "degraded" \| "down"`.             |
| `HealthCheckResponse` | Health     | Operational health check response contract.            |

---

## 5. Architectural Boundaries and Dependency Direction

```
apps/web ──────────┐
                   ├──► packages/shared
apps/api ──────────┘
```

1. **Apps may import `@stockpilot/shared`**.
2. **`packages/shared` must never import from `apps/api` or `apps/web`**.
3. **`packages/shared` has zero runtime external dependencies**.
4. Packages in the monorepo must maintain unidirectional dependency flow with zero circular imports.

---

## 6. Import Conventions

Consumers import public symbols directly from `@stockpilot/shared` following the repository import ordering conventions:

```typescript
// 1. Node built-ins
import { createServer } from "node:http";

// 2. External dependencies
import express from "express";

// 3. Workspace packages
import {
  HEALTH_STATUS,
  type HealthCheckResponse,
  type PaginatedResult,
} from "@stockpilot/shared";

// 4. Local imports
import { config } from "./config/env.js";
```

---

## 7. Naming Conventions

- **Constants**: Upper snake case with `as const` assertions (`APP_METADATA`, `SORT_ORDER`).
- **Interfaces / Contracts**: PascalCase (`PaginationParams`, `PaginatedResult<T>`).
- **Type Aliases**: PascalCase (`Nullable<T>`, `HealthStatus`).

---

## 8. Development and Validation Commands

Run commands from the repository root:

```bash
# Build the package (compiles to dist/)
npm run build -w @stockpilot/shared

# Typecheck the package
npm run typecheck -w @stockpilot/shared

# Lint the package
npm run lint -w @stockpilot/shared

# Check code formatting
npm run format:check -w @stockpilot/shared

# Run unit tests
npm run test -w @stockpilot/shared

# Clean build output
npm run clean -w @stockpilot/shared
```

---

## 9. Constraints for Future PRs

1. Do not add business domain types to `packages/shared` prior to their planned PRs.
2. Maintain zero runtime dependencies unless an RFC justifies an external dependency.
3. Every new public export must be exported through `src/index.ts` and tested.
4. When domain-specific schemas are needed (e.g. Zod validators), place them in `packages/validation/` rather than `packages/shared/`.
