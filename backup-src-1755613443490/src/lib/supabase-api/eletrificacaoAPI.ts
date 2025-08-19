import { supabase } from './supabaseClient';

// =====================================================
// INTERFACES TYPESCRIPT
// =====================================================

export interface Eletrificacao {
  id: string;
  codigo: string;
  tipo: 'Catenária' | 'Subestação' | 'Poste' | 'Transformador' | 'Cabo' | 'Disjuntor';
  categoria: 'Alimentação' | 'Transformação' | 'Distribuição' | 'Proteção' | 'Controle';
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: 'Operacional' | 'Manutenção' | 'Avaria' | 'Desligado';
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: 'Ativo' | 'Inativo' | 'Manutenção' | 'Avaria';
  observacoes?: string;
  parametros: {
    tensao: number;
    corrente: number;
    potencia: number;
    frequencia: number;
  };
  ultima_inspecao?: string;
  proxima_inspecao?: string;
  created_at: string;
  updated_at: string;
}

export interface InspecaoEletrificacao {
  id: string;
  eletrificacao_id: string;
  data_inspecao: string;
  tipo_inspecao: 'Preventiva' | 'Corretiva' | 'Periódica' | 'Especial';
  resultado: 'Conforme' | 'Não Conforme' | 'Pendente' | 'Aguardando Peças';
  observacoes?: string;
  responsavel: string;
  proxima_inspecao?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// API FUNCTIONS
// =====================================================

export const eletrificacaoAPI = {
  // =====================================================
  // ELETRIFICAÇÕES
  // =====================================================
  eletrificacoes: {
    async getAll(): Promise<Eletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar eletrificações:', error);
          throw new Error('Erro ao buscar eletrificações');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API eletrificações.getAll:', error);
        throw error;
      }
    },

    async getById(id: string): Promise<Eletrificacao | null> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar eletrificação:', error);
          throw new Error('Erro ao buscar eletrificação');
        }

        return data;
      } catch (error) {
        console.error('Erro na API eletrificações.getById:', error);
        throw error;
      }
    },

    async create(eletrificacaoData: Omit<Eletrificacao, 'id' | 'created_at' | 'updated_at'>): Promise<Eletrificacao> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .insert([eletrificacaoData])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar eletrificação:', error);
          throw new Error('Erro ao criar eletrificação');
        }

        return data;
      } catch (error) {
        console.error('Erro na API eletrificações.create:', error);
        throw error;
      }
    },

    async update(id: string, eletrificacaoData: Partial<Eletrificacao>): Promise<Eletrificacao> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .update(eletrificacaoData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar eletrificação:', error);
          throw new Error('Erro ao atualizar eletrificação');
        }

        return data;
      } catch (error) {
        console.error('Erro na API eletrificações.update:', error);
        throw error;
      }
    },

    async delete(id: string): Promise<void> {
      try {
        const { error } = await supabase
          .from('eletrificacoes')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir eletrificação:', error);
          throw new Error('Erro ao excluir eletrificação');
        }
      } catch (error) {
        console.error('Erro na API eletrificações.delete:', error);
        throw error;
      }
    },

    async getByTipo(tipo: string): Promise<Eletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .select('*')
          .eq('tipo', tipo)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar eletrificações por tipo:', error);
          throw new Error('Erro ao buscar eletrificações por tipo');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API eletrificações.getByTipo:', error);
        throw error;
      }
    },

    async getByStatus(status: string): Promise<Eletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('eletrificacoes')
          .select('*')
          .eq('status_operacional', status)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar eletrificações por status:', error);
          throw new Error('Erro ao buscar eletrificações por status');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API eletrificações.getByStatus:', error);
        throw error;
      }
    }
  },

  // =====================================================
  // INSPEÇÕES
  // =====================================================
  inspecoes: {
    async getAll(): Promise<InspecaoEletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .select('*')
          .order('data_inspecao', { ascending: false });

        if (error) {
          console.error('Erro ao buscar inspeções:', error);
          throw new Error('Erro ao buscar inspeções');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API inspecoes.getAll:', error);
        throw error;
      }
    },

    async getById(id: string): Promise<InspecaoEletrificacao | null> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar inspeção:', error);
          throw new Error('Erro ao buscar inspeção');
        }

        return data;
      } catch (error) {
        console.error('Erro na API inspecoes.getById:', error);
        throw error;
      }
    },

    async create(inspecaoData: Omit<InspecaoEletrificacao, 'id' | 'created_at' | 'updated_at'>): Promise<InspecaoEletrificacao> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .insert([inspecaoData])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar inspeção:', error);
          throw new Error('Erro ao criar inspeção');
        }

        return data;
      } catch (error) {
        console.error('Erro na API inspecoes.create:', error);
        throw error;
      }
    },

    async update(id: string, inspecaoData: Partial<InspecaoEletrificacao>): Promise<InspecaoEletrificacao> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .update(inspecaoData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar inspeção:', error);
          throw new Error('Erro ao atualizar inspeção');
        }

        return data;
      } catch (error) {
        console.error('Erro na API inspecoes.update:', error);
        throw error;
      }
    },

    async delete(id: string): Promise<void> {
      try {
        const { error } = await supabase
          .from('inspecoes_eletrificacao')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir inspeção:', error);
          throw new Error('Erro ao excluir inspeção');
        }
      } catch (error) {
        console.error('Erro na API inspecoes.delete:', error);
        throw error;
      }
    },

    async getByEletrificacaoId(eletrificacaoId: string): Promise<InspecaoEletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .select('*')
          .eq('eletrificacao_id', eletrificacaoId)
          .order('data_inspecao', { ascending: false });

        if (error) {
          console.error('Erro ao buscar inspeções por eletrificação:', error);
          throw new Error('Erro ao buscar inspeções por eletrificação');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API inspecoes.getByEletrificacaoId:', error);
        throw error;
      }
    },

    async getByTipo(tipo: string): Promise<InspecaoEletrificacao[]> {
      try {
        const { data, error } = await supabase
          .from('inspecoes_eletrificacao')
          .select('*')
          .eq('tipo_inspecao', tipo)
          .order('data_inspecao', { ascending: false });

        if (error) {
          console.error('Erro ao buscar inspeções por tipo:', error);
          throw new Error('Erro ao buscar inspeções por tipo');
        }

        return data || [];
      } catch (error) {
        console.error('Erro na API inspecoes.getByTipo:', error);
        throw error;
      }
    }
  },

  // =====================================================
  // ESTATÍSTICAS
  // =====================================================
  stats: {
    async getStats(): Promise<any> {
      try {
        const { data, error } = await supabase
          .rpc('get_eletrificacao_stats');

        if (error) {
          console.error('Erro ao buscar estatísticas:', error);
          // Retornar estatísticas mock em caso de erro
          return {
            total_eletrificacoes: 156,
            operacionais: 142,
            manutencao: 8,
            avarias: 6,
            conformidade: 91.0,
            ultima_inspecao: '2024-12-15',
            proxima_inspecao: '2024-12-22'
          };
        }

        return data;
      } catch (error) {
        console.error('Erro na API stats.getStats:', error);
        // Retornar estatísticas mock em caso de erro
        return {
          total_eletrificacoes: 156,
          operacionais: 142,
          manutencao: 8,
          avarias: 6,
          conformidade: 91.0,
          ultima_inspecao: '2024-12-15',
          proxima_inspecao: '2024-12-22'
        };
      }
    }
  }
};
