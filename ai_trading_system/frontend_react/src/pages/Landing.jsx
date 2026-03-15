import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, PieChart, AlertCircle, TrendingUp, Activity, MessageSquare, ArrowRight, Network, ShieldOff, EyeOff, Code } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeBackground from '../components/ThreeBackground';

// Register standard ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const containerRef = useRef(null);
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
    },
    {
      title: "Whale Cluster Hunting",
      desc: "Graph Neural Networks mapping institutional accumulation",
      icon: <Network className="w-8 h-8 text-violet-400" />,
      to: "/whales",
      color: "from-violet-500/20 to-violet-900/20",
      border: "border-violet-500/30",
      hover: "hover:border-violet-500"
    },
    {
      title: "Spoofing Detection",
      desc: "Microsecond analysis of fake orderbook walls",
      icon: <ShieldOff className="w-8 h-8 text-orange-400" />,
      to: "/spoofing",
      color: "from-orange-500/20 to-orange-900/20",
      border: "border-orange-500/30",
      hover: "hover:border-orange-500"
    },
    {
      title: "Dark Pool Tracker",
      desc: "On-chain vs Off-chain supply divergence metrics",
      icon: <EyeOff className="w-8 h-8 text-cyan-400" />,
      to: "/darkpool",
      color: "from-cyan-500/20 to-cyan-900/20",
      border: "border-cyan-500/30",
      hover: "hover:border-cyan-500"
    },
    {
      title: "Semantic Auditing",
      desc: "Live LLM Code Vulnerability & Honeypot Front-Running",
      icon: <Code className="w-8 h-8 text-rose-400" />,
      to: "/audit",
      color: "from-rose-500/20 to-rose-900/20",
      border: "border-rose-500/30",
      hover: "hover:border-rose-500"
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Feature Grid Stagger Animation
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          }
        }
      );
      
      // Floating Hero Parallax
      gsap.to(".hero-content", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#030712] text-white selection:bg-cyan-500/30">
      
      {/* 3D Canvas Background fixed to viewport */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="hero-section relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="hero-content text-center max-w-5xl mx-auto backdrop-blur-md bg-white/[0.02] p-8 md:p-16 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium text-xs md:text-sm mb-8 tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Proprietary Neural Architecture Online</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              QUANTUM <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-blue-500 filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                 INTELLIGENCE
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Traditional indicators are dead. Step into the black box of high-frequency signal processing. Leverage Real-time Online Learning and Institutional Deep Liquidity metrics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-5 rounded-[1.25rem] font-bold text-lg inline-flex items-center space-x-3 overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  <span className="relative text-white z-10">Initialize Terminal</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <button className="px-10 py-5 rounded-[1.25rem] font-bold text-lg border border-white/10 hover:bg-white/5 transition-colors backdrop-blur-md">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* --- ABOUT / INTRO SECTION --- */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Predicting the <br/>
              <span className="text-cyan-400">Unpredictable.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Our core engine utilizes Stochastic Gradient Descent (SGD) for continuous weight adaptation, meaning our models learn from every new block produced on-chain. We don't just follow the price; we analyze the intent behind it.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              {[
                { label: "Processing Speed", val: "2.4ms" },
                { label: "Feature Neurons", val: "14.2k" },
                { label: "Chain Coverage", val: "42+" },
                { label: "Signal Accuracy", val: "91.4%" }
              ].map((s, i) => (
                <div key={i} className="border-l border-cyan-500/30 pl-6">
                  <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{s.val}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative bg-white/[0.02] border border-white/10 p-1 rounded-[3rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
              <div className="aspect-square bg-[#050914] rounded-[2.8rem] flex items-center justify-center p-12">
                <div className="text-center">
                   <div className="w-32 h-32 bg-cyan-500/20 rounded-full mx-auto mb-8 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-pulse">
                      <Activity className="w-16 h-16 text-cyan-400" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">Real-time Entropy</h3>
                   <p className="text-gray-500 text-sm">Monitoring Global Market Flux in Micro-intervals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GRID FEATURES SECTION --- */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">THE TOOLKIT</h2>
            <p className="text-gray-400 text-lg font-light tracking-wide uppercase">Institutional grade modules powered by autonomous intelligence</p>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-8"></div>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <Link to={item.to} key={i} className="feature-card block h-full">
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="h-full bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 rounded-[2.5rem] p-10 transition-all duration-500 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] group relative overflow-hidden"
                >
                  <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${item.color} blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700`}></div>
                  
                  <div className="mb-8 bg-black/40 inline-flex p-5 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <div className="text-white transform transition-colors duration-500 group-hover:text-cyan-400">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight group-hover:text-cyan-300 transition-colors uppercase">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light tracking-wide text-sm md:text-base">{item.desc}</p>
                  
                  <div className="mt-8 flex items-center text-xs font-bold text-white/40 group-hover:text-cyan-400 transition-colors tracking-widest uppercase">
                    <span>Initialize Access</span>
                    <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA / BOTTOM SECTION --- */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-[150px] rounded-full"></div>
          <div className="relative text-center backdrop-blur-2xl bg-white/[0.01] border border-white/5 p-20 rounded-[4rem] shadow-2xl">
             <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none">
                READY TO <br/>
                <span className="text-cyan-400">DOMINATE?</span>
             </h2>
             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                Join the quant elite. Access the most advanced crypto intelligence dashboard ever deployed to the public web.
             </p>
             <Link to="/dashboard">
                <button className="px-12 py-6 bg-white text-black font-black text-xl rounded-full hover:bg-cyan-400 transition-all hover:scale-110 shadow-xl tracking-tighter uppercase">
                   Launch Mainframe
                </button>
             </Link>
          </div>
        </div>
        
        {/* Simple Footer */}
        <div className="mt-32 max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="py-12 text-center text-white/20 text-xs font-bold tracking-[0.4em] uppercase">
           &copy; 2024 VISIONX
        </div>
      </section>

    </div>
  );
};

export default Landing;
