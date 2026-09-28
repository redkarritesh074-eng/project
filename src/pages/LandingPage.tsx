import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Map as MapIcon, BarChart3, GitCompare,
  Wind, Thermometer, Eye, Layers, Activity, TrendingDown, AlertTriangle,
  CheckCircle2, Radio,
} from 'lucide-react';
import { HeroSmogVisualization } from '@/components/HeroSmogVisualization';
import { SummaryWidget } from '@/components/SummaryWidget';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/Animations';
import { LoadingSpinner } from '@/components/LoadingStates';
import { getDelhiSummary, getStationReadings, saveTelemetryToDB } from '@/services/dataService';

export function LandingPage() {
  const [summary, setSummary] = useState<any>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [summaryResult, stationResult] = await Promise.all([
          getDelhiSummary(),
          getStationReadings(),
        ]);
        if (cancelled) return;
        setSummary(summaryResult);
        setSource(summaryResult.source);
        // Persist to Supabase (non-blocking)
        saveTelemetryToDB(stationResult.data).catch(() => {});
      } catch (err) {
        if (!cancelled) console.error('Data load failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
        {/* Animated SVG background */}
        <HeroSmogVisualization />

        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-soft mb-6"
            >
              <Radio className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-xs font-semibold text-slate-700">Live Atmospheric Monitoring · CPCB Integrated</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-slate-800 leading-[1.1] tracking-tight"
            >
              Delhi NCR Air–Weather
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-500 bg-clip-text text-transparent">
                Coupled Forecasting
              </span>{' '}
              System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl"
            >
 An advanced atmospheric-chemistry model that couples real-time meteorology with air quality telemetry to forecast pollution episodes across Delhi NCR — tracking how temperature inversions, wind patterns, and boundary layer dynamics trap and transport pollutants.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MapIcon className="w-4 h-4" />
                Explore Live Map
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/forecast"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:-translate-y-0.5"
              >
                <BarChart3 className="w-4 h-4" />
                View 72h Forecast
              </Link>
              <Link
                to="/coupled"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:-translate-y-0.5"
              >
                <GitCompare className="w-4 h-4" />
                Coupled Analytics
              </Link>
            </motion.div>
          </div>

          {/* Summary widget */}
          {loading ? (
            <div className="mt-12 flex justify-center">
              <LoadingSpinner message="Fetching live air quality data..." />
            </div>
          ) : summary ? (
            <div className="mt-12">
              <SummaryWidget data={summary} source={source} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
              Platform Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-display text-slate-800">
              Four integrated forecasting modules
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              From real-time monitoring to predictive analytics, each module provides
              a different lens on Delhi's atmospheric chemistry.
            </p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapIcon,
                title: 'Interactive Pollution Map',
                desc: 'Live hotspots across 12+ NCR stations with PM2.5, PM10, O₃, and NOx layer toggles.',
                to: '/map',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: BarChart3,
                title: '72-Hour Forecast',
                desc: 'Hour-by-hour AQI predictions with confidence intervals and pollutant breakdowns.',
                to: '/forecast',
                color: 'from-accent-500 to-accent-600',
              },
              {
                icon: GitCompare,
                title: 'Coupled Feedback Model',
                desc: 'Visualizes how boundary layer height, inversions, and wind trap regional pollutants.',
                to: '/coupled',
                color: 'from-warning-500 to-warning-600',
              },
              {
                icon: Activity,
                title: 'Real-Time Telemetry',
                desc: 'Integrated with OpenWeatherMap and AQICN APIs, with fallback simulation mode.',
                to: '/map',
                color: 'from-danger-500 to-danger-600',
              },
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <Link to={feature.to} className="group block h-full">
                  <div className="h-full rounded-2xl bg-white border border-slate-200 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold font-display text-slate-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {feature.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold text-accent-600 uppercase tracking-widest">
                The Science
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-display text-slate-800">
                How meteorology drives pollution episodes
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Delhi's winter pollution crisis is not just about local emissions.
                During post-monsoon months, atmospheric temperature inversions and
                low Planetary Boundary Layer (PBL) heights create a lid over the city,
                trapping both local pollutants and transported emissions from regional
                stubble burning.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Thermometer, title: 'Temperature Inversion', desc: 'Warm air above cold surface air prevents vertical mixing.' },
                  { icon: Wind, title: 'Low Wind Speed', desc: 'Stagnant conditions allow pollutants to accumulate locally.' },
                  { icon: Layers, title: 'Low PBL Height', desc: 'Compressed mixing layer concentrates pollutants near ground.' },
                  { icon: Eye, title: 'Regional Transport', desc: 'NW winds carry stubble burning smoke from Punjab & Haryana.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Inversion diagram */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-elevated p-8 overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 mb-1">Atmospheric Inversion Profile</h4>
                <p className="text-xs text-slate-400 mb-6">How a temperature inversion traps pollutants</p>

                <svg viewBox="0 0 400 300" className="w-full">
                  <defs>
                    <linearGradient id="inversionSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dbeafe" />
                      <stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                    <linearGradient id="trapZone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* Sky layers */}
                  <rect x="0" y="0" width="400" height="180" fill="url(#inversionSky)" />
                  {/* Warm air layer (above inversion) */}
                  <rect x="0" y="0" width="400" height="100" fill="#fde68a" opacity="0.3" />
                  <text x="10" y="30" fontSize="11" fill="#92400e" fontWeight="bold">Warm Air Layer</text>
                  <text x="10" y="44" fontSize="9" fill="#92400e">T = 24°C · Rising</text>

                  {/* Inversion line */}
                  <motion.line
                    x1="0" y1="110" x2="400" y2="110"
                    stroke="#dc2626" strokeWidth="2" strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                  />
                  <text x="290" y="105" fontSize="10" fill="#dc2626" fontWeight="bold">Inversion Cap</text>

                  {/* Trapped pollution zone */}
                  <rect x="0" y="110" width="400" height="120" fill="url(#trapZone)" />
                  <text x="10" y="140" fontSize="11" fill="#7f1d1d" fontWeight="bold">Trapped Pollutants</text>
                  <text x="10" y="155" fontSize="9" fill="#7f1d1d">PM2.5, NOx, Stubble Smoke</text>

                  {/* Pollution particles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={30 + i * 32}
                      cy={160 + (i % 3) * 20}
                      r="3"
                      fill="#ef4444"
                      opacity="0.5"
                      animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 3 + i % 3, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}

                  {/* Ground */}
                  <rect x="0" y="230" width="400" height="70" fill="#94a3b8" opacity="0.3" />
                  <text x="10" y="250" fontSize="10" fill="#475569" fontWeight="bold">Surface (T = 12°C)</text>

                  {/* City silhouette */}
                  <g opacity="0.6">
                    <rect x="50" y="200" width="20" height="30" fill="#334155" rx="1" />
                    <rect x="80" y="185" width="25" height="45" fill="#334155" rx="1" />
                    <rect x="115" y="195" width="18" height="35" fill="#334155" rx="1" />
                    <rect x="150" y="180" width="30" height="50" fill="#334155" rx="2" />
                    <rect x="195" y="200" width="22" height="30" fill="#334155" rx="1" />
                    <rect x="235" y="190" width="28" height="40" fill="#334155" rx="2" />
                    <rect x="280" y="195" width="20" height="35" fill="#334155" rx="1" />
                    <rect x="315" y="185" width="25" height="45" fill="#334155" rx="1" />
                    <rect x="350" y="200" width="20" height="30" fill="#334155" rx="1" />
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '12+', label: 'Monitoring Stations' },
              { value: '72h', label: 'Forecast Horizon' },
              { value: '7', label: 'Pollutants Tracked' },
              { value: '24/7', label: 'Real-Time Updates' },
            ].map((stat, i) => (
              <StaggerItem key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-display text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-primary-100">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex w-14 h-14 rounded-2xl bg-primary-50 items-center justify-center mb-6">
              <AlertTriangle className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold font-display text-slate-800 mb-4">
              Stay ahead of pollution episodes
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8">
              Access real-time data, 72-hour forecasts, and coupled atmospheric analytics
              to understand and predict Delhi's air quality.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MapIcon className="w-4 h-4" />
                Launch Live Map
              </Link>
              <Link
                to="/coupled"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:-translate-y-0.5"
              >
                <GitCompare className="w-4 h-4" />
                View Coupled Model
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
