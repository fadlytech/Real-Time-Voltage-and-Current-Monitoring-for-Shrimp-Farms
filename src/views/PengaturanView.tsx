import React, { useState } from 'react';
import { Sliders, Zap, Activity, Save, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';
import { PvSettings } from '../types';
import { initialPvSettings } from '../data/mockData';

interface PengaturanViewProps {
  settings: PvSettings;
  onUpdateSettings: (updated: PvSettings, syncTelemetry?: boolean) => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const updateField = <K extends keyof PvSettings>(
    key: K,
    value: PvSettings[K],
    syncTelemetry = false
  ) => {
    const next: PvSettings = {
      ...settings,
      [key]: value,
    };
    onUpdateSettings(next, syncTelemetry);
  };

  const handleSave = () => {
    onUpdateSettings(settings, true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    onUpdateSettings(initialPvSettings, true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const estimatedNominalPower = (settings.nominalVmp * settings.nominalImp).toFixed(1);

  return (
    <div className="space-y-5 w-full">
      {/* Header (Full Width) */}
      <div className="flux-card w-full flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="flux-badge-lime mb-2">KONFIGURASI PV · AUTO-SAVE AKTIF</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1c1d1f]">
            Pengaturan Monitoring Tegangan &amp; Arus PV
          </h2>
          <p className="text-xs sm:text-sm text-[#7c7f86] mt-0.5">
            Setiap perubahan otomatis tersimpan di browser dan tetap ada saat aplikasi dibuka kembali
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1c1d1f] bg-[#d4f362] px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            Tersimpan Permanen
          </span>
        )}
      </div>

      {/* Main Settings Card (Full Width for Laptop & PC) */}
      <div className="flux-card w-full space-y-7">
        {/* 1. Ambang Batas Tegangan & Arus PV */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flux-icon-circle">
              <Zap className="w-4 h-4 text-[#1c1d1f]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1c1d1f]">
                1. Ambang Batas Tegangan &amp; Arus Panel Surya (PV)
              </h3>
              <p className="text-xs sm:text-sm text-[#7c7f86]">
                Menentukan batas operasi normal sensor tegangan (V) dan arus (A) — langsung tersimpan saat diubah
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f4f5f7] rounded-[20px] p-5">
              <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f] mb-2">
                Tegangan Minimum (V)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.minVoltage}
                onChange={(e) => updateField('minVoltage', Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-[14px] text-lg font-bold text-[#1c1d1f] tabular-nums focus:outline-hidden focus:border-[#1c1d1f]"
              />
              <span className="text-xs text-[#7c7f86] mt-2 block">
                Batas minimum kerja (Default: 24.0 V)
              </span>
            </div>

            <div className="bg-[#f4f5f7] rounded-[20px] p-5">
              <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f] mb-2">
                Tegangan Maksimum (V)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.maxVoltage}
                onChange={(e) => updateField('maxVoltage', Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-[14px] text-lg font-bold text-[#1c1d1f] tabular-nums focus:outline-hidden focus:border-[#1c1d1f]"
              />
              <span className="text-xs text-[#7c7f86] mt-2 block">
                Batas aman Voc (Default: 42.0 V)
              </span>
            </div>

            <div className="bg-[#f4f5f7] rounded-[20px] p-5">
              <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f] mb-2">
                Arus Maksimum (A)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.maxCurrent}
                onChange={(e) => updateField('maxCurrent', Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-[14px] text-lg font-bold text-[#1c1d1f] tabular-nums focus:outline-hidden focus:border-[#1c1d1f]"
              />
              <span className="text-xs text-[#7c7f86] mt-2 block">
                Batas arus sensor PV (Default: 20.0 A)
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#f0f1f3]" />

        {/* 2. Referensi Modul PV & Interval Akuisisi Sensor */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flux-icon-circle">
                <Sliders className="w-4 h-4 text-[#1c1d1f]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1c1d1f]">
                  2. Spesifikasi Referensi PV &amp; Pembacaan Sensor
                </h3>
                <p className="text-xs sm:text-sm text-[#7c7f86]">
                  Mengubah nilai Vmp &amp; Imp di bawah akan langsung memperbarui pembacaan dan ukuran lingkaran di Beranda
                </p>
              </div>
            </div>
            <div className="bg-[#1c1d1f] text-white px-4 py-2 rounded-full text-xs sm:text-sm">
              <span className="text-[#9ca3af] font-medium">Daya Nominal (Pmp): </span>
              <span className="font-bold text-[#d4f362] tabular-nums">{estimatedNominalPower} W</span>
            </div>
          </div>

          <div className="divide-y divide-[#e5e7eb] rounded-[20px] bg-[#f4f5f7] px-5">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f]">
                  Tegangan Kerja / Aktual Vmp (V)
                </label>
                <span className="text-xs text-[#7c7f86]">
                  Tegangan panel surya (mengubah nilai Volt &amp; ukuran lingkaran Volt di Beranda)
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.nominalVmp}
                onChange={(e) => updateField('nominalVmp', Number(e.target.value), true)}
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-[12px] text-base font-bold text-[#1c1d1f] tabular-nums focus:outline-hidden focus:border-[#1c1d1f]"
              />
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f]">
                  Arus Kerja / Aktual Imp (A)
                </label>
                <span className="text-xs text-[#7c7f86]">
                  Arus panel surya (mengubah nilai Ampere &amp; ukuran lingkaran Arus di Beranda)
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={settings.nominalImp}
                onChange={(e) => updateField('nominalImp', Number(e.target.value), true)}
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-[12px] text-base font-bold text-[#1c1d1f] tabular-nums focus:outline-hidden focus:border-[#1c1d1f]"
              />
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1c1d1f]">
                  Interval Sampling Sensor (detik)
                </label>
                <span className="text-xs text-[#7c7f86]">
                  Frekuensi pembaruan telemetri saat Mode Simulasi aktif
                </span>
              </div>
              <select
                value={settings.samplingInterval}
                onChange={(e) => updateField('samplingInterval', Number(e.target.value))}
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-[12px] text-xs sm:text-sm font-bold text-[#1c1d1f] focus:outline-hidden focus:border-[#1c1d1f]"
              >
                <option value={1}>1 detik (Real-time Cepat)</option>
                <option value={2}>2 detik (Standar)</option>
                <option value={5}>5 detik (Hemat Data)</option>
                <option value={10}>10 detik (Interval Lambat)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-[#f0f1f3]" />

        {/* 3. Proteksi & Otomatisasi Pemantauan PV */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flux-icon-circle">
              <ShieldAlert className="w-4 h-4 text-[#1c1d1f]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#1c1d1f]">
              3. Proteksi &amp; Logika Pemantauan Kelistrikan PV
            </h3>
          </div>

          <div className="divide-y divide-[#f0f1f3]">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <span className="text-sm sm:text-base font-bold text-[#1c1d1f] block">
                  Deteksi Drop Tegangan PV (Undervoltage Alert)
                </span>
                <span className="text-xs sm:text-sm text-[#7c7f86]">
                  Beri peringatan saat tegangan panel turun di bawah {settings.minVoltage} V akibat cuaca mendung atau bayangan
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.undervoltageAlert}
                onChange={(e) => updateField('undervoltageAlert', e.target.checked)}
                className="w-5 h-5 accent-[#1c1d1f] cursor-pointer shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <span className="text-sm sm:text-base font-bold text-[#1c1d1f] block">
                  Proteksi Arus Lebih (Overcurrent Protection)
                </span>
                <span className="text-xs sm:text-sm text-[#7c7f86]">
                  Nonaktifkan beban aerator otomatis jika arus melebihi {settings.maxCurrent} A atau tegangan melebihi {settings.maxVoltage} V
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.overcurrentProtection}
                onChange={(e) => updateField('overcurrentProtection', e.target.checked)}
                className="w-5 h-5 accent-[#1c1d1f] cursor-pointer shrink-0"
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <span className="text-sm sm:text-base font-bold text-[#1c1d1f] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#1c1d1f]" />
                  Pencatatan Log Telemetri PV Otomatis (Auto-Logging)
                </span>
                <span className="text-xs sm:text-sm text-[#7c7f86]">
                  Rekam riwayat tegangan (V), arus (A), dan iradiasi matahari (W/m²) secara berkala ke tabel Data Historis
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoLogging}
                onChange={(e) => updateField('autoLogging', e.target.checked)}
                className="w-5 h-5 accent-[#1c1d1f] cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-[#f0f1f3] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#f4f5f7] text-[#1c1d1f] text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#e5e7eb] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1d1f] text-white text-xs sm:text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4 text-[#d4f362]" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
