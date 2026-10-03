import type { WalletGraph } from '../types';

export function getWalletGraph(symbol: string): WalletGraph {
  const sym = symbol.toUpperCase();

  if (sym === 'WIF' || sym === 'PEPE' || sym === 'JTO' || sym === 'SEI') {
    return {
      nodes: [
        { id: 'wallet_origin', label: 'Primary Funding Hub (0x9b...4a)', type: 'source', risk: 'HIGH' },
        { id: 'wallet_b', label: 'Cluster Wallet B (0x3f...12)', type: 'intermediary', risk: 'HIGH' },
        { id: 'wallet_c', label: 'Cluster Wallet C (0x81...e9)', type: 'intermediary', risk: 'HIGH' },
        { id: 'wallet_d', label: 'Cluster Wallet D (0xaa...55)', type: 'intermediary', risk: 'HIGH' },
        { id: 'wallet_e', label: 'Accumulator E (0x12...99)', type: 'holder', risk: 'MODERATE' },
        { id: 'token_pool', label: `${sym} Liquidity Pool`, type: 'token', risk: 'MODERATE' },
      ],
      edges: [
        { from: 'wallet_origin', to: 'wallet_b', label: 'Dispersed 180 ETH' },
        { from: 'wallet_origin', to: 'wallet_c', label: 'Dispersed 220 ETH' },
        { from: 'wallet_origin', to: 'wallet_d', label: 'Dispersed 150 ETH' },
        { from: 'wallet_b', to: 'token_pool', label: 'Coordinated Swap' },
        { from: 'wallet_c', to: 'token_pool', label: 'Coordinated Swap' },
        { from: 'wallet_d', to: 'wallet_e', label: 'Internal Transfer' },
        { from: 'wallet_e', to: 'token_pool', label: 'LP Injection' },
      ],
      riskDescription: 'HIGH RISK INDICATOR: Possible coordinated wallet activity & shared parent funding detected within the last 48 hours.',
    };
  }

  // Standard / Healthy Graph for major tokens
  return {
    nodes: [
      { id: 'binance_hot', label: 'Exchange Custody Cold/Hot (Binance)', type: 'source', risk: 'LOW' },
      { id: 'coinbase_hot', label: 'Institutional Custody (Coinbase Prime)', type: 'source', risk: 'LOW' },
      { id: 'dex_router', label: 'Uniswap / Raydium Router', type: 'intermediary', risk: 'LOW' },
      { id: 'mm_firm', label: 'Designated MM Address (Wintermute/Jump)', type: 'holder', risk: 'LOW' },
      { id: 'retail_dist', label: 'Dispersed Non-Custodial Holders (>150k)', type: 'holder', risk: 'LOW' },
      { id: 'token_pool', label: `${sym} Market Pool`, type: 'token', risk: 'LOW' },
    ],
    edges: [
      { from: 'binance_hot', to: 'token_pool', label: 'Market Flow' },
      { from: 'coinbase_hot', to: 'dex_router', label: 'OTC Settled' },
      { from: 'dex_router', to: 'token_pool', label: 'Arbitrage Rebalance' },
      { from: 'mm_firm', to: 'token_pool', label: 'Bilateral Liquidity' },
      { from: 'token_pool', to: 'retail_dist', label: 'Organic Transfers' },
    ],
    riskDescription: 'HEALTHY DISTRIBUTION: Diverse transaction origins with standard institutional market-making patterns.',
  };
}
