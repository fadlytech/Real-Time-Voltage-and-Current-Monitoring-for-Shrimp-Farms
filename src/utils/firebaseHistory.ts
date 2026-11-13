import { ChartDataPoint } from '../types';
import { getIradiasiBulanan2026 } from '../data/solarRadiation';

export interface FirebaseHistoryRecord {
  id: string;
  current: number;
  voltage: number;
  timestamp: number;
}

export interface AggregatedFirebaseHistory {
  todayData: ChartDataPoint[];
  yesterdayData: ChartDataPoint[];
  weekData: ChartDataPoint[];
  rawLogs: ChartDataPoint[];
  referenceDateLabel: string;
  isUsingLatestRecordDate: boolean;
}

const THREE_HOUR_SLOTS = [0, 3, 6, 9, 12, 15, 18, 21];
const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

function formatSlotTime(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function formatLogTimestamp(ts: number): string {
  const d = new Date(ts);
  const datePart = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
  });
  const timePart = d.toLocaleTimeString('id-ID', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${datePart} ${timePart}`;
}

function aggregateDayBy3Hours(
  records: FirebaseHistoryRecord[],
  targetDate: Date
): ChartDataPoint[] {
  const targetKey = toLocalDateKey(targetDate);
  const iradFallback = Math.round(getIradiasiBulanan2026(targetDate));

  const buckets = new Map<number, { sumV: number; sumI: number; count: number }>();
  for (const slot of THREE_HOUR_SLOTS) {
    buckets.set(slot, { sumV: 0, sumI: 0, count: 0 });
  }

  for (const rec of records) {
    const recDate = new Date(rec.timestamp);
    if (toLocalDateKey(recDate) !== targetKey) continue;
    const slotHour = Math.floor(recDate.getHours() / 3) * 3;
    const bucket = buckets.get(slotHour);
    if (bucket) {
      bucket.sumV += rec.voltage;
      bucket.sumI += rec.current;
      bucket.count += 1;
    }
  }

  return THREE_HOUR_SLOTS.map((slot) => {
    const b = buckets.get(slot)!;
    const hasData = b.count > 0;
    return {
      time: formatSlotTime(slot),
      teganganPanel: hasData ? Number((b.sumV / b.count).toFixed(2)) : 0,
      arusPanel: hasData ? Number((b.sumI / b.count).toFixed(2)) : 0,
      iradiasi: hasData ? iradFallback : 0,
    };
  });
}

export function parseAndAggregateFirebaseHistory(
  rawObj: Record<string, unknown> | null | undefined
): AggregatedFirebaseHistory | null {
  if (!rawObj || typeof rawObj !== 'object') return null;

  const records: FirebaseHistoryRecord[] = [];
  for (const [id, val] of Object.entries(rawObj)) {
    if (!val || typeof val !== 'object') continue;
    const item = val as Record<string, unknown>;
    const voltage = Number(item.voltage);
    const current = Number(item.current);
    const timestamp = Number(item.timestamp);

    if (
      Number.isFinite(voltage) &&
      Number.isFinite(current) &&
      Number.isFinite(timestamp) &&
      timestamp > 0
    ) {
      records.push({ id, voltage, current, timestamp });
    }
  }

  if (records.length === 0) return null;

  // Sort chronologically ascending for aggregation
  records.sort((a, b) => a.timestamp - b.timestamp);

  const now = new Date();
  const todayKey = toLocalDateKey(now);
  const hasTodayRecords = records.some(
    (r) => toLocalDateKey(new Date(r.timestamp)) === todayKey
  );

  // If today has logs use today; otherwise anchor to the latest date present in Firebase
  const latestRecordDate = new Date(records[records.length - 1].timestamp);
  const referenceDate = hasTodayRecords ? now : latestRecordDate;

  const yesterdayDate = new Date(referenceDate);
  yesterdayDate.setDate(referenceDate.getDate() - 1);

  const todayData = aggregateDayBy3Hours(records, referenceDate);
  const yesterdayData = aggregateDayBy3Hours(records, yesterdayDate);

  // Build last 7 days ending on referenceDate
  const weekData: ChartDataPoint[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() - offset);
    const key = toLocalDateKey(d);
    const dayRecords = records.filter(
      (r) => toLocalDateKey(new Date(r.timestamp)) === key
    );
    const count = dayRecords.length;
    const avgV =
      count > 0
        ? dayRecords.reduce((acc, r) => acc + r.voltage, 0) / count
        : 0;
    const avgI =
      count > 0
        ? dayRecords.reduce((acc, r) => acc + r.current, 0) / count
        : 0;
    const irad = count > 0 ? Math.round(getIradiasiBulanan2026(d)) : 0;

    weekData.push({
      time: DAY_NAMES_ID[d.getDay()],
      teganganPanel: Number(avgV.toFixed(2)),
      arusPanel: Number(avgI.toFixed(2)),
      iradiasi: irad,
    });
  }

  // Raw logs (newest first, up to 200 latest samples for table/CSV)
  const rawLogs: ChartDataPoint[] = [...records]
    .reverse()
    .slice(0, 200)
    .map((r) => ({
      time: formatLogTimestamp(r.timestamp),
      teganganPanel: Number(r.voltage.toFixed(2)),
      arusPanel: Number(r.current.toFixed(2)),
      iradiasi: Math.round(getIradiasiBulanan2026(new Date(r.timestamp))),
      timestamp: r.timestamp,
    }));

  return {
    todayData,
    yesterdayData,
    weekData,
    rawLogs,
    referenceDateLabel: formatShortDate(referenceDate),
    isUsingLatestRecordDate: !hasTodayRecords,
  };
}
