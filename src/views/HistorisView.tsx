import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { ChartDataPoint } from '../types';

interface HistorisViewProps {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
  rawLogs?: ChartDataPoint[];
}

export const HistorisView: React.FC<HistorisViewProps> = ({
  todayData,
  yesterdayData,
  weekData,
  rawLogs = [],
}) => {
  const hasRawLogs = rawLogs.length > 0;
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'yesterday' | 'week' | 'realtime'
  >(hasRawLogs ? 'realtime' : 'today');

  const activeData =
    selectedPeriod === 'realtime' && hasRawLogs
      ? rawLogs
      : selectedPeriod === 'yesterday'
      ? yesterdayData
      : selectedPeriod === 'week'
      ? weekData
      : todayData;

  const handleExportCSV = () => {
    const headers =
      'Waktu,Iradiasi (W/m2),Tegangan Panel (V),Arus Panel (A),Daya PV (W)\n';
    const rows = activeData
      .map(
        (d) =>
          `${d.time},${d.iradiasi},${d.teganganPanel},${d.arusPanel},${(
            d.teganganPanel * d.arusPanel
          ).toFixed(2)}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_historis_pv_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs: { id: 'today' | 'yesterday' | 'week' | 'realtime'; label: string }[] = [
    ...(hasRawLogs ? [{ id: 'realtime' as const, label: `Log Firebase (${rawLogs.length})` }] : []),
    { id: 'today', label: 'Hari Ini' },
    { id: 'yesterday', label: 'Kemarin' },
    { id: 'week', label: '7 Hari' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="flux-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="flux-badge-lime mb-2">DATA HISTORIS</span>
          <h2 className="text-xl font-bold text-[#1c1d1f]">
            Log Historis Operasional &amp; Sensor
          </h2>
          <p className="text-xs text-[#7c7f86] mt-0.5">
            {hasRawLogs
              ? 'Terhubung langsung ke node monitoring/history pada Firebase Realtime Database'
              : 'Arsip telemetri berkala energi surya dan parameter kelistrikan PV'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Period Tabs */}
          <div className="inline-flex flex-wrap items-center bg-[#f4f5f7] rounded-full p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPeriod(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedPeriod === tab.id
                    ? 'bg-[#1c1d1f] text-white'
                    : 'text-[#7c7f86] hover:text-[#1c1d1f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4f362] text-[#1c1d1f] text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="flux-card p-0 overflow-hidden">
        <div className="overflow-x-auto max-h-[540px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#f4f5f7] border-b border-[#e5e7eb] text-[#7c7f86] font-bold">
                <th className="py-3.5 px-5">Waktu / Hari</th>
                <th className="py-3.5 px-5">Iradiasi (W/m²)</th>
                <th className="py-3.5 px-5">Tegangan Panel (V)</th>
                <th className="py-3.5 px-5">Arus Panel (A)</th>
                <th className="py-3.5 px-5">Daya PV (W)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1f3] text-[#1c1d1f] font-medium">
              {activeData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#1c1d1f] tabular-nums">{row.time}</td>
                  <td className="py-3.5 px-5 tabular-nums">
                    <span className="flux-badge-lime">{row.iradiasi} W/m²</span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#1c1d1f] tabular-nums">{row.teganganPanel.toFixed(2)} V</td>
                  <td className="py-3.5 px-5 font-bold text-[#6e56cf] tabular-nums">{row.arusPanel.toFixed(2)} A</td>
                  <td className="py-3.5 px-5 font-extrabold text-[#1c1d1f] tabular-nums">
                    {(row.teganganPanel * row.arusPanel).toFixed(1)} W
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
