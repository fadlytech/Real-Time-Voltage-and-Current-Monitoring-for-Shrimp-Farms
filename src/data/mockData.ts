import { SolarTelemetry, PondInfo, PvSettings, ChartDataPoint } from '../types';

export const initialTelemetry: SolarTelemetry = {
  teganganPanel: 36.8,
  arusPanel: 16.6,
};

export const initialPondInfo: PondInfo = {
  lokasi: 'Kolam Bioflok Blok B-04',
  emailTelemetry: 'mppt.telemetry@tambak.id',
};

export const initialPvSettings: PvSettings = {
  minVoltage: 24.0,
  maxVoltage: 42.0,
  maxCurrent: 20.0,
  nominalVmp: 36.8,
  nominalImp: 16.6,
  offlineTimeoutSeconds: 30,
  undervoltageAlert: true,
  overcurrentProtection: true,
  autoLogging: true,
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

// Hari ini (Interval tiap 3 jam sekali)
export const todayChartData = makeData([
  ['00:00', 0, 0, 0],
  ['03:00', 0, 0, 0],
  ['06:00', 28.0, 3.0, 45],
  ['09:00', 34.5, 13.5, 425],
  ['12:00', 37.0, 18.6, 702],
  ['15:00', 35.5, 14.8, 495],
  ['18:00', 29.0, 3.8, 68],
  ['21:00', 0, 0, 0],
]);

// Kemarin (Interval tiap 3 jam sekali)
export const yesterdayChartData = makeData([
  ['00:00', 0, 0, 0],
  ['03:00', 0, 0, 0],
  ['06:00', 28.0, 3.2, 37],
  ['09:00', 34.8, 14.0, 432],
  ['12:00', 37.0, 19.2, 698],
  ['15:00', 35.8, 15.1, 502],
  ['18:00', 29.0, 4.1, 73],
  ['21:00', 0, 0, 0],
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
