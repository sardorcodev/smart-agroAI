from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import pandas as pd

from .validate_dataset import DEFAULT_DATASET_PATH, FEATURE_COLUMNS, file_sha256, report_path, validate_dataset


def row_fingerprint(row: pd.Series) -> str:
    normalized = ",".join(str(row[column]).strip() for column in FEATURE_COLUMNS + ["label"])
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def numeric_summary_checksum(numeric_ranges: dict[str, dict[str, float]]) -> str:
    payload = json.dumps(numeric_ranges, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def dataset_fingerprint(path: Path = DEFAULT_DATASET_PATH) -> dict[str, Any]:
    validation = validate_dataset(path)
    if not validation["valid"]:
        raise ValueError(f"Dataset validation failed: {validation['errors']}")

    df = pd.read_csv(path)
    first_rows = df.head(5)
    last_rows = df.tail(5)

    return {
        "path": report_path(path),
        "sha256": file_sha256(path),
        "row_count": validation["row_count"],
        "columns": validation["columns"],
        "class_count": validation["label_count"],
        "class_names": sorted(validation["label_counts"]),
        "rows_per_class": validation["label_counts"],
        "first_5_row_hashes": [row_fingerprint(row) for _, row in first_rows.iterrows()],
        "last_5_row_hashes": [row_fingerprint(row) for _, row in last_rows.iterrows()],
        "numeric_summary_checksum": numeric_summary_checksum(validation["numeric_ranges"]),
        "numeric_ranges": validation["numeric_ranges"],
        "source_matching_status": "unresolved",
        "notes": [
            "This fingerprint is generated only from the local CSV.",
            "It can be used to compare against user-provided or externally documented dataset fingerprints.",
            "It does not establish source, license, or redistribution rights.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a deterministic fingerprint for the local crop dataset.")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET_PATH)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    result = dataset_fingerprint(args.dataset)
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
