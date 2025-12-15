import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ParkingMap } from './components/ParkingMap';
import { EntryExit } from './components/EntryExit';
import { Reports } from './components/Reports';
import { TaskList } from './components/TaskList';
import { LandingPage } from './components/LandingPage';
import { Settings } from './components/Settings';
import { PaymentModal } from './components/PaymentModal';
import { ParkingSlot, SlotStatus, ParkingTransaction, ParkingStats, UserRole } from './types';
import { Car, DollarSign, Activity, CheckIcon, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const TOTAL_SLOTS = 24;

export default function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [minuteRate, setMinuteRate] = useState(10); // Default 10 SDG per minute

  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [transactions, setTransactions] = useState<ParkingTransaction[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Payment State
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);

  // Initialize slots
  useEffect(() => {
    const initialSlots: ParkingSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      const isOccupied = Math.random() > 0.7; // Determine occupied state once
      return {
        id: i + 1,
        label: `A-${i + 1}`,
        status: isOccupied ? SlotStatus.OCCUPIED : SlotStatus.AVAILABLE,
        floor: 1,
        occupiedBy: isOccupied ? `KSA-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        entryTime: isOccupied ? new Date(Date.now() - Math.floor(Math.random() * 3600000 * 2)) : undefined // Random time within last 2 hours
      };
    });
    setSlots(initialSlots);
  }, []);

  const stats: ParkingStats = {
    totalSlots: slots.length,
    occupied: slots.filter(s => s.status === SlotStatus.OCCUPIED).length,
    available: slots.filter(s => s.status === SlotStatus.AVAILABLE).length,
    revenue: transactions.reduce((acc, curr) => acc + (curr.cost || 0), 0)
  };

  const handleLaunch = (role: UserRole) => {
    setUserRole(role);
    // If User/Driver logs in, send them to the Map or EntryExit, not dashboard
    setCurrentView(role === 'ADMIN' ? 'dashboard' : 'entry-exit');
    setShowLandingPage(false);
  };

  const handleEntry = (plate: string) => {
    if (slots.find(s => s.occupiedBy === plate)) {
      setMessage({ type: 'error', text: 'السيارة موجودة بالفعل في الموقف!' });
      return;
    }

    const slotIndex = slots.findIndex(s => s.status === SlotStatus.AVAILABLE);
    if (slotIndex === -1) {
      setMessage({ type: 'error', text: 'الموقف ممتلئ بالكامل!' });
      return;
    }

    const newSlots = [...slots];
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      status: SlotStatus.OCCUPIED,
      occupiedBy: plate,
      entryTime: new Date()
    };
    setSlots(newSlots);

    const newTransaction: ParkingTransaction = {
      id: Date.now().toString(),
      plateNumber: plate,
      slotLabel: newSlots[slotIndex].label,
      entryTime: new Date(),
      status: 'ACTIVE'
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    setMessage({ type: 'success', text: `تم تسجيل الدخول بنجاح. موقف رقم ${newSlots[slotIndex].label}` });
    setTimeout(() => setMessage(null), 3000);
  };

  // Step 1: Request Exit - Calculates cost and opens Payment Modal
  const handleExitRequest = (plate: string) => {
    const slotIndex = slots.findIndex(s => s.occupiedBy === plate);
    if (slotIndex === -1) {
      setMessage({ type: 'error', text: 'السيارة غير موجودة في النظام!' });
      return;
    }

    const slot = slots[slotIndex];
    if (!slot.entryTime) {
      setMessage({ type: 'error', text: 'خطأ: وقت الدخول غير مسجل لهذه المركبة.' });
      return;
    }

    const entryTime = new Date(slot.entryTime);
    const exitTime = new Date();
    
    // Calculate duration in minutes
    let durationMinutes = 0;
    try {
      const diffMs = exitTime.getTime() - entryTime.getTime();
      durationMinutes = Math.max(1, Math.ceil(diffMs / (1000 * 60))); // Minimum 1 minute
    } catch (e) {
      console.error("Error calculating time", e);
      durationMinutes = 1; 
    }

    const cost = durationMinutes * minuteRate;

    // Open Payment Modal
    setPendingPayment({
      plateNumber: plate,
      entryTime,
      exitTime,
      durationMinutes,
      ratePerMinute: minuteRate,
      totalCost: cost,
      slotLabel: slot.label,
      slotIndex: slotIndex // Keep track of which slot to free
    });
  };

  // Step 2: Confirm Payment - Actually frees the slot
  const confirmPayment = () => {
    if (!pendingPayment) return;

    const { slotIndex, plateNumber, totalCost, exitTime } = pendingPayment;

    const newSlots = [...slots];
    newSlots[slotIndex] = {
      ...newSlots[slotIndex],
      status: SlotStatus.AVAILABLE,
      occupiedBy: undefined,
      entryTime: undefined
    };
    setSlots(newSlots);

    setTransactions(prev => prev.map(t => 
      t.plateNumber === plateNumber && t.status === 'ACTIVE'
        ? { ...t, exitTime, cost: totalCost, status: 'COMPLETED' }
        : t
    ));

    setMessage({ type: 'success', text: `تم الخروج بنجاح. المبلغ المستلم: ${totalCost} ج.س` });
    setPendingPayment(null);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddSlot = (label: string, floor: number) => {
    const newSlot: ParkingSlot = {
      id: slots.length + 1,
      label: label,
      floor: floor,
      status: SlotStatus.AVAILABLE
    };
    setSlots([...slots, newSlot]);
  };

  if (showLandingPage) {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return userRole === 'ADMIN' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="إجمالي المواقف" 
                value={stats.totalSlots} 
                icon={Car} 
                trend="+2 مواقف جديدة" 
                trendUp={true}
                color="blue" 
              />
              <StatCard 
                title="مشغول حالياً" 
                value={stats.occupied} 
                icon={Activity} 
                trend={`${Math.round((stats.occupied / stats.totalSlots) * 100)}% معدل الإشغال`}
                trendUp={stats.occupied > stats.totalSlots / 2}
                color="rose" 
              />
              <StatCard 
                title="المتاح للحجز" 
                value={stats.available} 
                icon={CheckIcon} 
                trend="جاهز للاستقبال" 
                trendUp={true}
                color="emerald" 
              />
              <StatCard 
                title="إيرادات اليوم" 
                value={`${stats.revenue.toLocaleString()} ج.س`} 
                icon={DollarSign} 
                trend="تحديث مباشر" 
                trendUp={true}
                color="amber" 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                 <ParkingMap slots={slots} minuteRate={minuteRate} />
               </div>
               
               {/* Sidebar Widgets */}
               <div className="space-y-6">
                 {/* Live Activity Feed */}
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                       <Clock size={20} className="text-slate-400" />
                       أحدث العمليات
                     </h3>
                     <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">اليوم</span>
                   </div>
                   
                   <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {transactions.slice().reverse().slice(0, 8).map(t => (
                       <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors group">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-xl ${t.status === 'ACTIVE' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                             {t.status === 'ACTIVE' ? <Car size={18} /> : <CheckIcon size={18} />}
                           </div>
                           <div>
                             <div className="font-bold text-slate-800 font-mono">{t.plateNumber}</div>
                             <div className="text-xs text-slate-500 mt-0.5">
                               {t.status === 'ACTIVE' ? 'دخول' : 'خروج'} • {t.entryTime.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
                            <span className={`block text-xs font-bold px-2 py-1 rounded-lg mb-1 ${t.status === 'ACTIVE' ? 'bg-white text-blue-600 border border-blue-100' : 'bg-white text-emerald-600 border border-emerald-100'}`}>
                              {t.slotLabel}
                            </span>
                            {t.cost && <span className="text-xs font-bold text-emerald-600">{t.cost} ج.س</span>}
                         </div>
                       </div>
                     ))}
                     {transactions.length === 0 && (
                       <div className="text-center py-12">
                         <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                           <AlertCircle className="text-slate-300" />
                         </div>
                         <p className="text-slate-400 font-medium">لا توجد عمليات مسجلة بعد</p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        ) : <div>غير مصرح</div>;
      case 'map':
        return <ParkingMap slots={slots} minuteRate={minuteRate} />;
      case 'entry-exit':
        return <EntryExit slots={slots} onEntry={handleEntry} onExit={handleExitRequest} message={message} />;
      case 'reports':
        return userRole === 'ADMIN' ? <Reports slots={slots} transactions={transactions} /> : <div>غير مصرح</div>;
      case 'tasks':
        return userRole === 'ADMIN' ? <TaskList /> : <div>غير مصرح</div>;
      case 'settings':
        return userRole === 'ADMIN' ? (
          <Settings 
            slots={slots} 
            onAddSlot={handleAddSlot} 
            minuteRate={minuteRate}
            setMinuteRate={setMinuteRate}
          />
        ) : <div>غير مصرح</div>;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-900" dir="rtl">
      {pendingPayment && (
        <PaymentModal 
          data={pendingPayment} 
          onConfirm={confirmPayment} 
          onCancel={() => setPendingPayment(null)} 
        />
      )}

      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onGoHome={() => setShowLandingPage(true)}
        role={userRole}
      />
      
      <main className="flex-1 p-8 overflow-y-auto max-h-screen custom-scrollbar">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentView === 'dashboard' && 'لوحة التحكم الرئيسية'}
              {currentView === 'map' && 'متجر المواقف'}
              {currentView === 'entry-exit' && 'بوابة الدخول والخروج'}
              {currentView === 'reports' && 'التقارير والتحليلات الذكية'}
              {currentView === 'tasks' && 'خطة عمل المشروع'}
              {currentView === 'settings' && 'إعدادات النظام'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              أهلاً بك، {userRole === 'ADMIN' ? 'المدير العام' : 'السائق / الزائر'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-sm font-bold text-emerald-700">النظام متصل</span>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <span className="font-bold text-slate-600">{userRole === 'ADMIN' ? 'A' : 'U'}</span>
             </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

// Updated Modern Stat Card
const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }: any) => {
  const colorStyles: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const iconBg = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            <TrendingUp size={12} className={!trendUp ? 'rotate-180' : ''} />
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{value}</h3>
        <p className="text-slate-400 font-medium text-sm">{title}</p>
      </div>

      {/* Decorative background shape */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500 ${iconBg.split(' ')[0].replace('bg-', 'bg-')}`}></div>
    </div>
  );
};