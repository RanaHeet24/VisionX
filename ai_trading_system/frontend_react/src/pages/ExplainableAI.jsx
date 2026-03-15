import React, { useState, useEffect } from 'react';
import { PieChart, Activity, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const ExplainableAI = () => {
    const coinId = "bitcoin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExplanation = async () => {
            try {
                // Ensure model is warmed up first
                await fetch(`http://localhost:8000/api/v1/crypto/predict/${coinId}`);
                
                const response = await fetch(`http://localhost:8000/api/v1/crypto/explain/${coinId}`);
                const result = await response.json();
                
                // Format for Recharts waterfall proxy
                let cumulative = 0;
                const chartData = [...result.contributions].reverse().map(item => {
                    const old_cum = cumulative;
                    cumulative += item.value;
                    return {
                        name: item.name,
                        value: item.value,
                        start: old_cum,
                        end: cumulative,
                        isPositive: item.value > 0
                    };
                });
                
                setData({ ...result, chartData });
            } catch (err) {
                console.error("Failed to fetch SHAP", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExplanation();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-emerald-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Explainable AI data</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                    <PieChart className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">EXPLAINABLE AI (XAI)</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">SHAP Feature Importance Breakdown</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
                    <h3 className="text-2xl font-black mb-2 drop-shadow-md tracking-tight">Feature Impact <span className="text-green-500">(Log Odds)</span></h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">How each technical indicator pulled the final decision toward BUY (Green) or SELL (Red).</p>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                                <XAxis 
                                    type="number" 
                                    stroke="#6B7280" 
                                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#6B7280" 
                                    width={120} 
                                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold' }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                                />
                                <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                    {data.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isPositive ? '#10B981' : '#EF4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-green-900/10 backdrop-blur-xl border border-green-500/30 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/20 blur-[60px] pointer-events-none"></div>
                        <div className="flex items-center space-x-3 mb-4 relative z-10">
                            <Info className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                            <h3 className="font-black text-green-400 tracking-widest uppercase shadow-sm">AI Summary</h3>
                        </div>
                        <p className="text-white drop-shadow-sm leading-relaxed font-medium relative z-10 text-sm">
                            {data.summary}
                        </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <h3 className="font-black text-white mb-6 uppercase tracking-widest text-xs border-b border-white/10 pb-4">Raw Indicator Values</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {data.contributions.map((feat, i) => (
                                <div key={i} className="flex justify-between items-center group hover:bg-white/5 p-2 rounded-xl transition-colors">
                                    <div>
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-1">{feat.name.replace(/_/g, ' ')}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${feat.value > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            LOG IMPACT: {feat.value > 0 ? '+' : ''}{feat.value.toFixed(4)}
                                        </span>
                                    </div>
                                    <span className="font-black text-white text-sm bg-white/5 px-3 py-1 rounded-lg">{typeof feat.actual === 'number' ? feat.actual.toFixed(4) : feat.actual}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplainableAI;
