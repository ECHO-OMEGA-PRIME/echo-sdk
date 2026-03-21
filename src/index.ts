/** Echo Prime SDK v3.0 — Main entry point
 * 16 modules, zero external dependencies, tree-shakeable.
 * https://echo-ept.com/sdk
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';
import { EchoEngines } from './engines.js';
import { EchoKnowledge } from './knowledge.js';
import { EchoBrain } from './brain.js';
import { EchoDoctrine } from './doctrine.js';
import { EchoVoice } from './voice.js';
import { EchoChat } from './chat.js';
import { EchoVault } from './vault.js';
import { EchoTools } from './tools.js';
import { EchoMonitor } from './monitoring.js';
import { EchoAgent } from './agent.js';
import { EchoScraper } from './scraper.js';
import { EchoBot } from './bot.js';
import type { HealthStatus, SearchResult } from './types.js';

/** Unified Echo Prime SDK client — all 16 modules in one object */
export class EchoPrime {
  readonly engines: EchoEngines;
  readonly knowledge: EchoKnowledge;
  readonly brain: EchoBrain;
  readonly doctrine: EchoDoctrine;
  readonly voice: EchoVoice;
  readonly chat: EchoChat;
  readonly vault: EchoVault;
  readonly tools: EchoTools;
  readonly monitor: EchoMonitor;
  readonly agent: EchoAgent;
  readonly scraper: EchoScraper;
  readonly bot: EchoBot;

  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
    this.engines = new EchoEngines(config);
    this.knowledge = new EchoKnowledge(config);
    this.brain = new EchoBrain(config);
    this.doctrine = new EchoDoctrine(config);
    this.voice = new EchoVoice(config);
    this.chat = new EchoChat(config);
    this.vault = new EchoVault(config);
    this.tools = new EchoTools(config);
    this.monitor = new EchoMonitor();
    this.agent = new EchoAgent(config);
    this.scraper = new EchoScraper(config);
    this.bot = new EchoBot(config);
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

  /** Get circuit breaker state */
  getCircuitState() {
    return this.client.getCircuitState();
  }

  /** Clear response cache */
  clearCache() {
    this.client.clearCache();
  }

  /** Reset circuit breaker */
  resetCircuit() {
    this.client.resetCircuit();
  }
}

// ── Module classes ──────────────────────────────────────────────────
export { EchoEngines } from './engines.js';
export { EchoKnowledge } from './knowledge.js';
export { EchoBrain } from './brain.js';
export { EchoDoctrine } from './doctrine.js';
export { EchoVoice } from './voice.js';
export { EchoChat } from './chat.js';
export { EchoVault } from './vault.js';
export { EchoTools } from './tools.js';
export { EchoMonitor } from './monitoring.js';
export { EchoAgent } from './agent.js';
export { EchoScraper } from './scraper.js';
export { EchoBot } from './bot.js';

// ── Infrastructure ──────────────────────────────────────────────────
export { EchoHttpClient } from './client.js';
export type { EchoClientConfig, ApiEnvelope, RequestOptions, LogEntry } from './client.js';
export { EchoError, AuthError, RateLimitError, TimeoutError, NetworkError, ValidationError, NotFoundError, CircuitOpenError, ServerError, isRetryableStatus, isRetryableError, normalizeError } from './errors.js';
export { CircuitBreaker } from './circuit-breaker.js';
export type { CircuitBreakerConfig } from './circuit-breaker.js';
export { EchoCache, cacheKey } from './cache.js';
export type { CacheConfig } from './cache.js';
export { redact, validateApiKey, validatePayloadSize, sanitizeInput, maskKey, timingSafeEqual, safeHeaders } from './security.js';

// ── Data types (all from types.ts) ──────────────────────────────────
export type {
  EchoConfig,
  EngineQueryResult,
  EngineInfo,
  KnowledgeResult,
  BrainMemory,
  DoctrineBlock,
  ChatResponse,
  SearchResult,
  HealthStatus,
} from './types.js';

// ── Module-specific types ───────────────────────────────────────────
export type { VoiceId, Emotion, SynthesizeOptions, TranscribeOptions, VoiceInfo, EmotionAnalysis } from './voice.js';
export type { Personality, ChatMessage, ChatOptions, ChatResponse as ChatModuleResponse, ConversationSession } from './chat.js';
export type { Credential, CredentialWithSecret, VaultStats, HealthScore } from './vault.js';
export type { ToolInfo, ToolCategory, ToolChain, ToolExecutionResult } from './tools.js';
export type { RequestMetric, MetricsSummary } from './monitoring.js';
export type { AgentConfig, AgentRun, AgentInfo } from './agent.js';
export type { ScraperConfig, ScraperJob, ScraperInfo, ScrapedRecord } from './scraper.js';
export type { BotPlatform, BotConfig, BotInfo, BotPost, BotStats } from './bot.js';

export default EchoPrime;
