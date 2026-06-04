# Model Card

Model: Smart Agro AI MVP crop recommendation model

This is a documentation baseline for the currently tracked artifact. It is not a production model card and does not certify agronomic accuracy.

## Model Details

| Field | Value |
| --- | --- |
| Artifact | `backend/xgboost_model.joblib` |
| Encoder | `backend/encoder.joblib` |
| Model type | `xgboost.sklearn.XGBClassifier` |
| Input feature count | 7 |
| Output | Top 3 crop recommendations |
| Current metrics | `docs/ml/metrics/latest_metrics.json` |
| Training script | `backend/ml/train_model.py` |
| Reproducibility | Candidate workflow and release gate exist; production artifacts not replaced |

## Intended Use

The model is intended for MVP demonstration of an AI agriculture decision-support workflow. It should be used to show product direction, API integration, frontend rendering, and fallback behavior.

It must not be used as production agronomic advice, financial advice, crop planning advice, or a replacement for local agronomist review.

## Inputs

The backend sends these input features:

1. Nitrogen (`N`)
2. Phosphorus (`P`)
3. Potassium (`K`)
4. Temperature
5. Humidity
6. Soil pH
7. Rainfall

Weather values come from Open-Meteo historical archive summaries when available, or documented fallback values when provider data is unavailable.

## Outputs

The backend returns:

- `recommended_crop`
- `top_predictions`
- `top_3_recommendations`
- `model_status`
- `inference_mode`
- `warnings`

The encoder returns Uzbek display labels. The dataset-to-display label mapping contract is documented in `docs/ml/LABEL_MAPPING.md` and implemented in `backend/ml/label_mapping.py`.

## Fallback Behavior

If model artifacts are unavailable, the backend returns stable simulation predictions and marks the response with:

- `model_status: "unavailable"`
- `inference_mode: "simulation"`
- warning metadata

If model inference fails at runtime, the backend returns stable simulation predictions with:

- `model_status: "error"`
- `inference_mode: "simulation"`
- warning metadata

## Known Limitations

- Production artifacts have not been replaced by the Phase 4B candidate artifacts.
- Phase 4C blocked promotion because dataset source/license is unresolved.
- Phase 4D found no repository-local source/license evidence for the dataset.
- Phase 4E added a dataset fingerprint but did not confirm an external source/license match.
- Phase 4F moved the dataset to download-only/user-provided handling.
- Metrics are a reproducibility baseline, not field validation.
- No calibration analysis.
- No feature importance report.
- No dataset provenance or license confirmation.
- No regional validation.
- No field-trial validation.
- No monitoring or drift detection.
- Simulation fallback probabilities are static and for MVP continuity only.

## Safety Notice

This model is not production-ready. Results should be treated as demo recommendations and reviewed by qualified agronomy experts before any real farming decision.

The current production and candidate artifacts remain MVP/demo-only while dataset source and license status are unresolved. Backend runtime can continue using existing production artifacts without the dataset CSV.
