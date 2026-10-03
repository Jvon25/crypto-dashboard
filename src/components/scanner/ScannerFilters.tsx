'use client';

import React from 'react';
import type { ScannerFilters } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

interface ScannerFiltersProps {
  filters: ScannerFilters;
  onChange: (filters: ScannerFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export function ScannerFiltersBar({
  filters,
  onChange,
  onReset,
  resultCount,
}: ScannerFiltersProps) {
  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
            Filter Parameters
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
            {resultCount} ASSETS MATCHED
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Overall Trend */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            Overall Trend
          </label>
          <select
            value={filters.trend}
            onChange={(e) => onChange({ ...filters, trend: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Conditions</option>
            <option value="BULLISH">Bullish Only</option>
            <option value="BEARISH">Bearish Only</option>
            <option value="NEUTRAL">Neutral Only</option>
          </select>
        </div>

        {/* 4H Trend */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            4H Structure
          </label>
          <select
            value={filters.trend4h}
            onChange={(e) => onChange({ ...filters, trend4h: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All 4H Trends</option>
            <option value="UPTREND">Uptrend (HH/HL)</option>
            <option value="DOWNTREND">Downtrend (LH/LL)</option>
            <option value="NEUTRAL">Consolidating</option>
          </select>
        </div>

        {/* 1H Trend */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            1H Structure
          </label>
          <select
            value={filters.trend1h}
            onChange={(e) => onChange({ ...filters, trend1h: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All 1H Trends</option>
            <option value="UPTREND">Uptrend</option>
            <option value="DOWNTREND">Downtrend</option>
            <option value="NEUTRAL">Neutral</option>
          </select>
        </div>

        {/* RSI(30) Momentum */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            RSI(30) Regime
          </label>
          <select
            value={filters.rsi}
            onChange={(e) => onChange({ ...filters, rsi: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Levels</option>
            <option value="ABOVE_50">Above 50 (Bullish Momentum)</option>
            <option value="BELOW_50">Below 50 (Bearish Momentum)</option>
          </select>
        </div>

        {/* Divergence */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            Divergence
          </label>
          <select
            value={filters.divergence}
            onChange={(e) => onChange({ ...filters, divergence: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All</option>
            <option value="BULLISH">Bullish Divergence</option>
            <option value="BEARISH">Bearish Divergence</option>
            <option value="NONE">None</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1.5 uppercase">
            On-Chain Risk
          </label>
          <select
            value={filters.risk}
            onChange={(e) => onChange({ ...filters, risk: e.target.value as any })}
            className="w-full bg-[#0c0e17] border border-[#1e2436] text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High / Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}
