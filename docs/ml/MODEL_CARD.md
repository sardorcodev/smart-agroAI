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
| Current metrics | Not available |
| Training script | Not available |
| Reproducibility | Not yet established |

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

The encoder currently returns Uzbek display labels. Backend irrigation lookup normalizes a small set of common English and Uzbek labels, but a complete label contract is still needed.

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

- No documented training pipeline.
- No documented train/test split.
- No model metrics, confusion matrix, or calibration analysis.
- No feature importance report.
- No dataset provenance or license confirmation.
- No regional validation.
- No field-trial validation.
- No monitoring or drift detection.
- Simulation fallback probabilities are static and for MVP continuity only.

## Safety Notice

This model is not production-ready. Results should be treated as demo recommendations and reviewed by qualified agronomy experts before any real farming decision.
