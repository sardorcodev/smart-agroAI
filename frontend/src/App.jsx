import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, Home, Loader2, Database, Map, ShieldAlert } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentMenu, setCurrentMenu] = useState('dashboard');

  const [user, setUser] = useState(null);
  

  const [activeDashboardTab, setActiveDashboardTab] = useState('input');
  
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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

  useEffect(() => {
    if (currentPage === 'dashboard' && locationStatus === 'idle') {
      getUserLocation();
    }
  }, [currentPage]);

  const getUserLocation = () => {
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
      },
      (error) => {
        setLocationStatus('error');
        setLocationErrorMsg(error.code === error.PERMISSION_DENIED ? "GPS xatosi." : "GPS xatosi.");
      }
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === 'start_date' || name === 'end_date') ? value : parseFloat(value);
    setFormData({ ...formData, [name]: newValue });
  };

  const handleMonitorChange = (e) => setMonitoringData({ ...monitoringData, [e.target.name]: parseFloat(e.target.value) });

  const analyzeData = async (e) => {
    e.preventDefault();
    if (locationStatus !== 'success' || !formData.lat || !formData.lon) return;

    setLoading(true);
    try {
      const reqData = { ...formData, current_soil_moisture: monitoringData.moisture, area_m2: monitoringData.area };
      const res = await axios.post('http://127.0.0.1:8000/api/analyze', reqData);
      setAnalysisResult(res.data);
      
      setActiveDashboardTab('sensors'); 
    } catch (error) {
      alert("Xatolik! FastAPI server ishlayotganini tekshiring.");
    }
    setLoading(false);
  };

  const downloadOfficialPDF = async () => {
    if (!analysisResult) {
      alert("Iltimos, PDF xisobot yuklashdan oldin AI Tahlilni yakunlang."); return;
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
    } catch (error) {
      alert("Xisobotni yuklashda xatolik yuz berdi.");
    }
    setIsExporting(false);
  };

  if (currentPage === 'landing') {
    // Tizimga kirish tugmasi bosilganda endi birdan dashboardga emas, Auth sahifasiga o'tadi
    return <LandingPage onStart={() => setCurrentPage('auth')} />; 
  }

  // 2. Avtorizatsiya Sahifasi (Login/Register)
  if (currentPage === 'auth') {
    return (
      <Auth 
        onBack={() => setCurrentPage('landing')}
        onLogin={(userData) => {
          setUser(userData); // Foydalanuvchi ma'lumotlarini saqlaymiz (id, ism, email, rol)
          setCurrentPage('dashboard');
          
          // ROLE-BASED ACCESS (Roli asosida menyuni ochish)
          if (userData.role === 'admin') {
            setCurrentMenu('admin'); // Admin bo'lsa birdaniga Admin panelga
          } else {
            setCurrentMenu('dashboard'); // Fermer bo'lsa Dala paneliga
          }
        }} 
      />
    );
  }

return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden animate-in fade-in duration-500">
      
      <Sidebar 
        currentMenu={currentMenu} 
        setCurrentMenu={setCurrentMenu} 
        user={user} // Sidebarga userni beramiz
        onLogout={() => {
          setUser(null);
          setCurrentPage('landing');
        }} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-40">
          <div>
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {currentMenu === 'dashboard' ? 'Dala Boshqaruv Paneli' : 
               currentMenu === 'profile' ? 'Foydalanuvchi Profili' : 
               currentMenu === 'support' ? 'Qo\'llab-quvvatlash Markazi' : 
               currentMenu === 'history' ? 'Sug\'orish Tarixi' : 'Tizim Boshqaruvi'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Sizning hudud: <span className="text-green-600 font-bold">{locationStatus === 'success' ? 'GPS Orqali Topildi' : 'Qidirilmoqda...'}</span></p>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Tepadagi ism va rol ko'rsatkichi */}
            <div className="hidden md:block text-right mr-4 border-r border-slate-200 pr-4">
              <p className="text-sm font-black text-slate-700">{user?.fullname || 'Foydalanuvchi'}</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{user?.role || 'fermer'}</p>
            </div>

            <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-200 transition-all">
              <Home className="w-4 h-4" /> Bosh Sahifa
            </button>
            {currentMenu === 'dashboard' && (
              <button onClick={downloadOfficialPDF} disabled={isExporting} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-sm ${isExporting ? 'bg-green-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'}`}>
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Rasmiy Xisobot (PDF)
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
          
          {currentMenu === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full pb-4">
              
              <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                <div className="flex bg-slate-100/80 p-1.5 gap-1.5 border-b border-slate-200 shrink-0">
                  <button 
                    onClick={() => setActiveDashboardTab('input')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeDashboardTab === 'input' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Database className="w-4 h-4"/> 1. Ma'lumot Kiritish
                  </button>
                  <button 
                    onClick={() => setActiveDashboardTab('sensors')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300
                      ${activeDashboardTab === 'sensors' ? 'bg-white text-green-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <Map className="w-4 h-4"/> 2. Dala va Datchiklar
                  </button>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto custom-scrollbar bg-white">
                  {activeDashboardTab === 'input' ? (
                    <DataInput formData={formData} handleFormChange={handleFormChange} analyzeData={analyzeData} loading={loading} locationStatus={locationStatus} locationErrorMsg={locationErrorMsg} getUserLocation={getUserLocation} />
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