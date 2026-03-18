import React, { useState, useEffect, lazy, Suspense } from 'react';
import { RefreshCw, Activity, Layers, ActivitySquare, AlertTriangle } from 'lucide-react';
import { cryptoApi } from '../services/api';
import MetricCard from '../components/MetricCard';
import PriceChart from '../components/PriceChart';

// Skeleton loader for perceived performance
const SkeletonCard = () => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-pulse">
    <div className="h-3 w-24 bg-white/10 rounded mb-3"></div>
    <div className="h-8 w-32 bg-white/5 rounded mb-2"></div>
    <div className="h-4 w-16 bg-white/5 rounded"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-pulse">
    <div className="h-4 w-40 bg-white/10 rounded mb-6"></div>
    <div className="h-[400px] bg-white/5 rounded-xl flex items-center justify-center">
      <RefreshCw className="h-8 w-8 text-yellow-500/30 animate-spin" />
    </div>
  </div>
);

function Dashboard() {
  const [topCoins, setTopCoins] = useState({});
  const [selectedCoin, setSelectedCoin] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [coinDataLoading, setCoinDataLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        
        // Step 1: Start fetching top coins + global metrics IN PARALLEL
        const coinsPromise = cryptoApi.getTopCoins();
        const globalPromise = cryptoApi.getGlobalMetrics()
          .then(global => { setGlobalMetrics(global); setGlobalLoading(false); })
          .catch(err => { console.error('Global metrics error:', err); setGlobalLoading(false); });

        // Wait for coins first so we can start coin-specific data
        const coins = await coinsPromise;
        setTopCoins(coins);
        
        const firstCoinId = Object.keys(coins)[0];
        if (firstCoinId) {
          setSelectedCoin(firstCoinId);
          
          // Fire warmup POST (fire-and-forget) + fetch coin data in parallel
          cryptoApi.warmupModel(firstCoinId).catch(() => {});
          
          fetchCoinData(firstCoinId).then(() => setCoinDataLoading(false));
        }

        // Wait for global to finish too
        await globalPromise;
        
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
    setCoinDataLoading(true);
    await fetchCoinData(coinId);
    setCoinDataLoading(false);
  };

  if (loading && !selectedCoin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Skeleton Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              <Activity className="h-7 w-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">VISION<span className="text-yellow-400">X</span> MAINFRAME</h1>
              <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Initializing War Room...</p>
            </div>
          </div>
        </header>
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-900/30 backdrop-blur-md border border-red-500/50 text-red-200 p-8 rounded-2xl max-w-md text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="h-14 w-14 mx-auto mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight mb-2">CRITICAL FAULT</h2>
          <p className="text-red-300 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <Activity className="h-7 w-7 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">VISION<span className="text-yellow-400">X</span> MAINFRAME</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Institutional Multi-Asset Signal Engine</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <select 
              value={selectedCoin}
              onChange={handleCoinChange}
              className="block w-full pl-4 pr-10 py-3 text-sm font-bold border-white/10 bg-black/40 backdrop-blur-md text-white border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-xl uppercase tracking-widest appearance-none shadow-inner"
            >
              {Object.entries(topCoins).map(([id, symbol]) => (
                <option key={id} value={id} className="bg-gray-900">{symbol} ({id})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 text-xs text-yellow-500 bg-yellow-500/10 px-4 py-3 rounded-xl border border-yellow-500/20 backdrop-blur-md whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-bold tracking-widest uppercase">SGD Active</span>
          </div>
        </div>
      </header>

      {/* Main Dashboards */}
      {liveData && predictionData && !loading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Dark glass card styling for metrics */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Price</h3>
              <div className="text-3xl font-black text-white mb-2">${liveData.current_price.toLocaleString()}</div>
              <div className={`text-sm font-bold ${liveData.price_change_24h > 0 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`}>
                {liveData.price_change_24h > 0 ? '+' : ''}{liveData.price_change_24h.toFixed(2)}%
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Market Cap</h3>
              <div className="text-3xl font-black text-white mb-2">${(liveData.market_cap / 1e9).toFixed(2)}B</div>
              <div className="text-sm font-bold text-gray-500">Global Liquidity</div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Model Accuracy</h3>
              <div className="text-3xl font-black text-white mb-2 flex items-baseline gap-2">
                <span>{(predictionData.accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="text-sm font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{predictionData.total_samples} Epochs</div>
            </div>

            <div className={`rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl border relative overflow-hidden ${predictionData.prediction === 'BUY' ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
              <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-40 ${predictionData.prediction === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1 relative z-10">AI Execution Signal</h3>
              <div className="flex items-baseline space-x-3 mt-2 relative z-10">
                <span className={`text-4xl font-black tracking-tighter ${predictionData.prediction === 'BUY' ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]'}`}>
                  {predictionData.prediction}
                </span>
                <span className="text-sm font-bold text-gray-300">
                  {(predictionData.confidence * 100).toFixed(1)}% CONF
                </span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <h3 className="text-gray-300 text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <ActivitySquare className="w-5 h-5 text-yellow-500" />
              Real-time Trajectory
            </h3>
            <div className="h-[400px]">
              <PriceChart data={predictionData.chart_data} />
            </div>
          </div>

          {/* Feature Details */}
          <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-gray-300 text-sm font-black uppercase tracking-widest mb-6">Neural Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(predictionData.features).map(([key, val]) => (
                <div key={key} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 truncate" title={key}>{key.replace(/_/g, ' ')}</span>
                  <span className="text-lg font-black text-white">{typeof val === 'number' ? val.toFixed(4) : val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Analytics */}
      {globalMetrics && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-black flex items-center space-x-3">
            <Layers className="h-6 w-6 text-yellow-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-md tracking-tight">GLOBAL ECONOMY METRICS</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Volatility Ranking */}
            {globalMetrics.volatility && (
              <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] lg:col-span-1">
                <h3 className="text-gray-300 text-sm font-black uppercase tracking-widest mb-6">Volatility Index</h3>
                <div className="space-y-4">
                  {Object.entries(globalMetrics.volatility)
                    .sort(([,a], [,b]) => b - a)
                    .map(([sym, vol]) => {
                      const maxVol = Math.max(...Object.values(globalMetrics.volatility));
                      const pct = maxVol > 0 ? (vol / maxVol) * 100 : 0;
                      return (
                        <div key={sym} className="flex items-center space-x-4">
                          <span className="w-12 text-sm font-black text-white">{sym}</span>
                          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-20 text-right text-xs font-bold text-gray-400">${vol.toFixed(2)}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Correlation Matrix */}
            {globalMetrics.correlation && (
              <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] lg:col-span-2 overflow-x-auto custom-scrollbar">
                <h3 className="text-gray-300 text-sm font-black uppercase tracking-widest mb-6">Correlation Matrix</h3>
                <table className="min-w-full text-sm border-separate border-spacing-1">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-gray-500 font-bold uppercase tracking-widest text-[10px]"></th>
                      {Object.keys(globalMetrics.correlation).map(sym => (
                        <th key={sym} className="p-2 text-center text-gray-400 font-black tracking-widest">{sym}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(globalMetrics.correlation).map(([rowSym, cols]) => (
                      <tr key={rowSym}>
                        <td className="p-2 font-black text-white tracking-widest">{rowSym}</td>
                        {Object.entries(cols).map(([colSym, val]) => {
                          let bg = 'bg-white/5';
                          let text = 'text-gray-400';
                          if (val > 0.7) { bg = 'bg-green-500/20 border-green-500/30'; text = 'text-green-400 font-black'; }
                          else if (val > 0.3) { bg = 'bg-green-500/10 border-green-500/20'; text = 'text-green-300'; }
                          else if (val < -0.3) { bg = 'bg-red-500/10 border-red-500/20'; text = 'text-red-300'; }
                          
                          return (
                            <td key={colSym} className={`p-3 text-center rounded-lg border border-transparent ${bg} ${text} transition-colors hover:border-white/20`}>
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
        <p>VISIONX MAINFRAME &mdash; ONLINE LEARNING &bull; AUTO-REFRESH 30S</p>
      </footer>
    </div>
  );
}

export default Dashboard;
