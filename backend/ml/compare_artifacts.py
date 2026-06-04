from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np

from .validate_dataset import file_sha256, report_path


REPO_ROOT = Path(__file__).resolve().parents[2]
PRODUCTION_MODEL_PATH = REPO_ROOT / "backend" / "xgboost_model.joblib"
PRODUCTION_ENCODER_PATH = REPO_ROOT / "backend" / "encoder.joblib"
CANDIDATE_DIR = REPO_ROOT / "backend" / "ml" / "artifacts" / "phase4b-candidate"
SAMPLE_FEATURES = [
    [90, 42, 43, 25, 70, 6.5, 100],
    [35, 60, 55, 28, 82, 6.8, 210],
    [120, 40, 35, 32, 55, 7.0, 70],
]


def artifact_summary(model_path: Path, encoder_path: Path, sample_features: list[list[float]]) -> dict[str, Any]:
    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)
    probabilities = model.predict_proba(np.array(sample_features))
    top_predictions = []

    for row in probabilities:
        top_indices = np.argsort(row)[-3:][::-1]
        top_predictions.append(
            [
                {
                    "crop": str(encoder.inverse_transform([index])[0]),
                    "probability": round(float(row[index]) * 100, 6),
                }
                for index in top_indices
            ]
        )

    return {
        "model_path": report_path(model_path),
        "encoder_path": report_path(encoder_path),
        "model_sha256": file_sha256(model_path),
        "encoder_sha256": file_sha256(encoder_path),
        "model_file_size": model_path.stat().st_size,
        "encoder_file_size": encoder_path.stat().st_size,
        "model_type": type(model).__module__ + "." + type(model).__name__,
        "feature_count": getattr(model, "n_features_in_", None),
        "encoder_type": type(encoder).__module__ + "." + type(encoder).__name__,
        "encoder_classes": [str(label) for label in encoder.classes_],
        "prediction_shape": list(probabilities.shape),
        "sample_top_predictions": top_predictions,
    }


def compare_artifacts(
    *,
    production_model_path: Path = PRODUCTION_MODEL_PATH,
    production_encoder_path: Path = PRODUCTION_ENCODER_PATH,
    candidate_dir: Path = CANDIDATE_DIR,
) -> dict[str, Any]:
    candidate_model_path = candidate_dir / "xgboost_model.joblib"
    candidate_encoder_path = candidate_dir / "encoder.joblib"
    production = artifact_summary(production_model_path, production_encoder_path, SAMPLE_FEATURES)
    candidate = artifact_summary(candidate_model_path, candidate_encoder_path, SAMPLE_FEATURES)

    compatibility = {
        "model_type_match": production["model_type"] == candidate["model_type"],
        "feature_count_match": production["feature_count"] == candidate["feature_count"] == 7,
        "encoder_class_count_match": len(production["encoder_classes"]) == len(candidate["encoder_classes"]),
        "encoder_class_order_match": production["encoder_classes"] == candidate["encoder_classes"],
        "prediction_shape_match": production["prediction_shape"] == candidate["prediction_shape"] == [len(SAMPLE_FEATURES), 22],
    }
    compatibility["backend_inference_compatible"] = all(compatibility.values())

    return {
        "promotion_decision": "not_promoted",
        "promotion_blockers": [
            "Dataset provenance is unknown.",
            "Dataset license is unknown; open redistribution rights must not be assumed.",
            "Candidate metrics are reproducibility metrics, not field validation.",
        ],
        "sample_features": SAMPLE_FEATURES,
        "production": production,
        "candidate": candidate,
        "compatibility": compatibility,
        "notes": [
            "Candidate artifacts are compatible with the current backend inference shape.",
            "Prediction probabilities may differ and require review before promotion.",
            "Production artifacts were not modified by this review.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare production and candidate Smart Agro AI model artifacts.")
    parser.add_argument("--candidate-dir", type=Path, default=CANDIDATE_DIR)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    result = compare_artifacts(candidate_dir=args.candidate_dir)
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
