import React, { useState, useEffect } from 'react';
import { Activity, EyeOff, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useCoin } from '../context/CoinContext';

const DarkPoolTracker = () => {
    const { selectedCoin: coinId } = useCoin();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDarkPool = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/darkpool/${coinId}`);
                const result = await response.json();
                
                const chartData = [
                    { name: 'Public Short Vol', value: result.public_short_volume, color: '#ef4444' },
                    { name: 'Hidden OTC Buy Vol', value: result.otc_buy_volume, color: '#3b82f6' }
                ];
                setData({ ...result, chartData });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDarkPool();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-blue-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Dark Pool data</div>;

    const isSqueeze = data.divergence_usd > 2000000;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <EyeOff className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Dark Pool & OTC Tracker</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">On-chain vs Off-chain supply divergence metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                        <h3 className="text-cyan-400 font-black mb-8 uppercase tracking-[0.2em] text-xs drop-shadow-md">Public vs Hidden Imbalance</h3>
                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-red-400 font-black tracking-widest uppercase text-xs">Public Retail Shorts</span>
                                    <span className="text-white font-black text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">${(data.public_short_volume / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="w-full bg-black/60 rounded-full h-3 border border-white/5 shadow-inner">
                                    <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]" style={{ width: `${(data.public_short_volume / Math.max(data.public_short_volume, data.otc_buy_volume)) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-cyan-400 font-black tracking-widest uppercase text-xs">OTC / Dark Pool Buys</span>
                                    <span className="text-white font-black text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">${(data.otc_buy_volume / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="w-full bg-black/60 rounded-full h-3 border border-white/5 shadow-inner">
                                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" style={{ width: `${(data.otc_buy_volume / Math.max(data.public_short_volume, data.otc_buy_volume)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-10 p-6 rounded-[1.5rem] border backdrop-blur-xl relative overflow-hidden ${isSqueeze ? 'bg-cyan-900/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'bg-gray-800/40 border-gray-600/50 text-gray-300'}`}>
                            {isSqueeze && <div className="absolute inset-0 bg-cyan-500/10 animate-pulse pointer-events-none"></div>}
                            <div className="flex items-center space-x-3 mb-3 relative z-10">
                                <TrendingUp className={`w-6 h-6 ${isSqueeze ? 'text-cyan-400' : 'text-gray-400'}`} />
                                <span className="font-black tracking-widest uppercase text-xs">Algorithmic Status</span>
                            </div>
                            <p className="text-2xl text-white font-black tracking-tight relative z-10">{data.imbalance_status}</p>
                            {isSqueeze && <p className="text-sm mt-3 font-bold text-cyan-100/70 relative z-10 leading-relaxed">Retail is shorting while institutions accumulate off-exchange. Massive squeeze potential.</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] h-[540px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none"></div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-full text-center drop-shadow-md mb-8">Volume Origination Map</h3>
                    <div className="flex-1 w-full mx-auto relative max-w-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.chartData}
                                    cx="50%" cy="50%"
                                    innerRadius={90} outerRadius={130}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="transparent"
                                >
                                    {data.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    formatter={(value) => `$${(value/1000000).toFixed(1)}M`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-6 bg-black/60 px-8 py-4 rounded-2xl border border-white/5 shadow-inner">
                        <span className="text-4xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{data.dark_pool_index.toFixed(2)}</span>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">Dark Flow Index</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DarkPoolTracker;
