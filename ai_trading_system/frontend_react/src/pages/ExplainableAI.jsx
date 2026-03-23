import React, { useState, useEffect } from 'react';
import { PieChart, Activity, Info, TrendingUp, MessageSquare, ShieldAlert, ChevronRight, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useCoin } from '../context/CoinContext';
import { cryptoApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ExplainableAI = () => {
    const { selectedCoin: coinId } = useCoin();
    const [data, setData] = useState(null);
    const [regimeData, setRegimeData] = useState(null);
    const [sentimentData, setSentimentData] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch in parallel for speed
                const [xaiRes, regimeRes, sentimentRes, liveRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/v1/crypto/explain/${coinId}`).then(r => r.json()),
                    fetch(`http://localhost:8000/api/v1/crypto/regime/${coinId}`).then(r => r.json()),
                    fetch(`http://localhost:8000/api/v1/crypto/sentiment/${coinId}`).then(r => r.json()),
                    cryptoApi.getLiveData(coinId)
                ]);

                // Format for Recharts
                const chartData = [...xaiRes.contributions].reverse().map(item => ({
                    ...item,
                    isPositive: item.value > 0
                }));

                setData({ ...xaiRes, chartData });
                setRegimeData(regimeRes);
                setSentimentData(sentimentRes);
                setLiveData(liveRes);
            } catch (err) {
                console.error("Failed to fetch XAI dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [coinId]);

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <Activity className="animate-spin text-emerald-500 w-12 h-12 relative z-10"/>
            </div>
            <p className="text-emerald-500/70 font-black tracking-[0.2em] uppercase text-xs animate-pulse">Decrypting Neural Pathways...</p>
        </div>
    );

    if (!data) return (
        <div className="flex h-64 items-center justify-center text-red-400 font-bold bg-red-900/10 border border-red-500/20 rounded-2xl">
            <ShieldAlert className="mr-2" /> Error loading Explainable AI engine
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transform hover:rotate-6 transition-transform">
                        <PieChart className="w-8 h-8 text-black" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-4xl font-black tracking-tighter">NEURAL INSIGHT <span className="text-emerald-500">XAI</span></h1>
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded uppercase tracking-widest">v2.0 Active</span>
                        </div>
                        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">SHAP Gradient Attribution & Feature Logic for {coinId.toUpperCase()}</p>
                    </div>
                </div>

                {liveData && (
                    <div className="flex items-center space-x-8 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-inner">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Live Price</p>
                            <p className="text-xl font-black text-white">${liveData.current_price.toLocaleString()}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">24h Change</p>
                            <p className={`text-xl font-black ${liveData.price_change_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {liveData.price_change_24h > 0 ? '+' : ''}{liveData.price_change_24h.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Feature Impact Chart */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                        
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black mb-2 tracking-tight flex items-center gap-3">
                                    Feature Attribution <span className="text-emerald-500 font-medium text-lg leading-none mt-1">(SHAP Values)</span>
                                </h3>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                    Impact of technical indicators on the current prediction signal.
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <div className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Bullish Force</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Bearish Force</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[450px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 50, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={true} vertical={false} />
                                    <XAxis 
                                        type="number" 
                                        stroke="rgba(255,255,255,0.1)" 
                                        tick={{ fill: '#4B5563', fontSize: 10, fontWeight: '900' }}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        stroke="rgba(255,255,255,0.1)" 
                                        width={140} 
                                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: '800' }}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{d.name}</p>
                                                        <p className="text-xl font-black text-white mb-2">{d.value > 0 ? '+' : ''}{d.value.toFixed(2)}% <span className="text-xs text-gray-400 font-bold">Impact</span></p>
                                                        <div className="flex items-center justify-between text-[11px] font-black border-t border-white/5 pt-2">
                                                            <span className="text-gray-500 uppercase">Input Value:</span>
                                                            <span className="text-emerald-400">{d.actual}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                        {data.chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.isPositive ? '#10B981' : '#EF4444'} 
                                                fillOpacity={0.8}
                                                stroke={entry.isPositive ? '#34D399' : '#F87171'}
                                                strokeWidth={1}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Integrated AI Logic Summary */}
                    <div className="bg-gradient-to-br from-indigo-900/20 to-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-lg relative overflow-hidden group">
                        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
                        <div className="flex items-start space-x-6 relative z-10">
                            <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/30">
                                <Activity className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-4 tracking-widest uppercase text-indigo-300">Cognitive Summary</h3>
                                <p className="text-lg font-medium text-white leading-relaxed drop-shadow-sm italic">
                                    "{data.summary}"
                                </p>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Model Baseline</p>
                                        <p className="text-lg font-black text-white">{(data.base_value * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Feature Shift</p>
                                        <p className={`text-lg font-black ${data.contributions.reduce((acc, curr) => acc + curr.value, 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {data.contributions.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Sidebars - Context Layers */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Market Regime Context */}
                    {regimeData && (
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-lg group hover:border-yellow-500/30 transition-all duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <BarChart2 className="w-5 h-5 text-yellow-500" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mt-1">Market Regime</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${regimeData.color === 'emerald' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {regimeData.risk_level} Risk
                                </span>
                            </div>
                            <div className="mb-6">
                                <p className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-yellow-400 transition-colors">
                                    {regimeData.current_regime}
                                </p>
                                <p className="text-[11px] font-bold text-gray-500 mt-2 leading-relaxed">
                                    The model is currently weighting features based on an <span className="text-yellow-500/80">unsupervised clustering threshold</span> of recent price volatility.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between group-cursor-pointer">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">View Historical Transitions</span>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    )}

                    {/* Social Sentiment Impact */}
                    {sentimentData && (
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-lg group hover:border-cyan-500/30 transition-all duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <MessageSquare className="w-5 h-5 text-cyan-500" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mt-1">Sentiment Fusion</h3>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-black text-cyan-400 uppercase tracking-tighter">Live Scraping</span>
                                </div>
                            </div>
                            <div className="flex items-end space-x-4 mb-6">
                                <div className="text-4xl font-black text-white leading-none tracking-tighter">{sentimentData.composite_score}</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">/ 100 Score</div>
                            </div>
                            <div className={`text-sm font-black px-3 py-1.5 rounded-xl inline-block mb-4 shadow-sm ${sentimentData.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-100 border border-red-500/20'}`}>
                                {sentimentData.overall_sentiment}
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-4 py-1">
                                "{sentimentData.llm_summary}"
                            </p>
                        </div>
                    )}

                    {/* Feature Detail Breakdown */}
                    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-lg overflow-hidden relative">
                         <div className="flex items-center space-x-3 mb-8">
                            <Info className="w-5 h-5 text-gray-400" />
                            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mt-1">Raw Input Audit</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                            {data.contributions.map((feat, i) => (
                                <div key={i} className="group hover:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-white/5 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">{feat.name}</span>
                                        <span className="font-black text-white text-xs bg-white/10 px-2 py-0.5 rounded-md">{typeof feat.actual === 'number' ? feat.actual.toLocaleString() : feat.actual}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-2">
                                        <div 
                                            className={`h-full rounded-full ${feat.value > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(100, Math.abs(feat.value) * 5)}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-black ${feat.value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        SHAP CONTRIBUTION: {feat.value > 0 ? '+' : ''}{feat.value.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Methodology Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex items-start space-x-6">
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mt-1">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Local Attribution Mapping</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Signals are decomposed using Shapley Additive Explanations. This ensures each technical indicator is credited precisely for its marginal contribution to the core decision, neutralizing multi-collinearity bias.
                        </p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex items-start space-x-6">
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 mt-1">
                        <ShieldAlert className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Non-Linear Interaction</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            The XAI engine detects interaction effects where two indicators (e.g. RSI + Volatility) combined provide more predictive Power than the sum of their individual parts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase opacity-50 pb-12">
                <p>NEURAL EXPLAINABILITY CORE &mdash; ASYNC GRADIENT SYNC &bull; {coinId.toUpperCase()} ACTIVE</p>
            </footer>
        </div>
    );
};

export default ExplainableAI;
