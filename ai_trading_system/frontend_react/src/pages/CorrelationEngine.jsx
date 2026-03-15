import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, FastForward, Link as LinkIcon } from 'lucide-react';

const CorrelationEngine = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeadLag = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/leadlag`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch leadlag data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadLag();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-amber-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Correlation data</div>;

    const getNodeStyle = (group) => {
        if (group === "Leader") return "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        if (group === "Lagger") return "bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]";
        return "bg-gray-600 border-gray-400 text-white";
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-amber-600/20 p-2 rounded-lg border border-amber-500/30">
                    <TrendingUp className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Multi-Asset Lead/Lag Correlation</h1>
                    <p className="text-gray-400">Detect asynchronous momentum to front-run altcoins</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-xl mb-8">
                <div className="text-xl font-bold mb-6 text-white flex items-center space-x-2">
                    <FastForward className="w-6 h-6 text-amber-500" />
                    <span>Live Detection</span>
                </div>
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-6">
                    <p className="text-amber-100/90 text-lg leading-relaxed font-medium">
                        {data.summary}
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-6">Relationship Network</h3>
                
                {/* Simulated Visual Network Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    
                    {/* Source -> Target Layout */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-700 pb-2">Market Leaders (T=0)</h4>
                        <div className="flex justify-center space-x-8">
                            {data.nodes.filter(n => n.group === 'Leader').map(node => (
                                <div key={node.id} className={`capitalize px-6 py-3 rounded-full border-2 font-bold z-10 ${getNodeStyle(node.group)}`}>
                                    {node.id}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-700 pb-2">Market Laggers (T &gt; 0)</h4>
                        <div className="flex flex-col items-center space-y-4">
                            {data.nodes.filter(n => n.group !== 'Leader').map(node => (
                                <div key={node.id} className={`capitalize px-6 py-2 rounded-full border-2 font-bold z-10 ${getNodeStyle(node.group)}`}>
                                    {node.id} {node.group === 'Independent' ? '(Ind)' : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-300 mb-4 flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-gray-400" />
                        <span>Correlation Matrix Detailing</span>
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-gray-400 font-medium">Source Asset</th>
                                    <th className="py-3 px-4 text-gray-400 font-medium">Target Asset</th>
                                    <th className="py-3 px-4 text-gray-400 font-medium">Correlation (r)</th>
                                    <th className="py-3 px-4 text-gray-400 font-medium">Time Delay (Lag)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {data.links.map((link, idx) => (
                                    <tr key={idx} className="hover:bg-gray-800 transition-colors">
                                        <td className="py-3 px-4 capitalize font-bold text-blue-400">{link.source}</td>
                                        <td className="py-3 px-4 capitalize font-bold text-purple-400">{link.target}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-gray-300">{link.value.toFixed(2)}</span>
                                                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${link.value * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-amber-400 font-bold">{link.lag_minutes} min</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorrelationEngine;
