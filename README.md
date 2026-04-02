# 🌾 Smart Agro AI

> Qishloq xo‘jaligi uchun sun’iy intellektga asoslangan aqlli tahlil, sug‘orish monitoringi, virtual agronom va agro-market ekotizimi.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-XGBoost%20%7C%20Gemini-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Mundarija

- [Loyiha haqida](#-loyiha-haqida)
- [Muammo](#-muammo)
- [Yechim](#-yechim)
- [Asosiy imkoniyatlar](#-asosiy-imkoniyatlar)
- [Texnologiyalar steki](#-texnologiyalar-steki)
- [Tizim arxitekturasi](#-tizim-arxitekturasi)
- [Foydalanish ssenariysi](#-foydalanish-ssenariysi)
- [O‘rnatish va ishga tushirish](#-ornatish-va-ishga-tushirish)
- [API va modul tavsifi](#-api-va-modul-tavsifi)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [Biznes modeli](#-biznes-modeli)
- [Kelajakdagi rivojlantirishlar](#-kelajakdagi-rivojlantirishlar)
- [Jamoa](#-jamoa)
- [Litsenziya](#-litsenziya)

---

## 🚀 Loyiha haqida

**Smart Agro AI** — bu fermerlar, dehqonlar va agro-soha vakillari uchun mo‘ljallangan aqlli raqamli platforma bo‘lib, tuproq va iqlim ma’lumotlari asosida ekin tavsiya qiladi, sug‘orish jarayonini monitoring qiladi, AI yordamida agronomik maslahat beradi va kerakli mahsulotlarni bitta tizim ichida topish imkonini yaratadi.

Loyiha maqsadi — qishloq xo‘jaligida qaror qabul qilish jarayonini **ma’lumotga asoslangan**, **tezkor**, **aniq** va **foydali** qilish.

---

## ❗ Muammo

Ko‘plab fermerlar quyidagi qiyinchiliklarga duch keladi:

- Tuproq tarkibini to‘liq tahlil qila olmaydi
- Ma’lum hududga qaysi ekin mosligini bilmaydi
- Suv resurslaridan samarasiz foydalanadi
- Kasalliklar yoki agrotexnik muammolar bo‘yicha tezkor maslahatga ega emas
- O‘g‘it, urug‘ va boshqa resurslarni topishda vaqt yo‘qotadi

Natijada:

- hosildorlik pasayadi
- xarajat ortadi
- noto‘g‘ri ekin tanlanadi
- suv va resurslar isrof bo‘ladi

---

## ✅ Yechim

**Smart Agro AI** ushbu muammolarni bitta integratsiyalashgan platforma orqali hal qiladi:

1. **Tuproq va iqlim tahlili asosida ekin tavsiyasi**
2. **Sug‘orish monitoringi va avtomatlashtirilgan qaror**
3. **Virtual AI agronom yordamchisi**
4. **Agro-market orqali kerakli mahsulotlarni xarid qilish**
5. **Xarita orqali yaqin distribyutor yoki do‘konlarni topish**

---

## 🌟 Asosiy imkoniyatlar

### 1. AI asosidagi ekin tavsiya moduli
Foydalanuvchi quyidagi ma’lumotlarni kiritadi:

- Azot (N)
- Fosfor (P)
- Kaliy (K)
- pH
- namlik
- harorat
- yog‘ingarchilik yoki iqlim ma’lumotlari

Tizim ushbu ma’lumotlarni tahlil qilib, foydalanuvchiga:

- eng mos ekinlar ro‘yxati
- tavsiya etilgan top-3 variant
- ehtimollik yoki ishonchlilik ko‘rsatkichi

ni qaytaradi.

### 2. Smart sug‘orish monitoringi
Tizim tuproq namligi va ob-havo holatiga qarab:

- sug‘orish kerak yoki kerak emasligini aniqlaydi
- suv sarfini hisoblaydi
- IoT uskunalar bilan integratsiya qilinadigan mantiqiy asos yaratadi
- namlikning dinamik holatini grafikda ko‘rsatadi

### 3. Virtual Agronom
Foydalanuvchi tabiiy tilda savol beradi:

- “Pomidor bargida dog‘ tushdi, nima qilay?”
- “Paxtaga qaysi o‘g‘itni qachon berish kerak?”
- “Bodring uchun optimal sug‘orish rejasi qanday?”

AI agronom:

- muammoni tahlil qiladi
- tavsiya beradi
- ehtiyot choralari haqida yozadi
- amaliy maslahatlar beradi

### 4. Agro Market
Platforma ichida foydalanuvchi:

- urug‘lar
- mineral o‘g‘itlar
- pestitsidlar
- aqlli sensorlar
- nasoslar va agro-uskunalar

ni ko‘rishi va xarid qilishi mumkin.

### 5. Geolokatsiya xaritasi
Xarita moduli orqali foydalanuvchi:

- eng yaqin agro-do‘konni topadi
- distribyutor manzilini ko‘radi
- marshrut qurishi mumkin
- hududiy xizmat nuqtalarini ko‘rishi mumkin

---

## 🛠 Texnologiyalar steki

### Frontend
- **React.js**
- **Vite**
- **Tailwind CSS**
- **Recharts**
- **React Leaflet**

### Backend
- **FastAPI**
- **Python**
- **Uvicorn**
- **Pydantic**
- **SQLAlchemy**

### AI / ML
- **Scikit-learn**
- **XGBoost**
- **Joblib**
- **NumPy**
- **Google Gemini API**

### Database
- **SQLite** (MVP uchun)
- Keyinchalik: **PostgreSQL**

### Qo‘shimcha
- REST API
- JSON asosidagi ma’lumot almashinuvi
- Modul asosidagi arxitektura
- Kengayishga tayyor backend struktura

---

## 🧱 Tizim arxitekturasi

```text
Frontend (React + Vite)
        │
        ▼
Backend API (FastAPI)
        │
 ┌──────┼───────────────┬───────────────┐
 ▼      ▼               ▼               ▼
ML Model   Gemini API   Database        Map / Store Data
(XGBoost)  (Virtual AI) (SQLite)        (Leaflet / JSON)