import { Checklist } from "@/types";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastReset: number;
}

export class ChecklistsCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    lastReset: Date.now()
  };

  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_SIZE = 100; // Máximo 100 entradas

  // Métodos principais
  async getAllChecklists(forceRefresh = false): Promise<Checklist[]> {
    const key = 'all_checklists';
    
    if (!forceRefresh && this.has(key)) {
      this.stats.hits++;
      return this.get(key);
    }

    this.stats.misses++;
    return [];
  }

  async getChecklistById(id: string, forceRefresh = false): Promise<Checklist | null> {
    const key = `checklist_${id}`;
    
    if (!forceRefresh && this.has(key)) {
      this.stats.hits++;
      return this.get(key);
    }

    this.stats.misses++;
    return null;
  }

  async getChecklistWithPontos(id: string, forceRefresh = false): Promise<any | null> {
    const key = `checklist_pontos_${id}`;
    
    if (!forceRefresh && this.has(key)) {
      this.stats.hits++;
      return this.get(key);
    }

    this.stats.misses++;
    return null;
  }

  // Métodos de cache
  set(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    // Limpar cache se exceder tamanho máximo
    if (this.cache.size >= this.MAX_SIZE) {
      this.evictOldest();
    }

    const entry: CacheEntry<any> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Verificar se expirou
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  // Invalidação inteligente
  invalidateChecklist(id: string): void {
    this.delete(`checklist_${id}`);
    this.delete(`checklist_pontos_${id}`);
    this.invalidateAllChecklists();
  }

  invalidateAllChecklists(): void {
    this.delete('all_checklists');
  }

  invalidateByPattern(pattern: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  // Limpeza automática
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
      this.delete(oldestKey);
    }
  }

  // Estatísticas
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests
    };
  }

  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: this.cache.size,
      lastReset: Date.now()
    };
  }

  // Manutenção
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  // Informações do cache
  getInfo(): {
    size: number;
    maxSize: number;
    utilization: number;
    entries: Array<{ key: string; age: number; ttl: number }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl
    }));

    return {
      size: this.cache.size,
      maxSize: this.MAX_SIZE,
      utilization: (this.cache.size / this.MAX_SIZE) * 100,
      entries
    };
  }
}

// Instância singleton
export const checklistsCache = new ChecklistsCache();

// Limpeza automática a cada 5 minutos
setInterval(() => {
  checklistsCache.cleanup();
}, 5 * 60 * 1000);
