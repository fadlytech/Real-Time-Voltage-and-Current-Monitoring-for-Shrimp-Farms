import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  BarChart2,
  Settings,
  Zap,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const menuItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    mobileIcon: React.ReactNode;
  }[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <LayoutGrid className="w-4 h-4 shrink-0" />,
      mobileIcon: <LayoutGrid className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'historis',
      label: 'Data Historis',
      icon: <BarChart2 className="w-4 h-4 shrink-0" />,
      mobileIcon: <BarChart2 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: <Settings className="w-4 h-4 shrink-0" />,
      mobileIcon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Top / Left Sidebar:
          - On mobile (< lg): centered symmetrical "Monitoring PV" header bar
          - On desktop (lg+): full left sidebar with brand + vertical navigation */}
      <aside className="w-full lg:w-56 shrink-0 px-3 py-1.5 lg:py-4 flex flex-col justify-between gap-6 text-white">
        <div>
          {/* Brand Logo (Centered on mobile, left-aligned on desktop) */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5 px-2 lg:px-3 lg:mb-7">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -6 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="w-7 h-7 rounded-lg bg-[#d4f362] text-[#1c1d1f] grid place-items-center font-extrabold shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
            </motion.div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              Monitoring PV
            </span>
          </div>

          {/* Desktop Navigation Menu (Hidden on HP/Mobile) */}
          <nav
            aria-label="Navigasi Utama Desktop"
            className="hidden lg:flex lg:flex-col gap-2"
          >
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-full font-semibold text-sm whitespace-nowrap text-left cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-[#1c1d1f]'
                      : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="desktopNavPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive ? 'text-[#1c1d1f]' : 'text-[#9ca3af]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="relative z-10 flex-1">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Floating Pill Dock (Symmetrical capsule, only visible on HP / < lg) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden bg-[#18191b] p-2 rounded-full grid grid-cols-3 gap-2.5 shadow-2xl border border-white/10"
      >
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              whileTap={{ scale: 0.9 }}
              title={item.label}
              aria-label={item.label}
              className={`relative w-12 h-12 rounded-full grid place-items-center transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#1c1d1f]'
                  : 'bg-[#28292d] text-white hover:bg-[#323439]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileNavPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-white shadow-md"
                />
              )}
              <span className="relative z-10">{item.mobileIcon}</span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
};
