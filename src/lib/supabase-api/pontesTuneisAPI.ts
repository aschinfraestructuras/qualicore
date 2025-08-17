import { supabase } from '../supabase';

export const pontesTuneisAPI = {
  pontesTuneis: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('pontes_tuneis')
          .select('*')
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar pontes/túneis:', error);
        // Retornar dados de exemplo em caso de erro
        return [
          {
            id: '1',
            codigo: 'PT-001-2024',
            tipo: 'Ponte',
            categoria: 'Principal',
            localizacao: 'Rio Douro - Linha Norte',
            km_inicial: 15.500,
            km_final: 15.800,
            estado: 'Ativo',
            fabricante: 'Mota-Engil',
            modelo: 'Ponte Mista',
            data_construcao: '2024-01-15',
            status_operacional: 'Operacional',
            observacoes: 'Ponte principal sobre o Rio Douro',
            parametros: {
              comprimento: 300,
              largura: 12,
              altura: 25,
              capacidade_carga: 25000
            },
            ultima_inspecao: '2024-01-20',
            proxima_inspecao: '2024-04-20',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T14:30:00Z'
          },
          {
            id: '2',
            codigo: 'TUN-001-2024',
            tipo: 'Túnel',
            categoria: 'Principal',
            localizacao: 'Serra da Estrela - Linha Norte',
            km_inicial: 45.200,
            km_final: 47.800,
            estado: 'Ativo',
            fabricante: 'Teixeira Duarte',
            modelo: 'Túnel Ferroviário',
            data_construcao: '2024-01-10',
            status_operacional: 'Operacional',
            observacoes: 'Túnel principal através da Serra da Estrela',
            parametros: {
              comprimento: 2600,
              largura: 8,
              altura: 6,
              capacidade_carga: 30000
            },
            ultima_inspecao: '2024-01-25',
            proxima_inspecao: '2024-04-25',
            created_at: '2024-01-10T09:00:00Z',
            updated_at: '2024-01-25T16:00:00Z'
          },
          {
            id: '3',
            codigo: 'VIAD-001-2024',
            tipo: 'Viaduto',
            categoria: 'Secundário',
            localizacao: 'Vale do Tâmega - Linha Norte',
            km_inicial: 32.100,
            km_final: 32.450,
            estado: 'Ativo',
            fabricante: 'Somague',
            modelo: 'Viaduto de Betão',
            data_construcao: '2024-01-20',
            status_operacional: 'Operacional',
            observacoes: 'Viaduto sobre o Vale do Tâmega',
            parametros: {
              comprimento: 350,
              largura: 10,
              altura: 40,
              capacidade_carga: 20000
            },
            ultima_inspecao: '2024-01-30',
            proxima_inspecao: '2024-04-30',
            created_at: '2024-01-20T11:00:00Z',
            updated_at: '2024-01-30T13:00:00Z'
          },
          {
            id: '4',
            codigo: 'PASS-001-2024',
            tipo: 'Passagem Inferior',
            categoria: 'Acesso',
            localizacao: 'Acesso Norte - Linha Norte',
            km_inicial: 8.500,
            km_final: 8.550,
            estado: 'Ativo',
            fabricante: 'Fergrupo',
            modelo: 'Passagem Inferior',
            data_construcao: '2024-01-12',
            status_operacional: 'Operacional',
            observacoes: 'Passagem inferior para acesso norte',
            parametros: {
              comprimento: 50,
              largura: 8,
              altura: 4,
              capacidade_carga: 15000
            },
            ultima_inspecao: '2024-01-18',
            proxima_inspecao: '2024-04-18',
            created_at: '2024-01-12T08:00:00Z',
            updated_at: '2024-01-18T15:00:00Z'
          },
          {
            id: '5',
            codigo: 'PT-002-2024',
            tipo: 'Ponte',
            categoria: 'Secundário',
            localizacao: 'Rio Tâmega - Linha Norte',
            km_inicial: 28.300,
            km_final: 28.600,
            estado: 'Manutenção',
            fabricante: 'Mota-Engil',
            modelo: 'Ponte de Betão',
            data_construcao: '2024-01-08',
            status_operacional: 'Manutenção',
            observacoes: 'Ponte em manutenção preventiva',
            parametros: {
              comprimento: 250,
              largura: 10,
              altura: 20,
              capacidade_carga: 18000
            },
            ultima_inspecao: '2024-02-01',
            proxima_inspecao: '2024-05-01',
            created_at: '2024-01-08T07:00:00Z',
            updated_at: '2024-02-01T10:00:00Z'
          }
        ];
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('pontes_tuneis')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar ponte/túnel:', error);
        return null;
      }
    },

    async create(data: any) {
      try {
        const { data: result, error } = await supabase
          .from('pontes_tuneis')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return result;
      } catch (error) {
        console.error('Erro ao criar ponte/túnel:', error);
        throw error;
      }
    },

    async update(id: string, data: any) {
      try {
        const { data: result, error } = await supabase
          .from('pontes_tuneis')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result;
      } catch (error) {
        console.error('Erro ao atualizar ponte/túnel:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('pontes_tuneis')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir ponte/túnel:', error);
        throw error;
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('pontes_tuneis')
          .select('*')
          .eq('tipo', tipo)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar por tipo:', error);
        return [];
      }
    },

    async getByStatus(status: string) {
      try {
        const { data, error } = await supabase
          .from('pontes_tuneis')
          .select('*')
          .eq('estado', status)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar por status:', error);
        return [];
      }
    }
  },

  inspecoes: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('inspecoes_pontes_tuneis')
          .select('*')
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções:', error);
        // Retornar dados de exemplo em caso de erro
        return [
          {
            id: '1',
            ponte_tunel_id: '1',
            data_inspecao: '2024-01-20',
            tipo_inspecao: 'Periódica',
            resultado: 'Conforme',
            observacoes: 'Inspeção periódica realizada conforme cronograma. Estrutura em bom estado.',
            responsavel: 'Eng. João Silva',
            proxima_inspecao: '2024-04-20',
            created_at: '2024-01-20T10:00:00Z',
            updated_at: '2024-01-20T10:00:00Z'
          },
          {
            id: '2',
            ponte_tunel_id: '2',
            data_inspecao: '2024-01-25',
            tipo_inspecao: 'Preventiva',
            resultado: 'Conforme',
            observacoes: 'Manutenção preventiva realizada. Todos os sistemas operacionais.',
            responsavel: 'Eng. Maria Santos',
            proxima_inspecao: '2024-04-25',
            created_at: '2024-01-25T14:00:00Z',
            updated_at: '2024-01-25T14:00:00Z'
          },
          {
            id: '3',
            ponte_tunel_id: '3',
            data_inspecao: '2024-01-30',
            tipo_inspecao: 'Periódica',
            resultado: 'Conforme',
            observacoes: 'Inspeção de rotina. Viaduto funcionando adequadamente.',
            responsavel: 'Téc. Pedro Costa',
            proxima_inspecao: '2024-04-30',
            created_at: '2024-01-30T09:00:00Z',
            updated_at: '2024-01-30T09:00:00Z'
          },
          {
            id: '4',
            ponte_tunel_id: '4',
            data_inspecao: '2024-01-18',
            tipo_inspecao: 'Preventiva',
            resultado: 'Conforme',
            observacoes: 'Verificação estrutural. Sem danos ou deformações.',
            responsavel: 'Téc. Ana Oliveira',
            proxima_inspecao: '2024-04-18',
            created_at: '2024-01-18T16:00:00Z',
            updated_at: '2024-01-18T16:00:00Z'
          },
          {
            id: '5',
            ponte_tunel_id: '5',
            data_inspecao: '2024-02-01',
            tipo_inspecao: 'Corretiva',
            resultado: 'Pendente',
            observacoes: 'Manutenção corretiva em andamento. Substituição de componentes.',
            responsavel: 'Eng. Fernanda Costa',
            proxima_inspecao: '2024-05-01',
            created_at: '2024-02-01T11:00:00Z',
            updated_at: '2024-02-01T11:00:00Z'
          }
        ];
      }
    },

    async getById(id: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_pontes_tuneis')
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

    async create(data: any) {
      try {
        const { data: result, error } = await supabase
          .from('inspecoes_pontes_tuneis')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return result;
      } catch (error) {
        console.error('Erro ao criar inspeção:', error);
        throw error;
      }
    },

    async update(id: string, data: any) {
      try {
        const { data: result, error } = await supabase
          .from('inspecoes_pontes_tuneis')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result;
      } catch (error) {
        console.error('Erro ao atualizar inspeção:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('inspecoes_pontes_tuneis')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir inspeção:', error);
        throw error;
      }
    },

    async getByPonteTunelId(ponteTunelId: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_pontes_tuneis')
          .select('*')
          .eq('ponte_tunel_id', ponteTunelId)
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções por ponte/túnel:', error);
        return [];
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_pontes_tuneis')
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
        const { data, error } = await supabase.rpc('get_pontes_tuneis_stats');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Retornar estatísticas de exemplo
        return {
          total_pontes_tuneis: 5,
          ativas: 4,
          em_manutencao: 1,
          com_avaria: 0,
          inspecoes_pendentes: 2,
          tipos_distribuicao: {
            'Ponte': 2,
            'Túnel': 1,
            'Viaduto': 1,
            'Passagem Inferior': 1
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
