/**
 * Echo Prime SDK — Tree-Shaking Example
 *
 * Import only the modules you need to minimize bundle size.
 * Each subpath export is independently tree-shakeable.
 */
import { EchoEngines } from '@echo-prime/sdk/engines';
import { EchoKnowledge } from '@echo-prime/sdk/knowledge';

const config = {
  apiKey: process.env.ECHO_API_KEY || 'demo-key',
};

async function main() {
  // Only engines and knowledge — no brain, no doctrine, smaller bundle
  const engines = new EchoEngines(config);
  const knowledge = new EchoKnowledge(config);

  // Search engines by keyword
  const matches = await engines.search('cybersecurity', 5);
  console.log('Found engines:', matches.map(e => `${e.name} (${e.domain})`));

  // Get engine capabilities
  if (matches.length > 0) {
    const caps = await engines.capabilities(matches[0].engine_id);
    console.log('Capabilities:', caps);
  }

  // Knowledge categories
  const categories = await knowledge.categories();
  console.log(`${categories.length} knowledge categories available`);
}

main().catch(console.error);
