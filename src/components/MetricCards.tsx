
import React, { useEffect, useState } from 'react';
import { SolarTelemetry, BatteryTelemetry } from '../types';
import { getIradiasiBulanan2026 } from '../data/solarRadiation';

interface MetricCardsProps {
  telemetry: SolarTelemetry;
  battery: BatteryTelemetry;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  telemetry,
  battery,
}) => {
  const [iradiasi, setIradiasi] = useState<number>(() =>
    getIradiasiBulanan2026(new Date())
  );

  // Perbarui berkala agar bulan baru otomatis memakai nilai bulan yang sesuai.
  useEffect(() => {
    const updateIradiasi = () => setIradiasi(getIradiasiBulanan2026(new Date()));
    const interval = window.setInterval(updateIradiasi, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

      {/* Tegangan Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-blue-600">
              V
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Tegangan Panel
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {telemetry.teganganPanel}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            V
          </span>
        </div>
      </div>

      {/* Arus Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-blue-600">
              A
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Arus Panel
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {telemetry.arusPanel}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            A
          </span>
        </div>
      </div>

      {/* Iradiasi Matahari */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-amber-600">
              ☀
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Iradiasi Matahari
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {Math.round(iradiasi)}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            W/m²
          </span>
        </div>
      </div>

      {/* Daya Konsumsi Baterai */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-blue-600">
              A
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Daya Konsumsi Baterai
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {Math.abs(battery.teganganBaterai * battery.arusBaterai).toFixed(1)}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            W
          </span>
        </div>
      </div>

    </div>
  );
};
