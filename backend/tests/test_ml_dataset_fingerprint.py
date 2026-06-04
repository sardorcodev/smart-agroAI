from pathlib import Path
import json

from backend.ml.compare_dataset_source import compare_dataset_source
from backend.ml.fingerprint_dataset import dataset_fingerprint
from backend.ml.validate_dataset import DEFAULT_DATASET_PATH


def test_dataset_fingerprint_captures_matching_fields():
    if not DEFAULT_DATASET_PATH.exists():
        report = json.loads(Path("docs/ml/artifacts/dataset_fingerprint.json").read_text(encoding="utf-8"))
        assert report["sha256"] == "54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e"
        assert report["source_matching_status"] == "unresolved"
        return

    result = dataset_fingerprint(DEFAULT_DATASET_PATH)

    assert result["sha256"] == "54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e"
    assert result["row_count"] == 2200
    assert result["class_count"] == 22
    assert len(result["first_5_row_hashes"]) == 5
    assert len(result["last_5_row_hashes"]) == 5
    assert len(result["numeric_summary_checksum"]) == 64
    assert result["source_matching_status"] == "unresolved"


def test_data_policy_defines_source_matching_and_download_only_rules():
    text = Path("docs/ml/DATA_POLICY.md").read_text(encoding="utf-8")

    assert "Source Matching Requirements" in text
    assert "License Confirmation Requirements" in text
    assert "Download-Only Workflow Requirements" in text
    assert "full-file SHA256" in text


def test_dataset_card_points_to_fingerprint_and_temporary_tracking_decision():
    text = Path("docs/ml/DATASET_CARD.md").read_text(encoding="utf-8")

    assert "docs/ml/artifacts/dataset_fingerprint.json" in text
    assert "download-only" in text
    assert "Source matching status: unresolved" in text


def test_source_match_report_records_unresolved_decision():
    report = json.loads(Path("docs/ml/artifacts/source_match_report.json").read_text(encoding="utf-8"))

    assert report["match_status"] == "not_verified"
    assert report["decision"] == "unresolved"
    assert "Figshare" in report["candidate_sources_reviewed"][0]["name"]


def test_dataset_source_comparison_exact_match_with_temp_files(tmp_path):
    local = tmp_path / "local.csv"
    candidate = tmp_path / "candidate.csv"
    content = (
        "N,P,K,temperature,humidity,ph,rainfall,label\n"
        "90,42,43,20.8,82.0,6.5,202.9,rice\n"
        "91,43,44,21.8,83.0,6.6,203.9,rice\n"
    )
    local.write_text(content, encoding="utf-8")
    candidate.write_text(content, encoding="utf-8")

    result = compare_dataset_source(
        local_path=local,
        candidate_path=candidate,
        candidate_source_name="Local test",
        candidate_url="https://example.invalid/dataset",
        candidate_license="Test license",
    )

    assert result["match_status"] == "exact_match"
    assert result["decision"] == "confirmed_source"
