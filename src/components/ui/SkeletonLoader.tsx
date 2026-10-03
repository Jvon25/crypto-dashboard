'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#1e2436]/60', className)}
      {...props}
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#1e2436]">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-[#1e2436]/40">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-28" />
      <div className="space-y-2 pt-2 border-t border-[#1e2436]/50">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="terminal-card p-5 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#1e2436]">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="pt-2 border-t border-[#1e2436]/50">
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export function WalletGraphSkeleton() {
  return (
    <div className="terminal-card p-5 space-y-4">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="flex flex-col items-center gap-6 py-6">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <div className="grid grid-cols-3 gap-4 w-full">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
    </div>
  );
}
