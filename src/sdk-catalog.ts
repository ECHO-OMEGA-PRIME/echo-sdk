/** Echo Prime SDK v3.2 — SDK Catalog module
 * Discover 221 SDK methods across 30 modules.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface SdkMethod {
  id: number;
  module: string;
  class_name: string;
  method_name: string;
  kind: string;
  route: string;
  http_method: string;
  params: Array<{ name: string; type: string; required?: boolean; description?: string }>;
  return_type: string;
  description: string;
  sdk_version: string;
  created_at: string;
}

export interface SdkModule {
  module: string;
  class_name: string;
  method_count: number;
}

export class EchoSdkCatalog {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** List all SDK methods (paginated) */
  async list(opts?: { limit?: number; offset?: number; module?: string }): Promise<{
    methods: SdkMethod[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  }> {
    const params: Record<string, string> = {};
    if (opts?.limit) params.limit = String(opts.limit);
    if (opts?.offset) params.offset = String(opts.offset);
    if (opts?.module) params.module = opts.module;
    return this.client.request('/sdk/catalog', { params });
  }

  /** List all modules with method counts */
  async modules(): Promise<{ modules: SdkModule[]; total_modules: number }> {
    return this.client.request('/sdk/catalog/modules');
  }

  /** Search methods by keyword */
  async search(query: string, limit = 20): Promise<{
    query: string;
    methods: SdkMethod[];
    total: number;
  }> {
    return this.client.request('/sdk/catalog/search', {
      params: { q: query, limit: String(limit) },
    });
  }

  /** Get a method by exact name */
  async method(name: string): Promise<{ methods: SdkMethod[] }> {
    return this.client.request(`/sdk/catalog/method/${encodeURIComponent(name)}`);
  }

  /** Get all methods for a specific module */
  async module(moduleName: string): Promise<{
    module: string;
    class_names: string[];
    methods: SdkMethod[];
    total: number;
  }> {
    return this.client.request(`/sdk/catalog/${encodeURIComponent(moduleName)}`);
  }
}

export { EchoSdkCatalog as default };
