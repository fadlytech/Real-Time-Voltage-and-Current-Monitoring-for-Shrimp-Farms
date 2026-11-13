import React, { useState } from 'react';
import { Zap, Activity, Sun, AlertTriangle } from 'lucide-react';
import { SolarTelemetry, PvSettings } from '../types';
import {
  IRADIASI_BULANAN_2026_WM2,
  getIradiasiBulanan2026,
} from '../data/solarRadiation';

interface MetricCardsProps {
  telemetry: SolarTelemetry;
  settings: PvSettings;
}

interface MonthIrradianceRow {
  month: number;
  shortName: string;
  fullName: string;
  averageWm2: number;
  activeDots: number; // 1..5
  intensity: number;  // 0..1 relative to max equivalent (233.65 W/m²)
}

const MONTH_NAMES: [string, string][] = [
  ['Jan', 'Januari'],
  ['Feb', 'Februari'],
  ['Mar', 'Maret'],
  ['Apr', 'April'],
  ['Mei', 'Mei'],
  ['Jun', 'Juni'],
  ['Jul', 'Juli'],
  ['Agu', 'Agustus'],
  ['Sep', 'September'],
  ['Okt', 'Oktober'],
  ['Nov', 'November'],
  ['Des', 'Desember'],
];

const VALUES_WM2 = Object.values(IRADIASI_BULANAN_2026_WM2);
const MIN_WM2 = Math.min(...VALUES_WM2); // 171.44 W/m²
const MAX_WM2 = Math.max(...VALUES_WM2); // 233.65 W/m²

const MONTHLY_IRRADIANCE_DATA: MonthIrradianceRow[] = MONTH_NAMES.map(
  ([shortName, fullName], idx) => {
    const month = idx + 1;
    const averageWm2 = IRADIASI_BULANAN_2026_WM2[month] ?? 180;
    const intensity = Math.max(
      0,
      Math.min(1, (averageWm2 - MIN_WM2) / (MAX_WM2 - MIN_WM2))
    );

    // Map rata-rata ekuivalen (W/m²) into 1..5 active dot columns
    let activeDots = 1;
    if (averageWm2 >= 225) activeDots = 5;
    else if (averageWm2 >= 200) activeDots = 4;
    else if (averageWm2 >= 185) activeDots = 3;
    else if (averageWm2 >= 172) activeDots = 2;
    else activeDots = 1;

    return {
      month,
      shortName,
      fullName,
      averageWm2,
      activeDots,
      intensity,
    };
  }
);

// Semakin mendekati maksimal ekuivalen (233.65 W/m²), warna titik semakin ungu pekat
function getPurpleDotColor(intensity: number, dotLevel: number, activeDots: number): string {
  if (dotLevel > activeDots) {
    return '#f1f2f6';
  }
  const combinedScore = intensity * 0.7 + (dotLevel / 5) * 0.3;
  if (combinedScore >= 0.85) return '#5b21b6'; // Ungu sangat pekat (mendekati maksimal 233.65 W/m²)
  if (combinedScore >= 0.68) return '#7c3aed'; // Ungu tua
  if (combinedScore >= 0.48) return '#9353ea'; // Ungu sedang-tua
  if (combinedScore >= 0.28) return '#ae8bfa'; // Ungu lavender sedang
  return '#cabffd'; // Ungu lavender muda
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  telemetry,
  settings,
}) => {
  const currentMonthIdx = new Date().getMonth(); // 0..11
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);

  const defaultIradiasi = getIradiasiBulanan2026(new Date());
  const baseIradiasi =
    telemetry.iradiasi !== undefined ? telemetry.iradiasi : defaultIradiasi;

  const focusedMonth =
    hoveredMonthIdx !== null
      ? MONTHLY_IRRADIANCE_DATA[hoveredMonthIdx]
      : MONTHLY_IRRADIANCE_DATA[currentMonthIdx];

  const displayedIradiasi =
    hoveredMonthIdx !== null ? focusedMonth.averageWm2 : baseIradiasi;

  const isOverVoltage = telemetry.teganganPanel > settings.maxVoltage;
  const isOverCurrent = telemetry.arusPanel > settings.maxCurrent;

  return (
    <section
      aria-label="Ringkasan Telemetri Utama"
      className="grid grid-cols-1 sm:grid-cols-12 gap-3"
    >
      {/* Left Pair: Side-by-side 2-col on HP for symmetry, stacked on desktop */}
      <div className="sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-3">
        {/* 1. Tegangan Panel */}
        <div
          className={`flux-card flex flex-col justify-between flex-1 ${
            isOverVoltage ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flux-icon-circle">
                <Zap className="w-4 h-4 text-[#1c1d1f]" />
              </div>
              <span className="text-sm font-bold text-[#1c1d1f]">
                Tegangan Panel
              </span>
            </div>
            {isOverVoltage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                <AlertTriangle className="w-3 h-3" />
                &gt; {settings.maxVoltage}V
              </span>
            )}
          </div>

          <div className="flex items-end justify-between mt-1">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                  isOverVoltage ? 'text-red-600' : 'text-[#1c1d1f]'
                }`}
              >
                {telemetry.teganganPanel.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#71757d]">
                V
              </span>
            </div>

            <div className="text-right text-[11px] leading-tight">
              <span className="text-[#71757d] block">
                Batas ({settings.minVoltage}–{settings.maxVoltage}V)
              </span>
              <span className="font-bold text-[#1c1d1f] tabular-nums">
                {settings.nominalVmp.toFixed(1)} Vmp
              </span>
            </div>
          </div>
        </div>

        {/* 2. Arus Panel */}
        <div
          className={`flux-card flex flex-col justify-between flex-1 ${
            isOverCurrent ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flux-icon-circle">
                <Activity className="w-4 h-4 text-[#1c1d1f]" />
              </div>
              <span className="text-sm font-bold text-[#1c1d1f]">
                Arus Panel
              </span>
            </div>
            {isOverCurrent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                <AlertTriangle className="w-3 h-3" />
                &gt; {settings.maxCurrent}A
              </span>
            )}
          </div>

          <div className="flex items-end justify-between mt-1">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                  isOverCurrent ? 'text-red-600' : 'text-[#1c1d1f]'
                }`}
              >
                {telemetry.arusPanel.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#71757d]">
                A
              </span>
            </div>

            <div className="text-right text-[11px] leading-tight">
              <span className="text-[#71757d] block">
                Maks {settings.maxCurrent}A
              </span>
              <span className="font-bold text-[#1c1d1f] tabular-nums">
                {settings.nominalImp.toFixed(1)} Imp
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Iradiasi Matahari (12 Bulan Jan-Des × 5 Kolom Titik Besar, Semakin Ungu Mendekati Maksimal) */}
      <div className="sm:col-span-7 flux-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flux-icon-circle">
                <Sun className="w-4 h-4 text-[#1c1d1f]" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1c1d1f] block leading-tight">
                  Iradiasi Matahari
                </span>
                <span className="text-[11px] text-[#71757d]">
                  Rata-rata ekuivalen ({focusedMonth.fullName}: {focusedMonth.averageWm2.toFixed(2)} W/m²)
                </span>
              </div>
            </div>
            <span className="flux-badge-lime">+BMKG</span>
          </div>

          <div className="flex items-baseline justify-between gap-2 mt-1">
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-3xl sm:text-4xl font-bold text-[#1c1d1f] tracking-tight">
                {displayedIradiasi.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#71757d]">
                W/m²
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#5b21b6] tabular-nums">
              Maks: {MAX_WM2} W/m² (Sep)
            </span>
          </div>
        </div>

        {/* 12 Baris Bulan (Januari - Desember), tiap bulan memiliki 5 tingkat/kolom titik berukuran besar */}
        <div
          className="grid grid-cols-12 gap-1.5 sm:gap-2 pt-4 items-end select-none"
          onMouseLeave={() => setHoveredMonthIdx(null)}
        >
          {MONTHLY_IRRADIANCE_DATA.map((item, idx) => {
            const isFocused =
              hoveredMonthIdx !== null
                ? hoveredMonthIdx === idx
                : currentMonthIdx === idx;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredMonthIdx(idx)}
                onClick={() => setHoveredMonthIdx(idx)}
                title={`${item.fullName}: Rata-rata ekuivalen ${item.averageWm2} W/m²`}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                {/* 5 Tingkat Titik Besar (Semakin ungu ketika mendekati maksimal ekuivalennya) */}
                <div className="flex flex-col gap-1.5 items-center">
                  {[5, 4, 3, 2, 1].map((dotLevel) => {
                    const bgColor = getPurpleDotColor(
                      item.intensity,
                      dotLevel,
                      item.activeDots
                    );
                    return (
                      <span
                        key={dotLevel}
                        style={{ backgroundColor: bgColor }}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform duration-150 group-hover:scale-110"
                      />
                    );
                  })}
                </div>

                {/* Label Bulan (Jan - Des) */}
                <span
                  className={`text-[9px] sm:text-[10px] font-bold tracking-tight mt-0.5 ${
                    isFocused ? 'text-[#5b21b6] font-extrabold' : 'text-[#71757d]'
                  }`}
                >
                  {item.shortName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
