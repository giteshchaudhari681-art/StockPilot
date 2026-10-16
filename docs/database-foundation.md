# StockPilot — Prisma & Database Foundation

**Document:** `database-foundation.md`  
**Roadmap Reference:** PR 11 — Prisma Foundation (Datasource, Client Lifecycle & Database Module)  
**Status:** Approved & Implemented  
**Date:** 2026-10-16

---

## 1. Overview & Role of Prisma

StockPilot is a production-grade inventory intelligence and stock-management platform requiring deterministic relational data integrity. Prisma ORM serves as the database schema management layer, migration orchestrator, and type-safe query engine for the platform.

In alignment with Master Execution Protocol v3.0 and the locked 100-PR roadmap, PR 11 establishes the architectural foundation for Prisma and PostgreSQL connectivity without prematurely implementing business entities, domain models, or seed data (reserved for PR 12–PR 30).

---

## 2. Architecture & Technology Stack

| Component               | Selected Technology | Version                    | Location / Purpose                         |
| :---------------------- | :------------------ | :------------------------- | :----------------------------------------- |
| **ORM / Query Engine**  | Prisma Client       | `^6.19.3`                  | `@prisma/client` in `apps/api`             |
| **CLI & Tooling**       | Prisma CLI          | `^6.19.3`                  | `devDependencies` in `apps/api`            |
| **Database Provider**   | PostgreSQL          | 14+ (Local: PostgreSQL 18) | Standard relational datasource             |
| **Runtime Environment** | Node.js (ESM)       | `>=20.0.0` (LTS)           | `type: module` architecture                |
| **Schema Location**     | Root Schema         | `prisma/schema.prisma`     | Single source of truth for database schema |
| **Database Module**     | Backend DB Layer    | `apps/api/src/db/`         | Singleton client, lifecycle & factory      |

---

## 3. Schema Foundation & Scope Isolation

The Prisma schema is located at `prisma/schema.prisma`. In accordance with strict roadmap sequencing, PR 11 establishes only the datasource and client generator:

```prisma
// StockPilot Master Database Schema
// Datasource: PostgreSQL
// ORM: Prisma
// PR 11 — Prisma Foundation (Datasource and Generator Configuration)
// Domain entities (User, Product, Warehouse, Order, etc.) are established incrementally in PR 12–PR 19

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Intentionally Deferred Functionality:

- **PR 12:** Core Database Schema (Users, Roles, Authentication entities).
- **PR 13:** Warehouse & Inventory Schema.
- **PR 14:** Inventory Movement Schema.
- **PR 15:** Transfer & Reservation Schema.
- **PR 16:** Supplier Schema.
- **PR 17:** Order Schema.
- **PR 18:** Intelligence Schema (Forecasts, Anomalies, Risks, Recommendations).
- **PR 19:** Audit Schema.
- **PR 20–PR 30:** Database Integrity, Validation, Resets, Backups, and Seeds.

---

## 4. Configuration Integration & Secret Protection

Database connection strings are managed through the centralized configuration architecture established in PR 07 (`apps/api/src/config/`).

1. **Environment Variable:** `DATABASE_URL` represents the PostgreSQL connection URL.
2. **Fail-Fast in Production:** In `NODE_ENV=production`, `DATABASE_URL` is mandatory. Failure to provide it halts the application immediately with a `ConfigurationError`.
3. **Deterministic Dev/Test Defaults:**
   - Development default: `postgresql://postgres:postgres@localhost:5432/stockpilot_dev`
   - Test default: `postgresql://postgres:postgres@127.0.0.1:5432/stockpilot_test`
4. **Secret Redaction:** Configuration errors automatically mark `DATABASE_URL` with `isSensitive: true`, ensuring that malformed URLs or invalid connection strings are formatted as `[REDACTED]` in error messages and log outputs.
5. **Logger Masking:** PR 05 structured logging automatically masks `databaseUrl` and `DATABASE_URL` keys from structured logs.

---

## 5. Database Client Module & Lifecycle Management

The database client module is located at `apps/api/src/db/` and provides:

### 5.1 Import Contract

```typescript
import {
  prisma,
  getPrismaClient,
  createPrismaClient,
  connectDatabase,
  disconnectDatabase,
  isDatabaseConnected,
  resetPrismaClient,
} from "./db/index.js";
```

### 5.2 Singleton Pattern & Lazy Initialization

- `getPrismaClient()` lazily constructs and memoizes a single `PrismaClient` instance configured with `config.database.url` and environment-aware logging.
- `prisma` is a Proxy export that delegates property access to `getPrismaClient()`. This guarantees zero side effects upon module import while providing full TypeScript type inference and IDE completion.
- `createPrismaClient(options)` allows constructing isolated instances for testing.

### 5.3 Connection & Graceful Disconnection

- **Lazy Connection:** Prisma Client connects lazily upon the first executed query, ensuring tests and bootstrap do not fail when a local PostgreSQL daemon is absent.
- **Explicit Connection:** `connectDatabase()` allows eager connection verification when required.
- **Graceful Shutdown:** `apps/api/src/index.ts` invokes `disconnectDatabase()` during `SIGINT` and `SIGTERM` signals, releasing connection pools before the HTTP server terminates.

---

## 6. Verification & Operational Commands

### Generate Prisma Client

Generates TypeScript types and runtime client to `node_modules/@prisma/client`:

```bash
npm run prisma:generate
```

### Validate Schema

Validates syntax and configuration of `prisma/schema.prisma`:

```bash
npm run prisma:validate
```

### Execute Tests

Runs backend unit tests including database foundation and configuration tests:

```bash
npm run test:unit -w @stockpilot/api
```

### Full Monorepo Validation

```bash
npm run typecheck
npm run build
npm test
```

---

## 7. PostgreSQL Connectivity Status

- **Prisma Client Generation:** Verified and functional (`✔ Generated Prisma Client v6.19.3`).
- **Prisma Schema Validation:** Verified and passing against PostgreSQL provider.
- **Unit & Lifecycle Tests:** 100% passing (in-memory mock and isolated tests).
- **PostgreSQL Connectivity:** `NOT RUN — no verified test database credentials configured`. A local PostgreSQL 18 service was detected running on Windows port 5432; however, adhering to security protocol, live credentials were not guessed, altered, or required for automated quality gates.
