/** Echo Prime SDK v3.0 — Knowledge Forge module
 * Search 5,300+ documents across 140+ categories.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';
import type { KnowledgeResult } from './types.js';

export class EchoKnowledge {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search the Knowledge Forge */
  async search(query: string, limit = 5): Promise<KnowledgeResult[]> {
    return this.client.request<KnowledgeResult[]>('/knowledge/search', {
      method: 'POST',
      body: { query, limit },
    });
  }

  /** List knowledge categories */
  async categories(): Promise<Array<{ id: string; name: string; doc_count: number }>> {
    return this.client.request('/knowledge/categories');
  }

  /** Ingest a document into the Knowledge Forge */
  async ingest(title: string, content: string, category: string): Promise<{ id: string }> {
    return this.client.request('/knowledge/ingest', {
      method: 'POST',
      body: { title, content, category },
    });
  }
}

export { EchoKnowledge as default };
