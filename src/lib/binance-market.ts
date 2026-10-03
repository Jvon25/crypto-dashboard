'use client';

import { useEffect, useState } from 'react';
import type { Coin, Trend } from '@/lib/types';
import { getCoinBySymbol, getCoins } from '@/lib/mock-data/coins';

const BINANCE_STREAMS = [
  'btcusdt@ticker',
  'ethusdt@ticker',
  'solusdt@ticker',
  'xrpusdt@ticker',
  'qntusdt@ticker',
  'nearusdt@ticker',
  'worldusdt@ticker',
  'avaxusdt@ticker',
  'linkusdt@ticker',
  'dogeusdt@ticker',
  'maticusdt@ticker',
  'adausdt@ticker',
  'dotusdt@ticker',
  'arbusdt@ticker',
  'opusdt@ticker',
  'seiusdt@ticker',
  'jtousdt@ticker',
  'suiusdt@ticker',
  'tiausdt@ticker',
  'pepeusdt@ticker',
  'fetusdt@ticker',
  'renderusdt@ticker',
  'aaveusdt@ticker',
].join('/');

const SYMBOL_MAP: Record<string, string> = {
  BTC: 'btcusdt',
  ETH: 'ethusdt',
  SOL: 'solusdt',
  XRP: 'xrpusdt',
  QNT: 'qntusdt',
  NEAR: 'nearusdt',
  WLD: 'worldusdt',
  AVAX: 'avaxusdt',
  LINK: 'linkusdt',
  DOGE: 'dogeusdt',
  MATIC: 'maticusdt',
  ADA: 'adausdt',
  DOT: 'dotusdt',
  ARB: 'arbusdt',
  OP: 'opusdt',
  SEI: 'seiusdt',
  JTO: 'jtousdt',
  SUI: 'suiusdt',
  TIA: 'tiausdt',
  PEPE: 'pepeusdt',
  FET: 'fetusdt',
  RENDER: 'renderusdt',
  AAVE: 'aaveusdt',
};

interface BinanceTickerPayload {
  stream?: string;
  data?: {
    s?: string;
    c?: string;
    P?: string;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyTickerToCoin(symbol: string, price: number, change24h: number, marketCoins: Coin[]) {
  const coin = getCoinBySymbol(symbol, marketCoins);
  if (!coin) return marketCoins;

  const trend4h: Trend = change24h >= 0 ? 'UPTREND' : 'DOWNTREND';
  const trend1h: Trend = change24h >= 1 ? 'UPTREND' : change24h <= -1 ? 'DOWNTREND' : 'NEUTRAL';
  const rsi4h = clamp(50 + change24h * 2.2, 15, 88);
  const rsi1h = clamp(50 + change24h * 2.4, 15, 88);

  return marketCoins.map((item) =>
    item.symbol === symbol
      ? {
          ...item,
          price,
          change24h,
          trend4h,
          trend1h,
          rsi4h: Number(rsi4h.toFixed(1)),
          rsi1h: Number(rsi1h.toFixed(1)),
          status:
            change24h >= 5
              ? 'BULLISH_CONDITIONS'
              : change24h <= -5
              ? 'BEARISH_CONDITIONS'
              : item.status,
        }
      : item
  );
}

async function hydrateFromRestSnapshot(currentCoins: Coin[]) {
  const entries = Object.entries(SYMBOL_MAP);
  const requests = entries.map(async ([symbol, pair]) => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair.toUpperCase()}`);
      if (!response.ok) return currentCoins;

      const data = await response.json() as { lastPrice?: string; priceChangePercent?: string };
      const price = Number(data.lastPrice);
      const change24h = Number(data.priceChangePercent);

      if (Number.isFinite(price) && Number.isFinite(change24h)) {
        return applyTickerToCoin(symbol, price, change24h, currentCoins);
      }
    } catch {
      // Fall back to mock values when the REST call is unavailable.
    }

    return currentCoins;
  });

  const results = await Promise.all(requests);
  return results[results.length - 1] ?? currentCoins;
}

export function useBinanceMarket() {
  const [isLive, setIsLive] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [marketCoins, setMarketCoins] = useState<Coin[]>(() => getCoins());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let socket: WebSocket | null = null;

    const loadSnapshot = async () => {
      const hydrated = await hydrateFromRestSnapshot(marketCoins);
      setMarketCoins(hydrated);
      setHasInitialData(true);
    };

    void loadSnapshot();

    socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${BINANCE_STREAMS}`);

    socket.onopen = () => {
      setIsLive(true);
    };

    socket.onclose = () => {
      setIsLive(false);
    };

    socket.onerror = () => {
      setIsLive(false);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as BinanceTickerPayload;
        const symbol = payload?.data?.s?.toUpperCase();
        const price = Number(payload?.data?.c);
        const priceChangePercent = Number(payload?.data?.P);

        if (!symbol || !Number.isFinite(price)) return;

        const mappedSymbol = Object.entries(SYMBOL_MAP).find(([, pair]) => pair === symbol.toLowerCase())?.[0];
        if (!mappedSymbol) return;

        setMarketCoins((current) => applyTickerToCoin(mappedSymbol, price, Number.isFinite(priceChangePercent) ? priceChangePercent : 0, current));
        setHasInitialData(true);
        setLastUpdatedAt(Date.now());
      } catch {
        // Ignore malformed frames and keep the mock dashboard usable.
      }
    };

    return () => {
      socket?.close();
    };
  }, []);

  return { isLive, hasInitialData, lastUpdatedAt, marketCoins };
}
