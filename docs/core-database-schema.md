# StockPilot — Core Database Schema

**Document:** `core-database-schema.md`  
**Roadmap Reference:** PR 12 — Core Database Schema (Production-Grade Data Modeling, Relational Integrity & Schema Validation)  
**Status:** Approved & Implemented  
**Date:** 2026-11-02

---

## 1. Overview & Roadmap Scope

StockPilot is a production-oriented inventory intelligence and stock-management platform requiring auditable identity, deterministic relational integrity, and strict roadmap discipline.

In accordance with Master Execution Protocol v3.0 and the locked 100-PR roadmap:

- **PR 11:** Established the Prisma and PostgreSQL foundation (`prisma/schema.prisma` datasource/generator, database lifecycle module in `apps/api/src/db/`).
- **PR 12 (This PR):** Implements the **Core Database Schema** strictly limited to core identity: the `User` entity and `Role` enum with explicit constraints, types, least-privilege defaults, and schema-level validation.
- **Future PRs (PR 13–PR 19):** Deferred domain entities (Warehouses, Products, Inventories, Movements, Transfers, Reservations, Suppliers, Orders, Intelligence, Audit records) are strictly scheduled for their designated roadmap phases.

---

## 2. Core Entities and Data Model

### 2.1 Role Enum

The `Role` enum establishes the authorized operational personas for Role-Based Access Control (RBAC), consistent with `docs/05-Database.md` Section 7 and `docs/07-Security.md` Section 9:

```prisma
enum Role {
  ADMIN
  INVENTORY_MANAGER
  WAREHOUSE_OPERATOR
  PROCUREMENT_MANAGER
  OPERATIONS_MANAGER
}
```

| Role                  | Operational Scope               | Access Policy                                                        |
| :-------------------- | :------------------------------ | :------------------------------------------------------------------- |
| `ADMIN`               | System administrator            | Full administrative privileges, user management, configuration       |
| `INVENTORY_MANAGER`   | Inventory management            | Stock levels, inventory policies, adjustment review                  |
| `WAREHOUSE_OPERATOR`  | Warehouse floor operations      | Stock movements, physical counts, scanning (least-privilege default) |
| `PROCUREMENT_MANAGER` | Procurement & vendor management | Purchase orders, supplier tracking, replenishment                    |
| `OPERATIONS_MANAGER`  | High-level facility operations  | Cross-warehouse oversight, operational analytics, dispatch           |

### 2.2 User Model

The `User` model defines the core identity record representing an authenticated user, mapped to the PostgreSQL `users` table:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(WAREHOUSE_OPERATOR)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([role])
  @@map("users")
}
```

### 2.3 Field Specification

| Field          | Prisma Type | PostgreSQL Type | Nullable | Default              | Constraints & Attributes | Security & Business Rationale                                                            |
| :------------- | :---------- | :-------------- | :------- | :------------------- | :----------------------- | :--------------------------------------------------------------------------------------- |
| `id`           | `String`    | `TEXT` / `UUID` | No       | `uuid()`             | `@id`                    | Canonical primary key; opaque UUID prevents enumeration attacks.                         |
| `email`        | `String`    | `TEXT`          | No       | None                 | `@unique`                | Canonical login identifier; unique constraint prevents account collision.                |
| `passwordHash` | `String`    | `TEXT`          | No       | None                 | None                     | Stored cryptographic hash (Argon2 / bcrypt). Plaintext passwords are strictly forbidden. |
| `name`         | `String`    | `TEXT`          | No       | None                 | None                     | Full display name for audit and user representation (`docs/05-Database.md` §6).          |
| `role`         | `Role`      | `"Role"` enum   | No       | `WAREHOUSE_OPERATOR` | None                     | Least-privilege default prevents accidental privilege escalation on account creation.    |
| `isActive`     | `Boolean`   | `BOOLEAN`       | No       | `true`               | None                     | Boolean lifecycle flag for immediate access revocation without foreign-key corruption.   |
| `createdAt`    | `DateTime`  | `TIMESTAMP(3)`  | No       | `now()`              | None                     | Immutable record creation timestamp for auditability.                                    |
| `updatedAt`    | `DateTime`  | `TIMESTAMP(3)`  | No       | `@updatedAt`         | Automatic                | Managed by Prisma on mutation; tracks record updates.                                    |

---

## 3. Database Integrity & Security Rules

### 3.1 Primary Keys & Foreign References

- Every user record has an immutable UUID v4 primary key.
- Future entities (e.g. `InventoryMovement`, `AuditRecord`) will reference `User.id` using referential integrity actions such as `ON DELETE SET NULL` or `RESTRICT` to preserve historical traceability.

### 3.2 Unique Constraints

- `User.email` is uniquely constrained (`@unique`). This generates a unique B-tree index (`users_email_key`) enforcing uniqueness at the database engine level under concurrent registration or administrative requests.

### 3.3 Index Strategy

- **Primary Key:** `users_pkey` on `id` (automatic B-tree).
- **Unique Identifier:** `users_email_key` on `email` (automatic unique B-tree).
- **Secondary Index:** `@@index([role])` on `role`. User queries routinely filter users by operational role (e.g., retrieving all warehouse operators or procurement managers). The single-column index on `role` optimizes RBAC lookups and authorization queries without excessive write overhead given the low-cardinality enum.

### 3.4 Sensitive Data Protection

- Plaintext passwords and reusable authentication tokens are strictly barred from the database schema.
- Only one-way cryptographic hashes are stored in `passwordHash`.
- In `@stockpilot/shared`, the logger constants redact `password`, `passwordHash`, `*.password`, and `token` from all structured application logs.

### 3.5 Table & Column Mapping

- The model uses `@@map("users")` to adhere to standard PostgreSQL lowercase plural table naming conventions, maintaining compatibility with the existing prototype migration baseline (`prisma/migrations/20260826094511_init`).

---

## 4. Scope Isolation & Future-Phase Boundaries

In accordance with the locked 100-PR roadmap, the following models are strictly out-of-scope for PR 12 and will be introduced in subsequent PRs:

| Roadmap Phase                  | PR Number | Scope Description                                           |
| :----------------------------- | :-------- | :---------------------------------------------------------- |
| **Warehouse & Inventory**      | PR 13     | `Warehouse`, `Category`, `Product`, `Inventory`             |
| **Inventory Movements**        | PR 14     | `InventoryMovement`, movement types, quantity adjustments   |
| **Transfers & Reservations**   | PR 15     | `InventoryTransfer`, `InventoryReservation`                 |
| **Suppliers**                  | PR 16     | `Supplier`, `SupplierProduct`                               |
| **Orders**                     | PR 17     | `Order`, `OrderItem`                                        |
| **Intelligence & Forecasting** | PR 18     | `Forecast`, `Anomaly`, `Risk`, `Recommendation`, `Scenario` |
| **Audit Trails**               | PR 19     | `AuditRecord`                                               |
| **API & Auth Endpoints**       | PR 31–34  | Authentication routes, JWT issuance, login, registration    |

---

## 5. Verification & Quality Gates

The schema changes are validated through multiple automated layers:

### 5.1 Schema Formatting & Validation

```bash
# Validates schema structure against Prisma PostgreSQL rules
npm run prisma:validate

# Generates typed client to node_modules/@prisma/client
npm run prisma:generate
```

### 5.2 Automated Tests

The schema is tested in `apps/api/test/core-database-schema.test.js`:

- Verifies export of `Role` enum with all 5 authorized values.
- Verifies `prisma.user` model delegate methods (`findUnique`, `create`, `update`, etc.).
- Verifies Prisma DMMF metadata for `User` model, `users` table mapping, primary key, email uniqueness, role enum default, `isActive` default, and timestamp definitions.
- Verifies absence of deferred roadmap models in `prisma/schema.prisma`.

```bash
# Run API unit test suite including core schema tests
npm run test:unit -w @stockpilot/api

# Run full monorepo quality gates
npm run typecheck
npm run build
npm test
```
