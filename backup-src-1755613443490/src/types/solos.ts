export interface CaracterizacaoSolo {
  id?: string;
  codigo: string;
  obra: string;
  localizacao: string;
  coordenadas_gps?: string;
  data_colheita: string;
  data_rececao_laboratorio: string;
  data_resultados: string;
  laboratorio: string;
  responsavel_tecnico: string;
  fiscal_obra: string;
  
  // Identificação da Amostra
  profundidade_colheita: number;
  tipo_amostra: 'Disturbada' | 'Indeformada' | 'Sondagem';
  numero_amostra: string;
  descricao_visual: string;
  
  // Características Físicas
  humidade_natural: number; // %
  densidade_natural: number; // g/cm³
  densidade_seca: number; // g/cm³
  indice_vazios: number;
  porosidade: number; // %
  
  // Granulometria por Peneiração (como na imagem)
  granulometria_peneiracao: {
    p80: number; // %
    p63: number; // %
    p50: number; // %
    p40: number; // %
    p25: number; // %
    p20: number; // %
    p10: number; // %
    p5: number; // %
    p2: number; // %
    p04: number; // %
    p008: number; // %
  };
  
  // Granulometria por Sedimentação
  granulometria_sedimentacao: {
    silte: number; // %
    argila: number; // %
    coeficiente_uniformidade: number;
    coeficiente_curvatura: number;
  };
  
  // Limites de Consistência (Atterberg)
  limites_consistencia: {
    limite_liquidez: number; // %
    limite_plasticidade: number; // %
    indice_plasticidade: number;
    indice_liquidez: number;
  };
  
  // Ensaios de Compactação
  proctor_normal: {
    humidade_otima: number; // %
    densidade_maxima: number; // g/cm³
    grau_compactacao: number; // %
  };
  
  proctor_modificado: {
    humidade_otima: number; // %
    densidade_maxima: number; // g/cm³
    grau_compactacao: number; // %
  };
  
  // Ensaios de Resistência
  cbr: {
    valor_cbr: number; // %
    expansao: number; // %
    penetracao: number; // mm
  };
  
  resistencia_cisalhamento: {
    coesao: number; // kPa
    angulo_atrito: number; // graus
    tipo_ensaio: 'Direto' | 'Triaxial' | 'Cisalhamento';
  };
  
  // Características Químicas
  caracteristicas_quimicas: {
    ph: number;
    materia_organica: number; // %
    sulfatos: number; // mg/kg
    gessos: number; // %
    carbonatos: number; // %
    cloretos: number; // mg/kg
    capacidade_troca_cationica: number; // meq/100g
    sais_soluveis: number; // %
    sulfatos_soluveis_so3: number; // %
  };
  
  // Ensaios Específicos
  ensaios_especificos: {
    hinchamiento_livre: number; // %
    colapso: number; // %
    permeabilidade: number; // m/s
    compressibilidade: number; // m²/kN
    consolidacao: {
      indice_compressao: number;
      indice_recompressao: number;
      pressao_preconsolidacao: number; // kPa
    };
  };
  
  // Classificação
  classificacao: {
    sistema_unificado: string; // USCS
    sistema_aashto: string; // AASHTO
    grupo_portugues: string; // Sistema português
    adequacao: 'INADECUADO' | 'TOLERABLE' | 'MARGINAL' | 'ADEQUADO' | 'EXCELENTE';
  };
  
  // Conformidade e Observações
  conforme: boolean;
  observacoes: string;
  recomendacoes: string;
  
  // Documentação
  relatorio_laboratorio: string; // URL do PDF
  certificado_laboratorio: string; // URL do PDF
  fotos_amostra: string[]; // URLs das fotos
  
  // Metadados
  normas_referencia: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface FiltroSolos {
  search: string;
  obra: string;
  laboratorio: string;
  dataInicio: string;
  dataFim: string;
  conforme: string;
  tipo_amostra: string;
  profundidade_min: number;
  profundidade_max: number;
  adequacao: string;
}
