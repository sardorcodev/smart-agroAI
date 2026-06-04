from pathlib import Path

import pytest

from backend.ml.compare_artifacts import CANDIDATE_DIR, compare_artifacts
from backend.ml.model_metadata import build_artifact_metadata, dependency_versions
from backend.ml.validate_dataset import FEATURE_COLUMNS


def test_dependency_versions_are_captured():
    versions = dependency_versions()

    for package in ["xgboost", "scikit-learn", "joblib", "numpy", "pandas"]:
        assert package in versions
        assert versions[package] != "not-installed"


def test_artifact_metadata_includes_dependency_versions():
    metadata = build_artifact_metadata(
        dataset_validation={
            "path": "dataset/Crop_recommendation.csv",
            "sha256": "a" * 64,
            "row_count": 2,
        },
        encoder_classes=["Paxta", "Sholi"],
        metrics={"accuracy": 0.9, "macro_f1": 0.8, "weighted_f1": 0.85},
        model_params={"n_estimators": 2},
        output_dir="tmp-artifacts",
        artifact_checksums={"xgboost_model.joblib": "b" * 64},
    )

    assert metadata["python_version"]
    assert metadata["dependency_versions"]["xgboost"] != "not-installed"
    assert metadata["feature_order"] == FEATURE_COLUMNS
    assert metadata["artifact_checksums"]["xgboost_model.joblib"] == "b" * 64


def test_release_gate_docs_exist():
    assert Path("docs/ml/MODEL_PROMOTION_CHECKLIST.md").exists()
    assert Path("docs/ml/MODEL_RELEASE_NOTES.md").exists()


def test_candidate_artifacts_are_backend_compatible_when_available():
    if not (CANDIDATE_DIR / "xgboost_model.joblib").exists():
        pytest.skip("Local candidate artifacts are not present")

    result = compare_artifacts(candidate_dir=CANDIDATE_DIR)

    assert result["promotion_decision"] == "not_promoted"
    assert result["compatibility"]["backend_inference_compatible"] is True
    assert result["compatibility"]["encoder_class_order_match"] is True
    assert result["candidate"]["prediction_shape"] == [3, 22]
