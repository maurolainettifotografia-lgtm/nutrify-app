import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Droplet,
  Dumbbell,
  BarChart3,
  Sparkles,
  User,
  Wifi,
  Signal,
  BatteryMedium,
  Lock,
  Moon,
  Sun,
} from 'lucide-react';

export type TabType = 'diary' | 'water' | 'workouts' | 'reports' | 'ai' | 'profile';

interface MobileShellProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLockScreen: () => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  currentTab,
  onTabChange,
  onLockScreen,
  children,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { key: 'diary' as TabType, label: 'Diário', icon: Utensils },
    { key: 'water' as TabType, label: 'Água/Peso', icon: Droplet },
    { key: 'workouts' as TabType, label: 'Treinos', icon: Dumbbell },
    { key: 'reports' as TabType, label: 'Relatórios', icon: BarChart3 },
    { key: 'ai' as TabType, label: 'Nutri IA', icon: Sparkles, badge: true },
    { key: 'profile' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-200'} flex justify-center items-start sm:py-6 antialiased transition-colors duration-300`}>
      {/* Mobile Device Frame */}
      <div className={`w-full sm:max-w-[430px] min-h-screen sm:min-h-[880px] sm:max-h-[920px] ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col sm:rounded-[44px] shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden relative transition-colors duration-300`}>
        {/* Android Status Bar */}
        <div className="bg-slate-950 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0 z-30">
          <span className="font-bold tracking-tight text-slate-100">{timeStr}</span>
          <div className="flex items-center gap-2 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Top App Header */}
        <header className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border-b px-4 py-3 flex items-center justify-between shrink-0 z-20 transition-colors`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-600/30">
              N
            </div>
            <div>
              <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-base tracking-tight block leading-none`}>
                Nutrify
              </span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-semibold mt-0.5 block`}>
                Nutrição e Treinos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 rounded-xl ${isDark ? 'bg-slate-800 text-amber-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition`}
              title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onLockScreen}
              className={`p-1.5 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition`}
              title="Bloquear com PIN de 6 números"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content Container */}
        <main className={`flex-1 overflow-y-auto p-4 relative overscroll-contain ${isDark ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
          {children}
        </main>

        {/* Android Bottom Navigation Bar (Material 3 style) */}
        <nav className={`${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200/80'} backdrop-blur-md border-t px-2 py-2 flex justify-around items-center shrink-0 z-30 shadow-lg transition-colors`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className="flex-1 flex flex-col items-center py-1 group relative transition-transform active:scale-95"
              >
                {/* Active indicator pill (Material 3 style) */}
                <div
                  className={`w-12 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                      : isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.badge && !isActive ? 'text-amber-500' : ''}`} />
                  {item.badge && (
                    <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                    isActive
                      ? isDark ? 'font-black text-emerald-400' : 'font-black text-emerald-800'
                      : isDark ? 'font-medium text-slate-400' : 'font-medium text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
