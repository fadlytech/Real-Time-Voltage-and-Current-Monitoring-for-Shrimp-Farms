export type TabType = 'beranda' | 'monitoring' | 'historis' | 'pengaturan' | 'notifikasi' | 'laporan';

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

export interface NotificationItem {
  id: string;
  waktu: string;
  kategori: 'Peringatan' | 'Info' | 'Bahaya';
  pesan: string;
  status: 'Terselesaikan' | 'Aktif';
}

export interface ChartDataPoint {
  time: string;
  baterai: number; // 0-100 %
  do: number; // 0-10 mg/L
  suhu: number; // 20-36 °C
  dayaPv?: number;
  dayaBeban?: number;
}

export interface DailySummaryData {
  rataRataRadiasi: number; // W/m² (612)
  energiDihasilkan: number; // kWh (4.8)
  energiTerpakai: number; // kWh (4.2)
  durasiOperasi: number; // jam (10.5)
  penghematanCo2: number; // kg (3.6)
  penghematanBiayaIdr: number; // Rp
}
