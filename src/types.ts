/** Echo Prime SDK v3.0 — Type definitions
 * Shared interfaces used across SDK modules.
 * Zero external dependencies.
 */
import type { EchoClientConfig } from './client.js';

/** @deprecated Use EchoClientConfig from './client.js' instead */
export type EchoConfig = EchoClientConfig;
export type { EchoClientConfig };

export interface EngineQueryResult {
  engine_id: string;
  domain: string;
  response: string;
  confidence: number;
  doctrines_matched: number;
  latency_ms: number;
  determinism_hash?: string;
}

export interface EngineInfo {
  engine_id: string;
  domain: string;
  name: string;
  description: string;
  doctrine_count: number;
  status: string;
}

export interface KnowledgeResult {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance_score: number;
  source?: string;
}

export interface BrainMemory {
  id: string;
  content: string;
  importance: number;
  tags: string[];
  created_at: string;
  instance_id?: string;
}

export interface DoctrineBlock {
  id: string;
  domain: string;
  topic: string;
  content: string;
  authority_level: number;
  confidence: string;
  provider: string;
  created_at: string;
}

export interface ChatResponse {
  message: string;
  personality: string;
  tokens_used: number;
  model: string;
}

export interface SearchResult {
  source: string;
  results: Array<Record<string, unknown>>;
  count: number;
}

export interface HealthStatus {
  status: string;
  version: string;
  services: number;
  uptime_ms: number;
}
