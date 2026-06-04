from datetime import date
import logging

import requests


logger = logging.getLogger("smartagro")
OPEN_METEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
WEATHER_TIMEOUT_SECONDS = 5
WEATHER_PROVIDER = "open-meteo-archive"


class WeatherServiceError(RuntimeError):
    """Raised when provider data cannot support the MVP weather summary."""


def default_weather(reason: str) -> dict:
    logger.warning("Using fallback weather data: %s", reason)
    return {
        "temp": 28.0,
        "hum": 45.0,
        "rain": 5.0,
        "fallback_used": True,
        "warning": reason,
        "source": "fallback",
    }


def _daily_values(response_payload: dict) -> dict:
    daily = response_payload.get("daily")
    if not isinstance(daily, dict):
        raise WeatherServiceError("Weather provider response did not include daily data")

    required_keys = (
        "time",
        "temperature_2m_mean",
        "relative_humidity_2m_mean",
        "precipitation_sum",
    )
    missing = [key for key in required_keys if key not in daily]
    if missing:
        raise WeatherServiceError("Weather provider response missed required daily fields")

    row_count = len(daily["time"])
    if any(len(daily[key]) != row_count for key in required_keys):
        raise WeatherServiceError("Weather provider response daily fields had mismatched lengths")

    return daily


def get_weather(lat: float, lon: float, user_start_date: date, user_end_date: date):
    try:
        start_dt = user_start_date
        end_dt = user_end_date

        target_years = 10
        base_start_year = start_dt.year - target_years
        base_end_year = end_dt.year - 1

        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": f"{base_start_year}-01-01",
            "end_date": f"{base_end_year}-12-31",
            "daily": "temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum",
            "timezone": "auto",
        }
        response = requests.get(OPEN_METEO_ARCHIVE_URL, params=params, timeout=WEATHER_TIMEOUT_SECONDS)
        response.raise_for_status()
        daily = _daily_values(response.json())

        start_md = start_dt.strftime("%m-%d")
        end_md = end_dt.strftime("%m-%d")
        temps, hums, rains = [], [], []

        for index, date_str in enumerate(daily["time"]):
            md = date_str[5:]
            in_season = (start_md <= md <= end_md) if start_md <= end_md else (md >= start_md or md <= end_md)
            if in_season:
                if daily["temperature_2m_mean"][index] is not None:
                    temps.append(daily["temperature_2m_mean"][index])
                if daily["relative_humidity_2m_mean"][index] is not None:
                    hums.append(daily["relative_humidity_2m_mean"][index])
                if daily["precipitation_sum"][index] is not None:
                    rains.append(daily["precipitation_sum"][index])

        if not temps or not hums:
            raise WeatherServiceError("Weather provider did not return usable seasonal data")

        return {
            "temp": round(sum(temps) / len(temps), 1),
            "hum": round(sum(hums) / len(hums), 1),
            "rain": round(sum(rains) / target_years, 1),
            "fallback_used": False,
            "warning": None,
            "source": WEATHER_PROVIDER,
        }
    except requests.Timeout:
        return default_weather("Weather lookup timed out")
    except requests.RequestException:
        return default_weather("Weather provider request failed")
    except WeatherServiceError as exc:
        return default_weather(str(exc))
    except Exception as exc:
        logger.exception("Unexpected weather lookup failure")
        return default_weather(f"Weather lookup failed: {type(exc).__name__}")
