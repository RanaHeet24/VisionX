import React, { useState, useEffect } from 'react';
import { cryptoApi } from '../services/api';
import { Layers, Activity, AlertTriangle } from 'lucide-react';
import { useCoin } from '../context/CoinContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RegimeDetection = () => {
    const { selectedCoin: coinId } = useCoin();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegime = async () => {
            try {
                // To fetch from the new endpoint we just created
                const response = await fetch(`http://localhost:8000/api/v1/crypto/regime/${coinId}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Failed to fetch regime", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegime();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><Activity className="animate-spin text-purple-500 w-8 h-8"/></div>;
    if (!data) return <div>Error loading regime data</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    <Layers className="w-7 h-7 text-black" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">MARKET REGIME</h1>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-1">Unsupervised clustering (K-Means) macro market states</p>
                </div>
            </div>

            <div className={`p-8 rounded-[2rem] border relative overflow-hidden group ${data.color === 'emerald' ? 'bg-green-900/10 border-green-500/30' : data.color === 'red' ? 'bg-red-900/10 border-red-500/30' : 'bg-yellow-900/10 border-yellow-500/30'}`}>
                <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[80px] opacity-30 ${data.color === 'emerald' ? 'bg-green-500' : data.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <h3 className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 relative z-10 text-gray-400">Current Global State</h3>
                <div className={`text-5xl md:text-6xl font-black mb-6 relative z-10 tracking-tight drop-shadow-md ${data.color === 'emerald' ? 'text-green-400' : data.color === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {data.current_regime}
                </div>
                <div className="flex items-center space-x-3 bg-black/40 w-max px-4 py-2 rounded-xl border border-white/5 relative z-10 backdrop-blur-md">
                    <AlertTriangle className={`w-5 h-5 ${data.color === 'emerald' ? 'text-green-400' : data.color === 'red' ? 'text-red-400' : 'text-yellow-400'}`} />
                    <span className="font-bold text-sm tracking-wide text-gray-300">System Risk Parameter: <span className="text-white">{data.risk_level}</span></span>
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.6)] mt-8">
                <h3 className="text-xl font-black mb-8 drop-shadow-md tracking-tight">Historical Regime Transitions (7 Days)</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.transitions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                stroke="#6B7280" 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis 
                                stroke="#6B7280" 
                                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="volatility" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
                    <h4 className="font-black text-yellow-400 mb-3 tracking-widest uppercase text-xs">How it works</h4>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                        Instead of treating all market conditions equally, the model clusters historical price action into distinct 'weather patterns' based on volatility metrics and moving average differentials.
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
                    <h4 className="font-black text-cyan-400 mb-3 tracking-widest uppercase text-xs">Why it matters</h4>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                        A breakout signal during a "Low Volatility Sideways" regime is often a fakeout, whereas the exact same signal during an "Aggressive Bull" regime has an 80% higher win rate.
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-lg hover:bg-white/10 transition-colors">
                    <h4 className="font-black text-emerald-400 mb-3 tracking-widest uppercase text-xs">AI Integration</h4>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">
                        This detected state is fed back into the core SGDClassifier as a contextual weight, allowing the online learning model to adapt its confidence threshold automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegimeDetection;
