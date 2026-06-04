from __future__ import annotations

from datetime import datetime, timezone
from importlib import metadata
import platform
import sys
from typing import Any

from .label_mapping import LABEL_MAPPING_VERSION
from .validate_dataset import FEATURE_COLUMNS


def dependency_versions() -> dict[str, str]:
    packages = ["xgboost", "scikit-learn", "joblib", "numpy", "pandas"]
    versions = {}
    for package in packages:
        try:
            versions[package] = metadata.version(package)
        except metadata.PackageNotFoundError:
            versions[package] = "not-installed"
    return versions


def build_artifact_metadata(
    *,
    dataset_validation: dict[str, Any],
    encoder_classes: list[str],
    metrics: dict[str, Any],
    model_params: dict[str, Any],
    output_dir: str,
    artifact_checksums: dict[str, str] | None = None,
) -> dict[str, Any]:
    return {
        "artifact_status": "candidate",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "model_type": "xgboost.sklearn.XGBClassifier",
        "training_entrypoint": "python -m backend.ml.train_model",
        "training_context": "phase-4b-candidate-training",
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "dependency_versions": dependency_versions(),
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
        "artifact_checksums": artifact_checksums or {},
        "limitations": [
            "Candidate artifacts are not production MVP artifacts.",
            "Dataset provenance and license remain unresolved.",
            "Metrics are generated from the current dataset split and are not field validation.",
            "Do not use as production agronomic advice.",
        ],
    }
