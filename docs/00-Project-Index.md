# StockPilot — Project Index

## 1. Document Purpose

This document is the central index for the StockPilot project documentation.

It defines where the project's requirements, architecture, database design, API contracts, security rules, AI/ML design, testing strategy, deployment strategy, and implementation plans are documented.

This file is a navigation document. Detailed technical decisions belong in their respective documents.

---

## 2. Project Overview

**Project Name:** StockPilot

**Project Type:** Intelligent Inventory Management and Decision-Support Platform

**Primary Goal:**  
Build a production-oriented inventory management platform that combines operational inventory management with forecasting, anomaly detection, risk analysis, recommendations, and simulation capabilities.

StockPilot is not intended to be a basic CRUD inventory application.

The system should help users:

- Understand current inventory state.
- Track products and warehouses.
- Monitor inventory movements.
- Manage suppliers and orders.
- Detect potential stockouts and overstock.
- Forecast future demand.
- Identify inventory and supplier risks.
- Generate actionable recommendations.
- Simulate possible inventory scenarios.
- Make operational decisions using data and intelligence.

---

## 3. Documentation Map

| Document                       | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `00-Project-Index.md`          | Central navigation and project documentation index                   |
| `01-PRD.md`                    | Product requirements and product scope                               |
| `02-Features.md`               | Detailed feature definitions                                         |
| `03-Roadmap.md`                | High-level product and engineering roadmap                           |
| `04-Architecture.md`           | System architecture and component relationships                      |
| `05-Database.md`               | Database schema, entities, relationships, and constraints            |
| `06-API.md`                    | Backend API contracts and endpoint definitions                       |
| `07-Security.md`               | Authentication, authorization, validation, and security requirements |
| `08-AI.md`                     | AI/ML architecture, intelligence capabilities, and model strategy    |
| `09-Rules.md`                  | Business rules and system invariants                                 |
| `10-Phases.md`                 | Development phases and phase-specific deliverables                   |
| `11-Design.md`                 | UI/UX design system and interface rules                              |
| `12-Testing.md`                | Testing strategy and quality requirements                            |
| `13-Deployment.md`             | Deployment and environment strategy                                  |
| `14-File-Architecture.md`      | Complete repository and file structure                               |
| `15-Architecture-Decisions.md` | Important architectural decisions and their rationale                |
| `16-RFC.md`                    | Proposed architectural or product changes                            |
| `17-Implementation-Order.md`   | Exact implementation sequence                                        |

---

## 4. Source-of-Truth Hierarchy

When two documents appear to conflict, decisions should be resolved using the following order:

1. `01-PRD.md`
2. `02-Features.md`
3. `04-Architecture.md`
4. `05-Database.md`
5. `06-API.md`
6. `07-Security.md`
7. `08-AI.md`
8. `09-Rules.md`
9. `10-Phases.md`
10. `11-Design.md`
11. `12-Testing.md`
12. `13-Deployment.md`
13. `14-File-Architecture.md`
14. `15-Architecture-Decisions.md`
15. `16-RFC.md`
16. `17-Implementation-Order.md`

This hierarchy exists to prevent implementation details from silently changing product requirements.

---

## 5. Core Product Domains

StockPilot is organized around the following primary domains:

### 5.1 Authentication

Responsible for:

- User authentication.
- Session management.
- Password handling.
- Token management.
- Protected access.

---

### 5.2 Products

Responsible for:

- Product creation.
- Product updates.
- Product information.
- Product categorization.
- Product search.
- Product filtering.

---

### 5.3 Warehouses

Responsible for:

- Warehouse management.
- Warehouse information.
- Warehouse capacity.
- Warehouse-level inventory.
- Warehouse relationships.

---

### 5.4 Inventory

Responsible for:

- Current stock levels.
- Inventory status.
- Inventory adjustments.
- Inventory movements.
- Inventory transfers.
- Inventory reservations.
- Inventory history.

Inventory is the operational core of StockPilot.

---

### 5.5 Suppliers

Responsible for:

- Supplier management.
- Supplier information.
- Supplier performance.
- Supplier reliability.
- Supplier-related risk analysis.

---

### 5.6 Orders

Responsible for:

- Order creation.
- Order updates.
- Order items.
- Order status.
- Order fulfillment.
- Order cancellation.
- Order history.

---

### 5.7 Forecasting

Responsible for:

- Demand forecasting.
- Forecast generation.
- Forecast confidence.
- Forecast visualization.
- Forecast comparison.
- Forecast evaluation.

---

### 5.8 Anomaly Detection

Responsible for identifying unusual patterns such as:

- Unexpected demand changes.
- Unusual inventory movements.
- Abnormal stock changes.
- Potential operational anomalies.

---

### 5.9 Risk Analysis

Responsible for:

- Inventory risk.
- Stockout risk.
- Overstock risk.
- Supplier risk.
- Risk severity.
- Risk evidence.
- Risk monitoring.

---

### 5.10 Recommendations

Responsible for converting detected signals into actionable recommendations.

Examples include:

- Reorder recommendations.
- Stockout prevention recommendations.
- Overstock reduction recommendations.
- Supplier-related recommendations.
- Inventory balancing recommendations.

Recommendations should be explainable and supported by evidence.

---

### 5.11 Simulation

Responsible for:

- Scenario creation.
- Scenario modification.
- Simulation execution.
- Simulation results.
- Scenario comparison.

Simulation allows users to evaluate possible inventory decisions before applying them to real operational data.

---

## 6. System Architecture Overview

StockPilot is divided into several major technical layers:

```text
User
 │
 ▼
Frontend
 │
 │ HTTP / API / Realtime
 ▼
Backend
 │
 ├── PostgreSQL
 │
 ├── Redis
 │
 ├── Background Workers
 │
 └── ML Service
        │
        ├── Forecasting
        ├── Anomaly Detection
        ├── Supplier Risk
        ├── Recommendations
        └── Simulation
```

### Frontend

The frontend provides the user-facing application.

Primary responsibilities:

- Rendering application pages.
- Managing UI state.
- Calling backend APIs.
- Displaying inventory information.
- Displaying analytics and intelligence.
- Handling user interactions.
- Providing charts and dashboards.

---

### Backend

The backend is responsible for:

- Business logic.
- API handling.
- Authentication.
- Authorization.
- Database access.
- Inventory operations.
- Product management.
- Supplier management.
- Order management.
- Communication with the ML service.
- Background job coordination.
- Realtime events.

---

### Database

PostgreSQL is the primary persistent data store.

Prisma is used for database schema management and application-level database access.

---

### Redis

Redis is used for capabilities that require fast temporary state and asynchronous processing.

Primary use cases include:

- Caching.
- Queue infrastructure.
- Background job coordination.
- Temporary application state where required.

---

### ML Service

The ML service is isolated from the main application backend.

It provides intelligence capabilities such as:

- Demand forecasting.
- Anomaly detection.
- Supplier risk scoring.
- Recommendation generation.
- Scenario simulation.

The service exposes APIs that the backend can consume.

---

### Workers

Background workers handle operations that should not block normal API requests.

Examples include:

- Forecast generation.
- Inventory synchronization.
- Recommendation processing.
- Notifications.
- Other asynchronous workloads.

---

## 7. Primary Technology Areas

### Frontend

```text
Next.js
TypeScript
React
```

The frontend uses `.tsx` for React components and `.ts` for TypeScript-only modules.

---

### Backend

```text
Node.js
Express.js
TypeScript
```

The backend uses `.ts` for application source files.

---

### Database

```text
PostgreSQL
Prisma
```

Database structure is defined through Prisma and migration files.

---

### Cache / Queue Infrastructure

```text
Redis
BullMQ
```

Redis provides the underlying infrastructure for caching and asynchronous job processing.

---

### Realtime Communication

```text
Socket.IO
```

Realtime functionality is used where the product requires live application updates.

---

### ML / Intelligence

```text
Python
FastAPI
```

The ML service uses `.py` files.

---

## 8. Repository Structure

The repository is organized into the following major areas:

```text
stockpilot/
│
├── docs/
├── frontend/
├── backend/
├── ml-service/
├── prisma/
├── database/
├── tests/
├── scripts/
├── infrastructure/
└── tools/
```

Each directory has a specific responsibility.

The complete structure is defined in:

`docs/14-File-Architecture.md`

---

## 9. Intelligence Architecture

StockPilot's intelligence layer is separated from the main transactional backend.

The ML service contains the following major intelligence domains:

```text
ml-service/
│
├── forecasting/
├── anomaly_detection/
├── supplier_risk/
├── recommendations/
└── simulation/
```

Each intelligence domain follows an appropriate internal pipeline.

For example:

```text
Raw Data
   │
   ▼
Validation
   │
   ▼
Preprocessing
   │
   ▼
Feature Engineering
   │
   ▼
Model
   │
   ▼
Inference
   │
   ▼
Evaluation
   │
   ▼
Result
```

The specific implementation is defined in `08-AI.md`.

---

## 10. Testing Architecture

StockPilot testing is divided into multiple levels.

### Unit Tests

Test individual functions, services, utilities, and isolated business logic.

### Integration Tests

Test interactions between:

- API and database.
- API and Redis.
- Backend and ML service.
- Repositories and PostgreSQL.
- Background workers and queues.

### E2E Tests

Test complete user workflows from the frontend.

Examples:

```text
Login
   ↓
Dashboard
   ↓
Inventory
   ↓
Inventory Adjustment
   ↓
Updated Inventory
```

### Security Tests

Test:

- Authentication.
- Authorization.
- Ownership.
- Input validation.
- Privilege escalation.
- Invalid tokens.
- Protected endpoints.

### Performance Tests

Test:

- API latency.
- Database performance.
- Concurrent inventory operations.
- Forecasting latency.
- High-volume inventory operations.

---

## 11. Security Principles

StockPilot follows these core security principles:

1. Authentication must be enforced for protected operations.
2. Authorization must be checked independently of authentication.
3. Users must only access resources they are authorized to access.
4. Input must be validated before business logic executes.
5. Sensitive credentials must never be committed to the repository.
6. Errors must not expose sensitive internal information.
7. AI/ML outputs must not automatically be treated as authoritative business actions.
8. High-impact recommendations should provide sufficient evidence for users to evaluate them.

Detailed security requirements are defined in `07-Security.md`.

---

## 12. Business Rules

Business rules are maintained separately from implementation logic.

Important areas include:

- Inventory quantity consistency.
- Inventory movement validity.
- Transfer validity.
- Reservation rules.
- Order status transitions.
- Stockout conditions.
- Overstock conditions.
- Forecast validity.
- Recommendation validity.
- Risk severity.
- Resource ownership.

The authoritative business-rule definitions belong in:

`09-Rules.md`

---

## 13. Implementation Principle

StockPilot should be implemented incrementally.

The repository architecture describes the intended final system, but implementation should not create every file immediately.

A file should be created when:

- Its corresponding feature is being implemented.
- Its dependency is required.
- Its architectural boundary has been established.
- Its tests are being introduced.

Do not create speculative code simply to make the repository look complete.

---

## 14. Implementation Flow

The implementation should generally progress through:

```text
Requirements
     ↓
Architecture
     ↓
Database
     ↓
Backend Foundation
     ↓
Authentication
     ↓
Core Inventory Domains
     ↓
Frontend Foundation
     ↓
Operational UI
     ↓
Background Processing
     ↓
ML Service
     ↓
Intelligence Features
     ↓
Realtime Features
     ↓
Testing
     ↓
Performance
     ↓
Deployment
```

The exact sequence is defined in:

`17-Implementation-Order.md`

---

## 15. Documentation Rules

Every major architectural or product decision should have a traceable source.

When introducing a new:

- Feature
- Technology
- Database entity
- API endpoint
- Service
- Background worker
- ML capability
- Security mechanism
- Architectural pattern

the relevant documentation must be updated.

Documentation must not describe functionality that does not exist or has not been approved.

---

## 16. Change Management

Changes to StockPilot should follow this sequence:

```text
Proposed Change
      ↓
Impact Analysis
      ↓
Relevant Documentation Update
      ↓
Architecture Decision / RFC if Required
      ↓
Implementation
      ↓
Testing
      ↓
Verification
```

Large architectural changes should not be introduced directly into implementation without documenting their rationale.

---

## 17. Important Architectural Boundary

The following separation must remain clear:

```text
Frontend
    ↓
Backend API
    ↓
Business Logic
    ↓
Database / Redis / Workers
    ↓
ML Service
```

The frontend should not directly access the database.

The frontend should not directly communicate with internal ML implementation details.

The ML service should not become the primary owner of transactional inventory data.

The backend remains responsible for authoritative business operations.

The ML service provides intelligence that supports those operations.

---

## 18. Final Source of Truth

For implementation, use the documentation in this order:

```text
PRD
 ↓
Features
 ↓
Architecture
 ↓
Database
 ↓
API
 ↓
Security
 ↓
AI
 ↓
Rules
 ↓
Phases
 ↓
Design
 ↓
Testing
 ↓
Deployment
 ↓
File Architecture
 ↓
Architecture Decisions
 ↓
RFCs
 ↓
Implementation Order
```

If an implementation idea conflicts with these documents, stop and resolve the conflict before coding.

**StockPilot should be built from documented decisions, not from assumptions made during implementation.**
