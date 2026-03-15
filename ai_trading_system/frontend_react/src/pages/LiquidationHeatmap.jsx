import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Crosshair, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const LiquidationHeatmap = () => {
    const coinId = "bitcoin";
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
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-red-600/20 p-2 rounded-lg border border-red-500/30">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Liquidation Heatmap</h1>
                    <p className="text-gray-400">Institutional-grade squeeze prediction & Leverage clusters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl text-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Live Price</h3>
                    <div className="text-3xl font-mono font-bold text-white">{formatCurrency(data.current_price)}</div>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 shadow-xl text-center">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Long Liquidations Below</h3>
                    <div className="text-3xl font-mono font-bold text-red-100">{formatMillions(data.total_long_liquidation)}</div>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 shadow-xl text-center">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Short Liquidations Above</h3>
                    <div className="text-3xl font-mono font-bold text-emerald-100">{formatMillions(data.total_short_liquidation)}</div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl mt-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Leverage Cluster Map</h3>
                        <p className="text-sm text-gray-400">Volume (USD) of liquidations at specific price levels</p>
                    </div>
                    <div className="px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 flex items-center space-x-2">
                        <Crosshair className="w-4 h-4 text-blue-400"/>
                        <span className="text-sm font-bold text-gray-300">Bias: {data.imbalance_status}</span>
                    </div>
                </div>
                
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.clusters} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis 
                                dataKey="price" 
                                stroke="#9CA3AF" 
                                tickFormatter={(val) => `$${val.toLocaleString()}`}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis 
                                stroke="#9CA3AF" 
                                tickFormatter={(val) => `${(val / 1000000)}M`}
                            />
                            <Tooltip 
                                cursor={{fill: '#374151', opacity: 0.4}}
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
                                formatter={(value, name) => [formatCurrency(value), 'Liquidation Volume']}
                                labelFormatter={(label) => `Price Level: ${formatCurrency(label)}`}
                            />
                            <ReferenceLine x={data.current_price} stroke="#3B82F6" strokeDasharray="3 3" label={{ position: 'top', value: 'Current Price', fill: '#60A5FA', fontSize: 12 }} />
                            <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                                {data.clusters.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.type === 'Long Liquidation' ? '#EF4444' : '#10B981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Longs (Risk of Drop)</span></div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span>Shorts (Risk of Pump)</span></div>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start space-x-4">
                    <div className="bg-gray-800 p-3 rounded-full border border-gray-700 mt-1">
                        {data.total_long_liquidation > data.total_short_liquidation ? <ArrowDown className="w-6 h-6 text-red-400"/> : <ArrowUp className="w-6 h-6 text-emerald-400"/>}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2">Market Maker Magnet</h4>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Markets tend to move toward liquidity. The highest concentration of liquidations acts as a magnet for price action. Right now, the AI detects a {data.imbalance_status.toLowerCase()}, meaning a sudden price wick in that direction is highly probable to wipe out over-leveraged retail traders before continuing the macro trend.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidationHeatmap;
