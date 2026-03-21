/** Echo Prime SDK v3.0 — Scraper Factory module
 * Configure and run web scrapers via Echo scraper infrastructure.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface ScraperConfig {
  name: string;
  type: 'web' | 'api' | 'social' | 'government' | 'custom';
  target: string;
  schedule?: string;
  selectors?: Record<string, string>;
  headers?: Record<string, string>;
  rateLimit?: { requestsPerMinute: number };
  pagination?: { type: 'page' | 'cursor' | 'offset'; maxPages?: number };
}

export interface ScraperJob {
  id: string;
  scraper_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  records_found: number;
  records_stored: number;
  started_at: string;
  completed_at?: string;
  error?: string;
}

export interface ScraperInfo {
  id: string;
  name: string;
  type: string;
  target: string;
  schedule: string | null;
  total_records: number;
  last_run?: string;
  status: string;
}

export interface ScrapedRecord {
  id: string;
  scraper_id: string;
  data: Record<string, unknown>;
  url?: string;
  scraped_at: string;
}

export class EchoScraper {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Create a new scraper */
  async create(scraperConfig: ScraperConfig): Promise<ScraperInfo> {
    return this.client.request<ScraperInfo>('/scraper/create', {
      method: 'POST',
      body: {
        name: scraperConfig.name,
        type: scraperConfig.type,
        target: scraperConfig.target,
        schedule: scraperConfig.schedule,
        selectors: scraperConfig.selectors,
        headers: scraperConfig.headers,
        rate_limit: scraperConfig.rateLimit,
        pagination: scraperConfig.pagination,
      },
    });
  }

  /** Run a scraper immediately */
  async run(scraperId: string): Promise<ScraperJob> {
    return this.client.request<ScraperJob>('/scraper/run', {
      method: 'POST',
      body: { scraper_id: scraperId },
    });
  }

  /** Get job status */
  async jobStatus(jobId: string): Promise<ScraperJob> {
    return this.client.request<ScraperJob>('/scraper/job', {
      params: { job_id: jobId },
    });
  }

  /** List all scrapers */
  async list(): Promise<ScraperInfo[]> {
    return this.client.request<ScraperInfo[]>('/scraper/list');
  }

  /** Get scraper details */
  async get(scraperId: string): Promise<ScraperInfo> {
    return this.client.request<ScraperInfo>('/scraper/info', {
      params: { scraper_id: scraperId },
    });
  }

  /** Get scraped records */
  async records(scraperId: string, limit = 50, offset = 0): Promise<ScrapedRecord[]> {
    return this.client.request<ScrapedRecord[]>('/scraper/records', {
      params: { scraper_id: scraperId, limit: String(limit), offset: String(offset) },
    });
  }

  /** Delete a scraper and its data */
  async delete(scraperId: string): Promise<{ success: boolean }> {
    return this.client.request('/scraper/delete', {
      method: 'DELETE',
      params: { scraper_id: scraperId },
    });
  }

  /** Pause a scheduled scraper */
  async pause(scraperId: string): Promise<{ success: boolean }> {
    return this.client.request('/scraper/pause', {
      method: 'POST',
      body: { scraper_id: scraperId },
    });
  }

  /** Resume a paused scraper */
  async resume(scraperId: string): Promise<{ success: boolean }> {
    return this.client.request('/scraper/resume', {
      method: 'POST',
      body: { scraper_id: scraperId },
    });
  }

  /** Get scraper run history */
  async history(scraperId: string, limit = 20): Promise<ScraperJob[]> {
    return this.client.request<ScraperJob[]>('/scraper/history', {
      params: { scraper_id: scraperId, limit: String(limit) },
    });
  }
}
