def test_model_paths_are_stable_and_artifacts_exist(backend_app):
    assert backend_app.MODEL_PATH.exists()
    assert backend_app.ENCODER_PATH.exists()
    assert backend_app.MODELS_LOADED is True


def test_model_artifact_contract_is_documentable(backend_app):
    from backend.app import ml

    assert getattr(ml.model, "n_features_in_", None) == 7
    assert len(ml.encoder.classes_) == 22

    result = ml.predict_top_crops_with_metadata([90, 42, 43, 25, 70, 6.5, 100])

    assert result["model_status"] == "loaded"
    assert result["inference_mode"] == "model"
    assert len(result["predictions"]) == 3
    assert all({"crop", "probability"} <= set(prediction) for prediction in result["predictions"])


def test_database_uses_test_sqlite_file(backend_app, tmp_path):
    assert "smartagro_test.db" in backend_app.SQLALCHEMY_DATABASE_URL
    assert "smartagro.db" not in backend_app.SQLALCHEMY_DATABASE_URL
