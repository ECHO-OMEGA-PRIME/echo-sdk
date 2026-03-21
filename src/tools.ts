/** Echo Prime SDK v3.0 — Tool Discovery module
 * Search and execute 37,000+ MCP tools via MEGA Gateway.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface ToolInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  server: string;
  tier: string;
  popularity_score: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  tool_count: number;
}

export interface ToolChain {
  id: string;
  name: string;
  description: string;
  tools: string[];
  use_case: string;
}

export interface ToolExecutionResult {
  success: boolean;
  output: unknown;
  tool: string;
  server: string;
  latency_ms: number;
}

export class EchoTools {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search for tools by keyword */
  async search(query: string, limit = 10): Promise<ToolInfo[]> {
    return this.client.request<ToolInfo[]>('/tools/search', {
      params: { q: query, limit: String(limit) },
    });
  }

  /** Get tool details by ID */
  async get(toolId: string): Promise<ToolInfo> {
    return this.client.request<ToolInfo>('/tools/info', {
      params: { id: toolId },
    });
  }

  /** List tool categories */
  async categories(): Promise<ToolCategory[]> {
    return this.client.request<ToolCategory[]>('/tools/categories');
  }

  /** List tools in a category */
  async listByCategory(category: string, limit = 50): Promise<ToolInfo[]> {
    return this.client.request<ToolInfo[]>('/tools/list', {
      params: { category, limit: String(limit) },
    });
  }

  /** Execute a tool */
  async execute(
    server: string,
    tool: string,
    params: Record<string, unknown> = {},
  ): Promise<ToolExecutionResult> {
    return this.client.request<ToolExecutionResult>('/tools/execute', {
      method: 'POST',
      body: { server, tool, params },
    });
  }

  /** Get pre-built tool chains for common workflows */
  async chains(): Promise<ToolChain[]> {
    return this.client.request<ToolChain[]>('/tools/chains');
  }

  /** Execute a tool chain (runs tools in sequence) */
  async executeChain(
    chainId: string,
    input: Record<string, unknown> = {},
  ): Promise<ToolExecutionResult[]> {
    return this.client.request<ToolExecutionResult[]>('/tools/chains/execute', {
      method: 'POST',
      body: { chain_id: chainId, input },
    });
  }

  /** Get tool usage statistics */
  async stats(): Promise<{ total_tools: number; total_servers: number; categories: number }> {
    return this.client.request('/tools/stats');
  }
}
