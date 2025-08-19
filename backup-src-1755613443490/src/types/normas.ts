export interface Norma {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaNorma;
  subcategoria: string;
  organismo: OrganismoNormativo;
  versao: string;
  data_publicacao: string;
  data_entrada_vigor: string;
  status: StatusNorma;
  escopo: string;
  aplicabilidade: string[];
  requisitos_principais: string[];
  metodos_ensaio?: string[];
  limites_aceitacao?: Record<string, any>;
  documentos_relacionados: string[];
  documentos_anexos?: Array<{
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
    data_upload: string;
    path?: string; // Caminho no Supabase Storage
  }>;
  observacoes?: string;
  tags: string[];
  prioridade: PrioridadeNorma;
  ultima_atualizacao: string;
  criado_em: string;
  atualizado_em: string;
}

export interface VersaoNorma {
  id: string;
  norma_id: string;
  versao: string;
  data_publicacao: string;
  data_entrada_vigor: string;
  alteracoes_principais: string[];
  status: StatusVersao;
  documento_url?: string;
  observacoes?: string;
  criado_em: string;
}

export interface AplicacaoNorma {
  id: string;
  norma_id: string;
  modulo_id: string;
  modulo_tipo: string;
  aplicabilidade: TipoAplicacao;
  requisitos_especificos: string[];
  verificacoes_necessarias: string[];
  frequencia_verificacao?: string;
  responsavel_verificacao?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface NotificacaoNorma {
  id: string;
  norma_id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  prioridade: PrioridadeNotificacao;
  destinatarios: string[];
  lida: boolean;
  data_envio: string;
  data_leitura?: string;
}

export type CategoriaNorma = 
  | 'CONSTRUCAO_CIVIL'
  | 'FERROVIARIA'
  | 'BETAO_ESTRUTURAL'
  | 'SOLOS_FUNDACOES'
  | 'ACOS_ARMADURA'
  | 'MATERIAIS_CONSTRUCAO'
  | 'SEGURANCA_OBRAS'
  | 'QUALIDADE_GESTAO'
  | 'AMBIENTE_SUSTENTABILIDADE'
  | 'ACESSIBILIDADE'
  | 'ENERGIA_EFICIENCIA'
  | 'SINALIZACAO_SEGURANCA'
  | 'MANUTENCAO_OPERACAO'
  | 'INSPECAO_CONTROLO'
  | 'DOCUMENTACAO_TECNICA';

export type OrganismoNormativo = 
  | 'CEN' // Comité Europeu de Normalização
  | 'ISO' // Organização Internacional de Normalização
  | 'IPQ' // Instituto Português da Qualidade
  | 'ASTM' // American Society for Testing and Materials
  | 'UIC' // Union Internationale des Chemins de fer
  | 'EN' // Normas Europeias
  | 'NP' // Normas Portuguesas
  | 'NP EN' // Normas Portuguesas baseadas em EN
  | 'NP EN ISO' // Normas Portuguesas baseadas em EN ISO
  | 'EN ISO' // Normas Europeias baseadas em ISO
  | 'EN IEC' // Normas Europeias baseadas em IEC
  | 'NP EN IEC' // Normas Portuguesas baseadas em EN IEC
  | 'INFRAESTRUTURAS_PT' // Infraestruturas de Portugal
  | 'REFER' // Rede Ferroviária Nacional
  | 'CP' // Comboios de Portugal
  | 'ADIF' // Administrador de Infraestructuras Ferroviarias (Espanha)
  | 'SNCF' // Société Nationale des Chemins de fer Français
  | 'DB' // Deutsche Bahn (Alemanha)
  | 'RFI' // Rete Ferroviaria Italiana
  | 'OUTRO';

export type StatusNorma = 
  | 'ATIVA'
  | 'REVISAO'
  | 'OBSOLETA'
  | 'SUSPENSA'
  | 'CANCELADA'
  | 'PROJETO'
  | 'EM_CONSULTA';

export type StatusVersao = 
  | 'ATUAL'
  | 'ANTERIOR'
  | 'PROJETO'
  | 'CANCELADA';

export type TipoAplicacao = 
  | 'OBRIGATORIA'
  | 'RECOMENDADA'
  | 'REFERENCIA'
  | 'OPCIONAL'
  | 'ESPECIFICA_PROJETO';

export type TipoNotificacao = 
  | 'NOVA_NORMA'
  | 'ATUALIZACAO_NORMA'
  | 'REVISAO_NORMA'
  | 'CANCELAMENTO_NORMA'
  | 'LEMBRETE_VERIFICACAO'
  | 'ALERTA_APLICABILIDADE'
  | 'NOTIFICACAO_GERAL';

export type PrioridadeNorma = 
  | 'CRITICA'
  | 'ALTA'
  | 'MEDIA'
  | 'BAIXA'
  | 'INFORMATIVA';

export type PrioridadeNotificacao = 
  | 'URGENTE'
  | 'ALTA'
  | 'MEDIA'
  | 'BAIXA';

// Constantes para categorias e subcategorias
export const CATEGORIAS_NORMAS: Record<CategoriaNorma, string> = {
  CONSTRUCAO_CIVIL: 'Construção Civil',
  FERROVIARIA: 'Ferroviária',
  BETAO_ESTRUTURAL: 'Betão Estrutural',
  SOLOS_FUNDACOES: 'Solos e Fundações',
  ACOS_ARMADURA: 'Aços e Armaduras',
  MATERIAIS_CONSTRUCAO: 'Materiais de Construção',
  SEGURANCA_OBRAS: 'Segurança em Obras',
  QUALIDADE_GESTAO: 'Qualidade e Gestão',
  AMBIENTE_SUSTENTABILIDADE: 'Ambiente e Sustentabilidade',
  ACESSIBILIDADE: 'Acessibilidade',
  ENERGIA_EFICIENCIA: 'Energia e Eficiência',
  SINALIZACAO_SEGURANCA: 'Sinalização e Segurança',
  MANUTENCAO_OPERACAO: 'Manutenção e Operação',
  INSPECAO_CONTROLO: 'Inspeção e Controlo',
  DOCUMENTACAO_TECNICA: 'Documentação Técnica'
};

export const SUBCATEGORIAS_NORMAS: Record<CategoriaNorma, string[]> = {
  CONSTRUCAO_CIVIL: [
    'Estruturas',
    'Fundações',
    'Pavimentos',
    'Impermeabilização',
    'Acabamentos',
    'Instalações',
    'Demolições'
  ],
  FERROVIARIA: [
    'Via Férrea',
    'Pontes e Túneis',
    'Sinalização',
    'Eletrificação',
    'Estações',
    'Segurança Ferroviária',
    'Manutenção Ferroviária'
  ],
  BETAO_ESTRUTURAL: [
    'Composição e Propriedades',
    'Fabricação e Transporte',
    'Aplicação e Cura',
    'Ensaios e Controlo',
    'Durabilidade',
    'Reparação e Reforço'
  ],
  SOLOS_FUNDACOES: [
    'Caracterização de Solos',
    'Ensaios de Campo',
    'Ensaios de Laboratório',
    'Fundações Superficiais',
    'Fundações Profundas',
    'Estabilização de Solos',
    'Aterros e Terraplenos'
  ],
  ACOS_ARMADURA: [
    'Aços para Betão',
    'Aços Estruturais',
    'Ensaios Mecânicos',
    'Corrosão e Proteção',
    'Soldadura',
    'Armaduras Pré-fabricadas'
  ],
  MATERIAIS_CONSTRUCAO: [
    'Agregados',
    'Cimentos',
    'Aditivos',
    'Materiais Cerâmicos',
    'Madeiras',
    'Materiais Compósitos',
    'Materiais de Isolamento'
  ],
  SEGURANCA_OBRAS: [
    'Segurança Geral',
    'Equipamentos de Proteção',
    'Sinalização de Segurança',
    'Prevenção de Riscos',
    'Emergências',
    'Saúde Ocupacional'
  ],
  QUALIDADE_GESTAO: [
    'Sistemas de Gestão',
    'Controlo de Qualidade',
    'Ensaios e Verificações',
    'Certificação',
    'Auditorias',
    'Melhoria Contínua'
  ],
  AMBIENTE_SUSTENTABILIDADE: [
    'Gestão Ambiental',
    'Resíduos',
    'Emissões',
    'Eficiência Energética',
    'Materiais Sustentáveis',
    'Avaliação de Impacto'
  ],
  ACESSIBILIDADE: [
    'Acessibilidade Geral',
    'Acessibilidade Ferroviária',
    'Mobilidade Reduzida',
    'Design Universal',
    'Sinalização Acessível'
  ],
  ENERGIA_EFICIENCIA: [
    'Eficiência Energética',
    'Energias Renováveis',
    'Iluminação',
    'Climatização',
    'Gestão de Energia'
  ],
  SINALIZACAO_SEGURANCA: [
    'Sinalização Ferroviária',
    'Sinalização de Segurança',
    'Sistemas de Comunicação',
    'Sistemas de Controlo',
    'Sistemas de Emergência'
  ],
  MANUTENCAO_OPERACAO: [
    'Manutenção Preventiva',
    'Manutenção Corretiva',
    'Gestão de Ativos',
    'Operação Ferroviária',
    'Gestão de Incidentes'
  ],
  INSPECAO_CONTROLO: [
    'Inspeções Regulares',
    'Controlo de Qualidade',
    'Ensaios Não Destrutivos',
    'Monitorização',
    'Avaliação de Condição'
  ],
  DOCUMENTACAO_TECNICA: [
    'Projetos',
    'Especificações',
    'Relatórios',
    'Certificados',
    'Manuais',
    'Procedimentos'
  ]
};

export const ORGANISMOS_NORMATIVOS: Record<OrganismoNormativo, string> = {
  CEN: 'Comité Europeu de Normalização',
  ISO: 'Organização Internacional de Normalização',
  IPQ: 'Instituto Português da Qualidade',
  ASTM: 'American Society for Testing and Materials',
  UIC: 'Union Internationale des Chemins de fer',
  EN: 'Normas Europeias',
  NP: 'Normas Portuguesas',
  'NP EN': 'Normas Portuguesas baseadas em EN',
  'NP EN ISO': 'Normas Portuguesas baseadas em EN ISO',
  'EN ISO': 'Normas Europeias baseadas em ISO',
  'EN IEC': 'Normas Europeias baseadas em IEC',
  'NP EN IEC': 'Normas Portuguesas baseadas em EN IEC',
  INFRAESTRUTURAS_PT: 'Infraestruturas de Portugal',
  REFER: 'Rede Ferroviária Nacional',
  CP: 'Comboios de Portugal',
  ADIF: 'Administrador de Infraestructuras Ferroviarias (Espanha)',
  SNCF: 'Société Nationale des Chemins de fer Français',
  DB: 'Deutsche Bahn (Alemanha)',
  RFI: 'Rete Ferroviaria Italiana',
  OUTRO: 'Outro'
};

// Interface para filtros de pesquisa
export interface FiltrosNormas {
  categoria?: CategoriaNorma;
  subcategoria?: string;
  organismo?: OrganismoNormativo;
  status?: StatusNorma;
  prioridade?: PrioridadeNorma;
  aplicabilidade?: TipoAplicacao;
  data_inicio?: string;
  data_fim?: string;
  tags?: string[];
  texto_livre?: string;
}

// Interface para estatísticas de normas
export interface EstatisticasNormas {
  total_normas: number;
  normas_ativas: number;
  normas_revisao: number;
  normas_obsoletas: number;
  distribuicao_categorias: Record<CategoriaNorma, number>;
  distribuicao_organismos: Record<OrganismoNormativo, number>;
  normas_recentes: number;
  normas_vencendo: number;
  aplicacoes_por_modulo: Record<string, number>;
}
