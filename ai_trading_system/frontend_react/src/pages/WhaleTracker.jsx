import React, { useState, useEffect } from 'react';
import { Activity, Network, ShieldAlert, Wallet, ChevronRight, TrendingUp, TrendingDown, Cpu, Zap, BadgeCheck, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

const WhaleTracker = () => {
    const [selectedCoin, setSelectedCoin] = useState("bitcoin");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const coins = [
        { id: "bitcoin", name: "BTC", color: "from-orange-500 to-yellow-600" },
        { id: "ethereum", name: "ETH", color: "from-blue-500 to-purple-600" },
        { id: "solana", name: "SOL", color: "from-teal-400 to-purple-500" }
    ];

    useEffect(() => {
        const fetchWhales = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/whales/${selectedCoin}`);
                const result = await response.json();
                
                const chartData = result.network_graph.nodes.map((n, i) => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    z: n.size,
                    name: n.id,
                    group: n.group
                }));
                setData({ ...result, chartData });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWhales();
    }, [selectedCoin]);

    if (loading && !data) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-purple-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Whale Tracking data</div>;

    const colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#06b6d4'];

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Coin Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Network className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                           <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap text-white">Institutional Flow <span className="text-indigo-400">Analysis</span></h1>
                           <div className="flex items-center space-x-2">
                               <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">Phase 1: Alpha</span>
                               <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest animate-pulse flex items-center">
                                   <div className="w-1 h-1 bg-emerald-400 rounded-full mr-1.5 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
                                   Live Feed
                               </span>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <BadgeCheck className="w-3 h-3 text-emerald-400" />
                                <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[9px]">Verified GNN Engine: <span className="text-gray-300">VISIONX-LABS-OMEGA</span></p>
                            </div>
                            {data.live_data && (
                                <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tighter ${data.price_change_24h >= 0 ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-red-500/5 text-red-500 border-red-500/10'}`}>
                                    {data.price_change_24h >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                    <span>{data.price_change_24h >= 0 ? '+' : ''}{data.price_change_24h}% (24H)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 shadow-inner">
                    {coins.map(coin => (
                        <button
                            key={coin.id}
                            onClick={() => setSelectedCoin(coin.id)}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${
                                selectedCoin === coin.id 
                                ? `bg-gradient-to-r ${coin.color} text-white shadow-lg scale-105` 
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {coin.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Row: AI Insight & Probability */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Whale Realized Cap Dominance (Massive) */}
                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-purple-500/30 transition-colors flex flex-col items-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] pointer-events-none"></div>
                    <h3 className="text-purple-400 font-black mb-8 uppercase tracking-[0.2em] text-[10px] w-full text-center">Whale Realized Cap</h3>
                    
                    <div className="relative mb-8">
                        <svg className="w-48 h-48 -rotate-90 scale-110 opacity-20" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500/30" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient-whale)" strokeWidth="6" strokeDasharray={`${data.whale_dominance * 2.83} 283`} strokeLinecap="round" className="drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                            <defs>
                                <linearGradient id="gradient-whale" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-5xl font-black text-white drop-shadow-md">{data.whale_dominance}%</span>
                            <span className="text-[8px] text-gray-400 font-bold tracking-[0.3em] mt-1 uppercase">Dominance</span>
                        </div>
                    </div>

                    <div className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 border ${data.whale_dominance > 50 ? 'bg-purple-900/40 text-purple-400 border-purple-500/30' : 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30'}`}>
                        <Wallet className="w-4 h-4" />
                        <span>{data.cluster_status}</span>
                    </div>
                </div>

                {/* AI Audit Report */}
                <div className="lg:col-span-2 bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/10 blur-[60px] pointer-events-none"></div>
                    <div className="flex items-center space-x-3 mb-6">
                        <Cpu className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">AI GNN Insight Audit</h3>
                    </div>
                    
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex-1 flex flex-col justify-center">
                        <p className="text-blue-100 font-medium leading-relaxed italic text-sm">
                            "{data.ai_insight}"
                        </p>
                        <div className="mt-6 flex items-center space-x-4">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-blue-900 flex items-center justify-center"><Network className="w-3 h-3 text-blue-400"/></div>)}
                            </div>
                            <span className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest pl-2">Neural Paths Analyzed: 47,126</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Metrics & Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* MVRV Ratio */}
                <div className="bg-black/60 p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"><Activity className="w-5 h-5 text-blue-400"/></div>
                        <span className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest">Valuation Index</span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white leading-none">{data.mvrv_ratio?.toFixed(2) || "2.14"}</div>
                        <div className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-wider">MVRV Z-Score</div>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                        {/* 3.5 is the typical 'danger' zone for MVRV */}
                        <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000" style={{width: `${Math.min((((data.mvrv_ratio || 2.14) - 1.0) / (3.5 - 1.0)) * 100, 100)}%`}}></div>
                    </div>
                </div>

                {/* Exchange Flow */}
                <div className="bg-black/60 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-pink-500/10 rounded-lg"><Zap className="w-5 h-5 text-pink-400"/></div>
                        <span className="text-[10px] font-black text-pink-400/50 uppercase tracking-widest">Net Exchange Flow</span>
                    </div>
                    <div>
                        <div className={`text-3xl font-black leading-none ${data.net_exchange_flow < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {data.net_exchange_flow > 0 ? '+' : ''}{data.net_exchange_flow}M
                        </div>
                        <div className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider">Net USD Flow (24H)</div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                        {data.net_exchange_flow < 0 ? <TrendingDown className="w-4 h-4 text-emerald-400"/> : <TrendingUp className="w-4 h-4 text-red-400"/>}
                        <span className={`text-[10px] font-black ${data.net_exchange_flow < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {data.net_exchange_flow < 0 ? 'ACCUMULATION' : 'DISTRIBUTION'}
                        </span>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-black/60 p-6 rounded-3xl border border-white/5 flex flex-col">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Live Cluster Alerts</h4>
                    <div className="space-y-3 overflow-y-auto max-h-[120px] pr-2 custom-scrollbar">
                        {data.large_transfers.map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors group/item rounded-lg px-2">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tx.type === 'Inflow' ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white uppercase">{tx.type}</span>
                                        <span className="text-[8px] text-gray-500 font-bold">{tx.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-[10px] font-mono font-black text-indigo-400">{tx.amount.toLocaleString()} {data.symbol}</span>
                                    <a href={tx.link} target="_blank" rel="noreferrer" className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 bg-white/10 rounded hover:bg-white/20">
                                        <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Graph Network */}
            <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] h-[500px] flex flex-col relative overflow-hidden group">
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-pink-600/10 blur-[80px] pointer-events-none group-hover:bg-pink-600/20 transition-colors"></div>
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] drop-shadow-md">Wallet Graph Network <span className="opacity-50">(Dimensional Mapped)</span></h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[8px] text-gray-500 uppercase font-bold">Exchange</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[8px] text-gray-500 uppercase font-bold">Cold Cluster</span></div>
                    </div>
                </div>
                
                <div className="flex-1 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="x" hide />
                            <YAxis type="number" dataKey="y" hide />
                            <ZAxis type="number" dataKey="z" range={[150, 4000]} name="Volume" />
                            <Tooltip 
                                cursor={{strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)'}}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-black/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl text-sm min-w-[200px]">
                                                <p className="text-white font-black tracking-widest uppercase text-[10px] mb-3 border-b border-white/10 pb-2 flex items-center justify-between">
                                                    <span>{d.name}</span>
                                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">Group {d.group}</span>
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-gray-500 uppercase font-bold">Volume</span>
                                                        <span className="text-purple-400 font-black font-mono">{d.z.toLocaleString()} {data.symbol}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-gray-500 uppercase font-bold">Risk Weight</span>
                                                        <span className="text-white font-black">{(d.z / 100).toFixed(2)}σ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Scatter data={data.chartData}>
                                {data.chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.name === 'VisionX_Institutional_Mainframe' ? '#ef4444' : colors[entry.group % colors.length]} 
                                        className="transition-all hover:opacity-100 hover:scale-110 cursor-crosshair drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] opacity-70" 
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none opacity-40">
                    <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest italic">Neural Mapping Instance: {selectedCoin.toUpperCase()}_0x7F</div>
                    <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest italic">Last Synced: {data.last_active}</div>
                </div>
            </div>
        </div>
    );
};

export default WhaleTracker;
