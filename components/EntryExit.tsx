import React, { useState } from 'react';
import { ParkingSlot, SlotStatus, ParkingTransaction } from '../types';
import { LogIn, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setMode('ENTRY')}
            className={`flex-1 py-4 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
              mode === 'ENTRY' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LogIn size={20} />
            تسجيل دخول
          </button>
          <button
            onClick={() => setMode('EXIT')}
            className={`flex-1 py-4 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
              mode === 'EXIT' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <LogOut size={20} />
            تسجيل خروج
          </button>
        </div>

        <div className="p-8">
          {mode === 'ENTRY' && (
            <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="text-blue-800 font-medium">المواقف المتاحة حالياً</span>
              <span className="text-2xl font-bold text-blue-600">{availableSlots}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                رقم اللوحة
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="أدخل رقم اللوحة (مثال: ABC-1234)"
                className="w-full px-4 py-4 text-2xl text-center font-mono rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 outline-none uppercase transition-all"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={mode === 'ENTRY' && availableSlots === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform active:scale-[0.98] ${
                mode === 'ENTRY'
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {mode === 'ENTRY' ? 'إصدار تذكرة دخول' : 'حساب وإتمام الخروج'}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};