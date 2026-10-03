'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { ChartData, Timeframe } from '@/lib/types';
import { formatPrice, formatVolume } from '@/lib/utils';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface CandlestickChartProps {
  data: ChartData;
  timeframe: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  symbol: string;
}

export function CandlestickChart({
  data,
  timeframe,
  onTimeframeChange,
  symbol,
}: CandlestickChartProps) {
  const chartPoints = data.ohlcv.map((candle, index) => {
    const emaPoint = data.ema[index];
    const rsiPoint = data.rsi[index];
    const isUp = candle.close >= candle.open;

    return {
      time: new Date(candle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open: candle.open,
      close: candle.close,
      high: candle.high,
      low: candle.low,
      isUp,
      volume: candle.volume,
      ema: emaPoint ? emaPoint.value : null,
      rsi: rsiPoint ? rsiPoint.value : null,
    };
  });

  const lastPrice = chartPoints[chartPoints.length - 1]?.close || 0;
  const lastEma = chartPoints[chartPoints.length - 1]?.ema || 0;
  const lastRsi = chartPoints[chartPoints.length - 1]?.rsi || 50;

  return (
    <div className="bg-[#10141d] border border-[#1e2638] rounded-xl p-4 space-y-3">
      {/* Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1b2232]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">
            {symbol}/USDT
          </span>
          <div className="flex items-center gap-2 text-xs tabular-nums text-gray-400">
            <span>Price: <strong className="text-white">{formatPrice(lastPrice)}</strong></span>
            <span>•</span>
            <span className="text-sky-400">EMA(20): {formatPrice(lastEma)}</span>
            <span>•</span>
            <span className={lastRsi >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
              RSI: {lastRsi.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-md border border-[#1e2638] text-xs">
          {(['15M', '1H', '4H'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange && onTimeframeChange(tf)}
              className={`px-2 py-0.5 rounded transition-colors text-xs font-medium ${
                timeframe === tf
                  ? 'bg-[#1e283b] text-white border border-[#2e3d57]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Divergence Notification Banner if detected */}
      {data.divergenceMarkers && data.divergenceMarkers.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {data.divergenceMarkers[0].type} DIVERGENCE ACTIVE: Lower swing low confirmed with rising RSI momentum.
          </span>
        </div>
      )}

      {/* Price & EMA Panel */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartPoints} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#171e2c" vertical={false} />
            <XAxis dataKey="time" stroke="#485266" tick={{ fontSize: 10 }} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#485266"
              tick={{ fontSize: 10 }}
              orientation="right"
              tickFormatter={(val) => formatPrice(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121721',
                borderColor: '#1e2638',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#e6edf3',
              }}
              formatter={(value: any, name: any) => [
                typeof value === 'number' ? (name === 'Volume' ? formatVolume(value) : formatPrice(value)) : value,
                name,
              ]}
            />
            <Line
              type="monotone"
              dataKey="ema"
              stroke="#38bdf8"
              strokeWidth={1.5}
              dot={false}
              name="EMA(20)"
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#0ecb81"
              strokeWidth={2}
              dot={false}
              name="Close Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Subpanel */}
      <div className="pt-2 border-t border-[#171e2c]">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1 px-1">
          <span>VOLUME</span>
          <span>BAR HISTOGRAM</span>
        </div>
        <div className="h-14 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartPoints} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <YAxis hide orientation="right" />
              <XAxis dataKey="time" hide />
              <Bar dataKey="volume" name="Volume">
                {chartPoints.map((entry, index) => (
                  <Cell
                    key={`vol-${index}`}
                    fill={entry.isUp ? 'rgba(14, 203, 129, 0.45)' : 'rgba(246, 70, 93, 0.45)'}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RSI Subpanel */}
      <div className="pt-2 border-t border-[#171e2c]">
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 px-1">
          <span>RSI(30) OSCILLATOR</span>
          <span>BASELINE 50</span>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartPoints} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#171e2c" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} ticks={[30, 50, 70]} stroke="#485266" orientation="right" tick={{ fontSize: 9 }} />
              <ReferenceLine y={50} stroke="#f0b90b" strokeDasharray="3 3" />
              <ReferenceLine y={70} stroke="#f6465d" strokeDasharray="2 2" strokeOpacity={0.6} />
              <ReferenceLine y={30} stroke="#0ecb81" strokeDasharray="2 2" strokeOpacity={0.6} />
              <Line
                type="monotone"
                dataKey="rsi"
                stroke="#a855f7"
                strokeWidth={1.5}
                dot={false}
                name="RSI(30)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
