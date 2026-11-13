import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, RefreshCw, Zap, Edit3, Check, X } from 'lucide-react';
import { SolarTelemetry, PondInfo, FirebaseStatus } from '../types';

interface HeaderProps {
  telemetry: SolarTelemetry;
  pondInfo: PondInfo;
  onUpdatePondInfo: (updated: PondInfo) => void;
  onResetData: () => void;
  firebaseStatus?: FirebaseStatus;
  firebaseError?: string | null;
  isSensorStale?: boolean;
  offlineTimeoutSeconds?: number;
}

const FIREBASE_STATUS_UI: Record<
  FirebaseStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  connected: {
    label: 'Online',
    dotClass: 'bg-emerald-500 animate-pulse',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  connecting: {
    label: 'Menghubungkan...',
    dotClass: 'bg-amber-500 animate-ping',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
  },
  auth_error: {
    label: 'Offline',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-50 text-red-700 border border-red-200',
  },
  error: {
    label: 'Offline',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-50 text-red-700 border border-red-200',
  },
  unconfigured: {
    label: 'Offline',
    dotClass: 'bg-neutral-400',
    badgeClass: 'bg-white/80 text-[#71757d] border border-[#e5e7eb]',
  },
};

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  pondInfo,
  onUpdatePondInfo,
  onResetData,
  firebaseStatus = 'unconfigured',
  firebaseError,
  isSensorStale = false,
  offlineTimeoutSeconds = 30,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [lokasiDraft, setLokasiDraft] = useState<string>(pondInfo.lokasi);
  const [emailDraft, setEmailDraft] = useState<string>(pondInfo.emailTelemetry);

  useEffect(() => {
    setLokasiDraft(pondInfo.lokasi);
    setEmailDraft(pondInfo.emailTelemetry);
  }, [pondInfo.lokasi, pondInfo.emailTelemetry]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dayaPv = telemetry.teganganPanel * telemetry.arusPanel;
  const effectiveStatus: FirebaseStatus =
    firebaseStatus === 'connected' && isSensorStale ? 'error' : firebaseStatus;
  const statusUi = FIREBASE_STATUS_UI[effectiveStatus];

  const sensorTimeLabel = telemetry.timestamp
    ? new Date(telemetry.timestamp)
        .toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        .replace(/\./g, ':')
    : null;

  const timeoutDesc =
    offlineTimeoutSeconds >= 60
      ? `${Number((offlineTimeoutSeconds / 60).toFixed(1))} menit`
      : `${offlineTimeoutSeconds} detik`;

  const statusTooltip =
    firebaseStatus === 'connected' && isSensorStale
      ? `Offline · Data sensor tidak berubah selama > ${timeoutDesc}${
          sensorTimeLabel ? ` (terakhir ${sensorTimeLabel})` : ''
        }`
      : firebaseError ||
        (sensorTimeLabel
          ? `Online · Pembaruan data terakhir ${sensorTimeLabel}`
          : statusUi.label);

  const handleSaveProfile = () => {
    onUpdatePondInfo({
      ...pondInfo,
      lokasi: lokasiDraft.trim() || pondInfo.lokasi,
      emailTelemetry: emailDraft.trim() || pondInfo.emailTelemetry,
    });
    setIsEditingProfile(false);
  };

  return (
    <header className="mb-4 sm:mb-5 space-y-4">
      {/* Top Bar: Symmetrical on Mobile & Desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Row 1 on Mobile: Profile Pill on Left + Reset Button on Right (on mobile) */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          {!isEditingProfile ? (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              title="Klik untuk mengubah nama kolam dan email telemetri"
              className="flex items-center gap-2.5 text-left group bg-white/75 hover:bg-white rounded-full pr-3.5 pl-1.5 py-1.5 transition-colors cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c1d1f] text-[#d4f362] grid place-items-center font-bold text-xs sm:text-sm shrink-0">
                PV
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-[#1c1d1f] truncate">
                    {pondInfo.lokasi}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-[#71757d] group-hover:text-[#1c1d1f] transition-colors shrink-0" />
                </div>
                <span className="text-[11px] text-[#71757d] block truncate">
                  {pondInfo.emailTelemetry}
                </span>
              </div>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-white rounded-[20px] p-2.5 shadow-md w-full sm:w-auto">
              <div className="w-9 h-9 rounded-full bg-[#1c1d1f] text-[#d4f362] grid place-items-center font-bold text-xs shrink-0">
                PV
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={lokasiDraft}
                  onChange={(e) => setLokasiDraft(e.target.value)}
                  placeholder="Nama / Blok Kolam"
                  aria-label="Nama atau Blok Kolam"
                  className="px-3 py-1.5 bg-[#f4f5f7] border border-[#e5e7eb] rounded-xl text-xs font-bold text-[#1c1d1f] focus:outline-hidden focus:border-[#1c1d1f] w-full"
                />
                <input
                  type="text"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="Email / ID Telemetri"
                  aria-label="Email atau ID Telemetri"
                  className="px-3 py-1.5 bg-[#f4f5f7] border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#1c1d1f] focus:outline-hidden focus:border-[#1c1d1f] w-full"
                />
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  title="Simpan perubahan"
                  className="w-8 h-8 rounded-full bg-[#d4f362] text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLokasiDraft(pondInfo.lokasi);
                    setEmailDraft(pondInfo.emailTelemetry);
                    setIsEditingProfile(false);
                  }}
                  title="Batal"
                  className="w-8 h-8 rounded-full bg-[#f4f5f7] text-[#1c1d1f] grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile-only Reset Button so Row 1 is symmetrical on HP */}
          <motion.button
            type="button"
            onClick={onResetData}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            title="Reset ke Nilai Standar"
            className="sm:hidden group w-10 h-10 rounded-full bg-white text-[#1c1d1f] grid place-items-center relative shadow-2xs cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d4f362] text-[#1c1d1f] text-[9px] font-extrabold grid place-items-center">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </span>
          </motion.button>
        </div>

        {/* Right Live Telemetry Bar & Desktop Reset Circle */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-white rounded-full px-4 py-2.5 flex items-center justify-between sm:justify-start gap-2.5 text-xs shadow-2xs w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#1c1d1f] shrink-0" />
              <span className="text-[#71757d] font-medium">
                PV Output:
              </span>
              <span className="font-extrabold text-[#1c1d1f] tabular-nums">
                {dayaPv.toFixed(1)} W
              </span>
            </div>
            <span className="text-[#d1d5db] hidden sm:inline">|</span>
            <span className="text-[#71757d] font-semibold tabular-nums">
              {telemetry.teganganPanel.toFixed(2)} V · {telemetry.arusPanel.toFixed(2)} A
            </span>
          </div>

          <motion.button
            type="button"
            onClick={onResetData}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            title="Reset ke Nilai Standar"
            className="hidden sm:grid group w-10 h-10 rounded-full bg-white text-[#1c1d1f] place-items-center relative shadow-2xs cursor-pointer hover:bg-neutral-50 shrink-0"
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d4f362] text-[#1c1d1f] text-[9px] font-extrabold grid place-items-center">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </span>
          </motion.button>
        </div>
      </div>

      {/* Hero Title Row (Symmetrical on Mobile & Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1c1d1f] leading-tight">
            Dashboard Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-[#71757d] mt-1">
            Sistem Aerasi Tenaga Surya untuk Budidaya Perikanan
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto bg-white/75 sm:bg-white/80 rounded-full px-3.5 py-2 shadow-2xs">
          {/* Online / Offline Status Badge */}
          <span
            title={statusTooltip}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors duration-300 ${statusUi.badgeClass}`}
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              {effectiveStatus === 'connected' && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              )}
              <span className={`relative w-2 h-2 rounded-full ${statusUi.dotClass}`} />
            </span>
            <span>{statusUi.label}</span>
          </span>

          <span className="text-[#d1d5db]">|</span>

          <span className="text-xs font-semibold text-[#71757d] tabular-nums">
            {dateStr} · {timeStr}
          </span>
        </div>
      </div>
    </header>
  );
};
