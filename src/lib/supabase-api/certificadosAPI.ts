import { supabase } from '../supabase';
import type {
  Certificado,
  Registo,
  TermoCondicoes,
  CabecalhoDocumento,
  Relatorio,
  FiltrosCertificados,
  FiltrosRegistos,
  FiltrosTermos,
  FiltrosRelatorios,
  EstatisticasCertificados,
  EstatisticasRegistos,
  EstatisticasRelatorios
} from '../../types/certificados';

export const certificadosAPI = {
  // ===== CERTIFICADOS =====
  certificados: {
    // Obter todos os certificados
    async getAll(): Promise<Certificado[]> {
      const { data, error } = await supabase
        .from('certificados')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter certificado por ID
    async getById(id: string): Promise<Certificado> {
      const { data, error } = await supabase
        .from('certificados')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    // Criar novo certificado
    async create(certificado: Omit<Certificado, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Certificado> {
      const { data, error } = await supabase
        .from('certificados')
        .insert([certificado])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar certificado
    async update(id: string, certificado: Partial<Certificado>): Promise<Certificado> {
      const { data, error } = await supabase
        .from('certificados')
        .update(certificado)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Eliminar certificado
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('certificados')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Pesquisar certificados
    async search(filtros: FiltrosCertificados): Promise<Certificado[]> {
      let query = supabase
        .from('certificados')
        .select('*');

      if (filtros.tipo_certificado) {
        query = query.eq('tipo_certificado', filtros.tipo_certificado);
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.entidade_certificadora) {
        query = query.ilike('entidade_certificadora', `%${filtros.entidade_certificadora}%`);
      }
      if (filtros.data_emissao_inicio) {
        query = query.gte('data_emissao', filtros.data_emissao_inicio);
      }
      if (filtros.data_emissao_fim) {
        query = query.lte('data_emissao', filtros.data_emissao_fim);
      }
      if (filtros.data_validade_inicio) {
        query = query.gte('data_validade', filtros.data_validade_inicio);
      }
      if (filtros.data_validade_fim) {
        query = query.lte('data_validade', filtros.data_validade_fim);
      }
      if (filtros.responsavel_id) {
        query = query.eq('responsavel_id', filtros.responsavel_id);
      }
      if (filtros.obra_id) {
        query = query.eq('obra_id', filtros.obra_id);
      }
      if (filtros.fornecedor_id) {
        query = query.eq('fornecedor_id', filtros.fornecedor_id);
      }
      if (filtros.texto_livre) {
        query = query.or(`titulo.ilike.%${filtros.texto_livre}%,descricao.ilike.%${filtros.texto_livre}%,codigo.ilike.%${filtros.texto_livre}%`);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter certificados próximos da expiração
    async getProximosExpiracao(dias: number = 30): Promise<Certificado[]> {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + dias);

      const { data, error } = await supabase
        .from('certificados')
        .select('*')
        .lte('data_validade', dataLimite.toISOString().split('T')[0])
        .eq('status', 'ativo')
        .order('data_validade', { ascending: true });

      if (error) throw error;
      return data || [];
    },

    // Obter certificados expirados
    async getExpirados(): Promise<Certificado[]> {
      const { data, error } = await supabase
        .from('certificados')
        .select('*')
        .lt('data_validade', new Date().toISOString().split('T')[0])
        .eq('status', 'ativo')
        .order('data_validade', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  },

  // ===== REGISTOS =====
  registos: {
    // Obter todos os registos
    async getAll(): Promise<Registo[]> {
      const { data, error } = await supabase
        .from('registos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter registo por ID
    async getById(id: string): Promise<Registo> {
      const { data, error } = await supabase
        .from('registos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    // Criar novo registo
    async create(registro: Omit<Registo, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Registo> {
      const { data, error } = await supabase
        .from('registos')
        .insert([registro])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar registo
    async update(id: string, registro: Partial<Registo>): Promise<Registo> {
      const { data, error } = await supabase
        .from('registos')
        .update(registro)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Eliminar registo
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('registos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Pesquisar registos
    async search(filtros: FiltrosRegistos): Promise<Registo[]> {
      let query = supabase
        .from('registos')
        .select('*');

      if (filtros.tipo_registo) {
        query = query.eq('tipo_registo', filtros.tipo_registo);
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.prioridade) {
        query = query.eq('prioridade', filtros.prioridade);
      }
      if (filtros.data_registo_inicio) {
        query = query.gte('data_registo', filtros.data_registo_inicio);
      }
      if (filtros.data_registo_fim) {
        query = query.lte('data_registo', filtros.data_registo_fim);
      }
      if (filtros.registador_id) {
        query = query.eq('registador_id', filtros.registador_id);
      }
      if (filtros.responsavel_id) {
        query = query.eq('responsavel_id', filtros.responsavel_id);
      }
      if (filtros.certificado_id) {
        query = query.eq('certificado_id', filtros.certificado_id);
      }
      if (filtros.obra_id) {
        query = query.eq('obra_id', filtros.obra_id);
      }
      if (filtros.texto_livre) {
        query = query.or(`titulo.ilike.%${filtros.texto_livre}%,descricao.ilike.%${filtros.texto_livre}%,codigo.ilike.%${filtros.texto_livre}%`);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter registos por certificado
    async getByCertificado(certificadoId: string): Promise<Registo[]> {
      const { data, error } = await supabase
        .from('registos')
        .select('*')
        .eq('certificado_id', certificadoId)
        .order('data_registo', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  },

  // ===== TERMOS E CONDIÇÕES =====
  termos: {
    // Obter todos os termos
    async getAll(): Promise<TermoCondicoes[]> {
      const { data, error } = await supabase
        .from('termos_condicoes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter termo por ID
    async getById(id: string): Promise<TermoCondicoes> {
      const { data, error } = await supabase
        .from('termos_condicoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    // Criar novo termo
    async create(termo: Omit<TermoCondicoes, 'id' | 'criado_em' | 'atualizado_em'>): Promise<TermoCondicoes> {
      const { data, error } = await supabase
        .from('termos_condicoes')
        .insert([termo])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar termo
    async update(id: string, termo: Partial<TermoCondicoes>): Promise<TermoCondicoes> {
      const { data, error } = await supabase
        .from('termos_condicoes')
        .update(termo)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Eliminar termo
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('termos_condicoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Pesquisar termos
    async search(filtros: FiltrosTermos): Promise<TermoCondicoes[]> {
      let query = supabase
        .from('termos_condicoes')
        .select('*');

      if (filtros.tipo_termo) {
        query = query.eq('tipo_termo', filtros.tipo_termo);
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.data_emissao_inicio) {
        query = query.gte('data_emissao', filtros.data_emissao_inicio);
      }
      if (filtros.data_emissao_fim) {
        query = query.lte('data_emissao', filtros.data_emissao_fim);
      }
      if (filtros.parte_1_nome) {
        query = query.ilike('parte_1_nome', `%${filtros.parte_1_nome}%`);
      }
      if (filtros.parte_2_nome) {
        query = query.ilike('parte_2_nome', `%${filtros.parte_2_nome}%`);
      }
      if (filtros.certificado_id) {
        query = query.eq('certificado_id', filtros.certificado_id);
      }
      if (filtros.obra_id) {
        query = query.eq('obra_id', filtros.obra_id);
      }
      if (filtros.texto_livre) {
        query = query.or(`titulo.ilike.%${filtros.texto_livre}%,descricao.ilike.%${filtros.texto_livre}%,codigo.ilike.%${filtros.texto_livre}%`);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  },

  // ===== CABEÇALHOS DE DOCUMENTOS =====
  cabecalhos: {
    // Obter todos os cabeçalhos
    async getAll(): Promise<CabecalhoDocumento[]> {
      const { data, error } = await supabase
        .from('cabecalhos_documentos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter cabeçalho por ID
    async getById(id: string): Promise<CabecalhoDocumento> {
      const { data, error } = await supabase
        .from('cabecalhos_documentos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    // Criar novo cabeçalho
    async create(cabecalho: Omit<CabecalhoDocumento, 'id' | 'criado_em' | 'atualizado_em'>): Promise<CabecalhoDocumento> {
      const { data, error } = await supabase
        .from('cabecalhos_documentos')
        .insert([cabecalho])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar cabeçalho
    async update(id: string, cabecalho: Partial<CabecalhoDocumento>): Promise<CabecalhoDocumento> {
      const { data, error } = await supabase
        .from('cabecalhos_documentos')
        .update(cabecalho)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Eliminar cabeçalho
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('cabecalhos_documentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Obter cabeçalho padrão
    async getPadrao(): Promise<CabecalhoDocumento | null> {
      const { data, error } = await supabase
        .from('cabecalhos_documentos')
        .select('*')
        .eq('padrao', true)
        .eq('ativo', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    }
  },

  // ===== RELATÓRIOS =====
  relatorios: {
    // Obter todos os relatórios
    async getAll(): Promise<Relatorio[]> {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    // Obter relatório por ID
    async getById(id: string): Promise<Relatorio> {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },

    // Criar novo relatório
    async create(relatorio: Omit<Relatorio, 'id' | 'criado_em' | 'atualizado_em'>): Promise<Relatorio> {
      const { data, error } = await supabase
        .from('relatorios')
        .insert([relatorio])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar relatório
    async update(id: string, relatorio: Partial<Relatorio>): Promise<Relatorio> {
      const { data, error } = await supabase
        .from('relatorios')
        .update(relatorio)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Eliminar relatório
    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('relatorios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    // Pesquisar relatórios
    async search(filtros: FiltrosRelatorios): Promise<Relatorio[]> {
      let query = supabase
        .from('relatorios')
        .select('*');

      if (filtros.tipo_relatorio) {
        query = query.eq('tipo_relatorio', filtros.tipo_relatorio);
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros.data_relatorio_inicio) {
        query = query.gte('data_relatorio', filtros.data_relatorio_inicio);
      }
      if (filtros.data_relatorio_fim) {
        query = query.lte('data_relatorio', filtros.data_relatorio_fim);
      }
      if (filtros.autor_id) {
        query = query.eq('autor_id', filtros.autor_id);
      }
      if (filtros.aprovador_id) {
        query = query.eq('aprovador_id', filtros.aprovador_id);
      }
      if (filtros.certificado_id) {
        query = query.eq('certificado_id', filtros.certificado_id);
      }
      if (filtros.registro_id) {
        query = query.eq('registro_id', filtros.registro_id);
      }
      if (filtros.obra_id) {
        query = query.eq('obra_id', filtros.obra_id);
      }
      if (filtros.texto_livre) {
        query = query.or(`titulo.ilike.%${filtros.texto_livre}%,descricao.ilike.%${filtros.texto_livre}%,codigo.ilike.%${filtros.texto_livre}%`);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  },

  // ===== ESTATÍSTICAS =====
  stats: {
    // Obter estatísticas de certificados
    async getCertificadosStats(): Promise<EstatisticasCertificados> {
      const { data, error } = await supabase.rpc('get_certificados_stats');
      
      if (error) throw error;
      return data;
    },

    // Obter estatísticas de registos
    async getRegistosStats(): Promise<EstatisticasRegistos> {
      const { data, error } = await supabase.rpc('get_registos_stats');
      
      if (error) throw error;
      return data;
    },

    // Obter estatísticas de relatórios
    async getRelatoriosStats(): Promise<EstatisticasRelatorios> {
      const { data, error } = await supabase.rpc('get_relatorios_stats');
      
      if (error) throw error;
      return data;
    }
  },

  // ===== EXPORTAÇÃO =====
  export: {
    // Exportar certificados para CSV
    async certificadosToCSV(certificados: Certificado[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Tipo',
        'Categoria',
        'Entidade Certificadora',
        'Data Emissão',
        'Data Validade',
        'Status',
        'Responsável',
        'Custo Emissão',
        'Custo Manutenção',
        'Custo Renovação',
        'Moeda'
      ];

      const rows = certificados.map(cert => [
        cert.codigo,
        cert.titulo,
        cert.tipo_certificado,
        cert.categoria,
        cert.entidade_certificadora,
        cert.data_emissao,
        cert.data_validade,
        cert.status,
        cert.responsavel_nome,
        cert.custo_emissao || '',
        cert.custo_manutencao || '',
        cert.custo_renovacao || '',
        cert.moeda
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    // Exportar registos para CSV
    async registosToCSV(registos: Registo[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Tipo',
        'Categoria',
        'Data Registo',
        'Status',
        'Prioridade',
        'Registador',
        'Responsável',
        'Resultado',
        'Conclusão'
      ];

      const rows = registos.map(reg => [
        reg.codigo,
        reg.titulo,
        reg.tipo_registo,
        reg.categoria,
        reg.data_registo,
        reg.status,
        reg.prioridade,
        reg.registador_nome,
        reg.responsavel_nome || '',
        reg.resultado || '',
        reg.conclusao || ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    // Exportar termos para CSV
    async termosToCSV(termos: TermoCondicoes[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Tipo',
        'Categoria',
        'Versão',
        'Data Emissão',
        'Data Validade',
        'Status',
        'Parte 1',
        'Parte 2',
        'Valor Contrato',
        'Moeda',
        'Prazo Execução'
      ];

      const rows = termos.map(termo => [
        termo.codigo,
        termo.titulo,
        termo.tipo_termo,
        termo.categoria,
        termo.versao,
        termo.data_emissao,
        termo.data_validade || '',
        termo.status,
        termo.parte_1_nome,
        termo.parte_2_nome || '',
        termo.valor_contrato || '',
        termo.moeda,
        termo.prazo_execucao || ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    // Exportar relatórios para CSV
    async relatoriosToCSV(relatorios: Relatorio[]): Promise<string> {
      const headers = [
        'Código',
        'Título',
        'Tipo',
        'Categoria',
        'Data Relatório',
        'Status',
        'Autor',
        'Revisor',
        'Aprovador',
        'Data Aprovação',
        'Data Publicação'
      ];

      const rows = relatorios.map(rel => [
        rel.codigo,
        rel.titulo,
        rel.tipo_relatorio,
        rel.categoria,
        rel.data_relatorio,
        rel.status,
        rel.autor_nome,
        rel.revisor_nome || '',
        rel.aprovador_nome || '',
        rel.data_aprovacao || '',
        rel.data_publicacao || ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      return csvContent;
    },

    // Gerar relatório PDF
    async generatePDF(relatorio: Relatorio, cabecalho?: CabecalhoDocumento): Promise<string> {
      // Aqui implementaria a geração de PDF usando uma biblioteca como jsPDF
      // Por agora, retorna um HTML básico
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${relatorio.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { font-size: 16px; color: #666; }
            .section { margin: 20px 0; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .content { line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${relatorio.titulo}</div>
            <div class="subtitle">Código: ${relatorio.codigo} | Data: ${relatorio.data_relatorio}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Resumo Executivo</div>
            <div class="content">${relatorio.resumo_executivo || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Introdução</div>
            <div class="content">${relatorio.introducao || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Metodologia</div>
            <div class="content">${relatorio.metodologia || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Resultados</div>
            <div class="content">${relatorio.resultados || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Conclusões</div>
            <div class="content">${relatorio.conclusoes || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Recomendações</div>
            <div class="content">
              ${relatorio.recomendacoes.length > 0 
                ? `<ul>${relatorio.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}</ul>`
                : 'N/A'
              }
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Ações Necessárias</div>
            <div class="content">
              ${relatorio.acoes_necessarias.length > 0 
                ? `<ul>${relatorio.acoes_necessarias.map(acao => `<li>${acao}</li>`).join('')}</ul>`
                : 'N/A'
              }
            </div>
          </div>
        </body>
        </html>
      `;

      return html;
    }
  },

  // Função para obter o ID do usuário atual
  async getCurrentUserId(): Promise<string | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
    return user?.id || null;
  }
};
