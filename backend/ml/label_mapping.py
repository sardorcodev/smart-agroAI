DATASET_TO_DISPLAY_LABEL = {
    "apple": "Olma",
    "banana": "Banan",
    "blackgram": "Qora mosh",
    "chickpea": "No'xat",
    "coconut": "Kokos",
    "coffee": "Kofe",
    "cotton": "Paxta",
    "grapes": "Uzum",
    "jute": "Jut (Tolali ekin)",
    "kidneybeans": "Loviya",
    "lentil": "Yasmiq",
    "maize": "Makkajo'xori",
    "mango": "Mango",
    "mothbeans": "Hind moshi",
    "mungbean": "Mosh",
    "muskmelon": "Qovun",
    "orange": "Apelsin",
    "papaya": "Papayya",
    "pigeonpeas": "Kaptar no'xati (Mosh turi)",
    "pomegranate": "Anor",
    "rice": "Sholi",
    "watermelon": "Tarvuz",
}

LABEL_MAPPING_VERSION = "2026-06-04.phase-4b"


def normalize_dataset_label(label: str) -> str:
    return label.strip().lower()


def map_dataset_label(label: str) -> str:
    normalized = normalize_dataset_label(label)
    if normalized not in DATASET_TO_DISPLAY_LABEL:
        raise KeyError(f"Unmapped dataset label: {label}")
    return DATASET_TO_DISPLAY_LABEL[normalized]


def validate_label_mapping(dataset_labels: set[str]) -> dict:
    normalized_labels = {normalize_dataset_label(label) for label in dataset_labels}
    mapping_labels = set(DATASET_TO_DISPLAY_LABEL)
    missing = sorted(normalized_labels - mapping_labels)
    extra = sorted(mapping_labels - normalized_labels)

    mapped_values = list(DATASET_TO_DISPLAY_LABEL.values())
    duplicates = sorted({label for label in mapped_values if mapped_values.count(label) > 1})

    return {
        "valid": not missing and not duplicates,
        "missing_dataset_labels": missing,
        "extra_mapping_labels": extra,
        "duplicate_display_labels": duplicates,
        "mapping_version": LABEL_MAPPING_VERSION,
        "mapped_label_count": len(DATASET_TO_DISPLAY_LABEL),
    }
