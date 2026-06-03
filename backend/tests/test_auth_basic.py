def test_register_and_login_flow_uses_isolated_db(client):
    user = {
        "fullname": "Test Farmer",
        "email": "test-farmer@example.com",
        "password": "test-password",
        "role": "fermer",
    }

    register_response = client.post("/api/register", json=user)
    assert register_response.status_code == 200
    register_payload = register_response.json()
    assert register_payload["user"]["email"] == user["email"]
    assert register_payload["user"]["role"] == "fermer"
    assert "password_hash" not in register_payload["user"]
    assert "password" not in register_payload["user"]

    login_response = client.post(
        "/api/login",
        json={"email": user["email"], "password": user["password"]},
    )

    assert login_response.status_code == 200
    payload = login_response.json()
    assert payload["status"] == "success"
    assert payload["access_token"]
    assert payload["token_type"] == "bearer"
    assert payload["user"]["email"] == user["email"]
    assert payload["user"]["role"] == "fermer"
    assert "password_hash" not in payload["user"]


def test_login_rejects_invalid_password(client):
    response = client.post(
        "/api/login",
        json={"email": "missing@example.com", "password": "wrong"},
    )

    assert response.status_code == 401


def test_me_requires_token(client):
    response = client.get("/api/me")

    assert response.status_code == 401


def test_me_rejects_invalid_token(client):
    response = client.get("/api/me", headers={"Authorization": "Bearer invalid-token"})

    assert response.status_code == 401


def test_me_returns_current_user_with_valid_token(client):
    user = {
        "fullname": "Me Farmer",
        "email": "me@example.com",
        "password": "test-password",
        "role": "admin",
    }
    assert client.post("/api/register", json=user).status_code == 200
    login_response = client.post(
        "/api/login",
        json={"email": user["email"], "password": user["password"]},
    )
    token = login_response.json()["access_token"]

    response = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "success"
    assert payload["user"]["email"] == user["email"]
    assert payload["user"]["role"] == "fermer"
    assert "password_hash" not in payload["user"]


def test_register_rejects_invalid_email(client):
    response = client.post(
        "/api/register",
        json={
            "fullname": "Invalid Email",
            "email": "not-an-email",
            "password": "test-password",
            "role": "fermer",
        },
    )

    assert response.status_code == 422


def test_register_rejects_weak_password(client):
    response = client.post(
        "/api/register",
        json={
            "fullname": "Weak Password",
            "email": "weak@example.com",
            "password": "short",
            "role": "fermer",
        },
    )

    assert response.status_code == 422


def test_register_rejects_duplicate_email(client):
    user = {
        "fullname": "Duplicate Farmer",
        "email": "duplicate@example.com",
        "password": "test-password",
        "role": "fermer",
    }

    assert client.post("/api/register", json=user).status_code == 200
    duplicate_response = client.post("/api/register", json=user)

    assert duplicate_response.status_code == 400


def test_login_normalizes_email(client):
    user = {
        "fullname": "Case Farmer",
        "email": "case@example.com",
        "password": "test-password",
        "role": "fermer",
    }
    assert client.post("/api/register", json=user).status_code == 200

    response = client.post(
        "/api/login",
        json={"email": " CASE@example.com ", "password": user["password"]},
    )

    assert response.status_code == 200


def test_configured_admin_email_becomes_admin(client):
    user = {
        "fullname": "Configured Admin",
        "email": "admin@example.com",
        "password": "test-password",
        "role": "fermer",
    }

    response = client.post("/api/register", json=user)

    assert response.status_code == 200
    assert response.json()["user"]["role"] == "admin"


def test_client_cannot_choose_admin_role_for_unconfigured_email(client):
    user = {
        "fullname": "Role Escalation",
        "email": "not-admin@example.com",
        "password": "test-password",
        "role": "admin",
    }

    response = client.post("/api/register", json=user)

    assert response.status_code == 200
    assert response.json()["user"]["role"] == "fermer"
