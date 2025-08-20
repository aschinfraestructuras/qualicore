import { supabase } from './supabase-api/supabaseClient';

export interface KPIData {
  periodo: string;
  total_ensaios: number;
  aprovados: number;
  reprovados: number;
  pendentes: number;
  qualidade_percent: number;
  tipos_ensaios?: number;
  laboratorios_ativos?: number;
  media_valores_aprovados?: number;
}

export interface NCData {
  tipo: string;
  nc_count: number;
  total_ensaios: number;
  nc_percent: number;
}

export interface SLAData {
  laboratorio: string;
  total_ensaios: number;
  aprovados: number;
  reprovados: number;
  pendentes: number;
  taxa_aprovacao: number;
  media_valores_aprovados: number;
}

export interface TrendData {
  data: string;
  total_ensaios: number;
  aprovados: number;
  reprovados: number;
  qualidade_percent: number;
}

export interface GlobalData {
  total_ensaios_historico: number;
  total_aprovados_historico: number;
  total_reprovados_historico: number;
  total_pendentes: number;
  qualidade_global_percent: number;
  total_laboratorios: number;
  total_tipos_ensaios: number;
  total_zonas: number;
}

class KPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 segundos

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  async getKPIToday(): Promise<KPIData | null> {
    const cacheKey = 'kpi_today';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_today')
        .select('*')
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar KPI hoje:', error);
      return null;
    }
  }

  async getKPI7Days(): Promise<KPIData | null> {
    const cacheKey = 'kpi_7d';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_7d')
        .select('*')
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar KPI 7 dias:', error);
      return null;
    }
  }

  async getKPI30Days(): Promise<KPIData | null> {
    const cacheKey = 'kpi_30d';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_30d')
        .select('*')
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar KPI 30 dias:', error);
      return null;
    }
  }

  async getNCCategorias(): Promise<NCData[]> {
    const cacheKey = 'nc_categorias';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_nc_categorias')
        .select('*')
        .order('nc_count', { ascending: false });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar NC categorias:', error);
      return [];
    }
  }

  async getSLALaboratorio(): Promise<SLAData[]> {
    const cacheKey = 'sla_laboratorio';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_sla_laboratorio')
        .select('*')
        .order('taxa_aprovacao', { ascending: false });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar SLA laboratório:', error);
      return [];
    }
  }

  async getTrends30Days(): Promise<TrendData[]> {
    const cacheKey = 'trends_30d';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_trends_30d')
        .select('*')
        .order('data', { ascending: true });

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar tendências 30 dias:', error);
      return [];
    }
  }

  async getGlobalData(): Promise<GlobalData | null> {
    const cacheKey = 'global_data';
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('kpi_global')
        .select('*')
        .single();

      if (error) throw error;

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados globais:', error);
      return null;
    }
  }

  // Método para limpar cache (útil para forçar refresh)
  clearCache(): void {
    this.cache.clear();
  }

  // Método para buscar todos os KPIs de uma vez
  async getAllKPIs() {
    const [today, week, month, nc, sla, trends, global] = await Promise.allSettled([
      this.getKPIToday(),
      this.getKPI7Days(),
      this.getKPI30Days(),
      this.getNCCategorias(),
      this.getSLALaboratorio(),
      this.getTrends30Days(),
      this.getGlobalData()
    ]);

    return {
      today: today.status === 'fulfilled' ? today.value : null,
      week: week.status === 'fulfilled' ? week.value : null,
      month: month.status === 'fulfilled' ? month.value : null,
      nc: nc.status === 'fulfilled' ? nc.value : [],
      sla: sla.status === 'fulfilled' ? sla.value : [],
      trends: trends.status === 'fulfilled' ? trends.value : [],
      global: global.status === 'fulfilled' ? global.value : null
    };
  }
}

export const kpiService = new KPIService();
