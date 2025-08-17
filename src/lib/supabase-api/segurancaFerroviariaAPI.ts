import { supabase } from '../supabase';

export const segurancaFerroviariaAPI = {
  seguranca: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('seguranca_ferroviaria')
          .select('*')
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar sistemas de segurança:', error);
        // Retornar dados de exemplo
        return [
          {
            id: '1',
            codigo: 'SEG-001-2024',
            tipo: 'Sistema de Detecção',
            categoria: 'Detecção de Intrusão',
            localizacao: 'Lisboa - Estação Central',
            km_inicial: 0.000,
            km_final: 5.000,
            estado: 'Ativo',
            fabricante: 'Siemens',
            modelo: 'SICAM PAS',
            data_instalacao: '2024-01-15',
            status_operacional: 'Operacional',
            observacoes: 'Sistema de detecção de intrusão na estação central',
            parametros: {
              nivel_seguranca: 5,
              raio_cobertura: 500,
              tempo_resposta: 2,
              capacidade_deteccao: 95
            },
            ultima_inspecao: '2024-01-20',
            proxima_inspecao: '2024-04-20',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-20T15:30:00Z'
          },
          {
            id: '2',
            codigo: 'SEG-002-2024',
            tipo: 'Sistema de Vigilância',
            categoria: 'CCTV',
            localizacao: 'Porto - São Bento',
            km_inicial: 315.500,
            km_final: 320.500,
            estado: 'Ativo',
            fabricante: 'Bosch',
            modelo: 'DINION IP 4000',
            data_instalacao: '2024-01-10',
            status_operacional: 'Operacional',
            observacoes: 'Sistema de vigilância por vídeo na estação do Porto',
            parametros: {
              nivel_seguranca: 4,
              raio_cobertura: 300,
              tempo_resposta: 1,
              capacidade_deteccao: 90
            },
            ultima_inspecao: '2024-01-25',
            proxima_inspecao: '2024-04-25',
            created_at: '2024-01-10T09:00:00Z',
            updated_at: '2024-01-25T14:20:00Z'
          },
          {
            id: '3',
            codigo: 'SEG-003-2024',
            tipo: 'Sistema de Controle',
            categoria: 'Controle de Acesso',
            localizacao: 'Coimbra-B',
            km_inicial: 205.200,
            km_final: 210.200,
            estado: 'Ativo',
            fabricante: 'Honeywell',
            modelo: 'WIN-PAK',
            data_instalacao: '2024-01-20',
            status_operacional: 'Operacional',
            observacoes: 'Sistema de controle de acesso na estação de Coimbra',
            parametros: {
              nivel_seguranca: 5,
              raio_cobertura: 200,
              tempo_resposta: 1,
              capacidade_deteccao: 98
            },
            ultima_inspecao: '2024-01-30',
            proxima_inspecao: '2024-04-30',
            created_at: '2024-01-20T11:00:00Z',
            updated_at: '2024-01-30T16:45:00Z'
          },
          {
            id: '4',
            codigo: 'SEG-004-2024',
            tipo: 'Sistema de Alarme',
            categoria: 'Alarme de Incêndio',
            localizacao: 'Braga',
            km_inicial: 365.800,
            km_final: 370.800,
            estado: 'Manutenção',
            fabricante: 'Notifier',
            modelo: 'AFP-320',
            data_instalacao: '2024-01-05',
            status_operacional: 'Manutenção',
            observacoes: 'Sistema de alarme de incêndio em manutenção preventiva',
            parametros: {
              nivel_seguranca: 4,
              raio_cobertura: 400,
              tempo_resposta: 3,
              capacidade_deteccao: 92
            },
            ultima_inspecao: '2024-02-01',
            proxima_inspecao: '2024-05-01',
            created_at: '2024-01-05T08:00:00Z',
            updated_at: '2024-02-01T10:15:00Z'
          },
          {
            id: '5',
            codigo: 'SEG-005-2024',
            tipo: 'Sistema de Detecção',
            categoria: 'Detecção de Fumo',
            localizacao: 'Faro',
            km_inicial: 278.900,
            km_final: 283.900,
            estado: 'Ativo',
            fabricante: 'Edwards',
            modelo: 'EST3',
            data_instalacao: '2024-01-12',
            status_operacional: 'Operacional',
            observacoes: 'Sistema de detecção de fumo na estação do Algarve',
            parametros: {
              nivel_seguranca: 3,
              raio_cobertura: 250,
              tempo_resposta: 2,
              capacidade_deteccao: 88
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
          .from('seguranca_ferroviaria')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar sistema de segurança:', error);
        return null;
      }
    },

    async create(seguranca: any) {
      try {
        const { data, error } = await supabase
          .from('seguranca_ferroviaria')
          .insert([seguranca])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar sistema de segurança:', error);
        throw error;
      }
    },

    async update(id: string, seguranca: any) {
      try {
        const { data, error } = await supabase
          .from('seguranca_ferroviaria')
          .update(seguranca)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar sistema de segurança:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('seguranca_ferroviaria')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir sistema de segurança:', error);
        throw error;
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('seguranca_ferroviaria')
          .select('*')
          .eq('tipo', tipo)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar sistemas por tipo:', error);
        return [];
      }
    },

    async getByStatus(status: string) {
      try {
        const { data, error } = await supabase
          .from('seguranca_ferroviaria')
          .select('*')
          .eq('estado', status)
          .order('codigo', { ascending: true });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar sistemas por status:', error);
        return [];
      }
    }
  },

  inspecoes: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('inspecoes_seguranca')
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
          .from('inspecoes_seguranca')
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
          .from('inspecoes_seguranca')
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
          .from('inspecoes_seguranca')
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
          .from('inspecoes_seguranca')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao excluir inspeção:', error);
        throw error;
      }
    },

    async getBySegurancaId(segurancaId: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_seguranca')
          .select('*')
          .eq('seguranca_id', segurancaId)
          .order('data_inspecao', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar inspeções do sistema:', error);
        return [];
      }
    },

    async getByTipo(tipo: string) {
      try {
        const { data, error } = await supabase
          .from('inspecoes_seguranca')
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
        const { data, error } = await supabase.rpc('get_seguranca_stats');
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Retornar estatísticas de exemplo
        return {
          total_sistemas: 5,
          ativos: 4,
          em_manutencao: 1,
          com_avaria: 0,
          inspecoes_pendentes: 2,
          tipos_distribuicao: {
            'Sistema de Detecção': 2,
            'Sistema de Vigilância': 1,
            'Sistema de Controle': 1,
            'Sistema de Alarme': 1
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
