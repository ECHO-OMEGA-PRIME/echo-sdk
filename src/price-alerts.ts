/** Echo Prime SDK v3.0 — Price Alerts module
 * Multi-asset price monitoring with configurable thresholds.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type AlertCondition = 'above' | 'below' | 'change_pct' | 'cross';
export type AssetType = 'crypto' | 'stock' | 'commodity' | 'forex';

export interface PriceAlert {
  id: string;
  asset: string;
  asset_type: AssetType;
  condition: AlertCondition;
  threshold: number;
  current_price: number;
  active: boolean;
  triggered: boolean;
  triggered_at?: string;
  created_at: string;
}

export interface PriceSnapshot {
  asset: string;
  asset_type: AssetType;
  price: number;
  change_1h: number;
  change_24h: number;
  change_7d: number;
  volume_24h: number;
  timestamp: string;
}

export interface AlertHistory {
  id: string;
  alert_id: string;
  asset: string;
  condition: AlertCondition;
  threshold: number;
  price_at_trigger: number;
  triggered_at: string;
}

export interface PriceAlertStats {
  active_alerts: number;
  total_triggered: number;
  assets_tracked: number;
  avg_check_interval_ms: number;
}

export class EchoPriceAlerts {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Create a price alert */
  async create(asset: string, condition: AlertCondition, threshold: number, assetType: AssetType = 'crypto'): Promise<PriceAlert> {
    return this.client.request<PriceAlert>('/price-alerts/create', {
      method: 'POST',
      body: { asset, condition, threshold, asset_type: assetType },
    });
  }

  /** List all alerts */
  async list(opts?: { active?: boolean; assetType?: AssetType }): Promise<PriceAlert[]> {
    return this.client.request<PriceAlert[]>('/price-alerts/list', {
      params: {
        ...(opts?.active !== undefined ? { active: String(opts.active) } : {}),
        ...(opts?.assetType ? { asset_type: opts.assetType } : {}),
      },
    });
  }

  /** Delete an alert */
  async delete(alertId: string): Promise<{ success: boolean }> {
    return this.client.request('/price-alerts/delete', {
      method: 'DELETE',
      params: { id: alertId },
    });
  }

  /** Get current prices */
  async prices(assets: string[]): Promise<PriceSnapshot[]> {
    return this.client.request<PriceSnapshot[]>('/price-alerts/prices', {
      params: { assets: assets.join(',') },
    });
  }

  /** Get alert trigger history */
  async history(opts?: { limit?: number }): Promise<AlertHistory[]> {
    return this.client.request<AlertHistory[]>('/price-alerts/history', {
      params: { limit: String(opts?.limit ?? 50) },
    });
  }

  /** Get stats */
  async stats(): Promise<PriceAlertStats> {
    return this.client.request<PriceAlertStats>('/price-alerts/stats');
  }
}
