import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, ChevronUp, Zap, Settings, Activity
} from 'lucide-react';
import { FilterState } from '../utils/filterUtils';

interface EletrificacaoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  type: 'eletrificacoes' | 'inspecoes';
}

export function EletrificacaoFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  type
}: EletrificacaoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  // Opções específicas para Eletrificação
  const tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Catenária', label: 'Catenária' },
    { value: 'Subestação', label: 'Subestação' },
    { value: 'Poste', label: 'Poste' },
    { value: 'Transformador', label: 'Transformador' },
    { value: 'Cabo', label: 'Cabo' },
    { value: 'Disjuntor', label: 'Disjuntor' }
  ];

  const categoriaOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Alimentação', label: 'Alimentação' },
    { value: 'Transformação', label: 'Transformação' },
    { value: 'Distribuição', label: 'Distribuição' },
    { value: 'Proteção', label: 'Proteção' },
    { value: 'Controle', label: 'Controle' }
  ];

  const estadoOptions = [
    { value: '', label: 'Todos os estados' },
    { value: 'Operacional', label: 'Operacional' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avaria', label: 'Avaria' },
    { value: 'Desligado', label: 'Desligado' }
  ];

  const fabricanteOptions = [
    { value: '', label: 'Todos os fabricantes' },
    { value: 'Siemens', label: 'Siemens' },
    { value: 'ABB', label: 'ABB' },
    { value: 'Schneider Electric', label: 'Schneider Electric' },
    { value: 'General Electric', label: 'General Electric' },
    { value: 'Alstom', label: 'Alstom' },
    { value: 'Bombardier', label: 'Bombardier' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avaria', label: 'Avaria' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtros e Pesquisa</h3>
            <p className="text-sm text-gray-600">Filtre e encontre eletrificações rapidamente</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Limpar ({activeFiltersCount})</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar eletrificações..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'basic'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Filtros Básicos
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'advanced'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Filtros Avançados
              </button>
            </div>

            {/* Basic Filters */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={filters.tipo || ''}
                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    {tipoOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={filters.categoria || ''}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    {categoriaOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.estado || ''}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    {estadoOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fabricante</label>
                  <select
                    value={filters.fabricante || ''}
                    onChange={(e) => handleFilterChange('fabricante', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    {fabricanteOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Operacional</label>
                  <select
                    value={filters.statusOperacional || ''}
                    onChange={(e) => handleFilterChange('statusOperacional', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">KM Inicial</label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.kmInicial || ''}
                    onChange={(e) => handleFilterChange('kmInicial', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="KM mínimo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </motion.div>
            )}

            {/* Advanced Filters */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">KM Final</label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.kmFinal || ''}
                    onChange={(e) => handleFilterChange('kmFinal', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="KM máximo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tensão Mínima (V)</label>
                  <input
                    type="number"
                    value={filters.tensaoMin || ''}
                    onChange={(e) => handleFilterChange('tensaoMin', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Tensão mínima"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Corrente Mínima (A)</label>
                  <input
                    type="number"
                    value={filters.correnteMin || ''}
                    onChange={(e) => handleFilterChange('correnteMin', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Corrente mínima"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Potência Mínima (W)</label>
                  <input
                    type="number"
                    value={filters.potenciaMin || ''}
                    onChange={(e) => handleFilterChange('potenciaMin', e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="Potência mínima"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Instalação Início</label>
                  <input
                    type="date"
                    value={filters.dataInstalacaoInicio || ''}
                    onChange={(e) => handleFilterChange('dataInstalacaoInicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Instalação Fim</label>
                  <input
                    type="date"
                    value={filters.dataInstalacaoFim || ''}
                    onChange={(e) => handleFilterChange('dataInstalacaoFim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Última Inspeção Início</label>
                  <input
                    type="date"
                    value={filters.ultimaInspecaoInicio || ''}
                    onChange={(e) => handleFilterChange('ultimaInspecaoInicio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Última Inspeção Fim</label>
                  <input
                    type="date"
                    value={filters.ultimaInspecaoFim || ''}
                    onChange={(e) => handleFilterChange('ultimaInspecaoFim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Limpar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
