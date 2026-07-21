import Link from 'next/link';
import { FiBookOpen, FiArrowRight, FiCalendar, FiClock, FiUser } from 'react-icons/fi';

export const metadata = {
  title: 'Blog - Fluento Speak',
  description: 'Read the latest articles, tips, and guides on mastering English, freelancing, and global communication.',
};

// Dummy Blog Posts Data (আপনি পরবর্তীতে ডাটাবেজ বা API থেকে ডাটা ফেচ করতে পারবেন)
const BLOG_POSTS = [
  {
    id: 1,
    slug: 'mastering-english-for-freelancing',
    title: 'How to Master English for High-Paying Freelancing Clients',
    excerpt: 'Discover essential communication strategies, professional phrasal verbs, and proposal writing tips to close global clients effortlessly.',
    category: 'Freelancing',
    author: 'Hridoy',
    date: 'July 21, 2026',
    readTime: '4 min read',
    imageBg: 'from-indigo-500 to-purple-600',
  },
  {
    id: 2,
    slug: 'common-tense-mistakes',
    title: 'Avoid These 5 Common Tense Mistakes in Daily Conversations',
    excerpt: 'Simplify tense deployments without memorizing endless basic rule charts. Speak naturally and clearly in your everyday interactions.',
    category: 'Grammar',
    author: 'Admin',
    date: 'July 18, 2026',
    readTime: '3 min read',
    imageBg: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    slug: 'interactive-audio-practice',
    title: 'Why Interactive Audio Simulations Accelerate Language Fluency',
    excerpt: 'Explore how real-world case simulations and verbal response training help develop flawless verbal reflexes faster.',
    category: 'Speaking',
    author: 'Hridoy',
    date: 'July 15, 2026',
    readTime: '5 min read',
    imageBg: 'from-indigo-600 to-blue-500',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-16 font-sans antialiased text-slate-700">
      <div className="w-11/12 max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide">
            <FiBookOpen className="w-3.5 h-3.5" /> Our Insights & Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Latest Articles & <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Resources</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Level up your language proficiency and freelancing career with expert tips, structural breakdowns, and community insights.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col justify-between hover:border-indigo-200 transition-all duration-300 group"
            >
              <div>
                {/* Thumbnail Header Gradient */}
                <div className={`h-44 bg-gradient-to-tr ${post.imageBg} p-6 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 backdrop-opacity-10" />
                  <span className="self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider relative z-10">
                    {post.category}
                  </span>
                  <div className="relative z-10 text-white/90 text-xs font-semibold flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FiUser className="w-3 h-3" />
                  </div>
                  {post.author}
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read More <FiArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}