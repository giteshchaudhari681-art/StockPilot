StockPilot — Engineering & Product Rules
Document: Rules.md
Project: StockPilot
Document Type: Engineering Rules / Non-Negotiable Constraints
Status: Draft
Version: 1.0

1. Purpose
   This document defines the rules that govern how StockPilot is designed, implemented, tested, reviewed, and evolved.
   These rules exist to prevent:
   Architecture drift.
   Unnecessary complexity.
   Technology assumptions.
   Weak business logic.
   Security shortcuts.
   AI-driven overengineering.
   Inconsistent implementation.
   Uncontrolled scope expansion.
   Documentation becoming disconnected from the actual system.
   These rules apply to all StockPilot development unless an explicitly approved project decision overrides them.
2. Rule Hierarchy
   When two requirements conflict, apply this order:
3. Security & Data Integrity
   ↓
4. Authoritative Project Requirements
   ↓
5. Business Rules
   ↓
6. Architecture Decisions
   ↓
7. Implementation Details
   ↓
8. Developer Convenience
   Developer convenience must never override correctness, security, or an approved project requirement.
9. Source-of-Truth Rule
   The project must maintain clear authoritative documentation.
   The following documents collectively define the project's intended behavior:
   PRD.md
   Features.md
   Roadmap.md
   ARCHITECTURE.md
   Database.md
   API.md
   Security.md
   AI.md
   Rules.md
   When implementation conflicts with the authoritative documentation:
   Do not silently change the implementation or documentation. Identify the conflict and resolve it explicitly.

10. No Technology Assumption Rule
    Do not introduce a technology merely because it is commonly used for a particular architecture.
    Examples of technologies that must not be added merely by assumption:
    PostgreSQL.
    Redis.
    Kafka.
    Kubernetes.
    Terraform.
    GitHub Actions.
    React Router.
    Playwright.
    Cypress.
    OpenTelemetry.
    pnpm.
    Any specific cloud provider.
    Any specific AI/LLM provider.
    A technology may be introduced only when:
    It is already part of the authoritative project stack, or
    A new architectural decision explicitly approves it.
11. Technology Must Solve a Problem
    No technology should exist simply because it looks impressive.
    Before adding a technology, answer:
    What problem does it solve?
    Why is the existing stack insufficient?
    What complexity does it introduce?
    What operational cost does it introduce?
    Is it required by the product?
    If those questions cannot be answered convincingly, do not add it.
12. No Resume-Driven Architecture
    StockPilot must not be designed around collecting technologies for a resume.
    Bad reasoning:
    "Kafka would look good in the project."

Correct reasoning:
"We have a demonstrated asynchronous/event-processing requirement that justifies introducing an event system."

Technology choices must follow requirements. 7. Scope Control Rule
Do not introduce features merely because they would be "cool."
Every feature must have:
A user problem.
A business purpose.
A place in the product requirements.
A defined implementation boundary.
If a feature does not support the product objective, it belongs outside the current scope. 8. MVP Rule
The first implementation must establish a reliable operational foundation before advanced intelligence.
Priority:
Operational Correctness
↓
Data Integrity
↓
Core Workflows
↓
Analytics
↓
AI / Intelligence
↓
Advanced Automation
Do not build sophisticated AI on top of an unreliable operational system. 9. Production-Grade Rule
StockPilot is not a tutorial CRUD application.
Implementation quality must consider:
Correctness.
Security.
Maintainability.
Failure handling.
Concurrency.
Testing.
Observability where required.
Clear boundaries.
Data integrity.
A feature that merely "works on localhost" is not automatically complete. 10. Business Logic Rule
Business rules must live in the appropriate backend/domain layer.
Do not rely on the frontend to enforce critical business rules.
Examples:
Inventory limits.
Order transitions.
Reservation rules.
Authorization.
Recommendation execution.
The client can provide validation for user experience.
The server provides authoritative enforcement. 11. Client Trust Rule
The client is untrusted.
Never trust client-provided:
Roles.
Permissions.
Inventory quantities.
Ownership.
Order states.
Approval status.
Security-sensitive fields.
The server must derive or validate authoritative values. 12. Authentication Rule
Protected resources require authentication.
Authentication must establish the identity of the requester.
Authentication alone does not grant authorization. 13. Authorization Rule
Every protected operation must verify authorization.
The system must ask:
Who is the user?
What role/permission do they have?
What resource are they accessing?
What operation are they attempting?
Are they allowed to perform it? 14. Resource Ownership Rule
A valid resource identifier does not imply access.
Bad:
GET /orders/{id}
↓
Find order
↓
Return order
Correct conceptual flow:
Authenticate
↓
Authorize
↓
Verify resource access
↓
Retrieve resource 15. Inventory Integrity Rule
Inventory is a critical operational domain.
Inventory operations must preserve defined invariants.
Never allow an operation to silently create:
Invalid quantities.
Duplicate inventory positions.
Unauthorized stock.
Incorrect reservations.
Partial transfers.
Double fulfillment. 16. Atomicity Rule
When multiple database changes represent one business operation, they must behave atomically where required.
Example:
Inventory Transfer

Source Decrease +
Destination Increase +
Movement Record
The system must not leave only part of the operation applied. 17. Concurrency Rule
Concurrency must be considered for operations where multiple requests can affect the same state.
Critical examples:
Inventory reservation.
Inventory transfer.
Inventory adjustment.
Order fulfillment.
Recommendation execution.
The implementation must prevent race conditions from violating business invariants. 18. Idempotency Rule
Operations that can safely be retried must define appropriate duplicate-request behavior.
Examples:
Inventory receipt.
Inventory transfer.
Reservation.
Fulfillment.
Recommendation execution.
A retry must not accidentally perform the business operation twice. 19. State Machine Rule
Important business entities must have controlled state transitions.
For example:
Created
↓
Confirmed
↓
Reserved
↓
Processing
↓
Fulfilled
The client must not arbitrarily assign states.
Invalid transitions must be rejected. 20. Historical Data Rule
Historical operational information must not be destroyed unnecessarily.
Before deleting a business entity, determine whether historical records depend on it.
Prefer appropriate deactivation/archive behavior where historical interpretation requires the entity to remain referenceable. 21. Audit Rule
Important business and security actions must be traceable.
Examples:
Inventory adjustments.
Inventory transfers.
Order fulfillment.
Recommendation approval.
Recommendation execution.
Administrative changes.
Audit records must preserve meaningful accountability. 22. Audit Immutability Rule
Ordinary users must not be able to modify or delete their own historical audit records.
Audit information exists specifically to preserve accountability. 23. API Rule
APIs must expose business capabilities rather than arbitrary database mutations.
Prefer:
POST /inventory/transfer
over generic endpoints that allow arbitrary inventory-field modification. 24. API Contract Rule
Every production endpoint must have a defined:
Purpose.
Request.
Response.
Authentication requirement.
Authorization requirement.
Validation behavior.
Error behavior.
Side effects.
Concurrency behavior where applicable.
Idempotency behavior where applicable. 25. API Error Rule
Errors must be predictable and safe.
Do not expose:
Stack traces.
Database credentials.
Internal infrastructure.
Secrets.
Sensitive implementation details. 26. Pagination Rule
Potentially large collections must not be returned without appropriate pagination or bounded retrieval.
Examples:
Inventory.
Orders.
Products.
Audit records.
Inventory movements.
Recommendations.
Risks.
Anomalies. 27. Database Rule
The database is not merely storage.
It is part of the system's integrity boundary.
Appropriate constraints must be used to protect:
Relationships.
Uniqueness.
Valid references.
Data consistency. 28. Database Ownership Rule
Each domain must have clear ownership of its data.
For example:
Product → Product Domain
Inventory → Inventory Domain
Orders → Order Domain
Forecasts → Intelligence Domain
Recommendations → Decision-Support Domain
Cross-domain access must respect those boundaries. 29. Duplicate Source-of-Truth Rule
Do not maintain multiple independent versions of the same operational fact without a clearly defined reason and synchronization strategy.
For example, inventory state must have one authoritative representation. 30. Derived Data Rule
Derived information must remain distinguishable from authoritative operational data.
Examples:
Actual Demand ≠ Forecast Demand

Actual Inventory ≠ Projected Inventory

Observed Risk ≠ Predicted Risk
The system must not confuse predictions with facts. 31. AI Rule
AI is a decision-support mechanism, not an authority.
AI output must never automatically override:
Authentication.
Authorization.
Business rules.
Inventory invariants.
Database integrity.
Transaction requirements. 32. AI Data Rule
AI must operate on validated data.
The pipeline should follow:
Operational Data
↓
Validation
↓
Preparation
↓
AI Processing
↓
Output Validation
↓
Intelligence Result
Do not blindly feed unreliable data into models and treat the result as trustworthy. 33. AI Baseline Rule
Before introducing a complex model, establish a reasonable baseline.
A more complicated model must demonstrate measurable improvement.
If the complex model does not outperform the baseline meaningfully, complexity is not justified. 34. AI Business-Value Rule
Model accuracy alone is insufficient.
Evaluate whether the AI improves actual operational outcomes.
Potential measures include:
Reduced stockouts.
Reduced overstock.
Better inventory efficiency.
Better forecast quality.
Useful recommendations.
Reduced operational effort. 35. AI Hallucination Rule
AI must never invent operational facts.
It must not fabricate:
Inventory levels.
Order status.
Supplier history.
Forecast values.
Risk data.
Transaction history.
Operational facts must come from authoritative system data. 36. AI Recommendation Rule
A recommendation is not an operational command.
The correct flow is:
AI
↓
Recommendation
↓
Review
↓
Approval
↓
Current-State Validation
↓
Business Rules
↓
Execution 37. AI Revalidation Rule
Recommendations can become stale.
Every high-impact recommendation must be revalidated against current state before execution.
Never assume that a recommendation generated earlier is still valid. 38. Human-in-the-Loop Rule
High-impact decisions should have an appropriate human-review mechanism unless explicit requirements justify otherwise.
AI should assist decision-making rather than silently replacing operational judgment. 39. Simulation Rule
Scenario simulations must never mutate production state.
Production State
↓
Scenario
↓
Simulation
↓
Result
Simulation results remain hypothetical until a separate authorized operational action occurs. 40. Security Rule
Security is a continuous architectural requirement.
Do not postpone:
Authentication.
Authorization.
Input validation.
Secret protection.
Auditability.
until the end of the project. 41. Secret Rule
Secrets must never be committed to source control.
Never place real:
Passwords.
API keys.
Tokens.
Database credentials.
Private keys.
inside source files, documentation, client bundles, or logs. 42. Logging Rule
Logs must help diagnose problems without becoming a source of sensitive-data leakage.
Never log secrets.
Avoid unnecessary logging of sensitive personal or operational information. 43. Dependency Rule
Dependencies must have a reason to exist.
Before introducing a dependency:
Confirm the requirement.
Check whether existing project capabilities already solve it.
Evaluate complexity.
Evaluate maintenance cost.
Evaluate security implications. 44. Abstraction Rule
Do not create abstractions before they are needed.
Bad:
GenericFactoryManagerProvider
created before there are multiple implementations.
Better:
Build the simplest correct implementation and introduce an abstraction when actual variation justifies it. 45. DRY Rule
Do not confuse "Don't Repeat Yourself" with "abstract everything."
Some duplication can be cheaper and clearer than premature abstraction.
Abstract only when the duplicated behavior represents a genuine shared concept. 46. Simplicity Rule
Prefer the simplest architecture that satisfies the requirements.
Complexity must earn its place.
Every additional:
Service.
Database.
Queue.
Cache.
Framework.
Dependency.
Abstraction.
creates additional failure and maintenance surfaces. 47. No Premature Distributed Systems Rule
Do not split StockPilot into multiple services merely because microservices are considered "production-grade."
Start with the architecture justified by the actual requirements.
Introduce distribution only when there is a demonstrated need. 48. No Premature Caching Rule
Do not add caching before identifying a real performance problem.
Caching introduces:
Staleness.
Invalidation complexity.
Consistency problems.
Additional infrastructure.
Measure first. 49. No Premature Event Architecture Rule
Events should be introduced when asynchronous or decoupled processing is actually required.
Do not create event infrastructure merely because StockPilot may eventually scale. 50. Performance Rule
Performance optimization must be evidence-driven.
The process should be:
Measure
↓
Identify Bottleneck
↓
Understand Cause
↓
Optimize
↓
Measure Again
Do not optimize based on assumptions. 51. Frontend Rule
The frontend should provide:
Usable workflows.
Clear information.
Appropriate validation.
Useful feedback.
But the frontend must never become the authoritative security or business-rule layer. 52. Backend Rule
The backend is responsible for:
Business logic.
Authorization.
Validation.
State transitions.
Transactions.
Operational integrity.
Controllers should not become large collections of unrelated business logic. 53. Separation of Concerns Rule
Separate:
Presentation
↓
API
↓
Application Logic
↓
Domain Logic
↓
Persistence
Do not allow one layer to absorb responsibilities belonging to another layer without a documented reason. 54. Error Handling Rule
Errors must be handled intentionally.
Do not:
Swallow exceptions.
Return success after failed operations.
Hide important failures.
Expose sensitive internal errors.
Continue after an operation has entered an invalid state. 55. Failure Isolation Rule
Failure in one subsystem should not unnecessarily corrupt another subsystem.
For example:
AI Failure
↓
AI Feature Unavailable

NOT

AI Failure
↓
Inventory Corrupted
Core operational functionality should remain protected. 56. Documentation Rule
Documentation must describe the actual system.
Never update documentation merely to make the implementation appear compliant.
If implementation changes:
Implementation Change
↓
Assess Documentation Impact
↓
Update Relevant Documentation 57. No Documentation Fiction Rule
Do not document infrastructure, features, endpoints, services, or technologies that do not exist.
A documented capability must have a clear implementation path or explicit planned status. 58. Change Management Rule
Significant architecture changes require explicit reasoning.
Document:
Problem.
Current limitation.
Proposed change.
Alternatives considered.
Trade-offs.
Impact.
Decision. 59. Backward Compatibility Rule
Before changing an established API, database contract, or important behavior, determine whether existing consumers depend on it.
Breaking changes must be intentional. 60. Testing Rule
Testing must validate behavior, not merely code coverage.
Tests should verify:
Business rules.
Security.
Data integrity.
API contracts.
State transitions.
Failure handling.
Concurrency where relevant. 61. Critical Workflow Testing Rule
The following workflows require strong testing:
Inventory Receipt
Inventory Adjustment
Inventory Transfer
Inventory Reservation
Order Fulfillment
Order Cancellation
Recommendation Approval
Recommendation Execution
These workflows affect real operational state. 62. Security Testing Rule
Security testing must include direct API-level attempts to bypass UI restrictions.
Do not assume:
"The button isn't visible, therefore the action is secure."

Security must be enforced and tested at the backend boundary. 63. Integration Testing Rule
Where multiple components participate in one business operation, integration tests should verify their interaction.
Examples:
API → Business Logic → Database
and:
Order → Reservation → Inventory 64. Regression Rule
Every significant bug fix should include a regression test where practical.
The objective is:
Bug
↓
Root Cause
↓
Fix
↓
Test
↓
Prevent Recurrence 65. Root-Cause Rule
Do not patch symptoms when the underlying cause is known.
When investigating a bug:
Reproduce.
Identify the failure.
Trace the execution path.
Determine the root cause.
Fix the root cause.
Test the affected workflow.
Test for regression. 66. No Random Fixes Rule
Do not modify unrelated files because they "might help."
Every code change should have a reason connected to:
The requirement.
The bug.
The architecture.
The test. 67. Minimal Change Rule
When fixing a problem, change the smallest appropriate surface area.
Avoid unnecessary refactoring during unrelated feature work. 68. Refactoring Rule
Refactor when it materially improves:
Correctness.
Maintainability.
Performance.
Security.
Testability.
Do not refactor merely because a different style looks cleaner. 69. Feature Completion Rule
A feature is not complete when its UI exists.
A complete feature should include, where applicable:
Requirement
↓
UI
↓
API
↓
Business Logic
↓
Persistence
↓
Validation
↓
Authorization
↓
Error Handling
↓
Testing
↓
Documentation 70. Definition of Done
A feature should not be considered done merely because:
It compiles.
The page renders.
The API returns 200.
A happy-path demo works.
It must satisfy the relevant correctness, security, testing, and documentation requirements. 71. No Fake Functionality Rule
Do not implement fake:
AI predictions.
Inventory values.
Supplier metrics.
Risk scores.
Forecasts.
Recommendations.
unless the feature is explicitly identified as mocked/demo functionality.
Mock data must be clearly separated from production logic. 72. Seed Data Rule
Development/demo seed data must never be mistaken for real operational data.
Seed data should be:
Clearly identifiable.
Reproducible.
Safe.
Separate from production credentials/data. 73. Configuration Rule
Configuration must be separated appropriately from application logic.
Do not hard-code environment-specific:
Credentials.
Secrets.
URLs.
Infrastructure assumptions. 74. Environment Rule
Development and production environments must not be treated as interchangeable.
Production configuration must be explicitly controlled. 75. Deployment Rule
Deployment configuration must follow the approved architecture.
Do not introduce deployment infrastructure simply because it is considered "industry standard."
The project requirements determine what infrastructure is justified. 76. Observability Rule
Observability must answer real operational questions.
Examples:
Is the service healthy?
Why did an operation fail?
Where is latency occurring?
Did a background task complete?
Did an important security event occur?
Do not add monitoring technologies without a clear operational purpose. 77. AI Observability Rule
AI systems must provide enough information to determine:
Which model/method ran.
When it ran.
What data period was used.
Whether it succeeded.
Whether output validation succeeded.
Do not log sensitive model inputs unnecessarily. 78. Data Privacy Rule
Collect only data that the product actually needs.
Do not collect personal or sensitive information merely because it could be useful later. 79. External Integration Rule
Every external integration must have:
A defined business purpose.
Authentication requirements.
Authorization boundaries.
Failure behavior.
Retry behavior.
Security considerations.
Data-flow documentation. 80. Third-Party Service Rule
Do not make a third-party service a critical dependency unless the product actually requires it.
Every external dependency introduces:
Availability risk.
Cost.
Security exposure.
Vendor dependency.
Operational complexity. 81. Cost Rule
Engineering decisions must consider total cost, not just development time.
Consider:
Implementation Cost +
Infrastructure Cost +
Maintenance Cost +
Operational Complexity +
Failure Cost
A technically impressive solution that creates disproportionate operational cost is not automatically better. 82. Scalability Rule
Do not optimize for imaginary scale.
Design for the expected requirements and preserve a reasonable path to future growth.
Premature scaling architecture can reduce development velocity without providing meaningful benefit. 83. Reliability Rule
Critical workflows should prefer predictable behavior over clever behavior.
When uncertain:
Fail safely rather than silently corrupt state.

84. Operational Truth Rule
    StockPilot must maintain a strict distinction between:
    Observed Fact
    and:
    Prediction
    and:
    Recommendation
    and:
    Simulation
    They must never be represented as equivalent.
85. Decision Traceability Rule
    Important recommendations should be traceable to:
    Operational Data
    ↓
    Analysis / Forecast / Risk
    ↓
    Recommendation
    ↓
    Human Decision
    ↓
    Operational Action
    This creates accountability.
86. No Autonomous Authority Rule
    AI cannot become an unauthorized operational actor.
    The model may recommend:
    "Transfer 50 units."
    It cannot independently bypass:
    Authorization
    Business Rules
    Inventory Validation
    Transaction
    Audit
87. Architecture Review Rule
    Before introducing a significant architectural component, ask:
    What requirement demands it?
    What simpler option was considered?
    What new failure modes does it create?
    What does it cost to operate?
    Does the team actually need it now?
    If the answer is weak, reject the addition.
88. Dependency Graph Rule
    The project architecture should remain understandable.
    A reasonable dependency direction is:
    UI
    ↓
    API
    ↓
    Application
    ↓
    Domain
    ↓
    Persistence
    Intelligence components should consume validated operational data rather than creating circular dependencies with core operational domains.
89. Circular Dependency Rule
    Avoid circular dependencies between major domains.
    For example:
    Inventory → Intelligence → Inventory
    should not become an uncontrolled dependency cycle.
    A safer pattern is:
    Inventory
    ↓
    Validated Data
    ↓
    Intelligence
    ↓
    Recommendation
    ↓
    Controlled Operational Command
    ↓
    Inventory
90. Code Quality Rule
    Code should prioritize:
    Readability.
    Correctness.
    Explicit behavior.
    Appropriate naming.
    Small responsibilities.
    Testability.
    Clever code is not automatically good code.
91. Naming Rule
    Names should communicate domain meaning.
    Prefer:
    reserveInventory()
    transferInventory()
    approveRecommendation()
    over vague names such as:
    process()
    handle()
    execute()
    doAction()
    unless the broader context makes the meaning unambiguous.
92. Comments Rule
    Comments should explain why, not restate obvious code.
    Bad:
    // Increment quantity by one
    quantity++;
    Useful:
    // Preserve inventory availability invariant before reservation.
93. Security Over Convenience Rule
    When convenience conflicts with security:
    Choose security.

Examples:
Do not disable authorization to simplify development.
Do not expose secrets to debug a problem.
Do not bypass validation to make a demo work.
Temporary development shortcuts must not become production behavior. 94. Correctness Over Speed Rule
Fast development that creates unreliable operational behavior is false efficiency.
The priority is:
Correct
↓
Tested
↓
Maintainable
↓
Fast
not:
Fast
↓
Patch
↓
Patch
↓
Rewrite 95. Build Order Rule
Build the system from foundational dependencies upward.
Recommended order:
Requirements
↓
Architecture
↓
Data Model
↓
Security Foundation
↓
Core API
↓
Core Workflows
↓
Frontend
↓
Analytics
↓
AI
↓
Advanced Capabilities
Do not build downstream intelligence before the upstream data is trustworthy. 96. Documentation Synchronization Rule
When a major architectural decision changes, update all affected documents.
For example:
Architecture Change
↓
Database Impact?
↓
API Impact?
↓
Security Impact?
↓
AI Impact?
↓
Roadmap Impact?
↓
Update Documents 97. Review Rule
Important changes should be reviewed against:
Requirements.
Architecture.
Security.
Data model.
API contracts.
Testing.
Operational impact.
A code review that checks only syntax is insufficient. 98. Evidence Rule
Engineering decisions should be based on evidence where possible.
Use:
Tests.
Measurements.
Logs.
Benchmarks.
Reproduction steps.
Actual requirements.
Do not make major architectural decisions based purely on assumptions. 99. No Cargo-Cult Engineering Rule
Do not copy architecture patterns from large companies without understanding why they use them.
A system used by a company operating at enormous scale may be completely inappropriate for StockPilot's current scale.
Architecture must match the problem. 100. Final Engineering Rule
StockPilot should follow one overarching principle:
Build the simplest system that can reliably solve the real problem, then add complexity only when evidence proves that the complexity is necessary.

The complete priority hierarchy is:
┌────────────────────┐
│ Product Problem │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Requirements │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Architecture │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Correctness/Safety │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Implementation │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Testing & Evidence │
└─────────┬──────────┘
↓
┌────────────────────┐
│ Production Quality │
└────────────────────┘ 101. Non-Negotiable Rules Summary
The following rules must always be respected:
Do not invent requirements.
Do not invent technologies.
Do not trust the client.
Do not bypass authorization.
Do not compromise inventory integrity.
Do not confuse predictions with facts.
Do not let AI bypass business rules.
Do not allow simulations to mutate production.
Do not expose secrets.
Do not add complexity without justification.
Do not optimize without evidence.
Do not ship critical workflows without testing.
Do not silently change the source of truth.
Do not document functionality that does not exist.
Do not treat "it works" as the same as "it is production-ready." 102. Document Authority
Rules.md defines the governing engineering principles and constraints for StockPilot.
It does not independently define a technology stack.
Technology choices must come from the authoritative project architecture and approved technical decisions.
If a future approved project decision intentionally changes one of these rules, the change must be explicitly documented rather than silently ignored.
