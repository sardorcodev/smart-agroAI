from pathlib import Path

from alembic.config import Config


def test_alembic_config_points_to_backend_migrations():
    config_path = Path("backend/alembic.ini")
    config = Config(str(config_path))

    assert config.get_main_option("script_location") == "backend/alembic"


def test_alembic_env_uses_backend_metadata():
    env_source = Path("backend/alembic/env.py").read_text(encoding="utf-8")

    assert "from backend.app.database import Base" in env_source
    assert "target_metadata = Base.metadata" in env_source
