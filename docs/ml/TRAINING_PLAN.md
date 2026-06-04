# Phase 4B Training Reproducibility Plan

Phase 4B should add a reproducible training workflow without changing product behavior prematurely.

## Goals

1. Confirm dataset provenance and license.
2. Add a deterministic training script.
3. Document feature order and label mapping.
4. Produce metrics and a model card update.
5. Version model artifacts intentionally.

## Proposed Files

| Path | Purpose |
| --- | --- |
| `backend/scripts/train_model.py` | Reproducible local training entry point |
| `docs/ml/metrics/` | Generated metrics reports, if committed intentionally |
| `docs/ml/label_mapping.md` | Dataset-to-display label contract |
| `backend/model_metadata.json` | Artifact metadata such as feature order, classes, dataset checksum, and training config |

## Dataset Tasks

- Confirm original dataset source.
- Confirm license and redistribution rights.
- Add source citation or replace the dataset.
- Record dataset checksum.
- Decide whether dataset remains tracked or moves to a documented download workflow.

## Training Strategy

- Use explicit feature list: `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall`.
- Use deterministic train/test split with fixed random seed.
- Keep labels in one canonical internal language.
- Save display-label mapping separately from model training labels.
- Save model and encoder only after metrics are generated.

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

## Release Gate Before Replacing Artifacts

Do not replace `backend/xgboost_model.joblib` or `backend/encoder.joblib` until:

- dataset license/provenance is resolved,
- metrics are generated and reviewed,
- backend tests pass,
- frontend smoke tests pass against the unchanged API contract,
- model card and dataset card are updated.
