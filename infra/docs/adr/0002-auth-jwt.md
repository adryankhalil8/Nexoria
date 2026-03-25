# ADR 0002: Auth and JWT

Decision: Use JWT tokens for stateless auth, refresh tokens for longevity.

- `/api/auth/login`: validates credentials, returns access token (1h) and refresh token (7d).
- `/api/auth/refresh`: issues new access token.
- `Authorization: Bearer <jwt>` on protected routes.
- Access token claims: `sub` (user id), `roles`.
- Refresh tokens stored in DB or cache for revocation.
- RBAC: roles `ROLE_USER`, `ROLE_ADMIN`; blueprint endpoint requires `ROLE_USER`.
- Security best practices: rotate secrets, set `sameSite=Strict`, enable CSRF on stateful endpoints.
