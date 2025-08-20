import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  Gauge,
  Ruler,
  HardHat,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

interface FilterState {
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

interface TravessaFilterState {
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

interface InspecaoFilterState {
  searchTerm: string;
  tipo: string;
  resultado: string;
  inspector: string;
  dataInspecaoInicio: string;
  dataInspecaoFim: string;
  elemento: string;
  estado: string;
}

interface ViaFerreaFiltersProps {
  filters: FilterState | TravessaFilterState | InspecaoFilterState;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  type: 'trilhos' | 'travessas' | 'inspecoes';
}

export function ViaFerreaFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  type
}: ViaFerreaFiltersProps) {
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

  // Opções específicas para Trilhos
  const trilhoTipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'UIC60', label: 'UIC60' },
    { value: 'UIC54', label: 'UIC54' },
    { value: 'UIC50', label: 'UIC50' },
    { value: 'TR68', label: 'TR68' },
    { value: 'TR57', label: 'TR57' }
  ];

  // Opções específicas para Travessas
  const travessaTipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Betão', label: 'Betão' },
    { value: 'Madeira', label: 'Madeira' },
    { value: 'Aço', label: 'Aço' },
    { value: 'Compósito', label: 'Compósito' }
  ];

  const materialOptions = [
    { value: '', label: 'Todos os materiais' },
    { value: 'Betão armado pré-esforçado', label: 'Betão armado pré-esforçado' },
    { value: 'Madeira de carvalho tratada', label: 'Madeira de carvalho tratada' },
    { value: 'Aço carbono', label: 'Aço carbono' },
    { value: 'Fibra de vidro', label: 'Fibra de vidro' }
  ];

  // Opções específicas para Inspeções
  const inspecaoTipoOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Geometria', label: 'Geometria' },
    { value: 'Visual', label: 'Visual' },
    { value: 'Ultrassom', label: 'Ultrassom' },
    { value: 'Magnetoscopia', label: 'Magnetoscopia' },
    { value: 'Penetrantes', label: 'Penetrantes' }
  ];

  const resultadoOptions = [
    { value: '', label: 'Todos os resultados' },
    { value: 'Conforme', label: 'Conforme' },
    { value: 'Não Conforme', label: 'Não Conforme' },
    { value: 'Crítico', label: 'Crítico' }
  ];

  const estadoOptions = [
    { value: '', label: 'Todos os estados' },
    { value: 'Excelente', label: 'Excelente' },
    { value: 'Bom', label: 'Bom' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Mau', label: 'Mau' },
    { value: 'Crítico', label: 'Crítico' }
  ];

  const fabricanteOptions = [
    { value: '', label: 'Todos os fabricantes' },
    { value: 'ArcelorMittal', label: 'ArcelorMittal' },
    { value: 'Gerdau', label: 'Gerdau' },
    { value: 'CSN', label: 'CSN' },
    { value: 'Vale', label: 'Vale' },
    { value: 'Cimpor', label: 'Cimpor' },
    { value: 'Secil', label: 'Secil' },
    { value: 'Silvapor', label: 'Silvapor' },
    { value: 'Outros', label: 'Outros' }
  ];

  const getTipoOptions = () => {
    switch (type) {
      case 'trilhos':
        return trilhoTipoOptions;
      case 'travessas':
        return travessaTipoOptions;
      case 'inspecoes':
        return inspecaoTipoOptions;
      default:
        return trilhoTipoOptions;
    }
  };

  const getSearchPlaceholder = () => {
    switch (type) {
      case 'trilhos':
        return 'Buscar por código, fabricante, localização...';
      case 'travessas':
        return 'Buscar por código, material, fabricante...';
      case 'inspecoes':
        return 'Buscar por inspector, elemento, observações...';
      default:
        return 'Buscar...';
    }
  };

  const renderBasicFilters = () => {
    switch (type) {
      case 'trilhos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trilho
              </label>
              <select
                value={(filters as FilterState).tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {getTipoOptions().map((option) => (
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
                value={(filters as FilterState).estado}
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

            {/* Fabricante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante
              </label>
              <select
                value={(filters as FilterState).fabricante}
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
          </div>
        );

      case 'travessas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Travessa
              </label>
              <select
                value={(filters as TravessaFilterState).tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {getTipoOptions().map((option) => (
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
                value={(filters as TravessaFilterState).estado}
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

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <select
                value={(filters as TravessaFilterState).material}
                onChange={(e) => handleFilterChange('material', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'inspecoes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Inspeção
              </label>
              <select
                value={(filters as InspecaoFilterState).tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {getTipoOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Resultado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado
              </label>
              <select
                value={(filters as InspecaoFilterState).resultado}
                onChange={(e) => handleFilterChange('resultado', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {resultadoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Inspector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspector
              </label>
              <input
                type="text"
                placeholder="Nome do inspector"
                value={(filters as InspecaoFilterState).inspector}
                onChange={(e) => handleFilterChange('inspector', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAdvancedFilters = () => {
    switch (type) {
      case 'trilhos':
        return (
          <div className="space-y-6">
            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Inicial
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={(filters as FilterState).kmInicial}
                  onChange={(e) => handleFilterChange('kmInicial', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Final
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={(filters as FilterState).kmFinal}
                  onChange={(e) => handleFilterChange('kmFinal', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Instalação (Início)
                </label>
                <input
                  type="date"
                  value={(filters as FilterState).dataInstalacaoInicio}
                  onChange={(e) => handleFilterChange('dataInstalacaoInicio', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Instalação (Fim)
                </label>
                <input
                  type="date"
                  value={(filters as FilterState).dataInstalacaoFim}
                  onChange={(e) => handleFilterChange('dataInstalacaoFim', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Tensão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="h-4 w-4 mr-2" />
                  Tensão Mínima (MPa)
                </label>
                <input
                  type="number"
                  placeholder="800"
                  value={(filters as FilterState).tensaoMin}
                  onChange={(e) => handleFilterChange('tensaoMin', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="h-4 w-4 mr-2" />
                  Tensão Máxima (MPa)
                </label>
                <input
                  type="number"
                  placeholder="900"
                  value={(filters as FilterState).tensaoMax}
                  onChange={(e) => handleFilterChange('tensaoMax', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );

      case 'travessas':
        return (
          <div className="space-y-6">
            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Inicial
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={(filters as TravessaFilterState).kmInicial}
                  onChange={(e) => handleFilterChange('kmInicial', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Final
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={(filters as TravessaFilterState).kmFinal}
                  onChange={(e) => handleFilterChange('kmFinal', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Instalação (Início)
                </label>
                <input
                  type="date"
                  value={(filters as TravessaFilterState).dataInstalacaoInicio}
                  onChange={(e) => handleFilterChange('dataInstalacaoInicio', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Instalação (Fim)
                </label>
                <input
                  type="date"
                  value={(filters as TravessaFilterState).dataInstalacaoFim}
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
                value={(filters as TravessaFilterState).fabricante}
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
          </div>
        );

      case 'inspecoes':
        return (
          <div className="space-y-6">
            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Inspeção (Início)
                </label>
                <input
                  type="date"
                  value={(filters as InspecaoFilterState).dataInspecaoInicio}
                  onChange={(e) => handleFilterChange('dataInspecaoInicio', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Data Inspeção (Fim)
                </label>
                <input
                  type="date"
                  value={(filters as InspecaoFilterState).dataInspecaoFim}
                  onChange={(e) => handleFilterChange('dataInspecaoFim', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Elemento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elemento Inspecionado
              </label>
              <input
                type="text"
                placeholder="Código do trilho ou travessa"
                value={(filters as InspecaoFilterState).elemento}
                onChange={(e) => handleFilterChange('elemento', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl mb-6">
      {/* Header dos Filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
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
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Recolher</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Expandir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Busca Rápida */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
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
                Filtros Básicos
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'advanced'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Filtros Avançados
              </button>
            </div>

            {/* Conteúdo dos Tabs */}
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderBasicFilters()}
                </motion.div>
              )}

              {activeTab === 'advanced' && (
                <motion.div
                  key="advanced"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderAdvancedFilters()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
