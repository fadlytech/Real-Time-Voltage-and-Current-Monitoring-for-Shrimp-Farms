import React, { useState } from 'react';
import { Plug, Droplets, Thermometer, ChevronDown } from 'lucide-react';
import { ChartDataPoint } from '../types';

interface TelemetryChartsProps {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  todayData,
  yesterdayData,
  weekData,
}) => {
  const [rangeBaterai, setRangeBaterai] = useState<'today' | 'yesterday' | 'week'>('today');
  const [rangeDo, setRangeDo] = useState<'today' | 'yesterday' | 'week'>('today');
  const [rangeSuhu, setRangeSuhu] = useState<'today' | 'yesterday' | 'week'>('today');

  const getData = (range: 'today' | 'yesterday' | 'week') => {
    if (range === 'yesterday') return yesterdayData;
    if (range === 'week') return weekData;
    return todayData;
  };

  const bateraiData = getData(rangeBaterai);
  const doData = getData(rangeDo);
  const suhuData = getData(rangeSuhu);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* 1. Level Baterai Chart */}
      <SingleChartCard
        title="Level Baterai"
        icon={<Plug className="w-4 h-4 text-blue-600" />}
        iconBg="bg-blue-50"
        yLabel="Kapasitas (%)"
        minY={0}
        maxY={100}
        stepY={20}
        dataKey="baterai"
        data={bateraiData}
        color="#2563eb"
        unit="%"
        selectedRange={rangeBaterai}
        onSelectRange={setRangeBaterai}
      />

      {/* 2. Dissolved Oxygen (DO) Chart */}
      <SingleChartCard
        title="Dissolved Oxygen (DO)"
        icon={<Droplets className="w-4 h-4 text-blue-600" />}
        iconBg="bg-blue-50"
        yLabel="DO (mg/L)"
        minY={0}
        maxY={10}
        stepY={2}
        dataKey="do"
        data={doData}
        color="#0284c7"
        unit="mg/L"
        selectedRange={rangeDo}
        onSelectRange={setRangeDo}
      />

      {/* 3. Suhu Air Chart */}
      <SingleChartCard
        title="Suhu Air"
        icon={<Thermometer className="w-4 h-4 text-amber-500" />}
        iconBg="bg-amber-50"
        yLabel="Suhu (°C)"
        minY={20}
        maxY={36}
        stepY={4}
        dataKey="suhu"
        data={suhuData}
        color="#f59e0b"
        unit="°C"
        selectedRange={rangeSuhu}
        onSelectRange={setRangeSuhu}
      />
    </div>
  );
};

interface SingleChartCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  yLabel: string;
  minY: number;
  maxY: number;
  stepY: number;
  dataKey: 'baterai' | 'do' | 'suhu';
  data: ChartDataPoint[];
  color: string;
  unit: string;
  selectedRange: 'today' | 'yesterday' | 'week';
  onSelectRange: (range: 'today' | 'yesterday' | 'week') => void;
}

const SingleChartCard: React.FC<SingleChartCardProps> = ({
  title,
  icon,
  iconBg,
  yLabel,
  minY,
  maxY,
  stepY,
  dataKey,
  data,
  color,
  unit,
  selectedRange,
  onSelectRange,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG Geometry Constants
  const width = 460;
  const height = 180;
  const padLeft = 46;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Generate Y ticks
  const yTicks: number[] = [];
  for (let val = maxY; val >= minY; val -= stepY) {
    yTicks.push(val);
  }

  // Calculate coordinates for points
  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1)) * chartW;
    const val = d[dataKey] as number;
    const normalizedY = (val - minY) / (maxY - minY);
    const y = padTop + chartH - normalizedY * chartH;
    return { x, y, val, time: d.time };
  });

  // Build SVG path
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    // Catmull-Rom or cubic bezier smooth curve
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, '');

  // Build closed area path
  const areaPath = `${linePath} L ${points[points.length - 1].x},${
    padTop + chartH
  } L ${points[0].x},${padTop + chartH} Z`;

  const gradientId = `grad-${title.replace(/[^a-zA-Z]/g, '')}`;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">
            {title}
          </h3>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => onSelectRange(e.target.value as any)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-lg pl-2.5 pr-6 py-1 text-[11px] font-semibold text-slate-600 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="today">Hari ini</option>
            <option value="yesterday">Kemarin</option>
            <option value="week">7 Hari Terakhir</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y Axis Label */}
          <text
            x={12}
            y={padTop + chartH / 2}
            textAnchor="middle"
            fill="#64748b"
            fontSize="9"
            fontWeight="600"
            transform={`rotate(-90 12 ${padTop + chartH / 2})`}
          >
            {yLabel}
          </text>

          {/* Grid lines and Y axis ticks */}
          {yTicks.map((val) => {
            const normalizedY = (val - minY) / (maxY - minY);
            const y = padTop + chartH - normalizedY * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(idx)}
            >
              {/* Invisible touch circle */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              {/* Visible dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === idx ? '5' : '3'}
                fill={color}
                stroke="#ffffff"
                strokeWidth={hoverIndex === idx ? '2' : '1.5'}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* X Axis Ticks */}
          {points.map((p, idx) => {
            // Render alternate or all depending on count
            if (data.length > 7 && idx % 2 !== 0 && idx !== points.length - 1) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill="#64748b"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="500"
              >
                {p.time}
              </text>
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoverIndex !== null && points[hoverIndex] && (
            <line
              x1={points[hoverIndex].x}
              y1={padTop}
              x2={points[hoverIndex].x}
              y2={padTop + chartH}
              stroke={color}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              strokeOpacity="0.8"
            />
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute pointer-events-none bg-slate-900/90 text-white rounded-lg px-2 py-1 text-[11px] shadow-lg transform -translate-x-1/2 -translate-y-full transition-all duration-75"
            style={{
              left: `${(points[hoverIndex].x / width) * 100}%`,
              top: `${(points[hoverIndex].y / height) * 100}%`,
              marginTop: '-8px',
            }}
          >
            <div className="font-mono text-slate-300 text-[10px] leading-tight">
              {points[hoverIndex].time}
            </div>
            <div className="font-bold font-mono">
              {points[hoverIndex].val} {unit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
