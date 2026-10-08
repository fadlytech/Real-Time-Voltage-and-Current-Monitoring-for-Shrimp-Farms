import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  BatteryCharging,
  Fan,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2,
  Cpu,
  Layers,
  Fish,
  Calendar,
} from 'lucide-react';
import { SolarTelemetry, PondInfo, NotificationItem } from '../types';

interface ModalsProps {
  // Detail Sistem Modal
  isDetailOpen: boolean;
  onCloseDetail: () => void;
  telemetry: SolarTelemetry;

  // Edit Pond Modal
  isEditPondOpen: boolean;
  onCloseEditPond: () => void;
  pondInfo: PondInfo;
  onSavePond: (updated: PondInfo) => void;

  // Aerator Control Modal
  isAeratorOpen: boolean;
  onCloseAerator: () => void;
  onUpdateAerator: (speed: number, status: boolean, mode: 'OTOMATIS' | 'MANUAL') => void;

  // View All Notifications Modal
  isNotifOpen: boolean;
  onCloseNotif: () => void;
  notifications: NotificationItem[];
  onToggleNotifStatus: (id: string) => void;
  onMarkAllResolved: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isDetailOpen,
  onCloseDetail,
  telemetry,
  isEditPondOpen,
  onCloseEditPond,
  pondInfo,
  onSavePond,
  isAeratorOpen,
  onCloseAerator,
  onUpdateAerator,
  isNotifOpen,
  onCloseNotif,
  notifications,
  onToggleNotifStatus,
  onMarkAllResolved,
}) => {
  // Temporary state for pond edit form
  const [pondForm, setPondForm] = useState<PondInfo>({ ...pondInfo });

  // Temporary state for aerator controls
  const [speed, setSpeed] = useState<number>(telemetry.kecepatanAerator);
  const [status, setStatus] = useState<boolean>(telemetry.statusAerator);
  const [mode, setMode] = useState<'OTOMATIS' | 'MANUAL'>(telemetry.modeAerator);

  // Notification modal filter
  const [notifFilter, setNotifFilter] = useState<'Semua' | 'Peringatan' | 'Info'>('Semua');

  return (
    <>
      {/* 1. DETAIL SISTEM MODAL */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Spesifikasi & Detail Sistem Aerator PV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Karakteristik teknis modul PV, kontroler MPPT, dan baterai
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseDetail}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 text-xs sm:text-sm">
              {/* PV Subsystem */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    1. Modul Panel Surya (Monocrystalline)
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    NORMAL
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Daya Output</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.dayaPv} W</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tegangan (Vmp)</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.teganganPanel} V</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Arus (Imp)</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.arusPanel} A</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Effisiensi PV</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">21.8%</span>
                  </div>
                </div>
              </div>

              {/* MPPT Controller Subsystem */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-sky-600" />
                    2. Smart MPPT Charge Controller (48V / 60A)
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    TRACKING ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Efisiensi MPPT</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">98.6 %</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Algoritma</span>
                    <span className="font-bold text-slate-800 text-sm">P&O Adaptive</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Suhu Heatsink</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">38.2 °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Protokol IoT</span>
                    <span className="font-bold text-slate-800 text-sm">MQTT / Wi-Fi</span>
                  </div>
                </div>
              </div>

              {/* Battery Bank Subsystem */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    3. Baterai LiFePO4 (48V 100Ah - 4.8 kWh)
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    CHARGING
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">State of Charge</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">{telemetry.kapasitasBaterai} %</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tegangan Bus</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.teganganBaterai} V</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Siklus Baterai</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">184 Cycle</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Health (SoH)</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">99.2 %</span>
                  </div>
                </div>
              </div>

              {/* Aerator Subsystem */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Fan className="w-4 h-4 text-cyan-600" />
                    4. Motor Aerator Kincir Air (BLDC 48V 500W)
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    ON
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Konsumsi Daya</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.dayaBeban} W</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kecepatan Relatif</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{telemetry.kecepatanAerator} %</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Putaran Kincir</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">105 RPM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Transfer Oksigen</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">1.8 kg O₂/jam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onCloseDetail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT KONDISI KOLAM MODAL */}
      {isEditPondOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Fish className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Ubah Parameter Kolam
                </h3>
              </div>
              <button
                onClick={onCloseEditPond}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Luas Kolam (m²)
                </label>
                <input
                  type="number"
                  value={pondForm.luasM2}
                  onChange={(e) =>
                    setPondForm({
                      ...pondForm,
                      luasM2: Number(e.target.value),
                      luasKolam: `${Number(e.target.value).toLocaleString('id-ID')} m²`,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Estimasi Populasi (ekor)
                </label>
                <input
                  type="number"
                  value={pondForm.populasiCount}
                  onChange={(e) =>
                    setPondForm({
                      ...pondForm,
                      populasiCount: Number(e.target.value),
                      estimasiPopulasi: `${Number(e.target.value).toLocaleString('id-ID')} ekor`,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Jenis Ikan
                </label>
                <select
                  value={pondForm.jenisIkan}
                  onChange={(e) => setPondForm({ ...pondForm, jenisIkan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Nila">Nila Hitam / Merah (Oreochromis niloticus)</option>
                  <option value="Lele">Lele Mutiara / Sangkuriang (Clarias gariepinus)</option>
                  <option value="Patin">Patin Siam (Pangasianodon hypophthalmus)</option>
                  <option value="Gurame">Gurame (Osphronemus goramy)</option>
                  <option value="Udang Vaname">Udang Vaname (Litopenaeus vannamei)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Umur Budidaya (hari)
                </label>
                <input
                  type="number"
                  value={pondForm.umurHari}
                  onChange={(e) =>
                    setPondForm({
                      ...pondForm,
                      umurHari: Number(e.target.value),
                      umurBudidaya: `${e.target.value} hari`,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Status Kualitas Air
                </label>
                <select
                  value={pondForm.kualitasAir}
                  onChange={(e) => setPondForm({ ...pondForm, kualitasAir: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Baik">Baik (Optimal)</option>
                  <option value="Cukup">Cukup (Dalam batas wajar)</option>
                  <option value="Kritis">Kritis (Perlu perhatian segera)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={onCloseEditPond}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onSavePond(pondForm);
                  onCloseEditPond();
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. KONTROL AERATOR MODAL */}
      {isAeratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Fan className="w-5 h-5 animate-spin-slow" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Kontrol Operasional Aerator
                </h3>
              </div>
              <button
                onClick={onCloseAerator}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Power Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    Saklar Daya Aerator
                  </span>
                  <span className="text-xs text-slate-500">
                    {status ? 'Sedang aktif memutar kincir' : 'Mesin dalam keadaan mati'}
                  </span>
                </div>
                <button
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    status ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      status ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Mode Pengoperasian
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('OTOMATIS')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      mode === 'OTOMATIS'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Otomatis (Sensor DO)
                  </button>
                  <button
                    onClick={() => setMode('MANUAL')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      mode === 'MANUAL'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Manual Pengguna
                  </button>
                </div>
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-semibold text-slate-700">Kecepatan Putaran Kincir</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{speed} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  disabled={!status}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-40"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0% (Mati)</span>
                  <span>50% (Eco)</span>
                  <span>85% (Optimal)</span>
                  <span>100% (Maksimal)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={onCloseAerator}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  onUpdateAerator(speed, status, mode);
                  onCloseAerator();
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Terapkan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. LIHAT SEMUA NOTIFIKASI MODAL */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Log Notifikasi & Alarm Sistem
                  </h3>
                  <p className="text-xs text-slate-500">
                    Riwayat peringatan operasional PV, baterai, dan sensor kolam
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseNotif}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter buttons */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {(['Semua', 'Peringatan', 'Info'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNotifFilter(cat)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      notifFilter === cat
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={onMarkAllResolved}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Tandai Semua Selesai
              </button>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
              {notifications
                .filter((item) => (notifFilter === 'Semua' ? true : item.kategori === notifFilter))
                .map((item) => (
                  <div
                    key={item.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          item.kategori === 'Peringatan' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{item.pesan}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.waktu} · Kategori: {item.kategori}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleNotifStatus(item.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors ${
                        item.status === 'Terselesaikan'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}
                    >
                      {item.status}
                    </button>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onCloseNotif}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
