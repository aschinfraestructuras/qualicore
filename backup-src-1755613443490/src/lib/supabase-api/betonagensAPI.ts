import { supabase } from '@/lib/supabase';

export interface Betonagem {
  id: string;
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
  created_at: string;
  updated_at: string;
}

export interface EnsaioBetonagem {
  id: string;
  betonagem_id: string;
  data_ensaio: string;
  tipo_ensaio: string;
  resultado: number;
  observacoes: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export const betonagensAPI = {
  betonagens: {
    getAll: async (): Promise<Betonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar betonagens:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<Betonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar betonagem:', error);
        return null;
      }
    },

    create: async (betonagem: Omit<Betonagem, 'id' | 'created_at' | 'updated_at'>): Promise<Betonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .insert([betonagem])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar betonagem:', error);
        throw error;
      }
    },

    update: async (id: string, updates: Partial<Betonagem>): Promise<Betonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar betonagem:', error);
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('betonagens')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao eliminar betonagem:', error);
        throw error;
      }
    },

    getByElemento: async (elemento: string): Promise<Betonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .eq('elemento_estrutural', elemento)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar betonagens por elemento:', error);
        return [];
      }
    },

    getByStatus: async (status: string): Promise<Betonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .eq('status_conformidade', status)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar betonagens por status:', error);
        return [];
      }
    },

    getByFornecedor: async (fornecedor: string): Promise<Betonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .eq('fornecedor', fornecedor)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar betonagens por fornecedor:', error);
        return [];
      }
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Betonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('betonagens')
          .select('*')
          .gte('data_betonagem', startDate)
          .lte('data_betonagem', endDate)
          .order('data_betonagem', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar betonagens por período:', error);
        return [];
      }
    }
  },

  ensaios: {
    getAll: async (): Promise<EnsaioBetonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar ensaios:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<EnsaioBetonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar ensaio:', error);
        return null;
      }
    },

    create: async (ensaio: Omit<EnsaioBetonagem, 'id' | 'created_at' | 'updated_at'>): Promise<EnsaioBetonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .insert([ensaio])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar ensaio:', error);
        throw error;
      }
    },

    update: async (id: string, updates: Partial<EnsaioBetonagem>): Promise<EnsaioBetonagem | null> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar ensaio:', error);
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('ensaios_betonagem')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao eliminar ensaio:', error);
        throw error;
      }
    },

    getByBetonagemId: async (betonagemId: string): Promise<EnsaioBetonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .select('*')
          .eq('betonagem_id', betonagemId)
          .order('data_ensaio', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar ensaios por betonagem:', error);
        return [];
      }
    },

    getByTipo: async (tipo: string): Promise<EnsaioBetonagem[]> => {
      try {
        const { data, error } = await supabase
          .from('ensaios_betonagem')
          .select('*')
          .eq('tipo_ensaio', tipo)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar ensaios por tipo:', error);
        return [];
      }
    }
  },

  stats: {
    getStats: async () => {
      try {
        const { data, error } = await supabase.rpc('get_betonagens_stats');
        
        if (error) {
          console.error('Erro ao buscar estatísticas:', error);
          // Retornar dados mock como fallback
          return {
            total_betonagens: 0,
            conformes: 0,
            nao_conformes: 0,
            pendentes: 0,
            resistencia_media_28d: 0,
            betonagens_7d: 0,
            betonagens_28d: 0,
            elementos_distribuicao: {},
            fornecedores_distribuicao: {},
            resistencia_evolucao: []
          };
        }
        
        return data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
          total_betonagens: 0,
          conformes: 0,
          nao_conformes: 0,
          pendentes: 0,
          resistencia_media_28d: 0,
          betonagens_7d: 0,
          betonagens_28d: 0,
          elementos_distribuicao: {},
          fornecedores_distribuicao: {},
          resistencia_evolucao: []
        };
      }
    }
  }
};
