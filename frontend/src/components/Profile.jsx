import React from 'react';
import { User, Mail, ShieldCheck, MapPin, Calendar, Award, CheckCircle, Leaf, Camera, Sprout, Building2, Lock, Settings, Download } from 'lucide-react';

export default function Profile({ user }) {
  // Agar ma'lumot yetib kelmasa (xavfsizlik uchun)
  if (!user) return <div className="p-8 text-center text-slate-500 bg-slate-50 h-screen">Yuklanmoqda...</div>;

  const isAdmin = user.role === 'admin';

  // Xakaton uchun test ma'lumotlari
  const stats = {
    totalCrops: 4,
    activeSensors: 1,
    waterSaved: 102
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 min-h-screen overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. YUQORI QISM: Fon va Asosiy Ma'lumotlar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6 relative">
        
        {/* Orqa fon (Yorqin Yashil Gradient Banner - CSS yordamida, internetsiz ham ishlaydi) */}
        <div className="h-32 w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">
          <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="px-8 pb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 relative -mt-12 z-10">
          {/* Avatar */}
          <div className="relative w-28 h-28 rounded-full bg-white p-1.5 shadow-md border border-slate-100 shrink-0 group">
            <div className={`w-full h-full rounded-full flex items-center justify-center ${isAdmin ? 'bg-slate-100 text-slate-600' : 'bg-green-50 text-green-600'}`}>
              <User className="w-12 h-12" />
            </div>
            {/* Rasm almashtirish tugmasi */}
            <button className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white shadow-md hover:bg-green-700 transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 border-2 border-white">
                <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Ism va Rol */}
          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight capitalize">{user.fullname || 'Foydalanuvchi'}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isAdmin ? (
                <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border border-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" /> Vazirlik Nazoratchisi
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border border-green-200">
                  <Sprout className="w-3.5 h-3.5 text-green-600" /> Smart Agro Fermer
                </span>
              )}
               <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Faol Akkaunt
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. O'RTANCHI QISM: Statistika va Ma'lumotlar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chap ustun: Statistika va Profil ma'lumotlari */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 2a. Tezkor Statistika */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 border border-blue-100">
                        <Leaf className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.totalCrops}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jami Ekinlar</p>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-xl text-green-600 border border-green-100">
                        <Settings className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.activeSensors}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Datchiklar</p>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600 border border-cyan-100">
                        <Download className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{stats.waterSaved} <span className="text-sm text-slate-500 font-semibold">Litr</span></p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Suv Tejaldi</p>
                    </div>
                </div>
            </div>

            {/* 2b. Shaxsiy ma'lumotlar kartasi */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-400" /> Profil Tafsilotlari
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">To'liq ism</p>
                    <p className="font-semibold text-slate-700 text-base capitalize">{user.fullname || 'Foydalanuvchi'}</p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Elektron pochta</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" /> {user.email || 'noma\'lum'}
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tizimdagi Rol</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700 capitalize">
                    <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-red-500' : 'text-green-500'}`} /> {user.role || 'noma\'lum'}
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ro'yxatdan o'tgan sana</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" /> {new Date().toLocaleDateString('uz-UZ')}
                    </div>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hudud / Manzil</p>
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400" /> {isAdmin ? 'Toshkent, Vazirlik binosi' : 'Surxondaryo, O\'zbekiston'}
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* O'ng ustun: Obuna va Harakatlar */}
        <div className="space-y-6">
            
          {/* Obuna kartasi */}
          <div className={`rounded-3xl shadow-sm border p-8 ${isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isAdmin ? 'text-white' : 'text-slate-800'}`}>
              <Award className={`w-5 h-5 ${isAdmin ? 'text-slate-400' : 'text-green-600'}`} /> Akkaunt Tarifi
            </h3>
            
            <div className="mb-6 flex items-baseline gap-2">
              <span className={`text-4xl font-black ${isAdmin ? 'text-white' : 'text-green-700'}`}>
                {isAdmin ? 'ENTERPRISE' : 'PRO'}
              </span>
            </div>

            <p className={`text-sm mb-6 font-medium ${isAdmin ? 'text-slate-400' : 'text-green-700/80'}`}>
                {isAdmin ? 'Butun respublika bo\'yicha tahlillar va cheklanmagan boshqaruv huquqi.' : 'Barcha AI tahlil xizmatlari, avtomatik sug\'orish va rasmiy xisobotlar yoniq.'}
            </p>

            <button className={`w-full py-3 px-4 rounded-xl font-bold transition-all text-sm tracking-wide ${isAdmin ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'}`}>
              {isAdmin ? 'Tizimni Boshqarish' : 'Tarifni Yangilash'}
            </button>
          </div>

          {/* Harakatlar kartasi */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Xavfsizlik</h3>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-100 transition-all">
                    <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-blue-500"/>
                        <span className="font-semibold text-sm">Parolni O'zgartirish</span>
                    </div>
                </button>
                <button className="w-full flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-100 hover:border-red-100 transition-all">
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4"/>
                        <span className="font-semibold text-sm">Tizimdan Chiqish</span>
                    </div>
                </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}