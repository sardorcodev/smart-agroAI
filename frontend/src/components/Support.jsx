import React from 'react';
import { MessageSquare, PhoneCall, Send, HelpCircle, Bot, Mail, ChevronDown } from 'lucide-react';

export default function Support() {
  const faqs = [
    { q: "Datchiklar offlayn bo'lib qolsa nima bo'ladi?", a: "Tizim avtomatik ravishda so'nggi ma'lumotlar va ochiq ob-havo API (FastAPI) orqali ishlashda davom etadi." },
    { q: "Oylik to'lovni qanday amalga oshiraman?", a: "Profil bo'limidan Payme yoki Click orqali PRO tarifni faollashtirishingiz mumkin." },
    { q: "AI noto'g'ri ekin tavsiya qilsa-chi?", a: "AI faqatgina NPK, pH va mavsumiy iqlim asosida biologik ehtimollikni aytadi. Yakuniy qarorni Agronom va siz qabul qilasiz." }
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-3xl font-black mb-2">Qanday yordam bera olamiz?</h2>
        <p className="text-blue-100 max-w-lg">Smart Agro AI mutaxassislari sizga yordam berishga doim tayyor. Savollaringizni yozib qoldiring yoki qo'llanmalar bilan tanishing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><MessageSquare className="text-blue-500"/> Chipta (Ticket) Ochish</h3>
            
            <form className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1 uppercase">Mavzu</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-semibold outline-none focus:border-blue-500">
                  <option>Datchik ishlashida muammo</option>
                  <option>To'lov masalalari</option>
                  <option>Agronom maslahati</option>
                  <option>Boshqa...</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1 uppercase">Xabar matni</label>
                <textarea rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-none" placeholder="Muammoni batafsil ta'riflang..."></textarea>
              </div>
              <button type="button" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all">
                Xabarni Yuborish <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center hover:bg-blue-100 transition-colors cursor-pointer">
              <Bot className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Telegram Bot</h4>
              <p className="text-xs text-slate-500">24/7 Avtomatik yordam</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center hover:bg-green-100 transition-colors cursor-pointer">
              <PhoneCall className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Call Markaz</h4>
              <p className="text-xs text-slate-500">10:00 - 18:00 gacha</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><HelpCircle className="text-orange-500"/> Ko'p Beriladigan Savollar</h3>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-100 rounded-xl overflow-hidden">
                <button className="w-full bg-slate-50 p-4 text-left flex justify-between items-center hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-slate-700 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
                <div className="p-4 bg-white border-t border-slate-50">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
            <Mail className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Hamkorlik uchun:</p>
            <a href="mailto:info@smartagro.uz" className="text-blue-500 font-bold hover:underline">info@smartagro.uz</a>
          </div>
        </div>

      </div>
    </div>
  );
}