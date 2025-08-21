import { rfisAPI } from './supabase-api';
import type { RFI } from '@/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

interface CacheConfig {
  ttl: number; // 5 minutos por padrão
  maxSize: number; // 100 entradas por padrão
  enableLogging: boolean;
}

class RFICache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private listeners: Set<(key: string, action: 'set' | 'delete' | 'clear') => void> = new Set();

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 100,
      enableLogging: false,
      ...config
    };

    // Limpeza automática a cada minuto
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private log(message: string, ...args: any[]) {
    if (this.config.enableLogging) {
      console.log(`[RFI Cache] ${message}`, ...args);
    }
  }

  private generateKey(operation: string, params?: any): string {
    return `${operation}:${JSON.stringify(params || {})}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private cleanup() {
    const beforeSize = this.cache.size;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.notifyListeners(key, 'delete');
      }
    }

    const afterSize = this.cache.size;
    if (beforeSize !== afterSize) {
      this.log(`Cleanup: removed ${beforeSize - afterSize} expired entries`);
    }
  }

  private notifyListeners(key: string, action: 'set' | 'delete' | 'clear') {
    this.listeners.forEach(listener => listener(key, action));
  }

  private enforceMaxSize() {
    if (this.cache.size > this.config.maxSize) {
      // Remover entradas mais antigas
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize);
      toRemove.forEach(([key]) => {
        this.cache.delete(key);
        this.notifyListeners(key, 'delete');
      });

      this.log(`Enforced max size: removed ${toRemove.length} oldest entries`);
    }
  }

  // Métodos públicos
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.log(`Cache miss: ${key}`);
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.notifyListeners(key, 'delete');
      this.log(`Cache expired: ${key}`);
      return null;
    }

    this.log(`Cache hit: ${key}`);
    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    this.cache.set(key, entry);
    this.enforceMaxSize();
    this.notifyListeners(key, 'set');
    this.log(`Cache set: ${key}`);
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.notifyListeners(key, 'delete');
      this.log(`Cache delete: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.notifyListeners('', 'clear');
    this.log('Cache cleared');
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.notifyListeners(key, 'delete');
      return false;
    }
    
    return true;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Métodos específicos para RFIs
  async getAllRFIs(forceRefresh = false): Promise<RFI[]> {
    const key = this.generateKey('getAllRFIs');
    
    if (!forceRefresh) {
      const cached = this.get<RFI[]>(key);
      if (cached) return cached;
    }

    try {
      this.log('Fetching RFIs from API...');
      const rfis = await rfisAPI.getAll();
      this.set(key, rfis, 2 * 60 * 1000); // 2 minutos para lista completa
      return rfis;
    } catch (error) {
      this.log('Error fetching RFIs:', error);
      throw error;
    }
  }

  async getRFIById(id: string, forceRefresh = false): Promise<RFI | null> {
    const key = this.generateKey('getRFIById', { id });
    
    if (!forceRefresh) {
      const cached = this.get<RFI>(key);
      if (cached) return cached;
    }

    try {
      this.log(`Fetching RFI ${id} from API...`);
      const rfi = await rfisAPI.getById(id);
      if (rfi) {
        this.set(key, rfi, 10 * 60 * 1000); // 10 minutos para RFI individual
      }
      return rfi;
    } catch (error) {
      this.log(`Error fetching RFI ${id}:`, error);
      throw error;
    }
  }

  async createRFI(rfiData: any): Promise<RFI | null> {
    try {
      this.log('Creating new RFI...');
      const newRFI = await rfisAPI.create(rfiData);
      
      if (newRFI) {
        // Invalidar cache da lista
        this.invalidateListCache();
        
        // Adicionar ao cache individual
        const key = this.generateKey('getRFIById', { id: newRFI.id });
        this.set(key, newRFI, 10 * 60 * 1000);
      }
      
      return newRFI;
    } catch (error) {
      this.log('Error creating RFI:', error);
      throw error;
    }
  }

  async updateRFI(id: string, rfiData: any): Promise<RFI | null> {
    try {
      this.log(`Updating RFI ${id}...`);
      const updatedRFI = await rfisAPI.update(id, rfiData);
      
      if (updatedRFI) {
        // Invalidar cache da lista
        this.invalidateListCache();
        
        // Atualizar cache individual
        const key = this.generateKey('getRFIById', { id });
        this.set(key, updatedRFI, 10 * 60 * 1000);
      }
      
      return updatedRFI;
    } catch (error) {
      this.log(`Error updating RFI ${id}:`, error);
      throw error;
    }
  }

  async deleteRFI(id: string): Promise<boolean> {
    try {
      this.log(`Deleting RFI ${id}...`);
      const success = await rfisAPI.delete(id);
      
      if (success) {
        // Invalidar cache da lista
        this.invalidateListCache();
        
        // Remover do cache individual
        const key = this.generateKey('getRFIById', { id });
        this.delete(key);
      }
      
      return success;
    } catch (error) {
      this.log(`Error deleting RFI ${id}:`, error);
      throw error;
    }
  }

  private invalidateListCache() {
    const listKey = this.generateKey('getAllRFIs');
    this.delete(listKey);
    this.log('List cache invalidated');
  }

  // Métodos de cache inteligente
  async getRFIsByStatus(status: string): Promise<RFI[]> {
    const key = this.generateKey('getRFIsByStatus', { status });
    
    const cached = this.get<RFI[]>(key);
    if (cached) return cached;

    const allRFIs = await this.getAllRFIs();
    const filtered = allRFIs.filter(rfi => rfi.status === status);
    
    this.set(key, filtered, 3 * 60 * 1000); // 3 minutos para filtros
    return filtered;
  }

  async getRFIsByPriority(priority: string): Promise<RFI[]> {
    const key = this.generateKey('getRFIsByPriority', { priority });
    
    const cached = this.get<RFI[]>(key);
    if (cached) return cached;

    const allRFIs = await this.getAllRFIs();
    const filtered = allRFIs.filter(rfi => rfi.prioridade === priority);
    
    this.set(key, filtered, 3 * 60 * 1000);
    return filtered;
  }

  async searchRFIs(query: string): Promise<RFI[]> {
    const key = this.generateKey('searchRFIs', { query });
    
    const cached = this.get<RFI[]>(key);
    if (cached) return cached;

    const allRFIs = await this.getAllRFIs();
    const filtered = allRFIs.filter(rfi => 
      rfi.titulo?.toLowerCase().includes(query.toLowerCase()) ||
      rfi.numero?.toLowerCase().includes(query.toLowerCase()) ||
      rfi.solicitante?.toLowerCase().includes(query.toLowerCase()) ||
      rfi.destinatario?.toLowerCase().includes(query.toLowerCase())
    );
    
    this.set(key, filtered, 1 * 60 * 1000); // 1 minuto para pesquisas
    return filtered;
  }

  // Métodos de estatísticas
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    for (const entry of this.cache.values()) {
      if (this.isExpired(entry)) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries: validCount,
      expiredEntries: expiredCount,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private calculateHitRate(): number {
    // Implementação simplificada - em produção seria mais sofisticada
    return 0.85; // Placeholder
  }

  private estimateMemoryUsage(): number {
    // Estimativa aproximada em bytes
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2; // UTF-16
      totalSize += JSON.stringify(entry.data).length * 2;
      totalSize += 24; // Timestamp + TTL overhead
    }
    return totalSize;
  }

  // Event listeners
  addListener(listener: (key: string, action: 'set' | 'delete' | 'clear') => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: (key: string, action: 'set' | 'delete' | 'clear') => void) {
    this.listeners.delete(listener);
  }

  // Métodos de debug
  enableLogging() {
    this.config.enableLogging = true;
  }

  disableLogging() {
    this.config.enableLogging = false;
  }

  getConfig(): CacheConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<CacheConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Instância singleton
export const rfiCache = new RFICache({
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 200,
  enableLogging: process.env.NODE_ENV === 'development'
});

// Hooks para React (opcional)
export const useRFICache = () => {
  return {
    getAllRFIs: rfiCache.getAllRFIs.bind(rfiCache),
    getRFIById: rfiCache.getRFIById.bind(rfiCache),
    createRFI: rfiCache.createRFI.bind(rfiCache),
    updateRFI: rfiCache.updateRFI.bind(rfiCache),
    deleteRFI: rfiCache.deleteRFI.bind(rfiCache),
    getRFIsByStatus: rfiCache.getRFIsByStatus.bind(rfiCache),
    getRFIsByPriority: rfiCache.getRFIsByPriority.bind(rfiCache),
    searchRFIs: rfiCache.searchRFIs.bind(rfiCache),
    getStats: rfiCache.getStats.bind(rfiCache),
    clear: rfiCache.clear.bind(rfiCache)
  };
};
