# Portfolio Resume Bullet Points & Interview Talking Points

These bullet points are crafted for a **BTech CSE graduate** applying for **Java Developer**, **Spring Boot Developer**, and **Backend Software Engineer** roles.

---

## 1. Resume Bullet Points (Copy & Adapt)

### Option A: Focused on Backend & Concurrency (Recommended)
- **Engineered a production-grade API Key & Usage Management Platform** using Java 21, Spring Boot 3.3, and MySQL 8, providing secure credential lifecycle management, usage telemetry, and atomic rate enforcement.
- **Designed a concurrency-safe quota enforcement mechanism** using MySQL InnoDB row-level locking and atomic SQL conditional updates (`UPDATE ... WHERE request_count < quota`), eliminating race conditions without relying on Redis or external caching layers.
- **Implemented zero-knowledge API key authentication** utilizing `SecureRandom` and SHA-256 cryptographic hashing; protected against timing side-channel attacks via constant-time comparisons (`MessageDigest.isEqual`).
- **Architected role-based access control (RBAC)** and stateless authentication with Spring Security and HMAC-SHA256 JWT, achieving strict separation between tenant workloads and privileged admin APIs.
- **Constructed high-performance time-series analytics** using composite indexing and database-level aggregations (`DATE_FORMAT`, `COUNT`, `AVG`) to compute traffic metrics with sub-5ms database latency.
- **Developed a responsive developer console** using React 18, Vite, and Plain CSS, featuring a live API sandbox, quota progress tracking, and interactive traffic telemetry.
- **Authored comprehensive test coverage** with JUnit 5, Mockito, and Spring MockMvc, validating key generation, cross-tenant isolation, quota boundary limits, and HTTP response codes.

---

### Option B: Focused on Systems Architecture & Security
- **Built an enterprise API gateway and telemetry service** in Spring Boot 3 with layered domain architecture (Controller-Service-Repository-DTO) adhering to clean code and REST standards.
- **Integrated custom Spring Security filter chains** intercepting `X-API-Key` headers for candidate lookup, hash verification, quota enforcement, and non-blocking audit logging into MySQL.
- **Automated API documentation** using Springdoc OpenAPI 3.0 / Swagger UI, exposing interactive schema specifications for 15+ authenticated and protected endpoints.
- **Mitigated credential leakage risks** by enforcing one-time secret display upon creation and stripping sensitive fields from database models before reaching client responses.

---

## 2. Key Interview Talking Points (How to Explain Your Project)

### Q: Why didn't you use Redis for rate limiting?
> *"In many enterprise architectures, adding Redis introduces operational complexity, cluster maintenance, and cost. I wanted to demonstrate how to implement strict ACID-compliant, concurrency-safe rate limits using pure MySQL 8 primitives. By using atomic row updates (`UPDATE counters SET count = count + 1 WHERE count < quota`), InnoDB's row-level lock serializes concurrent increments on the same key without phantom reads or race conditions. I also documented the scalability trade-off: under extreme write loads (>10k req/s), row lock contention makes an in-memory Redis token bucket more appropriate."*

### Q: How did you ensure API keys are stored securely?
> *"Following best practices like Stripe and AWS, raw secrets are generated with `SecureRandom` (32 cryptographically secure bytes) and formatted as `ak_live_<prefix>_<secret>`. The raw secret is returned to the user exactly once. The database stores only the SHA-256 hash and a non-secret prefix. When a request arrives, the prefix identifies the row, and constant-time byte comparison (`MessageDigest.isEqual`) verifies the hash to prevent timing attacks."*

### Q: How is cross-tenant isolation enforced?
> *"Every API key query and analytics aggregation explicitly filters by `user_id` extracted from the authenticated JWT `UserPrincipal`. If a user attempts to view or revoke another user's key ID, the service layer throws a `ForbiddenException` mapped to HTTP 403 Forbidden. Only users with the `ROLE_ADMIN` authority can query cross-tenant statistics."*
