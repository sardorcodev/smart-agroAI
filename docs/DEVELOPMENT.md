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

## Backend Environment Variables

Copy `backend/.env.example` to a local `.env` file if needed. The app reads environment variables from the process environment; it does not automatically load `.env`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Optional database URL. Defaults to local SQLite at `backend/smartagro_local.db`. |
| `ALLOWED_CORS_ORIGINS` | Comma-separated frontend origins. |
| `ADMIN_EMAILS` | Optional comma-separated demo admin registration emails. |
| `GEMINI_API_KEY` | Reserved for future integration. Not used by the current MVP. |

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

## Quality Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
npm test
```

Backend:

```bash
python -m pip check
python -m pytest backend/tests
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
