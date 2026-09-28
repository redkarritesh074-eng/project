import { motion } from 'framer-motion';
import { Thermometer, Wind, Droplets, Eye, Gauge, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { AQIBadge } from './AQIBadge';
import { DataSourceBadge } from './LoadingStates';
import { getAQICategory } from '@/types';

interface SummaryWidgetProps {
  data: {
    aqi: number;
    pm25: number;
    pm10: number;
    o3: number;
    nox: number;
    temp: number;
    humidity: number;
    windSpeed: number;
    windDir: number;
    visibility: number;
    pblHeight: number;
    category: string;
    hottestStation?: { stationName: string; aqi: number };
    cleanestStation?: { stationName: string; aqi: number };
    stationCount: number;
    updatedAt: string;
  };
  source: 'live' | 'mock';
}

const mockTrend = { aqi: +12, pm25: +8, temp: -1.5, wind: +0.8 };

export function SummaryWidget({ data, source }: SummaryWidgetProps) {
  const category = getAQICategory(data.aqi);

  const healthAdvice: Record<string, string> = {
    Good: 'Air quality is satisfactory. Enjoy outdoor activities.',
    Satisfactory: 'Air quality is acceptable for most people.',
    Moderate: 'Sensitive groups should limit prolonged outdoor exertion.',
    Poor: 'Children and people with respiratory issues should stay indoors.',
    'Very Poor': 'Avoid outdoor activities. Use N95 masks if going out.',
    Severe: 'Hazardous conditions. Remain indoors with air purifiers running.',
  };

  const metrics = [
    { label: 'PM2.5', value: data.pm25, unit: 'µg/m³', icon: Gauge, color: 'text-primary-600', bg: 'bg-primary-50', trend: mockTrend.pm25 },
    { label: 'Temperature', value: data.temp, unit: '°C', icon: Thermometer, color: 'text-warning-600', bg: 'bg-warning-50', trend: mockTrend.temp },
    { label: 'Wind Speed', value: data.windSpeed, unit: 'm/s', icon: Wind, color: 'text-accent-600', bg: 'bg-accent-50', trend: mockTrend.wind },
    { label: 'Humidity', value: data.humidity, unit: '%', icon: Droplets, color: 'text-primary-500', bg: 'bg-primary-50', trend: 0 },
    { label: 'Visibility', value: data.visibility, unit: 'km', icon: Eye, color: 'text-slate-600', bg: 'bg-slate-100', trend: 0 },
    { label: 'PBL Height', value: data.pblHeight, unit: 'm', icon: ArrowUpRight, color: 'text-accent-600', bg: 'bg-accent-50', trend: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="rounded-3xl bg-white border border-slate-200 shadow-elevated overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">Delhi NCR — Real-Time Air Quality Summary</span>
          </div>
          <DataSourceBadge source={source} />
        </div>

        <div className="p-6">
          {/* Main AQI display */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-1">AQI Index</span>
                <AQIBadge aqi={data.aqi} size="xl" showLabel={false} />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 font-display">{category}</span>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">{healthAdvice[category]}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {metrics.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${m.color}`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide block">{m.label}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-800 font-display">{m.value}</span>
                        <span className="text-2xs text-slate-400">{m.unit}</span>
                        {m.trend !== 0 && (
                          <span className={`text-2xs font-semibold ${m.trend > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                            {m.trend > 0 ? '↑' : '↓'} {Math.abs(m.trend)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Station highlights */}
          {data.hottestStation && data.cleanestStation && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-danger-50 border border-danger-100">
                <div className="w-8 h-8 rounded-lg bg-danger-100 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-danger-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-2xs font-semibold text-danger-700 uppercase tracking-wide block">Most Polluted</span>
                  <span className="text-sm font-bold text-slate-800 truncate block">{data.hottestStation.stationName}</span>
                </div>
                <AQIBadge aqi={data.hottestStation.aqi} size="sm" showLabel={false} />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-success-50 border border-success-100">
                <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-success-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-2xs font-semibold text-success-700 uppercase tracking-wide block">Cleanest Station</span>
                  <span className="text-sm font-bold text-slate-800 truncate block">{data.cleanestStation.stationName}</span>
                </div>
                <AQIBadge aqi={data.cleanestStation.aqi} size="sm" showLabel={false} />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Monitoring {data.stationCount} stations across Delhi NCR</span>
            <span>Updated {new Date(data.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
