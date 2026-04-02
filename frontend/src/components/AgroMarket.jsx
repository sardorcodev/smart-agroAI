import { Check, Filter, Package, Plus, Search, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

// 1. Dastlabki Mahsulotlar Bazasi (Hakamlar uchun zo'r ro'yxat)
const PRODUCTS = [
  { id: 1, name: "Elita Paxta Urug'i (Buxoro-102)", category: "Urug'lar", price: 120000, rating: 4.8, reviews: 124, image: "/1.png", badge: "Top Sotuv" },
  { id: 2, name: "Fosforli O'g'it (Ammofos 46%)", category: "O'g'itlar", price: 250000, rating: 4.9, reviews: 89, image: "/2.png", badge: "Aksiyada" },
  { id: 3, name: "Smart Tuproq Namligi Datchigi (Wi-Fi)", category: "Smart Agro", price: 450000, rating: 5.0, reviews: 42, image: "/3.png", badge: "Yangi" },
  { id: 4, name: "Tomchilatib Sug'orish Shlangi (100m)", category: "Texnika", price: 180000, rating: 4.7, reviews: 210, image: "/4.png" },
  { id: 5, name: "Kaliy Xlorid O'g'iti", category: "O'g'itlar", price: 210000, rating: 4.6, reviews: 67, image: "/5.png" },
  { id: 6, name: "Avtomatik Nasos Boshqaruvchisi", category: "Smart Agro", price: 850000, rating: 4.9, reviews: 31, image: "/6.png", badge: "Premium" },
  { id: 7, name: "Kuzgi Bug'doy Urug'i (Super Elita)", category: "Urug'lar", price: 95000, rating: 4.8, reviews: 156, image: "/7.png" },
  { id: 8, name: "Fermer Himoya Kiyimi", category: "Texnika", price: 150000, rating: 4.5, reviews: 45, image: "/8.png" },
];

const CATEGORIES = ["Barchasi", "Urug'lar", "O'g'itlar", "Smart Agro", "Texnika"];

export default function AgroMarket() {
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [addedItems, setAddedItems] = useState({});

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === "Barchasi" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
    
    setAddedItems({ ...addedItems, [product.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-slate-50 min-h-screen p-6 rounded-3xl font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Package className="text-green-600 w-8 h-8" /> Smart Agro Market
          </h1>
          <p className="text-sm text-slate-500 mt-1">Sizning hosilingiz uchun eng yaxshi vositalar</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative bg-slate-100 p-3 rounded-xl cursor-pointer hover:bg-slate-200 transition">
            <ShoppingCart className="text-slate-700 w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-slate-500 font-bold uppercase">Jami summa:</p>
            <p className="text-lg font-black text-green-700">{formatPrice(cartTotal)}</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95">
            Xarid qilish
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Mahsulot qidirish (masalan: O'g'it yoki Urug')..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-sm
                ${activeCategory === category 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
              
              {product.badge && (
                <div className={`absolute top-4 right-4 text-[10px] font-black uppercase px-2.5 py-1 rounded-md z-10
                  ${product.badge === 'Yangi' ? 'bg-blue-100 text-blue-700' : 
                    product.badge === 'Aksiyada' ? 'bg-red-100 text-red-700' : 
                    'bg-amber-100 text-amber-700'}`}>
                  {product.badge}
                </div>
              )}

              <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-xs font-black text-green-600 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-slate-800 font-bold text-base mb-2 leading-tight">{product.name}</h3>
                
                <div className="flex items-center gap-1 mb-4 mt-auto">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviews} sharh)</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Narxi</p>
                    <p className="text-lg font-black text-slate-800">{formatPrice(product.price)}</p>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      addedItems[product.id] 
                        ? 'bg-green-500 text-white rotate-12 scale-110 shadow-lg shadow-green-500/30' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {addedItems[product.id] ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Mahsulot topilmadi</h3>
          <p className="text-slate-500 text-sm mt-1">Boshqa so'z bilan qidirib ko'ring yoki toifalarni o'zgartiring.</p>
        </div>
      )}

    </div>
  );
}