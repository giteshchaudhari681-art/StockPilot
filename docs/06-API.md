# StockPilot — API Specification

**Document:** `API.md`  
**Project:** StockPilot  
**Document Type:** API Specification  
**Status:** Draft  
**Version:** 1.0

---

# 1. Purpose

This document defines the conceptual API contract for StockPilot.

The API provides the boundary between StockPilot clients and the backend application.

The API is responsible for exposing business capabilities while protecting the application's:

- Authentication.
- Authorization.
- Business rules.
- Inventory invariants.
- Transactional operations.
- Data integrity.
- Operational workflows.

This document defines **what the API must provide**, while technology-specific implementation details must come from the project's authoritative technical documentation.

---

# 2. API Design Principles

## 2.1 Business-Capability Oriented

The API should expose meaningful business operations rather than exposing raw database operations.

Prefer:

```text
Receive Inventory
Reserve Inventory
Transfer Inventory
Fulfill Order
```

over:

```text
Update Inventory Row
Update Order Row
```

---

## 2.2 Backend Is Authoritative

The API must enforce:

- Authentication.
- Authorization.
- Validation.
- Business rules.
- State transitions.
- Inventory constraints.
- Concurrency requirements.

Client-side validation is not sufficient.

---

## 2.3 Explicit Contracts

Each endpoint should define:

- Purpose.
- Authentication requirements.
- Authorization requirements.
- Request structure.
- Validation rules.
- Response structure.
- Error behavior.
- Side effects.

---

## 2.4 Consistent Errors

Errors should use a predictable structure so clients can handle them consistently.

---

## 2.5 No Direct Database Exposure

Clients must interact with business APIs rather than directly manipulating database records.

---

# 3. API Architecture

The conceptual request flow is:

```text
Client
  ↓
API Request
  ↓
Authentication
  ↓
Authorization
  ↓
Input Validation
  ↓
Application Logic
  ↓
Domain / Business Rules
  ↓
Persistence
  ↓
Response
```

For operations that produce asynchronous work:

```text
Client
  ↓
API
  ↓
Business Operation
  ↓
Persistent State
  ↓
Operational Event / Background Work
  ↓
Async Processing
```

---

# 4. API Base Structure

The final URL structure and versioning convention must be defined by the approved implementation architecture.

Conceptually:

```text
/api/<version>/<resource>
```

Example:

```text
/api/v1/products
/api/v1/warehouses
/api/v1/inventory
/api/v1/orders
```

The exact version prefix must not be assumed until it is approved.

---

# 5. HTTP Method Conventions

The API should use HTTP methods according to their intended semantics.

| Method | Purpose |
|---|---|
| GET | Retrieve information |
| POST | Create a resource or perform a business action |
| PUT | Replace/update a resource where appropriate |
| PATCH | Partially update a resource where appropriate |
| DELETE | Remove/deactivate a resource where appropriate |

Business actions may use action-oriented endpoints when they cannot be represented cleanly as generic resource updates.

---

# 6. Authentication APIs

## 6.1 Login

**Purpose:** Authenticate a user.

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

### Response

The response should contain the authentication/session information required by the approved authentication architecture.

### Errors

Potential errors:

- Invalid credentials.
- Invalid request.
- Account unavailable.
- Authentication service failure.

---

# 7. Current User

## 7.1 Get Current User

**Purpose:** Retrieve the authenticated user's information.

**Method:** `GET`

**Conceptual endpoint:**

```text
/api/<version>/auth/me
```

### Authentication

Required.

### Response

Should contain relevant non-sensitive user information.

Sensitive credential information must never be returned.

---

# 8. Logout

## 8.1 Logout

**Purpose:** End the authenticated session where applicable.

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/auth/logout
```

The exact behavior depends on the approved authentication architecture.

---

# 9. Product APIs

## 9.1 Create Product

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/products
```

### Request

```json
{
  "sku": "SKU-001",
  "name": "Example Product",
  "description": "Product description",
  "categoryId": "category-id",
  "unit": "unit"
}
```

### Validation

- SKU required.
- Name required.
- SKU uniqueness must be enforced.
- Category reference must be valid where applicable.
- User must have permission to create products.

### Response

Returns the created product.

---

# 10. List Products

**Method:** `GET`

**Conceptual endpoint:**

```text
/api/<version>/products
```

### Supported Query Concepts

- Search.
- Category.
- Status.
- Sorting.
- Pagination.

Example:

```text
/api/<version>/products?search=phone&status=active
```

The exact query syntax must be defined in the implementation specification.

---

# 11. Get Product

**Method:** `GET`

**Conceptual endpoint:**

```text
/api/<version>/products/{productId}
```

Returns the requested product.

### Errors

- Product not found.
- Unauthorized access.

---

# 12. Update Product

**Method:** `PATCH`

**Conceptual endpoint:**

```text
/api/<version>/products/{productId}
```

Only authorized users may update protected product information.

---

# 13. Deactivate Product

**Method:** `POST` or another approved action method.

**Conceptual endpoint:**

```text
/api/<version>/products/{productId}/deactivate
```

The operation should preserve historical references.

A product that participates in historical transactions should not be destructively deleted without an explicit approved business rule.

---

# 14. Category APIs

## 14.1 Create Category

```text
POST /api/<version>/categories
```

## 14.2 List Categories

```text
GET /api/<version>/categories
```

## 14.3 Get Category

```text
GET /api/<version>/categories/{categoryId}
```

## 14.4 Update Category

```text
PATCH /api/<version>/categories/{categoryId}
```

The exact category capabilities depend on the final product scope.

---

# 15. Warehouse APIs

## 15.1 Create Warehouse

```text
POST /api/<version>/warehouses
```

### Example Request

```json
{
  "name": "Main Warehouse",
  "location": "Pune"
}
```

---

# 16. List Warehouses

```text
GET /api/<version>/warehouses
```

Supports appropriate:

- Search.
- Status filtering.
- Pagination.
- Sorting.

---

# 17. Get Warehouse

```text
GET /api/<version>/warehouses/{warehouseId}
```

Returns warehouse information.

---

# 18. Update Warehouse

```text
PATCH /api/<version>/warehouses/{warehouseId}
```

Requires appropriate authorization.

---

# 19. Warehouse Inventory

**Purpose:** Retrieve inventory associated with a warehouse.

**Method:** `GET`

**Conceptual endpoint:**

```text
/api/<version>/warehouses/{warehouseId}/inventory
```

Supports:

- Product filtering.
- Search.
- Inventory status.
- Pagination.
- Sorting.

---

# 20. Inventory APIs

Inventory operations are critical APIs.

They must preserve inventory invariants and concurrency guarantees.

---

# 21. Get Inventory

```text
GET /api/<version>/inventory/{inventoryId}
```

Returns the current inventory position.

Potential response fields:

```json
{
  "id": "inventory-id",
  "productId": "product-id",
  "warehouseId": "warehouse-id",
  "physicalQuantity": 100,
  "reservedQuantity": 20,
  "availableQuantity": 80
}
```

The final representation must follow the approved data model.

---

# 22. List Inventory

```text
GET /api/<version>/inventory
```

Potential filters:

- Product.
- Warehouse.
- Category.
- Stock status.
- Search.
- Quantity range.
- Pagination.

---

# 23. Receive Inventory

**Purpose:** Record incoming stock.

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/inventory/receive
```

### Request

```json
{
  "productId": "product-id",
  "warehouseId": "warehouse-id",
  "quantity": 100,
  "reference": "receipt-reference"
}
```

### Business Rules

- Product must exist.
- Warehouse must exist.
- Quantity must be valid.
- User must be authorized.
- Inventory state must be updated consistently.
- Appropriate inventory history must be recorded.

---

# 24. Adjust Inventory

**Purpose:** Perform an authorized inventory adjustment.

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/inventory/adjust
```

### Request

```json
{
  "productId": "product-id",
  "warehouseId": "warehouse-id",
  "quantity": 10,
  "reason": "Approved adjustment"
}
```

The exact adjustment semantics must be explicitly defined.

---

# 25. Transfer Inventory

**Purpose:** Move inventory between warehouses.

**Method:** `POST`

**Conceptual endpoint:**

```text
/api/<version>/inventory/transfer
```

### Request

```json
{
  "productId": "product-id",
  "sourceWarehouseId": "warehouse-a",
  "destinationWarehouseId": "warehouse-b",
  "quantity": 25
}
```

### Required Behavior

The operation must:

1. Validate the source.
2. Validate the destination.
3. Validate available quantity.
4. Perform the source change.
5. Perform the destination change.
6. Record the movement.
7. Preserve transactional consistency.

A transfer must not partially complete.

---

# 26. Inventory Movement History

```text
GET /api/<version>/inventory/movements
```

Potential filters:

- Product.
- Warehouse.
- Movement type.
- Date range.
- Actor.
- Reference.

The endpoint must support pagination.

---

# 27. Inventory Reservation APIs

## 27.1 Reserve Inventory

```text
POST /api/<version>/inventory/reservations
```

### Request

```json
{
  "orderId": "order-id",
  "productId": "product-id",
  "warehouseId": "warehouse-id",
  "quantity": 5
}
```

### Business Rules

- Order must be eligible.
- Product must exist.
- Warehouse must exist.
- Available quantity must be sufficient.
- Concurrent reservation attempts must be handled safely.

---

# 28. Release Reservation

```text
POST /api/<version>/inventory/reservations/{reservationId}/release
```

The operation must validate the reservation's current state.

Repeated release operations must not create duplicate effects.

---

# 29. Get Reservation

```text
GET /api/<version>/inventory/reservations/{reservationId}
```

Returns reservation information and status.

---

# 30. Order APIs

## 30.1 Create Order

```text
POST /api/<version>/orders
```

### Conceptual Request

```json
{
  "warehouseId": "warehouse-id",
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
    }
  ]
}
```

The final order structure must follow the approved product requirements.

---

# 31. List Orders

```text
GET /api/<version>/orders
```

Potential filters:

- Status.
- Warehouse.
- Date range.
- Product.
- Search.
- Pagination.

---

# 32. Get Order

```text
GET /api/<version>/orders/{orderId}
```

Returns:

- Order information.
- Order items.
- Current status.
- Relevant inventory reservation information.
- Relevant timestamps.

---

# 33. Confirm Order

```text
POST /api/<version>/orders/{orderId}/confirm
```

The backend must validate whether the order can transition to the next state.

---

# 34. Process Order

```text
POST /api/<version>/orders/{orderId}/process
```

The exact workflow must follow the approved order state machine.

---

# 35. Fulfill Order

```text
POST /api/<version>/orders/{orderId}/fulfill
```

### Required Validation

- Order must be in an eligible state.
- Required reservation must exist where applicable.
- Inventory must remain valid.
- Authorization must be checked.
- Fulfillment must be recorded.

---

# 36. Cancel Order

```text
POST /api/<version>/orders/{orderId}/cancel
```

The operation must:

- Validate order state.
- Cancel the order.
- Release applicable reservations.
- Preserve history.

---

# 37. Order State Transitions

The API must enforce the defined state machine.

Conceptually:

```text
Created
   │
   ├──────────────► Cancelled
   │
   ▼
Confirmed
   │
   ├──────────────► Cancelled
   │
   ▼
Reserved
   │
   ├──────────────► Cancelled
   │
   ▼
Processing
   │
   ▼
Fulfilled
```

Invalid transitions must return an appropriate conflict/business-rule error.

---

# 38. Supplier APIs

## 38.1 Create Supplier

```text
POST /api/<version>/suppliers
```

---

# 39. List Suppliers

```text
GET /api/<version>/suppliers
```

Supports appropriate:

- Search.
- Status.
- Pagination.
- Sorting.

---

# 40. Get Supplier

```text
GET /api/<version>/suppliers/{supplierId}
```

---

# 41. Update Supplier

```text
PATCH /api/<version>/suppliers/{supplierId}
```

---

# 42. Supplier-Product APIs

## Associate Supplier With Product

```text
POST /api/<version>/suppliers/{supplierId}/products
```

The relationship should support relevant information such as:

- Product.
- Lead time.
- Status.
- Supplier-specific configuration.

---

# 43. Procurement APIs

Procurement APIs support replenishment operations.

Potential capabilities include:

```text
GET  /api/<version>/procurement
POST /api/<version>/procurement
GET  /api/<version>/procurement/{procurementId}
PATCH /api/<version>/procurement/{procurementId}
```

The final procurement contract depends on the approved procurement workflow.

---

# 44. Dashboard APIs

The dashboard should consume purpose-built operational summaries rather than requiring the client to make excessive independent requests.

Conceptually:

```text
GET /api/<version>/dashboard/summary
```

Potential response:

```json
{
  "inventory": {
    "total": 0,
    "available": 0,
    "reserved": 0
  },
  "orders": {
    "pending": 0,
    "processing": 0
  },
  "risks": {
    "critical": 0,
    "high": 0
  },
  "alerts": []
}
```

The exact response structure must be defined by frontend requirements and performance measurements.

---

# 45. Analytics APIs

Analytics endpoints should expose meaningful analytical information.

Potential capabilities:

```text
GET /api/<version>/analytics/inventory
GET /api/<version>/analytics/demand
GET /api/<version>/analytics/stockouts
GET /api/<version>/analytics/overstock
GET /api/<version>/analytics/suppliers
```

Analytics endpoints should support appropriate:

- Date ranges.
- Product filters.
- Warehouse filters.
- Aggregation periods.

---

# 46. Forecast APIs

## 46.1 Get Forecast

```text
GET /api/<version>/forecasts/{forecastId}
```

---

## 46.2 Product Forecast

```text
GET /api/<version>/products/{productId}/forecast
```

Potential query parameters:

- Forecast horizon.
- Start date.
- End date.

---

## 46.3 Generate Forecast

If forecasting is triggered through an API, the operation may be asynchronous.

Conceptually:

```text
POST /api/<version>/forecasts/generate
```

The exact behavior must be determined by the intelligence architecture.

---

# 47. Forecast Response

A forecast response should provide enough context to distinguish prediction from actual demand.

Conceptually:

```json
{
  "productId": "product-id",
  "forecast": [
    {
      "period": "future-period",
      "predictedDemand": 120
    }
  ],
  "generatedAt": "timestamp"
}
```

Where supported, uncertainty information should also be provided.

---

# 48. Anomaly APIs

## List Anomalies

```text
GET /api/<version>/anomalies
```

Potential filters:

- Severity.
- Status.
- Product.
- Warehouse.
- Date range.
- Type.

---

## Get Anomaly

```text
GET /api/<version>/anomalies/{anomalyId}
```

The response should provide:

- Anomaly type.
- Severity.
- Related entity.
- Supporting information.
- Status.
- Detection time.

---

# 49. Risk APIs

## List Risks

```text
GET /api/<version>/risks
```

Potential filters:

- Risk type.
- Severity.
- Status.
- Product.
- Warehouse.
- Supplier.

---

## Get Risk

```text
GET /api/<version>/risks/{riskId}
```

Returns the risk and its relevant supporting factors.

---

# 50. Recommendation APIs

## List Recommendations

```text
GET /api/<version>/recommendations
```

Potential filters:

- Status.
- Type.
- Priority.
- Product.
- Warehouse.
- Supplier.

---

# 51. Get Recommendation

```text
GET /api/<version>/recommendations/{recommendationId}
```

The response should contain:

- Proposed action.
- Related entity.
- Supporting factors.
- Relevant forecast/risk information.
- Status.
- Generated timestamp.
- Review information where applicable.

---

# 52. Review Recommendation

```text
POST /api/<version>/recommendations/{recommendationId}/review
```

The review operation records that an authorized user has reviewed the recommendation.

---

# 53. Approve Recommendation

```text
POST /api/<version>/recommendations/{recommendationId}/approve
```

Approval does not automatically bypass business validation.

Before execution, the operational system must revalidate the current state.

---

# 54. Reject Recommendation

```text
POST /api/<version>/recommendations/{recommendationId}/reject
```

The system should preserve the rejection as part of the recommendation history.

---

# 55. Execute Recommendation

If recommendation execution is supported:

```text
POST /api/<version>/recommendations/{recommendationId}/execute
```

### Critical Rule

The execution operation must:

1. Verify recommendation status.
2. Revalidate current operational state.
3. Revalidate authorization.
4. Re-run relevant business rules.
5. Execute the appropriate business operation.
6. Record the resulting action.

A recommendation must never become a privileged shortcut around normal business rules.

---

# 56. Scenario APIs

## Create Scenario

```text
POST /api/<version>/scenarios
```

Example:

```json
{
  "name": "Demand Increase Scenario",
  "description": "Evaluate a 20% demand increase",
  "assumptions": {
    "demandMultiplier": 1.2
  }
}
```

---

# 57. List Scenarios

```text
GET /api/<version>/scenarios
```

Supports appropriate:

- User filtering.
- Status.
- Date range.
- Pagination.

---

# 58. Get Scenario

```text
GET /api/<version>/scenarios/{scenarioId}
```

Returns scenario configuration and current status.

---

# 59. Run Scenario

```text
POST /api/<version>/scenarios/{scenarioId}/run
```

The operation may be asynchronous depending on simulation complexity.

The simulation must remain isolated from production state.

---

# 60. Scenario Results

```text
GET /api/<version>/scenarios/{scenarioId}/results
```

Potential result information:

- Projected inventory.
- Projected stockout risk.
- Projected overstock risk.
- Relevant operational metrics.
- Scenario assumptions.
- Result timestamp.

---

# 61. Scenario Comparison

```text
POST /api/<version>/scenarios/compare
```

The request may contain multiple scenario identifiers.

The response should provide comparable metrics.

The exact comparison contract must be defined after the simulation model is established.

---

# 62. Audit APIs

Audit data should be exposed only to appropriately authorized users.

## List Audit Records

```text
GET /api/<version>/audit
```

Potential filters:

- Actor.
- Action.
- Entity.
- Entity identifier.
- Date range.

---

## Get Audit Record

```text
GET /api/<version>/audit/{auditId}
```

---

# 63. Administrative APIs

Administrative APIs should be isolated from general user capabilities.

Potential areas:

```text
GET   /api/<version>/admin/users
PATCH /api/<version>/admin/users/{userId}
GET   /api/<version>/admin/roles
```

The exact administration surface must follow the security architecture.

---

# 64. Health and Operational Endpoints

The system may expose appropriate health/readiness information.

Conceptually:

```text
GET /health
GET /ready
```

The exact endpoints and response semantics must follow the deployment architecture.

Sensitive infrastructure information must not be unnecessarily exposed.

---

# 65. Request Validation

Every write endpoint must validate input.

Validation should cover:

- Required fields.
- Data types.
- Allowed ranges.
- Valid identifiers.
- Valid relationships.
- Valid states.
- Business rules.

Example:

```json
{
  "quantity": -10
}
```

must be rejected if negative inventory operations are not allowed by the business rule.

---

# 66. Authorization

Every protected endpoint must verify that the authenticated user is authorized to perform the requested operation.

Authorization must consider:

- User identity.
- Role.
- Permission.
- Resource.
- Operation.

The API must not assume that possession of a resource identifier implies access.

---

# 67. Error Response Format

The API should use a consistent error structure.

Conceptual format:

```json
{
  "error": {
    "code": "INVENTORY_INSUFFICIENT",
    "message": "Insufficient available inventory.",
    "details": {}
  }
}
```

The exact schema must be defined by the final API implementation.

---

# 68. Error Categories

The API should distinguish between:

### Authentication

```text
401
```

### Authorization

```text
403
```

### Resource Not Found

```text
404
```

### Validation

```text
400 / appropriate validation status
```

### Conflict

```text
409
```

### Rate/Capacity Limitation

Where applicable, the appropriate status should be used.

### Server/Dependency Failure

```text
5xx
```

Exact status-code conventions must be standardized before implementation.

---

# 69. Concurrency Errors

Critical operations may encounter concurrency conflicts.

Example:

```text
Reservation attempted
        ↓
Inventory changed concurrently
        ↓
Business condition no longer valid
```

The API must return a controlled conflict response rather than silently overwriting the newer state.

---

# 70. Idempotency

Operations that may be retried must have appropriate idempotency behavior.

Important candidates include:

- Inventory receipt.
- Inventory transfer.
- Reservation.
- Order fulfillment.
- Recommendation execution.
- Event-driven processing.

The exact idempotency mechanism must be defined by the implementation architecture.

---

# 71. Pagination Contract

Paginated endpoints should provide enough information for clients to navigate results.

Conceptual response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 100
  }
}
```

The exact pagination strategy may use another cursor or token-based structure if required by the approved architecture.

---

# 72. Filtering and Sorting

Filtering should be explicit and predictable.

Example conceptual request:

```text
GET /api/<version>/inventory
    ?warehouseId=warehouse-id
    &status=low
    &sort=quantity
```

The API must validate supported filters.

Unknown or unsupported filters should not silently produce misleading results.

---

# 73. API Response Principles

Responses should:

- Be predictable.
- Contain only required information.
- Avoid leaking sensitive data.
- Use consistent naming.
- Represent resource state accurately.
- Include relevant identifiers.
- Include relevant timestamps where required.

---

# 74. API Versioning

The API should have a defined versioning strategy before public or long-lived clients depend on it.

Potential conceptual structure:

```text
/api/v1/...
```

Future breaking changes should not silently alter existing contracts.

The exact versioning policy must be documented in the implementation architecture.

---

# 75. API Security Requirements

The API must protect against:

- Unauthorized access.
- Invalid input.
- Privilege escalation.
- Resource enumeration where inappropriate.
- Unauthorized mutations.
- Sensitive information leakage.
- Duplicate operations.
- Improper state transitions.

Security testing must include both expected and adversarial requests.

---

# 76. API Performance

API performance should be measured based on realistic workloads.

Important areas include:

- Dashboard requests.
- Inventory queries.
- Order queries.
- Historical movement queries.
- Analytics queries.
- Intelligence queries.

Large data responses must use pagination or appropriate aggregation.

---

# 77. API and Database Boundary

The API must not expose the database schema directly.

Conceptually:

```text
API Contract
     ↓
Application Model
     ↓
Domain Model
     ↓
Persistence Model
```

Database changes should not automatically become breaking API changes.

---

# 78. API and Intelligence Boundary

Intelligence endpoints should expose intelligence results rather than internal model implementation details.

For example:

```text
GET /forecasts/{id}
```

should expose the forecast result and relevant metadata.

The API should not require clients to understand how the forecasting algorithm works internally.

---

# 79. API and Simulation Boundary

Simulation endpoints must clearly distinguish simulated state from real operational state.

Responses should identify that values are projections.

A simulation result must never be presented as current production inventory.

---

# 80. API and Audit Boundary

Important API operations should produce appropriate audit information.

Examples:

```text
POST /inventory/transfer
        ↓
Inventory Change
        ↓
Audit Record
```

```text
POST /recommendations/{id}/approve
        ↓
Approval
        ↓
Audit Record
```

---

# 81. API Documentation Requirements

Each implemented endpoint should document:

- Endpoint.
- Method.
- Authentication.
- Authorization.
- Request schema.
- Response schema.
- Validation.
- Errors.
- Side effects.
- Idempotency behavior where relevant.
- Concurrency behavior where relevant.

---

# 82. API Testing Strategy

API tests should cover:

## Functional Tests

- Successful requests.
- Expected responses.
- Valid state transitions.

## Validation Tests

- Missing fields.
- Invalid values.
- Invalid identifiers.

## Authorization Tests

- Unauthorized users.
- Insufficient permissions.
- Cross-resource access attempts.

## Concurrency Tests

- Reservation races.
- Concurrent updates.
- Duplicate requests.

## Error Tests

- Not found.
- Conflict.
- Dependency failures.
- Invalid states.

## Integration Tests

- Database behavior.
- Background processing.
- Event interactions.

---

# 83. Critical API Workflows

## Inventory Receipt

```text
POST /inventory/receive
        ↓
Validate
        ↓
Authorize
        ↓
Update Inventory
        ↓
Record Movement
        ↓
Return Result
```

---

## Inventory Transfer

```text
POST /inventory/transfer
        ↓
Validate Source
        ↓
Validate Destination
        ↓
Check Availability
        ↓
Execute Atomic Operation
        ↓
Record Movement
        ↓
Return Result
```

---

## Order Fulfillment

```text
POST /orders/{id}/fulfill
        ↓
Authenticate
        ↓
Authorize
        ↓
Validate Order State
        ↓
Validate Inventory State
        ↓
Execute Fulfillment
        ↓
Update Relevant State
        ↓
Record History
        ↓
Return Result
```

---

## Recommendation Execution

```text
POST /recommendations/{id}/execute
        ↓
Validate Recommendation
        ↓
Revalidate Current State
        ↓
Authorize
        ↓
Execute Business Operation
        ↓
Record Result
        ↓
Return Result
```

The recommendation itself must never bypass the normal business operation.

---

# 84. API Anti-Patterns

## 84.1 CRUD-Only API Design

A complex operational system should not reduce every operation to generic CRUD.

---

## 84.2 Trusting Client State

The client must not be trusted for:

- Inventory quantities.
- Authorization.
- Order transitions.
- Recommendation approval.
- Operational ownership.

---

## 84.3 Business Logic in Controllers

Controllers should not become large collections of business rules.

---

## 84.4 Returning Unbounded Data

Large collections must be paginated or appropriately aggregated.

---

## 84.5 Silent State Changes

Important business operations should be explicit and traceable.

---

## 84.6 Stale Recommendation Execution

An old recommendation must not be executed without current-state validation.

---

## 84.7 Exposing Internal Errors

Internal implementation details, credentials, stack traces, and sensitive infrastructure information must not be exposed through API responses.

---

# 85. API Implementation Order

The API should be implemented progressively.

```text
Phase 1
Authentication
        ↓
Phase 2
Products + Warehouses + Suppliers
        ↓
Phase 3
Inventory + Movements + Reservations
        ↓
Phase 4
Orders + Fulfillment + Procurement
        ↓
Phase 5
Realtime / Events / Background Operations
        ↓
Phase 6
Analytics + Forecasts + Anomalies + Risks
        ↓
Phase 7
Recommendations + Simulation
        ↓
Phase 8
Security + Performance + Reliability + Final Contract
```

---

# 86. API Definition of Done

An endpoint is not complete merely because it returns a successful response.

A production-ready endpoint must have:

- Defined purpose.
- Defined request contract.
- Defined response contract.
- Authentication requirements.
- Authorization requirements.
- Input validation.
- Business-rule enforcement.
- Correct persistence behavior.
- Appropriate error handling.
- Appropriate audit behavior.
- Appropriate concurrency handling.
- Tests.
- Documentation.

---

# 87. API Contract Governance

Changes to API contracts must be deliberate.

Before changing an existing endpoint, evaluate:

1. Is the change breaking?
2. Which clients depend on it?
3. Does the business behavior change?
4. Does authorization change?
5. Does the response schema change?
6. Does the database behavior change?
7. Are tests updated?
8. Is versioning required?

---

# 88. Final API Architecture

The StockPilot API should follow:

```text
                 ┌──────────────────────┐
                 │       Client         │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    API Boundary      │
                 └──────────┬───────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
       Authentication   Validation    Authorization
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌──────────────────────┐
                 │ Application Logic    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Domain / Business    │
                 │ Rules                │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Transaction / Data   │
                 │ Layer                │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Response / Event     │
                 └──────────────────────┘
```

The API is therefore not simply a collection of endpoints.

It is the controlled boundary through which StockPilot's business capabilities are exposed.

---

# 89. Final API Principle

The StockPilot API should follow this rule:

> **Expose business capabilities, enforce business rules, preserve data integrity, and never allow the client to bypass the operational domain.**

The most important API priorities are:

**Security → Correctness → Consistency → Explicit Contracts → Reliability → Performance**

Advanced intelligence endpoints must remain downstream of the operational system and must never weaken the guarantees of the core inventory and order workflows.

---

# 90. Document Authority

This document defines the conceptual API requirements and contracts for StockPilot.

It does not independently select:

- Backend framework.
- API framework.
- Authentication library.
- Database.
- ORM.
- Messaging system.
- Real-time technology.
- API documentation tooling.

Those decisions must come from the project's authoritative technical documentation.

Where a future approved technical specification defines a more precise API contract, that specification takes precedence and this document must be updated to remain consistent with the actual implementation.