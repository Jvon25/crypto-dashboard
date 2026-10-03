'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to load market data',
  message = 'This platform is currently operating on simulated mock data. Please refresh or check the simulation configuration.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="terminal-card p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-200">{title}</h3>
      <p className="text-xs text-gray-400 font-mono mt-1.5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-lg bg-[#151a29] border border-[#232b42] text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Simulation</span>
        </button>
      )}
    </div>
  );
}
