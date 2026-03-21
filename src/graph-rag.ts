/** Echo Prime SDK v3.0 — GraphRAG module
 * Knowledge graph with 312K+ nodes, 3.3M+ edges across 93 domains.
 * Semantic search, path finding, subgraph extraction.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  domain: string;
  properties: Record<string, unknown>;
  edge_count: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
  properties?: Record<string, unknown>;
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
  total_weight: number;
  hops: number;
}

export interface GraphSearchResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  query_latency_ms: number;
  total_matches: number;
}

export interface GraphStats {
  total_nodes: number;
  total_edges: number;
  domains: number;
  node_types: string[];
  avg_degree: number;
}

export class EchoGraphRAG {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Semantic search across the knowledge graph */
  async search(query: string, opts?: { domain?: string; limit?: number; depth?: number }): Promise<GraphSearchResult> {
    return this.client.request<GraphSearchResult>('/graph/search', {
      method: 'POST',
      body: { query, domain: opts?.domain, limit: opts?.limit ?? 20, depth: opts?.depth ?? 2 },
    });
  }

  /** Get a specific node by ID */
  async getNode(nodeId: string): Promise<GraphNode> {
    return this.client.request<GraphNode>('/graph/node', {
      params: { id: nodeId },
    });
  }

  /** Get edges connected to a node */
  async getEdges(nodeId: string, opts?: { direction?: 'in' | 'out' | 'both'; limit?: number }): Promise<GraphEdge[]> {
    return this.client.request<GraphEdge[]>('/graph/edges', {
      params: { node_id: nodeId, direction: opts?.direction ?? 'both', limit: String(opts?.limit ?? 50) },
    });
  }

  /** Find shortest path between two nodes */
  async findPath(sourceId: string, targetId: string, maxHops = 5): Promise<GraphPath | null> {
    return this.client.request<GraphPath | null>('/graph/path', {
      method: 'POST',
      body: { source: sourceId, target: targetId, max_hops: maxHops },
    });
  }

  /** Extract a subgraph around a node */
  async subgraph(nodeId: string, depth = 2, maxNodes = 100): Promise<GraphSearchResult> {
    return this.client.request<GraphSearchResult>('/graph/subgraph', {
      params: { node_id: nodeId, depth: String(depth), max_nodes: String(maxNodes) },
    });
  }

  /** Add a node to the graph */
  async addNode(label: string, type: string, domain: string, properties?: Record<string, unknown>): Promise<GraphNode> {
    return this.client.request<GraphNode>('/graph/node', {
      method: 'POST',
      body: { label, type, domain, properties },
    });
  }

  /** Add an edge between two nodes */
  async addEdge(sourceId: string, targetId: string, relationship: string, weight = 1.0): Promise<GraphEdge> {
    return this.client.request<GraphEdge>('/graph/edge', {
      method: 'POST',
      body: { source: sourceId, target: targetId, relationship, weight },
    });
  }

  /** List all domains in the graph */
  async domains(): Promise<Array<{ domain: string; node_count: number; edge_count: number }>> {
    return this.client.request('/graph/domains');
  }

  /** Get graph statistics */
  async stats(): Promise<GraphStats> {
    return this.client.request<GraphStats>('/graph/stats');
  }

  /** RAG query — combines graph traversal with LLM reasoning */
  async query(question: string, opts?: { domain?: string; maxSources?: number }): Promise<{
    answer: string;
    sources: GraphNode[];
    confidence: number;
    reasoning_chain: string[];
  }> {
    return this.client.request('/graph/rag-query', {
      method: 'POST',
      body: { question, domain: opts?.domain, max_sources: opts?.maxSources ?? 10 },
    });
  }
}
