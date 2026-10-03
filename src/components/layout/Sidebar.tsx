'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radar,
  Flame,
  Star,
  ShieldAlert,
  Settings,
  Activity,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Scanner', href: '/scanner', icon: Radar },
  { name: 'Trending', href: '/trending', icon: Flame },
  { name: 'Watchlist', href: '/watchlist', icon: Star },
  { name: 'Risk Analysis', href: '/risk', icon: ShieldAlert },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0c0e17] border-r border-[#1e2436] h-screen sticky top-0 shrink-0 z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#1e2436]">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white tracking-wide text-sm">NEXUS TERMINAL</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Market Intelligence</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.12)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#151a29]'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'
                )}
              />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#1e2436] bg-[#090b12]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-400 font-mono text-[11px]">ENGINE ENGINE STATUS</span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
            OPERATIONAL
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>LATENCY: 14ms</span>
          <span>4H/1H SYNCHRONIZED</span>
        </div>
      </div>
    </aside>
  );
}
