# Security Notes

Smart Agro AI is an MVP and should not be used with real production users, payments, secrets, or farm-critical decisions yet.

## Secrets

- Never commit `.env` files.
- Never commit API keys, tokens, database URLs with credentials, password hashes, or user records.
- Use `.env.example` files for variable names only.
- Rotate any secret that was ever committed.

## Local Databases

Local SQLite files are development artifacts and are ignored by git:

- `*.db`
- `*.sqlite`
- `*.sqlite3`

Do not commit demo users, real users, password hashes, or admin accounts.

Run Alembic migrations for shared or production-like databases instead of committing SQLite files. Local demo seed data is optional, uses fake accounts only, and must never contain real credentials. The seed script does not print passwords or password hashes.

## API Keys

`GEMINI_API_KEY` is documented only as a future integration variable. The current Virtual Agronom UI is mocked and does not require a real API key.

## Current Auth Limitations

- Login/register use a JWT access-token MVP flow.
- `/api/me` requires a valid bearer token and returns safe user metadata.
- Admin role assignment is controlled by `ADMIN_EMAILS`; clients cannot self-select admin role.
- Role authorization helpers exist for future protected routes.
- Do not use this auth model as-is for production.

Production or shared deployments must set a strong `JWT_SECRET_KEY`. The development fallback secret is only for local work and tests.

Hosted demos must configure secrets through the hosting provider or environment manager. Do not put production/demo secrets in `.env.example`, screenshots, issue comments, deployment logs, or committed config files.

For public demos, configure `ALLOWED_CORS_ORIGINS` to the exact deployed frontend origin and avoid wildcard CORS.

The current backend does basic email normalization, password length validation, password hashing, JWT signing, JWT validation, and safe current-user lookup. It does not yet include refresh tokens, rate limiting, account verification, password reset, multi-factor auth, or a full production admin authorization system.

The frontend stores the MVP access token in `localStorage`, restores sessions with `/api/me`, and clears stale tokens after `401` responses. This keeps the demo flow simple, but it increases exposure if frontend XSS is introduced and should be revisited before production use.

Frontend protected-view guards are for user experience only. Backend token validation and role dependencies remain the actual security boundary.

Frontend API errors are formatted into short user-facing messages. Raw backend error objects, stack traces, and long details should not be rendered in the UI.

Dashboard location fallback is explicit: users may retry GPS, manually enter coordinates, or choose labeled demo coordinates. The frontend should not silently substitute fake location data.

## Weather and AI Fallbacks

`POST /api/analyze` does not require Gemini or any external AI key. It uses local model artifacts when available.

If weather lookup fails, the backend returns fallback weather values and marks the response with a warning. This is suitable for MVP continuity, not for production agronomic advice.

Backend service logging covers weather fallback, model fallback, and unexpected analyze failures. Logs must not include passwords, JWTs, secret values, password hashes, or full sensitive user payloads.

## Responsible Disclosure

Use `SECURITY.md` for the current vulnerability reporting policy. Do not disclose exploitable security details in public issues.
