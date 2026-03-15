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
      </Route>
    </Routes>
  );
}

export default App;
