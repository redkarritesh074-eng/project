// Core domain types for the Air Pollution–Weather Coupled Forecasting System

export type AQICategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export type PollutantKey = 'pm25' | 'pm10' | 'o3' | 'nox';

export interface PollutantReading {
  pm25: number;
  pm10: number;
  o3: number;
  nox: number;
  so2: number;
  co: number;
  nh3: number;
}

export interface WeatherReading {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir: number;
  pressure: number;
  visibility: number;
  pblHeight: number;
  dewPoint: number;
}

export interface StationReading {
  stationId: string;
  stationName: string;
  lat: number;
  lng: number;
  aqi: number;
  category: AQICategory;
  dominant: PollutantKey;
  pollutants: PollutantReading;
  weather: WeatherReading;
  updatedAt: string;
}

export interface ForecastHour {
  time: string;
  timestamp: number;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  nox: number;
  temp: number;
  windSpeed: number;
  windDir: number;
  humidity: number;
  pblHeight: number;
  confidence: number;
}

export interface CoupledDataPoint {
  time: string;
  timestamp: number;
  pblHeight: number;
  temp: number;
  windSpeed: number;
  inversionStrength: number;
  pm25: number;
  pm10: number;
  nox: number;
  stubbleBurningContribution: number;
  localEmissionContribution: number;
  ventilationCoefficient: number;
}

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  source: 'live' | 'mock' | 'db';
}

export const AQI_COLORS: Record<AQICategory, string> = {
  Good: '#22c55e',
  Satisfactory: '#84cc16',
  Moderate: '#fbbf24',
  Poor: '#f97316',
  'Very Poor': '#ef4444',
  Severe: '#9333ea',
};

export const AQI_THRESHOLDS: { min: number; max: number; category: AQICategory; color: string; bg: string }[] = [
  { min: 0, max: 50, category: 'Good', color: '#16a34a', bg: '#dcfce7' },
  { min: 51, max: 100, category: 'Satisfactory', color: '#65a30d', bg: '#ecfccb' },
  { min: 101, max: 200, category: 'Moderate', color: '#d97706', bg: '#fef3c7' },
  { min: 201, max: 300, category: 'Poor', color: '#ea580c', bg: '#ffedd5' },
  { min: 301, max: 400, category: 'Very Poor', color: '#dc2626', bg: '#fee2e2' },
  { min: 401, max: 600, category: 'Severe', color: '#9333ea', bg: '#f3e8ff' },
];

export function getAQICategory(aqi: number): AQICategory {
  for (const t of AQI_THRESHOLDS) {
    if (aqi >= t.min && aqi <= t.max) return t.category;
  }
  return aqi > 600 ? 'Severe' : 'Good';
}

export function getAQIColor(aqi: number): string {
  const cat = getAQICategory(aqi);
  return AQI_COLORS[cat];
}

export function getAQIBg(aqi: number): string {
  for (const t of AQI_THRESHOLDS) {
    if (aqi >= t.min && aqi <= t.max) return t.bg;
  }
  return '#f3e8ff';
}

export const POLLUTANT_LABELS: Record<PollutantKey, string> = {
  pm25: 'PM2.5',
  pm10: 'PM10',
  o3: 'Ozone (O₃)',
  nox: 'NOx',
};

export const POLLUTANT_UNITS: Record<PollutantKey, string> = {
  pm25: 'µg/m³',
  pm10: 'µg/m³',
  o3: 'µg/m³',
  nox: 'µg/m³',
};

export const POLLUTANT_COLORS: Record<PollutantKey, string> = {
  pm25: '#3b82f6',
  pm10: '#f59e0b',
  o3: '#14b8a6',
  nox: '#ef4444',
};
