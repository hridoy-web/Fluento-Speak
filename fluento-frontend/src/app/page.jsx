'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '@/components/ui/CourseCard';
import SkeletonCard from '@/components/SkeletonCard';
import { fetchLessons } from '@/lib/apiActions';
import Button from '@/components/ui/Button';
import {
  FiArrowRight,
  FiBookOpen,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiCpu,
  FiGlobe,
  FiTarget,
  FiPlay,
  FiCheck,
  FiChevronDown,
  FiStar
} from 'react-icons/fi';

const STATS = [
  {
    value: '10,000+',
    label: 'Lessons Created',
    icon: FiBookOpen,
    color: 'text-teal-500 bg-teal-500/10'
  },
  {
    value: '50,000+',
    label: 'Active Learners',
    icon: FiUsers,
    color: 'text-indigo-500 bg-indigo-500/10'
  },
  {
    value: '7',
    label: 'Skill Categories',
    icon: FiGlobe,
    color: 'text-pink-500 bg-pink-500/10'
  },
  {
    value: '4.9',
    label: 'Average Rating',
    icon: FiAward,
    color: 'text-amber-500 bg-amber-500/10'
  },
];

const FEATURES = [
  {
    title: 'AI-Powered Insights',
    desc: 'Get personalized learning paths and smart feedback on your grammar and pronunciation.',
    color: 'from-indigo-500 to-purple-600 shadow-[0_4px_20px_rgba(99,102,241,0.2)]',
    icon: FiCpu,
  },
  {
    title: 'Community Lessons',
    desc: 'Learn from real English speakers. Browse thousands of community-contributed lessons.',
    color: 'from-teal-500 to-emerald-600 shadow-[0_4px_20px_rgba(13,148,136,0.2)]',
    icon: FiUsers,
  },
  {
    title: 'Learn Anywhere',
    desc: 'Fully responsive platform. Continue your lessons on any device, anytime.',
    color: 'from-blue-500 to-cyan-600 shadow-[0_4px_20px_rgba(59,130,246,0.2)]',
    icon: FiGlobe,
  },
  {
    title: 'Goal Tracking',
    desc: 'Set daily learning goals and track your progress with detailed analytics.',
    color: 'from-orange-500 to-amber-600 shadow-[0_4px_20px_rgba(249,115,22,0.2)]',
    icon: FiTarget,
  },
  {
    title: 'Speaking Practice',
    desc: 'Interactive speaking exercises with phonetic guides and real-world dialogue practice.',
    color: 'from-pink-500 to-rose-600 shadow-[0_4px_20px_rgba(236,72,153,0.2)]',
    icon: FiPlay,
  },
  {
    title: 'Structured Curriculum',
    desc: 'Follow a structured curriculum from Beginner to Advanced with clear milestones.',
    color: 'from-violet-500 to-indigo-600 shadow-[0_4px_20px_rgba(139,92,246,0.2)]',
    icon: FiAward,
  },
];

const CATEGORIES = [
  { name: 'Speaking', count: '1.2k lessons', color: 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100/50 hover:border-emerald-300' },
  { name: 'Vocabulary', count: '2.4k lessons', color: 'bg-blue-50/50 border-blue-100 hover:bg-blue-100/50 hover:border-blue-300' },
  { name: 'Grammar', count: '1.8k lessons', color: 'bg-violet-50/50 border-violet-100 hover:bg-violet-100/50 hover:border-violet-300' },
  { name: 'Daily Conversation', count: '980 lessons', color: 'bg-amber-50/50 border-amber-100 hover:bg-amber-100/50 hover:border-amber-300' },
  { name: 'Pronunciation', count: '750 lessons', color: 'bg-pink-50/50 border-pink-100 hover:bg-pink-100/50 hover:border-pink-300' },
  { name: 'Writing', count: '620 lessons', color: 'bg-cyan-50/50 border-cyan-100 hover:bg-cyan-100/50 hover:border-cyan-300' },
];

const HOW_STEPS = [
  { step: '01', title: 'Create an Account', desc: 'Sign up for free in 30 seconds. No credit card required.' },
  { step: '02', title: 'Explore & Filter', desc: 'Browse thousands of lessons filtered by category and skill level.' },
  { step: '03', title: 'Learn & Contribute', desc: 'Study at your pace and share your own lessons with the community.' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, India',
    quote: 'Fluento AI completely transformed how I speak in meetings. The grammar lessons are incredibly clear and practical. I went from being nervous to confident in just 3 months!',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    rating: 5,
  },
  {
    name: 'Carlos Mendez',
    role: 'University Student, Mexico',
    quote: 'The vocabulary lessons and daily conversation practice are top-notch. I love that real community members share their experiences. It feels so authentic!',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos',
    rating: 5,
  },
  {
    name: 'Yuki Tanaka',
    role: 'Product Designer, Japan',
    quote: 'The AI feedback on my speaking was a game-changer. Now I understand sentence structure at a whole new level. Best English platform I have used, period.',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Yuki',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is Fluento Speak AI free to use?',
    a: 'Yes. The core platform is completely free. You can browse all community lessons, practice exercises, and even contribute your own lessons without any cost.',
  },
  {
    q: 'What English levels does the platform support?',
    a: 'We support all levels from absolute Beginner to Advanced. Every lesson is tagged with a difficulty level, so you will always find content that matches your current stage.',
  },
  {
    q: 'Can I add my own English lessons?',
    a: 'Absolutely. After creating a free account, you can publish your own lessons in any category: Speaking, Vocabulary, Grammar, Daily Conversation, Pronunciation, or Writing.',
  },
  {
    q: 'How does the AI feature work?',
    a: 'Our upcoming AI features will analyze your writing, suggest grammar improvements, recommend lessons based on your weak areas, and even provide pronunciation feedback. Stay tuned.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'The platform is fully responsive and works beautifully on any mobile browser. A dedicated app for iOS and Android is currently in our roadmap.',
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:border-slate-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <span className="font-bold text-primary pr-4">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-secondary text-white' : 'bg-slate-100 text-primary/50'}`}
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-slate-50 pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchLessons({ limit: 3, sortBy: 'date', order: 'desc' })
      .then((res) => setLessons(res.data || []))
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));
  }, []);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data.email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-[radial-gradient(ellipse_at_top_left,#1E293B_0%,#0F172A_45%,#020617_100%)] min-h-screen flex items-center relative overflow-hidden pt-16">
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-[600px] h-[600px] bg-secondary/15 -top-40 -left-40" />
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-[500px] h-[500px] bg-accent/10 top-1/4 -right-20" />
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-[300px] h-[300px] bg-secondary/8 bottom-0 left-1/3" />

        {/* Floating elements */}
        {['Vocabulary', 'Grammar', 'Speaking', 'Fluent', 'Practice', 'Confident'].map((word, i) => (
          <div
            key={word}
            className="absolute bg-white/10 backdrop-blur-md border border-white/15 text-white/70 text-xs font-semibold px-4 py-2 rounded-full pointer-events-none select-none hidden sm:block"
            style={{
              top: `${15 + i * 12}%`,
              left: i % 2 === 0 ? `${6 + i * 3}%` : undefined,
              right: i % 2 !== 0 ? `${6 + i * 2}%` : undefined,
              animation: `float ${4 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {word}
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-8 text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            AI-Powered English Learning Platform
          </div>

          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Master English. <br className="hidden sm:block" />
            <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Speak Confidently.</span>
            <br className="hidden sm:block" />
            Connect Globally.
          </h1>

          <p className="text-white/65 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join <span className="text-secondary-light font-semibold">50,000+ learners</span> improving their English every day through community lessons, AI feedback, and structured practice.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" className="px-8 py-4 text-base font-bold flex items-center gap-2">
                Start Learning Free
                <FiArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="glass" className="px-8 py-4 text-base font-bold">
                Browse Lessons
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-16">
            {['No credit card required', 'Free forever plan', '10,000+ lessons'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/55 text-sm font-medium">
                <FiCheck className="w-4 h-4 text-secondary-light shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs font-semibold tracking-wider uppercase">Scroll to explore</span>
          <FiChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div key={idx} className="text-center p-6 rounded-2xl bg-surface border border-slate-200/50 hover:border-secondary/40 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${s.color} transition-transform duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="font-display font-black text-3xl text-primary mb-1 group-hover:text-secondary transition-colors">{s.value}</div>
                  <div className="text-muted text-sm font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/8 px-3 py-1.5 rounded-full">Simple Process</span>
            <h2 className="font-display font-black text-primary text-4xl mt-4 mb-4">How Fluento Works</h2>
            <p className="text-muted max-w-lg mx-auto font-medium">Get started in minutes and be on your way to English fluency.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/20" />
            {HOW_STEPS.map((step) => (
              <div key={step.step} className="relative text-center group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-accent transition-all duration-300 group-hover:scale-105">
                  <span className="font-display font-black text-white text-2xl">{step.step}</span>
                </div>
                <h3 className="font-display font-bold text-primary text-xl mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/8 px-3 py-1.5 rounded-full">Why Choose Us</span>
            <h2 className="font-display font-black text-primary text-4xl mt-4 mb-4">
              Everything You Need to <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-muted max-w-lg mx-auto font-medium">A complete English learning ecosystem designed for modern learners.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => {
              const IconComponent = f.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-slate-200/60 bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-primary text-lg mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/8 px-3 py-1.5 rounded-full">Skill Areas</span>
            <h2 className="font-display font-black text-primary text-4xl mt-4 mb-4">Explore by Category</h2>
            <p className="text-muted max-w-lg mx-auto font-medium">Choose the skill area you want to improve and find the perfect lessons.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-350 hover:-translate-y-1 hover:shadow-card-hover bg-white ${cat.color}`}
              >
                <span className="font-bold text-primary text-sm">{cat.name}</span>
                <span className="text-xs text-muted mt-1.5">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lessons Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/8 px-3 py-1.5 rounded-full">Community Picks</span>
              <h2 className="font-display font-black text-primary text-4xl mt-4">Featured Lessons</h2>
            </div>
            <Link href="/explore" className="text-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
              View all lessons
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingLessons
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : lessons.length > 0
                ? lessons.map((l) => <CourseCard key={l._id} lesson={l} />)
                : (
                  <div className="col-span-3 text-center py-16 text-muted">
                    <p className="font-semibold text-lg">No lessons yet. Be the first to contribute.</p>
                    <Link href="/items/add" className="mt-5 inline-block">
                      <Button variant="primary">Add a Lesson</Button>
                    </Link>
                  </div>
                )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-96 h-96 bg-secondary/15 -top-20 -left-20" />
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-80 h-80 bg-accent/10 bottom-0 right-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary-light text-xs font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">Success Stories</span>
            <h2 className="font-display font-black text-white text-4xl mt-4">
              Loved by Learners <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Worldwide</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                <div className="flex mb-4 gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-secondary/8 px-3 py-1.5 rounded-full">FAQ</span>
            <h2 className="font-display font-black text-primary text-4xl mt-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-4xl p-8 sm:p-14 relative overflow-hidden">
            <div className="rounded-full blur-[80px] absolute pointer-events-none w-64 h-64 bg-secondary/20 -top-16 -right-16" />
            <div className="rounded-full blur-[80px] absolute pointer-events-none w-48 h-48 bg-accent/15 -bottom-10 -left-10" />
            <div className="relative z-10">
              <h2 className="font-display font-black text-white text-3xl sm:text-4xl mb-4">
                Start Your English Journey <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Today</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Subscribe for weekly English tips, new lessons, and community highlights.
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-3 bg-secondary/20 text-secondary-light px-8 py-4 rounded-xl font-bold text-base">
                  <FiCheck className="w-5 h-5" />
                  Subscribed. Welcome to Fluento!
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
                  />
                  <Button type="submit" variant="primary" className="whitespace-nowrap font-bold">
                    Subscribe Free
                  </Button>
                </form>
              )}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <Link href="/register" className="text-secondary-light text-sm font-semibold hover:underline">Create Account</Link>
                <Link href="/explore" className="text-white/50 text-sm font-medium hover:text-white transition-colors">Browse Lessons</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
