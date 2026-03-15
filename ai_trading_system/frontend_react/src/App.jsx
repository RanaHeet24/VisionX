import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RegimeDetection from './pages/RegimeDetection';
import ExplainableAI from './pages/ExplainableAI';
import LiquidationHeatmap from './pages/LiquidationHeatmap';
import CorrelationEngine from './pages/CorrelationEngine';
import DynamicStopLoss from './pages/DynamicStopLoss';
import SocialSentiment from './pages/SocialSentiment';
import WhaleTracker from './pages/WhaleTracker';
import SpoofingDetector from './pages/SpoofingDetector';
import DarkPoolTracker from './pages/DarkPoolTracker';
import SmartContractAudit from './pages/SmartContractAudit';

function App() {
  return (
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
  );
}

export default App;
