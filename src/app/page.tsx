'use client';

import React, { useState } from 'react';
import { CryptoBubblesArena } from '@/components/bubbles/CryptoBubblesArena';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { MarketStructureCard } from '@/components/analysis/MarketStructureCard';
import { RSICard } from '@/components/analysis/RSICard';
import { DivergenceCard } from '@/components/analysis/DivergenceCard';
import { RiskCard } from '@/components/analysis/RiskCard';
import { EvidencePanel } from '@/components/analysis/EvidencePanel';
import { WalletGraphView } from '@/components/analysis/WalletGraph';
import { mockCoins } from '@/lib/mock-data/coins';
import { getCoinAnalysis } from '@/lib/mock-data/analysis';
import { getWalletGraph } from '@/lib/mock-data/wallets';
import { getOHLCVData } from '@/lib/mock-data/charts';
import { useWatchlist } from '@/context/WatchlistContext';
import { useBinanceMarket } from '@/lib/binance-market';
import { formatPrice, formatPercentage, formatVolume, cn } from '@/lib/utils';
import type { Timeframe } from '@/lib/types';
import {
  Star,
  LineChart,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from 'lucide-react';

export default function SplitScreenCryptoTerminal() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('QNT');
  const [activeTab, setActiveTab] = useState<'chart' | 'technical' | 'risk'>('chart');
  const [timeframe, setTimeframe] = useState<Timeframe>('4H');

  const { isLive, hasInitialData, marketCoins } = useBinanceMarket();

  const analysis = getCoinAnalysis(selectedSymbol, marketCoins) || getCoinAnalysis('QNT', marketCoins) || getCoinAnalysis('BTC', marketCoins)!;
  const walletGraph = getWalletGraph(selectedSymbol);
  const chartData = getOHLCVData(selectedSymbol, timeframe, marketCoins);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { coin } = analysis;
  const inWatchlist = isInWatchlist(coin.symbol);

  return (
    <div className="w-full h-full space-y-4">
      {/* Split Screen Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SIDE: Animated Crypto Bubbles Arena (5 out of 12 or 6 out of 12) */}
        <div className="lg:col-span-6 w-full sticky top-16">
          <CryptoBubblesArena
            coins={marketCoins}
            selectedSymbol={selectedSymbol}
            onSelectCoin={setSelectedSymbol}
          />
        </div>

        {/* RIGHT SIDE: Instant Coin Intelligence Inspector (6 out of 12) */}
        <div className="lg:col-span-6 w-full space-y-4">
          {/* Main Selected Coin Header Card */}
          <div className="bg-[#0b0e17] border border-[#1b2133] rounded-2xl p-5 shadow-xl space-y-4">
            {/* Top row: Symbol, Pair, Watchlist, Price, 24h */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Coin Identity */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-lg shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                  {coin.symbol}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {coin.symbol} <span className="text-gray-400 text-sm font-normal">/ USDT</span>
                    </h2>
                    <span className="text-xs text-gray-400 font-mono px-2 py-0.5 rounded bg-[#151a29]">
                      {coin.name}
                    </span>
                    <button
                      onClick={() => toggleWatchlist(coin.symbol)}
                      className={cn(
                        'p-1.5 rounded-lg border border-[#1e2436] hover:bg-[#151a29] transition-colors',
                        inWatchlist ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                      )}
                      title={inWatchlist ? 'Starred' : 'Add to favorites'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Classification Badge */}
                  <div className="mt-1">
                    <span
                      className={cn(
                        'text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block',
                        coin.status === 'BULLISH_CONDITIONS'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : coin.status === 'BEARISH_CONDITIONS'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      )}
                    >
                      {analysis.classificationLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & 24H stats */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em]',
                      hasInitialData
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', isLive ? 'bg-emerald-400' : 'bg-amber-400')} />
                    {hasInitialData ? (isLive ? 'Live' : 'Syncing') : 'Loading'}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatPrice(coin.price)}
                </div>
                <div
                  className={cn(
                    'text-sm font-bold font-mono',
                    coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  )}
                >
                  {formatPercentage(coin.change24h)} (24H)
                </div>
              </div>
            </div>

            {/* Quick 4-point verdict row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1b2133] text-xs font-mono">
              {/* 4H Trend */}
              <div className="bg-[#07090e] p-2 rounded-lg border border-[#1b2133] flex flex-col justify-between">
                <span className="text-[10px] text-gray-400">4H TREND</span>
                <span
                  className={cn(
                    'font-bold flex items-center gap-0.5 mt-0.5',
                    coin.trend4h === 'UPTREND'
                      ? 'text-emerald-400'
                      : coin.trend4h === 'DOWNTREND'
                      ? 'text-rose-400'
                      : 'text-gray-400'
                  )}
                >
                  {coin.trend4h === 'UPTREND' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : coin.trend4h === 'DOWNTREND' ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  {coin.trend4h}
                </span>
              </div>

              {/* 1H Trend */}
              <div className="bg-[#07090e] p-2 rounded-lg border border-[#1b2133] flex flex-col justify-between">
                <span className="text-[10px] text-gray-400">1H TREND</span>
                <span
                  className={cn(
                    'font-bold flex items-center gap-0.5 mt-0.5',
                    coin.trend1h === 'UPTREND'
                      ? 'text-emerald-400'
                      : coin.trend1h === 'DOWNTREND'
                      ? 'text-rose-400'
                      : 'text-gray-400'
                  )}
                >
                  {coin.trend1h === 'UPTREND' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : coin.trend1h === 'DOWNTREND' ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  {coin.trend1h}
                </span>
              </div>

              {/* RSI */}
              <div className="bg-[#07090e] p-2 rounded-lg border border-[#1b2133] flex flex-col justify-between">
                <span className="text-[10px] text-gray-400">RSI(30)</span>
                <span
                  className={cn(
                    'font-bold mt-0.5',
                    coin.rsi4h >= 50 ? 'text-emerald-400' : 'text-rose-400'
                  )}
                >
                  {coin.rsi4h.toFixed(1)} {coin.rsi4h >= 50 ? '(>50)' : '(<50)'}
                </span>
              </div>

              {/* Risk */}
              <div className="bg-[#07090e] p-2 rounded-lg border border-[#1b2133] flex flex-col justify-between">
                <span className="text-[10px] text-gray-400">RISK</span>
                <span
                  className={cn(
                    'font-bold mt-0.5',
                    coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL'
                      ? 'text-rose-400'
                      : coin.riskLevel === 'MODERATE'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  )}
                >
                  {coin.riskLevel}
                </span>
              </div>
            </div>

            {/* Navigation Tabs to keep detail uncluttered */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-[#1b2133]">
              <button
                onClick={() => setActiveTab('chart')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all',
                  activeTab === 'chart'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-[#121624] text-gray-400 hover:text-white'
                )}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Chart & Verdict</span>
              </button>

              <button
                onClick={() => setActiveTab('technical')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all',
                  activeTab === 'technical'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-[#121624] text-gray-400 hover:text-white'
                )}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Trend & RSI</span>
              </button>

              <button
                onClick={() => setActiveTab('risk')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all',
                  activeTab === 'risk'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : 'bg-[#121624] text-gray-400 hover:text-white'
                )}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>On-Chain Risk</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Clean Interactive Chart & Evidence Synthesis */}
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <CandlestickChart
                data={chartData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                symbol={coin.symbol}
              />

              <EvidencePanel
                reasons={analysis.evidenceReasons}
                classification={analysis.classification}
                classificationLabel={analysis.classificationLabel}
              />
            </div>
          )}

          {/* Tab 2: Market Structure Timeline & RSI Momentum Gauge */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              <MarketStructureCard
                fourHour={analysis.trendAnalysis.fourHour}
                oneHour={analysis.trendAnalysis.oneHour}
                alignment={analysis.trendAnalysis.alignment}
              />

              <RSICard analysis={analysis.rsiAnalysis} />

              <DivergenceCard
                fourHour={analysis.divergenceAnalysis.fourHour}
                oneHour={analysis.divergenceAnalysis.oneHour}
              />
            </div>
          )}

          {/* Tab 3: On-Chain Risk Analysis & Animated Wallet Graph */}
          {activeTab === 'risk' && (
            <div className="space-y-4">
              <RiskCard analysis={analysis.riskAnalysis} />
              <WalletGraphView graph={walletGraph} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
