import React, { useState, useEffect } from 'react';
import { Activity, Network, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

const WhaleTracker = () => {
    const coinId = "bitcoin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWhales = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/whales/${coinId}`);
                const result = await response.json();
                
                // Format for Recharts Scatter (simulating nodes based on sizes/groups)
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
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-purple-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Whale Tracking data</div>;

    const colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#06b6d4'];

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Network className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">Whale Cluster Hunting <span className="text-purple-400">(GNNS)</span></h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-1">Graph Neural Network mapping of institutional smurfing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>
                    <div className="absolute -right-10 -bottom-10 p-4 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700"><Network className="w-64 h-64 text-purple-400"/></div>
                    
                    <h3 className="text-purple-400 font-black mb-6 uppercase tracking-[0.2em] text-xs drop-shadow-md relative z-10 w-full text-center">Smurfing Probability</h3>
                    
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <div className="relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-150 opacity-20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500/30" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeDasharray={`${(data.smurfing_probability * 100) * 2.83} 283`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="text-7xl font-black text-white shrink-0 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] tracking-tighter">
                                {(data.smurfing_probability * 100).toFixed(1)}<span className="text-3xl text-gray-500 align-top ml-1">%</span>
                            </div>
                        </div>
                        
                        <div className={`mt-12 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] inline-flex items-center space-x-3 relative z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] border ${data.smurfing_probability > 0.5 ? 'bg-red-900/40 text-red-400 border-red-500/30' : 'bg-green-900/40 text-green-400 border-green-500/30'}`}>
                            {data.smurfing_probability > 0.5 && <ShieldAlert className="w-5 h-5 animate-pulse" />}
                            <span>STATUS: {data.cluster_status}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] h-[450px] flex flex-col relative overflow-hidden">
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-pink-600/10 blur-[80px] pointer-events-none"></div>
                    <h3 className="text-gray-400 font-black mb-6 uppercase tracking-[0.2em] text-xs text-center drop-shadow-md relative z-10">Wallet Graph Network <span className="opacity-50 text-[10px] block mt-1">(Dimensional Mapped)</span></h3>
                    
                    <div className="flex-1 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis type="number" dataKey="x" hide />
                                <YAxis type="number" dataKey="y" hide />
                                <ZAxis type="number" dataKey="z" range={[100, 2000]} name="Volume" />
                                <Tooltip 
                                    cursor={{strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl text-sm min-w-[150px]">
                                                    <p className="text-white font-black tracking-widest uppercase text-xs mb-2 border-b border-white/10 pb-2">{d.name}</p>
                                                    <p className="text-purple-400 font-bold font-mono">Vol: {d.z} BTC</p>
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
                                            fill={entry.name === 'Binance_HotWallet' ? '#ef4444' : colors[entry.group % colors.length]} 
                                            className="transition-all hover:opacity-100 hover:scale-150 cursor-crosshair drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] opacity-80" 
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhaleTracker;
