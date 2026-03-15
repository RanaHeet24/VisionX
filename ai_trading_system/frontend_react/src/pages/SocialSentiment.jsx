import React, { useState, useEffect } from 'react';
import { MessageSquare, Activity, Twitter, Globe, BrainCircuit } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const SocialSentiment = () => {
    const coinId = "bitcoin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/sentiment/${coinId}`);
                const result = await response.json();
                
                // Format for Gauge Chart
                const chartData = [{
                    name: 'Sentiment',
                    value: result.composite_score,
                    fill: result.color === 'emerald' ? '#10B981' : result.color === 'red' ? '#EF4444' : '#F59E0B'
                }];
                setData({ ...result, chartData });
            } catch (err) {
                console.error("Failed to fetch sentiment data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSentiment();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-pink-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Sentiment data</div>;

    const colors = {
        emerald: "bg-green-900/10 border-green-500/30 text-green-400 bg-gradient-to-br from-green-500/10 to-transparent",
        red: "bg-red-900/10 border-red-500/30 text-red-400 bg-gradient-to-br from-red-500/10 to-transparent",
        amber: "bg-yellow-900/10 border-yellow-500/30 text-yellow-400 bg-gradient-to-br from-yellow-500/10 to-transparent",
    };
    const currentStyle = colors[data.color];

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-3 rounded-xl shadow-[0_0_20px_rgba(244,114,182,0.3)]">
                    <MessageSquare className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Social Sentiment Fusion <span className="text-pink-400">(LLM)</span></h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">NLP analysis of Twitter, Reddit, and News APIs</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gauge Chart Box */}
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-pink-500/10 blur-[80px] pointer-events-none"></div>
                    <h3 className="text-xs font-black w-full text-center mb-8 uppercase tracking-[0.2em] text-gray-400 drop-shadow-md relative z-10">AI Fear & Greed Index</h3>
                    
                    <div className="h-[300px] w-full relative -mt-6 z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" cy="75%" 
                                innerRadius="70%" outerRadius="100%" 
                                barSize={24} 
                                data={data.chartData} 
                                startAngle={180} endAngle={0}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar minAngle={15} background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise={false} dataKey="value" cornerRadius={12} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-x-0 bottom-12 flex flex-col items-center">
                            <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{data.composite_score}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">out of 100</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className={`p-8 rounded-[2rem] border backdrop-blur-2xl ${currentStyle} shadow-[0_10px_50px_rgba(0,0,0,0.6)] flex flex-col justify-center min-h-[250px] relative overflow-hidden`}>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 blur-[80px] opacity-20 bg-current"></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-3 relative z-10 drop-shadow-sm text-white">Dominant Narrative</h3>
                        <div className="text-5xl font-black mb-6 tracking-tight relative z-10 drop-shadow-[0_0_10px_currentColor]">{data.overall_sentiment}</div>
                        
                        <div className="mt-4 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex items-start space-x-4">
                                <BrainCircuit className="w-8 h-8 shrink-0 mt-1 opacity-80 filter drop-shadow-md" />
                                <p className="text-sm font-medium leading-relaxed opacity-90 text-white drop-shadow-sm">{data.llm_summary}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 flex justify-between items-center px-8 shadow-inner hover:bg-white/5 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Text Samples Parsed (24h)</span>
                        <span className="text-3xl font-black text-white tracking-tighter drop-shadow-md">{data.sources_analyzed.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] mt-8">
                <h3 className="text-xl font-black mb-8 drop-shadow-md tracking-tight uppercase">Raw LLM Extractions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.raw_samples.map((sample, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group shadow-lg">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-black/60 rounded-xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                    {sample.source.includes('Twitter') ? <Twitter className="w-6 h-6 text-[#1DA1F2] drop-shadow-[0_0_8px_rgba(29,161,242,0.5)]"/> : <Globe className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"/>}
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-2">{sample.source}</span>
                                    <p className="text-gray-300 font-medium text-sm leading-relaxed tracking-wide italic">"{sample.text}"</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 justify-end border-t border-white/5 pt-4 mt-2">
                                <div className="text-right flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-black/40 px-3 py-1 rounded-lg border border-white/5">Weight: {(sample.weight * 10).toFixed(1)}/10</span>
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-inner border border-white/10 ${sample.sentiment === 'Bullish' ? 'bg-green-500/20 text-green-400' : sample.sentiment === 'Bearish' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{sample.sentiment}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialSentiment;
