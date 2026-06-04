# Architecture

Smart Agro AI is currently an MVP with a React frontend, a FastAPI backend, local SQLite development storage, and local XGBoost model artifacts.

## System Overview

```text
React + Vite frontend
  |
  | HTTP JSON API
  v
FastAPI backend
  |-- SQLite user storage for local/demo auth
  |-- XGBoost crop recommendation model
  |-- Open-Meteo archive lookup for weather context
```

## Frontend Boundary

The frontend lives in `frontend/`.

Responsibilities:

- Render the MVP user interface.
- Collect soil, date, location, and simulated sensor inputs.
- Call backend APIs through `src/api.js`.
- Store the MVP JWT access token in `localStorage` and attach it to API requests.
- Restore stored sessions on app startup by calling `/api/me`.
- Clear stale tokens and return users to the auth screen after `401` responses.
- Guard app views in frontend state so unauthenticated users cannot navigate directly into protected MVP screens.
- Convert common API failures into bounded inline messages through the shared API client helper.
- Allow dashboard analysis to proceed with GPS coordinates, manually entered coordinates, or explicitly selected demo coordinates.
- Provide a compact mobile menu selector while the desktop sidebar remains hidden on small screens.
- Use small shared UI helpers for accessible notices, demo labels, and loading states.
- Display analysis results, simulated irrigation controls, maps, marketplace demo data, and reports.
- Provide a Playwright smoke-test surface for public landing, mocked auth/session restore, mocked analysis, mobile navigation, and basic accessibility roles.
- Lazy-load heavier authenticated sections and dynamically import PDF export libraries to keep the initial frontend bundle smaller.

Current limitations:

- Navigation is app-state based, not route based.
- Several screens are static or simulated.
- Access token storage is MVP-only and should be revisited before production use.
- Frontend guards are UX controls only; backend authorization remains the security boundary.
- Mobile navigation has a minimal fallback selector, but the overall mobile experience still needs deeper responsive QA.
- Accessibility has a baseline pass for core controls and notices, but full WCAG audit coverage is still future work.
- Browser QA is smoke-level and uses mocked backend responses; it is not a substitute for full production integration or visual regression testing.
- Bundle splitting is intentionally minimal; the app still uses state-based navigation rather than route-level architecture.

## Backend Boundary

The backend lives in `backend/app/`. `backend/main.py` remains a compatibility entrypoint for existing `uvicorn main:app` commands.

Current backend package layout:

```text
backend/
  main.py                 # compatibility export
  app/
    main.py               # FastAPI app factory and router registration
    config.py             # environment/config defaults
    database.py           # SQLAlchemy engine/session/base
    models.py             # SQLAlchemy models
    schemas.py            # Pydantic request validation
    security.py           # password hashing and JWT helpers
    dependencies.py       # current-user and role authorization dependencies
    ml.py                 # model/encoder loading and prediction helper
    routers/
      health.py
      auth.py
      analyze.py
  scripts/
    seed_demo.py          # local-only demo seed helper
    services/
      weather.py
      irrigation.py
      analysis.py
```

Responsibilities:

- Provide FastAPI endpoints for registration, login, current user lookup, health, OpenAPI, and farm analysis.
- Initialize a local SQLite database from `DATABASE_URL`.
- Support Alembic migrations for shared and production-like database initialization.
- Generate and validate JWT access tokens for the current MVP auth flow.
- Assign admin role only from configured `ADMIN_EMAILS`.
- Load model artifacts from stable paths relative to `backend/main.py`.
- Estimate crop recommendation probabilities and irrigation need.
- Validate auth and analysis inputs before business logic runs.
- Expose `/health` for basic service status and `/ready` for database/model readiness.

Current limitations:

- Authentication uses short-lived JWT access tokens, but there are no refresh tokens, email verification, password reset, multi-factor auth, or production rate limits yet.
- Admin authorization helpers exist for future protected routes, but there is no complete admin API yet.
- Alembic migration support exists for the current users table, but the schema remains intentionally small.
- The package structure is intentionally small and should not be treated as a complete production architecture yet.

## AI/ML Boundary

Model artifacts:

- `backend/xgboost_model.joblib`
- `backend/encoder.joblib`

Current behavior:

- `backend/app/ml.py` loads the XGBoost classifier and label encoder at import time.
- `backend/app/services/analysis.py` orchestrates weather lookup, prediction, irrigation calculation, and response shaping.
- `/api/analyze` builds a seven-feature input and returns a top-3 recommendation list.

Current limitations:

- Candidate training scripts exist under `backend/ml/`, but production MVP artifacts are not replaced automatically.
- Baseline metrics, candidate metadata, and comparison reports exist under `docs/ml/`, but they are reproducibility/release-gate records rather than field validation.
- Dataset provenance and licensing are unknown and need confirmation before assuming open redistribution rights.
- Phase 4C found the candidate artifacts backend-compatible but blocked promotion because dataset source/license is unresolved.
- Phase 4D found no repository-local source/license evidence for the current dataset; it remains temporarily tracked with explicit warnings.
- Crop label mappings have an MVP normalization layer and a training label contract, but source-data provenance still needs confirmation.

## Database Boundary

Local development uses SQLite by default:

- Default path: `backend/smartagro_local.db`
- Configurable through `DATABASE_URL`

Local database files are ignored by git. The repository must not contain real user records, password hashes, or local DB artifacts.

Alembic migrations live in `backend/alembic/`. The initial migration creates the current MVP `users` table. The FastAPI app still keeps a `create_all` fallback for local/test ergonomics, but migration commands are the documented path for shared or production-like databases.

Optional demo seed data lives in `backend/scripts/seed_demo.py`. It is local-only, idempotent, does not run at startup, hashes demo passwords, and never prints passwords or password hashes.

## Real vs Demo/Static

Real MVP flows:

- Frontend app shell and dashboard.
- Registration/login backed by SQLite with JWT access tokens.
- `/api/me` authenticated current-user lookup.
- Frontend session restore from stored MVP token.
- Frontend protected-view guards for dashboard, profile, market, analysis, history, support, map, and admin views.
- Inline dashboard analysis errors and PDF export messages.
- Demo-only labels/messages for static marketplace, support, profile, history, IoT, and admin actions.
- Accessible notice roles for error/status messages and readable loading states.
- Crop recommendation API using local model artifacts.
- OpenAPI docs and health endpoint.
- Readiness endpoint for DB/model checks.
- Client-side PDF report generation.

## API Contract Notes

`POST /api/analyze` returns both legacy MVP keys and the newer hardened contract fields:

- `recommended_crop`
- `top_predictions`
- `top_3_recommendations` for backward compatibility
- `irrigation`
- `weather_summary`
- `weather` for backward compatibility
- `model_status`
- `inference_mode`
- `warnings`

Weather lookup uses the Open-Meteo archive API with an explicit timeout and provider-response validation. Network failures, timeouts, malformed provider payloads, or unusable seasonal data fall back to stable MVP default values. The response marks this with `weather_summary.fallback_used`, `weather_summary.source`, and a warning string.

Model inference is explicit about runtime mode. When artifacts are unavailable, or when loaded artifacts fail during prediction, `/api/analyze` returns stable simulation predictions with `inference_mode: "simulation"`, a non-success `model_status`, and a warning. Crop labels are normalized for irrigation lookup so common English and Uzbek labels such as `Cotton`/`Paxta`, `Rice`/`Sholi`, `Maize`/`Makkajo'xori`, and `Tomato`/`Pomidor` use the intended irrigation rule while preserving the user-facing recommended crop label.

Demo/static flows:

- Virtual Agronom chat responses.
- Agro Market checkout.
- IoT/sensor ingestion.
- Support tickets.
- Admin analytics.
- Irrigation history persistence.
- Payments/subscriptions.

## Browser QA Boundary

Playwright tests live under `frontend/e2e/`. They start the Vite frontend locally and intercept backend API calls in the browser test process.

Mocked browser-test endpoints include:

- `GET /api/me` for session restore and stale-token checks.
- `POST /api/login` for MVP login smoke coverage.
- `POST /api/analyze` for dashboard result rendering.

The browser QA suite intentionally does not start FastAPI, create SQLite databases, call Open-Meteo, require real geolocation, load production secrets, or depend on live model inference. Backend behavior remains covered by backend tests; Playwright verifies that the frontend handles the documented API contracts in a real browser.
