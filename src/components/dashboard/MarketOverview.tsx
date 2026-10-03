'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from 'lucide-react';
import { benchmarkAssets } from '@/lib/mock-data/market';
import { cn } from '@/lib/utils';

export function MarketOverview() {
  return (
    <div className="terminal-card p-5">
      <div className="flex items-center justify-between mb-4 border-b border-[#1e2436] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
            Market Structure Benchmarks
          </h2>
        </div>
        <span className="text-[11px] font-mono text-gray-400">4H & 1H TIMEFRAME SYNC</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {benchmarkAssets.map((asset) => (
          <Link
            key={asset.symbol}
            href={`/coin/${asset.symbol}`}
            className="flex items-center justify-between p-3.5 rounded-lg bg-[#0c0e17] border border-[#1e2436] hover:border-blue-500/40 transition-all duration-150 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                  {asset.symbol}
                </span>
                <span className="text-xs text-gray-400">{asset.name}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                {/* 4H Indicator */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">4H</span>
                  {asset.tf4h === 'UPTREND' ? (
                    <span className="text-emerald-400 flex items-center font-medium">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Bullish
                    </span>
                  ) : asset.tf4h === 'DOWNTREND' ? (
                    <span className="text-rose-400 flex items-center font-medium">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Bearish
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center">
                      <Minus className="w-3.5 h-3.5" /> Neutral
                    </span>
                  )}
                </div>

                {/* 1H Indicator */}
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">1H</span>
                  {asset.tf1h === 'UPTREND' ? (
                    <span className="text-emerald-400 flex items-center font-medium">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Bullish
                    </span>
                  ) : asset.tf1h === 'DOWNTREND' ? (
                    <span className="text-rose-400 flex items-center font-medium">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Bearish
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center">
                      <Minus className="w-3.5 h-3.5" /> Neutral
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RSI Mini Indicator */}
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">RSI(30) 4H</span>
              <span
                className={cn(
                  'text-xs font-mono font-medium',
                  asset.rsi4h >= 50 ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {asset.rsi4h}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
