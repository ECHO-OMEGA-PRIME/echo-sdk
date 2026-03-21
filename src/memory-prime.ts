/** Echo Prime SDK v3.0 — Memory Prime module
 * Permanent 9-pillar memory archive, cross-session recall, semantic search.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type MemoryPillar = 'decisions' | 'errors' | 'patterns' | 'context' | 'code' | 'conversations' | 'knowledge' | 'tasks' | 'metrics';

export interface MemoryEntry {
  id: string;
  pillar: MemoryPillar;
  content: string;
  importance: number;
  tags: string[];
  source: string;
  created_at: string;
  accessed_at?: string;
  access_count: number;
}

export interface MemorySearchResult {
  entries: MemoryEntry[];
  total_matches: number;
  search_latency_ms: number;
}

export interface MemoryPillarStats {
  pillar: MemoryPillar;
  entry_count: number;
  avg_importance: number;
  oldest_entry: string;
  newest_entry: string;
}

export interface MemoryStats {
  total_entries: number;
  pillars: MemoryPillarStats[];
  total_searches: number;
  avg_search_latency_ms: number;
}

export class EchoMemoryPrime {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Store a memory */
  async store(pillar: MemoryPillar, content: string, opts?: { importance?: number; tags?: string[]; source?: string }): Promise<MemoryEntry> {
    return this.client.request<MemoryEntry>('/memory-prime/store', {
      method: 'POST',
      body: {
        pillar,
        content,
        importance: opts?.importance ?? 5,
        tags: opts?.tags ?? [],
        source: opts?.source ?? 'sdk',
      },
    });
  }

  /** Search memories semantically */
  async search(query: string, opts?: { pillar?: MemoryPillar; minImportance?: number; limit?: number }): Promise<MemorySearchResult> {
    return this.client.request<MemorySearchResult>('/memory-prime/search', {
      method: 'POST',
      body: {
        query,
        pillar: opts?.pillar,
        min_importance: opts?.minImportance,
        limit: opts?.limit ?? 20,
      },
    });
  }

  /** Recall by pillar */
  async recall(pillar: MemoryPillar, opts?: { limit?: number }): Promise<MemoryEntry[]> {
    return this.client.request<MemoryEntry[]>('/memory-prime/recall', {
      params: { pillar, limit: String(opts?.limit ?? 50) },
    });
  }

  /** Get a specific memory */
  async get(memoryId: string): Promise<MemoryEntry> {
    return this.client.request<MemoryEntry>('/memory-prime/entry', {
      params: { id: memoryId },
    });
  }

  /** Delete a memory */
  async delete(memoryId: string): Promise<{ success: boolean }> {
    return this.client.request('/memory-prime/entry', {
      method: 'DELETE',
      params: { id: memoryId },
    });
  }

  /** Get memory stats */
  async stats(): Promise<MemoryStats> {
    return this.client.request<MemoryStats>('/memory-prime/stats');
  }
}
