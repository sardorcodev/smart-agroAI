from pathlib import Path

from backend.ml.fingerprint_dataset import dataset_fingerprint
from backend.ml.validate_dataset import DEFAULT_DATASET_PATH


def test_dataset_fingerprint_captures_matching_fields():
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
    assert "temporarily tracked with explicit unresolved-license warnings" in text
    assert "Source matching status: unresolved" in text
