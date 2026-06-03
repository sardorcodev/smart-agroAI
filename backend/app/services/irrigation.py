EKIN_BAZASI = {
    "rice": {"kc": 1.20, "min_hum": 80},
    "maize": {"kc": 1.10, "min_hum": 60},
    "cotton": {"kc": 0.85, "min_hum": 50},
    "watermelon": {"kc": 0.90, "min_hum": 60},
    "mango": {"kc": 0.80, "min_hum": 50},
    "coffee": {"kc": 1.05, "min_hum": 70},
    "default": {"kc": 0.80, "min_hum": 50},
}


def calculate_irrigation(crop: str, soil_moisture: float, area_m2: float, temperature: float) -> dict:
    info = EKIN_BAZASI.get(crop, EKIN_BAZASI["default"])
    water_liters = 0
    pump_on = False

    if soil_moisture < info["min_hum"]:
        deficit = info["min_hum"] - soil_moisture
        water_liters = deficit * info["kc"] * area_m2 * 0.1
        if temperature > 35:
            water_liters *= 1.2
        pump_on = True

    return {
        "optimal_humidity": info["min_hum"],
        "irrigation": {
            "pump_on": pump_on,
            "water_liters": round(water_liters, 1),
            "message": "Nasos yoqildi! Suv quyilmoqda." if pump_on else "Namlik yetarli.",
        },
    }
