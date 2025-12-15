import React, { useState, useEffect } from 'react';
import { ParkingSlot, SlotStatus } from '../types';
import { Clock, ShieldCheck, Heart, CircleDashed } from 'lucide-react';

interface ParkingMapProps {
  slots: ParkingSlot[];
  minuteRate?: number;
}

// Sub-component for the "Product" Timer
const ProductTimer = ({ entryTime }: { entryTime: Date | string | undefined }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!entryTime) return;
    const interval = setInterval(() => {
      const start = new Date(entryTime).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setElapsed(`${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [entryTime]);

  return <span className="text-xs font-mono bg-slate-800 text-white px-2 py-0.5 rounded">{elapsed || '0m'}</span>;
};

// Sample car images to rotate through based on slot ID for variety
const carImages = [
  "https://cdn-icons-png.flaticon.com/512/3202/3202926.png", // Red Sport
  "https://cdn-icons-png.flaticon.com/512/3097/3097136.png", // Red Sedan
  "https://cdn-icons-png.flaticon.com/512/3097/3097180.png", // Blue SUV
  "https://cdn-icons-png.flaticon.com/512/2555/2555013.png", // Truck
  "https://cdn-icons-png.flaticon.com/512/741/741407.png",   // Yellow
  "https://cdn-icons-png.flaticon.com/512/171/171239.png"    // Black
];

export const ParkingMap: React.FC<ParkingMapProps> = ({ slots, minuteRate = 0 }) => {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
           <h2 className="text-xl font-bold text-slate-800">متجر المواقف</h2>
           <p className="text-slate-500 text-sm">عرض حي لحالة المواقف</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
             السعر: {minuteRate} ج.س / دقيقة
           </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {slots.map((slot) => {
           const isOccupied = slot.status === SlotStatus.OCCUPIED;
           // Select a car image based on slot ID so it's consistent but varied
           const carImage = carImages[slot.id % carImages.length];
           
           return (
            <div 
              key={slot.id}
              className={`
                group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${isOccupied ? 'border-rose-100 opacity-100' : 'border-slate-100 hover:border-emerald-300'}
              `}
            >
              {/* Image Area */}
              <div className={`
                h-48 relative flex items-center justify-center p-4
                ${isOccupied ? 'bg-gradient-to-b from-rose-50 to-white' : 'bg-gradient-to-b from-slate-50 to-white'}
              `}>
                <div className="absolute top-3 right-3 z-10">
                   {isOccupied ? (
                     <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                       مشغول
                     </span>
                   ) : (
                     <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                       متاح
                     </span>
                   )}
                </div>
                
                {/* Heart/Favorite Icon Decoration */}
                <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-300 hover:text-rose-500 transition-colors">
                  <Heart size={16} fill={isOccupied ? "currentColor" : "none"} />
                </button>
                
                {isOccupied ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img 
                      src={carImage} 
                      alt="Car" 
                      className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 bg-slate-900/10 backdrop-blur-md text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {slot.occupiedBy}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-200 group-hover:text-emerald-200 transition-colors flex flex-col items-center">
                    <CircleDashed size={60} strokeWidth={1} />
                    <span className="text-xs font-medium text-slate-300 mt-2">مساحة فارغة</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 pt-0">
                <div className="mb-3">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center justify-between">
                    <span>موقف {slot.label}</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">طابق {slot.floor}</span>
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                   <div>
                     <span className="text-xs text-slate-400 block">التكلفة</span>
                     <span className="text-lg font-black text-emerald-600">{minuteRate} <span className="text-[10px] font-normal text-slate-500">ج.س/د</span></span>
                   </div>
                   
                   {isOccupied ? (
                     <div className="text-right">
                       <span className="text-[10px] text-slate-400 block flex items-center gap-1 justify-end">
                         <Clock size={10} />
                         المدة
                       </span>
                       <ProductTimer entryTime={slot.entryTime} />
                     </div>
                   ) : (
                     <div className="text-right">
                       <span className="text-[10px] text-slate-400 block">الحالة</span>
                       <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                         <ShieldCheck size={12} />
                         جاهز
                       </span>
                     </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};