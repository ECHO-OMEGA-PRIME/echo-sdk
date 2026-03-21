# @echo-prime/sdk

The official TypeScript SDK for **Echo Prime Technologies** — 2,600+ intelligence engines, AI chat with 14 personalities, voice synthesis, knowledge search, brain memory, credential vault, autonomous bots, scrapers, agents, and 37,000+ tools.

**Zero dependencies. Tree-shakeable. Works everywhere.**

## Installation

```bash
npm install @echo-prime/sdk
```

## Quick Start

```typescript
import EchoPrime from '@echo-prime/sdk';

const echo = new EchoPrime({
  apiKey: 'your-api-key',
  // baseUrl defaults to https://echo-sdk-gateway.bmcii1976.workers.dev
});

// Query 2,600+ intelligence engines
const results = await echo.engines.query('What are MACRS depreciation rules for oil wells?', 'tax');

// Search the Knowledge Forge (5,300+ documents)
const docs = await echo.knowledge.search('Cloudflare Workers best practices');

// AI chat with 14 personalities
const reply = await echo.chat.send('Analyze this contract for risk factors', {
  personality: 'nexus',
});

// Health check
const status = await echo.health();
console.log(status); // { status: 'ok', engines: 2632, ... }
```

## Modules

Import the full SDK or only the modules you need:

```typescript
// Full SDK (tree-shakes unused modules)
import EchoPrime from '@echo-prime/sdk';

// Individual modules (smallest bundle)
import { EchoEngines } from '@echo-prime/sdk/engines';
import { EchoVoice } from '@echo-prime/sdk/voice';
import { EchoChat } from '@echo-prime/sdk/chat';
```

### Engines — 2,600+ Intelligence Engines

Query domain-specific AI reasoning systems across 210+ domains: tax, legal, oilfield, medical, finance, cybersecurity, and more. Not wrappers — embedded domain expertise with doctrine-backed responses.

```typescript
import { EchoEngines } from '@echo-prime/sdk/engines';

const engines = new EchoEngines({ apiKey: 'your-key' });

// Single query
const result = await engines.query('What is the safe harbor for underpayment penalties?', 'tax');

// Batch queries
const batch = await engines.queryBatch([
  { query: 'IRC Section 1031 exchange rules', domain: 'tax' },
  { query: 'Force majeure in oil leases', domain: 'legal' },
]);

// List engines by domain
const taxEngines = await engines.list('tax');

// Full-text search across all engines
const matches = await engines.search('depreciation');
```

### Knowledge — 5,300+ Documents

Search and ingest documents across 140+ categories.

```typescript
import { EchoKnowledge } from '@echo-prime/sdk/knowledge';

const knowledge = new EchoKnowledge({ apiKey: 'your-key' });

const results = await knowledge.search('Cloudflare D1 migration patterns');
const categories = await knowledge.categories();
await knowledge.ingest('My Document', 'Document content...', 'engineering');
```

### Brain — Infinite Memory

Cross-session semantic memory. Store decisions, recall context, search across all memories.

```typescript
import { EchoBrain } from '@echo-prime/sdk/brain';

const brain = new EchoBrain({ apiKey: 'your-key' });

await brain.ingest('Decided to use Hono router for all Workers', 8, ['architecture']);
const memories = await brain.search('router decision');
await brain.store('project-config', { framework: 'hono', runtime: 'workers' });
const config = await brain.recall('project-config');
```

### Doctrine — Domain Expertise Generation

Generate doctrine blocks using 24 FREE LLM providers. Real domain expertise, not generic text.

```typescript
import { EchoDoctrine } from '@echo-prime/sdk/doctrine';

const doctrine = new EchoDoctrine({ apiKey: 'your-key' });

const result = await doctrine.generate('tax', 'MACRS depreciation');
console.log(result.doctrines); // Structured doctrine blocks
console.log(result.provider_used); // Which LLM was used

const providers = await doctrine.providers();
const taxDoctrines = await doctrine.search('depreciation', 'tax');
```

### Voice — TTS, STT, Emotion

6 voice personalities, 19 emotions, voice cloning, speech-to-text.

```typescript
import { EchoVoice } from '@echo-prime/sdk/voice';

const voice = new EchoVoice({ apiKey: 'your-key' });

// Text-to-speech
const audio = await voice.synthesize('Hello from Echo Prime', {
  voice: 'echo',
  emotion: 'confident',
  format: 'mp3',
});

// Speech-to-text
const transcript = await voice.transcribe(audioBuffer, { language: 'en' });

// Emotion analysis
const emotions = await voice.analyzeEmotion('I am thrilled about this result!');

// Voice cloning
const cloned = await voice.cloneVoice('my-voice', audioSamples);
```

### Chat — 14 AI Personalities

Conversational AI with session management and personality switching.

```typescript
import { EchoChat } from '@echo-prime/sdk/chat';

const chat = new EchoChat({ apiKey: 'your-key' });

// Quick message
const reply = await chat.send('Explain quantum computing');

// With personality
const analysis = await chat.send('Analyze this network traffic', {
  personality: 'prometheus', // Security-focused
  temperature: 0.3,
});

// Session management (maintains conversation context)
const session = chat.createSession({ personality: 'nexus' });
const r1 = await chat.sendInSession(session, 'Write a binary search in Rust');
const r2 = await chat.sendInSession(session, 'Now add error handling');
```

**Available personalities:** `echo_prime`, `bree`, `raven`, `sage`, `thinker`, `nexus`, `gs343`, `phoenix`, `prometheus`, `belle`, `tech_expert`, `warmaster`, `r2`, `third_person`

### Vault — Credential Management

Secure credential storage, search, and rotation.

```typescript
import { EchoVault } from '@echo-prime/sdk/vault';

const vault = new EchoVault({ apiKey: 'your-key' });

await vault.store('aws-prod', 'admin', 's3cr3t', { category: 'cloud', notes: 'Production' });
const cred = await vault.get('aws-prod');
const results = await vault.search('aws');
const health = await vault.health(); // Breach check, strength scoring
```

### Tools — 37,000+ MCP Tools

Search and execute tools from the MEGA Gateway.

```typescript
import { EchoTools } from '@echo-prime/sdk/tools';

const tools = new EchoTools({ apiKey: 'your-key' });

const matches = await tools.search('pdf');
const result = await tools.execute('tool-id', { input: 'data' });
const categories = await tools.categories();
```

### Agent — Autonomous AI Agents

Create and manage long-running autonomous agents.

```typescript
import { EchoAgent } from '@echo-prime/sdk/agent';

const agent = new EchoAgent({ apiKey: 'your-key' });

const config = await agent.create({
  name: 'research-agent',
  description: 'Monitors competitor pricing',
  instructions: 'Check pricing pages daily and report changes',
  schedule: '0 9 * * *',
});

const run = await agent.run(config.id, { target: 'competitor.com' });
const status = await agent.status(run.id);
```

### Scraper — Web Data Extraction

Configure and run scrapers with rate limiting and proxy rotation.

```typescript
import { EchoScraper } from '@echo-prime/sdk/scraper';

const scraper = new EchoScraper({ apiKey: 'your-key' });

const config = await scraper.create({
  name: 'court-records',
  target_url: 'https://records.county.gov',
  selectors: { title: 'h2.case-title', date: '.filing-date' },
  schedule: '0 */6 * * *',
  rate_limit: { requests_per_second: 2 },
});

const job = await scraper.run(config.id);
const records = await scraper.records(config.id, 100);
```

### Bot — Social Media Automation

Deploy bots across 9 platforms with 14 AI personalities.

```typescript
import { EchoBot } from '@echo-prime/sdk/bot';

const bot = new EchoBot({ apiKey: 'your-key' });

const config = await bot.create({
  name: 'twitter-presence',
  platform: 'twitter',
  personality: 'echo_prime',
  schedule: { posts_per_day: 4 },
  content_categories: ['ai_tech', 'industry', 'builds'],
});

await bot.post(config.id, { content: 'Just shipped 50 new engines.' });
const stats = await bot.stats(config.id);
```

**Platforms:** `discord`, `twitter`, `telegram`, `linkedin`, `whatsapp`, `messenger`, `slack`, `reddit`, `instagram`

### Monitoring — Request Telemetry

Local request metrics — no API calls, runs entirely in-process.

```typescript
import { EchoMonitor } from '@echo-prime/sdk/monitoring';

const monitor = new EchoMonitor();

monitor.record({
  endpoint: '/engines/query',
  method: 'POST',
  status: 200,
  latency_ms: 142,
  cached: false,
});

const summary = monitor.summarize();
// { total_requests, error_rate, avg_latency, p95_latency, p99_latency, ... }
```

## Configuration

```typescript
import EchoPrime from '@echo-prime/sdk';

const echo = new EchoPrime({
  // Required
  apiKey: 'your-api-key',

  // Optional
  baseUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev', // default
  timeout: 30_000,           // Request timeout in ms (default: 30s)
  maxRetries: 2,             // Retry attempts (default: 2)
  cache: {                   // Response cache
    maxSize: 200,            // Max cached entries (default: 200)
    ttl: 300_000,            // Cache TTL in ms (default: 5min)
  },
  circuitBreaker: {          // Circuit breaker
    threshold: 5,            // Failures before opening (default: 5)
    resetTimeout: 60_000,    // Time before half-open (default: 60s)
  },
});
```

## Resilience

Built-in resilience with zero configuration:

- **Automatic retries** — 3 attempts with exponential backoff and jitter
- **Circuit breaker** — Opens after 5 failures, half-opens after 60s
- **Response cache** — LRU cache with TTL for GET requests
- **Timeout protection** — Configurable per-request timeouts
- **Error hierarchy** — Typed errors for precise catch handling

```typescript
import { AuthError, RateLimitError, CircuitOpenError } from '@echo-prime/sdk/errors';

try {
  await echo.engines.query('test', 'tax');
} catch (e) {
  if (e instanceof AuthError) console.log('Invalid API key');
  if (e instanceof RateLimitError) console.log(`Retry after ${e.retryAfter}s`);
  if (e instanceof CircuitOpenError) console.log('Circuit open, backing off');
}

// Circuit breaker state
echo.getCircuitState(); // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
echo.resetCircuit();    // Force reset
echo.clearCache();      // Flush response cache
```

## Security Utilities

```typescript
import { redact, validateApiKey, maskKey, timingSafeEqual } from '@echo-prime/sdk';

redact('my-secret');          // 'my-***ret'
validateApiKey('echo-...');   // true/false
maskKey('sk_live_abc123');    // 'sk_l****123'
```

## Compatibility

| Runtime | Version |
|---------|---------|
| Node.js | 18+ |
| Deno | 1.40+ |
| Bun | 1.0+ |
| Cloudflare Workers | Yes |
| Browsers | Modern (with fetch) |

## Zero Dependencies

This SDK has **zero runtime dependencies**. It uses native `fetch`, native `crypto.subtle`, and ships its own retry logic, circuit breaker, and cache. The only dev dependencies are `tsup` and `typescript`.

## License

MIT — [Echo Prime Technologies](https://echo-ept.com)
