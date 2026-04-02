import React from 'react';
import { Leaf, Droplets, Cpu, BarChart3, ArrowRight, CheckCircle2, Globe2, ShieldCheck, Zap, Code, Presentation, Server } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden selection:bg-green-200 selection:text-green-900">
      
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2.5 rounded-xl shadow-lg shadow-green-500/20">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">SMART AGRO <span className="text-green-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500">
            <a href="#home" className="hover:text-green-600 transition-colors">Bosh Sahifa</a>
            <a href="#about" className="hover:text-green-600 transition-colors">Biz Haqimizda</a>
            <a href="#pricing" className="hover:text-green-600 transition-colors">Tariflar</a>
            <a href="#team" className="hover:text-green-600 transition-colors">Jamoa</a>
          </div>
          <button onClick={onStart} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-2 group relative z-10">
            Tizimga kirish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>
      </nav>

      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 min-h-screen flex items-center justify-center bg-[url('/nature-bg.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden border-b-4 border-green-500">
        
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob z-0"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob z-0" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-green-300 font-bold text-xs uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md shadow-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            Milliy AI-Xakaton 2026 - SURXONDARYO
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tight drop-shadow-2xl">
            Dehqonchilikni <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Sun'iy Intellekt</span> bilan boshqaring.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Tuproq tahlili, jonli iqlim monitoringi va aqlli sug'orish tizimi yordamida hosildorlikni 40% ga oshiring va suv resurslarini 30-60% gacha tejang.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={onStart} className="w-full sm:w-auto px-10 py-5 bg-green-500 hover:bg-green-600 text-slate-950 rounded-full font-black text-xl shadow-2xl shadow-green-500/30 transition-all hover:-translate-y-1.5 flex items-center justify-center gap-2.5 uppercase tracking-wider">
              Boshqaruv Paneli <ArrowRight className="w-6 h-6"/>
            </button>
            <a href="#about" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full font-bold text-xl transition-all text-center hover:shadow-lg">
              Loyihani o'rganish
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">Nega aynan Smart Agro?</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              O'zbekistonda chuchuk suv zaxiralarining 90% qishloq xo'jaligiga sarflanadi va uning katta qismi an'anaviy, ko'r-ko'rona sug'orish oqibatida isrof bo'ladi. 
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Bizning missiyamiz — FAO standartlarini XGBoost Machine Learning bilan birlashtirib, fermerlarga "qachon va qancha" suv quyish kerakligini matematik aniqlikda aytib beruvchi ekotizim yaratish.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <Globe2 className="w-8 h-8 text-blue-500 mb-3"/>
                <h4 className="font-black text-xl text-slate-800 mb-1">Eko-Tizim</h4>
                <p className="text-sm text-slate-500 font-medium">Tabiatni asrash va yer unumdorligini oshirish.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <BarChart3 className="w-8 h-8 text-orange-500 mb-3"/>
                <h4 className="font-black text-xl text-slate-800 mb-1">ROI +40%</h4>
                <p className="text-sm text-slate-500 font-medium">Elektr va suvdan iqtisod, sof foydani oshirish.</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="aspect-square bg-gradient-to-tr from-green-50 to-blue-50 rounded-[3rem] p-8 relative overflow-hidden shadow-sm border border-slate-200/50">
              <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply opacity-10 blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply opacity-10 blur-2xl"></div>
              <div className="h-full w-full bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl p-6 sm:p-8 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-5 mb-8 border-b border-slate-100 pb-8 hover:translate-x-2 transition-transform cursor-default">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm"><Droplets className="w-8 h-8 text-blue-600"/></div>
                  <div><p className="font-black text-xl text-slate-800 mb-1">Suv sarfi nazorati</p><p className="text-slate-500 text-sm font-medium">Jonli IoT datchiklar yordamida</p></div>
                </div>
                <div className="flex items-center gap-5 mb-8 border-b border-slate-100 pb-8 hover:translate-x-2 transition-transform cursor-default">
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm"><Cpu className="w-8 h-8 text-orange-600"/></div>
                  <div><p className="font-black text-xl text-slate-800 mb-1">AI Iqlim Tahlili</p><p className="text-slate-500 text-sm font-medium">Oxirgi 10 yillik arxiv ma'lumotlari orqali</p></div>
                </div>
                <div className="flex items-center gap-5 hover:translate-x-2 transition-transform cursor-default">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm"><Leaf className="w-8 h-8 text-green-600"/></div>
                  <div><p className="font-black text-xl text-slate-800 mb-1">Ekin Tavsiyasi (ML)</p><p className="text-slate-500 text-sm font-medium">N-P-K va pH ko'rsatkichlari asosida</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-50 relative border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Moslashuvchan Biznes Model</h2>
            <p className="text-slate-500 text-lg font-medium">Platformamiz barcha turdagi mijozlar — kichik fermerlardan tortib yirik davlat klasterlarigacha moslashtirilgan.</p>
          </div>
          {/* Tariflar */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mb-2">B2C • Kichik Fermer</p>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Boshlang'ich</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900">0</span><span className="text-slate-500 font-bold text-sm">So'm</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/> Platforma bilan tanishish</li>
                <li className="flex items-start gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/> 10 yillik ochiq ob-havo API integratsiyasi</li>
                <li className="flex items-start gap-3 text-slate-400 font-medium text-sm opacity-60"><ShieldCheck className="w-5 h-5 text-slate-300 shrink-0"/> Avtomatik nasos va IoT datchik ulanmaydi</li>
              </ul>
              <button onClick={onStart} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors border border-slate-200">Sinab ko'rish</button>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border-2 border-green-500 shadow-2xl shadow-green-500/20 relative transform md:-translate-y-4 flex flex-col z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-green-500/30">Eng foydali</div>
              <p className="text-green-400 font-bold tracking-widest uppercase text-[10px] mb-2">B2B • Yirik Fermerlar va Klasterlar</p>
              <h4 className="text-xl font-black text-white mb-2">Bir martalik to'lov</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">49 990</span><span className="text-slate-400 font-bold text-sm">So'm</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-300 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0"/> Haqiqiy IoT Datchik ulash va vizualizatsiya</li>
                <li className="flex items-start gap-3 text-slate-300 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0"/> AI orqali suv ehtiyojini hisoblash va nasos boshqaruvi</li>
                <li className="flex items-start gap-3 text-slate-300 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0"/> Qishloq xo'jaligi vazirligi uchun avto-PDF xisobot</li>
                <li className="flex items-start gap-3 text-slate-300 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-green-400 shrink-0"/> AI orqali ekin o'g'itlar bo'yicha chatbot yordami</li>
              </ul>
              <button onClick={onStart} className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-slate-900 font-black rounded-xl transition-colors shadow-lg shadow-green-500/20 hover:-translate-y-0.5">Sotib olish</button>
            </div>

            <div className="bg-gray-300 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <p className="text-blue-500 font-bold tracking-widest uppercase text-[10px] mb-2">B2B • Agro-Marketlar uchun</p>
              <h3 className="text-2xl font-black text-green-600 mb-2">Agro-Servis</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-2xl font-black text-slate-900">Tuproq tahlili va IoT qurilmalar</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0"/> Marketlardagi mobil labaratoriya orqali aniq N P K pH tahlili</li>
                <li className="flex items-start gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0"/> "Super Admin" boshqaruv paneli</li>
                <li className="flex items-start gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0"/> Umumiy nazorati tizimi integratsiyasi</li>
              </ul>
              <button className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors border border-slate-200">Hamkorlik qilish</button>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-24 bg-white border-t border-slate-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Loyiha Asoschilari</h2>
            <p className="text-slate-500 text-lg font-medium">Texnologiya, sun'iy intellekt va dizaynni birlashtirgan kuchli jamoa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            
            {/* Sardorbek - Full-Stack Developer */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-36 h-36 mb-6 rounded-full overflow-hidden bg-slate-50 shadow-xl shadow-slate-200/50 border-4 border-white group-hover:border-green-400 transition-all duration-300 relative">
                <img src="../public/sardor.jpg" alt="Sardorbek Musurmonov" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-1 right-1 bg-slate-900 p-2 rounded-full shadow-md"><Code className="w-3.5 h-3.5 text-white" /></div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Sardorbek</h3>
              <p className="text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-widest mt-2 mb-4 border border-green-100">Team Lead & Full-Stack</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">Loyiha arxitektori. React (Vite) frontend interfeysi, FastAPI asinxron backend va SQLite ma'lumotlar bazasini yaratish bo'yicha mas'ul.</p>
            </div>

            {/* Dildora - UI/UX & QA (Markazda, qiz bola) */}
            <div className="flex flex-col items-center text-center group md:-translate-y-6">
              <div className="w-36 h-36 mb-6 rounded-full overflow-hidden bg-slate-50 shadow-xl shadow-slate-200/50 border-4 border-white group-hover:border-blue-400 transition-all duration-300 relative">
                <img src="../public/dildora.jpg" alt="Qarshiyeva Dildora" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full shadow-md"><Presentation className="w-3.5 h-3.5 text-white" /></div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Dildora</h3>
              <p className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-widest mt-2 mb-4 border border-blue-100">UI/UX Dizayner</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">Tizimning foydalanuvchi interfeysini loyihalash (UI/UX), ranglar palitrasi moslashuvi va yakuniy sifat nazorati.</p>
            </div>

            {/* Muhammad - AI & Business */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-36 h-36 mb-6 rounded-full overflow-hidden bg-slate-50 shadow-xl shadow-slate-200/50 border-4 border-white group-hover:border-purple-400 transition-all duration-300 relative">
                <img src="../public/muhammad.jpg" alt="Muhammad Safarov" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full shadow-md"><Server className="w-3.5 h-3.5 text-white" /></div>
              </div>
              <h3 className="text-2xl font-black text-slate-800">Muhammad</h3>
              <p className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-widest mt-2 mb-4 border border-purple-100">AI Muhandis & Biznes</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">XGBoost sun'iy intellekt modelini o'qitish (Machine Learning), startapning monetizatsiya va biznes modelini (B2B/SaaS) ishlab chiqish.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 py-10 relative overflow-hidden">
        {/* Orqa fondagi katta yozuv effekti */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
          SMART AGRO
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-2">
             <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
               <Leaf className="w-4 h-4 text-green-500" />
             </div>
             <span className="text-lg font-black tracking-tight text-white">Smart Agro <span className="text-green-500">AI</span></span>
          </div>

          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            © 2026 SURXONDARYO XAKATONI UCHUN.
          </div>

          <div className="flex items-center gap-4 font-mono text-xs font-bold text-slate-400">
            <a href="https://github.com/sarmuh" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-green-400 transition-colors flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="text-slate-600">GH</span> @sarmuh
            </a>
            <a href="https://github.com/sardorcodev" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-green-400 transition-colors flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="text-slate-600">GH</span> @sardorcodev
            </a>
            <a href="https://t.me/Qarshiyeva_Dildora" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-blue-400 transition-colors flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
              <span className="text-slate-600">TG</span> @dildora
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
}