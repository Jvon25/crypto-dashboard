'use client';

import React from 'react';
import type { RSIAnalysis } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Gauge } from 'lucide-react';

interface RSICardProps {
  analysis: RSIAnalysis;
}

export function RSICard({ analysis }: RSICardProps) {
  const isBullish4h = analysis.value4h >= analysis.threshold;
  const isBullish1h = analysis.value1h >= analysis.threshold;

  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
            RSI({analysis.period}) Momentum Oscillator
          </h3>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          BASELINE THRESHOLD: {analysis.threshold}
        </span>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 gap-4">
        {/* 4H RSI */}
        <div className="p-3.5 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-gray-400">4H RSI</span>
            <span
              className={cn(
                'text-xs font-mono font-bold px-1.5 py-0.5 rounded',
                isBullish4h ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              )}
            >
              {analysis.value4h.toFixed(1)}
            </span>
          </div>

          {/* Bar gauge */}
          <div className="w-full bg-[#1e2436] h-2 rounded-full overflow-hidden relative my-2">
            {/* Center 50 indicator */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gray-500 z-10" />
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isBullish4h ? 'bg-emerald-400' : 'bg-rose-400'
              )}
              style={{ width: `${Math.min(100, Math.max(0, analysis.value4h))}%` }}
            />
          </div>

          <span className="text-[10px] text-gray-400 font-mono block">
            {isBullish4h ? 'Above 50: Bullish momentum regime' : 'Below 50: Bearish momentum regime'}
          </span>
        </div>

        {/* 1H RSI */}
        <div className="p-3.5 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-gray-400">1H RSI</span>
            <span
              className={cn(
                'text-xs font-mono font-bold px-1.5 py-0.5 rounded',
                isBullish1h ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              )}
            >
              {analysis.value1h.toFixed(1)}
            </span>
          </div>

          {/* Bar gauge */}
          <div className="w-full bg-[#1e2436] h-2 rounded-full overflow-hidden relative my-2">
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gray-500 z-10" />
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isBullish1h ? 'bg-emerald-400' : 'bg-rose-400'
              )}
              style={{ width: `${Math.min(100, Math.max(0, analysis.value1h))}%` }}
            />
          </div>

          <span className="text-[10px] text-gray-400 font-mono block">
            {isBullish1h ? 'Above 50: Bullish momentum regime' : 'Below 50: Bearish momentum regime'}
          </span>
        </div>
      </div>

      {/* Explanatory Context Note */}
      <div className="p-2.5 rounded-md bg-[#151a29]/80 border border-[#232b42] text-[11px] font-mono text-gray-400 flex items-center justify-between">
        <span>INTERPRETATION GUIDELINE</span>
        <span className="text-gray-300">
          RSI relative to 50 threshold indicates underlying momentum environment, not an automated buy/sell signal.
        </span>
      </div>
    </div>
  );
}
