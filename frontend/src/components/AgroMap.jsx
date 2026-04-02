import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Map as MapIcon, MapPin, Navigation, Phone } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// 1. Vite/React'da xarita markeri (ikonkasi) yo'qolib qolmasligi uchun maxsus yashil marker
const customMarker = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #16a34a; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -32]
});

// 2. O'zbekiston bo'ylab haqiqiyga o'xshash Do'konlar bazasi
const STORES = [
  { id: 1, name: "Toshkent Agro Markaz", lat: 41.2995, lng: 69.2401, address: "Toshkent sh, Chilonzor tumani, Qatortol", phone: "+998 90 123 45 67", hours: "08:00 - 18:00" },
  { id: 2, name: "Samarqand Urug'chilik", lat: 39.6270, lng: 66.9750, address: "Samarqand sh, Siyob bozori yonida", phone: "+998 93 234 56 78", hours: "07:00 - 19:00" },
  { id: 3, name: "Vodiy AgroTex (Farg'ona)", lat: 40.3842, lng: 71.7843, address: "Farg'ona sh, Qozizoda Rumiy ko'chasi", phone: "+998 91 345 67 89", hours: "08:00 - 17:00" },
  { id: 4, name: "Termiz Agro Kimyo", lat: 37.2241, lng: 67.2783, address: "Termiz sh, Taraqqiyot ko'chasi, 15-uy", phone: "+998 99 456 78 90", hours: "06:00 - 20:00" },
  { id: 5, name: "Xorazm Hosil Do'koni", lat: 41.5500, lng: 60.6000, address: "Urganch sh, Gurlan yo'li", phone: "+998 97 567 89 01", hours: "08:00 - 18:00" },
  { id: 6, name: "Buxoro Smart Fermer", lat: 39.7681, lng: 64.4556, address: "Buxoro sh, Karvon bozori", phone: "+998 95 678 90 12", hours: "08:00 - 18:00" },
];

// 3. Xaritani tanlangan do'konga qarab uchirish (FlyTo) funksiyasi
const MapController = ({ center }) => {
  const map = useMap();
  map.flyTo(center, 13, { duration: 1.5 });
  return null;
};

export default function AgroMap() {
  const [activeStore, setActiveStore] = useState(STORES[0]);

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-2rem)] p-4 sm:p-6 rounded-3xl font-sans flex flex-col">
      
      {/* Sarlavha qismi */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <MapIcon className="text-green-600 w-8 h-8" /> Hamkor Do'konlar Xaritasi
        </h1>
        <p className="text-sm text-slate-500 mt-1">O'zingizga eng yaqin qishloq xo'jaligi do'konini toping</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        
        {/* CHAP TOMON: Do'konlar Ro'yxati */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col z-10">
          <div className="bg-green-600 text-white p-4">
            <h2 className="font-bold text-lg">Barcha filiallar ({STORES.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {STORES.map((store) => (
              <div 
                key={store.id} 
                onClick={() => setActiveStore(store)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${activeStore.id === store.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-transparent hover:bg-slate-50'}`}
              >
                <h3 className="font-bold text-slate-800 mb-2">{store.name}</h3>
                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-green-600 flex-shrink-0" /> {store.address}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600 flex-shrink-0" /> {store.phone}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-600 flex-shrink-0" /> {store.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* O'NG TOMON: Jonli Xarita */}
        <div className="w-full lg:w-2/3 bg-slate-200 rounded-2xl overflow-hidden shadow-md border border-slate-200 relative z-0">
          <MapContainer 
            center={[activeStore.lat, activeStore.lng]} 
            zoom={6} 
            className="w-full h-full z-0"
            zoomControl={false}
          >
            {/* Tekin va tezkor OpenStreetMap plitkalari */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapController center={[activeStore.lat, activeStore.lng]} />

            {STORES.map((store) => (
              <Marker 
                key={store.id} 
                position={[store.lat, store.lng]}
                icon={customMarker}
              >
                <Popup className="rounded-xl">
                  <div className="p-1">
                    <h3 className="font-bold text-green-700 text-sm mb-1">{store.name}</h3>
                    <p className="text-xs text-slate-600 mb-2">{store.address}</p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-green-700 transition"
                    >
                      <Navigation className="w-3 h-3" /> Yo'nalish olish
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}