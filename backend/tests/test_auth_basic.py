def test_register_and_login_flow_uses_isolated_db(client):
    user = {
        "fullname": "Test Farmer",
        "email": "test-farmer@example.com",
        "password": "test-password",
        "role": "fermer",
    }

    register_response = client.post("/api/register", json=user)
    assert register_response.status_code == 200

    login_response = client.post(
        "/api/login",
        json={"email": user["email"], "password": user["password"]},
    )

    assert login_response.status_code == 200
    payload = login_response.json()
    assert payload["status"] == "success"
    assert payload["user"]["email"] == user["email"]
    assert payload["user"]["role"] == "fermer"


def test_login_rejects_invalid_password(client):
    response = client.post(
        "/api/login",
        json={"email": "missing@example.com", "password": "wrong"},
    )

    assert response.status_code == 401
