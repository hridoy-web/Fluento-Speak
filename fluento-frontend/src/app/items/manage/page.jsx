'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { fetchLessons, deleteLesson } from '@/lib/apiActions';
import ProgressChart from '@/components/features/analytics/ProgressChart';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiSearch, FiBookOpen, FiSliders, FiEye, FiInfo, FiX, FiAward, FiActivity } from 'react-icons/fi';

const CATEGORY_COLORS = {
  Speaking: 'bg-emerald-100 text-emerald-800 border-emerald-200/50',
  Vocabulary: 'bg-blue-100 text-blue-800 border-blue-200/50',
  Grammar: 'bg-violet-100 text-violet-800 border-violet-200/50',
  'Daily Conversation': 'bg-amber-100 text-amber-800 border-amber-200/50',
  Pronunciation: 'bg-pink-100 text-pink-800 border-pink-200/50',
  Writing: 'bg-cyan-100 text-cyan-800 border-cyan-200/50',
  Listening: 'bg-orange-100 text-orange-800 border-orange-200/50',
};

const DIFFICULTY_STYLES = {
  Beginner: 'text-emerald-700 bg-emerald-50 border-emerald-100/50',
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-100/50',
  Advanced: 'text-rose-700 bg-rose-50 border-rose-100/50',
};

function ConfirmModal({ lesson, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={onCancel}>
      <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(15,23,42,0.12)] p-8 max-w-sm w-full border border-slate-100" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 text-red-500">
          <FiTrash2 className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-primary text-xl text-center mb-2">Delete Lesson?</h3>
        <p className="text-muted text-sm text-center mb-1 leading-relaxed">
          You are about to permanently delete:
        </p>
        <p className="font-bold text-primary text-sm text-center mb-6 line-clamp-2 italic px-2">
          &ldquo;{lesson?.title}&rdquo;
        </p>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 font-bold py-2.5">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={deleting}
            variant="danger"
            className="flex-1 text-sm font-bold py-2.5"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageLessonsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/login');
    }
  }, [session, authLoading, router]);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchLessons({ limit: 50, sortBy: 'date', order: 'desc' });
      setLessons(res.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load lessons.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const toastId = toast.loading('Deleting lesson...');
    try {
      await deleteLesson(toDelete._id);
      setLessons((prev) => prev.filter((l) => l._id !== toDelete._id));
      toast.success(`Lesson "${toDelete.title}" was deleted.`, { id: toastId });
    } catch (e) {
      toast.error(e.message || 'Delete failed.', { id: toastId });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const displayed = lessons.filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || l.category === filter;
    return matchSearch && matchFilter;
  });

  const CATEGORIES = [...new Set(lessons.map((l) => l.category))].sort();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Delete Modal */}
      {toDelete && (
        <ConfirmModal
          lesson={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          deleting={deleting}
        />
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-primary text-3xl sm:text-4xl">Student Dashboard</h1>
              <p className="text-muted mt-1 text-sm sm:text-base font-medium">
                {loading ? 'Loading...' : `${lessons.length} total lessons available in community`}
              </p>
            </div>
            <Link href="/items/add" className="self-start">
              <Button variant="primary" className="flex items-center gap-2 font-bold py-3">
                <FiPlus className="w-4 h-4 shrink-0" />
                Add New Lesson
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          {!loading && lessons.length > 0 && (
            <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-slate-100">
              {[
                { label: 'Total Lessons', value: lessons.length, icon: FiBookOpen },
                { label: 'Beginner', value: lessons.filter((l) => l.difficulty === 'Beginner').length, icon: FiAward },
                { label: 'Intermediate', value: lessons.filter((l) => l.difficulty === 'Intermediate').length, icon: FiActivity },
                { label: 'Advanced', value: lessons.filter((l) => l.difficulty === 'Advanced').length, icon: FiAward },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-secondary shrink-0">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-black text-xl text-primary leading-none">{s.value}</span>
                    <span className="text-muted text-[11px] font-bold uppercase tracking-wider mt-1">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recharts Analytics Panel */}
        <ProgressChart />

        {/* Filter Toolbar */}
        {!loading && lessons.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-primary placeholder-muted focus:outline-none focus:border-secondary transition-all"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-primary focus:outline-none focus:border-secondary transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || filter) && (
              <button
                onClick={() => { setSearch(''); setFilter(''); }}
                className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <FiX className="w-4 h-4" />
                Clear
              </button>
            )}
            <span className="ml-auto self-center text-xs font-bold text-muted uppercase tracking-wider">{displayed.length} result{displayed.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl max-w-md mx-auto p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
              <FiInfo className="w-6 h-6" />
            </div>
            <p className="text-red-550 font-bold mb-2">{error}</p>
            <p className="text-muted text-sm mb-6 leading-relaxed">Failed to load lessons. Make sure the backend server is running correctly.</p>
            <Button onClick={load} variant="primary" className="font-bold">Retry</Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="animate-pulse">
              <div className="h-14 bg-slate-50 border-b border-slate-100 px-6 flex items-center gap-4">
                {['w-40', 'w-24', 'w-20', 'w-20', 'w-16'].map((w, i) => (
                  <div key={i} className={`h-4 ${w} bg-slate-200 rounded`} />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 border-b border-slate-100 px-6 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-2/5" />
                    <div className="h-2.5 bg-slate-200 rounded w-1/3" />
                  </div>
                  <div className="w-20 h-6 bg-slate-200 rounded-full" />
                  <div className="w-16 h-6 bg-slate-200 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-14 h-8 bg-slate-200 rounded-xl" />
                    <div className="w-14 h-8 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Content */}
        {!loading && !error && (
          <>
            {displayed.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-muted">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-primary text-xl mb-2">
                  {lessons.length === 0 ? 'No lessons yet' : 'No results found'}
                </h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">
                  {lessons.length === 0
                    ? 'Be the first to share an English lesson with the community.'
                    : 'Try adjusting your search or category filters.'}
                </p>
                {lessons.length === 0 && (
                  <Link href="/items/add">
                    <Button variant="primary" className="font-bold">Add Your First Lesson</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-[2.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-muted uppercase tracking-wider">
                  <span>Lesson</span>
                  <span>Category</span>
                  <span>Level</span>
                  <span>Published</span>
                  <span className="text-right">Actions</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {displayed.map((lesson) => {
                    const catColor = CATEGORY_COLORS[lesson.category] || 'bg-slate-100 text-slate-700';
                    const diffStyle = DIFFICULTY_STYLES[lesson.difficulty] || 'bg-slate-50 text-slate-700 border-slate-100';
                    const date = new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div key={lesson._id} className="grid md:grid-cols-[2.2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/40 transition-colors group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/15 to-accent/15 flex items-center justify-center flex-shrink-0 text-secondary font-bold border border-secondary/10">
                            {lesson.title?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-primary text-sm truncate group-hover:text-secondary transition-colors">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted truncate mt-0.5">{lesson.shortDescription}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${catColor}`}>
                            {lesson.category}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${diffStyle}`}>
                            {lesson.difficulty}
                          </span>
                        </div>

                        <div className="hidden md:block text-sm text-muted font-medium">{date}</div>

                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/explore/${lesson._id}`}>
                            <Button variant="outline" className="px-3.5 py-1.5 text-xs font-bold flex items-center gap-1">
                              <FiEye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </Link>
                          <Button
                            onClick={() => setToDelete(lesson)}
                            variant="outline"
                            className="px-3.5 py-1.5 text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
