import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Home, Loader2, Database, Map, ShieldAlert } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { api, clearAuthToken, fetchCurrentUser, formatApiError, getStoredToken, setAuthFailureHandler } from './api';

// Komponentlar
import Sidebar from './components/Sidebar';
import DataInput from './components/DataInput';
import LiveSensors from './components/LiveSensors';
import AIResults from './components/AIResults';
import LandingPage from './components/LandingPage';
import OfficialReport from './components/OfficialReport';
import Profile from './components/Profile';
import Admin from './components/Admin';
import History from './components/History';
import Support from './components/Support';
import Auth from './components/Auth';
import AgroMarket from './components/AgroMarket';
import VirtualAgronom from './components/VirtualAgronom';
import AgroMap from './components/AgroMap';
import LoadingState from './components/ui/LoadingState';
import Notice from './components/ui/Notice';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentMenu, setCurrentMenu] = useState('dashboard');

  const [user, setUser] = useState(null);
  const [sessionRestoring, setSessionRestoring] = useState(() => Boolean(getStoredToken()));
  const [sessionNotice, setSessionNotice] = useState('');

  const [activeDashboardTab, setActiveDashboardTab] = useState('input');
  
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisSuccess, setAnalysisSuccess] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [reportError, setReportError] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); 
  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    n: 15, p: 78, k: 70, ph: 6.8,
    lat: null, lon: null,
    start_date: "2026-04-25", 
    end_date: "2026-08-20"
  });

  const [monitoringData, setMonitoringData] = useState({
    moisture: 30, current_temp: 25, area: 10
  });

  const resetProtectedState = useCallback(() => {
    setCurrentMenu('dashboard');
    setActiveDashboardTab('input');
    setAnalysisResult(null);
  }, []);

  const handleAuthenticatedUser = useCallback((userData) => {
    setUser(userData);
    setSessionNotice('');
    setCurrentPage('dashboard');
    setCurrentMenu(userData.role === 'admin' ? 'admin' : 'dashboard');
  }, []);

  const handleLogout = useCallback((notice = '') => {
    clearAuthToken();
    setUser(null);
    resetProtectedState();
    setSessionNotice(notice);
    setCurrentPage(notice ? 'auth' : 'landing');
  }, [resetProtectedState]);

  const getUserLocation = useCallback(() => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationErrorMsg("Brauzeringiz Geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({ ...prev, lat: position.coords.latitude, lon: position.coords.longitude }));
        setLocationStatus('success');
        setLocationErrorMsg('');
      },
      (error) => {
        setLocationStatus('error');
        setLocationErrorMsg(error.code === error.PERMISSION_DENIED ? "GPS ruxsati berilmadi." : "GPS joylashuvini aniqlab bo'lmadi.");
      }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setSessionRestoring(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!cancelled) {
          handleAuthenticatedUser(currentUser);
        }
      } catch (err) {
        if (!cancelled) {
          clearAuthToken();
          setUser(null);
          resetProtectedState();
          setSessionNotice(
            err.response?.status === 401 || err.response?.status === 403
              ? 'Sessiya muddati tugagan. Qayta tizimga kiring.'
              : 'Sessiyani tiklashda xatolik yuz berdi. Qayta tizimga kiring.'
          );
          setCurrentPage('auth');
        }
      } finally {
        if (!cancelled) {
          setSessionRestoring(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [handleAuthenticatedUser, resetProtectedState]);

  useEffect(() => {
    setAuthFailureHandler(() => {
      handleLogout('Sessiya muddati tugagan. Qayta tizimga kiring.');
    });

    return () => setAuthFailureHandler(null);
  }, [handleLogout]);

  useEffect(() => {
    if (!sessionRestoring && !user && currentPage !== 'landing' && currentPage !== 'auth') {
      resetProtectedState();
      setSessionNotice('Davom etish uchun tizimga kiring.');
      setCurrentPage('auth');
    }
  }, [currentPage, resetProtectedState, sessionRestoring, user]);

  useEffect(() => {
    if (currentPage === 'dashboard' && locationStatus === 'idle') {
      const locationTimer = window.setTimeout(() => {
        getUserLocation();
      }, 0);

      return () => window.clearTimeout(locationTimer);
    }
  }, [currentPage, locationStatus, getUserLocation]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'start_date' || name === 'end_date') ? value : (value === '' ? null : parseFloat(value));
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (name === 'lat' || name === 'lon') {
      setLocationStatus(value === '' ? 'idle' : 'success');
      setLocationErrorMsg('');
    }
    setAnalysisError('');
    setAnalysisSuccess('');
  };

  const handleMonitorChange = (e) => setMonitoringData({ ...monitoringData, [e.target.name]: parseFloat(e.target.value) });

  const useDemoLocation = () => {
    setFormData((prev) => ({ ...prev, lat: 38.861, lon: 67.93 }));
    setLocationStatus('success');
    setLocationErrorMsg("Demo koordinatalar tanlandi. Real tahlil uchun o'z joylashuvingizni kiriting.");
    setAnalysisError('');
  };

  const analyzeData = async (e) => {
    e.preventDefault();
    if (loading) return;
    const hasCoordinates = formData.lat !== null
      && formData.lat !== ''
      && formData.lon !== null
      && formData.lon !== ''
      && Number.isFinite(Number(formData.lat))
      && Number.isFinite(Number(formData.lon));

    if (!hasCoordinates) {
      setAnalysisError("Tahlil uchun latitude va longitude qiymatlarini kiriting.");
      return;
    }

    setLoading(true);
    setAnalysisError('');
    setAnalysisSuccess('');
    try {
      const reqData = { ...formData, current_soil_moisture: monitoringData.moisture, area_m2: monitoringData.area };
      const res = await api.post('/api/analyze', reqData);
      setAnalysisResult(res.data);
      setAnalysisSuccess("AI tahlil yakunlandi. Natijalar o'ng panelda yangilandi.");
      
      setActiveDashboardTab('sensors'); 
    } catch (err) {
      if (err.response?.status !== 401) {
        setAnalysisError(formatApiError(err, "AI tahlil bajarilmadi. Backend server holatini tekshiring."));
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadOfficialPDF = async () => {
    setReportMessage('');
    setReportError('');
    if (!analysisResult) {
      setReportError("PDF xisobot uchun avval AI tahlilni yakunlang.");
      return;
    }
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SmartAgro_Rasmiy_Xisobot.pdf`);
      setReportMessage("PDF xisobot yaratildi.");
    } catch {
      setReportError("Xisobotni yuklashda xatolik yuz berdi.");
    }
    setIsExporting(false);
  };

  if (sessionRestoring) {
    return (
      <LoadingState message="Sessiya tekshirilmoqda..." className="min-h-screen bg-slate-950 text-slate-300" />
    );
  }

  if (currentPage === 'landing') {
    // Tizimga kirish tugmasi bosilganda endi birdan dashboardga emas, Auth sahifasiga o'tadi
    return <LandingPage onStart={() => setCurrentPage(user ? 'dashboard' : 'auth')} />; 
  }

  // 2. Avtorizatsiya Sahifasi (Login/Register)
  if (currentPage === 'auth') {
    return (
      <Auth 
        notice={sessionNotice}
        onBack={() => {
          setSessionNotice('');
          setCurrentPage('landing');
        }}
        onLogin={handleAuthenticatedUser} 
      />
    );
  }

  if (!user) {
    return (
      <Auth
        notice={sessionNotice || 'Davom etish uchun tizimga kiring.'}
        onBack={() => {
          setSessionNotice('');
          setCurrentPage('landing');
        }}
        onLogin={handleAuthenticatedUser}
      />
    );
  }

return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden animate-in fade-in duration-500">
      
      <Sidebar 
        currentMenu={currentMenu} 
        setCurrentMenu={setCurrentMenu} 
        user={user} // Sidebarga userni beramiz
        onLogout={() => handleLogout()} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="min-h-16 bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-0 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 shrink-0 shadow-sm z-40">
          <div>
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {currentMenu === 'dashboard' ? 'Dala Boshqaruv Paneli' : 
               currentMenu === 'profile' ? 'Foydalanuvchi Profili' : 
               currentMenu === 'support' ? 'Qo\'llab-quvvatlash Markazi' : 
               currentMenu === 'history' ? 'Sug\'orish Tarixi' : 'Tizim Boshqaruvi'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Sizning hudud: <span className="text-green-600 font-bold">{locationStatus === 'success' ? 'GPS Orqali Topildi' : 'Qidirilmoqda...'}</span></p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            <select
              value={currentMenu}
              onChange={(e) => setCurrentMenu(e.target.value)}
              className="md:hidden max-w-[150px] bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Mobil menyu"
            >
              <option value="dashboard">Panel</option>
              <option value="market">Market</option>
              <option value="agronom">Agronom</option>
              <option value="history">Tarix</option>
              <option value="support">Yordam</option>
              <option value="map">Xarita</option>
              <option value="profile">Profil</option>
              {user?.role === 'admin' && <option value="admin">Admin</option>}
            </select>
            
            {/* Tepadagi ism va rol ko'rsatkichi */}
            <div className="hidden md:block text-right mr-4 border-r border-slate-200 pr-4">
              <p className="text-sm font-black text-slate-700">{user?.fullname || 'Foydalanuvchi'}</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{user?.role || 'fermer'}</p>
            </div>

            <button type="button" onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs md:text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
              <Home className="w-4 h-4" /> Bosh Sahifa
            </button>
            {currentMenu === 'dashboard' && (
              <button type="button" onClick={downloadOfficialPDF} disabled={isExporting} aria-busy={isExporting} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold text-white transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${isExporting ? 'bg-green-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'}`}>
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Download className="w-4 h-4" aria-hidden="true" />} {isExporting ? 'PDF tayyorlanmoqda...' : 'Rasmiy Xisobot (PDF)'}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
          {(reportError || reportMessage) && (
            <Notice variant={reportError ? 'error' : 'success'} className="mb-4">
              {reportError || reportMessage}
            </Notice>
          )}
          
          {currentMenu === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full pb-4">
              
              <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                <div className="flex bg-slate-100/80 p-1.5 gap-1.5 border-b border-slate-200 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setActiveDashboardTab('input')} 
                    aria-pressed={activeDashboardTab === 'input'}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeDashboardTab === 'input' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Database className="w-4 h-4"/> 1. Ma'lumot Kiritish
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveDashboardTab('sensors')} 
                    aria-pressed={activeDashboardTab === 'sensors'}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeDashboardTab === 'sensors' ? 'bg-white text-green-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Map className="w-4 h-4"/> 2. Dala va Datchiklar
                  </button>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto custom-scrollbar bg-white">
                  {activeDashboardTab === 'input' ? (
                    <DataInput
                      formData={formData}
                      handleFormChange={handleFormChange}
                      analyzeData={analyzeData}
                      loading={loading}
                      locationStatus={locationStatus}
                      locationErrorMsg={locationErrorMsg}
                      getUserLocation={getUserLocation}
                      useDemoLocation={useDemoLocation}
                      analysisError={analysisError}
                      analysisSuccess={analysisSuccess}
                    />
                  ) : (
                    <LiveSensors formData={formData} monitoringData={monitoringData} handleMonitorChange={handleMonitorChange} locationStatus={locationStatus} />
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 h-full">
                <AIResults analysisResult={analysisResult} monitoringData={monitoringData} />
              </div>

            </div>
          )}

          {currentMenu === 'profile' && <Profile user={user} />}
          {currentMenu === 'history' && <History />}
          {currentMenu === 'support' && <Support />}
          {currentMenu === 'market' && (<AgroMarket />)}
          {currentMenu === 'agronom' && <VirtualAgronom />}
          {currentMenu === 'map' && <AgroMap />}
          
          {/* FAQAT ADMIN KO'RA OLADIGAN SAHIFA */}
          {currentMenu === 'admin' && (
            user?.role === 'admin' ? (
              <Admin />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-700 mb-2">Kirish Rad Etildi</h2>
                <p className="text-sm font-medium">Bu sahifa faqat Vazirlik va Tizim Administratorlari uchun mo'ljallangan.</p>
              </div>
            )
          )}
        </main>
        
        {currentMenu === 'dashboard' && (
          <OfficialReport ref={reportRef} formData={formData} monitoringData={monitoringData} analysisResult={analysisResult} />
        )}
      </div>
    </div>
  );
}

export default App;
