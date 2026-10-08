import React from 'react';
import {
  Home,
  Activity,
  BarChart2,
  Settings,
  Bell,
  FileText,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadNotifsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadNotifsCount,
}) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <Home className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: <Activity className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'historis',
      label: 'Data Historis',
      icon: <BarChart2 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'notifikasi',
      label: 'Notifikasi',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: unreadNotifsCount,
    },
    {
      id: 'laporan',
      label: 'Laporan',
      icon: <FileText className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside className="w-full lg:w-56 shrink-0 bg-transparent flex flex-col justify-between py-2">
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 px-2 lg:px-0">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 whitespace-nowrap text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 translate-x-0.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`inline-flex items-center justify-center text-xs font-bold w-5 h-5 rounded-full ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick System Health Pill in Sidebar footer */}
      <div className="hidden lg:block mt-8 mx-1 p-3 bg-white/80 border border-slate-200/80 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sistem Berjalan</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Controller MPPT & IoT Telemetry online via MQTT.
        </p>
      </div>
    </aside>
  );
};
