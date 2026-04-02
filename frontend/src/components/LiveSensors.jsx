import React from 'react';
import { Maximize, Navigation, Droplets, Thermometer } from 'lucide-react';

export default function LiveSensors({ formData, monitoringData, handleMonitorChange, locationStatus }) {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 gap-5">
      
      <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[220px]">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-bold text-slate-600 text-[11px] uppercase tracking-wider">Haqiqiy Xarita (GPS)</h3>
          {locationStatus === 'success' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {formData.lat?.toFixed(4)}, {formData.lon?.toFixed(4)}</span>}
        </div>
        
        <div className="w-full h-48 bg-slate-200 rounded-lg overflow-hidden border border-slate-200 relative shadow-inner">
          {locationStatus === 'success' ? (
            <iframe 
              title="Farm Location" width="100%" height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              src={`https://maps.google.com/maps?q=${formData.lat},${formData.lon}&z=14&output=embed`} 
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <Navigation className="w-8 h-8 mb-2 animate-bounce" />
              <p className="text-xs font-bold">Joylashuv qidirilmoqda...</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-5">
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5"><Maximize className="w-4 h-4 text-blue-500"/> Sug'orish Maydoni</label>
          </div>
          <div className="relative">
            <input 
              type="number" name="area" min="1" 
              value={monitoringData.area} onChange={handleMonitorChange} 
              className="w-full border border-slate-200 rounded-lg p-3 pl-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-black text-blue-700 shadow-sm transition-all" 
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">m²</span>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div>
          <div className="flex justify-between mb-2 items-end">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500"/> Tuproq Namligi
            </label>
            <span className="font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-xs">{monitoringData.moisture}%</span>
          </div>
          <input 
            type="range" name="moisture" min="0" max="100" 
            value={monitoringData.moisture} onChange={handleMonitorChange} 
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1" 
          />
        </div>

        <div>
          <div className="flex justify-between mb-2 items-end">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-500"/> Jonli Harorat
            </label>
            <span className="font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-xs">{monitoringData.current_temp}°C</span>
          </div>
          <input 
            type="range" name="current_temp" min="-10" max="60" 
            value={monitoringData.current_temp} onChange={handleMonitorChange} 
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-1" 
          />
        </div>

      </div>
    </div>
  );
}