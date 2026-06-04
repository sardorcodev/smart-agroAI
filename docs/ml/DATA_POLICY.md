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

The current dataset may remain tracked temporarily with explicit warnings because this phase does not remove or replace data without approval. The recommended next action is to confirm the original source/license or replace the dataset with a confirmed open alternative.
