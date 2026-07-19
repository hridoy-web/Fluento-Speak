"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiBookOpen, FiGlobe, FiTarget, FiMessageSquare, FiTrendingUp, FiCpu, FiZap } from "react-icons/fi";

export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const floatingVariants = (delay, duration) => ({
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: [0, -10, 0],
      transition: {
        opacity: { duration: 0.5, delay },
        y: { duration: duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      },
    },
  });

  return (
    <div className="relative min-h-[95vh] flex flex-col justify-center overflow-x-hidden font-sans antialiased border-b border-slate-100 bg-white py-12 lg:py-0">
      
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 bg-radial from-indigo-50/60 via-white to-slate-50 -z-30" />
      <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-indigo-200/20 rounded-full blur-3xl -z-30 animate-pulse duration-4000" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-sky-200/15 rounded-full blur-3xl -z-30 animate-pulse duration-6000" />

      {/* Main Responsive Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          
          {/* LEFT SIDE CARDS - Laptop  Desktop  */}
          <div className="hidden lg:flex flex-col gap-12 w-56 shrink-0 text-left">
            {/* Card 1: Freelancing */}
            <motion.div 
              variants={floatingVariants(0, 3.5)} initial="hidden" animate="visible"
              className="p-4 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-xl shadow-[0_8px_25px_rgba(79,70,229,0.05)]"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
                <FiTrendingUp className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Freelancing</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Client Acquisition</h4>
              <p className="text-[11px] text-slate-500 leading-normal">Master proposals, contract negotiation, and live project pitches.</p>
            </motion.div>

            {/* Card 2: Vocabulary */}
            <motion.div 
              variants={floatingVariants(0.2, 4)} initial="hidden" animate="visible"
              className="p-4 bg-white/90 backdrop-blur-md border border-emerald-100 rounded-xl shadow-[0_8px_25px_rgba(16,185,129,0.05)] lg:translate-x-[-20px]"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                <FiBookOpen className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Vocabulary</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Corporate Phrasals</h4>
              <p className="text-[11px] text-slate-500 leading-normal">Learn high-converting professional idioms and power verbs.</p>
            </motion.div>
          </div>

          {/* CENTER CONTENT CONTAINER */}
          <div className="flex-1 max-w-2xl mx-auto text-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8">
              
              {/* Tagline Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs">
                  <FiGlobe className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin-slow" />
                  Empowering Global Communication
                </span>
              </motion.div>

              {/* Typography Heading Group */}
              <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.12]">
                  Master English for <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                    Freelancing & Daily Life
                  </span>
                </h1>
                <p className="max-w-md sm:max-w-xl mx-auto text-xs sm:text-sm md:text-base text-slate-500 font-medium leading-relaxed px-2">
                  Elevate your career prospects with localized scenario training modules. 
                  Break communication barriers down and confidently close elite global client acquisitions.
                </p>
              </motion.div>

              {/* Core Feature Matrix */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-x-4 sm:gap-x-6 text-[11px] sm:text-xs font-bold text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <FiBookOpen className="text-indigo-500 w-3.5 h-3.5" />
                  <span>Interactive Syllabus</span>
                </div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <FiTarget className="text-emerald-500 w-3.5 h-3.5" />
                  <span>Scenario-Based</span>
                </div>
              </motion.div>

              {/* Call to Actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 px-4 sm:px-0">
                <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Link href="/explore" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-sm font-semibold rounded-md shadow-sm transition-all tracking-wide cursor-pointer">
                    <span>Explore All Lessons</span>
                    <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </motion.div>

                <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Link href="/items/manage" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-md shadow-2xs text-sm font-semibold transition-all tracking-wide cursor-pointer">
                    <FiPlay className="w-3.5 h-3.5 fill-current text-violet-500" />
                    <span>Workspace Dashboard</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Central Floating AI Helper Card */}
              <motion.div 
                variants={floatingVariants(0.4, 4)} initial="hidden" animate="visible"
                className="mt-5 inline-block w-full max-w-xs p-4 bg-gradient-to-br from-white to-rose-50/60 backdrop-blur-md border border-rose-100 rounded-xl shadow-[0_10px_25px_rgba(244,63,94,0.06)] text-center"
                style={{ willChange: "transform" }}
              >
                <div className="flex items-center justify-center gap-2 text-rose-500 mb-1.5">
                  <FiZap className="w-4 h-4 animate-bounce" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">AI Integration</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">Interactive AI Assistant</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Fix structure real-time and practice conversation loops.</p>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT SIDE CARDS - Laptop Desktop  */}
          <div className="hidden lg:flex flex-col gap-12 w-56 shrink-0 text-left">
            {/* Card 3: Speaking */}
            <motion.div 
              variants={floatingVariants(0.1, 3.8)} initial="hidden" animate="visible"
              className="p-4 bg-white/90 backdrop-blur-md border border-violet-100 rounded-xl shadow-[0_8px_25px_rgba(139,92,246,0.05)]"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center gap-2 text-violet-600 mb-1.5">
                <FiMessageSquare className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Speaking</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Interactive Audio</h4>
              <p className="text-[11px] text-slate-500 leading-normal">Develop flawless verbal responses using real-world case simulations.</p>
            </motion.div>

            {/* Card 4: Grammar */}
            <motion.div 
              variants={floatingVariants(0.3, 4.2)} initial="hidden" animate="visible"
              className="p-4 bg-white/90 backdrop-blur-md border border-amber-100 rounded-xl shadow-[0_8px_25px_rgba(245,158,11,0.05)] lg:translate-x-[20px]"
              style={{ willChange: "transform" }}
            >
              <div className="flex items-center gap-2 text-amber-600 mb-1.5">
                <FiCpu className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Grammar</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Functional Structure</h4>
              <p className="text-[11px] text-slate-500 leading-normal">Simplify tense deployments without memorizing endless basic rule charts.</p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* MOBILE MARQUEE */}
      <div className="w-full mt-6 lg:hidden overflow-hidden relative py-2 select-none z-10">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
        
        <motion.div 
          className="flex gap-4 w-max px-4"
          animate={{ x: [0, -480] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 15, ease: "linear" } }}
          style={{ willChange: "transform" }} 
        >
          {/* Mobile Cards (Fallback static array structure for fast rendering) */}
          {[
            { id: "m1", tag: "Freelancing", title: "Client Acquisition", desc: "Master proposals, contract negotiation, and live project pitches.", color: "text-indigo-600", border: "border-indigo-100", icon: <FiTrendingUp className="w-4 h-4" /> },
            { id: "m2", tag: "Vocabulary", title: "Corporate Phrasals", desc: "Learn high-converting professional idioms and power verbs.", color: "text-emerald-600", border: "border-emerald-100", icon: <FiBookOpen className="w-4 h-4" /> },
            { id: "m3", tag: "Speaking", title: "Interactive Audio", desc: "Develop flawless verbal responses using real-world case simulations.", color: "text-violet-600", border: "border-violet-100", icon: <FiMessageSquare className="w-4 h-4" /> },
            { id: "m4", tag: "Grammar", title: "Functional Structure", desc: "Simplify tense deployments without memorizing endless basic rule charts.", color: "text-amber-600", border: "border-amber-100", icon: <FiCpu className="w-4 h-4" /> },
          ].map((card) => (
            <div key={card.id} className={`w-60 shrink-0 p-4 bg-white border ${card.border} rounded-xl shadow-xs`}>
              <div className={`flex items-center gap-2 ${card.color} mb-1.5`}>
                {card.icon}
                <span className="text-[10px] uppercase font-bold tracking-wider">{card.tag}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">{card.title}</h4>
              <p className="text-[11px] text-slate-500 leading-normal">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}