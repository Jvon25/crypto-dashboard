'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowRight, ShieldCheck, ShieldAlert, Star } from 'lucide-react';
import type { Coin } from '@/lib/types';
import { formatPrice, formatPercentage, formatVolume, cn } from '@/lib/utils';
import { useWatchlist } from '@/context/WatchlistContext';

interface TrendingCoinsProps {
  coins: Coin[];
}

export function TrendingCoins({ coins }: TrendingCoinsProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  return (
    <div className="terminal-card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[#1e2436]">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
            Screened Market Assets
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            4H/1H structural state, RSI momentum, divergence status, and on-chain risk
          </p>
        </div>
        <Link
          href="/scanner"
          className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Open Full Scanner <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1e2436] bg-[#0c0e17] text-gray-400 font-mono text-[11px]">
              <th className="py-3 px-4 w-10 text-center">★</th>
              <th className="py-3 px-4">COIN</th>
              <th className="py-3 px-4 text-right">PRICE</th>
              <th className="py-3 px-4 text-right">24H</th>
              <th className="py-3 px-4 text-right">VOLUME</th>
              <th className="py-3 px-4 text-center">4H</th>
              <th className="py-3 px-4 text-center">1H</th>
              <th className="py-3 px-4 text-right">RSI(30)</th>
              <th className="py-3 px-4 text-center">RISK</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2436]/60">
            {coins.map((coin) => {
              const inWatchlist = isInWatchlist(coin.symbol);

              return (
                <tr
                  key={coin.symbol}
                  className="hover:bg-[#151a29]/60 transition-colors group"
                >
                  {/* Watchlist star */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(coin.symbol);
                      }}
                      className={cn(
                        'p-1 rounded hover:bg-[#1e2436] transition-colors',
                        inWatchlist ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                      )}
                      aria-label="Toggle watchlist"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>

                  {/* Coin */}
                  <td className="py-3.5 px-4">
                    <Link href={`/coin/${coin.symbol}`} className="flex items-center gap-2">
                      <span className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                        {coin.symbol}
                      </span>
                      <span className="text-gray-400 hidden sm:inline text-[11px] truncate max-w-[90px]">
                        {coin.name}
                      </span>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-200">
                    {formatPrice(coin.price)}
                  </td>

                  {/* 24h Change */}
                  <td
                    className={cn(
                      'py-3.5 px-4 text-right font-mono font-medium',
                      coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    )}
                  >
                    {formatPercentage(coin.change24h)}
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-400">
                    {formatVolume(coin.volume24h)}
                  </td>

                  {/* 4H Trend */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    {coin.trend4h === 'UPTREND' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> UP
                      </span>
                    ) : coin.trend4h === 'DOWNTREND' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" /> DOWN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        <Minus className="w-3 h-3 mr-0.5" /> RANGE
                      </span>
                    )}
                  </td>

                  {/* 1H Trend */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    {coin.trend1h === 'UPTREND' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> UP
                      </span>
                    ) : coin.trend1h === 'DOWNTREND' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" /> DOWN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        <Minus className="w-3 h-3 mr-0.5" /> RANGE
                      </span>
                    )}
                  </td>

                  {/* RSI */}
                  <td className="py-3.5 px-4 text-right font-mono">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[11px]',
                        coin.rsi4h >= 50
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      )}
                    >
                      {coin.rsi4h.toFixed(1)}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase',
                        coin.riskLevel === 'CRITICAL' || coin.riskLevel === 'HIGH'
                          ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          : coin.riskLevel === 'MODERATE'
                          ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                      )}
                    >
                      {coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL' ? (
                        <ShieldAlert className="w-3 h-3" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      {coin.riskLevel}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={cn(
                        'text-[10px] uppercase font-semibold px-2 py-0.5 rounded border',
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
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/coin/${coin.symbol}`}
                      className="px-2.5 py-1 rounded bg-[#1e2436] hover:bg-blue-600 hover:text-white text-gray-300 transition-colors font-sans text-xs inline-block"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
