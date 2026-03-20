/** Echo Prime SDK v3.0 — Type definitions */

export interface EchoConfig {
  apiKey: string;
  gatewayUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data: T | null;
  error: { message: string; code: string } | null;
  meta: { ts: string; version: string; service: string; latency_ms?: number };
}

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

export interface ToolInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  tier: string;
  popularity_score: number;
}

export interface ToolChain {
  id: string;
  name: string;
  description: string;
  tools: string[];
  use_case: string;
}

export interface HealthStatus {
  status: string;
  version: string;
  services: number;
  uptime_ms: number;
}

export class EchoError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'EchoError';
    this.code = code;
    this.status = status;
  }
}
