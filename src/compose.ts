/** Echo Prime SDK v3.2 — Compose module
 * Create compound engines by combining multiple engines with merge, chain, or vote strategies.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

// ── Public interfaces ────────────────────────────────────────────────────────

/** Configuration for the ComposeClient */
export interface ComposeConfig {
  /** SDK Gateway base URL. Defaults to https://echo-sdk-gateway.bmcii1976.workers.dev */
  baseUrl?: string;
  /** Echo API key for authentication */
  apiKey: string;
}

/** A compound engine composed of multiple individual engines */
export interface CompoundEngine {
  /** Unique compound engine identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Optional description of what this compound engine does */
  description?: string;
  /** List of constituent engine IDs */
  engines: string[];
  /** Composition strategy:
   * - 'merge': Combine outputs into a unified response
   * - 'chain': Feed output of each engine into the next sequentially
   * - 'vote': Run all engines and select the best response by consensus
   */
  strategy: 'merge' | 'chain' | 'vote';
  /** ISO timestamp of creation */
  created_at: string;
  /** Total number of queries served by this compound engine */
  query_count: number;
}

// ── Client implementation ────────────────────────────────────────────────────

/**
 * SDK client for engine composition — combine multiple intelligence engines
 * into compound engines using merge, chain, or vote strategies.
 *
 * @example
 * ```ts
 * const compose = new ComposeClient({ apiKey: 'my-key' });
 *
 * // Create a compound engine that chains tax + legal analysis
 * const compound = await compose.create(
 *   ['tax-depreciation-v3', 'legal-contracts-v2'],
 *   'tax-legal-combo',
 *   { strategy: 'chain', description: 'Tax analysis followed by legal review' }
 * );
 *
 * // Query the compound engine
 * const result = await compose.query(compound.id, 'Analyze 1031 exchange requirements');
 *
 * // Create a voting ensemble for higher accuracy
 * const ensemble = await compose.create(
 *   ['tax-v1', 'tax-v2', 'tax-v3'],
 *   'tax-ensemble',
 *   { strategy: 'vote', description: 'Best-of-3 tax engine ensemble' }
 * );
 * ```
 */
export class ComposeClient {
  private client: EchoHttpClient;

  constructor(config: ComposeConfig) {
    const clientConfig: EchoClientConfig = {
      apiKey: config.apiKey,
      gatewayUrl: config.baseUrl,
    };
    this.client = new EchoHttpClient(clientConfig);
  }

  /**
   * Create a new compound engine from multiple individual engines.
   *
   * @param engines - Array of engine IDs to compose together
   * @param name - Human-readable name for the compound engine
   * @param options - Optional configuration:
   *   - description: What this compound engine does
   *   - strategy: How to combine engine outputs ('merge' | 'chain' | 'vote'). Default: 'merge'
   * @returns The created compound engine object
   *
   * @example
   * ```ts
   * const compound = await compose.create(
   *   ['security-vuln-scanner', 'security-code-review', 'security-compliance'],
   *   'full-security-audit',
   *   { strategy: 'chain', description: 'Full security pipeline' }
   * );
   * ```
   */
  async create(
    engines: string[],
    name: string,
    options?: { description?: string; strategy?: 'merge' | 'chain' | 'vote' },
  ): Promise<CompoundEngine> {
    const body: Record<string, unknown> = {
      engines,
      name,
      strategy: options?.strategy || 'merge',
    };
    if (options?.description !== undefined) {
      body.description = options.description;
    }

    return this.client.request<CompoundEngine>('/compose/create', {
      method: 'POST',
      body,
    });
  }

  /**
   * Get details of a compound engine by ID.
   * @param id - Compound engine ID
   * @returns Compound engine details including constituent engines and query count
   */
  async get(id: string): Promise<CompoundEngine> {
    return this.client.request<CompoundEngine>(`/compose/${encodeURIComponent(id)}`);
  }

  /**
   * Delete a compound engine.
   * This does not delete the constituent engines — only the composition.
   * @param id - Compound engine ID to delete
   */
  async delete(id: string): Promise<void> {
    await this.client.request<void>(`/compose/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Query a compound engine. The query is processed according to the
   * compound engine's strategy:
   * - **merge**: All engines process in parallel, results are merged
   * - **chain**: Engines process sequentially, each receiving the previous output
   * - **vote**: All engines process in parallel, best response is selected
   *
   * @param id - Compound engine ID to query
   * @param query - Natural language query
   * @param mode - Optional processing mode override
   * @returns Query result (format depends on the compound engine's strategy)
   *
   * @example
   * ```ts
   * const result = await compose.query(
   *   'tax-legal-combo',
   *   'What are the tax implications of a Delaware LLC?'
   * );
   * ```
   */
  async query(id: string, query: string, mode?: string): Promise<unknown> {
    const body: Record<string, unknown> = { query };
    if (mode !== undefined) {
      body.mode = mode;
    }

    return this.client.request<unknown>(`/compose/${encodeURIComponent(id)}/query`, {
      method: 'POST',
      body,
    });
  }

  /**
   * List all compound engines for the authenticated account.
   * @returns Array of compound engine objects
   *
   * @example
   * ```ts
   * const compounds = await compose.list();
   * for (const c of compounds) {
   *   console.log(`${c.name}: ${c.engines.length} engines, ${c.strategy} strategy`);
   * }
   * ```
   */
  async list(): Promise<CompoundEngine[]> {
    return this.client.request<CompoundEngine[]>('/compose/list');
  }
}

export { ComposeClient as default };
