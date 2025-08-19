import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Filter, Calendar, Signal, CheckCircle, Clock, AlertTriangle, 
  TrendingUp, Users, Building, Tag, Gauge, Target, BarChart3, Eye, 
  ChevronDown, ChevronUp, X, CheckSquare, Square, MapPin, Settings, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import PDFService from '@/services/pdfService';
import { sinalizacaoAPI } from '@/lib/supabase-api/sinalizacaoAPI';
import type { Sinalizacao, InspecaoSinalizacao } from '@/types/sinalizacao';
import {
  TIPOS_SINALIZACAO, CATEGORIAS_SINALIZACAO, ESTADOS_SINALIZACAO, 
  STATUS_OPERACIONAL, TIPOS_INSPECAO, RESULTADOS_INSPECAO
} from '@/types/sinalizacao';

interface RelatorioSinalizacaoPremiumProps {
  onSelecaoChange?: (sinalizacoesSelecionadas: Sinalizacao[]) => void;
  tipoRelatorio?: 'sinalizacoes' | 'inspecoes';
}

export default function RelatorioSinalizacaoPremium({ 
  onSelecaoChange,
  tipoRelatorio = 'sinalizacoes'
}: RelatorioSinalizacaoPremiumProps) {
  const [sinalizacoes, setSinalizacoes] = useState<Sinalizacao[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoSinalizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [sinalizacoesSelecionadas, setSinalizacoesSelecionadas] = useState<Set<string>>(new Set());
  const [inspecoesSelecionadas, setInspecoesSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);
  const [tipoRelatorioSelecionado, setTipoRelatorioSelecionado] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('filtrado');
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    estado: '',
    fabricante: '',
    localizacao: '',
    status_operacional: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (onSelecaoChange && tipoRelatorio === 'sinalizacoes') {
      const sinalizacoesFiltradas = sinalizacoes.filter(s => sinalizacoesSelecionadas.has(s.id));
      onSelecaoChange(sinalizacoesFiltradas);
    }
  }, [sinalizacoesSelecionadas, sinalizacoes, onSelecaoChange, tipoRelatorio]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sinalizacoesData, inspecoesData] = await Promise.all([
        sinalizacaoAPI.sinalizacoes.getAll(),
        sinalizacaoAPI.inspecoes.getAll()
      ]);
      setSinalizacoes(sinalizacoesData);
      setInspecoes(inspecoesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de sinalização');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelecao = (id: string) => {
    if (tipoRelatorio === 'sinalizacoes') {
      const novaSelecao = new Set(sinalizacoesSelecionadas);
      if (novaSelecao.has(id)) {
        novaSelecao.delete(id);
      } else {
        novaSelecao.add(id);
      }
      setSinalizacoesSelecionadas(novaSelecao);
    } else {
      const novaSelecao = new Set(inspecoesSelecionadas);
      if (novaSelecao.has(id)) {
        novaSelecao.delete(id);
      } else {
        novaSelecao.add(id);
      }
      setInspecoesSelecionadas(novaSelecao);
    }
  };

  const selecionarTodos = () => {
    if (tipoRelatorio === 'sinalizacoes') {
      const todosIds = sinalizacoes.map(s => s.id);
      setSinalizacoesSelecionadas(new Set(todosIds));
    } else {
      const todosIds = inspecoes.map(i => i.id);
      setInspecoesSelecionadas(new Set(todosIds));
    }
  };

  const limparSelecao = () => {
    if (tipoRelatorio === 'sinalizacoes') {
      setSinalizacoesSelecionadas(new Set());
    } else {
      setInspecoesSelecionadas(new Set());
    }
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      limparSelecao();
    }
  };

  const getSinalizacoesParaRelatorio = (): Sinalizacao[] => {
    if (sinalizacoesSelecionadas.size > 0) {
      return sinalizacoes.filter(s => sinalizacoesSelecionadas.has(s.id));
    }
    return sinalizacoes;
  };

  const getInspecoesParaRelatorio = (): InspecaoSinalizacao[] => {
    if (inspecoesSelecionadas.size > 0) {
      return inspecoes.filter(i => inspecoesSelecionadas.has(i.id));
    }
    return inspecoes;
  };

  const handleGerarRelatorio = async () => {
    try {
      const pdfService = new PDFService();
      
      if (tipoRelatorio === 'sinalizacoes') {
        const sinalizacoesParaRelatorio = getSinalizacoesParaRelatorio();
        
        if (typeof pdfService.gerarRelatorioSinalizacao === 'function') {
          await pdfService.gerarRelatorioSinalizacao({
            tipo: tipoRelatorioSelecionado,
            sinalizacoes: sinalizacoesParaRelatorio,
            filtros: Object.keys(filtros).filter(key => filtros[key as keyof typeof filtros] !== ''),
            titulo: `Relatório de Sinalizações - ${tipoRelatorioSelecionado.toUpperCase()}`,
            incluirEstatisticas: true,
            incluirGraficos: true
          });
          toast.success('Relatório de Sinalizações gerado com sucesso!');
        } else {
          toast.error('Método de relatório não disponível');
        }
      } else {
        const inspecoesParaRelatorio = getInspecoesParaRelatorio();
        
        if (typeof pdfService.gerarRelatorioInspecaoSinalizacao === 'function') {
          await pdfService.gerarRelatorioInspecaoSinalizacao({
            tipo: tipoRelatorioSelecionado,
            inspecoes: inspecoesParaRelatorio,
            filtros: Object.keys(filtros).filter(key => filtros[key as keyof typeof filtros] !== ''),
            titulo: `Relatório de Inspeções de Sinalização - ${tipoRelatorioSelecionado.toUpperCase()}`,
            incluirEstatisticas: true,
            incluirGraficos: true
          });
          toast.success('Relatório de Inspeções gerado com sucesso!');
        } else {
          toast.error('Método de relatório não disponível');
        }
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      operacional: 'bg-green-100 text-green-800',
      manutencao: 'bg-yellow-100 text-yellow-800',
      avariada: 'bg-red-100 text-red-800',
      desativada: 'bg-gray-100 text-gray-800',
      teste: 'bg-blue-100 text-blue-800',
      instalacao: 'bg-purple-100 text-purple-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      standby: 'bg-yellow-100 text-yellow-800',
      emergencia: 'bg-red-100 text-red-800',
      teste: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Cálculos de estatísticas para Sinalizações
  const estatisticasSinalizacoes = {
    total: sinalizacoes.length,
    operacionais: sinalizacoes.filter(s => s.estado === 'operacional').length,
    manutencao: sinalizacoes.filter(s => s.estado === 'manutencao').length,
    avariadas: sinalizacoes.filter(s => s.estado === 'avariada').length,
    ativas: sinalizacoes.filter(s => s.status_operacional === 'ativo').length,
    kmCobertos: sinalizacoes.reduce((total, s) => total + (s.km_final - s.km_inicial), 0)
  };

  // Cálculos de estatísticas para Inspeções
  const estatisticasInspecoes = {
    total: inspecoes.length,
    aprovadas: inspecoes.filter(i => i.resultado === 'aprovado').length,
    aprovadas_condicional: inspecoes.filter(i => i.resultado === 'aprovado_condicional').length,
    reprovadas: inspecoes.filter(i => i.resultado === 'reprovado').length,
    pendentes: inspecoes.filter(i => i.resultado === 'pendente').length,
    preventivas: inspecoes.filter(i => i.tipo === 'preventiva').length
  };

  const tiposSinalizacao = sinalizacoes.reduce((acc, s) => {
    acc[s.tipo] = (acc[s.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categorias = sinalizacoes.reduce((acc, s) => {
    acc[s.categoria] = (acc[s.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Relatório de {tipoRelatorio === 'sinalizacoes' ? 'Sinalizações' : 'Inspeções de Sinalização'}
          </h2>
          <p className="text-gray-600">Gere relatórios profissionais com filtros avançados</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGerarRelatorio}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Gerar Relatório</span>
          </button>
        </div>
      </div>

      {/* Controles de Seleção */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Controles de Seleção</h3>
          <button
            onClick={toggleModoSelecao}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selecaoAtiva 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {selecaoAtiva ? 'Desativar Seleção' : 'Ativar Seleção'}
          </button>
        </div>
        
        {selecaoAtiva && (
          <div className="flex items-center space-x-4">
            <button
              onClick={selecionarTodos}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
            >
              Selecionar Todos
            </button>
            <button
              onClick={limparSelecao}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
            >
              Limpar Seleção
            </button>
            <span className="text-sm text-blue-700">
              {tipoRelatorio === 'sinalizacoes' 
                ? `${sinalizacoesSelecionadas.size} de ${sinalizacoes.length} selecionados`
                : `${inspecoesSelecionadas.size} de ${inspecoes.length} selecionados`
              }
            </span>
          </div>
        )}
      </div>

      {/* Configurações do Relatório */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorioSelecionado}
              onChange={(e) => setTipoRelatorioSelecionado(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="executivo">Executivo</option>
              <option value="filtrado">Filtrado</option>
              <option value="comparativo">Comparativo</option>
              <option value="individual">Individual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {tipoRelatorio === 'sinalizacoes' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sinalizações</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticasSinalizacoes.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Signal className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operacionais</p>
                <p className="text-2xl font-bold text-green-600">{estatisticasSinalizacoes.operacionais}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Manutenção</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticasSinalizacoes.manutencao}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avariadas</p>
                <p className="text-2xl font-bold text-red-600">{estatisticasSinalizacoes.avariadas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{estatisticasSinalizacoes.ativas}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KM Cobertos</p>
                <p className="text-2xl font-bold text-purple-600">{estatisticasSinalizacoes.kmCobertos.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inspeções</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticasInspecoes.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-green-600">{estatisticasInspecoes.aprovadas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadas Condicional</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticasInspecoes.aprovadas_condicional}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reprovadas</p>
                <p className="text-2xl font-bold text-red-600">{estatisticasInspecoes.reprovadas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{estatisticasInspecoes.pendentes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preventivas</p>
                <p className="text-2xl font-bold text-purple-600">{estatisticasInspecoes.preventivas}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análise por Tipo */}
      {tipoRelatorio === 'sinalizacoes' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Tipo de Sinalização</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Object.entries(tiposSinalizacao).map(([tipo, count]) => (
              <div key={tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{TIPOS_SINALIZACAO[tipo as keyof typeof TIPOS_SINALIZACAO] || tipo}</span>
                <span className="text-lg font-bold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análise por Categoria */}
      {tipoRelatorio === 'sinalizacoes' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Object.entries(categorias).map(([categoria, count]) => (
              <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{CATEGORIAS_SINALIZACAO[categoria as keyof typeof CATEGORIAS_SINALIZACAO] || categoria}</span>
                <span className="text-lg font-bold text-green-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {tipoRelatorio === 'sinalizacoes' ? 'Sinalizações' : 'Inspeções de Sinalização'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {tipoRelatorio === 'sinalizacoes' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={sinalizacoesSelecionadas.size === sinalizacoes.length}
                        onChange={() => sinalizacoesSelecionadas.size === sinalizacoes.length ? limparSelecao() : selecionarTodos()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KM
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sinalizacoes.map((sinalizacao) => (
                  <tr key={sinalizacao.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={sinalizacoesSelecionadas.has(sinalizacao.id)}
                          onChange={() => toggleSelecao(sinalizacao.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sinalizacao.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {TIPOS_SINALIZACAO[sinalizacao.tipo as keyof typeof TIPOS_SINALIZACAO] || sinalizacao.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sinalizacao.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(sinalizacao.estado)}`}>
                        {ESTADOS_SINALIZACAO[sinalizacao.estado as keyof typeof ESTADOS_SINALIZACAO] || sinalizacao.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sinalizacao.status_operacional)}`}>
                        {STATUS_OPERACIONAL[sinalizacao.status_operacional as keyof typeof STATUS_OPERACIONAL] || sinalizacao.status_operacional}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sinalizacao.fabricante}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sinalizacao.km_inicial} - {sinalizacao.km_final}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={inspecoesSelecionadas.size === inspecoes.length}
                        onChange={() => inspecoesSelecionadas.size === inspecoes.length ? limparSelecao() : selecionarTodos()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inspector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Inspeção
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspecoes.map((inspecao) => (
                  <tr key={inspecao.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={inspecoesSelecionadas.has(inspecao.id)}
                          onChange={() => toggleSelecao(inspecao.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {TIPOS_INSPECAO[inspecao.tipo as keyof typeof TIPOS_INSPECAO] || inspecao.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspecao.inspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        inspecao.resultado === 'aprovado' ? 'bg-green-100 text-green-800' :
                        inspecao.resultado === 'aprovado_condicional' ? 'bg-yellow-100 text-yellow-800' :
                        inspecao.resultado === 'reprovado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {RESULTADOS_INSPECAO[inspecao.resultado as keyof typeof RESULTADOS_INSPECAO] || inspecao.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspecao.proxima_inspecao).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
