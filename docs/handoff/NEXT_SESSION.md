# Smart Agro AI - Next Session Handoff

## 1. Project Identity

Project name: **Smart Agro AI**

Goal: build a professional open-source AI agriculture MVP suitable for public GitHub presentation, public demo usage, and a future OpenAI Codex for OSS application.

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
- Phase 3A: frontend JWT session restore and protected view polish.
- Phase 3B: frontend API/error-state polish.
- Phase 3C: frontend component stability and accessibility pass.

## 3. Current Technical State

- Backend is modular under `backend/app/`.
- Backend has JWT MVP authentication and `GET /api/me`.
- Frontend restores sessions from a stored MVP token using `/api/me`.
- Frontend has shared `Notice`, `DemoBadge`, and `LoadingState` helpers.
- Core `alert()`, `dangerouslySetInnerHTML`, and broken `../public` references were removed from `frontend/src`.
- GitHub Actions CI, issue templates, PR template, OSS docs, and tests exist.
- Local DB files and `.env` files must not be committed.

## 4. Latest Verified Commands

Latest known passing checks:

- `npm run lint`
- `npm test`
- `npm run build`
- `python -m pip check`
- `python -m pytest backend/tests`

Known verification details:

- Frontend tests: 11 tests passing after Phase 3C.
- Backend tests: 33 tests passing after Phase 2C/3A.
- Vite build has an existing large chunk warning.
- `frontend/dist` may exist after build but should not be committed.
- `backend/smartagro.db` and `backend/smartagro_local.db` should remain absent/untracked.

## 5. Current Known Risks

- No refresh tokens.
- No OAuth.
- No email verification.
- No password reset.
- No MFA.
- No production rate limiting.
- `localStorage` token storage is MVP-only.
- No Alembic migrations yet.
- Dataset/model reproducibility still needs work.
- Bundle size remains large.
- UI is still app-state based, not route-based.
- Several product areas remain demo/static by design.

## 6. Next Planned Phase

Next phase: **Phase 3D - Browser-Based QA and Playwright Smoke Test Baseline**

Goal: add Playwright browser smoke tests for landing, auth, session restore, stale token, analyze flow, mobile navigation, and basic accessibility/keyboard checks using mocked backend API responses.

Important instruction: do not start Phase 3D automatically. A new Codex session should first inspect the repo, read this file, run `git status`, and summarize readiness.

## 7. Tomorrow Startup Checklist

Run:

```powershell
cd D:\1_PROJECTS\smart-agro
git status --short --untracked-files=all
git log --oneline -8
npm --prefix frontend run lint
npm --prefix frontend test
npm --prefix frontend run build
.\backend\venv\Scripts\python.exe -m pip check
.\backend\venv\Scripts\python.exe -m pytest backend\tests
```

If environment paths differ, adapt commands safely.

## 8. Prompt for Next Codex Session

Read `docs/handoff/NEXT_SESSION.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`, and `docs/SECURITY_NOTES.md`.

Then run `git status --short --untracked-files=all` and `git log --oneline -8`.

Do not implement anything yet.

Summarize:

- current repo state
- completed phases
- whether working tree is clean
- whether Phase 3D can safely start
- any unexpected risks

Wait for confirmation before implementing Phase 3D.
