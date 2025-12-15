import React from 'react';
import { LayoutDashboard, Map, Car, BarChart3, Settings, ShieldCheck, Globe, User, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onGoHome: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onGoHome, role }) => {
  
  // Define menu items with allowed roles
  // Updated: 'entry-exit' is now accessible by USER (Driver)
  const allMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'map', label: 'المتجر (المواقف)', icon: Map, roles: ['ADMIN', 'USER'] },
    { id: 'entry-exit', label: 'الدخول والخروج', icon: Car, roles: ['ADMIN', 'USER'] }, 
    { id: 'reports', label: 'التقارير والذكاء', icon: BarChart3, roles: ['ADMIN'] },
    { id: 'tasks', label: 'قائمة المهام', icon: ShieldCheck, roles: ['ADMIN'] },
  ];

  const filteredItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-700 cursor-pointer" onClick={onGoHome}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className="text-blue-400" />
          <span>SmartPark</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <div className="p-1 bg-slate-800 rounded">
             <User size={12} className={role === 'ADMIN' ? 'text-yellow-400' : 'text-slate-400'} />
           </div>
           <p className="text-xs text-slate-400">
             {role === 'ADMIN' ? 'مدير النظام' : 'سائق / زائر'}
           </p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        {role === 'ADMIN' && (
          <button 
            onClick={() => setCurrentView('settings')}
            className={`flex items-center gap-3 hover:text-white transition-colors w-full px-4 py-2 rounded-lg ${currentView === 'settings' ? 'text-blue-400 bg-slate-800' : 'text-slate-400'}`}
          >
            <Settings size={18} />
            <span>إعدادات النظام</span>
          </button>
        )}
        
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg"
        >
          <LogOut size={18} />
          <span>تسجيل خروج</span>
        </button>
      </div>
    </div>
  );
};