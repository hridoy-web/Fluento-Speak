// File: src/components/Home/AIInDepth.js
// Changed FiShieldCheck to FiCheckCircle because FiShieldCheck does not exist in react-icons/fi
import { FiZap, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AIInDepth() {
  const aiFeatures = [
    {
      icon: <FiMessageSquare className="w-5 h-5" />,
      text: "Real-time conversation flow analysis",
    },
    {
      icon: <FiZap className="w-5 h-5" />,
      text: "Instant grammar and structure correction",
    },
    {
      // Using FiCheckCircle as a correct replacement icon
      icon: <FiCheckCircle className="w-5 h-5" />,
      text: "Confidence building exercises",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 px-4 border-y border-slate-100">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 border border-slate-100 rounded-3xl p-10 shadow-sm bg-gradient-to-r from-white to-rose-50/10">
        
        {/* Left Side: Text and AI Feature Points */}
        <div className="flex-1 space-y-6">
          <motion.div
             initial={{ opacity: 0, x: -10 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true, amount: 0.8 }}
             className="inline-flex items-center gap-2 text-rose-500 mb-1"
          >
             <FiZap className="w-5 h-5 animate-pulse" />
             <span className="text-xs uppercase font-bold tracking-wider">AI Integration In-Depth</span>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             viewport={{ once: true, amount: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              AI Powered Learning for <span className="bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">Rapid Improvement</span>.
            </h2>
          </motion.div>

          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Our Interactive AI Assistant is not just a chatbot; it is a dedicated communication coach. It works directly with your lesson modules to provide personalized feedback, analyze your sentence structure, and suggest better alternatives for professional and corporate communication.
          </p>

          <ul className="space-y-4 pt-3">
             {aiFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                   <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                      {feature.icon}
                   </div>
                   {feature.text}
                </li>
             ))}
          </ul>
        </div>

        {/* Right Side: Visual Element (Static illustration placeholder) */}
        <div className="flex-shrink-0 w-full lg:w-96 h-80 rounded-2xl bg-white/70 backdrop-blur-md border border-rose-100 shadow-[0_10px_25px_rgba(244,63,94,0.06)] flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 border border-rose-200">
               <FiZap className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1 px-8">
               <h4 className="text-base font-bold text-slate-900">Interactive Assistant Card</h4>
               <p className="text-xs text-slate-500 leading-normal">
                  (In a real setup, this area would show an interactive UI or a complex animation related to AI coaching.)
               </p>
            </div>
        </div>
      </div>
    </section>
  );
}