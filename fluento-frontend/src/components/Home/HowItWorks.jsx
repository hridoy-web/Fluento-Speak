// File: src/components/Home/HowItWorks.js
import { FiUserPlus, FiBookOpen, FiZap, FiAward } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiUserPlus className="w-6 h-6 text-indigo-700" />,
      title: "1. Create Your Profile",
      desc: "Sign up and set your learning goals to start your journey.",
    },
    {
      icon: <FiBookOpen className="w-6 h-6 text-indigo-700" />,
      title: "2. Explore Lessons",
      desc: "Browse our extensive library of scenario-based learning modules.",
    },
    {
      icon: <FiZap className="w-6 h-6 text-indigo-700" />,
      title: "3. Practice with AI",
      desc: "Engage in interactive exercises and get instant AI feedback.",
    },
    {
      icon: <FiAward className="w-6 h-6 text-indigo-700" />,
      title: "4. Master & Succeed",
      desc: "Track your progress, build confidence, and dominate your career.",
    },
  ];

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            How to <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Begin</span> Your Success
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Follow these simple steps to start mastering English for your professional life.
          </p>
        </div>

        {/* Steps Grid - Alternate Design for Visual Interest */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-6 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center text-center space-y-5">
              
              {/* Connector Line (visible on large screens) */}
              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 right-[-16px] transform translate-y-[-50%] w-8 h-px bg-slate-100 hidden lg:block" />
              )}

              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                {step.icon}
              </div>
              <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}