'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowRight, ShieldAlert, ShieldCheck, Star } from 'lucide-react';
import type { Coin } from '@/lib/types';
import { formatPrice, formatPercentage, formatVolume, cn } from '@/lib/utils';
import { useWatchlist } from '@/context/WatchlistContext';

interface CoinCardProps {
  coin: Coin;
}

export function CoinCard({ coin }: CoinCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(coin.symbol);

  return (
    <div className="terminal-card p-5 relative group hover:border-blue-500/40 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
              {coin.symbol} / USDT
            </span>
            <button
              onClick={() => toggleWatchlist(coin.symbol)}
              className={cn(
                'p-1 rounded hover:bg-[#1e2436] transition-colors',
                inWatchlist ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
              )}
              aria-label="Bookmark"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
          <span
            className={cn(
              'font-mono text-sm font-semibold',
              coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {formatPercentage(coin.change24h)}
          </span>
        </div>

        <div className="text-xl font-bold font-mono text-gray-100 mb-4">
          {formatPrice(coin.price)}
        </div>

        {/* Structural Matrix */}
        <div className="space-y-2 py-3 border-y border-[#1e2436]/70 text-xs font-mono">
          {/* 4H */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">4H Trend</span>
            {coin.trend4h === 'UPTREND' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> UPTREND
              </span>
            ) : coin.trend4h === 'DOWNTREND' ? (
              <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> DOWNTREND
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-0.5">
                <Minus className="w-3.5 h-3.5" /> NEUTRAL
              </span>
            )}
          </div>

          {/* 1H */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">1H Trend</span>
            {coin.trend1h === 'UPTREND' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> UPTREND
              </span>
            ) : coin.trend1h === 'DOWNTREND' ? (
              <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> DOWNTREND
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-0.5">
                <Minus className="w-3.5 h-3.5" /> NEUTRAL
              </span>
            )}
          </div>

          {/* RSI */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400">RSI(30)</span>
            <span
              className={cn(
                'font-semibold',
                coin.rsi4h >= 50 ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {coin.rsi4h.toFixed(1)} {coin.rsi4h >= 50 ? '(>50)' : '(<50)'}
            </span>
          </div>

          {/* Divergence */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Divergence</span>
            <span
              className={cn(
                'font-semibold',
                coin.divergence4h === 'BULLISH'
                  ? 'text-emerald-400'
                  : coin.divergence4h === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-gray-400'
              )}
            >
              {coin.divergence4h}
            </span>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Volume</span>
            <span className="text-gray-300 font-semibold">{coin.volumeLevel}</span>
          </div>

          {/* Risk */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Risk Level</span>
            <span
              className={cn(
                'font-semibold flex items-center gap-1',
                coin.riskLevel === 'CRITICAL' || coin.riskLevel === 'HIGH'
                  ? 'text-rose-400'
                  : coin.riskLevel === 'MODERATE'
                  ? 'text-amber-400'
                  : 'text-gray-400'
              )}
            >
              {coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL' ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              {coin.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Condition & Link */}
      <div className="mt-4 pt-3 border-t border-[#1e2436]/50">
        <div className="mb-3">
          <span
            className={cn(
              'text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block',
              coin.status === 'BULLISH_CONDITIONS'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : coin.status === 'BEARISH_CONDITIONS'
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                : coin.status === 'ELEVATED_RISK' || coin.status === 'HIGH_RISK'
                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
            )}
          >
            {coin.status.replace('_', ' ')}
          </span>
        </div>

        <Link
          href={`/coin/${coin.symbol}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#151a29] hover:bg-blue-600/20 border border-[#232b42] hover:border-blue-500/50 text-xs font-medium text-gray-200 hover:text-blue-300 transition-all group-hover:shadow-[0_0_10px_rgba(59,130,246,0.1)]"
        >
          <span>View Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
