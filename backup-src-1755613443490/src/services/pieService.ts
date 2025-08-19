import { supabase } from '../lib/supabase';

// Tipos para o sistema PIE
export interface PIEModelo {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: 'CCG' | 'CCE' | 'CCM' | 'custom';
  versao: string;
  ativo: boolean;
  tags?: string[];
  metadata?: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PIESecao {
  id: string;
  modelo_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  ordem: number;
  obrigatorio: boolean;
  ativo: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PIEPonto {
  id: string;
  secao_id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  tipo: 'checkbox' | 'radio' | 'text' | 'number' | 'select' | 'file' | 'date';
  obrigatorio: boolean;
  ordem: number;
  opcoes?: any;
  validacao?: any;
  dependencias?: any;
  ativo: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PIEInstancia {
  id: string;
  codigo: string;
  modelo_id?: string;
  obra_id?: string;
  titulo: string;
  descricao?: string;
  status: 'rascunho' | 'em_andamento' | 'concluido' | 'aprovado' | 'reprovado';
  prioridade: 'baixa' | 'media' | 'normal' | 'alta' | 'urgente';
  data_planeada?: string;
  data_inicio?: string;
  data_conclusao?: string;
  responsavel?: string;
  zona?: string;
  observacoes?: string;
  metadata?: any;
  user_id: string;
  created_at: string;
  updated_at: string;
  ppi_modelos?: { nome: string; categoria: string };
  obras?: { nome: string };
}

export interface PIEResposta {
  id: string;
  instancia_id: string;
  ponto_id: string;
  valor?: string;
  valor_numerico?: number;
  valor_booleano?: boolean;
  valor_data?: string;
  valor_json?: any;
  arquivos?: string[];
  observacoes?: string;
  conforme?: boolean;
  responsavel?: string;
  data_resposta: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PIEHistorico {
  id: string;
  instancia_id: string;
  acao: string;
  tabela_afetada?: string;
  registro_id?: string;
  dados_anteriores?: any;
  dados_novos?: any;
  usuario_id?: string;
  observacoes?: string;
  created_at: string;
}

// Serviço PIE
export class PIEService {
  // =====================================================
  // MODELOS PIE
  // =====================================================

  static async getModelos(): Promise<PIEModelo[]> {
    const { data, error } = await supabase
      .from('ppi_modelos')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getModelo(id: string): Promise<PIEModelo | null> {
    const { data, error } = await supabase
      .from('ppi_modelos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createModelo(modelo: Omit<PIEModelo, 'id' | 'created_at' | 'updated_at'>): Promise<PIEModelo> {
    const { data, error } = await supabase
      .from('ppi_modelos')
      .insert(modelo)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateModelo(id: string, updates: Partial<PIEModelo>): Promise<PIEModelo> {
    const { data, error } = await supabase
      .from('ppi_modelos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteModelo(id: string): Promise<void> {
    const { error } = await supabase
      .from('ppi_modelos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // SEÇÕES PIE
  // =====================================================

  static async getSecoes(modeloId: string): Promise<PIESecao[]> {
    const { data, error } = await supabase
      .from('ppi_secoes')
      .select('*')
      .eq('modelo_id', modeloId)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createSecao(secao: Omit<PIESecao, 'id' | 'created_at' | 'updated_at'>): Promise<PIESecao> {
    const { data, error } = await supabase
      .from('ppi_secoes')
      .insert(secao)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSecao(id: string, updates: Partial<PIESecao>): Promise<PIESecao> {
    const { data, error } = await supabase
      .from('ppi_secoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSecao(id: string): Promise<void> {
    const { error } = await supabase
      .from('ppi_secoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // PONTOS PIE
  // =====================================================

  static async getPontos(secaoId: string): Promise<PIEPonto[]> {
    const { data, error } = await supabase
      .from('ppi_pontos')
      .select('*')
      .eq('secao_id', secaoId)
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createPonto(ponto: Omit<PIEPonto, 'id' | 'created_at' | 'updated_at'>): Promise<PIEPonto> {
    const { data, error } = await supabase
      .from('ppi_pontos')
      .insert(ponto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePonto(id: string, updates: Partial<PIEPonto>): Promise<PIEPonto> {
    const { data, error } = await supabase
      .from('ppi_pontos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePonto(id: string): Promise<void> {
    const { error } = await supabase
      .from('ppi_pontos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // INSTÂNCIAS PIE
  // =====================================================

  static async getInstancias(): Promise<PIEInstancia[]> {
    const { data, error } = await supabase
      .from('ppi_instancias')
      .select(`
        *,
        ppi_modelos(nome, categoria),
        obras(nome)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInstancia(id: string): Promise<PIEInstancia | null> {
    const { data, error } = await supabase
      .from('ppi_instancias')
      .select(`
        *,
        ppi_modelos(nome, categoria),
        obras(nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createInstancia(instancia: Omit<PIEInstancia, 'id' | 'created_at' | 'updated_at'>): Promise<PIEInstancia> {
    const { data, error } = await supabase
      .from('ppi_instancias')
      .insert(instancia)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateInstancia(id: string, updates: Partial<PIEInstancia>): Promise<PIEInstancia> {
    const { data, error } = await supabase
      .from('ppi_instancias')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteInstancia(id: string): Promise<void> {
    const { error } = await supabase
      .from('ppi_instancias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // RESPOSTAS PIE
  // =====================================================

  static async getRespostas(instanciaId: string): Promise<PIEResposta[]> {
    const { data, error } = await supabase
      .from('ppi_respostas')
      .select(`
        *,
        ppi_pontos(titulo, tipo, obrigatorio)
      `)
      .eq('instancia_id', instanciaId);

    if (error) throw error;
    return data || [];
  }

  static async createResposta(resposta: Omit<PIEResposta, 'id' | 'created_at' | 'updated_at'>): Promise<PIEResposta> {
    const { data, error } = await supabase
      .from('ppi_respostas')
      .insert(resposta)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateResposta(id: string, updates: Partial<PIEResposta>): Promise<PIEResposta> {
    const { data, error } = await supabase
      .from('ppi_respostas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteResposta(id: string): Promise<void> {
    const { error } = await supabase
      .from('ppi_respostas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // HISTÓRICO PIE
  // =====================================================

  static async getHistorico(instanciaId: string): Promise<PIEHistorico[]> {
    const { data, error } = await supabase
      .from('ppi_historico')
      .select('*')
      .eq('instancia_id', instanciaId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // =====================================================
  // FUNÇÕES AUXILIARES
  // =====================================================

  static async gerarCodigoPIE(tipo: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('gerar_codigo_ppi', { tipo });

    if (error) throw error;
    return data;
  }

  static async uploadArquivo(file: File, instanciaId: string): Promise<string> {
    const fileName = `${instanciaId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('pie-arquivos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('pie-arquivos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  static async deleteArquivo(url: string): Promise<void> {
    const path = url.split('/').pop();
    if (!path) return;

    const { error } = await supabase.storage
      .from('pie-arquivos')
      .remove([path]);

    if (error) throw error;
  }

  // =====================================================
  // ESTATÍSTICAS E RELATÓRIOS
  // =====================================================

  static async getEstatisticas(): Promise<any> {
    const { data, error } = await supabase
      .rpc('get_estatisticas_pie');

    if (error) throw error;
    return data;
  }

  static async exportarPDF(instanciaId: string): Promise<string> {
    const { data, error } = await supabase
      .rpc('exportar_pie_pdf', { instancia_id: instanciaId });

    if (error) throw error;
    return data;
  }
}

export default PIEService; 