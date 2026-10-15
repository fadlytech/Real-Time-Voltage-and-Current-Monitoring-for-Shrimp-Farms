import { SolarTelemetry } from '../types';

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

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    waktu: '16 Apr 2025 13:21',
    kategori: 'Peringatan',
    pesan: 'Tegangan panel turun di bawah 30 V',
    status: 'Terselesaikan',
  },
  {
    id: 'notif-2',
    waktu: '16 Apr 2025 11:05',
    kategori: 'Info',
    pesan: 'DO di bawah 5 mg/L',
    status: 'Terselesaikan',
  },
  {
    id: 'notif-3',
    waktu: '16 Apr 2025 08:14',
    kategori: 'Peringatan',
    pesan: 'Kapasitas baterai di bawah 30%',
    status: 'Terselesaikan',
  },
  {
    id: 'notif-4',
    waktu: '16 Apr 2025 06:42',
    kategori: 'Info',
    pesan: 'Aerator kembali normal',
    status: 'Terselesaikan',
  },
];

export const initialSummary: DailySummaryData = {
  rataRataRadiasi: 612,
  energiDihasilkan: 4.8,
  energiTerpakai: 4.2,
  durasiOperasi: 10.5,
  penghematanCo2: 3.6,
  penghematanBiayaIdr: 72000,
};

// Hourly data for "Hari ini"
export const todayChartData: ChartDataPoint[] = [
  { time: '02:00', baterai: 78, do: 5.2, suhu: 28.0, dayaPv: 0, dayaBeban: 380 },
  { time: '04:00', baterai: 68, do: 5.0, suhu: 27.4, dayaPv: 0, dayaBeban: 380 },
  { time: '06:00', baterai: 58, do: 5.8, suhu: 27.2, dayaPv: 85, dayaBeban: 400 },
  { time: '08:00', baterai: 55, do: 6.7, suhu: 28.2, dayaPv: 340, dayaBeban: 410 },
  { time: '10:00', baterai: 68, do: 6.2, suhu: 29.5, dayaPv: 580, dayaBeban: 420 },
  { time: '12:00', baterai: 88, do: 7.4, suhu: 31.8, dayaPv: 690, dayaBeban: 420 },
  { time: '14:00', baterai: 82, do: 7.0, suhu: 32.4, dayaPv: 630, dayaBeban: 420 },
  { time: '16:00', baterai: 78, do: 7.2, suhu: 30.8, dayaPv: 410, dayaBeban: 420 },
  { time: '18:00', baterai: 75, do: 6.6, suhu: 29.8, dayaPv: 110, dayaBeban: 410 },
  { time: '20:00', baterai: 72, do: 6.1, suhu: 29.0, dayaPv: 0, dayaBeban: 400 },
  { time: '22:00', baterai: 70, do: 6.2, suhu: 28.5, dayaPv: 0, dayaBeban: 390 },
];

export const yesterdayChartData: ChartDataPoint[] = [
  { time: '02:00', baterai: 82, do: 5.4, suhu: 27.8, dayaPv: 0, dayaBeban: 380 },
  { time: '04:00', baterai: 72, do: 5.1, suhu: 27.2, dayaPv: 0, dayaBeban: 380 },
  { time: '06:00', baterai: 64, do: 5.6, suhu: 27.0, dayaPv: 90, dayaBeban: 400 },
  { time: '08:00', baterai: 60, do: 6.4, suhu: 28.0, dayaPv: 360, dayaBeban: 410 },
  { time: '10:00', baterai: 74, do: 6.8, suhu: 29.8, dayaPv: 600, dayaBeban: 420 },
  { time: '12:00', baterai: 91, do: 7.6, suhu: 32.2, dayaPv: 710, dayaBeban: 420 },
  { time: '14:00', baterai: 86, do: 7.3, suhu: 32.8, dayaPv: 640, dayaBeban: 420 },
  { time: '16:00', baterai: 80, do: 7.0, suhu: 31.0, dayaPv: 430, dayaBeban: 420 },
  { time: '18:00', baterai: 77, do: 6.5, suhu: 29.9, dayaPv: 120, dayaBeban: 410 },
  { time: '20:00', baterai: 74, do: 6.0, suhu: 29.1, dayaPv: 0, dayaBeban: 400 },
  { time: '22:00', baterai: 71, do: 5.9, suhu: 28.6, dayaPv: 0, dayaBeban: 390 },
];

export const weekChartData: ChartDataPoint[] = [
  { time: 'Senin', baterai: 76, do: 6.4, suhu: 28.2, dayaPv: 590, dayaBeban: 410 },
  { time: 'Selasa', baterai: 74, do: 6.1, suhu: 28.5, dayaPv: 580, dayaBeban: 415 },
  { time: 'Rabu', baterai: 78, do: 6.2, suhu: 28.4, dayaPv: 612, dayaBeban: 420 },
  { time: 'Kamis', baterai: 82, do: 6.8, suhu: 29.0, dayaPv: 640, dayaBeban: 420 },
  { time: 'Jumat', baterai: 79, do: 6.5, suhu: 28.6, dayaPv: 600, dayaBeban: 410 },
  { time: 'Sabtu', baterai: 85, do: 7.0, suhu: 29.2, dayaPv: 660, dayaBeban: 425 },
  { time: 'Minggu', baterai: 80, do: 6.3, suhu: 28.3, dayaPv: 620, dayaBeban: 410 },
];
