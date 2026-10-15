/**
 * Estimasi radiasi matahari bulanan menggunakan Model Angstrom–Prescott.
 * Data lama penyinaran (sunshine) berasal dari Excel BMKG Stasiun Meteorologi Juanda.
 * Konstanta standar FAO-56: as = 0.25 dan bs = 0.50.
 *
 * Rs dihitung dalam MJ/m²/hari. Nilai W/m² pada kartu adalah ekuivalen rata-rata
 * selama 24 jam (Rs × 1.000.000 / 86.400), bukan pengukuran instan sensor.
 */

export const SUNSHINE_HOURS_BY_MONTH: Record<number, number> = {
  1: 3.3,
  2: 4.2,
  3: 4.3,
  4: 5.3,
  5: 5.0,
  6: 6.0,
  7: 7.2,
  8: 7.4,
  9: 7.2,
  10: 6.0,
  11: 3.3,
  12: 4.5,
};

export interface SolarRadiationEstimate {
  month: number;
  monthName: string;
  sunshineHours: number;
  dayLengthHours: number;
  extraterrestrialRadiation: number;
  radiationMJ: number;
  averageWm2: number;
}

const LATITUDE_DEGREES = -7.3846; // Stasiun Meteorologi Juanda, BMKG
const ANGSTROM_AS = 0.25;
const ANGSTROM_BS = 0.50;
const SOLAR_CONSTANT = 0.0820; // MJ m⁻² min⁻¹ (FAO-56)

export function estimateMonthlySolarRadiation(
  date: Date = new Date()
): SolarRadiationEstimate {
  const month = date.getMonth() + 1;
  const sunshineHours = SUNSHINE_HOURS_BY_MONTH[month] ?? 0;
  const latitude = (LATITUDE_DEGREES * Math.PI) / 180;

  // Geometri matahari FAO-56 dihitung pada tanggal 15 bulan berjalan.
  const midMonth = new Date(date.getFullYear(), month - 1, 15);
  const dayOfYear = Math.floor(
    (midMonth.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );

  const inverseEarthSunDistance =
    1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const solarDeclination =
    0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const sunsetHourAngle = Math.acos(
    Math.max(
      -1,
      Math.min(1, -Math.tan(latitude) * Math.tan(solarDeclination))
    )
  );

  const dayLengthHours = (24 / Math.PI) * sunsetHourAngle;
  const extraterrestrialRadiation =
    ((24 * 60) / Math.PI) *
    SOLAR_CONSTANT *
    inverseEarthSunDistance *
    (sunsetHourAngle * Math.sin(latitude) * Math.sin(solarDeclination) +
      Math.cos(latitude) *
        Math.cos(solarDeclination) *
        Math.sin(sunsetHourAngle));

  const sunshineRatio = Math.min(1, sunshineHours / dayLengthHours);
  const radiationMJ =
    (ANGSTROM_AS + ANGSTROM_BS * sunshineRatio) *
    extraterrestrialRadiation;
  const averageWm2 = (radiationMJ * 1_000_000) / 86400;

  return {
    month,
    monthName: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date),
    sunshineHours,
    dayLengthHours,
    extraterrestrialRadiation,
    radiationMJ,
    averageWm2,
  };
}

/**
 * Iradiasi rata-rata 24 jam (W/m²) per bulan tahun 2026.
 * Sumber: Perhitungan_Iradiasi_1_Tahun_2026_Angstrom_Prescott.xlsx (sheet "Ringkasan 1 Tahun").
 */
export const IRADIASI_BULANAN_2026_WM2: Record<number, number> = {
  1: 171.82,
  2: 189.96,
  3: 188.23,
  4: 193.32,
  5: 172.63,
  6: 178.53,
  7: 200.51,
  8: 219.71,
  9: 233.65,
  10: 220.3,
  11: 171.44,
  12: 191.93,
};

export function getIradiasiBulanan2026(date: Date = new Date()): number {
  return IRADIASI_BULANAN_2026_WM2[date.getMonth() + 1] ?? 0;
}
