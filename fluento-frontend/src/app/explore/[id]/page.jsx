"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiActions } from "@/lib/apiActions";
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiActivity, 
  FiUser, 
  FiClock, 
  FiAlertCircle, 
  FiPlayCircle,
  FiCalendar,
  FiRefreshCw,
  FiStar,
  FiShield,
  FiCheckCircle,
  FiMessageSquare,
  FiMaximize2,
  FiMinimize2
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function LessonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchLessonDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiActions.getLessonDetails(id);
      if (res && res.success && res.data) {
        setLesson(res.data);
      } else {
        setLesson(null);
      }
    } catch (error) {
      console.error("Error loading lesson details:", error);
      toast.error("Failed to load lesson content");
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLessonDetails();
  }, [fetchLessonDetails]);

  const handleRatingSubmit = (ratingValue) => {
    setSelectedRating(ratingValue);
    toast.success(`Thank you! You rated this lesson ${ratingValue} stars.`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyStyles = (diff) => {
    switch (diff?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const renderReadableContent = (text, isLargeMode = false) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    const elements = [];
    let currentBlock = [];
    let sectionTitle = "";

    const flushCurrentBlock = (keyIdx) => {
      if (currentBlock.length > 0) {
        elements.push(
          <div key={`grid-wrapper-${keyIdx}`} className="space-y-4 mt-3">
            {sectionTitle && (
              <h3 className={`font-black text-slate-800 border-b border-slate-100 pb-2 tracking-tight uppercase flex items-center gap-2 ${
                isLargeMode ? "text-xl sm:text-2xl mt-8 mb-4" : "text-lg sm:text-xl mt-6 mb-3"
              }`}>
                <span className="bg-indigo-600 rounded-xs inline-block w-1.5 h-4" />
                {sectionTitle}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentBlock.map((item, idx) => (
                <div key={`phrase-${keyIdx}-${idx}`} className={`bg-white border border-slate-200/70 hover:border-indigo-200 rounded-lg shadow-2xs transition-all group flex flex-col justify-between ${
                  isLargeMode ? "p-6" : "p-5"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="inline-flex items-center justify-center bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold uppercase text-[10px] px-2 py-0.5 rounded-sm flex-shrink-0 mt-1">
                        EN
                      </span>
                      <p className={`text-slate-900 leading-relaxed tracking-wide group-hover:text-indigo-950 transition-colors ${
                        isLargeMode ? "text-lg sm:text-xl font-bold" : "text-base sm:text-lg font-bold"
                      }`}>
                        {item.english}
                      </p>
                    </div>
                    {item.bangla && (
                      <div className="flex items-start gap-2.5 pt-3 border-t border-dashed border-slate-100">
                        <span className="inline-flex items-center justify-center bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold uppercase text-[10px] px-2 py-0.5 rounded-sm flex-shrink-0 mt-1">
                          BN
                        </span>
                        <p className={`text-slate-500 leading-relaxed font-medium ${
                          isLargeMode ? "text-base sm:text-lg" : "text-sm sm:text-base"
                        }`}>
                          {item.bangla}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        currentBlock = [];
        sectionTitle = "";
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("###")) {
        flushCurrentBlock(index);
        sectionTitle = trimmed.replace("###", "").trim();
      } 
      else if (trimmed === "---") {
        flushCurrentBlock(index);
        elements.push(<div key={`hr-${index}`} className="my-6 h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />);
      } 
      else if (trimmed.startsWith("* **English:**") || trimmed.startsWith("**English:**") || trimmed.startsWith("English:")) {
        const engText = trimmed.replace(/^(\*\s*)?\*?English:\*?\s*/i, "").replace(/"/g, "");
        currentBlock.push({ english: engText });
      } 
      else if (trimmed.startsWith("* **বাংলা:**") || trimmed.startsWith("**বাংলা:**") || trimmed.startsWith("বাংলা:")) {
        const bgText = trimmed.replace(/^(\*\s*)?\*?বাংলা:\*?\s*/i, "").replace(/"/g, "");
        if (currentBlock.length > 0) {
          currentBlock[currentBlock.length - 1].bangla = bgText;
        }
      }
    });

    flushCurrentBlock(lines.length);

    return elements.length > 0 ? elements : <p className={`whitespace-pre-line text-slate-700 font-medium leading-relaxed ${isLargeMode ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>{text}</p>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 font-sans antialiased animate-pulse">
        <div className="w-11/12 max-w-7xl mx-auto space-y-6">
          <div className="w-24 h-8 bg-slate-200 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="w-full aspect-video bg-slate-200 rounded-lg" />
              <div className="w-3/4 h-6 bg-slate-200 rounded-lg" />
            </div>
            <div className="w-full h-80 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-12 px-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white border border-slate-200/70 rounded-lg p-8 text-center shadow-xs space-y-5">
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center text-rose-500 mx-auto">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">Lesson Not Found</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              The lesson you are looking for might have been removed or is temporarily unavailable.
            </p>
          </div>
          <button
            onClick={() => router.push("/explore")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer uppercase tracking-wider"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 font-sans antialiased">
      
      {/* Immersive Dedicated Fullscreen Reading UI Container */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 md:p-10 animate-fade-in">
          
          {/* Only Sticky Floating Exit Button Component Configuration */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setIsFullscreen(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-black rounded-lg shadow-lg transition-all cursor-pointer uppercase tracking-wider active:scale-95"
            >
              <FiMinimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          </div>

          <div className="max-w-6xl mx-auto space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-2xs">
              <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest block mb-1">Immersive Fullscreen Active</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{lesson.title}</h2>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
              <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-lg space-y-1.5">
                <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FiMessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Overview Hook Summary</span>
                </h3>
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                  {lesson.shortDescription}
                </p>
              </div>

              {lesson.fullDescription && (
                <div className="space-y-4 pt-1">
                  <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <FiCheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Interactive Learning Syllabus</span>
                  </h3>
                  <div className="bg-slate-50/30 border border-slate-100 rounded-lg p-2">
                    {renderReadableContent(lesson.fullDescription, true)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standard Grid Canvas Layer with Expanded Width */}
      <div className="w-11/12 max-w-7xl mx-auto space-y-6">
        
        <div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-xs group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Lessons</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image container set to strict 16:9 aspect ratio */}
            <div className="relative w-full aspect-video bg-white border border-slate-200/70 rounded-lg overflow-hidden shadow-xs">
              {lesson.imageUrl && !thumbnailError ? (
                <Image
                  src={lesson.imageUrl}
                  alt={lesson.title || "Lesson banner"}
                  fill
                  sizes="(max-width: 1280px) 100vw, 66vw"
                  className="object-cover animate-fade-in"
                  priority
                  onError={() => setThumbnailError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50 gap-2">
                  <FiBookOpen className="w-12 h-12 stroke-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">No Visual Preview</span>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200/70 rounded-lg p-5 sm:p-6 md:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                  <FiBookOpen className="w-3.5 h-3.5" />
                  {lesson.category || "General"}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border font-bold text-xs ${getDifficultyStyles(lesson.difficulty)}`}>
                  <FiActivity className="w-3.5 h-3.5" />
                  {lesson.difficulty || "Beginner"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {lesson.title}
              </h1>

              <div className="h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />

              <div className="space-y-6">
                
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-lg space-y-1">
                  <h3 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <FiMessageSquare className="w-3 h-3 text-indigo-500" />
                    <span>Overview Hook Summary</span>
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
                    {lesson.shortDescription}
                  </p>
                </div>

                {lesson.fullDescription && (
                  <div className="space-y-4 pt-1">
                    
                    {/* Fullscreen Trigger Button Placed Right Above The Syllabus Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-3">
                      <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Interactive Learning Syllabus</span>
                      </h3>
                      <button
                        onClick={() => setIsFullscreen(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-md text-indigo-600 text-xs font-bold hover:bg-indigo-50 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
                      >
                        <FiMaximize2 className="w-3 h-3" />
                        <span>Fullscreen Mode</span>
                      </button>
                    </div>

                    <div className="bg-slate-50/30 border border-slate-100 rounded-lg p-2">
                      {renderReadableContent(lesson.fullDescription, false)}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-white border border-slate-200/70 rounded-lg p-6 shadow-xs space-y-5">
              
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-3">
                Lesson Meta Profile
              </h3>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/50 p-3 rounded-lg">
                {lesson.profileImage && !profileError ? (
                  <div className="relative w-9 h-9 rounded-md overflow-hidden border border-slate-200 flex-shrink-0">
                    <Image
                      src={lesson.profileImage}
                      alt={lesson.author || lesson.name || "Student Profile"}
                      fill
                      sizes="36px"
                      className="object-cover"
                      onError={() => setProfileError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center text-slate-400 border border-slate-200 flex-shrink-0">
                    <FiUser className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-wider">Contributor</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{lesson.author || lesson.name || "Peer Student"}</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1 text-xs font-bold">
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-slate-400 uppercase tracking-wide text-[10px]">
                    <FiShield className="w-4 h-4" /> Account Role
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase border font-extrabold ${
                    lesson.role?.toLowerCase() === "admin" 
                      ? "text-rose-600 bg-rose-50 border-rose-100" 
                      : "text-indigo-600 bg-indigo-50 border-indigo-100"
                  }`}>
                    {lesson.role || "Student"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-slate-400 uppercase tracking-wide text-[10px]">
                    <FiClock className="w-4 h-4" /> Pace Interval
                  </span>
                  <span className="text-slate-700 font-semibold">{lesson.duration || "Self-paced"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-slate-400 uppercase tracking-wide text-[10px]">
                    <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" /> Average Rating
                  </span>
                  <span className="text-slate-700 bg-amber-50/60 px-2 py-0.5 border border-amber-100/70 rounded-md text-xs font-bold">
                    {lesson.rating ? `${lesson.rating} / 5` : "4.8 / 5"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-slate-400 uppercase tracking-wide text-[10px]">
                    <FiCalendar className="w-4 h-4" /> Published
                  </span>
                  <span className="text-slate-600 font-semibold">{formatDate(lesson.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-slate-400 uppercase tracking-wide text-[10px]">
                    <FiRefreshCw className="w-3.5 h-3.5" /> Delta Version
                  </span>
                  <span className="text-slate-600 font-semibold">{formatDate(lesson.updatedAt)}</span>
                </div>

              </div>

              <button 
                onClick={() => toast.success("Initializing AI practice core...")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider"
              >
                <FiPlayCircle className="w-4 h-4" />
                <span>Initialize AI Practice</span>
              </button>

            </div>

            <div className="bg-white border border-slate-200/70 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rating Analytics</h4>
                <p className="text-[10px] text-slate-400 font-medium">Distribution breakdown based on learners feedback.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-3">5</span>
                  <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-md overflow-hidden">
                    <div className="w-4/5 h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-xs" />
                  </div>
                  <span className="text-slate-400 font-medium text-[10px]">82%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-3">4</span>
                  <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-md overflow-hidden">
                    <div className="w-1/5 h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-xs" />
                  </div>
                  <span className="text-slate-400 font-medium text-[10px]">14%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="w-3">3</span>
                  <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-md overflow-hidden">
                    <div className="w-1/12 h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-xs" />
                  </div>
                  <span className="text-slate-400 font-medium text-[10px]">4%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-lg p-5 shadow-xs space-y-3.5">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rate This Resource</h4>
                <p className="text-[11px] text-slate-400 font-medium">Encourage peer students by leaving your feedback evaluation.</p>
              </div>
              
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingSubmit(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform duration-700 hover:scale-110 focus:outline-hidden cursor-pointer"
                  >
                    <FiStar 
                      className={`w-5 h-5 ${
                        star <= (hoveredStar || selectedRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}