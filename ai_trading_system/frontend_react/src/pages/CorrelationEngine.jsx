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
        if (group === "Leader") return "bg-cyan-900/40 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] backdrop-blur-md";
        if (group === "Lagger") return "bg-purple-900/40 border-purple-400 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md";
        return "bg-gray-800/40 border-gray-500 text-gray-300 backdrop-blur-md";
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    <TrendingUp className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Multi-Asset Lead/Lag Correlation</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Detect asynchronous momentum to front-run altcoins</p>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] mb-8 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500/10 blur-[80px] pointer-events-none"></div>
                <div className="text-2xl font-black mb-6 text-white flex items-center space-x-3 drop-shadow-md">
                    <FastForward className="w-6 h-6 text-yellow-500" />
                    <span className="tracking-tight uppercase">Live Detection Signal</span>
                </div>
                <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-[1.5rem] p-8 relative z-10 backdrop-blur-xl shadow-inner">
                    <p className="text-yellow-100/90 text-lg leading-relaxed font-black tracking-wide">
                        {data.summary}
                    </p>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase drop-shadow-md">Quantum Relationship Network</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12 relative z-10">
                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] text-center border-b border-white/10 pb-4 shadow-sm">Market Leaders <span className="text-white ml-2">(T=0)</span></h4>
                        <div className="flex justify-center flex-wrap gap-4">
                            {data.nodes.filter(n => n.group === 'Leader').map(node => (
                                <div key={node.id} className={`capitalize px-8 py-4 rounded-2xl border-2 font-black tracking-wider z-10 ${getNodeStyle(node.group)} transition-transform hover:scale-105`}>
                                    {node.id}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] text-center border-b border-white/10 pb-4 shadow-sm">Market Laggers <span className="text-white ml-2">(T &gt; 0)</span></h4>
                        <div className="flex flex-col items-center gap-4">
                            {data.nodes.filter(n => n.group !== 'Leader').map(node => (
                                <div key={node.id} className={`capitalize px-8 py-3 rounded-2xl border-2 font-black tracking-wider z-10 ${getNodeStyle(node.group)} transition-transform hover:scale-105 w-full max-w-xs text-center`}>
                                    {node.id} {node.group === 'Independent' ? '(Ind)' : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-lg relative z-10">
                    <h4 className="font-black text-white mb-6 flex items-center space-x-3 uppercase tracking-widest text-sm">
                        <LinkIcon className="w-5 h-5 text-gray-400" />
                        <span>Correlation Matrix Detailing</span>
                    </h4>
                    <div className="overflow-x-auto custom-scrollbar pb-4">
                        <table className="min-w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="py-3 px-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Source Asset</th>
                                    <th className="py-3 px-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Target Asset</th>
                                    <th className="py-3 px-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Correlation (r)</th>
                                    <th className="py-3 px-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Time Delay (Lag)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.links.map((link, idx) => (
                                    <tr key={idx} className="bg-white/5 hover:bg-white/10 transition-colors group">
                                        <td className="py-4 px-6 capitalize font-black text-cyan-400 tracking-wider rounded-l-xl">{link.source}</td>
                                        <td className="py-4 px-6 capitalize font-black text-purple-400 tracking-wider">{link.target}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-4">
                                                <span className="font-black text-white text-sm bg-black/40 px-3 py-1 rounded-lg border border-white/10 shadow-inner block w-16 text-center">{link.value.toFixed(2)}</span>
                                                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full bg-gradient-to-r from-yellow-500 to-green-500" style={{ width: `${link.value * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-black text-yellow-400 tracking-widest text-sm rounded-r-xl bg-yellow-400/5">{link.lag_minutes} MIN</td>
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
