import logging

import joblib
import numpy as np

from .config import settings


logger = logging.getLogger("smartagro")
MODEL_PATH = settings.model_path
ENCODER_PATH = settings.encoder_path

try:
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    MODELS_LOADED = True
except Exception as exc:
    logger.warning("Model artifacts could not be loaded; simulation mode will be used: %s", exc)
    model = None
    encoder = None
    MODELS_LOADED = False


def get_model_status() -> dict:
    model_ready = MODELS_LOADED and MODEL_PATH.exists() and ENCODER_PATH.exists()
    return {
        "ready": model_ready,
        "status": "ok" if model_ready else "unavailable",
        "model_path_exists": MODEL_PATH.exists(),
        "encoder_path_exists": ENCODER_PATH.exists(),
    }


def predict_top_crops(features: list[float]) -> list[dict]:
    if not MODELS_LOADED:
        return [
            {"crop": "Maize", "probability": 85.5},
            {"crop": "Cotton", "probability": 60.2},
            {"crop": "Rice", "probability": 45.0},
        ]

    input_features = np.array([features])
    probabilities = model.predict_proba(input_features)[0]
    top_3_indices = np.argsort(probabilities)[-3:][::-1]
    top_predictions = []

    for idx in top_3_indices:
        crop_name = str(encoder.inverse_transform([idx])[0])
        top_predictions.append(
            {
                "crop": crop_name.capitalize(),
                "probability": round(float(probabilities[idx]) * 100, 1),
            }
        )

    return top_predictions
