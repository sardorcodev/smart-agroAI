import React from 'react';
import { EKIN_BAZASI } from '../utils/constants';

const OfficialReport = React.forwardRef(({ formData, monitoringData, analysisResult }, ref) => {
  
  if (!analysisResult) return <div ref={ref}></div>;

  const cropInfo = EKIN_BAZASI[analysisResult.recommended_crop] || EKIN_BAZASI['default'];
  const minHum = cropInfo.min_hum;
  let waterNeeded = 0;
  
  if (monitoringData.moisture < minHum) {
    waterNeeded = (minHum - monitoringData.moisture) * cropInfo.kc * monitoringData.area * 0.1;
    if (monitoringData.current_temp > 35) waterNeeded *= 1.2;
  }

  const traditionalWater = monitoringData.area * 15;
  const savedWater = Math.max(0, traditionalWater - waterNeeded);
  const savedMoney = (savedWater / 1000) * 50;

  const bugun = new Date().toLocaleDateString('uz-UZ');

  return (
    <div 
      ref={ref} 
      className="absolute left-[-9999px] top-0 bg-white text-black p-12 font-serif w-[210mm] min-h-[297mm] shadow-none"
    >
      <div className="text-center border-b-2 border-black pb-6 mb-8">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-2">"Smart Agro AI" Elektron Boshqaruv Tizimi</h2>
        <p className="text-sm font-semibold uppercase">Avtomatlashtirilgan Dala monitoringi va Tahlil markazi</p>
      </div>

      <h1 className="text-2xl font-black text-center mb-10">DALANING AGROKIMYOVIY VA IQLIMIY TAHLILI<br/>X I S O B O T I</h1>

      <div className="flex justify-between mb-8 text-sm font-bold">
        <p>Hujjat raqami: #{Math.floor(Math.random() * 90000) + 10000}</p>
        <p>Sana: {bugun}</p>
      </div>

      <h3 className="text-lg font-bold mb-3 border-b border-black pb-1">1. Obyekt va Hudud Ma'lumotlari</h3>
      <table className="w-full mb-8 border-collapse border border-black text-sm">
        <tbody>
          <tr>
            <td className="border border-black p-3 font-bold w-1/3 bg-gray-100">GPS Koordinatalari:</td>
            <td className="border border-black p-3">{formData.lat?.toFixed(4)} (Lat), {formData.lon?.toFixed(4)} (Lon)</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-bold bg-gray-100">Sug'oriladigan Maydon:</td>
            <td className="border border-black p-3">{monitoringData.area} kvadrat metr</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-bold bg-gray-100">Vegetatsiya Davri (Reja):</td>
            <td className="border border-black p-3">{formData.start_date} dan {formData.end_date} gacha</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-lg font-bold mb-3 border-b border-black pb-1">2. Tuproq va Iqlim Ko'rsatkichlari</h3>
      <table className="w-full mb-8 border-collapse border border-black text-sm text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-3">Azot (N)</th>
            <th className="border border-black p-3">Fosfor (P)</th>
            <th className="border border-black p-3">Kaliy (K)</th>
            <th className="border border-black p-3">pH Darajasi</th>
            <th className="border border-black p-3">Mavsumiy Harorat</th>
            <th className="border border-black p-3">Yog'ingarchilik</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-3">{formData.n} mg/kg</td>
            <td className="border border-black p-3">{formData.p} mg/kg</td>
            <td className="border border-black p-3">{formData.k} mg/kg</td>
            <td className="border border-black p-3">{formData.ph}</td>
            <td className="border border-black p-3">{analysisResult.weather.temp} °C</td>
            <td className="border border-black p-3">{analysisResult.weather.rain} mm</td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-lg font-bold mb-3 border-b border-black pb-1">3. Sun'iy Intellekt Xulosasi va Iqtisodiy Samara</h3>
      <table className="w-full mb-12 border-collapse border border-black text-sm">
        <tbody>
          <tr>
            <td className="border border-black p-3 font-bold w-1/3 bg-gray-100">Tavsiya etilgan ekin turi:</td>
            <td className="border border-black p-3 font-black text-lg uppercase">{analysisResult.recommended_crop}</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-bold bg-gray-100">Biologik namlik ehtiyoji:</td>
            <td className="border border-black p-3">{minHum}% (Joriy holat: {monitoringData.moisture}%)</td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-bold bg-gray-100">Sug'orish qarori (AI):</td>
            <td className="border border-black p-3 font-bold">
              {waterNeeded > 0 ? `Zudlik bilan ${waterNeeded.toFixed(1)} litr suv quyilishi kerak.` : 'Namlik yetarli. Sug\'orish talab etilmaydi.'}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-3 font-bold bg-gray-100">Iqtisodiy tejamkorlik (Sikl):</td>
            <td className="border border-black p-3">
              An'anaviy sug'orishga nisbatan <b>{savedWater.toFixed(1)} litr</b> suv va <b>{savedMoney.toFixed(2)} so'm</b> mablag' tejaldi.
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-16 pt-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-bold mb-4">Mas'ul Agronom:</p>
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-xs text-gray-500">(F.I.SH va Imzo)</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 font-bold mb-2 mx-auto rotate-12">
              M.O'.
            </div>
          </div>
          <div>
            <p className="font-bold mb-4">Tizim Administratori:</p>
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-xs text-gray-500">Smart Agro AI Tizimi</p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-500 mt-12">
        Ushbu xujjat Smart Agro AI tizimi tomonidan avtomatik ravishda generatsiya qilindi. Hujjatning haqiqiyligini tekshirish uchun tizim bazasiga murojaat qiling.
      </p>

    </div>
  );
});

export default OfficialReport;