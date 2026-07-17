'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { createLesson } from '@/lib/apiActions';
import LessonForm from '@/components/features/lessons/LessonForm';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

export default function AddLessonPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialData, setInitialData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    difficulty: '',
    author: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    } else if (session?.user) {
      setInitialData((prev) => ({
        ...prev,
        author: session.user.name || '',
      }));
    }
  }, [session, isPending, router]);

  const handleSubmit = async (formPayload) => {
    setSubmitting(true);
    const toastId = toast.loading('Publishing lesson to community...');
    try {
      await createLesson(formPayload);
      setSuccess(true);
      toast.success('Lesson published successfully.', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to create lesson. Please try again.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-secondary" />
          </div>
          <h2 className="font-display font-black text-primary text-3xl mb-3">Lesson Published</h2>
          <p className="text-muted mb-8 text-sm sm:text-base leading-relaxed">Your lesson is now live and accessible to the Fluento community.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={() => setSuccess(false)} variant="primary" className="font-bold py-3">
              Add Another
            </Button>
            <Link href="/explore">
              <Button variant="outline" className="border-secondary/35 text-secondary hover:bg-secondary/5 font-bold py-3">
                Browse Lessons
              </Button>
            </Link>
            <Link href="/items/manage">
              <Button variant="outline" className="font-bold py-3">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-muted mb-4">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/items/manage" className="hover:text-secondary transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-primary font-bold">Add New</span>
          </nav>
          <div>
            <h1 className="font-display font-black text-primary text-3xl sm:text-4xl">Add a New Lesson</h1>
            <p className="text-muted mt-2 text-sm sm:text-base">Share your English knowledge with the community.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LessonForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
