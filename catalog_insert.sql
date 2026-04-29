INSERT INTO sdk_functions (module, class_name, method_name, kind, route, http_method, params, return_type, description) VALUES
-- ═══ ENGINES (7 methods) ═══
('engines', 'EchoEngines', 'query', 'method', '/engine/query', 'POST', '{"query":"string","domain?":"string","mode?":"FAST|DEFENSE|MEMO"}', 'EngineQueryResult', 'Query intelligence engines with optional domain filter and response mode'),
('engines', 'EchoEngines', 'list', 'method', '/engine/list', 'GET', '{"domain?":"string","limit?":"number","offset?":"number"}', 'EngineInfo[]', 'List available engines with optional domain filter and pagination'),
('engines', 'EchoEngines', 'get', 'method', '/engine/:id', 'GET', '{"engineId":"string"}', 'EngineInfo', 'Get detailed info about a specific engine by ID'),
('engines', 'EchoEngines', 'domains', 'method', '/engine/domains', 'GET', '{}', 'string[]', 'List all available engine domains'),
('engines', 'EchoEngines', 'stats', 'method', '/engine/stats', 'GET', '{}', '{total_engines,total_doctrines,domains,queries_served}', 'Get engine runtime statistics'),
('engines', 'EchoEngines', 'doctrines', 'method', '/engine/:id/doctrines', 'GET', '{"engineId":"string","limit?":"number"}', 'DoctrineBlock[]', 'Get doctrine blocks for a specific engine'),
('engines', 'EchoEngines', 'health', 'method', '/engine/health', 'GET', '{}', 'HealthStatus', 'Check engine runtime health status'),

-- ═══ KNOWLEDGE (3 methods) ═══
('knowledge', 'EchoKnowledge', 'search', 'method', '/knowledge/search', 'POST', '{"query":"string","category?":"string","limit?":"number"}', 'KnowledgeResult[]', 'Search knowledge base with optional category filter'),
('knowledge', 'EchoKnowledge', 'categories', 'method', '/knowledge/categories', 'GET', '{}', 'Array<{name,count,description}>', 'List all knowledge categories with document counts'),
('knowledge', 'EchoKnowledge', 'stats', 'method', '/knowledge/stats', 'GET', '{}', '{total_docs,total_chunks,categories,avg_relevance}', 'Get knowledge forge statistics'),

-- ═══ BRAIN (5 methods) ═══
('brain', 'EchoBrain', 'store', 'method', '/brain/ingest', 'POST', '{"content":"string","importance?":"number(1-10)","tags?":"string[]"}', 'BrainMemory', 'Store a memory in Shared Brain with importance and tags'),
('brain', 'EchoBrain', 'recall', 'method', '/brain/search', 'POST', '{"query":"string","limit?":"number","minImportance?":"number"}', 'BrainMemory[]', 'Recall memories by semantic search with importance filter'),
('brain', 'EchoBrain', 'recent', 'method', '/brain/recent', 'GET', '{"limit?":"number"}', 'BrainMemory[]', 'Get most recent brain memories'),
('brain', 'EchoBrain', 'stats', 'method', '/brain/stats', 'GET', '{}', '{total_memories,avg_importance,tags,oldest,newest}', 'Get brain memory statistics'),
('brain', 'EchoBrain', 'forget', 'method', '/brain/forget', 'DELETE', '{"memoryId":"string"}', '{success:boolean}', 'Delete a specific memory by ID'),

-- ═══ DOCTRINE (4 methods) ═══
('doctrine', 'EchoDoctrine', 'generate', 'method', '/doctrine/generate', 'POST', '{"topic":"string","domain":"string","depth?":"string"}', 'DoctrineBlock', 'Generate a new doctrine block for a topic in a domain'),
('doctrine', 'EchoDoctrine', 'search', 'method', '/doctrine/search', 'POST', '{"query":"string","domain?":"string","limit?":"number"}', 'DoctrineBlock[]', 'Search existing doctrines by query with optional domain filter'),
('doctrine', 'EchoDoctrine', 'domains', 'method', '/doctrine/domains', 'GET', '{}', 'string[]', 'List all available doctrine domains'),
('doctrine', 'EchoDoctrine', 'stats', 'method', '/doctrine/stats', 'GET', '{}', '{total_doctrines,domains,avg_confidence,providers}', 'Get doctrine forge statistics'),

-- ═══ VOICE (8 methods) ═══
('voice', 'EchoVoice', 'synthesize', 'method', '/voice/tts', 'POST', '{"text":"string","voice?":"VoiceId","emotion?":"Emotion","speed?":"number","format?":"mp3|wav|ogg"}', 'ArrayBuffer', 'Text-to-speech synthesis with voice selection and emotion'),
('voice', 'EchoVoice', 'transcribe', 'method', '/voice/stt', 'POST', '{"audioBase64":"string","language?":"string","format?":"string"}', '{text,confidence,language}', 'Speech-to-text transcription from base64 audio'),
('voice', 'EchoVoice', 'analyzeEmotion', 'method', '/voice/emotion/analyze', 'POST', '{"text":"string","personality?":"string"}', 'EmotionAnalysis', 'Analyze text for emotional content with personality context'),
('voice', 'EchoVoice', 'applyEmotionTags', 'method', '/voice/emotion/apply-tags', 'POST', '{"text":"string","personality?":"string"}', '{text,tags_applied}', 'Apply emotion SSML tags to text for TTS rendering'),
('voice', 'EchoVoice', 'orchestrate', 'method', '/voice/tts/orchestrate', 'POST', '{"text":"string","voice?":"VoiceId","emotion?":"boolean","format?":"string"}', 'ArrayBuffer', 'Quota-aware multi-provider blended TTS with automatic emotion'),
('voice', 'EchoVoice', 'listVoices', 'method', '/voice/voices', 'GET', '{}', 'VoiceInfo[]', 'List all available voices with metadata'),
('voice', 'EchoVoice', 'cloneVoice', 'method', '/voice/voices/clone', 'POST', '{"name":"string","samplesBase64":"string[]","description?":"string"}', '{voice_id,name}', 'Clone a voice from audio samples via ElevenLabs Instant Voice Cloning'),
('voice', 'EchoVoice', 'prepareText', 'method', '/voice/text/prepare', 'POST', '{"text":"string"}', '{text,changes}', 'Prepare text for TTS by stripping markdown and expanding abbreviations'),

-- ═══ CHAT (8 methods, 3 API + 5 client-side) ═══
('chat', 'EchoChat', 'send', 'method', '/chat/send', 'POST', '{"message":"string","personality?":"Personality","sessionId?":"string","options?":"ChatOptions"}', 'ChatResponse', 'Send a message with AI personality and session context'),
('chat', 'EchoChat', 'personalities', 'method', '/chat/personalities', 'GET', '{}', 'Personality[]', 'List all 14 available AI personalities'),
('chat', 'EchoChat', 'history', 'method', '/chat/history', 'GET', '{"sessionId":"string","limit?":"number"}', 'ChatMessage[]', 'Get conversation history for a session'),
('chat', 'EchoChat', 'createSession', 'method', null, null, '{"personality?":"Personality"}', 'ConversationSession', 'Create a new local conversation session (client-side)'),
('chat', 'EchoChat', 'getSession', 'method', null, null, '{"sessionId":"string"}', 'ConversationSession|undefined', 'Get a local conversation session by ID (client-side)'),
('chat', 'EchoChat', 'endSession', 'method', null, null, '{"sessionId":"string"}', 'void', 'End and remove a local conversation session (client-side)'),
('chat', 'EchoChat', 'converse', 'method', '/chat/send', 'POST', '{"message":"string","sessionId?":"string","personality?":"Personality","options?":"ChatOptions"}', 'ChatResponse', 'High-level conversation method: auto-creates session, tracks history, sends with context'),
('chat', 'EchoChat', 'activeSessions', 'method', null, null, '{}', 'string[]', 'List all active local session IDs (client-side)'),

-- ═══ VAULT (9 methods) ═══
('vault', 'EchoVault', 'get', 'method', '/vault/get', 'GET', '{"service":"string"}', 'CredentialWithSecret', 'Get a credential with secret by service name'),
('vault', 'EchoVault', 'store', 'method', '/vault/store', 'POST', '{"service":"string","username":"string","password":"string","category?":"string"}', '{success,service}', 'Store a new credential in the vault'),
('vault', 'EchoVault', 'search', 'method', '/vault/search', 'POST', '{"query":"string"}', 'Credential[]', 'Search credentials by keyword'),
('vault', 'EchoVault', 'list', 'method', '/vault/list', 'GET', '{"category?":"string"}', 'Credential[]', 'List all credentials with optional category filter'),
('vault', 'EchoVault', 'categories', 'method', '/vault/categories', 'GET', '{}', 'Array<{name,count}>', 'List all credential categories with counts'),
('vault', 'EchoVault', 'stats', 'method', '/vault/stats', 'GET', '{}', 'VaultStats', 'Get vault statistics'),
('vault', 'EchoVault', 'health', 'method', '/vault/health', 'GET', '{"service":"string"}', 'HealthScore', 'Get health score for a specific credential'),
('vault', 'EchoVault', 'delete', 'method', '/vault/delete', 'DELETE', '{"service":"string"}', '{success}', 'Delete a credential by service name'),
('vault', 'EchoVault', 'rotate', 'method', '/vault/rotate', 'POST', '{"service":"string","newPassword?":"string"}', '{success,service}', 'Rotate a credential password (auto-generates if not provided)'),

-- ═══ TOOLS (8 methods) ═══
('tools', 'EchoTools', 'search', 'method', '/tools/search', 'POST', '{"query":"string","limit?":"number"}', 'ToolInfo[]', 'Search MEGA Gateway tools by keyword'),
('tools', 'EchoTools', 'get', 'method', '/tools/info', 'GET', '{"toolId":"string"}', 'ToolInfo', 'Get detailed tool info by ID'),
('tools', 'EchoTools', 'categories', 'method', '/tools/categories', 'GET', '{}', 'ToolCategory[]', 'List all tool categories'),
('tools', 'EchoTools', 'listByCategory', 'method', '/tools/list', 'GET', '{"category":"string","limit?":"number"}', 'ToolInfo[]', 'List tools by category'),
('tools', 'EchoTools', 'execute', 'method', '/tools/execute', 'POST', '{"server":"string","tool":"string","params?":"Record<string,unknown>"}', 'ToolExecutionResult', 'Execute a MEGA Gateway tool'),
('tools', 'EchoTools', 'chains', 'method', '/tools/chains', 'GET', '{}', 'ToolChain[]', 'List all tool chains'),
('tools', 'EchoTools', 'executeChain', 'method', '/tools/chains/execute', 'POST', '{"chainId":"string","input?":"Record<string,unknown>"}', 'ToolExecutionResult[]', 'Execute a tool chain'),
('tools', 'EchoTools', 'stats', 'method', '/tools/stats', 'GET', '{}', '{total_tools,total_servers,categories}', 'Get MEGA Gateway tool statistics'),

-- ═══ MONITORING (5 methods, all client-side) ═══
('monitoring', 'EchoMonitor', 'record', 'method', null, null, '{"metric":"RequestMetric"}', 'void', 'Record a request metric locally (client-side)'),
('monitoring', 'EchoMonitor', 'getSummary', 'method', null, null, '{"windowMs?":"number"}', 'MetricsSummary', 'Get metrics summary for time window (client-side)'),
('monitoring', 'EchoMonitor', 'getMetrics', 'method', null, null, '{"limit?":"number"}', 'RequestMetric[]', 'Get raw metric entries (client-side)'),
('monitoring', 'EchoMonitor', 'clear', 'method', null, null, '{}', 'void', 'Clear all recorded metrics (client-side)'),
('monitoring', 'EchoMonitor', 'onThreshold', 'method', null, null, '{"thresholds":"object","callback":"function"}', '()=>void', 'Register threshold alert callback, returns unsubscribe function (client-side)'),

-- ═══ AGENT (8 methods) ═══
('agent', 'EchoAgent', 'create', 'method', '/agent/create', 'POST', '{"config":"AgentConfig"}', 'AgentRun', 'Create and start a new autonomous agent'),
('agent', 'EchoAgent', 'status', 'method', '/agent/status', 'GET', '{"agentId":"string"}', 'AgentRun', 'Get agent run status'),
('agent', 'EchoAgent', 'list', 'method', '/agent/list', 'GET', '{"status?":"string"}', 'AgentInfo[]', 'List agents with optional status filter'),
('agent', 'EchoAgent', 'stop', 'method', '/agent/stop', 'POST', '{"agentId":"string"}', '{success}', 'Stop a running agent'),
('agent', 'EchoAgent', 'logs', 'method', '/agent/logs', 'GET', '{"agentId":"string","limit?":"number"}', 'string[]', 'Get agent execution logs'),
('agent', 'EchoAgent', 'resume', 'method', '/agent/resume', 'POST', '{"agentId":"string"}', 'AgentRun', 'Resume a paused or stopped agent'),
('agent', 'EchoAgent', 'configure', 'method', '/agent/configure', 'PUT', '{"agentId":"string","config":"Partial<AgentConfig>"}', 'AgentInfo', 'Update agent configuration'),
('agent', 'EchoAgent', 'results', 'method', '/agent/results', 'GET', '{"agentId":"string"}', 'Record<string,unknown>', 'Get agent execution results'),

-- ═══ SCRAPER (10 methods) ═══
('scraper', 'EchoScraper', 'create', 'method', '/scraper/create', 'POST', '{"config":"ScraperConfig"}', 'ScraperInfo', 'Create a new scraper with configuration'),
('scraper', 'EchoScraper', 'run', 'method', '/scraper/run', 'POST', '{"scraperId":"string"}', 'ScraperJob', 'Start a scraper job'),
('scraper', 'EchoScraper', 'jobStatus', 'method', '/scraper/job', 'GET', '{"jobId":"string"}', 'ScraperJob', 'Get scraper job status'),
('scraper', 'EchoScraper', 'list', 'method', '/scraper/list', 'GET', '{}', 'ScraperInfo[]', 'List all scrapers'),
('scraper', 'EchoScraper', 'get', 'method', '/scraper/info', 'GET', '{"scraperId":"string"}', 'ScraperInfo', 'Get scraper details'),
('scraper', 'EchoScraper', 'records', 'method', '/scraper/records', 'GET', '{"scraperId":"string","limit?":"number","offset?":"number"}', 'ScrapedRecord[]', 'Get scraped records with pagination'),
('scraper', 'EchoScraper', 'delete', 'method', '/scraper/delete', 'DELETE', '{"scraperId":"string"}', '{success}', 'Delete a scraper'),
('scraper', 'EchoScraper', 'pause', 'method', '/scraper/pause', 'POST', '{"scraperId":"string"}', '{success}', 'Pause a running scraper'),
('scraper', 'EchoScraper', 'resume', 'method', '/scraper/resume', 'POST', '{"scraperId":"string"}', '{success}', 'Resume a paused scraper'),
('scraper', 'EchoScraper', 'history', 'method', '/scraper/history', 'GET', '{"scraperId":"string","limit?":"number"}', 'ScraperJob[]', 'Get scraper job history'),

-- ═══ BOT (11 methods) ═══
('bot', 'EchoBot', 'create', 'method', '/bot/create', 'POST', '{"config":"BotConfig"}', 'BotInfo', 'Create a new bot for a platform'),
('bot', 'EchoBot', 'list', 'method', '/bot/list', 'GET', '{"platform?":"BotPlatform"}', 'BotInfo[]', 'List bots with optional platform filter'),
('bot', 'EchoBot', 'get', 'method', '/bot/info', 'GET', '{"botId":"string"}', 'BotInfo', 'Get bot details'),
('bot', 'EchoBot', 'start', 'method', '/bot/start', 'POST', '{"botId":"string"}', '{success}', 'Start a bot'),
('bot', 'EchoBot', 'stop', 'method', '/bot/stop', 'POST', '{"botId":"string"}', '{success}', 'Stop a running bot'),
('bot', 'EchoBot', 'post', 'method', '/bot/post', 'POST', '{"botId":"string","content":"string","options?":"object"}', 'BotPost', 'Post content through a bot'),
('bot', 'EchoBot', 'stats', 'method', '/bot/stats', 'GET', '{"botId":"string"}', 'BotStats', 'Get bot engagement statistics'),
('bot', 'EchoBot', 'configure', 'method', '/bot/configure', 'PUT', '{"botId":"string","config":"Partial<BotConfig>"}', 'BotInfo', 'Update bot configuration'),
('bot', 'EchoBot', 'logs', 'method', '/bot/logs', 'GET', '{"botId":"string","limit?":"number"}', 'string[]', 'Get bot activity logs'),
('bot', 'EchoBot', 'subscribers', 'method', '/bot/subscribers', 'GET', '{"botId":"string"}', 'Array<{user_id,username,subscribed_at}>', 'Get bot subscribers'),
('bot', 'EchoBot', 'broadcast', 'method', '/bot/broadcast', 'POST', '{"botId":"string","message":"string","filter?":"object"}', '{sent,failed}', 'Broadcast message to bot subscribers'),

-- ═══ MEGA-GATEWAY (8 methods) ═══
('mega-gateway', 'EchoMegaGateway', 'search', 'method', '/mega/search', 'POST', '{"query":"string","category?":"GatewayCategory","limit?":"number"}', 'GatewayTool[]', 'Search MEGA Gateway for tools by keyword'),
('mega-gateway', 'EchoMegaGateway', 'execute', 'method', '/mega/execute', 'POST', '{"server":"string","tool":"string","params?":"Record<string,unknown>"}', 'GatewayExecResult', 'Execute a MEGA Gateway tool on a specific server'),
('mega-gateway', 'EchoMegaGateway', 'servers', 'method', '/mega/servers', 'GET', '{"category?":"GatewayCategory"}', 'GatewayServer[]', 'List available MEGA Gateway servers'),
('mega-gateway', 'EchoMegaGateway', 'serverTools', 'method', '/mega/server/tools', 'GET', '{"serverId":"string"}', 'GatewayTool[]', 'List tools available on a specific server'),
('mega-gateway', 'EchoMegaGateway', 'categories', 'method', '/mega/categories', 'GET', '{}', 'GatewayCategory[]', 'List all MEGA Gateway categories'),
('mega-gateway', 'EchoMegaGateway', 'stats', 'method', '/mega/stats', 'GET', '{}', 'GatewayStats', 'Get MEGA Gateway statistics'),
('mega-gateway', 'EchoMegaGateway', 'health', 'method', '/mega/health', 'GET', '{}', 'HealthStatus', 'Check MEGA Gateway health'),
('mega-gateway', 'EchoMegaGateway', 'history', 'method', '/mega/history', 'GET', '{"limit?":"number"}', 'GatewayExecResult[]', 'Get recent execution history'),

-- ═══ GRAPH-RAG (10 methods) ═══
('graph-rag', 'EchoGraphRAG', 'query', 'method', '/graph/query', 'POST', '{"query":"string","depth?":"number","limit?":"number"}', 'GraphSearchResult[]', 'Query knowledge graph with semantic search'),
('graph-rag', 'EchoGraphRAG', 'addNode', 'method', '/graph/node', 'POST', '{"label":"string","type":"string","properties?":"Record<string,unknown>"}', 'GraphNode', 'Add a node to the knowledge graph'),
('graph-rag', 'EchoGraphRAG', 'addEdge', 'method', '/graph/edge', 'POST', '{"source":"string","target":"string","relationship":"string","weight?":"number"}', 'GraphEdge', 'Add an edge between two nodes'),
('graph-rag', 'EchoGraphRAG', 'getNode', 'method', '/graph/node/:id', 'GET', '{"nodeId":"string"}', 'GraphNode', 'Get a node by ID with its edges'),
('graph-rag', 'EchoGraphRAG', 'neighbors', 'method', '/graph/neighbors', 'GET', '{"nodeId":"string","depth?":"number"}', 'GraphNode[]', 'Get neighbor nodes up to depth'),
('graph-rag', 'EchoGraphRAG', 'path', 'method', '/graph/path', 'GET', '{"source":"string","target":"string"}', 'GraphPath', 'Find shortest path between two nodes'),
('graph-rag', 'EchoGraphRAG', 'subgraph', 'method', '/graph/subgraph', 'GET', '{"domain":"string"}', '{nodes:GraphNode[],edges:GraphEdge[]}', 'Get a domain subgraph'),
('graph-rag', 'EchoGraphRAG', 'domains', 'method', '/graph/domains', 'GET', '{}', 'string[]', 'List all graph domains'),
('graph-rag', 'EchoGraphRAG', 'stats', 'method', '/graph/stats', 'GET', '{}', 'GraphStats', 'Get knowledge graph statistics'),
('graph-rag', 'EchoGraphRAG', 'deleteNode', 'method', '/graph/node/:id', 'DELETE', '{"nodeId":"string"}', '{success}', 'Delete a node and its edges'),

-- ═══ SWARM (10 methods) ═══
('swarm', 'EchoSwarm', 'post', 'method', '/swarm/moltbook/post', 'POST', '{"content":"string","mood?":"MoltMood","tags?":"string[]","authorName?":"string"}', 'MoltPost', 'Post to MoltBook social feed'),
('swarm', 'EchoSwarm', 'feed', 'method', '/swarm/moltbook/feed', 'GET', '{"limit?":"number","mood?":"MoltMood","tag?":"string"}', 'MoltPost[]', 'Read MoltBook feed with filters'),
('swarm', 'EchoSwarm', 'react', 'method', '/swarm/moltbook/react', 'POST', '{"postId":"string","reaction":"string"}', '{success}', 'React to a MoltBook post'),
('swarm', 'EchoSwarm', 'agents', 'method', '/swarm/agents', 'GET', '{}', 'SwarmAgent[]', 'List all swarm agents'),
('swarm', 'EchoSwarm', 'clusterStatus', 'method', '/swarm/status', 'GET', '{}', 'SwarmStats', 'Get swarm cluster status and statistics'),
('swarm', 'EchoSwarm', 'submitTask', 'method', '/swarm/task', 'POST', '{"description":"string","priority?":"number","assignTo?":"string"}', 'SwarmTask', 'Submit a task to the swarm'),
('swarm', 'EchoSwarm', 'taskStatus', 'method', '/swarm/task/status', 'GET', '{"taskId":"string"}', 'SwarmTask', 'Get swarm task status'),
('swarm', 'EchoSwarm', 'tasks', 'method', '/swarm/tasks', 'GET', '{"status?":"string","limit?":"number"}', 'SwarmTask[]', 'List swarm tasks with optional status filter'),
('swarm', 'EchoSwarm', 'broadcast', 'method', '/swarm/broadcast', 'POST', '{"message":"string","priority?":"string"}', 'BroadcastMessage', 'Broadcast message to all swarm agents'),
('swarm', 'EchoSwarm', 'broadcasts', 'method', '/swarm/broadcasts', 'GET', '{"limit?":"number"}', 'BroadcastMessage[]', 'Get recent broadcasts'),

-- ═══ DARKWEB (9 methods) ═══
('darkweb', 'EchoDarkweb', 'scan', 'method', '/darkweb/scan', 'POST', '{"query":"string","sources?":"string[]","severity?":"ThreatSeverity"}', 'DarkwebThreat[]', 'Scan dark web for threats matching query'),
('darkweb', 'EchoDarkweb', 'threats', 'method', '/darkweb/threats', 'GET', '{"severity?":"ThreatSeverity","category?":"ThreatCategory","limit?":"number"}', 'DarkwebThreat[]', 'List detected threats with filters'),
('darkweb', 'EchoDarkweb', 'intel', 'method', '/darkweb/intel', 'GET', '{"limit?":"number"}', 'DarkwebIntel[]', 'Get processed dark web intelligence'),
('darkweb', 'EchoDarkweb', 'alerts', 'method', '/darkweb/alerts', 'GET', '{"active?":"boolean"}', 'DarkwebAlert[]', 'Get dark web alert configurations'),
('darkweb', 'EchoDarkweb', 'createAlert', 'method', '/darkweb/alerts', 'POST', '{"name":"string","keywords":"string[]","severity?":"ThreatSeverity","channels?":"string[]"}', 'DarkwebAlert', 'Create a new dark web monitoring alert'),
('darkweb', 'EchoDarkweb', 'deleteAlert', 'method', '/darkweb/alerts/:id', 'DELETE', '{"alertId":"string"}', '{success}', 'Delete a dark web alert'),
('darkweb', 'EchoDarkweb', 'breachCheck', 'method', '/darkweb/breach', 'POST', '{"email":"string"}', 'BreachResult', 'Check if email appears in breach databases'),
('darkweb', 'EchoDarkweb', 'monitorBrand', 'method', '/darkweb/brand', 'POST', '{"brand":"string","domains?":"string[]","keywords?":"string[]"}', 'DarkwebAlert', 'Set up brand monitoring on dark web'),
('darkweb', 'EchoDarkweb', 'stats', 'method', '/darkweb/stats', 'GET', '{}', 'DarkwebStats', 'Get dark web monitoring statistics'),

-- ═══ CRYPTO (8 methods) ═══
('crypto', 'EchoCrypto', 'prices', 'method', '/crypto/prices', 'GET', '{"pairs?":"string[]"}', 'TradingPair[]', 'Get current crypto prices for trading pairs'),
('crypto', 'EchoCrypto', 'placeOrder', 'method', '/crypto/order', 'POST', '{"pair":"string","side":"OrderSide","amount":"number","price?":"number","strategy?":"TradingStrategy"}', 'TradeOrder', 'Place a trading order'),
('crypto', 'EchoCrypto', 'orderStatus', 'method', '/crypto/order/status', 'GET', '{"orderId":"string"}', 'TradeOrder', 'Get order status'),
('crypto', 'EchoCrypto', 'orders', 'method', '/crypto/orders', 'GET', '{"status?":"OrderStatus","pair?":"string","limit?":"number"}', 'TradeOrder[]', 'List orders with filters'),
('crypto', 'EchoCrypto', 'portfolio', 'method', '/crypto/portfolio', 'GET', '{}', 'PortfolioPosition[]', 'Get current portfolio positions'),
('crypto', 'EchoCrypto', 'strategies', 'method', '/crypto/strategies', 'GET', '{}', 'StrategyConfig[]', 'List configured trading strategies'),
('crypto', 'EchoCrypto', 'configureStrategy', 'method', '/crypto/strategies', 'POST', '{"strategy":"TradingStrategy","pair":"string","config":"object"}', 'StrategyConfig', 'Configure a trading strategy'),
('crypto', 'EchoCrypto', 'stats', 'method', '/crypto/stats', 'GET', '{}', 'CryptoStats', 'Get crypto trading statistics'),

-- ═══ NEWS (7 methods) ═══
('news', 'EchoNews', 'latest', 'method', '/news/latest', 'GET', '{"topic?":"string","source?":"NewsSource","sentiment?":"NewsSentiment","limit?":"number"}', 'NewsArticle[]', 'Get latest news articles with filters'),
('news', 'EchoNews', 'search', 'method', '/news/search', 'POST', '{"query":"string","dateFrom?":"string","dateTo?":"string","limit?":"number"}', 'NewsArticle[]', 'Search news articles by query and date range'),
('news', 'EchoNews', 'topics', 'method', '/news/topics', 'GET', '{}', 'NewsTopic[]', 'List tracked news topics'),
('news', 'EchoNews', 'watchTopic', 'method', '/news/topics', 'POST', '{"topic":"string","keywords":"string[]","sentiment?":"NewsSentiment"}', 'NewsTopic', 'Create a new topic watch'),
('news', 'EchoNews', 'alerts', 'method', '/news/alerts', 'GET', '{"active?":"boolean"}', 'NewsAlert[]', 'Get news alert configurations'),
('news', 'EchoNews', 'createAlert', 'method', '/news/alerts', 'POST', '{"topic":"string","keywords":"string[]","threshold?":"number","channels?":"string[]"}', 'NewsAlert', 'Create a news alert'),
('news', 'EchoNews', 'stats', 'method', '/news/stats', 'GET', '{}', 'NewsStats', 'Get news scraper statistics'),

-- ═══ SEC-EDGAR (7 methods) ═══
('sec-edgar', 'EchoSECEdgar', 'search', 'method', '/sec/search', 'POST', '{"query":"string","filingType?":"FilingType","dateFrom?":"string","dateTo?":"string"}', 'SECFiling[]', 'Search SEC filings by keyword and type'),
('sec-edgar', 'EchoSECEdgar', 'filings', 'method', '/sec/filings', 'GET', '{"ticker":"string","type?":"FilingType","limit?":"number"}', 'SECFiling[]', 'Get filings for a specific company ticker'),
('sec-edgar', 'EchoSECEdgar', 'watch', 'method', '/sec/watchlist', 'POST', '{"ticker":"string","filingTypes?":"FilingType[]"}', 'WatchlistCompany', 'Add a company to the SEC watchlist'),
('sec-edgar', 'EchoSECEdgar', 'watchlist', 'method', '/sec/watchlist', 'GET', '{}', 'WatchlistCompany[]', 'Get SEC watchlist companies'),
('sec-edgar', 'EchoSECEdgar', 'unwatch', 'method', '/sec/watchlist', 'DELETE', '{"ticker":"string"}', '{success}', 'Remove a company from SEC watchlist'),
('sec-edgar', 'EchoSECEdgar', 'alerts', 'method', '/sec/alerts', 'GET', '{"ticker?":"string","limit?":"number"}', 'SECAlert[]', 'Get SEC filing alerts'),
('sec-edgar', 'EchoSECEdgar', 'stats', 'method', '/sec/stats', 'GET', '{}', 'SECStats', 'Get SEC EDGAR monitoring statistics'),

-- ═══ REDDIT (6 methods) ═══
('reddit', 'EchoReddit', 'search', 'method', '/reddit/search', 'POST', '{"query":"string","subreddit?":"string","sort?":"string","limit?":"number"}', 'RedditPost[]', 'Search Reddit posts by keyword and subreddit'),
('reddit', 'EchoReddit', 'watch', 'method', '/reddit/watch', 'POST', '{"subreddit":"string","keywords":"string[]","minScore?":"number"}', 'SubredditWatch', 'Watch a subreddit for keywords'),
('reddit', 'EchoReddit', 'watchlist', 'method', '/reddit/watchlist', 'GET', '{}', 'SubredditWatch[]', 'Get subreddit watchlist'),
('reddit', 'EchoReddit', 'unwatch', 'method', '/reddit/watch', 'DELETE', '{"subreddit":"string"}', '{success}', 'Stop watching a subreddit'),
('reddit', 'EchoReddit', 'alerts', 'method', '/reddit/alerts', 'GET', '{"subreddit?":"string","limit?":"number"}', 'RedditAlert[]', 'Get Reddit monitoring alerts'),
('reddit', 'EchoReddit', 'stats', 'method', '/reddit/stats', 'GET', '{}', 'RedditStats', 'Get Reddit monitor statistics'),

-- ═══ PRICE-ALERTS (6 methods) ═══
('price-alerts', 'EchoPriceAlerts', 'create', 'method', '/price-alerts/create', 'POST', '{"asset":"string","assetType":"AssetType","condition":"AlertCondition","targetPrice":"number","channels?":"string[]"}', 'PriceAlert', 'Create a new price alert'),
('price-alerts', 'EchoPriceAlerts', 'list', 'method', '/price-alerts/list', 'GET', '{"active?":"boolean","assetType?":"AssetType"}', 'PriceAlert[]', 'List price alerts with filters'),
('price-alerts', 'EchoPriceAlerts', 'delete', 'method', '/price-alerts/delete', 'DELETE', '{"alertId":"string"}', '{success}', 'Delete a price alert'),
('price-alerts', 'EchoPriceAlerts', 'prices', 'method', '/price-alerts/prices', 'GET', '{"assets":"string[]"}', 'PriceSnapshot[]', 'Get current prices for assets'),
('price-alerts', 'EchoPriceAlerts', 'history', 'method', '/price-alerts/history', 'GET', '{"alertId?":"string","limit?":"number"}', 'AlertHistory[]', 'Get alert trigger history'),
('price-alerts', 'EchoPriceAlerts', 'stats', 'method', '/price-alerts/stats', 'GET', '{}', 'PriceAlertStats', 'Get price alert statistics'),

-- ═══ LANDMAN (8 methods) ═══
('landman', 'EchoLandman', 'investigate', 'method', '/landman/investigate', 'POST', '{"county":"string","section?":"string","block?":"string","survey?":"string","grantor?":"string","grantee?":"string"}', 'TitleInvestigation', 'Start a title investigation'),
('landman', 'EchoLandman', 'chainOfTitle', 'method', '/landman/chain-of-title', 'POST', '{"county":"string","section":"string","block?":"string","survey?":"string"}', 'ChainOfTitle', 'Build chain of title for a tract'),
('landman', 'EchoLandman', 'searchDeeds', 'method', '/landman/search', 'POST', '{"query":"string","county?":"string","deedType?":"DeedType","limit?":"number"}', 'DeedRecord[]', 'Search deed records'),
('landman', 'EchoLandman', 'runsheet', 'method', '/landman/runsheet/:id', 'GET', '{"investigationId":"string"}', 'Runsheet', 'Get runsheet for a title investigation'),
('landman', 'EchoLandman', 'counties', 'method', '/landman/counties', 'GET', '{}', 'Array<{name,state,record_count}>', 'List available counties with record counts'),
('landman', 'EchoLandman', 'jobs', 'method', '/landman/jobs', 'GET', '{"status?":"InvestigationStatus"}', 'TitleInvestigation[]', 'List title investigation jobs'),
('landman', 'EchoLandman', 'jobStatus', 'method', '/landman/jobs/:id', 'GET', '{"jobId":"string"}', 'TitleInvestigation', 'Get job status'),
('landman', 'EchoLandman', 'stats', 'method', '/landman/stats', 'GET', '{}', 'LandmanStats', 'Get landman pipeline statistics'),

-- ═══ MODEL-HOST (6 methods) ═══
('model-host', 'EchoModelHost', 'infer', 'method', '/models/infer', 'POST', '{"request":"InferenceRequest"}', 'InferenceResponse', 'Run inference on a hosted model'),
('model-host', 'EchoModelHost', 'listModels', 'method', '/models/list', 'GET', '{}', 'ModelStats[]', 'List available hosted models'),
('model-host', 'EchoModelHost', 'modelInfo', 'method', '/models/info', 'GET', '{"modelId":"string"}', 'ModelStats', 'Get model info'),
('model-host', 'EchoModelHost', 'adapters', 'method', '/models/adapters', 'GET', '{}', 'ModelAdapter[]', 'List available LoRA adapters'),
('model-host', 'EchoModelHost', 'switchAdapter', 'method', '/models/switch', 'POST', '{"adapterId":"string"}', '{success,active_adapter}', 'Switch active LoRA adapter'),
('model-host', 'EchoModelHost', 'stats', 'method', '/models/stats', 'GET', '{}', 'ModelStats', 'Get model hosting statistics'),

-- ═══ HARVESTER (6 methods) ═══
('harvester', 'EchoHarvester', 'addSource', 'method', '/harvester/source', 'POST', '{"url":"string","sourceType":"SourceType","schedule?":"string","category?":"string"}', 'HarvestSource', 'Add a new harvest source'),
('harvester', 'EchoHarvester', 'sources', 'method', '/harvester/sources', 'GET', '{"status?":"HarvestStatus","sourceType?":"SourceType"}', 'HarvestSource[]', 'List harvest sources with filters'),
('harvester', 'EchoHarvester', 'harvest', 'method', '/harvester/run', 'POST', '{"sourceId":"string"}', 'HarvestItem[]', 'Trigger harvest from a source'),
('harvester', 'EchoHarvester', 'items', 'method', '/harvester/items', 'GET', '{"sourceId?":"string","limit?":"number"}', 'HarvestItem[]', 'Get harvested items'),
('harvester', 'EchoHarvester', 'discover', 'method', '/harvester/discover', 'POST', '{"topic":"string","depth?":"number"}', 'DiscoveryReport', 'Discover new sources for a topic'),
('harvester', 'EchoHarvester', 'stats', 'method', '/harvester/stats', 'GET', '{}', 'HarvesterStats', 'Get harvester statistics'),

-- ═══ SCANNER (6 methods) ═══
('scanner', 'EchoScanner', 'scan', 'method', '/scanner/scan', 'POST', '{"county":"string","documentTypes?":"string[]","dateRange?":"object","maxDocuments?":"number"}', 'ScanJob', 'Start a county document scan'),
('scanner', 'EchoScanner', 'jobStatus', 'method', '/scanner/job', 'GET', '{"jobId":"string"}', 'ScanJob', 'Get scan job status'),
('scanner', 'EchoScanner', 'jobs', 'method', '/scanner/jobs', 'GET', '{"status?":"ScrapeStatus","county?":"string"}', 'ScanJob[]', 'List scan jobs with filters'),
('scanner', 'EchoScanner', 'searchDocuments', 'method', '/scanner/search', 'POST', '{"query":"string","county?":"string","documentType?":"string","limit?":"number"}', 'ScannedDocument[]', 'Search scanned documents'),
('scanner', 'EchoScanner', 'counties', 'method', '/scanner/counties', 'GET', '{}', 'CountyStatus[]', 'Get county scan status'),
('scanner', 'EchoScanner', 'stats', 'method', '/scanner/stats', 'GET', '{}', 'ScannerStats', 'Get scanner statistics'),

-- ═══ WORKFLOWS (7 methods) ═══
('workflows', 'EchoWorkflows', 'create', 'method', '/workflows/create', 'POST', '{"name":"string","steps":"WorkflowStep[]","description?":"string","tags?":"string[]"}', 'Workflow', 'Create a new workflow'),
('workflows', 'EchoWorkflows', 'run', 'method', '/workflows/run', 'POST', '{"workflowId":"string","inputs?":"Record<string,unknown>"}', 'WorkflowRun', 'Execute a workflow with optional inputs'),
('workflows', 'EchoWorkflows', 'runStatus', 'method', '/workflows/run/status', 'GET', '{"runId":"string"}', 'WorkflowRun', 'Get workflow run status'),
('workflows', 'EchoWorkflows', 'list', 'method', '/workflows/list', 'GET', '{"status?":"WorkflowStatus","tag?":"string"}', 'Workflow[]', 'List workflows with filters'),
('workflows', 'EchoWorkflows', 'crons', 'method', '/workflows/crons', 'GET', '{"active?":"boolean"}', 'CronJob[]', 'List cron job schedules'),
('workflows', 'EchoWorkflows', 'createCron', 'method', '/workflows/cron', 'POST', '{"name":"string","schedule":"string","workflowId?":"string","action?":"string"}', 'CronJob', 'Create a cron job schedule'),
('workflows', 'EchoWorkflows', 'stats', 'method', '/workflows/stats', 'GET', '{}', 'WorkflowStats', 'Get workflow statistics'),

-- ═══ NOTIFICATIONS (6 methods) ═══
('notifications', 'EchoNotifications', 'send', 'method', '/notifications/send', 'POST', '{"channel":"NotificationChannel","recipient":"string","subject":"string","body":"string","priority?":"NotificationPriority"}', 'Notification', 'Send a notification'),
('notifications', 'EchoNotifications', 'list', 'method', '/notifications/list', 'GET', '{"channel?":"NotificationChannel","status?":"NotificationStatus","limit?":"number"}', 'Notification[]', 'List notifications with filters'),
('notifications', 'EchoNotifications', 'rules', 'method', '/notifications/rules', 'GET', '{}', 'NotificationRule[]', 'Get notification routing rules'),
('notifications', 'EchoNotifications', 'createRule', 'method', '/notifications/rules', 'POST', '{"name":"string","condition":"object","channels":"NotificationChannel[]","priority?":"NotificationPriority"}', 'NotificationRule', 'Create a notification routing rule'),
('notifications', 'EchoNotifications', 'deleteRule', 'method', '/notifications/rules/:id', 'DELETE', '{"ruleId":"string"}', '{success}', 'Delete a notification rule'),
('notifications', 'EchoNotifications', 'stats', 'method', '/notifications/stats', 'GET', '{}', 'NotificationStats', 'Get notification statistics'),

-- ═══ FLEET (7 methods) ═══
('fleet', 'EchoFleet', 'workers', 'method', '/fleet/workers', 'GET', '{"status?":"WorkerStatus"}', 'FleetWorker[]', 'List fleet workers with status filter'),
('fleet', 'EchoFleet', 'deploy', 'method', '/fleet/deploy', 'POST', '{"deployment":"FleetDeployment"}', 'FleetDeployment', 'Deploy a service to fleet workers'),
('fleet', 'EchoFleet', 'workerStatus', 'method', '/fleet/worker/status', 'GET', '{"workerId":"string"}', 'FleetWorker', 'Get specific worker status'),
('fleet', 'EchoFleet', 'register', 'method', '/fleet/register', 'POST', '{"registration":"ServiceRegistration"}', 'ServiceRegistration', 'Register a service in the fleet'),
('fleet', 'EchoFleet', 'services', 'method', '/fleet/services', 'GET', '{}', 'ServiceRegistration[]', 'List registered fleet services'),
('fleet', 'EchoFleet', 'scale', 'method', '/fleet/scale', 'POST', '{"serviceId":"string","replicas":"number"}', '{success,current_replicas}', 'Scale a fleet service'),
('fleet', 'EchoFleet', 'stats', 'method', '/fleet/stats', 'GET', '{}', 'FleetStats', 'Get fleet statistics'),

-- ═══ MEMORY-PRIME (6 methods) ═══
('memory-prime', 'EchoMemoryPrime', 'store', 'method', '/memory-prime/store', 'POST', '{"content":"string","pillar":"MemoryPillar","importance?":"number","tags?":"string[]"}', 'MemoryEntry', 'Store memory in a specific pillar'),
('memory-prime', 'EchoMemoryPrime', 'recall', 'method', '/memory-prime/recall', 'POST', '{"query":"string","pillar?":"MemoryPillar","limit?":"number"}', 'MemorySearchResult[]', 'Recall memories by semantic search'),
('memory-prime', 'EchoMemoryPrime', 'pillars', 'method', '/memory-prime/pillars', 'GET', '{}', 'MemoryPillarStats[]', 'Get statistics for all 9 memory pillars'),
('memory-prime', 'EchoMemoryPrime', 'consolidate', 'method', '/memory-prime/consolidate', 'POST', '{"pillar?":"MemoryPillar"}', '{consolidated,pruned}', 'Trigger memory consolidation'),
('memory-prime', 'EchoMemoryPrime', 'forget', 'method', '/memory-prime/forget', 'DELETE', '{"memoryId":"string"}', '{success}', 'Delete a specific memory'),
('memory-prime', 'EchoMemoryPrime', 'stats', 'method', '/memory-prime/stats', 'GET', '{}', 'MemoryStats', 'Get memory system statistics'),

-- ═══ AUTONOMOUS (7 methods) ═══
('autonomous', 'EchoAutonomous', 'status', 'method', '/daemon/status', 'GET', '{}', 'DaemonStatus', 'Get autonomous daemon status'),
('autonomous', 'EchoAutonomous', 'tasks', 'method', '/daemon/tasks', 'GET', '{"status?":"DaemonTaskStatus"}', 'AutoTask[]', 'List daemon tasks with status filter'),
('autonomous', 'EchoAutonomous', 'createTask', 'method', '/daemon/tasks', 'POST', '{"description":"string","schedule?":"string","priority?":"number","autoRetry?":"boolean"}', 'AutoTask', 'Create an autonomous task'),
('autonomous', 'EchoAutonomous', 'patterns', 'method', '/daemon/patterns', 'GET', '{}', 'DetectedPattern[]', 'Get detected automation patterns'),
('autonomous', 'EchoAutonomous', 'workerHealth', 'method', '/daemon/health', 'GET', '{}', 'WorkerHealthReport', 'Get worker health reports'),
('autonomous', 'EchoAutonomous', 'configure', 'method', '/daemon/configure', 'PUT', '{"config":"object"}', '{success}', 'Update daemon configuration'),
('autonomous', 'EchoAutonomous', 'stats', 'method', '/daemon/stats', 'GET', '{}', 'DaemonStats', 'Get autonomous daemon statistics'),

-- ═══ UNIFIED EchoPrime CLASS (5 methods) ═══
('index', 'EchoPrime', 'search', 'method', '/search', 'POST', '{"query":"string","sources?":"string[]","limit?":"number"}', 'SearchResult[]', 'Unified search across engines, knowledge, and brain'),
('index', 'EchoPrime', 'health', 'method', '/health', 'GET', '{}', 'HealthStatus', 'Gateway health check'),
('index', 'EchoPrime', 'getCircuitState', 'method', null, null, '{}', 'CircuitBreakerInfo', 'Get circuit breaker diagnostics (client-side)'),
('index', 'EchoPrime', 'clearCache', 'method', null, null, '{}', 'void', 'Clear all cached responses (client-side)'),
('index', 'EchoPrime', 'resetCircuit', 'method', null, null, '{}', 'void', 'Reset circuit breaker to CLOSED state (client-side)');
