'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { MarketOverview } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  overview: MarketOverview;
}

export function SummaryCards({ overview }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Market Trend',
      value: overview.condition,
      subtitle: `${overview.bullishCount} Bullish vs ${overview.bearishCount} Bearish`,
      icon: TrendingUp,
      color: overview.condition === 'BULLISH' ? 'text-emerald-400' : overview.condition === 'BEARISH' ? 'text-rose-400' : 'text-amber-400',
      bgColor: overview.condition === 'BULLISH' ? 'bg-emerald-500/10' : overview.condition === 'BEARISH' ? 'bg-rose-500/10' : 'bg-amber-500/10',
      borderColor: overview.condition === 'BULLISH' ? 'border-emerald-500/30' : overview.condition === 'BEARISH' ? 'border-rose-500/30' : 'border-amber-500/30',
    },
    {
      title: 'Trending Coins',
      value: overview.trendingCount.toString(),
      subtitle: 'Elevated 24h Volume / Volatility',
      icon: Flame,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Bullish Setups',
      value: overview.bullishCount.toString(),
      subtitle: 'Confluent 4H & 1H Uptrend',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'High Risk Coins',
      value: overview.highRiskCount.toString(),
      subtitle: 'Concentration or Cluster Flags',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className={cn(
              'terminal-card p-5 relative overflow-hidden group hover:border-[#2e3752]'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={cn('p-2 rounded-lg border', card.bgColor, card.borderColor)}>
                <Icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>
            <div className={cn('text-2xl font-bold tracking-tight mb-1', card.color)}>
              {card.value}
            </div>
            <p className="text-xs text-gray-400 font-mono">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
