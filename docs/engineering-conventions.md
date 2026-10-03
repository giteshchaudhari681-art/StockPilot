# StockPilot — Engineering Conventions

**Document:** `docs/engineering-conventions.md`
**PR:** 01 — Repository & Engineering Foundation
**Status:** Living document — updated as PRs progress

---

## Purpose

This document defines the engineering conventions that govern StockPilot development.

These conventions exist to ensure consistency, maintainability, and architectural integrity as the project grows through 100 PRs with potentially many contributors.

Conventions are **not optional**. Deviations require explicit architectural decisions.

---

## 1. Naming Conventions

### Files and Directories

| Artifact                  | Convention        | Example                          |
|---------------------------|-------------------|----------------------------------|
| TypeScript source files   | `kebab-case`      | `user-service.ts`                |
| React components          | `PascalCase`      | `InventoryTable.tsx`             |
| Test files                | `*.test.ts`       | `user-service.test.ts`           |
| E2E test files            | `*.e2e.ts`        | `login.e2e.ts`                   |
| Directories               | `kebab-case`      | `inventory-movements/`           |
| Configuration files       | `kebab-case`      | `database.config.ts`             |

### TypeScript

| Artifact        | Convention           | Example                          |
|-----------------|----------------------|----------------------------------|
| Variables       | `camelCase`          | `inventoryCount`                 |
| Functions       | `camelCase`          | `calculateAvailableQty()`        |
| Classes         | `PascalCase`         | `InventoryService`               |
| Interfaces      | `PascalCase`         | `CreateProductDto`               |
| Types           | `PascalCase`         | `OrderStatus`                    |
| Enums           | `PascalCase`         | `MovementType`                   |
| Enum values     | `SCREAMING_SNAKE`    | `TRANSFER_IN`                    |
| Constants       | `SCREAMING_SNAKE`    | `MAX_RETRY_COUNT`                |
| Private members | `camelCase`          | `this.prismaClient`              |
| Generic params  | `T`, `TEntity`, etc. | `<TResult>`                      |

### Database (Prisma)

| Artifact        | Convention      | Example               |
|-----------------|-----------------|-----------------------|
| Model names     | `PascalCase`    | `InventoryMovement`   |
| Field names     | `camelCase`     | `productId`           |
| Table names     | `snake_case`    | `inventory_movements` |
| Enum names      | `PascalCase`    | `MovementType`        |
| Enum values     | `SCREAMING_SNAKE` | `TRANSFER_IN`       |

---

## 2. TypeScript Conventions

### Always use strict mode

All TypeScript is compiled with `strict: true`. This enables:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictPropertyInitialization`

**Never disable strict mode** for convenience.

### Avoid `any`

Do not use `any` as an escape hatch.

```typescript
// Bad
function processData(data: any): any { ... }

// Good
function processData(data: unknown): ProcessedResult { ... }
```

If you cannot type something, use `unknown` and narrow it.

### Use explicit return types on exported functions

```typescript
// Good — intent is clear
export function createUser(dto: CreateUserDto): Promise<User> { ... }

// Acceptable — for simple private/internal utilities
const formatName = (first: string, last: string) => `${first} ${last}`;
```

### Prefer interfaces for objects, types for unions

```typescript
// Object shapes
interface UserDto {
  id: string;
  email: string;
}

// Unions and complex types
type OrderStatus = 'created' | 'confirmed' | 'fulfilled' | 'cancelled';
```

### Prefer `const` over `let`

Always prefer `const`. Only use `let` when reassignment is necessary. Never use `var`.

---

## 3. Import Conventions

### Import ordering

Organize imports in this order, separated by blank lines:

1. Node.js built-in modules
2. External npm packages
3. Internal workspace packages (`@stockpilot/*`)
4. Local relative imports

```typescript
import { createServer } from 'http';                  // 1. Node built-in

import express from 'express';                        // 2. External
import { PrismaClient } from '@prisma/client';

import { UserDto } from '@stockpilot/shared';         // 3. Workspace

import { UserService } from './services/user.service'; // 4. Local
```

### No circular dependencies

Circular imports between modules are forbidden.

If a circular dependency appears, it signals a design problem — restructure, do not suppress.

### Workspace boundaries

Apps may import from packages. Packages must not import from apps.

```
apps/api  →  packages/*   ✅
packages/shared  →  apps/api  ❌
```

---

## 4. Error Handling

> Full error architecture is implemented in PR 06.
> This section establishes the principle.

- **Never swallow errors silently.**
- Use typed error classes where possible.
- Distinguish operational errors (expected, safe to surface) from programmer errors (bugs).
- Always log errors with sufficient context for diagnosis.
- Never expose stack traces or internal error details to API consumers.

---

## 5. Environment & Secrets

- **Never commit `.env` files.**
- **Never commit credentials, API keys, tokens, or passwords.**
- All secrets come from environment variables.
- `.env.example` contains only safe placeholder values.
- Configuration is validated at startup (implemented in PR 07).
- Never log `DATABASE_URL` or any value containing credentials.

To add a new environment variable:
1. Add it to `.env.example` with a placeholder and a comment.
2. Update the configuration schema (PR 07+).
3. Document its purpose.

---

## 6. Git Conventions

### Branch naming

```
feat/pr-XX-short-description
fix/pr-XX-short-description
chore/pr-XX-short-description
```

Examples:
```
feat/pr-02-backend-application-bootstrap
fix/pr-11-schema-migration-correction
chore/pr-01-repository-foundation
```

### Commit messages

Use conventional commits format:

```
<type>: <short description>

[optional body]
```

Types:
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance (configuration, tooling, structure)
- `docs` — documentation only
- `refactor` — code change with no functional effect
- `test` — adding or modifying tests
- `ci` — CI/CD configuration

Example:
```
feat: implement user authentication service

Adds JWT-based authentication with refresh token support.
Includes rate limiting on the login endpoint.
```

### One logical change per commit

Do not bundle unrelated changes in a single commit.

---

## 7. Pull Request Conventions

### One roadmap PR per GitHub PR

Each GitHub Pull Request must correspond to exactly one roadmap PR.

Do not merge multiple roadmap PRs into a single GitHub PR.

### PR template

Every PR must use the `.github/pull_request_template.md`.

### Scope discipline

Before implementing anything, verify it belongs to the current roadmap PR.

If functionality belongs to a later PR, defer it — even if it seems easy or obvious.

---

## 8. Architecture Conventions

### Dependencies flow downward

```
apps  →  packages  →  (no further dependencies)
```

Nothing in `packages/` may import from `apps/`.

### No premature abstraction

Do not create abstractions before there are at least two concrete use cases requiring them.

### Each layer owns its own concerns

- API route handlers do not contain database queries.
- Database repositories do not contain HTTP concepts.
- Validation schemas are not embedded in route handlers.

### No magic

Avoid metaprogramming, dynamic property access, and reflection except where explicitly required.

Code must be easy to trace from entry point to output.

---

## 9. Code Style

Formatting is enforced by Prettier (configured in PR 01+).

Key style rules:
- Single quotes for strings in TypeScript/JavaScript
- Trailing commas in multi-line structures
- Semicolons required
- 2-space indentation (4 spaces for Python)
- 100-character line length

Do not disable Prettier for personal preference.

---

## 10. Testing Conventions

> Testing architecture is implemented in PR 09.
> This section establishes the principle.

- Every business-logic function should have unit tests.
- Integration tests cover service boundaries.
- E2E tests cover critical user flows.
- Tests must not share mutable state between runs.
- Tests must be deterministic — no random behavior without seeding.
- Do not skip tests permanently.

---

## 11. Documentation Conventions

- Update relevant documentation when implementing new functionality.
- Architecture documents live in `docs/`.
- Code should be self-documenting where possible.
- Add JSDoc comments on exported public API surfaces.
- Do not add comments that merely restate the code.
