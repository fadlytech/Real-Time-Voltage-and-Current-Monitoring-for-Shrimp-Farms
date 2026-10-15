/**
 * Model sederhana baterai VRLA 2 × 12 V seri (24 V nominal, 100 Ah).
 *
 * - Tegangan dihitung dari persentase (state of charge) dengan interpolasi linear
 *   pada kurva tegangan tanpa beban per blok 12 V yang dikalikan dua.
 * - Persentase berubah sesuai arus: ΔSOC (%) = I × Δt (jam) × 100 / kapasitas (Ah).
 */

// Batas tegangan VRLA 2 × 12 V seri
// - Batas bawah 22,0 V: sekitar 11 V per blok, batas pengosongan dalam
// - Batas atas 27,6 V: tegangan float maksimum (sekitar 13,8 V per blok)
export const BATERAI_V_MIN = 22.0;
export const BATERAI_V_MAX = 27.6;

// Titik kurva [persentase, tegangan (V)]. Pada 25% tegangan sekitar 24 V.
const SOC_VOLTAGE_CURVE: [number, number][] = [
  [0, 22.0],
  [25, 24.0],
  [50, 24.8],
  [75, 25.4],
  [100, 26.8],
];

// Setiap 2 detik simulasi setara 2 menit waktu nyata, agar perubahan persentase terlihat.
export const SIM_SPEED = 120;
export const SIM_TICK_SECONDS = 2;

export function voltageFromSoc(soc: number): number {
  const s = Math.min(100, Math.max(0, soc));

  for (let i = 0; i < SOC_VOLTAGE_CURVE.length - 1; i++) {
    const [x0, y0] = SOC_VOLTAGE_CURVE[i];
    const [x1, y1] = SOC_VOLTAGE_CURVE[i + 1];
    if (s <= x1) {
      const t = (s - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }

  return SOC_VOLTAGE_CURVE[SOC_VOLTAGE_CURVE.length - 1][1];
}

// Perubahan persentase dalam satu tick simulasi. Arus positif = mengisi, negatif = dipakai.
export function socChangePerTick(arusA: number, kapasitasAh: number): number {
  const dtJam = (SIM_TICK_SECONDS * SIM_SPEED) / 3600;
  const deltaAh = arusA * dtJam;
  return (deltaAh / kapasitasAh) * 100;
}

// Batas operasi baterai
export const BATERAI_CUTOFF_PERSEN = 25;  // di bawah ini beban diputus
export const BATERAI_PENUH_PERSEN = 100;  // di atas ini pengisian dihentikan

/**
 * Membatasi arus sesuai kondisi baterai:
 * - Penuh (≥100%): pengisian dihentikan (arus positif jadi 0)
 * - Cutoff (≤25%): beban diputus (arus negatif jadi 0)
 */
export function batasiArus(persentase: number, arusA: number): number {
  if (persentase >= BATERAI_PENUH_PERSEN && arusA > 0) return 0;
  if (persentase <= BATERAI_CUTOFF_PERSEN && arusA < 0) return 0;
  return arusA;
}

export type StatusBaterai = 'Mengisi' | 'Dipakai' | 'Penuh' | 'Cutoff' | 'Diam';

export function getStatusBaterai(persentase: number, arusA: number): StatusBaterai {
  if (arusA > 0) return persentase >= BATERAI_PENUH_PERSEN ? 'Penuh' : 'Mengisi';
  if (arusA < 0) return 'Dipakai';
  if (persentase >= BATERAI_PENUH_PERSEN) return 'Penuh';
  if (persentase <= BATERAI_CUTOFF_PERSEN) return 'Cutoff';
  return 'Diam';
}
