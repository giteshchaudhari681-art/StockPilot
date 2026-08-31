# Contributing to StockPilot

Thank you for your interest in contributing to StockPilot. StockPilot is an AI-powered inventory intelligence and decision-support platform that combines operational inventory management with demand forecasting, anomaly detection, risk evaluation, and scenario simulation.

This guide provides practical instructions for setting up your local development environment, understanding the repository architecture, running tests, and submitting pull requests.

---

## 1. Code of Conduct & Core Principles

All contributors are expected to uphold high standards of collaboration, security, and code quality:

- **Security & Data Integrity First:** Never compromise transactional correctness or security boundaries for convenience.
- **Evidence-Driven Development:** Propose changes that solve specific, measurable operational needs.
- **Architectural Consistency:** Respect layer boundaries (UI → API → Services → Database / ML Service).
- **Test Before Submitting:** Ensure unit tests, integration checks, and linters pass before opening a pull request.
- **No Secrets in Code:** Never commit credentials, tokens, or environment files containing sensitive values.

---

## 2. Project Architecture & Directory Structure

The StockPilot repository is organized into distinct functional areas:

```
StockPilot/
├── backend/               # Node.js / Express / TypeScript backend API service
│   ├── src/               # Application source code (domains, middleware, routes)
│   └── package.json       # Backend dependencies and scripts
├── frontend/              # Next.js / React / Tailwind CSS web application
│   ├── src/               # UI components, pages, hooks, and state providers
│   └── package.json       # Frontend dependencies and scripts
├── ml-service/            # FastAPI / Python machine learning service
│   ├── app/               # Forecasting, anomaly detection, and ML endpoints
│   ├── requirements.txt   # Core Python runtime dependencies
│   └── requirements-dev.txt # Development and testing dependencies
├── prisma/                # Prisma ORM master database schema and migrations
│   └── schema.prisma      # PostgreSQL data model definitions
├── database/              # Database scripts and seed data definitions
├── infrastructure/        # Infrastructure and container configurations
│   └── docker/            # Dockerfiles and docker-compose.yml for local services
├── docs/                  # Authoritative architecture and product documentation
├── tests/                 # End-to-end, integration, security, and performance test suites
├── scripts/               # Project automation and utility scripts
├── CHANGELOG.md           # Record of notable changes
├── LICENSE                # Apache-2.0 legal license text
└── README.md              # Project overview and entry point
```

---

## 3. Local Development Prerequisites

Ensure you have the following tools installed on your development machine:

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **Python:** v3.11 or higher
- **Docker & Docker Compose:** For running local PostgreSQL 16 and Redis 7 instances
- **Git:** For source control management

---

## 4. Getting Started & Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/StockPilot.git
cd StockPilot
```

### Step 2: Start Infrastructure Services (PostgreSQL & Redis)

Start the local PostgreSQL and Redis containers using Docker Compose:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Verify that the containers are healthy:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

### Step 3: Configure Environment Variables

Copy the provided example environment templates to `.env` files in their respective directories:

```bash
# Root environment configuration
cp .env.example .env

# Backend environment configuration
cp backend/.env.example backend/.env

# Frontend environment configuration
cp frontend/.env.example frontend/.env

# ML Service environment configuration
cp ml-service/.env.example ml-service/.env
```

> **Note:** Update the local connection strings in `.env` if your local environment uses non-default ports or credentials. Never commit `.env` files to git.

### Step 4: Install Dependencies

#### Backend
```bash
cd backend
npm install
cd ..
```

#### Frontend
```bash
cd frontend
npm install
cd ..
```

#### ML Service
```bash
cd ml-service
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

pip install -r requirements.txt -r requirements-dev.txt
cd ..
```

### Step 5: Initialize Database & Prisma Client

From the `backend/` directory, generate the Prisma client and run database migrations:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..
```

---

## 5. Running the Application

For active local development, start each service in a separate terminal window:

### 1. Backend Service (Port 4000)
```bash
cd backend
npm run dev
```

### 2. Frontend Application (Port 3000)
```bash
cd frontend
npm run dev
```

### 3. ML Service (Port 8000)
```bash
cd ml-service
# Activate virtual environment
source venv/bin/activate   # Linux/macOS
# or: venv\Scripts\activate # Windows

uvicorn app.main:app --reload --port 8000
```

---

## 6. Development Workflow & Code Quality

### Branching Strategy

Create descriptive feature or fix branches from the main development branch:

- `feature/<short-description>`: New capabilities or functional enhancements
- `fix/<short-description>`: Bug fixes and error resolutions
- `docs/<short-description>`: Documentation additions and corrections
- `refactor/<short-description>`: Code cleanup without functional changes

### Linting & Type Checking

Ensure all code passes static analysis before committing:

- **Backend:**
  ```bash
  cd backend
  npm run lint
  npm run build # Type-check via TypeScript compiler
  ```

- **Frontend:**
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```

- **ML Service:**
  ```bash
  cd ml-service
  ruff check .
  black --check .
  mypy .
  ```

### Running Tests

Run the relevant automated test suites:

- **Backend Unit & Integration Tests (Jest):**
  ```bash
  cd backend
  npm test
  ```

- **Frontend End-to-End Tests (Playwright):**
  ```bash
  cd frontend
  npm run test:e2e
  ```

- **ML Service Tests (pytest):**
  ```bash
  cd ml-service
  pytest
  ```

---

## 7. Database Migrations & Schema Changes

When modifying the database schema:

1. Update `prisma/schema.prisma` with the new models, fields, or relations.
2. Run migration generation in development:
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:generate
   ```
3. Verify that backend services, repositories, and TypeScript types compile cleanly with the updated schema.
4. Never perform destructive raw schema operations on shared or production environments.

---

## 8. Pull Request & Contribution Submission

When your changes are ready for review:

1. **Commit Hygiene:** Keep commits focused and atomic with clear, concise messages.
2. **Sync with Main:** Rebase or merge the latest changes from the upstream branch.
3. **Verify Checks:** Ensure all linting, type checks, and unit tests pass locally.
4. **Update Documentation:** If your change modifies APIs, configuration flags, or environment variables, update the corresponding documentation in `docs/` or `.env.example`.
5. **Update Changelog:** Add a concise summary of your changes under the `[Unreleased]` section in `CHANGELOG.md`.
6. **Open Pull Request:**
   - Provide a clear, descriptive title.
   - Describe what the PR accomplishes and why the change was necessary.
   - List testing steps and validation performed.
   - Attach UI screenshots or recordings for visual frontend changes.

---

## 9. Security Guidelines

Security is a fundamental requirement for StockPilot:

- Validate all incoming user request payloads using runtime schemas (`zod` in Node.js, `pydantic` in Python).
- Enforce role-based access control and resource authorization across all backend routes.
- Prevent SQL injection by utilizing Prisma's parameterized query builder.
- Do not log sensitive user data, passwords, or authentication tokens.
- For reporting security vulnerabilities, please refer to [SECURITY.md](SECURITY.md).

---

## 10. License

StockPilot is open-source software licensed under the [Apache License, Version 2.0](LICENSE). By contributing to StockPilot, you agree that your contributions will be licensed under its terms.
