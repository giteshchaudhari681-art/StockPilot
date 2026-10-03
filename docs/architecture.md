# StockPilot — Architecture

**Document:** `docs/architecture.md`
**PR:** 01 — Repository & Engineering Foundation
**Status:** Living document — updated as PRs progress

---

## Overview

StockPilot is a production-grade inventory intelligence and operations platform built as an **npm workspace monorepo**.

The architecture separates concerns into distinct layers with enforced dependency boundaries.

---

## High-Level Diagram

```
                        StockPilot
                             │
               ┌─────────────┴─────────────┐
               │                           │
           Frontend                    Backend
          apps/web                    apps/api
      (React / Next.js)           (Node.js / Express)
               │                           │
               └─────────────┬─────────────┘
                             │
                    Shared Packages
                             │
               ┌─────────────┼─────────────┐
               │             │             │
           shared       validation       config
      (shared types)   (schemas)    (configuration)
                             │
                           Prisma
                             │
                        PostgreSQL
                             │
                  (Redis — cache & queues)
```

---

## Layer Responsibilities

### `apps/api` — Backend API

- Express application (PR 02)
- REST API endpoints (PR 08)
- Authentication & authorization (PR 12+)
- Business domain logic
- Database access via Prisma
- Background jobs via Redis/BullMQ

**Must not:** import from `apps/web`. May import from all `packages/*`.

---

### `apps/web` — Frontend

- React / Next.js application (PR 03)
- User interface
- Authentication UI
- Dashboards and analytics views
- Real-time updates

**Must not:** import from `apps/api`. May import from all `packages/*`.

---

### `packages/shared` — Shared Types & Contracts

- TypeScript interfaces shared between api and web
- Shared constants
- DTO contracts

**Must not:** contain business logic. No framework dependencies.

---

### `packages/validation` — Shared Validation

- Shared Zod schemas (or equivalent)
- Request/response validation schemas used by both api and web

**Must not:** contain database logic or application code.

---

### `packages/config` — Configuration Infrastructure

- Centralized environment variable access
- Configuration schemas and validators
- Configuration types

**Must not:** contain application business logic.

---

### `prisma/` — Database Schema

- Prisma schema definition (`schema.prisma`)
- Migration history (`migrations/`)

Owned exclusively by the database layer. Accessed only by `apps/api`.

**Implementation:** PR 11 — Prisma Foundation

---

### `database/` — Database Tooling

- Operational scripts: validation, reset, backup
- Seed data

**Must not:** be imported as a package. These are CLI scripts only.

---

## Dependency Direction

```
apps/web      →  packages/shared
apps/web      →  packages/validation
apps/web      →  packages/config

apps/api      →  packages/shared
apps/api      →  packages/validation
apps/api      →  packages/config
apps/api      →  prisma (via @prisma/client)

packages/*    →  (no cross-package imports at this stage)
```

Dependencies flow **downward** only. No upward imports. No circular dependencies.

---

## Infrastructure

| Service    | Technology       | Purpose                  | PR      |
|------------|------------------|--------------------------|---------|
| Database   | PostgreSQL 16    | Operational data store   | PR 11   |
| Cache      | Redis 7          | Caching, queues          | PR 02+  |
| API        | Express + Node   | REST API                 | PR 02   |
| Web        | Next.js / React  | Frontend                 | PR 03   |
| Container  | Docker Compose   | Local dev infrastructure | PR 01   |

---

## Development Philosophy

StockPilot is built through a controlled **100-PR architecture roadmap**.

Each PR has a single, bounded responsibility. PRs must not implement functionality belonging to other PRs.

This ensures:
- Every feature is independently reviewable
- Architecture drift is prevented
- Each PR can be tested in isolation
- Complexity is introduced gradually and intentionally

---

## Current Status

> **PR 01 — Repository & Engineering Foundation**

Monorepo structure, workspace configuration, TypeScript foundation, Git conventions, and Docker infrastructure are established.

Application implementation begins at PR 02.
