# Model Release Notes

Phase: 4C - Model review and artifact release gate

## Current Production Artifacts

- Model: `backend/xgboost_model.joblib`
- Encoder: `backend/encoder.joblib`
- Status: retained as current MVP production artifacts
- Promotion action: no replacement performed

## Candidate Artifacts

- Local candidate directory: `backend/ml/artifacts/phase4b-candidate`
- Git status: ignored generated artifacts
- Metadata: `docs/ml/artifacts/latest_artifact_metadata.json`
- Metrics: `docs/ml/metrics/latest_metrics.json`
- Comparison report: `docs/ml/artifacts/latest_comparison.json`

## Metrics Summary

Latest candidate baseline:

- Accuracy: `0.995455`
- Macro F1: `0.995443`
- Weighted F1: `0.995443`

These are reproducibility metrics from the current dataset split. They are not field validation and must not be presented as production agronomic reliability.

## Compatibility Summary

The Phase 4C comparison found that candidate artifacts are compatible with the current backend inference shape:

- XGBoost model type matches.
- Expected feature count is 7.
- Encoder class count is 22.
- Encoder class order matches production.
- Prediction output shape is stable for fixed sample inputs.

Prediction probabilities and top crops can differ between production and candidate artifacts and require human review before promotion.

## Promotion Decision

Decision: **not promoted**.

The candidate artifacts were not copied to `backend/xgboost_model.joblib` or `backend/encoder.joblib`.

## Promotion Blockers

- Dataset provenance is unknown.
- Dataset license is unknown; open redistribution rights must not be assumed.
- Phase 4D found no repository-local dataset source/license evidence.
- Phase 4E added a dataset fingerprint and source-matching policy, but no confirmed source/license match was documented.
- Phase 4F moved the dataset to download-only/user-provided handling.
- Candidate metrics are reproducibility metrics, not field validation.
- Feature importance and calibration are not yet documented.

## Recommendation

Keep the current MVP production artifacts in place. Resolve dataset source/license status before any public model release or artifact replacement. If source/license cannot be confirmed, replace the dataset or switch to a documented download-only workflow before promotion.

The dataset is now handled as download-only/user-provided. The repository must not claim dataset redistribution rights until evidence is added.

## Rollback Path

If artifacts are promoted in a future phase, keep the promotion in a dedicated commit and use Git history to revert both production artifact files together. Do not promote model and encoder independently.
