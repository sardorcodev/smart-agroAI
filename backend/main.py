"""Compatibility entrypoint for existing `uvicorn main:app` commands."""

try:
    from .app.config import settings
    from .app.database import SQLALCHEMY_DATABASE_URL, engine
    from .app.main import app, create_app
    from .app.ml import ENCODER_PATH, MODEL_PATH, MODELS_LOADED
except ImportError:
    from app.config import settings
    from app.database import SQLALCHEMY_DATABASE_URL, engine
    from app.main import app, create_app
    from app.ml import ENCODER_PATH, MODEL_PATH, MODELS_LOADED


ALLOWED_CORS_ORIGINS = settings.allowed_cors_origins
