import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, ChevronUp, MapPin, Calendar, Gauge, Shield, Bell, Camera, Lock
} from 'lucide-react';

interface FilterState {
  searchTerm: string;
  tipo: string;
  categoria: string;
  estado: string;
  fabricante: string;
  status_operacional: string;
  // Parâmetros técnicos (Segurança)
  nivelSegurancaMin: number | '';
  raioCoberturaMin: number | '';
  tempoRespostaMax: number | '';
  capacidadeDeteccaoMin: number | '';
  ultimaInspecaoInicio: string;
  ultimaInspecaoFim: string;
}

interface SegurancaFerroviariaFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

export function SegurancaFerroviariaFilters({ filters, onFiltersChange, activeFiltersCount }: SegurancaFerroviariaFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      tipo: '',
      categoria: '',
      estado: '',
      fabricante: '',
      status_operacional: '',
      nivelSegurancaMin: '',
      raioCoberturaMin: '',
      tempoRespostaMax: '',
      capacidadeDeteccaoMin: '',
      ultimaInspecaoInicio: '',
      ultimaInspecaoFim: ''
    });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Sistema de Detecção':
        return <Bell className="h-4 w-4" />;
      case 'Sistema de Vigilância':
        return <Camera className="h-4 w-4" />;
      case 'Sistema de Controle':
        return <Shield className="h-4 w-4" />;
      case 'Sistema de Alarme':
        return <Lock className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar sistemas de segurança..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Sistema de Detecção">Sistema de Detecção</option>
                  <option value="Sistema de Vigilância">Sistema de Vigilância</option>
                  <option value="Sistema de Controle">Sistema de Controle</option>
                  <option value="Sistema de Alarme">Sistema de Alarme</option>
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) => handleFilterChange('categoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Todas as categorias</option>
                  <option value="Detecção de Intrusão">Detecção de Intrusão</option>
                  <option value="CCTV">CCTV</option>
                  <option value="Controle de Acesso">Controle de Acesso</option>
                  <option value="Alarme de Incêndio">Alarme de Incêndio</option>
                  <option value="Detecção de Fumo">Detecção de Fumo</option>
                  <option value="Sistema de Emergência">Sistema de Emergência</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Todos os estados</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Avaria">Avaria</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Status Operacional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Operacional
                </label>
                <select
                  value={filters.status_operacional}
                  onChange={(e) => handleFilterChange('status_operacional', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Todos os status</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Teste">Teste</option>
                  <option value="Desligado">Desligado</option>
                </select>
              </div>

              {/* Fabricante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabricante
                </label>
                <input
                  type="text"
                  value={filters.fabricante}
                  onChange={(e) => handleFilterChange('fabricante', e.target.value)}
                  placeholder="Ex: Siemens"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Nível de Segurança Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Segurança Mínimo
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={filters.nivelSegurancaMin}
                  onChange={(e) => handleFilterChange('nivelSegurancaMin', e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="1-5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Raio de Cobertura Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raio de Cobertura Mínimo (m)
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.raioCoberturaMin}
                  onChange={(e) => handleFilterChange('raioCoberturaMin', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Ex: 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Tempo de Resposta Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo de Resposta Máximo (s)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={filters.tempoRespostaMax}
                  onChange={(e) => handleFilterChange('tempoRespostaMax', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Ex: 5.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Capacidade de Detecção Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade de Detecção Mínima (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.capacidadeDeteccaoMin}
                  onChange={(e) => handleFilterChange('capacidadeDeteccaoMin', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Ex: 80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Última Inspeção - Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Última Inspeção - De
                </label>
                <input
                  type="date"
                  value={filters.ultimaInspecaoInicio}
                  onChange={(e) => handleFilterChange('ultimaInspecaoInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Última Inspeção - Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Última Inspeção - Até
                </label>
                <input
                  type="date"
                  value={filters.ultimaInspecaoFim}
                  onChange={(e) => handleFilterChange('ultimaInspecaoFim', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
            <div className="flex flex-wrap gap-2">
              {filters.tipo && (
                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {getTipoIcon(filters.tipo)}
                  <span className="ml-1">Tipo: {filters.tipo}</span>
                </span>
              )}
              {filters.categoria && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  <Shield className="h-3 w-3" />
                  <span className="ml-1">Categoria: {filters.categoria}</span>
                </span>
              )}
              {filters.estado && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  <Gauge className="h-3 w-3" />
                  <span className="ml-1">Estado: {filters.estado}</span>
                </span>
              )}
              {filters.fabricante && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  <MapPin className="h-3 w-3" />
                  <span className="ml-1">Fabricante: {filters.fabricante}</span>
                </span>
              )}
              {filters.nivelSegurancaMin !== '' && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  <Shield className="h-3 w-3" />
                  <span className="ml-1">Nível ≥ {filters.nivelSegurancaMin}</span>
                </span>
              )}
              {filters.raioCoberturaMin !== '' && (
                <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  <MapPin className="h-3 w-3" />
                  <span className="ml-1">Raio ≥ {filters.raioCoberturaMin}m</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
