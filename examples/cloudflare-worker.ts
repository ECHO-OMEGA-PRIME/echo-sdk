/**
 * Echo Prime SDK — Cloudflare Worker Integration
 *
 * Use the SDK inside your own Cloudflare Workers.
 * The SDK uses standard fetch() — works in Workers, Deno, Bun, Node 18+.
 */
import EchoPrime from '@echo-prime/sdk';

interface Env {
  ECHO_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const echo = new EchoPrime({ apiKey: env.ECHO_API_KEY });
    const url = new URL(request.url);

    // Route: /ask?q=...&domain=...
    if (url.pathname === '/ask') {
      const question = url.searchParams.get('q');
      if (!question) {
        return Response.json({ error: 'Missing ?q= parameter' }, { status: 400 });
      }
      const domain = url.searchParams.get('domain') || undefined;
      const result = await echo.engines.query(question, domain);
      return Response.json({
        answer: result.response,
        confidence: result.confidence,
        engine: result.engine_id,
        domain: result.domain,
        latency_ms: result.latency_ms,
      });
    }

    // Route: /search?q=...
    if (url.pathname === '/search') {
      const query = url.searchParams.get('q');
      if (!query) {
        return Response.json({ error: 'Missing ?q= parameter' }, { status: 400 });
      }
      const results = await echo.knowledge.search(query, 5);
      return Response.json({ results });
    }

    // Route: /engines
    if (url.pathname === '/engines') {
      const engines = await echo.engines.list();
      return Response.json({ count: engines.length, engines });
    }

    // Route: /health
    if (url.pathname === '/health') {
      const health = await echo.health();
      return Response.json(health);
    }

    return Response.json({ error: 'Not found', routes: ['/ask', '/search', '/engines', '/health'] }, { status: 404 });
  },
};
