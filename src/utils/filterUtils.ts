export interface FilterState {
  searchTerm: string;
  tipo: string;
  categoria: string;
  estado: string;
  fabricante: string;
  kmInicial: number | '';
  kmFinal: number | '';
  dataInstalacaoInicio: string;
  dataInstalacaoFim: string;
  statusOperacional: string;
  // Parâmetros técnicos (Sinalização)
  alcanceMin: number | '';
  potenciaMin: number | '';
  sensibilidadeMin: number | '';
  frequencia: string;
  // Parâmetros técnicos (Eletrificação)
  tensaoMin: number | '';
  correnteMin: number | '';
  potenciaEletricaMin: number | '';
  frequenciaEletrica: string;
  // Parâmetros técnicos (Pontes & Túneis)
  comprimentoMin: number | '';
  larguraMin: number | '';
  alturaMin: number | '';
  capacidadeCargaMin: number | '';
  // Parâmetros técnicos (Estações)
  numPlataformasMin: number | '';
  numViasMin: number | '';
  areaTotalMin: number | '';
  capacidadePassageirosMin: number | '';
  // Parâmetros técnicos (Segurança)
  nivelSegurancaMin: number | '';
  raioCoberturaMin: number | '';
  tempoRespostaMax: number | '';
  capacidadeDeteccaoMin: number | '';
  ultimaInspecaoInicio: string;
  ultimaInspecaoFim: string;
  // Parâmetros técnicos (Betonagens)
  elementoEstrutural: string;
  localizacao: string;
  fornecedor: string;
  statusConformidade: string;
  dataBetonagemInicio: string;
  dataBetonagemFim: string;
  dataEnsaio7dInicio: string;
  dataEnsaio7dFim: string;
  dataEnsaio28dInicio: string;
  dataEnsaio28dFim: string;
  slumpMin: number | '';
  temperaturaMin: number | '';
  temperaturaMax: number | '';
  resistencia7dMin: number | '';
  resistencia28dMin: number | '';
  resistenciaRoturaMin: number | '';
}

export interface TravessaFilterState {
  searchTerm: string;
  tipo: string;
  estado: string;
  fabricante: string;
  kmInicial: number | '';
  kmFinal: number | '';
  dataInstalacaoInicio: string;
  dataInstalacaoFim: string;
  material: string;
}

export interface InspecaoFilterState {
  searchTerm: string;
  tipo: string;
  resultado: string;
  inspector: string;
  dataInspecaoInicio: string;
  dataInspecaoFim: string;
  elemento: string;
  estado: string;
}

export function applyFilters(data: any[], filters: FilterState): any[] {
  return data.filter(item => {
    // Busca por termo
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchFields = [
        item.codigo,
        item.localizacao,
        item.modelo,
        item.fabricante,
        item.tipo,
        item.categoria
      ].map(field => String(field || '').toLowerCase());
      
      if (!searchFields.some(field => field.includes(searchLower))) {
        return false;
      }
    }

    // Filtros específicos
    if (filters.tipo && item.tipo !== filters.tipo) return false;
    if (filters.categoria && item.categoria !== filters.categoria) return false;
    if (filters.estado && item.estado !== filters.estado) return false;
    if (filters.fabricante && item.fabricante !== filters.fabricante) return false;
    if (filters.statusOperacional && item.status_operacional !== filters.statusOperacional) return false;

    // Filtros de KM
    if (filters.kmInicial !== '' && item.km_inicial < filters.kmInicial) return false;
    if (filters.kmFinal !== '' && item.km_final > filters.kmFinal) return false;

    // Filtros de data de instalação
    if (filters.dataInstalacaoInicio && item.data_instalacao < filters.dataInstalacaoInicio) return false;
    if (filters.dataInstalacaoFim && item.data_instalacao > filters.dataInstalacaoFim) return false;

    // Filtros de parâmetros técnicos (Sinalização)
    if (filters.alcanceMin !== '' && (item.parametros?.alcance || 0) < filters.alcanceMin) return false;
    if (filters.potenciaMin !== '' && (item.parametros?.potencia || 0) < filters.potenciaMin) return false;
    if (filters.sensibilidadeMin !== '' && (item.parametros?.sensibilidade || 0) < filters.sensibilidadeMin) return false;
    if (filters.frequencia && item.parametros?.frequencia !== filters.frequencia) return false;

    // Filtros de parâmetros técnicos (Eletrificação)
    if (filters.tensaoMin !== '' && (item.parametros?.tensao || 0) < filters.tensaoMin) return false;
    if (filters.correnteMin !== '' && (item.parametros?.corrente || 0) < filters.correnteMin) return false;
    if (filters.potenciaEletricaMin !== '' && (item.parametros?.potencia || 0) < filters.potenciaEletricaMin) return false;
    if (filters.frequenciaEletrica && item.parametros?.frequencia !== filters.frequenciaEletrica) return false;

        // Filtros de parâmetros técnicos (Pontes & Túneis)
    if (filters.comprimentoMin !== '' && (item.parametros?.comprimento || 0) < filters.comprimentoMin) return false;
    if (filters.larguraMin !== '' && (item.parametros?.largura || 0) < filters.larguraMin) return false;
    if (filters.alturaMin !== '' && (item.parametros?.altura || 0) < filters.alturaMin) return false;
    if (filters.capacidadeCargaMin !== '' && (item.parametros?.capacidade_carga || 0) < filters.capacidadeCargaMin) return false;

    // Filtros de parâmetros técnicos (Estações)
    if (filters.numPlataformasMin !== '' && (item.parametros?.num_plataformas || 0) < filters.numPlataformasMin) return false;
    if (filters.numViasMin !== '' && (item.parametros?.num_vias || 0) < filters.numViasMin) return false;
    if (filters.areaTotalMin !== '' && (item.parametros?.area_total || 0) < filters.areaTotalMin) return false;
    if (filters.capacidadePassageirosMin !== '' && (item.parametros?.capacidade_passageiros || 0) < filters.capacidadePassageirosMin) return false;

    // Filtros de parâmetros técnicos (Segurança)
    if (filters.nivelSegurancaMin !== '' && (item.parametros?.nivel_seguranca || 0) < filters.nivelSegurancaMin) return false;
    if (filters.raioCoberturaMin !== '' && (item.parametros?.raio_cobertura || 0) < filters.raioCoberturaMin) return false;
    if (filters.tempoRespostaMax !== '' && (item.parametros?.tempo_resposta || 0) > filters.tempoRespostaMax) return false;
    if (filters.capacidadeDeteccaoMin !== '' && (item.parametros?.capacidade_deteccao || 0) < filters.capacidadeDeteccaoMin) return false;
  
    // Filtros de parâmetros técnicos (Betonagens)
    if (filters.elementoEstrutural && item.elemento_estrutural !== filters.elementoEstrutural) return false;
    if (filters.localizacao && !item.localizacao?.toLowerCase().includes(filters.localizacao.toLowerCase())) return false;
    if (filters.fornecedor && !item.fornecedor?.toLowerCase().includes(filters.fornecedor.toLowerCase())) return false;
    if (filters.statusConformidade && item.status_conformidade !== filters.statusConformidade) return false;
    if (filters.dataBetonagemInicio && item.data_betonagem < filters.dataBetonagemInicio) return false;
    if (filters.dataBetonagemFim && item.data_betonagem > filters.dataBetonagemFim) return false;
    if (filters.dataEnsaio7dInicio && item.data_ensaio_7d < filters.dataEnsaio7dInicio) return false;
    if (filters.dataEnsaio7dFim && item.data_ensaio_7d > filters.dataEnsaio7dFim) return false;
    if (filters.dataEnsaio28dInicio && item.data_ensaio_28d < filters.dataEnsaio28dInicio) return false;
    if (filters.dataEnsaio28dFim && item.data_ensaio_28d > filters.dataEnsaio28dFim) return false;
    if (filters.slumpMin !== '' && (item.slump || 0) < filters.slumpMin) return false;
    if (filters.temperaturaMin !== '' && (item.temperatura || 0) < filters.temperaturaMin) return false;
    if (filters.temperaturaMax !== '' && (item.temperatura || 0) > filters.temperaturaMax) return false;
    if (filters.resistencia7dMin !== '' && ((item.resistencia_7d_1 + item.resistencia_7d_2) / 2 || 0) < filters.resistencia7dMin) return false;
    if (filters.resistencia28dMin !== '' && ((item.resistencia_28d_1 + item.resistencia_28d_2 + item.resistencia_28d_3) / 3 || 0) < filters.resistencia28dMin) return false;
    if (filters.resistenciaRoturaMin !== '' && (item.resistencia_rotura || 0) < filters.resistenciaRoturaMin) return false;
  
    // Filtros de inspeção
    if (filters.ultimaInspecaoInicio && item.ultima_inspecao < filters.ultimaInspecaoInicio) return false;
    if (filters.ultimaInspecaoFim && item.ultima_inspecao > filters.ultimaInspecaoFim) return false;

    return true;
  });
}

export function applyTravessaFilters(data: any[], filters: TravessaFilterState): any[] {
  return data.filter(item => {
    // Busca por texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableFields = [
        item.codigo,
        item.fabricante,
        item.tipo,
        item.estado,
        item.material
      ].map(field => String(field || '').toLowerCase());

      if (!searchableFields.some(field => field.includes(searchLower))) {
        return false;
      }
    }

    // Filtro por tipo
    if (filters.tipo && item.tipo !== filters.tipo) {
      return false;
    }

    // Filtro por estado
    if (filters.estado && item.estado !== filters.estado) {
      return false;
    }

    // Filtro por material
    if (filters.material && item.material !== filters.material) {
      return false;
    }

    // Filtro por fabricante
    if (filters.fabricante && item.fabricante !== filters.fabricante) {
      return false;
    }

    // Filtro por KM inicial
    if (filters.kmInicial !== '' && item.km_inicial < filters.kmInicial) {
      return false;
    }

    // Filtro por KM final
    if (filters.kmFinal !== '' && item.km_final > filters.kmFinal) {
      return false;
    }

    // Filtro por data de instalação (início)
    if (filters.dataInstalacaoInicio && item.data_instalacao) {
      const itemDate = new Date(item.data_instalacao);
      const filterDate = new Date(filters.dataInstalacaoInicio);
      if (itemDate < filterDate) {
        return false;
      }
    }

    // Filtro por data de instalação (fim)
    if (filters.dataInstalacaoFim && item.data_instalacao) {
      const itemDate = new Date(item.data_instalacao);
      const filterDate = new Date(filters.dataInstalacaoFim);
      if (itemDate > filterDate) {
        return false;
      }
    }

    return true;
  });
}

export function applyInspecaoFilters(data: any[], filters: InspecaoFilterState): any[] {
  return data.filter(item => {
    // Busca por texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableFields = [
        item.inspector,
        item.observacoes,
        item.acoes_corretivas,
        item.tipo,
        item.resultado
      ].map(field => String(field || '').toLowerCase());

      if (!searchableFields.some(field => field.includes(searchLower))) {
        return false;
      }
    }

    // Filtro por tipo
    if (filters.tipo && item.tipo !== filters.tipo) {
      return false;
    }

    // Filtro por resultado
    if (filters.resultado && item.resultado !== filters.resultado) {
      return false;
    }

    // Filtro por inspector
    if (filters.inspector && !item.inspector?.toLowerCase().includes(filters.inspector.toLowerCase())) {
      return false;
    }

    // Filtro por elemento (trilho ou travessa)
    if (filters.elemento) {
      const trilhoCode = item.trilho_id ? `TR-${item.trilho_id}` : '';
      const travessaCode = item.travessa_id ? `TV-${item.travessa_id}` : '';
      if (!trilhoCode.includes(filters.elemento) && !travessaCode.includes(filters.elemento)) {
        return false;
      }
    }

    // Filtro por data de inspeção (início)
    if (filters.dataInspecaoInicio && item.data_inspecao) {
      const itemDate = new Date(item.data_inspecao);
      const filterDate = new Date(filters.dataInspecaoInicio);
      if (itemDate < filterDate) {
        return false;
      }
    }

    // Filtro por data de inspeção (fim)
    if (filters.dataInspecaoFim && item.data_inspecao) {
      const itemDate = new Date(item.data_inspecao);
      const filterDate = new Date(filters.dataInspecaoFim);
      if (itemDate > filterDate) {
        return false;
      }
    }

    // Filtro por estado
    if (filters.estado && item.estado !== filters.estado) {
      return false;
    }

    return true;
  });
}

export function getActiveFiltersCount(filters: FilterState | TravessaFilterState | InspecaoFilterState): number {
  let count = 0;

  if (filters.searchTerm) count++;
  if (filters.tipo) count++;
  if ('estado' in filters && filters.estado) count++;

  // Filtros específicos de Trilhos
  if ('fabricante' in filters && filters.fabricante) count++;
  if ('kmInicial' in filters && filters.kmInicial !== '') count++;
  if ('kmFinal' in filters && filters.kmFinal !== '') count++;
  if ('dataInstalacaoInicio' in filters && filters.dataInstalacaoInicio) count++;
  if ('dataInstalacaoFim' in filters && filters.dataInstalacaoFim) count++;
  if ('statusOperacional' in filters && filters.statusOperacional) count++;
  if ('categoria' in filters && filters.categoria) count++;
  
  // Filtros de parâmetros técnicos (Sinalização)
  if ('alcanceMin' in filters && filters.alcanceMin !== '') count++;
  if ('potenciaMin' in filters && filters.potenciaMin !== '') count++;
  if ('sensibilidadeMin' in filters && filters.sensibilidadeMin !== '') count++;
  if ('frequencia' in filters && filters.frequencia) count++;
  
  // Filtros de parâmetros técnicos (Eletrificação)
  if ('tensaoMin' in filters && filters.tensaoMin !== '') count++;
  if ('correnteMin' in filters && filters.correnteMin !== '') count++;
  if ('potenciaEletricaMin' in filters && filters.potenciaEletricaMin !== '') count++;
  if ('frequenciaEletrica' in filters && filters.frequenciaEletrica) count++;
  
    // Filtros de parâmetros técnicos (Pontes & Túneis)
  if ('comprimentoMin' in filters && filters.comprimentoMin !== '') count++;
  if ('larguraMin' in filters && filters.larguraMin !== '') count++;
  if ('alturaMin' in filters && filters.alturaMin !== '') count++;
  if ('capacidadeCargaMin' in filters && filters.capacidadeCargaMin !== '') count++;

  // Filtros de parâmetros técnicos (Estações)
  if ('numPlataformasMin' in filters && filters.numPlataformasMin !== '') count++;
  if ('numViasMin' in filters && filters.numViasMin !== '') count++;
  if ('areaTotalMin' in filters && filters.areaTotalMin !== '') count++;
  if ('capacidadePassageirosMin' in filters && filters.capacidadePassageirosMin !== '') count++;

  // Filtros de parâmetros técnicos (Segurança)
  if ('nivelSegurancaMin' in filters && filters.nivelSegurancaMin !== '') count++;
  if ('raioCoberturaMin' in filters && filters.raioCoberturaMin !== '') count++;
  if ('tempoRespostaMax' in filters && filters.tempoRespostaMax !== '') count++;
  if ('capacidadeDeteccaoMin' in filters && filters.capacidadeDeteccaoMin !== '') count++;
    
  // Filtros de parâmetros técnicos (Betonagens)
  if ('elementoEstrutural' in filters && filters.elementoEstrutural !== '') count++;
  if ('localizacao' in filters && filters.localizacao !== '') count++;
  if ('fornecedor' in filters && filters.fornecedor !== '') count++;
  if ('statusConformidade' in filters && filters.statusConformidade !== '') count++;
  if ('dataBetonagemInicio' in filters && filters.dataBetonagemInicio !== '') count++;
  if ('dataBetonagemFim' in filters && filters.dataBetonagemFim !== '') count++;
  if ('dataEnsaio7dInicio' in filters && filters.dataEnsaio7dInicio !== '') count++;
  if ('dataEnsaio7dFim' in filters && filters.dataEnsaio7dFim !== '') count++;
  if ('dataEnsaio28dInicio' in filters && filters.dataEnsaio28dInicio !== '') count++;
  if ('dataEnsaio28dFim' in filters && filters.dataEnsaio28dFim !== '') count++;
  if ('slumpMin' in filters && filters.slumpMin !== '') count++;
  if ('temperaturaMin' in filters && filters.temperaturaMin !== '') count++;
  if ('temperaturaMax' in filters && filters.temperaturaMax !== '') count++;
  if ('resistencia7dMin' in filters && filters.resistencia7dMin !== '') count++;
  if ('resistencia28dMin' in filters && filters.resistencia28dMin !== '') count++;
  if ('resistenciaRoturaMin' in filters && filters.resistenciaRoturaMin !== '') count++;
    
  // Filtros de inspeção
  if ('ultimaInspecaoInicio' in filters && filters.ultimaInspecaoInicio) count++;
  if ('ultimaInspecaoFim' in filters && filters.ultimaInspecaoFim) count++;

  // Filtros específicos de Travessas
  if ('material' in filters && filters.material) count++;

  // Filtros específicos de Inspeções
  if ('resultado' in filters && filters.resultado) count++;
  if ('inspector' in filters && filters.inspector) count++;
  if ('dataInspecaoInicio' in filters && filters.dataInspecaoInicio) count++;
  if ('dataInspecaoFim' in filters && filters.dataInspecaoFim) count++;
  if ('elemento' in filters && filters.elemento) count++;

  return count;
}

export function getDefaultFilters(): FilterState {
  return {
    searchTerm: '',
    tipo: '',
    categoria: '',
    estado: '',
    fabricante: '',
    kmInicial: '',
    kmFinal: '',
    dataInstalacaoInicio: '',
    dataInstalacaoFim: '',
    statusOperacional: '',
    // Parâmetros técnicos (Sinalização)
    alcanceMin: '',
    potenciaMin: '',
    sensibilidadeMin: '',
    frequencia: '',
    // Parâmetros técnicos (Eletrificação)
      tensaoMin: '',
  correnteMin: '',
  potenciaEletricaMin: '',
  frequenciaEletrica: '',
    comprimentoMin: '',
  larguraMin: '',
  alturaMin: '',
  capacidadeCargaMin: '',
  numPlataformasMin: '',
  numViasMin: '',
  areaTotalMin: '',
  capacidadePassageirosMin: '',
  nivelSegurancaMin: '',
  raioCoberturaMin: '',
  tempoRespostaMax: '',
  capacidadeDeteccaoMin: '',
  ultimaInspecaoInicio: '',
  ultimaInspecaoFim: '',
  // Parâmetros técnicos (Betonagens)
  elementoEstrutural: '',
  localizacao: '',
  fornecedor: '',
  statusConformidade: '',
  dataBetonagemInicio: '',
  dataBetonagemFim: '',
  dataEnsaio7dInicio: '',
  dataEnsaio7dFim: '',
  dataEnsaio28dInicio: '',
  dataEnsaio28dFim: '',
  slumpMin: '',
  temperaturaMin: '',
  temperaturaMax: '',
  resistencia7dMin: '',
  resistencia28dMin: '',
  resistenciaRoturaMin: ''
  };
}

export function getDefaultTravessaFilters(): TravessaFilterState {
  return {
    searchTerm: '',
    tipo: '',
    estado: '',
    fabricante: '',
    kmInicial: '',
    kmFinal: '',
    dataInstalacaoInicio: '',
    dataInstalacaoFim: '',
    material: ''
  };
}

export function getDefaultInspecaoFilters(): InspecaoFilterState {
  return {
    searchTerm: '',
    tipo: '',
    resultado: '',
    inspector: '',
    dataInspecaoInicio: '',
    dataInspecaoFim: '',
    elemento: '',
    estado: ''
  };
}

export function sortData(data: any[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): any[] {
  return [...data].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Tratar valores nulos/undefined
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    // Tratar números
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Tratar strings
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (sortOrder === 'asc') {
      return aString.localeCompare(bString);
    } else {
      return bString.localeCompare(aString);
    }
  });
}

export function paginateData(data: any[], page: number, pageSize: number): any[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}
