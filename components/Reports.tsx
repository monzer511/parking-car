import React, { useState } from 'react';
import { ParkingSlot, ParkingTransaction, AIAnalysisResult } from '../types';
import { analyzeParkingData } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Sparkles, Loader2, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface ReportsProps {
  slots: ParkingSlot[];
  transactions: ParkingTransaction[];
}

export const Reports: React.FC<ReportsProps> = ({ slots, transactions }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeParkingData(slots, transactions);
    setAnalysis(result);
    setLoading(false);
  };

  // Mock data for charts
  const occupancyData = [
    { name: '8:00', amount: 12 },
    { name: '10:00', amount: 25 },
    { name: '12:00', amount: 45 },
    { name: '14:00', amount: 30 },
    { name: '16:00', amount: 38 },
    { name: '18:00', amount: 20 },
  ];

  const revenueData = [
    { name: 'السبت', value: 12000 },
    { name: 'الأحد', value: 15500 },
    { name: 'الاثنين', value: 11000 },
    { name: 'الثلاثاء', value: 18000 },
    { name: 'الأربعاء', value: 16000 },
    { name: 'الخميس', value: 21000 },
    { name: 'الجمعة', value: 24000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* AI Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-400" />
                تحليل الذكاء الاصطناعي (Gemini)
              </h2>
              <p className="text-indigo-200 max-w-xl">
                يقوم هذا النظام بتحليل بيانات الإشغال والإيرادات الحالية لتقديم توصيات لتحسين كفاءة الموقف وزيادة الأرباح.
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'جاري التحليل...' : 'توليد تقرير ذكي'}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="text-sm text-indigo-300 mb-1">كفاءة التشغيل</div>
                <div className="text-3xl font-bold text-emerald-400">{analysis.efficiencyScore}%</div>
                <div className="w-full bg-white/10 h-2 rounded-full mt-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${analysis.efficiencyScore}%` }}></div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="text-sm text-indigo-300 mb-1">توقع وقت الذروة</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock size={20} className="text-amber-400" />
                  {analysis.peakTimePrediction}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="text-sm text-indigo-300 mb-1">مقترح التسعير</div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  {analysis.pricingSuggestion}
                </div>
              </div>

              <div className="col-span-1 md:col-span-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-bold text-indigo-200 mb-3">توصيات التحسين:</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            معدل الإشغال اليومي (ساعات)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-emerald-500" />
            الإيرادات الأسبوعية (ج.س)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ج.س`, 'الإيرادات']} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};