import React from 'react';
import { DailySummaryData } from '../types';

interface DailySummaryProps {
  summary: DailySummaryData;
}

export function DailySummary({ summary }: DailySummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-800">
          Ringkasan Harian
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Ringkasan performa sistem hari ini
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Rata-rata Radiasi</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {summary.rataRataRadiasi} W/m²
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Energi Dihasilkan</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {summary.energiDihasilkan} kWh
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Energi Terpakai</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {summary.energiTerpakai} kWh
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Durasi Operasi</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {summary.durasiOperasi} jam
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Penghematan CO₂</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            {summary.penghematanCo2} kg
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Penghematan Biaya</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            Rp {summary.penghematanBiayaIdr.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}