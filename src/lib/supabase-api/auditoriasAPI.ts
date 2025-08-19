import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { 
  Auditoria, 
  CriterioAuditoria, 
  EvidenciaAuditoria, 
  NaoConformidadeAuditoria, 
  ObservacaoAuditoria, 
  AcaoCorretiva,
  ChecklistAuditoria,
  ProgramaAuditorias,
  RelatorioAuditoria,
  MetricaAuditoria,
  EstatisticasAuditoria,
  FiltrosAuditoria
} from '../../types/auditorias';

export const auditoriasAPI = {
  // ===== AUDITORIAS =====
  async getAuditorias(filtros?: FiltrosAuditoria): Promise<Auditoria[]> {
    try {
      // Mock data para desenvolvimento
      const mockAuditorias: Auditoria[] = [
        {
          id: '1',
          codigo: 'AUD-2024-001',
          tipo: 'interna',
          escopo: 'Auditoria interna do Sistema de Gestão da Qualidade',
          data_inicio: '2024-01-15T09:00:00',
          data_fim: '2024-01-15T17:00:00',
          duracao_horas: 8,
          local: 'Sede da Empresa',
          obra_id: 'obra-1',
          obra_nome: 'Edifício Residencial Torres do Parque',
          auditor_principal: 'João Silva',
          auditores: ['Maria Santos', 'Pedro Costa'],
          observadores: ['Ana Oliveira'],
          status: 'concluida',
          resultado: 'conforme',
          classificacao: 'excelente',
          normas_aplicaveis: ['ISO 9001:2015', 'NP EN ISO 9001:2015'],
          responsavel: 'Carlos Mendes',
          zona: 'Lisboa',
          observacoes: 'Auditoria realizada com sucesso. Todos os critérios avaliados estão conformes.',
          criterios_auditoria: [
            {
              id: 'cr-1',
              codigo: 'CR-001',
              descricao: 'Documentação do SGQ',
              categoria: 'documentacao',
              peso: 1,
              pontuacao_maxima: 10,
              pontuacao_atual: 10,
              conformidade: 'conforme'
            },
            {
              id: 'cr-2',
              codigo: 'CR-002',
              descricao: 'Processos de gestão',
              categoria: 'processos',
              peso: 1,
              pontuacao_maxima: 10,
              pontuacao_atual: 9,
              conformidade: 'conforme'
            }
          ],
          evidencias: [],
          nao_conformidades: [],
          observacoes_auditoria: [],
          acoes_corretivas: [],
          pontuacao_total: 19,
          pontuacao_maxima: 20,
          percentagem_conformidade: 95,
          data_criacao: '2024-01-10T10:00:00',
          data_atualizacao: '2024-01-15T17:00:00'
        },
        {
          id: '2',
          codigo: 'AUD-2024-002',
          tipo: 'externa',
          escopo: 'Auditoria externa de certificação',
          data_inicio: '2024-02-20T09:00:00',
          data_fim: '2024-02-22T17:00:00',
          duracao_horas: 24,
          local: 'Obra - Centro Comercial',
          obra_id: 'obra-2',
          obra_nome: 'Centro Comercial Plaza',
          auditor_principal: 'Dr. António Ferreira',
          auditores: ['Sofia Rodrigues'],
          observadores: [],
          status: 'em_curso',
          resultado: 'pendente',
          classificacao: 'satisfatorio',
          normas_aplicaveis: ['ISO 9001:2015'],
          responsavel: 'Manuel Santos',
          zona: 'Porto',
          observacoes: 'Auditoria em curso. Identificadas algumas não conformidades menores.',
          criterios_auditoria: [
            {
              id: 'cr-3',
              codigo: 'CR-003',
              descricao: 'Gestão de recursos',
              categoria: 'recursos',
              peso: 1,
              pontuacao_maxima: 10,
              pontuacao_atual: 7,
              conformidade: 'parcialmente_conforme'
            }
          ],
          evidencias: [],
          nao_conformidades: [
            {
              id: 'nc-1',
              codigo: 'NC-001',
              descricao: 'Documentação de controlo de qualidade incompleta',
              severidade: 'menor',
              prazo_correcao: '2024-03-20',
              responsavel: 'Equipa de Qualidade',
              status: 'aberta'
            }
          ],
          observacoes_auditoria: [],
          acoes_corretivas: [],
          pontuacao_total: 7,
          pontuacao_maxima: 10,
          percentagem_conformidade: 70,
          data_criacao: '2024-02-15T10:00:00',
          data_atualizacao: '2024-02-20T09:00:00'
        },
        {
          id: '3',
          codigo: 'AUD-2024-003',
          tipo: 'surpresa',
          escopo: 'Auditoria surpresa de segurança',
          data_inicio: '2024-03-10T08:00:00',
          data_fim: '2024-03-10T12:00:00',
          duracao_horas: 4,
          local: 'Obra - Viaduto',
          obra_id: 'obra-3',
          obra_nome: 'Viaduto A1 - Km 45',
          auditor_principal: 'Rui Martins',
          auditores: ['Luís Pereira'],
          observadores: ['Eng.º Responsável'],
          status: 'concluida',
          resultado: 'nao_conforme',
          classificacao: 'critico',
          normas_aplicaveis: ['ISO 45001:2018'],
          responsavel: 'Fernando Costa',
          zona: 'Coimbra',
          observacoes: 'Identificadas várias não conformidades críticas de segurança.',
          criterios_auditoria: [
            {
              id: 'cr-4',
              codigo: 'CR-004',
              descricao: 'Equipamentos de proteção individual',
              categoria: 'recursos',
              peso: 2,
              pontuacao_maxima: 10,
              pontuacao_atual: 3,
              conformidade: 'nao_conforme'
            }
          ],
          evidencias: [],
          nao_conformidades: [
            {
              id: 'nc-2',
              codigo: 'NC-002',
              descricao: 'Falta de equipamentos de proteção individual',
              severidade: 'critica',
              prazo_correcao: '2024-03-11',
              responsavel: 'Chefe de Obra',
              status: 'aberta'
            }
          ],
          observacoes_auditoria: [],
          acoes_corretivas: [],
          pontuacao_total: 3,
          pontuacao_maxima: 10,
          percentagem_conformidade: 30,
          data_criacao: '2024-03-09T10:00:00',
          data_atualizacao: '2024-03-10T12:00:00'
        }
      ];

      // Aplicar filtros aos dados mock
      let filteredData = mockAuditorias;
      
      if (filtros?.tipo) {
        filteredData = filteredData.filter(a => a.tipo === filtros.tipo);
      }
      if (filtros?.status) {
        filteredData = filteredData.filter(a => a.status === filtros.status);
      }
      if (filtros?.resultado) {
        filteredData = filteredData.filter(a => a.resultado === filtros.resultado);
      }
      if (filtros?.obra_id) {
        filteredData = filteredData.filter(a => a.obra_id === filtros.obra_id);
      }

      return filteredData;
    } catch (error) {
      console.error('Erro ao buscar auditorias:', error);
      return [];
    }
  },

  async getAuditoria(id: string): Promise<Auditoria | null> {
    const { data, error } = await supabase
      .from('auditorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createAuditoria(auditoria: Partial<Auditoria>): Promise<Auditoria> {
    try {
      // Mock para criação de auditoria
      const novaAuditoria: Auditoria = {
        id: Date.now().toString(),
        codigo: auditoria.codigo || `AUD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        tipo: auditoria.tipo || 'interna',
        escopo: auditoria.escopo || '',
        data_inicio: auditoria.data_inicio || new Date().toISOString(),
        data_fim: auditoria.data_fim || '',
        duracao_horas: auditoria.duracao_horas || 8,
        local: auditoria.local || '',
        obra_id: auditoria.obra_id || '',
        obra_nome: auditoria.obra_nome || '',
        auditor_principal: auditoria.auditor_principal || '',
        auditores: auditoria.auditores || [],
        observadores: auditoria.observadores || [],
        status: auditoria.status || 'programada',
        resultado: auditoria.resultado || 'pendente',
        classificacao: auditoria.classificacao || 'satisfatorio',
        normas_aplicaveis: auditoria.normas_aplicaveis || [],
        responsavel: auditoria.responsavel || '',
        zona: auditoria.zona || '',
        observacoes: auditoria.observacoes || '',
        criterios_auditoria: auditoria.criterios_auditoria || [],
        evidencias: auditoria.evidencias || [],
        nao_conformidades: auditoria.nao_conformidades || [],
        observacoes_auditoria: auditoria.observacoes_auditoria || [],
        acoes_corretivas: auditoria.acoes_corretivas || [],
        pontuacao_total: auditoria.pontuacao_total || 0,
        pontuacao_maxima: auditoria.pontuacao_maxima || 0,
        percentagem_conformidade: auditoria.percentagem_conformidade || 0,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      toast.success('Auditoria criada com sucesso!');
      return novaAuditoria;
    } catch (error) {
      console.error('Erro ao criar auditoria:', error);
      throw error;
    }
  },

  async updateAuditoria(id: string, updates: Partial<Auditoria>): Promise<Auditoria> {
    try {
      // Mock para atualização de auditoria
      const auditoriaAtualizada: Auditoria = {
        id,
        codigo: updates.codigo || 'AUD-2024-001',
        tipo: updates.tipo || 'interna',
        escopo: updates.escopo || '',
        data_inicio: updates.data_inicio || new Date().toISOString(),
        data_fim: updates.data_fim || '',
        duracao_horas: updates.duracao_horas || 8,
        local: updates.local || '',
        obra_id: updates.obra_id || '',
        obra_nome: updates.obra_nome || '',
        auditor_principal: updates.auditor_principal || '',
        auditores: updates.auditores || [],
        observadores: updates.observadores || [],
        status: updates.status || 'programada',
        resultado: updates.resultado || 'pendente',
        classificacao: updates.classificacao || 'satisfatorio',
        normas_aplicaveis: updates.normas_aplicaveis || [],
        responsavel: updates.responsavel || '',
        zona: updates.zona || '',
        observacoes: updates.observacoes || '',
        criterios_auditoria: updates.criterios_auditoria || [],
        evidencias: updates.evidencias || [],
        nao_conformidades: updates.nao_conformidades || [],
        observacoes_auditoria: updates.observacoes_auditoria || [],
        acoes_corretivas: updates.acoes_corretivas || [],
        pontuacao_total: updates.pontuacao_total || 0,
        pontuacao_maxima: updates.pontuacao_maxima || 0,
        percentagem_conformidade: updates.percentagem_conformidade || 0,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      toast.success('Auditoria atualizada com sucesso!');
      return auditoriaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar auditoria:', error);
      throw error;
    }
  },

  async deleteAuditoria(id: string): Promise<void> {
    const { error } = await supabase
      .from('auditorias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ===== CRITÉRIOS DE AUDITORIA =====
  async getCriteriosAuditoria(auditoriaId: string): Promise<CriterioAuditoria[]> {
    const { data, error } = await supabase
      .from('criterios_auditoria')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('codigo');

    if (error) throw error;
    return data || [];
  },

  async updateCriterioAuditoria(id: string, updates: Partial<CriterioAuditoria>): Promise<CriterioAuditoria> {
    const { data, error } = await supabase
      .from('criterios_auditoria')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== EVIDÊNCIAS =====
  async getEvidencias(auditoriaId: string): Promise<EvidenciaAuditoria[]> {
    const { data, error } = await supabase
      .from('evidencias_auditoria')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('data_captura', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createEvidencia(evidencia: Partial<EvidenciaAuditoria>): Promise<EvidenciaAuditoria> {
    const { data, error } = await supabase
      .from('evidencias_auditoria')
      .insert([evidencia])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvidencia(id: string): Promise<void> {
    const { error } = await supabase
      .from('evidencias_auditoria')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ===== NÃO CONFORMIDADES =====
  async getNaoConformidades(auditoriaId: string): Promise<NaoConformidadeAuditoria[]> {
    const { data, error } = await supabase
      .from('nao_conformidades_auditoria')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('data_criacao', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createNaoConformidade(nc: Partial<NaoConformidadeAuditoria>): Promise<NaoConformidadeAuditoria> {
    const { data, error } = await supabase
      .from('nao_conformidades_auditoria')
      .insert([nc])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNaoConformidade(id: string, updates: Partial<NaoConformidadeAuditoria>): Promise<NaoConformidadeAuditoria> {
    const { data, error } = await supabase
      .from('nao_conformidades_auditoria')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== OBSERVAÇÕES =====
  async getObservacoes(auditoriaId: string): Promise<ObservacaoAuditoria[]> {
    const { data, error } = await supabase
      .from('observacoes_auditoria')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('data', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createObservacao(observacao: Partial<ObservacaoAuditoria>): Promise<ObservacaoAuditoria> {
    const { data, error } = await supabase
      .from('observacoes_auditoria')
      .insert([observacao])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== AÇÕES CORRETIVAS =====
  async getAcoesCorretivas(auditoriaId: string): Promise<AcaoCorretiva[]> {
    const { data, error } = await supabase
      .from('acoes_corretivas')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('prazo');

    if (error) throw error;
    return data || [];
  },

  async createAcaoCorretiva(acao: Partial<AcaoCorretiva>): Promise<AcaoCorretiva> {
    const { data, error } = await supabase
      .from('acoes_corretivas')
      .insert([acao])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAcaoCorretiva(id: string, updates: Partial<AcaoCorretiva>): Promise<AcaoCorretiva> {
    const { data, error } = await supabase
      .from('acoes_corretivas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== CHECKLISTS =====
  async getChecklists(): Promise<ChecklistAuditoria[]> {
    const { data, error } = await supabase
      .from('checklists_auditoria')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  async createChecklist(checklist: Partial<ChecklistAuditoria>): Promise<ChecklistAuditoria> {
    const { data, error } = await supabase
      .from('checklists_auditoria')
      .insert([checklist])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== PROGRAMAS DE AUDITORIA =====
  async getProgramasAuditoria(obraId?: string): Promise<ProgramaAuditorias[]> {
    let query = supabase
      .from('programas_auditorias')
      .select('*')
      .order('ano', { ascending: false });

    if (obraId) {
      query = query.eq('obra_id', obraId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createProgramaAuditoria(programa: Partial<ProgramaAuditorias>): Promise<ProgramaAuditorias> {
    const { data, error } = await supabase
      .from('programas_auditorias')
      .insert([programa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== RELATÓRIOS =====
  async getRelatorios(auditoriaId: string): Promise<RelatorioAuditoria[]> {
    const { data, error } = await supabase
      .from('relatorios_auditoria')
      .select('*')
      .eq('auditoria_id', auditoriaId)
      .order('data_geracao', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createRelatorio(relatorio: Partial<RelatorioAuditoria>): Promise<RelatorioAuditoria> {
    const { data, error } = await supabase
      .from('relatorios_auditoria')
      .insert([relatorio])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ===== ESTATÍSTICAS =====
  async getEstatisticas(): Promise<EstatisticasAuditoria> {
    try {
      // Mock data para estatísticas
      const mockStats: EstatisticasAuditoria = {
        total_auditorias: 3,
        auditorias_este_ano: 3,
        auditorias_este_mes: 1,
        percentagem_conformidade_geral: 65,
        nao_conformidades_abertas: 2,
        acoes_corretivas_pendentes: 1,
        auditorias_por_tipo: [
          { tipo: 'interna', quantidade: 1 },
          { tipo: 'externa', quantidade: 1 },
          { tipo: 'surpresa', quantidade: 1 }
        ],
        conformidade_por_obra: [
          { obra: 'Edifício Residencial Torres do Parque', conformidade: 95 },
          { obra: 'Centro Comercial Plaza', conformidade: 70 },
          { obra: 'Viaduto A1 - Km 45', conformidade: 30 }
        ],
        tendencia_mensal: [
          { mes: 'Jan', auditorias: 1, conformidade: 95 },
          { mes: 'Fev', auditorias: 1, conformidade: 70 },
          { mes: 'Mar', auditorias: 1, conformidade: 30 }
        ]
      };

      return mockStats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total_auditorias: 0,
        auditorias_este_ano: 0,
        auditorias_este_mes: 0,
        percentagem_conformidade_geral: 0,
        nao_conformidades_abertas: 0,
        acoes_corretivas_pendentes: 0,
        auditorias_por_tipo: [],
        conformidade_por_obra: [],
        tendencia_mensal: []
      };
    }
  },
    ) || [];

    const auditoriasEsteMes = auditoriasEsteAno.filter(a => 
      new Date(a.data_criacao).getMonth() + 1 === esteMes
    );

    const auditoriasConformes = auditorias?.filter(a => 
      a.resultado === 'conforme' || a.resultado === 'conforme_com_observacoes'
    ) || [];

    const percentagemConformidade = auditorias && auditorias.length > 0 
      ? Math.round((auditoriasConformes.length / auditorias.length) * 100)
      : 0;

    // Agrupar por tipo
    const auditoriasPorTipo = auditorias?.reduce((acc, a) => {
      acc[a.tipo] = (acc[a.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const auditoriasPorTipoArray = Object.entries(auditoriasPorTipo).map(([tipo, quantidade]) => ({
      tipo,
      quantidade
    }));

    // Conformidade por obra
    const conformidadePorObra = auditorias?.reduce((acc, a) => {
      if (!acc[a.obra_nome]) {
        acc[a.obra_nome] = { total: 0, conformes: 0 };
      }
      acc[a.obra_nome].total++;
      if (a.resultado === 'conforme' || a.resultado === 'conforme_com_observacoes') {
        acc[a.obra_nome].conformes++;
      }
      return acc;
    }, {} as Record<string, { total: number; conformes: number }>) || {};

    const conformidadePorObraArray = Object.entries(conformidadePorObra).map(([obra, stats]) => ({
      obra,
      percentagem: Math.round((stats.conformes / stats.total) * 100)
    }));

    // Próxima auditoria
    const auditoriasProgramadas = auditorias?.filter(a => 
      a.status === 'programada' && new Date(a.data_inicio) > agora
    ).sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

    const proximaAuditoria = auditoriasProgramadas?.[0]?.data_inicio;

    return {
      total_auditorias: auditorias?.length || 0,
      auditorias_este_ano: auditoriasEsteAno.length,
      auditorias_este_mes: auditoriasEsteMes.length,
      percentagem_conformidade_geral: percentagemConformidade,
      nao_conformidades_abertas: ncs?.length || 0,
      acoes_corretivas_pendentes: acoes?.length || 0,
      proxima_auditoria,
      auditorias_por_tipo: auditoriasPorTipoArray,
      conformidade_por_obra: conformidadePorObraArray,
      tendencia_mensal: [] // Implementar se necessário
    };
  },

  // ===== UPLOAD DE FICHEIROS =====
  async uploadEvidencia(file: File, auditoriaId: string, criterioId: string): Promise<string> {
    const fileName = `${auditoriaId}/${criterioId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('evidencias-auditoria')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('evidencias-auditoria')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  // ===== EXPORTAÇÃO =====
  async exportarAuditoria(auditoriaId: string, formato: 'pdf' | 'excel' | 'csv'): Promise<string> {
    try {
      // Mock para exportação
      const mockUrl = `data:application/${formato};base64,${btoa('Mock data for export')}`;
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockUrl;
    } catch (error) {
      console.error('Erro ao exportar auditoria:', error);
      throw error;
    }
  },

  // ===== FUNÇÕES ESPECIAIS =====
  async calcularPontuacaoAuditoria(auditoriaId: string): Promise<{ total: number; maxima: number; percentagem: number }> {
    const criterios = await this.getCriteriosAuditoria(auditoriaId);
    
    const pontuacaoTotal = criterios.reduce((sum, c) => sum + c.pontuacao_atual, 0);
    const pontuacaoMaxima = criterios.reduce((sum, c) => sum + c.pontuacao_maxima, 0);
    const percentagem = pontuacaoMaxima > 0 ? Math.round((pontuacaoTotal / pontuacaoMaxima) * 100) : 0;

    return { total: pontuacaoTotal, maxima: pontuacaoMaxima, percentagem };
  },

  async finalizarAuditoria(auditoriaId: string, resultado: string, classificacao: string): Promise<Auditoria> {
    const pontuacao = await this.calcularPontuacaoAuditoria(auditoriaId);
    
    return await this.updateAuditoria(auditoriaId, {
      status: 'concluida',
      resultado: resultado as any,
      classificacao: classificacao as any,
      pontuacao_total: pontuacao.total,
      pontuacao_maxima: pontuacao.maxima,
      percentagem_conformidade: pontuacao.percentagem,
      data_fim: new Date().toISOString()
    });
  }
};
