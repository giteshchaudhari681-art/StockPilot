StockPilot — Architecture Decision Records
Document: ARD.md
Project: StockPilot
Document Type: Architecture Decision Record
Status: Draft
Version: 1.0
1. Purpose
This document records the significant architectural decisions made for StockPilot.
The purpose of an Architecture Decision Record is to preserve:
- What decision was made.
- Why it was made.
- What alternatives were considered.
- What consequences the decision creates.
- What constraints future development must respect.
Architecture decisions should not exist only in conversations or individual developers' memory.
2. Architecture Decision Principles
StockPilot follows these principles:
1. Prefer the simplest architecture that satisfies the requirements.
2. Do not introduce technology without a demonstrated need.
3. Protect operational data integrity above feature velocity.
4. Keep business rules explicit and testable.
5. Keep security boundaries explicit.
6. Treat AI as a decision-support capability rather than an unrestricted authority.
7. Separate operational facts from predictions and simulations.
8. Prefer evidence over assumptions.
9. Avoid premature distributed-system complexity.
10. Revisit architectural decisions when new evidence justifies doing so.
3. Decision Status
Each architecture decision should use one of the following statuses:
PROPOSED
ACCEPTED
SUPERSEDED
REJECTED
DEPRECATED
PROPOSED
Decision is being considered but is not yet authoritative.
ACCEPTED
Decision is currently authoritative.
SUPERSEDED
A newer decision replaces this decision.
REJECTED
The option was evaluated and intentionally not selected.
DEPRECATED
The decision may still exist historically but should no longer guide new development.
4. Architecture Decision Format
Every significant decision should follow:
Decision ID:
Title:
Status:
Date:
Context:
Decision:
Alternatives:
Rationale:
Consequences:
Constraints:
Revisit Conditions:
5. ADR-001 — Architecture Must Follow the Product Requirements
Status: ACCEPTED
Context
StockPilot is intended to solve an inventory-management and inventory-intelligence problem.
Architecture should therefore be driven by:
- Product requirements.
- Business workflows.
- Data requirements.
- Security requirements.
- Testing requirements.
- Operational requirements.
Architecture must not be designed around a collection of technologies first.
Decision
The architecture will be derived from the project's authoritative product and engineering documentation.
The primary sources are:
PRD.md
Features.md
ARCHITECTURE.md
Database.md
API.md
Security.md
AI.md
Rules.md
Phases.md
Design.md
Testing.md
Deployment.md
Rationale
Technology-first architecture creates unnecessary complexity and makes the product serve the architecture rather than the other way around.
Consequences
Architecture changes must be evaluated against product requirements.
6. ADR-002 — Operational Data Is the Foundation of Intelligence
Status: ACCEPTED
Context
StockPilot contains forecasting, anomaly detection, risk detection, and recommendations.
These capabilities depend on reliable operational data.
Decision
The intelligence layer must depend on validated operational data rather than becoming an independent source of operational truth.
Conceptually:
Operational Data
      ↓
Validation
      ↓
Analytics
      ↓
Intelligence
Rationale
Predictive systems built on unreliable inventory data produce unreliable decisions.
Consequences
Data quality and operational correctness must be established before advanced intelligence is considered production-ready.
7. ADR-003 — Operational State and Derived Intelligence Must Be Separated
Status: ACCEPTED
Context
StockPilot produces several types of information:
- Actual operational state.
- Analytics.
- Predictions.
- Risks.
- Recommendations.
- Simulations.
These concepts have different levels of certainty and different consequences.
Decision
The architecture must distinguish:
FACT
PREDICTION
RISK
RECOMMENDATION
SIMULATION
Derived intelligence must not silently overwrite operational facts.
Rationale
A forecast is not an actual inventory value.
A recommendation is not an executed action.
A simulation is not a production state.
Consequences
Data models, APIs, UI, and business logic must preserve these distinctions.
8. ADR-004 — Business Rules Remain Authoritative
Status: ACCEPTED
Context
StockPilot may generate recommendations using predictive or AI-based functionality.
AI-generated output can be incorrect or incomplete.
Decision
AI and predictive outputs must pass through authoritative business rules before they can influence operational actions.
Conceptually:
AI / Prediction
      ↓
Output Validation
      ↓
Authorization
      ↓
Business Rules
      ↓
Current-State Validation
      ↓
Operational Action
Rationale
AI must not become a security or business-rule bypass.
Consequences
The AI layer cannot directly mutate critical operational state without the appropriate validation path.
9. ADR-005 — Backend Is the Security Boundary
Status: ACCEPTED
Context
Client-side interfaces can hide or show controls, but clients cannot be trusted.
Decision
Authorization and critical business validation must be enforced on the server-side/application boundary.
The frontend may improve user experience by hiding unauthorized actions, but it is not the security boundary.
Rationale
A malicious client can bypass UI restrictions.
Consequences
Every protected operation must be validated independently of frontend behavior.
10. ADR-006 — Resource-Level Authorization Is Required
Status: ACCEPTED
Context
Users may interact with specific resources such as:
- Products.
- Warehouses.
- Inventory records.
- Orders.
- Suppliers.
- Recommendations.
Having general authentication is insufficient.
Decision
Protected resource access must verify whether the authenticated user is authorized to access or modify the specific resource.
Rationale
Knowing a resource identifier must never automatically grant access to that resource.
Consequences
Resource-level authorization must be considered in API and service-layer design.
11. ADR-007 — Inventory Integrity Takes Priority Over Feature Velocity
Status: ACCEPTED
Context
Inventory is the operational foundation of StockPilot.
Incorrect inventory can cause downstream problems in:
- Orders.
- Forecasting.
- Risk detection.
- Recommendations.
- Reporting.
Decision
Inventory integrity is a higher priority than adding new functionality.
Critical inventory operations must protect:
- Quantity correctness.
- Reservation correctness.
- Transfer correctness.
- State consistency.
- Authorization.
- Concurrency safety.
Rationale
A system with many features but incorrect inventory data is fundamentally unreliable.
Consequences
Inventory operations receive stronger testing and architectural scrutiny.
12. ADR-008 — Critical Operations Must Preserve Atomic Business State
Status: ACCEPTED
Context
Some operations consist of multiple related changes.
For example:
Inventory Transfer
may involve:
Source Inventory
+
Destination Inventory
+
Movement Record
Decision
Operations representing a single logical business action must preserve a consistent final state.
If the operation fails, the system must not intentionally leave an invalid partial state.
Rationale
Partial business state can corrupt inventory and create difficult recovery problems.
Consequences
Transaction and consistency requirements must be considered for critical workflows.
13. ADR-009 — Concurrency Must Be Treated as a First-Class Concern
Status: ACCEPTED
Context
Multiple users may attempt to modify the same inventory or order simultaneously.
Example:
Available = 100

User A → Reserve 80
User B → Reserve 80
Decision
Critical inventory and order operations must be designed and tested for concurrent execution.
Rationale
Sequential correctness does not guarantee concurrent correctness.
Consequences
Concurrency testing is mandatory for relevant workflows.
14. ADR-010 — State Transitions Must Be Explicit
Status: ACCEPTED
Context
Orders and other operational entities have lifecycle states.
Decision
State transitions must be explicitly defined and validated.
Conceptually:
Created
   ↓
Confirmed
   ↓
Reserved
   ↓
Processing
   ↓
Fulfilled
Invalid transitions must be rejected.
Rationale
Implicit state changes create inconsistent business behavior.
Consequences
State-machine-like behavior should be represented clearly in domain logic and tests.
15. ADR-011 — Recommendations Are Decision Support, Not Commands
Status: ACCEPTED
Context
StockPilot may recommend actions such as:
- Reordering.
- Transferring inventory.
- Reviewing a supplier.
- Investigating a risk.
Decision
Recommendations remain suggestions until appropriately reviewed and executed through authorized operational workflows.
Rationale
A recommendation can become stale or incorrect as operational state changes.
Consequences
Recommendations require:
- Supporting evidence.
- Appropriate state management.
- Current-state validation.
- Authorization.
- Auditability where applicable.
16. ADR-012 — Recommendations Must Be Revalidated Before Execution
Status: ACCEPTED
Context
A recommendation may be generated at one point in time while inventory or orders change afterward.
Decision
The system must revalidate relevant current state before executing a recommendation.
Conceptually:
Recommendation Generated
        ↓
State Changes
        ↓
Recommendation Reviewed
        ↓
Current State Revalidated
        ↓
Execute or Reject
Rationale
Acting on stale information can produce incorrect operational decisions.
Consequences
Recommendation execution cannot rely exclusively on the state that existed when the recommendation was generated.
17. ADR-013 — Simulation Must Be Isolated From Production State
Status: ACCEPTED
Context
StockPilot supports scenario simulation.
A simulation may calculate what could happen if the user changes assumptions.
Decision
Simulation must never unintentionally mutate production operational state.
Conceptually:
Production State
      ↓
Scenario Copy / Representation
      ↓
Simulation
      ↓
Projected Result
Rationale
A hypothetical decision must not become a real operational change.
Consequences
Simulation workflows require explicit isolation and dedicated testing.
18. ADR-014 — Forecasts Are Derived Data
Status: ACCEPTED
Context
Forecasting produces estimates of future demand.
Decision
Forecasts are treated as derived information rather than operational facts.
Forecast records should preserve appropriate context such as:
- Forecast period.
- Generation time.
- Relevant product/resource.
- Forecast value.
- Method/model information where required.
- Uncertainty where supported.
Rationale
Users must be able to distinguish historical truth from estimated future behavior.
Consequences
Forecasts must not silently replace actual demand records.
19. ADR-015 — Forecasting Requires a Baseline
Status: ACCEPTED
Context
A sophisticated forecasting method is not automatically better than a simple method.
Decision
Forecasting approaches should be evaluated against an appropriate baseline.
Conceptually:
Baseline
   ↓
Measure
   ↓
Improved Method
   ↓
Measure
   ↓
Compare
Rationale
Complexity must produce measurable value.
Consequences
Forecasting development must include evaluation rather than model selection based only on sophistication.
20. ADR-016 — AI Output Must Be Validated
Status: ACCEPTED
Context
AI systems may generate malformed, unexpected, or incorrect output.
Decision
AI output must be validated before being consumed by downstream operational logic.
Validation may include:
- Schema validation.
- Type validation.
- Range validation.
- Business-rule validation.
- Authorization.
- Current-state validation.
Rationale
AI output cannot be assumed to be correct merely because it was generated successfully.
Consequences
AI functionality requires defensive boundaries.
21. ADR-017 — AI Must Fail Safely
Status: ACCEPTED
Context
AI or predictive services may become unavailable or return invalid results.
Decision
AI failure must not corrupt operational state.
The system should degrade safely where possible.
Conceptually:
AI Failure
    ↓
Safe Failure / Fallback
    ↓
Operational State Preserved
Rationale
Inventory management must not become dependent on perfect AI availability.
Consequences
AI functionality requires explicit failure-path testing.
22. ADR-018 — No Technology Is Introduced Without Justification
Status: ACCEPTED
Context
Modern software systems can accumulate unnecessary technologies quickly.
Decision
A technology should be introduced only when it solves a clearly identified problem that justifies its complexity.
Before introducing a technology, evaluate:
Problem
 ↓
Current Limitation
 ↓
Proposed Technology
 ↓
Benefit
 ↓
Complexity
 ↓
Operational Cost
 ↓
Decision
Rationale
Technology quantity is not engineering quality.
Consequences
The architecture should remain intentionally constrained.
23. ADR-019 — Avoid Premature Distributed-System Complexity
Status: ACCEPTED
Context
StockPilot may eventually require additional scale or asynchronous processing.
However, those requirements should not be assumed before they exist.
Decision
Distributed infrastructure should be introduced only when demonstrated requirements justify it.
Rationale
Distributed systems introduce additional complexity in:
- Deployment.
- Debugging.
- Data consistency.
- Observability.
- Failure handling.
- Development.
Consequences
The initial architecture should remain as simple as the requirements permit.
24. ADR-020 — Architecture Must Evolve From Evidence
Status: ACCEPTED
Context
The project may encounter requirements that the original architecture cannot efficiently satisfy.
Decision
Architecture should evolve when evidence demonstrates that the current design is insufficient.
Evidence may include:
- Measured performance limitations.
- Security requirements.
- Reliability problems.
- Scaling requirements.
- Maintainability problems.
- New product requirements.
Rationale
Architecture should respond to real constraints rather than hypothetical future problems.
Consequences
Architectural changes must document their reasoning.
25. ADR-021 — Testing Is Part of Architecture
Status: ACCEPTED
Context
Some StockPilot behavior cannot be considered reliable without appropriate testing.
Examples include:
- Inventory concurrency.
- Authorization.
- State transitions.
- Recommendation execution.
- Simulation isolation.
Decision
Architecture decisions must consider how important behavior will be tested.
Rationale
An architecture that cannot be reliably tested creates operational risk.
Consequences
Testability is a design requirement, not an afterthought.
26. ADR-022 — Critical Business Logic Must Not Exist Only in the UI
Status: ACCEPTED
Context
The UI may validate or restrict user actions for usability.
However, clients cannot be trusted.
Decision
Critical business rules must be enforced outside the UI.
Rationale
Users can bypass frontend validation by directly calling APIs or manipulating requests.
Consequences
Frontend validation is supplementary.
Backend/domain validation is authoritative.
27. ADR-023 — Operational Data Must Be Auditable Where Required
Status: ACCEPTED
Context
Inventory and order operations can have significant business consequences.
Decision
Important operational changes should provide appropriate historical traceability.
Examples include:
- Inventory movements.
- Important adjustments.
- Critical state changes.
- Recommendation execution.
Rationale
Without historical evidence, diagnosing errors and understanding operational changes becomes difficult.
Consequences
Audit/history requirements must be reflected in the data model and relevant workflows.
28. ADR-024 — Error Handling Must Preserve Business State
Status: ACCEPTED
Context
Failures are inevitable.
The dangerous failure is not merely returning an error.
The dangerous failure is returning an error after partially changing operational state.
Decision
Critical workflows must be designed so that failures preserve a valid business state.
Rationale
Users must be able to trust the system after an unsuccessful operation.
Consequences
Failure-path testing is required for critical workflows.
29. ADR-025 — Production Deployment Must Be Verified
Status: ACCEPTED
Context
A deployment command succeeding does not prove that the application is functioning correctly.
Decision
Deployment verification must include appropriate:
- Health checks.
- Smoke tests.
- Critical workflow checks.
- Error monitoring.
Rationale
Deployment success and application success are different conditions.
Consequences
Deployment is not complete until the running system is verified.
30. ADR-026 — Database Changes Require Explicit Review
Status: ACCEPTED
Context
Database changes can affect existing production data and application behavior.
Decision
Schema and data changes require explicit evaluation of:
- Existing data.
- Application compatibility.
- Migration behavior.
- Failure handling.
- Recovery.
Rationale
Database changes can be difficult or impossible to reverse safely.
Consequences
Database migrations receive higher scrutiny than ordinary code changes.
31. ADR-027 — Documentation Is Part of the Architecture
Status: ACCEPTED
Context
StockPilot contains multiple interconnected architectural decisions.
Decision
Important architectural behavior must be represented in the project's documentation.
Rationale
Undocumented architecture becomes dependent on individual memory and becomes difficult to maintain.
Consequences
Significant architectural changes must update relevant documentation.
32. ADR-028 — Specialized Documents Have Domain Authority
Status: ACCEPTED
Context
StockPilot contains multiple project documents.
Decision
Each specialized document is authoritative for its specific domain.
For example:
PRD.md
→ Product Requirements

Database.md
→ Data Model

API.md
→ API Contracts

Security.md
→ Security Requirements

AI.md
→ AI Architecture

Testing.md
→ Testing Strategy

Deployment.md
→ Deployment Strategy
Rationale
A single document should not attempt to contain every implementation detail.
Consequences
Cross-document consistency must be maintained.
33. ADR-029 — README Is an Entry Point, Not the Complete Specification
Status: ACCEPTED
Context
README documentation needs to remain readable.
Decision
README.md provides the project overview and navigation into specialized documentation.
Detailed technical decisions belong in their respective documents.
Rationale
A massive README becomes difficult to maintain and difficult for new developers to use.
Consequences
Developers should consult specialized documentation before making significant changes.
34. ADR-030 — Architecture Must Preserve Clear Boundaries
Status: ACCEPTED
Context
StockPilot contains several conceptual areas:
Operational Management
Analytics
Intelligence
Decision Support
Security
Decision
These areas should have clear responsibilities and interfaces.
Rationale
Clear boundaries reduce accidental coupling.
Consequences
A change in one area should not unnecessarily require changes throughout the system.
35. ADR-031 — Intelligence Must Not Become a Second Operational System
Status: ACCEPTED
Context
As StockPilot becomes more intelligent, it could become tempting to duplicate inventory or order logic inside the intelligence layer.
Decision
The intelligence layer should consume operational truth and produce derived insights or recommendations.
It should not create an independent competing source of operational state.
Rationale
Duplicated operational logic creates inconsistencies.
Consequences
Operational actions must ultimately pass through authoritative operational workflows.
36. ADR-032 — User Interface Must Reflect Business State
Status: ACCEPTED
Context
Users need to understand what actions are currently valid.
Decision
The UI should reflect:
- Current state.
- Available actions.
- Risk.
- Authorization.
- Processing state.
However, the UI must never be the final authority for those conditions.
Rationale
A state-aware UI improves usability while backend enforcement protects correctness.
Consequences
Frontend and backend behavior must remain consistent without making the frontend a security boundary.
37. ADR-033 — Progressive Complexity
Status: ACCEPTED
Context
StockPilot is planned to evolve from operational management into advanced intelligence.
Decision
Architectural complexity should increase progressively as product requirements increase.
Operational Foundation
        ↓
Analytics
        ↓
Prediction
        ↓
Risk
        ↓
Recommendations
        ↓
Simulation
        ↓
Advanced Intelligence
Rationale
The architecture should grow with demonstrated needs.
Consequences
Advanced infrastructure should not be implemented merely because it might be useful someday.
38. ADR-034 — Security, Testing, and Deployment Are Cross-Cutting Concerns
Status: ACCEPTED
Context
Security, testing, and deployment affect every major subsystem.
Decision
They must not be treated as isolated final-stage features.
They must be considered during feature design and implementation.
Rationale
Retrofitting security or testability after implementation is more expensive and less reliable.
Consequences
Each major feature should consider:
Security
+
Testability
+
Deployment
during development.
39. ADR-035 — Architecture Changes Require Evidence and Documentation
Status: ACCEPTED
Context
Architectural changes can create broad consequences.
Decision
A significant architecture change must document:
Problem
 ↓
Current Limitation
 ↓
Options
 ↓
Chosen Decision
 ↓
Tradeoffs
 ↓
Consequences
Rationale
This prevents architectural drift and undocumented decisions.
Consequences
New major architectural choices should receive an ADR before or alongside implementation.
40. Rejected Architecture Patterns
The following patterns are explicitly discouraged unless a future ADR provides evidence for reconsideration.
40.1 Technology-First Architecture
Technology
 ↓
Find a Problem
Rejected because:
Architecture should solve actual product problems.
40.2 AI-First Product Architecture
AI
 ↓
Build Everything Around AI
Rejected because:
AI depends on reliable operational data.
40.3 Frontend-Enforced Security
Hide Button
 ↓
Assume User Cannot Access API
Rejected because:
Clients are not trusted security boundaries.
40.4 Recommendation-as-Command
AI Recommendation
 ↓
Automatic Database Mutation
Rejected because:
Recommendations can become stale or incorrect and must pass through authoritative validation.
40.5 Simulation-as-Real-Data
Scenario
 ↓
Modify Production State
Rejected because:
Hypothetical analysis must remain isolated from operational state.
40.6 Premature Distributed Architecture
Multiple Services
+
Messaging
+
Infrastructure
+
Operational Complexity
before the requirements justify them.
Rejected because:
Complexity must be earned by demonstrated need.
41. Architecture Review Triggers
Architecture should be reviewed when:
- A major new capability is introduced.
- A core data model changes.
- A security boundary changes.
- A critical workflow changes.
- Performance requirements change significantly.
- Deployment requirements change.
- AI capabilities become operationally significant.
- A major external integration is introduced.
- Existing architecture becomes difficult to maintain.
42. ADR Lifecycle
The lifecycle is:
Identify Problem
      ↓
Research
      ↓
Evaluate Alternatives
      ↓
Write ADR
      ↓
Review
      ↓
Accept / Reject
      ↓
Implement
      ↓
Monitor Consequences
      ↓
Revisit if Necessary
43. ADR Numbering
Architecture decisions should use sequential identifiers:
ADR-001
ADR-002
ADR-003
...
Do not reuse an identifier.
If an existing decision changes, create a new ADR or explicitly supersede the previous one.
44. Superseding an ADR
When a decision becomes invalid:
Old Decision
    ↓
New Evidence
    ↓
New Decision
    ↓
Old ADR = SUPERSEDED
The old decision should remain available for historical context.
45. ADR Review Checklist
Before accepting an architectural decision, ask:
Problem
- Is the problem real?
Alternatives
- Were reasonable alternatives considered?
Complexity
- Does the decision introduce unnecessary complexity?
Security
- Does it create a new security risk?
Data
- Does it affect data integrity?
Testing
- Can the behavior be tested?
Operations
- Can it be deployed and operated reliably?
Maintainability
- Can future developers understand it?
Product
- Does it actually support the product requirements?
46. Current Architecture Principles Summary
The current StockPilot architecture is governed by:
                    ┌──────────────────────┐
                    │ Product Requirements │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Operational Truth    │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Business Rules       │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Analytics / AI       │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Recommendations      │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Validation           │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │ Authorized Action    │
                    └──────────────────────┘
Cross-cutting requirements:
Security
Testing
Data Integrity
Reliability
Observability
Deployment
Documentation
must apply throughout the system.
47. Architecture Decision Summary
The most important decisions are:
ID	Decision	Status
ADR-001	Architecture follows product requirements	Accepted
ADR-002	Operational data is the foundation of intelligence	Accepted
ADR-003	Facts and derived intelligence are separated	Accepted
ADR-004	Business rules remain authoritative	Accepted
ADR-005	Backend is the security boundary	Accepted
ADR-006	Resource-level authorization is required	Accepted
ADR-007	Inventory integrity takes priority	Accepted
ADR-008	Critical operations preserve atomic state	Accepted
ADR-009	Concurrency is a first-class concern	Accepted
ADR-010	State transitions are explicit	Accepted
ADR-011	Recommendations are decision support	Accepted
ADR-012	Recommendations are revalidated before execution	Accepted
ADR-013	Simulation is isolated from production	Accepted
ADR-014	Forecasts are derived data	Accepted
ADR-015	Forecasting requires a baseline	Accepted
ADR-016	AI output must be validated	Accepted
ADR-017	AI must fail safely	Accepted
ADR-018	Technologies require justification	Accepted
ADR-019	Avoid premature distributed complexity	Accepted
ADR-020	Architecture evolves from evidence	Accepted
ADR-021	Testing is part of architecture	Accepted
ADR-022	Critical business logic cannot exist only in UI	Accepted
ADR-023	Important operational changes are auditable	Accepted
ADR-024	Errors must preserve business state	Accepted
ADR-025	Production deployments must be verified	Accepted
ADR-026	Database changes require explicit review	Accepted
ADR-027	Documentation is part of architecture	Accepted
ADR-028	Specialized documents have domain authority	Accepted
ADR-029	README is an entry point	Accepted
ADR-030	Architecture preserves clear boundaries	Accepted
ADR-031	Intelligence is not a second operational system	Accepted
ADR-032	UI reflects business state	Accepted
ADR-033	Architecture grows progressively	Accepted
ADR-034	Security, testing, and deployment are cross-cutting	Accepted
ADR-035	Architecture changes require evidence	Accepted
ADR-036	Project license (Apache-2.0)	Accepted


## ADR: Project License

- **Decision ID:** ADR-036
- **Title:** Project Open-Source License
- **Status:** ACCEPTED
- **Decision Date:** 2026-08-29
- **License:** Apache License 2.0
- **Version:** 2.0
- **SPDX Identifier:** Apache-2.0

### Context
StockPilot is an inventory intelligence and decision-support platform combining operational inventory management with analytical forecasting, anomaly detection, risk evaluation, and scenario simulation. Establishing an explicit open-source license is required to legally govern the usage, modification, distribution, and contribution terms of the software.

### Decision
Adopt the **Apache License 2.0** (`SPDX: Apache-2.0`) as the official open-source license for the StockPilot project.

### Reason & Rationale
1. **Permissive Usage & Commercial Freedom:** Permits commercial use, modification, redistribution, private deployment, and proprietary enterprise integration without imposing copyleft source-disclosure obligations on custom connectors, private ERP integrations, or hosting operators.
2. **Contributor Patent License & Defense:** Provides an express contributor patent grant covering contributed code, alongside a defensive patent-litigation termination provision that protects the community and downstream users.
3. **Change Tracking & Attribution:** Requires modified files to carry prominent change notices, ensuring clarity and traceability across downstream distributions.
4. **Ecosystem Compatibility:** Directly compatible with the permissive licensing profile of the project stack (e.g., Prisma ORM is Apache-2.0; React, Next.js, FastAPI, scikit-learn, and Express are MIT/BSD).

### Key Implications & Limitations
- Apache-2.0 does not grant blanket immunity against unrelated third-party patent claims; it establishes an express patent grant from contributors regarding their actual contributions and a defensive termination clause if a licensee initiates patent litigation against a contributor over the work.
- Reviewed direct dependencies exhibit no obvious copyleft conflicts; however, a complete license audit covering transitive dependencies, bundled assets, fonts, external datasets, and model weights should be maintained before public distribution.

### Major Trade-offs
- **Gains:** Comprehensive contributor patent terms, trademark clarity, enterprise confidence, maximum adoption flexibility, and robust contributor conditions.
- **Gives Up:** Does not compel downstream distributors or SaaS operators to open-source private modifications (which a copyleft license would require).

### Licensing Scope
- **Included Under Project License:**
  - StockPilot application source code (`backend/`, `frontend/`, `ml-service/`, `database/`)
  - Project configuration and build scripts
  - Automated tests and test suites created specifically for StockPilot
  - Architecture, operational, and development documentation
- **Excluded or Separately Licensed:**
  - Direct and transitive third-party dependencies (governed by their respective upstream licenses)
  - Third-party datasets, external training data, and live data feeds
  - Pretrained machine learning model weights or external checkpoints
  - Third-party trademarks, logos, and brand assets
  - User-provided operational and transactional business data
  - External cloud or API service integrations

### Copyright Information
- **Copyright Holder:** Human-provided value (to be customized by the project maintainers/copyright owners upon formal release).
- **Copyright Year:** Human-provided value (e.g., 2026).
- **NOTICE File Policy:** Not required initially; deferred until specific third-party attributions or project governance policies mandate one.



48. Final Architecture Principle
StockPilot should not become architecturally impressive at the expense of being operationally reliable.
The architectural objective is:
Simple Enough to Understand
          +
Strong Enough to Protect Data
          +
Flexible Enough to Evolve
          +
Testable Enough to Trust
          +
Intelligent Enough to Create Value
The ultimate rule is:
Do not add architectural complexity until the problem being solved is real, measurable, and worth the complexity.

49. Document Authority
ARD.md records the architectural decisions that govern StockPilot.
It must remain synchronized with:
PRD.md
Features.md
Roadmap.md
ARCHITECTURE.md
Database.md
API.md
Security.md
AI.md
Rules.md
Phases.md
Design.md
Testing.md
Deployment.md
When a significant architectural decision changes, this document must be updated with a new ADR rather than silently rewriting history.
The goal of ARD.md is not to document every implementation detail.
Its purpose is to preserve why the architecture is the way it is, so future development can remain consistent, deliberate, and evidence-driven.