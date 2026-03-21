/** Echo Prime SDK v3.0 — In-memory TTL cache
 * Zero external dependencies. LRU eviction. Typed entries.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  accessedAt: number;
}

export interface CacheConfig {
  /** Maximum entries before LRU eviction. Default: 500 */
  maxEntries?: number;
  /** Default TTL in milliseconds. Default: 300000 (5 min) */
  defaultTtlMs?: number;
}

export class EchoCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries: number;
  private readonly defaultTtlMs: number;

  constructor(config: CacheConfig = {}) {
    this.maxEntries = config.maxEntries ?? 500;
    this.defaultTtlMs = config.defaultTtlMs ?? 300_000;
  }

  /** Get a value. Returns undefined if expired or missing. */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    entry.accessedAt = Date.now();
    return entry.value as T;
  }

  /** Set a value with optional TTL (ms). */
  set<T>(key: string, value: T, ttlMs?: number): void {
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      this.evictLRU();
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
      accessedAt: Date.now(),
    });
  }

  /** Get or compute. If key missing/expired, calls fetcher and caches the result. */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;
    const value = await fetcher();
    this.set(key, value, ttlMs);
    return value;
  }

  /** Delete a specific key. */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /** Delete all keys matching a prefix. */
  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /** Clear the entire cache. */
  clear(): void {
    this.store.clear();
  }

  /** Number of entries (including expired but not yet evicted). */
  get size(): number {
    return this.store.size;
  }

  /** Purge all expired entries. */
  prune(): number {
    const now = Date.now();
    let pruned = 0;
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        pruned++;
      }
    }
    return pruned;
  }

  /** Evict the least-recently-accessed entry. */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;
    for (const [key, entry] of this.store) {
      if (entry.accessedAt < oldestAccess) {
        oldestAccess = entry.accessedAt;
        oldestKey = key;
      }
    }
    if (oldestKey) this.store.delete(oldestKey);
  }
}

/** Generate a deterministic cache key from path + params */
export function cacheKey(path: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return path;
  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  return `${path}?${sorted.map(([k, v]) => `${k}=${v}`).join('&')}`;
}
