// Cache Inteligente para PIE (Pontos de Inspeção e Ensaios)
import { PIEInstancia } from '@/types/pie';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  averageAccessTime: number;
  memoryUsage: number;
  lastCleanup: number;
}

export class PIECache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    totalEntries: 0,
    totalHits: 0,
    totalMisses: 0,
    hitRate: 0,
    averageAccessTime: 0,
    memoryUsage: 0,
    lastCleanup: Date.now()
  };

  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_SIZE = 1000; // Máximo de 1000 entradas
  private readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // Limpeza a cada 10 minutos

  constructor() {
    // Iniciar limpeza automática
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  // Armazenar dados no cache
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    
    // Verificar se já existe e remover se necessário
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Verificar limite de tamanho
    if (this.cache.size >= this.MAX_SIZE) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now
    });

    this.stats.totalEntries++;
    this.updateStats();
  }

  // Obter dados do cache
  get<T>(key: string): T | null {
    const startTime = performance.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.totalMisses++;
      this.updateStats();
      return null;
    }

    // Verificar se expirou
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.totalMisses++;
      this.updateStats();
      return null;
    }

    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.totalHits++;
    
    const accessTime = performance.now() - startTime;
    this.stats.averageAccessTime = (this.stats.averageAccessTime + accessTime) / 2;
    
    this.updateStats();
    return entry.data;
  }

  // Verificar se existe no cache
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Remover entrada específica
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.totalEntries--;
      this.updateStats();
    }
    return deleted;
  }

  // Limpar todo o cache
  clear(): void {
    this.cache.clear();
    this.stats = {
      totalEntries: 0,
      totalHits: 0,
      totalMisses: 0,
      hitRate: 0,
      averageAccessTime: 0,
      memoryUsage: 0,
      lastCleanup: Date.now()
    };
  }

  // Obter estatísticas
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Obter todas as entradas (para debug)
  getAllEntries(): Map<string, CacheEntry<any>> {
    return new Map(this.cache);
  }

  // Métodos específicos para PIE
  setAllPIEs(pies: PIEInstancia[], ttl: number = this.DEFAULT_TTL): void {
    this.set('all_pies', pies, ttl);
  }

  getAllPIEs(): PIEInstancia[] | null {
    return this.get<PIEInstancia[]>('all_pies');
  }

  setPIE(id: string, pie: PIEInstancia, ttl: number = this.DEFAULT_TTL): void {
    this.set(`pie_${id}`, pie, ttl);
  }

  getPIE(id: string): PIEInstancia | null {
    return this.get<PIEInstancia>(`pie_${id}`);
  }

  setFilteredPIEs(filterKey: string, pies: PIEInstancia[], ttl: number = this.DEFAULT_TTL): void {
    this.set(`filtered_pies_${filterKey}`, pies, ttl);
  }

  getFilteredPIEs(filterKey: string): PIEInstancia[] | null {
    return this.get<PIEInstancia[]>(`filtered_pies_${filterKey}`);
  }

  setPIEStats(stats: any, ttl: number = this.DEFAULT_TTL): void {
    this.set('pie_stats', stats, ttl);
  }

  getPIEStats(): any | null {
    return this.get('pie_stats');
  }

  setPIETrends(trends: any, ttl: number = this.DEFAULT_TTL): void {
    this.set('pie_trends', trends, ttl);
  }

  getPIETrends(): any | null {
    return this.get('pie_trends');
  }

  setPIEAnomalies(anomalies: any[], ttl: number = this.DEFAULT_TTL): void {
    this.set('pie_anomalies', anomalies, ttl);
  }

  getPIEAnomalies(): any[] | null {
    return this.get<any[]>('pie_anomalies');
  }

  // Invalidar cache relacionado a um PIE específico
  invalidatePIE(id: string): void {
    this.delete(`pie_${id}`);
    // Invalidar também filtros que podem conter este PIE
    this.invalidateFilteredCaches();
  }

  // Invalidar todos os caches filtrados
  invalidateFilteredCaches(): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith('filtered_pies_')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.delete(key));
  }

  // Invalidar cache de estatísticas
  invalidateStats(): void {
    this.delete('pie_stats');
    this.delete('pie_trends');
    this.delete('pie_anomalies');
  }

  // Métodos privados
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.totalEntries--;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.stats.totalEntries--;
    });

    this.stats.lastCleanup = now;
    this.updateStats();
  }

  private updateStats(): void {
    const totalRequests = this.stats.totalHits + this.stats.totalMisses;
    this.stats.hitRate = totalRequests > 0 ? (this.stats.totalHits / totalRequests) * 100 : 0;
    
    // Calcular uso de memória aproximado
    this.stats.memoryUsage = this.cache.size * 1024; // Estimativa de 1KB por entrada
  }
}

// Instância singleton
export const pieCache = new PIECache();
