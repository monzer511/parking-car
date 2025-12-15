import React, { useState } from 'react';
import { Plus, Save, DollarSign } from 'lucide-react';
import { ParkingSlot } from '../types';

interface SettingsProps {
  slots: ParkingSlot[];
  onAddSlot: (label: string, floor: number) => void;
  minuteRate: number;
  setMinuteRate: (rate: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({ slots, onAddSlot, minuteRate, setMinuteRate }) => {
  const [newLabel, setNewLabel] = useState('');
  const [newFloor, setNewFloor] = useState(1);
  const [tempRate, setTempRate] = useState(minuteRate);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    onAddSlot(newLabel.toUpperCase(), newFloor);
    setSuccessMsg(`تم إضافة الموقف ${newLabel} بنجاح`);
    setNewLabel('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateRate = () => {
    setMinuteRate(tempRate);
    setSuccessMsg(`تم تحديث سعر الدقيقة إلى ${tempRate} ج.س`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Suggest next label
  const lastSlot = slots[slots.length - 1];
  const nextNumber = lastSlot ? parseInt(lastSlot.label.split('-')[1] || '0') + 1 : 1;
  const suggestedLabel = `A-${nextNumber}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Pricing Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <DollarSign className="text-emerald-500" />
          إعدادات التسعير
        </h2>
        
        <div className="flex items-end gap-4 max-w-md">
           <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">تكلفة الدقيقة (ج.س)</label>
            <input 
              type="number" 
              min="0"
              value={tempRate}
              onChange={(e) => setTempRate(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">يتم احتساب التكلفة تلقائياً بناءً على عدد الدقائق.</p>
           </div>
           <button 
             onClick={handleUpdateRate}
             className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
           >
             حفظ السعر
           </button>
        </div>
      </div>

      {/* Add New Slot Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus className="text-blue-500" />
          إضافة مواقف جديدة
        </h2>

        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">رقم/اسم الموقف</label>
            <input 
              type="text" 
              required
              placeholder={suggestedLabel}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">مثال: A-25, B-01</p>
          </div>

          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-slate-700 mb-2">الطابق</label>
            <input 
              type="number" 
              min="1"
              value={newFloor}
              onChange={(e) => setNewFloor(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            حفظ وإضافة
          </button>
        </form>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            {successMsg}
          </div>
        )}
      </div>

      {/* Quick Stats of Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">إجمالي المواقف</div>
          <div className="text-3xl font-bold text-slate-800">{slots.length}</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">عدد الطوابق</div>
          <div className="text-3xl font-bold text-slate-800">{[...new Set(slots.map(s => s.floor))].length}</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="text-slate-500 text-sm mb-1">المواقف المتاحة</div>
          <div className="text-3xl font-bold text-emerald-600">
            {slots.filter(s => s.status === 'AVAILABLE').length}
          </div>
        </div>
      </div>
    </div>
  );
};