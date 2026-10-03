'use client';

import React from 'react';
import type { DivergenceAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DivergenceCardProps {
  fourHour: DivergenceAnalysis;
  oneHour: DivergenceAnalysis;
}

export function DivergenceCard({ fourHour, oneHour }: DivergenceCardProps) {
  const hasDivergence = fourHour.type !== 'NONE' || oneHour.type !== 'NONE';

  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
          RSI Divergence Screening
        </h3>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border uppercase',
            fourHour.type === 'BULLISH'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : fourHour.type === 'BEARISH'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
          )}
        >
          {fourHour.type !== 'NONE' ? `${fourHour.type} DIVERGENCE` : 'NO DIVERGENCE'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 4H Divergence Card */}
        <div className="p-3.5 rounded-lg bg-[#0c0e17] border border-[#1e2436] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-400">4H TIMEFRAME</span>
            <span
              className={cn(
                'text-xs font-mono font-bold',
                fourHour.type === 'BULLISH'
                  ? 'text-emerald-400'
                  : fourHour.type === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-gray-400'
              )}
            >
              {fourHour.type}
            </span>
          </div>

          {fourHour.type !== 'NONE' ? (
            <div className="space-y-1.5 pt-1 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#151a29] p-2 rounded">
                <span className="text-gray-400">Price Action:</span>
                <span className="text-gray-200 font-semibold">{fourHour.priceAction}</span>
              </div>
              <div className="flex items-center justify-between bg-[#151a29] p-2 rounded">
                <span className="text-gray-400">RSI Action:</span>
                <span className="text-gray-200 font-semibold">{fourHour.rsiAction}</span>
              </div>
              <p className="text-[11px] text-gray-400 pt-1 leading-relaxed">
                {fourHour.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-mono py-4">
              No significant divergence detected on the 4H timeframe. Price and momentum are moving in unison.
            </p>
          )}
        </div>

        {/* 1H Divergence Card */}
        <div className="p-3.5 rounded-lg bg-[#0c0e17] border border-[#1e2436] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-400">1H TIMEFRAME</span>
            <span
              className={cn(
                'text-xs font-mono font-bold',
                oneHour.type === 'BULLISH'
                  ? 'text-emerald-400'
                  : oneHour.type === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-gray-400'
              )}
            >
              {oneHour.type}
            </span>
          </div>

          {oneHour.type !== 'NONE' ? (
            <div className="space-y-1.5 pt-1 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#151a29] p-2 rounded">
                <span className="text-gray-400">Price Action:</span>
                <span className="text-gray-200 font-semibold">{oneHour.priceAction}</span>
              </div>
              <div className="flex items-center justify-between bg-[#151a29] p-2 rounded">
                <span className="text-gray-400">RSI Action:</span>
                <span className="text-gray-200 font-semibold">{oneHour.rsiAction}</span>
              </div>
              <p className="text-[11px] text-gray-400 pt-1 leading-relaxed">
                {oneHour.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-mono py-4">
              No significant divergence detected on the 1H timeframe. Local momentum follows candle progression.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
