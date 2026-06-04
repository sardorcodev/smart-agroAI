# Dataset Directory

`Crop_recommendation.csv` is intentionally not tracked.

## Required Local Path

Place a user-provided dataset at:

```text
dataset/Crop_recommendation.csv
```

Expected schema:

```text
N,P,K,temperature,humidity,ph,rainfall,label
```

Expected fingerprint for the previous local MVP dataset:

- SHA256: `54a5a6e5408668e668667efc50de2fc867c1b875e0431b4f54dd331b0a109a4e`
- Rows: `2,200`
- Classes: `22`
- Rows per class: `100`

See `docs/ml/artifacts/dataset_fingerprint.json` for the full fingerprint.

## Source And License Responsibility

The repository does not provide redistribution rights for this dataset. Users and maintainers must obtain any dataset from a source they are authorized to use and must verify source/license status before training or publishing derived artifacts.

Do not commit downloaded or third-party dataset files without documented source, license, and redistribution rights.
