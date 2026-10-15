# StockPilot — Logging Foundation

**Document:** `docs/logging-foundation.md`  
**PR:** 05 — Logging Foundation

---

## 1. Overview and Purpose

PR 05 establishes a centralized, structured, and high-performance logging foundation for the StockPilot platform. It provides a domain-independent logging module hosted in `@stockpilot/shared` and seamless backend integration in `apps/api`.

The logging foundation delivers:

- **Structured machine-readable logs:** Standard JSON entries adhering to production observability best practices.
- **RFC 5424 severity levels:** Strictly defined log levels (`fatal`, `error`, `warn`, `info`, `debug`, `trace`).
- **Request correlation:** End-to-end tracing across asynchronous operations via `X-Correlation-ID` and Node.js `AsyncLocalStorage`.
- **Sensitive data redaction:** Automatic masking of passwords, tokens, API keys, cookies, and secret headers.
- **Process lifecycle instrumentation:** Structured events for server listening, graceful shutdown, and fatal crashes.

---

## 2. Severity Level Standards

| Level   | Severity Weight | Intended Purpose & Appropriate Usage                                                                                   |
| :------ | :-------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `fatal` | 60              | Process-critical failures that prevent or terminate safe continued operation (e.g. startup failure, shutdown timeout). |
| `error` | 50              | Unhandled exceptions or operational failures that require engineering investigation.                                   |
| `warn`  | 40              | Recoverable or unexpected conditions (e.g. 404 Not Found, degraded health, fallback usage).                            |
| `info`  | 30              | Meaningful lifecycle milestones and completed business operations (e.g. server listening, request completion).         |
| `debug` | 20              | Detailed diagnostic information useful during active development and troubleshooting.                                  |
| `trace` | 10              | Extremely fine-grained execution flow details (disabled in production by default).                                     |

---

## 3. Structured Log Schema

Every log line emitted by the logging foundation adheres to a predictable JSON schema:

```json
{
  "level": "info",
  "time": "2026-10-15T17:51:22.977Z",
  "pid": 19296,
  "hostname": "prod-api-01",
  "name": "stockpilot-api",
  "correlationId": "1f633ffa-7077-411f-bb2e-172cb0d56b52",
  "method": "GET",
  "url": "/health",
  "statusCode": 200,
  "durationMs": 4,
  "msg": "HTTP GET /health 200 - 4ms"
}
```

### Standard Fields

- `level`: The log severity level as a string (`"info"`, `"warn"`, `"error"`, etc.).
- `time`: ISO 8601 UTC timestamp.
- `name`: Service or component identifier (e.g. `"stockpilot-api"`).
- `pid`: Process identifier.
- `hostname`: Host machine or container hostname.
- `correlationId`: Contextual correlation identifier when executing within a request context.
- `msg`: Human-readable log message.

---

## 4. Logger API & Usage

### 4.1 Creating a Logger

The logger factory `createLogger` is exported from `@stockpilot/shared`:

```typescript
import { createLogger, type Logger } from "@stockpilot/shared";

const logger: Logger = createLogger({
  name: "stockpilot-api",
  level: "info",
  nodeEnv: process.env.NODE_ENV,
});
```

### 4.2 Logging Events

Log functions support both context-first and message-first calls:

```typescript
// Context object with message
logger.info({ userId: "user-123" }, "User session initiated");

// Simple message
logger.info("Application initialized");

// Error logging with safe serialization
try {
  // ...
} catch (error) {
  logger.error({ err: error }, "Failed to process transaction");
}
```

### 4.3 Child Loggers

Child loggers inherit configuration and append contextual bindings to all emitted logs:

```typescript
const child = logger.child({ module: "inventory", warehouseId: "wh-01" });
child.info("Stock level calculated");
// Output includes: { ... "module": "inventory", "warehouseId": "wh-01", "msg": "Stock level calculated" }
```

---

## 5. Request Correlation

### 5.1 Correlation Middleware

The backend registers `correlationMiddleware` at the application root:

1. **Header Inspection:** Reads incoming `X-Correlation-ID` (or `X-Request-ID`).
2. **Validation & Sanitization:** Enforces alphanumeric, hyphen, and underscore characters up to 64 characters (`/^[a-zA-Z0-9_-]{1,64}$/`). Malformed, oversized, or missing IDs are replaced with a newly generated UUIDv4.
3. **Response Header:** Emits `X-Correlation-ID: <id>` in all HTTP responses.
4. **Context Propagation:** Binds the correlation ID to `AsyncLocalStorage` and attaches `req.correlationId` and `req.log = logger.child({ correlationId })` to the Express `Request` object.

---

## 6. Security and Sensitive Data Protection

### 6.1 Automatic Redaction

The logging foundation automatically censors values for sensitive keys using the `[REDACTED]` placeholder:

- `password`, `passwordHash`
- `token`, `accessToken`, `refreshToken`, `jwtSecret`
- `secret`, `apiKey`, `api_key`
- `authorization` (including `req.headers.authorization`)
- `cookie`, `set-cookie` (including `req.headers.cookie`)
- `creditCard`, `databaseUrl`, `DATABASE_URL`

### 6.2 Safe Error Serialization

The `serializeError` helper extracts `name`, `message`, and `code`. Stack traces are excluded in production environments to prevent internal infrastructure details from leaking into external log streams.

---

## 7. Verification and Testing

Execute the following commands from the repository root to validate the logging foundation:

```bash
# Build the shared package
npm run build -w @stockpilot/shared

# Run shared package unit tests (including logger tests)
npm run test -w @stockpilot/shared

# Build backend API
npm run build -w @stockpilot/api

# Run backend integration tests (including correlation and lifecycle logging)
npm run test -w @stockpilot/api

# Typecheck all workspaces
npm run typecheck

# Check code formatting across repository
npm run format:check
```
