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
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-emerald-600/20 p-2 rounded-lg border border-emerald-500/30">
                    <PieChart className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Explainable AI (XAI)</h1>
                    <p className="text-gray-400">SHAP feature importance breakdown</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-2">Feature Impact (Log Odds)</h3>
                    <p className="text-sm text-gray-400 mb-6">How each technical indicator pulled the final decision toward BUY (Green) or SELL (Red).</p>
                    
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#9CA3AF" />
                                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} tick={{fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#374151', opacity: 0.4}}
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
                                />
                                <ReferenceLine x={0} stroke="#6B7280" />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {data.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isPositive ? '#10B981' : '#EF4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center space-x-2 mb-3">
                            <Info className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-bold text-emerald-400">AI Summary</h3>
                        </div>
                        <p className="text-gray-200 leading-relaxed font-medium">
                            {data.summary}
                        </p>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-white mb-4">Raw Indicator Values</h3>
                        <div className="space-y-4">
                            {data.contributions.map((feat, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <span className="text-sm text-gray-300 block">{feat.name}</span>
                                        <span className={`text-xs font-bold ${feat.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            Impact: {feat.value > 0 ? '+' : ''}{feat.value}
                                        </span>
                                    </div>
                                    <span className="font-mono text-white">{feat.actual}</span>
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
