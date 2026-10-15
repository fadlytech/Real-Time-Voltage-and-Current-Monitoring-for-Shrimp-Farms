import React, { useEffect, useState } from 'react';
import { X, Zap, Sliders, Cpu, Fish } from 'lucide-react';
import type { SolarTelemetry, PondInfo } from '../types';

interface ModalsProps {
  // Detail sistem
  isDetailOpen: boolean;
  onCloseDetail: () => void;
  telemetry: SolarTelemetry;

  // Edit kondisi kolam
  isEditPondOpen: boolean;
  onCloseEditPond: () => void;
  pondInfo: PondInfo;
  onSavePond: (updated: PondInfo) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  isDetailOpen,
  onCloseDetail,
  telemetry,
  isEditPondOpen,
  onCloseEditPond,
  pondInfo,
  onSavePond,
}) => {
  const [pondForm, setPondForm] = useState<PondInfo>({
    ...pondInfo,
  });

  // Sinkronkan form jika data kolam berubah dari luar modal.
  useEffect(() => {
    setPondForm({ ...pondInfo });
  }, [pondInfo]);

  return (
    <>
      {/* 1. MODAL DETAIL SISTEM */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Spesifikasi &amp; Detail Sistem Aerator PV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Karakteristik teknis modul PV, kontroler MPPT, dan baterai
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseDetail}
                aria-label="Tutup detail sistem"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs sm:text-sm">
              {/* Panel surya */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3 gap-2">
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
                    <span className="text-slate-400 block text-[11px]">
                      Daya Output
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {(telemetry.teganganPanel * telemetry.arusPanel).toFixed(1)} W
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Tegangan (Vmp)
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {telemetry.teganganPanel} V
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Arus (Imp)
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {telemetry.arusPanel} A
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Efisiensi PV
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      21.8%
                    </span>
                  </div>
                </div>
              </div>

              {/* Kontroler MPPT */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                <div className="flex items-center justify-between mb-3 gap-2">
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
                    <span className="text-slate-400 block text-[11px]">
                      Efisiensi MPPT
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      98.6%
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Algoritma
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      P&amp;O Adaptive
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Suhu Heatsink
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      38.2 °C
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      Protokol IoT
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      MQTT / Wi-Fi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onCloseDetail}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT KONDISI KOLAM */}
      {isEditPondOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
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
                type="button"
                onClick={onCloseEditPond}
                aria-label="Tutup edit kolam"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Luas Kolam (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pondForm.luasM2}
                  onChange={(e) => {
                    const luasM2 = Number(e.target.value);
                    setPondForm((prev) => ({
                      ...prev,
                      luasM2,
                      luasKolam: `${luasM2.toLocaleString('id-ID')} m²`,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Estimasi Populasi (ekor)
                </label>
                <input
                  type="number"
                  min="0"
                  value={pondForm.populasiCount}
                  onChange={(e) => {
                    const populasiCount = Number(e.target.value);
                    setPondForm((prev) => ({
                      ...prev,
                      populasiCount,
                      estimasiPopulasi: `${populasiCount.toLocaleString('id-ID')} ekor`,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Jenis Ikan
                </label>
                <select
                  value={pondForm.jenisIkan}
                  onChange={(e) =>
                    setPondForm((prev) => ({
                      ...prev,
                      jenisIkan: e.target.value,
                    }))
                  }
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
                  min="0"
                  value={pondForm.umurHari}
                  onChange={(e) => {
                    const umurHari = Number(e.target.value);
                    setPondForm((prev) => ({
                      ...prev,
                      umurHari,
                      umurBudidaya: `${umurHari} hari`,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Status Kualitas Air
                </label>
                <select
                  value={pondForm.kualitasAir}
                  onChange={(e) => {
                    const kualitasAir = e.target.value as PondInfo['kualitasAir'];
                    setPondForm((prev) => ({
                      ...prev,
                      kualitasAir,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Baik">Baik (Optimal)</option>
                  <option value="Cukup">Cukup (Dalam batas wajar)</option>
                  <option value="Kritis">Kritis (Perlu perhatian segera)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onCloseEditPond}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => {
                  onSavePond({ ...pondForm });
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
    </>
  );
};