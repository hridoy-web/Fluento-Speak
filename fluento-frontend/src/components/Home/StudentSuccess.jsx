// File: src/components/Home/StudentSuccess.js
import Image from 'next/image';
// Switched to react-icons/fa to ensure icons exist and prevent build errors
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function StudentSuccess() {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Sohanur Rahman",
      role: "Freelance Front-End Developer",
      quote: "Fluento Speak completely changed my client communication approach. I went from closing small local projects to winning major international contracts.",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      name: "Sabrina Yeasmin",
      role: "Corporate Executive",
      quote: "The personalized lesson modules and AI feedback were exactly what I needed to refine my professional English. It's boosted my corporate confidence.",
    },
  ];

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Our <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Success Stories</span> Say It All
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Hear from local talents who have conquered the global stage with better professional English.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 flex flex-col items-center md:flex-row gap-6 text-center md:text-left relative">
              
              {/* Using FaQuoteLeft from Font Awesome */}
              <div className="absolute top-4 right-4 opacity-[0.03]">
                 <FaQuoteLeft className="w-16 h-16 text-indigo-700"/>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                 <div className="w-24 h-24 rounded-full border-4 border-indigo-100 p-1">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                 </div>
                 {/* Fixed star rating map with accurate keys and components */}
                 <div className="flex items-center gap-0.5 text-xs text-emerald-500">
                    {[...Array(5)].map((_, starIdx) => (
                      <span key={starIdx}>
                        <FaStar className="fill-current"/>
                      </span>
                    ))}
                 </div>
              </div>
              <div className="flex-1 space-y-3">
                 <p className="text-sm text-slate-600 leading-relaxed italic">
                   {testimonial.quote}
                 </p>
                 <div className="space-y-0.5 pt-2">
                    <h4 className="text-base font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-xs font-medium text-indigo-600">{testimonial.role}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}