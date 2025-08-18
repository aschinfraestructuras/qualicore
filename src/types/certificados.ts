// =====================================================
// TIPOS PARA SISTEMA DE CERTIFICADOS E REGISTOS
// =====================================================

// =====================================================
// 1. TIPOS DE CERTIFICADOS
// =====================================================

export type TipoCertificado = 
  | 'qualidade_sistema'
  | 'qualidade_produto'
  | 'ambiente'
  | 'seguranca'
  | 'energia'
  | 'alimentar'
  | 'construcao'
  | 'laboratorio'
  | 'calibracao'
  | 'inspectao'
  | 'manutencao'
  | 'formacao'
  | 'competencia'
  | 'outro';

export type CategoriaCertificado = 
  | 'sistema_gestao'
  | 'produto_servico'
  | 'pessoal'
  | 'equipamento'
  | 'processo'
  | 'fornecedor'
  | 'cliente'
  | 'regulamentar'
  | 'voluntario'
  | 'outro';

export type StatusCertificado = 
  | 'ativo'
  | 'suspenso'
  | 'cancelado'
  | 'expirado'
  | 'em_renovacao'
  | 'em_suspensao'
  | 'cancelado_voluntario'
  | 'cancelado_obrigatorio';

export type EstadoCertificado = 
  | 'valido'
  | 'proximo_expiracao'
  | 'expirado'
  | 'suspenso'
  | 'cancelado';

export type ClassificacaoConfidencialidade = 
  | 'publico'
  | 'interno'
  | 'confidencial'
  | 'restrito';

export interface DocumentoAnexo {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  path?: string;
}

export interface RenovacaoHistorico {
  data_renovacao: string;
  versao_anterior: string;
  versao_nova: string;
  motivo: string;
  responsavel: string;
  custo?: number;
}

export interface Certificado {
  id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  
  // Informações do Certificado
  tipo_certificado: TipoCertificado;
  categoria: CategoriaCertificado;
  escopo: string;
  normas_referencia: string[];
  
  // Entidade Certificadora
  entidade_certificadora: string;
  organismo_acreditacao?: string;
  numero_acreditacao?: string;
  
  // Datas Importantes
  data_emissao: string;
  data_validade: string;
  data_renovacao?: string;
  data_suspensao?: string;
  data_cancelamento?: string;
  
  // Status e Estado
  status: StatusCertificado;
  estado: EstadoCertificado;
  
  // Responsáveis
  responsavel_id: string;
  responsavel_nome: string;
  responsavel_email?: string;
  responsavel_telefone?: string;
  
  // Informações Adicionais
  nivel_certificacao?: string;
  ambito_geografico?: string;
  restricoes?: string;
  condicoes_especiais?: string;
  
  // Documentação
  documentos_anexos: DocumentoAnexo[];
  certificado_original_url?: string;
  certificado_digital_url?: string;
  
  // Auditorias e Renovações
  ultima_auditoria?: string;
  proxima_auditoria?: string;
  frequencia_auditorias?: string;
  historico_renovacoes: RenovacaoHistorico[];
  
  // Custos e Informações Financeiras
  custo_emissao?: number;
  custo_manutencao?: number;
  custo_renovacao?: number;
  moeda: string;
  
  // Observações e Metadados
  observacoes?: string;
  palavras_chave: string[];
  tags: string[];
  classificacao_confidencialidade: ClassificacaoConfidencialidade;
  
  // Relacionamentos
  obra_id?: string;
  fornecedor_id?: string;
  material_id?: string;
  equipamento_id?: string;
  
  // Controle de Versões
  versao: string;
  versao_anterior_id?: string;
  
  // Metadados do Sistema
  user_id: string;
  criado_em: string;
  atualizado_em: string;
}

// =====================================================
// 2. TIPOS DE REGISTOS
// =====================================================

export type TipoRegisto = 
  | 'auditoria'
  | 'inspecao'
  | 'ensaio'
  | 'calibracao'
  | 'manutencao'
  | 'formacao'
  | 'competencia'
  | 'incidente'
  | 'acidente'
  | 'nao_conformidade'
  | 'acao_corretiva'
  | 'acao_preventiva'
  | 'melhoria'
  | 'reclamacao'
  | 'sugestao'
  | 'observacao'
  | 'medicao'
  | 'controlo'
  | 'verificacao'
  | 'outro';

export type CategoriaRegisto = 
  | 'qualidade'
  | 'seguranca'
  | 'ambiente'
  | 'manutencao'
  | 'formacao'
  | 'equipamento'
  | 'processo'
  | 'pessoal'
  | 'fornecedor'
  | 'cliente'
  | 'outro';

export type StatusRegisto = 
  | 'aberto'
  | 'em_analise'
  | 'em_execucao'
  | 'concluido'
  | 'fechado'
  | 'cancelado'
  | 'suspenso'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'rejeitado';

export type PrioridadeRegisto = 
  | 'baixa'
  | 'media'
  | 'alta'
  | 'critica'
  | 'urgente';

export interface Fotografia {
  nome: string;
  url: string;
  descricao?: string;
  data_captura: string;
  localizacao?: string;
}

export interface RelatorioAnexo {
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  data_upload: string;
  path?: string;
}

export interface Registo {
  id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  
  // Tipo de Registo
  tipo_registo: TipoRegisto;
  categoria: CategoriaRegisto;
  
  // Informações do Registo
  data_registo: string;
  hora_registo?: string;
  local_registo?: string;
  zona_obra?: string;
  
  // Responsáveis
  registador_id: string;
  registador_nome: string;
  responsavel_id?: string;
  responsavel_nome?: string;
  
  // Status e Prioridade
  status: StatusRegisto;
  prioridade: PrioridadeRegisto;
  
  // Resultados e Conclusões
  resultado?: string;
  conclusao?: string;
  acoes_necessarias: string[];
  prazo_execucao?: string;
  
  // Documentação
  documentos_anexos: DocumentoAnexo[];
  fotografias: Fotografia[];
  relatorios: RelatorioAnexo[];
  
  // Relacionamentos
  certificado_id?: string;
  obra_id?: string;
  fornecedor_id?: string;
  material_id?: string;
  equipamento_id?: string;
  nao_conformidade_id?: string;
  
  // Observações e Metadados
  observacoes?: string;
  palavras_chave: string[];
  tags: string[];
  
  // Metadados do Sistema
  user_id: string;
  criado_em: string;
  atualizado_em: string;
}

// =====================================================
// 3. TIPOS DE TERMOS E CONDIÇÕES
// =====================================================

export type TipoTermo = 
  | 'contrato'
  | 'subcontrato'
  | 'fornecimento'
  | 'servico'
  | 'licenca'
  | 'autorizacao'
  | 'acordo'
  | 'protocolo'
  | 'memorando'
  | 'termo_aceitacao'
  | 'termo_responsabilidade'
  | 'termo_confidencialidade'
  | 'outro';

export type CategoriaTermo = 
  | 'comercial'
  | 'tecnico'
  | 'legal'
  | 'seguranca'
  | 'ambiente'
  | 'qualidade'
  | 'recursos_humanos'
  | 'fornecedor'
  | 'cliente'
  | 'outro';

export type StatusTermo = 
  | 'rascunho'
  | 'em_revisao'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'assinado'
  | 'ativo'
  | 'concluido'
  | 'cancelado'
  | 'suspenso';

export type TipoParte = 
  | 'empresa'
  | 'pessoa'
  | 'entidade'
  | 'organismo';

export interface Assinatura {
  nome: string;
  cargo: string;
  data_assinatura: string;
  assinatura_url?: string;
  tipo_assinatura: 'digital' | 'manual' | 'eletronica';
}

export interface TermoCondicoes {
  id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  
  // Tipo de Termo
  tipo_termo: TipoTermo;
  categoria: CategoriaTermo;
  
  // Informações do Termo
  versao: string;
  data_emissao: string;
  data_validade?: string;
  data_revisao?: string;
  
  // Partes Envolvidas
  parte_1_nome: string;
  parte_1_tipo: TipoParte;
  parte_1_nif?: string;
  parte_1_endereco?: string;
  parte_1_contacto?: string;
  
  parte_2_nome?: string;
  parte_2_tipo?: TipoParte;
  parte_2_nif?: string;
  parte_2_endereco?: string;
  parte_2_contacto?: string;
  
  // Conteúdo e Condições
  objeto_contrato: string;
  condicoes_gerais?: string;
  condicoes_especificas?: string;
  obrigacoes_parte_1: string[];
  obrigacoes_parte_2: string[];
  
  // Valores e Prazos
  valor_contrato?: number;
  moeda: string;
  prazo_execucao?: string;
  prazo_pagamento?: string;
  
  // Status e Aprovação
  status: StatusTermo;
  aprovador_id?: string;
  aprovador_nome?: string;
  data_aprovacao?: string;
  
  // Documentação
  documento_original: DocumentoAnexo[];
  anexos: DocumentoAnexo[];
  assinaturas: Assinatura[];
  
  // Relacionamentos
  certificado_id?: string;
  obra_id?: string;
  fornecedor_id?: string;
  
  // Observações e Metadados
  observacoes?: string;
  palavras_chave: string[];
  tags: string[];
  classificacao_confidencialidade: ClassificacaoConfidencialidade;
  
  // Metadados do Sistema
  user_id: string;
  criado_em: string;
  atualizado_em: string;
}

// =====================================================
// 4. TIPOS DE CABEÇALHOS DE DOCUMENTOS
// =====================================================

export type TipoCabecalho = 
  | 'relatorio'
  | 'certificado'
  | 'registro'
  | 'formulario'
  | 'checklist'
  | 'procedimento'
  | 'instrucao'
  | 'manual'
  | 'especificacao'
  | 'outro';

export interface CabecalhoDocumento {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  
  // Tipo de Cabeçalho
  tipo_cabecalho: TipoCabecalho;
  
  // Informações da Empresa
  empresa_nome: string;
  empresa_logo_url?: string;
  empresa_nif?: string;
  empresa_endereco?: string;
  empresa_telefone?: string;
  empresa_email?: string;
  empresa_website?: string;
  
  // Informações do Projeto/Obra
  projeto_nome?: string;
  projeto_codigo?: string;
  obra_nome?: string;
  obra_codigo?: string;
  localizacao?: string;
  
  // Informações do Documento
  documento_titulo?: string;
  documento_codigo?: string;
  documento_versao?: string;
  documento_data?: string;
  
  // Informações do Responsável
  responsavel_nome?: string;
  responsavel_cargo?: string;
  responsavel_assinatura_url?: string;
  
  // Configurações do Cabeçalho
  incluir_logo: boolean;
  incluir_empresa: boolean;
  incluir_projeto: boolean;
  incluir_responsavel: boolean;
  incluir_data: boolean;
  incluir_versao: boolean;
  
  // Estilo e Formatação
  cor_primaria: string;
  cor_secundaria: string;
  fonte_principal: string;
  tamanho_fonte: number;
  
  // Status
  ativo: boolean;
  padrao: boolean;
  
  // Metadados do Sistema
  user_id: string;
  criado_em: string;
  atualizado_em: string;
}

// =====================================================
// 5. TIPOS DE RELATÓRIOS
// =====================================================

export type TipoRelatorio = 
  | 'auditoria'
  | 'inspecao'
  | 'ensaio'
  | 'calibracao'
  | 'manutencao'
  | 'formacao'
  | 'competencia'
  | 'incidente'
  | 'acidente'
  | 'nao_conformidade'
  | 'acao_corretiva'
  | 'acao_preventiva'
  | 'melhoria'
  | 'reclamacao'
  | 'sugestao'
  | 'observacao'
  | 'medicao'
  | 'controlo'
  | 'verificacao'
  | 'certificacao'
  | 'renovacao'
  | 'suspensao'
  | 'cancelamento'
  | 'outro';

export type CategoriaRelatorio = 
  | 'qualidade'
  | 'seguranca'
  | 'ambiente'
  | 'manutencao'
  | 'formacao'
  | 'equipamento'
  | 'processo'
  | 'pessoal'
  | 'fornecedor'
  | 'cliente'
  | 'outro';

export type StatusRelatorio = 
  | 'rascunho'
  | 'em_revisao'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'publicado'
  | 'arquivado'
  | 'cancelado';

export type FormatoSaida = 
  | 'pdf'
  | 'docx'
  | 'html'
  | 'txt';

export interface TabelaDados {
  titulo: string;
  dados: any[][];
  colunas: string[];
  formato?: string;
}

export interface GraficoImagem {
  titulo: string;
  url: string;
  tipo: 'grafico' | 'imagem' | 'diagrama';
  descricao?: string;
}

export interface Relatorio {
  id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  
  // Tipo de Relatório
  tipo_relatorio: TipoRelatorio;
  categoria: CategoriaRelatorio;
  
  // Informações do Relatório
  data_relatorio: string;
  periodo_inicio?: string;
  periodo_fim?: string;
  local_relatorio?: string;
  
  // Responsáveis
  autor_id: string;
  autor_nome: string;
  revisor_id?: string;
  revisor_nome?: string;
  aprovador_id?: string;
  aprovador_nome?: string;
  
  // Status e Aprovação
  status: StatusRelatorio;
  data_aprovacao?: string;
  data_publicacao?: string;
  
  // Conteúdo do Relatório
  resumo_executivo?: string;
  introducao?: string;
  metodologia?: string;
  resultados?: string;
  conclusoes?: string;
  recomendacoes: string[];
  acoes_necessarias: string[];
  
  // Documentação
  documentos_anexos: DocumentoAnexo[];
  tabelas_dados: TabelaDados[];
  graficos_imagens: GraficoImagem[];
  
  // Cabeçalho e Formatação
  cabecalho_id?: string;
  formato_saida: FormatoSaida;
  
  // Relacionamentos
  certificado_id?: string;
  registro_id?: string;
  obra_id?: string;
  fornecedor_id?: string;
  
  // Observações e Metadados
  observacoes?: string;
  palavras_chave: string[];
  tags: string[];
  classificacao_confidencialidade: ClassificacaoConfidencialidade;
  
  // Metadados do Sistema
  user_id: string;
  criado_em: string;
  atualizado_em: string;
}

// =====================================================
// 6. TIPOS PARA FILTROS E PESQUISA
// =====================================================

export interface FiltrosCertificados {
  tipo_certificado?: TipoCertificado;
  categoria?: CategoriaCertificado;
  status?: StatusCertificado;
  entidade_certificadora?: string;
  data_emissao_inicio?: string;
  data_emissao_fim?: string;
  data_validade_inicio?: string;
  data_validade_fim?: string;
  responsavel_id?: string;
  obra_id?: string;
  fornecedor_id?: string;
  texto_livre?: string;
}

export interface FiltrosRegistos {
  tipo_registo?: TipoRegisto;
  categoria?: CategoriaRegisto;
  status?: StatusRegisto;
  prioridade?: PrioridadeRegisto;
  data_registo_inicio?: string;
  data_registo_fim?: string;
  registador_id?: string;
  responsavel_id?: string;
  certificado_id?: string;
  obra_id?: string;
  texto_livre?: string;
}

export interface FiltrosTermos {
  tipo_termo?: TipoTermo;
  categoria?: CategoriaTermo;
  status?: StatusTermo;
  data_emissao_inicio?: string;
  data_emissao_fim?: string;
  parte_1_nome?: string;
  parte_2_nome?: string;
  certificado_id?: string;
  obra_id?: string;
  texto_livre?: string;
}

export interface FiltrosRelatorios {
  tipo_relatorio?: TipoRelatorio;
  categoria?: CategoriaRelatorio;
  status?: StatusRelatorio;
  data_relatorio_inicio?: string;
  data_relatorio_fim?: string;
  autor_id?: string;
  aprovador_id?: string;
  certificado_id?: string;
  registro_id?: string;
  obra_id?: string;
  texto_livre?: string;
}

// =====================================================
// 7. TIPOS PARA ESTATÍSTICAS
// =====================================================

export interface EstatisticasCertificados {
  total_certificados: number;
  certificados_ativos: number;
  certificados_suspensos: number;
  certificados_cancelados: number;
  certificados_expirados: number;
  proximos_expiracao: number;
  distribuicao_tipos: Record<TipoCertificado, number>;
  distribuicao_entidades: Record<string, number>;
}

export interface EstatisticasRegistos {
  total_registos: number;
  registos_abertos: number;
  registos_em_execucao: number;
  registos_concluidos: number;
  registos_fechados: number;
  registos_urgentes: number;
  registos_criticos: number;
  distribuicao_tipos: Record<TipoRegisto, number>;
  registos_ultimos_30_dias: number;
}

export interface EstatisticasRelatorios {
  total_relatorios: number;
  relatorios_rascunho: number;
  relatorios_aprovados: number;
  relatorios_publicados: number;
  relatorios_ultimos_30_dias: number;
  distribuicao_tipos: Record<TipoRelatorio, number>;
}

// =====================================================
// 8. CONSTANTES E ENUMS
// =====================================================

export const TIPOS_CERTIFICADO: Record<TipoCertificado, string> = {
  qualidade_sistema: 'Qualidade - Sistema',
  qualidade_produto: 'Qualidade - Produto',
  ambiente: 'Ambiente',
  seguranca: 'Segurança',
  energia: 'Energia',
  alimentar: 'Alimentar',
  construcao: 'Construção',
  laboratorio: 'Laboratório',
  calibracao: 'Calibração',
  inspectao: 'Inspeção',
  manutencao: 'Manutenção',
  formacao: 'Formação',
  competencia: 'Competência',
  outro: 'Outro'
};

export const CATEGORIAS_CERTIFICADO: Record<CategoriaCertificado, string> = {
  sistema_gestao: 'Sistema de Gestão',
  produto_servico: 'Produto/Serviço',
  pessoal: 'Pessoal',
  equipamento: 'Equipamento',
  processo: 'Processo',
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  regulamentar: 'Regulamentar',
  voluntario: 'Voluntário',
  outro: 'Outro'
};

export const TIPOS_REGISTO: Record<TipoRegisto, string> = {
  auditoria: 'Auditoria',
  inspecao: 'Inspeção',
  ensaio: 'Ensaio',
  calibracao: 'Calibração',
  manutencao: 'Manutenção',
  formacao: 'Formação',
  competencia: 'Competência',
  incidente: 'Incidente',
  acidente: 'Acidente',
  nao_conformidade: 'Não Conformidade',
  acao_corretiva: 'Ação Corretiva',
  acao_preventiva: 'Ação Preventiva',
  melhoria: 'Melhoria',
  reclamacao: 'Reclamação',
  sugestao: 'Sugestão',
  observacao: 'Observação',
  medicao: 'Medição',
  controlo: 'Controlo',
  verificacao: 'Verificação',
  outro: 'Outro'
};

export const CATEGORIAS_REGISTO: Record<CategoriaRegisto, string> = {
  qualidade: 'Qualidade',
  seguranca: 'Segurança',
  ambiente: 'Ambiente',
  manutencao: 'Manutenção',
  formacao: 'Formação',
  equipamento: 'Equipamento',
  processo: 'Processo',
  pessoal: 'Pessoal',
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  outro: 'Outro'
};

export const TIPOS_TERMO: Record<TipoTermo, string> = {
  contrato: 'Contrato',
  subcontrato: 'Subcontrato',
  fornecimento: 'Fornecimento',
  servico: 'Serviço',
  licenca: 'Licença',
  autorizacao: 'Autorização',
  acordo: 'Acordo',
  protocolo: 'Protocolo',
  memorando: 'Memorando',
  termo_aceitacao: 'Termo de Aceitação',
  termo_responsabilidade: 'Termo de Responsabilidade',
  termo_confidencialidade: 'Termo de Confidencialidade',
  outro: 'Outro'
};

export const CATEGORIAS_TERMO: Record<CategoriaTermo, string> = {
  comercial: 'Comercial',
  tecnico: 'Técnico',
  legal: 'Legal',
  seguranca: 'Segurança',
  ambiente: 'Ambiente',
  qualidade: 'Qualidade',
  recursos_humanos: 'Recursos Humanos',
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  outro: 'Outro'
};

export const TIPOS_RELATORIO: Record<TipoRelatorio, string> = {
  auditoria: 'Auditoria',
  inspecao: 'Inspeção',
  ensaio: 'Ensaio',
  calibracao: 'Calibração',
  manutencao: 'Manutenção',
  formacao: 'Formação',
  competencia: 'Competência',
  incidente: 'Incidente',
  acidente: 'Acidente',
  nao_conformidade: 'Não Conformidade',
  acao_corretiva: 'Ação Corretiva',
  acao_preventiva: 'Ação Preventiva',
  melhoria: 'Melhoria',
  reclamacao: 'Reclamação',
  sugestao: 'Sugestão',
  observacao: 'Observação',
  medicao: 'Medição',
  controlo: 'Controlo',
  verificacao: 'Verificação',
  certificacao: 'Certificação',
  renovacao: 'Renovação',
  suspensao: 'Suspensão',
  cancelamento: 'Cancelamento',
  outro: 'Outro'
};

export const CATEGORIAS_RELATORIO: Record<CategoriaRelatorio, string> = {
  qualidade: 'Qualidade',
  seguranca: 'Segurança',
  ambiente: 'Ambiente',
  manutencao: 'Manutenção',
  formacao: 'Formação',
  equipamento: 'Equipamento',
  processo: 'Processo',
  pessoal: 'Pessoal',
  fornecedor: 'Fornecedor',
  cliente: 'Cliente',
  outro: 'Outro'
};

export const STATUS_CERTIFICADO: Record<StatusCertificado, string> = {
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  cancelado: 'Cancelado',
  expirado: 'Expirado',
  em_renovacao: 'Em Renovação',
  em_suspensao: 'Em Suspensão',
  cancelado_voluntario: 'Cancelado Voluntariamente',
  cancelado_obrigatorio: 'Cancelado Obrigatoriamente'
};

export const STATUS_REGISTO: Record<StatusRegisto, string> = {
  aberto: 'Aberto',
  em_analise: 'Em Análise',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
  fechado: 'Fechado',
  cancelado: 'Cancelado',
  suspenso: 'Suspenso',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado'
};

export const PRIORIDADES_REGISTO: Record<PrioridadeRegisto, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
  urgente: 'Urgente'
};

export const CLASSIFICACOES_CONFIDENCIALIDADE: Record<ClassificacaoConfidencialidade, string> = {
  publico: 'Público',
  interno: 'Interno',
  confidencial: 'Confidencial',
  restrito: 'Restrito'
};

// =====================================================
// FIM DOS TIPOS
// =====================================================
