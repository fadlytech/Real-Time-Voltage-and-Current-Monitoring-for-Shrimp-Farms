import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AlertTriangle, ShieldAlert, Volume2, VolumeX, WifiOff } from 'lucide-react';
import { limitToLast, onValue, query, ref, set } from 'firebase/database';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { SystemDiagram } from './components/SystemDiagram';
import { TelemetryCharts } from './components/TelemetryCharts';
import { Modals } from './components/Modals';

import { HistorisView } from './views/HistorisView';
import { PengaturanView } from './views/PengaturanView';

import {
  initialTelemetry,
  initialPondInfo,
  initialPvSettings,
  todayChartData,
  yesterdayChartData,
  weekChartData,
} from './data/mockData';
import { getIradiasiBulanan2026 } from './data/solarRadiation';
import { db, ensureFirebaseSignedIn, isFirebaseConfigured } from './lib/firebase';
import {
  AggregatedFirebaseHistory,
  parseAndAggregateFirebaseHistory,
} from './utils/firebaseHistory';

import {
  FirebaseStatus,
  PondInfo,
  PvSettings,
  SolarTelemetry,
  TabType,
} from './types';
import alarmSoundUrl from './assets/sounds/alarm_overlimit.mp3';

const STORAGE_KEYS = {
  TELEMETRY: 'pvflux_telemetry_v1',
  POND: 'pvflux_pond_v1',
  SETTINGS: 'pvflux_settings_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');

  const [telemetry, setTelemetry] = useState<SolarTelemetry>(() =>
    loadFromStorage(STORAGE_KEYS.TELEMETRY, initialTelemetry)
  );
  const [pondInfo, setPondInfo] = useState<PondInfo>(() =>
    loadFromStorage(STORAGE_KEYS.POND, initialPondInfo)
  );
  const [settings, setSettings] = useState<PvSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, initialPvSettings)
  );

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isAlarmMuted, setIsAlarmMuted] = useState<boolean>(false);
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatus>(() =>
    isFirebaseConfigured
      ? typeof navigator !== 'undefined' && !navigator.onLine
        ? 'error'
        : 'connecting'
      : 'unconfigured'
  );
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [fbHistory, setFbHistory] = useState<AggregatedFirebaseHistory | null>(
    null
  );
  const [lastFreshDataAt, setLastFreshDataAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const latestFirebaseTelemetryRef = useRef<SolarTelemetry | null>(null);
  const lastPayloadSignatureRef = useRef<string | null>(null);
  const isInitialLatestSnapshotRef = useRef<boolean>(true);

  const safeOfflineTimeoutSec = Math.max(
    5,
    Number(settings.offlineTimeoutSeconds) || 30
  );
  const isSensorStale =
    firebaseStatus === 'connected' &&
    (lastFreshDataAt === null ||
      nowMs - lastFreshDataAt > safeOfflineTimeoutSec * 1000);

  useEffect(() => {
    if (firebaseStatus !== 'connected') return;
    setNowMs(Date.now());
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [firebaseStatus]);

  const isOverVoltage = telemetry.teganganPanel > settings.maxVoltage;
  const isOverCurrent = telemetry.arusPanel > settings.maxCurrent;
  const isOverLimit = isOverVoltage || isOverCurrent;
  const isUnderVoltage =
    settings.undervoltageAlert && telemetry.teganganPanel < settings.minVoltage;

  // Reset mute state when values return to normal so next overlimit triggers sound again
  useEffect(() => {
    if (!isOverLimit) {
      setIsAlarmMuted(false);
    }
  }, [isOverLimit]);

  // Play or stop alarm sound when "Peringatan Batas Maksimum Terlampaui!" is active
  useEffect(() => {
    if (!alarmAudioRef.current) {
      const audio = new Audio(alarmSoundUrl);
      audio.loop = true;
      alarmAudioRef.current = audio;
    }

    const audio = alarmAudioRef.current;

    if (isOverLimit && !isAlarmMuted) {
      audio.play().catch(() => {
        // Ignore browser autoplay block if no prior interaction
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
    };
  }, [isOverLimit, isAlarmMuted]);

  // Persist telemetry to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(telemetry));
    } catch {
      // ignore storage errors
    }
  }, [telemetry]);

  // Persist pondInfo to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.POND, JSON.stringify(pondInfo));
    } catch {
      // ignore storage errors
    }
  }, [pondInfo]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
  }, [settings]);

  // Subscribe to Firebase Realtime Database (`monitoring/latest`, `monitoring/history`, and optional `dashboard_settings`)
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setFirebaseStatus('unconfigured');
      return;
    }

    const activeDb = db;
    let isDisposed = false;
    let hasAuthError = false;
    let hasConnectedToRtdb = false;
    let isSubscribed = false;
    const unsubscribes: Array<() => void> = [];

    const classifyFirebaseError = (
      err: unknown
    ): { status: FirebaseStatus; message: string } => {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code ?? '')
          : '';
      const rawMessage = err instanceof Error ? err.message : String(err ?? '');
      const normalized = `${code} ${rawMessage}`.toLowerCase();

      if (
        normalized.includes('permission_denied') ||
        normalized.includes('permission denied')
      ) {
        return {
          status: 'auth_error',
          message:
            'Akses ditolak Firebase Rules (auth != null). Pastikan Anonymous Sign-In / Akun Email di Firebase Authentication sudah aktif.',
        };
      }
      if (normalized.includes('operation-not-allowed')) {
        return {
          status: 'auth_error',
          message:
            'Anonymous Sign-In belum diaktifkan di Firebase Console > Authentication > Sign-in method.',
        };
      }
      if (normalized.includes('network-request-failed')) {
        return {
          status: 'error',
          message: 'Tidak dapat terhubung ke server Firebase (periksa koneksi internet).',
        };
      }
      if (
        normalized.includes('auth/') ||
        normalized.includes('invalid-api-key')
      ) {
        return {
          status: 'auth_error',
          message: `Gagal autentikasi Firebase (${code || 'auth error'}). Periksa konfigurasi VITE_FIREBASE_* atau Auth.`,
        };
      }
      return {
        status: 'error',
        message: rawMessage || 'Gagal terhubung ke Firebase Realtime Database.',
      };
    };

    const connect = async () => {
      if (isDisposed || isSubscribed) return;

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setFirebaseStatus('error');
        setFirebaseError('Perangkat sedang offline (tidak ada koneksi internet).');
        return;
      }

      setFirebaseStatus('connecting');
      setFirebaseError(null);

      try {
        await ensureFirebaseSignedIn();
        if (isDisposed || isSubscribed) return;
        isSubscribed = true;

        const connectedRef = ref(activeDb, '.info/connected');
        const latestRef = ref(activeDb, 'monitoring/latest');
        const historyQuery = query(
          ref(activeDb, 'monitoring/history'),
          limitToLast(500)
        );
        const pvSettingsRef = ref(activeDb, 'dashboard_settings/pv');
        const stationSettingsRef = ref(activeDb, 'dashboard_settings/station');

        unsubscribes.push(
          onValue(connectedRef, (snap) => {
            if (isDisposed || hasAuthError) return;
            if (snap.val() === true) {
              hasConnectedToRtdb = true;
              setFirebaseStatus('connected');
              setFirebaseError(null);
            } else if (
              hasConnectedToRtdb ||
              (typeof navigator !== 'undefined' && !navigator.onLine)
            ) {
              setFirebaseStatus('error');
              setFirebaseError(
                typeof navigator !== 'undefined' && !navigator.onLine
                  ? 'Perangkat sedang offline (tidak ada koneksi internet).'
                  : 'Koneksi ke server Firebase terputus.'
              );
            }
          })
        );

        unsubscribes.push(
          onValue(
            latestRef,
            (snapshot) => {
              hasAuthError = false;
              hasConnectedToRtdb = true;
              if (typeof navigator === 'undefined' || navigator.onLine) {
                setFirebaseStatus('connected');
                setFirebaseError(null);
              }

              const val = snapshot.val() as Record<string, unknown> | null;
              if (!val || typeof val !== 'object') return;

              const voltage = Number(val.voltage);
              const current = Number(val.current);
              const rawTimestamp = Number(val.timestamp);
              const validTimestamp =
                Number.isFinite(rawTimestamp) && rawTimestamp > 0
                  ? rawTimestamp
                  : undefined;

              if (Number.isFinite(voltage) && Number.isFinite(current)) {
                const nextTelemetry: SolarTelemetry = {
                  teganganPanel: Number(voltage.toFixed(2)),
                  arusPanel: Number(current.toFixed(2)),
                  iradiasi: getIradiasiBulanan2026(
                    validTimestamp ? new Date(validTimestamp) : undefined
                  ),
                  timestamp: validTimestamp,
                };
                latestFirebaseTelemetryRef.current = nextTelemetry;
                setTelemetry(nextTelemetry);

                const signature = `${voltage.toFixed(4)}|${current.toFixed(
                  4
                )}|${validTimestamp ?? 'none'}`;
                const now = Date.now();

                if (isInitialLatestSnapshotRef.current) {
                  isInitialLatestSnapshotRef.current = false;
                  lastPayloadSignatureRef.current = signature;
                  setLastFreshDataAt(validTimestamp ?? null);
                  setNowMs(now);
                } else if (signature !== lastPayloadSignatureRef.current) {
                  lastPayloadSignatureRef.current = signature;
                  setLastFreshDataAt(now);
                  setNowMs(now);
                }
              } else {
                isInitialLatestSnapshotRef.current = false;
                setLastFreshDataAt(null);
              }
            },
            (err) => {
              if (isDisposed) return;
              const info = classifyFirebaseError(err);
              hasAuthError = info.status === 'auth_error';
              setFirebaseStatus(info.status);
              setFirebaseError(info.message);
            }
          )
        );

        unsubscribes.push(
          onValue(
            historyQuery,
            (snapshot) => {
              const parsed = parseAndAggregateFirebaseHistory(
                snapshot.val() as Record<string, unknown> | null
              );
              setFbHistory(parsed);
            },
            (err) => {
              if (isDisposed) return;
              const info = classifyFirebaseError(err);
              hasAuthError = info.status === 'auth_error';
              setFirebaseStatus(info.status);
              setFirebaseError(info.message);
            }
          )
        );

        // Optional shared settings across devices (ignored silently if Firebase Rules don't expose dashboard_settings yet)
        unsubscribes.push(
          onValue(
            pvSettingsRef,
            (snapshot) => {
              const remotePv = snapshot.val() as Partial<PvSettings> | null;
              if (remotePv && typeof remotePv === 'object') {
                setSettings({ ...initialPvSettings, ...remotePv });
              }
            },
            () => {}
          )
        );

        unsubscribes.push(
          onValue(
            stationSettingsRef,
            (snapshot) => {
              const remoteStation = snapshot.val() as Partial<PondInfo> | null;
              if (remoteStation && typeof remoteStation === 'object') {
                setPondInfo({ ...initialPondInfo, ...remoteStation });
              }
            },
            () => {}
          )
        );
      } catch (err) {
        if (isDisposed) return;
        const info = classifyFirebaseError(err);
        hasAuthError = info.status === 'auth_error';
        setFirebaseStatus(info.status);
        setFirebaseError(info.message);
      }
    };

    const handleBrowserOffline = () => {
      if (isDisposed || hasAuthError) return;
      setFirebaseStatus('error');
      setFirebaseError('Perangkat sedang offline (tidak ada koneksi internet).');
    };

    const handleBrowserOnline = () => {
      if (isDisposed || hasAuthError) return;
      if (!isSubscribed) {
        void connect();
      } else {
        setFirebaseStatus('connecting');
        setFirebaseError(null);
      }
    };

    window.addEventListener('offline', handleBrowserOffline);
    window.addEventListener('online', handleBrowserOnline);
    void connect();

    return () => {
      isDisposed = true;
      window.removeEventListener('offline', handleBrowserOffline);
      window.removeEventListener('online', handleBrowserOnline);
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const handleUpdateSettings = (
    updatedSettings: PvSettings,
    syncTelemetry = false
  ) => {
    setSettings(updatedSettings);
    if (syncTelemetry && firebaseStatus !== 'connected') {
      setTelemetry((prev) => ({
        ...prev,
        teganganPanel: updatedSettings.nominalVmp,
        arusPanel: updatedSettings.nominalImp,
      }));
    }
    if (isFirebaseConfigured && db) {
      void set(ref(db, 'dashboard_settings/pv'), updatedSettings).catch(() => {
        // Abaikan jika rules Firebase belum mengizinkan tulis /dashboard_settings
      });
    }
  };

  const handleUpdatePondInfo = (updatedPondInfo: PondInfo) => {
    setPondInfo(updatedPondInfo);
    if (isFirebaseConfigured && db) {
      void set(ref(db, 'dashboard_settings/station'), updatedPondInfo).catch(
        () => {}
      );
    }
  };

  const handleResetData = () => {
    setTelemetry(latestFirebaseTelemetryRef.current ?? initialTelemetry);
    setPondInfo(initialPondInfo);
    setSettings(initialPvSettings);
    setIsAlarmMuted(false);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.TELEMETRY);
      window.localStorage.removeItem(STORAGE_KEYS.POND);
      window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch {
      // ignore
    }
    if (isFirebaseConfigured && db) {
      void set(ref(db, 'dashboard_settings/pv'), initialPvSettings).catch(
        () => {}
      );
      void set(ref(db, 'dashboard_settings/station'), initialPondInfo).catch(
        () => {}
      );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-[#1c1d1f] p-2.5 sm:p-3.5 flex flex-col lg:flex-row gap-2 font-['Manrope',sans-serif]">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Light Gray Rounded Main Content Canvas (Fullscreen Fit, extra bottom padding on mobile for floating dock) */}
      <div className="flex-1 min-w-0 bg-[#e9eaec] rounded-[28px] p-4 pb-24 sm:p-6 sm:pb-24 lg:p-7 lg:pb-7 text-[#1c1d1f] flex flex-col">
        <Header
          telemetry={telemetry}
          pondInfo={pondInfo}
          onUpdatePondInfo={handleUpdatePondInfo}
          onResetData={handleResetData}
          firebaseStatus={firebaseStatus}
          firebaseError={firebaseError}
          isSensorStale={isSensorStale}
          offlineTimeoutSeconds={safeOfflineTimeoutSec}
        />

        <main className="flex-1 min-w-0 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'beranda' && (
              <motion.div
                key="tab-beranda"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3 flex-1 flex flex-col"
              >
                {/* Banner Offline / Auth Error */}
                <AnimatePresence>
                  {(firebaseStatus === 'auth_error' || firebaseStatus === 'error') &&
                    firebaseError && (
                      <motion.div
                        key="banner-firebase-error"
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        role="alert"
                        className="bg-amber-100 border border-amber-300 text-[#1c1d1f] rounded-[20px] px-4 py-3 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-800 grid place-items-center shrink-0">
                          <WifiOff className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-amber-950">
                            {firebaseStatus === 'auth_error'
                              ? 'Akses Firebase Ditolak'
                              : 'Koneksi Offline'}
                          </p>
                          <p className="text-[11px] text-amber-900/90 break-words">
                            {firebaseError}
                          </p>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* Banner Peringatan ketika Tegangan atau Arus melewati batas maksimal */}
                <AnimatePresence>
                  {isOverLimit && (
                    <motion.div
                      key="banner-overlimit"
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      role="alert"
                      className="bg-red-600 text-white rounded-[22px] p-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 grid place-items-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                            Peringatan Batas Maksimum Terlampaui!
                          </h3>
                          <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                            {isOverVoltage && isOverCurrent
                              ? `Tegangan panel (${telemetry.teganganPanel.toFixed(2)} V > ${settings.maxVoltage} V) dan Arus panel (${telemetry.arusPanel.toFixed(2)} A > ${settings.maxCurrent} A) melewati batas maksimum aman.`
                              : isOverVoltage
                              ? `Tegangan panel saat ini (${telemetry.teganganPanel.toFixed(2)} V) melewati batas maksimum aman (${settings.maxVoltage} V).`
                              : `Arus panel saat ini (${telemetry.arusPanel.toFixed(2)} A) melewati batas maksimum aman (${settings.maxCurrent} A).`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          type="button"
                          onClick={() => setIsAlarmMuted((prev) => !prev)}
                          title={isAlarmMuted ? 'Nyalakan suara alarm' : 'Bisukan suara alarm'}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold cursor-pointer"
                        >
                          {isAlarmMuted ? (
                            <>
                              <VolumeX className="w-4 h-4" />
                              <span>Suara Mati</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>Alarm Aktif</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setTelemetry((prev) => ({
                              ...prev,
                              teganganPanel: Math.min(prev.teganganPanel, settings.nominalVmp),
                              arusPanel: Math.min(prev.arusPanel, settings.nominalImp),
                            }))
                          }
                          className="px-3.5 py-2 rounded-full bg-white text-red-600 text-xs font-extrabold cursor-pointer hover:bg-neutral-100"
                        >
                          Normalkan Nilai
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('pengaturan')}
                          className="px-3.5 py-2 rounded-full bg-red-800 text-white text-xs font-bold cursor-pointer hover:bg-red-900"
                        >
                          Pengaturan Batas
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Banner Peringatan Tegangan Rendah (Undervoltage) */}
                <AnimatePresence>
                  {!isOverLimit && isUnderVoltage && (
                    <motion.div
                      key="banner-undervoltage"
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      role="alert"
                      className="bg-amber-400 text-[#1c1d1f] rounded-[22px] p-4 sm:px-5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1c1d1f]/10 grid place-items-center shrink-0">
                          <ShieldAlert className="w-5 h-5 text-[#1c1d1f]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold">
                            Peringatan Drop Tegangan PV (Undervoltage)
                          </h3>
                          <p className="text-xs text-[#1c1d1f]/80">
                            Tegangan panel ({telemetry.teganganPanel.toFixed(2)} V) berada di bawah batas minimum kerja ({settings.minVoltage} V).
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch flex-1">
                  {/* Left Tall Card: Energy / Sistem Panel Surya Bubble + Progress Card */}
                  <div className="lg:col-span-5 flex">
                    <SystemDiagram
                      telemetry={telemetry}
                      settings={settings}
                      onUpdateTelemetry={setTelemetry}
                      onOpenDetails={() => setIsDetailOpen(true)}
                    />
                  </div>

                  {/* Right Stack: Top 3 Metric Cards + Bottom Dark Telemetry Analysis Card */}
                  <div className="lg:col-span-7 flex flex-col gap-3">
                    <MetricCards telemetry={telemetry} settings={settings} />

                    <TelemetryCharts
                      telemetry={telemetry}
                      todayData={fbHistory ? fbHistory.todayData : todayChartData}
                      yesterdayData={
                        fbHistory ? fbHistory.yesterdayData : yesterdayChartData
                      }
                      weekData={fbHistory ? fbHistory.weekData : weekChartData}
                      dateNote={
                        fbHistory?.isUsingLatestRecordDate
                          ? `Acuan data terbaru: ${fbHistory.referenceDateLabel}`
                          : null
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'historis' && (
              <motion.div
                key="tab-historis"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <HistorisView
                  todayData={fbHistory ? fbHistory.todayData : todayChartData}
                  yesterdayData={
                    fbHistory ? fbHistory.yesterdayData : yesterdayChartData
                  }
                  weekData={fbHistory ? fbHistory.weekData : weekChartData}
                  rawLogs={fbHistory?.rawLogs}
                  settings={settings}
                  pondInfo={pondInfo}
                  dateNote={
                    fbHistory?.isUsingLatestRecordDate
                      ? `Acuan data terbaru: ${fbHistory.referenceDateLabel}`
                      : null
                  }
                />
              </motion.div>
            )}

            {activeTab === 'pengaturan' && (
              <motion.div
                key="tab-pengaturan"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <PengaturanView
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Modals
        isDetailOpen={isDetailOpen}
        onCloseDetail={() => setIsDetailOpen(false)}
        telemetry={telemetry}
      />
    </div>
    </MotionConfig>
  );
}
