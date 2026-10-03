# StockPilot — Backend Bootstrap

**Document:** `docs/backend-bootstrap.md`
**PR:** 02 — Backend Application Bootstrap

---

## Overview

This document describes the foundational backend bootstrap for the StockPilot `apps/api` service.

The backend is a Node.js Express application written in TypeScript. It is designed to start up safely, validate its basic environment, handle requests robustly without crashing, and shut down gracefully.

---

## Architecture

The backend bootstrap is intentionally minimal, establishing only the required runtime boundaries.

### `src/index.ts` (Entry Point)

- Responsible for process lifecycle.
- Loads the validated configuration.
- Starts the Express HTTP server.
- Catches startup errors and exits with a non-zero code.
- Handles `SIGTERM` and `SIGINT` to gracefully close the HTTP server before exiting.

### `src/app.ts` (Express Application)

- Responsible for Express middleware and route attachment.
- Mounts `express.json()` for request body parsing.
- Mounts the `/health` route.
- Provides a fallback `404 Not Found` handler.
- Provides a fallback `500 Internal Server Error` global boundary.

### `src/config/env.ts` (Configuration Boundary)

- Validates essential environment variables (`NODE_ENV`, `PORT`, `HOST`) before the application boots.
- Prevents the application from starting if misconfigured.
- Exposes a typed `config` singleton.

---

## Environment Variables

The backend requires the following variables:

| Variable   | Default       | Description                                                    |
| ---------- | ------------- | -------------------------------------------------------------- |
| `NODE_ENV` | `development` | Application environment (`development`, `test`, `production`). |
| `PORT`     | `4000`        | HTTP server port (1-65535).                                    |
| `HOST`     | `0.0.0.0`     | HTTP server host interface.                                    |

---

## Health Endpoint

A minimal health endpoint is available to verify process liveness.

**Request:**

```http
GET /health
```

**Response (200 OK):**

```json
{
  "status": "ok"
}
```

---

## Development

The backend uses `tsx` for local development, providing TypeScript execution without a manual compilation step.

**Start the development server:**

```bash
npm run dev -w apps/api
```

**Build for production:**

```bash
npm run build -w apps/api
```

**Run typechecking:**

```bash
npm run typecheck -w apps/api
```
