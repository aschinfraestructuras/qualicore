// Tipos para o módulo de Segurança Ferroviária
export interface SistemaSeguranca {
  id: string;
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    nivel_seguranca: number;
    raio_cobertura: number;
    tempo_resposta: number;
    capacidade_deteccao: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  responsavel: string;
  fotos: string[];
  documentos_anexos: string[];
  created_at: string;
  updated_at: string;
}

export interface InspecaoSeguranca {
  id: string;
  seguranca_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  prioridade: string;
  acoes_corretivas: string;
  fotos: string[];
  documentos_anexos: string[];
  created_at: string;
  updated_at: string;
}

export interface SegurancaFerroviariaStats {
  total_sistemas: number;
  sistemas_operacionais: number;
  sistemas_manutencao: number;
  sistemas_avaria: number;
  sistemas_ativos: number;
  sistemas_inativos: number;
  total_inspecoes: number;
  inspecoes_conformes: number;
  inspecoes_nao_conformes: number;
  inspecoes_pendentes: number;
  taxa_conformidade: number;
  sistemas_criticos: number;
}

// Tipos para formulários
export interface SegurancaFerroviariaFormData {
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    nivel_seguranca: number;
    raio_cobertura: number;
    tempo_resposta: number;
    capacidade_deteccao: number;
  };
  responsavel: string;
  fotos: string[];
  documentos_anexos: string[];
}

export interface InspecaoSegurancaFormData {
  seguranca_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  prioridade: string;
  acoes_corretivas: string;
  fotos: string[];
  documentos_anexos: string[];
}

// Enums e constantes
export const TIPOS_SISTEMA_SEGURANCA = {
  SISTEMA_DETECCAO: 'Sistema de Detecção',
  SISTEMA_VIGILANCIA: 'Sistema de Vigilância',
  SISTEMA_CONTROLE: 'Sistema de Controle',
  SISTEMA_ALARME: 'Sistema de Alarme',
  SISTEMA_BLOQUEIO: 'Sistema de Bloqueio',
  SISTEMA_COMUNICACAO: 'Sistema de Comunicação',
  SISTEMA_MONITORAMENTO: 'Sistema de Monitoramento',
  SISTEMA_EMERGENCIA: 'Sistema de Emergência'
} as const;

export const CATEGORIAS_SEGURANCA = {
  SEGURANCA_OPERACIONAL: 'Segurança Operacional',
  SEGURANCA_PASSAGEIROS: 'Segurança de Passageiros',
  SEGURANCA_INFRAESTRUTURA: 'Segurança de Infraestrutura',
  SEGURANCA_AMBIENTAL: 'Segurança Ambiental',
  SEGURANCA_TRABALHO: 'Segurança no Trabalho',
  SEGURANCA_PATRIMONIAL: 'Segurança Patrimonial'
} as const;

export const ESTADOS_SISTEMA = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  MANUTENCAO: 'Manutenção',
  AVARIA: 'Avaria',
  DESLIGADO: 'Desligado',
  TESTE: 'Teste'
} as const;

export const STATUS_OPERACIONAL = {
  OPERACIONAL: 'Operacional',
  MANUTENCAO: 'Manutenção',
  AVARIA: 'Avaria',
  TESTE: 'Teste',
  DESLIGADO: 'Desligado'
} as const;

export const TIPOS_INSPECAO_SEGURANCA = {
  INSPECAO_ROTINA: 'Inspeção de Rotina',
  INSPECAO_MANUTENCAO: 'Inspeção de Manutenção',
  INSPECAO_AVARIA: 'Inspeção de Avaria',
  INSPECAO_ESPECIAL: 'Inspeção Especial',
  INSPECAO_REPARACAO: 'Inspeção de Reparação',
  INSPECAO_PREVENTIVA: 'Inspeção Preventiva'
} as const;

export const RESULTADOS_INSPECAO = {
  CONFORME: 'Conforme',
  NAO_CONFORME: 'Não Conforme',
  PENDENTE: 'Pendente',
  CRITICO: 'Crítico'
} as const;

export const PRIORIDADES = {
  CRITICA: 'Crítica',
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa'
} as const;

// Tipos para filtros
export interface FiltrosSegurancaFerroviaria {
  tipo?: string;
  categoria?: string;
  estado?: string;
  status_operacional?: string;
  fabricante?: string;
  responsavel?: string;
  localizacao?: string;
  data_instalacao_inicio?: string;
  data_instalacao_fim?: string;
  ultima_inspecao_inicio?: string;
  ultima_inspecao_fim?: string;
}

export interface FiltrosInspecaoSeguranca {
  tipo_inspecao?: string;
  resultado?: string;
  prioridade?: string;
  responsavel?: string;
  seguranca_id?: string;
  data_inspecao_inicio?: string;
  data_inspecao_fim?: string;
}

// Tipos para relatórios
export interface RelatorioSegurancaFerroviariaOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo: string;
  subtitulo?: string;
  filtros?: FiltrosSegurancaFerroviaria;
  sistemasSelecionados?: SistemaSeguranca[];
  periodo?: string;
}

export interface RelatorioInspecaoSegurancaOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo: string;
  subtitulo?: string;
  filtros?: FiltrosInspecaoSeguranca;
  inspecoesSelecionadas?: InspecaoSeguranca[];
  periodo?: string;
}

// Tipos para exportação
export interface SegurancaFerroviariaExportData {
  sistemas: SistemaSeguranca[];
  inspecoes: InspecaoSeguranca[];
  stats: SegurancaFerroviariaStats;
  filtros: FiltrosSegurancaFerroviaria;
  periodo: string;
}

export interface InspecaoSegurancaExportData {
  inspecoes: InspecaoSeguranca[];
  stats: {
    total: number;
    conformes: number;
    nao_conformes: number;
    pendentes: number;
    criticas: number;
  };
  filtros: FiltrosInspecaoSeguranca;
  periodo: string;
}
