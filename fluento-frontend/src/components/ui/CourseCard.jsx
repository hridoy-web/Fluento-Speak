'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight } from 'react-icons/fi';

const CATEGORY_COLORS = {
  Speaking:            'bg-emerald-100/80 text-emerald-800 border-emerald-200/50',
  Vocabulary:          'bg-blue-100/80 text-blue-800 border-blue-200/50',
  Grammar:             'bg-violet-100/80 text-violet-800 border-violet-200/50',
  'Daily Conversation': 'bg-amber-100/80 text-amber-800 border-amber-200/50',
  Pronunciation:       'bg-pink-100/80 text-pink-800 border-pink-200/50',
  Writing:             'bg-cyan-100/80 text-cyan-800 border-cyan-200/50',
  Listening:           'bg-orange-100/80 text-orange-800 border-orange-200/50',
};

const DIFFICULTY_STYLES = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200/30',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200/30',
  Advanced:     'bg-rose-50 text-rose-700 border-rose-200/30',
};

const DIFFICULTY_DOTS = {
  Beginner:     1,
  Intermediate: 2,
  Advanced:     3,
};

export default function CourseCard({ lesson }) {
  const {
    _id,
    title,
    shortDescription,
    category,
    difficulty,
    author,
    imageUrl,
    createdAt,
  } = lesson;

  const categoryColor = CATEGORY_COLORS[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  const difficultyStyle = DIFFICULTY_STYLES[difficulty] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dots = DIFFICULTY_DOTS[difficulty] || 1;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.article 
      whileHover={{ y: -6, boxShadow: 'var(--shadow-card-hover)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white rounded-2xl shadow-card overflow-hidden border border-border flex flex-col h-full relative"
    >
      {/* Cover Image */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-80" />
        <span className={`absolute top-3.5 left-3.5 text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm uppercase tracking-wider backdrop-blur-md ${categoryColor}`}>
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${difficultyStyle}`}>
            {difficulty}
          </span>
          <div className="flex items-center gap-1" title={`Difficulty: ${difficulty}`}>
            {[1, 2, 3].map((d) => (
              <span
                key={d}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${d <= dots ? 'bg-secondary' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        <h3 className="font-display font-bold text-primary text-base leading-snug mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
          {title}
        </h3>

        <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1 mb-5">
          {shortDescription}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center text-xs font-bold text-secondary border border-secondary/10 shrink-0">
              {author?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-primary leading-none truncate">{author || 'Community Member'}</p>
              {formattedDate && <p className="text-[10px] text-muted mt-1">{formattedDate}</p>}
            </div>
          </div>
          <Link
            href={`/explore/${_id}`}
            className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors flex items-center gap-1 group/btn shrink-0"
          >
            Study
            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
