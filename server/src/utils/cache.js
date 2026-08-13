class SearchCache {
  constructor(ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  generateKey(filters = {}) {
    const sortedKey = Object.keys(filters)
      .sort()
      .filter((k) => filters[k] !== undefined && filters[k] !== null && filters[k] !== "")
      .map((k) => `${k}:${String(filters[k]).toLowerCase().trim()}`)
      .join("|");
    return sortedKey || "default_search";
  }

  get(filters = {}) {
    const key = this.generateKey(filters);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(filters = {}, data) {
    const key = this.generateKey(filters);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs,
      cachedAt: new Date().toISOString(),
    });
  }

  clear() {
    this.cache.clear();
  }

  stats() {
    let activeEntries = 0;
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now <= item.expiresAt) activeEntries++;
    }
    return {
      totalCachedKeys: this.cache.size,
      activeEntries,
      ttlMinutes: this.ttlMs / 60000,
    };
  }
}

export const searchCache = new SearchCache();
