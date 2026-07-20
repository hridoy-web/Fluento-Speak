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
    // একটি গভীর ও প্রিমিয়াম নেভি-ব্ল্যাক শেড এবং সূক্ষ্ম টপ বর্ডার
    <footer className="bg-[#0b1329] border-t border-slate-800/80 font-sans antialiased text-slate-300">
      
      {/* Main Footer Grid */}
      <div className="w-11/12 max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* আপনার ব্রান্ড লোগো ডার্ক ব্যাকগ্রাউন্ডে ফুটিয়ে তোলার জন্য হালকা গ্লো ইফেক্ট */}
            <div className="inline-block brightness-110 contrast-125">
              <BrandLogo />
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              A community-powered English learning platform with AI-enhanced lessons for
              speaking, vocabulary, grammar, and daily conversation.
            </p>
            
            {/* ডার্ক থিমের সোশ্যাল আইকনস - কনট্রাস্ট এবং মডার্ন ইন্টারঅ্যাক্টিভ হোভারসহ */}
            <div className="flex items-center gap-2.5 pt-3">
              {SOCIAL_LINKS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-violet-500 hover:bg-violet-600 hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 shadow-xs"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups - টেক্সট কনট্রাস্ট সম্পূর্ণ ফিক্সড */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-4">
              {/* হেডিংটিকে পরিষ্কার এবং উজ্জ্বল করা হয়েছে */}
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200/90">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 hover:text-violet-400 transition-colors font-semibold block"
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

      {/* Bottom Bar  */}
      <div className="border-t border-slate-800/60 bg-[#080d1d]">
        <div className="w-11/12 max-w-7xl mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-semibold">
          <p className="text-slate-400/90">
            &copy; {currentYear} Fluento Speak. All rights reserved.
          </p>
          
          <div className="flex items-center text-slate-500 font-medium">
            <span>Made for English learners in Bangladesh</span>
          </div>
          
          <div className="flex gap-6 text-slate-400">
            <span className="hover:text-violet-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-violet-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-violet-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}