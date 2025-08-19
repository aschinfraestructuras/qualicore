import { supabase } from '../supabase';
import type { 
  Norma, 
  VersaoNorma, 
  AplicacaoNorma, 
  NotificacaoNorma,
  FiltrosNormas,
  EstatisticasNormas,
  CategoriaNorma,
  OrganismoNormativo,
  StatusNorma,
  PrioridadeNorma,
  TipoAplicacao
} from '../../types/normas';

export const normasAPI = {
  // ===== NORMAS =====
  normas: {
    // Utilitário interno: tenta remover colunas opcionais que não existam no schema
    // e refaz a operação. Útil enquanto o schema do Supabase não for atualizado.
    async _retryWithoutMissingColumns<T extends Record<string, any>>(
      operation: 'insert' | 'update',
      originalPayload: T,
      tableId: string,
      id?: string
    ): Promise<any> {
      const optionalColumns = [
        'documentos_anexos',
        'limites_aceitacao',
        'metodos_ensaio',
        'documentos_relacionados',
        'observacoes',
        'tags'
      ];

      const sanitized: Record<string, any> = { ...originalPayload };
      // Remove apenas colunas opcionais que possam causar o erro
      optionalColumns.forEach((col) => {
        if (col in sanitized) {
          delete sanitized[col];
        }
      });

      if (operation === 'insert') {
        const { data, error } = await supabase
          .from(tableId)
          .insert([{ ...sanitized }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // update
      const { data, error } = await supabase
        .from(tableId)
        .update({ ...sanitized })
        .eq('id', id as string)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    // Buscar todas as normas
    async getAll(): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar norma por ID
    async getById(id: string): Promise<Norma | null> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    // Buscar norma por código
    async getByCodigo(codigo: string): Promise<Norma | null> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('codigo', codigo)
        .single();
      
      if (error) throw error;
      return data;
    },

    // Pesquisa avançada
    async search(filtros: FiltrosNormas): Promise<Norma[]> {
      let query = supabase
        .from('normas')
        .select('*');

      // Aplicar filtros
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.subcategoria) {
        query = query.eq('subcategoria', filtros.subcategoria);
      }
      if (filtros.organismo) {
        query = query.eq('organismo', filtros.organismo);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.prioridade) {
        query = query.eq('prioridade', filtros.prioridade);
      }
      if (filtros.data_inicio) {
        query = query.gte('data_publicacao', filtros.data_inicio);
      }
      if (filtros.data_fim) {
        query = query.lte('data_publicacao', filtros.data_fim);
      }
      if (filtros.texto_livre) {
        query = query.or(`codigo.ilike.%${filtros.texto_livre}%,titulo.ilike.%${filtros.texto_livre}%,descricao.ilike.%${filtros.texto_livre}%`);
      }

      const { data, error } = await query.order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Criar nova norma
    async create(norma: Omit<Norma, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Norma> {
      console.log('API: Criando norma com dados:', norma);
      
      const { data, error } = await supabase
        .from('normas')
        .insert([{
          ...norma,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('API: Erro ao criar norma:', error);
        // Fallback para casos onde o schema ainda não tem todas as colunas opcionais
        // Erro típico: PGRST204 Could not find the 'documentos_anexos' column of 'normas' in the schema cache
        const code = (error as any).code as string | undefined;
        const message = (error as any).message as string | undefined;
        const isMissingColumn = code === 'PGRST204' || (message && /Could not find the .* column of 'normas'/i.test(message));
        if (isMissingColumn) {
          console.warn('API: Tentando criar norma removendo colunas opcionais em falta no schema...');
          const retryData = await this._retryWithoutMissingColumns('insert', {
            ...norma,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }, 'normas');
          return retryData as Norma;
        }
        throw error;
      }
      
      console.log('API: Norma criada com sucesso:', data);
      return data;
    },

    // Atualizar norma
    async update(id: string, updates: Partial<Norma>): Promise<Norma> {
      console.log('API: Atualizando norma com ID:', id, 'dados:', updates);
      
      const { data, error } = await supabase
        .from('normas')
        .update({
          ...updates,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('API: Erro ao atualizar norma:', error);
        const code = (error as any).code as string | undefined;
        const message = (error as any).message as string | undefined;
        const isMissingColumn = code === 'PGRST204' || (message && /Could not find the .* column of 'normas'/i.test(message));
        if (isMissingColumn) {
          console.warn('API: Tentando atualizar norma removendo colunas opcionais em falta no schema...');
          const retryData = await this._retryWithoutMissingColumns('update', {
            ...updates,
            atualizado_em: new Date().toISOString()
          }, 'normas', id);
          return retryData as Norma;
        }
        throw error;
      }
      
      console.log('API: Norma atualizada com sucesso:', data);
      return data;
    },

    // Eliminar norma
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('normas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },

    // Buscar normas por categoria
    async getByCategoria(categoria: CategoriaNorma): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('categoria', categoria)
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar normas por organismo
    async getByOrganismo(organismo: OrganismoNormativo): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('organismo', organismo)
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar normas por status
    async getByStatus(status: StatusNorma): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('status', status)
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar normas por prioridade
    async getByPrioridade(prioridade: PrioridadeNorma): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .eq('prioridade', prioridade)
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar normas recentes
    async getRecentes(limite: number = 10): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .order('data_publicacao', { ascending: false })
        .limit(limite);
      
      if (error) throw error;
      return data || [];
    },

    // Buscar normas por tags
    async getByTags(tags: string[]): Promise<Norma[]> {
      const { data, error } = await supabase
        .from('normas')
        .select('*')
        .overlaps('tags', tags)
        .order('codigo', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  },

  // ===== VERSÕES =====
  versoes: {
    // Buscar versões de uma norma
    async getByNormaId(normaId: string): Promise<VersaoNorma[]> {
      const { data, error } = await supabase
        .from('versoes_normas')
        .select('*')
        .eq('norma_id', normaId)
        .order('versao', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar versão atual de uma norma
    async getVersaoAtual(normaId: string): Promise<VersaoNorma | null> {
      const { data, error } = await supabase
        .from('versoes_normas')
        .select('*')
        .eq('norma_id', normaId)
        .eq('status', 'ATUAL')
        .single();
      
      if (error) throw error;
      return data;
    },

    // Criar nova versão
    async create(versao: Omit<VersaoNorma, 'id' | 'criado_em'>): Promise<VersaoNorma> {
      const { data, error } = await supabase
        .from('versoes_normas')
        .insert([{
          ...versao,
          criado_em: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Atualizar versão
    async update(id: string, updates: Partial<VersaoNorma>): Promise<VersaoNorma> {
      const { data, error } = await supabase
        .from('versoes_normas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // ===== APLICAÇÕES =====
  aplicacoes: {
    // Buscar aplicações de uma norma
    async getByNormaId(normaId: string): Promise<AplicacaoNorma[]> {
      const { data, error } = await supabase
        .from('aplicacoes_normas')
        .select('*')
        .eq('norma_id', normaId)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar aplicações por módulo
    async getByModulo(moduloId: string, moduloTipo: string): Promise<AplicacaoNorma[]> {
      const { data, error } = await supabase
        .from('aplicacoes_normas')
        .select('*')
        .eq('modulo_id', moduloId)
        .eq('modulo_tipo', moduloTipo)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar aplicações por tipo
    async getByTipoAplicacao(tipo: TipoAplicacao): Promise<AplicacaoNorma[]> {
      const { data, error } = await supabase
        .from('aplicacoes_normas')
        .select('*')
        .eq('aplicabilidade', tipo)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Criar aplicação
    async create(aplicacao: Omit<AplicacaoNorma, 'id' | 'criado_em' | 'atualizado_em'>): Promise<AplicacaoNorma> {
      const { data, error } = await supabase
        .from('aplicacoes_normas')
        .insert([{
          ...aplicacao,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Atualizar aplicação
    async update(id: string, updates: Partial<AplicacaoNorma>): Promise<AplicacaoNorma> {
      const { data, error } = await supabase
        .from('aplicacoes_normas')
        .update({
          ...updates,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Eliminar aplicação
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('aplicacoes_normas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // ===== NOTIFICAÇÕES =====
  notificacoes: {
    // Buscar notificações do utilizador
    async getByUser(userId: string): Promise<NotificacaoNorma[]> {
      const { data, error } = await supabase
        .from('notificacoes_normas')
        .select('*')
        .contains('destinatarios', [userId])
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Buscar notificações não lidas
    async getNaoLidas(userId: string): Promise<NotificacaoNorma[]> {
      const { data, error } = await supabase
        .from('notificacoes_normas')
        .select('*')
        .contains('destinatarios', [userId])
        .eq('lida', false)
        .order('data_envio', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Marcar como lida
    async marcarComoLida(id: string, userId: string): Promise<void> {
      const { error } = await supabase
        .from('notificacoes_normas')
        .update({
          lida: true,
          data_leitura: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },

    // Criar notificação
    async create(notificacao: Omit<NotificacaoNorma, 'id' | 'data_envio' | 'lida'>): Promise<NotificacaoNorma> {
      const { data, error } = await supabase
        .from('notificacoes_normas')
        .insert([{
          ...notificacao,
          data_envio: new Date().toISOString(),
          lida: false
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Eliminar notificação
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('notificacoes_normas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // ===== ESTATÍSTICAS =====
  stats: {
    // Buscar estatísticas gerais
    async getEstatisticas(): Promise<EstatisticasNormas> {
      // Buscar dados básicos
      const { data: normas, error: errorNormas } = await supabase
        .from('normas')
        .select('*');
      
      if (errorNormas) throw errorNormas;

      // Buscar aplicações
      const { data: aplicacoes, error: errorAplicacoes } = await supabase
        .from('aplicacoes_normas')
        .select('*');
      
      if (errorAplicacoes) throw errorAplicacoes;

      const normasData = normas || [];
      const aplicacoesData = aplicacoes || [];

      // Calcular estatísticas
      const total_normas = normasData.length;
      const normas_ativas = normasData.filter(n => n.status === 'ATIVA').length;
      const normas_revisao = normasData.filter(n => n.status === 'REVISAO').length;
      const normas_obsoletas = normasData.filter(n => n.status === 'OBSOLETA').length;

      // Distribuição por categorias
      const distribuicao_categorias: Record<string, number> = {};
      normasData.forEach(norma => {
        distribuicao_categorias[norma.categoria] = (distribuicao_categorias[norma.categoria] || 0) + 1;
      });

      // Distribuição por organismos
      const distribuicao_organismos: Record<string, number> = {};
      normasData.forEach(norma => {
        distribuicao_organismos[norma.organismo] = (distribuicao_organismos[norma.organismo] || 0) + 1;
      });

      // Normas recentes (últimos 30 dias)
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
      const normas_recentes = normasData.filter(n => 
        new Date(n.data_publicacao) >= trintaDiasAtras
      ).length;

      // Aplicações por módulo
      const aplicacoes_por_modulo: Record<string, number> = {};
      aplicacoesData.forEach(aplicacao => {
        const chave = `${aplicacao.modulo_tipo}_${aplicacao.modulo_id}`;
        aplicacoes_por_modulo[chave] = (aplicacoes_por_modulo[chave] || 0) + 1;
      });

      return {
        total_normas,
        normas_ativas,
        normas_revisao,
        normas_obsoletas,
        distribuicao_categorias,
        distribuicao_organismos,
        normas_recentes,
        normas_vencendo: 0, // Implementar lógica de vencimento
        aplicacoes_por_modulo
      };
    }
  },

  // ===== EXPORTAÇÃO =====
  export: {
    // Exportar para CSV
    async toCSV(normas: Norma[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Categoria',
        'Subcategoria',
        'Organismo',
        'Versão',
        'Status',
        'Prioridade',
        'Data Publicação',
        'Data Entrada em Vigor'
      ];

      const rows = normas.map(norma => [
        norma.codigo,
        norma.titulo,
        norma.categoria,
        norma.subcategoria,
        norma.organismo,
        norma.versao,
        norma.status,
        norma.prioridade,
        norma.data_publicacao,
        norma.data_entrada_vigor
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    // Exportar para PDF
    async toPDF(normas: Norma[]): Promise<string> {
      // Implementar geração de PDF
      const htmlContent = `
        <html>
          <head>
            <title>Relatório de Normas</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Relatório de Normas</h1>
            <p>Total de normas: ${normas.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Organismo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${normas.map(norma => `
                  <tr>
                    <td>${norma.codigo}</td>
                    <td>${norma.titulo}</td>
                    <td>${norma.categoria}</td>
                    <td>${norma.organismo}</td>
                    <td>${norma.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      return htmlContent;
    }
  }
};
