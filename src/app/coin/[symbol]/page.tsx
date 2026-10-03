'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ExternalLink, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
import { getCoinAnalysis } from '@/lib/mock-data/analysis';
import { getWalletGraph } from '@/lib/mock-data/wallets';
import { getOHLCVData } from '@/lib/mock-data/charts';
import { MarketStructureCard } from '@/components/analysis/MarketStructureCard';
import { RSICard } from '@/components/analysis/RSICard';
import { DivergenceCard } from '@/components/analysis/DivergenceCard';
import { RiskCard } from '@/components/analysis/RiskCard';
import { EvidencePanel } from '@/components/analysis/EvidencePanel';
import { WalletGraphView } from '@/components/analysis/WalletGraph';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { useWatchlist } from '@/context/WatchlistContext';
import { useBinanceMarket } from '@/lib/binance-market';
import { formatPrice, formatPercentage, formatVolume, cn } from '@/lib/utils';
import type { Timeframe } from '@/lib/types';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default function CoinDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  const [timeframe, setTimeframe] = useState<Timeframe>('4H');

  useBinanceMarket();

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const analysis = getCoinAnalysis(symbol);
  const walletGraph = getWalletGraph(symbol);
  const chartData = getOHLCVData(symbol, timeframe);

  if (!analysis) {
    return (
      <div className="terminal-card p-12 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Coin &quot;{symbol}&quot; Not Found</h2>
        <p className="text-xs text-gray-400 font-mono mb-4">
          This asset is not part of the active mock simulation universe.
        </p>
        <Link
          href="/scanner"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Scanner
        </Link>
      </div>
    );
  }

  const { coin } = analysis;
  const inWatchlist = isInWatchlist(coin.symbol);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Coin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2436] pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/scanner"
            className="p-2 rounded-lg bg-[#0c0e17] border border-[#1e2436] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {coin.symbol} / USDT
              </h1>
              <span className="text-sm text-gray-400 font-mono">{coin.name}</span>
              <button
                onClick={() => toggleWatchlist(coin.symbol)}
                className={cn(
                  'p-1.5 rounded-lg border border-[#1e2436] hover:bg-[#151a29] transition-colors',
                  inWatchlist ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                )}
                aria-label="Toggle Watchlist"
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Comprehensive Confluence & Structural Risk Breakdown
            </p>
          </div>
        </div>

        {/* Live Simulation Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl font-bold font-mono text-white">
              {formatPrice(coin.price)}
            </div>
            <div
              className={cn(
                'text-xs font-mono font-medium',
                coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {formatPercentage(coin.change24h)} (24H)
            </div>
          </div>
          <div className="hidden sm:block text-right border-l border-[#1e2436] pl-4">
            <span className="text-[10px] text-gray-400 font-mono block">24H VOLUME</span>
            <span className="text-xs font-mono text-gray-300 font-semibold">
              {formatVolume(coin.volume24h)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Candlestick Chart */}
      <CandlestickChart
        data={chartData}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        symbol={coin.symbol}
      />

      {/* Primary Structural Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketStructureCard
          fourHour={analysis.trendAnalysis.fourHour}
          oneHour={analysis.trendAnalysis.oneHour}
          alignment={analysis.trendAnalysis.alignment}
        />
        <RSICard analysis={analysis.rsiAnalysis} />
      </div>

      {/* Divergence Section */}
      <DivergenceCard
        fourHour={analysis.divergenceAnalysis.fourHour}
        oneHour={analysis.divergenceAnalysis.oneHour}
      />

      {/* Risk Analysis Card */}
      <RiskCard analysis={analysis.riskAnalysis} />

      {/* Wallet Clustering Graph Visualization */}
      <WalletGraphView graph={walletGraph} />

      {/* Synthesized Evidence Panel */}
      <EvidencePanel
        reasons={analysis.evidenceReasons}
        classification={analysis.classification}
        classificationLabel={analysis.classificationLabel}
      />
    </div>
  );
}
