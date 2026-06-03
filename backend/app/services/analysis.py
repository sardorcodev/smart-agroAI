import logging

from .. import ml
from ..schemas import FarmData
from .irrigation import calculate_irrigation
from .weather import get_weather


logger = logging.getLogger("smartagro")


def analyze_farm_data(data: FarmData) -> dict:
    weather = get_weather(data.lat, data.lon, data.start_date, data.end_date)
    weather_summary = {
        "temp": weather["temp"],
        "hum": weather["hum"],
        "rain": weather["rain"],
        "fallback_used": bool(weather.get("fallback_used", False)),
    }
    warnings = []

    if weather_summary["fallback_used"]:
        warnings.append(weather.get("warning") or "Fallback weather data was used")

    inference_mode = "model" if ml.MODELS_LOADED else "simulation"
    model_status = "loaded" if ml.MODELS_LOADED else "unavailable"

    if not ml.MODELS_LOADED:
        logger.warning("Analyze endpoint is using simulation mode because model artifacts are unavailable")
        warnings.append("Model artifacts are unavailable; simulation recommendations were used")

    features = [data.n, data.p, data.k, weather["temp"], weather["hum"], data.ph, weather["rain"]]
    top_predictions = ml.predict_top_crops(features)
    primary_crop = top_predictions[0]["crop"].lower() if top_predictions else "mango"

    irrigation_result = calculate_irrigation(
        primary_crop,
        data.current_soil_moisture,
        data.area_m2,
        weather["temp"],
    )

    return {
        "status": "success",
        "recommended_crop": primary_crop.capitalize(),
        "top_predictions": top_predictions,
        "top_3_recommendations": top_predictions,
        "optimal_humidity": irrigation_result["optimal_humidity"],
        "weather_summary": weather_summary,
        "weather": {
            "temp": weather_summary["temp"],
            "hum": weather_summary["hum"],
            "rain": weather_summary["rain"],
        },
        "model_status": model_status,
        "inference_mode": inference_mode,
        "warnings": warnings,
        "irrigation": irrigation_result["irrigation"],
    }
