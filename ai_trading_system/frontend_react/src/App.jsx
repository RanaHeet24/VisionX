import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { RefreshCw } from 'lucide-react';
import { CoinProvider } from './context/CoinContext';

// Lazy-loaded pages for code splitting - only loads JS when navigated to
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RegimeDetection = lazy(() => import('./pages/RegimeDetection'));
const ExplainableAI = lazy(() => import('./pages/ExplainableAI'));
const LiquidationHeatmap = lazy(() => import('./pages/LiquidationHeatmap'));
const CorrelationEngine = lazy(() => import('./pages/CorrelationEngine'));
const DynamicStopLoss = lazy(() => import('./pages/DynamicStopLoss'));
const SocialSentiment = lazy(() => import('./pages/SocialSentiment'));
const WhaleTracker = lazy(() => import('./pages/WhaleTracker'));
const SpoofingDetector = lazy(() => import('./pages/SpoofingDetector'));
const DarkPoolTracker = lazy(() => import('./pages/DarkPoolTracker'));
const SmartContractAudit = lazy(() => import('./pages/SmartContractAudit'));

// Minimal fallback spinner for lazy-loaded route chunks
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <RefreshCw className="h-8 w-8 text-yellow-500/50 animate-spin" />
  </div>
);


function App() {
  return (
    <CoinProvider>
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/regime" element={<RegimeDetection />} />
          <Route path="/explain" element={<ExplainableAI />} />
          <Route path="/liquidation" element={<LiquidationHeatmap />} />
          <Route path="/leadlag" element={<CorrelationEngine />} />
          <Route path="/stoploss" element={<DynamicStopLoss />} />
          <Route path="/sentiment" element={<SocialSentiment />} />
          
          {/* Institutional Features */}
          <Route path="/whales" element={<WhaleTracker />} />
          <Route path="/spoofing" element={<SpoofingDetector />} />
          <Route path="/darkpool" element={<DarkPoolTracker />} />
          <Route path="/audit" element={<SmartContractAudit />} />
        </Route>
      </Routes>
      </Suspense>
    </CoinProvider>
  );
}

export default App;

