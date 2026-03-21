/** Echo Prime SDK v3.0 — Vault module
 * Credential management via Echo Vault API.
 * CONTRACT §SEC-1: No secret values in code. Runtime vault fetch only.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface Credential {
  service: string;
  username: string;
  category?: string;
  strength?: string;
  created_at: string;
  updated_at?: string;
}

export interface CredentialWithSecret extends Credential {
  password: string;
}

export interface VaultStats {
  total_credentials: number;
  categories: number;
  weak_count: number;
  breached_count: number;
}

export interface HealthScore {
  service: string;
  score: number;
  age_days: number;
  strength: string;
  breached: boolean;
  reused: boolean;
}

export class EchoVault {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Get a credential by service name */
  async get(service: string): Promise<CredentialWithSecret> {
    return this.client.request<CredentialWithSecret>('/vault/get', {
      params: { service },
    });
  }

  /** Store a new credential */
  async store(
    service: string,
    username: string,
    password: string,
    category?: string,
  ): Promise<{ success: boolean; service: string }> {
    return this.client.request('/vault/store', {
      method: 'POST',
      body: { service, username, password, ...(category ? { category } : {}) },
    });
  }

  /** Search credentials by keyword */
  async search(query: string): Promise<Credential[]> {
    return this.client.request<Credential[]>('/vault/search', {
      params: { q: query },
    });
  }

  /** List all credentials (without passwords) */
  async list(category?: string): Promise<Credential[]> {
    return this.client.request<Credential[]>('/vault/list', {
      params: category ? { category } : {},
    });
  }

  /** List credential categories */
  async categories(): Promise<Array<{ name: string; count: number }>> {
    return this.client.request('/vault/categories');
  }

  /** Get vault statistics */
  async stats(): Promise<VaultStats> {
    return this.client.request<VaultStats>('/vault/stats');
  }

  /** Get health score for a credential */
  async health(service: string): Promise<HealthScore> {
    return this.client.request<HealthScore>('/vault/health', {
      params: { service },
    });
  }

  /** Delete a credential */
  async delete(service: string): Promise<{ success: boolean }> {
    return this.client.request('/vault/delete', {
      method: 'DELETE',
      params: { service },
    });
  }

  /** Rotate a credential (generate new password, update vault) */
  async rotate(
    service: string,
    newPassword?: string,
  ): Promise<{ success: boolean; service: string }> {
    return this.client.request('/vault/rotate', {
      method: 'POST',
      body: { service, ...(newPassword ? { password: newPassword } : {}) },
    });
  }
}
