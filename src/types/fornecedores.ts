export interface FornecedorAvancado {
  id: string;
  codigo: string;
  nome: string;
  nif: string;
  morada: string;
  codigo_postal: string;
  cidade: string;
  pais: string;
  telefone: string;
  email: string;
  website: string;
  contacto_principal: string;
  cargo_contacto: string;
  
  // Informações de Qualificação
  status_qualificacao: 'pendente' | 'qualificado' | 'desqualificado' | 'suspenso';
  data_qualificacao: string;
  data_reavaliacao: string;
  criterios_qualificacao: string[];
  documentos_qualificacao: string[];
  
  // Avaliação de Performance
  classificacao_geral: number; // 1-5
  criterios_avaliacao: {
    qualidade: number;
    prazo_entrega: number;
    preco: number;
    comunicacao: number;
    flexibilidade: number;
    inovacao: number;
  };
  
  // Histórico de Avaliações
  historico_avaliacoes: AvaliacaoFornecedor[];
  
  // Certificações
  certificacoes: CertificacaoFornecedor[];
  
  // Categorias de Produtos/Serviços
  categorias: string[];
  produtos_principais: string[];
  
  // Informações Financeiras
  limite_credito: number;
  condicoes_pagamento: string;
  historico_pagamentos: HistoricoPagamento[];
  
  // Informações de Segurança
  seguro_responsabilidade: boolean;
  certificado_seguranca: string;
  politica_qualidade: string;
  
  // Monitorização
  ultima_auditoria: string;
  proxima_auditoria: string;
  status_monitorizacao: 'ativo' | 'inativo' | 'suspenso';
  
  // Metadados
  data_criacao: string;
  data_atualizacao: string;
  criado_por: string;
  atualizado_por: string;
  observacoes: string;
  tags: string[];
}

export interface AvaliacaoFornecedor {
  id: string;
  fornecedor_id: string;
  data_avaliacao: string;
  avaliador: string;
  tipo_avaliacao: 'qualidade' | 'entrega' | 'servico' | 'preco' | 'geral';
  
  criterios: {
    qualidade: number;
    prazo_entrega: number;
    preco: number;
    comunicacao: number;
    flexibilidade: number;
    inovacao: number;
  };
  
  classificacao_geral: number;
  comentarios: string;
  acoes_melhoria: string[];
  prazo_acoes: string;
  status_acoes: 'pendente' | 'em_execucao' | 'concluido';
  
  documentos_anexos: string[];
  data_criacao: string;
}

export interface CertificacaoFornecedor {
  id: string;
  fornecedor_id: string;
  tipo_certificacao: string;
  organismo_certificador: string;
  numero_certificado: string;
  data_emissao: string;
  data_validade: string;
  status: 'valido' | 'expirado' | 'suspenso';
  documento_certificado: string;
  observacoes: string;
}

export interface HistoricoPagamento {
  id: string;
  fornecedor_id: string;
  data_vencimento: string;
  data_pagamento: string;
  valor: number;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  observacoes: string;
}

export interface CriterioAvaliacao {
  id: string;
  nome: string;
  descricao: string;
  peso: number; // 1-10
  tipo: 'qualidade' | 'entrega' | 'servico' | 'preco' | 'geral';
  ativo: boolean;
}

export interface PlanoAvaliacao {
  id: string;
  nome: string;
  descricao: string;
  criterios: string[]; // IDs dos critérios
  frequencia: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  fornecedores_alvo: string[]; // IDs dos fornecedores
  responsavel: string;
  data_inicio: string;
  data_fim: string;
  status: 'ativo' | 'inativo' | 'concluido';
}
