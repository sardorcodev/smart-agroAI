from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import requests
import joblib
import numpy as np
# import google.generativeai as genai

# --- 1. MA'LUMOTLAR BAZASI VA XAVFSIZLIK ---
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext

SQLALCHEMY_DATABASE_URL = "sqlite:///./smartagro.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# GEMINI_API_KEY = "AIzaSyB0vHD_c0tTUTnDDSXxbCs4OwcTZpEeCIE"
# genai.configure(api_key=GEMINI_API_KEY)
# model_ai = genai.GenerativeModel('gemini-1.5-flash')

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="fermer")

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def verify_password(plain_password, hashed_password): return pwd_context.verify(plain_password, hashed_password)
def get_password_hash(password): return pwd_context.hash(password)


# --- 2. ASOSIY API VA CORS ---
app = FastAPI(title="Smart Agro AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 3. AI MODELLARNI YUKLASH ---
try:
    model = joblib.load('xgboost_model.joblib')
    encoder = joblib.load('encoder.joblib')
    MODELS_LOADED = True
except Exception as e:
    print(f"DIQQAT: Modellar topilmadi. Simulyatsiya rejimida ishlaymiz. Xato: {e}")
    MODELS_LOADED = False

EKIN_BAZASI = {
    'rice': {'kc': 1.20, 'min_hum': 80}, 'maize': {'kc': 1.10, 'min_hum': 60},
    'cotton': {'kc': 0.85, 'min_hum': 50}, 'watermelon': {'kc': 0.90, 'min_hum': 60},
    'mango': {'kc': 0.80, 'min_hum': 50}, 'coffee': {'kc': 1.05, 'min_hum': 70},
    'default': {'kc': 0.80, 'min_hum': 50}
}


# --- 4. MA'LUMOTLAR STRUKTURASI (SCHEMAS) ---
class RegisterReq(BaseModel):
    fullname: str
    email: str
    password: str
    role: str = "fermer"

class LoginReq(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

class FarmData(BaseModel):
    n: float
    p: float
    k: float
    ph: float
    lat: float
    lon: float
    current_soil_moisture: float
    area_m2: float = 10.0  
    start_date: str 
    end_date: str


# --- 5. LOGIN VA REGISTRATSIYA ENDPOINTLARI ---
@app.post("/api/register")
def register_user(user: RegisterReq, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan!")
    
    assigned_role = "admin" if user.email == "admin@smartagro.uz" else "fermer"
    new_user = UserDB(fullname=user.fullname, email=user.email, password_hash=get_password_hash(user.password), role=assigned_role)
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz!"}

@app.post("/api/login")
def login_user(user: LoginReq, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri!")
    return {"status": "success", "user": {"id": db_user.id, "fullname": db_user.fullname, "email": db_user.email, "role": db_user.role}}


# --- 6. OB-HAVO FUNKSIYASI ---
def get_weather(lat: float, lon: float, user_start_date: str, user_end_date: str):
    try:
        start_dt = datetime.strptime(user_start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(user_end_date, "%Y-%m-%d")
        
        target_years = 10
        base_start_year = start_dt.year - target_years
        base_end_year = end_dt.year - 1 

        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat, "longitude": lon,
            "start_date": f"{base_start_year}-01-01",
            "end_date": f"{base_end_year}-12-31",
            "daily": "temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum",
            "timezone": "auto"
        }
        resp = requests.get(url, params=params, timeout=5).json()
        
        if 'daily' not in resp: return {"temp": 25.0, "hum": 50.0, "rain": 0.0}

        start_md = start_dt.strftime("%m-%d")
        end_md = end_dt.strftime("%m-%d")
        temps, hums, rains = [], [], []

        for i, date_str in enumerate(resp['daily']['time']):
            md = date_str[5:] 
            in_season = (start_md <= md <= end_md) if start_md <= end_md else (md >= start_md or md <= end_md)
            if in_season:
                if resp['daily']['temperature_2m_mean'][i] is not None: temps.append(resp['daily']['temperature_2m_mean'][i])
                if resp['daily']['relative_humidity_2m_mean'][i] is not None: hums.append(resp['daily']['relative_humidity_2m_mean'][i])
                if resp['daily']['precipitation_sum'][i] is not None: rains.append(resp['daily']['precipitation_sum'][i])

        if not temps: return {"temp": 25.0, "hum": 50.0, "rain": 0.0}
        return {
            "temp": round(sum(temps) / len(temps), 1),
            "hum": round(sum(hums) / len(hums), 1),
            "rain": round(sum(rains) / target_years, 1)
        }
    except:
        return {"temp": 28.0, "hum": 45.0, "rain": 5.0} # API ishlamay qolsa ehtiyot sharti


# --- 7. ASOSIY TAHLIL ENDPOINTI (YANGILANGAN: TOP-3 EKIN) ---
@app.post("/api/analyze")
async def analyze_farm(data: FarmData):
    try:
        # 1. 10 yillik tarixiy ob-havoni tortamiz
        weather = get_weather(data.lat, data.lon, data.start_date, data.end_date)
        
        # 2. AI Model orqali ekinni aniqlaymiz (TOP-3 Ehtimollik bilan)
        top_3_recommendations = []
        primary_crop = "mango" # Default (xato bo'lsa)
        
        if MODELS_LOADED:
            input_features = np.array([[data.n, data.p, data.k, weather['temp'], weather['hum'], data.ph, weather['rain']]])
            
            # Shunchaki nomini emas, barcha ekinlar bo'yicha foizlarni olamiz
            probabilities = model.predict_proba(input_features)[0]
            
            # Eng baland foizli 3 ta indeksni ajratib olamiz
            top_3_indices = np.argsort(probabilities)[-3:][::-1]
            
            for idx in top_3_indices:
                crop_name_str = str(encoder.inverse_transform([idx])[0])
                prob_percent = round(float(probabilities[idx]) * 100, 1)
                
                top_3_recommendations.append({
                    "crop": crop_name_str.capitalize(),
                    "probability": prob_percent
                })
            
            # Sug'orish va hisob-kitob uchun eng 1-o'rindagi ekinni tanlaymiz
            primary_crop = top_3_recommendations[0]["crop"].lower()
        else:
            # Agar model yuklanmagan bo'lsa (Simulyatsiya uchun)
            top_3_recommendations = [
                {"crop": "Maize", "probability": 85.5},
                {"crop": "Cotton", "probability": 60.2},
                {"crop": "Rice", "probability": 45.0}
            ]
            primary_crop = "maize"
            
        # 3. Suvni hisoblaymiz (Eng yuqori foizli ekin asosida)
        info = EKIN_BAZASI.get(primary_crop, EKIN_BAZASI['default'])
        water_liters = 0
        pump_on = False
        
        if data.current_soil_moisture < info['min_hum']:
            deficit = info['min_hum'] - data.current_soil_moisture
            water_liters = deficit * info['kc'] * data.area_m2 * 0.1
            if weather['temp'] > 35:
                water_liters *= 1.2
            pump_on = True
            
        # 4. JSON javob
        return {
            "status": "success",
            "recommended_crop": primary_crop.capitalize(), # Asosiy tavsiya qilingan 1 ta ekin
            "top_3_recommendations": top_3_recommendations, # Frontend uchun 3 ta ekin va foizlar
            "optimal_humidity": info['min_hum'],
            "weather": weather,
            "irrigation": {
                "pump_on": pump_on,
                "water_liters": round(water_liters, 1),
                "message": "Nasos yoqildi! Suv quyilmoqda." if pump_on else "Namlik yetarli."
            }
        }
    except Exception as e:
        print(f"🚨 AI XATOSI: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/api/chat")
# async def chat_with_agronom(req: ChatRequest):
#     try:
#         prompt = f"""
#         Sen O'zbekistonlik fermerlar uchun yaratilgan 'Virtual Agronom' sun'iy intellektisan. 
#         Javoblaring qisqa, aniq, do'stona va o'zbek tilida bo'lsin.
#         Agar foydalanuvchi dori, o'g'it, urug' yoki smart qurilmalar haqida so'rasa, 
#         ularni 'Smart Agro Market' dan topishi mumkinligini eslatib o't.
        
#         Fermerning savoli: {req.message}
#         """
        
#         # Yangi kutubxona orqali eng so'nggi modelga so'rov yuborish
#         response = model_ai.generate_content(prompt)
        
#         return {"status": "success", "reply": response.text}
#     except Exception as e:
#         print(f"🚨 Gemini API Xatosi: {e}")
#         return {"status": "error", "reply": "Kechirasiz, fermer aka! Hozir internet tarmog'ida muammo bor. Iltimos birozdan so'ng qayta urinib ko'ring."}