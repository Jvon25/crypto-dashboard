'use client';

import React from 'react';
import type { WalletGraph } from '@/lib/types';
import { Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletGraphProps {
  graph: WalletGraph;
}

export function WalletGraphView({ graph }: WalletGraphProps) {
  const isSuspicious = graph.riskDescription.includes('HIGH RISK');

  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e2436] pb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider font-mono">
            Wallet Clustering & Funding Topology
          </h3>
        </div>
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border uppercase',
            isSuspicious
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          )}
        >
          {isSuspicious ? 'CLUSTER ANOMALY' : 'DISTRIBUTED GRAPH'}
        </span>
      </div>

      {/* Visual Simulated Flow Chart */}
      <div className="p-6 rounded-lg bg-[#08090f] border border-[#1e2436] relative overflow-hidden">
        {/* Source Node */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-lg bg-[#151a29] border border-blue-500/40 text-blue-300 font-mono text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-subtle" />
            <span>{graph.nodes[0]?.label || 'Funding Origin Proxy'}</span>
          </div>
        </div>

        {/* Dynamic Branching Connector Lines */}
        <div className="flex justify-center items-center my-1 relative h-6">
          <div className="w-[70%] h-[2px] bg-[#232b42] relative">
            <div className="absolute left-0 w-2 h-2 rounded-full bg-blue-400 -top-[3px]" />
            <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 -top-[3px]" />
            <div className="absolute right-0 w-2 h-2 rounded-full bg-blue-400 -top-[3px]" />
          </div>
        </div>

        {/* Intermediary Nodes */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {graph.nodes.slice(1, 4).map((node, i) => (
            <div
              key={node.id}
              className={cn(
                'p-3 rounded-lg border text-center font-mono text-[11px] transition-all',
                node.risk === 'HIGH'
                  ? 'bg-rose-500/5 border-rose-500/30 text-rose-300'
                  : 'bg-[#121624] border-[#1e2436] text-gray-300'
              )}
            >
              <div className="font-semibold">{node.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {node.risk === 'HIGH' ? '⚠ Synchronized Outflow' : 'Normal Liquidity Flow'}
              </div>
            </div>
          ))}
        </div>

        {/* Flow down to Token Pool */}
        <div className="flex justify-center items-center my-1 relative h-6">
          <div className="w-[2px] h-full bg-purple-500/40 relative">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 -top-1 -left-[2px] animate-pulse-subtle" />
          </div>
        </div>

        {/* Destination Pool Node */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-lg bg-purple-950/30 border border-purple-500/40 text-purple-200 font-mono text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="font-bold">
              {graph.nodes[graph.nodes.length - 1]?.label || 'Liquidity Pool'}
            </span>
          </div>
        </div>
      </div>

      {/* Graph Narrative Footer */}
      <div
        className={cn(
          'p-3.5 rounded-lg border text-xs font-mono flex items-start gap-2.5',
          isSuspicious
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        )}
      >
        {isSuspicious ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="leading-relaxed">
          <span className="font-bold block uppercase mb-0.5">
            {isSuspicious ? 'HIGH RISK HEURISTIC' : 'HEALTHY NETWORK TOPOLOGY'}
          </span>
          {graph.riskDescription}
        </div>
      </div>
    </div>
  );
}
