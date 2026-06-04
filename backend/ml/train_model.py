from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

from .label_mapping import LABEL_MAPPING_VERSION, map_dataset_label
from .model_metadata import build_artifact_metadata
from .validate_dataset import DEFAULT_DATASET_PATH, FEATURE_COLUMNS, validate_dataset


RANDOM_SEED = 42
DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parent / "artifacts"
DEFAULT_TEST_SIZE = 0.2
DEFAULT_MODEL_PARAMS = {
    "n_estimators": 120,
    "max_depth": 4,
    "learning_rate": 0.08,
    "subsample": 0.9,
    "colsample_bytree": 0.9,
    "objective": "multi:softprob",
    "eval_metric": "mlogloss",
    "random_state": RANDOM_SEED,
    "n_jobs": 1,
}


def prepare_training_frame(dataset_path: Path) -> tuple[pd.DataFrame, pd.Series, dict[str, Any]]:
    validation = validate_dataset(dataset_path)
    if not validation["valid"]:
        raise ValueError(f"Dataset validation failed: {validation['errors']}")

    df = pd.read_csv(dataset_path)
    features = df[FEATURE_COLUMNS].astype(float)
    display_labels = df["label"].map(map_dataset_label)
    return features, display_labels, validation


def metrics_payload(
    *,
    y_true: list[str],
    y_pred: list[str],
    labels: list[str],
    dataset_validation: dict[str, Any],
    model_params: dict[str, Any],
    test_size: float,
) -> dict[str, Any]:
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 6),
        "macro_f1": round(float(f1_score(y_true, y_pred, average="macro")), 6),
        "weighted_f1": round(float(f1_score(y_true, y_pred, average="weighted")), 6),
        "classification_report": classification_report(y_true, y_pred, labels=labels, output_dict=True, zero_division=0),
        "confusion_matrix": confusion_matrix(y_true, y_pred, labels=labels).tolist(),
        "labels": labels,
        "feature_order": FEATURE_COLUMNS,
        "dataset_sha256": dataset_validation["sha256"],
        "dataset_row_count": dataset_validation["row_count"],
        "train_test_split": {
            "test_size": test_size,
            "random_seed": RANDOM_SEED,
            "stratified": True,
        },
        "label_mapping_version": LABEL_MAPPING_VERSION,
        "model_params": model_params,
        "limitations": [
            "Metrics are a reproducibility baseline, not production agronomic validation.",
            "Dataset provenance and license remain unresolved.",
        ],
    }


def train_candidate_model(
    *,
    dataset_path: Path = DEFAULT_DATASET_PATH,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    test_size: float = DEFAULT_TEST_SIZE,
    model_params: dict[str, Any] | None = None,
) -> dict[str, Any]:
    model_params = dict(DEFAULT_MODEL_PARAMS if model_params is None else model_params)
    features, display_labels, dataset_validation = prepare_training_frame(dataset_path)

    encoder = LabelEncoder()
    encoded_labels = encoder.fit_transform(display_labels)
    labels = [str(label) for label in encoder.classes_]

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        encoded_labels,
        test_size=test_size,
        random_state=RANDOM_SEED,
        stratify=encoded_labels,
    )

    model = XGBClassifier(**model_params)
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)

    y_true_display = encoder.inverse_transform(y_test).tolist()
    y_pred_display = encoder.inverse_transform(predictions).tolist()
    metrics = metrics_payload(
        y_true=y_true_display,
        y_pred=y_pred_display,
        labels=labels,
        dataset_validation=dataset_validation,
        model_params=model_params,
        test_size=test_size,
    )
    metadata = build_artifact_metadata(
        dataset_validation=dataset_validation,
        encoder_classes=labels,
        metrics=metrics,
        model_params=model_params,
        output_dir=output_dir.as_posix(),
    )

    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output_dir / "xgboost_model.joblib")
    joblib.dump(encoder, output_dir / "encoder.joblib")
    (output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2, sort_keys=True), encoding="utf-8")
    (output_dir / "metadata.json").write_text(json.dumps(metadata, indent=2, sort_keys=True), encoding="utf-8")

    return {
        "metrics": metrics,
        "metadata": metadata,
        "output_dir": output_dir.as_posix(),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Train candidate Smart Agro AI crop recommendation artifacts.")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET_PATH)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()

    if args.validate_only:
        result = validate_dataset(args.dataset)
        print(json.dumps(result, indent=2, sort_keys=True))
        if not result["valid"]:
            raise SystemExit(1)
        return

    result = train_candidate_model(dataset_path=args.dataset, output_dir=args.output_dir)
    print(json.dumps({"output_dir": result["output_dir"], "metrics": result["metrics"]}, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
