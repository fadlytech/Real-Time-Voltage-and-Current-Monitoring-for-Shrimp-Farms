import React from 'react';
import { X, BatteryCharging, Zap, Clock } from 'lucide-react';
import { BatteryTelemetry, BatterySpec } from '../types';
import { getStatusBaterai, BATERAI_CUTOFF_PERSEN } from '../data/batteryModel';

interface BatteryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  battery: BatteryTelemetry;
  spec: BatterySpec;
}

const formatDuration = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h} jam ${m} menit`;
};

export const BatteryDetailModal: React.FC<BatteryDetailModalProps> = ({
  isOpen,
  onClose,
  battery,
  spec,
}) => {
  if (!isOpen) return null;

  const { teganganBaterai: v, arusBaterai: i, persentase } = battery;
  const status = getStatusBaterai(persentase, i);
  const isCharging = status === 'Mengisi';
  const statusColor =
    status === 'Cutoff' ? 'text-red-700' : status === 'Dipakai' ? 'text-amber-700' : status === 'Penuh' ? 'text-blue-700' : 'text-emerald-700';

  // P = V × I (W). Nilai absolut ditampilkan sebagai daya yang dikonsumsi.
  const power = v * i;
  const absPower = Math.abs(power);

  // Energi nominal (kWh) = tegangan nominal × kapasitas / 1000
  const energyNominalKwh = (spec.teganganNominal * spec.kapasitasAh) / 1000;
  const energyAvailableKwh = (persentase / 100) * energyNominalKwh;

  // Estimasi waktu: sisa energi / daya (saat dipakai) atau energi yang belum terisi / daya (saat mengisi)
  let estimasi = '—';
  if (status === 'Penuh') {
    estimasi = 'Sudah penuh';
  } else if (status === 'Cutoff') {
    estimasi = `Beban terputus (cutoff ${BATERAI_CUTOFF_PERSEN}%)`;
  } else if (absPower >= 1) {
    const energyNeededKwh = energyNominalKwh - energyAvailableKwh;
    const hours = isCharging
      ? energyNeededKwh / (absPower / 1000)
      : energyAvailableKwh / (absPower / 1000);
    estimasi = formatDuration(hours);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Detail Sistem Baterai</h3>
              <p className="text-xs text-slate-500">Spesifikasi dan kondisi baterai saat ini</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail baterai"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs sm:text-sm">
          {/* Spesifikasi */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
              1. Spesifikasi
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-400 block text-[11px]">Tipe</span>
                <span className="font-bold text-slate-800">{spec.tipe}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-400 block text-[11px]">Konfigurasi</span>
                <span className="font-bold text-slate-800">{spec.konfigurasi}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tegangan Nominal</span>
                <span className="font-bold text-slate-800 font-mono">{spec.teganganNominal} V</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kapasitas</span>
                <span className="font-bold text-slate-800 font-mono">{spec.kapasitasAh} Ah</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Energi Nominal</span>
                <span className="font-bold text-slate-800 font-mono">
                  {energyNominalKwh.toFixed(2)} kWh
                </span>
              </div>
            </div>
          </div>

          {/* Kondisi saat ini */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              2. Kondisi Saat Ini
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">State of Charge</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{persentase}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tegangan (V)</span>
                <span className="font-bold text-slate-800 font-mono text-sm">{v.toFixed(2)} V</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Arus (I)</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {isCharging ? '+' : ''}
                  {i.toFixed(2)} A
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span className={`font-bold text-sm ${statusColor}`}>{status}</span>
              </div>
            </div>

            {/* Rumus daya */}
            <div className="mt-4 bg-white rounded-lg border border-slate-200 p-3 font-mono text-xs text-slate-700">
              <div className="text-slate-400 mb-1 font-sans text-[11px]">Daya Konsumsi (P = V × I)</div>
              <div>
                P = {v.toFixed(2)} V × {Math.abs(i).toFixed(2)} A ={' '}
                <span className="font-bold text-slate-900">{absPower.toFixed(1)} W</span>
              </div>
            </div>
          </div>

          {/* Estimasi & energi tersedia */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              3. Estimasi Energi
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Energi Tersedia</span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {energyAvailableKwh.toFixed(2)} kWh
                </span>
                <span className="text-slate-400 block text-[11px] mt-0.5">
                  {persentase}% × {energyNominalKwh.toFixed(2)} kWh
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">
                  {status === 'Dipakai' ? 'Perkiraan Waktu Habis' : 'Perkiraan Waktu Penuh'}
                </span>
                <span className="font-bold text-slate-800 text-sm">{estimasi}</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">
                  {status === 'Dipakai'
                    ? 'Energi tersedia ÷ daya konsumsi'
                    : 'Energi yang belum terisi ÷ daya pengisian'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
