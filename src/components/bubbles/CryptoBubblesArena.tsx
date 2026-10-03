'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Coin } from '@/lib/types';
import { formatPercentage } from '@/lib/utils';
import { Search, RotateCcw } from 'lucide-react';

interface CryptoBubblesArenaProps {
  coins: Coin[];
  selectedSymbol: string;
  onSelectCoin: (symbol: string) => void;
}

type TimeframeFilter = '1H' | '1D' | '1W' | '1M';
type MarketFilter = 'ALL' | 'BULLISH' | 'BEARISH' | 'RISK';
type SizeMode = 'volume' | 'marketCap';

interface PhysicsBubble {
  coin: Coin;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  mass: number;
  pulsePhase: number;
}

// Visual Glyph Map for Crypto Icons
const cryptoGlyphs: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  BNB: 'B',
  XRP: '✕',
  QNT: 'Q',
  NEAR: 'N',
  WLD: 'W',
  LIT: 'L',
  HBAR: 'Ħ',
  AVAX: '▲',
  DOGE: 'Ð',
  LINK: '⬡',
  ADA: '₳',
  DOT: '●',
  MATIC: 'M',
  WIF: 'W',
  ARB: 'A',
  OP: 'O',
  INJ: 'I',
  TIA: 'T',
  PEPE: 'P',
  FET: 'F',
  RENDER: 'R',
  SEI: 'S',
  AAVE: 'A',
  JTO: 'J',
  SUI: 'S',
};

export function CryptoBubblesArena({
  coins,
  selectedSymbol,
  onSelectCoin,
}: CryptoBubblesArenaProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeFilter>('1D');
  const [filter, setFilter] = useState<MarketFilter>('ALL');
  const [sizeMode, setSizeMode] = useState<SizeMode>('volume');
  const [search, setSearch] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bubblesRef = useRef<PhysicsBubble[]>([]);
  const draggedBubbleRef = useRef<PhysicsBubble | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseVelRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredBubbleRef = useRef<PhysicsBubble | null>(null);

  // Filtered coins
  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches =
          coin.symbol.toLowerCase().includes(query) ||
          coin.name.toLowerCase().includes(query);
        if (!matches) return false;
      }
      if (filter === 'BULLISH') return coin.status === 'BULLISH_CONDITIONS';
      if (filter === 'BEARISH') return coin.status === 'BEARISH_CONDITIONS';
      if (filter === 'RISK') return coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL';
      return true;
    });
  }, [coins, filter, search]);

  // Synchronize bubbles with filtered list
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    let maxMetric = 0;
    let minMetric = Infinity;
    filteredCoins.forEach((c) => {
      const val = sizeMode === 'volume' ? c.volume24h : c.marketCap;
      if (val > maxMetric) maxMetric = val;
      if (val < minMetric) minMetric = val;
    });

    const existingMap = new Map(bubblesRef.current.map((b) => [b.coin.symbol, b]));

    const updatedBubbles: PhysicsBubble[] = filteredCoins.map((coin, index) => {
      const val = sizeMode === 'volume' ? coin.volume24h : coin.marketCap;
      const logVal = Math.log10(Math.max(val, 1));
      const logMin = Math.log10(Math.max(minMetric, 1));
      const logMax = Math.log10(Math.max(maxMetric, 1));
      const normalized = (logVal - logMin) / (logMax - logMin || 1);

      // Sizing: Radius between 34px and 76px
      const targetRadius = Math.round(34 + normalized * 42);
      const existing = existingMap.get(coin.symbol);

      if (existing) {
        existing.targetRadius = targetRadius;
        existing.coin = coin;
        existing.mass = targetRadius * targetRadius;
        return existing;
      }

      // Initial distributed placement
      const angle = (index / filteredCoins.length) * Math.PI * 2;
      const spread = Math.min(width, height) * 0.32;
      const x = width / 2 + Math.cos(angle) * spread + (Math.random() - 0.5) * 30;
      const y = height / 2 + Math.sin(angle) * spread + (Math.random() - 0.5) * 30;

      return {
        coin,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: targetRadius * 0.7,
        targetRadius,
        mass: targetRadius * targetRadius,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    bubblesRef.current = updatedBubbles;
  }, [filteredCoins, sizeMode]);

  // Canvas & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const DAMPING = 0.985;
    const CENTER_PULL = 0.0003;
    const MOUSE_REPEL_RADIUS = 95;
    const MOUSE_REPEL_FORCE = 0.35;
    const BOUNCE_RESTITUTION = 0.82;

    let time = 0;

    const loop = () => {
      time += 0.02;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Deep dark background matching Crypto Bubbles reference
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, width, height);

      const bubbles = bubblesRef.current;
      const mouse = mousePosRef.current;
      const dragged = draggedBubbleRef.current;

      // Update positions
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        b.radius += (b.targetRadius - b.radius) * 0.08;
        b.pulsePhase += 0.03;

        if (b === dragged) {
          b.vx = mouseVelRef.current.x * 0.7;
          b.vy = mouseVelRef.current.y * 0.7;
          continue;
        }

        // Pull to center
        b.vx += (cx - b.x) * CENTER_PULL;
        b.vy += (cy - b.y) * CENTER_PULL;

        // Ambient gentle drift
        b.vx += Math.sin(time + b.pulsePhase) * 0.03;
        b.vy += Math.cos(time + b.pulsePhase) * 0.03;

        // Cursor push
        if (mouse) {
          const mdx = b.x - mouse.x;
          const mdy = b.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          const effectiveRadius = b.radius + MOUSE_REPEL_RADIUS;

          if (mDist < effectiveRadius && mDist > 0) {
            const force = (1 - mDist / effectiveRadius) * MOUSE_REPEL_FORCE;
            b.vx += (mdx / mDist) * force;
            b.vy += (mdy / mDist) * force;
          }
        }

        // Inter-bubble elastic collisions
        for (let j = i + 1; j < bubbles.length; j++) {
          const b2 = bubbles[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b.radius + b2.radius + 5;

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) * 0.5;

            b.x -= nx * overlap;
            b.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b.mass + b2.mass);

            b.vx -= p * b2.mass * nx * BOUNCE_RESTITUTION;
            b.vy -= p * b2.mass * ny * BOUNCE_RESTITUTION;
            b2.vx += p * b.mass * nx * BOUNCE_RESTITUTION;
            b2.vy += p * b.mass * ny * BOUNCE_RESTITUTION;
          }
        }

        // Damping
        b.vx *= DAMPING;
        b.vy *= DAMPING;
        b.x += b.vx;
        b.y += b.vy;

        // Wall bounds
        const pad = b.radius + 4;
        if (b.x < pad) {
          b.x = pad;
          b.vx = Math.abs(b.vx) * BOUNCE_RESTITUTION;
        } else if (b.x > width - pad) {
          b.x = width - pad;
          b.vx = -Math.abs(b.vx) * BOUNCE_RESTITUTION;
        }

        if (b.y < pad) {
          b.y = pad;
          b.vy = Math.abs(b.vy) * BOUNCE_RESTITUTION;
        } else if (b.y > height - pad) {
          b.y = height - pad;
          b.vy = -Math.abs(b.vy) * BOUNCE_RESTITUTION;
        }
      }

      // Render 3D Glass Spheres
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        const isSelected = b.coin.symbol === selectedSymbol;
        const isHovered = b === hoveredBubbleRef.current;
        const isPositive = b.coin.change24h >= 0;
        const isHighRisk = b.coin.riskLevel === 'HIGH' || b.coin.riskLevel === 'CRITICAL';

        const r = b.radius * (isHovered ? 1.05 : isSelected ? 1.03 : 1);
        const { x, y } = b;

        ctx.save();

        // Selected State: Sharp white/cyan ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Base Glass Radial Sphere (Exact look from reference image)
        const sphereGrad = ctx.createRadialGradient(
          x - r * 0.3,
          y - r * 0.3,
          r * 0.05,
          x,
          y,
          r
        );

        if (isPositive) {
          sphereGrad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
          sphereGrad.addColorStop(0.4, 'rgba(16, 120, 68, 0.7)');
          sphereGrad.addColorStop(0.85, 'rgba(5, 40, 22, 0.92)');
          sphereGrad.addColorStop(1, 'rgba(2, 22, 12, 0.98)');
        } else {
          sphereGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
          sphereGrad.addColorStop(0.4, 'rgba(140, 24, 24, 0.7)');
          sphereGrad.addColorStop(0.85, 'rgba(55, 8, 8, 0.92)');
          sphereGrad.addColorStop(1, 'rgba(28, 4, 4, 0.98)');
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // Glowing Outer Perimeter Rim
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = isPositive ? '#22c55e' : '#ef4444';
        ctx.lineWidth = isSelected ? 2.5 : 1.75;
        ctx.stroke();

        // 3D Glass Specular Crescent Reflection (Top-Left Glare)
        const glareGrad = ctx.createRadialGradient(
          x - r * 0.35,
          y - r * 0.35,
          1,
          x - r * 0.28,
          y - r * 0.28,
          r * 0.5
        );
        glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
        glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(x - r * 0.28, y - r * 0.28, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = glareGrad;
        ctx.fill();

        // High Risk Warning Pin
        if (isHighRisk) {
          ctx.beginPath();
          ctx.arc(x + r * 0.68, y - r * 0.68, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', x + r * 0.68, y - r * 0.68);
        }

        // Circular Icon Badge on Top (Replicated from screenshot)
        const iconY = y - r * 0.44;
        const iconSize = Math.max(10, r * 0.25);
        ctx.beginPath();
        ctx.arc(x, iconY, iconSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        const glyph = cryptoGlyphs[b.coin.symbol] || b.coin.symbol.slice(0, 1);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(iconSize * 1.05)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(glyph, x, iconY);

        // Bold Coin Symbol (Matching reference font)
        const symbolSize = Math.max(12, Math.round(r * 0.36));
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${symbolSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.coin.symbol, x, y + r * 0.05);

        // Percentage Change
        const pctSize = Math.max(10, Math.round(r * 0.22));
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${pctSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace`;
        ctx.fillText(formatPercentage(b.coin.change24h), x, y + r * 0.42);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedSymbol]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bubbles = bubblesRef.current;
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (Math.hypot(b.x - x, b.y - y) <= b.radius) {
        draggedBubbleRef.current = b;
        dragOffsetRef.current = { x: b.x - x, y: b.y - y };
        lastMousePosRef.current = { x, y };
        onSelectCoin(b.coin.symbol);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };
    mouseVelRef.current = {
      x: x - lastMousePosRef.current.x,
      y: y - lastMousePosRef.current.y,
    };
    lastMousePosRef.current = { x, y };

    if (draggedBubbleRef.current) {
      draggedBubbleRef.current.x = x + dragOffsetRef.current.x;
      draggedBubbleRef.current.y = y + dragOffsetRef.current.y;
    } else {
      let found: PhysicsBubble | null = null;
      for (const b of bubblesRef.current) {
        if (Math.hypot(b.x - x, b.y - y) <= b.radius) {
          found = b;
          break;
        }
      }
      hoveredBubbleRef.current = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
    }
  };

  const handlePointerUp = () => {
    if (draggedBubbleRef.current) {
      draggedBubbleRef.current.vx = mouseVelRef.current.x * 0.85;
      draggedBubbleRef.current.vy = mouseVelRef.current.y * 0.85;
      draggedBubbleRef.current = null;
    }
  };

  const handlePointerLeave = () => {
    mousePosRef.current = null;
    hoveredBubbleRef.current = null;
    draggedBubbleRef.current = null;
  };

  const handleScatter = () => {
    bubblesRef.current.forEach((b) => {
      b.vx = (Math.random() - 0.5) * 5;
      b.vy = (Math.random() - 0.5) * 5;
    });
  };

  return (
    <div className="bg-[#08090d] border border-[#1e2638] rounded-xl flex flex-col h-[760px] overflow-hidden shadow-lg">
      {/* Top Crypto Bubbles Navigation Bar (Replicated from user's screenshot) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-[#0e121a] border-b border-[#1e2638]">
        {/* Left: Timeframe pills (1H, 1D, 1W, 1M, MC) */}
        <div className="flex items-center gap-1 text-xs font-medium">
          {(['1H', '1D', '1W', '1M'] as TimeframeFilter[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={cn(
                'px-2.5 py-1 rounded transition-colors text-xs',
                activeTimeframe === tf
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-[#18202d]'
              )}
            >
              {tf}
            </button>
          ))}

          <span className="text-gray-600 mx-0.5">|</span>

          {/* Size Mode: MC / VOL */}
          <button
            onClick={() => setSizeMode(sizeMode === 'marketCap' ? 'volume' : 'marketCap')}
            className={cn(
              'px-2.5 py-1 rounded text-xs transition-colors',
              sizeMode === 'marketCap'
                ? 'bg-[#1e283b] text-white border border-[#2f3d57]'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {sizeMode === 'marketCap' ? 'MC' : 'VOL'}
          </button>
        </div>

        {/* Center: Market Filter: All, Bullish, Bearish, Risk */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              filter === 'ALL' ? 'text-white bg-[#1a2333]' : 'text-gray-400 hover:text-white'
            )}
          >
            All ({filteredCoins.length})
          </button>
          <button
            onClick={() => setFilter('BULLISH')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              filter === 'BULLISH' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white'
            )}
          >
            Bullish
          </button>
          <button
            onClick={() => setFilter('BEARISH')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              filter === 'BEARISH' ? 'text-rose-400 bg-rose-500/10' : 'text-gray-400 hover:text-white'
            )}
          >
            Bearish
          </button>
          <button
            onClick={() => setFilter('RISK')}
            className={cn(
              'px-2 py-0.5 rounded transition-colors',
              filter === 'RISK' ? 'text-amber-400 bg-amber-500/10' : 'text-gray-400 hover:text-white'
            )}
          >
            Risk
          </button>
        </div>

        {/* Right: Search + Scatter */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search (Ctrl K)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#131822] border border-[#232c3f] rounded-md pl-8 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-28 sm:w-36"
            />
          </div>

          <button
            onClick={handleScatter}
            title="Scatter bubbles"
            className="p-1 rounded bg-[#131822] border border-[#232c3f] text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Arena */}
      <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="absolute inset-0 block touch-none"
        />
      </div>

      {/* Clean Bottom Caption */}
      <div className="px-3 py-1.5 bg-[#0e121a] border-t border-[#1e2638] flex items-center justify-between text-[11px] text-gray-400">
        <span>Click any coin to inspect details on the right</span>
        <span>Drag &amp; fling to interact</span>
      </div>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
