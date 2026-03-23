import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Activity, Crosshair, ArrowUp, ArrowDown, Zap, ShieldAlert, BarChart3, Radio } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoin } from '../context/CoinContext';

const LiquidationHeatmap = () => {
    const { selectedCoin: coinId } = useCoin();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const pollingRef = useRef(null);

    const fetchHeatmap = async (isInitial = false) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/crypto/liquidation/${coinId}`);
            const result = await response.json();
            setData(prev => {
                // If we have prev data, merge live events to keep a longer history if desired, 
                // but for now we'll just take the latest from backend
                return result;
            });
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Failed to fetch liquidation data", err);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchHeatmap(true);
        
        // Real-time Polling (5 seconds)
        pollingRef.current = setInterval(() => {
            fetchHeatmap();
        }, 5000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [coinId]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#030712]">
            <div className="relative">
                <Activity className="animate-spin text-yellow-500 w-12 h-12"/>
                <div className="absolute inset-0 blur-xl bg-yellow-500/20 animate-pulse"></div>
            </div>
        </div>
    );
    
    if (!data) return <div className="p-10 text-red-500">Error connecting to Predator API</div>;

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatIntensity = (val) => {
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        return formatCurrency(val);
    };
    
    // Gauge Data
    const gaugeData = [{ value: data.squeeze_probability }];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {/* Header section with live indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center space-x-5">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.4)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Radio className="w-8 h-8 text-black animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Liquidation <span className="text-yellow-400">Terrain</span></h1>
                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] animate-pulse ${data.data_source?.includes('CoinGlass') ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {data.data_source || 'Live Feed'}
                            </span>
                        </div>
                        <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px] mt-2 flex items-center">
                            Last Intel Sync: <span className="text-gray-300 ml-2">{lastUpdated.toLocaleTimeString()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-inner group transition-all hover:bg-white/10">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-yellow-400/70 transition-colors">Global Asset Index</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{formatCurrency(data.current_price)}</p>
                    </div>
                    <div className="h-10 w-[2px] bg-white/10 mx-2"></div>
                    <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:scale-110 transition-transform">
                         <BarChart3 className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Squeeze Alert Banner */}
            <AnimatePresence>
                {data.squeeze_probability > 75 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-600/20 border border-red-500/40 rounded-3xl p-6 flex items-center justify-between shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
                        <div className="flex items-center space-x-6 relative z-10">
                            <div className="p-3 bg-red-500 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                                <ShieldAlert className="w-7 h-7 text-white animate-bounce" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Nuclear Squeeze Imminent</h3>
                                <p className="text-red-200/80 text-sm font-bold tracking-wide mt-1">Extreme {data.imbalance_status} detected. Predictive modeling suggests a volatile breakout within the next 15-30 minutes.</p>
                            </div>
                        </div>
                        <div className="hidden lg:block relative z-10 bg-red-500 text-white font-black px-6 py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                            Execute Counter-Trade
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Squeeze Probability Gauge */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl pointer-events-none group-hover:bg-yellow-500/20 transition-all"></div>
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 w-full text-center relative z-10">Squeeze Probability</h3>
                    
                    <div className="h-[200px] w-full relative z-10 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={16} data={gaugeData} startAngle={180} endAngle={0}>
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar minAngle={15} background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise={false} dataKey="value" cornerRadius={10} fill={data.squeeze_probability > 70 ? '#EF4444' : '#EAB308'} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                            <span className={`text-5xl font-black tracking-tighter ${data.squeeze_probability > 70 ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white'}`}>
                                {data.squeeze_probability}%
                            </span>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">High Risk</span>
                        </div>
                    </div>
                </div>

                {/* Concentration Index */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between relative overflow-hidden group">
                     <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
                     <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Concentration Index</h3>
                        <div className="text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-md">{data.concentration_index}<span className="text-2xl text-cyan-400">σ</span></div>
                        <p className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest leading-relaxed">
                            {data.concentration_index > 70 ? "Unusually tight cluster detected near current price." : "Liquidity is widely dispersed across the orderbook."}
                        </p>
                     </div>
                     <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-500 uppercase">System Confidence</span>
                        <div className="flex space-x-1">
                            {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 w-4 rounded-full ${i <= 4 ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-white/10'}`}></div>)}
                        </div>
                     </div>
                </div>

                {/* Long Liquidations */}
                <div className="bg-gradient-to-br from-red-600/10 to-transparent backdrop-blur-2xl border border-red-500/20 rounded-[2.5rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 blur-[60px] pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                        Long Squeeze Exposure
                    </h3>
                    <div>
                        <div className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]">{formatIntensity(data.total_long_liquidation)}</div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aggregate Retail Overbuy</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
                         <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.2em]">Exit Liquidity Target</span>
                    </div>
                </div>

                {/* Short Liquidations */}
                <div className="bg-gradient-to-br from-emerald-600/10 to-transparent backdrop-blur-2xl border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-[60px] pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.3em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                        Short Cover Gravity
                    </h3>
                    <div>
                        <div className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">{formatIntensity(data.total_short_liquidation)}</div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Institutional Squeeze Fuel</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                         <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Momentum Magnet Zone</span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Heatmap Chart & Live Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tight text-white mb-3">Institutional Leverage Clusters</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Precise Liquidity Density at identified price nodes</p>
                        </div>
                        <div className="bg-black/60 px-6 py-4 rounded-2xl border border-white/5 flex items-center space-x-4 shadow-inner">
                            <Zap className="w-5 h-5 text-yellow-500 animate-pulse"/>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Market Bias</span>
                                <span className={`text-xs font-black uppercase ${data.imbalance_status.includes('Long') ? 'text-red-400' : 'text-emerald-400'}`}>{data.imbalance_status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[500px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.clusters} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis 
                                    dataKey="price" 
                                    stroke="transparent" 
                                    tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'black' }}
                                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="transparent" 
                                    tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'black' }}
                                    tickFormatter={(val) => formatIntensity(val).replace('$', '')}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{d.type}</p>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center gap-8">
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase">Price Node</span>
                                                            <span className="text-sm font-black text-white">{formatCurrency(d.price)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center gap-8">
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase">Liquidity</span>
                                                            <span className={`text-sm font-black ${d.type === 'Long Liquidation' ? 'text-red-400' : 'text-emerald-400'}`}>{formatIntensity(d.intensity)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center gap-8">
                                                            <span className="text-[11px] font-bold text-gray-400 uppercase">Distance</span>
                                                            <span className="text-sm font-black text-yellow-500">{d.distance_pct > 0 ? '+' : ''}{d.distance_pct}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine x={data.current_price} stroke="#EAB308" strokeWidth={2} strokeDasharray="8 4" label={{ position: 'top', value: 'SPOT PRICE', fill: '#EAB308', fontSize: 10, fontWeight: 'black', letterSpacing: '0.1em' }} />
                                <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                                    {data.clusters.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.type === 'Long Liquidation' ? '#EF4444' : '#10B981'} 
                                            fillOpacity={Math.abs(entry.distance_pct) < 5 ? 1 : 0.4}
                                            className="transition-all hover:fill-opacity-100 cursor-crosshair"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Liquidation Events Feed */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Live <span className="text-yellow-400">Activity</span></h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Streaming</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                        {data.live_events.map((event, idx) => (
                            <motion.div 
                                key={event.id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${event.type === 'Long' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {event.type} Liquidation
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-400">{event.time}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-black text-white tracking-tighter">{formatCurrency(event.amount)}</span>
                                    <span className="text-[10px] font-mono text-gray-500 font-bold">@ {formatCurrency(event.price)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                         <div className="p-4 bg-yellow-400/5 rounded-2xl border border-yellow-400/10">
                            <p className="text-[10px] text-gray-400 leading-relaxed font-bold italic">
                                "The highest cluster of liquidations acts as a gravity well. The AI detects institutional spoofing to lure retail into these hot zones."
                            </p>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/20 to-black/40 backdrop-blur-3xl border border-yellow-500/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-yellow-500/5 blur-[100px] pointer-events-none"></div>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="flex items-start space-x-8">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-[2rem] shadow-[0_0_40px_rgba(250,204,21,0.3)] shrink-0 group-hover:scale-110 transition-transform duration-700">
                             <Crosshair className="w-10 h-10 text-black animate-spin-slow" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-white mb-4 tracking-tighter italic uppercase">Market Maker <span className="text-yellow-400">Magnet</span></h4>
                            <p className="text-gray-400 leading-relaxed text-base font-medium max-w-2xl">
                                Institutional predatory algorithms (VisionX-P1) target these high-concentration zones to create slippage. Currently, a <span className="text-yellow-400 font-bold uppercase">{data.imbalance_status}</span> is active. Expect price to gravitate towards <span className="text-white font-black underline decoration-yellow-500/50">{formatCurrency(data.clusters[data.clusters.length - 1].price)}</span> if volume exceeds the volatility threshold.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 bg-black/60 px-10 py-8 rounded-[2rem] border border-white/10 shadow-inner group-hover:border-yellow-500/30 transition-colors shrink-0">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Alpha Signal Strength</span>
                        <div className="text-5xl font-black text-white italic tracking-tighter">{((100 - data.squeeze_probability) * 0.8).toFixed(1)}%</div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                             <div className="h-full bg-yellow-500" style={{ width: `${(100 - data.squeeze_probability) * 0.8}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidationHeatmap;
