'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchLessonById, fetchLessons } from '@/lib/apiActions';
import CourseCard from '@/components/ui/CourseCard';
import SkeletonCard from '@/components/SkeletonCard';
import Button from '@/components/ui/Button';

const CATEGORY_COLORS = {
  Speaking: 'bg-emerald-100 text-emerald-700',
  Vocabulary: 'bg-blue-100 text-blue-700',
  Grammar: 'bg-violet-100 text-violet-700',
  'Daily Conversation': 'bg-amber-100 text-amber-700',
  Pronunciation: 'bg-pink-100 text-pink-700',
  Writing: 'bg-cyan-100 text-cyan-700',
  Listening: 'bg-orange-100 text-orange-700',
};

const DIFFICULTY_STYLES = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 w-full animate-pulse bg-slate-200 rounded-2xl" />
      <div className="max-w-3xl mx-auto space-y-4 px-4">
        <div className="flex gap-3">
          <div className="h-6 w-24 animate-pulse bg-slate-200 rounded-full" />
          <div className="h-6 w-20 animate-pulse bg-slate-200 rounded-full" />
        </div>
        <div className="h-8 animate-pulse bg-slate-200 rounded w-3/4" />
        <div className="h-5 animate-pulse bg-slate-200 rounded w-1/2" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-4 animate-pulse bg-slate-200 rounded ${i % 5 === 4 ? 'w-1/2' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relLoading, setRelLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchLessonById(id)
      .then(async (res) => {
        setLesson(res.data);
        setRelLoading(true);
        try {
          const relRes = await fetchLessons({ category: res.data.category, limit: 4 });
          setRelated((relRes.data || []).filter((l) => l._id !== id));
        } catch {
          setRelated([]);
        } finally {
          setRelLoading(false);
        }
      })
      .catch((e) => setError(e.message || 'Lesson not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-16">
        <div className="max-w-4xl mx-auto py-12">
          <SkeletonDetail />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-surface pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-muted">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-primary text-2xl mb-3">Lesson Not Found</h2>
          <p className="text-muted mb-6">{error || 'This lesson may have been removed.'}</p>
          <Link href="/explore">
            <Button variant="primary">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[lesson.category] || 'bg-slate-100 text-slate-600';
  const diffStyle = DIFFICULTY_STYLES[lesson.difficulty] || 'bg-slate-100 text-slate-600';
  const formatted = new Date(lesson.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Image */}
      <div className="relative w-full h-80 sm:h-96 bg-primary overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lesson.imageUrl}
          alt={lesson.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-20 left-0 right-0 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-white/50">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
              <span>/</span>
              <span className="text-white/80 truncate max-w-xs">{lesson.title}</span>
            </nav>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catColor}`}>{lesson.category}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${diffStyle}`}>{lesson.difficulty}</span>
            </div>
            <h1 className="font-display font-black text-white text-2xl sm:text-4xl leading-tight line-clamp-3">
              {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article */}
          <article className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-secondary/8 border border-secondary/20 rounded-2xl">
              <p className="text-primary font-medium leading-relaxed text-lg italic">{lesson.shortDescription}</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2 className="font-display font-bold text-primary text-2xl mb-4">Full Lesson Content</h2>
              <div className="whitespace-pre-wrap text-primary/80 leading-8 text-base">
                {lesson.fullDescription}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-border shadow-[0_4px_24px_rgba(15,23,42,0.07)] p-6 space-y-4 sticky top-24">
              <h3 className="font-display font-semibold text-primary text-lg border-b border-border pb-3">
                Lesson Details
              </h3>
              {[
                { label: 'Category', value: lesson.category },
                { label: 'Level', value: lesson.difficulty },
                { label: 'Author', value: lesson.author || 'Community Member' },
                { label: 'Published', value: formatted },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted uppercase tracking-wider font-semibold">{row.label}</span>
                  <span className="text-sm text-primary font-medium">{row.value}</span>
                </div>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <Link href="/explore" className="w-full">
                  <Button variant="primary" className="w-full text-xs">
                    Browse More Lessons
                  </Button>
                </Link>
                <Link href="/items/add" className="w-full">
                  <Button variant="outline" className="w-full text-xs border border-secondary/30 text-secondary hover:bg-secondary/5">
                    Contribute a Lesson
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Lessons */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="font-display font-bold text-primary text-2xl mb-6">
              More in <span className="text-secondary">{lesson.category}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.slice(0, 3).map((l) => (
                <CourseCard key={l._id} lesson={l} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
