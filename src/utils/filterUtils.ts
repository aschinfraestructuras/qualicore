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
  ultimaInspecaoInicio: string;
  ultimaInspecaoFim: string;
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

    return true;
  });
}

export function getActiveFiltersCount(filters: FilterState | TravessaFilterState | InspecaoFilterState): number {
  let count = 0;

  if (filters.searchTerm) count++;
  if (filters.tipo) count++;
  if (filters.estado) count++;

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
  ultimaInspecaoInicio: '',
  ultimaInspecaoFim: ''
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
    elemento: ''
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
