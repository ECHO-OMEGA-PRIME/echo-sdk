/** Echo Prime SDK v3.0 — Engine module */
import { EchoHttpClient } from './client.js';
import type { EchoConfig, EngineQueryResult, EngineInfo } from './types.js';

export class EchoEngines {
  private client: EchoHttpClient;

  constructor(config: EchoConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Query engines with a natural language question */
  async query(question: string, domain?: string): Promise<EngineQueryResult> {
    return this.client.request<EngineQueryResult>('/engine/query', {
      params: { q: question, ...(domain ? { domain } : {}) },
    });
  }

  /** Batch query multiple questions */
  async queryBatch(queries: Array<{ query: string; domain?: string }>): Promise<EngineQueryResult[]> {
    return this.client.request<EngineQueryResult[]>('/engine/query-batch', {
      method: 'POST',
      body: { queries },
    });
  }

  /** List all available engines */
  async list(domain?: string): Promise<EngineInfo[]> {
    return this.client.request<EngineInfo[]>('/engine/list', {
      params: domain ? { domain } : {},
    });
  }

  /** Search engines by keyword */
  async search(query: string, limit = 10): Promise<EngineInfo[]> {
    return this.client.request<EngineInfo[]>('/engine/search', {
      params: { q: query, limit: String(limit) },
    });
  }

  /** Get engine metadata */
  async metadata(engineId: string): Promise<EngineInfo> {
    return this.client.request<EngineInfo>('/engine/metadata', {
      params: { engine_id: engineId },
    });
  }

  /** Get engine capabilities */
  async capabilities(engineId: string): Promise<Record<string, unknown>> {
    return this.client.request('/engine/capabilities', {
      params: { engine_id: engineId },
    });
  }

  /** Engine runtime status */
  async status(): Promise<Record<string, unknown>> {
    return this.client.request('/engine/status');
  }
}

export { EchoEngines as default };
