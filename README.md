# Smart Agro AI

Smart Agro AI is an MVP agriculture decision-support platform in active development. It combines a React frontend, a FastAPI backend, a local SQLite development database, and an XGBoost crop recommendation model artifact.

The current repository is suitable as a public open-source baseline, but it is not production-ready. Some screens are real MVP flows, while others are static demo views intended to show the planned platform direction.

## Current Status

| Area | Status |
| --- | --- |
| Frontend app | Implemented MVP with React, Vite, Tailwind CSS, Recharts, and React Leaflet. |
| Backend API | Implemented MVP with FastAPI, SQLAlchemy, SQLite, and model inference. |
| Crop recommendation | Implemented with local XGBoost and LabelEncoder artifacts. |
| Weather lookup | Implemented through Open-Meteo archive API with fallback values. |
| Authentication | JWT-based MVP registration, login, current-user lookup, and frontend session restore. Not production auth. |
| Virtual Agronom | Mocked frontend assistant. Gemini is not currently integrated. |
| Agro Market | Static/demo product catalog with local cart state only. |
| IoT/sensors | Simulated through frontend sliders. No real IoT ingestion yet. |
| Support tickets | Static/demo form only. |
| Admin dashboard | Static/demo metrics with frontend-only role display. |
| PDF report | Client-side report export for completed analysis. |

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Leaflet
- Lucide React
- Playwright for browser smoke testing

Backend:

- FastAPI
- SQLAlchemy
- SQLite for local development
- Pydantic
- XGBoost
- scikit-learn
- Joblib
- NumPy
- python-jose

## Repository Structure

```text
smart-agro/
  .github/
    workflows/
    ISSUE_TEMPLATE/
  backend/
    main.py
    app/
      main.py
      config.py
      database.py
      models.py
      schemas.py
      security.py
      ml.py
      routers/
      services/
    requirements.txt
    tests/
    .env.example
    xgboost_model.joblib
    encoder.joblib
  docs/
    ARCHITECTURE.md
    DEVELOPMENT.md
    SECURITY_NOTES.md
    audits/
  frontend/
    src/
    public/
    package.json
    .env.example
  dataset/
    Crop_recommendation.csv
  README.md
  LICENSE
  SECURITY.md
  CONTRIBUTING.md
  ROADMAP.md
  CHANGELOG.md
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Security notes](docs/SECURITY_NOTES.md)
- [Contributing](CONTRIBUTING.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Full repository audit](docs/audits/FULL_REPOSITORY_AUDIT.md)

## Security Notice

Never commit:

- `.env` files
- API keys
- access tokens
- local SQLite database files
- password hashes
- real user records
- production credentials

If a secret was ever committed, rotate it immediately. Local database files are ignored by git and should be recreated by each developer.

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Optional local configuration:

```bash
copy .env.example .env
```

The current backend reads configuration from environment variables. It does not automatically load `.env`; use your shell, IDE, or process manager to export variables if needed.

Backend environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///backend/smartagro_local.db` | Database connection URL. |
| `ALLOWED_CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated frontend origins. |
| `ADMIN_EMAILS` | empty | Optional comma-separated demo admin emails. Leave empty for public use. |
| `JWT_SECRET_KEY` | development-only fallback | Secret used to sign JWT access tokens. Set a strong value for any shared or deployed environment. |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Access token lifetime in minutes. |
| `GEMINI_API_KEY` | empty | Reserved for future Gemini integration. Not used by the current MVP. |

Run the backend:

```bash
uvicorn main:app --reload
```

The backend application lives in `backend/app/`. `backend/main.py` remains a compatibility entrypoint so `uvicorn main:app --reload` still works from the `backend/` directory.

## Frontend Setup

From the repository root:

```bash
cd frontend
npm install
```

Optional local configuration:

```bash
copy .env.example .env
```

Frontend environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | Backend API base URL. |

Frontend auth behavior:

- Login stores the backend access token in `localStorage`.
- App startup checks for a stored token and calls `/api/me` to restore the current user.
- Invalid or expired tokens are cleared and the user is returned to the login view.
- Protected app views require a restored or freshly logged-in user in frontend state.
- Core app errors are shown as bounded inline messages instead of browser alerts.
- Dashboard analysis supports GPS, manual latitude/longitude entry, or explicitly selected demo coordinates.
- Static marketplace, support, profile, history, IoT, and admin actions are labeled as demo/MVP where they are not persisted.
- Shared frontend helpers provide accessible notices, demo badges, and readable loading states.

Run the frontend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Lint the frontend:

```bash
npm run lint
```

Test the frontend:

```bash
npm test
```

Run browser smoke tests:

```bash
npx playwright install chromium
npm run test:e2e
```

The Playwright suite starts the Vite dev server automatically and mocks backend API calls. It does not require a real backend, database, weather API, model inference, browser geolocation permission, API keys, or secrets.

## Backend Tests

From the repository root:

```bash
python -m pytest backend/tests
```

Backend tests use temporary SQLite databases and do not require real API keys.

## Browser QA

Phase 3D adds a focused Playwright smoke baseline under `frontend/e2e/`.

Covered flows:

- public landing page rendering and primary navigation
- login/logout with mocked `/api/login`
- stored-token session restore with mocked `/api/me`
- stale-token handling and friendly auth notice
- dashboard analysis with mocked `/api/analyze`
- manual/demo location fallback without real geolocation
- mobile compact navigation
- lightweight keyboard, form-label, alert, and status-role checks

Generated Playwright reports, traces, screenshots, videos, and test results are ignored by git.

## API Overview

Current endpoints:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Demo user registration. |
| `POST` | `/api/login` | User login. Returns a bearer access token and safe user metadata. |
| `GET` | `/api/me` | Returns the current authenticated user from a bearer token. |
| `POST` | `/api/analyze` | Crop recommendation and irrigation estimate. |
| `GET` | `/health` | Basic service health. |
| `GET` | `/ready` | Database and model readiness check. |

FastAPI also exposes generated docs when the backend is running:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/openapi.json`

Backend validation rules and the current `/api/analyze` response contract are documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

The frontend stores the MVP access token in `localStorage`, restores sessions with `/api/me`, and sends API calls with an `Authorization: Bearer ...` header. This keeps the current demo flow simple, but it is not the recommended storage strategy for high-security production systems.

## AI/ML Notes

The model artifacts are included in `backend/`:

- `xgboost_model.joblib`
- `encoder.joblib`

Known limitations:

- No training script is included yet.
- No model card or metrics are included yet.
- Dataset provenance and licensing still need documentation.
- Some crop-label mappings still need reliability work.
- The model is for MVP demonstration and should not be treated as agronomic advice.
- Weather API failures are returned with fallback indicators and warning messages.

## What Is Demo-Only

The following areas are currently static or simulated:

- Virtual Agronom AI chat
- Agro Market checkout
- IoT device integration
- Sensor ingestion
- Support ticket submission
- Admin analytics
- Irrigation history persistence
- Subscription/payment flows

## Open-Source Baseline

This repository now includes:

- MIT `LICENSE`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- GitHub issue templates and pull request template
- GitHub Actions CI for frontend and backend checks

Planned next steps are listed in `ROADMAP.md`.

## License

Smart Agro AI is released under the MIT License. See `LICENSE`.
