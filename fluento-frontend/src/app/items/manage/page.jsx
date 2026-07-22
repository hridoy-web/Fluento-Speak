"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiActions } from "@/lib/apiActions";
import { uploadImage } from "@/lib/uploadImage";
import {
  FiBookOpen,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiSmile,
  FiUploadCloud
} from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Freelancing English",
  "Speaking",
  "Vocabulary",
  "Daily Conversation",
  "Grammar"
];

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [editingLesson, setEditingLesson] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("");
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editFullDescription, setEditFullDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const loadMyLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiActions.getMyLessons();
      if (res && res.success) {
        setLessons(res.data || []);
      } else {
        setLessons([]);
        toast.error(res?.message || "Could not fetch your lessons");
      }
    } catch (error) {
      console.error("Error fetching my lessons:", error);
      toast.error(error?.message || "Failed to sync workspace data");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyLessons();
  }, [loadMyLessons]);

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setEditTitle(lesson.title || "");
    setEditCategory(lesson.category || CATEGORIES[0]);
    setEditDifficulty(lesson.difficulty || "Beginner");
    setEditShortDescription(lesson.shortDescription || "");
    setEditFullDescription(lesson.fullDescription || "");
    setEditImageUrl(lesson.imageUrl || "");
  };

  const closeEditModal = () => {
    setEditingLesson(null);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const toastId = toast.loading("Uploading image...");
    try {
      const url = await uploadImage(file);
      if (url) {
        setEditImageUrl(url);
        toast.success("Banner image loaded successfully", { id: toastId });
      } else {
        toast.error("Failed to parse cloud response link", { id: toastId });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed", { id: toastId });
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return toast.error("Title cannot be blank");

    setSubmitting(true);
    try {
      const payload = {
        title: editTitle,
        category: editCategory,
        difficulty: editDifficulty,
        shortDescription: editShortDescription,
        fullDescription: editFullDescription,
        imageUrl: editImageUrl,
      };

      const res = await apiActions.updateLesson(editingLesson._id, payload);
      if (res && res.success) {
        toast.success(res.message || "Lesson changes synchronized");
        closeEditModal();
        loadMyLessons();
      } else {
        toast.error(res?.message || "Failed to update lesson");
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      // Catch block error handling updated for accurate toast message
      toast.error(error?.message || "Update failed. Please check server logs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setSubmitting(true);
    try {
      const res = await apiActions.deleteLesson(deleteTargetId);
      if (res && res.success) {
        toast.success(res.message || "Lesson deleted successfully");
        setDeleteTargetId(null);
        loadMyLessons();
      } else {
        toast.error(res?.message || "Failed to purge lesson");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error(error?.message || "Delete failed. Check server permissions.");
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="w-8 h-8 text-indigo-600 animate-spin stroke-[1.5]" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Loading Workspace Canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 font-sans antialiased">
      <div className="w-11/12 max-w-7xl mx-auto space-y-8">
        
        {/* Workspace Dashboard Header */}
        <div className="bg-white border border-slate-200/70 p-6 rounded-lg shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="bg-indigo-600 inline-block w-1.5 h-5 rounded-xs" />
              Manage Lessons Workspace
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Review, update, and manage your customized lesson templates.
            </p>
          </div>
          <Link
            href="/items/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer tracking-wider uppercase"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Lesson</span>
          </Link>
        </div>

        {/* Lessons List Grid View */}
        {lessons.length === 0 ? (
          <div className="bg-white border border-slate-200/70 rounded-lg p-12 text-center shadow-2xs space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 mx-auto">
              <FiSmile className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Workspace Empty</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                You haven't contributed any lessons yet.
              </p>
            </div>
            <Link
              href="/items/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer tracking-wider uppercase"
            >
              <span>Create First Template</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-200/70 hover:border-indigo-200/80 rounded-lg shadow-2xs overflow-hidden transition-all group flex flex-col"
              >
                <div className="relative w-full aspect-video bg-slate-50 border-b border-slate-100 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Lesson thumbnail"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5">
                      <FiBookOpen className="w-10 h-10 stroke-[1.2]" />
                      <span className="text-[9px] font-bold tracking-widest uppercase">No Visual Found</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs border border-slate-200/60 text-slate-800 font-bold text-[10px]">
                      {item.category || "General"}
                    </span>
                    <span className={`px-2 py-0.5 rounded border font-bold text-[10px] uppercase shadow-2xs ${getDifficultyStyles(item.difficulty)}`}>
                      {item.difficulty || "Beginner"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
                      {item.shortDescription || "No detailed overview specified."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-md transition-all cursor-pointer"
                    >
                      <FiEdit3 className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(item._id)}
                      className="inline-flex items-center justify-center p-2 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-md transition-all cursor-pointer"
                      title="Purge Template"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* EDIT MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white border border-slate-200/80 rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <FiEdit3 className="text-indigo-600 w-4 h-4" />
                <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">Modify Lesson Information</h3>
              </div>
              <button 
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs font-bold text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 text-sm font-semibold focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Category Tag</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Difficulty Grade</label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Banner Image Upload</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 border border-dashed border-slate-300 hover:border-indigo-500 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={imageUploading}
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      {imageUploading ? (
                        <FiLoader className="w-4 h-4 text-indigo-500 animate-spin" />
                      ) : (
                        <FiUploadCloud className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      )}
                      <span className="text-slate-600 font-semibold truncate max-w-[160px]">
                        {editImageUrl ? "Change Photo" : "Choose File"}
                      </span>
                    </label>
                    {editImageUrl && (
                      <div className="relative w-10 h-10 rounded-md border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100">
                        <Image src={editImageUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Short Description</label>
                <textarea
                  rows={2}
                  value={editShortDescription}
                  onChange={(e) => setEditShortDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3.5 text-slate-800 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">Full Description (Markdown)</label>
                <textarea
                  rows={8}
                  value={editFullDescription}
                  onChange={(e) => setEditFullDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3.5 text-slate-800 font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={submitting || imageUploading}
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || imageUploading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-all shadow-xs disabled:opacity-50 font-bold"
                >
                  {submitting ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiCheckCircle className="w-3.5 h-3.5" />}
                  <span>Save Optimization</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-6 shadow-xl text-center space-y-5">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center rounded-lg mx-auto">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-slate-800 uppercase tracking-wide">Delete Content Permanently?</h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Are you sure you want to delete this lesson? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 font-bold text-xs">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer transition-colors font-bold"
              >
                Cancel Action
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition-all shadow-xs disabled:opacity-50 inline-flex items-center justify-center gap-1.5 font-bold"
              >
                {submitting && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}