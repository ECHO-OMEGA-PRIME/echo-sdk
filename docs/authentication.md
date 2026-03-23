# Echo Prime SDK -- Authentication

All requests to the Echo SDK Gateway require an API key sent via the `X-Echo-API-Key` HTTP header. The SDK handles this automatically when you provide your key at initialization.

---

## API Key Authentication

### Initialization

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  apiKey: 'your-api-key',
});
```

Every request made through the SDK includes these headers automatically:

```
X-Echo-API-Key: your-api-key
Content-Type: application/json
X-SDK-Version: 3.4.0
```

### Environment Variables

Never hardcode API keys in source code. Use environment variables:

```bash
export ECHO_API_KEY=your-api-key
```

```typescript
const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY!,
});
```

For Cloudflare Workers, use `wrangler secret`:

```bash
wrangler secret put ECHO_API_KEY
```

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const echo = new EchoPrime({ apiKey: env.ECHO_API_KEY });
    // ...
  },
};
```

## Getting an API Key

1. Visit [echo-ept.com/sdk](https://echo-ept.com/sdk)
2. Create an account or sign in
3. Navigate to **API Keys** in the dashboard
4. Generate a new key and select your plan tier
5. Copy the key -- it will only be shown once

## API Key Validation

The SDK validates your key format at initialization. Keys must be 8-256 characters. If the key is invalid, a `ValidationError` is thrown immediately before any network request:

```typescript
import EchoPrime, { ValidationError } from '@echo-omega-prime/sdk';

try {
  const echo = new EchoPrime({ apiKey: '' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(err.message); // "Invalid API key -- must be 8-256 characters"
  }
}
```

## Rate Limits

Rate limits are enforced per API key based on your subscription tier:

| Tier | Daily Requests | Streaming | Price |
|------|---------------|-----------|-------|
| **Free** | 100/day | No | $0/mo |
| **Starter** | 1,000/day | Yes | $29/mo |
| **Pro** | 10,000/day | Yes | $99/mo |
| **Enterprise** | Unlimited | Yes | Custom |

### Rate Limit Headers

Every API response includes these headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Your daily request limit |
| `X-RateLimit-Remaining` | Requests remaining today |
| `X-RateLimit-Reset` | Unix timestamp when the limit resets |

### Rate Limit Handling

When you exceed your limit, the gateway returns HTTP 429. The SDK throws a `RateLimitError` with a `retryAfterMs` property:

```typescript
import { RateLimitError } from '@echo-omega-prime/sdk';

try {
  const result = await echo.engines.query('test');
} catch (err) {
  if (err instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${err.retryAfterMs}ms`);
    // Wait and retry
    await new Promise(r => setTimeout(r, err.retryAfterMs));
    const result = await echo.engines.query('test');
  }
}
```

The SDK automatically retries on 429 responses with exponential backoff (up to 2 retries by default).

## Error Handling for Auth Errors

### 401 Unauthorized

Thrown when the API key is invalid or missing:

```typescript
import { AuthError } from '@echo-omega-prime/sdk';

try {
  const result = await echo.engines.query('test');
} catch (err) {
  if (err instanceof AuthError) {
    console.error(`Auth failed: ${err.message}`);
    console.error(`Status: ${err.status}`);  // 401
    console.error(`Code: ${err.code}`);      // AUTH_ERROR
    // Auth errors are never retried
    console.error(`Retryable: ${err.retryable}`); // false
  }
}
```

### 403 Forbidden

Thrown when the API key is valid but lacks permission for the requested resource:

```typescript
if (err instanceof AuthError && err.status === 403) {
  console.error('Insufficient permissions for this endpoint');
}
```

### 429 Too Many Requests

```typescript
if (err instanceof RateLimitError) {
  console.error(`Retry after: ${err.retryAfterMs}ms`);
}
```

## Security Best Practices

1. **Never commit API keys to source control.** Use `.env` files (added to `.gitignore`) or secret managers.

2. **Rotate keys periodically.** Generate a new key and update your deployments, then revoke the old key.

3. **Use the minimum tier needed.** Free tier is fine for development and testing.

4. **The SDK redacts keys in logs.** The built-in security module (`redact()`, `maskKey()`, `safeHeaders()`) prevents API keys from leaking into log output.

5. **Timing-safe comparison.** The SDK uses constant-time string comparison (`timingSafeEqual()`) internally to prevent timing attacks on key validation.

6. **Payload validation.** All request bodies are validated against a 1MB size limit before sending.

## Custom Gateway URL

If you run your own SDK Gateway instance:

```typescript
const echo = new EchoPrime({
  apiKey: 'your-key',
  gatewayUrl: 'https://your-custom-gateway.example.com',
});
```

The default gateway is `https://echo-sdk-gateway.bmcii1976.workers.dev`.

## Standalone Module Authentication

When importing individual modules for tree-shaking, pass the same config:

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk/engines';

const engines = new EchoEngines({
  apiKey: process.env.ECHO_API_KEY!,
  gatewayUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev',
});
```

For modules with their own config types (`ForgeClient`, `LLMClient`, `AGIClient`, `ComposeClient`, `WebhookClient`):

```typescript
import { LLMClient } from '@echo-omega-prime/sdk/llm';

const llm = new LLMClient({
  apiKey: process.env.ECHO_API_KEY!,
  baseUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev',
  defaultModel: 'claude-opus-4-20250514',
});
```
