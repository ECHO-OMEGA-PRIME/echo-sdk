export const FUNCTION_METADATA = [
  {
    "name": "agent.create",
    "category": "agent",
    "description": "agent create",
    "inputSchema": {
      "required": [
        "agentConfig"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.run",
    "category": "agent",
    "description": "agent run",
    "inputSchema": {
      "required": [
        "agentId",
        "task",
        "unknown>"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.status",
    "category": "agent",
    "description": "agent status",
    "inputSchema": {
      "required": [
        "runId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.cancel",
    "category": "agent",
    "description": "agent cancel",
    "inputSchema": {
      "required": [
        "runId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.list",
    "category": "agent",
    "description": "agent list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.get",
    "category": "agent",
    "description": "agent get",
    "inputSchema": {
      "required": [
        "agentId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.delete",
    "category": "agent",
    "description": "agent delete",
    "inputSchema": {
      "required": [
        "agentId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "agent.history",
    "category": "agent",
    "description": "agent history",
    "inputSchema": {
      "required": [
        "agentId",
        "limit = 20"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.status",
    "category": "autonomous",
    "description": "autonomous status",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.healthReport",
    "category": "autonomous",
    "description": "autonomous healthReport",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.tasks",
    "category": "autonomous",
    "description": "autonomous tasks",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.createTask",
    "category": "autonomous",
    "description": "autonomous createTask",
    "inputSchema": {
      "required": [
        "description"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.patterns",
    "category": "autonomous",
    "description": "autonomous patterns",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.stats",
    "category": "autonomous",
    "description": "autonomous stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "autonomous.sweep",
    "category": "autonomous",
    "description": "autonomous sweep",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.create",
    "category": "bot",
    "description": "bot create",
    "inputSchema": {
      "required": [
        "botConfig"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.list",
    "category": "bot",
    "description": "bot list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.get",
    "category": "bot",
    "description": "bot get",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.post",
    "category": "bot",
    "description": "bot post",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.stats",
    "category": "bot",
    "description": "bot stats",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.posts",
    "category": "bot",
    "description": "bot posts",
    "inputSchema": {
      "required": [
        "botId",
        "limit = 50"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.pause",
    "category": "bot",
    "description": "bot pause",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.resume",
    "category": "bot",
    "description": "bot resume",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.delete",
    "category": "bot",
    "description": "bot delete",
    "inputSchema": {
      "required": [
        "botId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.updateCredentials",
    "category": "bot",
    "description": "bot updateCredentials",
    "inputSchema": {
      "required": [
        "botId",
        "credentials",
        "string>"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "bot.templates",
    "category": "bot",
    "description": "bot templates",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "brain.ingest",
    "category": "brain",
    "description": "brain ingest",
    "inputSchema": {
      "required": [
        "content",
        "importance = 5",
        "tags"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "brain.search",
    "category": "brain",
    "description": "brain search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 10"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "brain.recall",
    "category": "brain",
    "description": "brain recall",
    "inputSchema": {
      "required": [
        "key"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "brain.store",
    "category": "brain",
    "description": "brain store",
    "inputSchema": {
      "required": [
        "key",
        "value",
        "unknown>"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "brain.stats",
    "category": "brain",
    "description": "brain stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "chat.send",
    "category": "chat",
    "description": "chat send",
    "inputSchema": {
      "required": [
        "message",
        "options"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "chat.sendInSession",
    "category": "chat",
    "description": "chat sendInSession",
    "inputSchema": {
      "required": [
        "sessionId",
        "message"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "chat.listPersonalities",
    "category": "chat",
    "description": "chat listPersonalities",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.price",
    "category": "crypto",
    "description": "crypto price",
    "inputSchema": {
      "required": [
        "pair"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.prices",
    "category": "crypto",
    "description": "crypto prices",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.createStrategy",
    "category": "crypto",
    "description": "crypto createStrategy",
    "inputSchema": {
      "required": [
        "name",
        "strategy",
        "pair",
        "params",
        "unknown>"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.strategies",
    "category": "crypto",
    "description": "crypto strategies",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.toggleStrategy",
    "category": "crypto",
    "description": "crypto toggleStrategy",
    "inputSchema": {
      "required": [
        "strategyId",
        "active"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.trades",
    "category": "crypto",
    "description": "crypto trades",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.portfolio",
    "category": "crypto",
    "description": "crypto portfolio",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "crypto.stats",
    "category": "crypto",
    "description": "crypto stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.search",
    "category": "darkweb",
    "description": "darkweb search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.checkBreach",
    "category": "darkweb",
    "description": "darkweb checkBreach",
    "inputSchema": {
      "required": [
        "email"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.createAlert",
    "category": "darkweb",
    "description": "darkweb createAlert",
    "inputSchema": {
      "required": [
        "name",
        "keywords"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.alerts",
    "category": "darkweb",
    "description": "darkweb alerts",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.deleteAlert",
    "category": "darkweb",
    "description": "darkweb deleteAlert",
    "inputSchema": {
      "required": [
        "alertId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.threats",
    "category": "darkweb",
    "description": "darkweb threats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.intel",
    "category": "darkweb",
    "description": "darkweb intel",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.monitorBrand",
    "category": "darkweb",
    "description": "darkweb monitorBrand",
    "inputSchema": {
      "required": [
        "brand",
        "domains",
        "keywords"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "darkweb.stats",
    "category": "darkweb",
    "description": "darkweb stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "doctrine.generate",
    "category": "doctrine",
    "description": "doctrine generate",
    "inputSchema": {
      "required": [
        "domain",
        "topic"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "doctrine.list",
    "category": "doctrine",
    "description": "doctrine list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "doctrine.providers",
    "category": "doctrine",
    "description": "doctrine providers",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "doctrine.search",
    "category": "doctrine",
    "description": "doctrine search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 10"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.query",
    "category": "engines",
    "description": "engines query",
    "inputSchema": {
      "required": [
        "question"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.queryBatch",
    "category": "engines",
    "description": "engines queryBatch",
    "inputSchema": {
      "required": [
        "queries"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.list",
    "category": "engines",
    "description": "engines list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.search",
    "category": "engines",
    "description": "engines search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 10"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.metadata",
    "category": "engines",
    "description": "engines metadata",
    "inputSchema": {
      "required": [
        "engineId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.capabilities",
    "category": "engines",
    "description": "engines capabilities",
    "inputSchema": {
      "required": [
        "engineId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "engines.status",
    "category": "engines",
    "description": "engines status",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.health",
    "category": "fleet",
    "description": "fleet health",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.workerStatus",
    "category": "fleet",
    "description": "fleet workerStatus",
    "inputSchema": {
      "required": [
        "workerName"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.services",
    "category": "fleet",
    "description": "fleet services",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.register",
    "category": "fleet",
    "description": "fleet register",
    "inputSchema": {
      "required": [
        "name",
        "url",
        "capabilities"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.deployments",
    "category": "fleet",
    "description": "fleet deployments",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.deploy",
    "category": "fleet",
    "description": "fleet deploy",
    "inputSchema": {
      "required": [
        "workerName"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "fleet.stats",
    "category": "fleet",
    "description": "fleet stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.search",
    "category": "graph-rag",
    "description": "graph-rag search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.getNode",
    "category": "graph-rag",
    "description": "graph-rag getNode",
    "inputSchema": {
      "required": [
        "nodeId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.getEdges",
    "category": "graph-rag",
    "description": "graph-rag getEdges",
    "inputSchema": {
      "required": [
        "nodeId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.findPath",
    "category": "graph-rag",
    "description": "graph-rag findPath",
    "inputSchema": {
      "required": [
        "sourceId",
        "targetId",
        "maxHops = 5"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.subgraph",
    "category": "graph-rag",
    "description": "graph-rag subgraph",
    "inputSchema": {
      "required": [
        "nodeId",
        "depth = 2",
        "maxNodes = 100"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.addNode",
    "category": "graph-rag",
    "description": "graph-rag addNode",
    "inputSchema": {
      "required": [
        "label",
        "type",
        "domain",
        "unknown>"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.addEdge",
    "category": "graph-rag",
    "description": "graph-rag addEdge",
    "inputSchema": {
      "required": [
        "sourceId",
        "targetId",
        "relationship",
        "weight = 1.0"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.domains",
    "category": "graph-rag",
    "description": "graph-rag domains",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.stats",
    "category": "graph-rag",
    "description": "graph-rag stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "graph-rag.query",
    "category": "graph-rag",
    "description": "graph-rag query",
    "inputSchema": {
      "required": [
        "question"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.addSource",
    "category": "harvester",
    "description": "harvester addSource",
    "inputSchema": {
      "required": [
        "name",
        "url",
        "sourceType",
        "category",
        "schedule = '0 */6 * * *'"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.sources",
    "category": "harvester",
    "description": "harvester sources",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.harvest",
    "category": "harvester",
    "description": "harvester harvest",
    "inputSchema": {
      "required": [
        "sourceId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.items",
    "category": "harvester",
    "description": "harvester items",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.reports",
    "category": "harvester",
    "description": "harvester reports",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "harvester.stats",
    "category": "harvester",
    "description": "harvester stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "index.search",
    "category": "index",
    "description": "index search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 10"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "index.health",
    "category": "index",
    "description": "index health",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "knowledge.search",
    "category": "knowledge",
    "description": "knowledge search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 5"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "knowledge.categories",
    "category": "knowledge",
    "description": "knowledge categories",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "knowledge.ingest",
    "category": "knowledge",
    "description": "knowledge ingest",
    "inputSchema": {
      "required": [
        "title",
        "content",
        "category"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.investigate",
    "category": "landman",
    "description": "landman investigate",
    "inputSchema": {
      "required": [
        "county",
        "legalDescription"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.status",
    "category": "landman",
    "description": "landman status",
    "inputSchema": {
      "required": [
        "investigationId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.chainOfTitle",
    "category": "landman",
    "description": "landman chainOfTitle",
    "inputSchema": {
      "required": [
        "county",
        "legalDescription"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.searchRecords",
    "category": "landman",
    "description": "landman searchRecords",
    "inputSchema": {
      "required": [
        "options"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.runsheet",
    "category": "landman",
    "description": "landman runsheet",
    "inputSchema": {
      "required": [
        "investigationId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.countyQuery",
    "category": "landman",
    "description": "landman countyQuery",
    "inputSchema": {
      "required": [
        "county"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.countyStats",
    "category": "landman",
    "description": "landman countyStats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "landman.stats",
    "category": "landman",
    "description": "landman stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.search",
    "category": "mega-gateway",
    "description": "mega-gateway search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.execute",
    "category": "mega-gateway",
    "description": "mega-gateway execute",
    "inputSchema": {
      "required": [
        "server",
        "tool",
        "params",
        "unknown> = {}"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.executeChain",
    "category": "mega-gateway",
    "description": "mega-gateway executeChain",
    "inputSchema": {
      "required": [
        "steps",
        "unknown> }>"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.servers",
    "category": "mega-gateway",
    "description": "mega-gateway servers",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.categories",
    "category": "mega-gateway",
    "description": "mega-gateway categories",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.toolInfo",
    "category": "mega-gateway",
    "description": "mega-gateway toolInfo",
    "inputSchema": {
      "required": [
        "server",
        "tool"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.serverTools",
    "category": "mega-gateway",
    "description": "mega-gateway serverTools",
    "inputSchema": {
      "required": [
        "serverId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "mega-gateway.stats",
    "category": "mega-gateway",
    "description": "mega-gateway stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.store",
    "category": "memory-prime",
    "description": "memory-prime store",
    "inputSchema": {
      "required": [
        "pillar",
        "content"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.search",
    "category": "memory-prime",
    "description": "memory-prime search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.recall",
    "category": "memory-prime",
    "description": "memory-prime recall",
    "inputSchema": {
      "required": [
        "pillar"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.get",
    "category": "memory-prime",
    "description": "memory-prime get",
    "inputSchema": {
      "required": [
        "memoryId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.delete",
    "category": "memory-prime",
    "description": "memory-prime delete",
    "inputSchema": {
      "required": [
        "memoryId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "memory-prime.stats",
    "category": "memory-prime",
    "description": "memory-prime stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.chat",
    "category": "model-host",
    "description": "model-host chat",
    "inputSchema": {
      "required": [
        "request"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.list",
    "category": "model-host",
    "description": "model-host list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.info",
    "category": "model-host",
    "description": "model-host info",
    "inputSchema": {
      "required": [
        "modelId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.switchModel",
    "category": "model-host",
    "description": "model-host switchModel",
    "inputSchema": {
      "required": [
        "modelId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.stats",
    "category": "model-host",
    "description": "model-host stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "model-host.health",
    "category": "model-host",
    "description": "model-host health",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.search",
    "category": "news",
    "description": "news search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.feed",
    "category": "news",
    "description": "news feed",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.analyzeSentiment",
    "category": "news",
    "description": "news analyzeSentiment",
    "inputSchema": {
      "required": [
        "text"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.trackTopic",
    "category": "news",
    "description": "news trackTopic",
    "inputSchema": {
      "required": [
        "name",
        "keywords"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.topics",
    "category": "news",
    "description": "news topics",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.createAlert",
    "category": "news",
    "description": "news createAlert",
    "inputSchema": {
      "required": [
        "name",
        "keywords"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "news.stats",
    "category": "news",
    "description": "news stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.send",
    "category": "notifications",
    "description": "notifications send",
    "inputSchema": {
      "required": [
        "channel",
        "recipient",
        "message"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.broadcast",
    "category": "notifications",
    "description": "notifications broadcast",
    "inputSchema": {
      "required": [
        "channels",
        "message"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.createRule",
    "category": "notifications",
    "description": "notifications createRule",
    "inputSchema": {
      "required": [
        "name",
        "condition",
        "channels",
        "priority"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.rules",
    "category": "notifications",
    "description": "notifications rules",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.history",
    "category": "notifications",
    "description": "notifications history",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "notifications.stats",
    "category": "notifications",
    "description": "notifications stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.create",
    "category": "price-alerts",
    "description": "price-alerts create",
    "inputSchema": {
      "required": [
        "asset",
        "condition",
        "threshold",
        "assetType"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.list",
    "category": "price-alerts",
    "description": "price-alerts list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.delete",
    "category": "price-alerts",
    "description": "price-alerts delete",
    "inputSchema": {
      "required": [
        "alertId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.prices",
    "category": "price-alerts",
    "description": "price-alerts prices",
    "inputSchema": {
      "required": [
        "assets"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.history",
    "category": "price-alerts",
    "description": "price-alerts history",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "price-alerts.stats",
    "category": "price-alerts",
    "description": "price-alerts stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.search",
    "category": "reddit",
    "description": "reddit search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.watch",
    "category": "reddit",
    "description": "reddit watch",
    "inputSchema": {
      "required": [
        "subreddit",
        "keywords",
        "minScore = 0"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.watchlist",
    "category": "reddit",
    "description": "reddit watchlist",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.unwatch",
    "category": "reddit",
    "description": "reddit unwatch",
    "inputSchema": {
      "required": [
        "subreddit"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.alerts",
    "category": "reddit",
    "description": "reddit alerts",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "reddit.stats",
    "category": "reddit",
    "description": "reddit stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.scan",
    "category": "scanner",
    "description": "scanner scan",
    "inputSchema": {
      "required": [
        "county"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.jobStatus",
    "category": "scanner",
    "description": "scanner jobStatus",
    "inputSchema": {
      "required": [
        "jobId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.jobs",
    "category": "scanner",
    "description": "scanner jobs",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.searchDocuments",
    "category": "scanner",
    "description": "scanner searchDocuments",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.counties",
    "category": "scanner",
    "description": "scanner counties",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.stats",
    "category": "scanner",
    "description": "scanner stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scanner.recommendBuild",
    "category": "scanner",
    "description": "scanner recommendBuild",
    "inputSchema": {
      "required": [
        "options"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.create",
    "category": "scraper",
    "description": "scraper create",
    "inputSchema": {
      "required": [
        "scraperConfig"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.run",
    "category": "scraper",
    "description": "scraper run",
    "inputSchema": {
      "required": [
        "scraperId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.jobStatus",
    "category": "scraper",
    "description": "scraper jobStatus",
    "inputSchema": {
      "required": [
        "jobId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.list",
    "category": "scraper",
    "description": "scraper list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.get",
    "category": "scraper",
    "description": "scraper get",
    "inputSchema": {
      "required": [
        "scraperId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.records",
    "category": "scraper",
    "description": "scraper records",
    "inputSchema": {
      "required": [
        "scraperId",
        "limit = 50",
        "offset = 0"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.delete",
    "category": "scraper",
    "description": "scraper delete",
    "inputSchema": {
      "required": [
        "scraperId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.pause",
    "category": "scraper",
    "description": "scraper pause",
    "inputSchema": {
      "required": [
        "scraperId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.resume",
    "category": "scraper",
    "description": "scraper resume",
    "inputSchema": {
      "required": [
        "scraperId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "scraper.history",
    "category": "scraper",
    "description": "scraper history",
    "inputSchema": {
      "required": [
        "scraperId",
        "limit = 20"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.search",
    "category": "sec-edgar",
    "description": "sec-edgar search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.filings",
    "category": "sec-edgar",
    "description": "sec-edgar filings",
    "inputSchema": {
      "required": [
        "ticker"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.watch",
    "category": "sec-edgar",
    "description": "sec-edgar watch",
    "inputSchema": {
      "required": [
        "ticker"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.watchlist",
    "category": "sec-edgar",
    "description": "sec-edgar watchlist",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.unwatch",
    "category": "sec-edgar",
    "description": "sec-edgar unwatch",
    "inputSchema": {
      "required": [
        "ticker"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.alerts",
    "category": "sec-edgar",
    "description": "sec-edgar alerts",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "sec-edgar.stats",
    "category": "sec-edgar",
    "description": "sec-edgar stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.post",
    "category": "swarm",
    "description": "swarm post",
    "inputSchema": {
      "required": [
        "content"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.feed",
    "category": "swarm",
    "description": "swarm feed",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.react",
    "category": "swarm",
    "description": "swarm react",
    "inputSchema": {
      "required": [
        "postId",
        "reaction"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.agents",
    "category": "swarm",
    "description": "swarm agents",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.clusterStatus",
    "category": "swarm",
    "description": "swarm clusterStatus",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.submitTask",
    "category": "swarm",
    "description": "swarm submitTask",
    "inputSchema": {
      "required": [
        "description"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.taskStatus",
    "category": "swarm",
    "description": "swarm taskStatus",
    "inputSchema": {
      "required": [
        "taskId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.tasks",
    "category": "swarm",
    "description": "swarm tasks",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.broadcast",
    "category": "swarm",
    "description": "swarm broadcast",
    "inputSchema": {
      "required": [
        "message",
        "priority"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "swarm.broadcasts",
    "category": "swarm",
    "description": "swarm broadcasts",
    "inputSchema": {
      "required": [
        "limit = 50"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.search",
    "category": "tools",
    "description": "tools search",
    "inputSchema": {
      "required": [
        "query",
        "limit = 10"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.get",
    "category": "tools",
    "description": "tools get",
    "inputSchema": {
      "required": [
        "toolId"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.categories",
    "category": "tools",
    "description": "tools categories",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.listByCategory",
    "category": "tools",
    "description": "tools listByCategory",
    "inputSchema": {
      "required": [
        "category",
        "limit = 50"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.execute",
    "category": "tools",
    "description": "tools execute",
    "inputSchema": {
      "required": [
        "server",
        "tool",
        "params",
        "unknown> = {}"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.chains",
    "category": "tools",
    "description": "tools chains",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.executeChain",
    "category": "tools",
    "description": "tools executeChain",
    "inputSchema": {
      "required": [
        "chainId",
        "input",
        "unknown> = {}"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "tools.stats",
    "category": "tools",
    "description": "tools stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.get",
    "category": "vault",
    "description": "vault get",
    "inputSchema": {
      "required": [
        "service"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.store",
    "category": "vault",
    "description": "vault store",
    "inputSchema": {
      "required": [
        "service",
        "username",
        "password"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.search",
    "category": "vault",
    "description": "vault search",
    "inputSchema": {
      "required": [
        "query"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.list",
    "category": "vault",
    "description": "vault list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.categories",
    "category": "vault",
    "description": "vault categories",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.stats",
    "category": "vault",
    "description": "vault stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.health",
    "category": "vault",
    "description": "vault health",
    "inputSchema": {
      "required": [
        "service"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.delete",
    "category": "vault",
    "description": "vault delete",
    "inputSchema": {
      "required": [
        "service"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "vault.rotate",
    "category": "vault",
    "description": "vault rotate",
    "inputSchema": {
      "required": [
        "service"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.synthesize",
    "category": "voice",
    "description": "voice synthesize",
    "inputSchema": {
      "required": [
        "text",
        "options"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.transcribe",
    "category": "voice",
    "description": "voice transcribe",
    "inputSchema": {
      "required": [
        "audioBase64",
        "options"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.analyzeEmotion",
    "category": "voice",
    "description": "voice analyzeEmotion",
    "inputSchema": {
      "required": [
        "text"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.applyEmotionTags",
    "category": "voice",
    "description": "voice applyEmotionTags",
    "inputSchema": {
      "required": [
        "text"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.orchestrate",
    "category": "voice",
    "description": "voice orchestrate",
    "inputSchema": {
      "required": [
        "text",
        "voice"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.listVoices",
    "category": "voice",
    "description": "voice listVoices",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.cloneVoice",
    "category": "voice",
    "description": "voice cloneVoice",
    "inputSchema": {
      "required": [
        "name",
        "samplesBase64"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "voice.prepareText",
    "category": "voice",
    "description": "voice prepareText",
    "inputSchema": {
      "required": [
        "text"
      ]
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.create",
    "category": "workflows",
    "description": "workflows create",
    "inputSchema": {
      "required": [
        "name",
        "steps",
        "'id' | 'status' | 'output' | 'duration_ms'>[]"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.run",
    "category": "workflows",
    "description": "workflows run",
    "inputSchema": {
      "required": [
        "workflowId",
        "unknown>"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.runStatus",
    "category": "workflows",
    "description": "workflows runStatus",
    "inputSchema": {
      "required": [
        "runId"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.list",
    "category": "workflows",
    "description": "workflows list",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.crons",
    "category": "workflows",
    "description": "workflows crons",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.createCron",
    "category": "workflows",
    "description": "workflows createCron",
    "inputSchema": {
      "required": [
        "name",
        "schedule"
      ]
    },
    "riskLevel": "high",
    "examples": [
      {}
    ]
  },
  {
    "name": "workflows.stats",
    "category": "workflows",
    "description": "workflows stats",
    "inputSchema": {
      "required": []
    },
    "riskLevel": "medium",
    "examples": [
      {}
    ]
  }
];
