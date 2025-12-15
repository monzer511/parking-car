import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const TaskList: React.FC = () => {
  const tasks = [
    {
      title: 'بناء واجهة المستخدم (UI)',
      items: [
        'تصميم لوحة تحكم تفاعلية (Dashboard)',
        'خريطة حية للمواقف بالألوان (Available/Occupied)',
        'واجهة إدخال بيانات المركبات (Entry/Exit)',
        'دعم اللغة العربية (RTL) بشكل كامل'
      ],
      done: true
    },
    {
      title: 'المنطق البرمجي (Logic)',
      items: [
        'خوارزمية توزيع المواقف تلقائياً',
        'حساب تكلفة الوقوف بناءً على المدة',
        'تتبع حالة المواقف لحظياً',
        'نظام محاكاة الدخول والخروج'
      ],
      done: true
    },
    {
      title: 'التقنيات المتقدمة (AI & Tech)',
      items: [
        'ربط مع Google Gemini API لتحليل البيانات',
        'نظام اقتراح التسعير الديناميكي',
        'استخدام React & TypeScript للأداء العالي',
        'استخدام Tailwind CSS للتصميم الحديث'
      ],
      done: true
    },
    {
      title: 'التقارير والإدارة',
      items: [
        'رسوم بيانية للإيرادات (Charts)',
        'تحليل أوقات الذروة',
        'نظام إدارة الصلاحيات (Mock)',
        'تصدير البيانات (JSON)'
      ],
      done: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">قائمة مهام وبناء النظام</h2>
        <p className="text-slate-600 mb-8">
          بناءً على طلبك، تم تقسيم المشروع إلى مهام رئيسية وتم تنفيذها بالكامل في هذا النظام.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((section, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {section.done ? (
                      <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <Circle size={20} className="text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className={`text-sm ${section.done ? 'text-slate-700' : 'text-slate-500'}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};