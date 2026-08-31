# StockPilot — Database Architecture & Data Model

**Document:** `Database.md`  
**Project:** StockPilot  
**Document Type:** Database Architecture & Data Model  
**Status:** Draft  
**Version:** 1.0

---

# 1. Purpose

This document defines the database requirements, data ownership principles, entity relationships, integrity requirements, and data-access boundaries for StockPilot.

The database is responsible for maintaining the authoritative operational state of the system.

The most important principle is:

> **The database must preserve business correctness; it must not merely store application data.**

StockPilot depends on reliable operational data for:

- Inventory management.
- Order processing.
- Warehouse operations.
- Supplier management.
- Analytics.
- Demand forecasting.
- Anomaly detection.
- Risk analysis.
- Recommendations.
- Scenario analysis.

If the underlying data is incorrect, every downstream intelligence feature becomes unreliable.

---

# 2. Database Goals

The database architecture must support:

1. Reliable operational state.
2. Inventory consistency.
3. Concurrent operations.
4. Transactional integrity.
5. Historical traceability.
6. Product and warehouse relationships.
7. Order lifecycle management.
8. Inventory reservations.
9. Supplier relationships.
10. Analytical data access.
11. Auditability.
12. Secure access.
13. Efficient querying.
14. Future growth without premature complexity.

---

# 3. Database Architecture Principles

## 3.1 Operational Data Is Authoritative

The operational database represents the current state of the business.

Examples:

- Current inventory.
- Current order state.
- Current warehouse state.
- Current supplier state.

Analytical and intelligence systems must not independently become the source of truth for operational state.

---

## 3.2 Preserve Historical Information

Important operational events should remain traceable.

Deleting or overwriting information must not destroy the ability to understand historical operations.

---

## 3.3 Enforce Invariants

Important constraints must be enforced at the appropriate layers.

```text
Application Validation
        ↓
Business Rules
        ↓
Transaction Logic
        ↓
Database Constraints
```

No single layer should be assumed to provide all data integrity.

---

## 3.4 Avoid Duplicate Sources of Truth

The same operational fact should not be independently maintained in multiple places without a clear synchronization strategy.

For example, inventory quantity must have a clearly defined authoritative representation.

---

## 3.5 Use Explicit Relationships

Relationships between:

- Products.
- Warehouses.
- Inventory.
- Orders.
- Suppliers.
- Users.

must be explicit and enforceable.

---

## 3.6 Technology Neutrality

This document defines database requirements and conceptual structure.

It does **not** independently select a database technology.

The actual database engine, ORM/data-access technology, migration tooling, indexing strategy, and deployment configuration must come from the project's authoritative technical documentation.

---

# 4. Data Domains

StockPilot's data can be divided into the following major domains:

```text
Identity
   ↓
Product Catalog
   ↓
Warehouses
   ↓
Inventory
   ↓
Orders
   ↓
Suppliers / Procurement
   ↓
Audit
   ↓
Analytics
   ↓
Intelligence
   ↓
Recommendations
   ↓
Simulation
```

These domains are related but should maintain clear ownership boundaries.

---

# 5. Core Entities

The conceptual core data model includes:

```text
User
Role / Permission
Product
Category
Warehouse
Inventory
Inventory Movement
Inventory Reservation
Order
Order Item
Supplier
Supplier Product
Procurement Record
Audit Record
Forecast
Anomaly
Risk
Recommendation
Scenario
Scenario Result
```

The final physical schema may differ after detailed technical design.

---

# 6. User Entity

## Purpose

Represents an authenticated StockPilot user.

## Conceptual Attributes

```text
User
├── id
├── name
├── email
├── authentication information
├── status
├── role reference
├── created_at
└── updated_at
```

Sensitive authentication information must be stored and handled according to the approved security architecture.

---

# 7. Role and Permission Model

Users require controlled access to operational functionality.

Conceptually:

```text
User
  │
  └── Role
        │
        └── Permissions
```

Potential roles include:

- Administrator.
- Inventory Manager.
- Warehouse Operator.
- Procurement Manager.
- Operations Manager.

The final authorization model must be defined by the security architecture.

---

# 8. Product Entity

The Product entity represents a product that can participate in inventory operations.

## Conceptual Structure

```text
Product
├── id
├── sku
├── name
├── description
├── category_id
├── unit
├── status
├── reorder configuration
├── created_at
└── updated_at
```

## Requirements

- SKU should follow a defined uniqueness rule.
- Product status must be controlled.
- Historical references to products must remain valid after deactivation.
- Product deletion must not break historical records.

---

# 9. Category Entity

Categories organize products.

Conceptually:

```text
Category
├── id
├── name
├── description
├── status
├── created_at
└── updated_at
```

A category may contain multiple products.

```text
Category 1 ──────── * Product
```

The exact category hierarchy is a future design decision if nested categories are required.

---

# 10. Warehouse Entity

The Warehouse entity represents a location where inventory is stored or managed.

## Conceptual Structure

```text
Warehouse
├── id
├── name
├── location information
├── status
├── created_at
└── updated_at
```

A warehouse can contain inventory for many products.

```text
Warehouse 1 ──────── * Inventory
```

---

# 11. Inventory Entity

Inventory represents the current operational stock state for a product at a warehouse.

## Conceptual Structure

```text
Inventory
├── id
├── product_id
├── warehouse_id
├── physical_quantity
├── reserved_quantity
├── available_quantity
├── version / concurrency information where required
├── created_at
└── updated_at
```

The exact representation of quantities must be finalized during implementation.

---

# 12. Inventory Uniqueness

A product should not accidentally have multiple independent inventory records for the same warehouse unless the business model explicitly requires such separation.

Conceptually:

```text
(Product, Warehouse)
        ↓
Unique Inventory Position
```

This prevents ambiguous inventory ownership.

---

# 13. Inventory Quantity Model

StockPilot should conceptually distinguish between:

```text
Physical Quantity
        ↓
Reserved Quantity
        ↓
Available Quantity
```

A common conceptual relationship is:

```text
Available Quantity
=
Physical Quantity
-
Reserved Quantity
```

The final implementation must define whether available quantity is stored, calculated, or derived through another mechanism.

Regardless of implementation, the system must maintain the intended invariant.

---

# 14. Inventory Movement Entity

Inventory Movement records meaningful changes to inventory.

## Conceptual Structure

```text
InventoryMovement
├── id
├── product_id
├── warehouse_id
├── movement_type
├── quantity
├── reference information
├── actor information
├── timestamp
└── metadata where required
```

Potential movement types:

- Receipt.
- Adjustment.
- Transfer.
- Reservation-related movement where applicable.
- Release.
- Fulfillment.
- Return.

The final movement taxonomy must be explicitly defined.

---

# 15. Inventory Movement Principle

Inventory movement history should answer:

```text
What changed?
Who/what caused it?
When did it happen?
Where did it happen?
Why did it happen?
What operation was it associated with?
```

This is essential for debugging and auditability.

---

# 16. Inventory Reservation Entity

Reservations represent inventory allocated to an order or another approved operational process.

## Conceptual Structure

```text
InventoryReservation
├── id
├── inventory reference
├── order reference
├── quantity
├── status
├── created_at
├── released_at where applicable
└── metadata where required
```

Potential statuses:

```text
Active
Released
Consumed
Cancelled
```

The final state model must be defined during detailed design.

---

# 17. Reservation Invariants

The system must ensure:

1. A reservation references valid inventory.
2. A reservation references a valid operational object.
3. Reserved quantity is valid.
4. Reservations cannot exceed legitimately available stock.
5. Reservation release is handled correctly.
6. Duplicate reservation effects are prevented.
7. Concurrent reservation attempts preserve inventory correctness.

---

# 18. Order Entity

The Order entity represents an operational order.

## Conceptual Structure

```text
Order
├── id
├── order_number
├── status
├── warehouse reference where applicable
├── customer/order owner reference where applicable
├── created_at
├── updated_at
└── timestamps for relevant lifecycle events
```

The exact order/customer model depends on the approved product scope.

---

# 19. Order Item Entity

An order contains one or more order items.

```text
Order 1 ──────── * OrderItem
```

Conceptual structure:

```text
OrderItem
├── id
├── order_id
├── product_id
├── quantity
└── relevant pricing or operational information
```

The exact commercial attributes are outside the core inventory architecture unless explicitly required.

---

# 20. Order State Model

Orders must follow a controlled lifecycle.

Conceptually:

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

Possible alternative paths:

```text
Created → Cancelled
Confirmed → Cancelled
Reserved → Cancelled
```

Invalid transitions must be rejected.

---

# 21. Order and Inventory Relationship

Orders interact with inventory through reservations and fulfillment.

Conceptually:

```text
Order
  ↓
Order Items
  ↓
Inventory Availability
  ↓
Reservation
  ↓
Fulfillment
  ↓
Inventory State Change
```

The database must support this relationship without allowing an order to silently consume unavailable stock.

---

# 22. Supplier Entity

The Supplier entity represents a source of products.

## Conceptual Structure

```text
Supplier
├── id
├── name
├── contact information
├── status
├── created_at
└── updated_at
```

Supplier records should remain available for historical analysis after deactivation.

---

# 23. Supplier-Product Relationship

A supplier can provide multiple products.

A product may have multiple suppliers.

Therefore:

```text
Supplier * ──────── * Product
```

This relationship should be represented through an explicit association entity.

Conceptually:

```text
SupplierProduct
├── supplier_id
├── product_id
├── lead_time
├── supplier-specific information
├── status
└── performance information where appropriate
```

---

# 24. Supplier Performance Data

Supplier performance may be derived from historical procurement activity.

Potential metrics include:

- Average lead time.
- Delivery delay.
- Delivery reliability.
- Order frequency.
- Historical fulfillment behavior.

Derived metrics should have a clearly defined calculation source.

They should not be manually duplicated without justification.

---

# 25. Procurement Entity

The procurement domain records replenishment-related actions.

Conceptual structure:

```text
ProcurementRecord
├── id
├── supplier_id
├── product information
├── quantity
├── status
├── expected timing
├── actual timing where applicable
└── timestamps
```

The exact procurement model depends on the final scope of purchasing workflows.

---

# 26. Audit Entity

Audit records preserve important historical actions.

Conceptual structure:

```text
AuditRecord
├── id
├── actor
├── action
├── entity type
├── entity identifier
├── timestamp
├── relevant previous state
├── relevant new state
└── metadata
```

Not every low-level technical event needs to become an audit record.

Audit logging should focus on meaningful business and security actions.

---

# 27. Audit Requirements

Audit information should allow investigation of:

- Who performed an operation.
- What operation occurred.
- Which entity was affected.
- When it occurred.
- Relevant state changes.
- Whether the action was human or system generated.

---

# 28. Forecast Entity

Forecast records represent demand predictions generated by the intelligence layer.

Conceptually:

```text
Forecast
├── id
├── product_id
├── forecast period
├── predicted demand
├── model/version information where required
├── uncertainty information where supported
├── generated_at
└── evaluation information where applicable
```

Forecasts must not replace actual operational demand data.

---

# 29. Forecast Versioning

Forecast results may change as new data becomes available.

The system should be able to distinguish between:

```text
Forecast A
generated at T1

Forecast B
generated at T2
```

This allows historical evaluation of forecasting performance.

The exact versioning mechanism must be defined during implementation.

---

# 30. Anomaly Entity

Anomaly records represent detected unusual behavior.

Conceptual structure:

```text
Anomaly
├── id
├── entity reference
├── anomaly type
├── severity
├── detection timestamp
├── supporting information
├── status
└── resolution information where applicable
```

Potential statuses:

```text
Detected
Investigating
Resolved
Dismissed
```

---

# 31. Risk Entity

Risk records represent identified operational risks.

Potential risk types:

- Stockout.
- Overstock.
- Supplier.
- Demand.
- Operational.

Conceptual structure:

```text
Risk
├── id
├── risk type
├── related entity
├── severity
├── risk score where applicable
├── supporting factors
├── status
└── timestamps
```

Risk scores must not be treated as universally meaningful without a defined methodology.

---

# 32. Recommendation Entity

Recommendations represent proposed actions generated by StockPilot.

Conceptual structure:

```text
Recommendation
├── id
├── recommendation type
├── related entity
├── proposed action
├── supporting factors
├── confidence/uncertainty where supported
├── status
├── generated_at
├── reviewed_at
├── approved_at
└── executed_at
```

---

# 33. Recommendation Lifecycle

Conceptually:

```text
Generated
   ↓
Reviewed
   ↓
Approved
   ↓
Executed
```

Alternative paths:

```text
Generated → Rejected
Generated → Dismissed
Generated → Expired
```

A recommendation must not directly mutate operational state merely because it exists.

---

# 34. Recommendation Traceability

A recommendation should preserve enough information to determine:

```text
Recommendation
      ↓
Supporting Risk
      ↓
Forecast / Analysis
      ↓
Operational Data
```

This allows users and developers to understand why a recommendation was generated.

---

# 35. Scenario Entity

A Scenario represents a hypothetical operational situation.

Conceptual structure:

```text
Scenario
├── id
├── name
├── description
├── creator
├── assumptions
├── status
├── created_at
└── updated_at
```

---

# 36. Scenario Result Entity

Scenario results contain the output of simulation.

Conceptually:

```text
ScenarioResult
├── scenario_id
├── simulated state/output
├── projected risks
├── projected inventory
├── relevant metrics
├── assumptions
└── generated_at
```

Scenario results must remain logically separate from actual operational state.

---

# 37. Entity Relationship Overview

The conceptual relationship model is:

```text
User
 │
 ├───────────────< AuditRecord
 │
 ├───────────────< Recommendation
 │
 └───────────────< Scenario

Category
 │
 └───────────────< Product
                       │
          ┌────────────┼───────────────┐
          │            │               │
          ▼            ▼               ▼
      Inventory    OrderItem     SupplierProduct
          │            │               │
          │            ▼               ▼
          │          Order          Supplier
          │
          ├──────────< InventoryMovement
          │
          └──────────< InventoryReservation

Product
 │
 ├───────────────< Forecast
 │
 ├───────────────< Anomaly
 │
 ├───────────────< Risk
 │
 └───────────────< Recommendation

Warehouse
 │
 └───────────────< Inventory
```

This is a conceptual model and not yet a physical schema.

---

# 38. Core Relationship Summary

| Relationship | Cardinality | Purpose |
|---|---:|---|
| Category → Product | 1:N | Categorization |
| Warehouse → Inventory | 1:N | Warehouse stock |
| Product → Inventory | 1:N | Product stock across locations |
| Inventory → Inventory Movement | 1:N | Stock history |
| Inventory → Reservation | 1:N | Reserved stock |
| Order → Order Item | 1:N | Order contents |
| Product → Order Item | 1:N | Products ordered |
| Supplier ↔ Product | N:M | Supplier-product availability |
| Product → Forecast | 1:N | Demand predictions |
| Product → Anomaly | 1:N | Detected anomalies |
| Product → Risk | 1:N | Product risks |
| Product → Recommendation | 1:N | Product recommendations |
| User → Audit Record | 1:N | User/system activity |
| User → Scenario | 1:N | Scenario ownership |

---

# 39. Data Ownership

Each domain should have clear ownership of its primary data.

| Data | Primary Owner |
|---|---|
| User identity | Identity/Auth domain |
| Product | Product domain |
| Category | Product domain |
| Warehouse | Warehouse domain |
| Inventory | Inventory domain |
| Inventory movements | Inventory domain |
| Reservations | Inventory/Order boundary |
| Orders | Order domain |
| Order items | Order domain |
| Supplier | Supplier domain |
| Supplier relationships | Supplier/Procurement domain |
| Forecasts | Intelligence domain |
| Anomalies | Intelligence domain |
| Risks | Intelligence domain |
| Recommendations | Decision-support domain |
| Scenarios | Simulation domain |
| Audit records | Audit/Platform domain |

Ownership must be respected when accessing or modifying data.

---

# 40. Inventory Data Integrity

Inventory data has the highest integrity requirements in the system.

The database and application must protect against:

- Negative quantities where prohibited.
- Duplicate inventory positions.
- Invalid product references.
- Invalid warehouse references.
- Invalid reservation quantities.
- Double reservation.
- Invalid transfers.
- Partial state updates.

---

# 41. Transactional Requirements

Operations that modify multiple related records must be treated as atomic where business correctness requires it.

Examples:

## Inventory Transfer

```text
Validate Source
      ↓
Decrease Source
      ↓
Increase Destination
      ↓
Record Transfer
```

These operations must not leave the system in a state where only one side of the transfer was applied.

---

## Order Fulfillment

```text
Validate Order
      ↓
Validate Reservation
      ↓
Fulfill Order
      ↓
Update Inventory
      ↓
Record Relevant History
```

The exact transaction boundary must be defined during technical implementation.

---

# 42. Concurrency Requirements

The database must support safe concurrent operations.

Important scenarios:

### Reservation Race

```text
Stock = 1

Transaction A → Reserve 1
Transaction B → Reserve 1

Expected:
Only one succeeds.
```

### Concurrent Adjustment

Multiple inventory updates must not silently overwrite each other when the business operation requires conflict protection.

### Concurrent Transfer

Transfers must maintain source/destination consistency.

---

# 43. Concurrency Control

The exact mechanism must be selected based on the approved database and application architecture.

Possible conceptual approaches include:

- Transaction isolation.
- Locking.
- Optimistic concurrency.
- Atomic update conditions.
- Version checks.

This document does not mandate one implementation technique.

The selected mechanism must be documented separately.

---

# 44. Constraints

The database should enforce appropriate constraints.

Potential constraints include:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Required fields.
- Valid status values where appropriate.
- Quantity constraints.
- Relationship constraints.

Database constraints provide a final integrity boundary.

---

# 45. Indexing Strategy

Indexes should support measured query requirements.

Likely candidates include:

- Product SKU.
- Product name where appropriate.
- Warehouse identifiers.
- Inventory product/warehouse relationship.
- Order identifier.
- Order status.
- Supplier identifiers.
- Timestamp fields used in historical queries.
- Foreign-key access paths.
- Frequently filtered operational fields.

Indexes must not be added blindly.

Every significant index should have a query or integrity justification.

---

# 46. Query Design Principles

Database queries should:

- Retrieve only required data.
- Avoid unnecessary full-table scans.
- Use appropriate filtering.
- Support pagination for large datasets.
- Avoid unnecessary repeated queries.
- Respect authorization boundaries.
- Avoid loading excessive historical data into memory.

---

# 47. Pagination

Large collections should not be returned without appropriate pagination.

Potential paginated resources include:

- Products.
- Inventory.
- Orders.
- Suppliers.
- Inventory movements.
- Audit records.
- Recommendations.
- Anomalies.
- Risks.

The final pagination strategy must follow the API architecture.

---

# 48. Soft Deactivation vs Deletion

Operational entities may need to remain historically meaningful.

For example:

```text
Product
   ↓
Historical Order
   ↓
Historical Inventory Event
```

Deleting the product record could destroy historical meaning.

Therefore, deactivation/archive behavior should be preferred where historical references must remain valid.

The exact deletion policy must be defined for each entity.

---

# 49. Timestamps

Important entities should maintain appropriate timestamps.

Potential timestamps:

- `created_at`
- `updated_at`
- `deleted_at` where applicable
- Domain-specific event timestamps.

Historical events should use event-specific timestamps rather than relying only on record update times.

---

# 50. Identifier Strategy

Each major entity must have a stable identifier.

Identifiers must:

- Be unique.
- Be safe to expose where appropriate.
- Remain stable for the entity lifecycle.
- Support reliable relationships.

The exact identifier format must be defined in the implementation architecture.

---

# 51. Data Validation

Database-level validation should complement application-level validation.

Examples:

```text
Invalid quantity
        ↓
Application rejects request

Invalid relationship
        ↓
Database constraint rejects persistence

Invalid state transition
        ↓
Business logic rejects operation
```

Each layer protects against a different class of failure.

---

# 52. Historical Data

Historical operational data is critical to StockPilot's intelligence layer.

Historical information supports:

- Demand forecasting.
- Inventory analysis.
- Supplier analysis.
- Anomaly detection.
- Risk analysis.
- Recommendation evaluation.
- Forecast accuracy measurement.

Historical data should therefore not be casually deleted.

---

# 53. Analytical Data

Analytical processing may require derived metrics or transformed datasets.

Examples:

- Daily demand.
- Inventory turnover.
- Stockout duration.
- Supplier delay statistics.
- Forecast error.

Derived data must have a clearly defined source.

The operational database remains authoritative for actual business state.

---

# 54. Intelligence Data Lifecycle

The intelligence data lifecycle is:

```text
Operational Data
      ↓
Data Validation
      ↓
Historical Data
      ↓
Feature / Metric Generation
      ↓
Model / Analysis
      ↓
Forecast / Anomaly / Risk
      ↓
Recommendation
```

Each generated result should be distinguishable from the underlying source data.

---

# 55. Recommendation Data Integrity

Recommendations can become stale.

Example:

```text
10:00 AM
Recommendation:
Reorder 100 units

10:30 AM
Inventory changes significantly

11:00 AM
User approves recommendation
```

The operational system must revalidate the action at approval/execution time.

The database must not treat an old recommendation as an unconditional command.

---

# 56. Scenario Data Isolation

Scenario data must not overwrite production data.

Conceptually:

```text
Production State
      │
      ├───────────────┐
      │               │
      ▼               ▼
Operational Use   Scenario Copy/Model
                      │
                      ▼
                 Simulation
                      │
                      ▼
                 Scenario Result
```

Only an explicit approved action may cross back into the operational system.

---

# 57. Audit and Intelligence Relationship

Important intelligence actions should be traceable.

For example:

```text
Forecast Generated
      ↓
Risk Generated
      ↓
Recommendation Generated
      ↓
Recommendation Reviewed
      ↓
Recommendation Approved
      ↓
Operational Action
```

This provides an auditable decision chain.

---

# 58. Security and Database Access

Database access must follow least-privilege principles.

Application components should only have the permissions necessary for their responsibilities.

Users should not directly manipulate database records outside approved application boundaries.

Sensitive data must receive appropriate protection according to the security architecture.

---

# 59. Backup and Recovery

Production database operations must include an approved backup and recovery strategy.

The final strategy must define:

- Backup frequency.
- Retention.
- Recovery objectives.
- Restoration procedures.
- Validation of backups.

These operational details must be documented after the database technology is selected.

---

# 60. Migration Strategy

Schema changes must be controlled.

A migration should:

1. Define the schema change.
2. Consider existing data.
3. Consider backward compatibility where required.
4. Apply the change safely.
5. Validate the resulting schema.
6. Test affected workflows.

Migration tooling must follow the approved technology stack.

---

# 61. Database Testing

Database behavior must be tested through appropriate levels.

## Unit-Level

Test business logic that calculates or validates data.

## Integration-Level

Test:

- Persistence.
- Relationships.
- Constraints.
- Transactions.

## Concurrency-Level

Test:

- Reservation races.
- Concurrent inventory updates.
- Concurrent transfers.

## Migration-Level

Verify schema changes against expected database state.

---

# 62. Database Performance

Performance should be measured against realistic workloads.

Important areas:

- Inventory queries.
- Order queries.
- Historical movement queries.
- Dashboard queries.
- Analytical queries.
- Intelligence data extraction.

Optimization should be evidence-driven.

---

# 63. Database Anti-Patterns to Avoid

## 63.1 Database as an Unstructured Storage Dump

Every entity should have a clear purpose.

## 63.2 Duplicate Sources of Truth

Avoid maintaining multiple conflicting inventory quantities.

## 63.3 Unbounded Historical Queries

Do not load all historical data into memory unnecessarily.

## 63.4 Missing Relationships

Avoid storing references as unvalidated values when a proper relationship is required.

## 63.5 Blind Indexing

Indexes should be justified by access patterns.

## 63.6 Destructive Deletion of Business History

Historical operations must remain interpretable.

## 63.7 Trusting the Client

Client-provided quantities and states must never be considered authoritative.

---

# 64. Conceptual Schema

The core conceptual schema can be summarized as:

```text
                         ┌──────────────┐
                         │    User      │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ AuditRecord  │
                         └──────────────┘


┌──────────────┐
│   Category   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Product    │
└──────┬───────┘
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  Inventory   │          │  Supplier    │
└──────┬───────┘          └──────┬───────┘
       │                         │
       ├───────┐                 │
       │       │                 │
       ▼       ▼                 ▼
┌──────────┐ ┌────────────┐ ┌────────────────┐
│ Movement │ │ Reservation│ │SupplierProduct │
└──────────┘ └─────┬──────┘ └────────────────┘
                   │
                   ▼
              ┌──────────┐
              │  Order   │
              └────┬─────┘
                   │
                   ▼
              ┌──────────┐
              │OrderItem │
              └──────────┘


Product
   │
   ├──────────► Forecast
   ├──────────► Anomaly
   ├──────────► Risk
   └──────────► Recommendation
                         │
                         ▼
                     Scenario
                         │
                         ▼
                   ScenarioResult
```

---

# 65. Data Flow Through the Database

The normal operational flow is:

```text
User Action
    ↓
API Request
    ↓
Validation
    ↓
Business Logic
    ↓
Transaction
    ↓
Database State Change
    ↓
Historical / Audit Record
    ↓
Operational Event
    ↓
Analytics / Intelligence
```

This flow must preserve the distinction between:

**Actual operational state**

and

**Derived analytical/intelligence state**.

---

# 66. Database Read/Write Boundaries

## Operational Writes

Only authorized application operations should mutate core operational data.

Examples:

- Receive inventory.
- Adjust inventory.
- Transfer inventory.
- Reserve inventory.
- Fulfill order.

## Analytical Reads

Analytics and intelligence components may consume operational/historical data according to their defined access boundaries.

## Intelligence Writes

Intelligence components may create:

- Forecasts.
- Anomalies.
- Risks.
- Recommendations.

They must not directly bypass operational business rules to mutate inventory.

---

# 67. Data Ownership Rules

The following rules apply:

1. Inventory owns inventory state.
2. Orders own order lifecycle.
3. Products own product identity.
4. Warehouses own warehouse identity.
5. Suppliers own supplier identity.
6. Intelligence owns generated analytical outputs.
7. Recommendations own decision-support state.
8. Simulation owns scenario state.
9. Audit records preserve historical accountability.

Cross-domain operations must use defined application boundaries.

---

# 68. Database Evolution Strategy

The database should evolve in stages.

```text
Stage 1
Core Identity + Product + Warehouse

Stage 2
Inventory + Movement + Reservation

Stage 3
Orders + Order Items

Stage 4
Suppliers + Procurement

Stage 5
Audit + Historical Data

Stage 6
Analytics Data

Stage 7
Forecasts + Anomalies + Risks

Stage 8
Recommendations + Simulation
```

Each stage should be validated before introducing the next major data domain.

---

# 69. Database Readiness Checklist

Before considering the database foundation complete:

- [ ] Core entities are defined.
- [ ] Entity ownership is defined.
- [ ] Relationships are documented.
- [ ] Primary identifiers are defined.
- [ ] Required constraints are identified.
- [ ] Inventory invariants are defined.
- [ ] Transaction boundaries are identified.
- [ ] Concurrency requirements are documented.
- [ ] Historical data requirements are defined.
- [ ] Audit requirements are defined.
- [ ] Index requirements are justified.
- [ ] Pagination requirements are identified.
- [ ] Data access boundaries are defined.
- [ ] Migration strategy is documented.
- [ ] Backup/recovery strategy is defined for the selected database technology.
- [ ] Database integration tests are planned.
- [ ] Concurrency tests are planned.

---

# 70. Final Database Principle

The StockPilot database should be treated as the foundation of the entire decision system.

The dependency chain is:

```text
Correct Database State
        ↓
Reliable Operational Workflows
        ↓
Reliable Historical Data
        ↓
Reliable Analytics
        ↓
Reliable Intelligence
        ↓
Reliable Recommendations
        ↓
Better Decisions
```

If the first layer is wrong, everything above it becomes questionable.

Therefore:

> **Database correctness is not an implementation detail in StockPilot. It is a product requirement.**

---

# 71. Document Authority

This document defines the conceptual database requirements and data model for StockPilot.

It intentionally does not declare a specific database engine, ORM, migration framework, caching layer, or infrastructure technology.

Those decisions must come from the project's authoritative technical documentation.

Any future technology-specific database design must preserve the requirements and invariants defined in this document.

If a future approved technical decision changes the physical data architecture, this document must be updated so that it accurately reflects the implementation.