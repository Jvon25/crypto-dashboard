'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, GitCommit, CheckCircle2 } from 'lucide-react';
import type { TrendAnalysis, MarketCondition } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MarketStructureCardProps {
  fourHour: TrendAnalysis;
  oneHour: TrendAnalysis;
  alignment: MarketCondition;
}

export function MarketStructureCard({
  fourHour,
  oneHour,
  alignment,
}: MarketStructureCardProps) {
  const steps = [
    { label: 'Higher High', active: fourHour.higherHighs, tag: 'HH' },
    { label: 'Higher Low', active: fourHour.higherLows, tag: 'HL' },
    { label: 'Higher High', active: fourHour.higherHighs, tag: 'HH' },
    { label: 'Higher Low', active: fourHour.higherLows, tag: 'HL' },
  ];

  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
          Market Structure & Trend Alignment
        </h3>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border uppercase',
            alignment === 'BULLISH'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : alignment === 'BEARISH'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          )}
        >
          {alignment} ALIGNMENT
        </span>
      </div>

      {/* 4H and 1H Status Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 font-mono block mb-1">4H TIMEFRAME</span>
          <div className="flex items-center gap-1.5">
            {fourHour.trend === 'UPTREND' ? (
              <span className="text-emerald-400 font-bold text-sm flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> UPTREND
              </span>
            ) : fourHour.trend === 'DOWNTREND' ? (
              <span className="text-rose-400 font-bold text-sm flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-0.5" /> DOWNTREND
              </span>
            ) : (
              <span className="text-gray-400 font-bold text-sm flex items-center">
                <Minus className="w-4 h-4 mr-0.5" /> NEUTRAL
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-1">{fourHour.description}</p>
        </div>

        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 font-mono block mb-1">1H TIMEFRAME</span>
          <div className="flex items-center gap-1.5">
            {oneHour.trend === 'UPTREND' ? (
              <span className="text-emerald-400 font-bold text-sm flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> UPTREND
              </span>
            ) : oneHour.trend === 'DOWNTREND' ? (
              <span className="text-rose-400 font-bold text-sm flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-0.5" /> DOWNTREND
              </span>
            ) : (
              <span className="text-gray-400 font-bold text-sm flex items-center">
                <Minus className="w-4 h-4 mr-0.5" /> NEUTRAL
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono mt-1">{oneHour.description}</p>
        </div>
      </div>

      {/* Structural Progression Flow */}
      <div className="pt-2">
        <span className="text-[11px] text-gray-400 font-mono block mb-3">
          STRUCTURAL PRICE ACTION PROGRESSION
        </span>
        <div className="flex items-center justify-between relative px-2">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-[#1e2436] -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-all',
                  fourHour.trend === 'UPTREND'
                    ? 'bg-[#0f121d] border-emerald-500/50 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                    : fourHour.trend === 'DOWNTREND'
                    ? 'bg-[#0f121d] border-rose-500/50 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                    : 'bg-[#0f121d] border-gray-600 text-gray-400'
                )}
              >
                {fourHour.trend === 'UPTREND'
                  ? step.tag
                  : fourHour.trend === 'DOWNTREND'
                  ? idx % 2 === 0 ? 'LH' : 'LL'
                  : 'R'}
              </div>
              <span className="text-[10px] text-gray-400 font-mono mt-2 text-center whitespace-nowrap">
                {fourHour.trend === 'UPTREND'
                  ? step.label
                  : fourHour.trend === 'DOWNTREND'
                  ? idx % 2 === 0 ? 'Lower High' : 'Lower Low'
                  : 'Range Boundary'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
