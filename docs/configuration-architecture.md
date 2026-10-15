# StockPilot — Configuration Architecture

**Document:** `docs/configuration-architecture.md`  
**PR:** PR 07 — Configuration Architecture  
**Status:** Implemented  
**Classification:** Foundational System Architecture

---

## 1. Overview

StockPilot implements a centralized, strictly typed, and environment-aware configuration architecture. It guarantees that all backend processes validate required runtime settings before binding network ports or accepting incoming requests.

### Core Principles

1. **Centralized Boundary:** Modules must never read `process.env` directly. All runtime settings are accessed through the frozen `config` object in `apps/api/src/config/`.
2. **Fail-Fast Startup:** Invalid or missing configuration halts application startup immediately with an actionable diagnostic report.
3. **Aggregated Diagnostics:** All configuration issues are collected and presented together in a single error rather than failing one by one.
4. **Environment Separation:** Development, test, and production environments maintain strict separation of defaults and diagnostics.
5. **Secret Protection:** Sensitive variables are automatically redacted (`[REDACTED]`) in error messages and excluded from public payloads.
6. **Immutability:** The exported configuration object is deeply frozen using `Object.freeze` to prevent accidental mutation at runtime.

---

## 2. Configuration Schema

The configuration hierarchy is structured into logical sub-domains with convenient top-level accessors:

```typescript
export interface AppConfig {
  server: {
    nodeEnv: "development" | "test" | "production";
    port: number;
    host: string;
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
  };
  logging: {
    level: LogLevel;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  metadata: {
    name: string;
    version: string;
  };

  // Top-level convenience accessors
  nodeEnv: "development" | "test" | "production";
  port: number;
  host: string;
  logLevel: LogLevel;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}
```

---

## 3. Environment Variables Reference

| Variable      | Type    | Allowed Values                                     | Default (Dev)           | Default (Test)          | Default (Prod) | Description                             |
| :------------ | :------ | :------------------------------------------------- | :---------------------- | :---------------------- | :------------- | :-------------------------------------- |
| `NODE_ENV`    | String  | `development`, `test`, `production`                | `development`           | `test`                  | `production`   | Runtime environment classification      |
| `PORT`        | Integer | `1` to `65535`                                     | `4000`                  | `4000`                  | `4000`         | HTTP listening port for Express backend |
| `HOST`        | String  | Valid hostname or IP                               | `0.0.0.0`               | `127.0.0.1`             | `0.0.0.0`      | Network interface binding address       |
| `LOG_LEVEL`   | String  | `fatal`, `error`, `warn`, `info`, `debug`, `trace` | `debug`                 | `error`                 | `info`         | Minimum log output severity for Pino    |
| `CORS_ORIGIN` | String  | Single URL or comma-separated URLs                 | `http://localhost:3000` | `http://localhost:3000` | Explicit URL   | Allowed CORS request origins            |

---

## 4. Validation and Failure Handling

Configuration validation is executed by `validateEnv(env)`.

If one or more variables fail validation, the system throws a `ConfigurationError` (derived from `AppError`), which formats and lists each issue:

```text
Application configuration validation failed with 2 issue(s):
  - PORT: must be an integer between 1 and 65535 (received: "invalid_port")
  - LOG_LEVEL: must be one of: fatal, error, warn, info, debug, trace (received: "verbose")
```

### Process Lifecycle Protection

In `apps/api/src/index.ts`, configuration validation takes place prior to starting the HTTP server:

- If valid: Server binds `config.host` and `config.port`, logging startup status.
- If invalid: `ConfigurationError` is caught, logged via `logger.fatal`, and the process terminates immediately with exit code `1`.

---

## 5. Environment Separation

- **Development:** Defaults to verbose debug logging (`LOG_LEVEL=debug`), binds all interfaces (`0.0.0.0`), and safely attempts to load `.env` if present.
- **Test:** Disables external network exposure by default (`HOST=127.0.0.1`), restricts logging to errors (`LOG_LEVEL=error`) to keep test runner output clean, and isolates test configurations per suite.
- **Production:** Defaults to standard operational logging (`LOG_LEVEL=info`), enforces strict validation, and avoids dangerous development fallbacks.

---

## 6. Local Setup Instructions

1. Copy `.env.example` to `.env` in the repository root:
   ```bash
   cp .env.example .env
   ```
2. Verify local settings:
   ```env
   NODE_ENV=development
   PORT=4000
   HOST=0.0.0.0
   LOG_LEVEL=debug
   ```
3. Run tests to confirm configuration validity:
   ```bash
   npm test -w @stockpilot/api
   ```
