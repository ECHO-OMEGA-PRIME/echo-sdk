# @echo-prime/sdk

Official TypeScript/JavaScript SDK for [Echo Prime Technologies](https://echo-ept.com) — access 2,600+ intelligence engines, knowledge search, brain memory, and doctrine generation.

## Install

```bash
npm install @echo-prime/sdk
```

## Quick Start

```typescript
import EchoPrime from '@echo-prime/sdk';

const echo = new EchoPrime({
  apiKey: 'your-api-key',
});

// Query an intelligence engine
const result = await echo.engines.query('What are MACRS depreciation rules for oil wells?', 'tax');
console.log(result.response, result.confidence);

// Search the Knowledge Forge
const docs = await echo.knowledge.search('drilling safety procedures');

// Store and recall memories
await echo.brain.ingest('Important decision about pipeline routing', 9, ['infrastructure']);
const memories = await echo.brain.search('pipeline decisions');

// Generate domain doctrines
const { doctrines } = await echo.doctrine.generate('legal', 'contract_disputes');

// Chat with an AI personality
const chat = await echo.chat('Explain quantum computing', 'nexus');

// Unified search across all sources
const results = await echo.search('cybersecurity best practices');
```

## Tree-Shakeable Imports

Import only what you need:

```typescript
import { EchoEngines } from '@echo-prime/sdk/engines';
import { EchoKnowledge } from '@echo-prime/sdk/knowledge';
import { EchoBrain } from '@echo-prime/sdk/brain';
import { EchoDoctrine } from '@echo-prime/sdk/doctrine';
```

## Configuration

```typescript
const echo = new EchoPrime({
  apiKey: 'your-api-key',          // Required
  gatewayUrl: 'https://...',       // Optional — defaults to Echo SDK Gateway
  timeout: 30000,                  // Optional — request timeout in ms (default: 30s)
  retries: 2,                      // Optional — retry count for server errors (default: 2)
});
```

## Modules

### Engines — 2,600+ Intelligence Engines

```typescript
echo.engines.query(question, domain?)        // Natural language query
echo.engines.queryBatch(queries)             // Batch multiple questions
echo.engines.list(domain?)                   // List available engines
echo.engines.search(query, limit?)           // Search engines by keyword
echo.engines.metadata(engineId)              // Engine metadata
echo.engines.capabilities(engineId)          // Engine capabilities
echo.engines.status()                        // Runtime status
```

### Knowledge — 5,300+ Documents

```typescript
echo.knowledge.search(query, limit?)         // Semantic search
echo.knowledge.categories()                  // List categories
echo.knowledge.ingest(title, content, cat)   // Ingest new document
```

### Brain — Infinite Memory

```typescript
echo.brain.ingest(content, importance, tags) // Store memory
echo.brain.search(query, limit?)             // Semantic recall
echo.brain.recall(key)                       // Key-value recall
echo.brain.store(key, value)                 // Key-value store
echo.brain.stats()                           // Memory statistics
```

### Doctrine — AI-Generated Domain Expertise

```typescript
echo.doctrine.generate(domain, topic, provider?) // Generate doctrines
echo.doctrine.list(domain?)                       // List doctrines
echo.doctrine.providers()                         // Available LLM providers
echo.doctrine.search(query, domain?, limit?)      // Search doctrines
```

## Error Handling

```typescript
import { EchoError } from '@echo-prime/sdk';

try {
  await echo.engines.query('test');
} catch (err) {
  if (err instanceof EchoError) {
    console.error(err.message, err.code, err.status);
  }
}
```

## Requirements

- Node.js 18+
- Any runtime with `fetch` (Node 18+, Deno, Bun, Cloudflare Workers, browsers)

## License

MIT — Echo Prime Technologies
