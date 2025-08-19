import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import {
  TIPOS_EQUIPAMENTO,
  CATEGORIAS_EQUIPAMENTO,
  ESTADOS_EQUIPAMENTO,
  STATUS_OPERACIONAL,
  TIPOS_CALIBRACAO,
  RESULTADOS_CALIBRACAO,
  TIPOS_MANUTENCAO,
  RESULTADOS_MANUTENCAO,
  TIPOS_INSPECAO,
  RESULTADOS_INSPECAO
} from '@/types/calibracoes';

interface CalibracoesEquipamentosFiltersProps {
  activeTab: 'equipamentos' | 'calibracoes' | 'manutencoes' | 'inspecoes';
  onApplyFilters: () => void;
}

export default function CalibracoesEquipamentosFilters({
  activeTab,
  onApplyFilters
}: CalibracoesEquipamentosFiltersProps) {
  const [filtros, setFiltros] = useState({
    // Filtros de Equipamentos
    codigo: '',
    nome: '',
    tipo: '',
    categoria: '',
    estado: '',
    status_operacional: '',
    departamento: '',
    responsavel: '',
    fabricante: '',
    data_aquisicao_inicio: '',
    data_aquisicao_fim: '',

    // Filtros de Calibrações
    equipamento_id: '',
    tipo_calibracao: '',
    resultado: '',
    laboratorio: '',
    data_calibracao_inicio: '',
    data_calibracao_fim: '',
    data_proxima_calibracao_inicio: '',
    data_proxima_calibracao_fim: '',

    // Filtros de Manutenções
    tipo_manutencao: '',
    tecnico_responsavel: '',
    fornecedor: '',
    data_manutencao_inicio: '',
    data_manutencao_fim: '',

    // Filtros de Inspeções
    tipo_inspecao: '',
    inspetor: '',
    data_inspecao_inicio: '',
    data_inspecao_fim: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFiltros({
      codigo: '',
      nome: '',
      tipo: '',
      categoria: '',
      estado: '',
      status_operacional: '',
      departamento: '',
      responsavel: '',
      fabricante: '',
      data_aquisicao_inicio: '',
      data_aquisicao_fim: '',
      equipamento_id: '',
      tipo_calibracao: '',
      resultado: '',
      laboratorio: '',
      data_calibracao_inicio: '',
      data_calibracao_fim: '',
      data_proxima_calibracao_inicio: '',
      data_proxima_calibracao_fim: '',
      tipo_manutencao: '',
      tecnico_responsavel: '',
      fornecedor: '',
      data_manutencao_inicio: '',
      data_manutencao_fim: '',
      tipo_inspecao: '',
      inspetor: '',
      data_inspecao_inicio: '',
      data_inspecao_fim: ''
    });
  };

  const renderEquipamentosFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código
        </label>
        <input
          type="text"
          value={filtros.codigo}
          onChange={(e) => handleInputChange('codigo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Código do equipamento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          value={filtros.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nome do equipamento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <select
          value={filtros.tipo}
          onChange={(e) => handleInputChange('tipo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_EQUIPAMENTO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria
        </label>
        <select
          value={filtros.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIAS_EQUIPAMENTO.map((categoria) => (
            <option key={categoria.value} value={categoria.value}>
              {categoria.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          value={filtros.estado}
          onChange={(e) => handleInputChange('estado', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os estados</option>
          {ESTADOS_EQUIPAMENTO.map((estado) => (
            <option key={estado.value} value={estado.value}>
              {estado.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status Operacional
        </label>
        <select
          value={filtros.status_operacional}
          onChange={(e) => handleInputChange('status_operacional', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os status</option>
          {STATUS_OPERACIONAL.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Departamento
        </label>
        <input
          type="text"
          value={filtros.departamento}
          onChange={(e) => handleInputChange('departamento', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Departamento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsável
        </label>
        <input
          type="text"
          value={filtros.responsavel}
          onChange={(e) => handleInputChange('responsavel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Responsável"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fabricante
        </label>
        <input
          type="text"
          value={filtros.fabricante}
          onChange={(e) => handleInputChange('fabricante', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Fabricante"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Aquisição (Início)
        </label>
        <input
          type="date"
          value={filtros.data_aquisicao_inicio}
          onChange={(e) => handleInputChange('data_aquisicao_inicio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Aquisição (Fim)
        </label>
        <input
          type="date"
          value={filtros.data_aquisicao_fim}
          onChange={(e) => handleInputChange('data_aquisicao_fim', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderCalibracoesFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Calibração
        </label>
        <select
          value={filtros.tipo_calibracao}
          onChange={(e) => handleInputChange('tipo_calibracao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_CALIBRACAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resultado
        </label>
        <select
          value={filtros.resultado}
          onChange={(e) => handleInputChange('resultado', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os resultados</option>
          {RESULTADOS_CALIBRACAO.map((resultado) => (
            <option key={resultado.value} value={resultado.value}>
              {resultado.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Laboratório
        </label>
        <input
          type="text"
          value={filtros.laboratorio}
          onChange={(e) => handleInputChange('laboratorio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Laboratório"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Calibração (Início)
        </label>
        <input
          type="date"
          value={filtros.data_calibracao_inicio}
          onChange={(e) => handleInputChange('data_calibracao_inicio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Calibração (Fim)
        </label>
        <input
          type="date"
          value={filtros.data_calibracao_fim}
          onChange={(e) => handleInputChange('data_calibracao_fim', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Próxima Calibração (Início)
        </label>
        <input
          type="date"
          value={filtros.data_proxima_calibracao_inicio}
          onChange={(e) => handleInputChange('data_proxima_calibracao_inicio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Próxima Calibração (Fim)
        </label>
        <input
          type="date"
          value={filtros.data_proxima_calibracao_fim}
          onChange={(e) => handleInputChange('data_proxima_calibracao_fim', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderManutencoesFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Manutenção
        </label>
        <select
          value={filtros.tipo_manutencao}
          onChange={(e) => handleInputChange('tipo_manutencao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_MANUTENCAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Técnico Responsável
        </label>
        <input
          type="text"
          value={filtros.tecnico_responsavel}
          onChange={(e) => handleInputChange('tecnico_responsavel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Técnico responsável"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fornecedor
        </label>
        <input
          type="text"
          value={filtros.fornecedor}
          onChange={(e) => handleInputChange('fornecedor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Fornecedor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Manutenção (Início)
        </label>
        <input
          type="date"
          value={filtros.data_manutencao_inicio}
          onChange={(e) => handleInputChange('data_manutencao_inicio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Manutenção (Fim)
        </label>
        <input
          type="date"
          value={filtros.data_manutencao_fim}
          onChange={(e) => handleInputChange('data_manutencao_fim', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderInspecoesFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Inspeção
        </label>
        <select
          value={filtros.tipo_inspecao}
          onChange={(e) => handleInputChange('tipo_inspecao', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os tipos</option>
          {TIPOS_INSPECAO.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inspetor
        </label>
        <input
          type="text"
          value={filtros.inspetor}
          onChange={(e) => handleInputChange('inspetor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Inspetor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Inspeção (Início)
        </label>
        <input
          type="date"
          value={filtros.data_inspecao_inicio}
          onChange={(e) => handleInputChange('data_inspecao_inicio', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data de Inspeção (Fim)
        </label>
        <input
          type="date"
          value={filtros.data_inspecao_fim}
          onChange={(e) => handleInputChange('data_inspecao_fim', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderFilters = () => {
    switch (activeTab) {
      case 'equipamentos':
        return renderEquipamentosFilters();
      case 'calibracoes':
        return renderCalibracoesFilters();
      case 'manutencoes':
        return renderManutencoesFilters();
      case 'inspecoes':
        return renderInspecoesFilters();
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Filtros - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-1" />
          Limpar Filtros
        </button>
      </div>

      {renderFilters()}

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Limpar
        </button>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}
