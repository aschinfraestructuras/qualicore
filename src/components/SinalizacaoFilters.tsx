import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  Gauge,
  Signal,
  HardHat,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { FilterState } from '../utils/filterUtils';

interface SinalizacaoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function SinalizacaoFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount
}: SinalizacaoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  const tipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Sinal Luminoso', label: 'Sinal Luminoso' },
    { value: 'Sinal Sonoro', label: 'Sinal Sonoro' },
    { value: 'Sinal Eletrônico', label: 'Sinal Eletrônico' },
    { value: 'Sinal de Velocidade', label: 'Sinal de Velocidade' },
    { value: 'Sinal de Passagem', label: 'Sinal de Passagem' }
  ];

  const categoriaOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'Sinalização de Via', label: 'Sinalização de Via' },
    { value: 'Sinalização de Passagem', label: 'Sinalização de Passagem' },
    { value: 'Sinalização de Velocidade', label: 'Sinalização de Velocidade' },
    { value: 'Sinalização de Segurança', label: 'Sinalização de Segurança' },
    { value: 'Sinalização de Emergência', label: 'Sinalização de Emergência' }
  ];

  const estadoOptions = [
    { value: '', label: 'Todos os estados' },
    { value: 'Operacional', label: 'Operacional' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avariada', label: 'Avariada' },
    { value: 'Desativada', label: 'Desativada' }
  ];

  const fabricanteOptions = [
    { value: '', label: 'Todos os fabricantes' },
    { value: 'Siemens', label: 'Siemens' },
    { value: 'Alstom', label: 'Alstom' },
    { value: 'Bombardier', label: 'Bombardier' },
    { value: 'Thales', label: 'Thales' },
    { value: 'Ansaldo', label: 'Ansaldo' },
    { value: 'Outros', label: 'Outros' }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      {/* Header dos Filtros */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtros e Busca</h3>
            <p className="text-sm text-gray-600">
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} ativo${activeFiltersCount > 1 ? 's' : ''}`
                : 'Nenhum filtro ativo'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Limpar</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span>{isExpanded ? 'Ocultar' : 'Mostrar'} Filtros</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por código, fabricante, localização..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Filtros Expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Tabs dos Filtros */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
              {[
                { id: 'basic', label: 'Básicos', icon: Filter },
                { id: 'advanced', label: 'Avançados', icon: Gauge }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'basic' | 'advanced')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conteúdo dos Filtros */}
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sinalização
                    </label>
                    <select
                      value={filters.tipo}
                      onChange={(e) => handleFilterChange('tipo', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {tipoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={filters.estado}
                      onChange={(e) => handleFilterChange('estado', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {categoriaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={filters.estado}
                      onChange={(e) => handleFilterChange('estado', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {estadoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Localização */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        KM Inicial
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.kmInicial}
                        onChange={(e) => handleFilterChange('kmInicial', e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        KM Final
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        value={filters.kmFinal}
                        onChange={(e) => handleFilterChange('kmFinal', e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Data Instalação (Início)
                      </label>
                      <input
                        type="date"
                        value={filters.dataInstalacaoInicio}
                        onChange={(e) => handleFilterChange('dataInstalacaoInicio', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Data Instalação (Fim)
                      </label>
                      <input
                        type="date"
                        value={filters.dataInstalacaoFim}
                        onChange={(e) => handleFilterChange('dataInstalacaoFim', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Fabricante */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fabricante
                    </label>
                    <select
                      value={filters.fabricante}
                      onChange={(e) => handleFilterChange('fabricante', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {fabricanteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
