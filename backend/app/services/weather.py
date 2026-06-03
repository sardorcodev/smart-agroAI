from datetime import date
import logging

import requests


logger = logging.getLogger("smartagro")


def default_weather(reason: str) -> dict:
    logger.warning("Using fallback weather data: %s", reason)
    return {
        "temp": 28.0,
        "hum": 45.0,
        "rain": 5.0,
        "fallback_used": True,
        "warning": reason,
    }


def get_weather(lat: float, lon: float, user_start_date: date, user_end_date: date):
    try:
        start_dt = user_start_date
        end_dt = user_end_date

        target_years = 10
        base_start_year = start_dt.year - target_years
        base_end_year = end_dt.year - 1

        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": f"{base_start_year}-01-01",
            "end_date": f"{base_end_year}-12-31",
            "daily": "temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum",
            "timezone": "auto",
        }
        resp = requests.get(url, params=params, timeout=5).json()

        if "daily" not in resp:
            return default_weather("Weather provider response did not include daily data")

        start_md = start_dt.strftime("%m-%d")
        end_md = end_dt.strftime("%m-%d")
        temps, hums, rains = [], [], []

        for index, date_str in enumerate(resp["daily"]["time"]):
            md = date_str[5:]
            in_season = (start_md <= md <= end_md) if start_md <= end_md else (md >= start_md or md <= end_md)
            if in_season:
                if resp["daily"]["temperature_2m_mean"][index] is not None:
                    temps.append(resp["daily"]["temperature_2m_mean"][index])
                if resp["daily"]["relative_humidity_2m_mean"][index] is not None:
                    hums.append(resp["daily"]["relative_humidity_2m_mean"][index])
                if resp["daily"]["precipitation_sum"][index] is not None:
                    rains.append(resp["daily"]["precipitation_sum"][index])

        if not temps or not hums:
            return default_weather("Weather provider did not return usable seasonal data")

        return {
            "temp": round(sum(temps) / len(temps), 1),
            "hum": round(sum(hums) / len(hums), 1),
            "rain": round(sum(rains) / target_years, 1),
            "fallback_used": False,
            "warning": None,
        }
    except Exception as exc:
        return default_weather(f"Weather lookup failed: {type(exc).__name__}")
