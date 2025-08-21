import { submissaoMateriaisAPI } from './supabase-api/submissaoMateriaisAPI';
import type { SubmissaoMaterial } from '@/types/submissaoMateriais';

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

class SubmissaoMateriaisCache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private listeners: Set<(key: string, action: 'set' | 'delete' | 'clear') => void> = new Set();
  private hitCount = 0;
  private missCount = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutos
      maxSize: 200,
      enableLogging: process.env.NODE_ENV === 'development',
      ...config
    };

    // Limpeza automática a cada 30 segundos
    setInterval(() => {
      this.cleanup();
    }, 30000);
  }

  // Métodos privados
  private log(message: string, ...args: any[]) {
    if (this.config.enableLogging) {
      console.log(`[SubmissaoMateriaisCache] ${message}`, ...args);
    }
  }

  private cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.log(`Limpeza automática: ${cleanedCount} entradas expiradas removidas`);
    }
  }

  private evictOldest() {
    if (this.cache.size >= this.config.maxSize) {
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
        this.log(`Entrada mais antiga removida: ${oldestKey}`);
      }
    }
  }

  // Métodos públicos
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      this.log(`Cache miss: ${key}`);
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.missCount++;
      this.log(`Cache expired: ${key}`);
      return null;
    }

    this.hitCount++;
    this.log(`Cache hit: ${key}`);
    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    this.evictOldest();
    this.cache.set(key, entry);
    
    this.log(`Cache set: ${key}`);
    this.notifyListeners(key, 'set');
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.log(`Cache delete: ${key}`);
      this.notifyListeners(key, 'delete');
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.log('Cache cleared');
    this.notifyListeners('', 'clear');
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
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

  // Métodos específicos para Submissão de Materiais
  async getAllSubmissoes(forceRefresh = false): Promise<SubmissaoMaterial[]> {
    const cacheKey = 'all_submissoes';
    
    if (!forceRefresh) {
      const cached = this.get<SubmissaoMaterial[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      this.log('Carregando todas as submissões da API...');
      const data = await submissaoMateriaisAPI.submissoes.getAll();
      this.set(cacheKey, data, 3 * 60 * 1000); // 3 minutos para lista completa
      return data;
    } catch (error) {
      this.log('Erro ao carregar submissões:', error);
      throw error;
    }
  }

  async getSubmissaoById(id: string, forceRefresh = false): Promise<SubmissaoMaterial | null> {
    const cacheKey = `submissao_${id}`;
    
    if (!forceRefresh) {
      const cached = this.get<SubmissaoMaterial>(cacheKey);
      if (cached) return cached;
    }

    try {
      this.log(`Carregando submissão ${id} da API...`);
      const data = await submissaoMateriaisAPI.submissoes.getById(id);
      if (data) {
        this.set(cacheKey, data, 5 * 60 * 1000); // 5 minutos para item individual
      }
      return data;
    } catch (error) {
      this.log(`Erro ao carregar submissão ${id}:`, error);
      throw error;
    }
  }

  async createSubmissao(submissaoData: any): Promise<SubmissaoMaterial | null> {
    try {
      this.log('Criando nova submissão...');
      const result = await submissaoMateriaisAPI.submissoes.create(submissaoData);
      
      if (result) {
        // Invalidar cache de lista
        this.invalidateListCache();
        // Adicionar ao cache individual
        this.set(`submissao_${result.id}`, result);
      }
      
      return result;
    } catch (error) {
      this.log('Erro ao criar submissão:', error);
      throw error;
    }
  }

  async updateSubmissao(id: string, submissaoData: any): Promise<SubmissaoMaterial | null> {
    try {
      this.log(`Atualizando submissão ${id}...`);
      const result = await submissaoMateriaisAPI.submissoes.update(id, submissaoData);
      
      if (result) {
        // Invalidar cache de lista
        this.invalidateListCache();
        // Atualizar cache individual
        this.set(`submissao_${id}`, result);
      }
      
      return result;
    } catch (error) {
      this.log(`Erro ao atualizar submissão ${id}:`, error);
      throw error;
    }
  }

  async deleteSubmissao(id: string): Promise<boolean> {
    try {
      this.log(`Eliminando submissão ${id}...`);
      const result = await submissaoMateriaisAPI.submissoes.delete(id);
      
      if (result) {
        // Invalidar cache de lista
        this.invalidateListCache();
        // Remover do cache individual
        this.delete(`submissao_${id}`);
      }
      
      return result;
    } catch (error) {
      this.log(`Erro ao eliminar submissão ${id}:`, error);
      throw error;
    }
  }

  private invalidateListCache() {
    // Remover todas as entradas relacionadas com listas
    const keysToDelete = this.keys().filter(key => 
      key.startsWith('all_submissoes') || 
      key.startsWith('submissoes_by_') ||
      key.startsWith('search_')
    );
    
    keysToDelete.forEach(key => this.delete(key));
    this.log(`Cache de listas invalidado: ${keysToDelete.length} entradas removidas`);
  }

  async getSubmissoesByEstado(estado: string): Promise<SubmissaoMaterial[]> {
    const cacheKey = `submissoes_by_estado_${estado}`;
    
    const cached = this.get<SubmissaoMaterial[]>(cacheKey);
    if (cached) return cached;

    try {
      this.log(`Carregando submissões por estado: ${estado}`);
      const allSubmissoes = await this.getAllSubmissoes();
      const filtered = allSubmissoes.filter(s => s.estado === estado);
      this.set(cacheKey, filtered, 2 * 60 * 1000); // 2 minutos
      return filtered;
    } catch (error) {
      this.log(`Erro ao carregar submissões por estado ${estado}:`, error);
      throw error;
    }
  }

  async getSubmissoesByTipo(tipo: string): Promise<SubmissaoMaterial[]> {
    const cacheKey = `submissoes_by_tipo_${tipo}`;
    
    const cached = this.get<SubmissaoMaterial[]>(cacheKey);
    if (cached) return cached;

    try {
      this.log(`Carregando submissões por tipo: ${tipo}`);
      const allSubmissoes = await this.getAllSubmissoes();
      const filtered = allSubmissoes.filter(s => s.tipo_material === tipo);
      this.set(cacheKey, filtered, 2 * 60 * 1000); // 2 minutos
      return filtered;
    } catch (error) {
      this.log(`Erro ao carregar submissões por tipo ${tipo}:`, error);
      throw error;
    }
  }

  async searchSubmissoes(query: string): Promise<SubmissaoMaterial[]> {
    const cacheKey = `search_${query.toLowerCase().replace(/\s+/g, '_')}`;
    
    const cached = this.get<SubmissaoMaterial[]>(cacheKey);
    if (cached) return cached;

    try {
      this.log(`Pesquisando submissões: ${query}`);
      const allSubmissoes = await this.getAllSubmissoes();
      const filtered = allSubmissoes.filter(s => 
        s.titulo.toLowerCase().includes(query.toLowerCase()) ||
        s.descricao.toLowerCase().includes(query.toLowerCase()) ||
        s.codigo.toLowerCase().includes(query.toLowerCase())
      );
      this.set(cacheKey, filtered, 1 * 60 * 1000); // 1 minuto para pesquisas
      return filtered;
    } catch (error) {
      this.log(`Erro na pesquisa: ${query}`, error);
      throw error;
    }
  }

  // Estatísticas
  getStats() {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;
    const validEntries = Array.from(this.cache.values()).filter(entry => {
      const now = Date.now();
      return now - entry.timestamp <= entry.ttl;
    }).length;

    return {
      totalEntries: this.cache.size,
      validEntries,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
      memoryUsage: this.estimateMemoryUsage(),
      config: this.config
    };
  }

  private estimateMemoryUsage(): number {
    // Estimativa simples baseada no tamanho dos dados
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length;
      totalSize += JSON.stringify(entry.data).length;
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

  private notifyListeners(key: string, action: 'set' | 'delete' | 'clear') {
    this.listeners.forEach(listener => {
      try {
        listener(key, action);
      } catch (error) {
        this.log('Erro no listener:', error);
      }
    });
  }

  // Debug methods
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
export const submissaoMateriaisCache = new SubmissaoMateriaisCache({
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 200,
  enableLogging: process.env.NODE_ENV === 'development'
});

// Hooks para React (opcional)
export const useSubmissaoMateriaisCache = () => {
  return {
    getAllSubmissoes: submissaoMateriaisCache.getAllSubmissoes.bind(submissaoMateriaisCache),
    getSubmissaoById: submissaoMateriaisCache.getSubmissaoById.bind(submissaoMateriaisCache),
    createSubmissao: submissaoMateriaisCache.createSubmissao.bind(submissaoMateriaisCache),
    updateSubmissao: submissaoMateriaisCache.updateSubmissao.bind(submissaoMateriaisCache),
    deleteSubmissao: submissaoMateriaisCache.deleteSubmissao.bind(submissaoMateriaisCache),
    getStats: submissaoMateriaisCache.getStats.bind(submissaoMateriaisCache),
    clear: submissaoMateriaisCache.clear.bind(submissaoMateriaisCache)
  };
};
