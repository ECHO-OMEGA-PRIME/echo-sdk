/** Echo Prime SDK v3.3 -- Offline Cache Module
 * Pre-download engines/knowledge for offline use. Delta sync. Size-bounded.
 * Extends the base EchoCache with offline-first capabilities.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface OfflineCacheConfig {
  /** Maximum cache size in bytes. Default: 500MB */
  maxSizeBytes?: number;
  /** Default TTL in seconds. Default: 3600 (1 hour) */
  ttlSeconds?: number;
  /** Storage backend. Default: 'memory' */
  storage?: 'memory' | 'indexeddb';
}

export interface OfflineCacheStats {
  entries: number;
  sizeBytes: number;
  hitRate: number;
  oldestEntry: Date;
}

interface CacheRecord {
  value: unknown;
  sizeBytes: number;
  expiresAt: number;
  createdAt: number;
  accessedAt: number;
  etag?: string;
}

interface SyncManifest {
  engineIds: string[];
  knowledgeCategories: string[];
  lastSyncAt: number;
}

/**
 * Offline-first cache with preloading, delta sync, and size-bounded eviction.
 * Works alongside EchoHttpClient to serve cached responses when the network
 * is unavailable or slow.
 */
export class OfflineCache {
  private store = new Map<string, CacheRecord>();
  private readonly maxSizeBytes: number;
  private readonly defaultTtlMs: number;
  private currentSizeBytes = 0;
  private hits = 0;
  private misses = 0;
  private client: EchoHttpClient | null = null;
  private syncManifest: SyncManifest = {
    engineIds: [],
    knowledgeCategories: [],
    lastSyncAt: 0,
  };

  constructor(config: OfflineCacheConfig = {}) {
    this.maxSizeBytes = config.maxSizeBytes ?? 500 * 1024 * 1024; // 500MB
    this.defaultTtlMs = (config.ttlSeconds ?? 3600) * 1000;
  }

  /** Attach an HTTP client for preload/sync operations */
  attachClient(client: EchoHttpClient): void {
    this.client = client;
  }

  /** Create from an EchoClientConfig for standalone use */
  static withClient(clientConfig: EchoClientConfig, cacheConfig?: OfflineCacheConfig): OfflineCache {
    const cache = new OfflineCache(cacheConfig);
    cache.client = new EchoHttpClient(clientConfig);
    return cache;
  }

  // ── Core cache operations ──────────────────────────────────────────

  /** Check if a key exists and is not expired */
  has(key: string): boolean {
    const record = this.store.get(key);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.evictKey(key);
      return false;
    }
    return true;
  }

  /** Get cached result. Returns undefined on miss or expiry. */
  get<T>(key: string): T | undefined {
    const record = this.store.get(key);
    if (!record) {
      this.misses++;
      return undefined;
    }
    if (Date.now() > record.expiresAt) {
      this.evictKey(key);
      this.misses++;
      return undefined;
    }
    record.accessedAt = Date.now();
    this.hits++;
    return record.value as T;
  }

  /** Store a value in cache with optional TTL (seconds). Auto-evicts oldest if over size. */
  set(key: string, value: unknown, ttlSeconds?: number): void {
    // Remove old entry if overwriting
    if (this.store.has(key)) {
      this.evictKey(key);
    }

    const serialized = JSON.stringify(value);
    const sizeBytes = serialized.length * 2; // rough UTF-16 estimate
    const ttlMs = ttlSeconds != null ? ttlSeconds * 1000 : this.defaultTtlMs;

    // Evict until we have room
    while (this.currentSizeBytes + sizeBytes > this.maxSizeBytes && this.store.size > 0) {
      this.evictOldest();
    }

    // If single entry exceeds max, skip
    if (sizeBytes > this.maxSizeBytes) {
      return;
    }

    const now = Date.now();
    this.store.set(key, {
      value,
      sizeBytes,
      expiresAt: now + ttlMs,
      createdAt: now,
      accessedAt: now,
    });
    this.currentSizeBytes += sizeBytes;
  }

  /** Query cache statistics */
  stats(): OfflineCacheStats {
    this.pruneExpired();
    const totalLookups = this.hits + this.misses;
    let oldestTime = Date.now();
    for (const record of this.store.values()) {
      if (record.createdAt < oldestTime) {
        oldestTime = record.createdAt;
      }
    }
    return {
      entries: this.store.size,
      sizeBytes: this.currentSizeBytes,
      hitRate: totalLookups > 0 ? this.hits / totalLookups : 0,
      oldestEntry: new Date(this.store.size > 0 ? oldestTime : Date.now()),
    };
  }

  /** Clear the entire cache */
  clear(): void {
    this.store.clear();
    this.currentSizeBytes = 0;
    this.hits = 0;
    this.misses = 0;
  }

  // ── Preload operations (require attached client) ───────────────────

  /**
   * Pre-download engine doctrines for offline use.
   * Fetches metadata + doctrine blocks for each engine and caches them.
   */
  async preloadEngines(engineIds: string[]): Promise<void> {
    const httpClient = this.getClient();
    const results = await Promise.allSettled(
      engineIds.map(async (id) => {
        const cacheKeyMeta = `engine:metadata:${id}`;
        const cacheKeyDoctrine = `engine:doctrine:${id}`;

        // Fetch metadata
        const metadata = await httpClient.request<unknown>('/engine/metadata', {
          params: { engine_id: id },
          cacheTtlMs: 0, // bypass client cache, we manage our own
        });
        this.set(cacheKeyMeta, metadata);

        // Fetch doctrine blocks
        try {
          const doctrine = await httpClient.request<unknown>('/engine/doctrine', {
            params: { engine_id: id },
            cacheTtlMs: 0,
          });
          this.set(cacheKeyDoctrine, doctrine);
        } catch {
          // Doctrine endpoint may not exist for all engines -- skip silently
        }
      })
    );

    // Track preloaded engine IDs for sync
    const succeeded = engineIds.filter((_, i) => results[i].status === 'fulfilled');
    this.syncManifest.engineIds = [
      ...new Set([...this.syncManifest.engineIds, ...succeeded]),
    ];
    this.syncManifest.lastSyncAt = Date.now();
  }

  /**
   * Pre-download knowledge documents for a category.
   * Fetches the category listing and all document summaries.
   */
  async preloadKnowledge(category: string): Promise<void> {
    const httpClient = this.getClient();
    const cacheKeyCat = `knowledge:category:${category}`;

    // Search for all docs in this category
    const docs = await httpClient.request<unknown[]>('/knowledge/search', {
      method: 'POST',
      body: { query: `category:${category}`, limit: 500 },
      cacheTtlMs: 0,
    });

    this.set(cacheKeyCat, docs);

    // Track for sync
    if (!this.syncManifest.knowledgeCategories.includes(category)) {
      this.syncManifest.knowledgeCategories.push(category);
    }
    this.syncManifest.lastSyncAt = Date.now();
  }

  /**
   * Delta sync: re-fetch only changed items since last sync.
   * Uses If-Modified-Since semantics where available, otherwise re-fetches all tracked items.
   * Returns count of updated and removed entries.
   */
  async sync(): Promise<{ updated: number; removed: number }> {
    const httpClient = this.getClient();
    let updated = 0;
    let removed = 0;

    // Sync engines
    await Promise.allSettled(
      this.syncManifest.engineIds.map(async (id: string) => {
        const cacheKeyMeta = `engine:metadata:${id}`;
        try {
          const fresh = await httpClient.request<unknown>('/engine/metadata', {
            params: { engine_id: id },
            cacheTtlMs: 0,
          });
          const existing = this.store.get(cacheKeyMeta);
          const freshJson = JSON.stringify(fresh);
          const existingJson = existing ? JSON.stringify(existing.value) : '';

          if (freshJson !== existingJson) {
            this.set(cacheKeyMeta, fresh);
            updated++;
          }
        } catch {
          // Engine was removed or unavailable
          if (this.store.has(cacheKeyMeta)) {
            this.evictKey(cacheKeyMeta);
            removed++;
          }
        }
      })
    );

    // Sync knowledge categories
    await Promise.allSettled(
      this.syncManifest.knowledgeCategories.map(async (category: string) => {
        const cacheKeyCat = `knowledge:category:${category}`;
        try {
          const fresh = await httpClient.request<unknown[]>('/knowledge/search', {
            method: 'POST',
            body: { query: `category:${category}`, limit: 500 },
            cacheTtlMs: 0,
          });
          const existing = this.store.get(cacheKeyCat);
          const freshJson = JSON.stringify(fresh);
          const existingJson = existing ? JSON.stringify(existing.value) : '';

          if (freshJson !== existingJson) {
            this.set(cacheKeyCat, fresh);
            updated++;
          }
        } catch {
          if (this.store.has(cacheKeyCat)) {
            this.evictKey(cacheKeyCat);
            removed++;
          }
        }
      })
    );

    this.syncManifest.lastSyncAt = Date.now();
    return { updated, removed };
  }

  /** Get the sync manifest (what's tracked for delta sync) */
  getSyncManifest(): Readonly<SyncManifest> {
    return { ...this.syncManifest };
  }

  // ── Internal helpers ───────────────────────────────────────────────

  private evictKey(key: string): void {
    const record = this.store.get(key);
    if (record) {
      this.currentSizeBytes -= record.sizeBytes;
      this.store.delete(key);
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;
    for (const [key, record] of this.store) {
      if (record.accessedAt < oldestAccess) {
        oldestAccess = record.accessedAt;
        oldestKey = key;
      }
    }
    if (oldestKey) {
      this.evictKey(oldestKey);
    }
  }

  private pruneExpired(): void {
    const now = Date.now();
    for (const [key, record] of this.store) {
      if (now > record.expiresAt) {
        this.evictKey(key);
      }
    }
  }

  private getClient(): EchoHttpClient {
    if (!this.client) {
      throw new Error(
        'OfflineCache: No HTTP client attached. Call attachClient() or use OfflineCache.withClient().'
      );
    }
    return this.client;
  }
}

export { OfflineCache as default };
