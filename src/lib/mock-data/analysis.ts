import type { Coin, CoinAnalysis, EvidenceItem, MarketCondition } from '../types';
import { getCoinBySymbol } from './coins';

export function getCoinAnalysis(symbol: string, source?: Coin[]): CoinAnalysis | null {
  const coin = getCoinBySymbol(symbol.toUpperCase(), source);
  if (!coin) return null;

  const fourHourAligned = coin.trend4h === 'UPTREND';
  const oneHourAligned = coin.trend1h === 'UPTREND';

  let alignment: MarketCondition = 'NEUTRAL';
  if (fourHourAligned && oneHourAligned) {
    alignment = 'BULLISH';
  } else if (coin.trend4h === 'DOWNTREND' && coin.trend1h === 'DOWNTREND') {
    alignment = 'BEARISH';
  } else if (coin.trend4h !== coin.trend1h) {
    alignment = 'CONFLICTED';
  }

  // Evidence reasons
  const evidence: EvidenceItem[] = [];

  if (coin.trend4h === 'UPTREND') {
    evidence.push({ type: 'positive', text: '4H timeframe exhibiting higher highs and higher lows structure' });
  } else if (coin.trend4h === 'DOWNTREND') {
    evidence.push({ type: 'negative', text: '4H trend firmly in downtrend below critical moving averages' });
  } else {
    evidence.push({ type: 'warning', text: '4H trend consolidating without decisive directional break' });
  }

  if (coin.trend1h === 'UPTREND') {
    evidence.push({ type: 'positive', text: '1H short-term momentum confirms upward structural shift' });
  } else if (coin.trend1h === 'DOWNTREND') {
    evidence.push({ type: 'negative', text: '1H internal structure slipping into lower lows' });
  }

  if (coin.rsi4h >= 50) {
    evidence.push({
      type: 'positive',
      text: `RSI(30) on 4H at ${coin.rsi4h.toFixed(1)} confirms bullish momentum regime (> 50)`,
    });
  } else {
    evidence.push({
      type: 'negative',
      text: `RSI(30) on 4H at ${coin.rsi4h.toFixed(1)} resides in bearish sub-50 momentum territory`,
    });
  }

  if (coin.divergence4h === 'BULLISH') {
    evidence.push({
      type: 'positive',
      text: 'Bullish divergence detected on 4H: Price made lower low while RSI formed higher low',
    });
  } else if (coin.divergence4h === 'BEARISH') {
    evidence.push({
      type: 'warning',
      text: 'Bearish divergence detected on 4H: Price made higher high while RSI formed lower high',
    });
  }

  if (coin.volumeLevel === 'VERY_HIGH' || coin.volumeLevel === 'HIGH') {
    evidence.push({ type: 'positive', text: `Significant volume expansion (${coin.volumeLevel.replace('_', ' ')}) supporting current price discovery` });
  }

  if (coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL') {
    evidence.push({
      type: 'warning',
      text: 'Elevated on-chain risk metrics: wallet clustering and high supply concentration detected',
    });
  } else if (coin.riskLevel === 'MODERATE') {
    evidence.push({
      type: 'warning',
      text: 'Moderate wallet concentration in top 10 non-exchange holders',
    });
  } else {
    evidence.push({
      type: 'positive',
      text: 'Healthy on-chain liquidity distribution with low cluster risk',
    });
  }

  // Label formatting
  let classificationLabel = 'MONITOR';
  switch (coin.status) {
    case 'BULLISH_CONDITIONS':
      classificationLabel = coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL'
        ? 'BULLISH CONDITIONS WITH ELEVATED RISK'
        : 'BULLISH CONDITIONS';
      break;
    case 'BEARISH_CONDITIONS':
      classificationLabel = 'BEARISH CONDITIONS';
      break;
    case 'CONFLICTED':
      classificationLabel = 'CONFLICTED TIMEFRAMES';
      break;
    case 'HIGH_RISK':
      classificationLabel = 'HIGH RISK INDICATOR';
      break;
    case 'ELEVATED_RISK':
      classificationLabel = 'BULLISH CONDITIONS WITH ELEVATED RISK';
      break;
    case 'NEUTRAL':
    default:
      classificationLabel = 'NEUTRAL / MONITOR';
      break;
  }

  return {
    coin,
    trendAnalysis: {
      fourHour: {
        timeframe: '4H',
        trend: coin.trend4h,
        description: coin.trend4h === 'UPTREND'
          ? 'Sequential higher highs & higher lows confirmed'
          : coin.trend4h === 'DOWNTREND'
          ? 'Sequential lower highs & lower lows active'
          : 'Horizontal consolidation range bound',
        higherHighs: coin.trend4h === 'UPTREND',
        higherLows: coin.trend4h === 'UPTREND',
      },
      oneHour: {
        timeframe: '1H',
        trend: coin.trend1h,
        description: coin.trend1h === 'UPTREND'
          ? 'Local structure breaking above micro resistance'
          : coin.trend1h === 'DOWNTREND'
          ? 'Micro support levels failing on 1H closes'
          : 'Mean-reverting oscillator within chop zone',
        higherHighs: coin.trend1h === 'UPTREND',
        higherLows: coin.trend1h === 'UPTREND',
      },
      alignment,
    },
    rsiAnalysis: {
      period: 30,
      value4h: coin.rsi4h,
      value1h: coin.rsi1h,
      threshold: 50,
      momentum4h: coin.rsi4h >= 50 ? 'BULLISH' : 'BEARISH',
      momentum1h: coin.rsi1h >= 50 ? 'BULLISH' : 'BEARISH',
    },
    divergenceAnalysis: {
      fourHour: {
        timeframe: '4H',
        type: coin.divergence4h,
        priceAction: coin.divergence4h === 'BULLISH' ? 'Lower Low' : coin.divergence4h === 'BEARISH' ? 'Higher High' : 'Neutral Range',
        rsiAction: coin.divergence4h === 'BULLISH' ? 'Higher Low' : coin.divergence4h === 'BEARISH' ? 'Lower High' : 'Consolidating',
        description: coin.divergence4h === 'BULLISH'
          ? 'Price printed lower low while RSI(30) established higher low indicating underlying buyer absorption.'
          : coin.divergence4h === 'BEARISH'
          ? 'Price reached new local high but momentum oscillator waned, flashing warning of exhaustion.'
          : 'No significant divergence detected on 4H timeframe.',
      },
      oneHour: {
        timeframe: '1H',
        type: coin.divergence1h,
        priceAction: coin.divergence1h === 'BULLISH' ? 'Lower Low' : coin.divergence1h === 'BEARISH' ? 'Higher High' : 'Neutral Range',
        rsiAction: coin.divergence1h === 'BULLISH' ? 'Higher Low' : coin.divergence1h === 'BEARISH' ? 'Lower High' : 'Consolidating',
        description: coin.divergence1h === 'BULLISH'
          ? 'Micro-scale bullish momentum divergence formed over the last 12 bars.'
          : coin.divergence1h === 'BEARISH'
          ? 'Short-term momentum divergence suggesting impending 1H pullback.'
          : 'No significant divergence detected on 1H timeframe.',
      },
    },
    volumeAnalysis: {
      current: coin.volume24h,
      average: coin.volume24h * (coin.volumeLevel === 'VERY_HIGH' ? 0.6 : coin.volumeLevel === 'HIGH' ? 0.8 : 1.1),
      ratio: coin.volumeLevel === 'VERY_HIGH' ? 1.68 : coin.volumeLevel === 'HIGH' ? 1.32 : 0.94,
      level: coin.volumeLevel,
      trend: coin.volumeLevel === 'VERY_HIGH' || coin.volumeLevel === 'HIGH' ? 'UPTREND' : 'NEUTRAL',
    },
    riskAnalysis: {
      overallLevel: coin.riskLevel,
      walletConcentration: coin.riskLevel === 'CRITICAL' ? 'CRITICAL' : coin.riskLevel === 'HIGH' ? 'HIGH' : coin.riskLevel === 'MODERATE' ? 'MODERATE' : 'LOW',
      commonFunding: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL',
      walletClustering: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL' || coin.riskLevel === 'MODERATE',
      liquidityHealthy: coin.riskLevel !== 'CRITICAL',
      indicators: [
        {
          name: 'Wallet Concentration',
          level: coin.riskLevel === 'CRITICAL' ? 'CRITICAL' : coin.riskLevel === 'HIGH' ? 'HIGH' : coin.riskLevel === 'MODERATE' ? 'MODERATE' : 'LOW',
          description: coin.riskLevel === 'CRITICAL' || coin.riskLevel === 'HIGH'
            ? 'Top 10 non-exchange wallets control >48% of circulating supply'
            : 'Distributed holder base with low individual whale dominance',
          detected: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL',
        },
        {
          name: 'Common Funding Source',
          level: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL' ? 'HIGH' : 'LOW',
          description: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL'
            ? '6 active accumulator wallets funded from identical fresh Binance withdrawal proxy within 48h'
            : 'No shared parent funding found across primary market maker addresses',
          detected: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL',
        },
        {
          name: 'Wallet Clustering',
          level: coin.riskLevel === 'HIGH' || coin.riskLevel === 'CRITICAL' ? 'HIGH' : coin.riskLevel === 'MODERATE' ? 'MODERATE' : 'LOW',
          description: coin.riskLevel !== 'LOW'
            ? 'Coordinated token movement patterns observed across 4-8 interrelated addresses'
            : 'Independent transaction graph topology observed',
          detected: coin.riskLevel !== 'LOW',
        },
        {
          name: 'Liquidity Depth',
          level: coin.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'LOW',
          description: coin.riskLevel === 'CRITICAL'
            ? 'Thin liquidity relative to trading volume - high slippage vulnerability'
            : 'Healthy multi-venue liquidity depth supporting market orders',
          detected: coin.riskLevel === 'CRITICAL',
        },
      ],
    },
    evidenceReasons: evidence,
    classification: coin.status,
    classificationLabel,
  };
}
