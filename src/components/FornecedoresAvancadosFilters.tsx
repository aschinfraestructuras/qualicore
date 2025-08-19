import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FornecedoresAvancadosFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    status_qualificacao: string;
    classificacao_minima: number;
    categoria: string;
    certificacao: boolean;
  };
  setFilters: (filters: any) => void;
}

export function FornecedoresAvancadosFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters
}: FornecedoresAvancadosFiltersProps) {
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status_qualificacao: '',
      classificacao_minima: 0,
      categoria: '',
      certificacao: false
    });
  };

  const hasActiveFilters = searchTerm || 
    filters.status_qualificacao || 
    filters.classificacao_minima > 0 || 
    filters.categoria || 
    filters.certificacao;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          Filtros de Pesquisa
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Pesquisa */}
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pesquisar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, código, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status de Qualificação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status_qualificacao}
            onChange={(e) => setFilters({ ...filters, status_qualificacao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="qualificado">Qualificado</option>
            <option value="pendente">Pendente</option>
            <option value="suspenso">Suspenso</option>
            <option value="desqualificado">Desqualificado</option>
          </select>
        </div>

        {/* Classificação Mínima */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classificação Mínima
          </label>
          <select
            value={filters.classificacao_minima}
            onChange={(e) => setFilters({ ...filters, classificacao_minima: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Qualquer</option>
            <option value={1}>1+ Estrelas</option>
            <option value={2}>2+ Estrelas</option>
            <option value={3}>3+ Estrelas</option>
            <option value={4}>4+ Estrelas</option>
            <option value={4.5}>4.5+ Estrelas</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={filters.categoria}
            onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="materiais">Materiais</option>
            <option value="servicos">Serviços</option>
            <option value="equipamentos">Equipamentos</option>
            <option value="laboratorio">Laboratório</option>
            <option value="construcao">Construção</option>
            <option value="consultoria">Consultoria</option>
          </select>
        </div>

        {/* Certificação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificação
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="certificacao"
              checked={filters.certificacao}
              onChange={(e) => setFilters({ ...filters, certificacao: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="certificacao" className="ml-2 text-sm text-gray-700">
              Com certificação
            </label>
          </div>
        </div>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Pesquisa: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.status_qualificacao && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Status: {filters.status_qualificacao}
                <button
                  onClick={() => setFilters({ ...filters, status_qualificacao: '' })}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.classificacao_minima > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                Classificação: {filters.classificacao_minima}+ estrelas
                <button
                  onClick={() => setFilters({ ...filters, classificacao_minima: 0 })}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.categoria && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Categoria: {filters.categoria}
                <button
                  onClick={() => setFilters({ ...filters, categoria: '' })}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.certificacao && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Com certificação
                <button
                  onClick={() => setFilters({ ...filters, certificacao: false })}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
