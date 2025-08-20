import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, MapPin, Calendar, Gauge, Signal, HardHat,
  ChevronDown, ChevronUp, RefreshCw, Activity, Settings, FileText
} from 'lucide-react';
import { FilterState } from '../utils/filterUtils';

interface SinalizacaoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function SinalizacaoFilters({
  filters, onFiltersChange, onClearFilters, activeFiltersCount
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

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Teste', label: 'Teste' },
    { value: 'Emergência', label: 'Emergência' }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      {/* Header dos Filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filtros Avançados</h3>
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
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Limpar</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          placeholder="Buscar por código, localização, modelo..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Filtros Expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'basic'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Básicos
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'advanced'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Avançados
              </button>
            </div>

            {/* Filtros Básicos */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sinalização
                  </label>
                  <select
                    value={filters.tipo || ''}
                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    value={filters.categoria || ''}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    value={filters.estado || ''}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {estadoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fabricante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante
                  </label>
                  <select
                    value={filters.fabricante || ''}
                    onChange={(e) => handleFilterChange('fabricante', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {fabricanteOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Operacional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Operacional
                  </label>
                  <select
                    value={filters.statusOperacional || ''}
                    onChange={(e) => handleFilterChange('statusOperacional', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Filtros Avançados */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                {/* Localização KM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      KM Inicial
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={filters.kmInicial || ''}
                      onChange={(e) => handleFilterChange('kmInicial', e.target.value ? Number(e.target.value) : '')}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      KM Final
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={filters.kmFinal || ''}
                      onChange={(e) => handleFilterChange('kmFinal', e.target.value ? Number(e.target.value) : '')}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Data de Instalação */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Data de Instalação (De)
                    </label>
                    <input
                      type="date"
                      value={filters.dataInstalacaoInicio || ''}
                      onChange={(e) => handleFilterChange('dataInstalacaoInicio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Data de Instalação (Até)
                    </label>
                    <input
                      type="date"
                      value={filters.dataInstalacaoFim || ''}
                      onChange={(e) => handleFilterChange('dataInstalacaoFim', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Parâmetros Técnicos */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Gauge className="h-4 w-4 mr-2" />
                    Parâmetros Técnicos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alcance Mín. (m)
                      </label>
                      <input
                        type="number"
                        value={filters.alcanceMin || ''}
                        onChange={(e) => handleFilterChange('alcanceMin', e.target.value ? Number(e.target.value) : '')}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Potência Mín. (W)
                      </label>
                      <input
                        type="number"
                        value={filters.potenciaMin || ''}
                        onChange={(e) => handleFilterChange('potenciaMin', e.target.value ? Number(e.target.value) : '')}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sensibilidade Mín. (dBm)
                      </label>
                      <input
                        type="number"
                        value={filters.sensibilidadeMin || ''}
                        onChange={(e) => handleFilterChange('sensibilidadeMin', e.target.value ? Number(e.target.value) : '')}
                        placeholder="-100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência
                      </label>
                      <input
                        type="text"
                        value={filters.frequencia || ''}
                        onChange={(e) => handleFilterChange('frequencia', e.target.value)}
                        placeholder="2.4 GHz"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Última Inspeção */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Activity className="h-4 w-4 mr-2" />
                      Última Inspeção (De)
                    </label>
                    <input
                      type="date"
                      value={filters.ultimaInspecaoInicio || ''}
                      onChange={(e) => handleFilterChange('ultimaInspecaoInicio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Activity className="h-4 w-4 mr-2" />
                      Última Inspeção (Até)
                    </label>
                    <input
                      type="date"
                      value={filters.ultimaInspecaoFim || ''}
                      onChange={(e) => handleFilterChange('ultimaInspecaoFim', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
