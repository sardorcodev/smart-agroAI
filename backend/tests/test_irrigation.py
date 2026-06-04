import pytest

from backend.app.services.irrigation import calculate_irrigation, normalize_crop_label


@pytest.mark.parametrize(
    ("label", "expected_key", "expected_humidity"),
    [
        ("Paxta", "cotton", 50),
        ("Sholi", "rice", 80),
        ("Makkajo'xori", "maize", 60),
        ("Pomidor", "tomato", 60),
    ],
)
def test_uzbek_crop_labels_map_to_irrigation_rules(label, expected_key, expected_humidity):
    result = calculate_irrigation(label, soil_moisture=30, area_m2=10, temperature=25)

    assert normalize_crop_label(label) == expected_key
    assert result["crop_key"] == expected_key
    assert result["optimal_humidity"] == expected_humidity
    assert result["fallback_used"] is False


def test_unknown_crop_uses_default_irrigation_rule():
    result = calculate_irrigation("Unknown Crop", soil_moisture=30, area_m2=10, temperature=25)

    assert result["crop_key"] == "default"
    assert result["optimal_humidity"] == 50
    assert result["fallback_used"] is True
