import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingSpinner({ message = 'Loading...', fullscreen = false }: { message?: string; fullscreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {content}
      </div>
    );
  }
  return content;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-danger-50 border border-danger-200 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-danger-600" />
      </div>
      <p className="text-sm font-medium text-danger-700 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-danger-200 text-danger-700 text-sm font-semibold hover:bg-danger-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}

export function DataSourceBadge({ source }: { source?: string }) {
  const config: Record<string, { label: string; color: string; dot: string }> = {
    live: { label: 'Live API', color: 'bg-success-100 text-success-700', dot: 'bg-success-500' },
    mock: { label: 'Simulated Data', color: 'bg-warning-100 text-warning-700', dot: 'bg-warning-500' },
    db: { label: 'Database', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500' },
  };

  // Safely ensure the source is a valid string, otherwise default to 'live'
  const safeSource = typeof source === 'string' && config[source] ? source : 'live';
  const c = config[safeSource];

  // The '?' (optional chaining) ensures it NEVER crashes, even if 'c' randomly becomes undefined
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold ${c?.color || 'bg-success-100 text-success-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c?.dot || 'bg-success-500'} animate-pulse`} />
      {c?.label || 'Live API'}
    </span>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-card">
      <div className="shimmer-bg h-4 w-24 rounded mb-4" />
      <div className="shimmer-bg h-8 w-16 rounded mb-3" />
      <div className="shimmer-bg h-3 w-full rounded" />
    </div>
  );
}
