import importlib
import sys

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def backend_app(monkeypatch, tmp_path):
    test_db = tmp_path / "smartagro_test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{test_db.as_posix()}")
    monkeypatch.setenv("ALLOWED_CORS_ORIGINS", "http://localhost:5173")
    monkeypatch.delenv("ADMIN_EMAILS", raising=False)

    sys.modules.pop("backend.main", None)
    module = importlib.import_module("backend.main")

    return module


@pytest.fixture
def client(backend_app):
    return TestClient(backend_app.app)
