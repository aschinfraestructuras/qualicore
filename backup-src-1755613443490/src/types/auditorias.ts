// Tipos para o módulo de Auditorias SGQ
export interface Auditoria extends BaseEntity {
  tipo: "interna" | "externa" | "certificacao" | "seguimento" | "surpresa";
  escopo: string;
  data_inicio: string;
  data_fim: string;
  duracao_horas: number;
  local: string;
  obra_id: string;
  obra_nome: string;
  
  // Equipa de Auditoria
  auditor_principal: string;
  auditores: string[];
  observadores?: string[];
  
  // Status e Resultados
  status: "programada" | "em_curso" | "concluida" | "cancelada" | "adiada";
  resultado: "conforme" | "nao_conforme" | "conforme_com_observacoes" | "pendente";
  classificacao: "excelente" | "bom" | "satisfatorio" | "insatisfatorio" | "critico";
  
  // Critérios e Normas
  normas_aplicaveis: string[];
  criterios_auditoria: CriterioAuditoria[];
  
  // Documentação
  relatorio_url?: string;
  evidencias: EvidenciaAuditoria[];
  nao_conformidades: NaoConformidadeAuditoria[];
  observacoes: ObservacaoAuditoria[];
  acoes_corretivas: AcaoCorretiva[];
  
  // Métricas
  pontuacao_total: number;
  pontuacao_maxima: number;
  percentagem_conformidade: number;
  
  // Aprovação
  aprovador?: string;
  data_aprovacao?: string;
  comentarios_aprovacao?: string;
}

export interface CriterioAuditoria {
  id: string;
  codigo: string;
  descricao: string;
  categoria: "documentacao" | "processos" | "recursos" | "resultados" | "melhoria";
  peso: number;
  pontuacao_maxima: number;
  pontuacao_atual: number;
  observacoes?: string;
  evidencias?: string[];
  conformidade: "conforme" | "nao_conforme" | "parcialmente_conforme" | "nao_aplicavel";
}

export interface EvidenciaAuditoria {
  id: string;
  tipo: "foto" | "documento" | "registro" | "entrevista" | "observacao" | "outro";
  descricao: string;
  url?: string;
  data_captura: string;
  responsavel: string;
  criterio_id: string;
  observacoes?: string;
}

export interface NaoConformidadeAuditoria {
  id: string;
  codigo: string;
  descricao: string;
  tipo: "maior" | "menor" | "observacao";
  criterio_id: string;
  evidencia: string;
  impacto: "baixo" | "medio" | "alto" | "critico";
  prazo_correcao: string;
  responsavel_correcao: string;
  status: "aberta" | "em_correcao" | "verificada" | "fechada";
  acoes_corretivas: string[];
  data_verificacao?: string;
  verificador?: string;
}

export interface ObservacaoAuditoria {
  id: string;
  descricao: string;
  tipo: "melhoria" | "sugestao" | "observacao" | "elogio";
  criterio_id?: string;
  responsavel: string;
  data: string;
  prioridade: "baixa" | "media" | "alta";
  status: "pendente" | "em_analise" | "implementada" | "rejeitada";
}

export interface AcaoCorretiva {
  id: string;
  descricao: string;
  nao_conformidade_id: string;
  responsavel: string;
  prazo: string;
  custo_estimado?: number;
  status: "pendente" | "em_execucao" | "concluida" | "verificada";
  data_inicio?: string;
  data_conclusao?: string;
  evidencias?: string[];
  eficacia: "eficaz" | "parcialmente_eficaz" | "ineficaz" | "pendente";
}

export interface ChecklistAuditoria {
  id: string;
  nome: string;
  versao: string;
  categoria: "geral" | "especifico" | "norma" | "processo";
  normas_referencia: string[];
  criterios: CriterioAuditoria[];
  data_criacao: string;
  criador: string;
  ativo: boolean;
  utilizacoes: number;
}

export interface ProgramaAuditorias {
  id: string;
  ano: number;
  obra_id: string;
  obra_nome: string;
  auditorias_planeadas: AuditoriaPlaneada[];
  responsavel_programa: string;
  data_aprovacao?: string;
  aprovador?: string;
  status: "rascunho" | "aprovado" | "em_execucao" | "concluido";
  observacoes?: string;
}

export interface AuditoriaPlaneada {
  id: string;
  tipo: "interna" | "externa" | "certificacao" | "seguimento";
  mes: number;
  escopo: string;
  duracao_estimada: number;
  auditor_principal: string;
  normas_aplicaveis: string[];
  status: "planeada" | "confirmada" | "realizada" | "cancelada";
  auditoria_id?: string;
}

export interface RelatorioAuditoria {
  id: string;
  auditoria_id: string;
  versao: string;
  data_geracao: string;
  gerador: string;
  
  // Conteúdo do Relatório
  resumo_executivo: string;
  metodologia: string;
  resultados_gerais: string;
  nao_conformidades_encontradas: number;
  observacoes: number;
  acoes_corretivas: number;
  
  // Métricas
  pontuacao_total: number;
  percentagem_conformidade: number;
  classificacao_geral: string;
  
  // Anexos
  anexos: Anexo[];
  
  // Aprovação
  aprovador?: string;
  data_aprovacao?: string;
  status: "rascunho" | "aprovado" | "distribuido";
}

export interface MetricaAuditoria {
  id: string;
  obra_id: string;
  periodo: string;
  total_auditorias: number;
  auditorias_conformes: number;
  auditorias_nao_conformes: number;
  percentagem_conformidade: number;
  nao_conformidades_maiores: number;
  nao_conformidades_menores: number;
  acoes_corretivas_abertas: number;
  acoes_corretivas_concluidas: number;
  tempo_medio_correcao: number;
  custo_total_correcoes: number;
}

// Tipos para filtros e pesquisa
export interface FiltrosAuditoria {
  tipo?: string;
  status?: string;
  resultado?: string;
  obra_id?: string;
  auditor_principal?: string;
  data_inicio?: string;
  data_fim?: string;
  classificacao?: string;
  normas_aplicaveis?: string[];
}

// Tipos para estatísticas
export interface EstatisticasAuditoria {
  total_auditorias: number;
  auditorias_este_ano: number;
  auditorias_este_mes: number;
  percentagem_conformidade_geral: number;
  nao_conformidades_abertas: number;
  acoes_corretivas_pendentes: number;
  proxima_auditoria?: string;
  auditorias_por_tipo: { tipo: string; quantidade: number }[];
  conformidade_por_obra: { obra: string; percentagem: number }[];
  tendencia_mensal: { mes: string; conformidade: number }[];
}

// Tipos para exportação
export interface ExportacaoAuditoria {
  formato: "pdf" | "excel" | "csv";
  filtros: FiltrosAuditoria;
  incluir_anexos: boolean;
  incluir_evidencias: boolean;
  incluir_metricas: boolean;
}
