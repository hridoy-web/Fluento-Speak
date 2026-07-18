import Link from 'next/link';
import { FaTwitter, FaLinkedinIn, FaYoutube, FaDiscord } from 'react-icons/fa6';
import BrandLogo from '../ui/BrandLogo';

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
    <footer className="bg-slate-100 border-t border-slate-200/60 font-sans antialiased">
      {/* Main Footer Grid */}
      <div className="w-11/12 mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
              A community-powered English learning platform with AI-enhanced lessons for
              speaking, vocabulary, grammar, and daily conversation.
            </p>
            
            {/* Social Icons matching Login/Register hover state */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 flex items-center justify-center text-slate-400 transition-all duration-200"
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
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-semibold"
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
      <div className="border-t  border-slate-100">
        <div className="w-11/12 mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-semibold">
          <p>
            &copy; {currentYear} Fluento Speak. All rights reserved.
          </p>
          <div className="flex items-center text-slate-400/80 font-medium">
            <span>Made for English learners in Bangladesh</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}