"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { apiActions } from "@/lib/apiActions"; 
import LessonCard from "../ui/LessonCard"; 

export default function LatestInsights() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchLatestLessons = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await apiActions.getLatestHomeLessons();
      
      if (response && response.success && Array.isArray(response.data)) {
        setLessons(response.data);
      } else {
        throw new Error("Failed to load valid data structure");
      }
    } catch (error) {
      console.error("Failed to fetch latest insights via action:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestLessons();
  }, []);

  return (
    <section className="bg-slate-50 py-20 px-6 border-y border-slate-100">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Title Area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
              Latest Insights
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Explore Recently <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Added Resources</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl">
              Grow your skills with community-powered English content built for effective practice.
            </p>
          </div>
          
          {!hasError && (
            <Link 
              href="/explore" 
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group cursor-pointer whitespace-nowrap"
            >
              <span>Explore All Lessons</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Dynamic Section States */}
        {loading ? (
          // 1. Loading Skeleton Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="w-full aspect-video bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-5/6" />
                <div className="h-8 bg-slate-100 rounded pt-2" />
              </div>
            ))}
          </div>
        ) : hasError ? (
          // 2. Safe Error Handle Box 
          <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            <div className="p-3 bg-amber-50 rounded-full text-amber-600 border border-amber-100">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Failed to load recent updates</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                We are having trouble connecting to the server.
              </p>
            </div>
            <button
              onClick={fetchLatestLessons}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold rounded transition-colors duration-200 cursor-pointer"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : lessons.length === 0 ? (
          // 3. Empty State
          <div className="w-full bg-white border border-slate-200/60 rounded-2xl p-12 text-center text-slate-400 text-xs font-medium shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            No lessons available at the moment.
          </div>
        ) : (
          // 4. Grid Render Block with 4 Items max
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson._id || lesson.id} lesson={lesson} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}