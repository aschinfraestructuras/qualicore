export interface Armadura {
  id: string;
  codigo: string;
  tipo: 'feixe' | 'estribo' | 'cintas' | 'armadura_negativa' | 'armadura_positiva' | 'outro';
  tipo_outro?: string;
  diametro: number;
  comprimento: number;
  largura?: number;
  altura?: number;
  quantidade: number;
  peso_unitario: number;
  peso_total: number;
  // Novos campos solicitados
  numero_colada: string;
  numero_guia_remessa: string;
  fabricante: string;
  fornecedor_aco_obra: string;
  // Rastreamento de aplicação
  local_aplicacao: string;
  zona_aplicacao: string;
  lote_aplicacao: string;
  // Campos existentes
  fornecedor_id?: string;
  fornecedor_nome?: string;
  obra_id?: string;
  obra_nome?: string;
  zona: string;
  estado: 'pendente' | 'em_analise' | 'aprovado' | 'reprovado' | 'instalado' | 'concluido';
  data_rececao: string;
  data_instalacao?: string;
  certificado_qualidade?: string;
  ensaios_realizados: string[];
  fotos: FotoArmadura[];
  documentos: DocumentoArmadura[];
  observacoes?: string;
  responsavel: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FotoArmadura {
  id: string;
  nome: string;
  url: string;
  tipo: 'rececao' | 'instalacao' | 'detalhe' | 'problema' | 'outro';
  descricao?: string;
  data_upload: string;
  tamanho: number;
}

export interface DocumentoArmadura {
  id: string;
  nome: string;
  url: string;
  tipo: 'certificado' | 'relatorio_ensaio' | 'ficha_tecnica' | 'nota_encomenda' | 'outro';
  descricao?: string;
  data_upload: string;
  tamanho: number;
}

export interface ArmaduraFormData {
  codigo: string;
  tipo: 'feixe' | 'estribo' | 'cintas' | 'armadura_negativa' | 'armadura_positiva' | 'outro';
  tipo_outro?: string;
  diametro: number;
  comprimento: number;
  largura?: number;
  altura?: number;
  quantidade: number;
  peso_unitario: number;
  // Novos campos solicitados
  numero_colada: string;
  numero_guia_remessa: string;
  fabricante: string;
  fornecedor_aco_obra: string;
  // Rastreamento de aplicação
  local_aplicacao: string;
  zona_aplicacao: string;
  lote_aplicacao: string;
  // Campos existentes
  fornecedor_id?: string;
  obra_id?: string;
  zona: string;
  estado: 'pendente' | 'em_analise' | 'aprovado' | 'reprovado' | 'instalado' | 'concluido';
  data_rececao: string;
  data_instalacao?: string;
  certificado_qualidade?: string;
  ensaios_realizados: string[];
  observacoes?: string;
  responsavel: string;
}

export interface ArmaduraFilters {
  search: string;
  tipo: string;
  estado: string;
  zona: string;
  fornecedor: string;
  obra: string;
  fabricante: string;
  numero_colada: string;
  numero_guia_remessa: string;
  local_aplicacao: string;
  dataInicio: string;
  dataFim: string;
  diametroMin: number;
  diametroMax: number;
}

export interface ArmaduraStats {
  total_armaduras: number;
  armaduras_aprovadas: number;
  armaduras_pendentes: number;
  armaduras_reprovadas: number;
  armaduras_instaladas: number;
  peso_total: number;
  valor_estimado: number;
  conformidade_media: number;
  // Novas estatísticas
  total_lotes: number;
  fabricantes_unicos: number;
  zonas_ativas: number;
  peso_por_diametro: { [key: number]: number };
  estado_distribuicao: { [key: string]: number };
  aplicacao_por_zona: { [key: string]: number };
}
