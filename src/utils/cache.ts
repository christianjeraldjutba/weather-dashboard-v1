/**
 * Advanced caching system with IndexedDB and smart invalidation
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

/**
 * Cache database schema
 */
interface CacheDB extends DBSchema {
  weather: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiry: number;
      version: number;
    };
  };
  geocoding: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiry: number;
      version: number;
    };
  };
  images: {
    key: string;
    value: {
      blob: Blob;
      timestamp: number;
      expiry: number;
    };
  };
}

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  DB_NAME: 'weather-cache',
  DB_VERSION: 1,
  DEFAULT_TTL: 10 * 60 * 1000, // 10 minutes
  MAX_ENTRIES: 1000,
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour
};

/**
 * Advanced cache manager with IndexedDB
 */
export class AdvancedCacheManager {
  private db: IDBPDatabase<CacheDB> | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize IndexedDB
   */
  private async initialize(): Promise<void> {
    try {
      this.db = await openDB<CacheDB>(CACHE_CONFIG.DB_NAME, CACHE_CONFIG.DB_VERSION, {
        upgrade(db) {
          // Weather data store
          if (!db.objectStoreNames.contains('weather')) {
            const weatherStore = db.createObjectStore('weather');
            weatherStore.createIndex('timestamp', 'timestamp');
            weatherStore.createIndex('expiry', 'expiry');
          }

          // Geocoding data store
          if (!db.objectStoreNames.contains('geocoding')) {
            const geocodingStore = db.createObjectStore('geocoding');
            geocodingStore.createIndex('timestamp', 'timestamp');
            geocodingStore.createIndex('expiry', 'expiry');
          }

          // Images store
          if (!db.objectStoreNames.contains('images')) {
            const imagesStore = db.createObjectStore('images');
            imagesStore.createIndex('timestamp', 'timestamp');
            imagesStore.createIndex('expiry', 'expiry');
          }
        },
      });

      // Start cleanup timer
      this.startCleanupTimer();
    } catch (error) {
      console.error('Failed to initialize cache database:', error);
    }
  }

  /**
   * Set cache entry
   */
  async set<T>(
    store: keyof CacheDB,
    key: string,
    data: T,
    ttl: number = CACHE_CONFIG.DEFAULT_TTL
  ): Promise<boolean> {
    if (!this.db) return false;

    try {
      const now = Date.now();
      const entry = {
        data,
        timestamp: now,
        expiry: now + ttl,
        version: 1,
      };

      await this.db.put(store as any, entry, key);
      return true;
    } catch (error) {
      console.error(`Failed to set cache entry for ${store}:${key}:`, error);
      return false;
    }
  }

  /**
   * Get cache entry
   */
  async get<T>(store: keyof CacheDB, key: string): Promise<T | null> {
    if (!this.db) return null;

    try {
      const entry = await this.db.get(store as any, key);
      if (!entry) return null;

      // Check if expired
      if (Date.now() > entry.expiry) {
        await this.delete(store, key);
        return null;
      }

      return entry.data as T;
    } catch (error) {
      console.error(`Failed to get cache entry for ${store}:${key}:`, error);
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  async delete(store: keyof CacheDB, key: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      await this.db.delete(store as any, key);
      return true;
    } catch (error) {
      console.error(`Failed to delete cache entry for ${store}:${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all entries in a store
   */
  async clear(store: keyof CacheDB): Promise<boolean> {
    if (!this.db) return false;

    try {
      await this.db.clear(store as any);
      return true;
    } catch (error) {
      console.error(`Failed to clear cache store ${store}:`, error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    weather: number;
    geocoding: number;
    images: number;
    totalSize: number;
  }> {
    if (!this.db) return { weather: 0, geocoding: 0, images: 0, totalSize: 0 };

    try {
      const [weatherCount, geocodingCount, imagesCount] = await Promise.all([
        this.db.count('weather'),
        this.db.count('geocoding'),
        this.db.count('images'),
      ]);

      // Estimate total size (rough calculation)
      const totalSize = (weatherCount + geocodingCount) * 1024 + imagesCount * 10240; // Rough estimate

      return {
        weather: weatherCount,
        geocoding: geocodingCount,
        images: imagesCount,
        totalSize,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return { weather: 0, geocoding: 0, images: 0, totalSize: 0 };
    }
  }

  /**
   * Cleanup expired entries
   */
  async cleanup(): Promise<void> {
    if (!this.db) return;

    try {
      const now = Date.now();
      const stores: (keyof CacheDB)[] = ['weather', 'geocoding', 'images'];

      for (const storeName of stores) {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const index = store.index('expiry');

        // Get all expired entries
        const expiredEntries = await index.getAll(IDBKeyRange.upperBound(now));
        
        // Delete expired entries
        for (const entry of expiredEntries) {
          const key = await store.getKey(entry);
          if (key) await store.delete(key);
        }

        await tx.done;
      }

      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Cache cleanup failed:', error);
    }
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CACHE_CONFIG.CLEANUP_INTERVAL);
  }

  /**
   * Stop cleanup timer
   */
  stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    this.stopCleanupTimer();
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

/**
 * Memory cache for frequently accessed data
 */
export class MemoryCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    // Remove oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Global cache instances
 */
export const advancedCache = new AdvancedCacheManager();
export const memoryCache = new MemoryCache(50);

/**
 * Cache key generators
 */
export const generateCacheKey = {
  weather: (lat: number, lon: number): string => `weather_${lat}_${lon}`,
  forecast: (lat: number, lon: number): string => `forecast_${lat}_${lon}`,
  geocoding: (query: string): string => `geocoding_${query.toLowerCase()}`,
  image: (url: string): string => `image_${btoa(url)}`,
};
