import React, { useState } from 'react';
import { ParkingSlot, SlotStatus } from '../types';
import { LogIn, LogOut, CheckCircle, AlertCircle, Scan, Keyboard } from 'lucide-react';

interface EntryExitProps {
  slots: ParkingSlot[];
  onEntry: (plate: string) => void;
  onExit: (plate: string) => void;
  message: { type: 'success' | 'error', text: string } | null;
}

export const EntryExit: React.FC<EntryExitProps> = ({ slots, onEntry, onExit, message }) => {
  const [plate, setPlate] = useState('');
  const [mode, setMode] = useState<'ENTRY' | 'EXIT'>('ENTRY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;

    if (mode === 'ENTRY') {
      onEntry(plate.toUpperCase());
    } else {
      onExit(plate.toUpperCase());
    }
    setPlate('');
  };

  const availableSlots = slots.filter(s => s.status === SlotStatus.AVAILABLE).length;

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Kiosk Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">بوابة الخدمة الذاتية</h2>
        <p className="text-slate-500">الرجاء اختيار نوع العملية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mode Selection Cards */}
        <button
          onClick={() => setMode('ENTRY')}
          className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
            mode === 'ENTRY' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105' 
              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className={`p-4 rounded-full ${mode === 'ENTRY' ? 'bg-white/20' : 'bg-slate-100'}`}>
            <LogIn size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">تسجيل دخول</h3>
            <p className={`text-sm mt-2 ${mode === 'ENTRY' ? 'text-blue-100' : 'text-slate-400'}`}>
              إصدار تذكرة جديدة
            </p>
          </div>
          {mode === 'ENTRY' && (
             <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
               متاح: {availableSlots}
             </div>
          )}
        </button>

        <button
          onClick={() => setMode('EXIT')}
          className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
            mode === 'EXIT' 
              ? 'bg-rose-600 border-rose-600 text-white shadow-xl scale-105' 
              : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50'
          }`}
        >
          <div className={`p-4 rounded-full ${mode === 'EXIT' ? 'bg-white/20' : 'bg-slate-100'}`}>
            <LogOut size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">تسجيل خروج</h3>
            <p className={`text-sm mt-2 ${mode === 'EXIT' ? 'text-rose-100' : 'text-slate-400'}`}>
              سداد الرسوم والمغادرة
            </p>
          </div>
        </button>
      </div>

      {/* Input Section */}
      <div className="mt-12 bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${mode === 'ENTRY' ? 'bg-blue-600' : 'bg-rose-600'}`}></div>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-8">
          <div className="text-center">
            <label className="block text-lg font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
              <Keyboard className="text-slate-400" />
              أدخل رقم اللوحة
            </label>
            <div className="relative">
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="KSA-1234"
                className="w-full h-20 text-center text-4xl font-mono tracking-widest rounded-2xl border-2 border-slate-200 focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none uppercase transition-all"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Scan size={32} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mode === 'ENTRY' && availableSlots === 0}
            className={`w-full py-5 rounded-2xl font-bold text-xl text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-3 ${
              mode === 'ENTRY'
                ? 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {mode === 'ENTRY' ? 'فتح البوابة' : 'حساب التكلفة'}
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle size={18} />
            </div>
          </button>
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 justify-center animate-in slide-in-from-bottom-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold text-lg">{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};