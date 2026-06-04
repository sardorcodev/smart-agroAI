# Model Promotion Checklist

Use this checklist before replacing `backend/xgboost_model.joblib` or `backend/encoder.joblib`.

## Dataset And Licensing

- [ ] Dataset source is known and cited.
- [ ] Dataset license is known.
- [ ] Dataset license allows this repository's intended use.
- [ ] Dataset license allows redistribution if the dataset remains tracked.
- [x] Dataset checksum is recorded.
- [x] Dataset schema validation passes.

## Training Reproducibility

- [x] Training script is deterministic.
- [x] Fixed feature order is documented.
- [x] Label mapping version is documented.
- [x] Metrics are generated.
- [x] Candidate artifact metadata is generated.
- [x] Dependency versions are captured in metadata.
- [ ] Feature importance is documented.
- [ ] Calibration or confidence behavior is documented.

## Backend Compatibility

- [x] Model type is compatible with backend inference.
- [x] Feature count is 7.
- [x] Encoder classes are stable.
- [x] Encoder class order matches production.
- [x] Prediction shape is stable.
- [x] Backend tests pass.
- [ ] Frontend/browser smoke tests are rerun after any production artifact replacement.

## Release Control

- [ ] Candidate artifacts are manually reviewed.
- [ ] Model card is updated with reviewed results.
- [ ] Release notes state whether artifacts were promoted.
- [ ] Production artifacts are replaced only in an intentional commit.
- [ ] Rollback path is documented.

## Current Gate Result

Status: **blocked for production promotion**.

Reason: dataset source and license are unknown, so the candidate should not be promoted as a final public model release. The model remains MVP/demo-only.
