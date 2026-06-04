import React from 'react';
import { Activity, Leaf, AlertOctagon, Navigation, MapPin } from 'lucide-react';
import Notice from './ui/Notice';

export default function DataInput({
  formData,
  handleFormChange,
  analyzeData,
  loading,
  locationStatus,
  locationErrorMsg,
  getUserLocation,
  useDemoLocation,
  analysisError,
  analysisSuccess,
}) {
  const hasLocation = formData.lat !== null
    && formData.lat !== ''
    && formData.lon !== null
    && formData.lon !== ''
    && Number.isFinite(Number(formData.lat))
    && Number.isFinite(Number(formData.lon));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <form onSubmit={analyzeData} className="flex flex-col flex-1 gap-5">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-600 text-[11px] uppercase tracking-wider mb-3">Tuproq Tarkibi (NPK & pH)</h3>
          <div className="grid grid-cols-2 gap-4">
            {['n', 'p', 'k', 'ph'].map((field) => (
              <div key={field}>
                <label htmlFor={`farm-${field}`} className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">
                  {field === 'n' ? 'Azot (N)' : field === 'p' ? 'Fosfor (P)' : field === 'k' ? 'Kaliy (K)' : 'pH darajasi'}
                </label>
                <input 
                  id={`farm-${field}`}
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
              <label htmlFor="farm-start-date" className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">Ekish Sanasi</label>
              <input 
                id="farm-start-date"
                type="date" name="start_date" value={formData.start_date} onChange={handleFormChange} required 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 cursor-pointer shadow-sm" 
              />
            </div>
            <div>
              <label htmlFor="farm-end-date" className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">O'rim-Yig'im</label>
              <input 
                id="farm-end-date"
                type="date" name="end_date" value={formData.end_date} onChange={handleFormChange} required 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 cursor-pointer shadow-sm" 
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="mb-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-slate-600 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-green-600" /> Joylashuv
              </h3>
              <button type="button" onClick={getUserLocation} className="text-[11px] font-black text-green-700 hover:text-green-900 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">
                GPS orqali topish
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="farm-lat" className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">Latitude</label>
                <input
                  id="farm-lat"
                  type="number"
                  step="0.000001"
                  name="lat"
                  value={formData.lat ?? ''}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 transition-all shadow-sm"
                  placeholder="38.86"
                />
              </div>
              <div>
                <label htmlFor="farm-lon" className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wide">Longitude</label>
                <input
                  id="farm-lon"
                  type="number"
                  step="0.000001"
                  name="lon"
                  value={formData.lon ?? ''}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white font-bold text-slate-700 transition-all shadow-sm"
                  placeholder="67.92"
                />
              </div>
            </div>
            <button type="button" onClick={useDemoLocation} className="mt-3 text-[11px] font-bold text-slate-500 hover:text-slate-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">
              Demo koordinatalardan foydalanish
            </button>
          </div>

          {locationStatus === 'error' && (
            <Notice variant="warning" className="mb-3 flex items-start gap-2 text-xs font-medium">
              <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{locationErrorMsg}</p>
                <p className="mt-1">GPS ishlamasa, koordinatani qo'lda kiriting yoki demo koordinatalarni tanlang.</p>
              </div>
            </Notice>
          )}

          {analysisError && (
            <Notice variant="error" className="mb-3 flex items-start gap-2 text-xs">
              <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{analysisError}</p>
            </Notice>
          )}

          {analysisSuccess && (
            <Notice variant="success" className="mb-3 text-xs">
              {analysisSuccess}
            </Notice>
          )}

          <button 
            type="submit" 
            disabled={loading || !hasLocation} 
            aria-busy={loading}
            aria-describedby={!hasLocation ? 'location-required-help' : undefined}
            className={`w-full py-4 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-sm
              ${(hasLocation && !loading) 
                ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-md active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse text-sm"><Activity className="w-4 h-4 animate-spin" aria-hidden="true"/> AI Hisoblamoqda...</span>
            ) : !hasLocation ? (
              <span className="flex items-center gap-2 text-sm"><Navigation className="w-4 h-4"/> Joylashuv kiriting</span>
            ) : (
              <span className="flex items-center gap-2 text-sm tracking-wide">AI Tahlilni Boshlash <Leaf className="w-4 h-4"/></span>
            )}
          </button>
          {!hasLocation && (
            <p id="location-required-help" className="sr-only">Tahlilni boshlash uchun latitude va longitude qiymatlari kerak.</p>
          )}
        </div>

      </form>
    </div>
  );
}
