import React, { useState, useEffect } from 'react';
import { Activity, ShieldOff, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, ReferenceLine } from 'recharts';

const SpoofingDetector = () => {
    const coinId = "bitcoin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderbook = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/orderbook/${coinId}`);
                const result = await response.json();
                
                // Merge bids and asks for charting
                const bidsFormatted = result.bids.map(b => ({ ...b, type: 'bid' })).reverse();
                const asksFormatted = result.asks.map(a => ({ ...a, type: 'ask' }));
                const chartData = [...bidsFormatted, ...asksFormatted];
                
                setData({ ...result, chartData });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderbook();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-red-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Orderbook data</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-red-600 to-red-900 p-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    <ShieldOff className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">SPOOFING RADAR</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Microsecond AI analysis of fake liquidity walls</p>
                </div>
            </div>

            {data.spoofing_detected && (
                <div className="bg-red-900/40 backdrop-blur-xl border-l-[6px] border-red-500 p-6 rounded-2xl flex items-start space-x-5 mb-8 shadow-[0_10px_30px_rgba(220,38,38,0.2)] relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/20 blur-[40px]"></div>
                    <Zap className="w-8 h-8 text-white mt-1 shrink-0 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    <div className="relative z-10">
                        <h3 className="text-red-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2 drop-shadow-md">LIVE MANIPULATION ALERT</h3>
                        <p className="text-white text-xl font-bold tracking-tight">{data.warning_msg}</p>
                    </div>
                </div>
            )}

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] h-[600px] flex flex-col">
                <h3 className="text-cyan-400 font-black mb-6 uppercase tracking-[0.2em] text-xs text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    Liquidity Depth (Current Price: ${data.current_price.toLocaleString()})
                </h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <XAxis 
                                dataKey="price" 
                                stroke="#4B5563" 
                                tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold'}} 
                                tickFormatter={(val) => `$${val}`} 
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                                                <p className="text-gray-400 mb-1 text-xs font-bold uppercase tracking-wider">Price Level: <span className="text-white ml-2">${d.price}</span></p>
                                                <p className="font-black text-gray-300 mb-3 text-xs uppercase tracking-wider">Volume: <span className="text-cyan-400 ml-2">{d.volume} BTC</span></p>
                                                {d.is_spoof && (
                                                    <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-inner">
                                                        <ShieldOff className="w-3 h-3" /> Fake Liquidity (Spoof)
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <ReferenceLine x={data.current_price} stroke="#06B6D4" strokeDasharray="3 3" strokeWidth={2} label={{ position: 'top', value: 'CURRENT', fill: '#06b6d4', fontSize: 10, fontWeight: 'bold' }} />
                            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                                {data.chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.is_spoof ? '#EAB308' : (entry.type === 'bid' ? '#10B981' : '#EF4444')} 
                                        opacity={entry.is_spoof ? 1 : 0.4}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-8 mt-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <div className="flex items-center space-x-3"><div className="w-3 h-3 bg-emerald-500/40 border border-emerald-500/50 rounded-md"></div><span>Real Bids</span></div>
                    <div className="flex items-center space-x-3"><div className="w-3 h-3 bg-red-500/40 border border-red-500/50 rounded-md"></div><span>Real Asks</span></div>
                    <div className="flex items-center space-x-3"><div className="w-3 h-3 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)] rounded-md"></div><span className="text-yellow-400">Spoof Walls (Manipulation)</span></div>
                </div>
            </div>
        </div>
    );
};

export default SpoofingDetector;
