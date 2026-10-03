import type { ChartData, OHLCV, Timeframe, Coin } from '../types';
import { getCoinBySymbol } from './coins';

function createSeededRandom(seed: string) {
  let hash = 2166136261;

  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let t = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getOHLCVData(symbol: string, timeframe: Timeframe = '4H', source?: Coin[]): ChartData {
  const coin = getCoinBySymbol(symbol.toUpperCase(), source);
  const basePrice = coin ? coin.price : 100;
  const isBullish = coin ? coin.trend4h === 'UPTREND' : true;
  const count = 40;
  const random = createSeededRandom(`${symbol}-${timeframe}`);

  const ohlcv: OHLCV[] = [];
  const ema: { time: number; value: number }[] = [];
  const rsi: { time: number; value: number }[] = [];

  let currentPrice = basePrice * (isBullish ? 0.85 : 1.15);
  const intervalMs = timeframe === '4H' ? 4 * 3600 * 1000 : timeframe === '1H' ? 3600 * 1000 : 15 * 60 * 1000;
  const fixedStart = Date.UTC(2026, 8, 30, 0, 0, 0);
  const startTime = fixedStart - count * intervalMs;

  let emaVal = currentPrice;
  const baseRsi = coin ? coin.rsi4h : (isBullish ? 42 : 58);
  let rsiVal = baseRsi;

  for (let i = 0; i < count; i++) {
    const time = startTime + i * intervalMs;
    const volatility = basePrice * 0.025;
    const trendDrift = (isBullish ? 1 : -1) * (basePrice * 0.006) + (Math.sin(i / 3) * volatility * 0.5);
    const noise = (random() - 0.48) * volatility;
    const delta = trendDrift + noise;

    const open = currentPrice;
    const close = Math.max(basePrice * 0.1, open + delta);
    const high = Math.max(open, close) + random() * (volatility * 0.7);
    const low = Math.min(open, close) - random() * (volatility * 0.7);
    const volume = Math.floor((coin ? coin.volume24h / 24 : 10_000_000) * (0.6 + random() * 0.8));

    ohlcv.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    emaVal = emaVal * 0.88 + close * 0.12;
    ema.push({ time, value: Number(emaVal.toFixed(2)) });

    const rsiShift = (i / count) * 8 - 4;
    const nextRsi = Math.min(92, Math.max(15, baseRsi + rsiShift));
    rsiVal = nextRsi;
    rsi.push({ time, value: Number(rsiVal.toFixed(1)) });

    currentPrice = close;
  }

  // Ensure last close matches current mock coin price
  if (ohlcv.length > 0 && coin) {
    const lastBar = ohlcv[ohlcv.length - 1];
    lastBar.close = coin.price;
    lastBar.high = Math.max(lastBar.high, coin.price);
    lastBar.low = Math.min(lastBar.low, coin.price);
  }

  // Divergence markers
  const divergenceMarkers: ChartData['divergenceMarkers'] = [];
  if (coin && coin.divergence4h === 'BULLISH') {
    const targetIdx = Math.floor(count * 0.7);
    divergenceMarkers.push({
      time: ohlcv[targetIdx].time,
      type: 'BULLISH',
      price: ohlcv[targetIdx].low,
    });
  } else if (coin && coin.divergence4h === 'BEARISH') {
    const targetIdx = Math.floor(count * 0.7);
    divergenceMarkers.push({
      time: ohlcv[targetIdx].time,
      type: 'BEARISH',
      price: ohlcv[targetIdx].high,
    });
  }

  return {
    ohlcv,
    ema,
    rsi,
    divergenceMarkers,
  };
}
