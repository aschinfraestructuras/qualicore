export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface SearchOptions {
  filters: SearchFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}

export class AdvancedSearch {
  private static searchIndex: Map<string, any[]> = new Map();
  private static searchHistory: string[] = [];

  // Indexar dados para pesquisa rápida
  static async indexData(tableName: string, data: any[]) {
    const indexedData = data.map(item => ({
      ...item,
      _searchText: this.generateSearchText(item),
      _searchTokens: this.tokenize(this.generateSearchText(item))
    }));

    this.searchIndex.set(tableName, indexedData);
  }

  // Gerar texto de pesquisa
  private static generateSearchText(item: any): string {
    return Object.values(item)
      .filter(value => typeof value === 'string' || typeof value === 'number')
      .join(' ')
      .toLowerCase();
  }

  // Tokenizar texto para pesquisa
  private static tokenize(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(token => token.length > 2)
      .map(token => token.toLowerCase());
  }

  // Pesquisa avançada
  static async search(tableName: string, query: string, options: SearchOptions = { filters: [] }): Promise<any[]> {
    const indexedData = this.searchIndex.get(tableName) || [];
    
    // Adicionar à história de pesquisa
    if (query.trim()) {
      this.addToSearchHistory(query);
    }

    // Pesquisa por texto
    let results = this.textSearch(indexedData, query);

    // Aplicar filtros
    results = this.applyFilters(results, options.filters);

    // Ordenar resultados
    if (options.sortBy) {
      results = this.sortResults(results, options.sortBy, options.sortOrder || 'asc');
    }

    // Paginação
    if (options.limit) {
      const offset = options.offset || 0;
      results = results.slice(offset, offset + options.limit);
    }

    return results;
  }

  // Pesquisa por texto
  private static textSearch(data: any[], query: string): any[] {
    if (!query.trim()) return data;

    const queryTokens = this.tokenize(query);
    
    return data.filter(item => {
      const itemTokens = item._searchTokens || [];
      
      // Verificar se todos os tokens da query estão presentes
      return queryTokens.every(queryToken =>
        itemTokens.some(itemToken => itemToken.includes(queryToken))
      );
    });
  }

  // Aplicar filtros
  private static applyFilters(data: any[], filters: SearchFilter[]): any[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = this.getNestedValue(item, filter.field);
        return this.evaluateFilter(value, filter);
      });
    });
  }

  // Obter valor aninhado
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Avaliar filtro
  private static evaluateFilter(value: any, filter: SearchFilter): boolean {
    const filterValue = filter.value;

    switch (filter.operator) {
      case 'equals':
        return value === filterValue;
      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      case 'starts_with':
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
      case 'ends_with':
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
      case 'greater_than':
        return Number(value) > Number(filterValue);
      case 'less_than':
        return Number(value) < Number(filterValue);
      case 'in':
        return Array.isArray(filterValue) && filterValue.includes(value);
      case 'not_in':
        return Array.isArray(filterValue) && !filterValue.includes(value);
      default:
        return true;
    }
  }

  // Ordenar resultados
  private static sortResults(data: any[], sortBy: string, sortOrder: 'asc' | 'desc'): any[] {
    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy);
      const bValue = this.getNestedValue(b, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Adicionar à história de pesquisa
  private static addToSearchHistory(query: string) {
    this.searchHistory = [
      query,
      ...this.searchHistory.filter(q => q !== query)
    ].slice(0, 10); // Manter apenas as últimas 10 pesquisas
  }

  // Obter história de pesquisa
  static getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  // Limpar história de pesquisa
  static clearSearchHistory() {
    this.searchHistory = [];
  }

  // Sugestões de pesquisa
  static getSearchSuggestions(query: string): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    
    // Adicionar da história de pesquisa
    this.searchHistory.forEach(historyQuery => {
      if (historyQuery.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(historyQuery);
      }
    });

    // Adicionar sugestões baseadas em dados indexados
    this.searchIndex.forEach((data, tableName) => {
      data.forEach(item => {
        const searchText = item._searchText || '';
        const tokens = searchText.split(/\s+/);
        
        tokens.forEach(token => {
          if (token.toLowerCase().includes(query.toLowerCase()) && token.length > 2) {
            suggestions.add(token);
          }
        });
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  // Pesquisa fuzzy
  static fuzzySearch(data: any[], query: string, threshold: number = 0.6): any[] {
    if (!query.trim()) return data;

    return data.filter(item => {
      const searchText = item._searchText || '';
      const similarity = this.calculateSimilarity(searchText, query.toLowerCase());
      return similarity >= threshold;
    });
  }

  // Calcular similaridade (algoritmo simples de Levenshtein)
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Distância de Levenshtein
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Limpar índice
  static clearIndex(tableName?: string) {
    if (tableName) {
      this.searchIndex.delete(tableName);
    } else {
      this.searchIndex.clear();
    }
  }

  // Obter estatísticas do índice
  static getIndexStats() {
    const stats: any = {};
    
    this.searchIndex.forEach((data, tableName) => {
      stats[tableName] = {
        recordCount: data.length,
        indexedFields: data.length > 0 ? Object.keys(data[0]).filter(key => !key.startsWith('_')) : []
      };
    });

    return stats;
  }
}
