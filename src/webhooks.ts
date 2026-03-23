/** Echo Prime SDK v3.2 — Webhooks module
 * Register, manage, and consume webhook subscriptions.
 * Supports event filtering, testing, and real-time event streaming.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

// ── Public interfaces ────────────────────────────────────────────────────────

/** Configuration for the WebhookClient */
export interface WebhookConfig {
  /** SDK Gateway base URL. Defaults to https://echo-sdk-gateway.bmcii1976.workers.dev */
  baseUrl?: string;
  /** Echo API key for authentication */
  apiKey: string;
}

/** A registered webhook subscription */
export interface Webhook {
  /** Unique webhook identifier */
  id: string;
  /** Destination URL that receives POST requests */
  url: string;
  /** List of event types this webhook listens for */
  events: string[];
  /** Whether the webhook is currently active */
  active: boolean;
  /** ISO timestamp of when the webhook was created */
  created_at: string;
  /** ISO timestamp of the last successful delivery, or null if never triggered */
  last_triggered: string | null;
  /** Number of consecutive delivery failures */
  failure_count: number;
}

// ── Client implementation ────────────────────────────────────────────────────

/**
 * SDK client for webhook management — register endpoints, subscribe to events,
 * test delivery, and stream real-time events.
 *
 * @example
 * ```ts
 * const hooks = new WebhookClient({ apiKey: 'my-key' });
 *
 * // Register a webhook
 * const hook = await hooks.register(
 *   'https://myapp.com/webhooks',
 *   ['engine.created', 'build.complete'],
 *   'my-signing-secret'
 * );
 *
 * // Test delivery
 * const test = await hooks.test(hook.id);
 * console.log(`Delivered: ${test.delivered}, Status: ${test.status}`);
 *
 * // Stream events in real-time
 * for await (const event of hooks.events(['engine.*'])) {
 *   console.log(`${event.event}: ${JSON.stringify(event.data)}`);
 * }
 * ```
 */
export class WebhookClient {
  private client: EchoHttpClient;
  private baseUrl: string;
  private apiKey: string;

  constructor(config: WebhookConfig) {
    const gatewayUrl = config.baseUrl || 'https://echo-sdk-gateway.bmcii1976.workers.dev';
    const clientConfig: EchoClientConfig = {
      apiKey: config.apiKey,
      gatewayUrl,
    };
    this.client = new EchoHttpClient(clientConfig);
    this.baseUrl = gatewayUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  /**
   * Register a new webhook subscription.
   * @param url - Destination URL that will receive POST requests with event payloads
   * @param events - List of event types to subscribe to (e.g. ['engine.created', 'build.*'])
   * @param secret - Optional signing secret for HMAC verification of payloads
   * @returns The created webhook object
   */
  async register(url: string, events: string[], secret?: string): Promise<Webhook> {
    const body: Record<string, unknown> = { url, events };
    if (secret !== undefined) {
      body.secret = secret;
    }
    return this.client.request<Webhook>('/webhooks/register', {
      method: 'POST',
      body,
    });
  }

  /**
   * List all registered webhooks for the authenticated account.
   * @returns Array of webhook objects
   */
  async list(): Promise<Webhook[]> {
    return this.client.request<Webhook[]>('/webhooks/list');
  }

  /**
   * Delete a webhook subscription.
   * @param webhookId - ID of the webhook to delete
   */
  async delete(webhookId: string): Promise<void> {
    await this.client.request<void>(`/webhooks/${encodeURIComponent(webhookId)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Send a test event to a webhook to verify delivery.
   * @param webhookId - ID of the webhook to test
   * @returns Delivery result with HTTP status code
   */
  async test(webhookId: string): Promise<{ delivered: boolean; status: number }> {
    return this.client.request<{ delivered: boolean; status: number }>(
      `/webhooks/${encodeURIComponent(webhookId)}/test`,
      { method: 'POST', body: {} },
    );
  }

  /**
   * Stream real-time events as they occur via Server-Sent Events.
   * Automatically reconnects on connection drops.
   *
   * @param filter - Optional list of event type patterns to filter (e.g. ['engine.*', 'build.complete'])
   * @yields Event objects with event type, data payload, and timestamp
   *
   * @example
   * ```ts
   * for await (const event of hooks.events(['build.*'])) {
   *   console.log(`[${event.timestamp}] ${event.event}:`, event.data);
   * }
   * ```
   */
  async *events(
    filter?: string[],
  ): AsyncGenerator<{ event: string; data: unknown; timestamp: string }> {
    const url = new URL('/webhooks/events/stream', this.baseUrl);
    if (filter && filter.length > 0) {
      url.searchParams.set('filter', filter.join(','));
    }

    const controller = new AbortController();

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Echo-API-Key': this.apiKey,
          'Accept': 'text/event-stream',
          'X-SDK-Version': '3.0.0',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        try {
          const json = JSON.parse(text);
          if (json.error?.message) errorMsg = json.error.message;
        } catch {
          // Use default error message
        }
        throw new Error(`Webhook event stream error: ${errorMsg}`);
      }

      if (!response.body) {
        throw new Error('Webhook event stream error: Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE format — events are separated by double newlines
          const parts = buffer.split('\n\n');
          // Keep the last potentially incomplete chunk in the buffer
          buffer = parts.pop() || '';

          for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;

            let eventType = 'message';
            let eventData = '';

            const lines = trimmed.split('\n');
            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith('data: ')) {
                eventData += line.slice(6);
              }
            }

            if (!eventData || eventData === '[DONE]') continue;

            try {
              const parsed = JSON.parse(eventData);
              yield {
                event: parsed.event || eventType,
                data: parsed.data ?? parsed,
                timestamp: parsed.timestamp || new Date().toISOString(),
              };
            } catch {
              // Non-JSON event — yield raw
              yield {
                event: eventType,
                data: eventData,
                timestamp: new Date().toISOString(),
              };
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } finally {
      controller.abort();
    }
  }
}

export { WebhookClient as default };
