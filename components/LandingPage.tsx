import React, { useState } from 'react';
import { Car, Sparkles, BarChart3, ShieldCheck, CheckCircle2, User, LockKeyhole } from 'lucide-react';
import { UserRole } from '../types';
import { AdminLogin } from './AdminLogin';

interface LandingPageProps {
  onLaunch: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" dir="rtl">
      
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={() => onLaunch('ADMIN')} 
          onCancel={() => setShowAdminLogin(false)} 
        />
      )}

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Car />
            <span>SmartPark AI</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onLaunch('USER')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <User size={18} />
              دخول سائق
            </button>
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
            >
              <LockKeyhole size={16} />
              دخول مدير
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-32">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 mb-6">
              <Sparkles size={16} />
              <span>مدعوم بالذكاء الاصطناعي Gemini 2.5</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              مستقبل إدارة <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">مواقف السيارات</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              حول موقف سياراتك إلى منشأة ذكية تدار ذاتياً. تحليلات فورية، توقعات دقيقة، وزيادة في الإيرادات بضغطة زر.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => setShowAdminLogin(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/25">
                لوحة تحكم الإدارة
              </button>
              <button onClick={() => onLaunch('USER')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm border border-white/10">
                خريطة المواقف للسائقين
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-3xl border border-slate-700 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-slate-700/50 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-slate-700/50 rounded-xl"></div>
                  <div className="h-24 bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">لماذا تختار SmartPark؟</h2>
            <p className="text-slate-500 text-lg">تقنيات متقدمة تجعل إدارة المواقف أسهل وأكثر ربحية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="text-purple-500" size={32} />}
              title="تحليل ذكي"
              desc="استخدم Gemini AI لتحليل سلوك العملاء واقتراح التسعير الديناميكي لزيادة الأرباح."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-blue-500" size={32} />}
              title="تقارير فورية"
              desc="لوحة تحكم شاملة تعرض الإشغال، الإيرادات، والعمليات في الوقت الفعلي."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" size={32} />}
              title="أمان وموثوقية"
              desc="نظام تتبع دقيق للمركبات الداخلة والخارجة مع سجلات تاريخية كاملة."
            />
          </div>
        </div>
      </section>

      {/* Pricing / Stats Preview */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">جاهز لتحويل موقفك؟</h2>
              <p className="text-blue-100 mb-8 max-w-md">
                انضم إلى أكثر من 500 منشأة تستخدم نظامنا لإدارة مواقفها بكفاءة عالية.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-300" />
                  <span>تركيب وتشغيل فوري</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-300" />
                  <span>دعم فني 24/7</span>
                </li>
              </ul>
              <button onClick={() => setShowAdminLogin(true)} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                اطلب النسخة التجريبية
              </button>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center">
                <div className="text-4xl font-bold mb-1">+40%</div>
                <div className="text-blue-200 text-sm">زيادة في الإيرادات</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center">
                <div className="text-4xl font-bold mb-1">-60%</div>
                <div className="text-blue-200 text-sm">وقت الإدارة</div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-4">
          <Car className="text-blue-500" />
          <span>SmartPark AI</span>
        </div>
        <p>&copy; 2024 جميع الحقوق محفوظة لنظام المواقف الذكي.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);