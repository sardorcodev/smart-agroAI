from datetime import date

import requests

from backend.app.services import weather


class DummyResponse:
    def __init__(self, payload):
        self.payload = payload

    def raise_for_status(self):
        return None

    def json(self):
        return self.payload


def seasonal_payload():
    return {
        "daily": {
            "time": ["2016-04-25", "2016-05-01", "2016-09-01"],
            "temperature_2m_mean": [20.0, 30.0, 40.0],
            "relative_humidity_2m_mean": [60.0, 80.0, 90.0],
            "precipitation_sum": [10.0, 20.0, 30.0],
        }
    }


def test_get_weather_success_uses_mocked_provider(monkeypatch):
    def fake_get(url, params, timeout):
        assert timeout == weather.WEATHER_TIMEOUT_SECONDS
        assert "open-meteo.com" in url
        return DummyResponse(seasonal_payload())

    monkeypatch.setattr(weather.requests, "get", fake_get)

    result = weather.get_weather(41.3, 69.2, date(2026, 4, 25), date(2026, 8, 20))

    assert result == {
        "temp": 25.0,
        "hum": 70.0,
        "rain": 3.0,
        "fallback_used": False,
        "warning": None,
        "source": weather.WEATHER_PROVIDER,
    }


def test_get_weather_timeout_returns_fallback(monkeypatch):
    def fake_get(url, params, timeout):
        raise requests.Timeout()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    result = weather.get_weather(41.3, 69.2, date(2026, 4, 25), date(2026, 8, 20))

    assert result["fallback_used"] is True
    assert result["source"] == "fallback"
    assert result["warning"] == "Weather lookup timed out"


def test_get_weather_request_failure_returns_fallback(monkeypatch):
    def fake_get(url, params, timeout):
        raise requests.ConnectionError()

    monkeypatch.setattr(weather.requests, "get", fake_get)

    result = weather.get_weather(41.3, 69.2, date(2026, 4, 25), date(2026, 8, 20))

    assert result["fallback_used"] is True
    assert result["warning"] == "Weather provider request failed"


def test_get_weather_malformed_provider_response_returns_fallback(monkeypatch):
    monkeypatch.setattr(weather.requests, "get", lambda url, params, timeout: DummyResponse({"daily": {"time": []}}))

    result = weather.get_weather(41.3, 69.2, date(2026, 4, 25), date(2026, 8, 20))

    assert result["fallback_used"] is True
    assert result["warning"] == "Weather provider response missed required daily fields"
