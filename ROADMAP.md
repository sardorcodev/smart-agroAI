# Roadmap

Smart Agro AI is moving from a hackathon-style MVP toward a safer open-source agriculture platform.

## Phase 0: Security and Runtime Cleanup

- Remove hardcoded secrets and unsafe references.
- Stop committing local databases.
- Stabilize backend model and database paths.
- Add environment-based configuration.
- Fix frontend API configuration and unsafe rendering.
- Add minimum OSS files and truthful README documentation.

## Phase 1: OSS Polish

- Add CI, issue templates, and pull request template.
- Add clear architecture and API documentation.
- Add test instructions and maintainer workflow.

## Phase 2: Backend Stabilization

- Split the FastAPI app into focused modules.
- Add validation, auth hardening, migrations, and tests.
- Add health/readiness endpoints.

## Phase 3: Frontend Stabilization

- Add mobile navigation and stronger error states.
- Centralize API/error handling.
- Add component and integration tests.

## Phase 4: AI/ML Reliability

- Add training scripts, model metrics, dataset provenance, and model card.
- Align crop label mappings across backend, frontend, and model artifacts.

## Phase 5: Deployment and Demo

- Add Docker and deployment docs.
- Publish a safe demo with seed data only.

## Phase 6: Codex for OSS Readiness

- Ensure clean public repo state, passing CI, clear roadmap, and contributor-ready issues.
