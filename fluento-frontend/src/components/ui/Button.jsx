'use client';

import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-secondary to-teal-700 text-white shadow-[0_4px_20px_rgba(13,148,136,0.2)] hover:shadow-[0_8px_30px_rgba(13,148,136,0.35)] focus:ring-secondary/40 border border-secondary/20',
    secondary: 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] focus:ring-accent/40 border border-accent/20',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.15)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)] focus:ring-red-500/40 border border-red-500/20',
    outline: 'border-2 border-border text-primary hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500/20 bg-transparent',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/40 shadow-glass',
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: -1.5, scale: 1.01 }}
      whileTap={{ y: 0, scale: 0.99 }}
      className={`${baseStyle} ${currentVariant} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}
