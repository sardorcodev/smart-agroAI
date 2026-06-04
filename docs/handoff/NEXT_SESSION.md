# Smart Agro AI - Next Session Handoff

## 1. Project Identity

Project name: **Smart Agro AI**

Goal: maintain a professional open-source AI agriculture MVP suitable for public GitHub presentation, public demo exploration, and a future OpenAI Codex for OSS application.

Current role model:

- User: product owner / final decision maker.
- ChatGPT: architect / project manager / reviewer / prompt strategist.
- Codex CLI: implementation engineer.

## 2. Completed Phases

The following phases are complete:

- Phase 0: security/runtime cleanup.
- Phase 1: OSS polish and CI baseline.
- Phase 2A: backend validation and API contract hardening.
- Phase 2B: backend modularization.
- Phase 2C: JWT-based MVP authentication.
- Phase 2D: database migrations and seed strategy.
- Phase 2E: backend service hardening.
- Phase 3A: frontend JWT session restore and protected view polish.
- Phase 3B: frontend API/error-state polish.
- Phase 3C: frontend component stability and accessibility pass.
- Phase 3D: Playwright browser smoke test baseline.
- Phase 3E: frontend audit, bundle, and chart stability.
- Phase 3F: frontend production demo copy and presentation QA.
- Phase 3G: final repository readiness pass.
- Phase 4A: AI/ML data and model reliability audit.
- Phase 4B: training reproducibility and model metrics baseline.
- Phase 4C: model review and artifact release gate.
- Phase 4D: dataset provenance resolution and data policy.

## 3. Current Technical State

- Backend is modular under `backend/app/`.
- Backend has JWT MVP authentication and `GET /api/me`.
- Backend has Alembic migration support with an initial users-table migration.
- Backend has an optional safe local demo seed script under `backend/scripts/seed_demo.py`.
- Backend `/api/analyze` now reports explicit weather fallback, model fallback, and inference-mode metadata.
- Backend normalizes common English and Uzbek crop labels for irrigation lookup while preserving display labels.
- ML audit docs now live under `docs/ml/`.
- The tracked dataset has 2,200 rows and 22 English labels; the tracked encoder has 22 Uzbek display labels.
- Dataset validation, label mapping, candidate training, metrics, and candidate artifact metadata now exist under `backend/ml/` and `docs/ml/`.
- Candidate training writes generated model files to ignored `backend/ml/artifacts/`; production artifacts are not automatically replaced.
- Phase 4C comparison found the candidate backend-compatible but did not promote it.
- Candidate metadata captures Python/package versions and artifact checksums.
- Phase 4D found no repository-local source/license evidence for `dataset/Crop_recommendation.csv`.
- Dataset provenance/license remains unresolved and must not be assumed open for redistribution.
- The dataset remains temporarily tracked with explicit warnings; model promotion stays blocked.
- Frontend restores sessions from a stored MVP token using `/api/me`.
- Frontend uses shared `Notice`, `DemoBadge`, and `LoadingState` helpers.
- Frontend browser smoke tests live under `frontend/e2e/` and mock backend API responses.
- Heavy frontend sections and PDF export helpers are split into async chunks.
- Public/demo copy now labels static or mocked flows as MVP/demo.
- GitHub Actions CI, issue templates, PR template, OSS docs, unit tests, backend tests, and Playwright smoke tests exist.
- Local DB files, build output, Playwright artifacts, and `.env` files must not be committed.

## 4. Latest Known Passing Checks

Latest known passing checks after Phase 4D:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e`
- `npm audit`
- `npm audit --omit=dev`
- `.\backend\venv\Scripts\python.exe -m pip check`
- `.\backend\venv\Scripts\python.exe -m pytest backend\tests`
- `.\backend\venv\Scripts\python.exe -m alembic -c backend\alembic.ini upgrade head` against an ignored SQLite smoke DB.
- `.\backend\venv\Scripts\python.exe -m backend.scripts.seed_demo` against an ignored migrated SQLite smoke DB.
- `.\backend\venv\Scripts\python.exe -m backend.ml.validate_dataset --json`
- `.\backend\venv\Scripts\python.exe -m backend.ml.train_model --output-dir backend\ml\artifacts\phase4b-candidate`
- `.\backend\venv\Scripts\python.exe -m backend.ml.compare_artifacts --candidate-dir backend\ml\artifacts\phase4b-candidate --output docs\ml\artifacts\latest_comparison.json`

Known verification details:

- Frontend unit tests: 11 passing.
- Playwright smoke tests: 9 passing with mocked backend responses.
- Backend tests: 65 passing when run with the local backend venv.
- Vite build no longer emits the previous large chunk warning.
- `frontend/dist`, `frontend/test-results`, and `backend/smartagro_local.db` may exist locally but are ignored and must not be committed.

## 5. Current Known Risks

- No refresh tokens.
- No OAuth.
- No email verification.
- No password reset.
- No MFA.
- No production rate limiting.
- `localStorage` token storage is MVP-only.
- Dataset/model reproducibility still needs work.
- Dataset source/license is unknown and should not be assumed open for redistribution until confirmed.
- The project MIT license must not be assumed to grant rights for upstream dataset redistribution.
- Candidate artifacts are reproducibly generated, but the tracked production MVP artifacts have not been replaced.
- Candidate metrics are not field validation and must not be presented as production agronomic accuracy.
- Feature importance, calibration, and external validation are not yet documented.
- UI is still app-state based, not route-based.
- Several product areas remain demo/static by design.
- Historical audit notes may describe earlier repository state and should be treated as historical context.

## 6. Next Planned Phase

Next phase: **Phase 4E - Dataset Replacement Or Download Workflow**

Goal: confirm a redistributable dataset source, replace the dataset, or move to a documented download-only workflow if rights remain unresolved.

Important instruction: do not start Phase 4E automatically. A new session should first inspect the repo, read this file, run git status/log, and summarize readiness.

## 7. Recommended Startup Checklist

Run:

```powershell
cd D:\1_PROJECTS\smart-agro
git status --short --untracked-files=all
git log --oneline -12
npm --prefix frontend run lint
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run test:e2e
npm --prefix frontend audit
npm --prefix frontend audit --omit=dev
.\backend\venv\Scripts\python.exe -m pip check
.\backend\venv\Scripts\python.exe -m pytest backend\tests
$env:DATABASE_URL='sqlite:///backend/smartagro_migration_smoke.db'; .\backend\venv\Scripts\python.exe -m alembic -c backend\alembic.ini upgrade head
.\backend\venv\Scripts\python.exe -m backend.ml.validate_dataset --json
.\backend\venv\Scripts\python.exe -m backend.ml.train_model --output-dir backend\ml\artifacts\phase4b-candidate
.\backend\venv\Scripts\python.exe -m backend.ml.compare_artifacts --candidate-dir backend\ml\artifacts\phase4b-candidate --output docs\ml\artifacts\latest_comparison.json
```

If environment paths differ, adapt commands safely.

## 8. Prompt for Next Codex Session

Read `docs/handoff/NEXT_SESSION.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`, `docs/SECURITY_NOTES.md`, and `docs/ml/`.

Then run `git status --short --untracked-files=all` and `git log --oneline -12`.

Do not implement anything yet.

Summarize:

- current repo state
- completed phases
- whether the working tree is clean
- whether Phase 4E can safely start
- any unexpected risks

Wait for confirmation before implementing Phase 4E.
