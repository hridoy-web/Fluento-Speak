"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global App Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200/60 rounded-2xl p-8 text-center space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        
        {/* Error Icon Block */}
        <div className="mx-auto w-16 h-16 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center">
          <FiAlertTriangle className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            An unexpected error occurred in the application workspace. Let's try to reload the current page or return home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <FiHome className="w-3.5 h-3.5" />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}