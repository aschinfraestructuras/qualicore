import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface EstacoesFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  activeFiltersCount: number;
}

export function EstacoesFilters({ filters, onFiltersChange, activeFiltersCount }: EstacoesFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: string, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      tipo: '',
      categoria: '',
      estado: '',
      operador: '',
      kmMin: '',
      kmMax: '',
      dataInauguracaoInicio: '',
      dataInauguracaoFim: '',
      numPlataformasMin: '',
      numViasMin: '',
      areaTotalMin: '',
      capacidadePassageirosMin: '',
      ultimaInspecaoInicio: '',
      ultimaInspecaoFim: ''
    });
  };

  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Limpar</span>
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-1"
          >
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span>{showAdvanced ? 'Menos' : 'Mais'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por código, nome, localização..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="Principal">Principal</option>
            <option value="Secundária">Secundária</option>
            <option value="Terminal">Terminal</option>
            <option value="Intercambiador">Intercambiador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={filters.categoria}
            onChange={(e) => handleFilterChange('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            <option value="Terminal">Terminal</option>
            <option value="Intercambiador">Intercambiador</option>
            <option value="Regional">Regional</option>
            <option value="Metropolitana">Metropolitana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os estados</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Avaria">Avaria</option>
            <option value="Desligado">Desligado</option>
            <option value="Planejado">Planejado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
          <input
            type="text"
            placeholder="Ex: CP"
            value={filters.operador}
            onChange={(e) => handleFilterChange('operador', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Filtros Avançados</h4>
              
              {/* KM Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KM Mínimo</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={filters.kmMin}
                    onChange={(e) => handleFilterChange('kmMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KM Máximo</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="999.999"
                    value={filters.kmMax}
                    onChange={(e) => handleFilterChange('kmMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Data de Inauguração Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Inauguração Início</label>
                  <input
                    type="date"
                    value={filters.dataInauguracaoInicio}
                    onChange={(e) => handleFilterChange('dataInauguracaoInicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Inauguração Fim</label>
                  <input
                    type="date"
                    value={filters.dataInauguracaoFim}
                    onChange={(e) => handleFilterChange('dataInauguracaoFim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Parâmetros Técnicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº Plataformas Mín</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={filters.numPlataformasMin}
                    onChange={(e) => handleFilterChange('numPlataformasMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº Vias Mín</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={filters.numViasMin}
                    onChange={(e) => handleFilterChange('numViasMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área Total Mín (m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={filters.areaTotalMin}
                    onChange={(e) => handleFilterChange('areaTotalMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade Passageiros Mín</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={filters.capacidadePassageirosMin}
                    onChange={(e) => handleFilterChange('capacidadePassageirosMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Última Inspeção Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Última Inspeção Início</label>
                  <input
                    type="date"
                    value={filters.ultimaInspecaoInicio}
                    onChange={(e) => handleFilterChange('ultimaInspecaoInicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Última Inspeção Fim</label>
                  <input
                    type="date"
                    value={filters.ultimaInspecaoFim}
                    onChange={(e) => handleFilterChange('ultimaInspecaoFim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
