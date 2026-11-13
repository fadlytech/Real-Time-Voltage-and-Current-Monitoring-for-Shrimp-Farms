import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ChartDataPoint, PondInfo, PvSettings } from '../types';
import {
  CsvFormatPreset,
  downloadHistorisCsv,
  isDataPointPopulated,
} from '../utils/csvExport';

interface HistorisViewProps {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
  rawLogs?: ChartDataPoint[];
  settings: PvSettings;
  pondInfo?: PondInfo;
  dateNote?: string | null;
}

type PeriodTab = 'today' | 'yesterday' | 'week' | 'realtime';

const PAGE_SIZE = 10;

const PERIOD_TITLES: Record<PeriodTab, string> = {
  today: 'Hari Ini (Interval 3 Jam)',
  yesterday: 'Kemarin (Interval 3 Jam)',
  week: '7 Hari Terakhir (Rata-rata Harian)',
  realtime: 'Log Sensor Real-Time Firebase',
};

export const HistorisView: React.FC<HistorisViewProps> = ({
  todayData,
  yesterdayData,
  weekData,
  rawLogs = [],
  settings,
  pondInfo,
  dateNote,
}) => {
  const hasRawLogs = rawLogs.length > 0;
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodTab>('today');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExportMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExportMenuOpen]);

  const effectivePeriod: PeriodTab =
    selectedPeriod === 'realtime' && !hasRawLogs ? 'today' : selectedPeriod;

  const activeData =
    effectivePeriod === 'realtime'
      ? rawLogs
      : effectivePeriod === 'yesterday'
      ? yesterdayData
      : effectivePeriod === 'week'
      ? weekData
      : todayData;

  const totalPages = Math.max(1, Math.ceil(activeData.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = activeData.slice(startIndex, startIndex + PAGE_SIZE);

  const summary = useMemo(() => {
    const populated = activeData.filter(isDataPointPopulated);
    if (populated.length === 0) {
      return {
        avgVoltage: 0,
        avgCurrent: 0,
        maxPower: 0,
        populatedCount: 0,
        totalSamples: 0,
      };
    }

    const sumV = populated.reduce((acc, r) => acc + r.teganganPanel, 0);
    const sumI = populated.reduce((acc, r) => acc + r.arusPanel, 0);
    const maxPower = populated.reduce(
      (max, r) => Math.max(max, r.teganganPanel * r.arusPanel),
      0
    );
    const totalSamples = populated.reduce(
      (acc, r) => acc + (r.sampleCount ?? 1),
      0
    );

    return {
      avgVoltage: sumV / populated.length,
      avgCurrent: sumI / populated.length,
      maxPower,
      populatedCount: populated.length,
      totalSamples,
    };
  }, [activeData]);

  const handleSelectTab = (tabId: PeriodTab) => {
    setSelectedPeriod(tabId);
    setCurrentPage(1);
  };

  const handleDownloadCsv = (preset: CsvFormatPreset) => {
    downloadHistorisCsv({
      rows: activeData,
      periodId: effectivePeriod,
      periodTitle: PERIOD_TITLES[effectivePeriod],
      settings,
      pondInfo,
      dateNote,
      preset,
    });
    setIsExportMenuOpen(false);
  };

  const tabs: { id: PeriodTab; label: string }[] = [
    { id: 'today', label: 'Hari Ini' },
    { id: 'yesterday', label: 'Kemarin' },
    { id: 'week', label: '7 Hari' },
    ...(hasRawLogs
      ? [{ id: 'realtime' as const, label: `Log Sensor (${rawLogs.length})` }]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="flux-card flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flux-badge-lime">DATA HISTORIS</span>
            {dateNote && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f4f5f7] text-[#555963] text-[11px] font-semibold">
                {dateNote}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-[#1c1d1f]">
            Log Historis Operasional &amp; Sensor
          </h2>
          <p className="text-xs text-[#7c7f86]">
            {effectivePeriod === 'realtime'
              ? 'Rekaman langsung pembacaan sensor dari Firebase Realtime Database (per baris terbaru)'
              : effectivePeriod === 'week'
              ? 'Ringkasan rata-rata harian produksi dan beban panel surya selama 7 hari'
              : 'Rekapitulasi sensor otomatis per interval 3 jam (00:00 – 21:00)'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Period Tabs */}
          <div className="inline-flex flex-wrap items-center bg-[#f4f5f7] rounded-full p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  effectivePeriod === tab.id
                    ? 'bg-[#1c1d1f] text-white'
                    : 'text-[#7c7f86] hover:text-[#1c1d1f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export CSV Dropdown Button */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              aria-expanded={isExportMenuOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4f362] text-[#1c1d1f] text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div
                  key="export-csv-menu"
                  role="menu"
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 bg-white rounded-[18px] shadow-xl border border-[#e5e7eb] p-1.5 z-30 origin-top-right"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleDownloadCsv('excel_id')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f4f5f7] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1c1d1f]">
                        Excel Indonesia (;)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#d4f362] text-[#1c1d1f] text-[10px] font-extrabold">
                        Rapi
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7c7f86] block mt-0.5">
                      Kolom &amp; angka desimal koma otomatis rapi di Excel Windows
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleDownloadCsv('standard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#f4f5f7] transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#1c1d1f] block">
                      CSV Standar (,)
                    </span>
                    <span className="text-[11px] text-[#7c7f86] block mt-0.5">
                      Untuk Google Sheets, LibreOffice, atau analisis data
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.03 }}
          whileHover={{ y: -2 }}
          className="flux-card py-4 px-5"
        >
          <div className="flex items-center justify-between text-[#7c7f86] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">
              Tegangan Rata-rata
            </span>
            <Zap className="w-4 h-4 text-[#1c1d1f]" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#1c1d1f] tabular-nums">
            {summary.populatedCount > 0
              ? `${summary.avgVoltage.toFixed(2)} V`
              : '—'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          whileHover={{ y: -2 }}
          className="flux-card py-4 px-5"
        >
          <div className="flex items-center justify-between text-[#7c7f86] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">
              Arus Rata-rata
            </span>
            <Activity className="w-4 h-4 text-[#6e56cf]" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#1c1d1f] tabular-nums">
            {summary.populatedCount > 0
              ? `${summary.avgCurrent.toFixed(2)} A`
              : '—'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.13 }}
          whileHover={{ y: -2 }}
          className="flux-card py-4 px-5"
        >
          <div className="flex items-center justify-between text-[#7c7f86] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide">
              Daya Puncak
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#1c1d1f] tabular-nums">
            {summary.populatedCount > 0
              ? `${summary.maxPower.toFixed(2)} W`
              : '—'}
          </p>
        </motion.div>
      </div>

      {/* Historical Data Container */}
      <div className="flux-card p-0 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f5f7] border-b border-[#e5e7eb] text-[#7c7f86] font-bold">
                <th className="py-3.5 px-5">Waktu / Periode</th>
                <th className="py-3.5 px-5">Iradiasi</th>
                <th className="py-3.5 px-5">Tegangan Panel</th>
                <th className="py-3.5 px-5">Arus Panel</th>
                <th className="py-3.5 px-5 text-right">Daya PV</th>
              </tr>
            </thead>
            <motion.tbody
              key={`tbody-${effectivePeriod}-${safePage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22 }}
              className="divide-y divide-[#f0f1f3] text-[#1c1d1f] font-medium"
            >
              {paginatedRows.map((row, idx) => {
                const populated = isDataPointPopulated(row);
                const power = row.teganganPanel * row.arusPanel;

                return (
                  <tr
                    key={`${effectivePeriod}-${startIndex + idx}`}
                    className={`transition-colors ${
                      populated ? 'hover:bg-[#f9fafb]' : 'bg-[#fafafa]/60'
                    }`}
                  >
                    <td className="py-3.5 px-5 tabular-nums">
                      <div className="font-bold text-[#1c1d1f]">{row.time}</div>
                      {(row.dateLabel ||
                        (typeof row.sampleCount === 'number' &&
                          row.sampleCount > 1)) && (
                        <div className="text-[11px] text-[#7c7f86] mt-0.5">
                          {[
                            row.dateLabel,
                            typeof row.sampleCount === 'number' &&
                            row.sampleCount > 1
                              ? `${row.sampleCount} sampel`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5 tabular-nums">
                      {populated ? (
                        <span className="flux-badge-lime">{row.iradiasi} W/m²</span>
                      ) : (
                        <span className="text-[#9ca3af]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-bold tabular-nums">
                      {populated ? (
                        `${row.teganganPanel.toFixed(2)} V`
                      ) : (
                        <span className="text-[#9ca3af] font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-bold tabular-nums">
                      {populated ? (
                        <span className="text-[#6e56cf]">
                          {row.arusPanel.toFixed(2)} A
                        </span>
                      ) : (
                        <span className="text-[#9ca3af] font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-extrabold tabular-nums text-right">
                      {populated ? (
                        `${power.toFixed(2)} W`
                      ) : (
                        <span className="text-[#9ca3af] font-normal">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>

        {/* Mobile Card List (No horizontal scroll clutter on HP) */}
        <motion.div
          key={`mob-list-${effectivePeriod}-${safePage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="md:hidden divide-y divide-[#f0f1f3]"
        >
          {paginatedRows.map((row, idx) => {
            const populated = isDataPointPopulated(row);
            const power = row.teganganPanel * row.arusPanel;

            return (
              <div
                key={`mob-${effectivePeriod}-${startIndex + idx}`}
                className="p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-extrabold text-[#1c1d1f] tabular-nums">
                      {row.time}
                    </span>
                    {row.dateLabel && (
                      <span className="text-[11px] text-[#7c7f86] ml-2">
                        {row.dateLabel}
                      </span>
                    )}
                  </div>
                  {typeof row.sampleCount === 'number' && row.sampleCount > 1 && (
                    <span className="text-[11px] font-semibold text-[#7c7f86] tabular-nums">
                      {row.sampleCount} sampel
                    </span>
                  )}
                </div>

                {populated ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#f4f5f7] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-[#7c7f86] block">
                        Tegangan
                      </span>
                      <span className="font-bold text-[#1c1d1f] tabular-nums">
                        {row.teganganPanel.toFixed(2)} V
                      </span>
                    </div>
                    <div className="bg-[#f4f5f7] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-[#7c7f86] block">
                        Arus
                      </span>
                      <span className="font-bold text-[#6e56cf] tabular-nums">
                        {row.arusPanel.toFixed(2)} A
                      </span>
                    </div>
                    <div className="bg-[#f4f5f7] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-[#7c7f86] block">
                        Daya PV
                      </span>
                      <span className="font-extrabold text-[#1c1d1f] tabular-nums">
                        {power.toFixed(2)} W
                      </span>
                    </div>
                    <div className="bg-[#f4f5f7] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-[#7c7f86] block">
                        Iradiasi
                      </span>
                      <span className="font-bold text-[#1c1d1f] tabular-nums">
                        {row.iradiasi} W/m²
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#9ca3af]">
                    Tidak ada rekaman sensor pada rentang jam ini.
                  </p>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Pagination Footer when rows > PAGE_SIZE */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-[#f0f1f3] bg-[#fafafa] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#7c7f86] font-medium tabular-nums">
              Menampilkan{' '}
              <strong className="text-[#1c1d1f]">{startIndex + 1}</strong>–
              <strong className="text-[#1c1d1f]">
                {Math.min(startIndex + PAGE_SIZE, activeData.length)}
              </strong>{' '}
              dari <strong className="text-[#1c1d1f]">{activeData.length}</strong>{' '}
              data
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1c1d1f] font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[#f4f5f7]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <span className="px-2.5 font-bold text-[#1c1d1f] tabular-nums">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-[#1c1d1f] font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-[#f4f5f7]"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
