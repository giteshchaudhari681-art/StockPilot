# StockPilot — Repository Structure

**Document:** `docs/repository-structure.md`
**PR:** 01 — Repository & Engineering Foundation
**Status:** Living document — updated as PRs progress

---

## Purpose

This document defines what each directory in the repository owns, what it must not own, and where future code belongs.

It exists to prevent architecture drift as the project grows through 100 PRs.

---

## Top-Level Structure

```
StockPilot/
│
├── apps/                   # Deployable applications
│   ├── api/                # Backend API (Express + Node.js)
│   └── web/                # Frontend (React / Next.js)
│
├── packages/               # Shared library packages (npm workspaces)
│   ├── shared/             # Shared types, constants, contracts
│   ├── validation/         # Shared validation schemas
│   └── config/             # Centralized configuration
│
├── prisma/                 # Prisma ORM — schema and migrations
│   ├── schema.prisma       # Database schema definition
│   └── migrations/         # Migration history
│
├── database/               # Database operational tooling (CLI scripts only)
│   ├── scripts/            # validate.ts, reset.ts, backup.ts
│   └── seeds/              # Seed data scripts
│
├── docs/                   # Project documentation
│
├── scripts/                # Root-level development scripts
│
├── .github/                # GitHub configuration
│   └── pull_request_template.md
│
├── .editorconfig           # Editor configuration
├── .env.example            # Environment variable template
├── .gitattributes          # Git line-ending rules
├── .gitignore              # Git ignore rules
├── .nvmrc                  # Node.js version pin
├── docker-compose.yml      # Local development infrastructure
├── package.json            # Root workspace configuration
├── tsconfig.json           # Root TypeScript configuration
└── README.md               # Project readme
```

---

## Directory Ownership Rules

### `apps/api/`

**Owns:**
- Express application bootstrap
- REST API route handlers
- Authentication and authorization logic
- Business domain services and repositories
- Database access (via `@prisma/client`)
- Background job definitions (BullMQ)

**Must not own:**
- UI components
- Frontend state
- Direct database schema definitions (that's `prisma/`)
- Shared types used by both api and web (that's `packages/shared/`)

**Implemented:** PR 02

---

### `apps/web/`

**Owns:**
- React/Next.js application
- UI components and pages
- Frontend routing
- Client-side state management
- Authentication UI
- API client layer

**Must not own:**
- Server-side business logic
- Database access
- Shared types used by both api and web (that's `packages/shared/`)

**Implemented:** PR 03

---

### `packages/shared/`

**Owns:**
- TypeScript interfaces and types shared across apps
- Shared constants
- DTO contracts

**Must not own:**
- Framework-specific code (React, Express)
- Database models or Prisma types
- Business logic
- API request handlers

**Implemented:** PR 04

---

### `packages/validation/`

**Owns:**
- Shared validation schemas (Zod or equivalent)
- Input/output validation types

**Must not own:**
- Database logic
- Application routing
- Framework-specific middleware

**Implemented:** PR 04

---

### `packages/config/`

**Owns:**
- Environment variable access and validation
- Configuration types and schemas
- Configuration loading logic

**Must not own:**
- Business logic
- Database models
- Application code

**Implemented:** PR 07

---

### `prisma/`

**Owns:**
- `schema.prisma` — the single source of truth for the database schema
- `migrations/` — migration history (must not be manually modified)

**Must not own:**
- Application code
- Business logic
- Seed data (that's `database/seeds/`)

**Schema implementation:** PR 11

---

### `database/`

**Owns:**
- CLI scripts for database operations: `scripts/validate.ts`, `scripts/reset.ts`, `scripts/backup.ts`
- Seed data scripts: `seeds/`

**Must not own:**
- Application code
- Prisma schema definition
- Migration files

**Executed as standalone scripts — not imported as a package.**

---

### `docs/`

**Owns:**
- All project documentation
- Architecture documents
- Engineering conventions
- API documentation (future)
- Decision records

**Must not own:**
- Application code
- Configuration files

---

### `scripts/`

**Owns:**
- Root-level development workflow scripts
- Build orchestration
- Environment setup helpers

**Must not own:**
- Application source code
- Database schema

---

### `.github/`

**Owns:**
- GitHub repository configuration
- PR template
- GitHub Actions workflows (PR 10+)
- Issue templates (future)

---

## Dependency Boundaries

```
apps/api     ──imports──►  packages/shared
apps/api     ──imports──►  packages/validation
apps/api     ──imports──►  packages/config
apps/api     ──imports──►  @prisma/client

apps/web     ──imports──►  packages/shared
apps/web     ──imports──►  packages/validation
apps/web     ──imports──►  packages/config

packages/*   ──NO cross-package imports at this stage──
```

**Rules:**
- Apps may import from packages. Packages must not import from apps.
- `apps/api` must not import from `apps/web` and vice versa.
- No circular dependencies anywhere.
- `database/` scripts run standalone — they do not become importable modules.

---

## Future Directories

These directories will be added by later PRs:

| Directory          | Purpose                          | PR  |
|--------------------|----------------------------------|-----|
| `apps/api/src/`    | API source code                  | 02  |
| `apps/web/src/`    | Web source code                  | 03  |
| `packages/shared/src/` | Shared type definitions      | 04  |
| `.github/workflows/`| CI pipelines                   | 10  |

Do not create these ahead of their designated PR.
