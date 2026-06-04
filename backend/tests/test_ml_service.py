from backend.app import ml


def test_predict_top_crops_with_metadata_reports_simulation_when_models_missing(monkeypatch):
    monkeypatch.setattr(ml, "MODELS_LOADED", False)

    result = ml.predict_top_crops_with_metadata([1, 2, 3, 25, 70, 6.5, 10])

    assert result["model_status"] == "unavailable"
    assert result["inference_mode"] == "simulation"
    assert result["warning"]
    assert result["predictions"] == ml.SIMULATION_TOP_PREDICTIONS


def test_predict_top_crops_with_metadata_handles_runtime_failure(monkeypatch):
    class BrokenModel:
        def predict_proba(self, input_features):
            raise RuntimeError("broken model")

    monkeypatch.setattr(ml, "MODELS_LOADED", True)
    monkeypatch.setattr(ml, "model", BrokenModel())

    result = ml.predict_top_crops_with_metadata([1, 2, 3, 25, 70, 6.5, 10])

    assert result["model_status"] == "error"
    assert result["inference_mode"] == "simulation"
    assert result["warning"] == "Model inference failed; simulation recommendations were used"
    assert result["predictions"] == ml.SIMULATION_TOP_PREDICTIONS
