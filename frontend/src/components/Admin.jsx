import React from 'react';
import { Users, Droplets, Zap, TrendingUp, ShieldAlert, CheckCircle, MapPin, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const statsData = [
    { month: 'Yanvar', tejalgan_suv: 4500 },
    { month: 'Fevral', tejalgan_suv: 5200 },
    { month: 'Mart', tejalgan_suv: 7800 },
    { month: 'Aprel', tejalgan_suv: 0 },
    { month: 'May', tejalgan_suv: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><ShieldAlert className="text-red-500" /> Boshqaruv Markazi (Super Admin)</h2>
          <p className="text-slate-400 text-sm mt-1">O'zbekiston bo'yicha barcha ulangan fermer xo'jaliklari va IoT datchiklar holati.</p>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-inner">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          Tizim 100% Barqaror
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Faol Fermerlar</p>
            <h3 className="text-2xl font-black text-slate-800">1,245 <span className="text-sm font-bold text-green-500">+12%</span></h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-cyan-100 p-3 rounded-xl"><Droplets className="w-6 h-6 text-cyan-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Tejalgan Suv (Jami)</p>
            <h3 className="text-2xl font-black text-slate-800">17.5M <span className="text-sm font-bold text-slate-500">Litr</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-xl"><Zap className="w-6 h-6 text-orange-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Ishlayotgan Nasoslar</p>
            <h3 className="text-2xl font-black text-slate-800">892 <span className="text-sm font-bold text-slate-500">ta jonli</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl"><TrendingUp className="w-6 h-6 text-green-600" /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Oylik Daromad (SaaS)</p>
            <h3 className="text-2xl font-black text-slate-800">248M <span className="text-sm font-bold text-slate-500">so'm</span></h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 className="text-slate-400"/> Respublika bo'yicha Suv Tejamkorligi (Kub.m)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="tejalgan_suv" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-orange-500"/> Jonli Datchiklar Holati</h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <div>
                  <p className="text-sm font-bold text-slate-700">Fermer ID: #8842</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Toshkent vil.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">Nasos: ON</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <div>
                  <p className="text-sm font-bold text-slate-700">Fermer ID: #2109</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Buxoro vil.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">Kutish rejimi</span>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <div>
                  <p className="text-sm font-bold text-red-700">Fermer ID: #9931</p>
                  <p className="text-[10px] text-red-500 flex items-center gap-1">Datchik uzildi!</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded shadow-sm">Tekshirish</button>
            </div>
          </div>
          
          <button className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-lg transition-colors">
            Barchasini ko'rish
          </button>
        </div>

      </div>
    </div>
  );
}