# Echo Prime SDK -- Code Examples

Copy-paste code examples for every common task. All examples assume you have initialized the SDK:

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  apiKey: process.env.ECHO_API_KEY!,
});
```

---

## Table of Contents

1. [Query an Engine](#1-query-an-engine)
2. [Search the Knowledge Base](#2-search-the-knowledge-base)
3. [Generate Doctrines](#3-generate-doctrines)
4. [Use AI Chat](#4-use-ai-chat)
5. [Create a Bot](#5-create-a-bot)
6. [Set Up Webhooks](#6-set-up-webhooks)
7. [Use LLM Routing](#7-use-llm-routing)
8. [Create Compound Engines](#8-create-compound-engines)
9. [Use AGI Self-Learning](#9-use-agi-self-learning)
10. [Monitor with Forge](#10-monitor-with-forge)
11. [Voice Synthesis and Transcription](#11-voice-synthesis-and-transcription)
12. [Shared Brain Memory](#12-shared-brain-memory)
13. [Autonomous Agents](#13-autonomous-agents)
14. [Web Scraping](#14-web-scraping)
15. [Dark Web Intelligence](#15-dark-web-intelligence)
16. [Crypto Trading](#16-crypto-trading)
17. [News Monitoring with Sentiment](#17-news-monitoring-with-sentiment)
18. [SEC Filing Watchlist](#18-sec-filing-watchlist)
19. [Landman Title Investigation](#19-landman-title-investigation)
20. [Knowledge Graph (GraphRAG)](#20-knowledge-graph-graphrag)
21. [Swarm Coordination and MoltBook](#21-swarm-coordination-and-moltbook)
22. [Fleet Management](#22-fleet-management)
23. [Workflow Automation](#23-workflow-automation)
24. [Multi-Channel Notifications](#24-multi-channel-notifications)
25. [Vault Credential Management](#25-vault-credential-management)
26. [Permanent Memory (Memory Prime)](#26-permanent-memory-memory-prime)
27. [Reddit Monitoring](#27-reddit-monitoring)
28. [Price Alerts](#28-price-alerts)
29. [Custom Model Hosting](#29-custom-model-hosting)
30. [Knowledge Harvesting](#30-knowledge-harvesting)
31. [County Record Scanning](#31-county-record-scanning)
32. [MEGA Gateway Tool Execution](#32-mega-gateway-tool-execution)
33. [SDK Self-Discovery](#33-sdk-self-discovery)
34. [Error Handling Patterns](#34-error-handling-patterns)
35. [Streaming LLM Responses](#35-streaming-llm-responses)
36. [Full Application: Intelligence Pipeline](#36-full-application-intelligence-pipeline)

---

## 1. Query an Engine

```typescript
// Simple query
const result = await echo.engines.query('What is fracking?', 'oilfield');
console.log(result.response);
console.log(`Confidence: ${result.confidence}`);
console.log(`Engine: ${result.engine_id}`);
console.log(`Doctrines: ${result.doctrines_matched}`);
console.log(`Latency: ${result.latency_ms}ms`);

// Batch queries for parallel processing
const batch = await echo.engines.queryBatch([
  { query: 'What is MACRS depreciation?', domain: 'tax' },
  { query: 'Explain horizontal drilling', domain: 'oilfield' },
  { query: 'What is a 1031 exchange?', domain: 'tax' },
  { query: 'Define force majeure', domain: 'legal' },
]);

for (const r of batch) {
  console.log(`[${r.domain}] ${r.response.slice(0, 100)}... (confidence: ${r.confidence})`);
}

// Browse available engines
const taxEngines = await echo.engines.list('tax');
console.log(`Found ${taxEngines.length} tax engines:`);
for (const e of taxEngines) {
  console.log(`  ${e.engine_id}: ${e.name} (${e.doctrine_count} doctrines)`);
}

// Search for engines by keyword
const searchResults = await echo.engines.search('mineral rights', 5);
for (const e of searchResults) {
  console.log(`${e.engine_id} - ${e.description}`);
}
```

## 2. Search the Knowledge Base

```typescript
// Search with relevance scoring
const docs = await echo.knowledge.search('oil and gas lease provisions', 10);
for (const doc of docs) {
  console.log(`[${doc.relevance_score.toFixed(2)}] ${doc.title}`);
  console.log(`  Category: ${doc.category}`);
  console.log(`  Preview: ${doc.content.slice(0, 150)}...`);
  console.log();
}

// Browse categories
const categories = await echo.knowledge.categories();
console.log('Knowledge categories:');
for (const cat of categories) {
  console.log(`  ${cat.name}: ${cat.doc_count} documents`);
}

// Ingest your own document
const { id } = await echo.knowledge.ingest(
  'Internal Revenue Code Section 179',
  `Section 179 of the Internal Revenue Code allows businesses to deduct
   the full purchase price of qualifying equipment and software purchased
   or financed during the tax year. The deduction limit for 2025 is
   $1,220,000 with a spending cap of $3,050,000...`,
  'tax'
);
console.log(`Document ingested with ID: ${id}`);
```

## 3. Generate Doctrines

```typescript
// Generate doctrine blocks for a topic
const result = await echo.doctrine.generate('tax', 'capital gains');
console.log(`Generated ${result.doctrines.length} doctrines via ${result.provider_used}`);
for (const d of result.doctrines) {
  console.log(`\n--- ${d.topic} (Authority: ${d.authority_level}) ---`);
  console.log(d.content);
}

// Use a specific provider
const groqResult = await echo.doctrine.generate('legal', 'contract law', 'groq');
console.log(`Provider: ${groqResult.provider_used}`);

// List available providers
const providers = await echo.doctrine.providers();
console.log('\nAvailable providers:');
for (const p of providers) {
  console.log(`  ${p.name}: ${p.status}`);
}

// Search existing doctrines
const existingDoctrines = await echo.doctrine.search('depreciation', 'tax', 20);
console.log(`\nFound ${existingDoctrines.length} existing doctrines on depreciation`);
```

## 4. Use AI Chat

```typescript
// Simple chat with different personalities
const sage = await echo.chat.send('What causes inflation?', {
  personality: 'sage',
  domain: 'economics',
});
console.log(`[Sage] ${sage.message}`);

const gs343 = await echo.chat.send('Analyze the security posture of a typical SaaS app', {
  personality: 'gs343',
  domain: 'security',
  enrichWithEngines: true,
});
console.log(`[GS343] ${gs343.message}`);

// Conversational session with memory
const session = echo.chat.createSession('echo_prime', 'tax');
console.log(`Session ID: ${session.id}`);

const r1 = await echo.chat.sendInSession(session.id, 'What is Section 1031?');
console.log(`Echo: ${r1.message}`);

const r2 = await echo.chat.sendInSession(session.id, 'What are the time limits?');
console.log(`Echo: ${r2.message}`);

const r3 = await echo.chat.sendInSession(session.id, 'Can you use it for personal property?');
console.log(`Echo: ${r3.message}`);

// The session tracks full history automatically
const sessionData = echo.chat.getSession(session.id);
console.log(`Messages in session: ${sessionData?.messages.length}`);

// Chat with engine and knowledge enrichment
const enriched = await echo.chat.send('Explain mineral rights in the Permian Basin', {
  personality: 'tech_expert',
  domain: 'oilfield',
  enrichWithEngines: true,
  enrichWithKnowledge: true,
  maxTokens: 2000,
  temperature: 0.3,
});
console.log(enriched.message);
console.log(`Engines consulted: ${enriched.engines_consulted}`);
console.log(`Knowledge chunks: ${enriched.knowledge_chunks}`);

// List available personalities
const personalities = await echo.chat.listPersonalities();
for (const p of personalities) {
  console.log(`${p.id}: ${p.name} - ${p.description}`);
}
```

## 5. Create a Bot

```typescript
// Create a Discord bot with auto-posting
const discordBot = await echo.bot.create({
  name: 'echo-news-bot',
  platform: 'discord',
  personality: 'echo_prime',
  domains: ['technology', 'ai'],
  schedule: ['0 9 * * *', '0 15 * * *'],  // 9am and 3pm daily
  contentWeights: {
    'industry_news': 40,
    'analysis': 30,
    'tips': 20,
    'humor': 10,
  },
  abTesting: true,
});
console.log(`Bot created: ${discordBot.id} (${discordBot.status})`);

// Create an X (Twitter) bot
const xBot = await echo.bot.create({
  name: 'echo-x-bot',
  platform: 'x',
  personality: 'raven',
  domains: ['oilfield', 'energy'],
  schedule: ['0 8 * * *', '0 12 * * *', '0 17 * * *'],
  contentWeights: {
    'market_analysis': 50,
    'breaking_news': 30,
    'engagement': 20,
  },
});

// Trigger a manual post
const post = await echo.bot.post(discordBot.id, undefined, 'industry_news');
console.log(`Posted: ${post.content.slice(0, 100)}...`);

// Check bot statistics
const stats = await echo.bot.stats(discordBot.id);
console.log(`Total posts: ${stats.total_posts}`);
console.log(`Engagement rate: ${stats.engagement_rate}%`);
console.log(`Posts today: ${stats.posts_today}`);

// Browse bot templates
const templates = await echo.bot.templates('discord');
for (const t of templates) {
  console.log(`${t.name}: ${t.description}`);
}

// List all active bots
const allBots = await echo.bot.list();
for (const b of allBots) {
  console.log(`${b.name} (${b.platform}): ${b.status} - ${b.total_posts} posts`);
}
```

## 6. Set Up Webhooks

```typescript
// Register a webhook for engine and build events
const hook = await echo.webhooks.register(
  'https://myapp.com/api/webhooks/echo',
  ['engine.created', 'engine.updated', 'build.complete', 'build.failed'],
  'whsec_my-signing-secret-123'
);
console.log(`Webhook registered: ${hook.id}`);
console.log(`Active: ${hook.active}`);

// Test the webhook delivery
const testResult = await echo.webhooks.test(hook.id);
if (testResult.delivered) {
  console.log(`Test delivered successfully (HTTP ${testResult.status})`);
} else {
  console.log(`Test delivery failed (HTTP ${testResult.status})`);
}

// List all webhooks
const allHooks = await echo.webhooks.list();
for (const h of allHooks) {
  console.log(`${h.id}: ${h.url} [${h.events.join(', ')}] failures: ${h.failure_count}`);
}

// Stream events in real-time
console.log('Listening for events...');
for await (const event of echo.webhooks.events(['engine.*', 'build.*'])) {
  console.log(`[${event.timestamp}] ${event.event}`);
  console.log(`  Data:`, JSON.stringify(event.data, null, 2));
}

// Clean up
await echo.webhooks.delete(hook.id);
console.log('Webhook deleted');
```

## 7. Use LLM Routing

```typescript
// Simple Claude completion
const claude = await echo.llm.claude('Explain the difference between TCP and UDP');
console.log(claude.content);
console.log(`Model: ${claude.model}`);
console.log(`Tokens: ${claude.usage.total_tokens}`);
console.log(`Latency: ${claude.latency_ms}ms`);

// Use any model
const gpt4 = await echo.llm.complete({
  prompt: 'Write a haiku about programming',
  model: 'gpt-4o',
  temperature: 0.9,
  max_tokens: 100,
});
console.log(gpt4.content);

// Use a system prompt
const analyst = await echo.llm.complete({
  prompt: 'What are the top 3 risks in the current oil market?',
  model: 'claude-opus-4-20250514',
  system: 'You are a senior oil & gas market analyst with 20 years of experience. Be concise and data-driven.',
  temperature: 0.3,
  max_tokens: 500,
});
console.log(analyst.content);

// List all available models
const models = await echo.llm.models();
console.log(`\n${models.length} models available:`);
for (const m of models) {
  console.log(`  ${m.id} (${m.provider}) - ${m.capabilities.join(', ')}`);
}

// Check provider health
const health = await echo.llm.status();
console.log(`\nLLM healthy: ${health.healthy}`);
for (const [provider, status] of Object.entries(health.providers)) {
  console.log(`  ${provider}: ${status}`);
}
```

## 8. Create Compound Engines

```typescript
// Chain strategy: output flows from one engine to the next
const pipeline = await echo.compose.create(
  ['tax-analysis-v3', 'legal-review-v2', 'compliance-check-v1'],
  'tax-legal-compliance-pipeline',
  {
    strategy: 'chain',
    description: 'Tax analysis -> Legal review -> Compliance verification',
  }
);
console.log(`Compound engine created: ${pipeline.id}`);

// Vote strategy: all engines process independently, best answer wins
const ensemble = await echo.compose.create(
  ['tax-engine-v1', 'tax-engine-v2', 'tax-engine-v3'],
  'tax-voting-ensemble',
  {
    strategy: 'vote',
    description: 'Best-of-3 tax engine ensemble for higher accuracy',
  }
);

// Merge strategy: all outputs are combined into one response
const merged = await echo.compose.create(
  ['oilfield-geology', 'oilfield-engineering', 'oilfield-regulations'],
  'oilfield-comprehensive',
  {
    strategy: 'merge',
    description: 'Comprehensive oilfield analysis covering geology, engineering, and regulations',
  }
);

// Query a compound engine
const result = await echo.compose.query(
  pipeline.id,
  'What are the tax implications of selling mineral rights in Texas?'
);
console.log('Pipeline result:', result);

// List all compound engines
const compounds = await echo.compose.list();
for (const c of compounds) {
  console.log(`${c.name}: ${c.engines.length} engines, ${c.strategy} strategy, ${c.query_count} queries`);
}

// Clean up
await echo.compose.delete(pipeline.id);
```

## 9. Use AGI Self-Learning

```typescript
// After querying an engine, submit feedback
const engineResult = await echo.engines.query('What is MACRS depreciation?', 'tax');

// Rate the quality
const feedback = await echo.agi.feedback({
  engine_id: engineResult.engine_id,
  query: 'What is MACRS depreciation?',
  quality_score: 0.92,
  feedback_text: 'Accurate answer with correct recovery periods. Could include more examples.',
});
console.log(`Feedback recorded: ${feedback.recorded}`);
if (feedback.auto_retrain_triggered) {
  console.log('Automatic retrain was triggered!');
}

// Submit negative feedback (triggers auto-retrain if score is low enough)
await echo.agi.feedback({
  engine_id: 'legal-contracts-v2',
  query: 'What is indemnification?',
  quality_score: 0.3,
  feedback_text: 'Missed key clause types. Incomplete answer.',
});

// Manually trigger a retrain
const job = await echo.agi.retrain('legal-contracts-v2', 'Poor performance on indemnification topics');
console.log(`Retrain job: ${job.job_id} (${job.status})`);

// Monitor learning rates
const rate = await echo.agi.learningRate();
console.log(`\nDaily improvement: ${rate.daily_improvement}%`);
console.log(`Weekly trend: ${rate.weekly_trend}`);

console.log('\nTop improving engines:');
for (const e of rate.top_improving_engines) {
  console.log(`  ${e.engine_id}: +${e.improvement}%`);
}

console.log('\nStruggling engines:');
for (const e of rate.struggling_engines) {
  console.log(`  ${e.engine_id}: score ${e.score}`);
}

// Get optimization suggestions
const suggestions = await echo.agi.suggestions();
console.log(`\n${suggestions.length} optimization suggestions:`);
for (const s of suggestions) {
  console.log(`\n  Engine: ${s.engine_id} (score: ${s.current_score})`);
  console.log(`  Reason: ${s.reason}`);
  console.log(`  Action: ${s.recommended_action}`);
}

// AGI status overview
const agiStatus = await echo.agi.status();
console.log(`\nAGI Status:`);
console.log(`  Total feedback: ${agiStatus.total_feedback}`);
console.log(`  Avg quality: ${agiStatus.avg_quality}`);
console.log(`  Engines improved: ${agiStatus.engines_improved}`);
console.log(`  Total retrains: ${agiStatus.total_retrains}`);
```

## 10. Monitor with Forge

```typescript
// Check forge health
const forgeStatus = await echo.forge.status();
console.log(`Forge Health: ${forgeStatus.summary.healthy}/${forgeStatus.summary.total} healthy`);
for (const [name, info] of Object.entries(forgeStatus.forges)) {
  console.log(`  ${name}: ${info.status} (${info.latency_ms}ms)`);
}

// Build an engine through the forge
const engineBuild = await echo.forge.engine({
  domain: 'security',
  name: 'vuln-scanner-v4',
  doctrines: ['OWASP', 'CVE', 'NIST'],
  tier: 'sovereign',
});
console.log(`Build: ${engineBuild.ok ? 'SUCCESS' : 'FAILED'} (${engineBuild.latency_ms}ms)`);

// Run a full-stack pipeline
const pipeline = await echo.forge.fullStack(
  ['doctrine', 'engine', 'knowledge', 'prompt'],
  {
    domain: 'tax',
    topic: 'estate-planning',
    tier: 'professional',
  }
);
console.log(`\nPipeline: ${pipeline.pipeline}`);
for (const stage of pipeline.results) {
  const icon = stage.ok ? 'PASS' : 'FAIL';
  console.log(`  [${icon}] ${stage.stage}: ${stage.latency_ms}ms`);
}

// Check evolution state
const evolution = await echo.forge.evolution();
console.log('\nForge evolution:', JSON.stringify(evolution, null, 2));

// Generate an optimized prompt template
const prompt = await echo.forge.prompt('legal', 'contract review and risk assessment');
console.log(`Prompt build: ${prompt.ok ? 'SUCCESS' : 'FAILED'}`);
```

## 11. Voice Synthesis and Transcription

```typescript
import { writeFileSync } from 'fs';

// Text-to-speech with emotion
const audio = await echo.voice.synthesize(
  'Welcome to Echo Prime Technologies. We are building the future of intelligence.',
  {
    voice: 'echo',
    emotion: 'excited',
    format: 'mp3',
    speed: 1.0,
  }
);
writeFileSync('output.mp3', Buffer.from(audio));
console.log('Audio saved to output.mp3');

// Speech-to-text
import { readFileSync } from 'fs';
const audioFile = readFileSync('recording.wav');
const base64Audio = audioFile.toString('base64');
const transcript = await echo.voice.transcribe(base64Audio, { language: 'en' });
console.log(`Transcription: ${transcript.text}`);
console.log(`Confidence: ${transcript.confidence}`);

// Emotion analysis
const emotion = await echo.voice.analyzeEmotion(
  'I cannot believe how terrible this service is! Nothing works properly!'
);
console.log(`Dominant emotion: ${emotion.dominant_emotion}`);
console.log(`Confidence: ${emotion.confidence}`);

// List voices
const voices = await echo.voice.listVoices();
for (const v of voices) {
  console.log(`${v.id}: ${v.name} (${v.gender}) - ${v.engine}`);
}
```

## 12. Shared Brain Memory

```typescript
// Store important information
await echo.brain.ingest(
  'Client ABC Corp prefers quarterly reporting with detailed breakdowns by department',
  9,
  ['client', 'abc-corp', 'preferences']
);

await echo.brain.ingest(
  'The Permian Basin deal closed at $4.2M on March 15, 2026',
  10,
  ['deal', 'permian', 'closed']
);

// Semantic search -- finds relevant memories regardless of exact wording
const memories = await echo.brain.search('what does ABC Corp want for reports?');
for (const m of memories) {
  console.log(`[importance: ${m.importance}] ${m.content}`);
}

// Key-value storage for structured data
await echo.brain.store('pipeline_status', {
  active_deals: 12,
  closed_this_month: 3,
  total_value: 15_600_000,
  updated_at: new Date().toISOString(),
});

const status = await echo.brain.recall('pipeline_status');
console.log('Pipeline:', status);
```

## 13. Autonomous Agents

```typescript
// Create an agent with specific tools and personality
const agent = await echo.agent.create({
  name: 'research-assistant',
  personality: 'sage',
  domain: 'tax',
  instructions: 'Research tax law changes and summarize impact on small businesses',
  tools: ['knowledge_search', 'doctrine_generate', 'web_scrape'],
  maxTurns: 15,
  temperature: 0.5,
});
console.log(`Agent created: ${agent.id}`);

// Run the agent on a task
const run = await echo.agent.run(
  agent.id,
  'Research the SECURE Act 2.0 changes to retirement plan rules'
);
console.log(`Run started: ${run.id} (${run.status})`);

// Poll for completion
let status = await echo.agent.status(run.id);
while (status.status === 'running') {
  console.log(`  Turn ${status.turns}...`);
  await new Promise(r => setTimeout(r, 2000));
  status = await echo.agent.status(run.id);
}

console.log(`\nResult: ${status.output}`);

// View run history
const history = await echo.agent.history(agent.id);
for (const r of history) {
  console.log(`  ${r.id}: ${r.status} (${r.turns} turns)`);
}
```

## 14. Web Scraping

```typescript
// Create a government document scraper
const scraper = await echo.scraper.create({
  name: 'irs-publications',
  type: 'government',
  target: 'https://www.irs.gov/publications',
  schedule: '0 6 * * 1', // Every Monday at 6am
  selectors: {
    title: 'h2.title',
    content: '.field--body',
    date: '.date-display-single',
  },
  rateLimit: { requestsPerMinute: 10 },
  pagination: { type: 'page', maxPages: 50 },
});
console.log(`Scraper created: ${scraper.id}`);

// Run immediately
const job = await echo.scraper.run(scraper.id);
console.log(`Job ${job.id}: ${job.status}`);

// Wait for completion and check results
const records = await echo.scraper.records(scraper.id, 20);
for (const r of records) {
  console.log(`${r.data.title}: ${r.url}`);
}
```

## 15. Dark Web Intelligence

```typescript
// Check if an email has been breached
const breach = await echo.darkweb.checkBreach('user@example.com');
if (breach.breached) {
  console.log(`BREACHED in ${breach.breach_count} incidents`);
  console.log(`Sources: ${breach.sources.join(', ')}`);
  console.log(`First seen: ${breach.first_seen}`);
} else {
  console.log('No breaches found');
}

// Set up brand monitoring
await echo.darkweb.monitorBrand(
  'Echo Prime',
  ['echo-op.com', 'echo-ept.com'],
  ['echo prime', 'echo omega', 'api key leak']
);

// Create an alert for credential leaks
const alert = await echo.darkweb.createAlert(
  'credential-leak-monitor',
  ['echo-op.com', 'password', 'credential', 'api_key'],
  { severityThreshold: 'high', channels: ['email', 'slack'] }
);
console.log(`Alert created: ${alert.id}`);

// Search dark web intelligence
const threats = await echo.darkweb.search('echo prime', { severity: 'critical' });
for (const t of threats) {
  console.log(`[${t.severity}] ${t.title}: ${t.description}`);
}
```

## 16. Crypto Trading

```typescript
// Get current prices
const btc = await echo.crypto.price('BTC/USDT');
console.log(`BTC: $${btc.price} (${btc.change_24h > 0 ? '+' : ''}${btc.change_24h}%)`);

// Create a grid trading strategy
const strategy = await echo.crypto.createStrategy(
  'btc-grid',
  'grid',
  'BTC/USDT',
  {
    lower_bound: 60000,
    upper_bound: 70000,
    grid_count: 10,
    investment: 1000,
  }
);
console.log(`Strategy created: ${strategy.id}`);

// Check portfolio
const portfolio = await echo.crypto.portfolio();
for (const pos of portfolio) {
  const pnlIcon = pos.pnl >= 0 ? '+' : '';
  console.log(`${pos.asset}: ${pos.amount} @ $${pos.current_price} (${pnlIcon}${pos.pnl_percent}%)`);
}
```

## 17. News Monitoring with Sentiment

```typescript
// Search news with sentiment filtering
const bearishNews = await echo.news.search('oil prices', {
  sentiment: 'bearish',
  hours: 48,
  limit: 10,
});
for (const article of bearishNews) {
  console.log(`[${article.sentiment}] ${article.title}`);
  console.log(`  Source: ${article.source} | Score: ${article.sentiment_score}`);
}

// Track a topic
await echo.news.trackTopic('AI Regulation', ['artificial intelligence', 'AI regulation', 'AI policy', 'AI law']);

// Analyze custom text sentiment
const analysis = await echo.news.analyzeSentiment(
  'The Federal Reserve signaled potential rate cuts in the coming months, boosting market optimism.'
);
console.log(`Sentiment: ${analysis.sentiment} (score: ${analysis.score})`);
console.log(`Keywords: ${analysis.keywords.join(', ')}`);

// Create a news alert
await echo.news.createAlert('oil-bearish', ['oil price', 'crude oil', 'energy'], 'bearish');
```

## 18. SEC Filing Watchlist

```typescript
// Add companies to watchlist
await echo.secEdgar.watch('AAPL', ['10-K', '10-Q', '8-K']);
await echo.secEdgar.watch('TSLA', ['10-K', '8-K']);
await echo.secEdgar.watch('NVDA');

// Search recent filings
const filings = await echo.secEdgar.search('artificial intelligence', {
  filingType: '10-K',
  limit: 5,
});
for (const f of filings) {
  console.log(`${f.ticker} (${f.filing_type}): ${f.summary}`);
  console.log(`  Filed: ${f.filed_at} | URL: ${f.url}`);
}

// Check alerts
const alerts = await echo.secEdgar.alerts();
for (const a of alerts) {
  console.log(`[${a.ticker}] ${a.filing_type}: ${a.summary}`);
}
```

## 19. Landman Title Investigation

```typescript
// Start a title investigation
const investigation = await echo.landman.investigate(
  'Reeves',
  'Section 270, Block 13, H&GN RR Co Survey',
  { state: 'TX' }
);
console.log(`Investigation ${investigation.id}: ${investigation.status}`);

// Poll for completion
let inv = await echo.landman.status(investigation.id);
while (inv.status !== 'complete' && inv.status !== 'failed') {
  console.log(`  Progress: ${inv.progress}% (${inv.documents_found} docs found)`);
  await new Promise(r => setTimeout(r, 5000));
  inv = await echo.landman.status(investigation.id);
}

// Get the chain of title
const chain = await echo.landman.chainOfTitle('Reeves', 'Section 270, Block 13, H&GN RR Co Survey');
console.log(`Chain complete: ${chain.complete}`);
console.log(`Links: ${chain.links.length}`);
console.log(`Gaps: ${chain.gaps.length}`);

for (const link of chain.links) {
  console.log(`  ${link.date}: ${link.grantor} -> ${link.grantee} (${link.deed_type})`);
}

for (const gap of chain.gaps) {
  console.log(`  GAP [${gap.severity}]: ${gap.from} to ${gap.to} (${gap.gap_years} years)`);
}

// Get the runsheet
const runsheet = await echo.landman.runsheet(investigation.id);
console.log(`\nMineral interests:`);
for (const mi of runsheet.mineral_interests) {
  console.log(`  ${mi.owner}: ${mi.interest}% (${mi.type})`);
}

// Search county records
const records = await echo.landman.searchRecords({
  county: 'Reeves',
  deedType: 'mineral_deed',
  section: '270',
  limit: 20,
});
for (const r of records) {
  console.log(`${r.recorded_date}: ${r.grantor} -> ${r.grantee} (${r.instrument_number})`);
}
```

## 20. Knowledge Graph (GraphRAG)

```typescript
// RAG query -- graph-enhanced AI reasoning
const answer = await echo.graphRag.query('How does fracking affect mineral rights?', {
  domain: 'oilfield',
  maxSources: 5,
});
console.log(`Answer: ${answer.answer}`);
console.log(`Confidence: ${answer.confidence}`);
console.log(`Sources: ${answer.sources.length}`);
console.log(`Reasoning chain: ${answer.reasoning_chain.join(' -> ')}`);

// Semantic graph search
const graphResults = await echo.graphRag.search('MACRS depreciation', {
  domain: 'tax',
  depth: 3,
});
console.log(`\nFound ${graphResults.nodes.length} nodes, ${graphResults.edges.length} edges`);

// Find path between concepts
const path = await echo.graphRag.findPath('mineral-rights', 'tax-deduction', 4);
if (path) {
  console.log(`\nPath (${path.hops} hops):`);
  for (const node of path.nodes) {
    console.log(`  ${node.label} (${node.type})`);
  }
}

// Graph stats
const graphStats = await echo.graphRag.stats();
console.log(`\nGraph: ${graphStats.total_nodes} nodes, ${graphStats.total_edges} edges, ${graphStats.domains} domains`);
```

## 21. Swarm Coordination and MoltBook

```typescript
// Post to MoltBook (inter-agent social feed)
const moltPost = await echo.swarm.post(
  'Just deployed tax-engine-v4 with 30% accuracy improvement!',
  { mood: 'celebrating', tags: ['deploy', 'tax-engine', 'improvement'] }
);

// Read the feed
const feed = await echo.swarm.feed({ limit: 10, mood: 'building' });
for (const post of feed) {
  console.log(`[${post.mood}] ${post.author_name}: ${post.content}`);
}

// Submit a task to the swarm
const task = await echo.swarm.submitTask(
  'Scrape Midland County records for Q1 2026',
  { priority: 8 }
);
console.log(`Task submitted: ${task.id} (${task.status})`);

// Check cluster status
const cluster = await echo.swarm.clusterStatus();
console.log(`\nCluster: ${cluster.online_agents}/${cluster.total_agents} agents online`);
console.log(`GPUs: ${cluster.total_gpus}, VRAM: ${cluster.total_vram_gb}GB`);
console.log(`Tasks pending: ${cluster.tasks_pending}`);

// Broadcast a message
await echo.swarm.broadcast('All agents: maintenance window in 1 hour', 'high');
```

## 22. Fleet Management

```typescript
// Check fleet health
const workers = await echo.fleet.health();
for (const w of workers) {
  console.log(`${w.name}: ${w.status} (${w.latency_ms}ms)`);
}

// Deploy a worker
const deployment = await echo.fleet.deploy('echo-tax-return', { version: '2.1.0' });
console.log(`Deployed: ${deployment.worker} v${deployment.version} (${deployment.status})`);

// Register a new service
await echo.fleet.register('my-custom-service', 'https://my-service.example.com', [
  'tax-analysis',
  'document-parsing',
]);

// Fleet stats
const fleetStats = await echo.fleet.stats();
console.log(`\nFleet: ${fleetStats.healthy}/${fleetStats.total_workers} healthy`);
console.log(`Avg latency: ${fleetStats.avg_latency_ms}ms`);
```

## 23. Workflow Automation

```typescript
// Create a multi-step workflow
const workflow = await echo.workflows.create(
  'daily-intelligence-report',
  [
    { name: 'scrape-news', type: 'api_call', config: { endpoint: '/news/feed', params: { limit: 20 } } },
    { name: 'analyze-sentiment', type: 'transform', config: { operation: 'sentiment_analysis' } },
    { name: 'generate-report', type: 'api_call', config: { endpoint: '/llm/complete', body: { prompt: 'Summarize this news...' } } },
    { name: 'notify-team', type: 'notification', config: { channels: ['slack', 'email'], priority: 'normal' } },
  ],
  { description: 'Daily intelligence report', schedule: '0 7 * * *' }
);
console.log(`Workflow created: ${workflow.id}`);

// Run it manually
const run = await echo.workflows.run(workflow.id);
console.log(`Run ${run.id}: ${run.steps_completed}/${run.steps_total} steps`);

// Create a standalone cron job
await echo.workflows.createCron('backup-brain', '0 2 * * *', {
  command: 'brain_backup',
});
```

## 24. Multi-Channel Notifications

```typescript
// Send a notification
await echo.notifications.send('slack', '#alerts', 'Engine tax-v3 quality dropped below 80%', {
  subject: 'Engine Quality Alert',
  priority: 'high',
});

// Broadcast to multiple channels
await echo.notifications.broadcast(
  ['email', 'slack', 'telegram'],
  'Monthly intelligence report is ready for review',
  { subject: 'Monthly Report Ready', priority: 'normal' }
);

// Create an automated rule
await echo.notifications.createRule(
  'engine-quality-drop',
  'engine.quality_score < 0.7',
  ['slack', 'email'],
  'critical'
);
```

## 25. Vault Credential Management

```typescript
// Store a credential
await echo.vault.store('aws-production', 'admin@echo-op.com', 'super-secret-password', 'cloud');

// Retrieve a credential
const cred = await echo.vault.get('aws-production');
console.log(`Username: ${cred.username}`);
// Password available as cred.password

// Check credential health
const health = await echo.vault.health('aws-production');
console.log(`Score: ${health.score}/100`);
console.log(`Age: ${health.age_days} days`);
console.log(`Strength: ${health.strength}`);
console.log(`Breached: ${health.breached}`);
console.log(`Reused: ${health.reused}`);

// Rotate a credential
await echo.vault.rotate('aws-production');

// Vault overview
const stats = await echo.vault.stats();
console.log(`\nVault: ${stats.total_credentials} credentials`);
console.log(`Weak: ${stats.weak_count}, Breached: ${stats.breached_count}`);
```

## 26. Permanent Memory (Memory Prime)

```typescript
// Store across the 9 pillars
await echo.memoryPrime.store('decisions', 'Chose Cloudflare Workers over AWS Lambda for all new builds', {
  importance: 9,
  tags: ['architecture', 'cloudflare'],
});

await echo.memoryPrime.store('errors', 'Service binding fetch ignores AbortSignal -- use external fetch instead', {
  importance: 8,
  tags: ['cloudflare', 'workers', 'gotcha'],
});

await echo.memoryPrime.store('patterns', 'Tax engines perform 30% better with doctrines generated by Groq', {
  importance: 7,
  tags: ['tax', 'engines', 'groq'],
});

// Semantic search across all pillars
const results = await echo.memoryPrime.search('cloudflare workers issues', { limit: 5 });
for (const entry of results.entries) {
  console.log(`[${entry.pillar}] ${entry.content}`);
}

// Recall from a specific pillar
const errors = await echo.memoryPrime.recall('errors', { limit: 10 });
for (const e of errors) {
  console.log(`[${e.importance}] ${e.content}`);
}
```

## 27. Reddit Monitoring

```typescript
// Watch subreddits for keywords
await echo.reddit.watch('oilandgas', ['permian basin', 'drilling', 'mineral rights'], 5);
await echo.reddit.watch('tax', ['1031 exchange', 'depreciation', 'section 179'], 10);

// Search monitored posts
const posts = await echo.reddit.search('mineral rights', { minScore: 10 });
for (const p of posts) {
  console.log(`r/${p.subreddit}: ${p.title} (score: ${p.score})`);
  console.log(`  Keywords: ${p.matched_keywords.join(', ')}`);
}

// Check alerts
const alerts = await echo.reddit.alerts();
for (const a of alerts) {
  console.log(`[r/${a.subreddit}] ${a.title} (score: ${a.score})`);
}
```

## 28. Price Alerts

```typescript
// Create price alerts
await echo.priceAlerts.create('BTC', 'above', 100000, 'crypto');
await echo.priceAlerts.create('ETH', 'below', 2000, 'crypto');
await echo.priceAlerts.create('AAPL', 'change_pct', 5, 'stock');

// Check current prices
const prices = await echo.priceAlerts.prices(['BTC', 'ETH', 'SOL']);
for (const p of prices) {
  console.log(`${p.asset}: $${p.price} (1h: ${p.change_1h}%, 24h: ${p.change_24h}%)`);
}

// View trigger history
const history = await echo.priceAlerts.history({ limit: 10 });
for (const h of history) {
  console.log(`${h.asset}: triggered ${h.condition} $${h.threshold} at $${h.price_at_trigger}`);
}
```

## 29. Custom Model Hosting

```typescript
// List available models
const models = await echo.modelHost.list();
for (const m of models) {
  console.log(`${m.id}: ${m.name} (${m.base_model}) - loaded: ${m.loaded}`);
}

// Run inference (OpenAI-compatible)
const response = await echo.modelHost.chat({
  model: 'echo-tax-lora',
  messages: [
    { role: 'system', content: 'You are a tax expert specializing in oil and gas.' },
    { role: 'user', content: 'Explain intangible drilling costs deduction.' },
  ],
  temperature: 0.3,
  max_tokens: 500,
});
console.log(response.choices[0].message.content);
console.log(`Tokens: ${response.usage.total_tokens}, Latency: ${response.latency_ms}ms`);

// Switch active model
await echo.modelHost.switchModel('echo-legal-lora');
```

## 30. Knowledge Harvesting

```typescript
// Add a harvest source
const source = await echo.harvester.addSource(
  'IRS Updates',
  'https://www.irs.gov/newsroom/rss.xml',
  'rss',
  'tax',
  '0 */4 * * *' // every 4 hours
);

// Trigger immediate harvest
const harvest = await echo.harvester.harvest(source.id);
console.log(`Harvested ${harvest.items_found} items`);

// View harvested items
const items = await echo.harvester.items({ sourceId: source.id, limit: 10 });
for (const item of items) {
  console.log(`[${item.quality_score}] ${item.title}`);
}

// Get discovery reports
const reports = await echo.harvester.reports();
for (const r of reports) {
  console.log(`${r.date}: ${r.items_discovered} discovered, ${r.items_ingested} ingested`);
}
```

## 31. County Record Scanning

```typescript
// Start a county scan
const scan = await echo.scanner.scan('Midland', {
  state: 'TX',
  instrumentTypes: ['mineral_deed', 'oil_gas_lease'],
  dateRange: { from: '2025-01-01', to: '2026-01-01' },
});
console.log(`Scan started: ${scan.id}`);

// Search scanned documents
const docs = await echo.scanner.searchDocuments('McWilliams', {
  county: 'Midland',
  instrumentType: 'mineral_deed',
});
for (const d of docs) {
  console.log(`${d.recorded_date}: ${d.grantor} -> ${d.grantee} (${d.instrument_number})`);
}

// Check county coverage
const counties = await echo.scanner.counties();
for (const c of counties) {
  console.log(`${c.county}, ${c.state}: ${c.total_documents} docs (${c.coverage_percent}% coverage)`);
}
```

## 32. MEGA Gateway Tool Execution

```typescript
// Search for tools
const tools = await echo.megaGateway.search('cloudflare dns', { category: 'CLOUD', limit: 5 });
for (const t of tools) {
  console.log(`${t.server}/${t.name}: ${t.description}`);
}

// Execute a tool
const result = await echo.megaGateway.execute('cloudflare', 'dns_list_records', {
  zone_id: 'abc123',
});
console.log(`Result:`, result.output);
console.log(`Latency: ${result.latency_ms}ms`);

// Execute a tool chain
const chain = await echo.megaGateway.executeChain([
  { server: 'cloudflare', tool: 'dns_list_records', params: { zone_id: 'abc123' } },
  { server: 'cloudflare', tool: 'analytics_get', params: { zone_id: 'abc123' } },
]);
for (const step of chain) {
  console.log(`${step.tool}: ${step.success ? 'OK' : 'FAILED'} (${step.latency_ms}ms)`);
}

// Browse categories
const categories = await echo.megaGateway.categories();
for (const c of categories) {
  console.log(`${c.category}: ${c.tool_count} tools, ${c.server_count} servers`);
}
```

## 33. SDK Self-Discovery

```typescript
// List all SDK modules
const moduleList = await echo.sdkCatalog.modules();
console.log(`${moduleList.total_modules} modules available:`);
for (const m of moduleList.modules) {
  console.log(`  ${m.module} (${m.class_name}): ${m.method_count} methods`);
}

// Search for methods by keyword
const searchResult = await echo.sdkCatalog.search('query');
for (const m of searchResult.methods) {
  console.log(`${m.class_name}.${m.method_name}() -> ${m.return_type}`);
  console.log(`  ${m.description}`);
}

// Get all methods for a specific module
const engineMethods = await echo.sdkCatalog.module('engines');
for (const m of engineMethods.methods) {
  console.log(`${m.method_name}(${m.params.map(p => p.name).join(', ')}): ${m.return_type}`);
}
```

## 34. Error Handling Patterns

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
} from '@echo-omega-prime/sdk';

// Pattern 1: Catch specific errors
async function safeQuery(question: string) {
  try {
    return await echo.engines.query(question);
  } catch (err) {
    if (err instanceof RateLimitError) {
      console.log(`Rate limited. Waiting ${err.retryAfterMs}ms...`);
      await new Promise(r => setTimeout(r, err.retryAfterMs));
      return await echo.engines.query(question); // retry once
    }
    if (err instanceof CircuitOpenError) {
      console.log('Service temporarily unavailable. Using cached data.');
      return null;
    }
    throw err; // re-throw unexpected errors
  }
}

// Pattern 2: Retry with backoff
async function queryWithRetry(question: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await echo.engines.query(question);
    } catch (err) {
      if (err instanceof EchoError && err.retryable && attempt < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

// Pattern 3: Graceful degradation
async function getAnswer(question: string) {
  try {
    // Try the full engine query first
    return await echo.engines.query(question);
  } catch {
    try {
      // Fall back to knowledge search
      const docs = await echo.knowledge.search(question, 1);
      return { response: docs[0]?.content || 'No answer found', confidence: 0.5 };
    } catch {
      // Fall back to LLM
      const llm = await echo.llm.claude(question);
      return { response: llm.content, confidence: 0.3 };
    }
  }
}
```

## 35. Streaming LLM Responses

```typescript
// Stream to stdout
console.log('Streaming response:');
for await (const chunk of echo.llm.stream({
  prompt: 'Write a detailed analysis of the Permian Basin oil market in 2026',
  model: 'claude-opus-4-20250514',
  temperature: 0.4,
  max_tokens: 2000,
})) {
  process.stdout.write(chunk);
}
console.log('\n--- END ---');

// Collect streamed chunks into a string
let fullResponse = '';
for await (const chunk of echo.llm.stream({
  prompt: 'List the top 10 tax deductions for oil and gas companies',
  system: 'You are a CPA specializing in oil and gas taxation.',
})) {
  fullResponse += chunk;
}
console.log(`Complete response (${fullResponse.length} chars):`);
console.log(fullResponse);
```

## 36. Full Application: Intelligence Pipeline

```typescript
/**
 * Complete intelligence pipeline example:
 * 1. Search for relevant knowledge
 * 2. Query specialized engines
 * 3. Generate new doctrine if needed
 * 4. Store results in memory
 * 5. Send notification
 */
async function intelligencePipeline(topic: string, domain: string) {
  console.log(`\n=== Intelligence Pipeline: "${topic}" (${domain}) ===\n`);

  // Step 1: Knowledge search
  console.log('Step 1: Searching knowledge base...');
  const knowledge = await echo.knowledge.search(topic, 5);
  console.log(`  Found ${knowledge.length} documents`);

  // Step 2: Engine query
  console.log('Step 2: Querying intelligence engines...');
  const engineResult = await echo.engines.query(topic, domain);
  console.log(`  Engine: ${engineResult.engine_id}`);
  console.log(`  Confidence: ${engineResult.confidence}`);
  console.log(`  Doctrines: ${engineResult.doctrines_matched}`);

  // Step 3: Generate doctrine if confidence is low
  if (engineResult.confidence < 0.7) {
    console.log('Step 3: Low confidence -- generating new doctrines...');
    const doctrine = await echo.doctrine.generate(domain, topic);
    console.log(`  Generated ${doctrine.doctrines.length} doctrines via ${doctrine.provider_used}`);
  } else {
    console.log('Step 3: Confidence sufficient -- skipping doctrine generation');
  }

  // Step 4: Store in memory
  console.log('Step 4: Storing results in permanent memory...');
  await echo.memoryPrime.store('knowledge', `Intelligence report on "${topic}": ${engineResult.response.slice(0, 200)}`, {
    importance: 7,
    tags: [domain, 'pipeline', 'intelligence-report'],
  });

  // Step 5: Post to MoltBook
  console.log('Step 5: Posting to MoltBook...');
  await echo.swarm.post(
    `Intelligence pipeline completed: "${topic}" (${domain}) - confidence: ${engineResult.confidence}`,
    { mood: 'building', tags: ['pipeline', domain] }
  );

  // Step 6: Submit AGI feedback
  console.log('Step 6: Submitting AGI feedback...');
  await echo.agi.feedback({
    engine_id: engineResult.engine_id,
    query: topic,
    quality_score: engineResult.confidence,
    feedback_text: `Pipeline query on "${topic}"`,
  });

  console.log('\n=== Pipeline complete ===\n');
  return engineResult;
}

// Run the pipeline
await intelligencePipeline('MACRS depreciation for oil well equipment', 'tax');
await intelligencePipeline('Horizontal drilling techniques in the Delaware Basin', 'oilfield');
```
