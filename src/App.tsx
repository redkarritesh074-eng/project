import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { MapPage } from '@/pages/MapPage';
import { ForecastPage } from '@/pages/ForecastPage';
import { CoupledPage } from '@/pages/CoupledPage';
import { StationsPage } from './pages/StationsPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/coupled" element={<CoupledPage />} />
          <Route path="*" element={<LandingPage />} />
          <Route path="/stations" element={<StationsPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
