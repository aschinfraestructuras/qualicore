// Removido o import que causava conflito de tipos
// Tipos base para todos os módulos
export interface BaseEntity {
  id: string;
  codigo: string;
  data_criacao: string;
  data_atualizacao: string;
  responsavel: string;
  zona: string;
  estado: "pendente" | "em_analise" | "aprovado" | "reprovado" | "concluido";
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

export interface EventoDocumento {
  id: string;
  data: string;
  tipo:
    | "criacao"
    | "revisao"
    | "aprovacao"
    | "reprovacao"
    | "distribuicao"
    | "arquivamento"
    | "comentario"
    | "anexo"
    | "rfi_solicitacao"
    | "rfi_resposta"
    | "outro";
  responsavel: string;
  descricao: string;
  detalhes?: string;
  anexo?: Anexo;
  versao?: string;
}

// Tipos específicos para cada módulo
export interface Documento extends BaseEntity {
  tipo:
    | "projeto"
    | "especificacao"
    | "relatorio"
    | "certificado"
    | "rfi"
    | "procedimento"
    | "plano_ensaio"
    | "plano_qualidade"
    | "manual"
    | "instrucao_trabalho"
    | "formulario"
    | "registro"
    | "outro";
  tipo_outro?: string;
  versao: string;
  data_validade?: string;
  data_aprovacao?: string;
  data_revisao?: string;
  aprovador?: string;
  revisor?: string;

  // Campos específicos por tipo
  categoria?:
    | "tecnico"
    | "administrativo"
    | "seguranca"
    | "ambiente"
    | "qualidade"
    | "comercial"
    | "outro";
  categoria_outro?: string;

  // Para RFI (Request for Information)
  rfi?: {
    numero_rfi: string;
    solicitante: string;
    data_solicitacao: string;
    data_resposta?: string;
    prioridade: "baixa" | "media" | "alta" | "urgente";
    status: "pendente" | "em_analise" | "respondido" | "fechado";
    impacto_custo?: number;
    impacto_prazo?: number;
    resposta?: string;
    anexos_resposta?: Anexo[];
  };

  // Para Procedimentos
  procedimento?: {
    escopo: string;
    responsabilidades: string[];
    recursos_necessarios: string[];
    criterios_aceitacao: string[];
    registros_obrigatorios: string[];
    frequencia_revisao: string;
    ultima_revisao?: string;
    proxima_revisao?: string;
  };

  // Para Planos de Ensaio
  plano_ensaio?: {
    material_ensaio: string;
    tipo_ensaio: string;
    normas_referencia: string[];
    equipamentos_necessarios: string[];
    laboratorio_responsavel: string;
    frequencia_ensaios: string;
    criterios_aceitacao: string;
    acoes_nao_conformidade: string[];
  };

  // Para Planos de Qualidade
  plano_qualidade?: {
    escopo_obra: string;
    objetivos_qualidade: string[];
    responsabilidades_qualidade: string[];
    recursos_qualidade: string[];
    controlos_qualidade: string[];
    indicadores_qualidade: string[];
    auditorias_planeadas: string[];
    acoes_melhoria: string[];
  };

  // Integração com outros módulos
  relacionado_obra_id?: string;
  relacionado_obra_outro?: string;
  relacionado_zona_id?: string;
  relacionado_zona_outro?: string;
  relacionado_ensaio_id?: string;
  relacionado_ensaio_outro?: string;
  relacionado_material_id?: string;
  relacionado_material_outro?: string;
  relacionado_fornecedor_id?: string;
  relacionado_fornecedor_outro?: string;
  relacionado_checklist_id?: string;
  relacionado_checklist_outro?: string;

  // Timeline e histórico
  timeline: EventoDocumento[];

  // Anexos específicos
  anexos_principal?: Anexo[];
  anexos_apendices?: Anexo[];
  anexos_revisoes?: Anexo[];

  // Campos adicionais
  observacoes?: string;
  palavras_chave?: string[];
  classificacao_confidencialidade?:
    | "publico"
    | "interno"
    | "confidencial"
    | "restrito";
  distribuicao?: string[];
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
  status: "em_andamento" | "concluido" | "aprovado" | "reprovado";
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
  status: "pendente" | "aprovado" | "reprovado" | "correcao";
  data_inspecao: string;
  linha_tempo: EventoPonto[];
  anexos?: AnexoChecklist[];
  comentarios?: ComentarioChecklist[];
}

export interface EventoPonto {
  id: string;
  data: string;
  acao:
    | "criado"
    | "inspecionado"
    | "aprovado"
    | "reprovado"
    | "comentario"
    | "anexo"
    | "correcao";
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
  tipo: "betao" | "aco" | "agregado" | "cimento" | "outro";
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
  estado: "ativo" | "inativo";
}

export interface NaoConformidade extends BaseEntity {
  // Informações básicas
  tipo:
    | "material"
    | "execucao"
    | "documentacao"
    | "seguranca"
    | "ambiente"
    | "qualidade"
    | "prazo"
    | "custo"
    | "outro";
  tipo_outro?: string;
  severidade: "baixa" | "media" | "alta" | "critica";
  categoria:
    | "auditoria"
    | "inspecao"
    | "reclamacao"
    | "acidente"
    | "incidente"
    | "desvio"
    | "outro";
  categoria_outro?: string;

  // Datas importantes
  data_deteccao: string;
  data_resolucao?: string;
  data_limite_resolucao?: string;
  data_verificacao_eficacia?: string;

  // Descrição e contexto
  descricao: string;
  causa_raiz?: string;
  impacto: "baixo" | "medio" | "alto" | "critico";
  area_afetada: string;

  // Responsabilidades
  responsavel_deteccao: string;
  responsavel_resolucao?: string;
  responsavel_verificacao?: string;

  // Ações
  acao_corretiva?: string;
  acao_preventiva?: string;
  medidas_implementadas?: string[];

  // Custos
  custo_estimado?: number;
  custo_real?: number;
  custo_preventivo?: number;

  // Integração com outros módulos
  relacionado_ensaio_id?: string;
  relacionado_ensaio_outro?: string;
  relacionado_material_id?: string;
  relacionado_material_outro?: string;
  relacionado_checklist_id?: string;
  relacionado_checklist_outro?: string;
  relacionado_documento_id?: string;
  relacionado_fornecedor_id?: string;
  relacionado_fornecedor_outro?: string;
  relacionado_obra_id?: string;
  relacionado_obra_outro?: string;
  relacionado_zona_id?: string;
  relacionado_zona_outro?: string;

  // Auditoria relacionada
  auditoria_id?: string;
  auditoria_outro?: string;

  // Timeline e eventos
  timeline: EventoNaoConformidade[];

  // Verificação de eficácia
  verificacao_eficacia?: VerificacaoEficacia;

  // Anexos específicos
  anexos_evidencia?: Anexo[];
  anexos_corretiva?: Anexo[];
  anexos_verificacao?: Anexo[];

  // Campos adicionais
  observacoes?: string;
  lições_aprendidas?: string;
  recomendacoes?: string;
}

export interface EventoNaoConformidade {
  id: string;
  data: string;
  tipo:
    | "deteccao"
    | "analise"
    | "acao_corretiva"
    | "verificacao"
    | "resolucao"
    | "reabertura"
    | "comentario"
    | "anexo";
  responsavel: string;
  descricao: string;
  detalhes?: string;
  anexo?: Anexo;
  custo?: number;
}

export interface VerificacaoEficacia {
  id: string;
  data: string;
  responsavel: string;
  eficaz: boolean;
  justificativa: string;
  evidencia: string;
  proxima_verificacao?: string;
  anexos?: Anexo[];
}

// Tipos para Auditorias
export interface Auditoria extends BaseEntity {
  tipo:
    | "interna"
    | "externa"
    | "certificacao"
    | "fornecedor"
    | "seguranca"
    | "ambiente"
    | "qualidade";
  escopo: string;
  data_inicio: string;
  data_fim: string;
  data_realizada?: string;
  auditor_principal: string;
  auditores: string[];
  entidade_auditada: string;

  // Critérios e normas
  normas_referencia: string[];
  criterios_auditoria: string[];

  // Resultados
  conformidade_geral: number; // percentual
  nao_conformidades_encontradas: number;
  observacoes_encontradas: number;
  recomendacoes: number;

  // Status
  status: "planeada" | "em_execucao" | "concluida" | "cancelada" | "atrasada";

  // Relatórios
  relatorio_auditoria?: string;
  plano_acao?: string;

  // Checklist de auditoria
  checklist_auditoria: ItemChecklistAuditoria[];

  // Não conformidades encontradas
  nao_conformidades: string[]; // IDs das NCs

  // Anexos
  anexos?: Anexo[];
  observacoes?: string;
}

export interface ItemChecklistAuditoria {
  id: string;
  criterio: string;
  norma_referencia: string;
  descricao: string;
  conformidade: "conforme" | "nao_conforme" | "observacao" | "nao_aplicavel";
  evidencia: string;
  responsavel: string;
  data_verificacao: string;
  acao_corretiva?: string;
  prazo_correcao?: string;
  anexos?: Anexo[];
}

// Tipos para Medidas Corretivas e Preventivas
export interface MedidaCorretiva extends BaseEntity {
  nao_conformidade_id: string;
  tipo: "corretiva" | "preventiva" | "melhoria";
  descricao: string;
  causa_raiz: string;
  acao_especifica: string;

  // Responsabilidades
  responsavel_implementacao: string;
  responsavel_verificacao: string;

  // Prazos
  data_inicio: string;
  data_limite: string;
  data_conclusao?: string;

  // Recursos
  recursos_necessarios: string[];
  custo_estimado: number;
  custo_real?: number;

  // Status e acompanhamento
  status:
    | "planeada"
    | "em_execucao"
    | "concluida"
    | "verificada"
    | "atrasada"
    | "cancelada";
  percentual_execucao: number;

  // Verificação
  verificacao_eficacia?: VerificacaoEficacia;

  // Anexos
  anexos?: Anexo[];
  observacoes?: string;
}

// Tipos para Relatórios de Não Conformidades
export interface RelatorioNaoConformidade {
  id: string;
  titulo: string;
  periodo_inicio: string;
  periodo_fim: string;
  gerado_por: string;
  data_geracao: string;

  // Estatísticas
  estatisticas: {
    total_nc: number;
    nc_por_tipo: Record<string, number>;
    nc_por_severidade: Record<string, number>;
    nc_por_status: Record<string, number>;
    nc_resolvidas: number;
    nc_pendentes: number;
    tempo_medio_resolucao: number;
    custo_total: number;
  };

  // Análise por módulo
  analise_por_modulo: {
    ensaios: {
      total: number;
      nao_conformes: number;
      percentual: number;
    };
    materiais: {
      total: number;
      com_problemas: number;
      percentual: number;
    };
    checklists: {
      total: number;
      com_falhas: number;
      percentual: number;
    };
    fornecedores: {
      total: number;
      com_nc: number;
      percentual: number;
    };
  };

  // Auditorias realizadas
  auditorias: {
    total: number;
    internas: number;
    externas: number;
    conformidade_media: number;
  };

  // Medidas implementadas
  medidas: {
    corretivas: number;
    preventivas: number;
    eficazes: number;
    custo_total: number;
  };

  // Conteúdo detalhado
  nao_conformidades: NaoConformidade[];
  auditorias_realizadas: Auditoria[];
  medidas_implementadas: MedidaCorretiva[];

  // Recomendações
  recomendacoes: string[];
  acoes_futuras: string[];

  // Anexos
  anexos?: Anexo[];
}

export interface Relatorio {
  id: string;
  tipo: "mensal" | "trimestral" | "anual" | "especifico";
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
  status:
    | "planeamento"
    | "em_execucao"
    | "paralisada"
    | "concluida"
    | "cancelada";
  tipo_obra:
    | "residencial"
    | "comercial"
    | "industrial"
    | "infraestrutura"
    | "reabilitacao"
    | "outro";
  categoria: "pequena" | "media" | "grande" | "mega";
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
  unidade_area: "m2" | "m3" | "un";
  percentual_execucao: number;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real?: string;
  status: "nao_iniciada" | "em_execucao" | "concluida" | "paralisada";
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
  status:
    | "nao_iniciada"
    | "em_execucao"
    | "concluida"
    | "atrasada"
    | "paralisada";
  dependencias: string[];
  recursos_necessarios: RecursoFase[];
  custo_previsto: number;
  custo_real?: number;
  observacoes?: string;
}

export interface EquipaObra {
  id: string;
  nome: string;
  tipo:
    | "construcao"
    | "eletrica"
    | "mecanica"
    | "acabamentos"
    | "especializada"
    | "outro";
  lider: string;
  membros: MembroEquipa[];
  especialidades: string[];
  data_inicio: string;
  data_fim?: string;
  status: "ativa" | "inativa" | "concluida";
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
  status: "ativo" | "inativo";
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
  tipo: "material" | "equipamento" | "mao_obra" | "servico" | "outro";
  descricao: string;
  quantidade: number;
  unidade: string;
  custo_unitario: number;
  custo_total: number;
  fornecedor_id?: string;
  data_necessaria: string;
  status: "pendente" | "disponivel" | "utilizado";
  observacoes?: string;
}

export interface RiscoObra {
  id: string;
  descricao: string;
  categoria:
    | "tecnico"
    | "ambiental"
    | "seguranca"
    | "financeiro"
    | "prazo"
    | "qualidade"
    | "outro";
  probabilidade: "baixa" | "media" | "alta" | "critica";
  impacto: "baixo" | "medio" | "alto" | "critico";
  nivel_risco: "baixo" | "medio" | "alto" | "critico";
  data_identificacao: string;
  responsavel: string;
  medidas_preventivas: string[];
  medidas_corretivas?: string[];
  status: "ativo" | "mitigado" | "resolvido" | "ocorreu";
  custo_estimado?: number;
  observacoes?: string;
}

export interface IndicadorObra {
  id: string;
  nome: string;
  tipo:
    | "qualidade"
    | "prazo"
    | "custo"
    | "seguranca"
    | "ambiental"
    | "satisfacao"
    | "outro";
  unidade: string;
  valor_meta: number;
  valor_atual: number;
  percentual_atingimento: number;
  frequencia_medicao: "diaria" | "semanal" | "mensal" | "trimestral" | "anual";
  responsavel: string;
  data_ultima_medicao: string;
  historico: MedicaoIndicador[];
  status: "dentro_meta" | "acima_meta" | "abaixo_meta" | "critico";
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
  status:
    | "nao_iniciada"
    | "em_execucao"
    | "concluida"
    | "atrasada"
    | "paralisada";
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
  tipo: "diario" | "semanal" | "mensal" | "trimestral" | "final";
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
  perfil: "qualidade" | "producao" | "fiscal" | "admin";
  avatar?: string;
}

export interface Notification {
  id: string;
  tipo: "info" | "success" | "warning" | "error";
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

export interface AvaliacaoFornecedor {
  id: string;
  fornecedor_id: string;
  data: string;
  avaliador: string;
  nota: number; // 1-5
  criterios: {
    qualidade: number;
    prazo: number;
    preco: number;
    atendimento: number;
  };
  comentarios: string;
}

export interface RFI extends BaseEntity {
  numero: string;
  titulo: string;
  descricao: string;
  solicitante: string;
  destinatario: string;
  data_solicitacao: string;
  data_resposta?: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  status: "pendente" | "em_analise" | "respondido" | "fechado";
  resposta?: string;
  anexos?: Anexo[];
  impacto_custo?: number;
  impacto_prazo?: number;
  relacionado_obra_id?: string;
  relacionado_zona_id?: string;
  relacionado_documento_id?: string;
  relacionado_ensaio_id?: string;
  relacionado_material_id?: string;
  observacoes?: string;
  timeline?: EventoRFI[];
}

export interface EventoRFI {
  id: string;
  data: string;
  tipo: "criado" | "respondido" | "comentario" | "anexo" | "outro";
  responsavel: string;
  descricao: string;
  detalhes?: string;
  anexo?: Anexo;
}
