'use client';

import React from 'react';
import type { RiskAnalysis } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskCardProps {
  analysis: RiskAnalysis;
}

export function RiskCard({ analysis }: RiskCardProps) {
  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
            On-Chain & Manipulation Risk Profile
          </h3>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider border uppercase',
            analysis.overallLevel === 'CRITICAL' || analysis.overallLevel === 'HIGH'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : analysis.overallLevel === 'MODERATE'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
          )}
        >
          {analysis.overallLevel} RISK
        </span>
      </div>

      {/* Quick Indicator Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {/* Wallet Concentration */}
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 block mb-1">CONCENTRATION</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-gray-400">
              {analysis.walletConcentration === 'CRITICAL' ? '██████████' : analysis.walletConcentration === 'HIGH' ? '████████░░' : analysis.walletConcentration === 'MODERATE' ? '██████░░░░' : '██░░░░░░░░'}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block uppercase">
            {analysis.walletConcentration}
          </span>
        </div>

        {/* Common Funding */}
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 block mb-1">COMMON FUNDING</span>
          <div className="flex items-center gap-1 font-bold">
            {analysis.commonFunding ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> DETECTED
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CLEAN
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {analysis.commonFunding ? 'Shared origin address' : 'Independent origins'}
          </span>
        </div>

        {/* Wallet Clustering */}
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 block mb-1">WALLET CLUSTERING</span>
          <div className="flex items-center gap-1 font-bold">
            {analysis.walletClustering ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> POSSIBLE
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> UNCLUSTERED
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {analysis.walletClustering ? 'Coordinated tx flow' : 'Organic holder graph'}
          </span>
        </div>

        {/* Liquidity */}
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436]">
          <span className="text-[10px] text-gray-400 block mb-1">LIQUIDITY DEPTH</span>
          <div className="flex items-center gap-1 font-bold">
            {analysis.liquidityHealthy ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> HEALTHY
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> FRAGILE
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {analysis.liquidityHealthy ? 'Order book resilience' : 'High slippage risk'}
          </span>
        </div>
      </div>

      {/* Explanatory Indicator List */}
      <div className="space-y-2 pt-1">
        {analysis.indicators.map((indicator, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between p-3 rounded-lg bg-[#0c0e17] border border-[#1e2436] text-xs font-mono"
          >
            <div>
              <span className="text-gray-200 font-semibold">{indicator.name}</span>
              <p className="text-[11px] text-gray-400 mt-0.5">{indicator.description}</p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ml-3',
                indicator.level === 'HIGH' || indicator.level === 'CRITICAL'
                  ? 'text-rose-400 bg-rose-500/10'
                  : indicator.level === 'MODERATE'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-gray-400 bg-gray-500/10'
              )}
            >
              {indicator.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
