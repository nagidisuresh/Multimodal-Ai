'use client';

import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  isMockNotice?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  onDismiss,
  isMockNotice = false,
}) => {
  return (
    <div
      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs animate-in fade-in ${
        isMockNotice
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-red-500/10 border-red-500/30 text-red-300'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className={`w-4 h-4 shrink-0 ${isMockNotice ? 'text-amber-400' : 'text-red-400'}`} />
        <span className="font-medium leading-relaxed">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-bold text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
