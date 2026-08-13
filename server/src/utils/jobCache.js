class JobCacheManager {
  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this.providerMetrics = new Map();
  }

  generateCacheKey(filters = {}) {
    const keyParts = [
      (filters.query || "").toLowerCase().trim(),
      (filters.role || "").toLowerCase().trim(),
      (filters.skill || "").toLowerCase().trim(),
      (filters.company || "").toLowerCase().trim(),
      (filters.keywords || "").toLowerCase().trim(),
      (filters.location || "").toLowerCase().trim(),
      (filters.workplaceType || "All").toLowerCase(),
      (filters.employmentType || "All").toLowerCase(),
      (filters.sortBy || "Newest").toLowerCase(),
      filters.page || 1,
    ];
    return keyParts.join("::");
  }

  get(filters) {
    const key = typeof filters === "string" ? filters : this.generateCacheKey(filters);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(filters, data, ttlMs = this.defaultTtlMs) {
    const key = typeof filters === "string" ? filters : this.generateCacheKey(filters);
    this.cache.set(key, {
      data,
      cachedAt: new Date().toISOString(),
      expiresAt: Date.now() + ttlMs,
    });
  }

  recordProviderMetric(providerName, metric = {}) {
    const existing = this.providerMetrics.get(providerName) || {
      provider: providerName,
      status: "unknown",
      lastStatusCode: 200,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastJobsReturned: 0,
      lastExecutionTimeMs: 0,
      lastQuery: "",
      requestUrl: "",
      lastError: null,
      apiLimits: null,
      lastUpdated: new Date().toISOString(),
    };

    existing.totalRequests += 1;
    existing.lastStatusCode = metric.statusCode || 200;
    existing.lastJobsReturned = metric.jobsReturned || 0;
    existing.lastExecutionTimeMs = metric.executionTimeMs || 0;
    existing.lastQuery = metric.queryUsed || "";
    existing.requestUrl = metric.requestUrl || "";
    existing.lastUpdated = new Date().toISOString();

    if (metric.apiLimits) {
      existing.apiLimits = metric.apiLimits;
    }

    if (metric.errorMessage) {
      existing.failedRequests += 1;
      existing.lastError = metric.errorMessage;
      existing.status = metric.jobsReturned > 0 ? "degraded" : "error";
    } else {
      existing.successfulRequests += 1;
      existing.lastError = null;
      existing.status = metric.jobsReturned > 0 ? "healthy" : "no_results";
    }

    this.providerMetrics.set(providerName, existing);
  }

  getHealthReport() {
    const providers = {};
    let totalCachedEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (Date.now() <= entry.expiresAt) {
        totalCachedEntries++;
      } else {
        this.cache.delete(key);
      }
    }

    for (const [name, metric] of this.providerMetrics.entries()) {
      providers[name] = { ...metric };
    }

    return {
      systemStatus: "active",
      timestamp: new Date().toISOString(),
      cacheStats: {
        activeCachedQueries: totalCachedEntries,
        cacheTtlSeconds: Math.round(this.defaultTtlMs / 1000),
      },
      providers,
    };
  }

  clear() {
    this.cache.clear();
    this.providerMetrics.clear();
  }
}

export const jobCache = new JobCacheManager();
