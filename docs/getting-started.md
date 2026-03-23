# Echo Prime SDK -- Getting Started

Get from zero to querying 5,400+ intelligence engines in under 5 minutes.

**SDK:** `@echo-omega-prime/sdk` v3.4.0
**Gateway:** `https://echo-sdk-gateway.bmcii1976.workers.dev`
**Runtime:** Node.js 18+ / Bun / Deno / Cloudflare Workers
**Dependencies:** Zero

---

## Install

```bash
npm install @echo-omega-prime/sdk
```

```bash
# yarn
yarn add @echo-omega-prime/sdk

# pnpm
pnpm add @echo-omega-prime/sdk

# bun
bun add @echo-omega-prime/sdk
```

## Initialize

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY || 'your-api-key',
});
```

The `gatewayUrl` defaults to `https://echo-sdk-gateway.bmcii1976.workers.dev`. No need to set it unless you run a custom gateway.

## Query an Engine

```typescript
const result = await echo.engines.query('What is MACRS depreciation?', 'tax');
console.log(result.response);
console.log(`Confidence: ${result.confidence}`);
console.log(`Doctrines matched: ${result.doctrines_matched}`);
console.log(`Latency: ${result.latency_ms}ms`);
```

## Search Knowledge

```typescript
const docs = await echo.knowledge.search('drilling regulations');
for (const doc of docs) {
  console.log(`${doc.title} [${doc.category}] score: ${doc.relevance_score}`);
}
```

## Use an LLM

```typescript
const resp = await echo.llm.complete({
  prompt: 'Summarize this contract clause about indemnification...',
  model: 'gpt-4o',
  max_tokens: 500,
});
console.log(resp.content);
console.log(`Tokens: ${resp.usage.total_tokens}`);
```

Or use Claude directly:

```typescript
const resp = await echo.llm.claude('Explain Section 179 deductions in 2 sentences');
console.log(resp.content);
```

## Chat with AI Personalities

```typescript
const response = await echo.chat.send('Explain quantum computing simply', {
  personality: 'sage',
  enrichWithEngines: true,
  enrichWithKnowledge: true,
});
console.log(response.message);
```

## Tree-Shaking

Import only the modules you need for smaller bundles:

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk/engines';
import { LLMClient } from '@echo-omega-prime/sdk/llm';
import { EchoKnowledge } from '@echo-omega-prime/sdk/knowledge';

const engines = new EchoEngines({
  apiKey: process.env.ECHO_API_KEY!,
  gatewayUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev',
});

const result = await engines.query('What is fracking?', 'oilfield');
```

All 43 modules have their own entry point (`@echo-omega-prime/sdk/<module>`).

## Full Working Example

```typescript
// demo.ts
import EchoPrime from '@echo-omega-prime/sdk';

async function main() {
  const echo = new EchoPrime({
    apiKey: process.env.ECHO_API_KEY!,
  });

  // 1. Health check
  const health = await echo.health();
  console.log(`Gateway: ${health.status} | Services: ${health.services}`);

  // 2. Engine query
  const engineResult = await echo.engines.query('What is MACRS depreciation?', 'tax');
  console.log('\n--- Engine ---');
  console.log(engineResult.response);

  // 3. Knowledge search
  const knowledge = await echo.knowledge.search('depreciation schedules', 3);
  console.log('\n--- Knowledge ---');
  for (const doc of knowledge) {
    console.log(`  ${doc.title} (${doc.category})`);
  }

  // 4. Doctrine generation
  const doctrine = await echo.doctrine.generate('tax', 'depreciation');
  console.log(`\n--- Doctrine (${doctrine.provider_used}) ---`);
  console.log(`${doctrine.doctrines.length} blocks generated`);

  // 5. LLM
  const llm = await echo.llm.claude('Summarize Section 179 in 2 sentences');
  console.log('\n--- LLM ---');
  console.log(llm.content);

  // 6. Unified search
  const results = await echo.search('mineral rights');
  console.log('\n--- Unified Search ---');
  for (const r of results) {
    console.log(`  ${r.source}: ${r.count} results`);
  }
}

main().catch(console.error);
```

Run it:

```bash
ECHO_API_KEY=your-key npx tsx demo.ts
```

## Environment Variables

```bash
export ECHO_API_KEY=your-api-key
```

```typescript
const echo = new EchoPrime({ apiKey: process.env.ECHO_API_KEY! });
```

## Cloudflare Workers

Zero changes needed. The SDK has zero Node.js-specific dependencies:

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const echo = new EchoPrime({ apiKey: env.ECHO_API_KEY });
    const result = await echo.engines.query('contract liability', 'legal');
    return Response.json(result);
  },
};
```

## Error Handling

```typescript
import EchoPrime, { AuthError, RateLimitError } from '@echo-omega-prime/sdk';

try {
  const result = await echo.engines.query('test');
} catch (err) {
  if (err instanceof AuthError) {
    console.error('Invalid API key');
  } else if (err instanceof RateLimitError) {
    console.error(`Rate limited. Retry in ${err.retryAfterMs / 1000}s`);
  } else {
    console.error('Error:', err);
  }
}
```

## Next Steps

- [API Reference](api-reference.md) -- Full method signatures for all 43 modules
- [Authentication](authentication.md) -- API keys, rate limits, security
- [Examples](examples.md) -- Copy-paste code for common tasks
- [echo-ept.com/sdk](https://echo-ept.com/sdk) -- Official docs
