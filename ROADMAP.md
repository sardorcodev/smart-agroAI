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
- Phase 4B: Training reproducibility and model metrics baseline.
- Phase 4C: Model review and artifact release gate.
- Phase 4D: Dataset provenance resolution and data policy.
- Phase 4E: Dataset source matching and public handling decision.

## Next

### Phase 4F: Dataset Download Workflow Or Replacement

- Confirm a redistributable source or replace the dataset.
- Decide whether the current dataset should be removed from the public repo.
- Add a documented download-only workflow if redistribution rights remain unresolved.
- Keep model artifacts MVP/demo-only until source and license status are resolved.

## Future Phases

### Phase 5: Deployment and Public Demo

- Add Docker and deployment docs.
- Publish a safe demo with seed data only.

### Phase 6: Codex for OSS Application Package

- Ensure clean public repo state, passing CI, clear roadmap, and contributor-ready issues.
