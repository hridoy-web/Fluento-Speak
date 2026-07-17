'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookOpen, FiCompass, FiPlusCircle, FiHome } from 'react-icons/fi';

const NAV_PUBLIC = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/explore', label: 'Explore', icon: FiCompass },
];

const NAV_AUTH = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/explore', label: 'Explore', icon: FiCompass },
  { href: '/items/add', label: 'Add Lesson', icon: FiPlusCircle },
  { href: '/items/manage', label: 'Dashboard', icon: FiBookOpen },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const user = session?.user;
  const navLinks = user ? NAV_AUTH : NAV_PUBLIC;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-all duration-300">
            <span className="font-display font-black text-white text-base">F</span>
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white'}`}>
            Fluento <span className="bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                pathname === link.href
                  ? scrolled
                    ? 'text-secondary bg-secondary/10'
                    : 'text-secondary-light bg-white/10'
                  : scrolled
                  ? 'text-primary/70 hover:text-secondary hover:bg-secondary/8'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-secondary" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="w-24 h-9 animate-pulse bg-slate-200/40 rounded-xl" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Avatar Trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100/10 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-secondary object-cover"
                />
              </button>

              {/* Profile Dropdown Modal */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden py-2"
                  >
                    {/* Student Info */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-bold text-primary truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-primary/80 hover:text-secondary hover:bg-secondary/8 rounded-xl font-medium transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        Student Profile Page
                      </Link>
                      <Link
                        href="/items/manage"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-primary/80 hover:text-secondary hover:bg-secondary/8 rounded-xl font-medium transition-colors"
                      >
                        <FiBookOpen className="w-4 h-4" />
                        My Lessons Page
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-slate-100 p-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  scrolled
                    ? 'text-primary/80 hover:text-secondary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Log In
              </Link>
              <Link href="/register">
                <Button variant="primary" className="py-2.5 px-5 text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer ${scrolled ? 'text-primary' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? 'text-secondary bg-secondary/8'
                      : 'text-primary/70 hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <img 
                        src={user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full border-2 border-secondary object-cover" 
                      />
                      <div>
                        <p className="text-sm font-bold text-primary">{user.name}</p>
                        <p className="text-xs text-muted mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary/80 hover:bg-slate-50 rounded-xl"
                    >
                      <FiUser className="w-4 h-4" />
                      Student Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-primary/85 hover:bg-slate-100 transition-colors">
                      Log In
                    </Link>
                    <Link href="/register" className="block">
                      <Button variant="primary" className="w-full text-sm py-3 font-bold">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
