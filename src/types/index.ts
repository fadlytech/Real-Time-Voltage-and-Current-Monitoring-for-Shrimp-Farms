export type TabType = 'beranda' | 'historis' | 'pengaturan';

export interface SolarTelemetry {
  teganganPanel: number;
  arusPanel: number;
}

export interface PondInfo {
  luasKolam: string; // e.g. "1,200 m²"
  luasM2: number;
  estimasiPopulasi: string; // e.g. "8,000 ekor"
  populasiCount: number;
  jenisIkan: string; // e.g. "Nila"
  umurBudidaya: string; // e.g. "45 hari"
  umurHari: number;
  lokasi: string;
}

export interface ChartDataPoint {
  time: string;
  teganganPanel: number; // V
  arusPanel: number;     // A
  iradiasi: number;      // W/m²
}
