import React from 'react';
import {
  Activity,
  Zap,
  Battery,
  Gauge,
  Sliders,
  Droplets,
  Thermometer,
  ShieldAlert,
  Power,
  RotateCw,
} from 'lucide-react';
import { SolarTelemetry } from '../types';

interface MonitoringViewProps {
  telemetry: SolarTelemetry;
  onOpenAeratorModal: () => void;
  onTogglePower: () => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  telemetry,
  onOpenAeratorModal,
  onTogglePower,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Telemetri Real-Time
          </span>
          <h2 className="text-xl font-bold">Pusat Kendali & Monitoring Sensor</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Pantau arus daya aktif, efisiensi modul surya, dan kondisi biokimia air kolam secara presisi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePower}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              telemetry.statusAerator
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{telemetry.statusAerator ? 'Hentikan Aerator' : 'Nyalakan Aerator'}</span>
          </button>

          <button
            onClick={onOpenAeratorModal}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>Atur Kecepatan</span>
          </button>
        </div>
      </div>

      {/* Grid of Gauges and Deep Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aerator Status & RPM Gauge */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <RotateCw className={`w-4 h-4 ${telemetry.statusAerator ? 'animate-spin' : ''}`} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Dinamika Kincir Aerator</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-semibold">
              BLDC 48V
            </span>
          </div>

          {/* Speed Circular Meter */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0284c7"
                strokeWidth="10"
                strokeDasharray={`${(telemetry.kecepatanAerator / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-800 font-mono">
                {telemetry.kecepatanAerator}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {Math.round((telemetry.kecepatanAerator / 100) * 125)} RPM
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs pt-3 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Beban Aktif</span>
              <span className="font-bold text-slate-800 font-mono">{telemetry.dayaBeban} Watt</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mode Kontrol</span>
              <span className="font-bold text-slate-800">{telemetry.modeAerator}</span>
            </div>
          </div>
        </div>

        {/* Battery Health & Power Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Battery className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Status Storage Baterai</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
              LiFePO4
            </span>
          </div>

          <div className="space-y-4 my-auto">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-600">Kapasitas Muatan (SoC)</span>
                <span className="font-mono text-emerald-700">{telemetry.kapasitasBaterai}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${telemetry.kapasitasBaterai}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Tegangan Terminal</span>
                <span className="font-bold text-slate-800 font-mono">{telemetry.teganganBaterai} V</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status Siklus</span>
                <span className="font-bold text-emerald-600">{telemetry.statusBaterai}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Daya Simpan Tersedia</span>
                <span className="font-bold text-slate-800 font-mono">
                  {((telemetry.kapasitasBaterai / 100) * 4.8).toFixed(2)} kWh
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimasi Backup</span>
                <span className="font-bold text-slate-800 font-mono">
                  {Math.round(((telemetry.kapasitasBaterai / 100) * 4800) / (telemetry.dayaBeban || 1))} jam
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>BMS Health (SoH): 99.2%</span>
            <span className="text-emerald-600 font-semibold">Sel Seimbang</span>
          </div>
        </div>

        {/* Water Quality Comprehensive Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Kualitas Lingkungan Kolam</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
              Optimal
            </span>
          </div>

          <div className="space-y-3.5 my-auto text-xs">
            {/* DO Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Oksigen Terlarut (DO)</span>
                <span className="font-mono font-bold text-blue-600">{telemetry.dissolvedOxygen} mg/L</span>
              </div>
              <div className="text-[11px] text-slate-400 mb-1.5">Standar budidaya: &gt; 5.0 mg/L</div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((telemetry.dissolvedOxygen / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Suhu */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Suhu Air Kolam</span>
                <span className="font-mono font-bold text-amber-600">{telemetry.suhuAir} °C</span>
              </div>
              <div className="text-[11px] text-slate-400">Rentang ideal: 26.0 - 30.0 °C</div>
            </div>

            {/* pH */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Derajat Keasaman (pH)</span>
                <span className="font-mono font-bold text-emerald-600">{telemetry.phAir}</span>
              </div>
              <div className="text-[11px] text-slate-400">Rentang ideal: 7.0 - 8.2</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            Sensor optik terkalibrasi otomatis pada jam 00:00 WIB.
          </div>
        </div>
      </div>
    </div>
  );
};
