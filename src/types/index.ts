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
  documents?: any[]; // Documentos carregados
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
  arquivo_url?: string;
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
  arquivo_url?: string;
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
  arquivo_url?: string;
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
  
  // NOVOS CAMPOS DE VALOR AGREGADO
  
  // 1. CRONOGRAMA E GESTÃO DE PROJETOS
  cronograma: CronogramaObra;
  milestones: MilestoneObra[];
  dependencias_externas: DependenciaExterna[];
  
  // 2. MÉTRICAS DE PERFORMANCE (EVM - Earned Value Management)
  metricas_evm: MetricasEVM;
  indicadores_performance: IndicadorPerformance[];
  
  // 3. GESTÃO DE RISCOS AVANÇADA
  riscos: RiscoObra[];
  plano_mitigacao: PlanoMitigacaoRiscos;
  auditorias_risco: AuditoriaRisco[];
  
  // 4. DOCUMENTAÇÃO DE OBRA
  documentacao: DocumentacaoObra;
  licencas_autorizacoes: LicencaAutorizacao[];
  certificacoes_obrigatorias: CertificacaoObrigatoria[];
  
  // 5. GESTÃO DE EQUIPAS E SUBEMPREITEIROS
  equipas: EquipaObra[];
  subempreiteiros: Subempreiteiro[];
  fornecedores_principais: string[];
  
  // 6. GESTÃO FINANCEIRA AVANÇADA
  gestao_financeira: GestaoFinanceiraObra;
  orcamentos_detalhados: OrcamentoDetalhado[];
  controlo_custos: ControloCustos[];
  
  // 7. GESTÃO DE QUALIDADE E SEGURANÇA
  plano_qualidade: PlanoQualidadeObra;
  plano_seguranca: PlanoSegurancaObra;
  inspecoes_qualidade: InspecaoQualidade[];
  acidentes_incidentes: AcidenteIncidente[];
  
  // 8. SUSTENTABILIDADE E AMBIENTE
  gestao_ambiental: GestaoAmbientalObra;
  certificacoes_ambientais: CertificacaoAmbiental[];
  
  // CAMPOS EXISTENTES
  zonas: ZonaObra[];
  fases: FaseObra[];
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

export interface AppNotification {
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
  arquivo_url?: string; // URL do arquivo PDF salvo no backend
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

// Tipos para PPI (Pontos de Inspeção) - Sistema Flexível e Editável
export interface PPI extends BaseEntity {
  codigo: string; // ex: PPI-008 PPI-027
  revisao: string; // ex: 01, 1
  pagina: string; // ex: 01 de 01
  
  // Identificação da obra
  obra_id: string;
  obra_nome: string;
  lote?: string;
  tramo?: string;
  pk?: string;
  elemento?: string;
  subelemento?: string;
  
  // Seções de controlo (CCG, CCE, CCM)
  secoes: SecaoPPI;
  
  // Status e responsabilidades
  status: "rascunho" | "em_revisao" | "aprovado" | "ativo" | "obsoleto";
  aprovador?: string;
  data_aprovacao?: string;
  
  // Conformidade final
  conformidade_final?: "si" | "no";
  data_conformidade?: string;
  assinatura_conformidade?: string;
  nao_conformidades_abertas?: number;
  
  // Campos customizados editáveis
  campos_customizados: CampoCustomizado[];
  
  // Anexos e observações
  anexos?: Anexo[];
  observacoes?: string;
}

export interface SecaoPPI {
  id: string;
  codigo: "CCG" | "CCE" | "CCM"; // Controlo Geométrico, Execução, Materiais
  nome: string;
  descricao?: string;
  ordem: number; // Para controlar sequência
  pontos: PontoInspecaoPPI[];
  
  // Conformidade da seção
  conformidade_final?: "si" | "no";
  data_conformidade?: string;
  assinatura_conformidade?: string;
  nao_conformidades_abertas?: number;
  
  // Campos customizados por seção
  campos_customizados: CampoCustomizado[];
}

export interface PontoInspecaoPPI {
  id: string;
  descricao: string;
  tipo_inspecao: 
    | "visual" 
    | "topografica"
    | "documental" 
    | "laboratorio"
    | "metrica"
    | "ensayos" 
    | "outro"; 
  tipo_inspecao_outro?: string;
  responsavel: string;
  pc_pp: "PC" | "PP"; // Ponto de Controlo ou Ponto de Parada
  
  // Resultados da inspeção
  data_inspecao?: string;
  aceitacao?: "si" | "no" | "na";
  assinatura?: string;
  criterio_aceitacao: string;
  
  // Campos customizados por ponto
  campos_customizados: CampoCustomizado
  
  // Campos adicionais
  observacoes?: string;
  anexos?: Anexo[];
  nao_conformidade_id?: string;
  
  // Para ensaios específicos
  ordem_ensaio?: string;
  actas_resultados?: string;
  
  // Controle sequencial
  ordem: number; // Para controlar sequência dentro da seção
  depende_de?: string; // ID do ponto que deve ser aprovado primeiro
  bloqueia_proximo?: boolean; // Se true, próxima atividade só inicia após aprovação
}

// Sistema de campos customizados editáveis
export interface CampoCustomizado {
  id: string;
  nome: string;
  tipo: "texto" | "numero" | "data" | "select" | "ckbox" | "textarea" | "arquivo" | "assinatura";
  valor?: string | number | boolean;
  obrigatorio: boolean;
  opcoes?: string[]; // Para campos select
  descricao?: string;
  ordem: number;
  visivel: boolean;
  editavel: boolean;
  
  // Validações
  validacao?: {
    tipo: "min" | "max" | "regex" | "custom";
    valor: string;
    mensagem: string;
  };
}

// Modelo de PPI (template reutilizável)
export interface ModeloPPI extends BaseEntity {
  nome: string;
  descricao: string;
  categoria: string; // ex: "Fundações,Estruturas, cabamentos"
  versao: string;
  
  // Estrutura do modelo
  secoes: ModeloSecaoPPI  // Campos customizados padrão
  campos_customizados_padrao: CampoCustomizado[];
  
  // Configurações
  permite_edicao: boolean;
  obriga_sequencia: boolean;
  permite_campos_customizados: boolean;
  
  // Metadados
  criado_por: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  utilizacoes: number; // Quantas vezes foi usado
  
  // Tags para busca
  tags: string[];
  // Observações
  observacoes?: string;
}

export interface ModeloSecaoPPI {
  id: string;
  codigo: "CCG" | "CCE" | "M";
  nome: string;
  descricao?: string;
  ordem: number;
  
  // Pontos padrão da seção
  pontos_padrao: ModeloPontoInspecaoPPI[]; // Campos customizados padrão da seção
  campos_customizados_padrao: CampoCustomizado[];
}

export interface ModeloPontoInspecaoPPI {
  id: string;
  descricao: string;
  tipo_inspecao: 
    | "visual" 
    | "topografica"
    | "documental" 
    | "laboratorio"
    | "metrica"
    | "ensayos" 
    | "outro"; 
  tipo_inspecao_outro?: string;
  responsavel_padrao: string;
  pc_pp: "PC" | "PP";
  criterio_aceitacao: string;
  
  // Controle sequencial
  ordem: number;
  depende_de?: string;
  bloqueia_proximo: boolean;
  
  // Campos customizados padrão do ponto
  campos_customizados_padrao: CampoCustomizado;
  // Observações
  observacoes?: string;
}

// Execução de PPI (instância baseada em modelo)
export interface ExecucaoPPI extends BaseEntity {
  modelo_id?: string; // Se baseado em modelo
  ppi_id: string; // Referência ao PPI criado
  
  // Informações da execução
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim?: string;
  
  // Status da execução
  status: "nao_iniciada" | "em_execucao" | "pausada" | "concluida" | "celada";
  percentual_conclusao: number;
  
  // Responsabilidades
  responsavel_geral: string;
  equipa: string[];
  
  // Controle de sequência
  sequencia_ativa: boolean;
  ponto_atual?: string;
  
  // Campos customizados da execução
  campos_customizados: CampoCustomizado[];
  // Observações
  observacoes?: string;
  anexos?: Anexo[];
}

// Histórico de execução
export interface HistoricoExecucaoPPI {
  id: string;
  execucao_id: string;
  ponto_id?: string;
  acao: "iniciada" | "pausada" | "retomada" | "ponto_aprovado" | "ponto_reprovado" | "concluida" | "celada";
  responsavel: string;
  data: string;
  observacoes?: string;
  anexos?: Anexo[];
}

// Configurações do sistema PPI
export interface ConfiguracaoPPI {
  id: string;
  nome: string;
  valor: string | number | boolean;
  tipo: "string" | "number" | "boolean" | "json";
  categoria: "geral" | "validacao" | "notificacao" | "relatorio";
  descricao?: string;
  editavel: boolean;
}

// Tipos PIE (Pontos de Inspeção e Ensaios)
export type { PIEInstancia, PIESecao, PIEPonto, PIEResposta } from "./pie";

// Tipos para Sinalização
export type {
  Sinalizacao,
  InspecaoSinalizacao,
  SinalizacaoStats,
  SinalizacaoFormData,
  InspecaoSinalizacaoFormData,
  TIPOS_SINALIZACAO,
  CATEGORIAS_SINALIZACAO,
  ESTADOS_SINALIZACAO,
  STATUS_OPERACIONAL,
  TIPOS_INSPECAO,
  RESULTADOS_INSPECAO,
  FiltrosSinalizacao,
  FiltrosInspecaoSinalizacao,
  RelatorioSinalizacaoOptions,
  RelatorioInspecaoSinalizacaoOptions,
  SinalizacaoExportData,
  InspecaoSinalizacaoExportData
} from "./sinalizacao";

// Tipos para Segurança Ferroviária
export type {
  SistemaSeguranca,
  InspecaoSeguranca,
  SegurancaFerroviariaStats,
  SegurancaFerroviariaFormData,
  InspecaoSegurancaFormData,
  TIPOS_SISTEMA_SEGURANCA,
  CATEGORIAS_SEGURANCA,
  ESTADOS_SISTEMA,
  STATUS_OPERACIONAL as STATUS_OPERACIONAL_SEGURANCA,
  TIPOS_INSPECAO_SEGURANCA,
  RESULTADOS_INSPECAO as RESULTADOS_INSPECAO_SEGURANCA,
  PRIORIDADES,
  FiltrosSegurancaFerroviaria,
  FiltrosInspecaoSeguranca,
  RelatorioSegurancaFerroviariaOptions,
  RelatorioInspecaoSegurancaOptions,
  SegurancaFerroviariaExportData,
  InspecaoSegurancaExportData
} from "./segurancaFerroviaria";

// Tipos para Pontes e Túneis
export type {
  PonteTunel,
  InspecaoPontesTuneis,
  PontesTuneisStats,
  PontesTuneisFormData,
  InspecaoPontesTuneisFormData,
  TIPOS_PONTE_TUNEL,
  CATEGORIAS_PONTE_TUNEL,
  ESTADOS_PONTE_TUNEL,
  STATUS_OPERACIONAL as STATUS_OPERACIONAL_PONTES_TUNEIS,
  TIPOS_INSPECAO_PONTES_TUNEIS,
  RESULTADOS_INSPECAO as RESULTADOS_INSPECAO_PONTES_TUNEIS,
  PRIORIDADES as PRIORIDADES_PONTES_TUNEIS,
  FiltrosPontesTuneis,
  FiltrosInspecaoPontesTuneis,
  RelatorioPontesTuneisOptions,
  RelatorioInspecaoPontesTuneisOptions,
  PontesTuneisExportData,
  InspecaoPontesTuneisExportData
} from "./pontesTuneis";

// Tipos para Ensaios de Compactação
export interface PontoEnsaioCompactacao {
  numero: number;
  densidadeSeca: number;
  humidade: number;
  grauCompactacao: number;
}

export interface EnsaioCompactacao {
  id?: string;
  obra: string;
  localizacao: string;
  elemento: string;
  numeroEnsaio: string;
  codigo: string;
  dataAmostra: string;
  densidadeMaximaReferencia: number;
  humidadeOtimaReferencia: number;
  pontos: PontoEnsaioCompactacao[];
  densidadeSecaMedia: number;
  humidadeMedia: number;
  grauCompactacaoMedio: number;
  referenciaLaboratorioExterno?: string; // Referência do relatório do laboratório externo
  observacoes?: string;
  documents?: any[]; // Documentos carregados
  created?: string;
  updated?: string;
}

// ===== NOVAS INTERFACES PARA GESTÃO AVANÇADA DE OBRAS =====

// 1. CRONOGRAMA E GESTÃO DE PROJETOS
export interface MilestoneObra {
  id: string;
  nome: string;
  descricao: string;
  data_prevista: string;
  data_real?: string;
  tipo: "inicio" | "meio" | "fim" | "checkpoint" | "entrega" | "pagamento";
  importancia: "baixa" | "media" | "alta" | "critica";
  status: "pendente" | "concluida" | "atrasada" | "cancelada";
  dependencias: string[];
  responsavel: string;
  custo_estimado?: number;
  observacoes?: string;
}

export interface DependenciaExterna {
  id: string;
  descricao: string;
  tipo: "fornecedor" | "cliente" | "autoridade" | "utilities" | "outro";
  entidade: string;
  data_necessaria: string;
  data_realizada?: string;
  status: "pendente" | "concluida" | "atrasada" | "cancelada";
  impacto_obra: "baixo" | "medio" | "alto" | "critico";
  responsavel_interno: string;
  contato_externo: string;
  observacoes?: string;
}

// 2. MÉTRICAS DE PERFORMANCE (EVM - Earned Value Management)
export interface MetricasEVM {
  // Valores Planeados
  pv_total: number; // Planned Value
  pv_atual: number;
  
  // Valores Ganhos
  ev_total: number; // Earned Value
  ev_atual: number;
  
  // Custos Reais
  ac_total: number; // Actual Cost
  ac_atual: number;
  
  // Índices de Performance
  spi: number; // Schedule Performance Index
  cpi: number; // Cost Performance Index
  
  // Variações
  sv: number; // Schedule Variance
  cv: number; // Cost Variance
  
  // Estimativas
  eac: number; // Estimate at Completion
  etc: number; // Estimate to Complete
  vac: number; // Variance at Completion
  
  // Percentuais
  percentual_completude: number;
  percentual_tempo_decorrido: number;
  
  data_calculo: string;
  responsavel: string;
}

export interface IndicadorPerformance {
  id: string;
  nome: string;
  tipo: "produtividade" | "qualidade" | "seguranca" | "ambiental" | "satisfacao" | "financeiro";
  unidade: string;
  valor_meta: number;
  valor_atual: number;
  valor_anterior: number;
  tendencia: "melhorando" | "estavel" | "piorando";
  frequencia_medicao: "diaria" | "semanal" | "mensal";
  responsavel: string;
  data_ultima_medicao: string;
  historico: MedicaoIndicador[];
  observacoes?: string;
}

// 3. GESTÃO DE RISCOS AVANÇADA
export interface PlanoMitigacaoRiscos {
  id: string;
  versao: string;
  data_criacao: string;
  data_revisao: string;
  responsavel: string;
  estrategias_gerais: EstrategiaMitigacao[];
  recursos_mitigacao: RecursoMitigacao[];
  procedimentos_emergencia: ProcedimentoEmergencia[];
  observacoes?: string;
}

export interface EstrategiaMitigacao {
  id: string;
  categoria_risco: string;
  estrategia: string;
  acoes: string[];
  responsavel: string;
  prazo: string;
  custo_estimado: number;
  status: "pendente" | "em_execucao" | "concluida";
  observacoes?: string;
}

export interface RecursoMitigacao {
  id: string;
  tipo: "humano" | "material" | "financeiro" | "tecnico";
  descricao: string;
  quantidade: number;
  unidade: string;
  custo_unitario: number;
  disponibilidade: "imediata" | "24h" | "48h" | "semanal";
  fornecedor?: string;
  observacoes?: string;
}

export interface ProcedimentoEmergencia {
  id: string;
  titulo: string;
  descricao: string;
  tipo_emergencia: string;
  acoes: string[];
  responsaveis: string[];
  contatos_emergencia: string[];
  recursos_necessarios: string[];
  observacoes?: string;
}

export interface AuditoriaRisco {
  id: string;
  data: string;
  tipo: "preventiva" | "corretiva" | "verificacao";
  auditor: string;
  escopo: string;
  riscos_avaliados: string[];
  conformidades: string[];
  nao_conformidades: string[];
  acoes_corretivas: string[];
  prazo_acoes: string;
  responsavel_acoes: string;
  observacoes?: string;
}

// 4. DOCUMENTAÇÃO DE OBRA
export interface DocumentacaoObra {
  id: string;
  versao: string;
  data_criacao: string;
  data_atualizacao: string;
  responsavel: string;
  categorias: CategoriaDocumentacao[];
  templates: TemplateDocumento[];
  fluxo_aprovacao: FluxoAprovacao[];
  observacoes?: string;
}

export interface CategoriaDocumentacao {
  id: string;
  nome: string;
  descricao: string;
  documentos_obrigatorios: string[];
  documentos_opcionais: string[];
  responsavel: string;
  observacoes?: string;
}

export interface TemplateDocumento {
  id: string;
  nome: string;
  categoria: string;
  conteudo: string;
  campos_obrigatorios: string[];
  campos_opcionais: string[];
  versao: string;
  data_criacao: string;
  responsavel: string;
  observacoes?: string;
}

export interface FluxoAprovacao {
  id: string;
  documento_tipo: string;
  etapas: EtapaAprovacao[];
  responsavel_final: string;
  prazo_maximo: number; // em dias
  observacoes?: string;
}

export interface EtapaAprovacao {
  ordem: number;
  responsavel: string;
  tipo: "revisao" | "aprovacao" | "visto";
  prazo: number; // em dias
  obrigatorio: boolean;
  observacoes?: string;
}

export interface LicencaAutorizacao {
  id: string;
  tipo: "ambiental" | "urbanistica" | "construcao" | "operacao" | "outro";
  numero: string;
  emissor: string;
  data_emissao: string;
  data_validade: string;
  status: "pendente" | "emitida" | "renovada" | "expirada" | "cancelada";
  custo: number;
  responsavel: string;
  anexos?: Anexo[];
  observacoes?: string;
}

export interface CertificacaoObrigatoria {
  id: string;
  nome: string;
  tipo: "iso" | "ambiental" | "seguranca" | "qualidade" | "outro";
  organismo: string;
  data_obtencao: string;
  data_validade: string;
  status: "pendente" | "obtida" | "renovada" | "expirada";
  custo: number;
  responsavel: string;
  requisitos: string[];
  observacoes?: string;
}

// 5. GESTÃO DE EQUIPAS E SUBEMPREITEIROS
export interface Subempreiteiro {
  id: string;
  nome: string;
  nif: string;
  tipo_servico: string;
  especialidade: string;
  contato_principal: string;
  telefone: string;
  email: string;
  endereco: string;
  data_contratacao: string;
  data_fim_contrato?: string;
  valor_contrato: number;
  valor_executado: number;
  percentual_execucao: number;
  status: "ativo" | "inativo" | "concluido" | "rescisao";
  certificacoes: string[];
  seguros: SeguroSubempreiteiro[];
  equipas: EquipaSubempreiteiro[];
  observacoes?: string;
}

export interface SeguroSubempreiteiro {
  id: string;
  tipo: "responsabilidade_civil" | "acidentes_trabalho" | "obra" | "outro";
  seguradora: string;
  numero_poliza: string;
  data_inicio: string;
  data_fim: string;
  valor_cobertura: number;
  status: "ativo" | "expirado" | "cancelado";
  observacoes?: string;
}

export interface EquipaSubempreteiro {
  id: string;
  nome: string;
  lider: string;
  especialidade: string;
  numero_membros: number;
  data_inicio: string;
  data_fim?: string;
  zona_atual?: string;
  status: "ativa" | "inativa" | "concluida";
  observacoes?: string;
}

// 6. GESTÃO FINANCEIRA AVANÇADA
export interface GestaoFinanceiraObra {
  id: string;
  valor_contrato_total: number;
  valor_executado_total: number;
  valor_faturado_total: number;
  valor_pago_total: number;
  margem_bruta: number;
  margem_liquida: number;
  fluxo_caixa: FluxoCaixa[];
  previsoes_financeiras: PrevisaoFinanceira[];
  observacoes?: string;
}

export interface FluxoCaixa {
  id: string;
  data: string;
  tipo: "entrada" | "saida";
  categoria: string;
  descricao: string;
  valor: number;
  status: "previsto" | "realizado" | "pendente";
  responsavel: string;
  observacoes?: string;
}

export interface PrevisaoFinanceira {
  id: string;
  mes: string;
  receitas_previstas: number;
  despesas_previstas: number;
  saldo_previsto: number;
  receitas_reais?: number;
  despesas_reais?: number;
  saldo_real?: number;
  variacao: number;
  observacoes?: string;
}

export interface OrcamentoDetalhado {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  preco_total: number;
  fornecedor?: string;
  data_necessaria: string;
  status: "pendente" | "aprovado" | "encomendado" | "recebido";
  observacoes?: string;
}

export interface ControloCustos {
  id: string;
  data: string;
  categoria: string;
  descricao: string;
  custo_previsto: number;
  custo_real: number;
  variacao: number;
  percentual_variacao: number;
  responsavel: string;
  justificativa?: string;
  acoes_corretivas?: string[];
  observacoes?: string;
}

// 7. GESTÃO DE QUALIDADE E SEGURANÇA
export interface PlanoQualidadeObra {
  id: string;
  versao: string;
  data_criacao: string;
  responsavel: string;
  objetivos_qualidade: string[];
  procedimentos_qualidade: ProcedimentoQualidade[];
  recursos_qualidade: RecursoQualidade[];
  observacoes?: string;
}

export interface ProcedimentoQualidade {
  id: string;
  nome: string;
  descricao: string;
  responsavel: string;
  frequencia: string;
  criterios_aceitacao: string[];
  observacoes?: string;
}

export interface RecursoQualidade {
  id: string;
  tipo: "humano" | "material" | "equipamento";
  descricao: string;
  quantidade: number;
  responsavel: string;
  observacoes?: string;
}

export interface PlanoSegurancaObra {
  id: string;
  versao: string;
  data_criacao: string;
  responsavel: string;
  objetivos_seguranca: string[];
  procedimentos_seguranca: ProcedimentoSeguranca[];
  equipamentos_protecao: EquipamentoProtecao[];
  formacoes_seguranca: FormacaoSeguranca[];
  observacoes?: string;
}

export interface ProcedimentoSeguranca {
  id: string;
  nome: string;
  descricao: string;
  risco_associado: string;
  medidas_preventivas: string[];
  responsavel: string;
  observacoes?: string;
}

export interface EquipamentoProtecao {
  id: string;
  tipo: string;
  descricao: string;
  quantidade: number;
  estado: "novo" | "bom" | "regular" | "mau";
  data_inspecao: string;
  proxima_inspecao: string;
  responsavel: string;
  observacoes?: string;
}

export interface FormacaoSeguranca {
  id: string;
  nome: string;
  tipo: string;
  formador: string;
  data: string;
  duracao: number;
  participantes: string[];
  certificados: string[];
  observacoes?: string;
}

export interface InspecaoQualidade {
  id: string;
  data: string;
  tipo: "preventiva" | "corretiva" | "verificacao";
  inspetor: string;
  area: string;
  criterios_avaliados: CriterioInspecao[];
  resultado: "aprovado" | "reprovado" | "condicional";
  acoes_corretivas?: string[];
  prazo_acoes?: string;
  responsavel_acoes?: string;
  observacoes?: string;
}

export interface CriterioInspecao {
  id: string;
  descricao: string;
  resultado: "conforme" | "nao_conforme" | "nao_aplicavel";
  observacoes?: string;
}

export interface AcidenteIncidente {
  id: string;
  data: string;
  tipo: "acidente" | "incidente" | "quase_acidente";
  local: string;
  descricao: string;
  vitimas: VitimaAcidente[];
  causas: string[];
  acoes_corretivas: string[];
  responsavel_acoes: string;
  prazo_acoes: string;
  status: "investigacao" | "acoes_em_execucao" | "concluido";
  observacoes?: string;
}

export interface VitimaAcidente {
  id: string;
  nome: string;
  tipo: "funcionario" | "subempreteiro" | "visitante" | "outro";
  lesoes: string;
  gravidade: "leve" | "moderada" | "grave" | "fatal";
  observacoes?: string;
}

// 8. SUSTENTABILIDADE E AMBIENTE
export interface GestaoAmbientalObra {
  id: string;
  versao: string;
  data_criacao: string;
  responsavel: string;
  objetivos_ambientais: string[];
  impactos_ambientais: ImpactoAmbiental[];
  medidas_mitigacao: MedidaMitigacaoAmbiental[];
  monitorizacao_ambiental: MonitorizacaoAmbiental[];
  observacoes?: string;
}

export interface ImpactoAmbiental {
  id: string;
  descricao: string;
  tipo: "ar" | "agua" | "solo" | "ruido" | "residuos" | "biodiversidade";
  magnitude: "baixa" | "media" | "alta";
  duracao: "temporaria" | "permanente";
  medidas_mitigacao: string[];
  observacoes?: string;
}

export interface MedidaMitigacaoAmbiental {
  id: string;
  descricao: string;
  impacto_associado: string;
  custo: number;
  prazo: string;
  responsavel: string;
  status: "pendente" | "em_execucao" | "concluida";
  observacoes?: string;
}

export interface MonitorizacaoAmbiental {
  id: string;
  data: string;
  parametro: string;
  valor_medido: number;
  unidade: string;
  limite_legal: number;
  resultado: "conforme" | "nao_conforme";
  responsavel: string;
  observacoes?: string;
}

export interface CertificacaoAmbiental {
  id: string;
  nome: string;
  organismo: string;
  data_obtencao: string;
  data_validade: string;
  status: "pendente" | "obtida" | "renovada" | "expirada";
  custo: number;
  responsavel: string;
  requisitos: string[];
  observacoes?: string;
}
