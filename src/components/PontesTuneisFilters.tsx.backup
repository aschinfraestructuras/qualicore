import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronDown, ChevronUp, MapPin, Calendar, Gauge, Building
} from 'lucide-react';

interface PontesTuneisFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  activeFiltersCount: number;
}

export function PontesTuneisFilters({ filters, onFiltersChange, activeFiltersCount }: PontesTuneisFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: string, value: any) => {
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
      statusOperacional: '',
      kmInicial: '',
      kmFinal: '',
      dataConstrucaoInicio: '',
      dataConstrucaoFim: '',
      fabricante: '',
      comprimentoMin: '',
      larguraMin: '',
      alturaMin: '',
      capacidadeCargaMin: '',
      ultimaInspecaoInicio: '',
      ultimaInspecaoFim: ''
    });
  };

  return (
    <div className="glass-card p-6 rounded-xl mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            placeholder="Pesquisar pontes/túneis..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Ponte">Ponte</option>
                  <option value="Túnel">Túnel</option>
                  <option value="Viaduto">Viaduto</option>
                  <option value="Passagem Inferior">Passagem Inferior</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  <option value="Principal">Principal</option>
                  <option value="Secundário">Secundário</option>
                  <option value="Acesso">Acesso</option>
                  <option value="Emergencial">Emergencial</option>
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

              {/* Status Operacional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Operacional
                </label>
                <select
                  value={filters.statusOperacional}
                  onChange={(e) => handleFilterChange('statusOperacional', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Avaria">Avaria</option>
                  <option value="Teste">Teste</option>
                </select>
              </div>

              {/* KM Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Inicial (mín)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={filters.kmInicial}
                  onChange={(e) => handleFilterChange('kmInicial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.000"
                />
              </div>

              {/* KM Final */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Final (máx)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={filters.kmFinal}
                  onChange={(e) => handleFilterChange('kmFinal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="999.999"
                />
              </div>

              {/* Data de Construção - Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Construção (início)
                </label>
                <input
                  type="date"
                  value={filters.dataConstrucaoInicio}
                  onChange={(e) => handleFilterChange('dataConstrucaoInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Data de Construção - Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Construção (fim)
                </label>
                <input
                  type="date"
                  value={filters.dataConstrucaoFim}
                  onChange={(e) => handleFilterChange('dataConstrucaoFim', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Mota-Engil"
                />
              </div>

              {/* Comprimento Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprimento Mín (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.comprimentoMin}
                  onChange={(e) => handleFilterChange('comprimentoMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Largura Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largura Mín (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.larguraMin}
                  onChange={(e) => handleFilterChange('larguraMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Altura Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura Mín (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.alturaMin}
                  onChange={(e) => handleFilterChange('alturaMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Capacidade de Carga Mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade Carga Mín (ton)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={filters.capacidadeCargaMin}
                  onChange={(e) => handleFilterChange('capacidadeCargaMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>

              {/* Última Inspeção - Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Última Inspeção (início)
                </label>
                <input
                  type="date"
                  value={filters.ultimaInspecaoInicio}
                  onChange={(e) => handleFilterChange('ultimaInspecaoInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Última Inspeção - Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Última Inspeção (fim)
                </label>
                <input
                  type="date"
                  value={filters.ultimaInspecaoFim}
                  onChange={(e) => handleFilterChange('ultimaInspecaoFim', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
