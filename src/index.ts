/** Echo Prime SDK v3.1 — Main entry point
 * 30 modules, zero external dependencies, tree-shakeable.
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
import { EchoMegaGateway } from './mega-gateway.js';
import { EchoGraphRAG } from './graph-rag.js';
import { EchoSwarm } from './swarm.js';
import { EchoDarkweb } from './darkweb.js';
import { EchoCrypto } from './crypto.js';
import { EchoNews } from './news.js';
import { EchoSECEdgar } from './sec-edgar.js';
import { EchoReddit } from './reddit.js';
import { EchoPriceAlerts } from './price-alerts.js';
import { EchoLandman } from './landman.js';
import { EchoModelHost } from './model-host.js';
import { EchoHarvester } from './harvester.js';
import { EchoScanner } from './scanner.js';
import { EchoWorkflows } from './workflows.js';
import { EchoNotifications } from './notifications.js';
import { EchoFleet } from './fleet.js';
import { EchoMemoryPrime } from './memory-prime.js';
import { EchoAutonomous } from './autonomous.js';
import type { HealthStatus, SearchResult } from './types.js';

/** Unified Echo Prime SDK client — all 30 modules in one object */
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
  readonly megaGateway: EchoMegaGateway;
  readonly graphRag: EchoGraphRAG;
  readonly swarm: EchoSwarm;
  readonly darkweb: EchoDarkweb;
  readonly crypto: EchoCrypto;
  readonly news: EchoNews;
  readonly secEdgar: EchoSECEdgar;
  readonly reddit: EchoReddit;
  readonly priceAlerts: EchoPriceAlerts;
  readonly landman: EchoLandman;
  readonly modelHost: EchoModelHost;
  readonly harvester: EchoHarvester;
  readonly scanner: EchoScanner;
  readonly workflows: EchoWorkflows;
  readonly notifications: EchoNotifications;
  readonly fleet: EchoFleet;
  readonly memoryPrime: EchoMemoryPrime;
  readonly autonomous: EchoAutonomous;

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
    this.megaGateway = new EchoMegaGateway(config);
    this.graphRag = new EchoGraphRAG(config);
    this.swarm = new EchoSwarm(config);
    this.darkweb = new EchoDarkweb(config);
    this.crypto = new EchoCrypto(config);
    this.news = new EchoNews(config);
    this.secEdgar = new EchoSECEdgar(config);
    this.reddit = new EchoReddit(config);
    this.priceAlerts = new EchoPriceAlerts(config);
    this.landman = new EchoLandman(config);
    this.modelHost = new EchoModelHost(config);
    this.harvester = new EchoHarvester(config);
    this.scanner = new EchoScanner(config);
    this.workflows = new EchoWorkflows(config);
    this.notifications = new EchoNotifications(config);
    this.fleet = new EchoFleet(config);
    this.memoryPrime = new EchoMemoryPrime(config);
    this.autonomous = new EchoAutonomous(config);
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
export { EchoMegaGateway } from './mega-gateway.js';
export { EchoGraphRAG } from './graph-rag.js';
export { EchoSwarm } from './swarm.js';
export { EchoDarkweb } from './darkweb.js';
export { EchoCrypto } from './crypto.js';
export { EchoNews } from './news.js';
export { EchoSECEdgar } from './sec-edgar.js';
export { EchoReddit } from './reddit.js';
export { EchoPriceAlerts } from './price-alerts.js';
export { EchoLandman } from './landman.js';
export { EchoModelHost } from './model-host.js';
export { EchoHarvester } from './harvester.js';
export { EchoScanner } from './scanner.js';
export { EchoWorkflows } from './workflows.js';
export { EchoNotifications } from './notifications.js';
export { EchoFleet } from './fleet.js';
export { EchoMemoryPrime } from './memory-prime.js';
export { EchoAutonomous } from './autonomous.js';

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
export type { GatewayCategory, GatewayServer, GatewayTool, GatewayExecResult, GatewayStats } from './mega-gateway.js';
export type { GraphNode, GraphEdge, GraphPath, GraphSearchResult, GraphStats } from './graph-rag.js';
export type { MoltMood, MoltPost, SwarmAgent, SwarmTask, BroadcastMessage, SwarmStats } from './swarm.js';
export type { ThreatSeverity, ThreatCategory, DarkwebThreat, DarkwebAlert, BreachResult, DarkwebIntel, DarkwebStats } from './darkweb.js';
export type { TradingStrategy, OrderSide, OrderStatus, TradingPair, TradeOrder, StrategyConfig, PortfolioPosition, CryptoStats } from './crypto.js';
export type { NewsSentiment, NewsSource, NewsArticle, NewsTopic, NewsAlert, NewsStats } from './news.js';
export type { FilingType, SECFiling, WatchlistCompany, SECAlert, SECStats } from './sec-edgar.js';
export type { RedditPostType, RedditPost, SubredditWatch, RedditAlert, RedditStats } from './reddit.js';
export type { AlertCondition, AssetType, PriceAlert, PriceSnapshot, AlertHistory, PriceAlertStats } from './price-alerts.js';
export type { InvestigationStatus, DeedType, TitleInvestigation, DeedRecord, ChainOfTitle, Runsheet, LandmanStats } from './landman.js';
export type { ModelAdapter, InferenceRequest, InferenceResponse, ModelStats } from './model-host.js';
export type { SourceType, HarvestStatus, HarvestSource, HarvestItem, DiscoveryReport, HarvesterStats } from './harvester.js';
export type { ScrapeStatus, ScanJob, ScannedDocument, CountyStatus, ScannerStats } from './scanner.js';
export type { WorkflowStatus, StepStatus, Workflow, WorkflowStep, WorkflowRun, CronJob, WorkflowStats } from './workflows.js';
export type { NotificationChannel, NotificationPriority, NotificationStatus, Notification, NotificationRule, NotificationStats } from './notifications.js';
export type { WorkerStatus, FleetWorker, FleetDeployment, ServiceRegistration, FleetStats } from './fleet.js';
export type { MemoryPillar, MemoryEntry, MemorySearchResult, MemoryPillarStats, MemoryStats } from './memory-prime.js';
export type { DaemonTaskStatus, HealthGrade, DaemonStatus, AutoTask, DetectedPattern, WorkerHealthReport, DaemonStats } from './autonomous.js';

export default EchoPrime;
