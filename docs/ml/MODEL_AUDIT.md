# AI/ML Model Audit

Phase: 4A audit, updated through Phase 4D dataset provenance resolution

This audit documents the current MVP model layer before any training pipeline changes. It is not a model validation report and does not claim production agronomic reliability.

## Artifact Inventory

| Artifact | Path | Status |
| --- | --- | --- |
| Crop recommendation dataset | `dataset/Crop_recommendation.csv` | Tracked in repo |
| XGBoost model artifact | `backend/xgboost_model.joblib` | Tracked in repo |
| Label encoder artifact | `backend/encoder.joblib` | Tracked in repo |
| Training script | `backend/ml/train_model.py` | Candidate workflow added in Phase 4B |
| Metrics report | `docs/ml/metrics/latest_metrics.json` | Baseline metrics generated in Phase 4B |
| Comparison report | `docs/ml/artifacts/latest_comparison.json` | Production-vs-candidate review generated in Phase 4C |
| Data policy | `docs/ml/DATA_POLICY.md` | Dataset governance policy added in Phase 4D |
| Dataset fingerprint | `docs/ml/artifacts/dataset_fingerprint.json` | Local source-matching fingerprint added in Phase 4E |
| Source match report | `docs/ml/artifacts/source_match_report.json` | Source verification status recorded in Phase 4F |
| Model card | `docs/ml/MODEL_CARD.md` | Documentation-only baseline |
| Dataset card | `docs/ml/DATASET_CARD.md` | Documentation-only baseline |

## Loading Status

The current artifacts load successfully with the backend environment:

- Model type: `xgboost.sklearn.XGBClassifier`
- Encoder type: `sklearn.preprocessing._label.LabelEncoder`
- Model file size: 1,677,050 bytes
- Encoder file size: 701 bytes
- Expected feature count: 7
- Prediction output: top 3 crop recommendations with percentage-like probabilities

## Feature Order

The backend currently sends features in this order:

1. `N`
2. `P`
3. `K`
4. `temperature`
5. `humidity`
6. `ph`
7. `rainfall`

This matches the dataset column order excluding `label` and is now enforced by `backend/ml/validate_dataset.py` and `backend/ml/train_model.py`.

## Encoder Classes

The tracked encoder contains Uzbek display labels:

`Anor`, `Apelsin`, `Banan`, `Hind moshi`, `Jut (Tolali ekin)`, `Kaptar no'xati (Mosh turi)`, `Kofe`, `Kokos`, `Loviya`, `Makkajo'xori`, `Mango`, `Mosh`, `No'xat`, `Olma`, `Papayya`, `Paxta`, `Qora mosh`, `Qovun`, `Sholi`, `Tarvuz`, `Uzum`, `Yasmiq`.

The dataset labels are English. Phase 4B adds an explicit English-to-Uzbek label mapping contract in `backend/ml/label_mapping.py` and `docs/ml/LABEL_MAPPING.md`.

## Current Backend Behavior

- `backend/app/ml.py` loads the model and encoder at import time.
- If artifacts are missing, the backend uses simulation predictions.
- If runtime inference fails, the backend returns simulation predictions with warning metadata.
- `/api/analyze` reports `model_status`, `inference_mode`, and `warnings`.
- Backend irrigation normalizes a small set of common English and Uzbek labels for irrigation lookup.

## Reproducibility Gaps

- No dataset download/source script exists.
- No proof exists that the tracked model can be regenerated from the tracked dataset.
- Candidate metrics, metadata, and production-vs-candidate comparison exist, but production artifacts have not been replaced.
- No artifact versioning or model registry convention exists beyond the current candidate metadata.

## Limitations

- The model is MVP-only and should not be used as production agronomic advice.
- Dataset provenance and license are unknown; Phase 4D found no repository-local source/license evidence.
- Phase 4E added fingerprinting, but no confirmed external source/license match exists.
- Phase 4F moved the CSV to download-only/user-provided handling.
- Label language differs between dataset labels and encoder classes.
- No calibration, confidence thresholding, feature importance, fairness review, regional validation, or agronomist validation is documented.
- Weather context comes from historical archive summaries or fallback defaults, not field-specific sensor truth.

## Recommended Next Steps

1. Confirm dataset source, license, and redistribution rights.
2. If source/license cannot be confirmed, move to download-only workflow or replace the dataset before final release claims.
3. Resolve dataset license/provenance before any public model promotion.
4. Add feature importance and calibration review.
5. Keep production artifacts unchanged until promotion blockers are cleared.
