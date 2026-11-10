import React from 'react';
import { Cog, ChevronRight } from 'lucide-react';
import { SolarTelemetry } from '../types';

interface SystemDiagramProps {
  telemetry: SolarTelemetry;
  onOpenDetails: () => void;
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({
  telemetry,
  onOpenDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cog className="w-4 h-4 text-blue-600" />
          </div>

          <h2 className="text-base font-bold text-slate-800">
            Sistem Panel Surya
          </h2>
        </div>

        <button
          onClick={onOpenDetails}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline cursor-pointer transition-colors"
        >
          <span>Detail Sistem</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        
        {/* Solar Panel Illustration */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-28 flex items-center justify-center">
            <svg
              viewBox="0 0 120 100"
              className="w-full h-full drop-shadow-md"
            >
              <defs>
                <linearGradient
                  id="pvGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>

                <linearGradient
                  id="pvFrame"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>

              {/* Ground Stand */}
              <path
                d="M 45 85 L 60 65 L 75 85"
                stroke="#64748b"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <line
                x1="60"
                y1="65"
                x2="60"
                y2="45"
                stroke="#475569"
                strokeWidth="5"
              />

              <line
                x1="38"
                y1="85"
                x2="82"
                y2="85"
                stroke="#475569"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Panel Frame */}
              <polygon
                points="18,22 102,22 114,65 6,65"
                fill="url(#pvFrame)"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Panel Surface */}
              <polygon
                points="21,25 99,25 110,62 10,62"
                fill="url(#pvGrad)"
                stroke="#1e3a8a"
                strokeWidth="1.5"
              />

              {/* Horizontal Lines */}
              <line
                x1="18"
                y1="37"
                x2="102"
                y2="37"
                stroke="#ffffff"
                strokeWidth="1"
                strokeOpacity="0.8"
              />

              <line
                x1="14"
                y1="49"
                x2="106"
                y2="49"
                stroke="#ffffff"
                strokeWidth="1"
                strokeOpacity="0.8"
              />

              {/* Vertical Lines */}
              <line
                x1="36"
                y1="25"
                x2="31"
                y2="62"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />

              <line
                x1="51"
                y1="25"
                x2="49"
                y2="62"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />

              <line
                x1="69"
                y1="25"
                x2="71"
                y2="62"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />

              <line
                x1="84"
                y1="25"
                x2="89"
                y2="62"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />

              {/* Sun Reflection */}
              <polygon
                points="25,25 45,25 35,62 15,62"
                fill="#ffffff"
                fillOpacity="0.18"
              />
            </svg>

            {/* Status indicator */}
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div className="mt-1">
            <h3 className="text-sm font-bold text-slate-900">
              Panel Surya
            </h3>

            <p className="text-xs text-slate-500 font-medium mt-1">
              Data kelistrikan panel
            </p>
          </div>
        </div>

        {/* Panel Measurements */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Tegangan */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-bold">
                V
              </div>

              <span className="text-xs font-semibold text-slate-600">
                Tegangan
              </span>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {telemetry.teganganPanel}
              </span>

              <span className="ml-1 text-sm font-bold text-slate-600">
                V
              </span>
            </div>
          </div>

          {/* Arus */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-bold">
                A
              </div>

              <span className="text-xs font-semibold text-slate-600">
                Arus
              </span>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {telemetry.arusPanel}
              </span>

              <span className="ml-1 text-sm font-bold text-slate-600">
                A
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};