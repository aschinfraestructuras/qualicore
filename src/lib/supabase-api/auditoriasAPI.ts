import { supabase } from '../supabase';
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
    let query = supabase
      .from('auditorias')
      .select('*')
      .order('data_criacao', { ascending: false });

    if (filtros) {
      if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
      if (filtros.status) query = query.eq('status', filtros.status);
      if (filtros.resultado) query = query.eq('resultado', filtros.resultado);
      if (filtros.obra_id) query = query.eq('obra_id', filtros.obra_id);
      if (filtros.auditor_principal) query = query.eq('auditor_principal', filtros.auditor_principal);
      if (filtros.classificacao) query = query.eq('classificacao', filtros.classificacao);
      if (filtros.data_inicio) query = query.gte('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) query = query.lte('data_fim', filtros.data_fim);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from('auditorias')
      .insert([auditoria])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAuditoria(id: string, updates: Partial<Auditoria>): Promise<Auditoria> {
    const { data, error } = await supabase
      .from('auditorias')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
    const { data: auditorias, error: error1 } = await supabase
      .from('auditorias')
      .select('*');

    if (error1) throw error1;

    const { data: ncs, error: error2 } = await supabase
      .from('nao_conformidades_auditoria')
      .select('*')
      .eq('status', 'aberta');

    if (error2) throw error2;

    const { data: acoes, error: error3 } = await supabase
      .from('acoes_corretivas')
      .select('*')
      .eq('status', 'pendente');

    if (error3) throw error3;

    const agora = new Date();
    const esteAno = agora.getFullYear();
    const esteMes = agora.getMonth() + 1;

    const auditoriasEsteAno = auditorias?.filter(a => 
      new Date(a.data_criacao).getFullYear() === esteAno
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
    // Implementar lógica de exportação
    const auditoria = await this.getAuditoria(auditoriaId);
    const criterios = await this.getCriteriosAuditoria(auditoriaId);
    const evidencias = await this.getEvidencias(auditoriaId);
    const naoConformidades = await this.getNaoConformidades(auditoriaId);
    const observacoes = await this.getObservacoes(auditoriaId);
    const acoesCorretivas = await this.getAcoesCorretivas(auditoriaId);

    // Aqui implementarias a lógica de geração do ficheiro
    // Por agora, retornamos um URL simulado
    return `https://api.qualicore.com/export/auditoria/${auditoriaId}.${formato}`;
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
