export type TabType = 'beranda' | 'historis' | 'pengaturan';

export type FirebaseStatus =
  | 'unconfigured'
  | 'connecting'
  | 'connected'
  | 'auth_error'
  | 'error';

export interface SolarTelemetry {
  teganganPanel: number;
  arusPanel: number;
  iradiasi?: number;
  timestamp?: number;
}

export interface PondInfo {
  lokasi: string; // e.g. "Kolam Bioflok Blok B-04"
  emailTelemetry: string; // e.g. "mppt.telemetry@tambak.id"
}

export interface PvSettings {
  minVoltage: number;
  maxVoltage: number;
  maxCurrent: number;
  nominalVmp: number;
  nominalImp: number;
  samplingInterval: number;
  undervoltageAlert: boolean;
  overcurrentProtection: boolean;
  autoLogging: boolean;
}

export interface ChartDataPoint {
  time: string;
  teganganPanel: number; // V
  arusPanel: number;     // A
  iradiasi: number;      // W/m²
  timestamp?: number;
}
