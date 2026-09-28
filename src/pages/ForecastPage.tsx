import { useEffect, useState, useMemo } from 'react';
import {
  ComposedChart, AreaChart, Area, Line, Bar, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, LineChart,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  BarChart3, Clock, TrendingDown, TrendingUp, Wind, Thermometer,
  Droplets, Activity, Zap, Gauge, Eye, Layers,
} from 'lucide-react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/Animations';
import { LoadingSpinner, DataSourceBadge } from '@/components/LoadingStates';
import { AQIBadge } from '@/components/AQIBadge';
import { get72HourForecast } from '@/services/dataService';
import { getAQICategory, getAQIColor, POLLUTANT_LABELS, POLLUTANT_COLORS } from '@/types';
import type { ForecastHour } from '@/types';

const DAY_LABELS = ['Today', 'Tomorrow', 'Day 3'];

export function ForecastPage() {
  const [forecast, setForecast] = useState<ForecastHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'72h' | '24h' | '48h'>('72h');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await get72HourForecast();
        if (!cancelled) setForecast(result.data);
      } catch (err) {
        console.error('Forecast load failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const visibleData = useMemo(() => {
    const hours = view === '24h' ? 24 : view === '48h' ? 48 : 72;
    return forecast.slice(0, hours);
  }, [forecast, view]);

  // Day boundaries for chart reference lines
  const dayBoundaries = useMemo(() => {
    if (forecast.length === 0) return [];
    const boundaries: { x: string; label: string }[] = [];
    let lastDay = new Date(forecast[0]?.timestamp).getDate();
    forecast.forEach((h) => {
      const day = new Date(h.timestamp).getDate();
      if (day !== lastDay) {
        boundaries.push({ x: h.time, label: DAY_LABELS[Math.min(boundaries.length + 1, 2)] });
        lastDay = day;
      }
    });
    return boundaries;
  }, [forecast]);

  // Summary stats
  const stats = useMemo(() => {
    if (visibleData.length === 0) return null;
    const avgAqi = Math.round(visibleData.reduce((s, h) => s + h.aqi, 0) / visibleData.length);
    const maxAqi = Math.max(...visibleData.map((h) => h.aqi));
    const minAqi = Math.min(...visibleData.map((h) => h.aqi));
    const peakHour = visibleData.find((h) => h.aqi === maxAqi);
    const avgWind = Math.round((visibleData.reduce((s, h) => s + h.windSpeed, 0) / visibleData.length) * 10) / 10;
    const avgConfidence = Math.round(visibleData.reduce((s, h) => s + h.confidence, 0) / visibleData.length * 10) / 10;
    return { avgAqi, maxAqi, minAqi, peakHour, avgWind, avgConfidence };
  }, [visibleData]);

  // Daily summaries
  const dailySummaries = useMemo(() => {
    if (forecast.length === 0) return [];
    const days: { day: string; avg: number; max: number; min: number; label: string }[] = [];
    [0, 24, 48].forEach((start, i) => {
      const dayData = forecast.slice(start, start + 24);
      if (dayData.length === 0) return;
      days.push({
        day: DAY_LABELS[i],
        label: new Date(dayData[0].timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        avg: Math.round(dayData.reduce((s, h) => s + h.aqi, 0) / dayData.length),
        max: Math.max(...dayData.map((h) => h.aqi)),
        min: Math.min(...dayData.map((h) => h.aqi)),
      });
    });
    return days;
  }, [forecast]);

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-16 min-h-screen bg-slate-50">
          <div className="h-[70vh] flex items-center justify-center">
            <LoadingSpinner message="Generating 72-hour forecast..." />
          </div>
        </div>
      </PageTransition>
    );
  }

  const chartData = visibleData.map((h) => ({
    ...h,
    shortTime: new Date(h.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: 'numeric', month: 'short' }),
  }));

  return (
    <PageTransition>
      <div className="pt-16 min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-800 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-accent-600" />
                  72-Hour Forecast Dashboard
                </h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                  Coupled atmospheric-chemistry model predicting AQI and pollutant concentrations
                  for the next 3 days with confidence intervals.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DataSourceBadge source="live" />
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                  {(['24h', '48h', '72h'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        view === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Stats cards */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats && [
              { label: 'Average AQI', value: stats.avgAqi, icon: Gauge, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Peak AQI', value: stats.maxAqi, icon: TrendingUp, color: 'text-danger-600', bg: 'bg-danger-50', sub: stats.peakHour ? new Date(stats.peakHour.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, day: 'numeric', month: 'short' }) : '' },
              { label: 'Min AQI', value: stats.minAqi, icon: TrendingDown, color: 'text-success-600', bg: 'bg-success-50' },
              { label: 'Avg Wind', value: `${stats.avgWind} m/s`, icon: Wind, color: 'text-accent-600', bg: 'bg-accent-50' },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                    </div>
                    <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-800">{stat.value}</div>
                  {stat.sub && <div className="text-2xs text-slate-400 mt-1">{stat.sub}</div>}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Daily summary cards */}
          {dailySummaries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailySummaries.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm font-bold text-slate-800 font-display">{day.day}</span>
                      <p className="text-2xs text-slate-400">{day.label}</p>
                    </div>
                    <AQIBadge aqi={day.avg} size="md" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <div className="text-2xs text-slate-400 font-semibold uppercase">Min</div>
                      <div className="text-sm font-bold text-success-600">{day.min}</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <div className="text-2xs text-slate-400 font-semibold uppercase">Avg</div>
                      <div className="text-sm font-bold text-slate-800">{day.avg}</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <div className="text-2xs text-slate-400 font-semibold uppercase">Max</div>
                      <div className="text-sm font-bold text-danger-600">{day.max}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Main AQI forecast chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-800">AQI Forecast — {view}</h3>
                <p className="text-xs text-slate-400">Predicted Air Quality Index with confidence band</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="shortTime"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  interval={view === '72h' ? 5 : 2}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'AQI', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  labelStyle={{ fontWeight: 600, color: '#1e293b' }}
                />
                {dayBoundaries.map((b, i) => (
                  <ReferenceLine
                    key={i}
                    x={b.x}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    label={{ value: b.label, position: 'top', fontSize: 10, fill: '#64748b' }}
                  />
                ))}
                <ReferenceLine y={200} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 9, fill: '#d97706', position: 'right' }} />
                <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Poor', fontSize: 9, fill: '#dc2626', position: 'right' }} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#aqiGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pollutant breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <h3 className="text-lg font-bold font-display text-slate-800 mb-1">Pollutant Concentrations</h3>
              <p className="text-xs text-slate-400 mb-4">PM2.5, PM10, O₃, and NOx over forecast period</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={view === '72h' ? 7 : 3} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="pm25" stroke={POLLUTANT_COLORS.pm25} strokeWidth={2} dot={false} name="PM2.5" />
                  <Line type="monotone" dataKey="pm10" stroke={POLLUTANT_COLORS.pm10} strokeWidth={2} dot={false} name="PM10" />
                  <Line type="monotone" dataKey="o3" stroke={POLLUTANT_COLORS.o3} strokeWidth={2} dot={false} name="O₃" />
                  <Line type="monotone" dataKey="nox" stroke={POLLUTANT_COLORS.nox} strokeWidth={2} dot={false} name="NOx" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <h3 className="text-lg font-bold font-display text-slate-800 mb-1">Meteorological Conditions</h3>
              <p className="text-xs text-slate-400 mb-4">Temperature and wind speed driving the forecast</p>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={view === '72h' ? 7 : 3} angle={-30} textAnchor="end" height={50} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'm/s', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fill="#fef3c7" name="Temperature (°C)" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="windSpeed" stroke="#14b8a6" strokeWidth={2} dot={false} name="Wind Speed (m/s)" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* PBL Height & Confidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-bold font-display text-slate-800">Planetary Boundary Layer Height</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Low PBL traps pollutants near the surface</p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pblGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={view === '72h' ? 7 : 3} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'm', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="pblHeight" stroke="#14b8a6" strokeWidth={2.5} fill="url(#pblGrad)" name="PBL Height" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold font-display text-slate-800">Model Confidence</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Forecast reliability decreases over time</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={view === '72h' ? 7 : 3} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Bar dataKey="confidence" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Confidence %" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


