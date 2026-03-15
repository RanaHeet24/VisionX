import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Menu, X, BarChart2, PieChart, TrendingUp, Layers, AlertCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", icon: <BarChart2 className="w-5 h-5" />, label: "Dashboard" },
    { to: "/regime", icon: <Layers className="w-5 h-5" />, label: "Market Regime" },
    { to: "/explain", icon: <PieChart className="w-5 h-5" />, label: "Explainable AI (SHAP)" },
    { to: "/liquidation", icon: <AlertCircle className="w-5 h-5" />, label: "Liquidation Heatmap" },
    { to: "/leadlag", icon: <TrendingUp className="w-5 h-5" />, label: "Lead/Lag Engine" },
    { to: "/stoploss", icon: <Activity className="w-5 h-5" />, label: "Dynamic Stop-Loss" },
    { to: "/sentiment", icon: <MessageSquare className="w-5 h-5" />, label: "Social Sentiment" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 z-50">
        <NavLink to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Signal<span className="text-blue-500"> Engine</span></span>
        </NavLink>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
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
            className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-40 ${isOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="p-6 hidden md:flex items-center space-x-3 mb-4">
              <NavLink to="/" className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">AI Signal<span className="text-blue-500"> Engine</span></h1>
              </NavLink>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 md:mt-0">Core Modules</p>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`
                  }
                >
                  {link.icon}
                  <span className="font-medium text-sm">{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 mx-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>System Online</span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto transition-all w-full`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pt-20 md:pt-8 min-h-screen">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
