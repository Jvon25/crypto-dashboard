import type { MarketCondition, MarketOverview } from '../types';
import { mockCoins } from './coins';

export function getMarketOverview(): MarketOverview {
  const bullishCount = mockCoins.filter((c) => c.status === 'BULLISH_CONDITIONS').length;
  const bearishCount = mockCoins.filter((c) => c.status === 'BEARISH_CONDITIONS').length;
  const highRiskCount = mockCoins.filter(
    (c) => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL' || c.status === 'HIGH_RISK' || c.status === 'ELEVATED_RISK'
  ).length;

  let condition: MarketCondition = 'NEUTRAL';
  if (bullishCount > bearishCount * 1.5) {
    condition = 'BULLISH';
  } else if (bearishCount > bullishCount * 1.5) {
    condition = 'BEARISH';
  } else if (bullishCount > 0 && bearishCount > 0) {
    condition = 'CONFLICTED';
  }

  return {
    condition,
    trendingCount: mockCoins.filter((c) => c.volumeLevel === 'VERY_HIGH' || Math.abs(c.change24h) >= 4).length,
    bullishCount,
    bearishCount,
    highRiskCount,
    totalCoins: mockCoins.length,
  };
}

export interface MacroIndicator {
  name: string;
  symbol: string;
  tf4h: 'UPTREND' | 'DOWNTREND' | 'NEUTRAL';
  tf1h: 'UPTREND' | 'DOWNTREND' | 'NEUTRAL';
  rsi4h: number;
  rsi1h: number;
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export const benchmarkAssets: MacroIndicator[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    tf4h: 'UPTREND',
    tf1h: 'UPTREND',
    rsi4h: 58.7,
    rsi1h: 62.4,
    bias: 'BULLISH',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    tf4h: 'UPTREND',
    tf1h: 'NEUTRAL',
    rsi4h: 54.2,
    rsi1h: 51.8,
    bias: 'BULLISH',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    tf4h: 'UPTREND',
    tf1h: 'UPTREND',
    rsi4h: 64.3,
    rsi1h: 67.1,
    bias: 'BULLISH',
  },
];
