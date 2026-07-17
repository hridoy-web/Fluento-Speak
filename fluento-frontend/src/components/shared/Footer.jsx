import Link from 'next/link';
import { FaTwitter, FaLinkedinIn, FaYoutube, FaDiscord } from 'react-icons/fa6';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Home', href: '/' },
    { label: 'Explore Lessons', href: '/explore' },
    { label: 'Add a Lesson', href: '/items/add' },
    { label: 'Manage Lessons', href: '/items/manage' },
  ],
  'Learn English': [
    { label: 'Speaking', href: '/explore?category=Speaking' },
    { label: 'Vocabulary', href: '/explore?category=Vocabulary' },
    { label: 'Grammar', href: '/explore?category=Grammar' },
    { label: 'Daily Conversation', href: '/explore?category=Daily+Conversation' },
    { label: 'Pronunciation', href: '/explore?category=Pronunciation' },
  ],
  Community: [
    { label: 'Join for Free', href: '/register' },
    { label: 'Log In', href: '/login' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: FaTwitter,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: FaLinkedinIn,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: FaYoutube,
  },
  {
    label: 'Discord',
    href: 'https://discord.com',
    icon: FaDiscord,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Top CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 mb-12">
        <div className="bg-gradient-to-br from-primary-light to-primary rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full blur-[80px] absolute pointer-events-none bg-secondary/30 -top-10 -left-10" />
            <h3 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2 relative z-10">Ready to start speaking?</h3>
            <p className="text-white/60 text-sm sm:text-base relative z-10">Join our community and transform your English today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary to-teal-700 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              Create Free Account
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-white/25 text-white hover:bg-white/10"
            >
              Browse Lessons
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <span className="font-display font-black text-white text-base">F</span>
              </div>
              <span className="font-display font-bold text-xl">
                Fluento <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              A community-powered English learning platform with AI-enhanced lessons for
              speaking, vocabulary, grammar, and daily conversation.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary/20 hover:text-secondary flex items-center justify-center text-white/55 transition-all duration-200"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 hover:text-secondary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            &copy; {currentYear} Fluento Speak AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <span>Made with dedication for English learners worldwide</span>
          </div>
          <div className="flex gap-5 text-xs text-white/40">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
