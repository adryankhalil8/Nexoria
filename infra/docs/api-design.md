# Nexoria API Design

## Overview

- Base URL (local backend): `http://localhost:8080`
- API root: `http://localhost:8080/api`
- OpenAPI JSON: `GET /v3/api-docs`
- Swagger UI: `GET /swagger-ui.html`
- Health check: `GET /actuator/health`

## Authentication Model

- `POST /api/auth/register`, `POST /api/auth/login`, and `POST /api/auth/refresh` are public.
- All `/api/blueprints/**` endpoints require `Authorization: Bearer <access-token>`.
- Access tokens and refresh tokens are JWTs.
- Auth endpoints are rate-limited per client IP and path.
- Default auth limit: `10` requests per `1 minute`.

## Headers

- Security headers are enabled for API responses:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Auth responses also include:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`

## Endpoints

### `POST /api/auth/register`

Registers a user and immediately returns access and refresh tokens.

Request body:

```json
{
  "email": "founder@nexoria.io",
  "password": "S3curePassw0rd!"
}
```

Success response: `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.access",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.refresh"
}
```

### `POST /api/auth/login`

Authenticates an existing user.

Request body:

```json
{
  "email": "founder@nexoria.io",
  "password": "S3curePassw0rd!"
}
```

Success response: `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.access",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.refresh"
}
```

### `POST /api/auth/refresh`

Exchanges a valid refresh token for a new access token.

Request body:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.refresh"
}
```

Success response: `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.new-access",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.refresh"
}
```

### `GET /api/blueprints`

Returns all blueprints owned by the authenticated user.

Success response: `200 OK`

```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "industry": "Technology",
    "revenueRange": "$50k-$200k/mo",
    "goals": ["Increase qualified leads", "Improve SEO"],
    "score": 71,
    "readyForRetainer": true,
    "fixes": [
      {
        "title": "Improve homepage load speed",
        "impact": "High",
        "effort": "Medium",
        "why": "Slow pages lower conversion and SEO performance."
      }
    ],
    "externalSignal": {
      "windspeed": 12.3,
      "weathercode": 1,
      "temperature": 15.2
    },
    "createdAt": "2026-03-26T13:15:00Z",
    "updatedAt": "2026-03-26T13:15:00Z"
  }
]
```

### `GET /api/blueprints/{id}`

Returns a single user-owned blueprint.

- Success response: `200 OK`
- `404 Not Found` when the id is missing or not owned by the authenticated user

### `POST /api/blueprints`

Creates and scores a blueprint.

Request body:

```json
{
  "url": "https://example.com",
  "industry": "Technology",
  "revenueRange": "$50k-$200k/mo",
  "goals": ["Increase qualified leads", "Improve SEO"],
  "externalSignal": {
    "windspeed": 12.3,
    "weathercode": 1,
    "temperature": 15.2
  }
}
```

Success response: `201 Created`

### `PATCH /api/blueprints/{id}`

Updates a user-owned blueprint and recalculates its score.

- Request body: same schema as `POST /api/blueprints`
- Success response: `200 OK`

### `DELETE /api/blueprints/{id}`

Deletes a user-owned blueprint.

- Success response: `204 No Content`

### `POST /api/blueprints/diagnostic`

Creates a scored diagnostic result using the same payload as blueprint creation.

- Request body: same schema as `POST /api/blueprints`
- Success response: `200 OK`

## Error Responses

Validation error example:

```json
{
  "status": 400,
  "errors": {
    "email": "must be a well-formed email address",
    "password": "Password must be at least 8 characters"
  }
}
```

Authentication error example:

```json
{
  "error": "Invalid credentials"
}
```

Rate limit error example:

```json
{
  "error": "Too Many Requests",
  "details": "Auth rate limit exceeded. Please retry shortly."
}
```

## Environment-Driven Behavior

- CORS origins are controlled with `APP_CORS_ALLOWED_ORIGIN_*` in development and `APP_CORS_ALLOWED_ORIGIN` in production.
- JWT signing uses `JWT_SECRET` and expects a base64-encoded secret.
- Auth throttling is controlled with:
  - `APP_RATE_LIMIT_AUTH_ENABLED`
  - `APP_RATE_LIMIT_AUTH_CAPACITY`
  - `APP_RATE_LIMIT_AUTH_WINDOW`
- Security headers are controlled with:
  - `APP_SECURITY_CSP`
  - `APP_SECURITY_REFERRER_POLICY`
  - `APP_SECURITY_PERMISSIONS_POLICY`
  - `APP_SECURITY_HSTS_*`
