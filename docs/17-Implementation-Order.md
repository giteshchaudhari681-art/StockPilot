StockPilot — Implementation Order
1. Purpose
This document defines the mandatory implementation sequence for StockPilot.
The purpose is to prevent:
- building features before their dependencies exist
- creating unnecessary infrastructure too early
- coupling frontend work to unfinished backend contracts
- implementing AI/ML before reliable inventory data exists
- creating tests only after the system is already difficult to debug
- making architectural changes during feature implementation without documenting them
StockPilot must be implemented incrementally from foundation → core inventory → operational workflows → intelligence → user experience → validation → deployment.
The implementation order is not merely a checklist. It defines the dependency graph of the system.
2. Core Implementation Principle
StockPilot must be built in this order:
Foundation
    ↓
Database
    ↓
Backend Core
    ↓
Authentication
    ↓
Core Inventory Domain
    ↓
Products / Warehouses / Suppliers
    ↓
Orders
    ↓
Dashboard
    ↓
Data Pipeline
    ↓
Forecasting
    ↓
Anomaly Detection
    ↓
Risk Analysis
    ↓
Recommendations
    ↓
Simulations
    ↓
Frontend Refinement
    ↓
Integration Testing
    ↓
Security Testing
    ↓
Performance Testing
    ↓
Deployment
The critical rule is:
Do not build intelligence on top of unreliable operational data.

Forecasting, anomaly detection, risk analysis, and recommendations are only useful when the underlying inventory, order, supplier, and warehouse data is trustworthy.
3. Phase 0 — Repository Foundation
Objective
Create the initial repository structure and development environment.
Implement
stockpilot/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── .gitignore
├── .editorconfig
├── .env.example
└── .dockerignore
Create:
frontend/
backend/
ml-service/
database/
prisma/
shared/
tests/
scripts/
infrastructure/
docs/
tools/
Deliverables
- repository initialized
- project documentation available
- environment-variable conventions established
- frontend project initialized
- backend project initialized
- ML service initialized
- Prisma initialized
- shared contracts initialized
Exit Criteria
- repository installs successfully
- frontend starts successfully
- backend starts successfully
- ML service starts successfully
- no application feature has been implemented yet
4. Phase 1 — Database Foundation
Objective
Establish the persistent data model before implementing business logic.
Implement
prisma/
├── schema.prisma
└── migrations/
Create the initial domain model for:
Users
Products
Warehouses
Inventory
Inventory Movements
Inventory Transfers
Inventory Reservations
Suppliers
Orders
Order Items
Tasks
1. Define Prisma models.
2. Define primary keys.
3. Define foreign-key relationships.
4. Define required constraints.
5. Define indexes required by common queries.
6. Define timestamps.
7. Define status fields.
8. Define ownership relationships.
9. Generate the initial migration.
10. Validate migration against a clean database.
Exit Criteria
- Prisma schema validates.
- Migration applies successfully.
- Database can be initialized from zero.
- Seed data can be inserted.
- Relationships behave correctly.
5. Phase 2 — Backend Foundation
Objective
Build the backend infrastructure required by every domain module.
Implement
backend/src/
├── server.ts
├── app.ts
├── config/
├── common/
├── middleware/
└── routes/
Implement First
config/
├── env.ts
├── database.ts
├── redis.ts
└── application.ts
Then:
common/
├── errors/
├── middleware/
├── types/
└── utils/
Then:
middleware/
├── auth.middleware.ts
├── role.middleware.ts
└── rate-limit.middleware.ts
Exit Criteria
- Express application starts.
- Database connection works.
- Redis connection works.
- Error handling works.
- Request IDs are supported.
- Validation middleware works.
- Basic health endpoint works.
6. Phase 3 — Authentication and Authorization
Objective
Establish the security boundary before exposing business functionality.
Implement
backend/src/auth/
├── auth.controller.ts
├── auth.service.ts
├── auth.repository.ts
├── auth.schema.ts
├── auth.types.ts
├── password.service.ts
└── token.service.ts
Implement
- user registration if required
- login
- password handling
- token generation
- token validation
- session handling
- protected routes
- role authorization
- ownership checks
Frontend
Implement:
frontend/src/features/authentication/
├── components/
├── hooks/
├── services/
├── schemas/
└── types/
Exit Criteria
A user can:
Login
  ↓
Receive authenticated session
  ↓
Access protected application
  ↓
Access only permitted resources
  ↓
Logout
Unauthorized users must not be able to access protected resources.
7. Phase 4 — Products
Objective
Build the product catalog because inventory cannot exist without products.
Backend
backend/src/products/
├── product.controller.ts
├── product.service.ts
├── product.repository.ts
├── product.schema.ts
├── product.types.ts
└── product.mapper.ts
Frontend
frontend/src/features/products/
├── components/
├── hooks/
├── services/
├── schemas/
└── types/
Implement
- create product
- update product
- retrieve product
- list products
- search products
- filtering
- validation
- product status
Exit Criteria
Product lifecycle works end-to-end.
8. Phase 5 — Warehouses
Objective
Establish physical inventory locations.
Implement
backend/src/warehouses/
and:
frontend/src/features/warehouses/
Implement
- create warehouse
- update warehouse
- retrieve warehouse
- warehouse capacity
- warehouse inventory association
- warehouse filtering
Exit Criteria
Products can be associated with warehouses.
9. Phase 6 — Inventory Core
Objective
Build the central operational domain of StockPilot.
This is one of the most important phases.
Implement
backend/src/inventory/
├── inventory.controller.ts
├── inventory.service.ts
├── inventory.repository.ts
├── inventory.schema.ts
├── inventory.types.ts
├── inventory.mapper.ts
│
├── movements/
├── transfers/
└── reservations/
Inventory Operations
Implement:
Stock creation
Stock update
Stock adjustment
Stock movement
Stock transfer
Stock reservation
Stock release
Inventory history
Critical Rules
Inventory updates must be:
- validated
- atomic where required
- ownership-aware
- auditable
- consistent with inventory movements
Exit Criteria
The system can accurately answer:
What product?
How many units?
Which warehouse?
Available stock?
Reserved stock?
Incoming stock?
Outgoing stock?
What changed?
When did it change?
Why did it change?
10. Phase 7 — Inventory Movement and Transfer System
Objective
Implement operational movement of inventory between locations.
Implement
inventory/movements/
inventory/transfers/
inventory/reservations/
Workflow
Request
  ↓
Validation
  ↓
Authorization
  ↓
Inventory availability check
  ↓
Transaction
  ↓
Inventory update
  ↓
Movement record
  ↓
Event
  ↓
Notification / downstream processing
Exit Criteria
Concurrent inventory operations do not produce invalid stock levels.
11. Phase 8 — Suppliers
Objective
Establish supplier information required for procurement and risk analysis.
Implement
backend/src/suppliers/
frontend/src/features/suppliers/
Implement
- supplier CRUD
- supplier metadata
- supplier performance information
- supplier inventory relationships
- supplier risk data
Exit Criteria
Supplier information can be consumed by order management and intelligence systems.
12. Phase 9 — Orders
Objective
Implement operational ordering workflows.
Implement
backend/src/orders/
frontend/src/features/orders/
Implement
- create order
- update order
- order items
- order status
- fulfillment
- cancellation
- order history
Core Flow
Create Order
    ↓
Validate Items
    ↓
Validate Supplier
    ↓
Create Order
    ↓
Update Relevant Inventory State
    ↓
Track Order Status
Exit Criteria
Orders can be created and tracked end-to-end.
13. Phase 10 — Dashboard
Objective
Create the operational command center.
Backend
backend/src/dashboard/
Frontend
frontend/src/features/dashboard/
Implement
DashboardHeader.tsx
InventoryOverview.tsx
StockoutOverview.tsx
OverstockOverview.tsx
RiskOverview.tsx
ForecastOverview.tsx
RecommendationOverview.tsx
Dashboard Must Display
- inventory overview
- stockout risks
- overstock risks
- forecast information
- risk information
- recommendations
Important Rule
The dashboard should consume existing domain APIs.
Do not duplicate inventory business logic inside dashboard components.
14. Phase 11 — Frontend Operational Experience
Objective
Build the complete user-facing operational workflows.
Implement
Products
Warehouses
Inventory
Suppliers
Orders
Dashboard
Implement Shared Components
components/ui/
components/layout/
components/forms/
components/tables/
components/charts/
components/feedback/
Exit Criteria
A user can operate StockPilot without interacting directly with APIs.
15. Phase 12 — Background Processing
Objective
Move expensive or asynchronous workloads away from synchronous API requests.
Implement
workers/
├── queues/
├── processors/
└── services/
Initial Queues
Inventory
Forecasting
Recommendations
Notifications
Rule
Do not put long-running forecasting or recommendation calculations directly inside ordinary API request handlers.
16. Phase 13 — ML Service Foundation
Objective
Create the Python intelligence service after reliable operational data exists.
Implement
ml-service/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│   ├── api/
│   └── common/
└── tests/
Initial API
GET  /health
POST /forecasting
POST /anomaly
POST /risk
POST /recommendation
POST /simulation
Exit Criteria
- ML service starts.
- FastAPI routes work.
- Request schemas validate.
- Response schemas validate.
- Backend can communicate with ML service.
17. Phase 14 — Forecasting
Objective
Implement demand forecasting.
Implementation Order
Data
  ↓
Cleaning
  ↓
Validation
  ↓
Preprocessing
  ↓
Feature Engineering
  ↓
Baseline Model
  ↓
Statistical Model
  ↓
Machine Learning Model
  ↓
Evaluation
  ↓
Inference
  ↓
Confidence
Files
forecasting/
├── data/
├── preprocessing/
├── features/
├── models/
├── inference/
├── evaluation/
└── configuration/
Important Rule
A complex model must not be introduced before a baseline exists.
The system must be able to answer:
Is the ML model actually better than a simpler approach?

18. Phase 15 — Anomaly Detection
Objective
Identify abnormal inventory and demand behavior.
Implementation Order
Data
  ↓
Cleaning
  ↓
Features
  ↓
Detection Model
  ↓
Anomaly Score
  ↓
Severity
  ↓
Evidence
Implement
anomaly_detection/
├── data/
├── preprocessing/
├── features/
├── models/
├── inference/
└── evaluation/
Exit Criteria
Each anomaly should contain enough information to explain:
What happened?
How unusual is it?
Why was it detected?
How severe is it?
19. Phase 16 — Supplier Risk
Objective
Estimate supplier-related operational risk.
Implement
supplier_risk/
├── data/
├── preprocessing/
├── features/
├── models/
├── inference/
└── evaluation/
Inputs May Include
- supplier performance
- delivery behavior
- quality behavior
- historical operational data
Exit Criteria
Risk scores are reproducible and explainable.
20. Phase 17 — Recommendation Engine
Objective
Turn intelligence into actionable operational recommendations.
Implementation Order
Inventory Data
      ↓
Forecasts
      ↓
Anomalies
      ↓
Supplier Risk
      ↓
Signals
      ↓
Rules
      ↓
Ranking
      ↓
Recommendation
      ↓
Validation
Implement
recommendations/
├── signals/
├── rules/
├── ranking/
├── generation/
└── validation/
Examples
Potential Stockout
        ↓
Recommend Reorder

Excess Inventory
        ↓
Recommend Inventory Reduction

Supplier Risk Increase
        ↓
Recommend Supplier Review
Critical Rule
Recommendations must never blindly execute business actions.
The system should distinguish between:
Prediction
Recommendation
Action
These are three different concepts.
21. Phase 18 — Simulation
Objective
Allow users to evaluate hypothetical inventory scenarios.
Implement
simulation/
├── scenario.py
├── state.py
├── engine.py
├── result.py
└── validator.py
Example
Current Inventory
       ↓
User Changes Assumption
       ↓
Simulation Engine
       ↓
Projected State
       ↓
Result
       ↓
Comparison
Examples of Scenarios
- demand increase
- demand decrease
- supplier delay
- inventory increase
- inventory reduction
- reorder changes
Exit Criteria
Simulation does not modify production inventory.
22. Phase 19 — AI / Intelligence Presentation
Objective
Present intelligence clearly to users.
Implement
frontend/src/components/intelligence/
Components
InsightCard.tsx
ForecastCard.tsx
RiskCard.tsx
RecommendationCard.tsx
ConfidenceIndicator.tsx
EvidencePanel.tsx
ScenarioResultCard.tsx
Design Rule
The UI must communicate:
Result
Confidence
Evidence
Impact
Recommended Action
not merely:
AI says...
23. Phase 20 — Real-Time Features
Objective
Introduce real-time updates where they materially improve the product.
Implement
backend/src/realtime/
├── socket.ts
├── socket-auth.ts
└── inventory-events.ts
Frontend
frontend/src/lib/socket-client.ts
frontend/src/providers/SocketProvider.tsx
Real-Time Events
Examples:
Inventory Updated
Order Updated
Risk Updated
Recommendation Created
Forecast Updated
Exit Criteria
Real-time events are authenticated and scoped correctly.
24. Phase 21 — Testing
Testing must not be postponed until the end.
Testing occurs continuously, but the complete test suite is finalized after the main functionality exists.
24.1 Unit Testing
Test:
Services
Repositories
Validation
Business Rules
ML Functions
Feature Engineering
Model Logic
24.2 Integration Testing
Implement:
tests/integration/
├── api/
├── database/
├── redis/
└── ml-service/
Verify:
Backend
    ↓
Database
    ↓
Redis
    ↓
Workers
    ↓
ML Service
24.3 E2E Testing
Implement:
tests/e2e/
Test complete workflows:
Login
Product Creation
Warehouse Creation
Inventory Management
Order Creation
Forecasting
Risk Analysis
Recommendations
Simulation
25. Phase 22 — Security Validation
Implement:
tests/security/
├── authentication/
├── authorization/
├── ownership/
└── validation/
Verify
- invalid authentication
- expired sessions
- unauthorized endpoints
- role restrictions
- ownership boundaries
- malformed requests
- injection attempts
- privilege escalation
Non-Negotiable Rule
A user must never be able to access another user's or organization's data merely by changing an ID in a request.
26. Phase 23 — Performance Validation
Implement:
tests/performance/
├── api/
├── database/
├── inventory/
└── forecasting/
Test
- API latency
- database query performance
- concurrent inventory operations
- reservation contention
- transfer contention
- forecasting latency
- batch forecasting
- dashboard performance
27. Phase 24 — Observability and Operational Validation
Before deployment, verify that the application provides enough information to diagnose failures.
Validate:
Application errors
Database failures
Redis failures
Worker failures
ML-service failures
API failures
Authentication failures
Every important failure should be diagnosable from logs and error information.
28. Phase 25 — Deployment Preparation
Prepare:
infrastructure/
└── docker/
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    ├── Dockerfile.ml-service
    └── docker-compose.yml
Validate
Frontend container
Backend container
ML-service container
Database connectivity
Redis connectivity
Environment configuration
Health checks
29. Phase 26 — Production Deployment
Deployment occurs only after:
Unit Tests
      ↓
Integration Tests
      ↓
E2E Tests
      ↓
Security Tests
      ↓
Performance Tests
      ↓
Build Validation
      ↓
Container Validation
      ↓
Deployment
Production Checklist
- environment variables configured
- database initialized
- migrations applied
- backend healthy
- frontend healthy
- ML service healthy
- Redis healthy
- workers healthy
- authentication verified
- critical workflows verified
30. Phase 27 — Post-Deployment Validation
After deployment, perform real workflow verification.
Verify
Login
    ↓
Dashboard
    ↓
Create Product
    ↓
Create Warehouse
    ↓
Manage Inventory
    ↓
Create Order
    ↓
Generate Forecast
    ↓
View Risk
    ↓
View Recommendation
    ↓
Run Simulation
The system is not considered complete merely because the deployment succeeded.
31. Recommended Development Sequence
The practical implementation sequence is:
01. Repository Foundation
        ↓
02. Database Schema
        ↓
03. Backend Foundation
        ↓
04. Authentication
        ↓
05. Products
        ↓
06. Warehouses
        ↓
07. Inventory
        ↓
08. Movements / Transfers / Reservations
        ↓
09. Suppliers
        ↓
10. Orders
        ↓
11. Dashboard
        ↓
12. Frontend Operational UI
        ↓
13. Background Workers
        ↓
14. ML Service Foundation
        ↓
15. Forecasting
        ↓
16. Anomaly Detection
        ↓
17. Supplier Risk
        ↓
18. Recommendations
        ↓
19. Simulations
        ↓
20. Intelligence UI
        ↓
21. Real-Time Features
        ↓
22. Integration Testing
        ↓
23. E2E Testing
        ↓
24. Security Testing
        ↓
25. Performance Testing
        ↓
26. Deployment Preparation
        ↓
27. Deployment
        ↓
28. Post-Deployment Validation
32. What Must NOT Be Done Early
The following must not be implemented before their dependencies exist.
Do Not Build Forecasting Before
Products
+
Inventory History
+
Orders
+
Reliable Historical Data
Do Not Build Recommendations Before
Inventory
+
Forecasting
+
Risk Signals
+
Business Rules
Do Not Build Simulations Before
Reliable Domain State
+
Inventory Rules
+
Forecasting
Do Not Optimize Before
Correctness
+
Measurement
Do Not Add Complex Infrastructure Before
There is an actual workload requiring it.
33. Definition of Done
A phase is complete only when all of the following are true:
Implementation
    +
Validation
    +
Tests
    +
Documentation
    +
Error Handling
    +
Security
A feature is not done simply because its UI appears on the screen.
For example:
Forecasting UI exists
does not mean forecasting is complete.
The complete feature requires:
Data
 ↓
Preprocessing
 ↓
Features
 ↓
Model
 ↓
Evaluation
 ↓
Inference
 ↓
Backend API
 ↓
Frontend
 ↓
Validation
 ↓
Tests
34. Architectural Discipline
During implementation:
1. Follow the existing architecture.
2. Do not introduce a new technology merely because it appears convenient.
3. Do not duplicate business logic between frontend and backend.
4. Do not put ML logic inside the Node.js backend.
5. Do not put application business logic inside React components.
6. Do not bypass the service layer to directly manipulate database state.
7. Do not allow recommendations to silently mutate operational data.
8. Do not create infrastructure without a concrete requirement.
9. Do not weaken security to make development easier.
10. Do not mark a feature complete without tests.
35. Change Management
If implementation reveals that the architecture is insufficient:
Problem Identified
        ↓
Investigate
        ↓
Determine Root Cause
        ↓
Propose Change
        ↓
Document Decision
        ↓
Update Architecture
        ↓
Implement Change
        ↓
Test
Architectural changes must be recorded in:
docs/15-Architecture-Decisions.md
Major changes requiring broader technical discussion should be recorded in:
docs/16-RFC.md
36. Final Implementation Rule
StockPilot should be built as a sequence of working vertical slices, not as disconnected piles of files.
The preferred pattern is:
Database
    ↓
Backend
    ↓
API
    ↓
Frontend
    ↓
Test
    ↓
Working Feature
Then move to the next feature.
The goal is not to create the entire architecture first.
The goal is to progressively create a correct, testable, observable, and production-capable system while keeping every layer synchronized with the others.


# StockPilot — Implementation Order

This document defines the exact order in which files and directories should be implemented.

The order follows dependency flow:
Database → Backend foundation → Backend domains → Frontend foundation → Frontend features → ML service → Integration → Testing → Infrastructure.

---

## 1. Root & Project Configuration

1. README.md
2. LICENSE
3. CHANGELOG.md
4. CONTRIBUTING.md
5. SECURITY.md
6. .gitignore
7. .editorconfig
8. .env.example
9. .dockerignore

---

## 2. Prisma & Database Foundation

10. prisma/schema.prisma
11. prisma/migrations/
12. database/scripts/validate.ts
13. database/scripts/reset.ts
14. database/scripts/backup.ts
15. database/seeds/seed.ts
16. database/seeds/users.seed.ts
17. database/seeds/products.seed.ts
18. database/seeds/warehouses.seed.ts
19. database/seeds/suppliers.seed.ts
20. database/seeds/inventory.seed.ts

---

## 3. Backend Application Foundation

21. backend/package.json
22. backend/tsconfig.json
23. backend/eslint.config.mjs
24. backend/.env.example
25. backend/src/config/env.ts
26. backend/src/config/application.ts
27. backend/src/config/database.ts
28. backend/src/config/redis.ts
29. backend/src/common/types/common.types.ts
30. backend/src/common/types/express.d.ts
31. backend/src/common/errors/AppError.ts
32. backend/src/common/errors/NotFoundError.ts
33. backend/src/common/errors/UnauthorizedError.ts
34. backend/src/common/errors/ForbiddenError.ts
35. backend/src/common/middleware/request-id.middleware.ts
36. backend/src/common/middleware/validation.middleware.ts
37. backend/src/common/middleware/error.middleware.ts
38. backend/src/common/utils/dates.ts
39. backend/src/common/utils/numbers.ts
40. backend/src/common/utils/pagination.ts
41. backend/src/app.ts
42. backend/src/server.ts

---

## 4. Backend Authentication

43. backend/src/auth/auth.types.ts
44. backend/src/auth/auth.schema.ts
45. backend/src/auth/password.service.ts
46. backend/src/auth/token.service.ts
47. backend/src/auth/auth.repository.ts
48. backend/src/auth/auth.service.ts
49. backend/src/auth/auth.controller.ts
50. backend/src/middleware/auth.middleware.ts
51. backend/src/middleware/role.middleware.ts
52. backend/src/middleware/rate-limit.middleware.ts
53. backend/src/routes/auth.routes.ts
54. backend/src/routes/index.ts

---

## 5. Backend Products

55. backend/src/products/product.types.ts
56. backend/src/products/product.schema.ts
57. backend/src/products/product.mapper.ts
58. backend/src/products/product.repository.ts
59. backend/src/products/product.service.ts
60. backend/src/products/product.controller.ts
61. backend/src/routes/product.routes.ts

---

## 6. Backend Warehouses

62. backend/src/warehouses/warehouse.types.ts
63. backend/src/warehouses/warehouse.schema.ts
64. backend/src/warehouses/warehouse.mapper.ts
65. backend/src/warehouses/warehouse.repository.ts
66. backend/src/warehouses/warehouse.service.ts
67. backend/src/warehouses/warehouse.controller.ts
68. backend/src/routes/warehouse.routes.ts

---

## 7. Backend Inventory Core

69. backend/src/inventory/inventory.types.ts
70. backend/src/inventory/inventory.schema.ts
71. backend/src/inventory/inventory.mapper.ts
72. backend/src/inventory/inventory.repository.ts
73. backend/src/inventory/inventory.service.ts
74. backend/src/inventory/inventory.controller.ts
75. backend/src/routes/inventory.routes.ts

---

## 8. Backend Inventory Movements

76. backend/src/inventory/movements/movement.types.ts
77. backend/src/inventory/movements/movement.repository.ts
78. backend/src/inventory/movements/movement.service.ts
79. backend/src/inventory/movements/movement.controller.ts

---

## 9. Backend Inventory Transfers

80. backend/src/inventory/transfers/transfer.types.ts
81. backend/src/inventory/transfers/transfer.repository.ts
82. backend/src/inventory/transfers/transfer.service.ts
83. backend/src/inventory/transfers/transfer.controller.ts

---

## 10. Backend Inventory Reservations

84. backend/src/inventory/reservations/reservation.types.ts
85. backend/src/inventory/reservations/reservation.repository.ts
86. backend/src/inventory/reservations/reservation.service.ts
87. backend/src/inventory/reservations/reservation.controller.ts

---

## 11. Backend Suppliers

88. backend/src/suppliers/supplier.types.ts
89. backend/src/suppliers/supplier.schema.ts
90. backend/src/suppliers/supplier.mapper.ts
91. backend/src/suppliers/supplier.repository.ts
92. backend/src/suppliers/supplier.service.ts
93. backend/src/suppliers/supplier.controller.ts
94. backend/src/routes/supplier.routes.ts

---

## 12. Backend Orders

95. backend/src/orders/order.types.ts
96. backend/src/orders/order.schema.ts
97. backend/src/orders/order.mapper.ts
98. backend/src/orders/order.repository.ts
99. backend/src/orders/order.service.ts
100. backend/src/orders/order.controller.ts
101. backend/src/routes/order.routes.ts

---

## 13. Backend Dashboard

102. backend/src/dashboard/dashboard.types.ts
103. backend/src/dashboard/dashboard.repository.ts
104. backend/src/dashboard/dashboard.service.ts
105. backend/src/dashboard/dashboard.controller.ts
106. backend/src/routes/dashboard.routes.ts

---

## 14. Backend Jobs

107. backend/src/jobs/queues.ts
108. backend/src/jobs/workers.ts
109. backend/src/jobs/inventory/inventory-sync.worker.ts
110. backend/src/jobs/notifications/notification.worker.ts
111. backend/src/jobs/forecasting/forecasting.worker.ts
112. backend/src/jobs/recommendations/recommendation.worker.ts

---

## 15. Backend Real-Time Infrastructure

113. backend/src/realtime/socket-auth.ts
114. backend/src/realtime/socket.ts
115. backend/src/realtime/inventory-events.ts

---

## 16. Frontend Project Configuration

116. frontend/package.json
117. frontend/next.config.ts
118. frontend/tsconfig.json
119. frontend/postcss.config.mjs
120. frontend/eslint.config.mjs
121. frontend/.env.example

---

## 17. Frontend Application Foundation

122. frontend/src/app/globals.css
123. frontend/src/app/layout.tsx
124. frontend/src/app/page.tsx
125. frontend/src/types/common.types.ts
126. frontend/src/types/api.types.ts
127. frontend/src/types/user.types.ts
128. frontend/src/lib/utils.ts
129. frontend/src/lib/api-client.ts
130. frontend/src/lib/query-client.ts
131. frontend/src/lib/socket-client.ts
132. frontend/src/providers/QueryProvider.tsx
133. frontend/src/providers/AuthProvider.tsx
134. frontend/src/providers/SocketProvider.tsx

---

## 18. Frontend Shared UI Components

135. frontend/src/components/ui/Button.tsx
136. frontend/src/components/ui/Input.tsx
137. frontend/src/components/ui/Select.tsx
138. frontend/src/components/ui/Checkbox.tsx
139. frontend/src/components/ui/Badge.tsx
140. frontend/src/components/ui/Card.tsx
141. frontend/src/components/ui/Tooltip.tsx
142. frontend/src/components/ui/Dialog.tsx
143. frontend/src/components/ui/DropdownMenu.tsx
144. frontend/src/components/ui/Tabs.tsx
145. frontend/src/components/ui/Table.tsx
146. frontend/src/components/ui/Pagination.tsx
147. frontend/src/components/ui/Skeleton.tsx

---

## 19. Frontend Layout Components

148. frontend/src/components/layout/AppSidebar.tsx
149. frontend/src/components/layout/AppHeader.tsx
150. frontend/src/components/layout/Navigation.tsx
151. frontend/src/components/layout/Breadcrumbs.tsx
152. frontend/src/components/layout/PageContainer.tsx

---

## 20. Frontend Form Components

153. frontend/src/components/forms/FormField.tsx
154. frontend/src/components/forms/FormError.tsx
155. frontend/src/components/forms/FormSection.tsx
156. frontend/src/components/forms/FormActions.tsx

---

## 21. Frontend Table Components

157. frontend/src/components/tables/DataTable.tsx
158. frontend/src/components/tables/TableToolbar.tsx
159. frontend/src/components/tables/TablePagination.tsx
160. frontend/src/components/tables/TableEmptyState.tsx

---

## 22. Frontend Feedback Components

161. frontend/src/components/feedback/LoadingState.tsx
162. frontend/src/components/feedback/ErrorState.tsx
163. frontend/src/components/feedback/EmptyState.tsx
164. frontend/src/components/feedback/SuccessMessage.tsx
165. frontend/src/components/feedback/ErrorBoundary.tsx

---

## 23. Frontend Chart Components

166. frontend/src/components/charts/InventoryChart.tsx
167. frontend/src/components/charts/DemandChart.tsx
168. frontend/src/components/charts/ForecastChart.tsx
169. frontend/src/components/charts/RiskChart.tsx
170. frontend/src/components/charts/TrendChart.tsx

---

## 24. Frontend Authentication

171. frontend/src/features/authentication/types/auth.types.ts
172. frontend/src/features/authentication/schemas/auth.schema.ts
173. frontend/src/features/authentication/services/auth.service.ts
174. frontend/src/features/authentication/hooks/useAuth.ts
175. frontend/src/features/authentication/components/LoginForm.tsx
176. frontend/src/features/authentication/components/LogoutButton.tsx
177. frontend/src/features/authentication/components/SessionGuard.tsx
178. frontend/src/app/login/page.tsx

---

## 25. Frontend Products

179. frontend/src/features/products/types/product.types.ts
180. frontend/src/features/products/schemas/product.schema.ts
181. frontend/src/features/products/services/product.service.ts
182. frontend/src/features/products/hooks/useProducts.ts
183. frontend/src/features/products/components/ProductSearch.tsx
184. frontend/src/features/products/components/ProductFilters.tsx
185. frontend/src/features/products/components/ProductTable.tsx
186. frontend/src/features/products/components/ProductForm.tsx
187. frontend/src/features/products/components/ProductDetails.tsx
188. frontend/src/app/products/page.tsx
189. frontend/src/app/products/new/page.tsx
190. frontend/src/app/products/[productId]/page.tsx

---

## 26. Frontend Warehouses

191. frontend/src/features/warehouses/types/warehouse.types.ts
192. frontend/src/features/warehouses/schemas/warehouse.schema.ts
193. frontend/src/features/warehouses/services/warehouse.service.ts
194. frontend/src/features/warehouses/hooks/useWarehouses.ts
195. frontend/src/features/warehouses/components/WarehouseTable.tsx
196. frontend/src/features/warehouses/components/WarehouseForm.tsx
197. frontend/src/features/warehouses/components/WarehouseDetails.tsx
198. frontend/src/features/warehouses/components/WarehouseCapacity.tsx
199. frontend/src/features/warehouses/components/WarehouseInventory.tsx
200. frontend/src/app/warehouses/page.tsx
201. frontend/src/app/warehouses/new/page.tsx
202. frontend/src/app/warehouses/[warehouseId]/page.tsx

---

## 27. Frontend Inventory

203. frontend/src/features/inventory/types/inventory.types.ts
204. frontend/src/features/inventory/schemas/inventory.schema.ts
205. frontend/src/features/inventory/services/inventory.service.ts
206. frontend/src/features/inventory/hooks/useInventory.ts
207. frontend/src/features/inventory/hooks/useInventoryMovements.ts
208. frontend/src/features/inventory/hooks/useInventoryTransfers.ts
209. frontend/src/features/inventory/hooks/useInventoryReservations.ts
210. frontend/src/features/inventory/components/InventoryFilters.tsx
211. frontend/src/features/inventory/components/InventoryStatus.tsx
212. frontend/src/features/inventory/components/InventoryTable.tsx
213. frontend/src/features/inventory/components/InventoryDetails.tsx
214. frontend/src/features/inventory/components/InventoryHistory.tsx
215. frontend/src/features/inventory/components/InventoryMovementForm.tsx
216. frontend/src/features/inventory/components/InventoryAdjustmentForm.tsx
217. frontend/src/features/inventory/components/InventoryTransferForm.tsx
218. frontend/src/features/inventory/components/InventoryReservationForm.tsx
219. frontend/src/app/inventory/page.tsx
220. frontend/src/app/inventory/movements/page.tsx
221. frontend/src/app/inventory/transfers/page.tsx
222. frontend/src/app/inventory/reservations/page.tsx

---

## 28. Frontend Suppliers

223. frontend/src/features/suppliers/types/supplier.types.ts
224. frontend/src/features/suppliers/services/supplier.service.ts
225. frontend/src/features/suppliers/hooks/useSuppliers.ts
226. frontend/src/features/suppliers/components/SupplierTable.tsx
227. frontend/src/features/suppliers/components/SupplierForm.tsx
228. frontend/src/features/suppliers/components/SupplierDetails.tsx
229. frontend/src/features/suppliers/components/SupplierPerformance.tsx
230. frontend/src/features/suppliers/components/SupplierRisk.tsx
231. frontend/src/app/suppliers/page.tsx
232. frontend/src/app/suppliers/[supplierId]/page.tsx

---

## 29. Frontend Orders

233. frontend/src/features/orders/types/order.types.ts
234. frontend/src/features/orders/schemas/order.schema.ts
235. frontend/src/features/orders/services/order.service.ts
236. frontend/src/features/orders/hooks/useOrders.ts
237. frontend/src/features/orders/components/OrderTable.tsx
238. frontend/src/features/orders/components/OrderForm.tsx
239. frontend/src/features/orders/components/OrderDetails.tsx
240. frontend/src/features/orders/components/OrderStatus.tsx
241. frontend/src/features/orders/components/OrderItems.tsx
242. frontend/src/features/orders/components/OrderTimeline.tsx
243. frontend/src/app/orders/page.tsx
244. frontend/src/app/orders/new/page.tsx
245. frontend/src/app/orders/[orderId]/page.tsx

---

## 30. Frontend Dashboard

246. frontend/src/features/dashboard/types/dashboard.types.ts
247. frontend/src/features/dashboard/services/dashboard.service.ts
248. frontend/src/features/dashboard/hooks/useDashboard.ts
249. frontend/src/features/dashboard/components/DashboardHeader.tsx
250. frontend/src/features/dashboard/components/InventoryOverview.tsx
251. frontend/src/features/dashboard/components/StockoutOverview.tsx
252. frontend/src/features/dashboard/components/OverstockOverview.tsx
253. frontend/src/features/dashboard/components/RiskOverview.tsx
254. frontend/src/features/dashboard/components/ForecastOverview.tsx
255. frontend/src/features/dashboard/components/RecommendationOverview.tsx
256. frontend/src/app/dashboard/page.tsx

---

## 31. ML Service Foundation

257. ml-service/requirements.txt
258. ml-service/requirements-dev.txt
259. ml-service/.env.example
260. ml-service/app/config.py
261. ml-service/app/dependencies.py
262. ml-service/app/main.py
263. ml-service/app/api/schemas/forecasting.py
264. ml-service/app/api/schemas/anomaly.py
265. ml-service/app/api/schemas/risk.py
266. ml-service/app/api/schemas/recommendation.py
267. ml-service/app/api/schemas/simulation.py
268. ml-service/app/api/routes/health.py
269. ml-service/app/api/routes/forecasting.py
270. ml-service/app/api/routes/anomaly.py
271. ml-service/app/api/routes/risk.py
272. ml-service/app/api/routes/recommendation.py
273. ml-service/app/api/routes/simulation.py

---

## 32. ML Common Infrastructure

274. ml-service/app/common/data/database.py
275. ml-service/app/common/data/repository.py
276. ml-service/app/common/features/feature_utils.py
277. ml-service/app/common/evaluation/metrics.py
278. ml-service/app/common/utilities/logging.py
279. ml-service/app/common/utilities/validation.py

---

## 33. ML Forecasting — Data Layer

280. ml-service/app/forecasting/data/loader.py
281. ml-service/app/forecasting/data/cleaner.py
282. ml-service/app/forecasting/data/validator.py

---

## 34. ML Forecasting — Preprocessing

283. ml-service/app/forecasting/preprocessing/scaler.py
284. ml-service/app/forecasting/preprocessing/transformer.py
285. ml-service/app/forecasting/preprocessing/pipeline.py

---

## 35. ML Forecasting — Features

286. ml-service/app/forecasting/features/demand_features.py
287. ml-service/app/forecasting/features/inventory_features.py
288. ml-service/app/forecasting/features/seasonal_features.py
289. ml-service/app/forecasting/features/feature_pipeline.py

---

## 36. ML Forecasting — Models

290. ml-service/app/forecasting/models/baseline.py
291. ml-service/app/forecasting/models/statistical.py
292. ml-service/app/forecasting/models/machine_learning.py
293. ml-service/app/forecasting/models/model_registry.py

---

## 37. ML Forecasting — Evaluation

294. ml-service/app/forecasting/evaluation/metrics.py
295. ml-service/app/forecasting/evaluation/evaluator.py
296. ml-service/app/forecasting/evaluation/backtesting.py

---

## 38. ML Forecasting — Inference

297. ml-service/app/forecasting/inference/predictor.py
298. ml-service/app/forecasting/inference/confidence.py
299. ml-service/app/forecasting/inference/forecast_engine.py

---

## 39. ML Forecasting — Configuration

300. ml-service/app/forecasting/configuration/model_config.py
301. ml-service/app/forecasting/configuration/forecast_config.py

---

## 40. ML Anomaly Detection

302. ml-service/app/anomaly_detection/data/loader.py
303. ml-service/app/anomaly_detection/data/validator.py
304. ml-service/app/anomaly_detection/preprocessing/cleaner.py
305. ml-service/app/anomaly_detection/preprocessing/transformer.py
306. ml-service/app/anomaly_detection/features/inventory_features.py
307. ml-service/app/anomaly_detection/features/demand_features.py
308. ml-service/app/anomaly_detection/models/statistical_detector.py
309. ml-service/app/anomaly_detection/models/machine_learning_detector.py
310. ml-service/app/anomaly_detection/models/detector_registry.py
311. ml-service/app/anomaly_detection/inference/detector.py
312. ml-service/app/anomaly_detection/inference/scorer.py
313. ml-service/app/anomaly_detection/evaluation/metrics.py
314. ml-service/app/anomaly_detection/evaluation/evaluator.py

---

## 41. ML Supplier Risk

315. ml-service/app/supplier_risk/data/loader.py
316. ml-service/app/supplier_risk/data/validator.py
317. ml-service/app/supplier_risk/preprocessing/transformer.py
318. ml-service/app/supplier_risk/features/supplier_features.py
319. ml-service/app/supplier_risk/features/delivery_features.py
320. ml-service/app/supplier_risk/features/quality_features.py
321. ml-service/app/supplier_risk/models/risk_model.py
322. ml-service/app/supplier_risk/models/model_registry.py
323. ml-service/app/supplier_risk/inference/scorer.py
324. ml-service/app/supplier_risk/inference/risk_engine.py
325. ml-service/app/supplier_risk/evaluation/metrics.py
326. ml-service/app/supplier_risk/evaluation/evaluator.py

---

## 42. ML Recommendation Engine

327. ml-service/app/recommendations/signals/inventory_signals.py
328. ml-service/app/recommendations/signals/demand_signals.py
329. ml-service/app/recommendations/signals/risk_signals.py
330. ml-service/app/recommendations/rules/stockout_rules.py
331. ml-service/app/recommendations/rules/overstock_rules.py
332. ml-service/app/recommendations/rules/reorder_rules.py
333. ml-service/app/recommendations/ranking/priority_scorer.py
334. ml-service/app/recommendations/ranking/recommendation_ranker.py
335. ml-service/app/recommendations/generation/recommendation_engine.py
336. ml-service/app/recommendations/validation/recommendation_validator.py

---

## 43. ML Simulation Engine

337. ml-service/app/simulation/scenario.py
338. ml-service/app/simulation/state.py
339. ml-service/app/simulation/validator.py
340. ml-service/app/simulation/engine.py
341. ml-service/app/simulation/result.py

---

## 44. ML Service Tests

342. ml-service/tests/test_health.py

343. ml-service/tests/forecasting/test_data.py
344. ml-service/tests/forecasting/test_preprocessing.py
345. ml-service/tests/forecasting/test_features.py
346. ml-service/tests/forecasting/test_models.py
347. ml-service/tests/forecasting/test_inference.py
348. ml-service/tests/forecasting/test_evaluation.py

349. ml-service/tests/anomaly_detection/test_data.py
350. ml-service/tests/anomaly_detection/test_preprocessing.py
351. ml-service/tests/anomaly_detection/test_features.py
352. ml-service/tests/anomaly_detection/test_models.py
353. ml-service/tests/anomaly_detection/test_inference.py

354. ml-service/tests/supplier_risk/test_data.py
355. ml-service/tests/supplier_risk/test_features.py
356. ml-service/tests/supplier_risk/test_models.py
357. ml-service/tests/supplier_risk/test_inference.py

358. ml-service/tests/recommendations/test_signals.py
359. ml-service/tests/recommendations/test_rules.py
360. ml-service/tests/recommendations/test_ranking.py
361. ml-service/tests/recommendations/test_generation.py

362. ml-service/tests/simulation/test_scenario.py
363. ml-service/tests/simulation/test_engine.py
364. ml-service/tests/simulation/test_result.py
365. ml-service/tests/simulation/test_validation.py

---

## 45. Frontend Intelligence Components

366. frontend/src/components/intelligence/ConfidenceIndicator.tsx
367. frontend/src/components/intelligence/EvidencePanel.tsx
368. frontend/src/components/intelligence/InsightCard.tsx
369. frontend/src/components/intelligence/ForecastCard.tsx
370. frontend/src/components/intelligence/RiskCard.tsx
371. frontend/src/components/intelligence/RecommendationCard.tsx
372. frontend/src/components/intelligence/ScenarioResultCard.tsx

---

## 46. Frontend Forecasting

373. frontend/src/features/forecasting/types/forecasting.types.ts
374. frontend/src/features/forecasting/services/forecasting.service.ts
375. frontend/src/features/forecasting/hooks/useForecasts.ts
376. frontend/src/features/forecasting/components/ForecastDashboard.tsx
377. frontend/src/features/forecasting/components/ForecastChart.tsx
378. frontend/src/features/forecasting/components/ForecastSummary.tsx
379. frontend/src/features/forecasting/components/ForecastConfidence.tsx
380. frontend/src/features/forecasting/components/ForecastComparison.tsx
381. frontend/src/app/forecasting/page.tsx

---

## 47. Frontend Anomalies

382. frontend/src/features/anomalies/types/anomaly.types.ts
383. frontend/src/features/anomalies/services/anomaly.service.ts
384. frontend/src/features/anomalies/hooks/useAnomalies.ts
385. frontend/src/features/anomalies/components/AnomalyDashboard.tsx
386. frontend/src/features/anomalies/components/AnomalyTable.tsx
387. frontend/src/features/anomalies/components/AnomalyDetails.tsx
388. frontend/src/features/anomalies/components/AnomalySeverity.tsx
389. frontend/src/features/anomalies/components/AnomalyEvidence.tsx
390. frontend/src/app/anomalies/page.tsx

---

## 48. Frontend Risks

391. frontend/src/features/risks/types/risk.types.ts
392. frontend/src/features/risks/services/risk.service.ts
393. frontend/src/features/risks/hooks/useRisks.ts
394. frontend/src/features/risks/components/RiskDashboard.tsx
395. frontend/src/features/risks/components/RiskTable.tsx
396. frontend/src/features/risks/components/RiskDetails.tsx
397. frontend/src/features/risks/components/RiskSeverity.tsx
398. frontend/src/features/risks/components/RiskEvidence.tsx
399. frontend/src/app/risks/page.tsx

---

## 49. Frontend Recommendations

400. frontend/src/features/recommendations/types/recommendation.types.ts
401. frontend/src/features/recommendations/services/recommendation.service.ts
402. frontend/src/features/recommendations/hooks/useRecommendations.ts
403. frontend/src/features/recommendations/components/RecommendationDashboard.tsx
404. frontend/src/features/recommendations/components/RecommendationTable.tsx
405. frontend/src/features/recommendations/components/RecommendationDetails.tsx
406. frontend/src/features/recommendations/components/RecommendationEvidence.tsx
407. frontend/src/features/recommendations/components/RecommendationAction.tsx
408. frontend/src/features/recommendations/components/RecommendationHistory.tsx
409. frontend/src/app/recommendations/page.tsx

---

## 50. Frontend Simulations

410. frontend/src/features/simulations/types/simulation.types.ts
411. frontend/src/features/simulations/services/simulation.service.ts
412. frontend/src/features/simulations/hooks/useSimulations.ts
413. frontend/src/features/simulations/components/SimulationDashboard.tsx
414. frontend/src/features/simulations/components/ScenarioBuilder.tsx
415. frontend/src/features/simulations/components/ScenarioInputs.tsx
416. frontend/src/features/simulations/components/SimulationResults.tsx
417. frontend/src/features/simulations/components/ScenarioComparison.tsx
418. frontend/src/features/simulations/components/SimulationChart.tsx
419. frontend/src/app/simulations/page.tsx

---

## 51. Frontend Routing & Error Handling

420. frontend/src/app/error.tsx

---

## 52. Backend ↔ ML Integration Validation

421. backend/src/forecasting/forecasting.types.ts
422. backend/src/forecasting/forecasting.mapper.ts
423. backend/src/forecasting/forecasting.client.ts
424. backend/src/forecasting/forecasting.service.ts
425. backend/src/forecasting/forecasting.controller.ts
426. backend/src/routes/forecasting.routes.ts

427. backend/src/anomalies/anomaly.types.ts
428. backend/src/anomalies/anomaly.mapper.ts
429. backend/src/anomalies/anomaly.service.ts
430. backend/src/anomalies/anomaly.controller.ts
431. backend/src/routes/anomaly.routes.ts

432. backend/src/risks/risk.types.ts
433. backend/src/risks/risk.mapper.ts
434. backend/src/risks/risk.service.ts
435. backend/src/risks/risk.controller.ts
436. backend/src/routes/risk.routes.ts

437. backend/src/recommendations/recommendation.types.ts
438. backend/src/recommendations/recommendation.schema.ts
439. backend/src/recommendations/recommendation.mapper.ts
440. backend/src/recommendations/recommendation.repository.ts
441. backend/src/recommendations/recommendation.service.ts
442. backend/src/recommendations/recommendation.controller.ts
443. backend/src/routes/recommendation.routes.ts

444. backend/src/simulations/simulation.types.ts
445. backend/src/simulations/simulation.mapper.ts
446. backend/src/simulations/simulation.client.ts
447. backend/src/simulations/simulation.service.ts
448. backend/src/simulations/simulation.controller.ts
449. backend/src/routes/simulation.routes.ts

---

## 53. Global E2E Tests

450. tests/e2e/authentication/login.spec.ts
451. tests/e2e/authentication/logout.spec.ts
452. tests/e2e/authentication/session-expiry.spec.ts

453. tests/e2e/products/create-product.spec.ts
454. tests/e2e/products/update-product.spec.ts
455. tests/e2e/products/delete-product.spec.ts
456. tests/e2e/products/product-search.spec.ts

457. tests/e2e/inventory/inventory-overview.spec.ts
458. tests/e2e/inventory/inventory-adjustment.spec.ts
459. tests/e2e/inventory/inventory-movement.spec.ts
460. tests/e2e/inventory/inventory-transfer.spec.ts
461. tests/e2e/inventory/inventory-reservation.spec.ts

462. tests/e2e/warehouses/create-warehouse.spec.ts
463. tests/e2e/warehouses/update-warehouse.spec.ts
464. tests/e2e/warehouses/warehouse-inventory.spec.ts

465. tests/e2e/suppliers/create-supplier.spec.ts
466. tests/e2e/suppliers/update-supplier.spec.ts
467. tests/e2e/suppliers/supplier-risk.spec.ts

468. tests/e2e/orders/create-order.spec.ts
469. tests/e2e/orders/update-order.spec.ts
470. tests/e2e/orders/fulfill-order.spec.ts
471. tests/e2e/orders/cancel-order.spec.ts

472. tests/e2e/forecasting/forecast-dashboard.spec.ts
473. tests/e2e/forecasting/forecast-generation.spec.ts
474. tests/e2e/forecasting/forecast-results.spec.ts

475. tests/e2e/risks/risk-dashboard.spec.ts
476. tests/e2e/risks/risk-details.spec.ts
477. tests/e2e/risks/risk-evidence.spec.ts

478. tests/e2e/recommendations/recommendation-dashboard.spec.ts
479. tests/e2e/recommendations/recommendation-details.spec.ts
480. tests/e2e/recommendations/recommendation-action.spec.ts
481. tests/e2e/recommendations/recommendation-history.spec.ts

482. tests/e2e/simulations/scenario-builder.spec.ts
483. tests/e2e/simulations/simulation-execution.spec.ts
484. tests/e2e/simulations/scenario-comparison.spec.ts

---

## 54. Integration Tests

485. tests/integration/api/auth.integration.test.ts
486. tests/integration/api/products.integration.test.ts
487. tests/integration/api/warehouses.integration.test.ts
488. tests/integration/api/inventory.integration.test.ts
489. tests/integration/api/suppliers.integration.test.ts
490. tests/integration/api/orders.integration.test.ts
491. tests/integration/api/forecasting.integration.test.ts
492. tests/integration/api/risks.integration.test.ts
493. tests/integration/api/recommendations.integration.test.ts
494. tests/integration/api/simulations.integration.test.ts

495. tests/integration/database/product.repository.test.ts
496. tests/integration/database/warehouse.repository.test.ts
497. tests/integration/database/inventory.repository.test.ts
498. tests/integration/database/supplier.repository.test.ts
499. tests/integration/database/order.repository.test.ts
500. tests/integration/database/transaction.integrity.test.ts

501. tests/integration/redis/cache.integration.test.ts
502. tests/integration/redis/queue.integration.test.ts
503. tests/integration/redis/invalidation.integration.test.ts

504. tests/integration/ml-service/forecasting-client.integration.test.ts
505. tests/integration/ml-service/anomaly-client.integration.test.ts
506. tests/integration/ml-service/risk-client.integration.test.ts
507. tests/integration/ml-service/recommendation-client.integration.test.ts
508. tests/integration/ml-service/simulation-client.integration.test.ts

---

## 55. Security Tests

509. tests/security/authentication/invalid-login.test.ts
510. tests/security/authentication/expired-token.test.ts
511. tests/security/authentication/invalid-token.test.ts

512. tests/security/authorization/role-access.test.ts
513. tests/security/authorization/protected-endpoints.test.ts
514. tests/security/authorization/privilege-escalation.test.ts

515. tests/security/ownership/inventory-ownership.test.ts
516. tests/security/ownership/warehouse-ownership.test.ts
517. tests/security/ownership/order-ownership.test.ts
518. tests/security/ownership/supplier-ownership.test.ts

519. tests/security/validation/input-validation.test.ts
520. tests/security/validation/injection-protection.test.ts
521. tests/security/validation/malformed-request.test.ts

---

## 56. Performance Tests

522. tests/performance/api/inventory.load.test.ts
523. tests/performance/api/orders.load.test.ts
524. tests/performance/api/products.load.test.ts
525. tests/performance/api/dashboard.load.test.ts

526. tests/performance/database/inventory.query.test.ts
527. tests/performance/database/order.query.test.ts
528. tests/performance/database/analytics.query.test.ts
529. tests/performance/database/concurrent-update.test.ts

530. tests/performance/inventory/concurrent-transfer.test.ts
531. tests/performance/inventory/concurrent-reservation.test.ts
532. tests/performance/inventory/high-volume-movement.test.ts

533. tests/performance/forecasting/inference-latency.test.ts
534. tests/performance/forecasting/batch-forecast.test.ts
535. tests/performance/forecasting/concurrent-forecast.test.ts

---

## 57. Development Tools

536. tools/development/check-environment.ts
537. tools/development/validate-config.ts
538. tools/database/inspect-schema.ts
539. tools/database/validate-schema.ts
540. tools/testing/test-data.ts
541. tools/testing/test-helpers.ts

---

## 58. Project Scripts

542. scripts/setup.ts
543. scripts/dev.ts
544. scripts/migrate.ts
545. scripts/seed.ts
546. scripts/test.ts
547. scripts/lint.ts
548. scripts/format.ts
549. scripts/build.ts
550. scripts/cleanup.ts

---

## 59. Infrastructure

551. infrastructure/docker/Dockerfile.backend
552. infrastructure/docker/Dockerfile.ml-service
553. infrastructure/docker/Dockerfile.frontend
554. infrastructure/docker/docker-compose.yml

---

## 60. Final Validation

555. README.md
556. SECURITY.md
557. CHANGELOG.md
558. docs/14-File-Architecture.md
559. docs/17-Implementation-Order.md

---

# Implementation Rule

A file must not be implemented merely because it appears in this list.

Before implementing each file:

1. Verify its dependencies already exist.
2. Verify its responsibility is defined by the project documentation.
3. Implement only the responsibility of that file.
4. Test the file or the feature it belongs to.
5. Verify integration with its dependent layer.
6. Only then proceed to the next numbered item.

The numbered order is the default implementation sequence for StockPilot.