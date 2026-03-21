/** Echo Prime SDK v3.0 — Crypto Trading module
 * Grid + momentum strategies, price tracking, portfolio management.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type TradingStrategy = 'grid' | 'momentum' | 'dca' | 'arbitrage' | 'scalp';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'partial' | 'cancelled' | 'failed';

export interface TradingPair {
  symbol: string;
  base: string;
  quote: string;
  price: number;
  change_24h: number;
  volume_24h: number;
  high_24h: number;
  low_24h: number;
}

export interface TradeOrder {
  id: string;
  pair: string;
  side: OrderSide;
  strategy: TradingStrategy;
  amount: number;
  price: number;
  status: OrderStatus;
  filled_at?: string;
  created_at: string;
}

export interface StrategyConfig {
  id: string;
  name: string;
  strategy: TradingStrategy;
  pair: string;
  active: boolean;
  params: Record<string, unknown>;
  pnl: number;
  trades_count: number;
  created_at: string;
}

export interface PortfolioPosition {
  asset: string;
  amount: number;
  avg_cost: number;
  current_price: number;
  pnl: number;
  pnl_percent: number;
}

export interface CryptoStats {
  total_trades: number;
  active_strategies: number;
  total_pnl: number;
  win_rate: number;
  pairs_tracked: number;
}

export class EchoCrypto {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Get current price for a trading pair */
  async price(pair: string): Promise<TradingPair> {
    return this.client.request<TradingPair>('/crypto/price', {
      params: { pair },
    });
  }

  /** Get prices for multiple pairs */
  async prices(pairs?: string[]): Promise<TradingPair[]> {
    return this.client.request<TradingPair[]>('/crypto/prices', {
      params: pairs ? { pairs: pairs.join(',') } : {},
    });
  }

  /** Create a trading strategy */
  async createStrategy(name: string, strategy: TradingStrategy, pair: string, params: Record<string, unknown>): Promise<StrategyConfig> {
    return this.client.request<StrategyConfig>('/crypto/strategy', {
      method: 'POST',
      body: { name, strategy, pair, params },
    });
  }

  /** List all strategies */
  async strategies(opts?: { active?: boolean }): Promise<StrategyConfig[]> {
    return this.client.request<StrategyConfig[]>('/crypto/strategies', {
      params: opts?.active !== undefined ? { active: String(opts.active) } : {},
    });
  }

  /** Start/stop a strategy */
  async toggleStrategy(strategyId: string, active: boolean): Promise<{ success: boolean }> {
    return this.client.request('/crypto/strategy/toggle', {
      method: 'POST',
      body: { strategy_id: strategyId, active },
    });
  }

  /** Get trade history */
  async trades(opts?: { pair?: string; strategy?: TradingStrategy; limit?: number }): Promise<TradeOrder[]> {
    return this.client.request<TradeOrder[]>('/crypto/trades', {
      params: {
        ...(opts?.pair ? { pair: opts.pair } : {}),
        ...(opts?.strategy ? { strategy: opts.strategy } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get portfolio positions */
  async portfolio(): Promise<PortfolioPosition[]> {
    return this.client.request<PortfolioPosition[]>('/crypto/portfolio');
  }

  /** Get trading stats */
  async stats(): Promise<CryptoStats> {
    return this.client.request<CryptoStats>('/crypto/stats');
  }
}
