# Full Repository Audit: Smart Agro AI

Audit date: 2026-06-03  
Repository root: repository root

## Executive Summary

Smart Agro AI is currently a promising hackathon/MVP-style demo, not yet a serious public open-source platform. The repository contains a working React + Vite frontend, a single-file FastAPI backend, a trained XGBoost model artifact, a SQLite database, and a crop recommendation dataset. The core crop analysis flow can work when the backend is started from the `backend/` directory, and the frontend production build succeeds.

The project is not ready for public GitHub presentation, production demo deployment, or an OpenAI Codex for OSS application without cleanup. The main blockers are security exposure, incomplete documentation, missing open-source governance files, no tests, fragile runtime paths, a committed SQLite database with user records, incomplete README setup sections, and several features that are documented as AI/platform capabilities but are actually static or mocked UI.

Scores:

| Area | Score |
| --- | ---: |
| Current project status | 41 / 100 |
| Open-source readiness | 16 / 100 |
| Codex for OSS readiness | 21 / 100 |

## Critical Risks

1. A Gemini API key is present in source comments at `backend/main.py:21`. Even commented secrets must be treated as compromised and revoked before public release.
2. `backend/smartagro.db` is tracked and contains a `users` table with 3 user records, including 1 admin and 2 farmer users. Passwords are hashed, but account data and password hashes should not be committed.
3. The backend uses wildcard CORS with credentials enabled at `backend/main.py:52`, which is unsafe for deployment.
4. Authentication is not production-grade: login returns user data but no signed token/session; frontend state alone controls logged-in UI; backend admin authorization is absent.
5. Admin role assignment is based only on registering the exact email `admin@smartagro.uz`.
6. The frontend renders chat messages with `dangerouslySetInnerHTML` in `frontend/src/components/VirtualAgronom.jsx:119`, so user input can become an XSS vector.
7. Backend model and database paths are relative to the process working directory. Importing/running from the repo root fails model loading and creates/uses a root-level SQLite database instead of `backend/smartagro.db`.
8. The README claims Gemini, setup docs, API docs, license, project structure, and other sections that are missing or not implemented.
9. There are no tests, and `npm run lint` currently fails.
10. `npm audit --omit=dev` reports 3 production dependency vulnerabilities, including high-severity Axios advisories.

## Repository Structure

Current top-level structure:

```text
smart-agro/
  .git/
  .gitignore
  README.md
  backend/
    main.py
    req.txt
    smartagro.db
    xgboost_model.joblib
    encoder.joblib
    venv/                  # local environment, ignored
    __pycache__/           # generated, ignored
  dataset/
    Crop_recommendation.csv
  frontend/
    package.json
    package-lock.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
    eslint.config.js
    index.html
    public/
      1.png ... 8.png
      nature-bg.jpg
      sardor.jpg
      dildora.jpg
      icons.svg
    src/
      App.jsx
      main.jsx
      index.css
      components/
      utils/constants.js
```

Areas identified:

| Area | Location | Current state |
| --- | --- | --- |
| Frontend | `frontend/` | React + Vite + Tailwind single page app with manual state navigation. |
| Backend | `backend/main.py` | FastAPI app in one file with auth, weather lookup, ML analysis, DB model, and schemas. |
| AI/ML | `backend/xgboost_model.joblib`, `backend/encoder.joblib`, `dataset/Crop_recommendation.csv` | Model artifacts exist; dataset exists locally but is untracked; no training script or model card. |
| Database | `backend/smartagro.db` | SQLite database committed with user data. |
| Config | `.gitignore`, `frontend/*.config.js`, `backend/req.txt` | Basic configs only; no `.env.example`, Docker, CI, or typed backend config. |
| Documentation | `README.md` | Incomplete and partly inaccurate; no standalone license/governance docs. |

Missing or misplaced files:

| Missing/misplaced item | Impact |
| --- | --- |
| `LICENSE` | README badge claims MIT, but no license file exists. |
| `.env.example` | Contributors do not know required API URLs, DB paths, CORS origins, or secret names. |
| `backend/requirements.txt` or `pyproject.toml` | Dependency file is named `req.txt`, which is nonstandard. |
| Backend package structure | No `app/`, routers, services, schemas, config, migrations, or tests. |
| Training/reproducibility scripts | Model cannot be recreated from source. |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `ROADMAP.md` | Not ready as a serious OSS project. |
| `.github/workflows/` | No CI. |
| `.github/ISSUE_TEMPLATE/` and PR template | No maintainer workflow. |
| `Dockerfile` and `docker-compose.yml` | No repeatable deployment/local stack. |
| `frontend/public/muhammad.jpg` | Referenced by `LandingPage.jsx` but absent. |
| Correct Vite public asset paths | `LandingPage.jsx` uses `../public/...`; Vite public assets should be referenced from `/...`. |
| Dataset tracking decision | `dataset/` is currently untracked; either commit intentionally or ignore/document download. |
| `taqdimot/SmartAgroAI.pdf` | Tracked file is deleted in the current working tree. |

## README Accuracy Audit

The README is written in Uzbek and positions the project as an AI agriculture platform. It currently stops at the architecture diagram and does not include the setup, API, structure, business model, future roadmap, team, or license sections promised in the table of contents.

README issues:

- Table of contents points to sections that do not exist: setup, API/module description, project structure, business model, future improvements, team, license.
- The architecture code block is not closed.
- The README claims a license badge for MIT, but there is no `LICENSE` file.
- The README claims Gemini API usage, but the Gemini backend endpoint is commented out and the frontend virtual agronom is a local mock simulator.
- The README claims modular architecture and scalable backend structure, but backend is one monolithic file.
- The README claims setup instructions, but there are no install/run commands.
- The README claims top-3 crop recommendation and confidence output; this is partially implemented in `/api/analyze`.
- The README claims SQLite database; this is true, but currently only user records are stored.
- The README claims React Leaflet and Recharts; both are actually used.
- The README claims SQLAlchemy; it is used only for `UserDB`.
- The README claims Google Gemini API; packages exist in `backend/req.txt`, but runtime use is not implemented.

Contributor setup readiness: insufficient. A new contributor would not know:

- Node and Python versions.
- Whether to run backend from root or `backend/`.
- How to install backend dependencies.
- How to configure API URLs.
- Whether a Gemini key is required.
- Whether the dataset is required.
- How to run tests.
- How to create/reset the database.
- How to reproduce the model.

## Implemented vs Claimed Features

| Feature | README/app claim | Actual status | Notes |
| --- | --- | --- | --- |
| Landing page | Public project presentation | Implemented | Looks substantial, but uses some broken/missing image paths. |
| Login/register | Platform authentication | Partially implemented | Backend stores users and hashes passwords; no JWT/session; frontend only stores local state. |
| Admin panel | Ministry/system admin dashboard | Mostly static demo | Frontend-only access check; backend has no protected admin API. |
| Crop recommendation | XGBoost model recommends crop | Partially implemented | Model exists and `/api/analyze` works from `backend/`; path bug causes fallback if run from root. |
| Top-3 confidence | Returns top-3 crops and probabilities | Implemented but weak | Uses `predict_proba`; no calibration, validation, or model metrics. |
| Weather archive | 10-year historical weather analysis | Partially implemented | Uses Open-Meteo archive API; no cache, retry strategy, validation, or clear failure reporting. |
| Smart irrigation | Moisture-based pump/water decision | Partially implemented | Formula demo exists; no IoT integration, no persistence, no hardware API. |
| Live sensors | Real IoT/sensor monitoring | Mocked/manual | Sliders simulate temperature/moisture; no sensor ingestion. |
| Farm GPS map | Real GPS display | Partially implemented | Browser geolocation and Google Maps iframe; no manual fallback. |
| Store/distributor map | Nearby store routing | Partially implemented | Hardcoded store list with Leaflet/OSM and Google directions link. No nearest-store algorithm/API. |
| Virtual Agronom | Gemini AI agronom assistant | Not implemented as claimed | Frontend uses hardcoded mock responses; backend Gemini endpoint is commented. |
| Agro Market | Marketplace and purchases | Static demo | Hardcoded product list and local cart; no checkout/order/backend. |
| Support tickets | Support center | Static demo | Form does not submit to backend. |
| History | Irrigation history | Static demo | No backend table or saved events. |
| Profile | User profile and subscription | Mostly static | Displays login data plus hardcoded stats/subscription. |
| Official PDF report | Exportable analysis report | Partially implemented | Client PDF generation works conceptually; document number is random per render and report is not persisted. |
| Database | SQLite MVP | Partially implemented | Only users table; committed DB contains user data. |
| PostgreSQL future | Future database | Documented only | No migration path or config. |
| Open-source MIT project | MIT badge | Not implemented | No license file or OSS process docs. |

## Frontend Audit

Framework and tooling:

- React 19.2.x, Vite 8, Tailwind CSS, Recharts, React Leaflet, Lucide icons.
- `react-router-dom` is installed but not used.
- Navigation is controlled manually in `App.jsx` using `currentPage` and `currentMenu`, not route-based URLs.
- API calls use Axios directly inside components/state handlers.
- Production build succeeds.
- Lint fails.

Routing and state:

- `App.jsx` is the central state owner for page/menu state, user data, farm form data, monitoring data, loading state, geolocation state, analysis result, and PDF export state.
- There is no URL state. Users cannot deep link to dashboard, market, agronom, or map.
- There is no persisted auth/session state. Refreshing loses login state.

API usage:

- API base URL is hardcoded to `http://127.0.0.1:8000` in `App.jsx` and `Auth.jsx`.
- No `.env`-driven `VITE_API_BASE_URL`.
- Error handling often uses `alert()` instead of durable UI state.
- Analyze requires successful browser geolocation; there is no manual coordinate fallback.

Component organization:

- Components are all flat under `frontend/src/components/`.
- Many components combine view, mock data, and local business logic.
- Static demo data lives inside components instead of data modules or backend APIs.
- `frontend/src/assets/` exists but is empty.

Broken or weak UX:

- Sidebar is `hidden md:flex`; there is no mobile navigation replacement. On mobile, logged-in users may lose access to menu navigation.
- Header action buttons can crowd on small screens.
- Geolocation failure blocks analysis instead of allowing manual region/coordinate input.
- Auth has server error state, but dashboard analyze uses alert only.
- Support form visually accepts input but does not submit.
- Market checkout button has no behavior.
- Admin/history/profile display hardcoded metrics as if real.
- Landing page references missing `muhammad.jpg`.
- Landing page references `../public/sardor.jpg` and `../public/dildora.jpg`; Vite public assets should be referenced as `/sardor.jpg` and `/dildora.jpg`.
- Several text strings render mojibake in terminal output because console decoding differs, but source bytes appear UTF-8.

Frontend correctness issues:

- `npm run lint` fails with 5 errors and 1 warning.
- `App.jsx:53` calls `getUserLocation` before declaration per React hooks lint rules.
- `App.jsx` has unused `error` variables in catch blocks.
- `OfficialReport.jsx:36` calls `Math.random()` during render.
- `VirtualAgronom.jsx:55` and `:68` use `Date.now()` in state construction and trigger React purity lint.
- `VirtualAgronom.jsx:119` uses `dangerouslySetInnerHTML` for all chat messages and does not sanitize user input.
- `AIResults.jsx:24` lowercases the recommended crop before looking up `EKIN_BAZASI`, but frontend constants use capitalized Uzbek crop names. This usually falls back to default crop humidity.
- Recharts `YAxis domain={''}` in `AIResults.jsx` is suspicious and should be replaced with a valid domain.

Mobile responsiveness assumptions:

- Landing page uses responsive Tailwind classes and should be broadly responsive.
- Dashboard layout uses responsive grid classes, but the hidden sidebar with no mobile menu is a serious mobile navigation gap.
- Market and map use responsive grids/flex, but map uses fixed `h-[600px]`, which may be awkward on small screens.
- Forms use two-column grids in places that may compress on narrow viewports.
- No browser/mobile visual QA evidence is present in the repo.

## Backend Audit

Framework and structure:

- FastAPI app in `backend/main.py`.
- SQLAlchemy used only for `UserDB`.
- Pydantic models: `RegisterReq`, `LoginReq`, `ChatRequest`, `FarmData`.
- Endpoints:
  - `POST /api/register`
  - `POST /api/login`
  - `POST /api/analyze`
  - `POST /api/chat` is commented out.
- No routers, service layer, settings module, migrations, dependency injection beyond DB session, or error schema.

Database:

- SQLite URL is `sqlite:///./smartagro.db`, relative to current working directory.
- `Base.metadata.create_all(bind=engine)` runs at import time.
- Existing database has only `users`.
- No tables for analysis records, irrigation history, products, carts, orders, support tickets, sensor readings, reports, or audit logs.
- No Alembic migrations.

Validation and error handling:

- Input types are declared but there are no bounds or semantic validators.
- Examples: pH can be outside 0-14; NPK can be negative; lat/lon can be invalid; date ranges can be invalid; area/moisture can be negative.
- Weather lookup catches all exceptions and silently returns defaults.
- `/api/analyze` catches broad exceptions and returns raw error text in `detail`.

CORS and security:

- `allow_origins=["*"]`, `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`.
- This is not production-safe.
- No trusted origins from environment.

Auth:

- Password hashing uses Passlib/bcrypt.
- Login returns raw user metadata and no token.
- No protected backend routes.
- No password strength policy.
- No email normalization.
- No rate limiting or brute-force protection.
- Admin role is assigned automatically by email match.

Production safety:

- No environment-based config.
- No structured logging.
- No health endpoint.
- No readiness checks for model/database/weather provider.
- No graceful model load failure strategy beyond simulation fallback.
- No dependency version policy.

## AI/ML Audit

Artifacts found:

- `backend/xgboost_model.joblib`: loads as `xgboost.sklearn.XGBClassifier`.
- `backend/encoder.joblib`: loads as `sklearn.preprocessing.LabelEncoder`.
- Model feature count: 7.
- Encoder class count: 22.
- Encoder classes include Uzbek crop names such as `Anor`, `Makkajo'xori`, `Paxta`, `Sholi`, `Tarvuz`, and others.
- `dataset/Crop_recommendation.csv` exists locally with columns `N,P,K,temperature,humidity,ph,rainfall,label`, but `dataset/` is untracked.

Prediction flow:

1. Frontend submits N, P, K, pH, lat/lon, date range, current soil moisture, and area.
2. Backend fetches historical weather from Open-Meteo archive.
3. Backend builds features in order: N, P, K, temperature, humidity, pH, rainfall.
4. Model returns probabilities.
5. Backend returns top-3 crops and probabilities.
6. Backend selects the highest crop for irrigation logic.

Implemented AI/ML claims:

| Claim | Actual status |
| --- | --- |
| XGBoost | Used by model artifact and backend. |
| Scikit-learn | Used through LabelEncoder and dependencies. |
| Joblib | Used to load model and encoder. |
| NumPy | Used for model input and top-3 sorting. |
| Gemini API | Not active; endpoint and config are commented. |

ML problems:

- No training script.
- No reproducible pipeline.
- No model metrics.
- No train/test split documentation.
- No model card.
- No data provenance/license.
- No dataset versioning.
- No explanation of why dataset labels are English while encoder labels are Uzbek.
- No preprocessing artifact beyond label encoder.
- No feature validation before inference.
- No confidence calibration.
- No uncertainty handling or fallback explanation.
- Model loading uses relative paths and fails from repo root.
- If model loading fails, backend silently switches to simulation mode.
- Backend irrigation crop lookup uses English keys (`rice`, `maize`, `cotton`) while model returns Uzbek crop names. Most recommendations fall back to default water rules.
- Frontend irrigation display uses capitalized Uzbek keys in constants, but `AIResults.jsx` lowercases the crop before lookup, causing another default fallback.

## Security Audit

High priority:

- Revoke the exposed Gemini key from `backend/main.py:21`.
- Remove committed SQLite database user records from git history or at least from the current tree before public release.
- Replace wildcard CORS with configured trusted origins.
- Add signed auth tokens or server-side sessions.
- Protect admin/backend routes with authorization dependencies.
- Sanitize or remove `dangerouslySetInnerHTML`.
- Stop assigning admin by public email address.
- Add `.env.example` and load secrets through environment variables.

Dependency risks:

- `npm audit --omit=dev` reports:
  - High severity: Axios advisories.
  - Moderate severity: DOMPurify advisories.
  - Moderate severity: follow-redirects advisory.
- `pip check` reports no broken Python requirements in the existing venv, but no vulnerability audit was run for Python packages.

Input risks:

- Auth endpoints lack rate limiting and password policy.
- Register/login do not normalize emails.
- Analyze inputs lack bounds validation.
- Date ranges are strings with only runtime parsing.
- Weather defaults hide provider failures and can mislead users.
- Chat XSS risk is immediate because user text is rendered as HTML.

Deployment risks:

- API URL is hardcoded to localhost.
- DB path is relative.
- Model paths are relative.
- No production settings.
- No HTTPS/session/cookie strategy.
- No secret rotation documentation.

## Testing Audit

Existing tests:

- No frontend test files detected.
- No backend test files detected.
- No ML tests detected.
- No integration tests detected.
- No CI tests.

Verification performed during audit:

| Check | Result |
| --- | --- |
| `npm run build` | Passed. |
| `npm run lint` | Failed with 5 errors and 1 warning. |
| FastAPI TestClient `/openapi.json` from `backend/` | Passed, status 200. |
| Backend model import from `backend/` | `MODELS_LOADED=True`. |
| Backend import from repo root | `MODELS_LOADED=False`; relative path bug confirmed. |
| `/api/analyze` with mocked weather | Passed, status 200. |
| `pip check` | Passed. |
| `npm audit --omit=dev` | Failed; 3 vulnerabilities. |

Minimal professional test strategy:

1. Backend unit tests with `pytest`:
   - Register success.
   - Duplicate email rejection.
   - Login success/failure.
   - Analyze schema validation.
   - Analyze with mocked weather and mocked model.
   - Model path loading from stable configured path.
2. Backend integration tests:
   - SQLite test database fixture.
   - `/api/analyze` full JSON contract.
   - Auth + protected admin endpoint after auth is implemented.
3. ML tests:
   - Model and encoder load.
   - Feature count/order test.
   - Known input smoke prediction.
   - Crop name mapping test.
   - Probability shape/top-3 contract.
4. Frontend tests:
   - Component tests for Auth, DataInput, AIResults.
   - API error state tests.
   - XSS regression test for chat rendering.
   - Mobile navigation render test.
5. End-to-end tests:
   - Register/login/analyze flow.
   - Geolocation failure fallback.
   - PDF export smoke test.
6. CI:
   - Python lint/test.
   - Frontend lint/build/test.
   - Dependency audit with policy.

## Open-Source Readiness Audit

Present:

- Root README exists.
- Git repository exists.
- Frontend/backend code is in clear top-level directories.
- Model and frontend assets are present.
- `package-lock.json` exists.

Missing:

| OSS file/process | Status |
| --- | --- |
| `LICENSE` | Missing. |
| `CONTRIBUTING.md` | Missing. |
| `CODE_OF_CONDUCT.md` | Missing. |
| `SECURITY.md` | Missing. |
| `CHANGELOG.md` | Missing. |
| `ROADMAP.md` | Missing. |
| `.github/workflows/` | Missing. |
| Issue templates | Missing. |
| Pull request template | Missing. |
| Maintainer guide | Missing. |
| Release tags | Not evident from local inspection. |
| Model/data license | Missing. |
| Dataset provenance | Missing. |
| Demo instructions | Missing. |
| Architecture docs | Missing beyond incomplete README diagram. |
| API docs beyond FastAPI generated docs | Missing. |

Open-source readiness blockers:

- README is incomplete and overclaims.
- MIT badge is unsupported without a license file.
- Committed DB contains user data.
- Exposed secret in source history/current file.
- No CI and no tests.
- No contributor workflow.
- No security disclosure policy.
- No reproducible ML story.
- Dirty working tree currently includes a deleted tracked PDF and untracked dataset.

## Deployment Readiness

Local run status:

- Frontend can build with installed dependencies.
- Backend can import and serve OpenAPI when run from `backend/`.
- Backend model loading fails when imported/run from repository root because `joblib.load('xgboost_model.joblib')` is relative.
- Backend DB location changes based on current working directory because `sqlite:///./smartagro.db` is relative.
- Frontend expects backend at `http://127.0.0.1:8000`.

Missing deployment files/config:

- `.env.example`
- Backend `.env` loading or typed settings
- Dockerfile for backend
- Dockerfile or static hosting config for frontend
- `docker-compose.yml`
- Deployment docs
- Health endpoint
- Production CORS configuration
- Production database plan
- Migrations
- Model artifact path config
- API base URL config for frontend

Recommended deployment plan:

1. Stabilize runtime paths first:
   - Use `Path(__file__).resolve().parent` for model paths.
   - Use `DATABASE_URL` from environment.
   - Use `VITE_API_BASE_URL` for frontend.
2. Containerize backend:
   - Python slim image.
   - Install `requirements.txt`.
   - Copy model artifacts.
   - Run `uvicorn app.main:app`.
3. Use PostgreSQL for real demo deployment:
   - Keep SQLite only for local development.
   - Add Alembic migrations.
4. Host frontend as static build:
   - Vercel, Netlify, Cloudflare Pages, or object storage/CDN.
5. Host backend separately:
   - Render, Fly.io, Railway, DigitalOcean App Platform, or similar.
6. Add CI before public demo:
   - Lint, tests, build, dependency audit.
7. Add demo seed data intentionally:
   - Do not commit real DBs.
   - Provide seed script or demo fixtures.

## Prioritized Action Plan

### Phase 0: Critical Fixes

- Revoke the exposed Gemini key.
- Remove the key from code and future commits; consider history cleanup before public release.
- Remove `backend/smartagro.db` from git and replace it with a seed script or empty local DB instructions.
- Fix backend model/database paths so they are independent of current working directory.
- Add `.env.example` and config loading.
- Replace wildcard CORS with explicit dev/prod origins.
- Remove or sanitize `dangerouslySetInnerHTML`.
- Fix hardcoded API base URL in frontend.
- Fix frontend lint errors.
- Add a real `LICENSE` file or remove the MIT claim.

### Phase 1: OSS Polish

- Rewrite README to match actual functionality.
- Add setup instructions for frontend and backend.
- Add API endpoint documentation.
- Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `ROADMAP.md`, and `CHANGELOG.md`.
- Add issue templates and PR template.
- Decide whether `dataset/` should be committed, downloaded, or ignored.
- Restore/remove the tracked deleted `taqdimot/SmartAgroAI.pdf` intentionally.
- Add badges only for things that exist: license, CI, tests, release.

### Phase 2: Backend Stabilization

- Split `backend/main.py` into app package modules:
  - settings
  - database
  - models
  - schemas
  - routers
  - services
  - ml
- Add request validators for NPK, pH, lat/lon, moisture, area, and dates.
- Add health/readiness endpoints.
- Add structured errors and logging.
- Add JWT/session-based auth.
- Protect admin routes.
- Add Alembic migrations.
- Add pytest test suite.
- Add Open-Meteo client timeout/retry/cache handling.

### Phase 3: Frontend Stabilization

- Replace manual page state with route-based navigation or intentionally document single-screen navigation.
- Add mobile navigation.
- Move API calls into an API client module.
- Add `.env` API base URL support.
- Replace alerts with inline error states.
- Add geolocation failure fallback.
- Fix asset paths and add missing team image or remove that card.
- Replace mock-only buttons with disabled/coming-soon states or real flows.
- Add component tests.
- Improve accessibility labels and keyboard navigation.

### Phase 4: AI/ML Reliability

- Add training script and reproducible pipeline.
- Add dataset source/license documentation.
- Add model metrics and validation report.
- Add model card.
- Align crop labels across dataset, encoder, backend irrigation constants, and frontend constants.
- Add known-input model tests.
- Add probability calibration or clear explanation that probabilities are model scores.
- Replace silent simulation fallback with explicit health/status output.
- Implement Gemini only after secrets/config/security are correct.

### Phase 5: Deployment/Demo

- Add Dockerfile and docker-compose.
- Add production deployment docs.
- Add PostgreSQL option.
- Add seed/demo data scripts.
- Add CI workflow.
- Add hosted demo environment.
- Add smoke tests for deployed frontend/backend.
- Add public demo limitations disclaimer.

### Phase 6: Codex for OSS Application Readiness

- Make the repository safe to publish: no secrets, no committed user DB, license present.
- Make setup one-command or very clear.
- Add test coverage for core flows.
- Add CI with passing checks.
- Add project roadmap and maintainer workflow.
- Add clear issue labels and starter issues.
- Document how Codex contributors can help:
  - backend modularization
  - test coverage
  - frontend accessibility/mobile
  - ML reproducibility
  - deployment hardening
- Prepare a concise public narrative: what works today, what is demo-only, and what needs community help.

## Next Codex Task Recommendation

Recommended next task:

**Phase 0 security and runtime cleanup.**

Scope:

- Revoke/remove Gemini key reference.
- Add `.env.example`.
- Fix backend model/database path handling.
- Stop committing `smartagro.db`; add a seed/init path instead.
- Add frontend `VITE_API_BASE_URL`.
- Fix `dangerouslySetInnerHTML`.
- Fix lint errors.
- Add `LICENSE`.
- Update README to truthful MVP setup/status.

This is the best next step because it converts the repository from a risky private demo into a safe public baseline. Larger backend, frontend, ML, and deployment improvements should come after the repository is safe to share.

