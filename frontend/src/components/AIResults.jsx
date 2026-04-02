import React, { useState } from 'react';
import { Leaf, Thermometer, CloudRain, Zap, Settings, Power, Droplets, CheckCircle, Activity, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EKIN_BAZASI } from '../utils/constants';

export default function AIResults({ analysisResult, monitoringData }) {
  const [controlMode, setControlMode] = useState('auto');
  const [manualPumpOn, setManualPumpOn] = useState(false);

  if (!analysisResult) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-full animate-in fade-in duration-500 delay-150">
        <div className="bg-slate-100 p-4 rounded-full mb-4 border border-slate-200 shadow-inner">
          <Activity className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 tracking-tight">AI Xulosasini Kutmoqdamiz</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
          Zarur ma'lumotlarni kiritib, 1-bosqichda <strong className="text-green-600">"Tahlilni Boshlash"</strong> tugmasini bosing. AI model bu yerda sizga mukammal reja va jonli boshqaruvni taqdim etadi.
        </p>
      </div>
    );
  }

  const cropInfo = EKIN_BAZASI[analysisResult.recommended_crop?.toLowerCase()] || EKIN_BAZASI['default'];
  const minHum = cropInfo.min_hum;
  let aiPumpDecision = false;
  let waterNeeded = 0;

  if (monitoringData.moisture < minHum) {
    aiPumpDecision = true;
    waterNeeded = (minHum - monitoringData.moisture) * cropInfo.kc * monitoringData.area * 0.1;
    if (monitoringData.current_temp > 35) {
      waterNeeded *= 1.2;
    }
  }

  const isPumpActuallyOn = controlMode === 'auto' ? aiPumpDecision : manualPumpOn;

  const chartData = [
    { time: 'Hozir', namlik: monitoringData.moisture },
    { time: '+2s', namlik: isPumpActuallyOn ? monitoringData.moisture + 20 : monitoringData.moisture - 5 },
    { time: '+4s', namlik: isPumpActuallyOn ? minHum + 10 : monitoringData.moisture - 12 },
    { time: '+6s', namlik: isPumpActuallyOn ? minHum + 5 : monitoringData.moisture - 18 },
    { time: '+8s', namlik: isPumpActuallyOn ? minHum : Math.max(0, monitoringData.moisture - 25) },
  ];

  return (
    <div className="flex flex-col gap-5 h-full animate-in fade-in duration-500 delay-150">
      
      {/* 1. ASOSIY BANNER (O'zgartirishsiz qoldi) */}
      <div className="bg-gradient-to-br from-emerald-600 to-green-800 rounded-2xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between border border-green-700/50 relative overflow-hidden flex-shrink-0">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        
        <div className="mb-4 sm:mb-0">
          <p className="text-green-100 font-bold text-xs uppercase tracking-wider mb-1">AI Tavsiya Ekin:</p>
          <h2 className="text-3xl font-black capitalize tracking-tight flex items-center gap-2"><Leaf className="w-7 h-7" /> {analysisResult.recommended_crop}</h2>
          <p className="mt-1.5 text-xs bg-black/20 inline-block px-3 py-0.5 rounded-full font-bold">Optimal: {minHum}% Namlik</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg text-center border border-white/10 shadow-inner">
            <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-300" />
            <p className="text-[10px] text-green-100 uppercase mb-0.5 font-black">Mavsum</p>
            <p className="text-lg font-black">{analysisResult.weather.temp}°C</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg text-center border border-white/10 shadow-inner">
            <CloudRain className="w-5 h-5 mx-auto mb-1 text-cyan-300" />
            <p className="text-[10px] text-green-100 uppercase mb-0.5 font-black">Yomg'ir</p>
            <p className="text-lg font-black">{analysisResult.weather.rain}mm</p>
          </div>
        </div>
      </div>

      {/* 2. YANGI: TOP-3 EKINLAR PROGRESS BARI (AI Foizlari bilan) */}
      {analysisResult.top_3_recommendations && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
          <h3 className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Target className="w-3.5 h-3.5 text-green-500" /> AI Ehtimollik Tahlili (Top-3 Ekin)
          </h3>
          <div className="space-y-4">
            {analysisResult.top_3_recommendations.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-end mb-1.5">
                  <span className={`text-sm font-bold flex items-center gap-1.5 ${index === 0 ? 'text-green-700' : 'text-slate-600'}`}>
                    {index === 0 && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                    {index + 1}. {item.crop}
                  </span>
                  <span className={`text-xs font-black ${index === 0 ? 'text-green-600' : 'text-slate-500'}`}>
                    {item.probability}%
                  </span>
                </div>
                {/* Progress bar orqa foni */}
                <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner overflow-hidden">
                  {/* Progress bar to'lishi (Animatsiya bilan) */}
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : index === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-orange-400 to-red-400'}`} 
                    style={{ width: `${item.probability}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NASOS STANSIYASI (O'zgartirishsiz qoldi) */}
      <div className={`bg-white p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col flex-shrink-0 ${isPumpActuallyOn ? 'bg-blue-50 border-blue-200 shadow-blue-100/30' : 'bg-white border-slate-100'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 border-b border-slate-100/60 pb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Zap className={isPumpActuallyOn ? "text-blue-500 animate-pulse" : "text-slate-400"} strokeWidth={2.5} width={20} height={20} /> 
            Nasos Stansiyasi
          </h3>
          
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-inner">
            <button 
              onClick={() => setControlMode('auto')} 
              className={`px-3 py-1 rounded-md text-xs font-black transition-all flex items-center gap-1 ${controlMode === 'auto' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Activity className="w-3.5 h-3.5"/> AI Avto
            </button>
            <button 
              onClick={() => setControlMode('manual')} 
              className={`px-3 py-1 rounded-md text-xs font-black transition-all flex items-center gap-1 ${controlMode === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Settings className="w-3.5 h-3.5"/> Qo'lda
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <button 
            disabled={controlMode === 'auto'}
            onClick={() => setManualPumpOn(!manualPumpOn)}
            className={`relative flex-shrink-0 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-4 outline-none
              ${controlMode === 'auto' ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:scale-105 active:scale-95'}
              ${isPumpActuallyOn 
                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_25px_rgba(37,99,235,0.3)]' 
                : 'bg-slate-100 border-slate-200 text-slate-400 shadow-inner'
              }
            `}
          >
            <Power className={`w-9 h-9 mb-0.5 ${isPumpActuallyOn ? 'animate-pulse' : ''}`} />
            <span className="font-black text-base tracking-widest">{isPumpActuallyOn ? 'ON' : 'OFF'}</span>
            {controlMode === 'auto' && (
              <span className="absolute -bottom-2.5 bg-slate-800 text-white text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-md">AI Boshqaruvida</span>
            )}
          </button>

          <div className="flex-1 w-full space-y-3">
            {isPumpActuallyOn ? (
              <>
                <div className="text-blue-800 bg-blue-100/50 p-3 rounded-lg border border-blue-200 flex gap-2.5 text-xs font-medium">
                  <Droplets className="w-4 h-4 shrink-0 text-blue-500 animate-bounce" />
                  {controlMode === 'auto' ? 
                    <p>AI: Namlik past. Sug'orish boshlandi.</p> : 
                    <p>Foydalanuvchi: Nasos qo'lda ishga tushirildi.</p>
                  }
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-blue-200 flex items-center justify-between shadow-sm">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Norma (Litr):</span>
                  <div className="text-right flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-600">{controlMode === 'auto' ? waterNeeded.toFixed(1) : 'Maks.'}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed p-4">
                <CheckCircle className="w-8 h-8 mb-2 text-slate-300" />
                <p className="font-medium text-xs text-center px-4 leading-relaxed">Nasos kutish rejimida. <br/> {controlMode === 'auto' ? 'Tuproq namligi yetarli.' : 'Yoqish uchun tugmani bosing.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. GRAFIK (O'zgartirishsiz qoldi) */}
      <div className="bg-white min-h-[180px] rounded-2xl p-4 shadow-sm border border-slate-100 flex-shrink-0 flex flex-col">
        <p className="text-[10px] text-slate-500 font-black mb-3 uppercase tracking-widest text-center">Namlik Prognozi (Grafik)</p>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{fontSize: 9, fill: '#64748b'}} stroke="#cbd5e1" tickLine={false} axisLine={false} />
              <YAxis domain={''} tick={{fontSize: 9, fill: '#64748b'}} stroke="#cbd5e1" tickLine={false} axisLine={false} width={25} />
              <Tooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <ReferenceLine y={minHum} stroke="#ef4444" strokeDasharray="3 3" label={{position: 'insideTopLeft', value: 'Crit.', fill: '#ef4444', fontSize: 9, fontWeight: 'bold'}} />
              <Line type="monotone" dataKey="namlik" stroke={isPumpActuallyOn ? "#3b82f6" : "#f59e0b"} strokeWidth={3} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 5}} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}