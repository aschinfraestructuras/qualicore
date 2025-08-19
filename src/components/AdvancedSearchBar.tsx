import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, History, TrendingUp, Clock } from 'lucide-react';
import { AdvancedSearch, SearchFilter, SearchOptions } from '../lib/advanced-search';

interface AdvancedSearchBarProps {
  onSearch: (query: string, options: SearchOptions) => void;
  placeholder?: string;
  tableName?: string;
  className?: string;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  placeholder = "Pesquisar...",
  tableName = "default",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar história de pesquisa
    setSearchHistory(AdvancedSearch.getSearchHistory());
    
    // Configurar atalho de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Gerar sugestões
    if (query.trim()) {
      const newSuggestions = AdvancedSearch.getSearchSuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    // Fechar sugestões ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const searchOptions: SearchOptions = {
      filters,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder,
    };

    onSearch(query, searchOptions);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addFilter = () => {
    const newFilter: SearchFilter = {
      field: '',
      operator: 'contains',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (index: number, field: keyof SearchFilter, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setQuery('');
    setFilters([]);
    setSortBy('');
    setSortOrder('asc');
    setShowFilters(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const selectHistoryItem = (historyItem: string) => {
    setQuery(historyItem);
    setShowSuggestions(false);
    handleSearch();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Barra de pesquisa principal */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Filter className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSearch}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Pesquisar
          </button>
        </div>
      </div>

      {/* Sugestões */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {/* Sugestões de pesquisa */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Sugestões
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* História de pesquisa */}
          {searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <History className="h-3 w-3 mr-1" />
                Pesquisas recentes
              </div>
              {searchHistory.slice(0, 5).map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => selectHistoryItem(historyItem)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm flex items-center"
                >
                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                  {historyItem}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtros avançados */}
      {showFilters && (
        <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="space-y-4">
            {/* Filtros existentes */}
            {filters.map((filter, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(index, 'field', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Selecionar campo</option>
                  <option value="nome">Nome</option>
                  <option value="descricao">Descrição</option>
                  <option value="data_criacao">Data de Criação</option>
                  <option value="status">Status</option>
                </select>
                
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="equals">Igual a</option>
                  <option value="contains">Contém</option>
                  <option value="starts_with">Começa com</option>
                  <option value="ends_with">Termina com</option>
                  <option value="greater_than">Maior que</option>
                  <option value="less_than">Menor que</option>
                </select>
                
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, 'value', e.target.value)}
                  placeholder="Valor"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                
                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Adicionar novo filtro */}
            <button
              onClick={addFilter}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              + Adicionar Filtro
            </button>

            {/* Ordenação */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Nenhuma ordenação</option>
                <option value="nome">Nome</option>
                <option value="data_criacao">Data de Criação</option>
                <option value="status">Status</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>

            {/* Ações */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <button
                onClick={clearAll}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Limpar tudo
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
