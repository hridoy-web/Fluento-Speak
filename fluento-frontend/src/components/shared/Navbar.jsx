'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FiMenu, FiUser, FiLogOut, FiBookOpen, FiCompass, FiPlusCircle, FiHome, FiSliders } from 'react-icons/fi';
import BrandLogo from '../ui/BrandLogo';

const NAV_PUBLIC = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/explore', label: 'Explore', icon: FiCompass },
];

const NAV_AUTH = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/explore', label: 'Explore', icon: FiCompass },
  { href: '/items/add', label: 'Add Lesson', icon: FiPlusCircle },
  { href: '/items/manage', label: 'Manage Lessons', icon: FiBookOpen },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  
  const user = session?.user;
  const navLinks = user ? NAV_AUTH : NAV_PUBLIC;

  const handleLogout = async () => {
    await authClient.signOut({
      redirectTo: '/',
    });
  };

  const avatarSrc = user?.image || '/images/user-icon-logo.png';
  
  // Extract user first name
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all">
      <div className="w-11/12 mx-auto flex items-center justify-between h-16">
        
       <BrandLogo/>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/40">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                pathname === link.href
                  ? 'text-indigo-600 bg-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="w-9 h-9 animate-pulse bg-slate-200 rounded-full" />
          ) : user ? (
            /* Desktop User Profile Dropdown */
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="flex items-center gap-2 border border-slate-200 py-1.5 pr-4 pl-1.5 rounded-full cursor-pointer select-none hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full relative overflow-hidden shrink-0">
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">{firstName}</span>
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white border border-slate-100 rounded-2xl w-60 mt-3 z-50">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 rounded-t-xl mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <li>
                  <Link href="/profile" className="flex items-center gap-2 font-semibold text-slate-600 py-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
                    <FiUser className="w-4 h-4" /> Profile
                  </Link>
                </li>
                <li>
                  <Link href="/items/manage" className="flex items-center gap-2 font-semibold text-slate-600 py-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
                    <FiBookOpen className="w-4 h-4" /> Manage Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-600 py-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
                    <FiSliders className="w-4 h-4" /> Dashboard
                  </Link>
                </li>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 font-bold text-red-600 py-2 hover:bg-red-50 rounded-xl w-full text-left">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </li>
                </div>
              </ul>
            </div>
          ) : (
            /* Desktop Unauthenticated Buttons */
            <div className="flex items-center gap-3">
              <Link href="/login" className="py-2 px-5 text-sm font-bold text-indigo-600 bg-indigo-50/5 border border-indigo-600/10 hover:border-indigo-600/20 hover:bg-indigo-50/20 transition-all rounded-none text-center min-w-[90px]">
                Log In
              </Link>
              <Link href="/register">
                <button className="py-2 px-6 text-sm font-bold bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 text-white rounded-none transition-all duration-200 shadow-md shadow-indigo-600/10 cursor-pointer border border-transparent">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Section */}
        <div className="flex items-center md:hidden">
          {isPending ? (
            <div className="w-9 h-9 animate-pulse bg-slate-200 rounded-full" />
          ) : user ? (
            /* Mobile Authenticated Dropdown (Replaces Hamburger) */
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="w-9 h-9 rounded-full relative overflow-hidden block border border-slate-200 cursor-pointer">
                <img src={avatarSrc} alt="Profile" className="object-cover w-full h-full" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-3 shadow-2xl bg-white border border-slate-200/80 rounded-2xl w-72 mt-3 z-50 gap-1">
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl mb-2">
                  <div className="w-9 h-9 rounded-full relative border border-slate-200 overflow-hidden shrink-0">
                    <img src={avatarSrc} alt="Profile" className="object-cover w-full h-full" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Logged in Navigation Links inside Mobile Menu */}
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold ${
                        pathname === link.href ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      <link.icon className="w-4 h-4" /> {link.label}
                    </Link>
                  </li>
                ))}

                <div className="border-t border-slate-100 mt-2 pt-2">
                  <li>
                    <Link href="/profile" className="flex items-center gap-2.5 py-2.5 text-slate-600 font-semibold rounded-xl"><FiUser className="w-4 h-4" /> Profile</Link>
                  </li>
                  <li>
                    <Link href="/items/manage" className="flex items-center gap-2.5 py-2.5 text-slate-600 font-semibold rounded-xl"><FiBookOpen className="w-4 h-4" /> Manage Lessons</Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="flex items-center gap-2.5 py-2.5 text-slate-600 font-semibold rounded-xl"><FiSliders className="w-4 h-4" /> Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2.5 py-2.5 text-red-500 font-bold hover:bg-red-50 rounded-xl w-full text-left"><FiLogOut className="w-4 h-4" /> Sign Out</button>
                  </li>
                </div>
              </ul>
            </div>
          ) : (
            /* Mobile Unauthenticated State (Shows only Log In on Header + Register in Menu) */
            <div className="flex items-center gap-2">
              <Link href="/login" className="py-2 px-4 text-sm font-inter font-bold uppercase text-indigo-600 bg-transparent border border-indigo-600/10 transition-all">
                Log In
              </Link>
              
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle text-slate-700">
                  <FiMenu className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-3 shadow-2xl bg-white border border-slate-200/80 rounded-2xl w-64 mt-3 z-50 gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="flex items-center gap-2.5 py-2.5 text-slate-600 font-semibold rounded-xl">
                        <link.icon className="w-4 h-4" /> {link.label}
                      </Link>
                    </li>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <Link href="/register" className="w-full">
                      <button className="w-full text-sm py-2.5 font-bold bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl border border-transparent shadow-md cursor-pointer">
                        Register Now
                      </button>
                    </Link>
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}