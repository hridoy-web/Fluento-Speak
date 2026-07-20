'use client';

import React, { useState, useRef, useEffect } from 'react';
import { apiActions } from '@/lib/apiActions';
import { 
  FiX, 
  FiMaximize2, 
  FiMinimize2, 
  FiCornerDownLeft,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { RiCpuLine, RiRobot2Line, RiBrainLine } from 'react-icons/ri';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'SYSTEM INITIALIZED: Fluento AI Core Active.\n\nHello! I am your AI English Coach. How can I help you practice today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const chatEndRef = useRef(null);

  // Chamfer Cut Corner Styles
  const cutCornerBox = {
    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
  };

  const cutCornerBtn = {
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: 'user', text: userMessage }];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await apiActions.sendMessageToAIChat({
        message: userMessage,
        chatHistory: messages
      });

      if (data?.success && data?.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        throw new Error(data?.message || 'AI Core unreachable');
      }
    } catch (error) {
      console.error("Chat Agent Error:", error);
      setHasError(true);
      
      setMessages((prev) => [
        ...prev, 
        { 
          role: 'model', 
          isError: true,
          text: '⚠️ [SYSTEM ALERT]: Connection to AI Core was interrupted.\n\nদুঃখিত, সংযোগে কিছুটা সমস্যা হচ্ছে! দয়া করে নিচে "Try Again" বাটনে ক্লিক করুন।' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setInput(lastUserMsg.text);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono antialiased select-none">
      
      {/* Sci-Fi Modern Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={cutCornerBtn}
        className="relative w-14 h-14 bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-600 text-white shadow-[0_10px_25px_rgba(124,58,237,0.4)] flex items-center justify-center transition-all duration-200 active:scale-95 group overflow-hidden border-t border-l border-purple-300/40"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {isOpen ? (
          <FiX className="text-2xl text-white group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Modern Clean AI Sparkle Icon */}
            <HiSparkles className="text-2xl text-white group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-purple-700 animate-ping" />
          </div>
        )}
      </button>

      {/* Futuristic Light Sci-Fi Chat Panel */}
      {isOpen && (
        <div 
          style={cutCornerBox}
          className={`absolute bottom-18 right-0 bg-slate-50 border-2 border-purple-600/30 shadow-[0_20px_50px_rgba(79,70,229,0.2)] flex flex-col overflow-hidden transition-all duration-300 ease-out ${
            isExpanded 
              ? 'w-[92vw] md:w-[680px] h-[650px] max-h-[85vh]' 
              : 'w-[88vw] md:w-[390px] h-[520px]'
          }`}
        >
          {/* Header - Brand Purple HUD */}
          <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-violet-800 p-3.5 text-white flex items-center justify-between relative shadow-md">
            <div className="flex items-center gap-3">
             
              <div className="relative p-2 bg-white/10 border border-white/20 shadow-inner flex items-center justify-center backdrop-blur-md" style={cutCornerBtn}>
                <RiBrainLine className="text-purple-200 text-xl animate-pulse" />
              </div>

              <div>
                <h3 className="font-extrabold text-xs tracking-wider flex items-center gap-1.5 text-white">
                  FLUENTO_AI // CORE
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/30 text-purple-200 border border-purple-300/30 flex items-center gap-1 rounded-sm">
                    <HiSparkles className="text-amber-300 text-[10px]" /> v2.4
                  </span>
                </h3>
                <p className="text-[10px] text-purple-200/90 font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  NEURAL_ENGINE_ACTIVE
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-purple-200">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:text-white hover:bg-white/10 transition-all"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <FiMinimize2 size={15} /> : <FiMaximize2 size={15} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-rose-300 hover:bg-white/10 transition-all"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/80 text-slate-900 text-xs scrollbar-thin scrollbar-thumb-purple-300">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  style={cutCornerBtn}
                  className={`max-w-[88%] p-3.5 border leading-relaxed whitespace-pre-line transition-all ${
                    msg.role === 'user' 
                      ? 'bg-purple-700 border-purple-800 text-white shadow-sm font-sans' 
                      : msg.isError
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-sans'
                      : 'bg-white border-purple-200 text-slate-800 shadow-sm font-sans'
                  }`}
                >
                  {/* System/User Sub-header */}
                  <div className="text-[9px] font-mono tracking-wider uppercase mb-1 font-bold opacity-80 flex items-center gap-1">
                    {msg.role === 'user' ? (
                      <span className="text-purple-200">&gt; USER_CMD</span>
                    ) : msg.isError ? (
                      <span className="text-rose-600 flex items-center gap-1">
                        <FiAlertCircle /> SYS_ERR
                      </span>
                    ) : (
                      <span className="text-purple-700 flex items-center gap-1">
                        <RiRobot2Line className="text-purple-600 text-xs" /> AI_ASSISTANT
                      </span>
                    )}
                  </div>

                  <div className="font-medium text-[12.5px] leading-normal">
                    {msg.text}
                  </div>

                  {/* Retry Button on Error */}
                  {msg.isError && (
                    <button
                      onClick={handleRetry}
                      style={cutCornerBtn}
                      className="mt-2.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-mono flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <FiRefreshCw size={11} />
                      <span>RETRY_CMD</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Sci-Fi Thinking Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  style={cutCornerBtn}
                  className="bg-white border border-purple-300 px-4 py-2.5 text-purple-700 text-[11px] flex items-center gap-2.5 font-mono shadow-sm"
                >
                  <RiCpuLine className="animate-spin text-purple-600 text-base" />
                  <span className="animate-pulse font-bold">PROCESSING_NEURAL_DATA...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-purple-200 flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3.5 text-purple-600 font-mono font-bold text-xs">&gt;</span>
              <input
                type="text"
                placeholder="Type command / English text..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={cutCornerBtn}
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-purple-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-sans font-medium"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={cutCornerBtn}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-md shadow-purple-600/20 active:scale-95 font-mono"
            >
              <span>SEND</span>
              <FiCornerDownLeft size={13} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}