import { supabase } from './supabaseClient';

// Interfaces
interface Sinalizacao {
  id: string;
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  ultima_inspecao: string;
  proxima_inspecao: string;
  parametros: {
    alcance: number;
    frequencia: string;
    potencia: number;
    sensibilidade: number;
  };
  status_operacional: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

interface InspecaoSinalizacao {
  id: string;
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  fotos: string[];
  relatorio_url: string;
  sinalizacao_id: string;
  parametros_medidos: any;
  created_at: string;
  updated_at: string;
}

interface SinalizacaoStats {
  totalSinalizacoes: number;
  operacionais: number;
  manutencao: number;
  avariadas: number;
  inspecoesPendentes: number;
  alertasCriticos: number;
  conformidade: number;
  kmCobertos: number;
}

// API para Sinalizações
const sinalizacoesAPI = {
  async getAll(): Promise<Sinalizacao[]> {
    try {
      const { data, error } = await supabase
        .from('sinalizacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar sinalizações:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Sinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('sinalizacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar sinalização:', error);
      return null;
    }
  },

  async create(sinalizacao: Omit<Sinalizacao, 'id' | 'created_at' | 'updated_at'>): Promise<Sinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('sinalizacoes')
        .insert([sinalizacao])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar sinalização:', error);
      return null;
    }
  },

  async update(id: string, sinalizacao: Partial<Sinalizacao>): Promise<Sinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('sinalizacoes')
        .update(sinalizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar sinalização:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sinalizacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar sinalização:', error);
      return false;
    }
  }
};

// API para Inspeções de Sinalização
const inspecoesAPI = {
  async getAll(): Promise<InspecaoSinalizacao[]> {
    try {
      const { data, error } = await supabase
        .from('inspecoes_sinalizacao')
        .select('*')
        .order('data_inspecao', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar inspeções de sinalização:', error);
      return [];
    }
  },

  async getById(id: string): Promise<InspecaoSinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('inspecoes_sinalizacao')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar inspeção de sinalização:', error);
      return null;
    }
  },

  async create(inspecao: Omit<InspecaoSinalizacao, 'id' | 'created_at' | 'updated_at'>): Promise<InspecaoSinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('inspecoes_sinalizacao')
        .insert([inspecao])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar inspeção de sinalização:', error);
      return null;
    }
  },

  async update(id: string, inspecao: Partial<InspecaoSinalizacao>): Promise<InspecaoSinalizacao | null> {
    try {
      const { data, error } = await supabase
        .from('inspecoes_sinalizacao')
        .update(inspecao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar inspeção de sinalização:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inspecoes_sinalizacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar inspeção de sinalização:', error);
      return false;
    }
  }
};

// API para Estatísticas
const statsAPI = {
  async getStats(): Promise<SinalizacaoStats> {
    try {
      // Buscar dados das sinalizações
      const { data: sinalizacoes, error: sinalizacoesError } = await supabase
        .from('sinalizacoes')
        .select('*');

      if (sinalizacoesError) throw sinalizacoesError;

      // Buscar dados das inspeções
      const { data: inspecoes, error: inspecoesError } = await supabase
        .from('inspecoes_sinalizacao')
        .select('*');

      if (inspecoesError) throw inspecoesError;

      const totalSinalizacoes = sinalizacoes?.length || 0;
      const operacionais = sinalizacoes?.filter(s => s.estado === 'Operacional').length || 0;
      const manutencao = sinalizacoes?.filter(s => s.estado === 'Manutenção').length || 0;
      const avariadas = sinalizacoes?.filter(s => s.estado === 'Avariada').length || 0;

      // Calcular inspeções pendentes (próxima inspeção < hoje)
      const hoje = new Date();
      const inspecoesPendentes = inspecoes?.filter(i => {
        const proximaInspecao = new Date(i.proxima_inspecao);
        return proximaInspecao < hoje;
      }).length || 0;

      // Calcular alertas críticos (sinalizações avariadas)
      const alertasCriticos = avariadas;

      // Calcular conformidade
      const conformidade = totalSinalizacoes > 0 ? (operacionais / totalSinalizacoes) * 100 : 0;

      // Calcular KM cobertos
      const kmCobertos = sinalizacoes?.reduce((total, s) => {
        return total + (s.km_final - s.km_inicial);
      }, 0) || 0;

      return {
        totalSinalizacoes,
        operacionais,
        manutencao,
        avariadas,
        inspecoesPendentes,
        alertasCriticos,
        conformidade: Math.round(conformidade * 10) / 10,
        kmCobertos: Math.round(kmCobertos * 10) / 10
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de sinalização:', error);
      return {
        totalSinalizacoes: 0,
        operacionais: 0,
        manutencao: 0,
        avariadas: 0,
        inspecoesPendentes: 0,
        alertasCriticos: 0,
        conformidade: 0,
        kmCobertos: 0
      };
    }
  }
};

export const sinalizacaoAPI = {
  sinalizacoes: sinalizacoesAPI,
  inspecoes: inspecoesAPI,
  stats: statsAPI
};
