// Tipos para o módulo de Sinalização

export interface Sinalizacao {
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
  ultima_inspecao: string;
  proxima_inspecao: string;
  parametros: {
    alcance: number;
    frequencia: string;
    potencia: number;
    sensibilidade: number;
  };
  status_operacional: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface InspecaoSinalizacao {
  id: string;
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  fotos: string[];
  relatorio_url: string;
  sinalizacao_id: string;
  parametros_medidos: any;
  created_at: string;
  updated_at: string;
}

export interface SinalizacaoStats {
  totalSinalizacoes: number;
  operacionais: number;
  manutencao: number;
  avariadas: number;
  inspecoesPendentes: number;
  alertasCriticos: number;
  conformidade: number;
  kmCobertos: number;
}

// Tipos para formulários
export interface SinalizacaoFormData {
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
  ultima_inspecao: string;
  proxima_inspecao: string;
  parametros: {
    alcance: number;
    frequencia: string;
    potencia: number;
    sensibilidade: number;
  };
  status_operacional: string;
  observacoes: string;
}

export interface InspecaoSinalizacaoFormData {
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  fotos: string[];
  relatorio_url: string;
  sinalizacao_id: string;
  parametros_medidos: any;
}

// Enums e constantes
export const TIPOS_SINALIZACAO = {
  semaforo: 'Semáforo',
  painel: 'Painel de Sinalização',
  baliza: 'Baliza',
  farol: 'Farol',
  sinal_acustico: 'Sinal Acústico',
  sinal_luminoso: 'Sinal Luminoso',
  detector: 'Detector',
  transmissor: 'Transmissor',
  receptor: 'Receptor',
  controlador: 'Controlador'
} as const;

export const CATEGORIAS_SINALIZACAO = {
  ferroviaria: 'Ferroviária',
  rodoviaria: 'Rodoviária',
  urbana: 'Urbana',
  portuaria: 'Portuária',
  aeroportuaria: 'Aeroportuária',
  industrial: 'Industrial',
  seguranca: 'Segurança',
  emergencia: 'Emergência'
} as const;

export const ESTADOS_SINALIZACAO = {
  operacional: 'Operacional',
  manutencao: 'Manutenção',
  avariada: 'Avariada',
  desativada: 'Desativada',
  teste: 'Em Teste',
  instalacao: 'Em Instalação'
} as const;

export const STATUS_OPERACIONAL = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  standby: 'Standby',
  emergencia: 'Emergência',
  teste: 'Teste'
} as const;

export const TIPOS_INSPECAO = {
  preventiva: 'Preventiva',
  corretiva: 'Corretiva',
  periodica: 'Periódica',
  emergencia: 'Emergência',
  pos_manutencao: 'Pós-Manutenção'
} as const;

export const RESULTADOS_INSPECAO = {
  aprovado: 'Aprovado',
  aprovado_condicional: 'Aprovado Condicional',
  reprovado: 'Reprovado',
  pendente: 'Pendente',
  cancelado: 'Cancelado'
} as const;

// Tipos para filtros
export interface FiltrosSinalizacao {
  tipo?: string;
  categoria?: string;
  estado?: string;
  fabricante?: string;
  localizacao?: string;
  status_operacional?: string;
  data_instalacao_inicio?: string;
  data_instalacao_fim?: string;
  km_inicial?: number;
  km_final?: number;
}

export interface FiltrosInspecaoSinalizacao {
  tipo?: string;
  resultado?: string;
  inspector?: string;
  sinalizacao_id?: string;
  data_inspecao_inicio?: string;
  data_inspecao_fim?: string;
  proxima_inspecao_inicio?: string;
  proxima_inspecao_fim?: string;
}

// Tipos para relatórios
export interface RelatorioSinalizacaoOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  sinalizacoes: Sinalizacao[];
  filtros?: string[];
  titulo?: string;
  incluirEstatisticas?: boolean;
  incluirGraficos?: boolean;
}

export interface RelatorioInspecaoSinalizacaoOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  inspecoes: InspecaoSinalizacao[];
  filtros?: string[];
  titulo?: string;
  incluirEstatisticas?: boolean;
  incluirGraficos?: boolean;
}

// Tipos para exportação
export interface SinalizacaoExportData {
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
  ultima_inspecao: string;
  proxima_inspecao: string;
  status_operacional: string;
  alcance: number;
  frequencia: string;
  potencia: number;
  sensibilidade: number;
}

export interface InspecaoSinalizacaoExportData {
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  sinalizacao_codigo: string;
  sinalizacao_tipo: string;
  sinalizacao_localizacao: string;
}
