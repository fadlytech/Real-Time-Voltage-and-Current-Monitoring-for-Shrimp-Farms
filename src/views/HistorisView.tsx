import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { ChartDataPoint } from '../types';

interface HistorisViewProps {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
}

export const HistorisView: React.FC<HistorisViewProps> = ({
  todayData,
  yesterdayData,
  weekData,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | 'week'>('today');

  const activeData =
    selectedPeriod === 'yesterday'
      ? yesterdayData
      : selectedPeriod === 'week'
      ? weekData
      : todayData;

  const handleExportCSV = () => {
    const headers =
      'Waktu,Iradiasi (W/m2),Tegangan Panel (V),Arus Panel (A),Tegangan Baterai (V),Arus Baterai (A),Daya Baterai (W)\n';
    const rows = activeData
      .map(
        (d) =>
          `${d.time},${d.iradiasi},${d.teganganPanel},${d.arusPanel},${d.teganganBaterai},${d.arusBaterai},${d.dayaBaterai}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_historis_aerator_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Log Historis Operasional & Sensor
          </h2>
          <p className="text-xs text-slate-500">
            Arsip telemetri berkala energi surya dan parameter air tambak
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Period Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedPeriod('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedPeriod === 'today'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setSelectedPeriod('yesterday')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedPeriod === 'yesterday'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kemarin
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-semibold">
    <th className="py-3 px-4">Waktu / Hari</th>
    <th className="py-3 px-4">Iradiasi (W/m²)</th>
    <th className="py-3 px-4">Tegangan Panel (V)</th>
    <th className="py-3 px-4">Arus Panel (A)</th>
    <th className="py-3 px-4">Tegangan Baterai (V)</th>
    <th className="py-3 px-4">Arus Baterai (A)</th>
    <th className="py-3 px-4">Daya Baterai (W)</th>
    <th className="py-3 px-4">Kondisi Baterai</th>
  </tr>
</thead>
<tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
  {activeData.map((row, idx) => (
    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
      <td className="py-3 px-4 font-mono font-semibold text-slate-800">{row.time}</td>
      <td className="py-3 px-4 font-mono tabular-nums text-amber-600 font-semibold">{row.iradiasi}</td>
      <td className="py-3 px-4 font-mono tabular-nums text-blue-600 font-semibold">{row.teganganPanel} V</td>
      <td className="py-3 px-4 font-mono tabular-nums text-sky-600 font-semibold">{row.arusPanel} A</td>
      <td className="py-3 px-4 font-mono tabular-nums text-emerald-600 font-semibold">{row.teganganBaterai.toFixed(2)} V</td>
      <td className="py-3 px-4 font-mono tabular-nums text-emerald-600 font-semibold">{row.arusBaterai.toFixed(1)} A</td>
      <td className="py-3 px-4 font-mono tabular-nums text-slate-900">{row.dayaBaterai} W</td>
      <td className="py-3 px-4">
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            row.dayaBaterai >= 0
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {row.dayaBaterai >= 0 ? 'Mengisi' : 'Dipakai'}
        </span>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
