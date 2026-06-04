# Label Mapping Contract

Version: `2026-06-04.phase-4b`

The dataset uses English crop labels. The user-facing MVP model output uses Uzbek display labels. Training must map labels explicitly before fitting the encoder; unknown labels must fail validation instead of being inferred silently.

| Dataset label | Display label |
| --- | --- |
| `apple` | `Olma` |
| `banana` | `Banan` |
| `blackgram` | `Qora mosh` |
| `chickpea` | `No'xat` |
| `coconut` | `Kokos` |
| `coffee` | `Kofe` |
| `cotton` | `Paxta` |
| `grapes` | `Uzum` |
| `jute` | `Jut (Tolali ekin)` |
| `kidneybeans` | `Loviya` |
| `lentil` | `Yasmiq` |
| `maize` | `Makkajo'xori` |
| `mango` | `Mango` |
| `mothbeans` | `Hind moshi` |
| `mungbean` | `Mosh` |
| `muskmelon` | `Qovun` |
| `orange` | `Apelsin` |
| `papaya` | `Papayya` |
| `pigeonpeas` | `Kaptar no'xati (Mosh turi)` |
| `pomegranate` | `Anor` |
| `rice` | `Sholi` |
| `watermelon` | `Tarvuz` |

## Rules

- Every dataset label must be present in `backend/ml/label_mapping.py`.
- Display labels must be unique unless a duplicate is intentionally documented and tested.
- Runtime irrigation normalization is separate from this training label contract.
- Replacing production artifacts must preserve API response compatibility with `recommended_crop`, `top_predictions`, and `top_3_recommendations`.
