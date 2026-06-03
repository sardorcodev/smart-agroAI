def test_model_paths_are_stable_and_artifacts_exist(backend_app):
    assert backend_app.MODEL_PATH.exists()
    assert backend_app.ENCODER_PATH.exists()
    assert backend_app.MODELS_LOADED is True


def test_database_uses_test_sqlite_file(backend_app, tmp_path):
    assert "smartagro_test.db" in backend_app.SQLALCHEMY_DATABASE_URL
    assert "smartagro.db" not in backend_app.SQLALCHEMY_DATABASE_URL
