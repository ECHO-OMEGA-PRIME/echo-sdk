# Echo Prime SDK -- 5-Minute Quickstart

Get from zero to querying 2,600+ intelligence engines in under 5 minutes.

## Prerequisites

- Node.js 18+ (or Bun, Deno, or Cloudflare Workers)
- An Echo Prime API key (get one at [echo-ept.com/sdk](https://echo-ept.com/sdk))

## Step 1: Install

```bash
npm install @echo-omega-prime/sdk
```

Or with other package managers:

```bash
# yarn
yarn add @echo-omega-prime/sdk

# pnpm
pnpm add @echo-omega-prime/sdk

# bun
bun add @echo-omega-prime/sdk
```

## Step 2: Initialize

Create a file called `demo.ts`:

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY || 'your-api-key-here',
});
```

The `gatewayUrl` defaults to `https://echo-sdk-gateway.bmcii1976.workers.dev` so you do not need to specify it.

## Step 3: Query an Engine

```typescript
const result = await echo.engines.query('What is fracking?', 'oilfield');
console.log(result.response);
console.log(`Confidence: ${result.confidence}`);
console.log(`Doctrines matched: ${result.doctrines_matched}`);
console.log(`Latency: ${result.latency_ms}ms`);
```

## Step 4: Search the Knowledge Base

```typescript
const docs = await echo.knowledge.search('mineral rights Texas');
for (const doc of docs) {
  console.log(`${doc.title} [${doc.category}] score: ${doc.relevance_score}`);
}
```

## Step 5: Chat with an AI Personality

```typescript
const response = await echo.chat.send('Explain quantum computing simply', {
  personality: 'sage',
  enrichWithEngines: true,
});
console.log(response.message);
```

## Full Working Example

Here is a complete file you can run immediately:

```typescript
// demo.ts
import EchoPrime from '@echo-omega-prime/sdk';

async function main() {
  const echo = new EchoPrime({
    apiKey: process.env.ECHO_API_KEY || 'your-api-key-here',
  });

  // 1. Check gateway health
  const health = await echo.health();
  console.log(`Gateway: ${health.status} | Services: ${health.services} | Uptime: ${health.uptime_ms}ms`);

  // 2. Query an intelligence engine
  const engineResult = await echo.engines.query('What is MACRS depreciation?', 'tax');
  console.log('\n--- Engine Query ---');
  console.log(engineResult.response);

  // 3. Search the knowledge base
  const knowledge = await echo.knowledge.search('depreciation schedules', 3);
  console.log('\n--- Knowledge Search ---');
  for (const doc of knowledge) {
    console.log(`  ${doc.title} (${doc.category})`);
  }

  // 4. Generate doctrine
  const doctrine = await echo.doctrine.generate('tax', 'depreciation');
  console.log('\n--- Doctrine Generation ---');
  console.log(`Provider: ${doctrine.provider_used}`);
  console.log(`Blocks: ${doctrine.doctrines.length}`);

  // 5. LLM completion
  const llmResponse = await echo.llm.claude('Summarize Section 179 deductions in 2 sentences');
  console.log('\n--- LLM Response ---');
  console.log(llmResponse.content);

  // 6. Unified search across everything
  const searchResults = await echo.search('mineral rights');
  console.log('\n--- Unified Search ---');
  for (const r of searchResults) {
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

Instead of hardcoding your API key, use environment variables:

```bash
export ECHO_API_KEY=your-api-key
```

```typescript
const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY!,
});
```

## Using Individual Modules

If you only need one module, import it directly for smaller bundle size:

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk';

const engines = new EchoEngines({
  apiKey: process.env.ECHO_API_KEY!,
});

const result = await engines.query('What is fracking?');
```

## Error Handling

Always wrap SDK calls in try/catch:

```typescript
import EchoPrime, { AuthError, RateLimitError } from '@echo-omega-prime/sdk';

const echo = new EchoPrime({ apiKey: 'your-key' });

try {
  const result = await echo.engines.query('test');
  console.log(result.response);
} catch (err) {
  if (err instanceof AuthError) {
    console.error('Invalid API key. Get one at https://echo-ept.com/sdk');
  } else if (err instanceof RateLimitError) {
    console.error(`Rate limited. Retry in ${err.retryAfterMs / 1000} seconds`);
  } else {
    console.error('Unexpected error:', err);
  }
}
```

## Cloudflare Workers

The SDK works in Cloudflare Workers with zero changes:

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const echo = new EchoPrime({ apiKey: env.ECHO_API_KEY });
    const result = await echo.engines.query('What is fracking?', 'oilfield');
    return Response.json(result);
  },
};
```

## What's Next?

- [Full API Reference](API_REFERENCE.md) -- Every method signature for all 36 modules
- [Code Examples](EXAMPLES.md) -- Copy-paste examples for common tasks
- [Main README](../README.md) -- Configuration options, error handling, rate limits
- [echo-ept.com/sdk](https://echo-ept.com/sdk) -- Official documentation website
