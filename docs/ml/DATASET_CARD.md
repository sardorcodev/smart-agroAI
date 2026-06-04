# Dataset Card

Dataset: `dataset/Crop_recommendation.csv`

This card documents the dataset currently tracked in the repository. The source and license are not confirmed.

## Basic Facts

| Field | Value |
| --- | --- |
| Path | `dataset/Crop_recommendation.csv` |
| Format | CSV |
| Rows | 2,200 |
| Columns | `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall`, `label` |
| Label count | 22 classes |
| Missing values | 0 missing values observed in all columns |
| Label language | English |

## Label Classes

Each class has 100 rows:

`apple`, `banana`, `blackgram`, `chickpea`, `coconut`, `coffee`, `cotton`, `grapes`, `jute`, `kidneybeans`, `lentil`, `maize`, `mango`, `mothbeans`, `mungbean`, `muskmelon`, `orange`, `papaya`, `pigeonpeas`, `pomegranate`, `rice`, `watermelon`.

## Numeric Ranges

| Column | Min | Max | Mean |
| --- | ---: | ---: | ---: |
| `N` | 0.000000 | 140.000000 | 50.551818 |
| `P` | 5.000000 | 145.000000 | 53.362727 |
| `K` | 5.000000 | 205.000000 | 48.149091 |
| `temperature` | 8.825675 | 43.675493 | 25.616244 |
| `humidity` | 14.258040 | 99.981876 | 71.481779 |
| `ph` | 3.504752 | 9.935091 | 6.469480 |
| `rainfall` | 20.211267 | 298.560117 | 103.463655 |

## Provenance And License

- Dataset provenance: unknown / needs confirmation.
- License: unknown / do not assume open redistribution rights.
- Redistribution status: unresolved.

Because the license is unknown, this dataset should be treated as a public-release risk until the source and redistribution rights are confirmed. If rights cannot be confirmed, Phase 4B should replace it with a dataset that has clear license terms or document a download-only workflow that does not redistribute restricted data.

## Known Limitations

- No source citation is included in the repository.
- No collection method is documented.
- No geography, date range, sampling method, or agronomist validation is documented.
- No split into train/validation/test files is documented.
- No checksum or dataset version is documented.
- Labels are English, while the tracked encoder returns Uzbek display labels.

## Current Use

The dataset appears to define the seven model input features and crop classes used by the MVP crop recommendation model. The repository does not yet include a training script proving that the tracked model was generated from this exact file.
