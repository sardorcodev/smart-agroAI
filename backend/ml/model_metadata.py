from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from .label_mapping import LABEL_MAPPING_VERSION
from .validate_dataset import FEATURE_COLUMNS


def build_artifact_metadata(
    *,
    dataset_validation: dict[str, Any],
    encoder_classes: list[str],
    metrics: dict[str, Any],
    model_params: dict[str, Any],
    output_dir: str,
) -> dict[str, Any]:
    return {
        "artifact_status": "candidate",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "model_type": "xgboost.sklearn.XGBClassifier",
        "training_entrypoint": "python -m backend.ml.train_model",
        "dataset_path": dataset_validation["path"],
        "dataset_sha256": dataset_validation["sha256"],
        "dataset_row_count": dataset_validation["row_count"],
        "feature_order": FEATURE_COLUMNS,
        "label_mapping_version": LABEL_MAPPING_VERSION,
        "encoder_classes": encoder_classes,
        "metrics_summary": {
            "accuracy": metrics["accuracy"],
            "macro_f1": metrics["macro_f1"],
            "weighted_f1": metrics["weighted_f1"],
        },
        "model_params": model_params,
        "output_dir": output_dir,
        "limitations": [
            "Candidate artifacts are not production MVP artifacts.",
            "Dataset provenance and license remain unresolved.",
            "Metrics are generated from the current dataset split and are not field validation.",
            "Do not use as production agronomic advice.",
        ],
    }
