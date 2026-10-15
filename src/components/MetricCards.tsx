import React from 'react';
import { SolarTelemetry } from '../types';

interface MetricCardsProps {
  telemetry: SolarTelemetry;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  telemetry,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      
      {/* Tegangan Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-blue-600">
              V
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Tegangan Panel
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {telemetry.teganganPanel}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            V
          </span>
        </div>
      </div>

      {/* Arus Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-blue-600">
              A
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-600">
            Arus Panel
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
            {telemetry.arusPanel}
          </span>
          <span className="ml-1.5 text-base font-bold text-slate-700">
            A
          </span>
        </div>
      </div>

    </div>
  );
};