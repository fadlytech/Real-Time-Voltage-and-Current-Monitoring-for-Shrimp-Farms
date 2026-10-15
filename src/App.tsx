import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { SystemDiagram } from './components/SystemDiagram';
import { PondCondition } from './components/PondCondition';
import { TelemetryCharts } from './components/TelemetryCharts';
import { NotificationTable } from './components/NotificationTable';
import { DailySummary } from './components/DailySummary';
import { Modals } from './components/Modals';

import { MonitoringView } from './views/MonitoringView';
import { HistorisView } from './views/HistorisView';
import { PengaturanView } from './views/PengaturanView';
import { LaporanView } from './views/LaporanView';

import {
  initialTelemetry,
  initialPondInfo,
  initialNotifications,
  initialSummary,
  todayChartData,
  yesterdayChartData,
  weekChartData,
} from './data/mockData';

import {
  TabType,
  SolarTelemetry,
  PondInfo,
  NotificationItem,
  DailySummaryData,
} from './types';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] =
    useState<TabType>('beranda');

  // Core telemetry state
  const [telemetry, setTelemetry] =
    useState<SolarTelemetry>(initialTelemetry);

  const [pondInfo, setPondInfo] =
    useState<PondInfo>(initialPondInfo);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const [summary, setSummary] =
    useState<DailySummaryData>(initialSummary);

  // Simulation state
  const [isSimulating, setIsSimulating] =
    useState<boolean>(false);

  // Modal states
  const [isDetailOpen, setIsDetailOpen] =
    useState<boolean>(false);

  const [isEditPondOpen, setIsEditPondOpen] =
    useState<boolean>(false);

  const [isAeratorOpen, setIsAeratorOpen] =
    useState<boolean>(false);

  const [isNotifOpen, setIsNotifOpen] =
    useState<boolean>(false);

  // =========================================================
  // REALTIME SIMULATION
  // =========================================================
  useEffect(() => {
    // Jika simulasi tidak aktif, jangan jalankan interval
    if (!isSimulating) {
      return;
    }

    const interval = setInterval(() => {
      setTelemetry((previous) => {
        /*
         * Tegangan panel:
         * Nilai bergerak sedikit dari nilai sebelumnya
         * agar simulasi terlihat seperti data sensor nyata.
         */
        const voltageVariation =
          (Math.random() - 0.5) * 2;

        /*
         * Arus panel:
         * Variasi dibuat sedikit lebih besar karena
         * arus PV lebih mudah berubah mengikuti kondisi
         * radiasi.
         */
        const currentVariation =
          (Math.random() - 0.5) * 1;

        const newVoltage = Math.max(
          0,
          Number(
            (previous.teganganPanel + voltageVariation).toFixed(2)
          )
        );

        const newCurrent = Math.max(
          0,
          Number(
            (previous.arusPanel + currentVariation).toFixed(2)
          )
        );

        return {
          teganganPanel: newVoltage,
          arusPanel: newCurrent,
        };
      });
    }, 2000);

    // Bersihkan interval ketika simulasi dihentikan
    // atau component dilepas.
    return () => clearInterval(interval);
  }, [isSimulating]);

  // =========================================================
  // RESET DATA
  // =========================================================
  const handleResetData = () => {
    setTelemetry(initialTelemetry);
    setPondInfo(initialPondInfo);
    setNotifications(initialNotifications);
    setSummary(initialSummary);
    setIsSimulating(false);
  };

  // =========================================================
  // NOTIFICATION STATUS
  // =========================================================
  const handleToggleNotifStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status:
                n.status === 'Terselesaikan'
                  ? 'Aktif'
                  : 'Terselesaikan',
            }
          : n
      )
    );
  };

  // Mark all notifications as resolved
  const handleMarkAllResolved = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        status: 'Terselesaikan',
      }))
    );
  };

  const unreadCount = notifications.filter(
    (n) => n.status === 'Aktif'
  ).length;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        telemetry={telemetry}
        isSimulating={isSimulating}
        onToggleSimulate={() =>
          setIsSimulating((prev) => !prev)
        }
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'notifikasi') {
              setIsNotifOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          unreadNotifsCount={unreadCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0">
          {/* =================================================
              BERANDA
             ================================================= */}
          {activeTab === 'beranda' && (
            <div className="space-y-4">
              {/* Metric Cards */}
              <MetricCards
                telemetry={telemetry}
                onOpenAeratorModal={() =>
                  setIsAeratorOpen(true)
                }
              />

              {/* System Diagram & Pond Condition */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div className="lg:col-span-7">
                  <SystemDiagram
                    telemetry={telemetry}
                    onOpenDetails={() =>
                      setIsDetailOpen(true)
                    }
                  />
                </div>

                <div className="lg:col-span-5">
                  <PondCondition
                    pondInfo={pondInfo}
                    onEditPond={() =>
                      setIsEditPondOpen(true)
                    }
                  />
                </div>
              </div>

              {/* Telemetry Charts */}
              <TelemetryCharts
                todayData={todayChartData}
                yesterdayData={yesterdayChartData}
                weekData={weekChartData}
              />

              {/* Notification & Daily Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div className="lg:col-span-7">
                  <NotificationTable
                    notifications={notifications}
                    onViewAll={() =>
                      setIsNotifOpen(true)
                    }
                    onToggleStatus={handleToggleNotifStatus}
                  />
                </div>

                <div className="lg:col-span-5">
                  <DailySummary summary={summary} />
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              MONITORING
             ================================================= */}
          {activeTab === 'monitoring' && (
            <MonitoringView
              telemetry={telemetry}
              onOpenAeratorModal={() =>
                setIsAeratorOpen(true)
              }
            />
          )}

          {/* =================================================
              HISTORIS
             ================================================= */}
          {activeTab === 'historis' && (
            <HistorisView
              todayData={todayChartData}
              yesterdayData={yesterdayChartData}
              weekData={weekChartData}
            />
          )}

          {/* =================================================
              PENGATURAN
             ================================================= */}
          {activeTab === 'pengaturan' && (
            <PengaturanView />
          )}

          {/* =================================================
              LAPORAN
             ================================================= */}
          {activeTab === 'laporan' && (
            <LaporanView summary={summary} />
          )}
        </main>
      </div>

      {/* =====================================================
          INTERACTIVE MODALS
         ===================================================== */}
      <Modals
        isDetailOpen={isDetailOpen}
        onCloseDetail={() =>
          setIsDetailOpen(false)
        }
        telemetry={telemetry}
        isEditPondOpen={isEditPondOpen}
        onCloseEditPond={() =>
          setIsEditPondOpen(false)
        }
        pondInfo={pondInfo}
        onSavePond={(updated) =>
          setPondInfo(updated)
        }
        isAeratorOpen={isAeratorOpen}
        onCloseAerator={() =>
          setIsAeratorOpen(false)
        }
        isNotifOpen={isNotifOpen}
        onCloseNotif={() =>
          setIsNotifOpen(false)
        }
        notifications={notifications}
        onToggleNotifStatus={handleToggleNotifStatus}
        onMarkAllResolved={handleMarkAllResolved}
      />
    </div>
  );
}