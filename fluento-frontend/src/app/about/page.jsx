import Link from 'next/link';
import { FiCompass, FiShield, FiZap, FiUsers, FiAward, FiCheckCircle } from 'react-icons/fi';

export const metadata = {
  title: 'About Us - Fluento Speak',
  description: 'Learn more about Fluento Speak, our mission, and how we empower global communication for freelancing and daily life.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-16 font-sans antialiased text-slate-700">
      <div className="w-11/12 max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide">
            <FiZap className="w-3.5 h-3.5" /> Empowering Global Communication
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Bridging the Gap Between <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Ambition & Fluency</span>
          </h1>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            Fluento Speak is an AI-enhanced community platform designed to help professionals, freelancers, and learners master English for real-world client acquisition and daily communications.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FiCompass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              To break down language barriers by providing localized scenario training modules, interactive audio simulations, and practical structural frameworks that empower users to compete globally.
            </p>
          </div>

          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FiAward className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Why Choose Us?</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              We focus heavily on practical application—from client acquisition and live project pitches to corporate phrasal verbs, ensuring you learn what actually matters in your career.
            </p>
          </div>

        </div>

        {/* Core Pillars Section */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">What Drives Our Platform</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Built for effective practice</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">01</div>
              <h4 className="font-bold text-slate-800 text-sm">Interactive Syllabus</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Engage with dynamic lessons tailored for different difficulty levels and speaking scenarios.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">02</div>
              <h4 className="font-bold text-slate-800 text-sm">AI Assistant Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Fix sentence structures in real-time and run continuous conversation practice loops.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-xs">03</div>
              <h4 className="font-bold text-slate-800 text-sm">Community Driven</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Contribute custom lessons, manage learning content, and grow alongside fellow learners.</p>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Ready to Elevate Your Communication Skills?</h2>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/explore"
              className="py-3 px-8 text-sm font-bold bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white rounded-xl shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
            >
              Explore All Lessons
            </Link>
            <Link
              href="/"
              className="py-3 px-8 text-sm font-bold text-indigo-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-xl shadow-xs"
            >
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}