/** Echo Prime SDK v3.0 — Doctrine Forge module
 * Generate and search domain-specific doctrine blocks via 24 FREE LLM providers.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';
import type { DoctrineBlock } from './types.js';

export class EchoDoctrine {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Generate doctrine blocks for a domain/topic */
  async generate(
    domain: string,
    topic: string,
    provider?: string,
  ): Promise<{ doctrines: DoctrineBlock[]; provider_used: string }> {
    return this.client.request('/doctrine/generate', {
      method: 'POST',
      body: { domain, topic, ...(provider ? { provider } : {}) },
    });
  }

  /** List doctrines, optionally filtered by domain */
  async list(domain?: string): Promise<DoctrineBlock[]> {
    return this.client.request<DoctrineBlock[]>('/doctrine/list', {
      params: domain ? { domain } : {},
    });
  }

  /** Get available LLM providers (all FREE) */
  async providers(): Promise<Array<{ id: string; name: string; status: string }>> {
    return this.client.request('/doctrine/providers');
  }

  /** Search doctrines by keyword */
  async search(query: string, domain?: string, limit = 10): Promise<DoctrineBlock[]> {
    return this.client.request<DoctrineBlock[]>('/doctrine/search', {
      params: { q: query, limit: String(limit), ...(domain ? { domain } : {}) },
    });
  }
}

export { EchoDoctrine as default };
