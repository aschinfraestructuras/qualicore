// Tipos para o módulo de Pontes e Túneis
export interface PonteTunel {
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
  data_construcao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    comprimento: number;
    largura: number;
    altura: number;
    capacidade_carga: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  responsavel: string;
  fotos?: string[];
  documentos_anexos?: string[];
  created_at: string;
  updated_at: string;
}

export interface InspecaoPontesTuneis {
  id: string;
  ponte_tunel_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  fotos?: string[];
  documentos_anexos?: string[];
  created_at: string;
  updated_at: string;
}

export interface PontesTuneisStats {
  total: number;
  pontes: number;
  tuneis: number;
  operacionais: number;
  manutencao: number;
  avaria: number;
  ativos: number;
  inativos: number;
  inspecoes_pendentes: number;
  inspecoes_realizadas: number;
  inspecoes_conformes: number;
  inspecoes_nao_conformes: number;
  distribuicao_por_tipo: Record<string, number>;
  distribuicao_por_categoria: Record<string, number>;
  distribuicao_por_estado: Record<string, number>;
}

// Tipos para formulários
export interface PontesTuneisFormData {
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_construcao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    comprimento: number;
    largura: number;
    altura: number;
    capacidade_carga: number;
  };
  responsavel: string;
  fotos?: File[];
  documentos_anexos?: File[];
}

export interface InspecaoPontesTuneisFormData {
  ponte_tunel_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  fotos?: File[];
  documentos_anexos?: File[];
}

// Enums e constantes
export const TIPOS_PONTE_TUNEL = {
  PONTE: 'PONTE',
  TUNEL: 'TUNEL',
  VIADUTO: 'VIADUTO',
  PASSAGEM_SUPERIOR: 'PASSAGEM_SUPERIOR',
  PASSAGEM_INFERIOR: 'PASSAGEM_INFERIOR',
  AQUEDUTO: 'AQUEDUTO'
} as const;

export const CATEGORIAS_PONTE_TUNEL = {
  ESTRUTURAL: 'ESTRUTURAL',
  HIDRAULICA: 'HIDRAULICA',
  GEOTECNICA: 'GEOTECNICA',
  SINALIZACAO: 'SINALIZACAO',
  ILUMINACAO: 'ILUMINACAO',
  DRENAGEM: 'DRENAGEM'
} as const;

export const ESTADOS_PONTE_TUNEL = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  MANUTENCAO: 'MANUTENCAO',
  AVARIA: 'AVARIA',
  CONSTRUCAO: 'CONSTRUCAO',
  DESATIVADO: 'DESATIVADO'
} as const;

export const STATUS_OPERACIONAL = {
  OPERACIONAL: 'OPERACIONAL',
  MANUTENCAO: 'MANUTENCAO',
  AVARIA: 'AVARIA',
  EMERGENCIA: 'EMERGENCIA',
  PLANEAMENTO: 'PLANEAMENTO'
} as const;

export const TIPOS_INSPECAO_PONTES_TUNEIS = {
  ROTINA: 'ROTINA',
  MANUTENCAO: 'MANUTENCAO',
  AVARIA: 'AVARIA',
  ESPECIAL: 'ESPECIAL',
  REPARACAO: 'REPARACAO',
  CONSTRUCAO: 'CONSTRUCAO'
} as const;

export const RESULTADOS_INSPECAO = {
  CONFORME: 'CONFORME',
  NAO_CONFORME: 'NAO_CONFORME',
  PENDENTE: 'PENDENTE',
  CRITICO: 'CRITICO',
  EM_ANALISE: 'EM_ANALISE'
} as const;

export const PRIORIDADES = {
  CRITICA: 'CRITICA',
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAIXA: 'BAIXA'
} as const;

// Tipos para filtros
export interface FiltrosPontesTuneis {
  search?: string;
  tipo?: string;
  categoria?: string;
  estado?: string;
  status_operacional?: string;
  fabricante?: string;
  responsavel?: string;
  localizacao?: string;
  data_construcao_inicio?: string;
  data_construcao_fim?: string;
  ultima_inspecao_inicio?: string;
  ultima_inspecao_fim?: string;
}

export interface FiltrosInspecaoPontesTuneis {
  search?: string;
  tipo_inspecao?: string;
  resultado?: string;
  responsavel?: string;
  ponte_tunel_id?: string;
  data_inspecao_inicio?: string;
  data_inspecao_fim?: string;
  proxima_inspecao_inicio?: string;
  proxima_inspecao_fim?: string;
}

// Tipos para relatórios
export interface RelatorioPontesTuneisOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo?: string;
  subtitulo?: string;
  pontesTuneis?: PonteTunel[];
  inspecoes?: InspecaoPontesTuneis[];
  filtros?: FiltrosPontesTuneis;
  filtrosInspecao?: FiltrosInspecaoPontesTuneis;
  pontesTuneisSelecionadas?: string[];
  inspecoesSelecionadas?: string[];
  incluirEstatisticas?: boolean;
  incluirTabelas?: boolean;
  incluirGraficos?: boolean;
  orientacao?: 'portrait' | 'landscape';
  tamanho?: 'a4' | 'a3' | 'letter';
}

export interface RelatorioInspecaoPontesTuneisOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo?: string;
  subtitulo?: string;
  inspecoes?: InspecaoPontesTuneis[];
  filtros?: FiltrosInspecaoPontesTuneis;
  inspecoesSelecionadas?: string[];
  incluirEstatisticas?: boolean;
  incluirTabelas?: boolean;
  incluirGraficos?: boolean;
  orientacao?: 'portrait' | 'landscape';
  tamanho?: 'a4' | 'a3' | 'letter';
}

// Tipos para exportação
export interface PontesTuneisExportData {
  pontesTuneis: PonteTunel[];
  inspecoes: InspecaoPontesTuneis[];
  stats: PontesTuneisStats;
  filtros: FiltrosPontesTuneis;
  dataExportacao: string;
}

export interface InspecaoPontesTuneisExportData {
  inspecoes: InspecaoPontesTuneis[];
  stats: {
    total: number;
    conformes: number;
    nao_conformes: number;
    pendentes: number;
    criticos: number;
    distribuicao_por_tipo: Record<string, number>;
    distribuicao_por_resultado: Record<string, number>;
  };
  filtros: FiltrosInspecaoPontesTuneis;
  dataExportacao: string;
}

// Tipos utilitários
export type TipoPonteTunel = typeof TIPOS_PONTE_TUNEL[keyof typeof TIPOS_PONTE_TUNEL];
export type CategoriaPonteTunel = typeof CATEGORIAS_PONTE_TUNEL[keyof typeof CATEGORIAS_PONTE_TUNEL];
export type EstadoPonteTunel = typeof ESTADOS_PONTE_TUNEL[keyof typeof ESTADOS_PONTE_TUNEL];
export type StatusOperacional = typeof STATUS_OPERACIONAL[keyof typeof STATUS_OPERACIONAL];
export type TipoInspecaoPontesTuneis = typeof TIPOS_INSPECAO_PONTES_TUNEIS[keyof typeof TIPOS_INSPECAO_PONTES_TUNEIS];
export type ResultadoInspecao = typeof RESULTADOS_INSPECAO[keyof typeof RESULTADOS_INSPECAO];
export type Prioridade = typeof PRIORIDADES[keyof typeof PRIORIDADES];
