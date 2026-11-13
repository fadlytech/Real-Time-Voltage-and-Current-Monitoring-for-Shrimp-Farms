import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Zap, Sliders, Cpu } from 'lucide-react';
import type { SolarTelemetry } from '../types';

interface ModalsProps {
  isDetailOpen: boolean;
  onCloseDetail: () => void;
  telemetry: SolarTelemetry;
}

export const Modals: React.FC<ModalsProps> = ({
  isDetailOpen,
  onCloseDetail,
  telemetry,
}) => {
  return (
    <AnimatePresence>
      {isDetailOpen && (
        <motion.div
          key="detail-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCloseDetail}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1d1f]/60 backdrop-blur-xs"
        >
          <motion.div
            key="detail-modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="flux-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f1f3]">
          <div className="flex items-center gap-3">
            <div className="flux-icon-circle">
              <Cpu className="w-4 h-4 text-[#1c1d1f]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1c1d1f]">
                Spesifikasi &amp; Detail Sistem PV
              </h3>
              <p className="text-xs text-[#7c7f86]">
                Karakteristik teknis modul PV dan kontroler MPPT
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseDetail}
            aria-label="Tutup detail sistem"
            className="w-9 h-9 rounded-full bg-[#f4f5f7] text-[#1c1d1f] grid place-items-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-xs sm:text-sm">
          {/* Panel surya */}
          <div className="bg-[#f4f5f7] rounded-[20px] p-4">
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="font-bold text-[#1c1d1f] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#1c1d1f]" />
                1. Modul Panel Surya (Monocrystalline)
              </span>
              <span className="flux-badge-lime">NORMAL</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#7c7f86] block text-[11px]">
                  Daya Output
                </span>
                <span className="font-extrabold text-[#1c1d1f] text-sm tabular-nums">
                  {(telemetry.teganganPanel * telemetry.arusPanel).toFixed(1)} W
                </span>
              </div>

              <div>
                <span className="text-[#7c7f86] block text-[11px]">
                  Tegangan (Vmp)
                </span>
                <span className="font-extrabold text-[#1c1d1f] text-sm tabular-nums">
                  {telemetry.teganganPanel} V
                </span>
              </div>

              <div>
                <span className="text-[#7c7f86] block text-[11px]">
                  Arus (Imp)
                </span>
                <span className="font-extrabold text-[#1c1d1f] text-sm tabular-nums">
                  {telemetry.arusPanel} A
                </span>
              </div>

              <div>
                <span className="text-[#7c7f86] block text-[11px]">
                  Efisiensi PV
                </span>
                <span className="font-extrabold text-[#1c1d1f] text-sm tabular-nums">
                  21.8%
                </span>
              </div>
            </div>
          </div>

          {/* Kontroler MPPT */}
          <div className="bg-[#1c1d1f] text-white rounded-[20px] p-4">
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#d4f362]" />
                2. Smart MPPT Charge Controller (48V / 60A)
              </span>
              <span className="flux-badge-lime">TRACKING ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#9ca3af] block text-[11px]">
                  Efisiensi MPPT
                </span>
                <span className="font-extrabold text-white text-sm tabular-nums">
                  98.6%
                </span>
              </div>

              <div>
                <span className="text-[#9ca3af] block text-[11px]">
                  Algoritma
                </span>
                <span className="font-extrabold text-white text-sm">
                  P&amp;O Adaptive
                </span>
              </div>

              <div>
                <span className="text-[#9ca3af] block text-[11px]">
                  Suhu Heatsink
                </span>
                <span className="font-extrabold text-white text-sm tabular-nums">
                  38.2 °C
                </span>
              </div>

              <div>
                <span className="text-[#9ca3af] block text-[11px]">
                  Protokol IoT
                </span>
                <span className="font-extrabold text-white text-sm">
                  MQTT / Wi-Fi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#f0f1f3] flex justify-end">
          <button
            type="button"
            onClick={onCloseDetail}
            className="px-5 py-2.5 rounded-full bg-[#1c1d1f] text-white text-xs font-bold cursor-pointer"
          >
            Tutup Rincian
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
