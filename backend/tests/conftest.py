import importlib
import sys

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def backend_app(monkeypatch, tmp_path):
    test_db = tmp_path / "smartagro_test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{test_db.as_posix()}")
    monkeypatch.setenv("ALLOWED_CORS_ORIGINS", "http://localhost:5173")
    monkeypatch.setenv("ADMIN_EMAILS", "admin@example.com")
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-not-for-production")
    monkeypatch.setenv("JWT_ALGORITHM", "HS256")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

    for module_name in list(sys.modules):
        if module_name == "backend.main" or module_name.startswith("backend.app"):
            sys.modules.pop(module_name, None)

    module = importlib.import_module("backend.main")

    return module


@pytest.fixture
def client(backend_app):
    return TestClient(backend_app.app)
