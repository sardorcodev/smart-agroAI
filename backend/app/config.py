from pathlib import Path
import os
import re


BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = BASE_DIR / "smartagro_local.db"
DEFAULT_DATABASE_URL = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"
DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
DEFAULT_DEV_JWT_SECRET = "dev-only-change-me"
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MAX_ANALYSIS_DATE_RANGE_DAYS = 366


def get_env_list(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    database_url: str = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)
    allowed_cors_origins: list[str] = get_env_list("ALLOWED_CORS_ORIGINS", DEFAULT_CORS_ORIGINS)
    admin_emails: set[str] = {email.lower() for email in get_env_list("ADMIN_EMAILS", "")}
    model_path: Path = BASE_DIR / "xgboost_model.joblib"
    encoder_path: Path = BASE_DIR / "encoder.joblib"
    app_env: str = os.getenv("APP_ENV", "development")
    debug: bool = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes"}
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", DEFAULT_DEV_JWT_SECRET)
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


settings = Settings()
