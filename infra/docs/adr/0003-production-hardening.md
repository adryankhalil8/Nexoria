# ADR 0003: Production Hardening Defaults

Decision: Ship the API with explicit production-oriented defaults instead of relying on infrastructure-only controls.

- Enable security headers in Spring Security, including CSP, frame protection, referrer policy, permissions policy, and HSTS.
- Expose `health` and `info` actuator endpoints for orchestration and uptime checks.
- Publish OpenAPI docs from the backend for self-describing API contracts.
- Apply auth endpoint rate limiting in the application layer so login and registration are protected even behind simple proxies.
- Use an Nginx reverse proxy in production Compose to provide a single entry point for frontend, API, and health traffic.
