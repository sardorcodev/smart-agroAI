import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Yuklanmoqda...', className = '' }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-green-400" aria-hidden="true" />
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
}
