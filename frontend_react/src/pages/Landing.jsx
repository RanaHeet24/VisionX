import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, PieChart, AlertCircle, TrendingUp, Activity, MessageSquare, ArrowRight } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const features = [
    {
      title: "Core ML Dashboard",
      desc: "Real-time Online Learning (SGD) signal generation",
      icon: <Activity className="w-8 h-8 text-blue-400" />,
      to: "/dashboard",
      color: "from-blue-500/20 to-blue-900/20",
      border: "border-blue-500/30",
      hover: "hover:border-blue-500"
    },
    {
      title: "Market Regime",
      desc: "Unsupervised clustering detects macro market weather",
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      to: "/regime",
      color: "from-purple-500/20 to-purple-900/20",
      border: "border-purple-500/30",
      hover: "hover:border-purple-500"
    },
    {
      title: "Explainable AI",
      desc: "SHAP-based transparent feature importance breakdown",
      icon: <PieChart className="w-8 h-8 text-emerald-400" />,
      to: "/explain",
      color: "from-emerald-500/20 to-emerald-900/20",
      border: "border-emerald-500/30",
      hover: "hover:border-emerald-500"
    },
    {
      title: "Liquidation Heatmap",
      desc: "Predict massive short/long squeezes and OI clusters",
      icon: <AlertCircle className="w-8 h-8 text-red-400" />,
      to: "/liquidation",
      color: "from-red-500/20 to-red-900/20",
      border: "border-red-500/30",
      hover: "hover:border-red-500"
    },
    {
      title: "Lead/Lag Correlation",
      desc: "Detect altcoins prepping to pump right after majors do",
      icon: <TrendingUp className="w-8 h-8 text-amber-400" />,
      to: "/leadlag",
      color: "from-amber-500/20 to-amber-900/20",
      border: "border-amber-500/30",
      hover: "hover:border-amber-500"
    },
    {
      title: "Sentiment Fusion",
      desc: "LLM-driven social sentiment injected into quantitative models",
      icon: <MessageSquare className="w-8 h-8 text-pink-400" />,
      to: "/sentiment",
      color: "from-pink-500/20 to-pink-900/20",
      border: "border-pink-500/30",
      hover: "hover:border-pink-500"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center max-w-4xl mx-auto mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Next-Gen Trading Intelligence
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Go beyond conventional static indicators. Leverage real-time Online Learning, Explainable AI, and institutional-grade metrics to dominate the crypto markets.
        </p>
        
        <Link to="/dashboard">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg inline-flex items-center space-x-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-shadow"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Grid Features */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
      >
        {features.map((item, i) => (
          <Link to={item.to} key={i}>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`h-full bg-gradient-to-br ${item.color} border ${item.border} ${item.hover} rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm shadow-xl`}
            >
              <div className="mb-4 bg-gray-900/50 inline-block p-3 rounded-xl border border-gray-700/50">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>

    </div>
  );
};

export default Landing;
