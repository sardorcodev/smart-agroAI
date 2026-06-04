from pathlib import Path


def test_dataset_card_documents_unresolved_license_and_provenance():
    text = Path("docs/ml/DATASET_CARD.md").read_text(encoding="utf-8")

    assert "Dataset provenance: unknown" in text
    assert "Dataset license: unknown" in text
    assert "Redistribution status: unresolved" in text
    assert "Project `LICENSE`" in text


def test_data_policy_exists_and_blocks_license_assumptions():
    text = Path("docs/ml/DATA_POLICY.md").read_text(encoding="utf-8")

    assert "Do not assume" in text
    assert "source and license" in text
    assert "Public model release status: blocked" in text
    assert "download-only/user-provided" in text


def test_promotion_checklist_keeps_dataset_license_required():
    text = Path("docs/ml/MODEL_PROMOTION_CHECKLIST.md").read_text(encoding="utf-8")

    assert "- [ ] Dataset source is known and cited." in text
    assert "- [ ] Dataset license is known." in text
    assert "blocked for production promotion" in text


def test_dataset_readme_documents_download_only_path():
    text = Path("dataset/README.md").read_text(encoding="utf-8")

    assert "Crop_recommendation.csv" in text
    assert "intentionally not tracked" in text
    assert "Source And License Responsibility" in text
