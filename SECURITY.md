# Security Policy

## 1. Overview & Security Philosophy

StockPilot is an inventory intelligence and decision-support platform designed to manage critical operational workflows, including inventory levels, reservations, orders, procurement, and predictive analytics. 

Because operational integrity and business data confidentiality are paramount, StockPilot treats security as a foundational engineering constraint rather than an afterthought.

---

## 2. Supported Versions

StockPilot is currently in active development. Security patches and fixes are provided for the latest code on the primary development branch.

| Version | Status | Supported |
| :--- | :--- | :--- |
| `1.0.0 (In Development)` | Current Development | Yes |
| `< 1.0.0` | Pre-release / Stubs | No |

---

## 3. Reporting a Vulnerability & Responsible Disclosure

The StockPilot team values the contributions of security researchers and community members in keeping the project secure.

### How to Report

- **Do NOT open a public issue:** Please do not disclose security vulnerabilities, proof-of-concept exploits, or potential attack vectors in public issue trackers, pull requests, or public discussions.
- **Private Reporting:** Report vulnerabilities privately via **GitHub Private Vulnerability Reporting** on the StockPilot repository or by contacting the project maintainers directly through their repository contact channels.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please include:
1. **Summary:** A clear description of the vulnerability and its potential impact.
2. **Affected Components:** Specific services, routes, or files affected (e.g., `backend/`, `frontend/`, `ml-service/`, `prisma/`).
3. **Step-by-Step Reproduction:** Minimal, reproducible steps or a proof of concept (PoC).
4. **Environment Details:** Software versions, operating systems, and relevant configuration settings.
5. **Mitigation Suggestions:** Any suggested remediation or patches (if available).

### Response Process

1. **Acknowledgment:** Maintainers will acknowledge receipt of the vulnerability report within a reasonable timeframe.
2. **Investigation & Triage:** The issue will be verified and its severity assessed.
3. **Fix Development:** A fix will be prepared and tested across unit and integration test suites.
4. **Coordinated Disclosure:** Once the fix is released, an advisory will be published detailing the vulnerability and thanking the reporter (unless anonymity is requested).

---

## 4. Security Architecture & Implemented Controls

StockPilot implements multiple defensive layers across its architecture:

### A. Authentication & Identity
- **Password Hashing:** User passwords are encrypted using `bcrypt` with salt rounds before being persisted to the database. Plaintext passwords are never stored or logged.
- **JSON Web Tokens (JWT):** Authenticated sessions utilize signed JWTs (`jsonwebtoken`) with configurable expiration (`JWT_EXPIRES_IN`).
- **Cryptographic Secrets:** Token signing relies on environment-provided secrets (`JWT_SECRET`). Hardcoded fallback secrets are prohibited.

### B. Authorization & Access Control
- **Role-Based Access Control (RBAC):** Backend routes enforce role authorization using predefined roles (`ADMIN`, `INVENTORY_MANAGER`, `WAREHOUSE_OPERATOR`, `PROCUREMENT_MANAGER`, `OPERATIONS_MANAGER`).
- **Deny-by-Default:** Protected endpoints require explicit authentication and role checks.
- **Backend as Security Boundary:** Authorization logic is strictly enforced at the backend API layer. Client-side UI controls are treated as conveniences, not security boundaries.

### C. Input Validation & Data Sanitation
- **Schema Validation:** Request payloads, URL parameters, and query parameters are validated against strict runtime schemas (`zod` in Node.js/TypeScript and `pydantic` in Python).
- **Type Safety:** Strong static typing across frontend and backend services prevents type-coercion bugs and unhandled exceptions.

### D. Database & Persistence Security
- **SQL Injection Prevention:** Database access is managed through Prisma ORM using parameterized queries. Raw, unescaped SQL strings are avoided.
- **Concurrency & Transaction Integrity:** Critical inventory movements and reservations use database transactions to prevent race conditions and double-allocation anomalies.

### E. HTTP & API Security
- **Security Headers:** The backend utilizes `helmet` to set secure HTTP response headers, including Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and frame restrictions.
- **CORS Policies:** Cross-Origin Resource Sharing (`cors`) is configured to restrict unauthorized domain access.
- **Rate Limiting:** Request rate limiting (`express-rate-limit`) is applied to authentication and sensitive routes to mitigate brute-force and denial-of-service attempts.

### F. Microservice & Machine Learning Security
- **Service Isolation:** The Python ML service (`ml-service/`) operates as an internal backend-facing service rather than a directly exposed public gateway.
- **Fail-Safe AI Design:** Recommendations and forecasting outputs generated by the ML layer are advisory and subject to validation and human authorization before executing operational actions.

---

## 5. Deployment & Operational Security Guidelines

When deploying StockPilot to staging or production environments, administrators must adhere to the following operational security requirements:

1. **Transport Layer Security (TLS/HTTPS):** Enforce HTTPS for all client-to-backend and service-to-service communication. Never expose unencrypted HTTP endpoints in production.
2. **Secret Management:**
   - Generate strong, random secrets for `JWT_SECRET`, database passwords, and Redis passwords.
   - Never commit `.env` files or credentials into version control.
   - Use secure secret managers or container environment injection in production.
3. **Network Isolation:**
   - PostgreSQL (port 5432) and Redis (port 6379) instances should reside in private subnets and never be exposed to the public internet.
   - The ML service (port 8000) should only accept incoming connections from authorized backend services.
4. **Database Principle of Least Privilege:** Configure database users with only the minimum required database privileges.
5. **Regular Dependency Audits:** Continuously scan project dependencies for vulnerabilities using `npm audit` and Python vulnerability scanners (`pip-audit` / Dependabot).

---

## 6. Developer & Contributor Security Rules

All contributors must follow these mandatory security practices:

- **No Secrets in Code:** Never commit passwords, tokens, API keys, or private keys to the repository.
- **Validate Everything:** Validate all external inputs at the service boundary before processing.
- **Never Disable Security Checks:** Do not disable linters, type checks, or tests to force a build to pass.
- **Audit Logging:** Maintain audit trails for state-changing inventory, warehouse, and order operations.
- **Safe Error Handling:** Avoid exposing raw stack traces, database schema details, or system internals in client error responses.
