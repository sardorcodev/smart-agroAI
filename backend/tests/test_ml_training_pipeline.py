from pathlib import Path

import pytest

from backend.ml.label_mapping import DATASET_TO_DISPLAY_LABEL, map_dataset_label, validate_label_mapping
from backend.ml.train_model import train_candidate_model
from backend.ml.validate_dataset import DEFAULT_DATASET_PATH, FEATURE_COLUMNS, validate_dataset


def write_dataset(path: Path, labels: list[str]) -> None:
    rows = ["N,P,K,temperature,humidity,ph,rainfall,label"]
    for index, label in enumerate(labels):
        rows.append(f"{20 + index},30,40,25.0,70.0,6.5,100.0,{label}")
        rows.append(f"{21 + index},31,41,26.0,71.0,6.6,101.0,{label}")
    path.write_text("\n".join(rows), encoding="utf-8")


def test_current_dataset_validation_succeeds():
    result = validate_dataset(DEFAULT_DATASET_PATH)

    assert result["valid"] is True
    assert result["row_count"] == 2200
    assert result["label_count"] == 22
    assert result["feature_columns"] == FEATURE_COLUMNS
    assert len(result["sha256"]) == 64


def test_dataset_validation_fails_for_missing_required_column(tmp_path):
    dataset_path = tmp_path / "missing_ph.csv"
    dataset_path.write_text(
        "N,P,K,temperature,humidity,rainfall,label\n"
        "90,42,43,20.8,82.0,202.9,rice\n",
        encoding="utf-8",
    )

    result = validate_dataset(dataset_path)

    assert result["valid"] is False
    assert any("Missing required columns: ph" in error for error in result["errors"])


def test_label_mapping_covers_current_dataset_labels():
    validation = validate_dataset(DEFAULT_DATASET_PATH)
    mapping_check = validate_label_mapping(set(validation["label_counts"]))

    assert mapping_check["valid"] is True
    assert mapping_check["missing_dataset_labels"] == []
    assert mapping_check["duplicate_display_labels"] == []
    assert mapping_check["mapped_label_count"] == 22


@pytest.mark.parametrize(
    ("dataset_label", "display_label"),
    [
        ("cotton", "Paxta"),
        ("rice", "Sholi"),
        ("maize", "Makkajo'xori"),
        ("pomegranate", "Anor"),
    ],
)
def test_label_mapping_returns_expected_display_labels(dataset_label, display_label):
    assert map_dataset_label(dataset_label) == display_label


def test_label_mapping_rejects_unknown_label():
    with pytest.raises(KeyError):
        map_dataset_label("unknown-crop")


def test_training_pipeline_writes_candidate_outputs_for_synthetic_dataset(tmp_path):
    dataset_path = tmp_path / "synthetic_crop.csv"
    output_dir = tmp_path / "candidate"
    synthetic_labels = list(DATASET_TO_DISPLAY_LABEL)[:3]
    write_dataset(dataset_path, synthetic_labels)

    result = train_candidate_model(
        dataset_path=dataset_path,
        output_dir=output_dir,
        test_size=0.5,
        model_params={
            "n_estimators": 2,
            "max_depth": 1,
            "learning_rate": 0.1,
            "objective": "multi:softprob",
            "eval_metric": "mlogloss",
            "random_state": 42,
            "n_jobs": 1,
        },
    )

    assert (output_dir / "xgboost_model.joblib").exists()
    assert (output_dir / "encoder.joblib").exists()
    assert (output_dir / "metrics.json").exists()
    assert (output_dir / "metadata.json").exists()
    assert result["metadata"]["dataset_sha256"] == result["metrics"]["dataset_sha256"]
    assert result["metadata"]["feature_order"] == FEATURE_COLUMNS
    assert result["metadata"]["artifact_status"] == "candidate"
