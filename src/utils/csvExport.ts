import { ChartDataPoint, PondInfo, PvSettings } from '../types';

export type CsvFormatPreset = 'excel_id' | 'standard';

export interface ExportCsvOptions {
  rows: ChartDataPoint[];
  periodId: 'today' | 'yesterday' | 'week' | 'realtime';
  periodTitle: string;
  settings: PvSettings;
  pondInfo?: PondInfo;
  dateNote?: string | null;
  preset?: CsvFormatPreset;
}

export function isDataPointPopulated(row: ChartDataPoint): boolean {
  if (typeof row.sampleCount === 'number') {
    return row.sampleCount > 0;
  }
  return row.teganganPanel > 0 || row.arusPanel > 0 || row.iradiasi > 0;
}

export function getDataPointStatus(
  row: ChartDataPoint,
  settings: PvSettings
): string {
  if (!isDataPointPopulated(row)) {
    return 'Belum ada data';
  }
  if (
    row.teganganPanel > settings.maxVoltage ||
    row.arusPanel > settings.maxCurrent
  ) {
    return 'Batas Maksimum';
  }
  if (
    settings.undervoltageAlert &&
    row.teganganPanel > 0 &&
    row.teganganPanel < settings.minVoltage
  ) {
    return 'Drop Tegangan';
  }
  return 'Normal';
}

function escapeCsvCell(raw: string, delimiter: string): string {
  const needsFormulaGuard =
    raw.length > 1 && (raw.startsWith('=') || raw.startsWith('+') || raw.startsWith('@'));
  const safe = needsFormulaGuard ? `'${raw}` : raw;

  if (
    safe.includes(delimiter) ||
    safe.includes('"') ||
    safe.includes('\n') ||
    safe.includes('\r')
  ) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

function formatNum(value: number, decimals: number, preset: CsvFormatPreset): string {
  const fixed = value.toFixed(decimals);
  return preset === 'excel_id' ? fixed.replace('.', ',') : fixed;
}

function formatPeriodTimeLabel(
  row: ChartDataPoint,
  periodId: ExportCsvOptions['periodId']
): string {
  if (periodId === 'today' || periodId === 'yesterday') {
    const startHour = Number(row.time.split(':')[0]);
    if (Number.isFinite(startHour)) {
      const start = `${String(startHour).padStart(2, '0')}:00`;
      const end = `${String(startHour + 2).padStart(2, '0')}:59`;
      return `${start} - ${end}`;
    }
  }
  return row.time;
}

function formatExportTimestamp(date: Date): string {
  const tgl = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const jam = date
    .toLocaleTimeString('id-ID', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/\./g, ':');
  return `${tgl} ${jam}`;
}

export function buildHistorisCsvContent(options: ExportCsvOptions): {
  content: string;
  filename: string;
} {
  const {
    rows,
    periodId,
    periodTitle,
    settings,
    pondInfo,
    dateNote,
    preset = 'excel_id',
  } = options;

  const delimiter = preset === 'excel_id' ? ';' : ',';
  const toLine = (cells: string[]) =>
    cells.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter);

  const now = new Date();
  const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;

  const periodSlug: Record<ExportCsvOptions['periodId'], string> = {
    today: 'Hari_Ini',
    yesterday: 'Kemarin',
    week: '7_Hari',
    realtime: 'Log_Sensor',
  };

  const lines: string[] = [];

  // 1. Metadata Laporan
  lines.push(toLine(['LAPORAN DATA HISTORIS MONITORING PANEL SURYA (PV)']));
  if (pondInfo) {
    lines.push(toLine(['Lokasi / Stasiun', pondInfo.lokasi]));
    lines.push(toLine(['ID Telemetri', pondInfo.emailTelemetry]));
  }
  lines.push(toLine(['Periode Laporan', periodTitle]));
  if (dateNote) {
    lines.push(toLine(['Catatan Acuan', dateNote]));
  }
  lines.push(toLine(['Waktu Ekspor', formatExportTimestamp(now)]));
  lines.push(
    toLine([
      'Batas Aman Pengaturan',
      `Tegangan ${settings.minVoltage}-${settings.maxVoltage} V | Arus Maks ${settings.maxCurrent} A`,
    ])
  );
  lines.push('');

  // 2. Header Tabel Utama
  lines.push(
    toLine([
      'No',
      'Tanggal',
      periodId === 'week' ? 'Hari' : 'Waktu / Rentang Jam',
      'Jumlah Sampel',
      'Iradiasi (W/m²)',
      'Tegangan Panel (V)',
      'Arus Panel (A)',
      'Daya PV (W)',
      'Status Operasi',
    ])
  );

  // 3. Isi Baris Data
  rows.forEach((row, index) => {
    const populated = isDataPointPopulated(row);
    const status = getDataPointStatus(row, settings);
    const power = row.teganganPanel * row.arusPanel;
    const sampleCount =
      typeof row.sampleCount === 'number' ? row.sampleCount : populated ? 1 : 0;

    lines.push(
      toLine([
        String(index + 1),
        row.dateLabel ?? '-',
        formatPeriodTimeLabel(row, periodId),
        String(sampleCount),
        populated ? formatNum(row.iradiasi, 0, preset) : '-',
        populated ? formatNum(row.teganganPanel, 2, preset) : '-',
        populated ? formatNum(row.arusPanel, 2, preset) : '-',
        populated ? formatNum(power, 2, preset) : '-',
        status,
      ])
    );
  });

  // 4. Baris Ringkasan Statistik (hanya dari data yang terisi)
  const populatedRows = rows.filter(isDataPointPopulated);
  lines.push('');
  lines.push(toLine(['RINGKASAN STATISTIK PERIODE']));

  if (populatedRows.length > 0) {
    const voltages = populatedRows.map((r) => r.teganganPanel);
    const currents = populatedRows.map((r) => r.arusPanel);
    const powers = populatedRows.map((r) => r.teganganPanel * r.arusPanel);
    const irads = populatedRows.map((r) => r.iradiasi);
    const totalSamples = populatedRows.reduce(
      (sum, r) => sum + (r.sampleCount ?? 1),
      0
    );

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    lines.push(
      toLine([
        '',
        'Ringkasan',
        'Rata-rata',
        String(totalSamples),
        formatNum(avg(irads), 1, preset),
        formatNum(avg(voltages), 2, preset),
        formatNum(avg(currents), 2, preset),
        formatNum(avg(powers), 2, preset),
        `${populatedRows.length} dari ${rows.length} baris terisi`,
      ])
    );

    lines.push(
      toLine([
        '',
        'Ringkasan',
        'Maksimum (Puncak)',
        '-',
        formatNum(Math.max(...irads), 0, preset),
        formatNum(Math.max(...voltages), 2, preset),
        formatNum(Math.max(...currents), 2, preset),
        formatNum(Math.max(...powers), 2, preset),
        '-',
      ])
    );

    lines.push(
      toLine([
        '',
        'Ringkasan',
        'Minimum (Aktif)',
        '-',
        formatNum(Math.min(...irads), 0, preset),
        formatNum(Math.min(...voltages), 2, preset),
        formatNum(Math.min(...currents), 2, preset),
        formatNum(Math.min(...powers), 2, preset),
        '-',
      ])
    );
  } else {
    lines.push(toLine(['', 'Ringkasan', 'Belum ada rekaman data aktif pada periode ini.']));
  }

  return {
    content: `\uFEFF${lines.join('\r\n')}\r\n`,
    filename: `Laporan_PV_${periodSlug[periodId]}_${dateStamp}.csv`,
  };
}

export function downloadHistorisCsv(options: ExportCsvOptions): void {
  const { content, filename } = buildHistorisCsvContent(options);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
