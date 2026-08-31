# StockPilot — System Architecture

**Document:** `ARCHITECTURE.md`  
**Project:** StockPilot  
**Document Type:** System Architecture  
**Status:** Draft  
**Version:** 1.0

---

# 1. Purpose

This document defines the architectural structure and engineering boundaries of StockPilot.

The architecture is designed around one primary principle:

> **Build a reliable operational system first, then build intelligence on top of reliable operational data.**

StockPilot is not architected as an AI application with an inventory feature attached to it.

It is an operational inventory platform with an intelligence layer.

The system therefore separates:

- Operational workflows
- Domain logic
- Data persistence
- Analytical processing
- Intelligence
- Decision support
- Real-time communication
- External interactions

---

# 2. Architectural Goals

The architecture must support:

1. Strong inventory correctness.
2. Clear domain boundaries.
3. Secure access control.
4. Concurrent inventory operations.
5. Reliable order and fulfillment workflows.
6. Historical operational data.
7. Analytics and reporting.
8. Demand forecasting.
9. Anomaly detection.
10. Risk analysis.
11. Explainable recommendations.
12. Scenario simulation.
13. Real-time operational visibility where required.
14. Testability.
15. Maintainability.
16. Future scalability without premature complexity.

---

# 3. Architectural Principles

## 3.1 Correctness Before Intelligence

The inventory system must be reliable before intelligence features are considered production-ready.

A forecasting model cannot compensate for incorrect inventory data.

---

## 3.2 Domain Rules Must Be Explicit

Important business rules must live in clearly defined application/domain boundaries.

Business logic must not be scattered across:

- UI components.
- Controllers.
- Database queries.
- Background jobs.
- Utility functions.

---

## 3.3 Backend Is the Operational Authority

The backend must be responsible for enforcing:

- Business rules.
- Authorization.
- Inventory invariants.
- State transitions.
- Data validation.
- Transactional correctness.

The frontend must not be treated as a security or correctness boundary.

---

## 3.4 Intelligence Must Be Decoupled From Transactions

Forecasting, anomaly detection, risk analysis, and recommendations must not directly compromise core inventory transactions.

An intelligence failure should not corrupt operational state.

---

## 3.5 Recommendations Are Not Actions

The architecture must distinguish between:

```text
Recommendation
      ↓
Human Review
      ↓
Approval
      ↓
Operational Action
```

A generated recommendation must not automatically become an operational mutation unless explicit automation rules have been designed and approved.

---

## 3.6 Simulation Must Be Isolated

Scenario simulations must operate against an isolated representation of operational state.

Simulation must never accidentally mutate production inventory.

---

## 3.7 Technology Must Follow Architecture

Technology choices must be derived from approved requirements and architectural decisions.

This document intentionally does not introduce technologies that have not been explicitly approved by the project's authoritative technical documentation.

---

# 4. High-Level Architecture

The conceptual StockPilot architecture is:

```text
                         ┌───────────────────────┐
                         │        Users          │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Presentation Layer  │
                         │                       │
                         │ Dashboard             │
                         │ Inventory              │
                         │ Orders                 │
                         │ Warehouses             │
                         │ Suppliers              │
                         │ Analytics              │
                         │ Intelligence           │
                         │ Simulation              │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Application/API     │
                         │       Boundary        │
                         └───────────┬───────────┘
                                     │
                                     ▼
              ┌──────────────────────────────────────────┐
              │              Operational Layer            │
              │                                          │
              │ Authentication & Authorization            │
              │ Product Management                        │
              │ Warehouse Management                      │
              │ Inventory Management                      │
              │ Order Management                          │
              │ Supplier Management                       │
              │ Procurement                               │
              └───────────────────┬──────────────────────┘
                                  │
                                  ▼
              ┌──────────────────────────────────────────┐
              │             Domain / Business            │
              │                 Logic                    │
              │                                          │
              │ Inventory Invariants                     │
              │ Reservation Rules                        │
              │ Order State Transitions                  │
              │ Warehouse Transfers                      │
              │ Business Rules                           │
              └───────────────────┬──────────────────────┘
                                  │
                                  ▼
              ┌──────────────────────────────────────────┐
              │              Data Layer                  │
              │                                          │
              │ Operational State                        │
              │ Historical Records                       │
              │ Audit Information                        │
              │ Analytical Data                           │
              └───────────────────┬──────────────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  │                                │
                  ▼                                ▼
       ┌──────────────────────┐        ┌──────────────────────┐
       │ Analytics / Data     │        │ Operational Events   │
       │ Processing           │        │ / Background Work    │
       └──────────┬───────────┘        └──────────┬───────────┘
                  │                                │
                  └───────────────┬────────────────┘
                                  ▼
                    ┌────────────────────────────┐
                    │    Intelligence Layer      │
                    │                            │
                    │ Demand Forecasting         │
                    │ Anomaly Detection          │
                    │ Risk Analysis              │
                    │ Recommendation Engine      │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │     Decision Support       │
                    │                            │
                    │ Recommendations             │
                    │ Scenario Simulation         │
                    │ Scenario Comparison         │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                            Human Decision
                                   │
                                   ▼
                         Operational Execution
```

---

# 5. Architectural Layers

StockPilot is organized conceptually into several layers.

## 5.1 Presentation Layer

Responsible for presenting system capabilities to users.

Responsibilities include:

- User interaction.
- Navigation.
- Forms.
- Tables.
- Dashboards.
- Charts.
- Alerts.
- Recommendation interfaces.
- Scenario interfaces.

The presentation layer must not independently implement authoritative business rules.

---

# 6. Application/API Boundary

The application/API layer provides the interface between clients and the operational system.

Responsibilities include:

- Request handling.
- Input validation.
- Authentication context.
- Authorization checks.
- Request orchestration.
- Response formatting.
- Error handling.

This layer should delegate business behavior to appropriate application/domain components.

It should not become a dumping ground for business logic.

---

# 7. Operational Domain Layer

The operational layer contains the core business capabilities of StockPilot.

Major domains include:

```text
Users
Products
Warehouses
Inventory
Orders
Suppliers
Procurement
```

Each domain should have clearly defined responsibilities and relationships.

---

# 8. Product Domain

The Product domain is responsible for product identity and configuration.

Responsibilities:

- Product creation.
- Product updates.
- Product retrieval.
- Product status.
- Product categorization.
- Product search.

The Product domain should not directly own inventory behavior.

Inventory belongs to the Inventory domain.

---

# 9. Warehouse Domain

The Warehouse domain represents physical or logical inventory locations.

Responsibilities:

- Warehouse identity.
- Warehouse configuration.
- Warehouse status.
- Warehouse-related operational information.

Inventory quantities associated with warehouses belong to the Inventory domain.

---

# 10. Inventory Domain

The Inventory domain is the most critical operational domain in StockPilot.

Responsibilities include:

- Inventory state.
- Available quantity.
- Reserved quantity.
- Stock receipt.
- Stock adjustment.
- Inventory movement.
- Warehouse transfer.
- Reservation.
- Reservation release.
- Inventory history.

Inventory correctness must be enforced here and at the persistence/transaction boundary where necessary.

---

# 11. Inventory Invariants

The Inventory domain must maintain explicit invariants.

Examples:

## Invariant A

Inventory quantities must remain valid according to the defined business rules.

## Invariant B

Reserved inventory cannot exceed the inventory that is legitimately available for reservation.

## Invariant C

A warehouse transfer must preserve the overall inventory relationship between source and destination.

## Invariant D

Unauthorized users cannot perform protected inventory operations.

## Invariant E

Concurrent operations must not result in invalid inventory state.

---

# 12. Order Domain

The Order domain manages the lifecycle of customer or operational orders.

Responsibilities include:

- Order creation.
- Order retrieval.
- Order state.
- Order confirmation.
- Inventory reservation interaction.
- Processing.
- Fulfillment.
- Cancellation.

Order state transitions must be explicit.

Example:

```text
Created
   ↓
Confirmed
   ↓
Reserved
   ↓
Processing
   ↓
Fulfilled
```

Alternative valid paths must be defined by the business rules.

---

# 13. Supplier Domain

The Supplier domain manages supplier-related information.

Responsibilities include:

- Supplier identity.
- Supplier status.
- Supplier-product relationships.
- Lead-time information.
- Supplier performance information.

Supplier information becomes an input to the intelligence layer.

---

# 14. Procurement Domain

The Procurement domain represents replenishment-related operations.

It may consume information from:

- Inventory.
- Demand forecasting.
- Supplier performance.
- Risk analysis.
- Recommendations.

Procurement actions must remain separate from recommendation generation.

---

# 15. Authentication and Authorization Boundary

Authentication determines who the user is.

Authorization determines what the user can do.

The architecture must ensure that authorization is enforced on protected backend operations.

Conceptually:

```text
User Request
     ↓
Authentication
     ↓
Authorization
     ↓
Permission Check
     ↓
Business Operation
```

The frontend may hide unavailable actions for usability, but backend authorization remains authoritative.

---

# 16. Data Layer

The data layer provides persistence for operational and historical information.

The exact database technology and schema must be defined in the authoritative technical architecture and data model documentation.

The data layer should support the requirements for:

- Transactional consistency.
- Relationships.
- Constraints.
- Historical records.
- Querying.
- Indexing.
- Auditing.
- Analytical data access.

---

# 17. Operational Data vs Analytical Data

The architecture should distinguish between data required to operate the business and data used to analyze the business.

Conceptually:

```text
Operational Data
      ↓
Validated Historical Data
      ↓
Analytical Processing
      ↓
Intelligence
```

The intelligence layer must not treat raw, potentially inconsistent input as unquestioned truth.

---

# 18. Data Flow

The primary operational data flow is:

```text
User
  ↓
Application/API
  ↓
Business Logic
  ↓
Validation
  ↓
Operational Transaction
  ↓
Persistent State
  ↓
Operational Event / Historical Record
  ↓
Analytics / Intelligence
```

The resulting intelligence may produce:

```text
Forecast
   ↓
Risk
   ↓
Recommendation
   ↓
Human Review
   ↓
Operational Action
```

---

# 19. Event and Background Processing

StockPilot may require background processing for operations that should not block synchronous user interactions.

Potential workloads include:

- Analytical processing.
- Forecast generation.
- Anomaly detection.
- Risk calculation.
- Recommendation generation.
- Notifications.
- Data preparation.

The exact event-processing technology must follow the approved architecture.

---

# 20. Event Design Principles

Operational events should represent meaningful business facts.

Examples:

```text
InventoryReceived
InventoryAdjusted
InventoryTransferred
InventoryReserved
InventoryReservationReleased
OrderCreated
OrderConfirmed
OrderFulfilled
OrderCancelled
```

The final event vocabulary must be defined as part of the detailed system design.

Events should not be created merely because a database row changed.

They should represent meaningful business occurrences.

---

# 21. Idempotency

Operations that may be retried or processed more than once must have appropriate idempotency behavior.

This is particularly important for:

- Inventory operations.
- Order processing.
- Event processing.
- Background jobs.
- External interactions.

A retry must not accidentally create duplicate business effects.

---

# 22. Concurrency Architecture

StockPilot must assume concurrent access.

Potential concurrent operations include:

```text
User A → Reserve Inventory
User B → Reserve Inventory

Warehouse A → Transfer Inventory
Warehouse B → Update Inventory

Order Process → Inventory Update
Background Process → Read Operational State
```

Concurrency control must preserve business invariants.

The exact implementation mechanism must be defined by the approved data and backend architecture.

---

# 23. Intelligence Layer

The intelligence layer consumes trusted operational information and produces analytical outputs.

Its major components are:

```text
Demand Forecasting
Anomaly Detection
Risk Analysis
Recommendation Engine
```

---

# 24. Demand Forecasting Component

The forecasting component estimates future demand.

Input:

```text
Historical Demand
Inventory History
Relevant Operational Data
```

Processing:

```text
Data Preparation
      ↓
Feature Generation
      ↓
Forecasting
      ↓
Evaluation
```

Output:

```text
Expected Demand
+
Forecast Horizon
+
Uncertainty / Confidence where supported
```

The forecasting system must be evaluated against actual historical outcomes.

---

# 25. Anomaly Detection Component

The anomaly detection component identifies unusual patterns.

Potential inputs:

- Inventory movements.
- Demand.
- Orders.
- Warehouse operations.
- Supplier behavior.

Output:

```text
Anomaly Signal
+
Severity
+
Supporting Evidence
```

An anomaly must be treated as a signal for investigation, not automatically as proof of wrongdoing.

---

# 26. Risk Analysis Component

The risk layer combines relevant signals.

Conceptually:

```text
Inventory State
       +
Demand Forecast
       +
Supplier Information
       +
Historical Behavior
       +
Business Rules
       ↓
Risk Evaluation
```

Potential outputs:

- Stockout risk.
- Overstock risk.
- Supplier risk.
- Demand risk.
- Operational risk.

---

# 27. Recommendation Engine

The recommendation engine converts relevant intelligence into proposed actions.

Conceptually:

```text
Operational State
       +
Forecast
       +
Risk
       +
Business Rules
       +
Relevant Constraints
       ↓
Recommendation
```

A recommendation should contain sufficient context for the user to understand why it exists.

---

# 28. Explainability

The architecture must preserve the relationship between:

```text
Recommendation
      ↓
Supporting Factors
      ↓
Underlying Data
```

Where practical, a user should be able to determine:

- What the system recommends.
- Why it recommends it.
- Which factors influenced the recommendation.
- What uncertainty exists.
- What the potential impact may be.

---

# 29. Decision Support Layer

The decision-support layer sits between intelligence and operational execution.

Its responsibilities include:

- Presenting recommendations.
- Supporting human review.
- Supporting scenario analysis.
- Comparing possible actions.
- Capturing decisions.

Conceptually:

```text
Intelligence
     ↓
Decision Support
     ↓
Human Review
     ↓
Approval
     ↓
Operational Execution
```

---

# 30. Scenario Simulation Architecture

The scenario system must operate independently from production operational state.

Conceptually:

```text
Current Operational State
          ↓
      Snapshot / Model
          ↓
     Scenario Inputs
          ↓
       Simulation
          ↓
     Projected Results
```

The simulation must not directly mutate production inventory.

---

# 31. Scenario Isolation

A scenario may modify:

- Demand assumptions.
- Supplier lead times.
- Inventory quantities.
- Reorder decisions.
- Warehouse conditions.

Those modifications exist only within the simulation context until an explicit human decision is made.

---

# 32. Real-Time Architecture

Real-time functionality should be based on meaningful operational events.

Conceptually:

```text
Operational Change
       ↓
Business Event
       ↓
Event Distribution
       ↓
Realtime Consumer
       ↓
Connected Client
       ↓
Updated UI
```

The exact real-time transport must follow the approved technical architecture.

---

# 33. Failure Isolation

A major architectural principle is failure containment.

For example:

```text
Forecasting Failure
       ↓
Recommendation unavailable
       ↓
Inventory Operations Continue
```

Not:

```text
Forecasting Failure
       ↓
Entire Inventory System Unavailable
```

Intelligence services should therefore fail independently where practical.

---

# 34. Transaction Boundaries

Operations that must succeed or fail together should have explicit transactional boundaries.

Examples include:

### Inventory Reservation

```text
Validate Availability
      ↓
Reserve Inventory
      ↓
Persist Reservation
```

### Warehouse Transfer

```text
Validate Source
      ↓
Reduce Source Inventory
      ↓
Increase Destination Inventory
      ↓
Record Transfer
```

### Order Fulfillment

```text
Validate Order State
      ↓
Validate Reservation
      ↓
Complete Fulfillment
      ↓
Update Relevant Inventory State
      ↓
Record Operational Event
```

The exact transaction design must be defined in the implementation architecture.

---

# 35. API Architecture

The API should expose business capabilities rather than arbitrary database operations.

Bad abstraction:

```text
POST /updateInventoryRow
```

Preferred conceptual abstraction:

```text
Receive Inventory
Reserve Inventory
Transfer Inventory
Adjust Inventory
Fulfill Order
```

The API should reflect meaningful business actions where appropriate.

---

# 36. Validation Architecture

Validation should exist at multiple boundaries.

```text
Client Validation
       ↓
API Validation
       ↓
Business Rule Validation
       ↓
Persistence Constraints
```

Client-side validation improves user experience.

Backend validation provides authoritative enforcement.

Persistence constraints provide an additional layer of data integrity.

---

# 37. Error Architecture

Errors should be categorized appropriately.

Potential categories:

- Authentication errors.
- Authorization errors.
- Validation errors.
- Not-found errors.
- Conflict errors.
- Business-rule violations.
- Infrastructure failures.
- External dependency failures.

Errors exposed to users should be understandable without exposing sensitive implementation details.

---

# 38. Audit Architecture

Important operations should produce audit information.

Conceptually:

```text
User / System Process
       ↓
Business Operation
       ↓
State Change
       ↓
Audit Record
```

Audit records should provide sufficient information to understand important historical actions.

---

# 39. Observability Architecture

The architecture should make important failures observable.

Relevant areas include:

- API failures.
- Business-operation failures.
- Database failures.
- Background processing failures.
- Intelligence failures.
- Event-processing failures.
- Performance issues.

Observability implementation must follow the approved technical stack.

---

# 40. Security Architecture

Security must be applied throughout the system.

Security boundaries include:

```text
User
 ↓
Authentication
 ↓
Authorization
 ↓
API
 ↓
Business Logic
 ↓
Data Access
```

Security responsibilities must not be concentrated solely in the frontend.

---

# 41. Scalability Strategy

StockPilot should scale according to actual requirements.

The architecture should allow future scaling of:

- API workloads.
- Background processing.
- Analytical processing.
- Intelligence workloads.
- Real-time connections.
- Data access.

However, scalability must not be used as justification for introducing unnecessary distributed complexity before it is required.

---

# 42. Consistency Strategy

Different system operations may have different consistency requirements.

### Critical Transactional State

Inventory and order state require strong correctness.

### Analytical Data

Analytics may tolerate controlled processing delays depending on the use case.

### Intelligence Results

Forecasts and recommendations may be generated asynchronously.

Therefore:

> **Not every piece of data needs identical consistency guarantees, but critical operational state must remain authoritative and correct.**

---

# 43. Security and Data Access Rules

Data access must respect:

- User identity.
- User role.
- Organizational boundaries where applicable.
- Resource ownership where applicable.
- Operational permissions.

A user must not gain access merely because an identifier is known.

Authorization must be evaluated against the actual resource and operation.

---

# 44. Frontend Architecture Principles

The frontend should be organized around business capabilities rather than arbitrary UI screens.

Conceptual areas include:

```text
Authentication
Dashboard
Products
Warehouses
Inventory
Orders
Suppliers
Analytics
Intelligence
Recommendations
Simulation
Administration
```

Reusable UI components should support consistency without moving business-critical logic into presentation components.

---

# 45. Backend Architecture Principles

The backend should maintain clear separation between:

```text
API / Transport
      ↓
Application Logic
      ↓
Domain / Business Logic
      ↓
Persistence
```

The exact implementation pattern must follow the approved engineering architecture.

---

# 46. Intelligence Boundary

The intelligence system should consume operational data through clearly defined interfaces.

Conceptually:

```text
Operational System
        ↓
Data Extraction / Preparation
        ↓
Intelligence Processing
        ↓
Intelligence Result
        ↓
Application / Decision Support
```

The intelligence layer should not directly manipulate core inventory state.

---

# 47. Recommendation-to-Execution Boundary

Recommendations should be separated from execution.

```text
Recommendation Service
        ↓
Recommendation Record
        ↓
User Review
        ↓
Approval
        ↓
Application Command
        ↓
Business Validation
        ↓
Operational Transaction
```

Even after approval, the operational layer must revalidate the action.

An old recommendation must not bypass current inventory rules.

---

# 48. Data Lifecycle

The conceptual data lifecycle is:

```text
Created
  ↓
Validated
  ↓
Persisted
  ↓
Used Operationally
  ↓
Historically Recorded
  ↓
Analyzed
  ↓
Used for Intelligence
  ↓
Produces Decision Support
  ↓
Decision Creates New Operational Data
```

This creates a continuous feedback loop.

---

# 49. Architectural Feedback Loop

The final architecture can be understood as:

```text
                  ┌───────────────────┐
                  │ Operational State │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Historical Data   │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │    Analytics      │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   Intelligence    │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Recommendations   │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Human Decision    │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Operational Action│
                  └─────────┬─────────┘
                            │
                            └───────────────┐
                                            ▼
                                  New Operational State
```

This loop represents the core architecture of StockPilot.

---

# 50. Architectural Risks

## 50.1 Premature Distributed Architecture

Introducing distributed components before they are necessary can increase operational and debugging complexity.

**Principle:** Introduce distributed behavior when the requirements justify it.

---

## 50.2 Intelligence Coupled to Transactions

If model failures can block or corrupt core inventory operations, the architecture is unsafe.

**Principle:** Isolate intelligence from critical transactions.

---

## 50.3 Business Logic in the Frontend

This creates security and consistency problems.

**Principle:** Backend/domain rules remain authoritative.

---

## 50.4 Database as Business Logic

A system that relies entirely on database operations without explicit business boundaries becomes difficult to reason about.

**Principle:** Domain rules must be explicit.

---

## 50.5 AI Without Traceability

Recommendations that cannot explain their relevant inputs are difficult to trust.

**Principle:** Preserve recommendation context and supporting factors.

---

## 50.6 Simulation Contaminating Production State

This could create severe operational errors.

**Principle:** Simulation must be isolated.

---

# 51. Architecture Decision Process

When a new architectural decision is required, follow:

```text
Requirement
    ↓
Problem Definition
    ↓
Constraints
    ↓
Candidate Solutions
    ↓
Trade-off Analysis
    ↓
Decision
    ↓
Documentation
    ↓
Implementation
    ↓
Validation
```

Technology should be selected only after understanding the actual problem.

---

# 52. Technology Governance

This architecture document intentionally avoids declaring technologies that have not been approved by the project's source-of-truth documentation.

The following categories must be explicitly defined elsewhere before implementation decisions are finalized:

- Frontend framework.
- Backend framework.
- Primary database.
- Cache technology.
- Messaging/event technology.
- Real-time transport.
- ML tooling.
- Infrastructure.
- Containerization.
- CI/CD.
- Observability.
- Testing frameworks.

No technology should be added simply because it is common in comparable projects.

---

# 53. Architecture Evolution

The architecture is expected to evolve as StockPilot develops.

However, changes must follow controlled evolution.

A proposed architectural change should answer:

1. What problem does it solve?
2. Why is the existing architecture insufficient?
3. What complexity does it introduce?
4. What alternatives were considered?
5. What are the operational consequences?
6. How will the change be tested?
7. Does it affect existing guarantees?

Architecture should evolve because requirements demand it, not because a newer technology exists.

---

# 54. Phase-Based Architecture Evolution

The architecture should evolve approximately as follows:

```text
Phase 1
Basic Application Foundation
        ↓
Phase 2
Operational Domain Architecture
        ↓
Phase 3
Transactional Inventory Architecture
        ↓
Phase 4
Order & Procurement Architecture
        ↓
Phase 5
Event / Realtime Architecture
        ↓
Phase 6
Data & Intelligence Architecture
        ↓
Phase 7
Simulation Architecture
        ↓
Phase 8
Production Architecture
```

Each stage should preserve the correctness guarantees established by earlier stages.

---

# 55. Architecture Validation

Architecture validation should verify:

- Domain boundaries.
- Data ownership.
- Authorization boundaries.
- Transaction boundaries.
- Concurrency behavior.
- Failure isolation.
- Event behavior.
- Intelligence isolation.
- Simulation isolation.
- API contracts.
- Security boundaries.

A diagram alone is not proof that the architecture works.

Architecture must be validated through implementation and testing.

---

# 56. Definition of Architectural Completion

The StockPilot architecture is considered sufficiently mature when:

- Core domains have clear ownership.
- Business rules have clear locations.
- Data ownership is defined.
- Critical transactions are defined.
- Concurrency requirements are understood.
- API boundaries are established.
- Intelligence boundaries are established.
- Simulation isolation is established.
- Security boundaries are defined.
- Failure behavior is understood.
- Technology decisions are explicitly documented.
- The architecture matches the actual implementation.

---

# 57. Final Architecture Principle

StockPilot should be architected as a layered decision-support platform:

```text
┌─────────────────────────────────────────┐
│              Presentation               │
├─────────────────────────────────────────┤
│            Application / API            │
├─────────────────────────────────────────┤
│          Operational Domains            │
├─────────────────────────────────────────┤
│        Domain / Business Rules           │
├─────────────────────────────────────────┤
│              Data Layer                 │
├─────────────────────────────────────────┤
│       Analytics / Data Processing       │
├─────────────────────────────────────────┤
│           Intelligence Layer            │
├─────────────────────────────────────────┤
│         Decision Support Layer           │
├─────────────────────────────────────────┤
│        Human Approval / Action           │
└─────────────────────────────────────────┘
```

The architectural priority is:

**Correctness → Security → Reliability → Maintainability → Scalability → Intelligence**

StockPilot should become sophisticated by building on a strong foundation, not by hiding a weak foundation behind sophisticated technology.

---

# 58. Document Authority

This document defines the conceptual and architectural boundaries of StockPilot.

It does not override the Product Requirements Document, feature specification, or future approved technical decision records.

Any technology-specific architecture must be added only after the technology has been explicitly approved as part of the project's authoritative technical documentation.

If an architectural assumption conflicts with an approved project decision, the approved decision takes precedence and this document must be updated accordingly.