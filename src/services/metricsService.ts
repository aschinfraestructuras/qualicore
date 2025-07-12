import { 
  documentosAPI, 
  ensaiosAPI, 
  checklistsAPI, 
  materiaisAPI, 
  fornecedoresAPI, 
  naoConformidadesAPI 
} from '@/lib/pocketbase'

// Tipos para métricas reais
export interface MetricasReais {
  ensaios: KPIsEnsaios;
  checklists: KPIsChecklists;
  materiais: KPIsMateriais;
  naoConformidades: KPIsNCs;
  documentos: KPIsDocumentos;
  fornecedores: KPIsFornecedores;
  geral: KPIsGerais;
}

export interface KPIsEnsaios {
  taxa_conformidade: number;
  total_ensaios: number;
  ensaios_conformes: number;
  ensaios_nao_conformes: number;
  desvio_medio: number;
  ensaios_por_mes: number;
  tipos_mais_problematicos: string[];
  laboratorios_mais_eficientes: string[];
  zonas_com_mais_problemas: string[];
}

export interface KPIsChecklists {
  conformidade_media: number;
  total_checklists: number;
  checklists_concluidos: number;
  checklists_pendentes: number;
  tempo_medio_inspecao: number;
  inspetores_mais_eficientes: string[];
  zonas_com_mais_falhas: string[];
}

export interface KPIsMateriais {
  taxa_aprovacao: number;
  total_materiais: number;
  materiais_aprovados: number;
  materiais_pendentes: number;
  materiais_reprovados: number;
  materiais_recebidos_mes: number;
  fornecedores_mais_confiaveis: string[];
  volume_por_tipo: Record<string, number>;
}

export interface KPIsNCs {
  total_ncs: number;
  ncs_pendentes: number;
  ncs_resolvidas: number;
  tempo_medio_resolucao: number;
  ncs_por_severidade: Record<string, number>;
  zonas_com_mais_ncs: string[];
  taxa_resolucao: number;
}

export interface KPIsDocumentos {
  documentos_aprovados: number;
  documentos_pendentes: number;
  documentos_vencidos: number;
  total_documentos: number;
  documentos_por_tipo: Record<string, number>;
  tempo_medio_aprovacao: number;
}

export interface KPIsFornecedores {
  fornecedores_ativos: number;
  fornecedores_inativos: number;
  total_fornecedores: number;
  fornecedores_com_problemas: number;
  performance_media: number;
}

export interface KPIsGerais {
  conformidade_geral: number;
  total_registros: number;
  alertas_criticos: number;
  tendencia_qualidade: 'melhorando' | 'estavel' | 'piorando';
}

// Função principal para calcular todas as métricas
export const calcularMetricasReais = async (): Promise<MetricasReais> => {
  try {
    // Buscar todos os dados
    const [ensaios, checklists, materiais, naoConformidades, documentos, fornecedores] = await Promise.all([
      ensaiosAPI.getAll(),
      checklistsAPI.getAll(),
      materiaisAPI.getAll(),
      naoConformidadesAPI.getAll(),
      documentosAPI.getAll(),
      fornecedoresAPI.getAll()
    ])

    // Calcular métricas de ensaios
    const kpisEnsaios = calcularKPIsEnsaios(ensaios)
    
    // Calcular métricas de checklists
    const kpisChecklists = calcularKPIsChecklists(checklists)
    
    // Calcular métricas de materiais
    const kpisMateriais = calcularKPIsMateriais(materiais)
    
    // Calcular métricas de não conformidades
    const kpisNCs = calcularKPIsNCs(naoConformidades)
    
    // Calcular métricas de documentos
    const kpisDocumentos = calcularKPIsDocumentos(documentos)
    
    // Calcular métricas de fornecedores
    const kpisFornecedores = calcularKPIsFornecedores(fornecedores)
    
    // Calcular métricas gerais
    const kpisGerais = calcularKPIsGerais({
      ensaios: kpisEnsaios,
      checklists: kpisChecklists,
      materiais: kpisMateriais,
      naoConformidades: kpisNCs,
      documentos: kpisDocumentos,
      fornecedores: kpisFornecedores
    })

    return {
      ensaios: kpisEnsaios,
      checklists: kpisChecklists,
      materiais: kpisMateriais,
      naoConformidades: kpisNCs,
      documentos: kpisDocumentos,
      fornecedores: kpisFornecedores,
      geral: kpisGerais
    }
  } catch (error) {
    console.error('Erro ao calcular métricas:', error)
    throw error
  }
}

// Funções específicas para cada módulo
const calcularKPIsEnsaios = (ensaios: any[]): KPIsEnsaios => {
  const total = ensaios.length
  const conformes = ensaios.filter(e => e.conforme).length
  const naoConformes = total - conformes
  const taxaConformidade = total > 0 ? (conformes / total) * 100 : 0

  // Calcular desvio médio
  const desvios = ensaios.map(e => Math.abs(e.valor_obtido - e.valor_esperado))
  const desvioMedio = desvios.length > 0 ? desvios.reduce((a, b) => a + b, 0) / desvios.length : 0

  // Ensaios por mês (últimos 6 meses)
  const agora = new Date()
  const seisMesesAtras = new Date(agora.getFullYear(), agora.getMonth() - 6, 1)
  const ensaiosRecentes = ensaios.filter(e => new Date(e.data_ensaio) >= seisMesesAtras)
  const ensaiosPorMes = ensaiosRecentes.length / 6

  // Tipos mais problemáticos
  const tiposNC = ensaios.filter(e => !e.conforme).map(e => e.tipo)
  const tiposProblema = contarFrequencias(tiposNC).slice(0, 5)

  // Laboratórios mais eficientes
  const labConformes = ensaios.filter(e => e.conforme).map(e => e.laboratorio)
  const labEficientes = contarFrequencias(labConformes).slice(0, 5)

  // Zonas com mais problemas
  const zonasNC = ensaios.filter(e => !e.conforme).map(e => e.zona)
  const zonasProblema = contarFrequencias(zonasNC).slice(0, 5)

  return {
    taxa_conformidade: Math.round(taxaConformidade * 100) / 100,
    total_ensaios: total,
    ensaios_conformes: conformes,
    ensaios_nao_conformes: naoConformes,
    desvio_medio: Math.round(desvioMedio * 100) / 100,
    ensaios_por_mes: Math.round(ensaiosPorMes * 100) / 100,
    tipos_mais_problematicos: tiposProblema,
    laboratorios_mais_eficientes: labEficientes,
    zonas_com_mais_problemas: zonasProblema
  }
}

const calcularKPIsChecklists = (checklists: any[]): KPIsChecklists => {
  const total = checklists.length
  const concluidos = checklists.filter(c => c.estado === 'concluido').length
  const pendentes = checklists.filter(c => c.estado === 'pendente').length
  
  const conformidadeMedia = total > 0 
    ? checklists.reduce((acc, c) => acc + c.percentual_conformidade, 0) / total 
    : 0

  // Tempo médio de inspeção (dias entre inspeções)
  const datasInspecao = checklists.map(c => new Date(c.data_inspecao)).sort()
  const tempoMedio = calcularTempoMedioEntreDatas(datasInspecao)

  // Inspetores mais eficientes (maior % conformidade)
  const inspetores = checklists.reduce((acc, c) => {
    if (!acc[c.inspetor]) acc[c.inspetor] = []
    acc[c.inspetor].push(c.percentual_conformidade)
    return acc
  }, {} as Record<string, number[]>)

  const inspetoresEficientes = Object.entries(inspetores)
    .map(([nome, valores]) => ({
      nome,
      media: (valores as number[]).reduce((a: number, b: number) => a + b, 0) / (valores as number[]).length
    }))
    .sort((a, b) => b.media - a.media)
    .slice(0, 5)
    .map(i => i.nome)

  // Zonas com mais falhas
  const zonasFalhas = checklists
    .filter(c => c.percentual_conformidade < 80)
    .map(c => c.zona)
  const zonasProblema = contarFrequencias(zonasFalhas).slice(0, 5)

  return {
    conformidade_media: Math.round(conformidadeMedia * 100) / 100,
    total_checklists: total,
    checklists_concluidos: concluidos,
    checklists_pendentes: pendentes,
    tempo_medio_inspecao: tempoMedio,
    inspetores_mais_eficientes: inspetoresEficientes,
    zonas_com_mais_falhas: zonasProblema
  }
}

const calcularKPIsMateriais = (materiais: any[]): KPIsMateriais => {
  const total = materiais.length
  const aprovados = materiais.filter(m => m.estado === 'aprovado').length
  const pendentes = materiais.filter(m => m.estado === 'pendente').length
  const reprovados = materiais.filter(m => m.estado === 'reprovado').length
  
  const taxaAprovacao = total > 0 ? (aprovados / total) * 100 : 0

  // Materiais recebidos no mês atual
  const agora = new Date()
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const materiaisMes = materiais.filter(m => new Date(m.data_rececao) >= inicioMes).length

  // Volume por tipo
  const volumePorTipo = materiais.reduce((acc, m) => {
    acc[m.tipo] = (acc[m.tipo] || 0) + m.quantidade
    return acc
  }, {} as Record<string, number>)

  // Fornecedores mais confiáveis (maior % aprovação)
  const fornecedores = materiais.reduce((acc, m) => {
    if (!acc[m.fornecedor_id]) acc[m.fornecedor_id] = { total: 0, aprovados: 0 }
    acc[m.fornecedor_id].total++
    if (m.estado === 'aprovado') acc[m.fornecedor_id].aprovados++
    return acc
  }, {} as Record<string, { total: number; aprovados: number }>)

  const fornecedoresConfiaveis = Object.entries(fornecedores)
    .map(([id, stats]) => ({
      id,
      taxa: ((stats as { total: number; aprovados: number }).aprovados / (stats as { total: number; aprovados: number }).total) * 100
    }))
    .sort((a, b) => b.taxa - a.taxa)
    .slice(0, 5)
    .map(f => f.id)

  return {
    taxa_aprovacao: Math.round(taxaAprovacao * 100) / 100,
    total_materiais: total,
    materiais_aprovados: aprovados,
    materiais_pendentes: pendentes,
    materiais_reprovados: reprovados,
    materiais_recebidos_mes: materiaisMes,
    fornecedores_mais_confiaveis: fornecedoresConfiaveis,
    volume_por_tipo: volumePorTipo
  }
}

const calcularKPIsNCs = (naoConformidades: any[]): KPIsNCs => {
  const total = naoConformidades.length
  const pendentes = naoConformidades.filter(nc => nc.estado === 'pendente').length
  const resolvidas = naoConformidades.filter(nc => nc.estado === 'concluido').length
  
  const taxaResolucao = total > 0 ? (resolvidas / total) * 100 : 0

  // Tempo médio de resolução
  const temposResolucao = naoConformidades
    .filter(nc => nc.data_resolucao && nc.data_deteccao)
    .map(nc => {
      const deteccao = new Date(nc.data_deteccao)
      const resolucao = new Date(nc.data_resolucao)
      return (resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24) // dias
    })

  const tempoMedioResolucao = temposResolucao.length > 0 
    ? temposResolucao.reduce((a, b) => a + b, 0) / temposResolucao.length 
    : 0

  // NCs por severidade
  const ncsPorSeveridade = naoConformidades.reduce((acc, nc) => {
    acc[nc.severidade] = (acc[nc.severidade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Zonas com mais NCs
  const zonasNC = naoConformidades.map(nc => nc.zona)
  const zonasProblema = contarFrequencias(zonasNC).slice(0, 5)

  return {
    total_ncs: total,
    ncs_pendentes: pendentes,
    ncs_resolvidas: resolvidas,
    tempo_medio_resolucao: Math.round(tempoMedioResolucao * 100) / 100,
    ncs_por_severidade: ncsPorSeveridade,
    zonas_com_mais_ncs: zonasProblema,
    taxa_resolucao: Math.round(taxaResolucao * 100) / 100
  }
}

const calcularKPIsDocumentos = (documentos: any[]): KPIsDocumentos => {
  const total = documentos.length
  const aprovados = documentos.filter(d => d.estado === 'aprovado').length
  const pendentes = documentos.filter(d => d.estado === 'pendente').length
  
  // Documentos vencidos
  const agora = new Date()
  const vencidos = documentos.filter(d => {
    if (!d.data_validade) return false
    return new Date(d.data_validade) < agora
  }).length

  // Documentos por tipo
  const docsPorTipo = documentos.reduce((acc, d) => {
    acc[d.tipo] = (acc[d.tipo] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Tempo médio de aprovação (simulado - seria baseado em timeline)
  const tempoMedioAprovacao = 7 // dias (simulado)

  return {
    documentos_aprovados: aprovados,
    documentos_pendentes: pendentes,
    documentos_vencidos: vencidos,
    total_documentos: total,
    documentos_por_tipo: docsPorTipo,
    tempo_medio_aprovacao: tempoMedioAprovacao
  }
}

const calcularKPIsFornecedores = (fornecedores: any[]): KPIsFornecedores => {
  const total = fornecedores.length
  const ativos = fornecedores.filter(f => f.estado === 'ativo').length
  const inativos = total - ativos

  // Fornecedores com problemas (simulado - seria baseado em NCs/materiais)
  const comProblemas = Math.floor(ativos * 0.1) // 10% simulado

  // Performance média (simulado - seria baseado em avaliações)
  const performanceMedia = 4.2 // 1-5 escala

  return {
    fornecedores_ativos: ativos,
    fornecedores_inativos: inativos,
    total_fornecedores: total,
    fornecedores_com_problemas: comProblemas,
    performance_media: performanceMedia
  }
}

const calcularKPIsGerais = (metricas: Omit<MetricasReais, 'geral'>): KPIsGerais => {
  // Conformidade geral (média ponderada)
  const conformidadeGeral = (
    metricas.ensaios.taxa_conformidade * 0.4 +
    metricas.checklists.conformidade_media * 0.3 +
    metricas.materiais.taxa_aprovacao * 0.2 +
    (100 - metricas.naoConformidades.taxa_resolucao) * 0.1
  )

  const totalRegistros = 
    metricas.ensaios.total_ensaios +
    metricas.checklists.total_checklists +
    metricas.materiais.total_materiais +
    metricas.naoConformidades.total_ncs +
    metricas.documentos.total_documentos

  // Alertas críticos
  const alertasCriticos = 
    metricas.naoConformidades.ncs_pendentes +
    metricas.documentos.documentos_vencidos +
    metricas.materiais.materiais_pendentes

  // Tendência (simulada - seria baseada em dados históricos)
  const tendencia: 'melhorando' | 'estavel' | 'piorando' = 'estavel'

  return {
    conformidade_geral: Math.round(conformidadeGeral * 100) / 100,
    total_registros: totalRegistros,
    alertas_criticos: alertasCriticos,
    tendencia_qualidade: tendencia
  }
}

// Funções auxiliares
const contarFrequencias = (array: string[]): string[] => {
  const contagem = array.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(contagem)
    .sort(([,a], [,b]) => b - a)
    .map(([item]) => item)
}

const calcularTempoMedioEntreDatas = (datas: Date[]): number => {
  if (datas.length < 2) return 0
  
  const intervalos = []
  for (let i = 1; i < datas.length; i++) {
    const intervalo = (datas[i].getTime() - datas[i-1].getTime()) / (1000 * 60 * 60 * 24)
    intervalos.push(intervalo)
  }
  
  return intervalos.length > 0 
    ? intervalos.reduce((a, b) => a + b, 0) / intervalos.length 
    : 0
} 