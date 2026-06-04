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
        "source": weather.get("source"),
    }
    warnings = []

    if weather_summary["fallback_used"]:
        warnings.append(weather.get("warning") or "Fallback weather data was used")

    if not ml.MODELS_LOADED:
        logger.warning("Analyze endpoint is using simulation mode because model artifacts are unavailable")

    features = [data.n, data.p, data.k, weather["temp"], weather["hum"], data.ph, weather["rain"]]
    prediction_result = ml.predict_top_crops_with_metadata(features)
    top_predictions = prediction_result["predictions"]
    model_status = prediction_result["model_status"]
    inference_mode = prediction_result["inference_mode"]
    if prediction_result.get("warning"):
        warnings.append(prediction_result["warning"])
    primary_crop = top_predictions[0]["crop"] if top_predictions else "Mango"

    irrigation_result = calculate_irrigation(
        primary_crop,
        data.current_soil_moisture,
        data.area_m2,
        weather["temp"],
    )
    if irrigation_result["fallback_used"]:
        logger.warning("Using default irrigation rule for unmapped crop label")
        warnings.append(f"Default irrigation rule was used for crop label: {primary_crop}")

    return {
        "status": "success",
        "recommended_crop": primary_crop,
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
