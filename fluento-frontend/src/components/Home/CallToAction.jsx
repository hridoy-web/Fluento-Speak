// File: src/components/Home/CallToAction.js
import Link from 'next/link';
import { FiArrowRight, FiTarget, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function CallToAction() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center p-12 border border-slate-100 rounded-3xl shadow-sm bg-gradient-to-br from-white to-purple-50/30">
        
        {/* Animated Zap Icon */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-4 border-indigo-200 mb-8"
        >
            <FiZap className="w-8 h-8 animate-bounce" />
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Ready to <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Dominate Your Career</span>?
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Dont let language barriers hold you back. Join Fluento Speak today and start mastering professional English tailored for your success.
          </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-10"
        >
            <Link href="/items" className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-sm font-semibold rounded-md shadow-sm transition-all tracking-wide cursor-pointer">
              <span>View All Study Resources</span>
              <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link href="/explore" className="flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-md shadow-2xs text-sm font-semibold transition-all tracking-wide cursor-pointer">
              <FiTarget className="w-3.5 h-3.5 text-violet-500" />
              <span>Explore AI Enhanced Lessons</span>
            </Link>
        </motion.div>
      </div>
    </section>
  );
}