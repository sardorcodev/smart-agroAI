# Development Guide

This guide covers local development for the current Smart Agro AI MVP.

## Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- Git

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend from `backend/`:

```bash
uvicorn main:app --reload
```

The backend can also be imported from the repository root because model and database paths are resolved from `backend/main.py`.

## Backend Package Layout

The FastAPI app is organized under `backend/app/`:

- `app/main.py`: app factory and router registration.
- `app/config.py`: environment-derived settings and path defaults.
- `app/database.py`: SQLAlchemy engine/session/base and DB initialization.
- `app/models.py`: SQLAlchemy models.
- `app/schemas.py`: Pydantic request schemas and validation rules.
- `app/security.py`: password hashing, verification, and JWT helpers.
- `app/dependencies.py`: current-user and role authorization dependencies.
- `app/ml.py`: model/encoder loading and prediction helper.
- `app/services/weather.py`: Open-Meteo archive lookup and fallback handling.
- `app/services/irrigation.py`: irrigation calculation helper.
- `app/services/analysis.py`: high-level analyze orchestration.
- `app/routers/health.py`: `/health` and `/ready`.
- `app/routers/auth.py`: `/api/register`, `/api/login`, and `/api/me`.
- `app/routers/analyze.py`: `/api/analyze`.

`backend/main.py` remains as a compatibility shim for old import paths and `uvicorn main:app`.

## Backend Environment Variables

Copy `backend/.env.example` to a local `.env` file if needed. The app reads environment variables from the process environment; it does not automatically load `.env`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Optional database URL. Defaults to local SQLite at `backend/smartagro_local.db`. |
| `ALLOWED_CORS_ORIGINS` | Comma-separated frontend origins. |
| `ADMIN_EMAILS` | Optional comma-separated demo admin registration emails. |
| `JWT_SECRET_KEY` | Secret used to sign JWT access tokens. Set a strong value outside local-only development. |
| `JWT_ALGORITHM` | JWT signing algorithm. Defaults to `HS256`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime in minutes. Defaults to `60`. |
| `GEMINI_API_KEY` | Reserved for future integration. Not used by the current MVP. |
| `DEMO_SEED_PASSWORD` | Optional local-only password for demo seed users. Defaults to `demo-password-123`. |
| `DEMO_FARMER_EMAIL` | Optional local-only demo farmer email. |
| `DEMO_FARMER_NAME` | Optional local-only demo farmer display name. |
| `DEMO_ADMIN_EMAIL` | Optional local-only demo admin email. Created only when also listed in `ADMIN_EMAILS`. |

## Database Migrations and Seed Data

Alembic migrations live in `backend/alembic/`.

Run migrations from the repository root:

```bash
python -m alembic -c backend/alembic.ini upgrade head
```

Windows virtual environment variant:

```powershell
.\backend\venv\Scripts\python.exe -m alembic -c backend\alembic.ini upgrade head
```

The initial migration creates the current `users` table only. It does not add marketplace, support, IoT, report, payment, or admin-domain tables.

Local demo seed data is optional and never runs automatically:

```bash
python -m backend.scripts.seed_demo
```

Windows virtual environment variant:

```powershell
.\backend\venv\Scripts\python.exe -m backend.scripts.seed_demo
```

Seed behavior:

- Creates a clearly fake demo farmer by default.
- Uses `DEMO_SEED_PASSWORD` or the documented local-only default `demo-password-123`.
- Hashes passwords with the backend password helper.
- Is idempotent for existing demo users.
- Prints only created/skipped user emails and roles.
- Does not print passwords or password hashes.
- Creates a demo admin only when `DEMO_ADMIN_EMAIL` is also listed in `ADMIN_EMAILS`.

Local SQLite files such as `backend/smartagro_local.db` are ignored by git. Do not commit local databases, real users, password hashes, or `.env` files.

## Frontend Setup

From the repository root:

```bash
cd frontend
npm ci
```

Run the frontend:

```bash
npm run dev
```

Optional frontend environment:

```bash
copy .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL. Defaults to `http://127.0.0.1:8000`. |

Frontend auth notes:

- `src/api.js` stores the MVP access token in `localStorage`.
- `src/api.js` attaches the token as `Authorization: Bearer <token>` when present.
- On app startup, `App.jsx` calls `/api/me` through `fetchCurrentUser()` when a stored token exists.
- If session restore fails with `401` or `403`, the token is cleared and the auth view is shown.
- Normal API `401` responses clear stale auth state through the API client's auth-failure handler.
- Protected app views are guarded in frontend state. This is a UX guard; backend dependencies remain the actual security boundary.

Frontend error-handling notes:

- Use `formatApiError()` from `src/api.js` for user-facing API errors.
- Use `components/ui/Notice.jsx` for inline success, warning, info, and error messages.
- Use `components/ui/DemoBadge.jsx` to mark demo-only MVP areas.
- Use `components/ui/LoadingState.jsx` when a full loading state is needed.
- Do not render raw error objects or long backend details.
- Prefer inline section messages over `alert()` for core app flows.
- Dashboard analysis shows inline loading, success, and error states.
- PDF export errors are shown inline above the dashboard content.
- Error notices should use `role="alert"`; non-error notices and loading states should expose readable status text.
- Icon-only buttons should have an `aria-label`; selected tab/menu controls should expose current or pressed state where practical.

Dashboard location behavior:

- The app first attempts browser geolocation when the dashboard opens.
- If GPS fails or permission is denied, users can retry GPS, enter latitude/longitude manually, or explicitly choose demo coordinates.
- Demo coordinates are labeled as demo behavior and are not silently applied.

Demo/static action behavior:

- Marketplace checkout/cart, support tickets, profile subscription/security actions, history filters, simulated pump controls, and admin sensor actions are MVP/demo UI only unless a backend integration is added later.
- These flows should show inline demo-only messages rather than fake persistence.

## Quality Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm test
npm audit
npm audit --omit=dev
npx playwright install chromium
npm run test:e2e
```

Backend:

```bash
python -m pip check
python -m pytest backend/tests
```

Migration smoke check:

```bash
DATABASE_URL=sqlite:///backend/smartagro_migration_smoke.db python -m alembic -c backend/alembic.ini upgrade head
```

Remove the smoke database afterward; SQLite database files are ignored and should not be committed.

## Backend Health and Readiness

When the backend is running:

- `GET /health` returns basic service status and whether models loaded.
- `GET /ready` checks database connectivity and model/encoder artifact availability.

Neither endpoint calls external weather or AI services.

## Browser QA Smoke Tests

Playwright tests live in `frontend/e2e/` and are configured by `frontend/playwright.config.js`.

Local setup:

```bash
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` starts the Vite dev server automatically on a local test port. The tests use Chromium plus a focused mobile Chromium project.

The browser QA baseline mocks backend calls with Playwright route interception:

- `GET /api/me`
- `POST /api/login`
- `POST /api/analyze`

The suite does not require a real backend, SQLite database, weather provider, browser geolocation permission, model artifacts, Gemini key, or production secrets. It verifies public landing behavior, MVP login/logout, session restore, stale-token handling, dashboard analysis rendering, mobile navigation, and lightweight accessibility/keyboard behavior.

Current limitations:

- This is a smoke baseline, not full WCAG certification.
- API mocks intentionally cover stable frontend contracts, not backend integration behavior.
- Visual regression testing is not included.
- Route-based navigation is not introduced; tests follow the current app-state navigation model.

## Frontend Bundle and Audit Notes

The frontend should keep `npm audit` and `npm audit --omit=dev` clean. Avoid `npm audit fix --force` unless a breaking upgrade has been reviewed and tested.

The app intentionally lazy-loads heavier authenticated sections and dynamically imports PDF export libraries only when a user exports a report. This keeps the public landing/auth path smaller without changing the current state-based navigation.

If the Vite large chunk warning returns, inspect whether new eager imports pull in charting, mapping, PDF, or large feature-section dependencies.

## Authentication Flow

Current MVP auth endpoints:

- `POST /api/register`: creates a user with normalized email and hashed password. Admin role is assigned only when the normalized email appears in `ADMIN_EMAILS`.
- `POST /api/login`: verifies credentials and returns `access_token`, `token_type: "bearer"`, and safe user metadata.
- `GET /api/me`: requires an `Authorization: Bearer <token>` header and returns the current safe user profile.

JWT access tokens include the user id, email, role, and expiration. The backend rejects missing, invalid, expired, or unknown-user tokens with `401`.

Current limitations:

- No refresh tokens yet.
- No email verification yet.
- No password reset yet.
- No multi-factor auth yet.
- No production-grade rate limiting yet.
- The frontend stores the MVP token in `localStorage`; this is simple for development but should be replaced or hardened for production security needs.

## Backend Validation Rules

Registration/login:

- Emails are trimmed, lowercased, and checked for a basic email shape.
- Registration passwords must be at least 8 characters.
- Login errors avoid exposing password or account internals.

Farm analysis:

- `n`, `p`, and `k`: `0` to `500`
- `ph`: `0` to `14`
- `current_soil_moisture`: `0` to `100`
- `area_m2`: greater than `0`, up to `10,000,000`
- `lat`: `-90` to `90`
- `lon`: `-180` to `180`
- `start_date` and `end_date`: valid dates
- `start_date` must be on or before `end_date`
- Date range must not exceed `366` days

`POST /api/analyze` uses Pydantic/FastAPI `422` responses for invalid input.

## Analyze Response Contract

`POST /api/analyze` returns a stable MVP shape that includes:

- `recommended_crop`
- `top_predictions`
- `top_3_recommendations` for current frontend compatibility
- `irrigation`
- `weather_summary`
- `weather` for current frontend compatibility
- `model_status`
- `inference_mode`
- `warnings`

Weather API failures use fallback weather data and are marked with `weather_summary.fallback_used`, `weather_summary.source`, and `warnings`. Backend tests mock provider responses and must not call real weather APIs.

Model recommendations expose `model_status` and `inference_mode`. Missing model artifacts and runtime inference failures return stable simulation predictions with warning metadata instead of failing the request. Crop labels are normalized for irrigation lookup across common English and Uzbek labels while preserving the display label returned in `recommended_crop`.

ML audit, reproducibility, release-gate, and data-governance documentation lives under `docs/ml/`. The current dataset source/license is unknown. Phase 4B adds dataset validation, label mapping, candidate training, metrics, and candidate metadata. Phase 4C compares candidate and production artifacts, captures dependency versions, and blocks promotion until dataset source/license is resolved. Phase 4D found no repository-local source/license evidence for `dataset/Crop_recommendation.csv`.

The repository MIT license must not be assumed to grant redistribution rights for the dataset. See `docs/ml/DATA_POLICY.md`.

Validate the dataset:

```powershell
.\backend\venv\Scripts\python.exe -m backend.ml.validate_dataset --json
```

Train candidate artifacts into the ignored output directory:

```powershell
.\backend\venv\Scripts\python.exe -m backend.ml.train_model --output-dir backend\ml\artifacts\phase4b-candidate
```

Compare production and candidate artifacts:

```powershell
.\backend\venv\Scripts\python.exe -m backend.ml.compare_artifacts --candidate-dir backend\ml\artifacts\phase4b-candidate --output docs\ml\artifacts\latest_comparison.json
```

## Common Troubleshooting

### Model does not load

Confirm these files exist:

- `backend/xgboost_model.joblib`
- `backend/encoder.joblib`

The backend should load them regardless of whether it is imported from the repo root or run from `backend/`.

### CORS error in browser

Set `ALLOWED_CORS_ORIGINS` to include the frontend dev server origin, usually `http://localhost:5173` or `http://127.0.0.1:5173`.

### API calls fail from frontend

Check `VITE_API_BASE_URL` in `frontend/.env`, then restart the Vite dev server.

### SQLite database appears locally

This is expected. Local SQLite files are ignored by git. Do not commit them.
