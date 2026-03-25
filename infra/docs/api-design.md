# API Design

## Base URL
`http://localhost:8080/api`

## Endpoints

### Auth
- `POST /api/auth/login`
  - body: `{ "email": string, "password": string }`
  - response: `{ "token": string, "refreshToken": string }`
- `POST /api/auth/register`
  - body: `{ "email": string, "password": string }`
  - response: `{ "id": number, "email": string }`
- `POST /api/auth/refresh`
  - body: `{ "refreshToken": string }`
  - response: `{ "token": string }`

### Blueprints
- `GET /api/blueprints`
  - response: `BlueprintSummary[]`
- `GET /api/blueprints/{id}`
  - response: `Blueprint`
- `POST /api/blueprints`
  - body: `BlueprintRequest`
  - response: `Blueprint`
- `PATCH /api/blueprints/{id}`
  - body: `BlueprintRequest`
  - response: `Blueprint`
- `DELETE /api/blueprints/{id}`
  - response: 204
- `POST /api/blueprints/diagnostic`
  - body: `BlueprintRequest`
  - response: `Blueprint` (computed score, fixes, readyForRetainer)

## Payload examples

### BlueprintRequest
```json
{
  "url": "https://example.com",
  "industry": "Tech / SaaS",
  "revenueRange": "$50k–$200k/mo",
  "goals": ["More leads", "Improve SEO"],
  "externalSignal": { "windspeed": 12.3, "weathercode": 1, "temperature": 15.2 }
}
```

### Blueprint
```json
{
  "id": 1,
  "url": "https://example.com",
  "industry": "Tech / SaaS",
  "revenueRange": "$50k–$200k/mo",
  "goals": ["More leads", "Improve SEO"],
  "score": 71,
  "readyForRetainer": true,
  "fixes": [{ "title": "...", "impact": "High", "effort": "Medium", "why": "..." }],
  "externalSignal": { "windspeed": 12.3, "weathercode": 1, "temperature": 15.2 },
  "createdAt": "2026-03-24T...Z",
  "updatedAt": "2026-03-24T...Z"
}
```

## Error codes
- 400: Bad request (validation failure)
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Internal server error
