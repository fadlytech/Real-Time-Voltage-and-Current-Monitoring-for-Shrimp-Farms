import React from 'react';
import { BatteryCharging, ChevronRight } from 'lucide-react';
import { BatteryTelemetry } from '../types';
import { getStatusBaterai, StatusBaterai, BATERAI_CUTOFF_PERSEN } from '../data/batteryModel';

interface BatterySystemProps {
  battery: BatteryTelemetry;
  onOpenDetails: () => void;
}

export const BatterySystem: React.FC<BatterySystemProps> = ({
  battery,
  onOpenDetails,
}) => {
  const status: StatusBaterai = getStatusBaterai(battery.persentase, battery.arusBaterai);
  const isCharging = battery.arusBaterai >= 0;
  const statusStyle: Record<StatusBaterai, string> = {
    Mengisi: 'bg-emerald-100 text-emerald-700',
    Dipakai: 'bg-amber-100 text-amber-700',
    Penuh: 'bg-blue-100 text-blue-700',
    Cutoff: 'bg-red-100 text-red-700',
    Diam: 'bg-slate-200 text-slate-700',
  };
  const indicatorColor =
    status === 'Cutoff' ? 'bg-red-500' : status === 'Dipakai' ? 'bg-amber-500' : status === 'Diam' ? 'bg-slate-400' : status === 'Penuh' ? 'bg-blue-500' : 'bg-emerald-500';
  const level = Math.min(100, Math.max(0, battery.persentase));
  // Area isi baterai di dalam body SVG (x 20..80, tinggi 56 dari y 28..84)
  const fillHeight = (56 * level) / 100;
  const fillY = 84 - fillHeight;
  const levelColor =
    level <= 25 ? '#ef4444' : level <= 50 ? '#f59e0b' : '#10b981';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
          </div>

          <h2 className="text-base font-bold text-slate-800">
            Sistem Baterai
          </h2>
        </div>

        <button
          onClick={onOpenDetails}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 hover:underline cursor-pointer transition-colors"
        >
          <span>Detail Baterai</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Battery Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        {/* Battery Illustration */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-28 flex items-center justify-center">
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="batBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="batLevel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={levelColor} />
                  <stop offset="100%" stopColor={levelColor} stopOpacity="0.75" />
                </linearGradient>
              </defs>

              {/* Ground Stand (mirip penyangga panel surya) */}
              <path
                d="M 45 95 L 60 88 L 75 95"
                stroke="#64748b"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Battery Terminal */}
              <rect x="48" y="18" width="24" height="7" rx="2" fill="#475569" />

              {/* Battery Frame */}
              <rect
                x="16"
                y="24"
                width="88"
                height="64"
                rx="8"
                fill="url(#batBody)"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Battery Inner Surface */}
              <rect
                x="21"
                y="29"
                width="78"
                height="54"
                rx="5"
                fill="#0f172a"
                fillOpacity="0.85"
              />

              {/* Charge Level */}
              <rect
                x="24"
                y={fillY + 3}
                width="72"
                height={Math.max(0, fillHeight - 3)}
                rx="3"
                fill="url(#batLevel)"
              />

              {/* Cell Dividers */}
              <line x1="48" y1="29" x2="48" y2="83" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
              <line x1="72" y1="29" x2="72" y2="83" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />

              {/* Reflection */}
              <polygon points="26,32 42,32 34,80 24,80" fill="#ffffff" fillOpacity="0.15" />

              {/* Percentage label */}
              <text
                x="60"
                y="60"
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill="#ffffff"
                fontFamily="JetBrains Mono, monospace"
              >
                {level}%
              </text>
            </svg>

            {/* Status indicator */}
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${indicatorColor}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${indicatorColor}`} />
            </span>
          </div>

          <div className="mt-1">
            <h3 className="text-sm font-bold text-slate-900">Baterai</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Penyimpanan energi · {battery.kapasitasAh} Ah
            </p>
          </div>
        </div>

        {/* Battery Measurements */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tegangan */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 flex items-center justify-center font-bold">
                V
              </div>
              <span className="text-xs font-semibold text-slate-600">Tegangan</span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {battery.teganganBaterai}
              </span>
              <span className="ml-1 text-sm font-bold text-slate-600">V</span>
            </div>
          </div>

          {/* Arus */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-xs font-semibold text-slate-600">Arus</span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {isCharging ? '+' : ''}
                {battery.arusBaterai}
              </span>
              <span className="ml-1 text-sm font-bold text-slate-600">A</span>
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusStyle[status]}`}>
              {status}
            </span>
          </div>

          {status === 'Cutoff' && (
            <div className="col-span-2 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Peringatan: persentase di bawah cutoff {BATERAI_CUTOFF_PERSEN}%. Beban diputus sampai baterai terisi kembali.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
