import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, MoreVertical, Plus, Minus, AlertTriangle } from 'lucide-react';
import { SolarTelemetry, PvSettings } from '../types';
import { getIradiasiBulanan2026 } from '../data/solarRadiation';

type BubbleParam = 'tegangan' | 'arus' | 'iradiasi';

interface SystemDiagramProps {
  telemetry: SolarTelemetry;
  settings: PvSettings;
  onUpdateTelemetry: (updated: SolarTelemetry) => void;
  onOpenDetails: () => void;
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({
  telemetry,
  settings,
  onUpdateTelemetry,
  onOpenDetails,
}) => {
  const [layerOrder, setLayerOrder] = useState<BubbleParam[]>([
    'tegangan',
    'arus',
    'iradiasi',
  ]);

  const bringToFront = (param: BubbleParam) => {
    setLayerOrder((prev) => {
      if (prev[prev.length - 1] === param) return prev;
      return [...prev.filter((item) => item !== param), param];
    });
  };

  const frontParam = layerOrder[layerOrder.length - 1];
  const getLayerZIndex = (param: BubbleParam) =>
    (layerOrder.indexOf(param) + 1) * 10;

  const dayaPv = (telemetry.teganganPanel * telemetry.arusPanel).toFixed(1);
  const defaultIradiasi = Math.round(getIradiasiBulanan2026(new Date()));
  const iradiasi =
    telemetry.iradiasi !== undefined ? Math.round(telemetry.iradiasi) : defaultIradiasi;

  const maxV = Math.max(10, settings.maxVoltage || 42);
  const maxI = Math.max(5, settings.maxCurrent || 20);
  const maxG = 300; // W/m² maksimal iradiasi surya

  const pctTegangan = Math.min(100, Math.round((telemetry.teganganPanel / maxV) * 100));
  const pctArus = Math.min(100, Math.round((telemetry.arusPanel / maxI) * 100));
  const pctIradiasi = Math.min(100, Math.round((iradiasi / maxG) * 100));

  // Enlarged Dynamic Circle Diameters (in px) that grow and shrink with Voltage, Current, and Irradiance
  const vRatio = Math.min(1.25, Math.max(0.25, telemetry.teganganPanel / maxV));
  const voltDiameter = Math.round(124 + vRatio * 92); // ~205px at nominal 36.8V (147px .. 239px)

  const iRatio = Math.min(1.25, Math.max(0.25, telemetry.arusPanel / maxI));
  const ampDiameter = Math.round(106 + iRatio * 80); // ~172px at nominal 16.6A (126px .. 206px)

  const gRatio = Math.min(1.3, Math.max(0.2, iradiasi / maxG));
  const iradDiameter = Math.round(96 + gRatio * 66); // ~132px at nominal (109px .. 182px)

  // Symmetrical 3-Bubble Cluster Geometry:
  const rV = voltDiameter / 2;
  const rI = ampDiameter / 2;
  const rG = iradDiameter / 2;

  const centerDist = (rV + rI) * 0.84;
  const totalTopWidth = rV + centerDist + rI;
  const xV = -totalTopWidth / 2 + rV;
  const xI = totalTopWidth / 2 - rI;

  const yV = -rG * 0.34;
  const yI = -rG * 0.16;

  // Lime circle sits centered at the tangent junction between Lavender and Dark
  const xG = (xV + rV + (xI - rI)) / 2;
  const yG = Math.max(rV, rI) * 0.55;

  const isOverVoltage = telemetry.teganganPanel > settings.maxVoltage;
  const isOverCurrent = telemetry.arusPanel > settings.maxCurrent;
  const isUnderVoltage =
    settings.undervoltageAlert && telemetry.teganganPanel < settings.minVoltage;

  const adjustVoltage = (delta: number) => {
    const nextV = Math.max(0, Number((telemetry.teganganPanel + delta).toFixed(1)));
    onUpdateTelemetry({ ...telemetry, teganganPanel: nextV });
  };

  const adjustCurrent = (delta: number) => {
    const nextI = Math.max(0, Number((telemetry.arusPanel + delta).toFixed(1)));
    onUpdateTelemetry({ ...telemetry, arusPanel: nextI });
  };

  const adjustIradiasi = (delta: number) => {
    const nextG = Math.max(0, Math.round(iradiasi + delta));
    onUpdateTelemetry({ ...telemetry, iradiasi: nextG });
  };

  return (
    <section className="flux-card w-full flex flex-col justify-between">
      {/* Top Card Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flux-icon-circle">
              <Zap className="w-4 h-4 text-[#1c1d1f]" />
            </div>
            <h2 className="text-sm font-bold text-[#1c1d1f]">
              Sistem Panel Surya
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            title="Detail Sistem Panel Surya"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 grid place-items-center text-[#71757d] hover:text-[#1c1d1f] cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Big Output Number with Floating Badge */}
        <div className="relative inline-block mt-1">
          {isOverVoltage || isOverCurrent ? (
            <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 absolute -top-4 left-14 whitespace-nowrap">
              <AlertTriangle className="w-3 h-3" />
              MELEWATI BATAS
            </span>
          ) : isUnderVoltage ? (
            <span className="bg-amber-400 text-[#1c1d1f] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full absolute -top-4 left-14 whitespace-nowrap">
              LOW VOLT
            </span>
          ) : (
            <span className="flux-badge-lime absolute -top-3.5 left-16">
              +21.8%
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight text-[#1c1d1f] tabular-nums">
              {dayaPv}
            </span>
            <span className="text-xs font-medium text-[#71757d]">
              W daya PV hari ini
            </span>
          </div>
        </div>
      </div>

      {/* 3 Enlarged Overlapping Bubble Circles (Click/Tap any bubble to bring it to front) */}
      <div className="relative h-80 sm:h-88 my-3 select-none overflow-visible flex items-center justify-center">
        {/* 1. Lavender Circle: Tegangan Panel (Top-Left) */}
        <div
          style={{
            width: `${voltDiameter}px`,
            height: `${voltDiameter}px`,
            left: `calc(50% + ${xV}px)`,
            top: `calc(46% + ${yV}px)`,
            transform: 'translate(-50%, -50%)',
            zIndex: getLayerZIndex('tegangan'),
          }}
          className="absolute transition-all duration-300 ease-out"
        >
          <motion.button
            type="button"
            onClick={() => bringToFront('tegangan')}
            aria-pressed={frontParam === 'tegangan'}
            title="Klik untuk memajukan lingkaran Tegangan ke depan"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: frontParam === 'tegangan' ? 1.04 : 1,
              y: [0, -4, 0],
            }}
            transition={{
              opacity: { duration: 0.35, delay: 0.05 },
              scale: { type: 'spring', stiffness: 320, damping: 22 },
              y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: frontParam === 'tegangan' ? 1.06 : 1.04 }}
            whileTap={{ scale: 0.94 }}
            className={`w-full h-full rounded-full bg-[#c2b2fc] text-[#1c1d1f] flex flex-col items-center justify-center border-4 border-white cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1c1d1f]/30 ${
              frontParam === 'tegangan' ? 'shadow-xl' : 'shadow-sm'
            } ${isOverVoltage ? 'ring-4 ring-red-500' : ''}`}
          >
            <span
              style={{
                fontSize: `${Math.max(22, Math.round(voltDiameter * 0.22))}px`,
              }}
              className="font-extrabold tracking-tight tabular-nums leading-none"
            >
              {telemetry.teganganPanel.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#1c1d1f]/80 mt-1">
              Volt
            </span>
          </motion.button>
        </div>

        {/* 2. Dark Charcoal Circle: Arus Panel (Top-Right, White Border) */}
        <div
          style={{
            width: `${ampDiameter}px`,
            height: `${ampDiameter}px`,
            left: `calc(50% + ${xI}px)`,
            top: `calc(46% + ${yI}px)`,
            transform: 'translate(-50%, -50%)',
            zIndex: getLayerZIndex('arus'),
          }}
          className="absolute transition-all duration-300 ease-out"
        >
          <motion.button
            type="button"
            onClick={() => bringToFront('arus')}
            aria-pressed={frontParam === 'arus'}
            title="Klik untuk memajukan lingkaran Arus ke depan"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: frontParam === 'arus' ? 1.04 : 1,
              y: [0, -5, 0],
            }}
            transition={{
              opacity: { duration: 0.35, delay: 0.14 },
              scale: { type: 'spring', stiffness: 320, damping: 22 },
              y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
            }}
            whileHover={{ scale: frontParam === 'arus' ? 1.06 : 1.04 }}
            whileTap={{ scale: 0.94 }}
            className={`w-full h-full rounded-full bg-[#1c1d1f] text-white flex flex-col items-center justify-center border-4 border-white cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c2b2fc]/60 ${
              frontParam === 'arus' ? 'shadow-xl' : 'shadow-md'
            } ${isOverCurrent ? 'ring-4 ring-red-500' : ''}`}
          >
            <span
              style={{
                fontSize: `${Math.max(20, Math.round(ampDiameter * 0.22))}px`,
              }}
              className="font-extrabold tracking-tight tabular-nums leading-none"
            >
              {telemetry.arusPanel.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs sm:text-sm font-medium text-white/80 mt-1">
              Ampere
            </span>
          </motion.button>
        </div>

        {/* 3. Lime Circle: Iradiasi Matahari (Bottom-Center, White Border) */}
        <div
          style={{
            width: `${iradDiameter}px`,
            height: `${iradDiameter}px`,
            left: `calc(50% + ${xG}px)`,
            top: `calc(46% + ${yG}px)`,
            transform: 'translate(-50%, -50%)',
            zIndex: getLayerZIndex('iradiasi'),
          }}
          className="absolute transition-all duration-300 ease-out"
        >
          <motion.button
            type="button"
            onClick={() => bringToFront('iradiasi')}
            aria-pressed={frontParam === 'iradiasi'}
            title="Klik untuk memajukan lingkaran Iradiasi ke depan"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: frontParam === 'iradiasi' ? 1.04 : 1,
              y: [0, -4, 0],
            }}
            transition={{
              opacity: { duration: 0.35, delay: 0.22 },
              scale: { type: 'spring', stiffness: 320, damping: 22 },
              y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
            whileHover={{ scale: frontParam === 'iradiasi' ? 1.07 : 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={`w-full h-full rounded-full bg-[#d4f362] text-[#1c1d1f] flex flex-col items-center justify-center border-4 border-white cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1c1d1f]/30 ${
              frontParam === 'iradiasi' ? 'shadow-xl' : 'shadow-md'
            }`}
          >
            <span
              style={{
                fontSize: `${Math.max(18, Math.round(iradDiameter * 0.23))}px`,
              }}
              className="font-extrabold tracking-tight tabular-nums leading-none"
            >
              {iradiasi}
            </span>
            <span className="text-xs font-medium text-[#1c1d1f]/80 mt-0.5">
              W/m²
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom 3 Progress Rows with +/- Adjusters for Tegangan, Arus, & Iradiasi */}
      <div className="space-y-4 pt-2">
        {/* 1. Tegangan Panel */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="tabular-nums">
              <span className="text-2xl font-bold text-[#1c1d1f]">
                {pctTegangan}
              </span>
              <span className="text-xs font-semibold text-[#71757d] ml-0.5">%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-[#f3f4f6] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => adjustVoltage(-2)}
                  title="Kurangi Tegangan (-2V)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustVoltage(2)}
                  title="Tambah Tegangan (+2V)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => bringToFront('tegangan')}
                title="Klik untuk memajukan parameter Tegangan ke depan"
                className={`text-xs font-semibold flex items-center gap-1.5 tabular-nums cursor-pointer transition-colors hover:text-[#1c1d1f] ${
                  isOverVoltage
                    ? 'text-red-600 font-bold'
                    : frontParam === 'tegangan'
                    ? 'text-[#1c1d1f] font-bold'
                    : 'text-[#71757d]'
                }`}
              >
                Tegangan ({telemetry.teganganPanel.toFixed(2)} / {maxV} V)
                <span className="w-2 h-2 rounded-full bg-[#c2b2fc]" />
              </button>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#f3f4f6] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctTegangan}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${
                isOverVoltage ? 'bg-red-500' : 'bg-[#c2b2fc]'
              }`}
            />
          </div>
        </div>

        {/* 2. Arus Panel */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="tabular-nums">
              <span className="text-2xl font-bold text-[#1c1d1f]">
                {pctArus}
              </span>
              <span className="text-xs font-semibold text-[#71757d] ml-0.5">%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-[#f3f4f6] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => adjustCurrent(-1.5)}
                  title="Kurangi Arus (-1.5A)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustCurrent(1.5)}
                  title="Tambah Arus (+1.5A)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => bringToFront('arus')}
                title="Klik untuk memajukan parameter Arus ke depan"
                className={`text-xs font-semibold flex items-center gap-1.5 tabular-nums cursor-pointer transition-colors hover:text-[#1c1d1f] ${
                  isOverCurrent
                    ? 'text-red-600 font-bold'
                    : frontParam === 'arus'
                    ? 'text-[#1c1d1f] font-bold'
                    : 'text-[#71757d]'
                }`}
              >
                Arus ({telemetry.arusPanel.toFixed(2)} / {maxI} A)
                <span className="w-2 h-2 rounded-full bg-[#1c1d1f]" />
              </button>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#f3f4f6] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctArus}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${
                isOverCurrent ? 'bg-red-500' : 'bg-[#1c1d1f]'
              }`}
            />
          </div>
        </div>

        {/* 3. Iradiasi Matahari */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="tabular-nums">
              <span className="text-2xl font-bold text-[#1c1d1f]">
                {pctIradiasi}
              </span>
              <span className="text-xs font-semibold text-[#71757d] ml-0.5">%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-[#f3f4f6] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => adjustIradiasi(-20)}
                  title="Kurangi Iradiasi (-20 W/m²)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustIradiasi(20)}
                  title="Tambah Iradiasi (+20 W/m²)"
                  className="w-5 h-5 rounded-full hover:bg-white text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => bringToFront('iradiasi')}
                title="Klik untuk memajukan parameter Iradiasi ke depan"
                className={`text-xs font-semibold flex items-center gap-1.5 tabular-nums cursor-pointer transition-colors hover:text-[#1c1d1f] ${
                  frontParam === 'iradiasi'
                    ? 'text-[#1c1d1f] font-bold'
                    : 'text-[#71757d]'
                }`}
              >
                Iradiasi ({iradiasi} / {maxG} W/m²)
                <span className="w-2 h-2 rounded-full bg-[#d4f362]" />
              </button>
            </div>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#f3f4f6] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctIradiasi}%` }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-[#d4f362]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
