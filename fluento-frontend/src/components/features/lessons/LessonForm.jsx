'use client';

import { useState, useRef } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { uploadImage } from '@/lib/uploadImage';
import toast from 'react-hot-toast';
import { FiUpload, FiCheck } from 'react-icons/fi';

const CATEGORIES = ['Speaking', 'Vocabulary', 'Grammar', 'Daily Conversation', 'Pronunciation', 'Writing', 'Listening'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function LessonForm({ onSubmit, initialData = {}, isSubmitting = false }) {
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading cover image...');
    try {
      const secureUrl = await uploadImage(file);
      setImageUrl(secureUrl);
      toast.success('Cover image uploaded successfully.', { id: toastId });
    } catch {
      toast.error('Failed to upload image.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Batch extract data cleanly in one single batch
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData);
    
    // Add imageUrl manually if it's stored in state
    formValues.imageUrl = imageUrl;

    // Validate
    const errs = {};
    if (!formValues.title || !formValues.title.trim()) {
      errs.title = 'Title is required.';
    } else if (formValues.title.length > 150) {
      errs.title = 'Max 150 characters.';
    }
    
    if (!formValues.shortDescription || !formValues.shortDescription.trim()) {
      errs.shortDescription = 'Short description is required.';
    } else if (formValues.shortDescription.length > 300) {
      errs.shortDescription = 'Max 300 characters.';
    }

    if (!formValues.fullDescription || !formValues.fullDescription.trim()) {
      errs.fullDescription = 'Full lesson content is required.';
    }

    if (!formValues.category) {
      errs.category = 'Please select a category.';
    }

    if (!formValues.difficulty) {
      errs.difficulty = 'Please select a difficulty level.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Basic Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-5">
        <h2 className="font-display font-bold text-primary text-lg border-b border-slate-100 pb-3 mb-2">Basic Information</h2>

        <Input
          id="title"
          label="Lesson Title"
          name="title"
          defaultValue={initialData.title || ''}
          placeholder="e.g., 10 Essential Phrasal Verbs for Daily Conversation"
          maxLength={150}
          error={errors.title}
          required
        />

        <div className="flex flex-col w-full">
          <label htmlFor="shortDescription" className="block text-sm font-semibold text-primary/95 mb-2">
            Short Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2.5}
            defaultValue={initialData.shortDescription || ''}
            placeholder="A brief summary shown on lesson cards (max 300 characters)"
            maxLength={300}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-primary placeholder-muted focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.shortDescription ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-border focus:border-secondary focus:ring-secondary/20'
            }`}
          />
          {errors.shortDescription && <p className="text-xs text-red-505 mt-1.5">{errors.shortDescription}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label htmlFor="category" className="block text-sm font-semibold text-primary/95 mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              defaultValue={initialData.category || ''}
              className={`w-full px-4 py-3.5 rounded-xl border text-primary bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.category ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-secondary focus:ring-secondary/20'
              }`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="difficulty" className="block text-sm font-semibold text-primary/95 mb-2">
              Difficulty Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={initialData.difficulty || ''}
              className={`w-full px-4 py-3.5 rounded-xl border text-primary bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.difficulty ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-secondary focus:ring-secondary/20'
              }`}
            >
              <option value="">Select level</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.difficulty && <p className="mt-1.5 text-xs text-red-500">{errors.difficulty}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            id="author"
            label="Author Name"
            name="author"
            defaultValue={initialData.author || ''}
            placeholder="Your name"
          />

          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-primary/95 mb-2">Cover Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (or upload cover)"
                className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-primary placeholder-muted focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-sm truncate"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileSelect}
                disabled={uploading}
                className="px-4 py-3.5 h-[48px] text-xs shrink-0 font-bold flex items-center gap-1.5"
              >
                <FiUpload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm">
        <h2 className="font-display font-bold text-primary text-lg border-b border-slate-100 pb-3 mb-5">
          Lesson Content <span className="text-rose-500">*</span>
        </h2>
        <textarea
          id="fullDescription"
          name="fullDescription"
          rows={14}
          defaultValue={initialData.fullDescription || ''}
          placeholder="Write your full lesson content here. You can include vocabulary lists, grammar rules, example sentences, dialogues, and exercises..."
          className={`w-full px-5 py-4 rounded-xl border bg-white text-primary placeholder-muted focus:outline-none focus:ring-2 transition-all resize-y font-mono text-sm leading-relaxed ${
            errors.fullDescription ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-border focus:border-secondary focus:ring-secondary/20'
          }`}
        />
        {errors.fullDescription && <p className="mt-1.5 text-xs text-red-500">{errors.fullDescription}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={uploading}
          className="px-8 py-3.5 font-bold"
        >
          {isSubmitting ? 'Publishing' : 'Publish Lesson'}
        </Button>
      </div>
    </form>
  );
}
