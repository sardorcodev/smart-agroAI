# Changelog

All notable changes to Smart Agro AI will be documented here.

## Unreleased

### Modernization Baseline

- Completed Phase 0 security/runtime cleanup, environment examples, and local artifact hygiene.
- Added Phase 1 OSS polish with CI, issue templates, PR template, and maintainer docs.
- Hardened backend validation and API response contracts in Phase 2A.
- Modularized the FastAPI backend under `backend/app/` in Phase 2B.
- Added JWT-based MVP registration, login, and `/api/me` session lookup in Phase 2C.
- Added frontend JWT session restore, protected-view guards, and stale-token handling in Phase 3A.
- Improved frontend API error states, inline notices, and demo/static action messaging in Phase 3B.
- Added shared accessible UI helpers and component stability/accessibility polish in Phase 3C.
- Added Playwright browser smoke tests with mocked backend responses in Phase 3D.
- Removed an unused vulnerable router dependency, cleaned the frontend audit, split heavy frontend chunks, and stabilized chart rendering in Phase 3E.
- Polished public/demo copy and clarified MVP/demo labels across visible frontend flows in Phase 3F.
- Added Alembic migration support, an initial users-table migration, and a safe idempotent local demo seed workflow in Phase 2D.
- Hardened backend weather fallback handling, `/api/analyze` response schemas, model fallback metadata, and crop-label normalization in Phase 2E.
- Added the Phase 4A AI/ML reliability audit with dataset card, model card, artifact inventory, label consistency findings, and a Phase 4B training reproducibility plan.
- Added the Phase 4B reproducible candidate training workflow, dataset validation, label mapping contract, metrics baseline, and candidate artifact metadata without replacing production artifacts.
- Added the Phase 4C model release gate with production-vs-candidate comparison, dependency/version metadata, promotion checklist, release notes, and a documented non-promotion decision.
- Added the Phase 4D dataset provenance decision and data policy, documenting that no repository-local source/license evidence was found and dataset/model promotion remains blocked.
- Added the Phase 4E dataset fingerprint and source-matching policy, keeping the dataset temporarily tracked with warnings while recommending download-only or replacement before final release claims.
- Added the Phase 4F source verification workflow and moved the unresolved crop dataset to download-only/user-provided handling while preserving backend runtime artifacts.
- Added Phase 5A deployment readiness documentation, environment matrix, runtime command guidance, and public demo checklist without deploying or adding secrets.
- Added Phase 5B release-candidate verification docs, v0.1.0 release notes, GitHub issue/topic planning, and Codex for OSS application draft material without tagging or deploying.

## 0.1.0

- Initial MVP with React frontend, FastAPI backend, SQLite user storage, and XGBoost crop recommendation artifact.
