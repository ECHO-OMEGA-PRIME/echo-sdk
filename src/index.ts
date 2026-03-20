/** Echo Prime SDK v3.0 — Main entry point */
import type { EchoConfig, HealthStatus, ChatResponse, SearchResult } from './types.js';
import { EchoHttpClient } from './client.js';
import { EchoEngines } from './engines.js';
import { EchoKnowledge } from './knowledge.js';
import { EchoBrain } from './brain.js';
import { EchoDoctrine } from './doctrine.js';

/** Unified Echo Prime SDK client */
export class EchoPrime {
  readonly engines: EchoEngines;
  readonly knowledge: EchoKnowledge;
  readonly brain: EchoBrain;
  readonly doctrine: EchoDoctrine;

  private client: EchoHttpClient;

  constructor(config: EchoConfig) {
    this.client = new EchoHttpClient(config);
    this.engines = new EchoEngines(config);
    this.knowledge = new EchoKnowledge(config);
    this.brain = new EchoBrain(config);
    this.doctrine = new EchoDoctrine(config);
  }

  /** Chat with an AI personality */
  async chat(message: string, personality?: string): Promise<ChatResponse> {
    return this.client.request<ChatResponse>('/chat', {
      method: 'POST',
      body: { message, ...(personality ? { personality } : {}) },
    });
  }

  /** Unified search across engines, knowledge, and brain */
  async search(query: string, sources?: string[], limit = 10): Promise<SearchResult[]> {
    return this.client.request<SearchResult[]>('/search', {
      method: 'POST',
      body: { query, sources, limit },
    });
  }

  /** Gateway health check */
  async health(): Promise<HealthStatus> {
    return this.client.request<HealthStatus>('/health');
  }
}

// Re-export everything
export { EchoEngines } from './engines.js';
export { EchoKnowledge } from './knowledge.js';
export { EchoBrain } from './brain.js';
export { EchoDoctrine } from './doctrine.js';
export { EchoHttpClient } from './client.js';
export type {
  EchoConfig,
  ApiEnvelope,
  EngineQueryResult,
  EngineInfo,
  KnowledgeResult,
  BrainMemory,
  DoctrineBlock,
  ChatResponse,
  SearchResult,
  ToolInfo,
  ToolChain,
  HealthStatus,
} from './types.js';
export { EchoError } from './types.js';

export default EchoPrime;
