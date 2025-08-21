// Sistema de Cache Inteligente para Módulo Normas
// Baseado no padrão dos módulos PIE e Ensaios

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalEntries: number;
  memoryUsage: number;
  lastCleanup: number;
}

class NormasCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalEntries: 0,
    memoryUsage: 0,
    lastCleanup: Date.now()
  };

  private readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos
  private readonly MAX_ENTRIES = 500;
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.startCleanupInterval();
  }

  // Métodos principais
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cleanup();
    
    if (this.cache.size >= this.MAX_ENTRIES) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    this.updateStats();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    this.stats.hits++;
    this.updateStats();
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.updateStats();
  }

  // Métodos específicos para Normas
  setAllNormas(normas: any[]): void {
    this.set('all_normas', normas, 15 * 60 * 1000); // 15 minutos para normas
  }

  getAllNormas(): any[] | null {
    return this.get('all_normas');
  }

  setNormaById(id: string, norma: any): void {
    this.set(`norma_${id}`, norma, 20 * 60 * 1000); // 20 minutos para norma individual
  }

  getNormaById(id: string): any | null {
    return this.get(`norma_${id}`);
  }

  setEstatisticas(stats: any): void {
    this.set('estatisticas', stats, 5 * 60 * 1000); // 5 minutos para estatísticas
  }

  getEstatisticas(): any | null {
    return this.get('estatisticas');
  }

  setPesquisaResultados(query: string, resultados: any[]): void {
    const key = `pesquisa_${this.hashQuery(query)}`;
    this.set(key, resultados, 10 * 60 * 1000); // 10 minutos para resultados de pesquisa
  }

  getPesquisaResultados(query: string): any[] | null {
    const key = `pesquisa_${this.hashQuery(query)}`;
    return this.get(key);
  }

  // Invalidação inteligente
  invalidateNorma(normaId: string): void {
    this.delete(`norma_${normaId}`);
    this.delete('all_normas');
    this.delete('estatisticas');
  }

  invalidatePesquisa(): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith('pesquisa_')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.delete(key));
  }

  invalidateAll(): void {
    this.clear();
  }

  // Métodos de utilidade
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    if (now - this.stats.lastCleanup < this.CLEANUP_INTERVAL) {
      return;
    }

    const keysToDelete: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.stats.lastCleanup = now;
    this.updateStats();
  }

  private updateStats(): void {
    this.stats.totalEntries = this.cache.size;
    this.stats.memoryUsage = this.calculateMemoryUsage();
    this.stats.hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
      : 0;
  }

  private calculateMemoryUsage(): number {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length;
      size += JSON.stringify(entry.data).length;
    }
    return size;
  }

  private hashQuery(query: string): string {
    return btoa(query).replace(/[^a-zA-Z0-9]/g, '');
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  // Estatísticas
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Debug
  debug(): void {
    console.log('=== Normas Cache Debug ===');
    console.log('Stats:', this.stats);
    console.log('Entries:', this.cache.size);
    console.log('Keys:', Array.from(this.cache.keys()));
    console.log('=======================');
  }
}

// Instância global
export const normasCache = new NormasCache();

// Serviços de cache para Normas
export const NormasCacheService = {
  // Cache de normas
  cacheNormas: (normas: any[]) => normasCache.setAllNormas(normas),
  getCachedNormas: () => normasCache.getAllNormas(),
  
  // Cache de norma individual
  cacheNorma: (id: string, norma: any) => normasCache.setNormaById(id, norma),
  getCachedNorma: (id: string) => normasCache.getNormaById(id),
  
  // Cache de estatísticas
  cacheEstatisticas: (stats: any) => normasCache.setEstatisticas(stats),
  getCachedEstatisticas: () => normasCache.getEstatisticas(),
  
  // Cache de pesquisa
  cachePesquisa: (query: string, resultados: any[]) => 
    normasCache.setPesquisaResultados(query, resultados),
  getCachedPesquisa: (query: string) => normasCache.getPesquisaResultados(query),
  
  // Invalidação
  invalidateNorma: (id: string) => normasCache.invalidateNorma(id),
  invalidatePesquisa: () => normasCache.invalidatePesquisa(),
  invalidateAll: () => normasCache.invalidateAll(),
  
  // Estatísticas
  getStats: () => normasCache.getStats(),
  
  // Debug
  debug: () => normasCache.debug()
};
