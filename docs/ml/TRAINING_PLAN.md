# Phase 4B Training Reproducibility Plan

Phase 4B added a reproducible candidate training workflow without changing production inference behavior.

## Goals

1. Confirm dataset provenance and license.
2. Add a deterministic training script.
3. Document feature order and label mapping.
4. Produce metrics and a model card update.
5. Version model artifacts intentionally.

## Proposed Files

| Path | Purpose |
| --- | --- |
| `backend/ml/train_model.py` | Reproducible local training entry point |
| `backend/ml/validate_dataset.py` | Dataset schema/checksum validation |
| `backend/ml/label_mapping.py` | English dataset label to Uzbek display-label mapping |
| `docs/ml/LABEL_MAPPING.md` | Human-readable dataset-to-display label contract |
| `docs/ml/metrics/latest_metrics.json` | Latest committed metrics baseline |
| `docs/ml/artifacts/latest_artifact_metadata.json` | Latest committed candidate artifact metadata |
| `docs/ml/artifacts/latest_comparison.json` | Latest committed production-vs-candidate comparison |

## Dataset Tasks

- Confirm original dataset source.
- Confirm license and redistribution rights.
- Add source citation or replace the dataset.
- Record dataset checksum. Current SHA256: `54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e`.
- Decide whether dataset remains tracked or moves to a documented download workflow.

## Training Strategy

- Use explicit feature list: `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall`.
- Use deterministic train/test split with fixed random seed.
- Keep labels in one canonical internal language.
- Save display-label mapping separately from model training labels.
- Save model and encoder only after metrics are generated.
- Write candidate artifacts to `backend/ml/artifacts/`, which is ignored by Git.

## Metrics To Report

- Accuracy
- Macro F1
- Per-class precision, recall, and F1
- Confusion matrix
- Top-3 accuracy if supported
- Feature importance

## Reproducibility Requirements

- Fixed random seed.
- Dependency versions recorded.
- Dataset checksum recorded.
- Feature order recorded.
- Label mapping recorded.
- Training command documented.
- Generated artifact paths documented.

## Commands

Validate the dataset:

```powershell
.\backend\venv\Scripts\python.exe -m backend.ml.validate_dataset --json
```

Train candidate artifacts without replacing production artifacts:

```powershell
.\backend\venv\Scripts\python.exe -m backend.ml.train_model --output-dir backend\ml\artifacts\phase4b-candidate
```

## Release Gate Before Replacing Artifacts

Phase 4C added `docs/ml/MODEL_PROMOTION_CHECKLIST.md` and `docs/ml/MODEL_RELEASE_NOTES.md`. The current gate result is **not promoted** because dataset source/license is unresolved.

Do not replace `backend/xgboost_model.joblib` or `backend/encoder.joblib` until:

- dataset license/provenance is resolved,
- metrics are generated and reviewed,
- backend tests pass,
- frontend smoke tests pass against the unchanged API contract,
- model card and dataset card are updated.
