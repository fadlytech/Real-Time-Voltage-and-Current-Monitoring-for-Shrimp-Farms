import React, { useState } from 'react';
import { Sliders, Bell, Shield, Save, CheckCircle2, Clock } from 'lucide-react';

export const PengaturanView: React.FC = () => {
  const [minDo, setMinDo] = useState<number>(5.0);
  const [maxTemp, setMaxTemp] = useState<number>(32.0);
  const [batteryCutoff, setBatteryCutoff] = useState<number>(25);
  const [autoAeration, setAutoAeration] = useState<boolean>(true);
  const [nightBoost, setNightBoost] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Pengaturan Parameter & Ambang Batas Sistem
          </h2>
          <p className="text-xs text-slate-500">
            Konfigurasi logika otomatisasi aerator cerdas dan alarm dini budidaya
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Pengaturan Berhasil Disimpan
          </span>
        )}
      </div>

      {/* Threshold Configuration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-blue-600" />
            Ambang Batas Alarm Sensor Kualitas Air
          </h3>
          <p className="text-xs text-slate-500">
            Sistem akan otomatis mengirim notifikasi dan menyalakan aerator jika kondisi kolam melewati batas ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Batas Kritis DO Minimum (mg/L)
            </label>
            <input
              type="number"
              step="0.1"
              value={minDo}
              onChange={(e) => setMinDo(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Default: 5.0 mg/L (Ikan Nila)
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Batas Suhu Air Maksimum (°C)
            </label>
            <input
              type="number"
              step="0.5"
              value={maxTemp}
              onChange={(e) => setMaxTemp(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Default: 32.0 °C
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cut-off Baterai Minimum (%)
            </label>
            <input
              type="number"
              value={batteryCutoff}
              onChange={(e) => setBatteryCutoff(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Mencegah deep discharge baterai
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Logika Otomatisasi & Penjadwalan
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Otomatisasi Pemicu Sensor DO
              </span>
              <span className="text-[11px] text-slate-500">
                Aerator otomatis hidup dan menaikkan RPM ke 100% saat DO &lt; {minDo} mg/L
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoAeration}
              onChange={(e) => setAutoAeration(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Aerasi Malam Hari (Night Boost 22:00 - 05:00)
              </span>
              <span className="text-[11px] text-slate-500">
                Menghindari fenomena oksigen anoksia dini hari akibat respirasi alga
              </span>
            </div>
            <input
              type="checkbox"
              checked={nightBoost}
              onChange={(e) => setNightBoost(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
