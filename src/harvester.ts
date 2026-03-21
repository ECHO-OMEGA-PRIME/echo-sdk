/** Echo Prime SDK v3.0 — Knowledge Harvester module
 * Automated knowledge source discovery, ingestion, categorization.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type SourceType = 'rss' | 'api' | 'scrape' | 'manual' | 'sitemap' | 'github';
export type HarvestStatus = 'active' | 'paused' | 'failed' | 'pending';

export interface HarvestSource {
  id: string;
  name: string;
  url: string;
  source_type: SourceType;
  category: string;
  status: HarvestStatus;
  items_harvested: number;
  last_harvest?: string;
  schedule: string;
  created_at: string;
}

export interface HarvestItem {
  id: string;
  source_id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  quality_score: number;
  ingested: boolean;
  created_at: string;
}

export interface DiscoveryReport {
  id: string;
  date: string;
  items_discovered: number;
  items_ingested: number;
  new_sources: number;
  categories_updated: string[];
}

export interface HarvesterStats {
  total_sources: number;
  active_sources: number;
  total_items: number;
  items_today: number;
  categories: number;
}

export class EchoHarvester {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Add a harvest source */
  async addSource(name: string, url: string, sourceType: SourceType, category: string, schedule = '0 */6 * * *'): Promise<HarvestSource> {
    return this.client.request<HarvestSource>('/harvester/source', {
      method: 'POST',
      body: { name, url, source_type: sourceType, category, schedule },
    });
  }

  /** List all sources */
  async sources(opts?: { status?: HarvestStatus; category?: string }): Promise<HarvestSource[]> {
    return this.client.request<HarvestSource[]>('/harvester/sources', {
      params: {
        ...(opts?.status ? { status: opts.status } : {}),
        ...(opts?.category ? { category: opts.category } : {}),
      },
    });
  }

  /** Trigger a harvest run */
  async harvest(sourceId: string): Promise<{ success: boolean; items_found: number }> {
    return this.client.request('/harvester/run', {
      method: 'POST',
      body: { source_id: sourceId },
    });
  }

  /** Get harvested items */
  async items(opts?: { sourceId?: string; category?: string; limit?: number }): Promise<HarvestItem[]> {
    return this.client.request<HarvestItem[]>('/harvester/items', {
      params: {
        ...(opts?.sourceId ? { source_id: opts.sourceId } : {}),
        ...(opts?.category ? { category: opts.category } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get discovery reports */
  async reports(opts?: { limit?: number }): Promise<DiscoveryReport[]> {
    return this.client.request<DiscoveryReport[]>('/harvester/reports', {
      params: { limit: String(opts?.limit ?? 10) },
    });
  }

  /** Get harvester stats */
  async stats(): Promise<HarvesterStats> {
    return this.client.request<HarvesterStats>('/harvester/stats');
  }
}
