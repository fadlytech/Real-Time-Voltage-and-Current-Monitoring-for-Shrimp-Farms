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
    const headers = 'Waktu,Kapasitas Baterai (%),DO (mg/L),Suhu Air (°C),Daya PV (W),Daya Beban (W)\n';
    const rows = activeData
      .map(
        (d) =>
          `${d.time},${d.baterai},${d.do},${d.suhu},${d.dayaPv ?? 0},${d.dayaBeban ?? 420}`
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
                <th className="py-3 px-4">Daya PV (W)</th>
                <th className="py-3 px-4">Beban Aerator (W)</th>
                <th className="py-3 px-4">Level Baterai (%)</th>
                <th className="py-3 px-4">DO (mg/L)</th>
                <th className="py-3 px-4">Suhu Air (°C)</th>
                <th className="py-3 px-4">Status Kualitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {activeData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {row.time}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-900 font-semibold">
                    {row.dayaPv ?? 0} W
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-900">
                    {row.dayaBeban ?? 420} W
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-emerald-600">
                      {row.baterai} %
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums font-bold text-blue-600">
                    {row.do} mg/L
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-amber-600">
                    {row.suhu} °C
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Baik
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
