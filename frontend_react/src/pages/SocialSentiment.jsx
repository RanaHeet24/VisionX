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
        emerald: "bg-emerald-900/20 border-emerald-500/30 text-emerald-400",
        red: "bg-red-900/20 border-red-500/30 text-red-400",
        amber: "bg-amber-900/20 border-amber-500/30 text-amber-400",
    };
    const currentStyle = colors[data.color];

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-pink-600/20 p-2 rounded-lg border border-pink-500/30">
                    <MessageSquare className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Social Sentiment Fusion (LLM)</h1>
                    <p className="text-gray-400">NLP analysis of Twitter, Reddit, and News APIs</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gauge Chart Box */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative">
                    <h3 className="text-xl font-bold w-full text-left mb-6">AI Fear & Greed Index</h3>
                    
                    <div className="h-64 w-full relative -mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" cy="80%" 
                                innerRadius="60%" outerRadius="100%" 
                                barSize={20} 
                                data={data.chartData} 
                                startAngle={180} endAngle={0}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar minAngle={15} background={{ fill: '#374151' }} clockWise={false} dataKey="value" />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
                            <span className="text-5xl font-extrabold font-mono text-white">{data.composite_score}</span>
                            <span className="text-sm text-gray-400 uppercase tracking-widest mt-1">out of 100</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${currentStyle} shadow-xl flex flex-col justify-center h-full`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Dominant Narrative</h3>
                        <div className="text-4xl font-extrabold mb-4">{data.overall_sentiment}</div>
                        
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-start space-x-3">
                                <BrainCircuit className="w-6 h-6 shrink-0 mt-1 opacity-80" />
                                <p className="text-sm font-medium leading-relaxed opacity-90">{data.llm_summary}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex justify-between items-center px-6">
                        <span className="text-gray-400 font-medium">Text Samples Parsed (24h)</span>
                        <span className="text-2xl font-mono font-bold text-white">{data.sources_analyzed.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl mt-6">
                <h3 className="text-xl font-bold mb-6">Raw LLM Extractions</h3>
                <div className="space-y-4">
                    {data.raw_samples.map((sample, idx) => (
                        <div key={idx} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    {sample.source.includes('Twitter') ? <Twitter className="w-5 h-5 text-blue-400"/> : <Globe className="w-5 h-5 text-purple-400"/>}
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">{sample.source}</span>
                                    <p className="text-gray-300 font-medium">"{sample.text}"</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 md:min-w-[150px] justify-end">
                                <div className="text-right">
                                    <span className={`text-sm font-bold block ${sample.sentiment === 'Bullish' ? 'text-emerald-400' : sample.sentiment === 'Bearish' ? 'text-red-400' : 'text-gray-400'}`}>{sample.sentiment}</span>
                                    <span className="text-xs text-gray-500">Weight: {(sample.weight * 10).toFixed(1)}/10</span>
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
