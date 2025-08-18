import { supabase } from '../supabase';
import type {
  SubmissaoMaterial,
  FiltrosSubmissao,
  EstatisticasSubmissao,
  WorkflowAprovacao,
  EtapaWorkflow,
  HistoricoAprovacao,
  ComentarioSubmissao,
  TipoMaterial,
  CategoriaMaterial,
  EstadoSubmissao,
  PrioridadeSubmissao
} from '../../types/submissaoMateriais';

export const submissaoMateriaisAPI = {
  // ===== SUBMISSÕES =====
  submissoes: {
    async getAll(): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<SubmissaoMaterial | null> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async getByCodigo(codigo: string): Promise<SubmissaoMaterial | null> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('codigo', codigo)
        .single();

      if (error) throw error;
      return data;
    },

    async search(filtros: FiltrosSubmissao): Promise<SubmissaoMaterial[]> {
      let query = supabase
        .from('submissoes_materiais')
        .select('*');

      if (filtros.estado) {
        query = query.eq('estado', filtros.estado);
      }
      if (filtros.tipo_material) {
        query = query.eq('tipo_material', filtros.tipo_material);
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.prioridade) {
        query = query.eq('prioridade', filtros.prioridade);
      }
      if (filtros.submissor_id) {
        query = query.eq('submissor_id', filtros.submissor_id);
      }
      if (filtros.aprovador_id) {
        query = query.eq('aprovador_id', filtros.aprovador_id);
      }
      if (filtros.obra_id) {
        query = query.eq('obra_id', filtros.obra_id);
      }
      if (filtros.data_inicio) {
        query = query.gte('data_submissao', filtros.data_inicio);
      }
      if (filtros.data_fim) {
        query = query.lte('data_submissao', filtros.data_fim);
      }
      if (filtros.tags && filtros.tags.length > 0) {
        query = query.overlaps('tags', filtros.tags);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async create(submissao: Omit<SubmissaoMaterial, 'id' | 'criado_em' | 'atualizado_em'>): Promise<SubmissaoMaterial> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .insert([submissao])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<SubmissaoMaterial>): Promise<SubmissaoMaterial> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('submissoes_materiais')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    async getByEstado(estado: EstadoSubmissao): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('estado', estado)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getByTipoMaterial(tipo: TipoMaterial): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('tipo_material', tipo)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getBySubmissor(submissorId: string): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('submissor_id', submissorId)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getByAprovador(aprovadorId: string): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .eq('aprovador_id', aprovadorId)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getUrgentes(): Promise<SubmissaoMaterial[]> {
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .in('urgencia', ['urgente', 'muito_urgente'])
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getAtrasadas(): Promise<SubmissaoMaterial[]> {
      const hoje = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('submissoes_materiais')
        .select('*')
        .lt('data_limite_aprovacao', hoje)
        .not('estado', 'in', '(aprovado,rejeitado,cancelado,concluido)')
        .order('data_limite_aprovacao', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  },

  // ===== WORKFLOWS =====
  workflows: {
    async getAll(): Promise<WorkflowAprovacao[]> {
      const { data, error } = await supabase
        .from('workflows_aprovacao')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data || [];
    },

    async getById(id: string): Promise<WorkflowAprovacao | null> {
      const { data, error } = await supabase
        .from('workflows_aprovacao')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    async create(workflow: Omit<WorkflowAprovacao, 'id'>): Promise<WorkflowAprovacao> {
      const { data, error } = await supabase
        .from('workflows_aprovacao')
        .insert([workflow])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<WorkflowAprovacao>): Promise<WorkflowAprovacao> {
      const { data, error } = await supabase
        .from('workflows_aprovacao')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('workflows_aprovacao')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  // ===== ETAPAS =====
  etapas: {
    async getByWorkflowId(workflowId: string): Promise<EtapaWorkflow[]> {
      const { data, error } = await supabase
        .from('etapas_workflow')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('ordem');

      if (error) throw error;
      return data || [];
    },

    async create(etapa: Omit<EtapaWorkflow, 'id'>): Promise<EtapaWorkflow> {
      const { data, error } = await supabase
        .from('etapas_workflow')
        .insert([etapa])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<EtapaWorkflow>): Promise<EtapaWorkflow> {
      const { data, error } = await supabase
        .from('etapas_workflow')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // ===== HISTÓRICO =====
  historico: {
    async getBySubmissaoId(submissaoId: string): Promise<HistoricoAprovacao[]> {
      const { data, error } = await supabase
        .from('historico_aprovacoes')
        .select('*')
        .eq('submissao_id', submissaoId)
        .order('data', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async create(historico: Omit<HistoricoAprovacao, 'id'>): Promise<HistoricoAprovacao> {
      const { data, error } = await supabase
        .from('historico_aprovacoes')
        .insert([historico])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // ===== COMENTÁRIOS =====
  comentarios: {
    async getBySubmissaoId(submissaoId: string): Promise<ComentarioSubmissao[]> {
      const { data, error } = await supabase
        .from('comentarios_submissao')
        .select('*')
        .eq('submissao_id', submissaoId)
        .order('data', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async create(comentario: Omit<ComentarioSubmissao, 'id'>): Promise<ComentarioSubmissao> {
      const { data, error } = await supabase
        .from('comentarios_submissao')
        .insert([comentario])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<ComentarioSubmissao>): Promise<ComentarioSubmissao> {
      const { data, error } = await supabase
        .from('comentarios_submissao')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('comentarios_submissao')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  // ===== ESTATÍSTICAS =====
  stats: {
    async getEstatisticas(): Promise<EstatisticasSubmissao> {
      const { data, error } = await supabase
        .rpc('get_submissoes_materiais_stats');

      if (error) throw error;
      return data;
    }
  },

  // ===== EXPORTAÇÃO =====
  export: {
    async toCSV(submissoes: SubmissaoMaterial[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Tipo Material',
        'Categoria',
        'Estado',
        'Prioridade',
        'Submissor',
        'Data Submissão',
        'Aprovador',
        'Data Aprovação',
        'Obra',
        'Impacto Custo',
        'Impacto Prazo'
      ];

      const rows = submissoes.map(s => [
        s.codigo,
        s.titulo,
        s.tipo_material,
        s.categoria,
        s.estado,
        s.prioridade,
        s.submissor_nome,
        s.data_submissao,
        s.aprovador_nome || '',
        s.data_aprovacao || '',
        s.obra_nome || '',
        s.impacto_custo || '',
        s.impacto_prazo || ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    async toPDF(submissoes: SubmissaoMaterial[]): Promise<string> {
      // Implementação básica de PDF
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Relatório de Submissões de Materiais</h1>
            <p>Total de submissões: ${submissoes.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Submissor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                ${submissoes.map(s => `
                  <tr>
                    <td>${s.codigo}</td>
                    <td>${s.titulo}</td>
                    <td>${s.tipo_material}</td>
                    <td>${s.estado}</td>
                    <td>${s.submissor_nome}</td>
                    <td>${s.data_submissao}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      return html;
    }
  }
};
