'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FiUser, FiMail, FiCalendar, FiShield, FiLogOut, FiActivity } from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const { user } = session;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const formattedSessionExpiry = session.session?.expiresAt
    ? new Date(session.session.expiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="h-44 sm:h-52 w-full bg-[radial-gradient(ellipse_at_top_left,#1E293B_0%,#0F172A_45%,#020617_100%)] rounded-t-3xl relative overflow-hidden border border-slate-200/10 shadow-sm">
          <div className="rounded-full blur-[80px] absolute pointer-events-none w-48 h-48 bg-secondary/20 -top-10 -left-10" />
          <div className="rounded-full blur-[80px] absolute pointer-events-none w-40 h-40 bg-accent/15 bottom-0 right-10" />
          
          <div className="absolute bottom-6 left-6 sm:left-10 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            {/* Student Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'Student')}`}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md object-cover bg-white shrink-0"
            />
            <div className="mb-1 text-left">
              <h1 className="font-display font-black text-white text-2xl sm:text-3xl leading-tight">
                {user.name}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-light animate-pulse" />
                Fluento Student Member
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card & Details */}
        <div className="bg-white border-x border-b border-slate-200/50 rounded-b-3xl p-6 sm:p-10 shadow-sm grid md:grid-cols-[2fr_1fr] gap-8 items-start">
          
          {/* Main info panel */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-primary text-xl border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiUser className="text-secondary w-5 h-5 shrink-0" />
              Account details
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user.name, icon: FiUser },
                { label: 'Email Address', value: user.email, icon: FiMail },
                { label: 'Account Verified', value: user.emailVerified ? 'Yes' : 'No', icon: FiShield },
                { label: 'Created At', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A', icon: FiCalendar },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-muted uppercase tracking-wider font-bold">{item.label}</span>
                    <span className="text-sm text-primary font-bold truncate mt-0.5">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Session Info */}
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
              <h3 className="font-display font-bold text-primary text-lg flex items-center gap-2">
                <FiActivity className="text-secondary w-5 h-5 shrink-0" />
                Active Session Info
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 text-xs font-semibold text-primary/80">
                <div className="flex justify-between items-center">
                  <span className="text-muted uppercase tracking-wider text-[10px]">Session Expiry</span>
                  <span className="font-mono">{formattedSessionExpiry}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/50 pt-3">
                  <span className="text-muted uppercase tracking-wider text-[10px]">Authentication Provider</span>
                  <span className="bg-secondary/15 text-secondary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {user.image?.includes('googleusercontent') ? 'Google OAuth' : 'Email & Password'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links & actions */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 w-full">
            <h3 className="font-display font-bold text-primary text-base">Quick Actions</h3>
            
            <div className="flex flex-col gap-3">
              <Link href="/items/manage" className="w-full">
                <Button variant="primary" className="w-full text-xs font-bold py-3.5">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/explore" className="w-full">
                <Button variant="outline" className="w-full text-xs font-bold bg-white border-slate-200 text-primary py-3.5">
                  Browse Lessons
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border border-red-200 rounded-xl bg-white hover:bg-red-50 text-xs font-bold text-red-600 transition-all cursor-pointer shadow-sm"
              >
                <FiLogOut className="w-4 h-4 shrink-0" />
                Logout Session
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
