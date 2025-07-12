// Tipos base para todos os módulos
export interface BaseEntity {
  id: string;
  codigo: string;
  data_criacao: string;
  data_atualizacao: string;
  responsavel: string;
  zona: string;
  estado: 'pendente' | 'em_analise' | 'aprovado' | 'reprovado' | 'concluido';
  observacoes?: string;
  anexos?: Anexo[];
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  data_upload: string;
  entidade_id: string;
  entidade_tipo: string;
}

// Tipos específicos para cada módulo
export interface Documento extends BaseEntity {
  tipo: 'projeto' | 'especificacao' | 'relatorio' | 'certificado' | 'outro';
  versao: string;
  data_validade?: string;
  fornecedor_id?: string;
}

export interface Ensaio extends BaseEntity {
  tipo: 'resistencia' | 'densidade' | 'absorcao' | 'durabilidade' | 'outro';
  material_id: string;
  resultado: string;
  valor_obtido: number;
  valor_esperado: number;
  unidade: string;
  laboratorio: string;
  data_ensaio: string;
  conforme: boolean;
}

export interface Checklist extends BaseEntity {
  tipo: 'inspecao' | 'verificacao' | 'aceitacao' | 'outro';
  itens: ItemChecklist[];
  percentual_conformidade: number;
  data_inspecao: string;
  inspetor: string;
}

export interface ItemChecklist {
  id: string;
  descricao: string;
  conforme: boolean;
  observacoes?: string;
  foto?: string;
}

export interface Material extends BaseEntity {
  nome: string;
  tipo: 'betao' | 'aco' | 'agregado' | 'cimento' | 'outro';
  fornecedor_id: string;
  certificado_id?: string;
  data_rececao: string;
  quantidade: number;
  unidade: string;
  lote: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  nif: string;
  morada: string;
  telefone: string;
  email: string;
  contacto: string;
  data_registo: string;
  estado: 'ativo' | 'inativo';
}

export interface NaoConformidade extends BaseEntity {
  tipo: 'material' | 'execucao' | 'documentacao' | 'seguranca' | 'outro';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  data_deteccao: string;
  data_resolucao?: string;
  acao_corretiva?: string;
  responsavel_resolucao?: string;
  custo_estimado?: number;
  relacionado_ensaio_id?: string;
  relacionado_material_id?: string;
}

export interface Relatorio {
  id: string;
  tipo: 'mensal' | 'trimestral' | 'anual' | 'especifico';
  titulo: string;
  data_inicio: string;
  data_fim: string;
  zona?: string;
  conteudo: RelatorioConteudo;
  data_geracao: string;
  gerado_por: string;
}

export interface RelatorioConteudo {
  resumo_executivo: string;
  estatisticas: {
    total_documentos: number;
    total_ensaios: number;
    total_checklists: number;
    total_materiais: number;
    total_nc: number;
    percentual_conformidade: number;
  };
  nao_conformidades: NaoConformidade[];
  ensaios_nao_conformes: Ensaio[];
  recomendacoes: string[];
}

// Tipos para filtros e busca
export interface Filtros {
  data_inicio?: string;
  data_fim?: string;
  zona?: string;
  estado?: string;
  tipo?: string;
  responsavel?: string;
}

// Tipos para o estado da aplicação
export interface AppState {
  user: User | null;
  currentModule: string;
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'qualidade' | 'producao' | 'fiscal' | 'admin';
  avatar?: string;
}

export interface Notification {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
} 