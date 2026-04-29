/** Echo Prime SDK v3.2 — Forge module
 * Build engines, doctrines, apps, workers, and more through the Forge pipeline.
 * Supports Hephaestion, Daedalus, and Forge-X build systems.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

// ── Public interfaces ────────────────────────────────────────────────────────

/** Configuration for the ForgeClient */
export interface ForgeConfig {
  /** SDK Gateway base URL. Defaults to https://echo-sdk-gateway.bmcii1976.workers.dev */
  baseUrl?: string;
  /** Echo API key for authentication */
  apiKey: string;
}

/** Result from a single forge build operation */
export interface BuildResult {
  /** Whether the build succeeded */
  ok: boolean;
  /** Which forge handled the build */
  forge: string;
  /** Build output data */
  data: unknown;
  /** Build latency in milliseconds */
  latency_ms: number;
}

/** State snapshot of engine evolution across forges */
export interface EvolutionState {
  /** Per-forge evolution data */
  forges: Record<string, { ok: boolean; data: unknown; latency_ms?: number }>;
  /** ISO timestamp of the snapshot */
  timestamp: string;
  /** Number of forges in the evolution state */
  forge_count: number;
}

/** Health status of all forge subsystems */
export interface ForgeStatus {
  /** Per-forge health data */
  forges: Record<string, { status: string; latency_ms?: number; data?: unknown }>;
  /** Aggregate summary counts */
  summary: { total: number; healthy: number; unhealthy: number };
}

/** Result from a full-stack multi-stage pipeline build */
export interface FullStackResult {
  /** Pipeline identifier */
  pipeline: string;
  /** Ordered list of stage names */
  stages: string[];
  /** Per-stage results in execution order */
  results: Array<{ stage: string; ok: boolean; data: unknown; latency_ms: number }>;
}

// ── Client implementation ────────────────────────────────────────────────────

/**
 * SDK client for forge operations — build engines, doctrines, apps, workers,
 * and orchestrate full-stack pipelines through the Echo Forge subsystem.
 *
 * @example
 * ```ts
 * const forge = new ForgeClient({ apiKey: 'my-key' });
 *
 * // Build an engine
 * const result = await forge.engine({ domain: 'tax', name: 'IRS-Analyzer' });
 *
 * // Run a full-stack pipeline
 * const stack = await forge.fullStack(
 *   ['doctrine', 'engine', 'knowledge'],
 *   { domain: 'legal', topic: 'contract-analysis' }
 * );
 * ```
 */
export class ForgeClient {
  private client: EchoHttpClient;

  constructor(config: ForgeConfig) {
    const clientConfig: EchoClientConfig = {
      apiKey: config.apiKey,
      gatewayUrl: config.baseUrl,
    };
    this.client = new EchoHttpClient(clientConfig);
  }

  // ── Build methods ────────────────────────────────────────────────────────

  /**
   * Build a new intelligence engine.
   * @param spec - Engine specification (domain, name, doctrines, etc.)
   * @returns Build result with the created engine data
   */
  async engine(spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/engine', {
      method: 'POST',
      body: spec,
    });
  }

  /**
   * Build a new doctrine block.
   * @param spec - Doctrine specification (domain, topic, content, authority_level, etc.)
   * @returns Build result with the created doctrine data
   */
  async doctrine(spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/doctrine', {
      method: 'POST',
      body: spec,
    });
  }

  /**
   * Build a new application of the specified type.
   * @param type - Application type (e.g. 'web', 'api', 'mobile', 'cli')
   * @param spec - Application specification
   * @returns Build result with the created application data
   */
  async app(type: string, spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/app', {
      method: 'POST',
      body: { type, ...spec },
    });
  }

  /**
   * Build a new Cloudflare Worker.
   * @param name - Worker name (used as the subdomain)
   * @param spec - Worker specification (routes, bindings, code, etc.)
   * @returns Build result with the deployed worker data
   */
  async worker(name: string, spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/worker', {
      method: 'POST',
      body: { name, ...spec },
    });
  }

  /**
   * Generate an optimized prompt template for a given domain and task.
   * @param domain - Knowledge domain (e.g. 'tax', 'legal', 'security')
   * @param task - Task description for the prompt
   * @returns Build result with the generated prompt template
   */
  async prompt(domain: string, task: string): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/prompt', {
      method: 'POST',
      body: { domain, task },
    });
  }

  /**
   * Ingest knowledge documents into the knowledge forge.
   * @param docs - Array of documents with title, content, and category
   * @returns Build result with ingestion statistics
   */
  async knowledge(docs: Array<{ title: string; content: string; category: string }>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/knowledge', {
      method: 'POST',
      body: { docs },
    });
  }

  /**
   * Build using the Hephaestion Forge — advanced engine construction with
   * automatic doctrine generation, testing, and deployment.
   * @param spec - Hephaestion build specification
   * @returns Build result from Hephaestion
   */
  async hephaestion(spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/hephaestion', {
      method: 'POST',
      body: spec,
    });
  }

  /**
   * Build using the Daedalus Forge — experimental/prototype builds with
   * rapid iteration and automatic versioning.
   * @param spec - Daedalus build specification
   * @returns Build result from Daedalus
   */
  async daedalus(spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/daedalus', {
      method: 'POST',
      body: spec,
    });
  }

  /**
   * Build using Forge-X — cross-platform builds that span multiple
   * forge subsystems with unified orchestration.
   * @param spec - Forge-X build specification
   * @returns Build result from Forge-X
   */
  async forgeX(spec: Record<string, unknown>): Promise<BuildResult> {
    return this.client.request<BuildResult>('/forge/forge-x', {
      method: 'POST',
      body: spec,
    });
  }

  // ── Orchestration ────────────────────────────────────────────────────────

  /**
   * Execute a full-stack pipeline across multiple forge stages.
   * Stages execute in order; each stage receives the output of the previous.
   *
   * @param stages - Ordered list of stage names (e.g. ['doctrine', 'engine', 'knowledge'])
   * @param payload - Initial payload passed to the first stage
   * @returns Results from all pipeline stages
   *
   * @example
   * ```ts
   * const result = await forge.fullStack(
   *   ['doctrine', 'engine', 'prompt'],
   *   { domain: 'tax', topic: 'depreciation' }
   * );
   * console.log(result.results.map(r => `${r.stage}: ${r.ok}`));
   * ```
   */
  async fullStack(stages: string[], payload: Record<string, unknown>): Promise<FullStackResult> {
    return this.client.request<FullStackResult>('/forge/full-stack', {
      method: 'POST',
      body: { stages, payload },
    });
  }

  // ── Status & Evolution ───────────────────────────────────────────────────

  /**
   * Get health status of all forge subsystems.
   * @returns Per-forge status and aggregate summary
   */
  async status(): Promise<ForgeStatus> {
    return this.client.request<ForgeStatus>('/forge/status');
  }

  /**
   * Get the evolution state of forges — tracks improvements, retraining,
   * and performance trends over time.
   * @param forgeId - Optional forge ID to get evolution for a specific forge.
   *                  If omitted, returns evolution state for all forges.
   * @returns Evolution state snapshot
   */
  async evolution(forgeId?: string): Promise<EvolutionState | unknown> {
    const params: Record<string, string> = {};
    if (forgeId) {
      params.forge_id = forgeId;
    }
    return this.client.request<EvolutionState>('/forge/evolution', {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  }
}

export { ForgeClient as default };
