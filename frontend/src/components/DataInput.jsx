import React from 'react';
import { Activity, Leaf, AlertOctagon, Navigation } from 'lucide-react';

export default function DataInput({ formData, handleFormChange, analyzeData, loading, locationStatus, locationErrorMsg, getUserLocation }) {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <form onSubmit={analyzeData} className="flex flex-col flex-1 gap-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-3">Tuproq Tarkibi (NPK & pH)</h3>
          <div className="grid grid-cols-2 gap-4">
            {['n', 'p', 'k', 'ph'].map((field) => (
              <div key={field}>
                <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">
                  {field === 'n' ? 'Azot (N)' : field === 'p' ? 'Fosfor (P)' : field === 'k' ? 'Kaliy (K)' : 'pH darajasi'}
                </label>
                <input 
                  type="number" step={field === 'ph' ? "0.1" : "1"} name={field} 
                  value={formData[field]} onChange={handleFormChange} required 
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 transition-all shadow-sm" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-3">Vegetatsiya Davri</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">Ekish Sanasi</label>
              <input 
                type="date" name="start_date" value={formData.start_date} onChange={handleFormChange} required 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 cursor-pointer shadow-sm" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">O'rim-Yig'im</label>
              <input 
                type="date" name="end_date" value={formData.end_date} onChange={handleFormChange} required 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 cursor-pointer shadow-sm" 
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          {locationStatus === 'error' && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs font-medium">
              <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{locationErrorMsg}</p>
                <button type="button" onClick={getUserLocation} className="mt-1 underline font-bold hover:text-red-900">Qaytadan urinish</button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || locationStatus !== 'success'} 
            className={`w-full py-4 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-sm
              ${(locationStatus === 'success' && !loading) 
                ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-md active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse text-sm"><Activity className="w-4 h-4 animate-spin"/> AI Hisoblamoqda...</span>
            ) : locationStatus !== 'success' ? (
              <span className="flex items-center gap-2 text-sm"><Navigation className="w-4 h-4"/> GPS kutilmoqda...</span>
            ) : (
              <span className="flex items-center gap-2 text-sm tracking-wide">AI Tahlilni Boshlash <Leaf className="w-4 h-4"/></span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}