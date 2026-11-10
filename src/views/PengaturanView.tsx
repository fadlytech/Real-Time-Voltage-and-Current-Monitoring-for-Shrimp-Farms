import React, { useState } from 'react';
import { Sliders, Zap, Activity, Save, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';

export const PengaturanView: React.FC = () => {
  // Ambang batas tegangan & arus PV
  const [minVoltage, setMinVoltage] = useState<number>(24.0);
  const [maxVoltage, setMaxVoltage] = useState<number>(42.0);
  const [maxCurrent, setMaxCurrent] = useState<number>(20.0);

  // Parameter referensi & pembacaan sensor PV
  const [nominalVmp, setNominalVmp] = useState<number>(36.8);
  const [nominalImp, setNominalImp] = useState<number>(16.6);
  const [samplingInterval, setSamplingInterval] = useState<number>(2);

  // Fitur pemantauan & proteksi otomatis
  const [undervoltageAlert, setUndervoltageAlert] = useState<boolean>(true);
  const [overcurrentProtection, setOvercurrentProtection] = useState<boolean>(true);
  const [autoLogging, setAutoLogging] = useState<boolean>(true);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    setMinVoltage(24.0);
    setMaxVoltage(42.0);
    setMaxCurrent(20.0);
    setNominalVmp(36.8);
    setNominalImp(16.6);
    setSamplingInterval(2);
    setUndervoltageAlert(true);
    setOvercurrentProtection(true);
    setAutoLogging(true);
  };

  const estimatedNominalPower = (nominalVmp * nominalImp).toFixed(1);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Pengaturan Monitoring Tegangan & Arus PV
          </h2>
          <p className="text-xs text-slate-500">
            Konfigurasi batas aman kelistrikan panel surya, kalibrasi sensor, dan proteksi beban aerator
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Pengaturan Berhasil Disimpan
          </span>
        )}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* 1. Ambang Batas Tegangan & Arus PV */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            1. Ambang Batas Tegangan & Arus Panel Surya (PV)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Menentukan batas operasi normal sensor tegangan (V) dan arus (A) untuk mendeteksi anomali kelistrikan PV.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tegangan Minimum / Undervoltage (V)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={minVoltage}
                onChange={(e) => setMinVoltage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tegangan minimum agar aerator mulai bekerja (Default: 24.0 V)
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tegangan Maksimum / Overvoltage (V)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={maxVoltage}
                onChange={(e) => setMaxVoltage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Batas aman tegangan terbuka Voc (Default: 42.0 V)
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Arus Maksimum / Overcurrent (A)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={maxCurrent}
                onChange={(e) => setMaxCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Batas arus maksimum sensor PV (Default: 20.0 A)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Referensi Modul PV & Interval Akuisisi Sensor */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-sky-600" />
                2. Spesifikasi Referensi PV & Pembacaan Sensor
              </h3>
              <p className="text-xs text-slate-500">
                Parameter titik daya maksimum (MPP) modul surya dan frekuensi akuisisi telemetri.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-600 font-medium">Daya Nominal (Pmp): </span>
              <span className="font-mono font-bold text-blue-700">{estimatedNominalPower} W</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tegangan Kerja Nominal Vmp (V)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={nominalVmp}
                onChange={(e) => setNominalVmp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tegangan optimal panel saat beban puncak
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Arus Kerja Nominal Imp (A)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={nominalImp}
                onChange={(e) => setNominalImp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Arus optimal panel saat penyinaran penuh
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interval Sampling Sensor (detik)
              </label>
              <select
                value={samplingInterval}
                onChange={(e) => setSamplingInterval(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>1 detik (Real-time Cepat)</option>
                <option value={2}>2 detik (Standar)</option>
                <option value={5}>5 detik (Hemat Data)</option>
                <option value={10}>10 detik (Interval Lambat)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Frekuensi pembaruan data tegangan & arus
              </span>
            </div>
          </div>
        </div>

        {/* 3. Proteksi & Otomatisasi Pemantauan PV */}
        <div className="pt-4 border-t border-slate-100 space-y-3.5">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            3. Proteksi & Logika Pemantauan Kelistrikan PV
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Deteksi Drop Tegangan PV (Undervoltage Alert)
              </span>
              <span className="text-[11px] text-slate-500">
                Beri peringatan saat tegangan panel turun di bawah {minVoltage} V akibat cuaca mendung atau bayangan (shading)
              </span>
            </div>
            <input
              type="checkbox"
              checked={undervoltageAlert}
              onChange={(e) => setUndervoltageAlert(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Proteksi Arus Lebih (Overcurrent Protection)
              </span>
              <span className="text-[11px] text-slate-500">
                Nonaktifkan beban aerator otomatis jika arus melebihi {maxCurrent} A atau tegangan melebihi {maxVoltage} V
              </span>
            </div>
            <input
              type="checkbox"
              checked={overcurrentProtection}
              onChange={(e) => setOvercurrentProtection(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Pencatatan Log Telemetri PV Otomatis (Auto-Logging)
              </span>
              <span className="text-[11px] text-slate-500">
                Rekam riwayat tegangan (V), arus (A), dan iradiasi matahari (W/m²) secara berkala ke tabel Data Historis
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoLogging}
              onChange={(e) => setAutoLogging(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
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
