# Echo Prime SDK (TypeScript)

The official TypeScript/JavaScript SDK for [Echo Prime Technologies](https://echo-ept.com). Access 2,600+ intelligence engines, 37,475+ MCP tools, 5,300+ knowledge documents, 14 AI personalities, and the full Echo platform through a single unified client.

**SDK v3.2** | Zero external dependencies | Tree-shakeable | Node.js 18+ / Bun / Deno / Cloudflare Workers

[![npm](https://img.shields.io/npm/v/@echo-omega-prime/sdk)](https://www.npmjs.com/package/@echo-omega-prime/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Installation

```bash
npm install @echo-omega-prime/sdk
```

## Quick Start

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({ apiKey: 'your-key' });
const result = await echo.engines.query('What is fracking?', 'oilfield');
console.log(result.response);
```

That's it. Three lines to intelligence.

## Custom GPT Connector Example

Want to connect a **Custom GPT** to Echo SDK? Use the minimal connector example in:

- `examples/custom-gpt-connector/README.md`
- `examples/custom-gpt-connector/openapi.yaml`
- `examples/custom-gpt-connector/server.mjs`

This gives you a ready Actions-compatible API (`/chat`, `/knowledge/search`) that proxies to Echo SDK securely from your server.


## Table of Contents

- [Configuration](#configuration)
- [Modules](#modules)
- [Core Examples](#core-examples)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)
- [Advanced Configuration](#advanced-configuration)
- [Documentation](#documentation)

## Configuration

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  // Required
  apiKey: 'your-api-key',

  // Optional
  gatewayUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev', // default
  timeout: 30000,       // request timeout in ms (default: 30000)
  retries: 2,           // retry count on failure (default: 2)

  // Circuit breaker (protects against cascading failures)
  circuitBreaker: {
    failureThreshold: 5,     // failures before opening (default: 5)
    resetTimeoutMs: 30000,   // time before half-open (default: 30000)
  },

  // Response caching (set to false to disable)
  cache: {
    maxSize: 1000,      // max entries (default: 1000)
    defaultTtlMs: 60000 // TTL for GET requests (default: 60000)
  },

  // Structured logging
  logger: (entry) => console.log(JSON.stringify(entry)),
});
```

## Modules

The SDK provides 36 modules, all accessible through the unified `EchoPrime` client:

| # | Module | Property | Description |
|---|--------|----------|-------------|
| 1 | **Engines** | `echo.engines` | Query 2,600+ intelligence engines across 210+ domains |
| 2 | **Knowledge** | `echo.knowledge` | Search and ingest 5,300+ documents across 140+ categories |
| 3 | **Brain** | `echo.brain` | Infinite cross-session memory via semantic search |
| 4 | **Doctrine** | `echo.doctrine` | Generate domain-specific doctrine blocks via 24 FREE LLM providers |
| 5 | **Voice** | `echo.voice` | TTS synthesis, STT transcription, voice cloning, emotion tags |
| 6 | **Chat** | `echo.chat` | Conversational AI with 14 personalities and session management |
| 7 | **Vault** | `echo.vault` | Credential management, health scoring, rotation |
| 8 | **Tools** | `echo.tools` | Search and execute 37,000+ MCP tools via MEGA Gateway |
| 9 | **Monitor** | `echo.monitor` | Request metrics, latency tracking, error rates |
| 10 | **Agent** | `echo.agent` | Create and run autonomous AI agents |
| 11 | **Scraper** | `echo.scraper` | Configure and run web scrapers with pagination and rate limits |
| 12 | **Bot** | `echo.bot` | Create social media bots across 9 platforms |
| 13 | **MEGA Gateway** | `echo.megaGateway` | Access 37,475+ MCP tools across 1,901 servers |
| 14 | **GraphRAG** | `echo.graphRag` | Knowledge graph with 312K+ nodes and 3.3M+ edges |
| 15 | **Swarm** | `echo.swarm` | Inter-agent communication, MoltBook feed, task coordination |
| 16 | **Darkweb** | `echo.darkweb` | Threat monitoring, breach detection, brand protection |
| 17 | **Crypto** | `echo.crypto` | Grid/momentum trading strategies, portfolio management |
| 18 | **News** | `echo.news` | Multi-source news aggregation with sentiment analysis |
| 19 | **SEC Edgar** | `echo.secEdgar` | SEC filing monitoring, company watchlists |
| 20 | **Reddit** | `echo.reddit` | Subreddit monitoring, keyword alerts, sentiment tracking |
| 21 | **Price Alerts** | `echo.priceAlerts` | Multi-asset price monitoring with configurable thresholds |
| 22 | **Landman** | `echo.landman` | Title investigation, chain-of-title, deed records, runsheets |
| 23 | **Model Host** | `echo.modelHost` | Custom LoRA model inference and adapter management |
| 24 | **Harvester** | `echo.harvester` | Automated knowledge source discovery and ingestion |
| 25 | **Scanner** | `echo.scanner` | County record scraping, document indexing, multi-county search |
| 26 | **Workflows** | `echo.workflows` | Multi-step workflow orchestration with cron scheduling |
| 27 | **Notifications** | `echo.notifications` | Multi-channel notifications (email, SMS, Telegram, Discord, Slack) |
| 28 | **Fleet** | `echo.fleet` | Worker fleet monitoring, health checks, deployment orchestration |
| 29 | **Memory Prime** | `echo.memoryPrime` | Permanent 9-pillar memory archive with semantic search |
| 30 | **Autonomous** | `echo.autonomous` | 24/7 daemon health monitoring, auto-tasks, pattern detection |
| 31 | **SDK Catalog** | `echo.sdkCatalog` | Discover all 221 SDK methods across 30 modules |
| 32 | **Forge** | `echo.forge` | Build engines, doctrines, apps, workers via Hephaestion/Daedalus/Forge-X |
| 33 | **LLM** | `echo.llm` | Unified LLM completions across 29+ providers with streaming |
| 34 | **Webhooks** | `echo.webhooks` | Register webhook endpoints, subscribe to events, stream in real-time |
| 35 | **AGI** | `echo.agi` | Self-improving engine feedback loop, retraining, optimization suggestions |
| 36 | **Compose** | `echo.compose` | Create compound engines with merge, chain, or vote strategies |

## Core Examples

### Engines -- Query Intelligence Engines

```typescript
// Natural language query
const result = await echo.engines.query('What is MACRS depreciation?', 'tax');
console.log(result.response);
console.log(`Confidence: ${result.confidence}`);
console.log(`Doctrines matched: ${result.doctrines_matched}`);

// Batch query multiple questions
const batch = await echo.engines.queryBatch([
  { query: 'What is fracking?', domain: 'oilfield' },
  { query: 'IRC Section 1031 exchange', domain: 'tax' },
]);

// List engines by domain
const engines = await echo.engines.list('tax');

// Search engines by keyword
const matches = await echo.engines.search('depreciation', 10);

// Get engine metadata
const meta = await echo.engines.metadata('PETRO01');

// Get engine capabilities
const caps = await echo.engines.capabilities('PETRO01');
```

### Knowledge -- Search and Ingest Documents

```typescript
// Search the Knowledge Forge
const docs = await echo.knowledge.search('mineral rights Texas', 5);
for (const doc of docs) {
  console.log(`${doc.title} (${doc.category}) - relevance: ${doc.relevance_score}`);
}

// List knowledge categories
const categories = await echo.knowledge.categories();

// Ingest a new document
const { id } = await echo.knowledge.ingest(
  'Permian Basin Overview',
  'The Permian Basin is a sedimentary basin...',
  'oilfield'
);
```

### Brain -- Shared Memory

```typescript
// Store a memory
await echo.brain.ingest('The meeting with the client went well', 8, ['client', 'meeting']);

// Semantic search
const memories = await echo.brain.search('client meetings');

// Key-value store and recall
await echo.brain.store('last_deploy', { version: '3.2.0', timestamp: Date.now() });
const deploy = await echo.brain.recall('last_deploy');

// Get brain statistics
const stats = await echo.brain.stats();
```

### Doctrine -- Generate Domain Knowledge

```typescript
// Generate doctrine blocks for a domain/topic
const result = await echo.doctrine.generate('tax', 'depreciation');
console.log(`Provider: ${result.provider_used}`);
for (const block of result.doctrines) {
  console.log(`[${block.authority_level}] ${block.topic}: ${block.content.slice(0, 100)}...`);
}

// Search existing doctrines
const doctrines = await echo.doctrine.search('mineral rights', 'oilfield');

// List available FREE LLM providers
const providers = await echo.doctrine.providers();
```

### Voice -- Text-to-Speech, Speech-to-Text, Emotion

```typescript
// Synthesize speech
const audioBuffer = await echo.voice.synthesize('Hello from Echo Prime', {
  voice: 'echo',
  emotion: 'excited',
  format: 'mp3',
  speed: 1.0,
});

// Transcribe audio
const transcript = await echo.voice.transcribe(audioBase64, { language: 'en' });
console.log(`Text: ${transcript.text} (confidence: ${transcript.confidence})`);

// Analyze emotion in text
const emotion = await echo.voice.analyzeEmotion('I am so happy about this result!');
console.log(`Dominant: ${emotion.dominant_emotion} (${emotion.confidence})`);

// List available voices
const voices = await echo.voice.listVoices();

// Clone a voice from audio samples
const cloned = await echo.voice.cloneVoice('custom-voice', [sampleBase64], 'My custom voice');

// Orchestrated TTS with quota-aware provider blending
const audio = await echo.voice.orchestrate('Hello world', 'echo', { priority: 'quality' });
```

### Chat -- Conversational AI

```typescript
// Simple message with a personality
const response = await echo.chat.send('Explain quantum computing', {
  personality: 'sage',
  domain: 'science',
  enrichWithEngines: true,
  enrichWithKnowledge: true,
});
console.log(response.message);

// Session-based conversation (auto-manages history)
const session = echo.chat.createSession('echo_prime', 'tax');
const r1 = await echo.chat.sendInSession(session.id, 'What is a 1031 exchange?');
const r2 = await echo.chat.sendInSession(session.id, 'What are the deadlines?');
// r2 has full context of the previous exchange

// List available personalities
const personalities = await echo.chat.listPersonalities();
```

### Forge -- Build Engines, Apps, Workers

```typescript
// Build a new intelligence engine
const engine = await echo.forge.engine({
  domain: 'tax',
  name: 'IRS-Analyzer',
  doctrines: ['depreciation', 'capital-gains'],
});

// Build a doctrine
const doctrine = await echo.forge.doctrine({
  domain: 'legal',
  topic: 'contract-analysis',
  authority_level: 8,
});

// Build an app
const app = await echo.forge.app('web', { name: 'my-dashboard' });

// Build a Cloudflare Worker
const worker = await echo.forge.worker('my-api', { routes: ['/api/*'] });

// Run a full-stack pipeline
const pipeline = await echo.forge.fullStack(
  ['doctrine', 'engine', 'knowledge'],
  { domain: 'legal', topic: 'contract-analysis' }
);
for (const stage of pipeline.results) {
  console.log(`${stage.stage}: ${stage.ok ? 'passed' : 'FAILED'} (${stage.latency_ms}ms)`);
}

// Hephaestion Forge -- advanced engine construction
const heph = await echo.forge.hephaestion({ domain: 'security', tier: 'sovereign' });

// Daedalus Forge -- rapid prototype builds
const proto = await echo.forge.daedalus({ domain: 'finance', experimental: true });

// Forge-X -- cross-platform orchestration
const cross = await echo.forge.forgeX({ targets: ['worker', 'engine', 'app'] });

// Check forge health
const forgeStatus = await echo.forge.status();
console.log(`${forgeStatus.summary.healthy}/${forgeStatus.summary.total} forges healthy`);
```

### LLM -- Unified AI Completions

```typescript
// Simple Claude completion
const resp = await echo.llm.claude('Explain quantum computing in 3 sentences');
console.log(resp.content);
console.log(`Tokens: ${resp.usage.total_tokens}, Latency: ${resp.latency_ms}ms`);

// Any model completion
const gpt = await echo.llm.complete({
  prompt: 'What is machine learning?',
  model: 'gpt-4o',
  max_tokens: 500,
  temperature: 0.7,
});

// Streaming
for await (const chunk of echo.llm.stream({ prompt: 'Write a poem about AI' })) {
  process.stdout.write(chunk);
}

// List available models
const models = await echo.llm.models();
for (const m of models) {
  console.log(`${m.id} (${m.provider}) - ${m.capabilities.join(', ')}`);
}

// Check provider health
const llmStatus = await echo.llm.status();
```

### AGI -- Self-Improving Engines

```typescript
// Submit quality feedback
const fb = await echo.agi.feedback({
  engine_id: 'tax-depreciation-v3',
  query: 'What is MACRS?',
  quality_score: 0.95,
  feedback_text: 'Accurate and well-cited',
});
if (fb.auto_retrain_triggered) {
  console.log('Auto-retrain triggered');
}

// Manual retrain
const job = await echo.agi.retrain('legal-contracts-v2', 'Low quality on indemnification clauses');

// Check learning rate
const rate = await echo.agi.learningRate();
console.log(`Daily improvement: ${rate.daily_improvement}%`);
console.log(`Trend: ${rate.weekly_trend}`);

// Get optimization suggestions
const suggestions = await echo.agi.suggestions();
for (const s of suggestions) {
  console.log(`${s.engine_id}: ${s.recommended_action} (score: ${s.current_score})`);
}
```

### Compose -- Compound Engines

```typescript
// Create a compound engine (chain strategy)
const compound = await echo.compose.create(
  ['tax-depreciation-v3', 'legal-contracts-v2'],
  'tax-legal-combo',
  { strategy: 'chain', description: 'Tax analysis followed by legal review' }
);

// Create a voting ensemble
const ensemble = await echo.compose.create(
  ['tax-v1', 'tax-v2', 'tax-v3'],
  'tax-ensemble',
  { strategy: 'vote', description: 'Best-of-3 tax engine ensemble' }
);

// Query a compound engine
const result = await echo.compose.query(compound.id, 'Analyze 1031 exchange requirements');

// List all compound engines
const compounds = await echo.compose.list();
```

### Webhooks -- Real-Time Event Subscriptions

```typescript
// Register a webhook
const hook = await echo.webhooks.register(
  'https://myapp.com/webhooks',
  ['engine.created', 'build.complete'],
  'my-signing-secret'
);

// Test delivery
const test = await echo.webhooks.test(hook.id);
console.log(`Delivered: ${test.delivered}, Status: ${test.status}`);

// List all webhooks
const hooks = await echo.webhooks.list();

// Stream real-time events
for await (const event of echo.webhooks.events(['engine.*', 'build.*'])) {
  console.log(`[${event.timestamp}] ${event.event}:`, event.data);
}

// Delete a webhook
await echo.webhooks.delete(hook.id);
```

## Error Handling

The SDK provides a structured error hierarchy. All errors extend `EchoError` and carry contextual metadata:

```typescript
import {
  EchoError,
  AuthError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  ValidationError,
  NotFoundError,
  CircuitOpenError,
  ServerError,
} from '@echo-omega-prime/sdk';

try {
  const result = await echo.engines.query('test query');
} catch (err) {
  if (err instanceof AuthError) {
    // 401/403 -- invalid or expired API key
    console.error('Authentication failed:', err.message);
  } else if (err instanceof RateLimitError) {
    // 429 -- retry after delay
    console.error(`Rate limited. Retry after ${err.retryAfterMs}ms`);
  } else if (err instanceof TimeoutError) {
    // 408 -- request timed out (retryable)
    console.error('Request timed out');
  } else if (err instanceof NetworkError) {
    // 0 -- DNS/connection failure (retryable)
    console.error('Network error:', err.message);
  } else if (err instanceof ValidationError) {
    // 400 -- bad input
    console.error(`Validation error on field '${err.field}': ${err.message}`);
  } else if (err instanceof NotFoundError) {
    // 404 -- resource not found
    console.error(err.message);
  } else if (err instanceof CircuitOpenError) {
    // 503 -- circuit breaker open, service temporarily unavailable
    console.error(`Circuit open. Resets at ${new Date(err.resetAtMs).toISOString()}`);
  } else if (err instanceof ServerError) {
    // 5xx -- server-side error (retryable for 500-504)
    console.error(`Server error ${err.status}: ${err.message}`);
  } else if (err instanceof EchoError) {
    // Catch-all for other SDK errors
    console.error(`Echo error [${err.code}]: ${err.message}`);
    console.error('Retryable:', err.retryable);
    console.error('Context:', err.context);
  }
}
```

### Error Properties

Every `EchoError` includes:

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `code` | `string` | Machine-readable error code (e.g., `AUTH_ERROR`, `RATE_LIMITED`) |
| `status` | `number` | HTTP status code (0 for network errors) |
| `retryable` | `boolean` | Whether the request can be retried |
| `context` | `Record<string, unknown>` | Additional structured context |
| `timestamp` | `string` | ISO timestamp of when the error occurred |

### Retry Behavior

The SDK automatically retries on:
- HTTP 429 (Rate Limited)
- HTTP 500, 502, 503, 504 (Server Errors)
- Network failures (DNS, connection refused)

Retry uses exponential backoff with +/-20% jitter. Default: 2 retries with a 500ms base delay.

Client errors (400, 401, 403, 404) are never retried.

### Circuit Breaker

The built-in circuit breaker protects against cascading failures:
- **CLOSED**: Normal operation. Requests flow through.
- **OPEN**: After 5 consecutive failures, all requests are rejected immediately with `CircuitOpenError`.
- **HALF-OPEN**: After the reset timeout (default: 30s), one request is allowed through. Success closes the circuit; failure re-opens it.

```typescript
// Check circuit breaker state
const state = echo.getCircuitState();
console.log(state);

// Reset circuit breaker manually
echo.resetCircuit();
```

## Rate Limits

| Tier | Daily Requests | Price |
|------|---------------|-------|
| **Free** | 100/day | $0/mo |
| **Starter** | 1,000/day | $29/mo |
| **Pro** | 10,000/day | $99/mo |
| **Enterprise** | Unlimited | Custom |

Rate limit headers are returned with every response:
- `X-RateLimit-Limit`: Your daily limit
- `X-RateLimit-Remaining`: Requests remaining today
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

When the limit is exceeded, the SDK throws a `RateLimitError` with a `retryAfterMs` property indicating how long to wait.

## Advanced Configuration

### Custom Gateway URL

```typescript
const echo = new EchoPrime({
  apiKey: 'your-key',
  gatewayUrl: 'https://your-custom-gateway.example.com',
});
```

### Disable Caching

```typescript
const echo = new EchoPrime({
  apiKey: 'your-key',
  cache: false,
});
```

### Custom Logger

```typescript
const echo = new EchoPrime({
  apiKey: 'your-key',
  logger: (entry) => {
    // entry: { level, event, data, ts }
    if (entry.level === 'error') {
      myErrorTracker.capture(entry);
    }
  },
});
```

### Abort Requests

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

const result = await echo.engines.query('test', undefined);
// Pass signal via the underlying client
```

### Unified Search

Search across engines, knowledge, and brain simultaneously:

```typescript
const results = await echo.search('mineral rights in Texas', ['engines', 'knowledge', 'brain']);
for (const r of results) {
  console.log(`Source: ${r.source}, Results: ${r.count}`);
}
```

### Tree Shaking

Import only the modules you need:

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk';

const engines = new EchoEngines({
  apiKey: 'your-key',
  gatewayUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev',
});

const result = await engines.query('What is fracking?');
```

### Cache Management

```typescript
// Clear all cached responses
echo.clearCache();

// Per-request cache control
// (access via underlying module client)
```

## Documentation

- [Quickstart Guide](docs/QUICKSTART.md) -- Get running in 5 minutes
- [Full API Reference](docs/API_REFERENCE.md) -- Complete method signatures for all 36 modules
- [Code Examples](docs/EXAMPLES.md) -- Copy-paste examples for every common task
- [Echo Prime Technologies](https://echo-ept.com/sdk) -- Official documentation website
- [GitHub](https://github.com/ECHO-OMEGA-PRIME/echo-sdk) -- Source code and issues

## License

MIT License. Copyright (c) 2026 Echo Prime Technologies.
