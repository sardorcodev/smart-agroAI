# GitHub Issues, Labels, and Milestones Plan

## Recommended Labels

- `good first issue`
- `help wanted`
- `backend`
- `frontend`
- `ml`
- `docs`
- `security`
- `deployment`
- `testing`
- `accessibility`
- `data-governance`
- `MVP`
- `enhancement`
- `bug`

## Recommended Milestone

Milestone: `v0.2.0 Public Demo`

Goal: prepare a safe hosted MVP demo with clear limitations, no real secrets, no unverified dataset redistribution claims, and passing smoke checks.

## Suggested Issues

1. Deploy the frontend static demo to a free/static hosting provider.
2. Deploy the backend demo API to a low-cost hosted FastAPI provider.
3. Configure a hosted PostgreSQL demo database and document migration steps.
4. Add hosted demo smoke checks for `/health`, `/ready`, auth, and analyze flow.
5. Resolve `Crop_recommendation.csv` source and license status.
6. Improve the download-only dataset workflow with maintainer-provided verification steps.
7. Add model feature importance documentation.
8. Add model calibration and external validation notes.
9. Design a production-grade refresh token strategy.
10. Add backend rate limiting for auth and analysis endpoints.
11. Improve admin backend authorization beyond frontend-only role display.
12. Run and document a full accessibility audit.
13. Add visual regression smoke checks for landing, dashboard, and mobile navigation.
14. Add a short public demo video or GIF for the README.
15. Create contributor-friendly starter tasks for docs, tests, and UI copy.
