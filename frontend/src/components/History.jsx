import React from 'react';
import { Calendar, Droplets, CheckCircle, Clock, Filter, ChevronDown, DollarSign, Leaf, History as HistoryIcon } from 'lucide-react';

export default function History() {
  const historyData = [
    { id: 1, date: 'Bugun, 08:30', duration: '45 daqiqa', water: 120, saved: 45, status: 'Muvaffaqiyatli', type: 'Avto (AI)' },
    { id: 2, date: 'Kecha, 19:15', duration: '30 daqiqa', water: 80, saved: 30, status: 'Muvaffaqiyatli', type: 'Avto (AI)' },
    { id: 3, date: '26 Mart, 06:00', duration: '60 daqiqa', water: 150, saved: 0, status: 'Muvaffaqiyatli', type: 'Qo\'lda (Manual)' },
    { id: 4, date: '24 Mart, 18:45', duration: '40 daqiqa', water: 110, saved: 40, status: 'Muvaffaqiyatli', type: 'Avto (AI)' },
    { id: 5, date: '22 Mart, 07:20', duration: '0 daqiqa', water: 0, saved: 150, status: 'Bekor qilingan (Yomg\'ir)', type: 'AI Ob-havo' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><HistoryIcon className="text-blue-500 w-6 h-6" /> Sug'orish Tarixi Jurnali</h2>
          <p className="text-slate-500 text-sm mt-1">O'tgan 30 kun ichidagi barcha nasos faolligi va iqtisod qilingan resurslar.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
          <Calendar className="w-4 h-4" /> Mart, 2026 <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-md border border-blue-400">
          <Droplets className="w-6 h-6 mb-3 text-blue-200" />
          <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Jami Sarflangan Suv</p>
          <h3 className="text-3xl font-black mt-1">4,250 <span className="text-sm font-medium">Litr</span></h3>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white shadow-md border border-green-400">
          <Leaf className="w-6 h-6 mb-3 text-green-200" />
          <p className="text-xs font-bold text-green-100 uppercase tracking-wider">Jami Tejalgan Suv</p>
          <h3 className="text-3xl font-black mt-1">1,840 <span className="text-sm font-medium">Litr</span></h3>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl text-white shadow-md border border-slate-700">
          <DollarSign className="w-6 h-6 mb-3 text-slate-400" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moliyaviy Iqtisod</p>
          <h3 className="text-3xl font-black mt-1">92,000 <span className="text-sm font-medium text-green-400">So'm</span></h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-700">So'nggi amaliyotlar</h3>
          <button className="text-slate-500 hover:text-slate-800"><Filter className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Sana va Vaqt</th>
                <th className="px-6 py-4">Boshqaruv Turi</th>
                <th className="px-6 py-4">Davomiylik</th>
                <th className="px-6 py-4 text-blue-600">Sarflangan</th>
                <th className="px-6 py-4 text-green-600">Tejalgan (AI)</th>
                <th className="px-6 py-4">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {historyData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" /> {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.type.includes('AI') ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{row.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-blue-600">{row.water > 0 ? `${row.water} L` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-green-600">{row.saved > 0 ? `+${row.saved} L` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-1.5 ${row.status.includes('Bekor') ? 'text-orange-500' : 'text-green-500'}`}>
                      <CheckCircle className="w-4 h-4" /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}