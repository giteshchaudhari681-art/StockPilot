# StockPilot

**AI-Powered Inventory Intelligence & Decision-Support Platform**

StockPilot is a production-grade inventory intelligence and operations platform. It combines operational inventory management with analytics, forecasting, anomaly detection, risk analysis, recommendations, and scenario simulation.

---

## Architecture

StockPilot is built as a **monorepo** using npm workspaces.

The architecture separates concerns into distinct layers with enforced dependency boundaries:

- **Frontend (`apps/web`)**: Next.js / React application
- **Backend (`apps/api`)**: Node.js / Express API
- **Shared Packages (`packages/*`)**: Shared types, configuration, and validation
- **Database (`prisma/`)**: Prisma schema and migrations
- **Infrastructure**: PostgreSQL, Redis, Docker Compose

For a detailed view of the architecture and boundaries, see:
[docs/architecture.md](./docs/architecture.md)

---

## Repository Structure

```text
StockPilot/
├── apps/                   # Deployable applications (api, web)
├── packages/               # Shared library packages (shared, validation, config)
├── prisma/                 # Prisma ORM schema and migrations
├── database/               # Database operational tooling (scripts, seeds)
├── docs/                   # Project documentation
├── scripts/                # Root-level development scripts
└── docker-compose.yml      # Local development infrastructure
```

For the complete directory ownership map, see:
[docs/repository-structure.md](./docs/repository-structure.md)

---

## Development Prerequisites

To develop StockPilot locally, you must have the following installed:

1. **Node.js**: v20 or later (see `.nvmrc`)
2. **npm**: v10 or later
3. **Docker Desktop**: Required for running the local PostgreSQL database and Redis
4. **Git**: For version control

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/giteshchaudhari681-art/StockPilot.git
   cd StockPilot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   _(Note: This installs workspace dependencies across the monorepo.)_

3. **Start the backend development server:**
   ```bash
   npm run dev -w apps/api
   ```

---

## Environment Configuration

StockPilot uses environment variables for configuration.

**NEVER commit real credentials to the repository.**

1. Copy the example template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in any required local values. The defaults provided in `.env.example` are designed to work out-of-the-box with the local Docker Compose infrastructure.

---

## Development Philosophy

StockPilot is being developed through a strictly controlled **100-PR architecture roadmap**.

Each Pull Request (PR) has a single, bounded responsibility. This ensures that the architecture is built intentionally, boundaries are respected, and complexity is introduced gradually.

For engineering conventions, see:
[docs/engineering-conventions.md](./docs/engineering-conventions.md)

---

## Current Status

**PR 02 — Backend Application Bootstrap**

The backend foundational application has been established:

- Node.js/Express bootstrap
- Safe configuration loading
- Minimal health endpoint
- Graceful shutdown lifecycle
- Generic error boundaries

_(Previous: PR 01 — Repository & Engineering Foundation)_
