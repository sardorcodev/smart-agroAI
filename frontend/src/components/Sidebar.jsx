import React from 'react';
// YANGI: ShoppingCart ikonkasi qo'shildi
import { LayoutDashboard, History, User, HelpCircle, LogOut, Leaf, ShieldAlert, ShoppingCart, MessageSquare, MapPin } from 'lucide-react';

export default function Sidebar({ currentMenu, setCurrentMenu, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Asosiy Panel' },
    // YANGI: Market menyusi qo'shildi
    { id: 'market', icon: ShoppingCart, label: 'Agro Market' }, 
    { id: 'agronom', icon: MessageSquare, label: 'Virtual Agronom (AI)' },
    { id: 'history', icon: History, label: 'Sug\'orish Tarixi' },
    { id: 'support', icon: HelpCircle, label: 'Yordam / Support' },
    { id: 'map', icon: MapPin, label: 'Do\'konlar Xaritasi' },
    { id: 'admin', icon: ShieldAlert, label: 'Tizim Administratori' },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col transition-all duration-300 hidden md:flex flex-shrink-0 relative z-50 shadow-xl">
      
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50 cursor-pointer" onClick={() => setCurrentMenu('dashboard')}>
        <Leaf className="w-6 h-6 text-green-500 mr-2" />
        <h1 className="text-white font-black text-lg tracking-wide">SMART AGRO <span className="text-green-500">AI</span></h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menyu</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentMenu(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
                ${item.id === 'admin' && !isActive ? 'mt-8 border border-red-500/20 text-red-400/70 hover:bg-red-500/10 hover:text-red-400' : ''}
                ${item.id === 'admin' && isActive ? 'mt-8 border border-red-500 text-red-400 bg-red-500/10' : ''}
              `}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {item.label}
              
              {/* YANGI: Market menyusi uchun yangilik belgisi (Qizil nuqta) */}
              {(item.id === 'market') && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                  YANGI
                </span>
              )}

              {(item.id === 'support') && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-3 mb-2 flex items-center gap-3 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setCurrentMenu('profile')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            🧑‍🌾
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Fermer profil</p>
            <p className="text-[10px] text-green-400 font-bold tracking-wider uppercase truncate">PRO Tarif</p>
          </div>
        </div>
        
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          Tizimdan chiqish
        </button>
      </div>
    </aside>
  );
}