/** Echo Prime SDK v3.2 — Data Layer module (F4)
 * Read-only SQL access to fleet D1 databases via the SDK Gateway.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DatabaseInfo {
  domain: string;
  binding: string;
  description: string;
  available: boolean;
}

export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  primary_key: boolean;
  default_value: string | null;
}

export interface TableInfo {
  name: string;
  columns: ColumnSchema[];
  column_count: number;
}

export interface TablesResponse {
  domain: string;
  description: string;
  tables: TableInfo[];
  total_tables: number;
}

export interface QueryMeta {
  changes: number;
  duration_ms: number;
  last_row_id: number;
  served_by: string;
}

export interface QueryResult<T = Record<string, unknown>> {
  domain: string;
  sql: string;
  params: unknown[];
  rows: T[];
  row_count: number;
  meta: QueryMeta;
}

export interface TableStats {
  name: string;
  row_count: number;
}

export interface DatabaseStats {
  domain: string;
  description: string;
  tables: TableStats[];
  total_tables: number;
  total_rows: number;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class DataClient {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** List all queryable database domains */
  async databases(): Promise<{
    databases: DatabaseInfo[];
    total: number;
  }> {
    return this.client.request('/data/databases');
  }

  /** List tables and column schemas for a database domain */
  async tables(domain: string): Promise<TablesResponse> {
    return this.client.request(`/data/${encodeURIComponent(domain)}/tables`);
  }

  /**
   * Execute a read-only SQL query against a database domain.
   * Only SELECT statements are allowed — the gateway rejects all mutations.
   */
  async query<T = Record<string, unknown>>(
    domain: string,
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.client.request(`/data/${encodeURIComponent(domain)}/query`, {
      method: 'POST',
      body: { sql, params: params || [] },
    });
  }

  /** Get row counts and metadata for a database domain */
  async stats(domain: string): Promise<DatabaseStats> {
    return this.client.request(`/data/${encodeURIComponent(domain)}/stats`);
  }
}

export { DataClient as default };
