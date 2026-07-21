'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-16 font-sans antialiased text-slate-700">
      <div className="w-11/12 max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide">
            <FiMessageSquare className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            We’d Love to <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Hear From You</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Have questions about our lessons, need help with your account, or want to share feedback? Drop us a message below.
          </p>
        </div>

        {/* Contact Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Info Cards */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Email Us</h4>
                <p className="text-xs text-slate-500 mt-0.5">support@fluentospeak.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Call Us</h4>
                <p className="text-xs text-slate-500 mt-0.5">+880 1234-567890</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center font-bold shrink-0">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Location</h4>
                <p className="text-xs text-slate-500 mt-0.5">Chittagong, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.01)] lg:col-span-2">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out. Our support team will get back to you via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Hridoy..."
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="hridoy@example.com"
                      className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 text-sm font-bold bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}