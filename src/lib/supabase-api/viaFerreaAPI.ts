import { supabase } from './supabaseClient';

// =====================================================
// INTERFACES TYPESCRIPT
// =====================================================

export interface Trilho {
  id: string;
  codigo: string;
  tipo: 'UIC60' | 'UIC54' | 'S49' | 'S54';
  material: 'Aço' | 'Aço endurecido' | 'Aço especial';
  comprimento: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: 'Excelente' | 'Bom' | 'Regular' | 'Mau' | 'Crítico';
  tensao: number;
  alinhamento?: number;
  nivel?: number;
  bitola: number;
  ultima_inspecao?: string;
  proxima_inspecao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Travessa {
  id: string;
  codigo: string;
  tipo: 'Betão' | 'Madeira' | 'Aço';
  material: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: 'Excelente' | 'Bom' | 'Regular' | 'Mau' | 'Crítico';
  ultima_inspecao?: string;
  proxima_inspecao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Inspecao {
  id: string;
  trilho_id?: string;
  travessa_id?: string;
  data_inspecao: string;
  tipo: 'Geometria' | 'Visual' | 'Ultrassom' | 'Magnetoscopia' | 'Penetrantes';
  inspector: string;
  resultado: 'Conforme' | 'Não Conforme' | 'Crítico';
  observacoes?: string;
  acoes_corretivas?: string;
  proxima_inspecao?: string;
  fotos?: string[];
  relatorio_url?: string;
  parametros_medidos?: Record<string, any>;
  created_at: string;
}

export interface ViaFerreaStats {
  total_trilhos: number;
  total_travessas: number;
  inspecoes_pendentes: number;
  alertas_criticos: number;
  conformidade: number;
  km_cobertos: number;
}

// =====================================================
// API FUNCTIONS - TRILHOS
// =====================================================

export const trilhosAPI = {
  // Buscar todos os trilhos
  async getAll(): Promise<Trilho[]> {
    const { data, error } = await supabase
      .from('trilhos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar trilhos:', error);
      throw new Error(`Erro ao buscar trilhos: ${error.message}`);
    }

    return data || [];
  },

  // Buscar trilho por ID
  async getById(id: string): Promise<Trilho | null> {
    const { data, error } = await supabase
      .from('trilhos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar trilho:', error);
      throw new Error(`Erro ao buscar trilho: ${error.message}`);
    }

    return data;
  },

  // Buscar trilho por código
  async getByCodigo(codigo: string): Promise<Trilho | null> {
    const { data, error } = await supabase
      .from('trilhos')
      .select('*')
      .eq('codigo', codigo)
      .single();

    if (error) {
      console.error('Erro ao buscar trilho por código:', error);
      throw new Error(`Erro ao buscar trilho por código: ${error.message}`);
    }

    return data;
  },

  // Criar novo trilho
  async create(trilho: Omit<Trilho, 'id' | 'created_at' | 'updated_at'>): Promise<Trilho> {
    const { data, error } = await supabase
      .from('trilhos')
      .insert(trilho)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar trilho:', error);
      throw new Error(`Erro ao criar trilho: ${error.message}`);
    }

    return data;
  },

  // Atualizar trilho
  async update(id: string, updates: Partial<Omit<Trilho, 'id' | 'created_at' | 'updated_at'>>): Promise<Trilho> {
    const { data, error } = await supabase
      .from('trilhos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar trilho:', error);
      throw new Error(`Erro ao atualizar trilho: ${error.message}`);
    }

    return data;
  },

  // Deletar trilho
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('trilhos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar trilho:', error);
      throw new Error(`Erro ao deletar trilho: ${error.message}`);
    }
  },

  // Buscar trilhos por estado
  async getByEstado(estado: Trilho['estado']): Promise<Trilho[]> {
    const { data, error } = await supabase
      .from('trilhos')
      .select('*')
      .eq('estado', estado)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar trilhos por estado:', error);
      throw new Error(`Erro ao buscar trilhos por estado: ${error.message}`);
    }

    return data || [];
  },

  // Buscar trilhos com inspeção pendente
  async getInspecoesPendentes(): Promise<Trilho[]> {
    const { data, error } = await supabase
      .from('trilhos')
      .select('*')
      .lte('proxima_inspecao', new Date().toISOString().split('T')[0])
      .order('proxima_inspecao', { ascending: true });

    if (error) {
      console.error('Erro ao buscar trilhos com inspeção pendente:', error);
      throw new Error(`Erro ao buscar trilhos com inspeção pendente: ${error.message}`);
    }

    return data || [];
  }
};

// =====================================================
// API FUNCTIONS - TRAVESSAS
// =====================================================

export const travessasAPI = {
  // Buscar todas as travessas
  async getAll(): Promise<Travessa[]> {
    const { data, error } = await supabase
      .from('travessas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar travessas:', error);
      throw new Error(`Erro ao buscar travessas: ${error.message}`);
    }

    return data || [];
  },

  // Buscar travessa por ID
  async getById(id: string): Promise<Travessa | null> {
    const { data, error } = await supabase
      .from('travessas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar travessa:', error);
      throw new Error(`Erro ao buscar travessa: ${error.message}`);
    }

    return data;
  },

  // Buscar travessa por código
  async getByCodigo(codigo: string): Promise<Travessa | null> {
    const { data, error } = await supabase
      .from('travessas')
      .select('*')
      .eq('codigo', codigo)
      .single();

    if (error) {
      console.error('Erro ao buscar travessa por código:', error);
      throw new Error(`Erro ao buscar travessa por código: ${error.message}`);
    }

    return data;
  },

  // Criar nova travessa
  async create(travessa: Omit<Travessa, 'id' | 'created_at' | 'updated_at'>): Promise<Travessa> {
    const { data, error } = await supabase
      .from('travessas')
      .insert(travessa)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar travessa:', error);
      throw new Error(`Erro ao criar travessa: ${error.message}`);
    }

    return data;
  },

  // Atualizar travessa
  async update(id: string, updates: Partial<Omit<Travessa, 'id' | 'created_at' | 'updated_at'>>): Promise<Travessa> {
    const { data, error } = await supabase
      .from('travessas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar travessa:', error);
      throw new Error(`Erro ao atualizar travessa: ${error.message}`);
    }

    return data;
  },

  // Deletar travessa
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('travessas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar travessa:', error);
      throw new Error(`Erro ao deletar travessa: ${error.message}`);
    }
  },

  // Buscar travessas por estado
  async getByEstado(estado: Travessa['estado']): Promise<Travessa[]> {
    const { data, error } = await supabase
      .from('travessas')
      .select('*')
      .eq('estado', estado)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar travessas por estado:', error);
      throw new Error(`Erro ao buscar travessas por estado: ${error.message}`);
    }

    return data || [];
  },

  // Buscar travessas com inspeção pendente
  async getInspecoesPendentes(): Promise<Travessa[]> {
    const { data, error } = await supabase
      .from('travessas')
      .select('*')
      .lte('proxima_inspecao', new Date().toISOString().split('T')[0])
      .order('proxima_inspecao', { ascending: true });

    if (error) {
      console.error('Erro ao buscar travessas com inspeção pendente:', error);
      throw new Error(`Erro ao buscar travessas com inspeção pendente: ${error.message}`);
    }

    return data || [];
  }
};

// =====================================================
// API FUNCTIONS - INSPEÇÕES
// =====================================================

export const inspecoesAPI = {
  // Buscar todas as inspeções
  async getAll(): Promise<Inspecao[]> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .order('data_inspecao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inspeções:', error);
      throw new Error(`Erro ao buscar inspeções: ${error.message}`);
    }

    return data || [];
  },

  // Buscar inspeção por ID
  async getById(id: string): Promise<Inspecao | null> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar inspeção:', error);
      throw new Error(`Erro ao buscar inspeção: ${error.message}`);
    }

    return data;
  },

  // Buscar inspeções de um trilho
  async getByTrilhoId(trilhoId: string): Promise<Inspecao[]> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .eq('trilho_id', trilhoId)
      .order('data_inspecao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inspeções do trilho:', error);
      throw new Error(`Erro ao buscar inspeções do trilho: ${error.message}`);
    }

    return data || [];
  },

  // Buscar inspeções de uma travessa
  async getByTravessaId(travessaId: string): Promise<Inspecao[]> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .eq('travessa_id', travessaId)
      .order('data_inspecao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inspeções da travessa:', error);
      throw new Error(`Erro ao buscar inspeções da travessa: ${error.message}`);
    }

    return data || [];
  },

  // Criar nova inspeção
  async create(inspecao: Omit<Inspecao, 'id' | 'created_at'>): Promise<Inspecao> {
    const { data, error } = await supabase
      .from('inspecoes')
      .insert(inspecao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar inspeção:', error);
      throw new Error(`Erro ao criar inspeção: ${error.message}`);
    }

    return data;
  },

  // Atualizar inspeção
  async update(id: string, updates: Partial<Omit<Inspecao, 'id' | 'created_at'>>): Promise<Inspecao> {
    const { data, error } = await supabase
      .from('inspecoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar inspeção:', error);
      throw new Error(`Erro ao atualizar inspeção: ${error.message}`);
    }

    return data;
  },

  // Deletar inspeção
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('inspecoes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar inspeção:', error);
      throw new Error(`Erro ao deletar inspeção: ${error.message}`);
    }
  },

  // Buscar inspeções por resultado
  async getByResultado(resultado: Inspecao['resultado']): Promise<Inspecao[]> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .eq('resultado', resultado)
      .order('data_inspecao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inspeções por resultado:', error);
      throw new Error(`Erro ao buscar inspeções por resultado: ${error.message}`);
    }

    return data || [];
  },

  // Buscar inspeções por tipo
  async getByTipo(tipo: Inspecao['tipo']): Promise<Inspecao[]> {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('*')
      .eq('tipo', tipo)
      .order('data_inspecao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar inspeções por tipo:', error);
      throw new Error(`Erro ao buscar inspeções por tipo: ${error.message}`);
    }

    return data || [];
  }
};

// =====================================================
// API FUNCTIONS - ESTATÍSTICAS
// =====================================================

export const viaFerreaStatsAPI = {
  // Buscar estatísticas gerais
  async getStats(): Promise<ViaFerreaStats> {
    try {
      // Usar a função SQL criada no Supabase
      const { data, error } = await supabase
        .rpc('get_via_ferrea_stats');

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Fallback: calcular estatísticas manualmente
      return await this.calculateStatsManually();
    }
  },

  // Calcular estatísticas manualmente (fallback)
  async calculateStatsManually(): Promise<ViaFerreaStats> {
    try {
      const [trilhos, travessas, inspecoes] = await Promise.all([
        trilhosAPI.getAll(),
        travessasAPI.getAll(),
        inspecoesAPI.getAll()
      ]);

      const inspecoesPendentes = [
        ...trilhos.filter(t => t.proxima_inspecao && new Date(t.proxima_inspecao) <= new Date()),
        ...travessas.filter(t => t.proxima_inspecao && new Date(t.proxima_inspecao) <= new Date())
      ].length;

      const alertasCriticos = inspecoes.filter(i => i.resultado === 'Crítico').length;
      
      const conformidade = inspecoes.length > 0 
        ? Math.round((inspecoes.filter(i => i.resultado === 'Conforme').length * 100) / inspecoes.length * 100) / 100
        : 0;

      const kmCobertos = trilhos.reduce((total, trilho) => total + (trilho.km_final - trilho.km_inicial), 0);

      return {
        total_trilhos: trilhos.length,
        total_travessas: travessas.length,
        inspecoes_pendentes: inspecoesPendentes,
        alertas_criticos: alertasCriticos,
        conformidade,
        km_cobertos: kmCobertos
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas manualmente:', error);
      throw new Error('Erro ao calcular estatísticas');
    }
  },

  // Buscar próximas inspeções
  async getProximasInspecoes(limit: number = 10): Promise<Array<Trilho | Travessa>> {
    try {
      const [trilhosPendentes, travessasPendentes] = await Promise.all([
        trilhosAPI.getInspecoesPendentes(),
        travessasAPI.getInspecoesPendentes()
      ]);

      const todasPendentes = [
        ...trilhosPendentes.map(t => ({ ...t, tipo_elemento: 'trilho' as const })),
        ...travessasPendentes.map(t => ({ ...t, tipo_elemento: 'travessa' as const }))
      ];

      return todasPendentes
        .sort((a, b) => new Date(a.proxima_inspecao || '').getTime() - new Date(b.proxima_inspecao || '').getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Erro ao buscar próximas inspeções:', error);
      throw new Error('Erro ao buscar próximas inspeções');
    }
  }
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export const viaFerreaAPI = {
  trilhos: trilhosAPI,
  travessas: travessasAPI,
  inspecoes: inspecoesAPI,
  stats: viaFerreaStatsAPI
};

export default viaFerreaAPI;
