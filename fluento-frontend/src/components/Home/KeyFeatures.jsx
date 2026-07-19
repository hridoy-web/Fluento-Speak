// File: src/components/Home/KeyFeatures.js
import { FiTrendingUp, FiZap, FiTarget, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function KeyFeatures() {
  const features = [
    {
      icon: <FiTrendingUp className="w-8 h-8 text-indigo-600" />,
      title: "Freelance Mastery",
      desc: "Learn to communicate with clients, negotiate contracts, and deliver winning pitches.",
    },
    {
      icon: <FiTarget className="w-8 h-8 text-emerald-600" />,
      title: "Scenario-Based Learning",
      desc: "Practice with real-world scenarios from freelancing and daily corporate life.",
    },
    {
      icon: <FiZap className="w-8 h-8 text-rose-600" />,
      title: "Interactive AI Assistant",
      desc: "Get real-time feedback on conversation flow, sentence structure, and grammar.",
    },
    {
      icon: <FiMessageSquare className="w-8 h-8 text-violet-600" />,
      title: "Personalized Practice",
      desc: "Tailored lesson modules to improve specific weak areas in communication.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 px-4 border-y border-slate-100">
      <div className="max-w-6xl mx-auto text-center space-y-16">
        
        {/* Section Heading */}
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Why <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Fluento Speak</span> is Different
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our platform is built to address the unique communication challenges faced by local talents.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.8 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-lg hover:border-indigo-100 transition-all text-center space-y-5"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900">{feature.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}