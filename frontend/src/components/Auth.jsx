import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Leaf, Loader2, ShieldCheck } from 'lucide-react';

export default function Auth({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'fermer' // Default rol
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Xatoni tozalash
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // TIZIMGA KIRISH (LOGIN)
        const res = await axios.post('http://127.0.0.1:8000/api/login', {
          email: formData.email,
          password: formData.password
        });
        onLogin(res.data.user); // App.jsx ga user ma'lumotlarini uzatamiz
      } else {
        // RO'YXATDAN O'TISH (REGISTER)
        await axios.post('http://127.0.0.1:8000/api/register', formData);
        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kiring.");
        setIsLogin(true); // Login oynasiga o'tkazish
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Xatolik yuz berdi. Server ishlayotganini tekshiring.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Orqa fon bezaklari */}
      <div className="absolute top-0 left-0 w-full h-96 bg-slate-900 rounded-b-[4rem] shadow-2xl"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-2xl shadow-lg border-2 border-green-50">
            <Leaf className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-white tracking-tight">
          {isLogin ? "Tizimga xush kelibsiz" : "Yangi hisob yaratish"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Smart Agro AI <span className="text-green-400 font-bold">Ekotizimi</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-100">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To'liq ism-sharif</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input name="fullname" type="text" required value={formData.fullname} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-green-500 transition-all" placeholder="Akmalov Rustam" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Elektron pochta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-green-500 transition-all" placeholder="admin@smartagro.uz" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Maxfiy Parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-green-500 transition-all" placeholder="••••••••" />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95 disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Tizimga Kirish" : "Ro'yxatdan O'tish")}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
              {isLogin ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" : "Allaqachon hisobingiz bormi? Tizimga kiring"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}