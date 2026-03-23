# Echo Prime SDK -- Full API Reference

Complete method signatures for all 36 modules in the Echo Prime TypeScript SDK v3.2.

**Gateway URL:** `https://echo-sdk-gateway.bmcii1976.workers.dev`
**npm:** `@echo-omega-prime/sdk`

---

## Table of Contents

- [EchoPrime (Main Client)](#echoprime-main-client)
- [EchoHttpClient (HTTP Layer)](#echohttpclient-http-layer)
- [EchoEngines](#echoengines)
- [EchoKnowledge](#echoknowledge)
- [EchoBrain](#echobrain)
- [EchoDoctrine](#echodoctrine)
- [EchoVoice](#echovoice)
- [EchoChat](#echochat)
- [EchoVault](#echovault)
- [EchoTools](#echotools)
- [EchoMonitor](#echomonitor)
- [EchoAgent](#echoagent)
- [EchoScraper](#echoscraper)
- [EchoBot](#echobot)
- [EchoMegaGateway](#echomegagateway)
- [EchoGraphRAG](#echographrag)
- [EchoSwarm](#echoswarm)
- [EchoDarkweb](#echodarkweb)
- [EchoCrypto](#echocrypto)
- [EchoNews](#echonews)
- [EchoSECEdgar](#echosecedgar)
- [EchoReddit](#echoreddit)
- [EchoPriceAlerts](#echopricealerts)
- [EchoLandman](#echolandman)
- [EchoModelHost](#echomodelhost)
- [EchoHarvester](#echoharvester)
- [EchoScanner](#echoscanner)
- [EchoWorkflows](#echoworkflows)
- [EchoNotifications](#echonotifications)
- [EchoFleet](#echofleet)
- [EchoMemoryPrime](#echomemoryprime)
- [EchoAutonomous](#echoautonomous)
- [EchoSdkCatalog](#echosdkcatalog)
- [ForgeClient](#forgeclient)
- [LLMClient](#llmclient)
- [WebhookClient](#webhookclient)
- [AGIClient](#agiclient)
- [ComposeClient](#composeclient)
- [Error Classes](#error-classes)

---

## EchoPrime (Main Client)

The unified entry point for all 36 modules. Instantiate once and access every module through properties.

```typescript
import EchoPrime from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new EchoPrime(config: EchoClientConfig)
```

**EchoClientConfig:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | -- | Echo Prime API key (8-256 characters) |
| `gatewayUrl` | `string` | No | `https://echo-sdk-gateway.bmcii1976.workers.dev` | Gateway base URL |
| `timeout` | `number` | No | `30000` | Request timeout in ms |
| `retries` | `number` | No | `2` | Number of retries on failure |
| `circuitBreaker` | `CircuitBreakerConfig` | No | defaults | Circuit breaker configuration |
| `cache` | `CacheConfig \| false` | No | defaults | Caching config, or `false` to disable |
| `logger` | `(entry: LogEntry) => void` | No | no-op | Structured log handler |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `engines` | `EchoEngines` | Intelligence engine queries |
| `knowledge` | `EchoKnowledge` | Knowledge Forge search and ingestion |
| `brain` | `EchoBrain` | Shared Brain memory |
| `doctrine` | `EchoDoctrine` | Doctrine generation |
| `voice` | `EchoVoice` | Voice synthesis and transcription |
| `chat` | `EchoChat` | AI chat with personalities |
| `vault` | `EchoVault` | Credential management |
| `tools` | `EchoTools` | MCP tool discovery and execution |
| `monitor` | `EchoMonitor` | Request metrics and monitoring |
| `agent` | `EchoAgent` | Autonomous agent builder |
| `scraper` | `EchoScraper` | Web scraper factory |
| `bot` | `EchoBot` | Social media bot factory |
| `megaGateway` | `EchoMegaGateway` | MEGA Gateway (37K+ tools) |
| `graphRag` | `EchoGraphRAG` | Knowledge graph |
| `swarm` | `EchoSwarm` | Swarm coordination and MoltBook |
| `darkweb` | `EchoDarkweb` | Dark web intelligence |
| `crypto` | `EchoCrypto` | Crypto trading |
| `news` | `EchoNews` | News aggregation |
| `secEdgar` | `EchoSECEdgar` | SEC filing monitoring |
| `reddit` | `EchoReddit` | Reddit monitoring |
| `priceAlerts` | `EchoPriceAlerts` | Price alert management |
| `landman` | `EchoLandman` | Landman pipeline |
| `modelHost` | `EchoModelHost` | Model hosting |
| `harvester` | `EchoHarvester` | Knowledge harvester |
| `scanner` | `EchoScanner` | County record scanner |
| `workflows` | `EchoWorkflows` | Workflow orchestration |
| `notifications` | `EchoNotifications` | Multi-channel notifications |
| `fleet` | `EchoFleet` | Fleet management |
| `memoryPrime` | `EchoMemoryPrime` | 9-pillar memory archive |
| `autonomous` | `EchoAutonomous` | Autonomous daemon |
| `sdkCatalog` | `EchoSdkCatalog` | SDK method catalog |
| `forge` | `ForgeClient` | Forge build system |
| `llm` | `LLMClient` | LLM completions |
| `webhooks` | `WebhookClient` | Webhook management |
| `agi` | `AGIClient` | AGI self-improvement |
| `compose` | `ComposeClient` | Engine composition |

### Methods

```typescript
search(query: string, sources?: string[], limit?: number): Promise<SearchResult[]>
```
Unified search across engines, knowledge, and brain.

```typescript
health(): Promise<HealthStatus>
```
Gateway health check. Returns `{ status, version, services, uptime_ms }`.

```typescript
getCircuitState(): CircuitBreakerInfo
```
Get current circuit breaker state.

```typescript
clearCache(): void
```
Clear all cached responses.

```typescript
resetCircuit(): void
```
Reset circuit breaker to CLOSED state.

---

## EchoHttpClient (HTTP Layer)

Low-level HTTP client with retry, circuit breaker, caching, and timing-safe auth. All modules use this internally.

```typescript
import { EchoHttpClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new EchoHttpClient(config: EchoClientConfig)
```

### Methods

```typescript
request<T>(path: string, opts?: RequestOptions): Promise<T>
```
Make an authenticated request with retry, circuit breaker, and caching.

**RequestOptions:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'GET'` | HTTP method |
| `body` | `Record<string, unknown>` | -- | Request body (for POST/PUT) |
| `params` | `Record<string, string>` | -- | Query parameters |
| `timeout` | `number` | client default | Per-request timeout in ms |
| `cacheTtlMs` | `number` | `60000` for GET, `0` for mutations | Cache TTL in ms |
| `signal` | `AbortSignal` | -- | External abort signal |

```typescript
getCircuitState(): CircuitBreakerInfo
```

```typescript
getCache(): EchoCache | null
```

```typescript
clearCache(): void
```

```typescript
resetCircuit(): void
```

---

## EchoEngines

Query 2,600+ intelligence engines across 210+ domains.

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
query(question: string, domain?: string): Promise<EngineQueryResult>
```
Query engines with a natural language question. Returns `{ engine_id, domain, response, confidence, doctrines_matched, latency_ms, determinism_hash? }`.

```typescript
queryBatch(queries: Array<{ query: string; domain?: string }>): Promise<EngineQueryResult[]>
```
Batch query multiple questions in a single request.

```typescript
list(domain?: string): Promise<EngineInfo[]>
```
List all available engines, optionally filtered by domain. Returns `{ engine_id, domain, name, description, doctrine_count, status }[]`.

```typescript
search(query: string, limit?: number): Promise<EngineInfo[]>
```
Search engines by keyword. Default limit: 10.

```typescript
metadata(engineId: string): Promise<EngineInfo>
```
Get engine metadata by ID.

```typescript
capabilities(engineId: string): Promise<Record<string, unknown>>
```
Get engine capabilities.

```typescript
status(): Promise<Record<string, unknown>>
```
Engine runtime status.

---

## EchoKnowledge

Search and ingest 5,300+ documents across 140+ categories.

```typescript
import { EchoKnowledge } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, limit?: number): Promise<KnowledgeResult[]>
```
Search the Knowledge Forge. Default limit: 5. Returns `{ id, title, content, category, relevance_score, source? }[]`.

```typescript
categories(): Promise<Array<{ id: string; name: string; doc_count: number }>>
```
List knowledge categories.

```typescript
ingest(title: string, content: string, category: string): Promise<{ id: string }>
```
Ingest a document into the Knowledge Forge.

---

## EchoBrain

Infinite cross-session memory via semantic search.

```typescript
import { EchoBrain } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
ingest(content: string, importance?: number, tags?: string[]): Promise<{ id: string }>
```
Store a memory. Default importance: 5.

```typescript
search(query: string, limit?: number): Promise<BrainMemory[]>
```
Semantic search across all memories. Default limit: 10. Returns `{ id, content, importance, tags, created_at, instance_id? }[]`.

```typescript
recall(key: string): Promise<BrainMemory | null>
```
Recall a specific memory by key.

```typescript
store(key: string, value: Record<string, unknown>): Promise<{ success: boolean }>
```
Store a key-value memory.

```typescript
stats(): Promise<Record<string, unknown>>
```
Get brain statistics.

---

## EchoDoctrine

Generate domain-specific doctrine blocks via 24 FREE LLM providers.

```typescript
import { EchoDoctrine } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
generate(domain: string, topic: string, provider?: string): Promise<{ doctrines: DoctrineBlock[]; provider_used: string }>
```
Generate doctrine blocks. Returns `{ doctrines: [{ id, domain, topic, content, authority_level, confidence, provider, created_at }], provider_used }`.

```typescript
list(domain?: string): Promise<DoctrineBlock[]>
```
List doctrines, optionally filtered by domain.

```typescript
providers(): Promise<Array<{ id: string; name: string; status: string }>>
```
Get available LLM providers (all FREE).

```typescript
search(query: string, domain?: string, limit?: number): Promise<DoctrineBlock[]>
```
Search doctrines by keyword. Default limit: 10.

---

## EchoVoice

TTS synthesis, STT transcription, voice cloning, emotion tags.

```typescript
import { EchoVoice } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type VoiceId = 'echo' | 'bree' | 'gs343' | 'prometheus' | 'phoenix' | 'commander' | string;

type Emotion = 'laughs' | 'whispers' | 'sighs' | 'sarcastic' | 'excited'
  | 'crying' | 'curious' | 'angry' | 'neutral' | 'warm' | 'stern' | 'playful';

interface SynthesizeOptions {
  voice?: VoiceId;       // default: 'echo'
  emotion?: Emotion;     // default: none
  format?: 'mp3' | 'wav' | 'ogg'; // default: 'mp3'
  speed?: number;        // default: 1.0
}

interface TranscribeOptions {
  language?: string;     // ISO 639-1, default: 'en'
}
```

### Methods

```typescript
synthesize(text: string, opts?: SynthesizeOptions): Promise<ArrayBuffer>
```
Synthesize text to speech. Returns audio as ArrayBuffer.

```typescript
transcribe(audioBase64: string, opts?: TranscribeOptions): Promise<{ text: string; confidence: number; language: string }>
```
Transcribe audio to text (STT).

```typescript
analyzeEmotion(text: string, personality?: string): Promise<EmotionAnalysis>
```
Analyze emotion in text. Returns `{ dominant_emotion, confidence, layers }`.

```typescript
applyEmotionTags(text: string, personality?: string): Promise<{ text: string; tags_applied: string[] }>
```
Apply emotion tags to text for TTS.

```typescript
orchestrate(text: string, voice?: VoiceId, opts?: { emotion?: Emotion; priority?: 'quality' | 'speed' | 'cost' }): Promise<ArrayBuffer>
```
Orchestrated TTS with quota-aware provider blending.

```typescript
listVoices(): Promise<VoiceInfo[]>
```
List available voices. Returns `{ id, name, description, gender, engine }[]`.

```typescript
cloneVoice(name: string, samplesBase64: string[], description?: string): Promise<{ voice_id: string; name: string }>
```
Clone a voice from audio samples.

```typescript
prepareText(text: string): Promise<{ text: string; changes: string[] }>
```
Prepare text for TTS (strip markdown, expand abbreviations).

---

## EchoChat

Conversational AI with 14 personalities and session management.

```typescript
import { EchoChat } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type Personality = 'echo_prime' | 'bree' | 'raven' | 'sage' | 'thinker' | 'nexus' | 'gs343'
  | 'phoenix' | 'prometheus' | 'belle' | 'tech_expert' | 'warmaster' | 'r2' | 'third_person' | string;

interface ChatOptions {
  personality?: Personality;       // default: 'echo_prime'
  domain?: string;                 // domain hint for engine routing
  history?: ChatMessage[];         // conversation history
  maxTokens?: number;              // max response tokens
  temperature?: number;            // 0.0-1.0
  enrichWithEngines?: boolean;     // include engine doctrine enrichment
  enrichWithKnowledge?: boolean;   // include knowledge forge context
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: string;
  personality: string;
  tokens_used: number;
  model: string;
  domain_detected?: string;
  engines_consulted?: number;
  knowledge_chunks?: number;
  latency_ms: number;
}
```

### Methods

```typescript
send(message: string, opts?: ChatOptions): Promise<ChatResponse>
```
Send a message and get an AI response.

```typescript
createSession(personality?: Personality, domain?: string): ConversationSession
```
Start a conversation session with memory. Returns `{ id, personality, messages, created_at, domain? }`.

```typescript
sendInSession(sessionId: string, message: string): Promise<ChatResponse>
```
Send a message within a session (auto-manages history, last 20 messages as context).

```typescript
getSession(sessionId: string): ConversationSession | undefined
```
Get a session by ID.

```typescript
listSessions(): ConversationSession[]
```
List all active sessions.

```typescript
clearSession(sessionId: string): void
```
Clear a session's history.

```typescript
deleteSession(sessionId: string): boolean
```
Delete a session.

```typescript
listPersonalities(): Promise<Array<{ id: string; name: string; description: string; color: string }>>
```
List available personalities.

---

## EchoVault

Credential management, health scoring, rotation.

```typescript
import { EchoVault } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
get(service: string): Promise<CredentialWithSecret>
```
Get a credential by service name. Returns `{ service, username, password, category?, strength?, created_at, updated_at? }`.

```typescript
store(service: string, username: string, password: string, category?: string): Promise<{ success: boolean; service: string }>
```
Store a new credential.

```typescript
search(query: string): Promise<Credential[]>
```
Search credentials by keyword (passwords not included).

```typescript
list(category?: string): Promise<Credential[]>
```
List all credentials without passwords.

```typescript
categories(): Promise<Array<{ name: string; count: number }>>
```
List credential categories.

```typescript
stats(): Promise<VaultStats>
```
Get vault statistics. Returns `{ total_credentials, categories, weak_count, breached_count }`.

```typescript
health(service: string): Promise<HealthScore>
```
Get health score for a credential. Returns `{ service, score, age_days, strength, breached, reused }`.

```typescript
delete(service: string): Promise<{ success: boolean }>
```
Delete a credential.

```typescript
rotate(service: string, newPassword?: string): Promise<{ success: boolean; service: string }>
```
Rotate a credential (generate new password if not provided).

---

## EchoTools

Search and execute 37,000+ MCP tools.

```typescript
import { EchoTools } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, limit?: number): Promise<ToolInfo[]>
```
Search for tools by keyword. Returns `{ id, name, category, description, server, tier, popularity_score }[]`.

```typescript
get(toolId: string): Promise<ToolInfo>
```
Get tool details by ID.

```typescript
categories(): Promise<ToolCategory[]>
```
List tool categories. Returns `{ id, name, tool_count }[]`.

```typescript
listByCategory(category: string, limit?: number): Promise<ToolInfo[]>
```
List tools in a category. Default limit: 50.

```typescript
execute(server: string, tool: string, params?: Record<string, unknown>): Promise<ToolExecutionResult>
```
Execute a tool. Returns `{ success, output, tool, server, latency_ms }`.

```typescript
chains(): Promise<ToolChain[]>
```
Get pre-built tool chains. Returns `{ id, name, description, tools, use_case }[]`.

```typescript
executeChain(chainId: string, input?: Record<string, unknown>): Promise<ToolExecutionResult[]>
```
Execute a tool chain (runs tools in sequence).

```typescript
stats(): Promise<{ total_tools: number; total_servers: number; categories: number }>
```
Get tool usage statistics.

---

## EchoMonitor

Request metrics, latency tracking, error rates. Runs entirely in-memory (no API calls).

```typescript
import { EchoMonitor } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new EchoMonitor(maxMetrics?: number)  // default: 10000
```

### Methods

```typescript
record(metric: RequestMetric): void
```
Record a request metric. `RequestMetric: { path, method, status, latencyMs, cached, retries, timestamp }`.

```typescript
summarize(windowMs?: number): MetricsSummary
```
Get a summary of all recorded metrics. Optional window in ms. Returns `{ totalRequests, successCount, errorCount, cacheHits, cacheMisses, avgLatencyMs, p95LatencyMs, p99LatencyMs, errorRate, requestsPerSecond, byPath, circuitState, uptimeMs }`.

```typescript
getMetrics(path?: string, limit?: number): RequestMetric[]
```
Get raw metrics, optionally filtered by path. Default limit: 100.

```typescript
clear(): void
```
Clear all recorded metrics.

```typescript
export(): string
```
Export metrics as JSON for external ingestion.

---

## EchoAgent

Create, configure, and run autonomous AI agents.

```typescript
import { EchoAgent } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
create(agentConfig: AgentConfig): Promise<AgentInfo>
```
Create a new agent. `AgentConfig: { name, personality?, domain?, instructions?, tools?, maxTurns?, temperature? }`. Returns `{ id, name, personality, domain, tools, created_at, total_runs }`.

```typescript
run(agentId: string, task: string, input?: Record<string, unknown>): Promise<AgentRun>
```
Run an agent with a task. Returns `{ id, agent_id, status, turns, output?, started_at, completed_at?, error? }`.

```typescript
status(runId: string): Promise<AgentRun>
```
Get the status of a running agent.

```typescript
cancel(runId: string): Promise<{ success: boolean }>
```
Cancel a running agent.

```typescript
list(): Promise<AgentInfo[]>
```
List all agents.

```typescript
get(agentId: string): Promise<AgentInfo>
```
Get agent details by ID.

```typescript
delete(agentId: string): Promise<{ success: boolean }>
```
Delete an agent.

```typescript
history(agentId: string, limit?: number): Promise<AgentRun[]>
```
Get run history for an agent. Default limit: 20.

---

## EchoScraper

Configure and run web scrapers with pagination and rate limits.

```typescript
import { EchoScraper } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
create(scraperConfig: ScraperConfig): Promise<ScraperInfo>
```
Create a new scraper. `ScraperConfig: { name, type: 'web'|'api'|'social'|'government'|'custom', target, schedule?, selectors?, headers?, rateLimit?, pagination? }`.

```typescript
run(scraperId: string): Promise<ScraperJob>
```
Run a scraper immediately. Returns `{ id, scraper_id, status, records_found, records_stored, started_at, completed_at?, error? }`.

```typescript
jobStatus(jobId: string): Promise<ScraperJob>
```
Get job status.

```typescript
list(): Promise<ScraperInfo[]>
```
List all scrapers.

```typescript
get(scraperId: string): Promise<ScraperInfo>
```
Get scraper details.

```typescript
records(scraperId: string, limit?: number, offset?: number): Promise<ScrapedRecord[]>
```
Get scraped records. Default limit: 50, offset: 0.

```typescript
delete(scraperId: string): Promise<{ success: boolean }>
```
Delete a scraper and its data.

```typescript
pause(scraperId: string): Promise<{ success: boolean }>
```
Pause a scheduled scraper.

```typescript
resume(scraperId: string): Promise<{ success: boolean }>
```
Resume a paused scraper.

```typescript
history(scraperId: string, limit?: number): Promise<ScraperJob[]>
```
Get scraper run history. Default limit: 20.

---

## EchoBot

Create social media bots across 9 platforms.

```typescript
import { EchoBot } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type BotPlatform = 'discord' | 'x' | 'telegram' | 'linkedin' | 'slack' | 'reddit' | 'whatsapp' | 'messenger' | 'instagram';
```

### Methods

```typescript
create(botConfig: BotConfig): Promise<BotInfo>
```
Create a new bot. `BotConfig: { name, platform, personality?, credentials?, schedule?, contentWeights?, domains?, abTesting? }`.

```typescript
list(platform?: BotPlatform): Promise<BotInfo[]>
```
List all bots, optionally filtered by platform.

```typescript
get(botId: string): Promise<BotInfo>
```
Get bot details.

```typescript
post(botId: string, content?: string, category?: string): Promise<BotPost>
```
Trigger a manual post.

```typescript
stats(botId: string): Promise<BotStats>
```
Get bot statistics. Returns `{ total_posts, total_interactions, engagement_rate, top_categories, posts_today, active_subscribers }`.

```typescript
posts(botId: string, limit?: number): Promise<BotPost[]>
```
Get post history. Default limit: 50.

```typescript
pause(botId: string): Promise<{ success: boolean }>
```

```typescript
resume(botId: string): Promise<{ success: boolean }>
```

```typescript
delete(botId: string): Promise<{ success: boolean }>
```

```typescript
updateCredentials(botId: string, credentials: Record<string, string>): Promise<{ success: boolean }>
```

```typescript
templates(platform?: BotPlatform): Promise<Array<{ id: string; name: string; description: string; platform: BotPlatform; category: string }>>
```
Get available bot templates.

---

## EchoMegaGateway

Access 37,475+ MCP tools across 1,901 servers and 12 categories.

```typescript
import { EchoMegaGateway } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type GatewayCategory = 'AI_ML' | 'API' | 'AUTOMATION' | 'CLOUD' | 'COMMUNICATION' | 'DATA'
  | 'DEVTOOLS' | 'FINANCE' | 'MEDIA' | 'MONITORING' | 'NETWORK' | 'SECURITY';
```

### Methods

```typescript
search(query: string, opts?: { category?: GatewayCategory; limit?: number }): Promise<GatewayTool[]>
```
Search across 37,475+ tools. Default limit: 20.

```typescript
execute(server: string, tool: string, params?: Record<string, unknown>): Promise<GatewayExecResult>
```
Execute a tool on a specific server.

```typescript
executeChain(steps: Array<{ server: string; tool: string; params?: Record<string, unknown> }>): Promise<GatewayExecResult[]>
```
Execute multiple tools in sequence.

```typescript
servers(category?: GatewayCategory): Promise<GatewayServer[]>
```
List all servers.

```typescript
categories(): Promise<Array<{ category: GatewayCategory; tool_count: number; server_count: number }>>
```
List all categories with tool counts.

```typescript
toolInfo(server: string, tool: string): Promise<GatewayTool>
```
Get detailed info about a specific tool.

```typescript
serverTools(serverId: string): Promise<GatewayTool[]>
```
List all tools on a specific server.

```typescript
stats(): Promise<GatewayStats>
```
Get gateway statistics.

---

## EchoGraphRAG

Knowledge graph with 312K+ nodes, 3.3M+ edges across 93 domains.

```typescript
import { EchoGraphRAG } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, opts?: { domain?: string; limit?: number; depth?: number }): Promise<GraphSearchResult>
```
Semantic search across the knowledge graph. Default limit: 20, depth: 2.

```typescript
getNode(nodeId: string): Promise<GraphNode>
```
Get a specific node by ID.

```typescript
getEdges(nodeId: string, opts?: { direction?: 'in' | 'out' | 'both'; limit?: number }): Promise<GraphEdge[]>
```
Get edges connected to a node. Default direction: 'both', limit: 50.

```typescript
findPath(sourceId: string, targetId: string, maxHops?: number): Promise<GraphPath | null>
```
Find shortest path between two nodes. Default maxHops: 5.

```typescript
subgraph(nodeId: string, depth?: number, maxNodes?: number): Promise<GraphSearchResult>
```
Extract a subgraph around a node. Default depth: 2, maxNodes: 100.

```typescript
addNode(label: string, type: string, domain: string, properties?: Record<string, unknown>): Promise<GraphNode>
```
Add a node to the graph.

```typescript
addEdge(sourceId: string, targetId: string, relationship: string, weight?: number): Promise<GraphEdge>
```
Add an edge between two nodes. Default weight: 1.0.

```typescript
domains(): Promise<Array<{ domain: string; node_count: number; edge_count: number }>>
```
List all domains in the graph.

```typescript
stats(): Promise<GraphStats>
```
Get graph statistics.

```typescript
query(question: string, opts?: { domain?: string; maxSources?: number }): Promise<{ answer: string; sources: GraphNode[]; confidence: number; reasoning_chain: string[] }>
```
RAG query -- combines graph traversal with LLM reasoning. Default maxSources: 10.

---

## EchoSwarm

Inter-agent communication, MoltBook social feed, swarm coordination.

```typescript
import { EchoSwarm } from '@echo-omega-prime/sdk';
```

### MoltBook Methods

```typescript
post(content: string, opts?: { mood?: MoltMood; tags?: string[]; authorId?: string }): Promise<MoltPost>
```
Post to MoltBook. `MoltMood: 'building' | 'debugging' | 'celebrating' | 'thinking' | 'alert' | 'excited' | 'neutral' | 'analyzing'`.

```typescript
feed(opts?: { limit?: number; mood?: MoltMood; tag?: string }): Promise<MoltPost[]>
```
Get MoltBook feed. Default limit: 50.

```typescript
react(postId: string, reaction: string): Promise<{ success: boolean }>
```
React to a MoltBook post.

### Swarm Coordination Methods

```typescript
agents(): Promise<SwarmAgent[]>
```
List all swarm agents.

```typescript
clusterStatus(): Promise<SwarmStats>
```
Get cluster status.

```typescript
submitTask(description: string, opts?: { priority?: number; assignTo?: string }): Promise<SwarmTask>
```
Submit a task to the swarm. Default priority: 5.

```typescript
taskStatus(taskId: string): Promise<SwarmTask>
```
Get task status.

```typescript
tasks(opts?: { status?: string; limit?: number }): Promise<SwarmTask[]>
```
List tasks. Default limit: 50.

### Broadcasting Methods

```typescript
broadcast(message: string, priority?: 'low' | 'normal' | 'high' | 'critical'): Promise<BroadcastMessage>
```
Broadcast a message to all agents. Default priority: 'normal'.

```typescript
broadcasts(limit?: number): Promise<BroadcastMessage[]>
```
Get recent broadcasts. Default limit: 50.

---

## EchoDarkweb

Threat monitoring, credential breach detection, brand protection.

```typescript
import { EchoDarkweb } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, opts?: { severity?: ThreatSeverity; category?: ThreatCategory; limit?: number }): Promise<DarkwebThreat[]>
```
Search dark web intelligence. Default limit: 20.

```typescript
checkBreach(email: string): Promise<BreachResult>
```
Check if an email has been in a breach. Returns `{ email, breached, breach_count, sources, first_seen?, last_seen? }`.

```typescript
createAlert(name: string, keywords: string[], opts?: { severityThreshold?: ThreatSeverity; channels?: string[] }): Promise<DarkwebAlert>
```
Create a monitoring alert.

```typescript
alerts(): Promise<DarkwebAlert[]>
```
List all alerts.

```typescript
deleteAlert(alertId: string): Promise<{ success: boolean }>
```
Delete an alert.

```typescript
threats(opts?: { severity?: ThreatSeverity; hours?: number; limit?: number }): Promise<DarkwebThreat[]>
```
Get recent threats. Default hours: 24, limit: 50.

```typescript
intel(opts?: { category?: ThreatCategory; limit?: number }): Promise<DarkwebIntel[]>
```
Get intelligence reports. Default limit: 20.

```typescript
monitorBrand(brand: string, domains: string[], keywords: string[]): Promise<{ id: string; active: boolean }>
```
Monitor specific domains/brands.

```typescript
stats(): Promise<DarkwebStats>
```
Get monitoring stats.

---

## EchoCrypto

Grid/momentum trading strategies, portfolio management.

```typescript
import { EchoCrypto } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type TradingStrategy = 'grid' | 'momentum' | 'dca' | 'arbitrage' | 'scalp';
type OrderSide = 'buy' | 'sell';
type OrderStatus = 'pending' | 'filled' | 'partial' | 'cancelled' | 'failed';
```

### Methods

```typescript
price(pair: string): Promise<TradingPair>
```
Get current price for a trading pair.

```typescript
prices(pairs?: string[]): Promise<TradingPair[]>
```
Get prices for multiple pairs.

```typescript
createStrategy(name: string, strategy: TradingStrategy, pair: string, params: Record<string, unknown>): Promise<StrategyConfig>
```
Create a trading strategy.

```typescript
strategies(opts?: { active?: boolean }): Promise<StrategyConfig[]>
```
List all strategies.

```typescript
toggleStrategy(strategyId: string, active: boolean): Promise<{ success: boolean }>
```
Start/stop a strategy.

```typescript
trades(opts?: { pair?: string; strategy?: TradingStrategy; limit?: number }): Promise<TradeOrder[]>
```
Get trade history. Default limit: 50.

```typescript
portfolio(): Promise<PortfolioPosition[]>
```
Get portfolio positions.

```typescript
stats(): Promise<CryptoStats>
```
Get trading stats.

---

## EchoNews

Multi-source news aggregation with sentiment analysis.

```typescript
import { EchoNews } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, opts?: { sentiment?: NewsSentiment; source?: string; limit?: number; hours?: number }): Promise<NewsArticle[]>
```
Search news articles. Default limit: 20, hours: 24.

```typescript
feed(opts?: { category?: string; limit?: number }): Promise<NewsArticle[]>
```
Get latest news feed. Default limit: 50.

```typescript
analyzeSentiment(text: string): Promise<{ sentiment: NewsSentiment; score: number; keywords: string[] }>
```
Analyze sentiment of text.

```typescript
trackTopic(name: string, keywords: string[]): Promise<NewsTopic>
```
Track a topic.

```typescript
topics(): Promise<NewsTopic[]>
```
List tracked topics.

```typescript
createAlert(name: string, keywords: string[], sentimentFilter?: NewsSentiment): Promise<NewsAlert>
```
Create a news alert.

```typescript
stats(): Promise<NewsStats>
```
Get news stats.

---

## EchoSECEdgar

SEC filing monitoring, company watchlists.

```typescript
import { EchoSECEdgar } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type FilingType = '10-K' | '10-Q' | '8-K' | '4' | 'SC 13D' | 'S-1' | 'DEF 14A' | '13F-HR';
```

### Methods

```typescript
search(query: string, opts?: { filingType?: FilingType; ticker?: string; limit?: number }): Promise<SECFiling[]>
```
Search SEC filings. Default limit: 20.

```typescript
filings(ticker: string, opts?: { filingType?: FilingType; limit?: number }): Promise<SECFiling[]>
```
Get recent filings for a company.

```typescript
watch(ticker: string, filingTypes?: FilingType[]): Promise<WatchlistCompany>
```
Add company to watchlist. Default filing types: `['10-K', '10-Q', '8-K']`.

```typescript
watchlist(): Promise<WatchlistCompany[]>
```
Get watchlist.

```typescript
unwatch(ticker: string): Promise<{ success: boolean }>
```
Remove from watchlist.

```typescript
alerts(opts?: { limit?: number }): Promise<SECAlert[]>
```
Get filing alerts. Default limit: 50.

```typescript
stats(): Promise<SECStats>
```
Get SEC monitoring stats.

---

## EchoReddit

Subreddit monitoring, keyword alerts, sentiment tracking.

```typescript
import { EchoReddit } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
search(query: string, opts?: { subreddit?: string; minScore?: number; limit?: number }): Promise<RedditPost[]>
```
Search monitored Reddit posts. Default limit: 20.

```typescript
watch(subreddit: string, keywords: string[], minScore?: number): Promise<SubredditWatch>
```
Watch a subreddit. Default minScore: 0.

```typescript
watchlist(): Promise<SubredditWatch[]>
```
List watched subreddits.

```typescript
unwatch(subreddit: string): Promise<{ success: boolean }>
```
Stop watching a subreddit.

```typescript
alerts(opts?: { subreddit?: string; limit?: number }): Promise<RedditAlert[]>
```
Get recent alerts. Default limit: 50.

```typescript
stats(): Promise<RedditStats>
```
Get Reddit monitoring stats.

---

## EchoPriceAlerts

Multi-asset price monitoring with configurable thresholds.

```typescript
import { EchoPriceAlerts } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type AlertCondition = 'above' | 'below' | 'change_pct' | 'cross';
type AssetType = 'crypto' | 'stock' | 'commodity' | 'forex';
```

### Methods

```typescript
create(asset: string, condition: AlertCondition, threshold: number, assetType?: AssetType): Promise<PriceAlert>
```
Create a price alert. Default assetType: 'crypto'.

```typescript
list(opts?: { active?: boolean; assetType?: AssetType }): Promise<PriceAlert[]>
```
List all alerts.

```typescript
delete(alertId: string): Promise<{ success: boolean }>
```
Delete an alert.

```typescript
prices(assets: string[]): Promise<PriceSnapshot[]>
```
Get current prices.

```typescript
history(opts?: { limit?: number }): Promise<AlertHistory[]>
```
Get alert trigger history. Default limit: 50.

```typescript
stats(): Promise<PriceAlertStats>
```
Get stats.

---

## EchoLandman

Title investigation, chain-of-title, deed records, runsheets.

```typescript
import { EchoLandman } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type InvestigationStatus = 'pending' | 'searching' | 'analyzing' | 'generating' | 'complete' | 'failed';
type DeedType = 'warranty_deed' | 'quit_claim' | 'mineral_deed' | 'oil_gas_lease' | 'assignment' | 'release' | 'easement' | 'mortgage' | 'lien' | 'other';
```

### Methods

```typescript
investigate(county: string, legalDescription: string, opts?: { state?: string; async?: boolean }): Promise<TitleInvestigation>
```
Start a title investigation. Default state: 'TX', async: true.

```typescript
status(investigationId: string): Promise<TitleInvestigation>
```
Get investigation status.

```typescript
chainOfTitle(county: string, legalDescription: string): Promise<ChainOfTitle>
```
Get chain of title. Returns complete chain with gaps analysis.

```typescript
searchRecords(opts: { county: string; grantor?: string; grantee?: string; deedType?: DeedType; section?: string; block?: string; limit?: number }): Promise<DeedRecord[]>
```
Search deed records. Default limit: 50.

```typescript
runsheet(investigationId: string): Promise<Runsheet>
```
Get runsheet for an investigation.

```typescript
countyQuery(county: string, opts?: { section?: string; block?: string; survey?: string; limit?: number }): Promise<DeedRecord[]>
```
Query county records database. Default limit: 50.

```typescript
countyStats(): Promise<{ county: string; documents: number; parties: number }[]>
```
Get county stats.

```typescript
stats(): Promise<LandmanStats>
```
Get landman pipeline stats.

---

## EchoModelHost

Custom LoRA model inference and adapter management.

```typescript
import { EchoModelHost } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
chat(request: InferenceRequest): Promise<InferenceResponse>
```
Run inference on a model (OpenAI-compatible). `InferenceRequest: { model, messages: [{ role, content }], temperature?, max_tokens?, top_p? }`.

```typescript
list(): Promise<ModelAdapter[]>
```
List available models.

```typescript
info(modelId: string): Promise<ModelAdapter>
```
Get model info.

```typescript
switchModel(modelId: string): Promise<{ success: boolean; model: string }>
```
Switch active model/adapter.

```typescript
stats(): Promise<ModelStats>
```
Get model hosting stats.

```typescript
health(): Promise<{ status: string; models: number; vram_used_gb: number }>
```
Health check.

---

## EchoHarvester

Automated knowledge source discovery and ingestion.

```typescript
import { EchoHarvester } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type SourceType = 'rss' | 'api' | 'scrape' | 'manual' | 'sitemap' | 'github';
type HarvestStatus = 'active' | 'paused' | 'failed' | 'pending';
```

### Methods

```typescript
addSource(name: string, url: string, sourceType: SourceType, category: string, schedule?: string): Promise<HarvestSource>
```
Add a harvest source. Default schedule: `'0 */6 * * *'` (every 6 hours).

```typescript
sources(opts?: { status?: HarvestStatus; category?: string }): Promise<HarvestSource[]>
```
List all sources.

```typescript
harvest(sourceId: string): Promise<{ success: boolean; items_found: number }>
```
Trigger a harvest run.

```typescript
items(opts?: { sourceId?: string; category?: string; limit?: number }): Promise<HarvestItem[]>
```
Get harvested items. Default limit: 50.

```typescript
reports(opts?: { limit?: number }): Promise<DiscoveryReport[]>
```
Get discovery reports. Default limit: 10.

```typescript
stats(): Promise<HarvesterStats>
```
Get harvester stats.

---

## EchoScanner

County record scraping, document indexing, multi-county search.

```typescript
import { EchoScanner } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
scan(county: string, opts?: { state?: string; instrumentTypes?: string[]; dateRange?: { from: string; to: string } }): Promise<ScanJob>
```
Start a county scan. Default state: 'TX'.

```typescript
jobStatus(jobId: string): Promise<ScanJob>
```
Get scan job status.

```typescript
jobs(opts?: { status?: ScrapeStatus; county?: string; limit?: number }): Promise<ScanJob[]>
```
List scan jobs. Default limit: 50.

```typescript
searchDocuments(query: string, opts?: { county?: string; instrumentType?: string; limit?: number }): Promise<ScannedDocument[]>
```
Search scanned documents. Default limit: 50.

```typescript
counties(): Promise<CountyStatus[]>
```
Get county coverage status.

```typescript
stats(): Promise<ScannerStats>
```
Get scanner stats.

---

## EchoWorkflows

Multi-step workflow orchestration with cron scheduling.

```typescript
import { EchoWorkflows } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed' | 'draft';
type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
```

### Methods

```typescript
create(name: string, steps: WorkflowStepInput[], opts?: { description?: string; schedule?: string }): Promise<Workflow>
```
Create a workflow. `WorkflowStepInput: { name, type: 'api_call'|'transform'|'condition'|'parallel'|'delay'|'notification', config }`.

```typescript
run(workflowId: string, inputs?: Record<string, unknown>): Promise<WorkflowRun>
```
Run a workflow.

```typescript
runStatus(runId: string): Promise<WorkflowRun>
```
Get workflow run status.

```typescript
list(opts?: { status?: WorkflowStatus; limit?: number }): Promise<Workflow[]>
```
List workflows. Default limit: 50.

```typescript
crons(opts?: { active?: boolean }): Promise<CronJob[]>
```
List cron jobs.

```typescript
createCron(name: string, schedule: string, opts?: { workflowId?: string; command?: string }): Promise<CronJob>
```
Create a cron job.

```typescript
stats(): Promise<WorkflowStats>
```
Get workflow stats.

---

## EchoNotifications

Multi-channel notifications (email, SMS, Telegram, Discord, Slack, MoltBook, webhook).

```typescript
import { EchoNotifications } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type NotificationChannel = 'email' | 'sms' | 'telegram' | 'discord' | 'slack' | 'moltbook' | 'webhook';
type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
```

### Methods

```typescript
send(channel: NotificationChannel, recipient: string, message: string, opts?: { subject?: string; priority?: NotificationPriority }): Promise<Notification>
```
Send a notification. Default priority: 'normal'.

```typescript
broadcast(channels: NotificationChannel[], message: string, opts?: { subject?: string; priority?: NotificationPriority }): Promise<Notification[]>
```
Send to multiple channels.

```typescript
createRule(name: string, condition: string, channels: NotificationChannel[], priority?: NotificationPriority): Promise<NotificationRule>
```
Create a notification rule. Default priority: 'normal'.

```typescript
rules(): Promise<NotificationRule[]>
```
List notification rules.

```typescript
history(opts?: { channel?: NotificationChannel; limit?: number }): Promise<Notification[]>
```
Get notification history. Default limit: 50.

```typescript
stats(): Promise<NotificationStats>
```
Get notification stats.

---

## EchoFleet

Worker fleet monitoring, health checks, deployment orchestration.

```typescript
import { EchoFleet } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
health(): Promise<FleetWorker[]>
```
Get fleet health overview.

```typescript
workerStatus(workerName: string): Promise<FleetWorker>
```
Get single worker status.

```typescript
services(): Promise<ServiceRegistration[]>
```
List all registered services.

```typescript
register(name: string, url: string, capabilities: string[]): Promise<ServiceRegistration>
```
Register a service.

```typescript
deployments(opts?: { worker?: string; limit?: number }): Promise<FleetDeployment[]>
```
Get deployment history. Default limit: 50.

```typescript
deploy(workerName: string, opts?: { version?: string }): Promise<FleetDeployment>
```
Deploy a worker.

```typescript
stats(): Promise<FleetStats>
```
Get fleet stats.

---

## EchoMemoryPrime

Permanent 9-pillar memory archive with semantic search.

```typescript
import { EchoMemoryPrime } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type MemoryPillar = 'decisions' | 'errors' | 'patterns' | 'context' | 'code' | 'conversations' | 'knowledge' | 'tasks' | 'metrics';
```

### Methods

```typescript
store(pillar: MemoryPillar, content: string, opts?: { importance?: number; tags?: string[]; source?: string }): Promise<MemoryEntry>
```
Store a memory. Default importance: 5, source: 'sdk'.

```typescript
search(query: string, opts?: { pillar?: MemoryPillar; minImportance?: number; limit?: number }): Promise<MemorySearchResult>
```
Search memories semantically. Default limit: 20.

```typescript
recall(pillar: MemoryPillar, opts?: { limit?: number }): Promise<MemoryEntry[]>
```
Recall by pillar. Default limit: 50.

```typescript
get(memoryId: string): Promise<MemoryEntry>
```
Get a specific memory.

```typescript
delete(memoryId: string): Promise<{ success: boolean }>
```
Delete a memory.

```typescript
stats(): Promise<MemoryStats>
```
Get memory stats.

---

## EchoAutonomous

24/7 daemon health monitoring, auto-tasks, pattern detection.

```typescript
import { EchoAutonomous } from '@echo-omega-prime/sdk';
```

### Types

```typescript
type DaemonTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';
```

### Methods

```typescript
status(): Promise<DaemonStatus>
```
Get daemon status. Returns `{ running, uptime_ms, workers_monitored, tasks_completed_24h, patterns_detected, health_grade, last_check }`.

```typescript
healthReport(): Promise<WorkerHealthReport[]>
```
Get worker health reports.

```typescript
tasks(opts?: { status?: DaemonTaskStatus; limit?: number }): Promise<AutoTask[]>
```
List auto-tasks. Default limit: 50.

```typescript
createTask(description: string, opts?: { priority?: number; type?: string }): Promise<AutoTask>
```
Create a manual task. Default priority: 5, type: 'manual'.

```typescript
patterns(opts?: { severity?: string; limit?: number }): Promise<DetectedPattern[]>
```
Get detected patterns. Default limit: 50.

```typescript
stats(): Promise<DaemonStats>
```
Get daemon stats.

```typescript
sweep(): Promise<{ success: boolean; workers_checked: number; issues_found: number }>
```
Trigger a full health sweep.

---

## EchoSdkCatalog

Discover all 221 SDK methods across 30 modules.

```typescript
import { EchoSdkCatalog } from '@echo-omega-prime/sdk';
```

### Methods

```typescript
list(opts?: { limit?: number; offset?: number; module?: string }): Promise<{ methods: SdkMethod[]; total: number; limit: number; offset: number; has_more: boolean }>
```
List all SDK methods (paginated).

```typescript
modules(): Promise<{ modules: SdkModule[]; total_modules: number }>
```
List all modules with method counts.

```typescript
search(query: string, limit?: number): Promise<{ query: string; methods: SdkMethod[]; total: number }>
```
Search methods by keyword. Default limit: 20.

```typescript
method(name: string): Promise<{ methods: SdkMethod[] }>
```
Get a method by exact name.

```typescript
module(moduleName: string): Promise<{ module: string; class_names: string[]; methods: SdkMethod[]; total: number }>
```
Get all methods for a specific module.

---

## ForgeClient

Build engines, doctrines, apps, workers, and orchestrate full-stack pipelines.

```typescript
import { ForgeClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new ForgeClient(config: ForgeConfig)
```
`ForgeConfig: { apiKey: string; baseUrl?: string }`.

### Build Methods

```typescript
engine(spec: Record<string, unknown>): Promise<BuildResult>
```
Build a new intelligence engine.

```typescript
doctrine(spec: Record<string, unknown>): Promise<BuildResult>
```
Build a new doctrine block.

```typescript
app(type: string, spec: Record<string, unknown>): Promise<BuildResult>
```
Build a new application. Type: `'web' | 'api' | 'mobile' | 'cli'`.

```typescript
worker(name: string, spec: Record<string, unknown>): Promise<BuildResult>
```
Build a new Cloudflare Worker.

```typescript
prompt(domain: string, task: string): Promise<BuildResult>
```
Generate an optimized prompt template.

```typescript
knowledge(docs: Array<{ title: string; content: string; category: string }>): Promise<BuildResult>
```
Ingest knowledge documents.

```typescript
hephaestion(spec: Record<string, unknown>): Promise<BuildResult>
```
Build using the Hephaestion Forge (advanced engine construction).

```typescript
daedalus(spec: Record<string, unknown>): Promise<BuildResult>
```
Build using the Daedalus Forge (rapid prototyping).

```typescript
forgeX(spec: Record<string, unknown>): Promise<BuildResult>
```
Build using Forge-X (cross-platform orchestration).

### Orchestration Methods

```typescript
fullStack(stages: string[], payload: Record<string, unknown>): Promise<FullStackResult>
```
Execute a full-stack pipeline across multiple forge stages.

### Status Methods

```typescript
status(): Promise<ForgeStatus>
```
Get health status of all forge subsystems.

```typescript
evolution(forgeId?: string): Promise<EvolutionState | unknown>
```
Get the evolution state of forges.

### Types

```typescript
interface BuildResult {
  ok: boolean;
  forge: string;
  data: unknown;
  latency_ms: number;
}

interface FullStackResult {
  pipeline: string;
  stages: string[];
  results: Array<{ stage: string; ok: boolean; data: unknown; latency_ms: number }>;
}

interface ForgeStatus {
  forges: Record<string, { status: string; latency_ms?: number; data?: unknown }>;
  summary: { total: number; healthy: number; unhealthy: number };
}

interface EvolutionState {
  forges: Record<string, { ok: boolean; data: unknown; latency_ms?: number }>;
  timestamp: string;
  forge_count: number;
}
```

---

## LLMClient

Unified LLM completions across 29+ providers with streaming.

```typescript
import { LLMClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new LLMClient(config: LLMConfig)
```
`LLMConfig: { apiKey: string; baseUrl?: string; defaultModel?: string }`. Default model: `'claude-opus-4-20250514'`.

### Methods

```typescript
claude(prompt: string, options?: Partial<CompletionRequest>): Promise<CompletionResponse>
```
Send a prompt to Claude (convenience method).

```typescript
complete(request: CompletionRequest): Promise<CompletionResponse>
```
Send a completion request to any supported model.

```typescript
stream(request: CompletionRequest): AsyncGenerator<string>
```
Stream a completion response token by token. Yields individual text chunks.

```typescript
models(): Promise<ModelInfo[]>
```
List all available LLM models across all providers.

```typescript
status(): Promise<{ healthy: boolean; providers: Record<string, string> }>
```
Get health status of LLM providers.

### Types

```typescript
interface CompletionRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  stream?: boolean;
  system?: string;
  temperature?: number;  // 0.0 - 2.0
}

interface CompletionResponse {
  content: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  latency_ms: number;
}

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  max_tokens: number;
  capabilities: string[];
}
```

---

## WebhookClient

Register, manage, and consume webhook subscriptions.

```typescript
import { WebhookClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new WebhookClient(config: WebhookConfig)
```
`WebhookConfig: { apiKey: string; baseUrl?: string }`.

### Methods

```typescript
register(url: string, events: string[], secret?: string): Promise<Webhook>
```
Register a new webhook subscription.

```typescript
list(): Promise<Webhook[]>
```
List all registered webhooks.

```typescript
delete(webhookId: string): Promise<void>
```
Delete a webhook subscription.

```typescript
test(webhookId: string): Promise<{ delivered: boolean; status: number }>
```
Send a test event to a webhook.

```typescript
events(filter?: string[]): AsyncGenerator<{ event: string; data: unknown; timestamp: string }>
```
Stream real-time events via Server-Sent Events.

### Types

```typescript
interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  last_triggered: string | null;
  failure_count: number;
}
```

---

## AGIClient

Self-improving engine feedback loop with automatic retraining.

```typescript
import { AGIClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new AGIClient(config: AGIConfig)
```
`AGIConfig: { apiKey: string; baseUrl?: string }`.

### Methods

```typescript
status(): Promise<AGIStatus>
```
Get AGI subsystem status. Returns `{ total_feedback, avg_quality, total_retrains, engines_improved, last_retrain }`.

```typescript
feedback(request: FeedbackRequest): Promise<{ recorded: boolean; auto_retrain_triggered: boolean }>
```
Submit quality feedback. `FeedbackRequest: { engine_id, query?, quality_score (0.0-1.0), feedback_text? }`.

```typescript
retrain(engineId: string, reason?: string): Promise<{ job_id: string; status: string }>
```
Manually trigger a retrain job.

```typescript
learningRate(): Promise<LearningRate>
```
Get learning rate analytics. Returns `{ daily_improvement, weekly_trend, top_improving_engines, struggling_engines }`.

```typescript
suggestions(): Promise<Suggestion[]>
```
Get AI-generated optimization suggestions. Returns `{ engine_id, reason, current_score, recommended_action }[]`.

---

## ComposeClient

Create compound engines with merge, chain, or vote strategies.

```typescript
import { ComposeClient } from '@echo-omega-prime/sdk';
```

### Constructor

```typescript
new ComposeClient(config: ComposeConfig)
```
`ComposeConfig: { apiKey: string; baseUrl?: string }`.

### Methods

```typescript
create(engines: string[], name: string, options?: { description?: string; strategy?: 'merge' | 'chain' | 'vote' }): Promise<CompoundEngine>
```
Create a new compound engine. Default strategy: 'merge'.

```typescript
get(id: string): Promise<CompoundEngine>
```
Get details of a compound engine.

```typescript
delete(id: string): Promise<void>
```
Delete a compound engine (does not delete constituent engines).

```typescript
query(id: string, query: string, mode?: string): Promise<unknown>
```
Query a compound engine.

```typescript
list(): Promise<CompoundEngine[]>
```
List all compound engines.

### Types

```typescript
interface CompoundEngine {
  id: string;
  name: string;
  description?: string;
  engines: string[];
  strategy: 'merge' | 'chain' | 'vote';
  created_at: string;
  query_count: number;
}
```

---

## Error Classes

All errors are exported from the main package:

```typescript
import {
  EchoError,        // Base error (code, status, retryable, context, timestamp)
  AuthError,         // 401/403 -- invalid API key
  RateLimitError,    // 429 -- rate limit exceeded (retryAfterMs)
  TimeoutError,      // 408 -- request timed out
  NetworkError,      // 0 -- DNS/connection failure
  ValidationError,   // 400 -- bad input (field)
  NotFoundError,     // 404 -- resource not found
  CircuitOpenError,  // 503 -- circuit breaker open (resetAtMs)
  ServerError,       // 5xx -- server error
} from '@echo-omega-prime/sdk';
```

### Utility Functions

```typescript
isRetryableStatus(status: number): boolean
```
Returns true for 429, 500, 502, 503, 504.

```typescript
isRetryableError(err: unknown): boolean
```
Returns true if the error is retryable.

```typescript
normalizeError(err: unknown): EchoError
```
Convert any unknown error into an EchoError.
