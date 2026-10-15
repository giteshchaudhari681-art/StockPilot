# StockPilot — Error Architecture

**Document:** `docs/error-architecture.md`  
**PR:** PR 06 — Error Architecture  
**Status:** Implemented  
**Classification:** Foundational System Architecture

---

## 1. Overview

StockPilot implements a centralized, typed, production-grade error architecture designed to classify, propagate, log, and serialize errors securely and deterministically across all application layers.

The architecture enforces strict separation between:

1. **Domain errors:** Business rule and domain invariant violations (framework-independent).
2. **Infrastructure errors:** Failures originating from technical dependencies (databases, network, external APIs).
3. **Application/HTTP errors:** Operational failures mapped to standard HTTP status codes and public response envelopes.
4. **Unexpected runtime exceptions:** Unhandled bugs returning generic 500 responses without leaking server internals.

---

## 2. Error Taxonomy & Layering

```
                     ┌───────────────────────┐
                     │   JavaScript Error    │
                     └───────────┬───────────┘
                                 │
                     ┌───────────┴───────────┐
                     │       AppError        │  (@stockpilot/shared)
                     └─────┬───────────┬─────┘
                           │           │
            ┌──────────────┴─────┐     └──────────────┐
            │    DomainError     │                    │  InfrastructureError
            │  (Business Rules)  │                    │  (Technical/Dependencies)
            └────────────────────┘                    └───────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │        HttpErrors           │  (apps/api)
            │ (BadRequest, NotFound, etc.)│
            └─────────────────────────────┘
```

### 2.1 Base `AppError` (`@stockpilot/shared`)

The root abstraction for all operational and classified errors.

- **`code`:** Stable, machine-readable identifier (e.g., `VALIDATION_ERROR`, `INTERNAL_ERROR`).
- **`statusCode`:** Associated HTTP status code (defaults to 500).
- **`isOperational`:** Boolean distinguishing expected runtime errors (`true`) from fatal programming bugs (`false`).
- **`clientMessage`:** Public-facing message safe to display to clients.
- **`details`:** Optional structured metadata dictionary for error specifics.
- **`cause`:** Preserves the underlying `Error` object for diagnostic tracing.

### 2.2 `DomainError` (`@stockpilot/shared`)

- Pure domain representation of invariant or business rule violations.
- Strictly decoupled from Express, HTTP transports, and databases.
- Defaults to `statusCode: 422` (Unprocessable Entity) and `isOperational: true`.
- Default code: `ErrorCode.DOMAIN_RULE_VIOLATION`.

### 2.3 `InfrastructureError` (`@stockpilot/shared`)

- Encapsulates technical failures (e.g. database disconnect, cache timeout, network reset).
- Retains the original internal error message and `cause` for server-side logging.
- Defaults `isOperational: false` and `statusCode: 503`.
- Client-facing message is fixed to `"A service dependency failure occurred"` to guarantee connection strings, internal IPs, and credentials never leak to API consumers.

### 2.4 Concrete HTTP Errors (`apps/api/src/errors/http-errors.ts`)

- `BadRequestError` (400, `ErrorCode.BAD_REQUEST`)
- `UnauthorizedError` (401, `ErrorCode.UNAUTHORIZED`)
- `ForbiddenError` (403, `ErrorCode.FORBIDDEN`)
- `NotFoundError` (404, `ErrorCode.NOT_FOUND`)
- `ConflictError` (409, `ErrorCode.CONFLICT`)
- `UnprocessableEntityError` (422, `ErrorCode.UNPROCESSABLE_ENTITY`)
- `InternalServerError` (500, `ErrorCode.INTERNAL_ERROR`)
- `ServiceUnavailableError` (503, `ErrorCode.SERVICE_UNAVAILABLE`)

---

## 3. Stable Machine-Readable Error Codes

All recognized errors use uppercase snake_case identifiers defined in `ErrorCode`:

| Code                         | Layer      | Default Status | Description                                        |
| ---------------------------- | ---------- | -------------- | -------------------------------------------------- |
| `BAD_REQUEST`                | HTTP / App | 400            | Malformed request syntax or payload                |
| `UNAUTHORIZED`               | HTTP / App | 401            | Missing or invalid authentication credentials      |
| `FORBIDDEN`                  | HTTP / App | 403            | Insufficient permissions for requested resource    |
| `NOT_FOUND`                  | HTTP / App | 404            | Target resource could not be found                 |
| `CONFLICT`                   | HTTP / App | 409            | Resource state conflict or concurrent modification |
| `UNPROCESSABLE_ENTITY`       | HTTP / App | 422            | Syntactically correct but semantically invalid     |
| `DOMAIN_RULE_VIOLATION`      | Domain     | 422            | Violation of explicit business rule or constraint  |
| `DOMAIN_INVARIANT_VIOLATION` | Domain     | 422            | System invariant violation                         |
| `INVALID_STATE_TRANSITION`   | Domain     | 422            | Invalid workflow state change                      |
| `INFRASTRUCTURE_ERROR`       | Infra      | 503            | Third-party or technical dependency failure        |
| `SERVICE_UNAVAILABLE`        | Infra      | 503            | Backend service temporarily unavailable            |
| `TIMEOUT`                    | Infra      | 504            | Operation timed out                                |
| `INTERNAL_ERROR`             | System     | 500            | Unhandled runtime exception                        |

---

## 4. Standard Response Envelope

When an error reaches the HTTP boundary, it is formatted into a standardized JSON envelope:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid query parameter 'limit'",
    "correlationId": "8f8b8098-75c6-4b67-b5bf-73d7ec15aa9c",
    "details": {
      "limit": "-1"
    }
  }
}
```

### Security Rules for Error Serialization:

1. **No Stack Traces in Production:** The `stack` property is excluded in `production` and `test` environments. It is only included when `NODE_ENV=development`.
2. **Generic Internal Messages:** When unexpected 500 errors occur, the response message is always masked to `"Internal Server Error"`.
3. **Correlation ID:** Automatically propagated from `req.correlationId` to link client errors directly to structured server log streams.

---

## 5. Global Error Handling Middleware

The Express global error handler in `apps/api/src/middleware/error-handler.ts`:

1. **Headers-Sent Guard:** Verifies `if (res.headersSent)` and delegates to Express's built-in default handler to prevent HTTP protocol crashes (`ERR_HTTP_HEADERS_SENT`).
2. **Logging Integration:** Logs structured diagnostics using Pino:
   - Operational 4xx client errors are logged at `warn` level.
   - 5xx errors and unexpected exceptions are logged at `error` level with full diagnostic stack traces and error causes.
3. **Deterministic Mapping:** Calls `mapErrorToHttpResponse` to generate HTTP status and JSON response envelopes.

---

## 6. Asynchronous Error Handling

Express 4 does not automatically catch rejected Promises in async route handlers. StockPilot provides `asyncHandler` in `apps/api/src/utils/async-handler.ts`:

```typescript
import { asyncHandler } from "./utils/async-handler.js";

router.get(
  "/resource",
  asyncHandler(async (req, res) => {
    const item = await service.fetchItem(req.params.id);
    res.json(item);
  }),
);
```

Any exception or rejected Promise is forwarded to `next(err)` and caught by the global error boundary.
