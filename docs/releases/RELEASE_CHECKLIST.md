# Release Checklist

Use this checklist before publishing a GitHub release. Do not run tag or deploy commands until the maintainer explicitly approves them.

## Required Verification

- Confirm the working tree is clean: `git status --short --untracked-files=all`
- Review recent history: `git log --oneline -12`
- Run backend dependency checks: `.\backend\venv\Scripts\python.exe -m pip check`
- Run backend tests: `.\backend\venv\Scripts\python.exe -m pytest backend\tests`
- Run frontend lint: `npm run lint`
- Run frontend unit tests: `npm test`
- Run frontend build: `npm run build`
- Run Playwright smoke tests: `npm run test:e2e`
- Run frontend audit: `npm audit`
- Run production dependency audit: `npm audit --omit=dev`

## Repository Hygiene

- Confirm no `.env` files are tracked or staged.
- Confirm no local SQLite database files are tracked or staged.
- Confirm `dataset/Crop_recommendation.csv` is not tracked or staged.
- Confirm `frontend/dist/` is not tracked or staged.
- Confirm Playwright reports, traces, screenshots, videos, and `test-results/` are not tracked or staged.
- Confirm generated candidate ML artifacts under `backend/ml/artifacts/` are not tracked or staged.
- Confirm `node_modules/`, backend virtual environments, Python caches, and other generated cache files are not tracked or staged.
- Confirm production model artifacts have no unexpected diff.

## Documentation Review

- Update `CHANGELOG.md`.
- Update `ROADMAP.md`.
- Review `README.md`.
- Review `docs/DEPLOYMENT.md`.
- Review `docs/PUBLIC_DEMO_CHECKLIST.md`.
- Review `docs/ml/` for dataset/model limitations.
- Ensure release notes exist at `docs/releases/v0.1.0.md`.
- Ensure the release remains described as an MVP baseline, not production-ready software.

## Tag Commands

Do not run these commands until release approval is explicit:

```powershell
git tag -a v0.1.0 -m "Smart Agro AI v0.1.0"
git push origin v0.1.0
```

## Draft GitHub Release Body

Title: `Smart Agro AI v0.1.0 - Open-source MVP baseline`

Summary:

Smart Agro AI v0.1.0 is the first release-candidate style open-source MVP baseline. It includes a React/Vite frontend, FastAPI backend, MVP JWT auth, Alembic migrations, Playwright smoke tests, deployment planning docs, and ML governance documentation.

Limitations:

- Not production-ready.
- Dataset source/license is unresolved; the training CSV is download-only/user-provided.
- Model artifacts are MVP/demo-only and should not be treated as agronomic advice.
- Several product areas are static or simulated demos.

Verification:

Use the command results recorded in `docs/releases/v0.1.0.md` and the latest CI run before publishing the release.
