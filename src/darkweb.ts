/** Echo Prime SDK v3.0 — Dark Web Intelligence module
 * Threat monitoring, credential breach detection, brand protection.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ThreatCategory = 'credential_leak' | 'brand_mention' | 'data_breach' | 'ransomware'
  | 'exploit' | 'phishing' | 'malware' | 'insider_threat' | 'vulnerability';

export interface DarkwebThreat {
  id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  category: ThreatCategory;
  source: string;
  indicators: string[];
  raw_data?: string;
  discovered_at: string;
  processed: boolean;
}

export interface DarkwebAlert {
  id: string;
  name: string;
  keywords: string[];
  severity_threshold: ThreatSeverity;
  channels: string[];
  active: boolean;
  created_at: string;
  last_triggered?: string;
  trigger_count: number;
}

export interface BreachResult {
  email: string;
  breached: boolean;
  breach_count: number;
  sources: string[];
  first_seen?: string;
  last_seen?: string;
}

export interface DarkwebIntel {
  id: string;
  title: string;
  content: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  source: string;
  confidence: number;
  iocs: Array<{ type: string; value: string }>;
  created_at: string;
}

export interface DarkwebStats {
  total_threats: number;
  threats_24h: number;
  sources_monitored: number;
  active_alerts: number;
  breaches_detected: number;
}

export class EchoDarkweb {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search dark web intelligence */
  async search(query: string, opts?: { severity?: ThreatSeverity; category?: ThreatCategory; limit?: number }): Promise<DarkwebThreat[]> {
    return this.client.request<DarkwebThreat[]>('/darkweb/search', {
      params: {
        q: query,
        ...(opts?.severity ? { severity: opts.severity } : {}),
        ...(opts?.category ? { category: opts.category } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Check if an email has been in a breach */
  async checkBreach(email: string): Promise<BreachResult> {
    return this.client.request<BreachResult>('/darkweb/breach-check', {
      method: 'POST',
      body: { email },
    });
  }

  /** Create a monitoring alert */
  async createAlert(name: string, keywords: string[], opts?: {
    severityThreshold?: ThreatSeverity;
    channels?: string[];
  }): Promise<DarkwebAlert> {
    return this.client.request<DarkwebAlert>('/darkweb/alert', {
      method: 'POST',
      body: {
        name,
        keywords,
        severity_threshold: opts?.severityThreshold ?? 'medium',
        channels: opts?.channels ?? ['dashboard'],
      },
    });
  }

  /** List all alerts */
  async alerts(): Promise<DarkwebAlert[]> {
    return this.client.request<DarkwebAlert[]>('/darkweb/alerts');
  }

  /** Delete an alert */
  async deleteAlert(alertId: string): Promise<{ success: boolean }> {
    return this.client.request('/darkweb/alert', {
      method: 'DELETE',
      params: { id: alertId },
    });
  }

  /** Get recent threats */
  async threats(opts?: { severity?: ThreatSeverity; hours?: number; limit?: number }): Promise<DarkwebThreat[]> {
    return this.client.request<DarkwebThreat[]>('/darkweb/threats', {
      params: {
        ...(opts?.severity ? { severity: opts.severity } : {}),
        hours: String(opts?.hours ?? 24),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get intelligence reports */
  async intel(opts?: { category?: ThreatCategory; limit?: number }): Promise<DarkwebIntel[]> {
    return this.client.request<DarkwebIntel[]>('/darkweb/intel', {
      params: {
        ...(opts?.category ? { category: opts.category } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Monitor specific domains/brands */
  async monitorBrand(brand: string, domains: string[], keywords: string[]): Promise<{ id: string; active: boolean }> {
    return this.client.request('/darkweb/brand-monitor', {
      method: 'POST',
      body: { brand, domains, keywords },
    });
  }

  /** Get dark web monitoring stats */
  async stats(): Promise<DarkwebStats> {
    return this.client.request<DarkwebStats>('/darkweb/stats');
  }
}
