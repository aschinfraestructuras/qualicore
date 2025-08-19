export interface SubmissaoMaterial extends BaseEntity {
  codigo: string; // SM-2024-001
  titulo: string;
  descricao: string;
  
  // Informações do Material
  tipo_material: TipoMaterial;
  categoria: CategoriaMaterial;
  especificacoes_tecnicas: string;
  normas_referencia: string[];
  certificados_necessarios: string[];
  
  // Informações da Submissão
  submissor_id: string;
  submissor_nome: string;
  data_submissao: string;
  prioridade: PrioridadeSubmissao;
  urgencia: UrgenciaSubmissao;
  
  // Estado e Aprovação
  estado: EstadoSubmissao;
  aprovador_id?: string;
  aprovador_nome?: string;
  data_aprovacao?: string;
  data_rejeicao?: string;
  motivo_rejeicao?: string;
  
  // Documentação
  documentos_anexos: DocumentoAnexo[];
  especificacoes_detalhadas: string;
  justificativa_necessidade: string;
  impacto_custo?: number;
  impacto_prazo?: number;
  
  // Workflow
  etapa_atual: EtapaWorkflow;
  historico_aprovacoes: HistoricoAprovacao[];
  comentarios: ComentarioSubmissao[];
  
  // Relacionamentos
  obra_id?: string;
  obra_nome?: string;
  fornecedor_sugerido?: string;
  fornecedor_alternativo?: string;
  
  // Metadados
  tags: string[];
  observacoes?: string;
  data_limite_aprovacao?: string;
}

export interface DocumentoAnexo {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  data_upload: string;
  descricao?: string;
}

export interface HistoricoAprovacao {
  id: string;
  data: string;
  aprovador_id: string;
  aprovador_nome: string;
  acao: 'aprovado' | 'rejeitado' | 'solicitado_alteracao' | 'encaminhado';
  comentario?: string;
  alteracoes_solicitadas?: string[];
}

export interface ComentarioSubmissao {
  id: string;
  data: string;
  autor_id: string;
  autor_nome: string;
  comentario: string;
  tipo: 'pergunta' | 'sugestao' | 'observacao' | 'correcao';
  resolvido: boolean;
}

export interface WorkflowAprovacao {
  id: string;
  nome: string;
  descricao: string;
  etapas: EtapaWorkflow[];
  aprovadores_por_etapa: Record<string, string[]>; // etapa_id -> aprovadores
  tempo_limite_etapa: Record<string, number>; // etapa_id -> dias
  ativo: boolean;
}

export interface EtapaWorkflow {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  tipo_aprovacao: 'unica' | 'multipla' | 'paralela';
  aprovadores_obrigatorios: number;
  aprovadores_opcionais: number;
  criterios_aprovacao: string[];
  acoes_disponiveis: AcaoWorkflow[];
}

export interface AcaoWorkflow {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'aprovacao' | 'rejeicao' | 'solicitacao_alteracao' | 'encaminhamento';
  condicoes: string[];
  proxima_etapa?: string;
}

// Tipos de Material
export type TipoMaterial = 
  | 'betao' 
  | 'aco' 
  | 'agregado' 
  | 'cimento' 
  | 'madeira' 
  | 'vidro' 
  | 'isolamento' 
  | 'impermeabilizacao' 
  | 'pavimento' 
  | 'sinalizacao' 
  | 'equipamento' 
  | 'ferramenta' 
  | 'outro';

export type CategoriaMaterial = 
  | 'estrutural' 
  | 'acabamento' 
  | 'instalacao' 
  | 'equipamento' 
  | 'consumivel' 
  | 'seguranca' 
  | 'ambiente' 
  | 'outro';

export type PrioridadeSubmissao = 'baixa' | 'media' | 'alta' | 'critica';
export type UrgenciaSubmissao = 'normal' | 'urgente' | 'muito_urgente';
export type EstadoSubmissao = 
  | 'rascunho' 
  | 'submetido' 
  | 'em_revisao' 
  | 'aguardando_aprovacao' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'solicitado_alteracao' 
  | 'cancelado' 
  | 'concluido';

// Constantes para UI
export const TIPOS_MATERIAL: Record<TipoMaterial, string> = {
  betao: 'Betão',
  aco: 'Aço',
  agregado: 'Agregado',
  cimento: 'Cimento',
  madeira: 'Madeira',
  vidro: 'Vidro',
  isolamento: 'Isolamento',
  impermeabilizacao: 'Impermeabilização',
  pavimento: 'Pavimento',
  sinalizacao: 'Sinalização',
  equipamento: 'Equipamento',
  ferramenta: 'Ferramenta',
  outro: 'Outro'
};

export const CATEGORIAS_MATERIAL: Record<CategoriaMaterial, string> = {
  estrutural: 'Estrutural',
  acabamento: 'Acabamento',
  instalacao: 'Instalação',
  equipamento: 'Equipamento',
  consumivel: 'Consumível',
  seguranca: 'Segurança',
  ambiente: 'Ambiente',
  outro: 'Outro'
};

export const PRIORIDADES_SUBMISSAO: Record<PrioridadeSubmissao, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica'
};

export const URGENCIAS_SUBMISSAO: Record<UrgenciaSubmissao, string> = {
  normal: 'Normal',
  urgente: 'Urgente',
  muito_urgente: 'Muito Urgente'
};

export const ESTADOS_SUBMISSAO: Record<EstadoSubmissao, string> = {
  rascunho: 'Rascunho',
  submetido: 'Submetido',
  em_revisao: 'Em Revisão',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  solicitado_alteracao: 'Solicitado Alteração',
  cancelado: 'Cancelado',
  concluido: 'Concluído'
};

// Interfaces para filtros e estatísticas
export interface FiltrosSubmissao {
  estado?: EstadoSubmissao;
  tipo_material?: TipoMaterial;
  categoria?: CategoriaMaterial;
  prioridade?: PrioridadeSubmissao;
  submissor_id?: string;
  aprovador_id?: string;
  data_inicio?: string;
  data_fim?: string;
  obra_id?: string;
  tags?: string[];
}

export interface EstatisticasSubmissao {
  total_submissoes: number;
  submissoes_por_estado: Record<EstadoSubmissao, number>;
  submissoes_por_tipo: Record<TipoMaterial, number>;
  submissoes_por_prioridade: Record<PrioridadeSubmissao, number>;
  tempo_medio_aprovacao: number;
  taxa_aprovacao: number;
  submissoes_urgentes: number;
  submissoes_atrasadas: number;
  top_submissores: Array<{ id: string; nome: string; total: number }>;
  top_aprovadores: Array<{ id: string; nome: string; total: number }>;
  submissoes_mes_atual: number;
  submissoes_mes_anterior: number;
  crescimento_mensal: number;
}

// Interface base para entidades
interface BaseEntity {
  id: string;
  criado_em: string;
  atualizado_em: string;
}
