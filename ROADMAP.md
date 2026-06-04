# Roadmap

Smart Agro AI is moving from a hackathon-style MVP toward a safer open-source agriculture platform.

## Completed

- Phase 0: Security and runtime cleanup.
- Phase 1: OSS polish and CI baseline.
- Phase 2A: Backend validation and API contract hardening.
- Phase 2B: Backend modularization.
- Phase 2C: JWT-based MVP authentication.
- Phase 2D: Database migrations and seed strategy.
- Phase 2E: Backend service hardening for weather fallback, analyze contract stability, model fallback metadata, and crop-label normalization.
- Phase 3A: Frontend JWT session restore and protected view polish.
- Phase 3B: Frontend API/error-state polish.
- Phase 3C: Frontend component stability and accessibility pass.
- Phase 3D: Playwright browser smoke test baseline.
- Phase 3E: Frontend dependency audit, bundle splitting, and chart stability.
- Phase 3F: Frontend production demo copy and presentation QA.
- Phase 4A: AI/ML data and model reliability audit.

## Next

### Phase 4B: Training Reproducibility

- Confirm dataset source/license or replace the dataset.
- Add a deterministic training script, metrics, dataset checksum, and model metadata.
- Continue aligning model artifact labels with backend/frontend display labels before replacing artifacts.

## Future Phases

### Phase 5: Deployment and Public Demo

- Add Docker and deployment docs.
- Publish a safe demo with seed data only.

### Phase 6: Codex for OSS Application Package

- Ensure clean public repo state, passing CI, clear roadmap, and contributor-ready issues.
