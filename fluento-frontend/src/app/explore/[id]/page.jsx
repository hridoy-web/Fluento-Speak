'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchLessonById, fetchLessons } from '@/lib/api';
import CourseCard from '@/components/ui/CourseCard';
import SkeletonDetail from '@/components/SkeletonCard'; // Note: we can use a custom spinner or skeleton
import Button from '@/components/ui/Button';
import { FiArrowLeft, FiUser, FiCalendar, FiBookOpen, FiSliders, FiClock, FiPlusCircle, FiCheck } from 'react-icons/fi';

const CATEGORY_COLORS = {
  Speaking:             'bg-emerald-100 text-emerald-800 border-emerald-200/50',
  Vocabulary:           'bg-blue-100 text-blue-800 border-blue-200/50',
  Grammar:              'bg-violet-100 text-violet-800 border-violet-200/50',
  'Daily Conversation': 'bg-amber-100 text-amber-800 border-amber-200/50',
  Pronunciation:        'bg-pink-100 text-pink-800 border-pink-200/50',
  Writing:              'bg-cyan-100 text-cyan-800 border-cyan-200/50',
  Listening:            'bg-orange-100 text-orange-800 border-orange-200/50',
};

const DIFFICULTY_STYLES = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200/30',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200/30',
  Advanced:     'bg-rose-50 text-rose-700 border-rose-200/30',
};

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson]       = useState(null);
  const [related, setRelated]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [relLoading, setRelLoading] = useState(false);
  const [error, setError]         = useState('');

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
      <div className="min-h-screen bg-surface pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6 animate-pulse">
          <div className="h-72 w-full bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-slate-200 rounded-full" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
            <div className="h-5 bg-slate-200 rounded-lg w-1/2" />
            <div className="space-y-3 pt-6 border-t border-slate-100 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 bg-slate-200 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-surface pt-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-muted">
            <FiArrowLeft className="w-6 h-6 rotate-45 text-red-500" />
          </div>
          <h2 className="font-display font-bold text-primary text-2xl mb-2">Lesson Not Found</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">{error || 'This lesson may have been deleted or does not exist.'}</p>
          <Link href="/explore">
            <Button variant="primary" className="font-bold">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[lesson.category] || 'bg-slate-100 text-slate-700';
  const diffStyle = DIFFICULTY_STYLES[lesson.difficulty] || 'bg-slate-100 text-slate-700';
  const formatted = new Date(lesson.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Hero Image / Header */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lesson.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&auto=format&fit=crop&q=80'}
          alt={lesson.title}
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-slate-950/70 to-slate-950/30" />
        
        {/* Breadcrumb */}
        <div className="absolute top-20 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white/50">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-white/30">/</span>
              <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
              <span className="text-white/30">/</span>
              <span className="text-white/80 truncate max-w-[200px]">{lesson.title}</span>
            </nav>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2.5 mb-4">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider backdrop-blur-md ${catColor}`}>{lesson.category}</span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider backdrop-blur-md ${diffStyle}`}>{lesson.difficulty}</span>
            </div>
            <h1 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-4xl">
              {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
          {/* Article */}
          <article className="space-y-8 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-3xl shadow-sm">
            <div className="p-5 sm:p-6 bg-secondary/5 border-l-4 border-secondary rounded-r-2xl">
              <p className="text-primary font-medium leading-relaxed text-base italic">{lesson.shortDescription}</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2 className="font-display font-black text-primary text-2xl border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <FiBookOpen className="text-secondary w-5 h-5 shrink-0" />
                Lesson Content
              </h2>
              <div className="whitespace-pre-wrap text-primary/80 leading-relaxed text-base font-medium font-sans">
                {lesson.fullDescription}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-6">
              <h3 className="font-display font-bold text-primary text-lg border-b border-slate-100 pb-3.5">
                Lesson Meta Details
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Category',   value: lesson.category, icon: FiBookOpen },
                  { label: 'Level',      value: lesson.difficulty, icon: FiSliders },
                  { label: 'Author',     value: lesson.author || 'Community Member', icon: FiUser },
                  { label: 'Published',  value: formatted, icon: FiCalendar },
                ].map((row) => (
                  <div key={row.label} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <row.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-muted uppercase tracking-wider font-bold">{row.label}</span>
                      <span className="text-sm text-primary font-bold truncate">{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link href="/explore" className="w-full">
                  <Button variant="primary" className="w-full text-xs font-bold py-3">
                    Browse More Lessons
                  </Button>
                </Link>
                <Link href="/items/add" className="w-full">
                  <Button variant="outline" className="w-full text-xs font-bold border-secondary/30 text-secondary hover:bg-secondary/5 py-3">
                    Contribute a Lesson
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Lessons */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-slate-200/60 pt-10">
            <h2 className="font-display font-black text-primary text-2xl mb-6 flex items-center gap-2">
              <FiBookOpen className="text-secondary w-5 h-5" />
              More in <span className="text-secondary">{lesson.category}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
