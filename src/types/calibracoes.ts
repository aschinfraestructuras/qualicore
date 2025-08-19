export interface Equipamento {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  categoria: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  localizacao: string;
  departamento: string;
  responsavel: string;
  data_aquisicao: string;
  data_instalacao: string;
  estado: 'ativo' | 'inativo' | 'manutencao' | 'avariado' | 'obsoleto';
  status_operacional: 'operacional' | 'nao_operacional' | 'em_teste' | 'em_calibracao';
  fabricante: string;
  fornecedor: string;
  garantia_ate: string;
  vida_util_anos: number;
  valor_aquisicao: number;
  valor_atual: number;
  observacoes: string;
  fotos: FotoEquipamento[];
  documentos: DocumentoEquipamento[];
  created_at: string;
  updated_at: string;
}

export interface Calibracao {
  id: string;
  equipamento_id: string;
  equipamento?: Equipamento;
  numero_calibracao: string;
  tipo_calibracao: 'inicial' | 'periodica' | 'especial' | 'recalibracao';
  data_calibracao: string;
  data_proxima_calibracao: string;
  laboratorio: string;
  tecnico_responsavel: string;
  certificado_calibracao: string;
  resultado: 'aprovado' | 'reprovado' | 'condicional';
  incerteza_medicao: number;
  unidade_incerteza: string;
  pontos_calibracao: PontoCalibracao[];
  observacoes: string;
  custo: number;
  documentos: DocumentoCalibracao[];
  fotos: FotoCalibracao[];
  created_at: string;
  updated_at: string;
}

export interface PontoCalibracao {
  id: string;
  calibracao_id: string;
  ponto_medicao: number;
  valor_nominal: number;
  valor_medido: number;
  erro: number;
  incerteza: number;
  unidade: string;
  observacoes: string;
}

export interface Manutencao {
  id: string;
  equipamento_id: string;
  equipamento?: Equipamento;
  tipo_manutencao: 'preventiva' | 'corretiva' | 'emergencia' | 'melhoria';
  data_manutencao: string;
  data_proxima_manutencao: string;
  descricao: string;
  acoes_realizadas: string;
  pecas_substituidas: string;
  custo: number;
  tecnico_responsavel: string;
  fornecedor: string;
  resultado: 'concluida' | 'em_andamento' | 'cancelada' | 'pendente';
  observacoes: string;
  documentos: DocumentoManutencao[];
  fotos: FotoManutencao[];
  created_at: string;
  updated_at: string;
}

export interface Inspecao {
  id: string;
  equipamento_id: string;
  equipamento?: Equipamento;
  data_inspecao: string;
  tipo_inspecao: 'rotina' | 'periodica' | 'especial' | 'rececao';
  inspetor: string;
  resultado: 'aprovado' | 'reprovado' | 'condicional' | 'pendente';
  criterios_avaliados: CriterioInspecao[];
  observacoes: string;
  acoes_corretivas: string;
  duracao_horas: number;
  fotos: FotoInspecao[];
  documentos: DocumentoInspecao[];
  created_at: string;
  updated_at: string;
}

export interface CriterioInspecao {
  id: string;
  inspecao_id: string;
  criterio: string;
  resultado: 'conforme' | 'nao_conforme' | 'nao_aplicavel';
  observacoes: string;
}

export interface FotoEquipamento {
  id: string;
  equipamento_id: string;
  nome: string;
  url: string;
  path: string;
  descricao: string;
  data_upload: string;
  tamanho: number;
  tipo: string;
}

export interface DocumentoEquipamento {
  id: string;
  equipamento_id: string;
  nome: string;
  url: string;
  path: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  descricao: string;
}

export interface FotoCalibracao {
  id: string;
  calibracao_id: string;
  nome: string;
  url: string;
  path: string;
  descricao: string;
  data_upload: string;
  tamanho: number;
  tipo: string;
}

export interface DocumentoCalibracao {
  id: string;
  calibracao_id: string;
  nome: string;
  url: string;
  path: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  descricao: string;
}

export interface FotoManutencao {
  id: string;
  manutencao_id: string;
  nome: string;
  url: string;
  path: string;
  descricao: string;
  data_upload: string;
  tamanho: number;
  tipo: string;
}

export interface DocumentoManutencao {
  id: string;
  manutencao_id: string;
  nome: string;
  url: string;
  path: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  descricao: string;
}

export interface FotoInspecao {
  id: string;
  inspecao_id: string;
  nome: string;
  url: string;
  path: string;
  descricao: string;
  data_upload: string;
  tamanho: number;
  tipo: string;
}

export interface DocumentoInspecao {
  id: string;
  inspecao_id: string;
  nome: string;
  url: string;
  path: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  descricao: string;
}

export interface CalibracoesStats {
  total_equipamentos: number;
  equipamentos_ativos: number;
  equipamentos_manutencao: number;
  equipamentos_avariados: number;
  calibracoes_vencidas: number;
  calibracoes_proximas_vencer: number;
  manutencoes_pendentes: number;
  inspecoes_pendentes: number;
  valor_total_equipamentos: number;
  custo_total_calibracoes: number;
  custo_total_manutencoes: number;
}

export interface FiltrosEquipamento {
  codigo?: string;
  nome?: string;
  tipo?: string;
  categoria?: string;
  estado?: string;
  status_operacional?: string;
  departamento?: string;
  responsavel?: string;
  fabricante?: string;
  data_aquisicao_inicio?: string;
  data_aquisicao_fim?: string;
}

export interface FiltrosCalibracao {
  equipamento_id?: string;
  tipo_calibracao?: string;
  resultado?: string;
  laboratorio?: string;
  data_calibracao_inicio?: string;
  data_calibracao_fim?: string;
  data_proxima_calibracao_inicio?: string;
  data_proxima_calibracao_fim?: string;
}

export interface FiltrosManutencao {
  equipamento_id?: string;
  tipo_manutencao?: string;
  resultado?: string;
  tecnico_responsavel?: string;
  fornecedor?: string;
  data_manutencao_inicio?: string;
  data_manutencao_fim?: string;
}

export interface FiltrosInspecao {
  equipamento_id?: string;
  tipo_inspecao?: string;
  resultado?: string;
  inspetor?: string;
  data_inspecao_inicio?: string;
  data_inspecao_fim?: string;
}

export interface RelatorioCalibracoesOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo: string;
  subtitulo: string;
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  filtros?: string[];
  periodo_inicio?: string;
  periodo_fim?: string;
}

export interface RelatorioEquipamentosOptions {
  tipo: 'executivo' | 'filtrado' | 'comparativo' | 'individual';
  titulo: string;
  subtitulo: string;
  equipamentos: Equipamento[];
  filtros?: string[];
  categoria?: string;
  departamento?: string;
}

export interface CalibracoesExportData {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  stats: CalibracoesStats;
}

export const TIPOS_EQUIPAMENTO = [
  { value: 'medicao', label: 'Equipamento de Medição', color: 'bg-blue-100 text-blue-800' },
  { value: 'teste', label: 'Equipamento de Teste', color: 'bg-green-100 text-green-800' },
  { value: 'laboratorio', label: 'Equipamento de Laboratório', color: 'bg-purple-100 text-purple-800' },
  { value: 'producao', label: 'Equipamento de Produção', color: 'bg-orange-100 text-orange-800' },
  { value: 'seguranca', label: 'Equipamento de Segurança', color: 'bg-red-100 text-red-800' },
  { value: 'informatica', label: 'Equipamento Informático', color: 'bg-gray-100 text-gray-800' },
  { value: 'outros', label: 'Outros', color: 'bg-gray-100 text-gray-600' }
];

export const CATEGORIAS_EQUIPAMENTO = [
  { value: 'eletrico', label: 'Elétrico', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'mecanico', label: 'Mecânico', color: 'bg-blue-100 text-blue-800' },
  { value: 'eletronico', label: 'Eletrónico', color: 'bg-green-100 text-green-800' },
  { value: 'hidraulico', label: 'Hidráulico', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'pneumatico', label: 'Pneumático', color: 'bg-purple-100 text-purple-800' },
  { value: 'optico', label: 'Óptico', color: 'bg-pink-100 text-pink-800' },
  { value: 'quimico', label: 'Químico', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'outros', label: 'Outros', color: 'bg-gray-100 text-gray-600' }
];

export const ESTADOS_EQUIPAMENTO = [
  { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
  { value: 'inativo', label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  { value: 'manutencao', label: 'Em Manutenção', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'avariado', label: 'Avariado', color: 'bg-red-100 text-red-800' },
  { value: 'obsoleto', label: 'Obsoleto', color: 'bg-gray-100 text-gray-600' }
];

export const STATUS_OPERACIONAL = [
  { value: 'operacional', label: 'Operacional', color: 'bg-green-100 text-green-800' },
  { value: 'nao_operacional', label: 'Não Operacional', color: 'bg-red-100 text-red-800' },
  { value: 'em_teste', label: 'Em Teste', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'em_calibracao', label: 'Em Calibração', color: 'bg-blue-100 text-blue-800' }
];

export const TIPOS_CALIBRACAO = [
  { value: 'inicial', label: 'Calibração Inicial', color: 'bg-blue-100 text-blue-800' },
  { value: 'periodica', label: 'Calibração Periódica', color: 'bg-green-100 text-green-800' },
  { value: 'especial', label: 'Calibração Especial', color: 'bg-purple-100 text-purple-800' },
  { value: 'recalibracao', label: 'Recalibração', color: 'bg-orange-100 text-orange-800' }
];

export const RESULTADOS_CALIBRACAO = [
  { value: 'aprovado', label: 'Aprovado', color: 'bg-green-100 text-green-800' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-red-100 text-red-800' },
  { value: 'condicional', label: 'Condicional', color: 'bg-yellow-100 text-yellow-800' }
];

export const TIPOS_MANUTENCAO = [
  { value: 'preventiva', label: 'Preventiva', color: 'bg-green-100 text-green-800' },
  { value: 'corretiva', label: 'Corretiva', color: 'bg-red-100 text-red-800' },
  { value: 'emergencia', label: 'Emergência', color: 'bg-orange-100 text-orange-800' },
  { value: 'melhoria', label: 'Melhoria', color: 'bg-blue-100 text-blue-800' }
];

export const RESULTADOS_MANUTENCAO = [
  { value: 'concluida', label: 'Concluída', color: 'bg-green-100 text-green-800' },
  { value: 'em_andamento', label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
  { value: 'pendente', label: 'Pendente', color: 'bg-gray-100 text-gray-800' }
];

export const TIPOS_INSPECAO = [
  { value: 'rotina', label: 'Rotina', color: 'bg-blue-100 text-blue-800' },
  { value: 'periodica', label: 'Periódica', color: 'bg-green-100 text-green-800' },
  { value: 'especial', label: 'Especial', color: 'bg-purple-100 text-purple-800' },
  { value: 'rececao', label: 'Receção', color: 'bg-orange-100 text-orange-800' }
];

export const RESULTADOS_INSPECAO = [
  { value: 'aprovado', label: 'Aprovado', color: 'bg-green-100 text-green-800' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-red-100 text-red-800' },
  { value: 'condicional', label: 'Condicional', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pendente', label: 'Pendente', color: 'bg-gray-100 text-gray-800' }
];
