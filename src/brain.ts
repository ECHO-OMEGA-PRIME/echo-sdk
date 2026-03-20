/** Echo Prime SDK v3.0 — Shared Brain module */
import { EchoHttpClient } from './client.js';
import type { EchoConfig, BrainMemory } from './types.js';

export class EchoBrain {
  private client: EchoHttpClient;

  constructor(config: EchoConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Store a memory in the Shared Brain */
  async ingest(content: string, importance = 5, tags: string[] = []): Promise<{ id: string }> {
    return this.client.request('/brain/ingest', {
      method: 'POST',
      body: { content, importance, tags },
    });
  }

  /** Semantic search across all memories */
  async search(query: string, limit = 10): Promise<BrainMemory[]> {
    return this.client.request<BrainMemory[]>('/brain/search', {
      method: 'POST',
      body: { query, limit },
    });
  }

  /** Recall a specific memory by key */
  async recall(key: string): Promise<BrainMemory | null> {
    return this.client.request<BrainMemory | null>('/brain/recall', {
      params: { key },
    });
  }

  /** Store a key-value memory */
  async store(key: string, value: Record<string, unknown>): Promise<{ success: boolean }> {
    return this.client.request('/brain/store', {
      method: 'POST',
      body: { key, value },
    });
  }

  /** Get brain statistics */
  async stats(): Promise<Record<string, unknown>> {
    return this.client.request('/brain/stats');
  }
}

export { EchoBrain as default };
