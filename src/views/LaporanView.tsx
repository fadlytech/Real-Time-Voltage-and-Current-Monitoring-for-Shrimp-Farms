import React from 'react';
import {
  FileText,
  DollarSign,
  Leaf,
  Zap,
  TrendingUp,
  Download,
  Printer,
} from 'lucide-react';
import { DailySummaryData } from '../types';

interface LaporanViewProps {
  summary: DailySummaryData;
}

export const LaporanView: React.FC<LaporanViewProps> = ({ summary }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Laporan Kinerja Energi & Efisiensi Biaya
          </h2>
          <p className="text-xs text-slate-500">
            Evaluasi produksi energi surya dan perbandingan penghematan biaya listrik tambak
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Penghematan Biaya Listrik
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 font-mono">
            Rp {(summary.energiDihasilkan * 15000).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">
            Dibandingkan penggunaan Genset Solar / Solar Industri
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-800 text-xs font-bold mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            Total Produksi PV Bulan Ini
          </div>
          <div className="text-2xl font-extrabold text-blue-900 font-mono">
            142.8 kWh
          </div>
          <p className="text-[11px] text-blue-700 mt-1">
            Rata-rata 4.76 kWh/hari dari 3 panel 250Wp
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200/70 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold mb-2">
            <Leaf className="w-4 h-4 text-teal-600" />
            Reduksi Jejak Karbon
          </div>
          <div className="text-2xl font-extrabold text-teal-900 font-mono">
            108.5 kg CO₂
          </div>
          <p className="text-[11px] text-teal-700 mt-1">
            Sertifikasi energi ramah lingkungan tambak hijau
          </p>
        </div>
      </div>

      {/* Cost Comparison Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800">
          Analisis Komparasi Operasional Aerator 1 HP (750W)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">Sumber Energi</th>
                <th className="py-2.5">Biaya Harian</th>
                <th className="py-2.5">Biaya Bulanan (30 Hari)</th>
                <th className="py-2.5">Emisi Karbon Harian</th>
                <th className="py-2.5">Keandalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr className="bg-emerald-50/50 font-semibold text-emerald-900">
                <td className="py-3 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Sistem Aerator PV Surya (Aktif)
                </td>
                <td className="py-3 font-mono">Rp 0 (Mandiri)</td>
                <td className="py-3 font-mono">Rp 0 (Mandiri)</td>
                <td className="py-3 font-mono text-emerald-600">0.0 kg CO₂ (Zero Emission)</td>
                <td className="py-3">Tinggi (Baterai Backup)</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-600">Genset Diesel Konvensional</td>
                <td className="py-3 font-mono text-rose-600">Rp 75.000 (Solar)</td>
                <td className="py-3 font-mono text-rose-600">Rp 2.250.000</td>
                <td className="py-3 font-mono text-rose-600">7.8 kg CO₂</td>
                <td className="py-3">Perlu isi BBM harian</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-600">PLN Golongan Tarif Bisnis</td>
                <td className="py-3 font-mono text-amber-600">Rp 18.500</td>
                <td className="py-3 font-mono text-amber-600">Rp 555.000</td>
                <td className="py-3 font-mono text-amber-600">3.6 kg CO₂</td>
                <td className="py-3">Rentan pemadaman lokal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
