import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Sprout, AlertCircle, ShoppingBag } from 'lucide-react';

export default function VirtualAgronom() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalomu alaykum! Men sizning shaxsiy Virtual Agronomingizman 🤖. Ekinlaringiz, o'g'itlash, kasalliklar yoki sug'orish bo'yicha qanday savollaringiz bor?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Xabar qo'shilganda eng pastga avtomat tushish
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Tayyor savollar (Hakamlar ko'rishi uchun qulay tugmalar)
  const quickQuestions = [
    "Paxtamning bargi sarg'ayapti, nima qilay?",
    "Bug'doyga qachon azotli o'g'it berish kerak?",
    "Pomidorda fitoftoroz kasalligi boshlandi"
  ];

  // 🧠 XAKATON UCHUN AQLLI SIMULYATOR (MOCK LLM)
  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase();
    let response = "";

    if (text.includes("sarg'ay") || text.includes("paxta")) {
      response = "Barglarning sarg'ayishi asosan azot yetishmasligi yoki o'rgimchakkana tushgani belgisidir. Hozirgi iqlimni hisobga olib, sizga tezkor ta'sir qiluvchi **Karbamid (Azotli o'g'it)** berishni va bargidan maxsus dori sepishni tavsiya qilaman. Bularni yon menyudagi Market bo'limimizdan xarid qilishingiz mumkin! 🛒";
    } else if (text.includes("bug'doy") || text.includes("azot")) {
      response = "Kuzgi bug'doy uchun azotli o'g'itlarni asosan erta bahorda, o'simlik trubkaga chiqish fazasida berish eng samarali hisoblanadi. Gektariga 150-200 kg fiz-vaznda tavsiya etiladi. Tahlil bo'limidan yeringizdagi namlikni tekshirib oling!";
    } else if (text.includes("pomidor") || text.includes("fitoftoroz") || text.includes("kasal")) {
      response = "Fitoftoroz juda xavfli zamburug'li kasallik! Darhol sug'orishni to'xtating (namlikni kamaytiring). Tarkibida Mis (Medy) bo'lgan preparatlar, masalan **Ridomil Gold** yoki **Bordo suyuqligi** sepishni boshlang. Smart Agro AI sizga doim yordamga tayyor! 🛡️";
    } else {
      response = "Juda yaxshi savol! Yeringizning aniq tahlilini (N, P, K va pH) bilmasdan turib aniq dorini yozib berish qiyin. Iltimos, oldin 'Asosiy Panel' da yeringiz tahlilini qiling yoki Marketdan universal biostimulyatorlarni ko'rib chiqing.";
    }
    return response;
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    // 1. Foydalanuvchi xabarini qo'shish
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. AI o'ylab javob qaytarishi (1.5 soniya kutish effekti)
    setTimeout(() => {
      const aiResponseText = generateAIResponse(text);
      const newAiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 sm:p-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-green-600" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
              Virtual Agronom <Sparkles className="w-4 h-4 text-yellow-300" />
            </h1>
            <p className="text-green-100 text-xs font-medium">Sun'iy intellekt doim onlayn</p>
          </div>
        </div>
      </div>

      {/* CHAT OYNASI */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
        
        {/* Xabarlar render qilinishi */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border border-green-200">
                <Sprout className="w-5 h-5 text-green-600" />
              </div>
            )}

            <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}>
                {/* Agar tekst ichida ** qalin yozuvlar bo'lsa uni formatlash */}
                <p className="text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-semibold px-1">{msg.time}</span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 border border-slate-300">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            )}
          </div>
        ))}

        {/* AI Yozmoqda (Typing Indicator) */}
        {isTyping && (
          <div className="flex items-end gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
              <Sprout className="w-5 h-5 text-green-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* TAYYOR SAVOLLAR (Quick Actions) */}
      <div className="bg-white px-4 sm:px-6 pt-3 pb-2 flex gap-2 overflow-x-auto hide-scrollbar border-t border-slate-100">
        {quickQuestions.map((q, idx) => (
          <button 
            key={idx} 
            onClick={() => handleSend(q)}
            className="whitespace-nowrap bg-slate-100 hover:bg-green-50 text-slate-600 hover:text-green-700 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-slate-200 hover:border-green-300 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5" /> {q}
          </button>
        ))}
      </div>

      {/* XABAR YOZISH QISMI */}
      <div className="p-4 sm:p-6 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Muammongizni yozing..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium rounded-2xl pl-5 pr-14 py-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center justify-center gap-1">
            <Bot className="w-3 h-3" /> Smart Agro LLM Engine v1.0
          </p>
        </div>
      </div>
      
    </div>
  );
}