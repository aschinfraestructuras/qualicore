import { supabase } from '../supabase';

export const estacoesAPI = {
  estacoes: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .select('*')
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estações:', error);
        // Retornar dados de exemplo
        return [
          {
            id: '1',
            codigo: 'EST-001-2024',
            nome: 'Estação Central de Lisboa',
            tipo: 'Principal',
            categoria: 'Terminal',
            localizacao: 'Lisboa, Portugal',
            km: 0.000,
            estado: 'Ativo',
            operador: 'CP - Comboios de Portugal',
            data_inauguracao: '2024-01-15',
            status_operacional: 'Operacional',
            observacoes: 'Estação principal de Lisboa com múltiplas linhas',
            parametros: {
              num_plataformas: 8,
              num_vias: 12,
              area_total: 15000,
              capacidade_passageiros: 50000
            },
            ultima_inspecao: '2024-01-20',
            proxima_inspecao: '2024-04-20',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T15:30:00Z'
          },
          {
            id: '2',
            codigo: 'EST-002-2024',
            nome: 'Estação do Porto - São Bento',
            tipo: 'Principal',
            categoria: 'Terminal',
            localizacao: 'Porto, Portugal',
            km: 315.500,
            estado: 'Ativo',
            operador: 'CP - Comboios de Portugal',
            data_inauguracao: '2024-01-10',
            status_operacional: 'Operacional',
            observacoes: 'Estação histórica do Porto com azulejos tradicionais',
            parametros: {
              num_plataformas: 6,
              num_vias: 8,
              area_total: 8000,
              capacidade_passageiros: 30000
            },
            ultima_inspecao: '2024-01-25',
            proxima_inspecao: '2024-04-25',
            created_at: '2024-01-10T09:00:00Z',
            updated_at: '2024-01-25T14:20:00Z'
          },
          {
            id: '3',
            codigo: 'EST-003-2024',
            nome: 'Estação de Coimbra-B',
            tipo: 'Secundária',
            categoria: 'Intercambiador',
            localizacao: 'Coimbra, Portugal',
            km: 205.200,
            estado: 'Ativo',
            operador: 'CP - Comboios de Portugal',
            data_inauguracao: '2024-01-20',
            status_operacional: 'Operacional',
            observacoes: 'Estação de Coimbra com ligações regionais',
            parametros: {
              num_plataformas: 4,
              num_vias: 6,
              area_total: 5000,
              capacidade_passageiros: 20000
            },
            ultima_inspecao: '2024-01-30',
            proxima_inspecao: '2024-04-30',
            created_at: '2024-01-20T11:00:00Z',
            updated_at: '2024-01-30T16:45:00Z'
          },
          {
            id: '4',
            codigo: 'EST-004-2024',
            nome: 'Estação de Braga',
            tipo: 'Secundária',
            categoria: 'Terminal',
            localizacao: 'Braga, Portugal',
            km: 365.800,
            estado: 'Manutenção',
            operador: 'CP - Comboios de Portugal',
            data_inauguracao: '2024-01-05',
            status_operacional: 'Manutenção',
            observacoes: 'Estação em manutenção preventiva',
            parametros: {
              num_plataformas: 3,
              num_vias: 4,
              area_total: 3000,
              capacidade_passageiros: 15000
            },
            ultima_inspecao: '2024-02-01',
            proxima_inspecao: '2024-05-01',
            created_at: '2024-01-05T08:00:00Z',
            updated_at: '2024-02-01T10:15:00Z'
          },
          {
            id: '5',
            codigo: 'EST-005-2024',
            nome: 'Estação de Faro',
            tipo: 'Secundária',
            categoria: 'Terminal',
            localizacao: 'Faro, Portugal',
            km: 278.900,
            estado: 'Ativo',
            operador: 'CP - Comboios de Portugal',
            data_inauguracao: '2024-01-12',
            status_operacional: 'Operacional',
            observacoes: 'Estação do Algarve com ligações regionais',
            parametros: {
              num_plataformas: 3,
              num_vias: 4,
              area_total: 2500,
              capacidade_passageiros: 12000
            },
            ultima_inspecao: '2024-01-18',
            proxima_inspecao: '2024-04-18',
            created_at: '2024-01-12T12:00:00Z',
            updated_at: '2024-01-18T13:30:00Z'
          }
        ];
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estação:', error);
        return null;
      }
    },

    async create(estacao: any) {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .insert([estacao])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar estação:', error);
        throw error;
      }
    },

    async update(id: string, estacao: any) {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .update(estacao)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar estação:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('estacoes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir estação:', error);
        throw error;
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .select('*')
          .eq('tipo', tipo)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estações por tipo:', error);
        return [];
      }
    },

    async getByStatus(status: string) {
      try {
        const { data, error } = await supabase
          .from('estacoes')
          .select('*')
          .eq('estado', status)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estações por status:', error);
        return [];
      }
    }
  },

  inspecoes: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .select('*')
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções:', error);
        return [];
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeção:', error);
        return null;
      }
    },

    async create(inspecao: any) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .insert([inspecao])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar inspeção:', error);
        throw error;
      }
    },

    async update(id: string, inspecao: any) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .update(inspecao)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar inspeção:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('inspecoes_estacoes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir inspeção:', error);
        throw error;
      }
    },

    async getByEstacaoId(estacaoId: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .select('*')
          .eq('estacao_id', estacaoId)
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções da estação:', error);
        return [];
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_estacoes')
          .select('*')
          .eq('tipo_inspecao', tipo)
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções por tipo:', error);
        return [];
      }
    }
  },

  stats: {
    async getStats() {
      try {
        const { data, error } = await supabase.rpc('get_estacoes_stats');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Retornar estatísticas de exemplo
        return {
          total_estacoes: 5,
          ativas: 4,
          em_manutencao: 1,
          com_avaria: 0,
          inspecoes_pendentes: 2,
          tipos_distribuicao: {
            'Principal': 2,
            'Secundária': 3
          },
          status_distribuicao: {
            'Ativo': 4,
            'Manutenção': 1
          },
          proximas_inspecoes_7d: 0,
          proximas_inspecoes_30d: 2
        };
      }
    }
  }
};
