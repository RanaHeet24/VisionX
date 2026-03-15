import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, Menu, X, BarChart2, PieChart, TrendingUp, Layers, AlertCircle, MessageSquare, Network, ShieldOff, EyeOff, Code } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './ThreeBackground';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navCategories = [
    {
      title: "Core Intelligence",
      links: [
        { to: "/dashboard", icon: <BarChart2 className="w-4 h-4" />, label: "War Room Mainframe" },
        { to: "/regime", icon: <Layers className="w-4 h-4" />, label: "Market Regime" },
        { to: "/explain", icon: <PieChart className="w-4 h-4" />, label: "Explainable AI" },
      ]
    },
    {
      title: "Alpha Predictors",
      links: [
        { to: "/liquidation", icon: <AlertCircle className="w-4 h-4" />, label: "Liquidation Terrain" },
        { to: "/leadlag", icon: <TrendingUp className="w-4 h-4" />, label: "Lead/Lag Engine" },
        { to: "/stoploss", icon: <Activity className="w-4 h-4" />, label: "Dynamic Stop-Loss" },
        { to: "/sentiment", icon: <MessageSquare className="w-4 h-4" />, label: "Sentiment Spheres" },
      ]
    },
    {
      title: "Predator Suite",
      links: [
        { to: "/whales", icon: <Network className="w-4 h-4" />, label: "Whale Cluster Hunt" },
        { to: "/spoofing", icon: <ShieldOff className="w-4 h-4" />, label: "Spoofing Radar" },
        { to: "/darkpool", icon: <EyeOff className="w-4 h-4" />, label: "Dark Pool Funnel" },
        { to: "/audit", icon: <Code className="w-4 h-4" />, label: "Semantic Audit" },
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-cyan-500/30">
      
      {/* 3D Background - shared across all module pages */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <ThreeBackground />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden relative z-50 flex items-center justify-between p-4 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <NavLink to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <Activity className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-black tracking-widest">VISION<span className="text-yellow-400">X</span></span>
        </NavLink>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white transition-colors">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col z-40 ${isOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="p-6 hidden md:flex items-center space-x-3 mb-4">
              <NavLink to="/" className="flex items-center space-x-3 group w-full">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] group-hover:scale-105 transition-transform">
                  <Activity className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-md">VISION<span className="text-yellow-400">X</span></h1>
              </NavLink>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-4 space-y-6 custom-scrollbar">
              {navCategories.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{cat.title}</p>
                  {cat.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                          isActive 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-yellow-400 border-l-2 border-yellow-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent'
                        }`
                      }
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${location.pathname === link.to ? 'bg-yellow-400/10' : 'bg-black/40 group-hover:bg-white/10'}`}>
                        {link.icon}
                      </div>
                      <span className="font-bold text-[13px] tracking-wide">{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center space-x-3 text-xs text-yellow-500 bg-yellow-500/10 px-4 py-3 rounded-xl border border-yellow-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-bold tracking-widest uppercase">System Online</span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto transition-all w-full relative z-10`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pt-20 md:pt-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
