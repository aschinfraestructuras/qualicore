// Tipos específicos para o sistema PIE (Pontos de Inspeção e Ensaios)

export interface PIEInstancia {
  id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  status: 'rascunho' | 'em_andamento' | 'concluido' | 'aprovado' | 'reprovado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente' | 'normal';
  data_planeada?: string;
  responsavel?: string;
  zona?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  ppi_modelos?: { nome: string; categoria: string };
  obras?: { nome: string };
}

export interface PIESecao {
  id: string;
  modelo_id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ordem: number;
  obrigatorio: boolean;
  ativo: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PIEPonto {
  id: string;
  secao_id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  tipo: 'checkbox' | 'text' | 'number' | 'select' | 'file' | 'date';
  obrigatorio: boolean;
  ordem: number;
  ativo: boolean;
  opcoes?: string[]; // Para campos select
  validacao?: {
    tipo: string;
    valor: string;
    mensagem: string;
  };
  dependencias?: string[]; // IDs dos pontos que devem ser preenchidos primeiro
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PIEResposta {
  id: string;
  instancia_id: string;
  ponto_id: string;
  data_resposta: string;
  valor?: string;
  valor_booleano?: boolean;
  valor_numerico?: number;
  valor_data?: string; // Para campos de data
  valor_json?: any;
  conforme?: boolean | null; // true = sim, false = não, null = N/A
  responsavel?: string;
  observacoes?: string;
  arquivos?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PIEReportData {
  pie: PIEInstancia;
  secoes: (PIESecao & { pontos: (PIEPonto & { resposta?: PIEResposta })[] })[];
  estatisticas: {
    totalPontos: number;
    pontosPreenchidos: number;
    pontosConformes: number;
    pontosNaoConformes: number;
    pontosNA: number;
    percentagemConclusao: number;
  };
}

// Exportação default para compatibilidade (opcional, se necessário)
export {}; 