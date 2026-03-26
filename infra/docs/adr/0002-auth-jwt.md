# ADR 0002: Auth and JWT

Decision: Use JWT tokens for stateless auth, refresh tokens for longevity.

- `/api/auth/register`: creates the user and returns access and refresh tokens.
- `/api/auth/login`: validates credentials and returns access token (24h default) and refresh token (7d default).
- `/api/auth/refresh`: issues a new access token from a valid refresh token.
- `Authorization: Bearer <jwt>` on protected routes.
- Access token subject: authenticated user email.
- Refresh tokens are JWTs and are currently stateless in the application layer.
- RBAC foundation exists through `ROLE_USER` and `ROLE_ADMIN`.
- Production hardening includes auth rate limiting, configurable CORS, and response security headers.
