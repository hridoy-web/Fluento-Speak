'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseCard from '@/components/ui/CourseCard';
import SkeletonCard from '@/components/SkeletonCard';
import { fetchLessons } from '@/lib/apiActions';
import Button from '@/components/ui/Button';
import { FiSearch, FiSliders, FiX, FiInfo } from 'react-icons/fi';

const CATEGORIES = ['Speaking', 'Vocabulary', 'Grammar', 'Daily Conversation', 'Pronunciation', 'Writing', 'Listening'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lessons, setLessons] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const PER_PAGE = 8;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchLessons({ search, category, difficulty, sortBy, order, page, limit: PER_PAGE });
      setLessons(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setError(e.message || 'Failed to load lessons.');
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, difficulty, sortBy, order, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Sync filters to URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category) p.set('category', category);
    if (difficulty) p.set('difficulty', difficulty);
    if (sortBy !== 'date') p.set('sortBy', sortBy);
    if (order !== 'desc') p.set('order', order);
    if (page > 1) p.set('page', page);
    router.replace(`/explore${p.toString() ? `?${p}` : ''}`, { scroll: false });
  }, [search, category, difficulty, sortBy, order, page, router]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setSortBy('date');
    setOrder('desc');
    setPage(1);
  };

  const hasFilters = search || category || difficulty || sortBy !== 'date' || order !== 'desc';

  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <div className="bg-primary pt-24 pb-12 relative overflow-hidden">
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-96 h-96 bg-secondary/15 -top-20 -right-20" />
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-72 h-72 bg-accent/10 top-0 left-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-4">
            Explore <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Lessons</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto font-medium">
            Discover community lessons across speaking, grammar, vocabulary, and more.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search lessons by title or topic..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            <Button type="submit" variant="primary" className="whitespace-nowrap py-4 px-7 font-bold">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-primary/75 font-semibold text-sm mr-2">
            <FiSliders className="w-4 h-4 text-secondary shrink-0" />
            <span>Filters:</span>
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-primary bg-white focus:outline-none focus:border-secondary transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-primary bg-white focus:outline-none focus:border-secondary transition-all cursor-pointer"
          >
            <option value="">All Levels</option>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={`${sortBy}:${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split(':');
              setSortBy(s); setOrder(o); setPage(1);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-primary bg-white focus:outline-none focus:border-secondary transition-all cursor-pointer"
          >
            <option value="date:desc">Latest First</option>
            <option value="date:asc">Oldest First</option>
            <option value="rating:desc">Highest Rated</option>
            <option value="rating:asc">Lowest Rated</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FiX className="w-4 h-4 shrink-0" />
              Clear
            </button>
          )}

          <div className="ml-auto text-xs font-semibold text-muted tracking-wide uppercase">
            {loading ? 'Loading...' : `${total} lesson${total !== 1 ? 's' : ''} found`}
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-500">
              <FiInfo className="w-6 h-6" />
            </div>
            <p className="text-red-600 font-bold mb-2">{error}</p>
            <p className="text-muted text-sm mb-6 leading-relaxed">Make sure the backend server is running correctly on port 5000.</p>
            <Button onClick={load} variant="primary" className="font-bold">Retry Connection</Button>
          </div>
        )}

        {!error && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
                : lessons.length > 0
                  ? lessons.map((l) => <CourseCard key={l._id} lesson={l} />)
                  : (
                    <div className="col-span-full text-center py-20 bg-white border border-border rounded-2xl p-8">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-muted">
                        <FiSearch className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-primary text-xl mb-2">No lessons found</h3>
                      <p className="text-muted text-sm mb-6">Try adjusting your filters or search terms.</p>
                      <Button onClick={clearFilters} variant="primary" className="font-bold">Clear Filters</Button>
                    </div>
                  )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-primary disabled:opacity-40 hover:border-secondary hover:text-secondary transition-all cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${p === page
                          ? 'bg-secondary text-white shadow-glow'
                          : 'border border-slate-200 text-primary hover:border-secondary hover:text-secondary bg-white'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-primary disabled:opacity-40 hover:border-secondary hover:text-secondary transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center font-semibold text-muted">Loading lessons...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
