import { SolarTelemetry, PondInfo, ChartDataPoint } from '../types';

export const initialTelemetry: SolarTelemetry = {
  teganganPanel: 36.8,
  arusPanel: 16.6,
};

export const initialPondInfo: PondInfo = {
  luasKolam: '1,200 m²',
  luasM2: 1200,
  estimasiPopulasi: '8,000 ekor',
  populasiCount: 8000,
  jenisIkan: 'Nila',
  umurBudidaya: '45 hari',
  umurHari: 45,
  lokasi: 'Kolam Bioflok Blok B-04',
};

// Data grafik/historis.
// Format: [waktu, tegangan panel (V), arus panel (A), iradiasi (W/m²)]
const makeData = (
  rows: [string, number, number, number][]
): ChartDataPoint[] =>
  rows.map(([time, teganganPanel, arusPanel, iradiasi]) => ({
    time,
    teganganPanel,
    arusPanel,
    iradiasi,
  }));

// Hari ini
export const todayChartData = makeData([
  ['02:00', 0, 0, 0],
  ['04:00', 0, 0, 0],
  ['06:00', 28, 3.0, 45],
  ['08:00', 33, 10.3, 287],
  ['10:00', 35.5, 16.3, 559],
  ['12:00', 37, 18.6, 702],
  ['14:00', 36.5, 17.3, 619],
  ['16:00', 34, 12.1, 363],
  ['18:00', 29, 3.8, 68],
  ['20:00', 0, 0, 0],
  ['22:00', 0, 0, 0],
]);

// Kemarin
export const yesterdayChartData = makeData([
  ['02:00', 0, 0, 0],
  ['04:00', 0, 0, 0],
  ['06:00', 28, 3.2, 37],
  ['08:00', 33.5, 10.7, 294],
  ['10:00', 35.5, 16.9, 558],
  ['12:00', 37, 19.2, 698],
  ['14:00', 36.5, 17.5, 617],
  ['16:00', 34.5, 12.5, 367],
  ['18:00', 29, 4.1, 73],
  ['20:00', 0, 0, 0],
  ['22:00', 0, 0, 0],
]);

// 7 hari terakhir (rata-rata harian)
export const weekChartData = makeData([
  ['Senin', 35.0, 16.9, 214],
  ['Selasa', 34.8, 16.7, 226],
  ['Rabu', 36.8, 16.6, 219],
  ['Kamis', 37.0, 17.3, 223],
  ['Jumat', 35.5, 16.9, 210],
  ['Sabtu', 37.2, 17.7, 231],
  ['Minggu', 36.4, 17.0, 221],
]);
