/**
 * Cache configuration for different data types
 */
interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

export const cacheConfig = {
  // Static content (rarely changes)
  articles: {
    revalidate: 3600, // 1 hour
    tags: ["articles"],
  },
  tutorials: {
    revalidate: 3600, // 1 hour
    tags: ["tutorials"],
  },
  labs: {
    revalidate: 1800, // 30 minutes
    tags: ["labs"],
  },

  // Semi-dynamic content (changes occasionally)
  homepage: {
    revalidate: 300, // 5 minutes
    tags: ["homepage", "trending"],
  },
  trending: {
    revalidate: 600, // 10 minutes
    tags: ["trending"],
  },
  search: {
    revalidate: 0, // No cache, real-time
    tags: ["search"],
  },

  // User data (per-request)
  userBookmarks: {
    revalidate: 0, // No cache, always fresh
    tags: ["user-bookmarks"],
  },
  userHistory: {
    revalidate: 0,
    tags: ["user-history"],
  },
} as const;

/**
 * Query result wrapper with metadata
 */
export interface CachedQueryResult<T> {
  data: T;
  cached: boolean;
  timestamp: number;
  ttl: number; // Time to live in seconds
  tags?: string[];
}

/**
 * Cache layer for database queries
 */
export class QueryCache {
  private cache: Map<string, CachedQueryResult<unknown>> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Get cached value or execute query
   */
  async get<T>(
    key: string,
    queryFn: () => Promise<T>,
    options: CacheOptions = { ttl: 300 }
  ): Promise<CachedQueryResult<T>> {
    const cached = this.cache.get(key) as CachedQueryResult<T> | undefined;

    // Return cached value if it exists and hasn't expired
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      return { ...cached, cached: true };
    }

    // Execute query and cache result
    try {
      const data = await queryFn();
      const result: CachedQueryResult<T> = {
        data,
        cached: false,
        timestamp: Date.now(),
        ttl: options.ttl || 300,
        tags: options.tags,
      };

      this.cache.set(key, result);

      // Set expiration timer
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key)!);
      }

      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
      }, (options.ttl || 300) * 1000);

      this.timers.set(key, timer);

      return result;
    } catch (error) {
      // Return stale cache on error if available
      if (cached) {
        return { ...cached, cached: true };
      }
      throw error;
    }
  }

  /**
   * Invalidate cache by tag
   */
  invalidateByTag(tag: string): void {
    for (const [key, value] of this.cache.entries()) {
      if (value.tags?.includes(tag)) {
        this.cache.delete(key);
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key)!);
          this.timers.delete(key);
        }
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Global query cache instance
 */
export const queryCache = new QueryCache();

/**
 * Database query optimization patterns
 */
export const queryPatterns = {
  /**
   * N+1 query prevention - batch load related items
   */
  batchLoad: async <T>(
    ids: string[],
    loader: (ids: string[]) => Promise<Map<string, T>>
  ): Promise<Map<string, T>> => {
    return await loader(ids);
  },

  /**
   * Selective field loading - only fetch needed columns
   */
  selectFields: (table: string, fields: string[]): string => {
    return `SELECT ${fields.join(", ")} FROM ${table}`;
  },

  /**
   * Pagination - limit query results
   */
  paginate: (page: number, pageSize: number = 20): { offset: number; limit: number } => {
    return {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  },

  /**
   * Search index optimization
   */
  createSearchIndex: (table: string, columns: string[]): string => {
    return `CREATE INDEX idx_${table}_search ON ${table} (${columns.join(", ")}) WHERE status = 'published'`;
  },
};

/**
 * Supabase-specific query optimizations
 */
export const supabaseOptimizations = {
  /**
   * Enable query result caching at edge
   */
  withEdgeCache: (ttl: number = 3600) => ({
    headers: {
      "Cache-Control": `public, max-age=${ttl}`,
    },
  }),

  /**
   * Prefer count query (more efficient)
   */
  countOnly: () => ({ head: true }),

  /**
   * Batch query operations
   */
  batchQueries: async <T>(
    queries: Array<() => Promise<T>>
  ): Promise<T[]> => {
    return Promise.all(queries.map((q) => q()));
  },

  /**
   * Connection pooling settings
   */
  poolConfig: {
    max: 20,
    min: 5,
    idle_in_transaction_session_timeout: 30000,
    statement_timeout: 30000,
  },
};

/**
 * Performance monitoring for queries
 */
export interface QueryMetrics {
  name: string;
  duration: number;
  resultCount: number;
  cached: boolean;
  timestamp: number;
}

export class QueryMonitor {
  private metrics: QueryMetrics[] = [];

  record(metric: QueryMetrics): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  getStats() {
    const total = this.metrics.length;
    const cached = this.metrics.filter((m) => m.cached).length;
    const avgDuration =
      this.metrics.reduce((sum, m) => sum + m.duration, 0) / total || 0;

    return {
      totalQueries: total,
      cachedQueries: cached,
      cacheHitRate: total > 0 ? (cached / total) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      slowQueries: this.metrics.filter((m) => m.duration > 1000),
    };
  }

  clear(): void {
    this.metrics = [];
  }
}

export const queryMonitor = new QueryMonitor();
