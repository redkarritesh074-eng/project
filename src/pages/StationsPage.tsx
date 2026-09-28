import React, { useEffect, useState } from 'react';
import { MapPin, Wind, Thermometer, Droplets, Activity, CloudFog } from 'lucide-react';
import { getStationReadings } from '@/services/dataService';

// Helper for dynamic Tailwind classes based on AQI severity
function getAqiStyles(aqi: number) {
  if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' };
  if (aqi <= 100) return { bg: 'bg-lime-500', text: 'text-lime-700', light: 'bg-lime-50', border: 'border-lime-200' };
  if (aqi <= 200) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-200' };
  if (aqi <= 300) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' };
  if (aqi <= 400) return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' };
  return { bg: 'bg-rose-900', text: 'text-rose-900', light: 'bg-rose-50', border: 'border-rose-200' };
}

export function StationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const { data } = await getStationReadings();
        if (isMounted) {
          setStations(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load station details", error);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 pt-24 md:pt-28 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="text-blue-600" /> Regional Node Details
            </h1>
            <p className="text-slate-500 mt-1">Live telemetry breakdown for all 12 monitoring stations</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE SATELLITE FEED
             </span>
          </div>
        </header>

        {loading ? (
          <div className="h-[500px] flex flex-col items-center justify-center">
             <div className="animate-pulse text-lg font-bold text-emerald-600 mb-2">Syncing with Regional Nodes...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stations.map((st) => {
              const styles = getAqiStyles(st.aqi);
              
              return (
                <div key={st.stationId} className={`bg-white rounded-2xl shadow-sm border ${styles.border} overflow-hidden hover:shadow-md transition-shadow`}>
                  
                  {/* Card Header */}
                  <div className={`${styles.light} p-5 border-b ${styles.border} flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className={styles.text} />
                      <h2 className={`font-bold text-lg ${styles.text}`}>{st.stationName}</h2>
                    </div>
                  </div>

                  {/* AQI Display */}
                  <div className="p-5 flex justify-between items-center border-b border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current AQI</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-800">{st.aqi}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full text-white ${styles.bg}`}>
                          {st.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pollutants Grid */}
                  <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-100">
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><CloudFog size={12}/> PM2.5</div>
                       <div className="text-lg font-bold text-slate-700">{st.pollutants.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                     </div>
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><CloudFog size={12}/> PM10</div>
                       <div className="text-lg font-bold text-slate-700">{st.pollutants.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                     </div>
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Activity size={12}/> Ozone</div>
                       <div className="text-lg font-bold text-slate-700">{st.pollutants.o3} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                     </div>
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Activity size={12}/> NO₂</div>
                       <div className="text-lg font-bold text-slate-700">{st.pollutants.nox} <span className="text-xs font-normal text-slate-400">µg/m³</span></div>
                     </div>
                  </div>

                  {/* Weather Footer */}
                  <div className="p-4 bg-slate-50 flex justify-between items-center text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium"><Thermometer size={16} className="text-amber-500"/> {st.weather.temp}°C</div>
                    <div className="flex items-center gap-1.5 font-medium"><Wind size={16} className="text-blue-500"/> {st.weather.windSpeed} km/h</div>
                    <div className="flex items-center gap-1.5 font-medium"><Droplets size={16} className="text-cyan-500"/> {st.weather.humidity}%</div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StationsPage;