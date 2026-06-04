# Data Policy

This policy applies to datasets, derived model artifacts, and ML documentation in Smart Agro AI.

## No License Assumptions

Do not assume that a dataset is covered by the repository `LICENSE` unless the dataset source and license are explicitly documented.

For `dataset/Crop_recommendation.csv`, no repository-local source or dataset-specific license evidence has been found. Its status is:

- Source: unknown
- License: unknown
- Redistribution rights: unresolved
- Public model release status: blocked

## Required Fields For New Datasets

Any new or replacement dataset must document:

- source name,
- source URL or citation,
- license name,
- license URL or local license file,
- whether redistribution is allowed,
- whether commercial use is allowed if relevant,
- collection or generation method if known,
- checksum,
- schema,
- label definitions,
- known limitations.

## Source Matching Requirements

A dataset source is considered confirmed only when the repository includes:

- source name,
- source URL or stable citation,
- source maintainer or publisher if known,
- exact dataset filename/version or release identifier,
- source-side license text or link,
- a fingerprint match against the local dataset.

A fingerprint match should compare at minimum:

- full-file SHA256,
- row count,
- column names and order,
- class names and rows per class,
- first and last row fingerprints,
- numeric summary checksum.

The current local fingerprint is documented in `docs/ml/artifacts/dataset_fingerprint.json`. A fingerprint match alone does not prove license compatibility.

## License Confirmation Requirements

A dataset license is considered confirmed only when:

- the license is explicit,
- the license applies to the dataset itself,
- redistribution rights are clear,
- attribution requirements are documented,
- any non-commercial/share-alike restrictions are documented.

The repository `LICENSE` does not satisfy dataset license confirmation for third-party or externally sourced datasets.

## Download-Only Workflow Requirements

If redistribution rights remain unclear, the repository should move toward a download-only workflow:

- remove the CSV from tracked files,
- keep `dataset/README.md` with required filename and schema,
- require users to obtain the dataset from a source they are authorized to use,
- keep validation/fingerprinting commands,
- make training tests skip gracefully when the dataset is absent,
- keep production artifacts MVP/demo-only until governance is resolved.

## Dataset Removal Criteria

Remove the dataset from tracked repository contents if:

- evidence shows redistribution is not allowed,
- no source/license can be confirmed before a public release that claims dataset readiness,
- the project cannot document a legally safe redistribution basis,
- a maintainer chooses to minimize public repository risk before applying to OSS programs.

## Repository Handling Rules

- Do not add new datasets without source and license documentation.
- Do not claim open redistribution rights without evidence.
- Prefer small metadata files and documented download workflows when redistribution rights are unclear.
- Keep generated candidate artifacts under ignored output directories unless promotion is explicitly approved.
- Keep production model and encoder artifact replacements in a dedicated commit.

## Model Artifact Release Rules

Model artifacts derived from unresolved datasets are MVP/demo-only. They must not be promoted as final public model releases until:

- dataset source is documented,
- dataset license is documented,
- redistribution rights are understood,
- model card and dataset card are updated,
- metrics are reviewed,
- promotion checklist passes.

## Current Decision

Phase 4F decision: the current dataset is handled as download-only/user-provided data. `dataset/Crop_recommendation.csv` is ignored by Git. Maintainers may use a local authorized copy for validation and training, but the repository must not claim redistribution rights or promote derived model artifacts until source/license evidence and a matching fingerprint are documented.
