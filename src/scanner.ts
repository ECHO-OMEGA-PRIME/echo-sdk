/** Echo Prime SDK v3.0 — ShadowGlass Scanner module
 * County record scraping, document indexing, multi-county search.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type ScrapeStatus = 'queued' | 'running' | 'complete' | 'failed' | 'paused';

export interface ScanJob {
  id: string;
  county: string;
  state: string;
  status: ScrapeStatus;
  documents_found: number;
  documents_indexed: number;
  pages_scraped: number;
  started_at: string;
  completed_at?: string;
  error?: string;
}

export interface ScannedDocument {
  id: string;
  county: string;
  instrument_type: string;
  instrument_number: string;
  grantor: string;
  grantee: string;
  recorded_date: string;
  legal_description: string;
  book?: string;
  page?: string;
  url?: string;
}

export interface CountyStatus {
  county: string;
  state: string;
  total_documents: number;
  last_scraped?: string;
  scrape_status: ScrapeStatus;
  coverage_percent: number;
}

export interface ScannerStats {
  counties_covered: number;
  total_documents: number;
  documents_24h: number;
  active_jobs: number;
  pages_scraped_total: number;
}

export class EchoScanner {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Start a county scan */
  async scan(county: string, opts?: { state?: string; instrumentTypes?: string[]; dateRange?: { from: string; to: string } }): Promise<ScanJob> {
    return this.client.request<ScanJob>('/scanner/scan', {
      method: 'POST',
      body: {
        county,
        state: opts?.state ?? 'TX',
        instrument_types: opts?.instrumentTypes,
        date_range: opts?.dateRange,
      },
    });
  }

  /** Get scan job status */
  async jobStatus(jobId: string): Promise<ScanJob> {
    return this.client.request<ScanJob>('/scanner/job', {
      params: { id: jobId },
    });
  }

  /** List scan jobs */
  async jobs(opts?: { status?: ScrapeStatus; county?: string; limit?: number }): Promise<ScanJob[]> {
    return this.client.request<ScanJob[]>('/scanner/jobs', {
      params: {
        ...(opts?.status ? { status: opts.status } : {}),
        ...(opts?.county ? { county: opts.county } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Search scanned documents */
  async searchDocuments(query: string, opts?: { county?: string; instrumentType?: string; limit?: number }): Promise<ScannedDocument[]> {
    return this.client.request<ScannedDocument[]>('/scanner/search', {
      params: {
        q: query,
        ...(opts?.county ? { county: opts.county } : {}),
        ...(opts?.instrumentType ? { instrument_type: opts.instrumentType } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get county coverage status */
  async counties(): Promise<CountyStatus[]> {
    return this.client.request<CountyStatus[]>('/scanner/counties');
  }

  /** Get scanner stats */
  async stats(): Promise<ScannerStats> {
    return this.client.request<ScannerStats>('/scanner/stats');
  }
}
