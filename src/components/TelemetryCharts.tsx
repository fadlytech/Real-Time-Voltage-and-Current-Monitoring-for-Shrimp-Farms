import React, { useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
import { ChartDataPoint, SolarTelemetry } from '../types';

interface TelemetryChartsProps {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
  telemetry?: SolarTelemetry;
  dateNote?: string | null;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  todayData,
  yesterdayData,
  weekData,
  telemetry,
  dateNote,
}) => {
  const [selectedRange, setSelectedRange] = useState<'today' | 'yesterday' | 'week'>('today');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeData =
    selectedRange === 'yesterday'
      ? yesterdayData
      : selectedRange === 'week'
      ? weekData
      : todayData;

  // Find peak index so one column group is highlighted by default
  const peakIndex =
    activeData.length > 0
      ? activeData.reduce(
          (bestIdx, item, idx, arr) =>
            item.teganganPanel * item.arusPanel >
            arr[bestIdx].teganganPanel * arr[bestIdx].arusPanel
              ? idx
              : bestIdx,
          0
        )
      : 0;

  const focusedIdx = hoverIndex !== null ? hoverIndex : peakIndex;
  const focusedPoint = activeData[focusedIdx] || activeData[0];

  const isHovering = hoverIndex !== null && Boolean(focusedPoint);

  const displayVoltage = isHovering
    ? focusedPoint.teganganPanel
    : telemetry
    ? telemetry.teganganPanel
    : focusedPoint?.teganganPanel ?? 0;

  const displayCurrent = isHovering
    ? focusedPoint.arusPanel
    : telemetry
    ? telemetry.arusPanel
    : focusedPoint?.arusPanel ?? 0;

  const displayPower = displayVoltage * displayCurrent;
  const displayLabel = isHovering
    ? focusedPoint?.time
    : telemetry
    ? 'Live'
    : focusedPoint?.time ?? '-';

  // Dynamic upper bounds so small panels (e.g., 18V/0.8A) and large panels (37V/18A) both scale clearly
  const maxDataV = Math.max(...activeData.map((d) => d.teganganPanel), 1);
  const maxDataI = Math.max(...activeData.map((d) => d.arusPanel), 0.1);
  const maxDataP = Math.max(
    ...activeData.map((d) => d.teganganPanel * d.arusPanel),
    1
  );

  return (
    <section
      aria-label="Analisis Kurva PV"
      className="flux-dark-card flex-1 flex flex-col justify-between"
    >
      {/* Top Header Row (Icon Circle + Title + Pill Range Selector) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flux-icon-circle-dark">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Analisis Kurva PV
            </h2>
            {dateNote && selectedRange === 'today' && (
              <span className="text-[10px] text-[#9ca3af] block">
                {dateNote}
              </span>
            )}
          </div>
        </div>

        {/* Range Pill Selector */}
        <div className="relative inline-flex items-center bg-[#2b2c30] rounded-full p-1 gap-1">
          {(
            [
              { id: 'today', label: 'Hari ini' },
              { id: 'yesterday', label: 'Kemarin' },
              { id: 'week', label: '7 Hari' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedRange(tab.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                selectedRange === tab.id
                  ? 'bg-[#d4f362] text-[#1c1d1f]'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] mr-1.5 hidden sm:block" />
        </div>
      </div>

      {/* Triple Callout Metrics Row: Tegangan (V), Arus (A), & Daya (W) */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-5">
        {/* Callout 1: Tegangan Panel (Lime vertical pill bar) */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-7 rounded-full bg-[#d4f362] shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {displayVoltage.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#9ca3af]">V</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-[#9ca3af] mt-1">
            Tegangan ({displayLabel})
          </p>
        </div>

        {/* Callout 2: Arus Panel (Lavender vertical pill bar) */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-7 rounded-full bg-[#c2b2fc] shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {displayCurrent.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#9ca3af]">A</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-[#9ca3af] mt-1">
            Arus ({displayLabel})
          </p>
        </div>

        {/* Callout 3: Daya Panel (White vertical pill bar) */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-7 rounded-full bg-white shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {displayPower.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#9ca3af]">W</span>
            </div>
          </div>
          <p className="text-[11px] font-medium text-[#9ca3af] mt-1">
            Daya PV ({displayLabel})
          </p>
        </div>
      </div>

      {/* Bottom Triple Pill-Bar Chart (Tegangan, Arus, & Daya) */}
      <div
        className="grid gap-1.5 sm:gap-2.5 pt-2 items-end h-44 select-none"
        style={{
          gridTemplateColumns: `repeat(${Math.max(activeData.length, 1)}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {activeData.map((point, idx) => {
          const isHighlighted = idx === focusedIdx;
          const powerVal = point.teganganPanel * point.arusPanel;

          const vPct =
            point.teganganPanel <= 0
              ? 12
              : Math.min(100, Math.max(20, (point.teganganPanel / maxDataV) * 96));
          const iPct =
            point.arusPanel <= 0
              ? 12
              : Math.min(100, Math.max(20, (point.arusPanel / maxDataI) * 96));
          const pPct =
            powerVal <= 0
              ? 12
              : Math.min(100, Math.max(20, (powerVal / maxDataP) * 96));

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoverIndex(idx)}
              onClick={() => setHoverIndex(idx)}
              className="flex flex-col items-center justify-end h-full cursor-pointer group"
            >
              {/* Triple Pill Bars: Tegangan, Arus, Daya */}
              <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full flex-1 pb-2.5">
                {/* Bar 1: Tegangan Panel */}
                <div
                  style={{ height: `${vPct}%` }}
                  title={`Tegangan (${point.time}): ${point.teganganPanel.toFixed(2)} V`}
                  className={`w-2.5 sm:w-3.5 rounded-full transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-[#d4f362]'
                      : 'flux-striped-bar group-hover:opacity-90'
                  }`}
                />
                {/* Bar 2: Arus Panel */}
                <div
                  style={{ height: `${iPct}%` }}
                  title={`Arus (${point.time}): ${point.arusPanel.toFixed(2)} A`}
                  className={`w-2.5 sm:w-3.5 rounded-full transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-[#c2b2fc]'
                      : 'flux-striped-bar group-hover:opacity-90'
                  }`}
                />
                {/* Bar 3: Daya PV */}
                <div
                  style={{ height: `${pPct}%` }}
                  title={`Daya PV (${point.time}): ${powerVal.toFixed(1)} W`}
                  className={`w-2.5 sm:w-3.5 rounded-full transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-white'
                      : 'flux-striped-bar group-hover:opacity-90'
                  }`}
                />
              </div>

              {/* Time Label */}
              <span
                className={`text-[9px] sm:text-[10px] font-semibold tabular-nums transition-colors truncate ${
                  isHighlighted ? 'text-white font-bold' : 'text-[#8e9299]'
                }`}
              >
                {point.time}
                {isHighlighted ? ' ↗' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
