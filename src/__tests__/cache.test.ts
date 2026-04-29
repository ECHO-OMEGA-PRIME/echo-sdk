import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EchoCache, cacheKey } from '../cache.js';

describe('EchoCache', () => {
  let cache: EchoCache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new EchoCache({ maxEntries: 5, defaultTtlMs: 10000 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Basic get/set ─────────────────────────────────────────────────────────

  describe('get / set', () => {
    it('returns undefined for missing keys', () => {
      expect(cache.get('missing')).toBeUndefined();
    });

    it('stores and retrieves a value', () => {
      cache.set('key1', { hello: 'world' });
      expect(cache.get('key1')).toEqual({ hello: 'world' });
    });

    it('stores primitive values', () => {
      cache.set('num', 42);
      cache.set('str', 'hello');
      cache.set('bool', true);
      expect(cache.get('num')).toBe(42);
      expect(cache.get('str')).toBe('hello');
      expect(cache.get('bool')).toBe(true);
    });

    it('overwrites existing keys', () => {
      cache.set('key', 'first');
      cache.set('key', 'second');
      expect(cache.get('key')).toBe('second');
    });
  });

  // ── TTL expiration ────────────────────────────────────────────────────────

  describe('TTL expiration', () => {
    it('returns value before TTL expires', () => {
      cache.set('k', 'v', 5000);
      vi.advanceTimersByTime(4999);
      expect(cache.get('k')).toBe('v');
    });

    it('returns undefined after TTL expires', () => {
      cache.set('k', 'v', 5000);
      vi.advanceTimersByTime(5001);
      expect(cache.get('k')).toBeUndefined();
    });

    it('uses default TTL when none specified', () => {
      cache.set('k', 'v');
      vi.advanceTimersByTime(9999);
      expect(cache.get('k')).toBe('v');
      vi.advanceTimersByTime(2);
      expect(cache.get('k')).toBeUndefined();
    });

    it('removes expired entry from store on get', () => {
      cache.set('k', 'v', 1000);
      vi.advanceTimersByTime(1001);
      cache.get('k');
      // Entry should be removed from the store
      expect(cache.size).toBe(0);
    });
  });

  // ── LRU eviction ─────────────────────────────────────────────────────────

  describe('LRU eviction', () => {
    it('evicts least-recently-accessed entry when full', () => {
      // Fill the cache (maxEntries=5)
      cache.set('a', 1);
      vi.advanceTimersByTime(1);
      cache.set('b', 2);
      vi.advanceTimersByTime(1);
      cache.set('c', 3);
      vi.advanceTimersByTime(1);
      cache.set('d', 4);
      vi.advanceTimersByTime(1);
      cache.set('e', 5);
      vi.advanceTimersByTime(1);

      // Access 'a' to make it recently accessed
      cache.get('a');
      vi.advanceTimersByTime(1);

      // Adding a 6th entry should evict the LRU (which is 'b')
      cache.set('f', 6);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('a')).toBe(1);
      expect(cache.get('f')).toBe(6);
    });

    it('does not evict when updating existing key', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4);
      cache.set('e', 5);

      // Update existing key — should NOT evict
      cache.set('a', 100);
      expect(cache.size).toBe(5);
      expect(cache.get('a')).toBe(100);
      expect(cache.get('b')).toBe(2); // 'b' not evicted
    });
  });

  // ── delete / deleteByPrefix / clear ───────────────────────────────────────

  describe('delete', () => {
    it('deletes a specific key', () => {
      cache.set('x', 1);
      expect(cache.delete('x')).toBe(true);
      expect(cache.get('x')).toBeUndefined();
    });

    it('returns false for non-existent key', () => {
      expect(cache.delete('nope')).toBe(false);
    });
  });

  describe('deleteByPrefix', () => {
    it('deletes all keys with matching prefix', () => {
      cache.set('engine:tax', 1);
      cache.set('engine:legal', 2);
      cache.set('knowledge:doc1', 3);
      const deleted = cache.deleteByPrefix('engine:');
      expect(deleted).toBe(2);
      expect(cache.get('engine:tax')).toBeUndefined();
      expect(cache.get('knowledge:doc1')).toBe(3);
    });

    it('returns 0 when no keys match', () => {
      cache.set('a', 1);
      expect(cache.deleteByPrefix('zzz')).toBe(0);
    });
  });

  describe('clear', () => {
    it('removes all entries', () => {
      cache.set('a', 1);
      cache.set('b', 2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
    });
  });

  // ── size ──────────────────────────────────────────────────────────────────

  describe('size', () => {
    it('reflects current entry count', () => {
      expect(cache.size).toBe(0);
      cache.set('a', 1);
      expect(cache.size).toBe(1);
      cache.set('b', 2);
      expect(cache.size).toBe(2);
      cache.delete('a');
      expect(cache.size).toBe(1);
    });
  });

  // ── prune ─────────────────────────────────────────────────────────────────

  describe('prune', () => {
    it('removes expired entries and returns count', () => {
      cache.set('fast', 1, 1000);
      cache.set('slow', 2, 50000);
      vi.advanceTimersByTime(2000);
      const pruned = cache.prune();
      expect(pruned).toBe(1);
      expect(cache.get('fast')).toBeUndefined();
      expect(cache.get('slow')).toBe(2);
    });

    it('returns 0 when nothing is expired', () => {
      cache.set('a', 1);
      expect(cache.prune()).toBe(0);
    });
  });

  // ── getOrSet ──────────────────────────────────────────────────────────────

  describe('getOrSet', () => {
    it('returns cached value without calling fetcher', async () => {
      cache.set('k', 'cached');
      const fetcher = vi.fn().mockResolvedValue('fresh');
      const result = await cache.getOrSet('k', fetcher);
      expect(result).toBe('cached');
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('calls fetcher and caches on miss', async () => {
      const fetcher = vi.fn().mockResolvedValue('fresh');
      const result = await cache.getOrSet('k', fetcher, 5000);
      expect(result).toBe('fresh');
      expect(fetcher).toHaveBeenCalledOnce();
      expect(cache.get('k')).toBe('fresh');
    });

    it('calls fetcher again after TTL expires', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce('v1')
        .mockResolvedValueOnce('v2');
      await cache.getOrSet('k', fetcher, 1000);
      vi.advanceTimersByTime(1001);
      const result = await cache.getOrSet('k', fetcher, 1000);
      expect(result).toBe('v2');
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  // ── Default config ────────────────────────────────────────────────────────

  describe('default configuration', () => {
    it('uses 500 maxEntries and 300000 defaultTtlMs by default', () => {
      const defaultCache = new EchoCache();
      // Check default TTL by setting and reading after 299999ms
      defaultCache.set('k', 'v');
      vi.advanceTimersByTime(299999);
      expect(defaultCache.get('k')).toBe('v');
      vi.advanceTimersByTime(2);
      expect(defaultCache.get('k')).toBeUndefined();
    });
  });
});

// ── cacheKey utility ────────────────────────────────────────────────────────

describe('cacheKey', () => {
  it('returns just the path when no params', () => {
    expect(cacheKey('/engine/query')).toBe('/engine/query');
  });

  it('returns just the path for empty params', () => {
    expect(cacheKey('/engine/query', {})).toBe('/engine/query');
  });

  it('appends sorted params', () => {
    const result = cacheKey('/search', { z: '1', a: '2', m: '3' });
    expect(result).toBe('/search?a=2&m=3&z=1');
  });

  it('produces the same key regardless of param insertion order', () => {
    const k1 = cacheKey('/x', { b: '2', a: '1' });
    const k2 = cacheKey('/x', { a: '1', b: '2' });
    expect(k1).toBe(k2);
  });
});
