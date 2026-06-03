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
- Display analysis results, simulated irrigation controls, maps, marketplace demo data, and reports.

Current limitations:

- Navigation is app-state based, not route based.
- Several screens are static or simulated.
- Authentication state is held in frontend memory only.
- Mobile navigation still needs improvement.

## Backend Boundary

The backend lives in `backend/main.py`.

Responsibilities:

- Provide FastAPI endpoints for registration, login, health, OpenAPI, and farm analysis.
- Initialize a local SQLite database from `DATABASE_URL`.
- Load model artifacts from stable paths relative to `backend/main.py`.
- Estimate crop recommendation probabilities and irrigation need.

Current limitations:

- The backend is intentionally still a single-file MVP.
- Authentication is demo-only.
- Admin authorization is not production-ready.
- Input validation and error handling need hardening.
- No database migrations are present yet.

## AI/ML Boundary

Model artifacts:

- `backend/xgboost_model.joblib`
- `backend/encoder.joblib`

Current behavior:

- The backend loads the XGBoost classifier and label encoder at import time.
- `/api/analyze` builds a seven-feature input and returns a top-3 recommendation list.

Current limitations:

- No training script is included.
- No model card or metrics are included.
- Dataset provenance and licensing need documentation.
- Crop label mappings need further cleanup.

## Database Boundary

Local development uses SQLite by default:

- Default path: `backend/smartagro_local.db`
- Configurable through `DATABASE_URL`

Local database files are ignored by git. The repository must not contain real user records, password hashes, or local DB artifacts.

## Real vs Demo/Static

Real MVP flows:

- Frontend app shell and dashboard.
- Demo registration/login backed by SQLite.
- Crop recommendation API using local model artifacts.
- OpenAPI docs and health endpoint.
- Client-side PDF report generation.

Demo/static flows:

- Virtual Agronom chat responses.
- Agro Market checkout.
- IoT/sensor ingestion.
- Support tickets.
- Admin analytics.
- Irrigation history persistence.
- Payments/subscriptions.
