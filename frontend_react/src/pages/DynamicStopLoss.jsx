import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DynamicStopLoss = () => {
    const coinId = "bitcoin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStopLoss = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/stoploss/${coinId}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch stop loss data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStopLoss();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-blue-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Dynamic Stop-Loss data</div>;

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                    <ShieldCheck className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Volatility-Adjusted Stop-Loss</h1>
                    <p className="text-gray-400">Dynamic ATR bands to prevent premature wicks out</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl text-center">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-center space-x-1"><ArrowUpCircle className="w-4 h-4"/> <span>Target (TP)</span></h3>
                    <div className="text-3xl font-mono font-bold text-emerald-100">{formatCurrency(data.suggested_take_profit)}</div>
                    <div className="text-xs text-emerald-500 mt-1">+{( ((data.suggested_take_profit - data.current_price) / data.current_price) * 100).toFixed(2)}%</div>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 shadow-xl text-center shadow-blue-900/10">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Live Entry Price</h3>
                    <div className="text-3xl font-mono font-bold text-white">{formatCurrency(data.current_price)}</div>
                    <div className="text-xs text-blue-400 mt-1">R:R Ratio {data.risk_reward_ratio}:1</div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl text-center">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center justify-center space-x-1"><ArrowDownCircle className="w-4 h-4"/> <span>Optimal Stop (SL)</span></h3>
                    <div className="text-3xl font-mono font-bold text-red-100">{formatCurrency(data.suggested_stop_loss)}</div>
                    <div className="text-xs text-red-500 mt-1">{( ((data.suggested_stop_loss - data.current_price) / data.current_price) * 100).toFixed(2)}%</div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl mt-8">
                <h3 className="text-xl font-bold mb-6">AI Dynamic Risk Envelope</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chart_data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="date" stroke="#9CA3AF" />
                            <YAxis domain={['auto', 'auto']} stroke="#9CA3AF" tickFormatter={(val) => `$${val.toLocaleString()}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
                                formatter={(value, name) => [formatCurrency(value), name.replace('_', ' ').toUpperCase()]}
                            />
                            
                            {/* Area between TP and SL */}
                            <Area type="monotone" dataKey="take_profit" stroke="none" fill="#10B981" fillOpacity={0.1} />
                            <Area type="monotone" dataKey="stop_loss" stroke="none" fill="#1F2937" fillOpacity={1} /> 
                            
                            {/* Lines */}
                            <Area type="monotone" dataKey="take_profit" stroke="#10B981" strokeDasharray="5 5" fill="none" />
                            <Area type="monotone" dataKey="stop_loss" stroke="#EF4444" strokeDasharray="5 5" fill="none" />
                            <Area type="monotone" dataKey="price" stroke="#60A5FA" strokeWidth={3} fill="none" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h4 className="font-bold text-white mb-1">AI Recommendation</h4>
                        <p className="text-blue-200 className=text-sm">{data.reason}</p>
                    </div>
                    <div className="bg-blue-600 px-6 py-3 rounded-xl font-bold text-white text-center border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        {data.action}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicStopLoss;
