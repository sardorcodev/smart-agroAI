const VARIANT_CLASSES = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-700',
};

export default function Notice({ children, variant = 'info', className = '' }) {
  if (!children) return null;

  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`rounded-xl border px-4 py-3 text-sm font-bold ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.info} ${className}`}
    >
      {children}
    </div>
  );
}
