# Public Demo Checklist

Use this checklist before publishing a public demo URL or GitHub release notes.

## Repository

- [ ] Working tree is clean.
- [ ] No `.env` files are staged or committed.
- [ ] No local SQLite database files are staged or committed.
- [ ] No generated frontend build output is staged.
- [ ] No Playwright reports, traces, screenshots, videos, or test results are staged.
- [ ] No downloaded dataset CSV is staged.
- [ ] Candidate model artifacts remain ignored unless intentionally promoted through the model gate.

## Verification

- [ ] Backend dependency check passes: `python -m pip check`.
- [ ] Backend tests pass: `python -m pytest backend/tests`.
- [ ] Frontend lint passes: `npm run lint`.
- [ ] Frontend unit tests pass: `npm test`.
- [ ] Frontend build passes: `npm run build`.
- [ ] Playwright smoke tests pass: `npm run test:e2e`.
- [ ] Frontend audit passes: `npm audit`.
- [ ] Production dependency audit passes: `npm audit --omit=dev`.

## Backend Deployment

- [ ] `DATABASE_URL` is configured through the hosting secret manager.
- [ ] Hosted demo uses PostgreSQL or another hosted persistent database, not local SQLite.
- [ ] Alembic migrations have run.
- [ ] `JWT_SECRET_KEY` is set to a strong non-committed value.
- [ ] `ALLOWED_CORS_ORIGINS` matches the deployed frontend URL.
- [ ] `/health` returns success.
- [ ] `/ready` returns database and model readiness.
- [ ] Optional demo seed data uses fake accounts only.

## Frontend Deployment

- [ ] `VITE_API_BASE_URL` points to the deployed backend.
- [ ] The landing page renders.
- [ ] Auth flow reaches the authenticated MVP dashboard.
- [ ] Stale token handling still returns to unauthenticated state.
- [ ] Analysis UI handles API errors and warnings clearly.

## Disclosure

- [ ] The project is described as an MVP/demo, not production-ready.
- [ ] Dataset CSV is documented as download-only/user-provided.
- [ ] Dataset redistribution rights are not claimed.
- [ ] Model output is disclosed as MVP/demo-only and not agronomic advice.
- [ ] Static/demo marketplace, support, IoT, admin, and assistant areas remain labeled.
- [ ] MVP auth limitations are disclosed.

## Rollback

- [ ] Frontend rollback path is known.
- [ ] Backend rollback path is known.
- [ ] Database migration rollback risk has been reviewed.
- [ ] Latest stable commit/tag is recorded.
