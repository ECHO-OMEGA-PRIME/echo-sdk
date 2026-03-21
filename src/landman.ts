/** Echo Prime SDK v3.0 — Landman Pipeline module
 * Title investigation, chain-of-title, deed records, runsheet generation.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type InvestigationStatus = 'pending' | 'searching' | 'analyzing' | 'generating' | 'complete' | 'failed';
export type DeedType = 'warranty_deed' | 'quit_claim' | 'mineral_deed' | 'oil_gas_lease' | 'assignment' | 'release' | 'easement' | 'mortgage' | 'lien' | 'other';

export interface TitleInvestigation {
  id: string;
  county: string;
  state: string;
  legal_description: string;
  status: InvestigationStatus;
  progress: number;
  documents_found: number;
  chain_links: number;
  gaps_detected: number;
  estimated_cost: number;
  created_at: string;
  completed_at?: string;
}

export interface DeedRecord {
  id: string;
  county: string;
  state: string;
  deed_type: DeedType;
  grantor: string;
  grantee: string;
  recorded_date: string;
  instrument_number: string;
  legal_description: string;
  consideration?: number;
  book?: string;
  page?: string;
}

export interface ChainOfTitle {
  property: string;
  county: string;
  links: Array<{
    grantor: string;
    grantee: string;
    deed_type: DeedType;
    date: string;
    instrument: string;
  }>;
  gaps: Array<{
    from: string;
    to: string;
    gap_years: number;
    severity: 'critical' | 'moderate' | 'minor';
  }>;
  complete: boolean;
}

export interface Runsheet {
  id: string;
  investigation_id: string;
  property: string;
  county: string;
  chain_of_title: ChainOfTitle;
  mineral_interests: Array<{ owner: string; interest: number; type: string }>;
  encumbrances: Array<{ type: string; holder: string; amount?: number }>;
  generated_at: string;
}

export interface LandmanStats {
  total_investigations: number;
  documents_indexed: number;
  counties_covered: number;
  chain_completions: number;
  avg_investigation_time_ms: number;
}

export class EchoLandman {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Start a title investigation */
  async investigate(county: string, legalDescription: string, opts?: { state?: string; async?: boolean }): Promise<TitleInvestigation> {
    return this.client.request<TitleInvestigation>('/landman/investigate', {
      method: 'POST',
      body: { county, legal_description: legalDescription, state: opts?.state ?? 'TX', async: opts?.async ?? true },
    });
  }

  /** Get investigation status */
  async status(investigationId: string): Promise<TitleInvestigation> {
    return this.client.request<TitleInvestigation>('/landman/investigation', {
      params: { id: investigationId },
    });
  }

  /** Get chain of title */
  async chainOfTitle(county: string, legalDescription: string): Promise<ChainOfTitle> {
    return this.client.request<ChainOfTitle>('/landman/chain-of-title', {
      method: 'POST',
      body: { county, legal_description: legalDescription },
    });
  }

  /** Search deed records */
  async searchRecords(opts: { county: string; grantor?: string; grantee?: string; deedType?: DeedType; section?: string; block?: string; limit?: number }): Promise<DeedRecord[]> {
    return this.client.request<DeedRecord[]>('/landman/records', {
      params: {
        county: opts.county,
        ...(opts.grantor ? { grantor: opts.grantor } : {}),
        ...(opts.grantee ? { grantee: opts.grantee } : {}),
        ...(opts.deedType ? { deed_type: opts.deedType } : {}),
        ...(opts.section ? { section: opts.section } : {}),
        ...(opts.block ? { block: opts.block } : {}),
        limit: String(opts.limit ?? 50),
      },
    });
  }

  /** Get runsheet for an investigation */
  async runsheet(investigationId: string): Promise<Runsheet> {
    return this.client.request<Runsheet>('/landman/runsheet', {
      params: { id: investigationId },
    });
  }

  /** Query county records database */
  async countyQuery(county: string, opts?: { section?: string; block?: string; survey?: string; limit?: number }): Promise<DeedRecord[]> {
    return this.client.request<DeedRecord[]>('/landman/county/query', {
      method: 'POST',
      body: {
        county,
        ...(opts?.section ? { section: opts.section } : {}),
        ...(opts?.block ? { block: opts.block } : {}),
        ...(opts?.survey ? { survey: opts.survey } : {}),
        limit: opts?.limit ?? 50,
      },
    });
  }

  /** Get county stats */
  async countyStats(): Promise<{ county: string; documents: number; parties: number }[]> {
    return this.client.request('/landman/county/stats');
  }

  /** Get landman pipeline stats */
  async stats(): Promise<LandmanStats> {
    return this.client.request<LandmanStats>('/landman/stats');
  }
}
