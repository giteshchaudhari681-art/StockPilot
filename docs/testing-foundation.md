# StockPilot — Testing Foundation & Test Infrastructure

**Document:** `docs/testing-foundation.md`  
**PR:** PR 09 — Testing Foundation  
**Status:** Implemented  
**Classification:** Foundational Architecture Specification

---

## 1. Overview

The StockPilot testing foundation establishes a deterministic, reproducible, maintainable, and isolated testing infrastructure across the monorepo. It leverages Node.js's native test runner (`node:test`) and strict assertion library (`node:assert/strict`), eliminating heavy external testing framework dependencies while delivering fast execution, zero global namespace pollution, and robust asynchronous resource management.

---

## 2. Test Architecture & Directory Strategy

The testing architecture organizes tests into distinct layers according to their execution scope and isolation characteristics:

```text
StockPilot Monorepo
├── apps/
│   └── api/
│       └── test/
│           ├── fixtures/                  # Deterministic test factories & data builders
│           │   └── index.js               # createTestAppConfig, createTestErrorEnvelope
│           ├── helpers/                   # Reusable lifecycle, isolation & assertion utilities
│           │   ├── assertions.js          # assertValidUuid, assertErrorEnvelope, assertHealthOk
│           │   ├── env.js                 # withIsolatedEnv, createEnvSnapshot
│           │   └── test-server.js         # withTestServer, startTestServer (ephemeral port)
│           ├── api-foundation.test.js     # Integration: routing, metadata, versioning
│           ├── config.test.js             # Unit: environment parsing & schema validation
│           ├── error-integration.test.js  # Integration: HTTP error boundary & masking
│           ├── logging-integration.test.js# Integration: correlation ID & Pino logging
│           └── test-infrastructure.test.js# Unit: testing foundation self-verification
└── packages/
    └── shared/
        └── test/
            ├── errors.test.js             # Unit: AppError, DomainError, InfrastructureError
            ├── index.test.js              # Unit: public API constants & exports
            └── logger.test.js             # Unit: Pino logger factory, log levels & redaction
```

### 2.1 Workspace Status

| Workspace                | Test Status | Test Count | Test Types                                    |
| ------------------------ | ----------- | ---------- | --------------------------------------------- |
| `@stockpilot/api`        | Active      | 53         | Unit & HTTP Integration                       |
| `@stockpilot/shared`     | Active      | 25         | Unit                                          |
| `@stockpilot/config`     | Declarative | N/A        | Interfaces & types only (no runtime logic)    |
| `@stockpilot/validation` | Declarative | N/A        | Schema placeholders (contracts in future PRs) |
| `@stockpilot/web`        | Deferred    | N/A        | Frontend testing foundation slated for PR 95  |

---

## 3. Test Layers & Conventions

### 3.1 Unit Tests

Unit tests validate isolated pure modules, mathematical computations, type guards, error constructors, and configuration parsers.

- **Rules:** Must not bind network sockets, write persistent disk files, or mutate global process state.
- **Examples:** `apps/api/test/config.test.js`, `apps/api/test/test-infrastructure.test.js`, `packages/shared/test/errors.test.js`.

### 3.2 Integration Tests

Integration tests validate the interaction between Express routers, middleware chains (Pino logging, correlation ID, body parsing), error handling boundaries, and configuration providers.

- **Rules:** Must use in-memory Express instances bound to ephemeral localhost ports (`127.0.0.1:0`). Every server listener and active client socket must be automatically closed in teardown hooks.
- **Examples:** `apps/api/test/api-foundation.test.js`, `apps/api/test/error-integration.test.js`, `apps/api/test/logging-integration.test.js`.

---

## 4. Reusable Fixtures and Utilities

### 4.1 Environment Isolation (`apps/api/test/helpers/env.js`)

Prevents cross-test state leakage caused by mutating `process.env`:

```javascript
import { withIsolatedEnv } from "./helpers/env.js";

await withIsolatedEnv({ NODE_ENV: "production", PORT: "5050" }, async () => {
  // process.env contains overrides during this callback execution
  // Original process.env is guaranteed restored upon completion or unexpected throw
});
```

### 4.2 Ephemeral HTTP Test Server (`apps/api/test/helpers/test-server.js`)

Spawns an Express application on an ephemeral port, provides an authenticated/correlated fetch client helper, and guarantees complete socket and listener teardown:

```javascript
import { withTestServer } from "./helpers/test-server.js";
import { createApp } from "../dist/app.js";

const app = createApp();
await withTestServer(app, async ({ get, post, baseUrl }) => {
  const res = await get("/api/v1");
  const data = await res.json();
  assert.equal(res.status, 200);
});
```

### 4.3 Standardized Assertions (`apps/api/test/helpers/assertions.js`)

Ensures contract compliance without brittle ad-hoc object inspection:

- `assertValidUuid(value, label)`: Verifies RFC-4122 v4 UUID format.
- `assertErrorEnvelope(payload, expectedCode, expectedStatus)`: Validates compliant error envelope shape (`error.code`, `error.message`, `error.statusCode`, `error.correlationId`).
- `assertHealthOk(payload)`: Validates standardized operational health payload.

### 4.4 Frozen Deterministic Fixtures (`apps/api/test/fixtures/index.js`)

- `createTestAppConfig(overrides)`: Returns deeply frozen `AppConfig` objects to prevent accidental test mutation.
- `createTestErrorEnvelope(overrides)`: Returns compliant error envelopes for boundary assertions.

---

## 5. Execution Guide

### 5.1 Monorepo Full Suite

Runs all test suites across all workspaces:

```bash
npm test
```

### 5.2 Workspace-Specific Suites

```bash
# Run API full suite (53 tests)
npm test -w @stockpilot/api

# Run API unit tests only (25 tests)
npm run test:unit -w @stockpilot/api

# Run API integration tests only (28 tests)
npm run test:integration -w @stockpilot/api

# Run shared library unit tests (25 tests)
npm test -w @stockpilot/shared
```

### 5.3 Single Focused Test File

```bash
# Direct node execution with built-in test runner
node --test apps/api/test/test-infrastructure.test.js
node --test apps/api/test/api-foundation.test.js
node --test packages/shared/test/errors.test.js
```

---

## 6. Failure Diagnosis & Troubleshooting

1. **`Cannot find module '../dist/...'`**:
   - Cause: TypeScript code has not been built before running tests.
   - Remedy: Run `npm run build` or `npm run pretest` to emit compiled JS.
2. **`EADDRINUSE: address already in use`**:
   - Cause: A test server attempted to bind a static port instead of an ephemeral port.
   - Remedy: Always use `withTestServer` or bind to port `0` (`httpServer.listen(0, '127.0.0.1')`).
3. **Environment variable bleeding**:
   - Cause: Direct assignment to `process.env.VAR = '...'` without restoration.
   - Remedy: Wrap the test logic in `withIsolatedEnv({ ... }, async () => { ... })`.

---

## 7. Scope Boundaries & Current Limitations

In strict compliance with the 100-PR Roadmap, the following capabilities are deferred to future PRs:

- **Database / Prisma integration testing**: Reserved for PR 11-23.
- **Security / Auth testing**: Reserved for PR 40.
- **Inventory domain testing**: Reserved for PR 50.
- **Procurement & order testing**: Reserved for PR 60.
- **ML & Forecasting testing**: Reserved for PR 75.
- **Frontend test suites**: Reserved for PR 95.
