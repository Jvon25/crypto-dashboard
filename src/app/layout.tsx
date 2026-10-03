import type { Metadata } from 'next';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { CircleDot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Crypto Bubbles Intelligence Terminal',
  description: 'Cryptocurrency trend screener, momentum divergence, and on-chain risk analytics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0e14] text-[#e6edf3] min-h-screen flex flex-col antialiased">
        <SettingsProvider>
          <WatchlistProvider>
            {/* Real Institutional Top Bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-13 bg-[#111622]/90 backdrop-blur-md border-b border-[#1e2638]">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-white tracking-tight text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-semibold text-base">CRYPTO BUBBLES</span>
                  <span className="text-[11px] font-medium text-gray-400 ml-1 px-1.5 py-0.5 rounded bg-[#1a2130] border border-[#252f44]">
                    TERMINAL
                  </span>
                </div>
              </div>

              {/* Live Benchmark Ticker Strip */}
              <div className="hidden lg:flex items-center gap-5 text-xs tabular-nums text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-medium">BTC</span>
                  <span className="text-white font-semibold">$67,842.50</span>
                  <span className="text-emerald-400 font-medium">+2.34%</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-medium">ETH</span>
                  <span className="text-white font-semibold">$3,542.18</span>
                  <span className="text-emerald-400 font-medium">+1.87%</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-300 font-medium">SOL</span>
                  <span className="text-white font-semibold">$178.45</span>
                  <span className="text-emerald-400 font-medium">+5.21%</span>
                </div>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">24H Vol</span>
                  <span className="text-gray-200 font-medium">$84.5B</span>
                </div>
              </div>

              {/* Data Feed Status */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161c28] border border-[#232c3f] text-xs font-medium text-gray-300">
                  <CircleDot className="w-3 h-3 text-emerald-400" />
                  <span>Market Sim (4H/1H)</span>
                </div>
              </div>
            </header>

            {/* Main Full-Width Content Container */}
            <main className="flex-1 w-full max-w-[1750px] mx-auto p-3 sm:p-4 lg:p-5">
              {children}
            </main>
          </WatchlistProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
