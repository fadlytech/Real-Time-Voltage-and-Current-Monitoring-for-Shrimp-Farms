import { SolarTelemetry, PondInfo, ChartDataPoint, BatteryTelemetry, BatterySpec } from '../types';

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
  kualitasAir: 'Baik',
};

 
// Data grafik/historis.
// Format: [waktu, tegangan panel (V), arus panel (A), daya baterai (W), tegangan baterai (V), arus baterai (A), iradiasi (W/m²)]
// Arus baterai = daya baterai ÷ tegangan baterai (P = V × I).
const makeData = (
  rows: [string, number, number, number, number, number, number][]
): ChartDataPoint[] =>
  rows.map(([time, teganganPanel, arusPanel, dayaBaterai, teganganBaterai, arusBaterai, iradiasi]) => ({
    time,
    teganganPanel,
    arusPanel,
    dayaBaterai,
    teganganBaterai,
    arusBaterai,
    iradiasi,
  }));

// Hari ini
export const todayChartData = makeData([
  ['02:00', 0, 0, -380, 24.6, -15.4, 0],
  ['04:00', 0, 0, -380, 24.4, -15.6, 0],
  ['06:00', 28, 3.0, -315, 24.8, -12.7, 45],
  ['08:00', 33, 10.3, -70, 25.3, -2.8, 287],
  ['10:00', 35.5, 16.3, 160, 25.9, 6.2, 559],
  ['12:00', 37, 18.6, 270, 26.4, 10.2, 702],
  ['14:00', 36.5, 17.3, 210, 26.3, 8.0, 619],
  ['16:00', 34, 12.1, -10, 25.8, -0.4, 363],
  ['18:00', 29, 3.8, -300, 25.0, -12.0, 68],
  ['20:00', 0, 0, -400, 24.5, -16.3, 0],
  ['22:00', 0, 0, -390, 24.4, -16.0, 0],
]);

// Kemarin
export const yesterdayChartData = makeData([
  ['02:00', 0, 0, -380, 24.6, -15.4, 0],
  ['04:00', 0, 0, -380, 24.4, -15.6, 0],
  ['06:00', 28, 3.2, -310, 24.8, -12.5, 37],
  ['08:00', 33.5, 10.7, -50, 25.4, -2.0, 294],
  ['10:00', 35.5, 16.9, 180, 26.0, 6.9, 558],
  ['12:00', 37, 19.2, 290, 26.5, 10.9, 698],
  ['14:00', 36.5, 17.5, 220, 26.4, 8.3, 617],
  ['16:00', 34.5, 12.5, 10, 26.0, 0.4, 367],
  ['18:00', 29, 4.1, -290, 25.1, -11.6, 73],
  ['20:00', 0, 0, -400, 24.6, -16.3, 0],
  ['22:00', 0, 0, -390, 24.5, -15.9, 0],
]);

// 7 hari terakhir (rata-rata harian)
export const weekChartData = makeData([
  ['Senin', 35.0, 16.9, 180, 25.6, 7.0, 214],
  ['Selasa', 34.8, 16.7, 165, 25.4, 6.5, 226],
  ['Rabu', 36.8, 16.6, 192, 25.7, 7.5, 219],
  ['Kamis', 37.0, 17.3, 220, 25.9, 8.5, 223],
  ['Jumat', 35.5, 16.9, 190, 25.5, 7.5, 210],
  ['Sabtu', 37.2, 17.7, 235, 26.0, 9.0, 231],
  ['Minggu', 36.4, 17.0, 210, 25.8, 8.1, 221],
]);

export const initialBatteryInfo: BatteryTelemetry = {
  persentase: 78,
  teganganBaterai: 25.6,
  arusBaterai: 8.2,
  kapasitasAh: 100,
};

export const batterySpec: BatterySpec = {
  tipe: 'VRLA (Valve Regulated Lead Acid)',
  konfigurasi: 'Baterai VRLA 12 V 100 Ah, dirangkai seri',
  jumlahBlok: 2,
  teganganBlok: 12,
  teganganNominal: 24,
  kapasitasAh: 100,
};
