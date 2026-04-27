# Nexoria API Design

## Overview

- Base URL (local backend): `http://localhost:8080`
- API root: `http://localhost:8080/api`
- OpenAPI JSON: `GET /v3/api-docs`
- Swagger UI: `GET /swagger-ui.html`
- Health check: `GET /actuator/health`

## Current API Model

Nexoria exposes a Spring Boot JSON API used by three frontend surfaces:

- public pages for intake, scheduling, login, registration, and admin bootstrap
- the admin workspace for leads, booked calls, blueprints, users, support, and schedule settings
- the client portal for approved blueprint views, next steps, results, scheduled calls, and support

The current product is rules-based and workflow-driven.

## Authentication and Authorization

### Public endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/bootstrap-admin`
- `GET /api/scheduling/availability`
- `POST /api/scheduling/bookings`
- `GET /v3/api-docs/**`
- `GET /swagger-ui/**`
- `GET /swagger-ui.html`
- `GET /actuator/health`
- `GET /actuator/info`

### Authenticated endpoints

- `GET /api/users/me` requires any authenticated user
- `GET /api/blueprints/**` requires any authenticated user
- `/api/users/**` beyond `/me` requires `ADMIN`
- `/api/blueprints/**` write operations require `ADMIN`
- `/api/leads/**` requires `ADMIN`
- `/api/support/messages/mine/**` requires `USER` or `VIEWER`
- `/api/support/**` admin endpoints require `ADMIN`
- admin scheduling endpoints require `ADMIN`

### JWT behavior

- Access and refresh tokens are JWT-based
- The frontend sends `Authorization: Bearer <token>`
- Auth endpoints are rate-limited by IP and path

## Security Headers

The API config applies production-oriented headers including:

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy`
- `Permissions-Policy`

Auth responses also return rate-limit headers such as:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`

## Endpoint Groups

## Auth

### `POST /api/auth/register`

Registers a client account and returns access plus refresh tokens.

Important current rule:
- registration is allowed only when the email already belongs to a lead in `BOOKED` or `CLOSED` status

Example request:

```json
{
  "email": "client@example.com",
  "password": "S3curePassw0rd!"
}
```

### `POST /api/auth/login`

Authenticates an existing user and returns access plus refresh tokens.

### `POST /api/auth/refresh`

Exchanges a refresh token for a new access token.

### `POST /api/auth/bootstrap-admin`

Creates the first admin account using the configured bootstrap secret.

Current note:
- there is no backend logout endpoint. The frontend's visible logout action clears local session storage and redirects home.

## Leads

### `GET /api/leads`

Lists admin-managed leads.

Supported query params:

- `search`
- `status`

### `POST /api/leads`

Creates a lead from the admin area.

### `PATCH /api/leads/{id}`

Updates lead details such as company, contact, status, and notes.

### `DELETE /api/leads/{id}`

Deletes a lead from Client Tracker.

Current behavior:
- deleting a lead removes the tracker record
- related scheduled calls are preserved by clearing their `lead_id` relationship
- related blueprints remain in the system until deleted separately from Blueprints
- related support threads remain in the system until deleted separately

## Scheduling

### `GET /api/scheduling/availability`

Returns public booking availability based on admin-defined schedule settings and active windows.

### `POST /api/scheduling/bookings`

Creates a scheduled call from the public site.

This endpoint also:

- creates or updates the matching lead
- marks the lead `BOOKED`
- stores the scheduled call
- may create an intake-seeded blueprint when the request came from `GET_STARTED` and required intake fields are present

### `GET /api/scheduling/settings`

Returns admin scheduling configuration.

### `PUT /api/scheduling/settings`

Updates timezone, slot duration, booking horizon, and availability windows.

### `GET /api/scheduling/bookings/admin`

Returns all scheduled calls for the admin portal.

### `GET /api/scheduling/bookings/mine`

Returns scheduled calls for the current client account.

### `PATCH /api/scheduling/bookings/{id}/clear`

Marks a booked call as cleared so the slot is considered available again.

### `DELETE /api/scheduling/bookings/{id}`

Deletes a scheduled call from the admin workspace.

Current behavior:
- deleting a booked call removes it from Operations Hub
- the related lead and blueprint are not automatically deleted

## Blueprints

### `GET /api/blueprints`

Returns blueprints visible to the authenticated user.

- admins get their owned blueprints
- client users can retrieve approved blueprint content associated with their account email

### `GET /api/blueprints/{id}`

Returns a single blueprint if it is visible to the authenticated user.

### `POST /api/blueprints`

Creates a blueprint from the admin workflow.

Current blueprint request shape:

```json
{
  "url": "https://example.com",
  "industry": "HVAC",
  "revenueRange": "$10k-$50k/mo",
  "clientEmail": "client@example.com",
  "goals": ["Book more jobs", "Improve response speed"]
}
```

### `PATCH /api/blueprints/{id}`

Updates admin-managed blueprint content and client portal settings.

Current write behavior includes:

- URL, industry, and revenue range updates
- assigning or changing `clientEmail`
- changing blueprint status
- changing purchase event type
- updating goals
- merging and updating client-visible fixes

### `DELETE /api/blueprints/{id}`

Deletes a blueprint record and its dependent goals and fixes.

### `POST /api/blueprints/diagnostic`

Generates a blueprint-style diagnostic result using the same request shape.

## Support

### `GET /api/support/messages/mine`

Returns the current client's support thread history.

### `POST /api/support/messages/mine`

Creates a client support message.

### `GET /api/support/messages/mine/stream`

Streams client support updates via Server-Sent Events.

### `GET /api/support/messages/admin`

Returns all admin-visible support messages.

### `POST /api/support/messages/admin/{clientEmail}/reply`

Creates an admin reply inside a client thread.

### `DELETE /api/support/messages/admin/{clientEmail}`

Deletes an entire support thread for the specified client email.

### `GET /api/support/messages/admin/stream`

Streams admin-visible support updates via Server-Sent Events.

## Users

### `GET /api/users/me`

Returns the current authenticated user summary.

### `GET /api/users`

Returns all managed users for the admin area.

### `POST /api/users`

Creates a managed user account from the admin area.

### `PATCH /api/users/{id}`

Updates username, role, and status.

### `PATCH /api/users/{id}/toggle-status`

Toggles active or pending account state.

### `DELETE /api/users/{id}`

Deletes a managed user account.

Current behavior:
- the user account is deleted
- linked lead `user_id` references are cleared first
- linked support message `client_user_id` references are cleared first
- support messages and blueprints remain until deleted separately

## Example Blueprint Response

```json
{
  "id": 12,
  "url": "https://example.com",
  "industry": "HVAC",
  "revenueRange": "$10k-$50k/mo",
  "clientEmail": "client@example.com",
  "status": "APPROVED",
  "purchaseEventType": "BOOKED_JOB",
  "goals": ["Book more jobs", "Recover missed calls"],
  "fixes": [
    {
      "title": "Build the booked-job intake path",
      "impact": "High",
      "effort": "Medium",
      "why": "The current path needs to capture the service need, urgency, area, and contact details before the lead cools off.",
      "owner": "NEXORIA",
      "status": "IN_PROGRESS",
      "clientVisible": true
    }
  ],
  "createdAt": "2026-04-26T15:00:00Z",
  "updatedAt": "2026-04-26T15:30:00Z"
}
```

## Error Shapes

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

Rate-limit error example:

```json
{
  "error": "Too Many Requests",
  "details": "Auth rate limit exceeded. Please retry shortly."
}
```

## Environment-Driven Behavior

- CORS origins are controlled by `APP_CORS_ALLOWED_ORIGIN_*`
- JWT signing uses `JWT_SECRET`
- auth throttling is controlled by:
  - `APP_RATE_LIMIT_AUTH_ENABLED`
  - `APP_RATE_LIMIT_AUTH_CAPACITY`
  - `APP_RATE_LIMIT_AUTH_WINDOW`
- security headers are controlled by:
  - `APP_SECURITY_CSP`
  - `APP_SECURITY_REFERRER_POLICY`
  - `APP_SECURITY_PERMISSIONS_POLICY`
  - `APP_SECURITY_HSTS_*`
