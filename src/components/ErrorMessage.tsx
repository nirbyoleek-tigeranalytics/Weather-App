import React from 'react';
import { AlertCircle, RefreshCw, SearchX, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  isCityNotFound?: boolean;
  onRetry?: () => void;
  onClear?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  isCityNotFound = false,
  onRetry,
  onClear,
}) => {
  return (
    <div
      role="alert"
      className={`rounded-2xl p-6 border shadow-sm transition-all duration-200 my-4 ${
        isCityNotFound
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isCityNotFound ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
            }`}
          >
            {isCityNotFound ? (
              <SearchX className="w-6 h-6" aria-hidden="true" />
            ) : (
              <WifiOff className="w-6 h-6" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base tracking-tight">
              {isCityNotFound ? 'Location Not Found' : 'Unable to Retrieve Weather Data'}
            </h3>
            <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          {onRetry && !isCityNotFound && (
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}

          {onClear && (
            <button
              onClick={onClear}
              type="button"
              className="px-3.5 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
