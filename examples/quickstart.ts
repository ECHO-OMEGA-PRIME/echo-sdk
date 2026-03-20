/**
 * Echo Prime SDK — Quickstart Example
 *
 * Install: npm install @echo-prime/sdk
 * Run:     npx tsx examples/quickstart.ts
 *
 * Get your API key at https://echo-ept.com/sdk/signup
 */
import EchoPrime from '@echo-prime/sdk';

const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY || 'demo-key',
});

async function main() {
  // 1. Query an intelligence engine
  console.log('\n--- Engine Query ---');
  const engineResult = await echo.engines.query(
    'What are the tax implications of 1031 exchanges for oil and gas properties?',
    'tax',
  );
  console.log('Response:', engineResult.response);
  console.log('Confidence:', engineResult.confidence);
  console.log('Latency:', engineResult.latency_ms, 'ms');

  // 2. Search the Knowledge Forge
  console.log('\n--- Knowledge Search ---');
  const docs = await echo.knowledge.search('drilling safety procedures', 5);
  for (const doc of docs) {
    console.log(`  [${doc.category}] ${doc.title} (score: ${doc.relevance_score})`);
  }

  // 3. List available engines
  console.log('\n--- Available Engines ---');
  const engines = await echo.engines.list();
  console.log(`${engines.length} engines available across domains`);

  // 4. Store a memory
  console.log('\n--- Brain Memory ---');
  const { id } = await echo.brain.ingest(
    'User explored tax implications of 1031 exchanges',
    7,
    ['tax', '1031', 'oil-gas'],
  );
  console.log('Memory stored:', id);

  // 5. Chat with a personality
  console.log('\n--- Chat ---');
  const chat = await echo.chat('What makes Echo Prime different from ChatGPT wrappers?');
  console.log(`[${chat.personality}] ${chat.message}`);

  // 6. Health check
  console.log('\n--- System Health ---');
  const health = await echo.health();
  console.log(`Status: ${health.status} | Version: ${health.version} | Services: ${health.services}`);
}

main().catch(console.error);
