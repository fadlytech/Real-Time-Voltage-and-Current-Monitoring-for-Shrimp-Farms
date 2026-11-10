import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { SystemDiagram } from './components/SystemDiagram';
import { PondCondition } from './components/PondCondition';
import { TelemetryCharts } from './components/TelemetryCharts';
import { Modals } from './components/Modals';

import { HistorisView } from './views/HistorisView';
import { PengaturanView } from './views/PengaturanView';

import {
  initialTelemetry,
  initialPondInfo,
  todayChartData,
  yesterdayChartData,
  weekChartData,
} from './data/mockData';

import { TabType, SolarTelemetry, PondInfo } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [telemetry, setTelemetry] = useState<SolarTelemetry>(initialTelemetry);
  const [pondInfo, setPondInfo] = useState<PondInfo>(initialPondInfo);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditPondOpen, setIsEditPondOpen] = useState<boolean>(false);

  // Simulasi real-time: tegangan & arus panel bergeser acak tiap 2 detik
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTelemetry((previous) => {
        const voltageVariation = (Math.random() - 0.5) * 2;
        const currentVariation = (Math.random() - 0.5) * 1;

        return {
          teganganPanel: Math.max(
            0,
            Number((previous.teganganPanel + voltageVariation).toFixed(2))
          ),
          arusPanel: Math.max(
            0,
            Number((previous.arusPanel + currentVariation).toFixed(2))
          ),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleResetData = () => {
    setTelemetry(initialTelemetry);
    setPondInfo(initialPondInfo);
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        telemetry={telemetry}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating((prev) => !prev)}
        onResetData={handleResetData}
      />

      <div className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadNotifsCount={0}
        />

        <main className="flex-1 min-w-0">
          {activeTab === 'beranda' && (
            <div className="space-y-4">
              <MetricCards telemetry={telemetry} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div className="lg:col-span-7">
                  <SystemDiagram
                    telemetry={telemetry}
                    onOpenDetails={() => setIsDetailOpen(true)}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PondCondition
                    pondInfo={pondInfo}
                    onEditPond={() => setIsEditPondOpen(true)}
                  />
                </div>
              </div>

              <TelemetryCharts
                todayData={todayChartData}
                yesterdayData={yesterdayChartData}
                weekData={weekChartData}
              />
            </div>
          )}

          {activeTab === 'historis' && (
            <HistorisView
              todayData={todayChartData}
              yesterdayData={yesterdayChartData}
              weekData={weekChartData}
            />
          )}

          {activeTab === 'pengaturan' && <PengaturanView />}
        </main>
      </div>

      <Modals
        isDetailOpen={isDetailOpen}
        onCloseDetail={() => setIsDetailOpen(false)}
        telemetry={telemetry}
        isEditPondOpen={isEditPondOpen}
        onCloseEditPond={() => setIsEditPondOpen(false)}
        pondInfo={pondInfo}
        onSavePond={(updated) => setPondInfo(updated)}
      />
    </div>
  );
}
