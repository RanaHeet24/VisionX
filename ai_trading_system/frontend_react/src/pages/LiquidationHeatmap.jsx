import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Crosshair, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useCoin } from '../context/CoinContext';

const LiquidationHeatmap = () => {
    const { selectedCoin: coinId } = useCoin();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/liquidation/${coinId}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch liquidation data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmap();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-red-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Liquidation data</div>;

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatMillions = (val) => `$${(val / 1000000).toFixed(1)}M`;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    <AlertCircle className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">LIQUIDATION TERRAIN</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Institutional-grade squeeze prediction & Leverage clusters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 relative z-10">Live Asset Tracking</h3>
                    <div className="text-4xl font-black text-white relative z-10 tracking-tighter drop-shadow-md">{formatCurrency(data.current_price)}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(220,38,38,0.2)] text-center relative overflow-hidden group">
                    <div className="absolute -left-10 -top-10 w-32 h-32 blur-[60px] opacity-20 bg-red-500"></div>
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-3 relative z-10">Long Liquidations Below</h3>
                    <div className="text-4xl font-black text-red-500 relative z-10 tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{formatMillions(data.total_long_liquidation)}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(16,185,129,0.2)] text-center relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-20 bg-green-500"></div>
                    <h3 className="text-xs font-black text-green-400 uppercase tracking-widest mb-3 relative z-10">Short Liquidations Above</h3>
                    <div className="text-4xl font-black text-green-400 relative z-10 tracking-tighter drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">{formatMillions(data.total_short_liquidation)}</div>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight mb-2 drop-shadow-md">Leverage Cluster Map</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Volume (USD) of liquidations at specific price levels</p>
                    </div>
                    <div className="px-5 py-3 bg-black/60 rounded-xl border border-white/10 flex items-center space-x-3 shadow-inner">
                        <Crosshair className="w-5 h-5 text-yellow-500 animate-pulse"/>
                        <span className="text-sm font-black tracking-widest text-white uppercase">Bias: <span className={data.imbalance_status.includes('Long') ? 'text-red-400' : 'text-green-400'}>{data.imbalance_status}</span></span>
                    </div>
                </div>
                
                <div className="h-[450px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.clusters} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="price" 
                                stroke="#6B7280" 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickFormatter={(val) => `$${val.toLocaleString()}`}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis 
                                stroke="#6B7280" 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickFormatter={(val) => `${(val / 1000000)}M`}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                formatter={(value, name) => [formatCurrency(value), 'Liq. Vol']}
                                labelFormatter={(label) => `Price: ${formatCurrency(label)}`}
                            />
                            <ReferenceLine x={data.current_price} stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" label={{ position: 'top', value: 'CURRENT', fill: '#EAB308', fontSize: 12, fontWeight: 'bold' }} />
                            <Bar dataKey="intensity" radius={[6, 6, 0, 0]}>
                                {data.clusters.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'Long Liquidation' ? '#EF4444' : '#10B981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-8 mt-8">
                    <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-gray-400"><div className="w-4 h-4 bg-red-500 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div><span>Longs (Risk of Drop)</span></div>
                    <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-gray-400"><div className="w-4 h-4 bg-green-500 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span>Shorts (Risk of Pump)</span></div>
                </div>
            </div>
            
            <div className="bg-black/60 backdrop-blur-2xl border border-yellow-500/20 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(250,204,21,0.1)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-yellow-500/10 to-transparent blur-[50px] pointer-events-none"></div>
                <div className="flex items-start space-x-6 relative z-10">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.3)] shrink-0">
                        {data.total_long_liquidation > data.total_short_liquidation ? <ArrowDown className="w-8 h-8 text-black"/> : <ArrowUp className="w-8 h-8 text-black"/>}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white mb-3 tracking-tight">MARKET MAKER MAGNET</h4>
                        <p className="text-gray-400 leading-relaxed text-sm font-medium pr-10">
                            Markets tend to move toward liquidity. The highest concentration of liquidations acts as a magnet for price action. Right now, the AI detects a <span className="font-bold text-yellow-400 uppercase">{data.imbalance_status.toLowerCase()}</span>, meaning a sudden price wick in that direction is highly probable to wipe out over-leveraged retail traders before continuing the macro trend.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidationHeatmap;
