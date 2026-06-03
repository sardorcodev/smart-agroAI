# Contributing

Thanks for helping improve Smart Agro AI. This repository is currently an MVP, so contributions should focus on safety, correctness, tests, documentation, and small reviewable improvements.

## Local Setup

1. Install frontend dependencies in `frontend/`.
2. Install backend dependencies from `backend/requirements.txt`.
3. Copy `backend/.env.example` and `frontend/.env.example` to local `.env` files if needed.
4. Do not commit local `.env` files, SQLite databases, API keys, password hashes, or generated build output.

## Pull Request Guidelines

- Keep changes focused.
- Explain what changed and why.
- Include verification commands and results.
- Add or update tests when behavior changes.
- Do not add new product features in cleanup/security PRs.

## Code Style

- Frontend: run `npm run lint` and `npm run build` from `frontend/`.
- Backend: keep configuration environment-driven and avoid hardcoded paths.
- Prefer clear, small modules as the backend evolves.
