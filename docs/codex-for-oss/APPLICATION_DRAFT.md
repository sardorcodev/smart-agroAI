# Codex for OSS Application Draft

## Repository URL

`https://github.com/<username>/smart-agroAI`

Replace with the final public repository URL before submitting.

## GitHub Username

`<github-username>`

## Maintainer Role

Project maintainer and primary developer.

## Why This Repository Qualifies

Smart Agro AI is an open-source agriculture AI MVP with React, FastAPI, CI, Playwright smoke tests, Alembic migrations, and ML/data governance docs. It is structured for contributors and documents current MVP limits honestly.

Character count: 230

## How API Credits Would Be Used

Credits would support responsible OSS development: backend/API hardening, frontend QA automation, accessibility improvements, deployment docs, ML governance, and future demo planning without adding proprietary lock-in or hidden services.

Character count: 224

## Additional Notes

The repository is prepared as an MVP baseline, not a production service. Dataset source/license limitations are documented, the training CSV is download-only/user-provided, and model outputs are not presented as production agronomic advice.

## Current Project Status

- Open-source MVP baseline prepared for v0.1.0 release.
- React/Vite frontend and FastAPI backend are implemented.
- MVP JWT auth, Alembic migrations, seed workflow, and browser smoke tests are in place.
- ML audit, model card, dataset card, training reproducibility baseline, and model promotion gate are documented.
- Deployment planning exists, but no production deployment is included.

## Known Limitations

- Not production-ready.
- MVP auth uses `localStorage` token storage and lacks refresh tokens, MFA, password reset, and production rate limiting.
- Dataset source/license remains unresolved.
- Model artifacts are MVP/demo-only and not agronomic advice.
- Several product areas remain static/demo-only.
- Public hosted demo is planned but not yet executed.

## Supporting Links

- `README.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `docs/ml/`
- `docs/DEPLOYMENT.md`
- `docs/PUBLIC_DEMO_CHECKLIST.md`
- `docs/releases/v0.1.0.md`
- `docs/github/ISSUES_AND_LABELS_PLAN.md`
- `docs/github/REPOSITORY_PRESENTATION.md`
