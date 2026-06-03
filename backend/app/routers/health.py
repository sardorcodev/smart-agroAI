import logging

from fastapi import APIRouter
from sqlalchemy import text

from ..database import engine
from ..ml import MODELS_LOADED, get_model_status


logger = logging.getLogger("smartagro")
router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": MODELS_LOADED}


@router.get("/ready")
def readiness_check():
    database_ready = False
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        database_ready = True
    except Exception as exc:
        logger.exception("Readiness database check failed: %s", exc)

    model_status = get_model_status()
    ready = database_ready and model_status["ready"]

    return {
        "status": "ready" if ready else "not_ready",
        "database": {"status": "ok" if database_ready else "error"},
        "model": {
            "status": model_status["status"],
            "model_path_exists": model_status["model_path_exists"],
            "encoder_path_exists": model_status["encoder_path_exists"],
        },
    }
