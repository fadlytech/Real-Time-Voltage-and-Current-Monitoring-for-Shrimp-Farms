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
  kualitasAir: 'Baik' | 'Cukup' | 'Kritis';
  lokasi: string;
}

export interface ChartDataPoint {
  time: string;
  teganganPanel: number; // V
  arusPanel: number;     // A
  dayaBaterai: number;   // W (+ mengisi, - dipakai)
  teganganBaterai: number; // V
  arusBaterai: number;   // A (+ mengisi, - dipakai)
  iradiasi: number;      // W/m²
}


export interface BatteryTelemetry {
  persentase: number;     // State of charge (%)
  teganganBaterai: number; // V
  arusBaterai: number;    // A (+ mengisi, - dipakai)
  kapasitasAh: number;    // Ah
}

export interface BatterySpec {
  tipe: string;            // Jenis baterai
  konfigurasi: string;     // Rangkaian blok
  jumlahBlok: number;      // Jumlah blok seri
  teganganBlok: number;    // V per blok
  teganganNominal: number; // V (total seri)
  kapasitasAh: number;     // Ah
}
