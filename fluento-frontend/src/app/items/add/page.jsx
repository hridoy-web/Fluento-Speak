"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiActions } from "@/lib/apiActions";
import { uploadImage } from "@/lib/uploadImage";
import { authClient } from "@/lib/auth-client";
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiFileText, 
  FiGrid, 
  FiActivity, 
  FiImage, 
  FiPlusCircle,
  FiUploadCloud
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddLessonPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession(); 
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    "Freelancing English", 
    "Speaking", 
    "Vocabulary", 
    "Daily Conversation", 
    "Grammar"
  ];

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: categories[0],
    difficulty: "Beginner",
    imageUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload thumbnail to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle payload submission with dynamic BetterAuth data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.shortDescription || !formData.fullDescription || !formData.category || !formData.difficulty || !formData.imageUrl) {
      toast.error("Please fill in all fields and upload a cover image.");
      return;
    }

    setLoading(true);
    try {
      const currentUser = session?.user || session;

      const payload = {
        ...formData,
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
        role: currentUser?.role || "Student", 
        author: currentUser?.name || "Anonymous Student", 
        profileImage: currentUser?.image || "" 
      };

      const res = await apiActions.addLesson(payload);
      
      if (res && res.success) {
        toast.success(res.message || "Lesson published successfully!");
        router.push("/explore");
      } else {
        toast.error(res.message || "Failed to create lesson.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while creating the lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 font-sans antialiased">
      <div className="w-11/12 max-w-3xl mx-auto space-y-6">
        
        {/* Navigation action */}
        <div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-xs group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Cancel & Go Back</span>
          </Link>
        </div>

        {/* Primary form wrapper */}
        <div className="bg-white border border-slate-200/70 rounded p-6 md:p-10 shadow-xs space-y-8">
          
          {/* Enhanced premium header configuration */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
              Contribute a New Study Resource
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
              Empower the learning community by structuring an interactive lesson block, sharing study guidelines, or distributing essential linguistic references.
            </p>
          </div>

          <div className="h-px bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />

          {/* Form container entrypoint */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title container */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                <FiBookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Lesson Title <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mastering Idioms for Professional Workplaces"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all"
                required
              />
            </div>

            {/* Layout metadata segmentation selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Category selections */}
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                  <FiGrid className="w-3.5 h-3.5 text-slate-400" />
                  <span>Category <span className="text-rose-500">*</span></span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all cursor-pointer"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty configuration parameters */}
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                  <FiActivity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Difficulty Level <span className="text-rose-500">*</span></span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all cursor-pointer"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

            </div>

            {/* Graphic asset file dropzones */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                <FiImage className="w-3.5 h-3.5 text-slate-400" />
                <span>Thumbnail Cover Image <span className="text-rose-500">*</span></span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                
                {/* File stream dropzone anchor */}
                <div className="md:col-span-2 relative flex items-center justify-center w-full h-28 border border-dashed border-slate-300 rounded bg-slate-50/50 hover:bg-slate-50/80 hover:border-indigo-500 transition-all group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage || loading}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:pointer-events-none"
                  />
                  <div className="flex flex-col items-center gap-1.5 text-center px-4">
                    <FiUploadCloud className={`w-6 h-6 ${uploadingImage ? "text-indigo-600 animate-bounce" : "text-slate-400 group-hover:text-indigo-600"} transition-colors`} />
                    <span className="text-xs font-bold text-slate-600">
                      {uploadingImage ? "Uploading Asset to ImgBB..." : "Click to Upload Banner Image"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">PNG, JPG or JPEG up to 5MB</span>
                  </div>
                </div>

                {/* Cover graphic render interface */}
                <div className="w-full h-28 relative bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center">
                  {formData.imageUrl ? (
                    <img 
                      src={formData.imageUrl} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No Preview</span>
                  )}
                </div>
              </div>
            </div>

            {/* Display list short summary container */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                <FiFileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Short Summary <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="A high-retention summary statement or quick target descriptor hook..."
                maxLength={160}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all"
                required
              />
            </div>

            {/* Comprehensive details content canvas blocks */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                <FiFileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Detailed Lesson Content <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows={6}
                placeholder="Draft curriculum blueprints, technical markdown text notes, rules, explanations or explicit exercise lists here..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all resize-y"
                required
              />
            </div>

            <div className="h-px bg-slate-100 pt-2" />

            {/* Dispatch interface controls */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded shadow-xs active:scale-[0.99] transition-all disabled:pointer-events-none cursor-pointer tracking-wider uppercase"
              >
                <FiPlusCircle className="w-3.5 h-3.5" />
                <span>{loading ? "Publishing Data..." : "Publish Lesson Node"}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}