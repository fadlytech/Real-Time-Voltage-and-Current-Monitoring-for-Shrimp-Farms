import React, { useState } from 'react';
import {
  Waves,
  Edit3,
  Maximize2,
  Fish,
  Calendar,
  Droplets,
  Layers,
} from 'lucide-react';
import { PondInfo } from '../types';
import pondImage from '../assets/images/kondisi_kolam_1790906882551.jpg';

interface PondConditionProps {
  pondInfo: PondInfo;
  onEditPond: () => void;
}

export const PondCondition: React.FC<PondConditionProps> = ({
  pondInfo,
  onEditPond,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Kondisi Kolam</h2>
        </div>
        <button
          onClick={onEditPond}
          title="Ubah parameter kolam"
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Pond Visual Photo Container */}
        <div className="sm:col-span-6 relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200 shadow-2xs group">
          {!imgError ? (
            <img
              src={pondImage}
              alt="Kondisi Kolam Budidaya dan Aerator"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            /* Resilient SVG fallback matching the pond photo */
            <div className="w-full h-full bg-gradient-to-b from-sky-200 via-teal-100 to-emerald-200 flex flex-col items-center justify-center relative p-3">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Hills */}
                <path d="M0 60 Q 50 30, 100 55 T 200 45 L 200 120 L 0 120 Z" fill="#15803d" opacity="0.6" />
                <path d="M0 70 Q 70 50, 140 68 T 200 60 L 200 120 L 0 120 Z" fill="#166534" opacity="0.8" />
                {/* Water */}
                <rect x="0" y="75" width="200" height="45" fill="#0284c7" />
                {/* Splash & ripples */}
                <circle cx="100" cy="95" r="16" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.8" />
                <circle cx="100" cy="95" r="26" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity="0.5" />
                <circle cx="100" cy="95" r="7" fill="#facc15" />
              </svg>
            </div>
          )}

          {/* Active status pill overlay on image */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Aerator Aktif</span>
          </div>
        </div>

        {/* Pond Parameters List */}
        <div className="sm:col-span-6 space-y-2.5 text-xs sm:text-sm">
          {/* 1. Luas Kolam */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">Luas Kolam</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {pondInfo.luasKolam}
            </span>
          </div>

          {/* 2. Estimasi Populasi */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Fish className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">Estimasi Populasi</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {pondInfo.estimasiPopulasi}
            </span>
          </div>

          {/* 3. Jenis Ikan */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Fish className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">Jenis Ikan</span>
            </div>
            <span className="font-bold text-slate-900">
              {pondInfo.jenisIkan}
            </span>
          </div>

          {/* 4. Umur Budidaya */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">Umur Budidaya</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {pondInfo.umurBudidaya}
            </span>
          </div>

          {/* 5. Kualitas Air */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2 text-slate-600">
              <Droplets className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium">Kualitas Air</span>
            </div>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-0.5 rounded-full">
              {pondInfo.kualitasAir}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
