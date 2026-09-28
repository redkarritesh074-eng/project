import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// THE FIX: Import the exact function that actually exists in your dataService!
import { getStationReadings } from '@/services/dataService'; 

// Safe icon patch to prevent Vite runtime crashes
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
} catch (e) {
  console.warn("Leaflet icon setup skipped", e);
}

const delhiCenter: [number, number] = [28.6139, 77.2090];

// Helper to color the circles based on real-time AQI
function getAqiColor(aqi: number) {
  if (aqi <= 50) return '#22c55e'; // Good (Green)
  if (aqi <= 100) return '#84cc16'; // Satisfactory (Lime)
  if (aqi <= 200) return '#eab308'; // Moderate (Yellow)
  if (aqi <= 300) return '#f97316'; // Poor (Orange)
  if (aqi <= 400) return '#ef4444'; // Very Poor (Red)
  return '#7f1d1d'; // Severe (Dark Red)
}

export function MapPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Safely fetch the live satellite data when the map loads
  useEffect(() => {
    let isMounted = true;
    async function loadLiveMapData() {
      try {
        const { data } = await getStationReadings();
        if (isMounted) {
          setStations(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Map data fetch failed", error);
        if (isMounted) setLoading(false);
      }
    }
    loadLiveMapData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24 md:pt-28 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Pollution Map</h1>
            <p className="text-slate-500 mt-1">Real-time OpenStreetMap telemetry — Delhi NCR</p>
          </div>
          
          {/* Custom Live Data Badge */}
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

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative">
          
          {/* Show a smooth loading screen while Open-Meteo fetches */}
          {loading ? (
            <div className="h-[600px] w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl">
               <div className="animate-pulse text-lg font-bold text-emerald-600 mb-2">Syncing Coordinates & Telemetry...</div>
               <p className="text-slate-500 text-sm">Plotting regional hotspots</p>
            </div>
          ) : (
            <div style={{ height: '600px', width: '100%', position: 'relative', zIndex: 0 }}>
              <MapContainer 
                center={delhiCenter} 
                zoom={10.5} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Dynamically map over the 12 live stations */}
                {stations.map((station) => {
                  const color = getAqiColor(station.aqi);
                  return (
                    <React.Fragment key={station.stationId}>
                      <Marker position={[station.lat, station.lng]}>
                        <Popup>
                          <strong className="text-slate-800 text-sm">{station.stationName}</strong><br/>
                          <span className="text-xs text-slate-500">
                            AQI: <strong style={{ color }}>{station.aqi}</strong> ({station.category})
                          </span>
                        </Popup>
                      </Marker>
                      <Circle 
                        center={[station.lat, station.lng]} 
                        pathOptions={{ color: color, fillColor: color, fillOpacity: 0.3, weight: 1 }} 
                        radius={3500}
                      />
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapPage;