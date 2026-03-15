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
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <ShieldCheck className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Volatility-Adjusted Stop-Loss</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Dynamic ATR bands to prevent premature wicks out</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-center relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-black text-green-400 uppercase tracking-widest mb-4 flex items-center justify-center space-x-2 relative z-10"><ArrowUpCircle className="w-5 h-5"/> <span>Target (TP)</span></h3>
                    <div className="text-4xl font-black text-white relative z-10 tracking-tighter drop-shadow-md">{formatCurrency(data.suggested_take_profit)}</div>
                    <div className="text-sm font-bold text-green-400 mt-2 bg-green-500/20 w-max mx-auto px-3 py-1 rounded-lg relative z-10">+{( ((data.suggested_take_profit - data.current_price) / data.current_price) * 100).toFixed(2)}%</div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-xl border border-blue-500/40 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(59,130,246,0.2)] text-center relative overflow-hidden group ring-1 ring-blue-500/20">
                    <div className="absolute inset-x-0 -top-10 h-32 blur-[60px] bg-blue-500/20 pointer-events-none"></div>
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 relative z-10">Live Entry Price</h3>
                    <div className="text-5xl font-black text-white relative z-10 tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">{formatCurrency(data.current_price)}</div>
                    <div className="text-xs font-black tracking-widest text-blue-300 mt-4 uppercase relative z-10 border border-blue-500/30 w-max mx-auto px-4 py-1.5 rounded-full bg-blue-900/40">R:R Ratio {data.risk_reward_ratio}:1</div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-center relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4 flex items-center justify-center space-x-2 relative z-10"><ArrowDownCircle className="w-5 h-5"/> <span>Optimal Stop (SL)</span></h3>
                    <div className="text-4xl font-black text-white relative z-10 tracking-tighter drop-shadow-md">{formatCurrency(data.suggested_stop_loss)}</div>
                    <div className="text-sm font-bold text-red-400 mt-2 bg-red-500/20 w-max mx-auto px-3 py-1 rounded-lg relative z-10">{( ((data.suggested_stop_loss - data.current_price) / data.current_price) * 100).toFixed(2)}%</div>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] mt-8">
                <h3 className="text-2xl font-black mb-8 drop-shadow-md tracking-tight uppercase">AI Dynamic Risk Envelope</h3>
                <div className="h-[450px] w-full mt-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chart_data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6B7280" 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                stroke="#6B7280" 
                                tickFormatter={(val) => `$${val.toLocaleString()}`} 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                formatter={(value, name) => [formatCurrency(value), name.replace('_', ' ').toUpperCase()]}
                                itemStyle={{ fontWeight: 'black', fontFamily: 'monospace' }}
                            />
                            
                            {/* Area between TP and SL */}
                            <Area type="monotone" dataKey="take_profit" stroke="none" fill="#10B981" fillOpacity={0.05} />
                            <Area type="monotone" dataKey="stop_loss" stroke="none" fill="#000" fillOpacity={1} /> 
                            
                            {/* Lines */}
                            <Area type="monotone" dataKey="take_profit" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            <Area type="monotone" dataKey="stop_loss" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            <Area type="monotone" dataKey="price" stroke="#06B6D4" strokeWidth={4} fill="none" activeDot={{r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-black/60 backdrop-blur-2xl border border-blue-500/30 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(59,130,246,0.2)] relative overflow-hidden group">
                <div className="absolute left-0 inset-y-0 w-64 bg-blue-500/10 blur-[60px] pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <h4 className="font-black text-blue-400 mb-2 tracking-widest uppercase text-xs drop-shadow-sm">AI Recommendation Matrix</h4>
                        <p className="text-white text-sm font-medium leading-relaxed max-w-2xl">{data.reason}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 px-8 py-4 rounded-xl font-black text-white text-center shadow-[0_0_20px_rgba(37,99,235,0.6)] tracking-widest uppercase text-sm border border-white/20 shrink-0 transform transition-transform group-hover:scale-105">
                        {data.action}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicStopLoss;
