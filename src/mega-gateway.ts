/** Echo Prime SDK v3.0 — MEGA Gateway module
 * Access 37,475+ MCP tools across 1,901 servers and 12 categories.
 * AI_ML, API, AUTOMATION, CLOUD, COMMUNICATION, DATA,
 * DEVTOOLS, FINANCE, MEDIA, MONITORING, NETWORK, SECURITY.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type GatewayCategory =
  | 'AI_ML' | 'API' | 'AUTOMATION' | 'CLOUD' | 'COMMUNICATION' | 'DATA'
  | 'DEVTOOLS' | 'FINANCE' | 'MEDIA' | 'MONITORING' | 'NETWORK' | 'SECURITY';

export interface GatewayServer {
  id: string;
  name: string;
  category: GatewayCategory;
  tool_count: number;
  status: 'online' | 'offline' | 'degraded';
  description: string;
}

export interface GatewayTool {
  id: string;
  name: string;
  server: string;
  category: GatewayCategory;
  description: string;
  parameters: Record<string, unknown>;
  tier: string;
}

export interface GatewayExecResult {
  success: boolean;
  output: unknown;
  tool: string;
  server: string;
  latency_ms: number;
  tokens_used?: number;
}

export interface GatewayStats {
  total_tools: number;
  total_servers: number;
  categories: number;
  requests_today: number;
  avg_latency_ms: number;
}

export class EchoMegaGateway {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search across 37,475+ tools */
  async search(query: string, opts?: { category?: GatewayCategory; limit?: number }): Promise<GatewayTool[]> {
    return this.client.request<GatewayTool[]>('/mega/search', {
      params: {
        q: query,
        ...(opts?.category ? { category: opts.category } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Execute a tool on a specific server */
  async execute(server: string, tool: string, params: Record<string, unknown> = {}): Promise<GatewayExecResult> {
    return this.client.request<GatewayExecResult>('/mega/execute', {
      method: 'POST',
      body: { server, tool, params },
    });
  }

  /** Execute multiple tools in sequence (tool chain) */
  async executeChain(
    steps: Array<{ server: string; tool: string; params?: Record<string, unknown> }>,
  ): Promise<GatewayExecResult[]> {
    return this.client.request<GatewayExecResult[]>('/mega/execute-chain', {
      method: 'POST',
      body: { steps },
    });
  }

  /** List all servers, optionally filtered by category */
  async servers(category?: GatewayCategory): Promise<GatewayServer[]> {
    return this.client.request<GatewayServer[]>('/mega/servers', {
      params: category ? { category } : {},
    });
  }

  /** List all categories with tool counts */
  async categories(): Promise<Array<{ category: GatewayCategory; tool_count: number; server_count: number }>> {
    return this.client.request('/mega/categories');
  }

  /** Get detailed info about a specific tool */
  async toolInfo(server: string, tool: string): Promise<GatewayTool> {
    return this.client.request<GatewayTool>('/mega/tool-info', {
      params: { server, tool },
    });
  }

  /** List all tools on a specific server */
  async serverTools(serverId: string): Promise<GatewayTool[]> {
    return this.client.request<GatewayTool[]>('/mega/server-tools', {
      params: { server: serverId },
    });
  }

  /** Get gateway statistics */
  async stats(): Promise<GatewayStats> {
    return this.client.request<GatewayStats>('/mega/stats');
  }
}
