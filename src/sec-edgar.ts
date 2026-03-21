/** Echo Prime SDK v3.0 — SEC EDGAR module
 * SEC filing monitoring, company watchlists, financial data extraction.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type FilingType = '10-K' | '10-Q' | '8-K' | '4' | 'SC 13D' | 'S-1' | 'DEF 14A' | '13F-HR';

export interface SECFiling {
  id: string;
  company: string;
  ticker: string;
  cik: string;
  filing_type: FilingType;
  filed_at: string;
  url: string;
  summary?: string;
  key_metrics?: Record<string, unknown>;
}

export interface WatchlistCompany {
  id: string;
  ticker: string;
  company_name: string;
  cik: string;
  filing_types: FilingType[];
  last_filing?: string;
  filing_count: number;
  added_at: string;
}

export interface SECAlert {
  id: string;
  ticker: string;
  filing_type: FilingType;
  filing_url: string;
  summary: string;
  triggered_at: string;
}

export interface SECStats {
  watchlist_companies: number;
  total_filings: number;
  filings_24h: number;
  alerts_sent: number;
}

export class EchoSECEdgar {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search SEC filings */
  async search(query: string, opts?: { filingType?: FilingType; ticker?: string; limit?: number }): Promise<SECFiling[]> {
    return this.client.request<SECFiling[]>('/sec/search', {
      params: {
        q: query,
        ...(opts?.filingType ? { filing_type: opts.filingType } : {}),
        ...(opts?.ticker ? { ticker: opts.ticker } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Get recent filings for a company */
  async filings(ticker: string, opts?: { filingType?: FilingType; limit?: number }): Promise<SECFiling[]> {
    return this.client.request<SECFiling[]>('/sec/filings', {
      params: {
        ticker,
        ...(opts?.filingType ? { filing_type: opts.filingType } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Add company to watchlist */
  async watch(ticker: string, filingTypes?: FilingType[]): Promise<WatchlistCompany> {
    return this.client.request<WatchlistCompany>('/sec/watchlist', {
      method: 'POST',
      body: { ticker, filing_types: filingTypes ?? ['10-K', '10-Q', '8-K'] },
    });
  }

  /** Get watchlist */
  async watchlist(): Promise<WatchlistCompany[]> {
    return this.client.request<WatchlistCompany[]>('/sec/watchlist');
  }

  /** Remove from watchlist */
  async unwatch(ticker: string): Promise<{ success: boolean }> {
    return this.client.request('/sec/watchlist', {
      method: 'DELETE',
      params: { ticker },
    });
  }

  /** Get filing alerts */
  async alerts(opts?: { limit?: number }): Promise<SECAlert[]> {
    return this.client.request<SECAlert[]>('/sec/alerts', {
      params: { limit: String(opts?.limit ?? 50) },
    });
  }

  /** Get SEC monitoring stats */
  async stats(): Promise<SECStats> {
    return this.client.request<SECStats>('/sec/stats');
  }
}
