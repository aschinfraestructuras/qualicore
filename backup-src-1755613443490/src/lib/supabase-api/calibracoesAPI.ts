import { supabase } from '../supabase';
import {
  Equipamento,
  Calibracao,
  Manutencao,
  Inspecao,
  PontoCalibracao,
  CriterioInspecao,
  CalibracoesStats,
  FiltrosEquipamento,
  FiltrosCalibracao,
  FiltrosManutencao,
  FiltrosInspecao
} from '@/types/calibracoes';

// ===== EQUIPAMENTOS =====

export const getEquipamentos = async (filtros?: FiltrosEquipamento): Promise<Equipamento[]> => {
  let query = supabase
    .from('equipamentos')
    .select(`
      *,
      fotos: fotos_equipamentos(*),
      documentos: documentos_equipamentos(*)
    `)
    .order('created_at', { ascending: false });

  if (filtros) {
    if (filtros.codigo) query = query.ilike('codigo', `%${filtros.codigo}%`);
    if (filtros.nome) query = query.ilike('nome', `%${filtros.nome}%`);
    if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
    if (filtros.categoria) query = query.eq('categoria', filtros.categoria);
    if (filtros.estado) query = query.eq('estado', filtros.estado);
    if (filtros.status_operacional) query = query.eq('status_operacional', filtros.status_operacional);
    if (filtros.departamento) query = query.ilike('departamento', `%${filtros.departamento}%`);
    if (filtros.responsavel) query = query.ilike('responsavel', `%${filtros.responsavel}%`);
    if (filtros.fabricante) query = query.ilike('fabricante', `%${filtros.fabricante}%`);
    if (filtros.data_aquisicao_inicio) query = query.gte('data_aquisicao', filtros.data_aquisicao_inicio);
    if (filtros.data_aquisicao_fim) query = query.lte('data_aquisicao', filtros.data_aquisicao_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw error;
  }

  return data || [];
};

export const getEquipamento = async (id: string): Promise<Equipamento | null> => {
  const { data, error } = await supabase
    .from('equipamentos')
    .select(`
      *,
      fotos: fotos_equipamentos(*),
      documentos: documentos_equipamentos(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar equipamento:', error);
    throw error;
  }

  return data;
};

export const createEquipamento = async (equipamento: Omit<Equipamento, 'id' | 'created_at' | 'updated_at'>): Promise<Equipamento> => {
  const { data, error } = await supabase
    .from('equipamentos')
    .insert(equipamento)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar equipamento:', error);
    throw error;
  }

  return data;
};

export const updateEquipamento = async (id: string, equipamento: Partial<Equipamento>): Promise<Equipamento> => {
  const { data, error } = await supabase
    .from('equipamentos')
    .update(equipamento)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar equipamento:', error);
    throw error;
  }

  return data;
};

export const deleteEquipamento = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('equipamentos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar equipamento:', error);
    throw error;
  }
};

// ===== CALIBRAÇÕES =====

export const getCalibracoes = async (filtros?: FiltrosCalibracao): Promise<Calibracao[]> => {
  let query = supabase
    .from('calibracoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      pontos_calibracao: pontos_calibracao(*),
      documentos: documentos_calibracoes(*),
      fotos: fotos_calibracoes(*)
    `)
    .order('created_at', { ascending: false });

  if (filtros) {
    if (filtros.equipamento_id) query = query.eq('equipamento_id', filtros.equipamento_id);
    if (filtros.tipo_calibracao) query = query.eq('tipo_calibracao', filtros.tipo_calibracao);
    if (filtros.resultado) query = query.eq('resultado', filtros.resultado);
    if (filtros.laboratorio) query = query.ilike('laboratorio', `%${filtros.laboratorio}%`);
    if (filtros.data_calibracao_inicio) query = query.gte('data_calibracao', filtros.data_calibracao_inicio);
    if (filtros.data_calibracao_fim) query = query.lte('data_calibracao', filtros.data_calibracao_fim);
    if (filtros.data_proxima_calibracao_inicio) query = query.gte('data_proxima_calibracao', filtros.data_proxima_calibracao_inicio);
    if (filtros.data_proxima_calibracao_fim) query = query.lte('data_proxima_calibracao', filtros.data_proxima_calibracao_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar calibrações:', error);
    throw error;
  }

  return data || [];
};

export const getCalibracao = async (id: string): Promise<Calibracao | null> => {
  const { data, error } = await supabase
    .from('calibracoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      pontos_calibracao: pontos_calibracao(*),
      documentos: documentos_calibracoes(*),
      fotos: fotos_calibracoes(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar calibração:', error);
    throw error;
  }

  return data;
};

export const createCalibracao = async (calibracao: Omit<Calibracao, 'id' | 'created_at' | 'updated_at'>): Promise<Calibracao> => {
  const { data, error } = await supabase
    .from('calibracoes')
    .insert(calibracao)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar calibração:', error);
    throw error;
  }

  return data;
};

export const updateCalibracao = async (id: string, calibracao: Partial<Calibracao>): Promise<Calibracao> => {
  const { data, error } = await supabase
    .from('calibracoes')
    .update(calibracao)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar calibração:', error);
    throw error;
  }

  return data;
};

export const deleteCalibracao = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('calibracoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar calibração:', error);
    throw error;
  }
};

// ===== MANUTENÇÕES =====

export const getManutencoes = async (filtros?: FiltrosManutencao): Promise<Manutencao[]> => {
  let query = supabase
    .from('manutencoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      documentos: documentos_manutencoes(*),
      fotos: fotos_manutencoes(*)
    `)
    .order('created_at', { ascending: false });

  if (filtros) {
    if (filtros.equipamento_id) query = query.eq('equipamento_id', filtros.equipamento_id);
    if (filtros.tipo_manutencao) query = query.eq('tipo_manutencao', filtros.tipo_manutencao);
    if (filtros.resultado) query = query.eq('resultado', filtros.resultado);
    if (filtros.tecnico_responsavel) query = query.ilike('tecnico_responsavel', `%${filtros.tecnico_responsavel}%`);
    if (filtros.fornecedor) query = query.ilike('fornecedor', `%${filtros.fornecedor}%`);
    if (filtros.data_manutencao_inicio) query = query.gte('data_manutencao', filtros.data_manutencao_inicio);
    if (filtros.data_manutencao_fim) query = query.lte('data_manutencao', filtros.data_manutencao_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar manutenções:', error);
    throw error;
  }

  return data || [];
};

export const getManutencao = async (id: string): Promise<Manutencao | null> => {
  const { data, error } = await supabase
    .from('manutencoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      documentos: documentos_manutencoes(*),
      fotos: fotos_manutencoes(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar manutenção:', error);
    throw error;
  }

  return data;
};

export const createManutencao = async (manutencao: Omit<Manutencao, 'id' | 'created_at' | 'updated_at'>): Promise<Manutencao> => {
  const { data, error } = await supabase
    .from('manutencoes')
    .insert(manutencao)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar manutenção:', error);
    throw error;
  }

  return data;
};

export const updateManutencao = async (id: string, manutencao: Partial<Manutencao>): Promise<Manutencao> => {
  const { data, error } = await supabase
    .from('manutencoes')
    .update(manutencao)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar manutenção:', error);
    throw error;
  }

  return data;
};

export const deleteManutencao = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('manutencoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar manutenção:', error);
    throw error;
  }
};

// ===== INSPEÇÕES =====

export const getInspecoes = async (filtros?: FiltrosInspecao): Promise<Inspecao[]> => {
  let query = supabase
    .from('inspecoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      criterios_avaliados: criterios_inspecao(*),
      documentos: documentos_inspecoes(*),
      fotos: fotos_inspecoes(*)
    `)
    .order('created_at', { ascending: false });

  if (filtros) {
    if (filtros.equipamento_id) query = query.eq('equipamento_id', filtros.equipamento_id);
    if (filtros.tipo_inspecao) query = query.eq('tipo_inspecao', filtros.tipo_inspecao);
    if (filtros.resultado) query = query.eq('resultado', filtros.resultado);
    if (filtros.inspetor) query = query.ilike('inspetor', `%${filtros.inspetor}%`);
    if (filtros.data_inspecao_inicio) query = query.gte('data_inspecao', filtros.data_inspecao_inicio);
    if (filtros.data_inspecao_fim) query = query.lte('data_inspecao', filtros.data_inspecao_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar inspeções:', error);
    throw error;
  }

  return data || [];
};

export const getInspecao = async (id: string): Promise<Inspecao | null> => {
  const { data, error } = await supabase
    .from('inspecoes')
    .select(`
      *,
      equipamento: equipamentos(*),
      criterios_avaliados: criterios_inspecao(*),
      documentos: documentos_inspecoes(*),
      fotos: fotos_inspecoes(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar inspeção:', error);
    throw error;
  }

  return data;
};

export const createInspecao = async (inspecao: Omit<Inspecao, 'id' | 'created_at' | 'updated_at'>): Promise<Inspecao> => {
  const { data, error } = await supabase
    .from('inspecoes')
    .insert(inspecao)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar inspeção:', error);
    throw error;
  }

  return data;
};

export const updateInspecao = async (id: string, inspecao: Partial<Inspecao>): Promise<Inspecao> => {
  const { data, error } = await supabase
    .from('inspecoes')
    .update(inspecao)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar inspeção:', error);
    throw error;
  }

  return data;
};

export const deleteInspecao = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('inspecoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar inspeção:', error);
    throw error;
  }
};

// ===== PONTOS DE CALIBRAÇÃO =====

export const createPontoCalibracao = async (ponto: Omit<PontoCalibracao, 'id'>): Promise<PontoCalibracao> => {
  const { data, error } = await supabase
    .from('pontos_calibracao')
    .insert(ponto)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar ponto de calibração:', error);
    throw error;
  }

  return data;
};

export const updatePontoCalibracao = async (id: string, ponto: Partial<PontoCalibracao>): Promise<PontoCalibracao> => {
  const { data, error } = await supabase
    .from('pontos_calibracao')
    .update(ponto)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar ponto de calibração:', error);
    throw error;
  }

  return data;
};

export const deletePontoCalibracao = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pontos_calibracao')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar ponto de calibração:', error);
    throw error;
  }
};

// ===== CRITÉRIOS DE INSPEÇÃO =====

export const createCriterioInspecao = async (criterio: Omit<CriterioInspecao, 'id'>): Promise<CriterioInspecao> => {
  const { data, error } = await supabase
    .from('criterios_inspecao')
    .insert(criterio)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar critério de inspeção:', error);
    throw error;
  }

  return data;
};

export const updateCriterioInspecao = async (id: string, criterio: Partial<CriterioInspecao>): Promise<CriterioInspecao> => {
  const { data, error } = await supabase
    .from('criterios_inspecao')
    .update(criterio)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar critério de inspeção:', error);
    throw error;
  }

  return data;
};

export const deleteCriterioInspecao = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('criterios_inspecao')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao eliminar critério de inspeção:', error);
    throw error;
  }
};

// ===== ESTATÍSTICAS =====

export const getCalibracoesStats = async (): Promise<CalibracoesStats> => {
  try {
    // Buscar estatísticas usando a função do banco de dados
    const { data, error } = await supabase
      .rpc('get_calibracoes_stats');

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }

    console.log('Dados retornados pela função SQL:', data);

    return data || {
      total_equipamentos: 0,
      equipamentos_ativos: 0,
      equipamentos_manutencao: 0,
      equipamentos_avariados: 0,
      calibracoes_vencidas: 0,
      calibracoes_proximas_vencer: 0,
      manutencoes_pendentes: 0,
      inspecoes_pendentes: 0,
      valor_total_equipamentos: 0,
      custo_total_calibracoes: 0,
      custo_total_manutencoes: 0
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      total_equipamentos: 0,
      equipamentos_ativos: 0,
      equipamentos_manutencao: 0,
      equipamentos_avariados: 0,
      calibracoes_vencidas: 0,
      calibracoes_proximas_vencer: 0,
      manutencoes_pendentes: 0,
      inspecoes_pendentes: 0,
      valor_total_equipamentos: 0,
      custo_total_calibracoes: 0,
      custo_total_manutencoes: 0
    };
  }
};

// ===== ALERTAS =====

export const getCalibracoesAlertas = async (): Promise<{
  calibracoes_vencidas: Calibracao[];
  calibracoes_proximas_vencer: Calibracao[];
  manutencoes_pendentes: Manutencao[];
  inspecoes_pendentes: Inspecao[];
}> => {
  const hoje = new Date().toISOString().split('T')[0];
  const proximos30Dias = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Calibrações vencidas
  const { data: calibracoesVencidas } = await supabase
    .from('calibracoes')
    .select(`
      *,
      equipamento: equipamentos(*)
    `)
    .lt('data_proxima_calibracao', hoje)
    .eq('resultado', 'aprovado');

  // Calibrações próximas de vencer (próximos 30 dias)
  const { data: calibracoesProximas } = await supabase
    .from('calibracoes')
    .select(`
      *,
      equipamento: equipamentos(*)
    `)
    .gte('data_proxima_calibracao', hoje)
    .lte('data_proxima_calibracao', proximos30Dias)
    .eq('resultado', 'aprovado');

  // Manutenções pendentes
  const { data: manutencoesPendentes } = await supabase
    .from('manutencoes')
    .select(`
      *,
      equipamento: equipamentos(*)
    `)
    .in('resultado', ['pendente', 'em_andamento']);

  // Inspeções pendentes
  const { data: inspecoesPendentes } = await supabase
    .from('inspecoes')
    .select(`
      *,
      equipamento: equipamentos(*)
    `)
    .eq('resultado', 'pendente');

  return {
    calibracoes_vencidas: calibracoesVencidas || [],
    calibracoes_proximas_vencer: calibracoesProximas || [],
    manutencoes_pendentes: manutencoesPendentes || [],
    inspecoes_pendentes: inspecoesPendentes || []
  };
};
