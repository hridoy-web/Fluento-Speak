'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa6';
import { FiArrowLeft, FiCheck, FiInfo } from 'react-icons/fi';

export default function LoginPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/explore');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Batch extract data cleanly in one single batch
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData);
    const email = formValues.email?.trim();
    const password = formValues.password;

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Authentication failed. Please verify credentials.', { id: toastId });
      } else {
        toast.success('Signed in successfully.', { id: toastId });
        router.push('/explore');
      }
    } catch {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const toastId = toast.loading('Connecting to Google...');
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/explore'
      });
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.', { id: toastId });
    }
  };

  const handleDemoFill = () => {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (emailInput && passwordInput) {
      emailInput.value = 'demo@fluento.ai';
      passwordInput.value = 'Demo@1234';
      toast.success('Credentials filled. You can now submit.');
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[radial-gradient(ellipse_at_top_left,#1E293B_0%,#0F172A_45%,#020617_100%)] relative overflow-hidden flex-col justify-between p-12">
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-80 h-80 bg-secondary/15 -top-20 -left-20" />
        <div className="rounded-full blur-[80px] absolute pointer-events-none w-64 h-64 bg-accent/10 bottom-10 right-10" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-glow">
            <span className="font-display font-black text-white text-base">F</span>
          </div>
          <span className="font-display font-bold text-xl text-white">Fluento AI</span>
        </Link>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="font-display font-black text-white text-4xl leading-tight">
            Welcome back to your English journey
          </h2>
          <p className="text-white/60 leading-relaxed font-medium">
            Continue where you left off. Access thousands of community lessons and track your progress.
          </p>
          <div className="space-y-4 pt-4">
            {[
              '10,000+ English lessons',
              'AI-powered feedback indicators',
              'Community of 50,000+ learners',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/70 text-sm font-semibold">
                <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-secondary-light">
                  <FiCheck className="w-3.5 h-3.5" />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/30 text-xs font-semibold">&copy; {new Date().getFullYear()} Fluento Speak AI</div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 pt-24 lg:pt-12">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <span className="font-display font-black text-white text-sm">F</span>
            </div>
            <span className="font-display font-bold text-lg text-primary">Fluento AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display font-black text-primary text-3xl mb-2">Sign In</h1>
            <p className="text-muted text-sm font-medium">
              New here?{' '}
              <Link href="/register" className="text-secondary font-bold hover:underline">
                Create a free account
              </Link>
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-primary transition-all cursor-pointer mb-5 shadow-sm"
          >
            <FaGoogle className="w-4 h-4 text-red-500 shrink-0" />
            Continue with Google
          </button>

          <div className="relative flex py-4 items-center mb-4">
            <div className="flex-grow border-t border-slate-200/60"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">or sign in with email</span>
            <div className="flex-grow border-t border-slate-200/60"></div>
          </div>

          {/* Demo Login Banner */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <FiInfo className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-primary text-sm mb-0.5">Try the Demo Account</p>
              <p className="text-muted text-xs mb-2 leading-relaxed">
                <strong>Email:</strong> demo@fluento.ai | <strong>Password:</strong> Demo@1234
              </p>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs font-bold text-accent hover:text-accent-dark transition-colors flex items-center gap-1 cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-4 text-base font-bold mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-muted text-xs mt-6 leading-relaxed">
            By signing in you agree to our{' '}
            <span className="text-secondary font-semibold cursor-pointer hover:underline">Terms of Service</span> and{' '}
            <span className="text-secondary font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
