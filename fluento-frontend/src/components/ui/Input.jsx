'use client';

export default function Input({
  id,
  label,
  type = 'text',
  name,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-primary/95 mb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className={`w-full px-4 py-3.5 rounded-xl border bg-white text-primary placeholder-muted focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-border focus:border-secondary focus:ring-secondary/20'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
