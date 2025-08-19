export interface RececaoObra {
  id: string;
  obra_id: string;
  codigo: string;
  data_rececao: string;
  status: 'pendente' | 'em_curso' | 'concluida' | 'com_reservas';
  tipo_rececao: 'provisoria' | 'definitiva' | 'parcial';
  responsavel_rececao: string;
  coordenador_seguranca: string;
  diretor_obra: string;
  fiscal_obra: string;
  observacoes: string;
  reservas: string[];
  documentos_anexos: DocumentoRececao[];
  created_at: string;
  updated_at: string;
}

export interface DocumentoRececao {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploaded_at: string;
}

export interface Garantia {
  id: string;
  rececao_id: string;
  tipo_garantia: '10_anos' | '2_anos' | '5_anos' | 'outros';
  descricao: string;
  data_inicio: string;
  data_fim: string;
  valor_garantia: number;
  seguradora: string;
  apolice: string;
  status: 'ativa' | 'expirada' | 'cancelada';
  cobertura: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface Defeito {
  id: string;
  garantia_id: string;
  titulo: string;
  descricao: string;
  localizacao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'reportado' | 'em_analise' | 'em_correcao' | 'corrigido' | 'verificado';
  data_reportado: string;
  data_correcao?: string;
  data_verificacao?: string;
  responsavel_correcao: string;
  custo_correcao: number;
  observacoes: string;
  fotos: string[];
  created_at: string;
  updated_at: string;
}

export interface ManutencaoPreventiva {
  id: string;
  garantia_id: string;
  titulo: string;
  descricao: string;
  tipo: 'preventiva' | 'corretiva' | 'preditiva';
  frequencia: 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual';
  proxima_manutencao: string;
  ultima_manutencao?: string;
  responsavel: string;
  custo_estimado: number;
  status: 'agendada' | 'em_curso' | 'concluida' | 'atrasada';
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface Seguro {
  id: string;
  garantia_id: string;
  tipo_seguro: 'garantia' | 'responsabilidade' | 'obra' | 'equipamentos';
  seguradora: string;
  apolice: string;
  data_inicio: string;
  data_fim: string;
  valor_segurado: number;
  premio: number;
  cobertura: string;
  exclusoes: string[];
  status: 'ativa' | 'expirada' | 'cancelada';
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface Sinistro {
  id: string;
  seguro_id: string;
  titulo: string;
  descricao: string;
  data_ocorrencia: string;
  data_reportado: string;
  valor_sinistro: number;
  valor_indemnizacao?: number;
  status: 'reportado' | 'em_analise' | 'aprovado' | 'pago' | 'rejeitado';
  observacoes: string;
  documentos: string[];
  created_at: string;
  updated_at: string;
}

export interface PunchList {
  id: string;
  rececao_id: string;
  titulo: string;
  descricao: string;
  localizacao: string;
  categoria: 'acabamentos' | 'instalacoes' | 'estrutura' | 'equipamentos' | 'outros';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  responsavel: string;
  data_limite: string;
  status: 'pendente' | 'em_curso' | 'concluida' | 'verificada';
  data_conclusao?: string;
  data_verificacao?: string;
  observacoes: string;
  fotos: string[];
  created_at: string;
  updated_at: string;
}

export interface EstatisticasRececao {
  total_rececoes: number;
  rececoes_concluidas: number;
  rececoes_com_reservas: number;
  garantias_ativas: number;
  garantias_a_expirar: number;
  defeitos_abertos: number;
  manutencoes_pendentes: number;
  sinistros_ativos: number;
  valor_total_garantias: number;
  custo_total_defeitos: number;
  por_status: { status: string; quantidade: number }[];
  por_tipo_garantia: { tipo: string; quantidade: number }[];
  por_severidade_defeitos: { severidade: string; quantidade: number }[];
  por_categoria_punchlist: { categoria: string; quantidade: number }[];
}

export interface FiltrosRececao {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  tipoRececao?: string;
  responsavel?: string;
  seguradora?: string;
  severidade?: string;
  categoria?: string;
}
