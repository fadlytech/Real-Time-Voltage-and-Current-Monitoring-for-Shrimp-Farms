import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Play, Pause, RefreshCw } from 'lucide-react';
import { SolarTelemetry } from '../types';

interface HeaderProps {
  telemetry: SolarTelemetry;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  isSimulating,
  onToggleSimulate,
  onResetData,
}) => {
  // Live ticking seconds option or fixed demo date
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(false);
  const [timeStr, setTimeStr] = useState<string>('14:32:18');
  const [dateStr, setDateStr] = useState<string>('Rabu, 16 April 2025');

  useEffect(() => {
    if (!useCurrentTime) {
      // Default to the exact screenshot timestamp
      setTimeStr('14:32:18');
      setDateStr('Rabu, 16 April 2025');
      return;
    }

    const updateDateTime = () => {
      const now = new Date();

      const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
      ];

      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];

      setDateStr(
        `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
      );

      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, [useCurrentTime]);

  // Calculate PV power from available telemetry
  const dayaPv = telemetry.teganganPanel * telemetry.arusPanel;

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Brand & Title */}
      <div className="flex items-center gap-3.5">
        {/* Solar Aerator Logo */}
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 via-emerald-500/10 to-amber-500/10 border border-blue-200/60 flex items-center justify-center p-2 shadow-xs group">
          <svg
            viewBox="0 0 48 48"
            className="w-9 h-9 fill-none"
          >
            {/* Sun */}
            <circle
              cx="24"
              cy="24"
              r="8"
              className="fill-amber-400"
            />

            <path
              d="M24 6V11"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M24 37V42"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M6 24H11"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M37 24H42"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M11.3 11.3L14.8 14.8"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M33.2 33.2L36.7 36.7"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M33.2 14.8L36.7 11.3"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M11.3 36.7L14.8 33.2"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Solar Panel */}
            <path
              d="M10 21L14 36H34L38 21H10Z"
              className="fill-blue-600 stroke-blue-700"
              strokeWidth="1.5"
            />

            {/* Panel Grid */}
            <line
              x1="24"
              y1="21"
              x2="24"
              y2="36"
              stroke="#ffffff"
              strokeWidth="1.2"
            />

            <line
              x1="17"
              y1="21"
              x2="19"
              y2="36"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.8"
            />

            <line
              x1="31"
              y1="21"
              x2="29"
              y2="36"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.8"
            />

            <line
              x1="12"
              y1="28.5"
              x2="36"
              y2="28.5"
              stroke="#ffffff"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            Dashboard Monitoring Aerator PV
          </h1>

          <p className="text-xs lg:text-sm text-slate-500 font-medium">
            Sistem Aerasi Tenaga Surya untuk Budidaya Perikanan
          </p>
        </div>
      </div>

      {/* Right Controls & Widgets */}
      <div className="flex items-center gap-3 lg:gap-5 ml-auto">
        {/* Simulation / Live Telemetry Toggle */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg p-1 text-xs">
          <button
            onClick={onToggleSimulate}
            title={
              isSimulating
                ? 'Jeda Simulasi'
                : 'Mulai Simulasi Real-Time'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              isSimulating
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSimulating ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>

                <Pause className="w-3.5 h-3.5" />

                <span>Live Data</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />

                <span>Simulasi</span>
              </>
            )}
          </button>

          <button
            onClick={onResetData}
            title="Reset ke Nilai Standar"
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Date & Time Widget */}
        <div
          onClick={() => setUseCurrentTime(!useCurrentTime)}
          title="Klik untuk beralih waktu snapshot / waktu nyata"
          className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer border border-slate-200/80 rounded-xl px-3 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>

          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-500 leading-tight">
              {dateStr}
            </div>

            <div className="text-sm font-bold text-slate-800 font-mono tracking-tight tabular-nums">
              {timeStr}
            </div>
          </div>
        </div>

        {/* PV Telemetry Widget */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 animate-pulse-glow" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700">
                PV Panel
              </span>

              <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                {dayaPv.toFixed(1)} W
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              {telemetry.teganganPanel.toFixed(1)} V
              {' · '}
              {telemetry.arusPanel.toFixed(1)} A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};