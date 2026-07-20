"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiActivity } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center antialiased">
      
      {/* Abstract Typo Vector Grid */}
      <div className="relative mb-6 flex items-center justify-center select-none cursor-default">
        {/* background grid trace decoration */}
        <div className="absolute text-[140px] md:text-[200px] font-black text-slate-100 tracking-tighter z-0 font-mono">
          404
        </div>
        
        {/* Foreground interacting element */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-full shadow-sm">
            Status: Fragmented_Path
          </span>
        </div>
      </div>

      {/* Conceptual Heading & Interactive Copy */}
      <div className="space-y-4 max-w-xl z-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
          Syntax Error. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Page Not Found.
          </span>
        </h1>
        
        <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
          The link you followed might be broken, or the page has been permanently moved to a new destination workspace.
        </p>
      </div>

      {/* Ultra-Modern Action Gateway */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 w-full z-10">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold rounded transition-all duration-300 shadow-lg shadow-slate-950/10 hover:shadow-indigo-600/20 group"
        >
          <span>Go Home</span>
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/explore"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 shadow shadow-base-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded transition-all duration-200 border border-slate-200/40"
        >
          <FiActivity className="w-4 h-4 text-slate-500" />
          <span>Go Explore</span>
        </Link>
      </div>

      {/* Dynamic Status Ticker at bottom */}
      <div className="mt-20 flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Core Engine Online</span>
        <span className="text-slate-200">|</span>
        <span>Fluento-Node-V1</span>
      </div>

    </div>
  );
}