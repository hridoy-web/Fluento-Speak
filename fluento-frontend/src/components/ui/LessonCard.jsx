"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiUser, FiImage, FiBookOpen, FiActivity } from "react-icons/fi";

export default function LessonCard({ lesson }) {
  const [profileError, setProfileError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const getDifficultyStyles = (diff) => {
    switch (diff?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group">
      <div>
        {/* Aspect-Video Thumbnail */}
        <div className="relative w-full aspect-video bg-slate-50 overflow-hidden">
          {lesson?.imageUrl && !thumbnailError ? (
            <Image
              src={lesson.imageUrl}
              alt={lesson?.title || "Lesson thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
              onError={() => setThumbnailError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5">
              <FiImage className="w-7 h-7 stroke-1" />
              <span className="text-[10px] uppercase font-bold tracking-wider">No Preview Available</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[11px]">
              <FiBookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              {lesson?.category || "General"}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-[11px] ${getDifficultyStyles(lesson?.difficulty)}`}>
              <FiActivity className="w-3.5 h-3.5 flex-shrink-0" />
              {lesson?.difficulty || "Beginner"}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {lesson?.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
              {lesson?.shortDescription || "No description provided for this lesson."}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mx-5 mb-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Author Info */}
        <div className="flex items-center gap-2 max-w-[55%]">
          {lesson?.profileImage && !profileError ? (
            <div className="relative w-6.5 h-6.5 rounded-full overflow-hidden border border-slate-200/80 flex-shrink-0">
              <Image
                src={lesson.profileImage}
                alt={lesson?.author || "Author"}
                fill
                sizes="26px"
                className="object-cover"
                onError={() => setProfileError(true)}
              />
            </div>
          ) : (
            <div className="w-6.5 h-6.5 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 flex-shrink-0">
              <FiUser className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-[11px] font-semibold text-slate-600 truncate">
            {lesson?.author || lesson?.name || "Anonymous"}
          </span>
        </div>

        {/* Action Button */}
        <Link
          href={`/explore/${lesson?._id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded shadow-xs transition-colors duration-200 whitespace-nowrap cursor-pointer"
        >
          <span>Start Lesson</span>
          <FiArrowRight className="w-3.5 h-3.5 stroke-3" />
        </Link>
      </div>
    </div>
  );
}