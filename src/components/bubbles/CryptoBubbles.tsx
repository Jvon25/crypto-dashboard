'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Coin } from '@/lib/types';
import { formatPercentage, formatPrice, cn } from '@/lib/utils';
import { Search, Flame, ShieldAlert, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface CryptoBubblesProps {
  coins: Coin[];
  selectedSymbol: string;
  onSelectCoin: (symbol: string) => void;
}

type FilterMode = 'ALL' | 'BULLISH' | 'BEARISH' | 'RISK' | 'GAINERS';
type SizeMode = 'volume' | 'marketCap';

export function CryptoBubbles({
  coins,
  selectedSymbol,
  onSelectCoin,
}: CryptoBubblesProps) {
  const [filter, setFilter] = useState<FilterMode>('ALL');
  const [sizeMode, setSizeMode] = useState<SizeMode>('volume');
  const [search, setSearch] = useState('');

  // Min and max values for scaling
  const { maxMetric, minMetric } = useMemo(() => {
    let max = 0;
    let min = Infinity;
    coins.forEach((c) => {
      const val = sizeMode === 'volume' ? c.volume24h : c.marketCap;
      if (val > max) max = val;
      if (val < min) min = val;
    });
    return { maxMetric: max, minMetric: min };
  }, [coins, sizeMode]);

  // Filtered coins
  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches =
          coin.symbol.toLowerCase().includes(query) ||
          coin.name.toLowerCase().includes(query);
        if (!matches) return false;
      }

      if (filter === 'BULLISH') return coin.status === 'BULLISH_CONDITIONS';
      if (filter === 'BEARISH') return coin.status === 'BEARISH_CONDITIONS';
      if (filter === 'RISK') return coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL';
      if (filter === 'GAINERS') return coin.change24h > 3;
      return true;
    });
  }, [coins, filter, search]);

  // Calculate bubble diameter based on volume or market cap
  const getBubbleSize = (coin: Coin) => {
    const val = sizeMode === 'volume' ? coin.volume24h : coin.marketCap;
    // Logarithmic scale so BTC doesn't overwhelm smaller coins
    const logVal = Math.log10(Math.max(val, 1));
    const logMin = Math.log10(Math.max(minMetric, 1));
    const logMax = Math.log10(Math.max(maxMetric, 1));

    const normalized = (logVal - logMin) / (logMax - logMin || 1);
    // Diameter range between 82px and 170px
    return Math.round(82 + normalized * 88);
  };

  return (
    <div className="terminal-card p-5 space-y-4 overflow-hidden relative">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1e2436] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live Crypto Market Bubbles
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              CLICK ANY BUBBLE TO INSPECT
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Bubble size reflects 24H {sizeMode === 'volume' ? 'Volume' : 'Market Cap'}. Color denotes 24H performance.
          </p>
        </div>

        {/* Filter Chips & Size Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0c0e17] border border-[#1e2436] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono w-36 sm:w-44"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0c0e17] p-1 rounded-lg border border-[#1e2436] text-[11px] font-mono">
            <button
              onClick={() => setFilter('ALL')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'ALL'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              All ({coins.length})
            </button>
            <button
              onClick={() => setFilter('BULLISH')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'BULLISH'
                  ? 'bg-emerald-600/20 text-emerald-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Bullish
            </button>
            <button
              onClick={() => setFilter('BEARISH')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'BEARISH'
                  ? 'bg-rose-600/20 text-rose-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Bearish
            </button>
            <button
              onClick={() => setFilter('RISK')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                filter === 'RISK'
                  ? 'bg-amber-600/20 text-amber-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              High Risk
            </button>
          </div>

          {/* Size By Toggle */}
          <div className="flex items-center gap-1 bg-[#0c0e17] p-1 rounded-lg border border-[#1e2436] text-[11px] font-mono">
            <button
              onClick={() => setSizeMode('volume')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                sizeMode === 'volume'
                  ? 'bg-purple-600/20 text-purple-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Volume
            </button>
            <button
              onClick={() => setSizeMode('marketCap')}
              className={cn(
                'px-2.5 py-1 rounded transition-colors',
                sizeMode === 'marketCap'
                  ? 'bg-purple-600/20 text-purple-400 font-semibold'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Market Cap
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Bubbles Playground Arena */}
      <div className="min-h-[420px] max-h-[560px] overflow-y-auto p-6 rounded-xl bg-[#080a11] border border-[#171b29] flex flex-wrap items-center justify-center gap-4 sm:gap-5 relative">
        <AnimatePresence>
          {filteredCoins.map((coin) => {
            const size = getBubbleSize(coin);
            const isSelected = coin.symbol === selectedSymbol;
            const isPositive = coin.change24h >= 0;
            const isHighRisk = coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL';

            return (
              <motion.button
                key={coin.symbol}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                whileHover={{ scale: 1.08, zIndex: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCoin(coin.symbol)}
                style={{ width: `${size}px`, height: `${size}px` }}
                className={cn(
                  'rounded-full flex flex-col items-center justify-center text-center p-2 transition-all relative cursor-pointer select-none group',
                  // Positive bubble gradient
                  isPositive
                    ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-[#0a1f18] border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-gradient-to-br from-rose-950/80 via-rose-900/40 to-[#220a0e] border-2 border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
                  // Highlight ring when selected
                  isSelected &&
                    'ring-4 ring-blue-500 ring-offset-2 ring-offset-[#080a11] border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] z-10 scale-105'
                )}
              >
                {/* Risk Warning Badge overlay */}
                {isHighRisk && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px] shadow-lg animate-pulse">
                    ⚠
                  </span>
                )}

                {/* Coin Symbol */}
                <span
                  className={cn(
                    'font-bold tracking-tight font-mono leading-none',
                    size > 130 ? 'text-lg sm:text-xl text-white' : size > 100 ? 'text-sm sm:text-base text-white' : 'text-xs text-gray-100'
                  )}
                >
                  {coin.symbol}
                </span>

                {/* 24h Change */}
                <span
                  className={cn(
                    'font-mono font-bold mt-1 leading-tight',
                    isPositive ? 'text-emerald-300' : 'text-rose-300',
                    size > 120 ? 'text-xs sm:text-sm' : 'text-[11px]'
                  )}
                >
                  {formatPercentage(coin.change24h)}
                </span>

                {/* Price (on medium/large bubbles) */}
                {size > 110 && (
                  <span className="text-[10px] text-gray-300 font-mono mt-0.5 opacity-90 truncate max-w-[90%]">
                    {formatPrice(coin.price)}
                  </span>
                )}

                {/* 4H/1H Mini Status pill on large bubbles */}
                {size > 135 && (
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-black/40 text-gray-300 border border-white/10 uppercase">
                    4H {coin.trend4h === 'UPTREND' ? '↑' : coin.trend4h === 'DOWNTREND' ? '↓' : '→'}
                  </span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filteredCoins.length === 0 && (
          <div className="text-center text-gray-400 font-mono py-16">
            <p className="text-sm">No coin bubbles match your current filter.</p>
            <button
              onClick={() => {
                setFilter('ALL');
                setSearch('');
              }}
              className="mt-2 text-xs text-blue-400 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
