'use client';

import React from 'react';
import type { EvidenceItem, CoinStatus } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidencePanelProps {
  reasons: EvidenceItem[];
  classification: CoinStatus;
  classificationLabel: string;
}

export function EvidencePanel({
  reasons,
  classification,
  classificationLabel,
}: EvidencePanelProps) {
  return (
    <div className="bg-[#10141d] border border-[#1e2638] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#1b2232]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Screener Rationale: Active Market Signals
          </h3>
        </div>
        <span className="text-[11px] text-gray-400">
          Rule-Based Confluence
        </span>
      </div>

      {/* Signal Checklist */}
      <div className="space-y-2">
        {reasons.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0c1017] border border-[#1a2130] text-xs"
          >
            {item.type === 'positive' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {item.type === 'warning' && (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            {item.type === 'negative' && (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span
              className={cn(
                'leading-relaxed font-medium',
                item.type === 'positive'
                  ? 'text-gray-200'
                  : item.type === 'warning'
                  ? 'text-amber-200/90'
                  : 'text-rose-200/90'
              )}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Classification Summary Strip */}
      <div className="mt-3 p-3 rounded-lg bg-[#141b27] border border-[#232d40] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
            CONFLUENT CLASSIFICATION
          </span>
          <div className="text-xs font-bold text-white tracking-wide">
            {classificationLabel}
          </div>
        </div>

        <div className="text-[11px] text-gray-400 sm:text-right max-w-xs">
          Screening model output based on 4H/1H structure, RSI momentum, and on-chain cluster scans.
        </div>
      </div>
    </div>
  );
}
