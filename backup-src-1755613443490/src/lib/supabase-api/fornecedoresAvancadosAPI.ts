import { supabase } from '../supabase';
import { 
  FornecedorAvancado, 
  AvaliacaoFornecedor, 
  CertificacaoFornecedor, 
  HistoricoPagamento,
  CriterioAvaliacao,
  PlanoAvaliacao 
} from '../../types/fornecedores';

export const fornecedoresAvancadosAPI = {
  // ===== FORNECEDORES AVANÇADOS =====
  
  async getFornecedoresAvancados(): Promise<FornecedorAvancado[]> {
    const { data, error } = await supabase
      .from('fornecedores_avancados')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  async getFornecedorAvancado(id: string): Promise<FornecedorAvancado | null> {
    const { data, error } = await supabase
      .from('fornecedores_avancados')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createFornecedorAvancado(fornecedor: Partial<FornecedorAvancado>): Promise<FornecedorAvancado> {
    const { data, error } = await supabase
      .from('fornecedores_avancados')
      .insert([{
        ...fornecedor,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateFornecedorAvancado(id: string, updates: Partial<FornecedorAvancado>): Promise<FornecedorAvancado> {
    const { data, error } = await supabase
      .from('fornecedores_avancados')
      .update({
        ...updates,
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFornecedorAvancado(id: string): Promise<void> {
    const { error } = await supabase
      .from('fornecedores_avancados')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // ===== AVALIAÇÕES DE FORNECEDORES =====

  async getAvaliacoesFornecedor(fornecedorId: string): Promise<AvaliacaoFornecedor[]> {
    const { data, error } = await supabase
      .from('avaliacoes_fornecedores')
      .select('*')
      .eq('fornecedor_id', fornecedorId)
      .order('data_avaliacao', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createAvaliacaoFornecedor(avaliacao: Partial<AvaliacaoFornecedor>): Promise<AvaliacaoFornecedor> {
    const { data, error } = await supabase
      .from('avaliacoes_fornecedores')
      .insert([{
        ...avaliacao,
        data_criacao: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAvaliacaoFornecedor(id: string, updates: Partial<AvaliacaoFornecedor>): Promise<AvaliacaoFornecedor> {
    const { data, error } = await supabase
      .from('avaliacoes_fornecedores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAvaliacaoFornecedor(id: string): Promise<void> {
    const { error } = await supabase
      .from('avaliacoes_fornecedores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // ===== CERTIFICAÇÕES DE FORNECEDORES =====

  async getCertificacoesFornecedor(fornecedorId: string): Promise<CertificacaoFornecedor[]> {
    const { data, error } = await supabase
      .from('certificacoes_fornecedores')
      .select('*')
      .eq('fornecedor_id', fornecedorId)
      .order('data_validade');
    
    if (error) throw error;
    return data || [];
  },

  async createCertificacaoFornecedor(certificacao: Partial<CertificacaoFornecedor>): Promise<CertificacaoFornecedor> {
    const { data, error } = await supabase
      .from('certificacoes_fornecedores')
      .insert([certificacao])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCertificacaoFornecedor(id: string, updates: Partial<CertificacaoFornecedor>): Promise<CertificacaoFornecedor> {
    const { data, error } = await supabase
      .from('certificacoes_fornecedores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCertificacaoFornecedor(id: string): Promise<void> {
    const { error } = await supabase
      .from('certificacoes_fornecedores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // ===== HISTÓRICO DE PAGAMENTOS =====

  async getHistoricoPagamentos(fornecedorId: string): Promise<HistoricoPagamento[]> {
    const { data, error } = await supabase
      .from('historico_pagamentos')
      .select('*')
      .eq('fornecedor_id', fornecedorId)
      .order('data_vencimento', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createHistoricoPagamento(pagamento: Partial<HistoricoPagamento>): Promise<HistoricoPagamento> {
    const { data, error } = await supabase
      .from('historico_pagamentos')
      .insert([pagamento])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // ===== CRITÉRIOS DE AVALIAÇÃO =====

  async getCriteriosAvaliacao(): Promise<CriterioAvaliacao[]> {
    const { data, error } = await supabase
      .from('criterios_avaliacao')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  async createCriterioAvaliacao(criterio: Partial<CriterioAvaliacao>): Promise<CriterioAvaliacao> {
    const { data, error } = await supabase
      .from('criterios_avaliacao')
      .insert([criterio])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // ===== PLANOS DE AVALIAÇÃO =====

  async getPlanosAvaliacao(): Promise<PlanoAvaliacao[]> {
    const { data, error } = await supabase
      .from('planos_avaliacao')
      .select('*')
      .order('data_inicio', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createPlanoAvaliacao(plano: Partial<PlanoAvaliacao>): Promise<PlanoAvaliacao> {
    const { data, error } = await supabase
      .from('planos_avaliacao')
      .insert([plano])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // ===== RELATÓRIOS E ESTATÍSTICAS =====

  async getEstatisticasFornecedores() {
    const { data: fornecedores, error } = await supabase
      .from('fornecedores_avancados')
      .select('status_qualificacao, classificacao_geral');
    
    if (error) throw error;

    const stats = {
      total: fornecedores?.length || 0,
      qualificados: fornecedores?.filter(f => f.status_qualificacao === 'qualificado').length || 0,
      pendentes: fornecedores?.filter(f => f.status_qualificacao === 'pendente').length || 0,
      suspensos: fornecedores?.filter(f => f.status_qualificacao === 'suspenso').length || 0,
      mediaClassificacao: fornecedores?.reduce((acc, f) => acc + (f.classificacao_geral || 0), 0) / (fornecedores?.length || 1) || 0
    };

    return stats;
  },

  async getFornecedoresComAvaliacoesVencidas(): Promise<FornecedorAvancado[]> {
    const hoje = new Date();
    const { data, error } = await supabase
      .from('fornecedores_avancados')
      .select('*')
      .lt('data_reavaliacao', hoje.toISOString())
      .order('data_reavaliacao');
    
    if (error) throw error;
    return data || [];
  },

  async getCertificacoesAVencer(dias: number = 30): Promise<CertificacaoFornecedor[]> {
    const hoje = new Date();
    const dataLimite = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
    
    const { data, error } = await supabase
      .from('certificacoes_fornecedores')
      .select('*')
      .lt('data_validade', dataLimite.toISOString())
      .gte('data_validade', hoje.toISOString())
      .order('data_validade');
    
    if (error) throw error;
    return data || [];
  }
};
