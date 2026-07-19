"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiActions } from "@/lib/apiActions";
import { FiSearch, FiBookOpen, FiChevronLeft, FiChevronRight, FiSliders, FiBarChart2 } from "react-icons/fi";
import toast from "react-hot-toast";
import LessonCard from "@/components/ui/LessonCard";

const CATEGORIES = ["All", "Freelancing English", "Speaking", "Vocabulary", "Daily Conversation", "Grammar"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS = [
  { label: "Latest First", value: "date" },
  { label: "Top Rated", value: "rating" },
  { label: "Price", value: "price" }
];

function LessonCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] animate-pulse">
      <div className="w-full h-40 bg-slate-200 rounded-xl" />
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-slate-200 rounded-md" />
        <div className="w-16 h-5 bg-slate-200 rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
        <div className="w-full h-3 bg-slate-200 rounded-md" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-200 rounded-full" />
          <div className="w-20 h-3 bg-slate-200 rounded-md" />
        </div>
        <div className="w-24 h-8 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const currentDifficulty = searchParams.get("difficulty") || "All";
  const currentSort = searchParams.get("sortBy") || "date";
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;
  const currentSearch = searchParams.get("search") || "";

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 8,
        sortBy: currentSort,
        order: "desc"
      };

      if (currentCategory !== "All") params.category = currentCategory;
      if (currentDifficulty !== "All") params.difficulty = currentDifficulty;
      if (currentSearch.trim() !== "") params.search = currentSearch;

      const res = await apiActions.getAllLessons(params);
      if (res && res.success) {
        setLessons(res.data || []);
        setPagination({
          totalPages: res.totalPages || 1,
          total: res.total || 0
        });
      } else {
        setLessons([]);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentDifficulty, currentSort, currentPage, currentSearch]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "All" || value === "" || value === 1) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/explore?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput, page: 1 });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 font-sans antialiased">
      <div className="w-11/12 mx-auto space-y-8">
        
        {/* Brand Main Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Explore AI-Enhanced Lessons
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Grow your skills with community-powered English content built for effective practice.
          </p>
        </div>

        {/* Super Premium One-Line Filter Controller */}
        <div className="bg-white p-3.5 border border-slate-200/60 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col xl:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full xl:w-72 flex-shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search and press enter..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/70 rounded text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-700 placeholder-slate-400"
            />
          </form>

          {/* Middle Side: Inline Category Tabs (Horizontal Scrollable Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full xl:w-auto py-1 justify-start xl:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateUrlParams({ category: cat, page: 1 })}
                className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  currentCategory === cat
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Side: Dropdown Caps (Difficulty & Sort) */}
          <div className="flex items-center justify-center gap-2 w-full xl:w-auto  flex-shrink-0">
            
            {/* Compact Difficulty Dropdown */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5 hover:border-slate-300 transition-all">
              <FiSliders className="w-3.5 h-3.5 text-indigo-500 mr-1.5 flex-shrink-0" />
              <select
                value={currentDifficulty}
                onChange={(e) => updateUrlParams({ difficulty: e.target.value, page: 1 })}
                className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer pr-3"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>{diff === "All" ? "All Levels" : diff}</option>
                ))}
              </select>
            </div>

            {/* Compact Sorting Dropdown */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5 hover:border-slate-300 transition-all">
              <FiBarChart2 className="w-3.5 h-3.5 text-purple-500 mr-1.5 flex-shrink-0" />
              <select
                value={currentSort}
                onChange={(e) => updateUrlParams({ sortBy: e.target.value, page: 1 })}
                className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer pr-3"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, idx) => (
              <LessonCardSkeleton key={idx} />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
            <FiBookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">No lessons found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => updateUrlParams({ page: currentPage - 1 })}
                  className="p-2 border border-slate-200 bg-white rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => updateUrlParams({ page: currentPage + 1 })}
                  className="p-2 border border-slate-200 bg-white rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}