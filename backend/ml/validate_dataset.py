from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import pandas as pd

from .label_mapping import validate_label_mapping


FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
LABEL_COLUMN = "label"
REQUIRED_COLUMNS = FEATURE_COLUMNS + [LABEL_COLUMN]
DEFAULT_DATASET_PATH = Path(__file__).resolve().parents[2] / "dataset" / "Crop_recommendation.csv"
REPO_ROOT = Path(__file__).resolve().parents[2]


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file_obj:
        for chunk in iter(lambda: file_obj.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def report_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(REPO_ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def load_dataset(path: Path) -> pd.DataFrame:
    return pd.read_csv(path)


def validate_dataset(path: Path = DEFAULT_DATASET_PATH) -> dict[str, Any]:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")

    df = load_dataset(path)
    errors: list[str] = []

    missing_columns = [column for column in REQUIRED_COLUMNS if column not in df.columns]
    if missing_columns:
        errors.append(f"Missing required columns: {', '.join(missing_columns)}")

    if errors:
        return {
            "valid": False,
            "errors": errors,
            "path": report_path(path),
            "sha256": file_sha256(path),
        }

    if df[REQUIRED_COLUMNS].isna().any().any():
        errors.append("Dataset contains missing values")

    numeric_ranges: dict[str, dict[str, float]] = {}
    for column in FEATURE_COLUMNS:
        values = pd.to_numeric(df[column], errors="coerce")
        if values.isna().any():
            errors.append(f"Column is not fully numeric: {column}")
            continue
        numeric_ranges[column] = {
            "min": round(float(values.min()), 6),
            "max": round(float(values.max()), 6),
            "mean": round(float(values.mean()), 6),
        }

    if "ph" in numeric_ranges and (numeric_ranges["ph"]["min"] < 0 or numeric_ranges["ph"]["max"] > 14):
        errors.append("Column ph contains values outside the expected 0-14 range")

    labels = df[LABEL_COLUMN].astype(str).str.strip()
    if (labels == "").any():
        errors.append("Dataset contains empty labels")

    label_counts = labels.str.lower().value_counts().sort_index().to_dict()
    mapping_check = validate_label_mapping(set(label_counts))
    if not mapping_check["valid"]:
        errors.append("Dataset labels are not fully covered by the label mapping")

    return {
        "valid": not errors,
        "errors": errors,
        "path": report_path(path),
        "sha256": file_sha256(path),
        "row_count": int(len(df)),
        "columns": list(df.columns),
        "required_columns": REQUIRED_COLUMNS,
        "feature_columns": FEATURE_COLUMNS,
        "label_column": LABEL_COLUMN,
        "label_count": len(label_counts),
        "label_counts": {label: int(count) for label, count in label_counts.items()},
        "numeric_ranges": numeric_ranges,
        "missing_values": {column: int(df[column].isna().sum()) for column in REQUIRED_COLUMNS},
        "label_mapping": mapping_check,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate the Smart Agro AI crop recommendation dataset.")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET_PATH)
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON.")
    args = parser.parse_args()

    result = validate_dataset(args.dataset)
    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        status = "valid" if result["valid"] else "invalid"
        print(f"Dataset validation: {status}")
        print(f"Path: {result['path']}")
        print(f"SHA256: {result['sha256']}")
        print(f"Rows: {result.get('row_count', 'unknown')}")
        if result["errors"]:
            print("Errors:")
            for error in result["errors"]:
                print(f"- {error}")

    if not result["valid"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
