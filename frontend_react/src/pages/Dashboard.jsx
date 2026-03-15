import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, Layers, ActivitySquare, AlertTriangle } from 'lucide-react';
import { cryptoApi } from '../services/api';
import MetricCard from '../components/MetricCard';
import PriceChart from '../components/PriceChart';

function Dashboard() {
  const [topCoins, setTopCoins] = useState({});
  const [selectedCoin, setSelectedCoin] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const coins = await cryptoApi.getTopCoins();
        setTopCoins(coins);
        
        // Select first coin by default (usually BTC)
        const firstCoinId = Object.keys(coins)[0];
        if (firstCoinId) {
          setSelectedCoin(firstCoinId);
          await fetchCoinData(firstCoinId);
        }

        // Fetch global metrics
        const global = await cryptoApi.getGlobalMetrics();
        setGlobalMetrics(global);
        
        setError(null);
      } catch (err) {
        setError('Failed to initialize platform data. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!selectedCoin) return;
    
    const interval = setInterval(() => {
      fetchCoinData(selectedCoin);
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedCoin]);

  const fetchCoinData = async (coinId) => {
    try {
      const [live, pred] = await Promise.all([
        cryptoApi.getLiveData(coinId),
        cryptoApi.getPrediction(coinId)
      ]);
      setLiveData(live);
      setPredictionData(pred);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCoinChange = async (e) => {
    const coinId = e.target.value;
    setSelectedCoin(coinId);
    setLoading(true);
    await fetchCoinData(coinId);
    setLoading(false);
  };

  if (loading && !selectedCoin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-400">Warming up AI Engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-xl max-w-md text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Multi-Crypto <span className="text-blue-500">AI Signal Engine</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>Online Learning Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Controls */}
        <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-400 mb-1">Select Asset (Auto-retrains Model)</label>
            <select 
              value={selectedCoin}
              onChange={handleCoinChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {Object.entries(topCoins).map(([id, symbol]) => (
                <option key={id} value={id}>{symbol} ({id})</option>
              ))}
            </select>
          </div>
          {loading && selectedCoin && (
            <div className="flex items-center space-x-2 text-blue-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Recalculating weights...</span>
            </div>
          )}
        </div>

        {/* Dashboards */}
        {liveData && predictionData && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                {liveData.symbol} Dashboard
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Current Price" 
                value={`$${liveData.current_price.toLocaleString()}`}
                subtext={`${liveData.price_change_24h > 0 ? '+' : ''}${liveData.price_change_24h.toFixed(2)}%`}
                subtextColor={liveData.price_change_24h > 0 ? 'text-green-500' : 'text-red-500'}
              />
              <MetricCard 
                title="Market Cap" 
                value={`$${(liveData.market_cap / 1e9).toFixed(2)}B`} 
              />
              <MetricCard 
                title="Model Accuracy" 
                value={`${(predictionData.accuracy * 100).toFixed(2)}%`} 
                subtext={`${predictionData.total_samples} samples`}
                subtextColor="text-gray-500"
              />
              <div className={`rounded-xl p-6 shadow-lg border ${predictionData.prediction === 'BUY' ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                <h3 className="text-gray-400 text-sm font-medium mb-2">AI Signal</h3>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-2xl font-bold ${predictionData.prediction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {predictionData.prediction}
                  </span>
                  <span className="text-sm font-medium text-gray-300">
                    {(predictionData.confidence * 100).toFixed(1)}% Conf
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="mt-8">
              <PriceChart data={predictionData.chart_data} />
            </div>

            {/* Feature Details */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Latest Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(predictionData.features).map(([key, val]) => (
                  <div key={key} className="bg-gray-700/50 rounded-lg p-3">
                    <span className="text-xs text-gray-400 block">{key}</span>
                    <span className="text-sm font-mono text-white">{typeof val === 'number' ? val.toFixed(4) : val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Analytics */}
        {globalMetrics && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Global Crypto Analytics</span>
            </h2>

            {/* Correlation Matrix */}
            {globalMetrics.correlation && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Correlation Matrix</h3>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-400"></th>
                      {Object.keys(globalMetrics.correlation).map(sym => (
                        <th key={sym} className="px-3 py-2 text-center text-gray-300 font-medium">{sym}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(globalMetrics.correlation).map(([rowSym, cols]) => (
                      <tr key={rowSym} className="border-t border-gray-700">
                        <td className="px-3 py-2 font-medium text-gray-300">{rowSym}</td>
                        {Object.entries(cols).map(([colSym, val]) => {
                          const intensity = Math.abs(val);
                          const bg = val > 0.7 ? 'bg-green-900/40' : val > 0.3 ? 'bg-green-900/20' : val < -0.3 ? 'bg-red-900/20' : '';
                          return (
                            <td key={colSym} className={`px-3 py-2 text-center font-mono text-xs ${bg}`}>
                              {val.toFixed(3)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Volatility Ranking */}
            {globalMetrics.volatility && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Volatility Ranking</h3>
                <div className="space-y-3">
                  {Object.entries(globalMetrics.volatility)
                    .sort(([,a], [,b]) => b - a)
                    .map(([sym, vol]) => {
                      const maxVol = Math.max(...Object.values(globalMetrics.volatility));
                      const pct = maxVol > 0 ? (vol / maxVol) * 100 : 0;
                      return (
                        <div key={sym} className="flex items-center space-x-3">
                          <span className="w-16 text-sm font-medium text-gray-300">{sym}</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-24 text-right text-xs font-mono text-gray-400">${vol.toFixed(2)}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Multi-Crypto AI Signal Engine &mdash; Online Learning &bull; Auto-refresh every 30s</p>
      </footer>
    </div>
  );
}

export default Dashboard;
