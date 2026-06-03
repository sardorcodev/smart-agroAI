from datetime import timedelta
from types import SimpleNamespace

import pytest
from fastapi import HTTPException


def test_access_token_round_trip(backend_app):
    from backend.app.security import create_access_token, decode_access_token

    token = create_access_token({"sub": "1", "email": "user@example.com", "role": "fermer"})
    payload = decode_access_token(token)

    assert payload["sub"] == "1"
    assert payload["email"] == "user@example.com"
    assert payload["role"] == "fermer"
    assert "exp" in payload


def test_expired_token_is_rejected(backend_app):
    from backend.app.security import create_access_token, decode_access_token

    token = create_access_token(
        {"sub": "1", "email": "user@example.com", "role": "fermer"},
        expires_delta=timedelta(minutes=-1),
    )

    with pytest.raises(ValueError):
        decode_access_token(token)


def test_require_admin_allows_admin(backend_app):
    from backend.app.dependencies import require_admin

    dependency = require_admin
    user = SimpleNamespace(role="admin")

    assert dependency(current_user=user) is user


def test_require_admin_rejects_non_admin(backend_app):
    from backend.app.dependencies import require_admin

    dependency = require_admin
    user = SimpleNamespace(role="fermer")

    with pytest.raises(HTTPException) as exc:
        dependency(current_user=user)

    assert exc.value.status_code == 403
