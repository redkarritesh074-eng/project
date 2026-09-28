import { Wind, Github, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-800 font-display">
                  Delhi NCR
                </span>
                <span className="block text-2xs text-slate-500">
                  Air-Weather Coupled Forecasting System
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              An advanced coupled atmospheric-chemistry forecasting platform integrating
              real-time meteorological data and air quality monitoring for the Delhi
              National Capital Region.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Overview</Link></li>
              <li><Link to="/map" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Live Map</Link></li>
              <li><Link to="/forecast" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">72h Forecast</Link></li>
              <li><Link to="/coupled" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Coupled Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Data Sources
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-slate-500">OpenWeatherMap API</li>
              <li className="text-sm text-slate-500">AQICN / WAQI Network</li>
              <li className="text-sm text-slate-500">CPCB Monitoring Stations</li>
              <li className="text-sm text-slate-500">IMD Meteorological Data</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-success-500" />
            <span>Data updated hourly · Fallback simulation mode available</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <span className="text-xs text-slate-400">© 2026 Delhi NCR Forecasting System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
