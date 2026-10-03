// ─── Enumerations ───────────────────────────────────────────────────────────

export type Trend = 'UPTREND' | 'DOWNTREND' | 'NEUTRAL';
export type DivergenceType = 'BULLISH' | 'BEARISH' | 'NONE';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type MarketCondition = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'CONFLICTED';
export type CoinStatus = 'BULLISH_CONDITIONS' | 'BEARISH_CONDITIONS' | 'NEUTRAL' | 'CONFLICTED' | 'MONITOR' | 'ELEVATED_RISK' | 'HIGH_RISK';
export type VolumeLevel = 'LOW' | 'AVERAGE' | 'HIGH' | 'VERY_HIGH';
export type Timeframe = '4H' | '1H' | '15M';

// ─── Core Data Models ───────────────────────────────────────────────────────

export interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  trend4h: Trend;
  trend1h: Trend;
  rsi4h: number;
  rsi1h: number;
  divergence4h: DivergenceType;
  divergence1h: DivergenceType;
  riskLevel: RiskLevel;
  volumeLevel: VolumeLevel;
  status: CoinStatus;
}

export interface MarketOverview {
  condition: MarketCondition;
  trendingCount: number;
  bullishCount: number;
  bearishCount: number;
  highRiskCount: number;
  totalCoins: number;
}

// ─── Analysis Models ────────────────────────────────────────────────────────

export interface TrendAnalysis {
  timeframe: Timeframe;
  trend: Trend;
  description: string;
  higherHighs: boolean;
  higherLows: boolean;
}

export interface RSIAnalysis {
  period: number;
  value4h: number;
  value1h: number;
  threshold: number;
  momentum4h: 'BULLISH' | 'BEARISH';
  momentum1h: 'BULLISH' | 'BEARISH';
}

export interface DivergenceAnalysis {
  timeframe: Timeframe;
  type: DivergenceType;
  priceAction: string;
  rsiAction: string;
  description: string;
}

export interface VolumeAnalysis {
  current: number;
  average: number;
  ratio: number;
  level: VolumeLevel;
  trend: Trend;
}

export interface RiskIndicator {
  name: string;
  level: RiskLevel;
  description: string;
  detected: boolean;
}

export interface RiskAnalysis {
  overallLevel: RiskLevel;
  walletConcentration: RiskLevel;
  commonFunding: boolean;
  walletClustering: boolean;
  liquidityHealthy: boolean;
  indicators: RiskIndicator[];
}

export interface CoinAnalysis {
  coin: Coin;
  trendAnalysis: {
    fourHour: TrendAnalysis;
    oneHour: TrendAnalysis;
    alignment: MarketCondition;
  };
  rsiAnalysis: RSIAnalysis;
  divergenceAnalysis: {
    fourHour: DivergenceAnalysis;
    oneHour: DivergenceAnalysis;
  };
  volumeAnalysis: VolumeAnalysis;
  riskAnalysis: RiskAnalysis;
  evidenceReasons: EvidenceItem[];
  classification: CoinStatus;
  classificationLabel: string;
}

export interface EvidenceItem {
  type: 'positive' | 'warning' | 'negative';
  text: string;
}

// ─── Wallet Graph Models ────────────────────────────────────────────────────

export interface WalletNode {
  id: string;
  label: string;
  type: 'source' | 'intermediary' | 'holder' | 'token';
  risk: RiskLevel;
}

export interface WalletEdge {
  from: string;
  to: string;
  label?: string;
}

export interface WalletGraph {
  nodes: WalletNode[];
  edges: WalletEdge[];
  riskDescription: string;
}

// ─── Chart Models ───────────────────────────────────────────────────────────

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  ohlcv: OHLCV[];
  ema: { time: number; value: number }[];
  rsi: { time: number; value: number }[];
  divergenceMarkers: {
    time: number;
    type: DivergenceType;
    price: number;
  }[];
}

// ─── Settings ───────────────────────────────────────────────────────────────

export interface AppSettings {
  darkMode: boolean;
  rsiPeriod: number;
  rsiThreshold: number;
  defaultTimeframe: Timeframe;
  animationsEnabled: boolean;
}

// ─── Filter Models ──────────────────────────────────────────────────────────

export interface ScannerFilters {
  trend: 'ALL' | MarketCondition;
  trend4h: 'ALL' | Trend;
  trend1h: 'ALL' | Trend;
  rsi: 'ALL' | 'ABOVE_50' | 'BELOW_50';
  divergence: 'ALL' | DivergenceType;
  risk: 'ALL' | RiskLevel;
}
