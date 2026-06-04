# AI/ML Model Audit

Phase: 4A - AI/ML data and model reliability audit

This audit documents the current MVP model layer before any training pipeline changes. It is not a model validation report and does not claim production agronomic reliability.

## Artifact Inventory

| Artifact | Path | Status |
| --- | --- | --- |
| Crop recommendation dataset | `dataset/Crop_recommendation.csv` | Tracked in repo |
| XGBoost model artifact | `backend/xgboost_model.joblib` | Tracked in repo |
| Label encoder artifact | `backend/encoder.joblib` | Tracked in repo |
| Training script | Not present | Missing |
| Metrics report | Not present | Missing |
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

This matches the dataset column order excluding `label`, but the order is not yet enforced by a training script or metadata manifest.

## Encoder Classes

The tracked encoder contains Uzbek display labels:

`Anor`, `Apelsin`, `Banan`, `Hind moshi`, `Jut (Tolali ekin)`, `Kaptar no'xati (Mosh turi)`, `Kofe`, `Kokos`, `Loviya`, `Makkajo'xori`, `Mango`, `Mosh`, `No'xat`, `Olma`, `Papayya`, `Paxta`, `Qora mosh`, `Qovun`, `Sholi`, `Tarvuz`, `Uzum`, `Yasmiq`.

The dataset labels are English. This means the model artifact was likely trained with a translated label encoder or a transformed label column, but the repository does not currently include the script that proves that transformation.

## Current Backend Behavior

- `backend/app/ml.py` loads the model and encoder at import time.
- If artifacts are missing, the backend uses simulation predictions.
- If runtime inference fails, the backend returns simulation predictions with warning metadata.
- `/api/analyze` reports `model_status`, `inference_mode`, and `warnings`.
- Backend irrigation normalizes a small set of common English and Uzbek labels for irrigation lookup.

## Reproducibility Gaps

- No training script exists.
- No dataset download/source script exists.
- No dataset checksum manifest exists.
- No model metrics are documented.
- No train/test split seed is documented.
- No feature engineering or preprocessing script is documented.
- No proof exists that the tracked model can be regenerated from the tracked dataset.
- No artifact versioning or model registry convention exists.

## Limitations

- The model is MVP-only and should not be used as production agronomic advice.
- Dataset provenance and license are unknown.
- Label language differs between dataset labels and encoder classes.
- No calibration, confidence thresholding, feature importance, fairness review, regional validation, or agronomist validation is documented.
- Weather context comes from historical archive summaries or fallback defaults, not field-specific sensor truth.

## Recommended Next Steps

1. Confirm dataset source, license, and redistribution rights.
2. Add a reproducible training script in Phase 4B.
3. Add deterministic split logic and fixed random seed.
4. Generate model metrics and confusion matrix.
5. Save artifact metadata: feature order, label mapping, dataset checksum, dependency versions, and training timestamp.
6. Expand crop-label normalization from a small MVP map into a documented label contract.
