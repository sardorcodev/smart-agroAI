from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .fingerprint_dataset import dataset_fingerprint


def compact_fingerprint(fingerprint: dict[str, Any]) -> dict[str, Any]:
    return {
        "path": fingerprint["path"],
        "sha256": fingerprint["sha256"],
        "row_count": fingerprint["row_count"],
        "columns": fingerprint["columns"],
        "class_count": fingerprint["class_count"],
        "class_names": fingerprint["class_names"],
        "rows_per_class": fingerprint["rows_per_class"],
        "first_5_row_hashes": fingerprint["first_5_row_hashes"],
        "last_5_row_hashes": fingerprint["last_5_row_hashes"],
        "numeric_summary_checksum": fingerprint["numeric_summary_checksum"],
    }


def match_status(local: dict[str, Any], candidate: dict[str, Any]) -> str:
    exact_fields = [
        "sha256",
        "row_count",
        "columns",
        "class_count",
        "class_names",
        "rows_per_class",
        "first_5_row_hashes",
        "last_5_row_hashes",
        "numeric_summary_checksum",
    ]
    if all(local[field] == candidate[field] for field in exact_fields):
        return "exact_match"

    structural_fields = ["row_count", "columns", "class_count", "class_names", "rows_per_class"]
    if all(local[field] == candidate[field] for field in structural_fields):
        return "structural_match_only"

    return "mismatch"


def decision_for(match: str, candidate_license: str | None) -> str:
    if match == "exact_match" and candidate_license:
        return "confirmed_source"
    if match == "mismatch":
        return "incompatible"
    return "unresolved"


def compare_dataset_source(
    *,
    local_path: Path,
    candidate_path: Path | None,
    candidate_source_name: str | None = None,
    candidate_url: str | None = None,
    candidate_license: str | None = None,
) -> dict[str, Any]:
    local = compact_fingerprint(dataset_fingerprint(local_path))

    if candidate_path is None:
        return {
            "local_dataset": local,
            "candidate_source_name": candidate_source_name,
            "candidate_url": candidate_url,
            "candidate_license": candidate_license,
            "candidate_dataset": None,
            "match_status": "not_verified",
            "decision": "unresolved",
            "notes": [
                "No candidate CSV was provided for fingerprint comparison.",
                "External source/license claims are not accepted without a local file match.",
            ],
        }

    candidate = compact_fingerprint(dataset_fingerprint(candidate_path))
    status = match_status(local, candidate)
    decision = decision_for(status, candidate_license)

    return {
        "local_dataset": local,
        "candidate_source_name": candidate_source_name,
        "candidate_url": candidate_url,
        "candidate_license": candidate_license,
        "candidate_dataset": candidate,
        "match_status": status,
        "decision": decision,
        "notes": [
            "Exact source confirmation requires matching fingerprints and explicit dataset license evidence.",
            "A structural match alone is not enough to claim source or redistribution rights.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare a local dataset against a candidate source CSV.")
    parser.add_argument("--local", type=Path, required=True)
    parser.add_argument("--candidate", type=Path)
    parser.add_argument("--candidate-source-name")
    parser.add_argument("--candidate-url")
    parser.add_argument("--candidate-license")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    result = compare_dataset_source(
        local_path=args.local,
        candidate_path=args.candidate,
        candidate_source_name=args.candidate_source_name,
        candidate_url=args.candidate_url,
        candidate_license=args.candidate_license,
    )
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
