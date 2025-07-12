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
  tipo: string; // Mudado para string para permitir tipos dinâmicos
  material_id: string;
  resultado: string;
  valor_obtido: number;
  valor_esperado: number;
  unidade: string;
  laboratorio: string;
  data_ensaio: string;
  conforme: boolean;
  seguimento?: SeguimentoEnsaio[];
  contextoAdicional?: ContextoAdicional[];
}

export interface SeguimentoEnsaio {
  id: string;
  data: string;
  descricao: string;
  responsavel: string;
  resultado: string;
  anexo?: File | null;
}

export interface ContextoAdicional {
  campo: string;
  valor: string;
}

export interface Checklist extends BaseEntity {
  obra: string;
  titulo: string;
  status: 'em_andamento' | 'concluido' | 'aprovado' | 'reprovado';
  pontos: PontoInspecao[];
  anexos_gerais?: AnexoChecklist[];
  observacoes?: string;
}

export interface PontoInspecao {
  id: string;
  descricao: string;
  tipo: string;
  localizacao: string;
  responsavel: string;
  status: 'pendente' | 'aprovado' | 'reprovado' | 'correcao';
  data_inspecao: string;
  linha_tempo: EventoPonto[];
  anexos?: AnexoChecklist[];
  comentarios?: ComentarioChecklist[];
}

export interface EventoPonto {
  id: string;
  data: string;
  acao: 'criado' | 'inspecionado' | 'aprovado' | 'reprovado' | 'comentario' | 'anexo' | 'correcao';
  responsavel: string;
  detalhes: string;
  anexo?: AnexoChecklist;
}

export interface AnexoChecklist {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  data_upload: string;
  ponto_id?: string;
  checklist_id?: string;
}

export interface ComentarioChecklist {
  id: string;
  autor: string;
  data: string;
  texto: string;
  ponto_id: string;
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

// Tipos para Gestão de Obras/Projetos
export interface Obra extends BaseEntity {
  codigo: string;
  nome: string;
  cliente: string;
  localizacao: string;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real?: string;
  valor_contrato: number;
  valor_executado: number;
  percentual_execucao: number;
  status: 'planeamento' | 'em_execucao' | 'paralisada' | 'concluida' | 'cancelada';
  tipo_obra: 'residencial' | 'comercial' | 'industrial' | 'infraestrutura' | 'reabilitacao' | 'outro';
  categoria: 'pequena' | 'media' | 'grande' | 'mega';
  responsavel_tecnico: string;
  coordenador_obra: string;
  fiscal_obra: string;
  engenheiro_responsavel: string;
  arquiteto: string;
  zonas: ZonaObra[];
  fases: FaseObra[];
  equipas: EquipaObra[];
  fornecedores_principais: string[];
  riscos: RiscoObra[];
  indicadores: IndicadorObra[];
  observacoes?: string;
}

export interface ZonaObra {
  id: string;
  nome: string;
  descricao: string;
  area: number;
  unidade_area: 'm2' | 'm3' | 'un';
  percentual_execucao: number;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real?: string;
  status: 'nao_iniciada' | 'em_execucao' | 'concluida' | 'paralisada';
  responsavel: string;
  materiais_utilizados: MaterialZona[];
  ensaios_realizados: string[];
  checklists_executados: string[];
  nao_conformidades: string[];
  observacoes?: string;
}

export interface FaseObra {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  percentual_execucao: number;
  status: 'nao_iniciada' | 'em_execucao' | 'concluida' | 'atrasada' | 'paralisada';
  dependencias: string[];
  recursos_necessarios: RecursoFase[];
  custo_previsto: number;
  custo_real?: number;
  observacoes?: string;
}

export interface EquipaObra {
  id: string;
  nome: string;
  tipo: 'construcao' | 'eletrica' | 'mecanica' | 'acabamentos' | 'especializada' | 'outro';
  lider: string;
  membros: MembroEquipa[];
  especialidades: string[];
  data_inicio: string;
  data_fim?: string;
  status: 'ativa' | 'inativa' | 'concluida';
  zona_atual?: string;
  fase_atual?: string;
  observacoes?: string;
}

export interface MembroEquipa {
  id: string;
  nome: string;
  funcao: string;
  especialidade: string;
  telefone: string;
  email: string;
  data_entrada: string;
  data_saida?: string;
  status: 'ativo' | 'inativo';
  certificacoes: string[];
  observacoes?: string;
}

export interface MaterialZona {
  material_id: string;
  quantidade_prevista: number;
  quantidade_utilizada: number;
  unidade: string;
  custo_unitario: number;
  custo_total: number;
  fornecedor_id: string;
  data_entrega: string;
  localizacao_armazenamento: string;
  observacoes?: string;
}

export interface RecursoFase {
  tipo: 'material' | 'equipamento' | 'mao_obra' | 'servico' | 'outro';
  descricao: string;
  quantidade: number;
  unidade: string;
  custo_unitario: number;
  custo_total: number;
  fornecedor_id?: string;
  data_necessaria: string;
  status: 'pendente' | 'disponivel' | 'utilizado';
  observacoes?: string;
}

export interface RiscoObra {
  id: string;
  descricao: string;
  categoria: 'tecnico' | 'ambiental' | 'seguranca' | 'financeiro' | 'prazo' | 'qualidade' | 'outro';
  probabilidade: 'baixa' | 'media' | 'alta' | 'critica';
  impacto: 'baixo' | 'medio' | 'alto' | 'critico';
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico';
  data_identificacao: string;
  responsavel: string;
  medidas_preventivas: string[];
  medidas_corretivas?: string[];
  status: 'ativo' | 'mitigado' | 'resolvido' | 'ocorreu';
  custo_estimado?: number;
  observacoes?: string;
}

export interface IndicadorObra {
  id: string;
  nome: string;
  tipo: 'qualidade' | 'prazo' | 'custo' | 'seguranca' | 'ambiental' | 'satisfacao' | 'outro';
  unidade: string;
  valor_meta: number;
  valor_atual: number;
  percentual_atingimento: number;
  frequencia_medicao: 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'anual';
  responsavel: string;
  data_ultima_medicao: string;
  historico: MedicaoIndicador[];
  status: 'dentro_meta' | 'acima_meta' | 'abaixo_meta' | 'critico';
  observacoes?: string;
}

export interface MedicaoIndicador {
  id: string;
  data: string;
  valor: number;
  responsavel: string;
  observacoes?: string;
}

export interface CronogramaObra {
  id: string;
  obra_id: string;
  versao: string;
  data_criacao: string;
  data_atualizacao: string;
  atividades: AtividadeCronograma[];
  observacoes?: string;
}

export interface AtividadeCronograma {
  id: string;
  codigo: string;
  descricao: string;
  duracao_prevista: number;
  duracao_real?: number;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  percentual_execucao: number;
  status: 'nao_iniciada' | 'em_execucao' | 'concluida' | 'atrasada' | 'paralisada';
  dependencias: string[];
  responsavel: string;
  recursos: string[];
  custo_previsto: number;
  custo_real?: number;
  observacoes?: string;
}

export interface RelatorioObra {
  id: string;
  obra_id: string;
  tipo: 'diario' | 'semanal' | 'mensal' | 'trimestral' | 'final';
  periodo_inicio: string;
  periodo_fim: string;
  gerado_por: string;
  data_geracao: string;
  conteudo: ConteudoRelatorioObra;
  anexos?: Anexo[];
}

export interface ConteudoRelatorioObra {
  resumo_executivo: string;
  progresso_fisico: {
    percentual_geral: number;
    percentual_por_zona: Record<string, number>;
    atividades_concluidas: string[];
    atividades_em_execucao: string[];
    atividades_atrasadas: string[];
  };
  progresso_financeiro: {
    valor_contrato: number;
    valor_executado: number;
    percentual_execucao: number;
    custos_previstos: number;
    custos_reais: number;
    variacao: number;
  };
  qualidade: {
    ensaios_realizados: number;
    ensaios_conformes: number;
    percentual_conformidade: number;
    nao_conformidades: number;
    nao_conformidades_resolvidas: number;
    checklists_executados: number;
    percentual_checklists_aprovados: number;
  };
  seguranca: {
    acidentes: number;
    incidentes: number;
    horas_trabalho: number;
    formacoes_realizadas: number;
    inspecoes_seguranca: number;
  };
  ambiente: {
    residuos_gerados: number;
    residuos_reciclados: number;
    percentual_reciclagem: number;
    consumos_energia: number;
    consumos_agua: number;
  };
  recursos_humanos: {
    total_equipas: number;
    total_membros: number;
    horas_trabalho: number;
    formacoes_realizadas: number;
    certificacoes_obtidas: number;
  };
  fornecedores: {
    total_fornecedores: number;
    fornecedores_ativos: number;
    materiais_entregues: number;
    servicos_executados: number;
  };
  riscos: {
    total_riscos: number;
    riscos_ativos: number;
    riscos_mitigados: number;
    riscos_ocorridos: number;
  };
  problemas_identificados: string[];
  acoes_corretivas: string[];
  proximos_passos: string[];
  observacoes: string;
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