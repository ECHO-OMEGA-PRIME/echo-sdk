/** Echo Prime SDK v3.3 -- Request Batcher
 * Queue multiple requests and send as a single batch call.
 * Auto-flush by count or interval. Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface BatchRequest {
  method: string;
  path: string;
  body?: unknown;
}

export interface BatchOptions {
  /** Max requests before auto-flush. Default: 25 */
  maxBatch?: number;
  /** Auto-flush interval in ms. Default: 100ms. Set 0 to disable. */
  flushInterval?: number;
}

interface QueuedRequest {
  request: BatchRequest;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

/**
 * Batches multiple SDK requests into a single HTTP call to the
 * /batch endpoint on the SDK Gateway. Reduces round-trips and
 * improves throughput for bulk operations.
 */
export class RequestBatcher {
  private queue: QueuedRequest[] = [];
  private readonly maxBatch: number;
  private readonly flushInterval: number;
  private timer: unknown = null;
  private client: EchoHttpClient;
  private flushing = false;

  constructor(clientConfig: EchoClientConfig, options: BatchOptions = {}) {
    this.client = new EchoHttpClient(clientConfig);
    this.maxBatch = options.maxBatch ?? 25;
    this.flushInterval = options.flushInterval ?? 100;

    if (this.flushInterval > 0) {
      const id = setInterval(() => {
        if (this.queue.length > 0 && !this.flushing) {
          this.flush().catch(() => {}); // fire-and-forget on interval
        }
      }, this.flushInterval);
      this.timer = id;
      // Allow Node.js to exit even if timer is active
      if (typeof id === 'object' && id !== null && 'unref' in id) {
        (id as { unref: () => void }).unref();
      }
    }
  }

  /**
   * Add a request to the batch queue.
   * Returns a promise that resolves with the individual response
   * once the batch is flushed.
   */
  add(request: BatchRequest): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      // Auto-flush if we hit maxBatch
      if (this.queue.length >= this.maxBatch && !this.flushing) {
        this.flush().catch(() => {});
      }
    });
  }

  /**
   * Flush all queued requests as a single batch call.
   * Each queued promise resolves/rejects with its individual result.
   */
  async flush(): Promise<unknown[]> {
    if (this.queue.length === 0) return [];
    this.flushing = true;

    // Drain the queue
    const batch = this.queue.splice(0);
    const requests = batch.map((q) => q.request);

    try {
      const results = await this.client.request<unknown[]>('/batch', {
        method: 'POST',
        body: { requests },
        cacheTtlMs: 0, // never cache batch responses
      });

      // Resolve individual promises
      const resultArray = Array.isArray(results) ? results : [results];
      for (let i = 0; i < batch.length; i++) {
        const result = resultArray[i];
        if (result && typeof result === 'object' && 'error' in result) {
          batch[i].reject(new Error(String((result as { error: string }).error)));
        } else {
          batch[i].resolve(result ?? null);
        }
      }

      return resultArray;
    } catch (err) {
      // If the batch call itself fails, reject all queued promises
      const error = err instanceof Error ? err : new Error(String(err));
      for (const q of batch) {
        q.reject(error);
      }
      return [];
    } finally {
      this.flushing = false;
    }
  }

  /** Number of requests currently queued */
  get pending(): number {
    return this.queue.length;
  }

  /** Stop the auto-flush interval timer */
  destroy(): void {
    if (this.timer != null) {
      clearInterval(this.timer as ReturnType<typeof setInterval>);
      this.timer = null;
    }
    // Reject any remaining queued requests
    for (const q of this.queue) {
      q.reject(new Error('RequestBatcher destroyed'));
    }
    this.queue = [];
  }
}

export { RequestBatcher as default };
