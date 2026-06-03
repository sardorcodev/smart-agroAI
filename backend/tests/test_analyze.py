import pytest


def valid_payload():
    return {
        "n": 90,
        "p": 42,
        "k": 43,
        "ph": 6.5,
        "lat": 41.3,
        "lon": 69.2,
        "current_soil_moisture": 30,
        "area_m2": 10,
        "start_date": "2026-04-25",
        "end_date": "2026-08-20",
    }


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("ph", 15),
        ("n", -1),
        ("p", -1),
        ("k", -1),
        ("lat", 91),
        ("lon", 181),
        ("current_soil_moisture", 101),
        ("area_m2", 0),
    ],
)
def test_analyze_rejects_invalid_numeric_inputs(client, field, value):
    payload = valid_payload()
    payload[field] = value

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 422


def test_analyze_rejects_start_date_after_end_date(client):
    payload = valid_payload()
    payload["start_date"] = "2026-08-20"
    payload["end_date"] = "2026-04-25"

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 422


def test_analyze_rejects_too_large_date_range(client):
    payload = valid_payload()
    payload["start_date"] = "2026-01-01"
    payload["end_date"] = "2027-12-31"

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 422


def test_analyze_success_response_shape(client, backend_app, monkeypatch):
    import backend.app.services.analysis as analysis_service

    monkeypatch.setattr(
        analysis_service,
        "get_weather",
        lambda lat, lon, start, end: {
            "temp": 25.0,
            "hum": 70.0,
            "rain": 100.0,
            "fallback_used": False,
            "warning": None,
        },
    )

    response = client.post("/api/analyze", json=valid_payload())

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "success"
    assert payload["recommended_crop"]
    assert payload["top_predictions"]
    assert payload["top_3_recommendations"] == payload["top_predictions"]
    assert payload["weather_summary"] == {
        "temp": 25.0,
        "hum": 70.0,
        "rain": 100.0,
        "fallback_used": False,
    }
    assert payload["weather"] == {"temp": 25.0, "hum": 70.0, "rain": 100.0}
    assert payload["model_status"] in {"loaded", "unavailable"}
    assert payload["inference_mode"] in {"model", "simulation"}
    assert isinstance(payload["warnings"], list)
    assert "pump_on" in payload["irrigation"]
    assert "water_liters" in payload["irrigation"]
    assert "message" in payload["irrigation"]


def test_analyze_reports_weather_fallback(client, backend_app, monkeypatch):
    import backend.app.services.analysis as analysis_service

    monkeypatch.setattr(
        analysis_service,
        "get_weather",
        lambda lat, lon, start, end: {
            "temp": 28.0,
            "hum": 45.0,
            "rain": 5.0,
            "fallback_used": True,
            "warning": "Weather lookup failed: Timeout",
        },
    )

    response = client.post("/api/analyze", json=valid_payload())

    assert response.status_code == 200
    payload = response.json()
    assert payload["weather_summary"]["fallback_used"] is True
    assert payload["warnings"] == ["Weather lookup failed: Timeout"]
