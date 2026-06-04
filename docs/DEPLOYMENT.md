# Deployment Readiness

Smart Agro AI is an open-source MVP/demo. This guide describes a safe deployment plan, not a production certification. Do not deploy with real users, real farm-critical decisions, real payments, or committed secrets.

## Recommended MVP Topology

```text
Browser
  |
  v
Static frontend host
  Vercel / Netlify / Cloudflare Pages
  VITE_API_BASE_URL=https://api.example.invalid
  |
  v
Hosted FastAPI backend
  Render / Railway / Fly.io / DigitalOcean App Platform
  |
  v
Hosted PostgreSQL database
  Alembic migrations required
```

Frontend and backend can be deployed independently. The frontend only needs the backend base URL. The backend must allow the deployed frontend origin through `ALLOWED_CORS_ORIGINS`.

## Frontend Hosting

Suitable MVP hosts:

- Vercel
- Netlify
- Cloudflare Pages

Build settings:

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `frontend/dist` or provider-relative `dist` |

Required variable:

| Variable | Required | Secret | Local example | Hosted demo guidance |
| --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | No | `http://127.0.0.1:8000` | Set to the public backend URL, for example `https://smart-agro-api.example.invalid`. |

## Backend Hosting

Suitable MVP hosts:

- Render
- Railway
- Fly.io
- DigitalOcean App Platform

Backend app:

- FastAPI app import path from repository root: `backend.main:app`
- FastAPI app import path from `backend/`: `main:app`
- Health endpoint: `/health`
- Readiness endpoint: `/ready`

Suggested install/build command from repository root:

```bash
python -m pip install -r backend/requirements.txt
```

Suggested start command from repository root:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

If the platform runs from `backend/`, use:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Backend Environment Variables

| Variable | Required | Secret | Local example | Hosted demo guidance |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Yes for hosted demo | Secret if it contains credentials | `sqlite:///backend/smartagro_local.db` | Use hosted PostgreSQL. Do not use local SQLite for a shared public demo. |
| `ALLOWED_CORS_ORIGINS` | Yes | No | `http://localhost:5173,http://127.0.0.1:5173` | Set to the deployed frontend URL. Use comma-separated origins. |
| `JWT_SECRET_KEY` | Yes for hosted demo | Yes | local-only generated value | Use a long random secret from the hosting provider secret manager. Never commit it. |
| `JWT_ALGORITHM` | Optional | No | `HS256` | Keep `HS256` unless the auth implementation changes. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Optional | No | `60` | Keep short for MVP demos. |
| `ADMIN_EMAILS` | Optional | No | empty | Use only fake/demo admin emails if needed. |
| `DEMO_SEED_PASSWORD` | Optional seed-only | Secret-like | `demo-password-123` | Set only for local/demo seeding. Do not use real passwords. |
| `DEMO_FARMER_EMAIL` | Optional seed-only | No | `demo.farmer@example.com` | Fake demo account only. |
| `DEMO_FARMER_NAME` | Optional seed-only | No | `Demo Farmer` | Fake demo account only. |
| `DEMO_ADMIN_EMAIL` | Optional seed-only | No | empty | Created only if also present in `ADMIN_EMAILS`. |
| `GEMINI_API_KEY` | Not used | Yes | empty | Reserved for future work. Do not set unless a real integration is implemented. |

## Database

Local development defaults to SQLite. Hosted demos should use PostgreSQL.

Before a hosted demo:

```bash
python -m alembic -c backend/alembic.ini upgrade head
```

Optional local/demo seed after migrations:

```bash
python -m backend.scripts.seed_demo
```

The seed script is idempotent and never prints passwords or hashes.

## ML And Dataset

Inference uses committed MVP artifacts:

- `backend/xgboost_model.joblib`
- `backend/encoder.joblib`

The training dataset CSV is not required for backend inference. `dataset/Crop_recommendation.csv` is download-only/user-provided and ignored by Git because source/license status is unresolved.

The model is MVP/demo-only and must not be described as production agronomic advice. Candidate artifacts remain blocked from promotion until dataset source/license and model release gates pass.

## Smoke Checks

Backend:

```bash
curl https://api.example.invalid/health
curl https://api.example.invalid/ready
```

Frontend:

- Open the deployed frontend URL.
- Verify login/register demo flow if demo auth is enabled.
- Verify `/ready` reports database connectivity and model artifact availability.
- Run Playwright locally against mocked backend before release.

## Rollback Plan

- Keep deployment changes in small commits.
- Keep model artifact changes out of deployment commits.
- Roll back frontend and backend independently through the hosting provider.
- If a database migration is involved, review downgrade safety before release; do not rely on destructive rollback.

## Release Notes

A public demo can be useful for exploration, but it is not production-grade. Disclose:

- MVP auth limitations.
- Static/demo product areas.
- Dataset download-only status.
- Model/demo limitations.
- No production agronomic advice.
