export interface FilterState {
  searchTerm: string;
  tipo: string;
  estado: string;
  fabricante: string;
  kmInicial: number | '';
  kmFinal: number | '';
  dataInstalacaoInicio: string;
  dataInstalacaoFim: string;
  tensaoMin: number | '';
  tensaoMax: number | '';
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

    // Filtro por tensão mínima
    if (filters.tensaoMin !== '' && item.tensao < filters.tensaoMin) {
      return false;
    }

    // Filtro por tensão máxima
    if (filters.tensaoMax !== '' && item.tensao > filters.tensaoMax) {
      return false;
    }

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
  if ('tensaoMin' in filters && filters.tensaoMin !== '') count++;
  if ('tensaoMax' in filters && filters.tensaoMax !== '') count++;

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
    estado: '',
    fabricante: '',
    kmInicial: '',
    kmFinal: '',
    dataInstalacaoInicio: '',
    dataInstalacaoFim: '',
    tensaoMin: '',
    tensaoMax: ''
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
