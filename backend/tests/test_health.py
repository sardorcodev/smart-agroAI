def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert isinstance(payload["models_loaded"], bool)


def test_ready_endpoint(client):
    response = client.get("/ready")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] in {"ready", "not_ready"}
    assert payload["database"]["status"] == "ok"
    assert payload["model"]["model_path_exists"] is True
    assert payload["model"]["encoder_path_exists"] is True
