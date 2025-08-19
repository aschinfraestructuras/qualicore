import React from 'react';
import { FilterState } from '@/utils/filterUtils';

interface ControloBetonagensFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const ELEMENTOS_ESTRUTURAIS = [
  'Pilar',
  'Viga',
  'Laje',
  'Fundação',
  'Muro',
  'Escada',
  'Cobertura',
  'Pavimento',
  'Outro'
];

const STATUS_CONFORMIDADE = [
  'Conforme',
  'Não Conforme',
  'Pendente'
];

export default function ControloBetonagensFilters({ filters, onFiltersChange }: ControloBetonagensFiltersProps) {
  const handleFilterChange = (field: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      elementoEstrutural: '',
      localizacao: '',
      fornecedor: '',
      statusConformidade: '',
      dataBetonagemInicio: '',
      dataBetonagemFim: '',
      dataEnsaio7dInicio: '',
      dataEnsaio7dFim: '',
      dataEnsaio28dInicio: '',
      dataEnsaio28dFim: '',
      slumpMin: '',
      temperaturaMin: '',
      temperaturaMax: '',
      resistencia7dMin: '',
      resistencia28dMin: '',
      resistenciaRoturaMin: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtros Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Elemento Estrutural
          </label>
          <select
            value={filters.elementoEstrutural}
            onChange={(e) => handleFilterChange('elementoEstrutural', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os elementos</option>
            {ELEMENTOS_ESTRUTURAIS.map((elemento) => (
              <option key={elemento} value={elemento}>{elemento}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <input
            type="text"
            value={filters.localizacao}
            onChange={(e) => handleFilterChange('localizacao', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Filtrar por localização"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fornecedor
          </label>
          <input
            type="text"
            value={filters.fornecedor}
            onChange={(e) => handleFilterChange('fornecedor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Filtrar por fornecedor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Conformidade
          </label>
          <select
            value={filters.statusConformidade}
            onChange={(e) => handleFilterChange('statusConformidade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {STATUS_CONFORMIDADE.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Betonagem (Início)
          </label>
          <input
            type="date"
            value={filters.dataBetonagemInicio}
            onChange={(e) => handleFilterChange('dataBetonagemInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Betonagem (Fim)
          </label>
          <input
            type="date"
            value={filters.dataBetonagemFim}
            onChange={(e) => handleFilterChange('dataBetonagemFim', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Ensaio 7d (Início)
          </label>
          <input
            type="date"
            value={filters.dataEnsaio7dInicio}
            onChange={(e) => handleFilterChange('dataEnsaio7dInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Ensaio 7d (Fim)
          </label>
          <input
            type="date"
            value={filters.dataEnsaio7dFim}
            onChange={(e) => handleFilterChange('dataEnsaio7dFim', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Ensaio 28d (Início)
          </label>
          <input
            type="date"
            value={filters.dataEnsaio28dInicio}
            onChange={(e) => handleFilterChange('dataEnsaio28dInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Ensaio 28d (Fim)
          </label>
          <input
            type="date"
            value={filters.dataEnsaio28dFim}
            onChange={(e) => handleFilterChange('dataEnsaio28dFim', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros Técnicos */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Parâmetros Técnicos</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slump Mínimo (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.slumpMin}
              onChange={(e) => handleFilterChange('slumpMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperatura Mínima (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.temperaturaMin}
              onChange={(e) => handleFilterChange('temperaturaMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="-10.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperatura Máxima (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.temperaturaMax}
              onChange={(e) => handleFilterChange('temperaturaMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resistência 7d Mínima (MPa)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.resistencia7dMin}
              onChange={(e) => handleFilterChange('resistencia7dMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resistência 28d Mínima (MPa)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.resistencia28dMin}
              onChange={(e) => handleFilterChange('resistencia28dMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resistência Rotura Mínima (MPa)
            </label>
            <input
              type="number"
              step="0.1"
              value={filters.resistenciaRoturaMin}
              onChange={(e) => handleFilterChange('resistenciaRoturaMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Limpar Filtros
        </button>

        <div className="text-sm text-gray-600">
          Filtros ativos: {
            Object.values(filters).filter(value => 
              value !== '' && value !== undefined && value !== null
            ).length
          }
        </div>
      </div>
    </div>
  );
}
