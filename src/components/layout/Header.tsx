'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Layers,
  LayoutDashboard,
  Radar,
  Flame,
  Star,
  ShieldAlert,
  Settings,
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-8 bg-[#090a0f]/90 backdrop-blur-md border-b border-[#1e2436]">
      {/* Mobile Brand */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Layers className="w-4 h-4" />
        </div>
        <span className="font-semibold text-white tracking-wide text-sm">NEXUS TERMINAL</span>
      </div>

      {/* Simulation Status Badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151a29] border border-[#232b42] text-[11px] font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle shadow-[0_0_8px_#34d399]" />
        <span className="text-gray-300">MARKET DATA SIMULATION ACTIVE</span>
        <span className="text-gray-500">|</span>
        <span className="text-amber-400/90 font-sans">MOCK DATA ENVIRONMENT</span>
      </div>

      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#151a29] border border-[#232b42]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#0c0e17] border-b border-[#1e2436] p-4 lg:hidden shadow-2xl flex flex-col gap-1 z-50">
          <div className="mb-2 px-3 py-1.5 rounded-md bg-[#151a29] border border-[#232b42] text-[10px] font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
            SIMULATION ACTIVE (OFFLINE MOCK DATA)
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:bg-[#151a29] hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
