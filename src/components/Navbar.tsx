import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Map, BarChart3, GitCompare, CloudSun, Menu, X, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

// I added your new Station Details button right here at the bottom of this list!
const navItems = [
  { to: '/', label: 'Overview', icon: CloudSun },
  { to: '/map', label: 'Live Map', icon: Map },
  { to: '/forecast', label: '72h Forecast', icon: BarChart3 },
  { to: '/coupled', label: 'Coupled Analytics', icon: GitCompare },
  { to: '/stations', label: 'Station Details', icon: Activity },
];

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-200' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md"
              >
                <Wind className="w-5 h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="block text-sm font-bold text-slate-800 font-display leading-tight">
                  Delhi NCR
                </span>
                <span className="block text-2xs text-slate-500 font-medium leading-tight">
                  Air-Weather Forecast
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-primary-50 -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-50 border border-success-200 text-success-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                System Active
              </span>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-soft md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}