# StockPilot — Frontend Bootstrap

**Document:** `docs/frontend-bootstrap.md`
**PR:** 03 — Frontend Application Bootstrap

---

## Overview

This document describes the foundational frontend bootstrap for the StockPilot `apps/web` service.

The frontend is a React application built with Vite and TypeScript. It establishes the foundational boundaries for routing, providers, and environment configuration without implementing domain-specific business logic.

---

## Architecture

The frontend bootstrap is deliberately structural. Future PRs will build upon these boundaries.

### `index.html` & `src/index.tsx` (Entry Point)

- `index.html` acts as the Vite entry point.
- `src/index.tsx` mounts the React application to the DOM.

### `src/app/App.tsx` (Root Component)

- Provides the top-level application wrapper.
- Connects the routing layer and provider layer.

### `src/app/providers.tsx` (Provider Boundary)

- Encapsulates React-level context providers (e.g., `BrowserRouter`).
- Acts as the central insertion point for future global providers (Auth, Query Client, Redux/Zustand, Theme).

### `src/app/router.tsx` (Routing Foundation)

- Maps routes to React components.
- Currently mounts a minimal `/` route to prove routing functionality.

### `src/components/layout/AppShell.tsx` (Application Shell)

- Establishes a structural wrapper for the application (Header + Main content area).

### `src/config/env.ts` (Environment Configuration)

- Reads `import.meta.env` (Vite's environment mechanism).
- Validates and exposes strictly the required variables to the application.
- Exposes `apiBaseUrl` via `VITE_API_BASE_URL`.

---

## Environment Variables

The frontend requires the following variables:

| Variable            | Default                 | Description                        |
| ------------------- | ----------------------- | ---------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Base URL for backend API requests. |

_(Note: Never place sensitive credentials in `VITE_*` variables as they are exposed to the browser.)_

---

## Development

The frontend uses `vite` for local development.

**Start the development server:**

```bash
npm run dev -w @stockpilot/web
```

**Build for production:**

```bash
npm run build -w @stockpilot/web
```

**Run typechecking:**

```bash
npm run typecheck -w @stockpilot/web
```

**Run linting:**

```bash
npm run lint -w @stockpilot/web
```

**Run formatting checks:**

```bash
npm run format:check -w @stockpilot/web
```

---

## GitHub Actions Checks

This PR introduces a dedicated GitHub Actions workflow to validate the frontend bootstrap:

- `.github/workflows/pr-03-validation.yml`

This workflow triggers on Pull Requests modifying `apps/web/` and ensures that:

1. Dependencies install successfully (`npm ci`).
2. TypeScript compiles strictly without errors.
3. ESLint passes with no warnings or errors.
4. Prettier formatting is consistent.
5. The Vite production build succeeds.

---

## Scope Note

This foundation explicitly **excludes** domain functionality (inventory, analytics, auth), state management, design systems (Tailwind/MUI), and database integrations. These elements are reserved for their respective roadmap PRs.
