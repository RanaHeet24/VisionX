import React, { useState, useEffect } from 'react';
import { Activity, Code, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SmartContractAudit = () => {
    const coinId = "bitcoin"; // Usually applies to new alts
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/crypto/audit/${coinId}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-orange-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading Audit data</div>;

    const isHoneypot = data.is_honeypot;
    
    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <Code className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Semantic Contract Auditing</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Live LLM Code Vulnerability & Honeypot Front-Running</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Panel */}
                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 text-center flex flex-col justify-center items-center shadow-[0_10px_50px_rgba(0,0,0,0.6)] lg:col-span-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                    <h3 className="text-orange-400 font-black mb-8 uppercase tracking-[0.2em] text-xs drop-shadow-md relative z-10 w-full">Code Malice Score</h3>
                    <div className="relative inline-flex items-center justify-center mb-8">
                        <svg className="w-40 h-40 transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                            <circle cx="80" cy="80" r="72" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
                            <circle 
                                cx="80" cy="80" r="72" fill="transparent" 
                                stroke={isHoneypot ? '#ef4444' : (data.code_malice_score > 40 ? '#f59e0b' : '#10b981')} 
                                strokeWidth="12" 
                                strokeDasharray="452.389" 
                                strokeDashoffset={452.389 - (452.389 * data.code_malice_score) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-6xl font-black text-white tracking-tighter drop-shadow-md">{data.code_malice_score}</span>
                    </div>
                    {isHoneypot ? (
                        <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-6 py-4 rounded-xl font-black w-full uppercase flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse relative z-10 tracking-widest text-sm">
                            <AlertTriangle className="w-6 h-6"/>
                            <span>Critical Risk</span>
                        </div>
                    ) : (
                        <div className="bg-green-500/20 text-green-400 border border-green-500/50 px-6 py-4 rounded-xl font-black w-full uppercase flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10 tracking-widest text-sm">
                            <CheckCircle2 className="w-6 h-6"/>
                            <span>Safe Verified</span>
                        </div>
                    )}
                </div>

                {/* Audit Details */}
                <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 lg:col-span-2 flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-yellow-500/5 blur-[80px] pointer-events-none"></div>
                    <h3 className="text-gray-400 font-black mb-8 uppercase tracking-[0.2em] text-xs drop-shadow-md relative z-10">LLM Semantic Analysis Output</h3>
                    
                    <div className={`p-6 rounded-[1.5rem] border backdrop-blur-md mb-8 relative z-10 shadow-inner ${isHoneypot ? 'bg-red-900/20 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
                        <p className={`text-xl font-black leading-relaxed tracking-tight ${isHoneypot ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-gray-200'} italic`}>"{data.ai_judgment}"</p>
                    </div>

                    <div className="flex-1 relative z-10">
                        <h4 className="text-xs font-black text-yellow-400 mb-6 uppercase tracking-[0.2em] drop-shadow-sm">Detected Logic Signatures</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.vulnerabilities_found.map((vuln, i) => (
                                <div key={i} className="flex items-center space-x-4 bg-black/60 p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors shadow-inner group">
                                    <div className={`p-2 rounded-xl border group-hover:scale-110 transition-transform ${isHoneypot ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'}`}>
                                        {isHoneypot ? <AlertTriangle className="w-5 h-5 text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] shrink-0"/> : <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] shrink-0"/>}
                                    </div>
                                    <code className="text-sm text-gray-300 font-black font-mono tracking-wider">{vuln}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartContractAudit;
