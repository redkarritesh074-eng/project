import { useEffect, useState, useMemo } from 'react';
import {
  ComposedChart, AreaChart, Area, Line, Bar, BarChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, LineChart, ScatterChart, Scatter, ZAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  GitCompare, Layers, Wind, Thermometer, Activity, TrendingDown,
  Flame, ArrowDownToLine, ArrowUpFromLine, Info, Zap,
} from 'lucide-react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/Animations';
import { LoadingSpinner, DataSourceBadge } from '@/components/LoadingStates';
import { getCoupledAnalytics } from '@/services/dataService';
import type { CoupledDataPoint } from '@/types';

export function CoupledPage() {
  const [data, setData] = useState<CoupledDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await getCoupledAnalytics();
        if (!cancelled) setData(result.data);
      } catch (err) {
        console.error('Coupled analytics load failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      shortTime: new Date(d.timestamp).toLocaleString('en-IN', { hour: '2-digit', hour12: true, day: 'numeric', month: 'short' }),
    }));
  }, [data]);

  // Key metrics
  const metrics = useMemo(() => {
    if (data.length === 0) return null;
    const observed = data.filter((d) => d.timestamp < Date.now());
    const avgInversion = Math.round((observed.reduce((s, d) => s + d.inversionStrength, 0) / observed.length) * 10) / 10;
    const maxInversion = Math.max(...observed.map((d) => d.inversionStrength));
    const avgVC = Math.round(observed.reduce((s, d) => s + d.ventilationCoefficient, 0) / observed.length);
    const minPBL = Math.min(...observed.map((d) => d.pblHeight));
    const avgStubble = Math.round(observed.reduce((s, d) => s + d.stubbleBurningContribution, 0) / observed.length);
    const peakPm25 = Math.max(...observed.map((d) => d.pm25));
    return { avgInversion, maxInversion, avgVC, minPBL, avgStubble, peakPm25 };
  }, [data]);

  // Correlation scatter data
  const scatterData = useMemo(() => {
    return data.map((d) => ({
      pbl: d.pblHeight,
      pm25: d.pm25,
      wind: d.windSpeed,
      inversion: d.inversionStrength,
    }));
  }, [data]);

  if (loading) {
    return (
      <PageTransition>
        <div className="pt-16 min-h-screen bg-slate-50">
          <div className="h-[70vh] flex items-center justify-center">
            <LoadingSpinner message="Computing coupled atmospheric-chemistry model..." />
          </div>
        </div>
      </PageTransition>
    );
  }

  const nowTime = chartData.find((d) => d.timestamp >= Date.now())?.shortTime;

  return (
    <PageTransition>
      <div className="pt-16 min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-800 flex items-center gap-3">
                  <GitCompare className="w-7 h-7 text-warning-600" />
                  Coupled Feedback Analytics
                </h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                  Proving the coupled model: visualizing how meteorological conditions
                  (temperature inversions, boundary layer, wind) drive chemical pollution episodes.
                </p>
              </div>
              <DataSourceBadge source="live" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Explanation banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">The Coupled Model Explained</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                When temperature inversions form (warm air above cold surface air), the Planetary Boundary Layer
                compresses, and wind speeds drop — creating a stagnant atmospheric "lid" over Delhi.
                This traps both local vehicular/industrial emissions AND transported pollutants from regional
                stubble burning, causing severe AQI spikes. The charts below demonstrate this coupling.
              </p>
            </div>
          </motion.div>

          {/* Key metrics */}
          {metrics && (
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Avg Inversion Strength', value: metrics.avgInversion, unit: 'K', icon: ArrowDownToLine, color: 'text-danger-600', bg: 'bg-danger-50', desc: 'Higher = stronger trapping' },
                { label: 'Peak Inversion', value: metrics.maxInversion, unit: 'K', icon: ArrowUpFromLine, color: 'text-danger-600', bg: 'bg-danger-50' },
                { label: 'Min PBL Height', value: metrics.minPBL, unit: 'm', icon: Layers, color: 'text-accent-600', bg: 'bg-accent-50', desc: 'Lower = more concentrated pollution' },
                { label: 'Avg Ventilation Coef.', value: metrics.avgVC, unit: 'm²/s', icon: Wind, color: 'text-primary-600', bg: 'bg-primary-50', desc: 'Low = poor dispersion' },
                { label: 'Stubble Burning PM2.5', value: metrics.avgStubble, unit: 'µg/m³', icon: Flame, color: 'text-warning-600', bg: 'bg-warning-50', desc: 'Regional transport contribution' },
                { label: 'Peak PM2.5', value: metrics.peakPm25, unit: 'µg/m³', icon: Activity, color: 'text-danger-600', bg: 'bg-danger-50' },
              ].map((m, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center`}>
                        <m.icon className={`w-4.5 h-4.5 ${m.color}`} />
                      </div>
                      <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">{m.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-display text-slate-800">{m.value}</span>
                      <span className="text-xs text-slate-400">{m.unit}</span>
                    </div>
                    {m.desc && <p className="text-2xs text-slate-400 mt-1">{m.desc}</p>}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Main coupled chart — PBL vs PM2.5 with inversion overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold font-display text-slate-800">
                PBL Height vs PM2.5 — The Inversion Trap
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              When PBL drops (blue area), PM2.5 rises (red line) — the inverse coupling that drives pollution episodes
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pblCoupledGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} angle={-30} textAnchor="end" height={50} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'PBL Height (m)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#14b8a6' } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'PM2.5 (µg/m³)', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#ef4444' } }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {nowTime && (
                  <ReferenceLine x={nowTime} stroke="#64748b" strokeDasharray="6 4" label={{ value: 'Now', fontSize: 10, fill: '#475569', position: 'top' }} />
                )}
                <Area yAxisId="left" type="monotone" dataKey="pblHeight" stroke="#14b8a6" strokeWidth={2} fill="url(#pblCoupledGrad)" name="PBL Height (m)" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={2.5} dot={false} name="PM2.5 (µg/m³)" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Inversion strength & ventilation coefficient */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownToLine className="w-5 h-5 text-danger-600" />
                <h3 className="text-lg font-bold font-display text-slate-800">Inversion Strength</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Temperature difference between surface and aloft — drives pollutant trapping</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={4} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'K', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <ReferenceLine y={50} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 9, fill: '#d97706' }} />
                  <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Strong', fontSize: 9, fill: '#dc2626' }} />
                  {nowTime && <ReferenceLine x={nowTime} stroke="#64748b" strokeDasharray="6 4" />}
                  <Area type="monotone" dataKey="inversionStrength" stroke="#ef4444" strokeWidth={2.5} fill="url(#invGrad)" name="Inversion (K)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-bold font-display text-slate-800">Ventilation Coefficient</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Wind × PBL height — measures atmosphere's ability to disperse pollutants</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={4} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'm²/s', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <ReferenceLine y={2000} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Stagnant', fontSize: 9, fill: '#dc2626' }} />
                  <ReferenceLine y={6000} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Good', fontSize: 9, fill: '#16a34a' }} />
                  {nowTime && <ReferenceLine x={nowTime} stroke="#64748b" strokeDasharray="6 4" />}
                  <Bar dataKey="ventilationCoefficient" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Ventilation Coef." />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Source apportionment — stubble burning vs local emissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
          >
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-warning-600" />
              <h3 className="text-lg font-bold font-display text-slate-800">
                Source Apportionment — Local vs Regional Transport
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              PM2.5 split between Delhi's local emissions and transported stubble burning smoke from NW states
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#64748b' } }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {nowTime && <ReferenceLine x={nowTime} stroke="#64748b" strokeDasharray="6 4" label={{ value: 'Now', fontSize: 10, fill: '#475569', position: 'top' }} />}
                <Bar dataKey="localEmissionContribution" stackId="a" fill="#3b82f6" name="Local Emissions (PM2.5)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="stubbleBurningContribution" stackId="a" fill="#f59e0b" name="Stubble Burning (PM2.5)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="windSpeed" stroke="#14b8a6" strokeWidth={2} dot={false} name="Wind Speed (m/s)" yAxisId={0} />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Correlation scatter — PBL vs PM2.5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold font-display text-slate-800">
                Correlation: PBL Height vs PM2.5 Concentration
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Each point is one hour. The inverse relationship proves the coupling mechanism.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="pbl"
                  name="PBL Height"
                  unit="m"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'PBL Height (m)', position: 'bottom', offset: 5, style: { fontSize: 11, fill: '#64748b' } }}
                />
                <YAxis
                  type="number"
                  dataKey="pm25"
                  name="PM2.5"
                  unit="µg/m³"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'PM2.5 (µg/m³)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                />
                <ZAxis type="number" dataKey="wind" range={[40, 200]} name="Wind Speed" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: any, name: string) => [`${value} ${name.includes('PBL') ? 'm' : name.includes('Wind') ? 'm/s' : 'µg/m³'}`, name]}
                />
                <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Low PBL (left) → High PM2.5 (top) · High PBL (right) → Low PM2.5 (bottom) — the coupled signature
            </p>
          </motion.div>

          {/* Temperature & wind overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card"
          >
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-5 h-5 text-warning-600" />
              <h3 className="text-lg font-bold font-display text-slate-800">
                Meteorological Drivers — Temperature & Wind
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Temperature drops at night strengthen inversions; low wind speeds prevent pollutant dispersion
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="shortTime" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} angle={-30} textAnchor="end" height={50} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#f59e0b' } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'm/s', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#14b8a6' } }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {nowTime && <ReferenceLine x={nowTime} stroke="#64748b" strokeDasharray="6 4" />}
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Temperature (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="windSpeed" stroke="#14b8a6" strokeWidth={2.5} dot={false} name="Wind Speed (m/s)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
