# Dataset Card

Dataset: `dataset/Crop_recommendation.csv`

This card documents the dataset currently tracked in the repository. Phase 4D found no repository-local source or dataset-specific license evidence.

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
| SHA256 | `54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e` |
| Fingerprint | `docs/ml/artifacts/dataset_fingerprint.json` |

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
- Dataset license: unknown / do not assume open redistribution rights.
- Redistribution status: unresolved.
- Repository-local evidence: no dataset source/license evidence found beyond documentation that marks the status unresolved.
- Project `LICENSE`: applies to project code/docs unless otherwise stated; it must not be assumed to grant rights for this dataset's upstream contents.
- Source matching status: unresolved; no repository-local or user-provided fingerprint match to an external source is documented.

Because the license is unknown, this dataset should be treated as a public-release risk until the source and redistribution rights are confirmed. If rights cannot be confirmed, the project should replace it with a dataset that has clear license terms or document a download-only workflow that does not redistribute restricted data.

## Public Repository Handling Decision

Current Phase 4E decision: **temporarily tracked with explicit unresolved-license warnings**.

Reason: no repository-local or user-provided evidence confirms source/license, and no compatible replacement dataset was documented locally. The repository must not claim open redistribution rights for this dataset. Before final release claims, the project should move to download-only workflow or replace the dataset with a confirmed open alternative.

## Known Limitations

- No source citation is included in the repository.
- No collection method is documented.
- No geography, date range, sampling method, or agronomist validation is documented.
- No split into train/validation/test files is documented.
- Dataset checksum is documented, but no upstream dataset version is known.
- Labels are English, while the tracked encoder returns Uzbek display labels.
- The dataset should not be used as the basis for a promoted public model release until source/license status is resolved.
- The dataset should not be presented as safely redistributable until source/license evidence is added.

## Current Use

The dataset defines the seven model input features and crop classes used by the MVP crop recommendation model. Phase 4B adds validation and candidate training scripts, but the current production artifacts are not automatically replaced by generated candidates.
