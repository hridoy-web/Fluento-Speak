// File: src/components/Home/LearningPath.js
import { FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function LearningPath() {
  const levels = [
    { level: "Beginner", title: "Fundamental Communication", desc: "Build basic professional grammar, everyday conversation, and email structures.", border: "border-sky-100", bg: "from-white to-sky-50/20" },
    { level: "Intermediate", title: "Corporate Fluency", desc: "Refine negotiation skills, presentation techniques, and complex business vocabulary.", border: "border-indigo-100", bg: "from-white to-indigo-50/20" },
    { level: "Advanced", title: "Expert Mastery", desc: "Master professional live project pitches, public speaking, and executive leadership dialogue.", border: "border-violet-100", bg: "from-white to-violet-50/20" },
  ];

  return (
    <section className="bg-slate-50 py-24 px-4 border-y border-slate-100">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Your <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Personalized Learning</span> Path
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            From fundamentals to expert leadership dialogue, choose the path that fits your current needs.
          </p>
        </div>

        {/* Learning Path Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true, amount: 0.8 }}
              className={`bg-gradient-to-br ${path.bg} p-8 rounded-2xl border ${path.border} shadow-sm text-center space-y-5`}
              style={{ willChange: "transform" }}
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <FiLayers className="w-7 h-7 text-indigo-700" />
              </div>
              <div className="space-y-1">
                 <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100/50 px-3 py-1 rounded-full">{path.level}</span>
                 <h4 className="text-lg font-bold text-slate-900 pt-2">{path.title}</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{path.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}