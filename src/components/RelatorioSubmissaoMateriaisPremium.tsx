import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Filter, Calendar, Package, CheckCircle, Clock, AlertTriangle, 
  TrendingUp, Users, Building, Tag, DollarSign, Target, BarChart3, Eye, 
  ChevronDown, ChevronUp, X, CheckSquare, Square
} from 'lucide-react';
import toast from 'react-hot-toast';
import PDFService from '@/services/pdfService';
import { submissaoMateriaisAPI } from '@/lib/supabase-api/submissaoMateriaisAPI';
import type { SubmissaoMaterial } from '@/types/submissaoMateriais';
import {
  TIPOS_MATERIAL, CATEGORIAS_MATERIAL, PRIORIDADES_SUBMISSAO, 
  URGENCIAS_SUBMISSAO, ESTADOS_SUBMISSAO
} from '@/types/submissaoMateriais';

interface RelatorioSubmissaoMateriaisPremiumProps {
  onSelecaoChange?: (submissoesSelecionadas: SubmissaoMaterial[]) => void;
}

export default function RelatorioSubmissaoMateriaisPremium({ 
  onSelecaoChange 
}: RelatorioSubmissaoMateriaisPremiumProps) {
  const [submissoes, setSubmissoes] = useState<SubmissaoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissoesSelecionadas, setSubmissoesSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('filtrado');
  const [filtros, setFiltros] = useState({
    estado: '',
    tipo_material: '',
    categoria: '',
    prioridade: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    loadSubmissoes();
  }, []);

  useEffect(() => {
    if (onSelecaoChange) {
      const submissoesFiltradas = submissoes.filter(s => submissoesSelecionadas.has(s.id));
      onSelecaoChange(submissoesFiltradas);
    }
  }, [submissoesSelecionadas, submissoes, onSelecaoChange]);

  const loadSubmissoes = async () => {
    try {
      setLoading(true);
      const data = await submissaoMateriaisAPI.submissoes.getAll();
      setSubmissoes(data);
    } catch (error) {
      console.error('Erro ao carregar submissões:', error);
      toast.error('Erro ao carregar submissões');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelecao = (id: string) => {
    const novaSelecao = new Set(submissoesSelecionadas);
    if (novaSelecao.has(id)) {
      novaSelecao.delete(id);
    } else {
      novaSelecao.add(id);
    }
    setSubmissoesSelecionadas(novaSelecao);
  };

  const selecionarTodos = () => {
    const todosIds = submissoes.map(s => s.id);
    setSubmissoesSelecionadas(new Set(todosIds));
  };

  const limparSelecao = () => {
    setSubmissoesSelecionadas(new Set());
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      setSubmissoesSelecionadas(new Set());
    }
  };

  const getSubmissoesParaRelatorio = (): SubmissaoMaterial[] => {
    if (submissoesSelecionadas.size > 0) {
      return submissoes.filter(s => submissoesSelecionadas.has(s.id));
    }
    return submissoes;
  };

  const handleGerarRelatorio = async () => {
    try {
      const pdfService = new PDFService();
      const submissoesParaRelatorio = getSubmissoesParaRelatorio();
      
      if (typeof pdfService.gerarRelatorioSubmissaoMateriais === 'function') {
        await pdfService.gerarRelatorioSubmissaoMateriais({
          tipo: tipoRelatorio,
          submissoes: submissoesParaRelatorio,
          filtros: Object.keys(filtros).filter(key => filtros[key as keyof typeof filtros] !== ''),
          titulo: `Relatório de Submissões de Materiais - ${tipoRelatorio.toUpperCase()}`,
          incluirEstatisticas: true,
          incluirGraficos: true
        });
        toast.success('Relatório gerado com sucesso!');
      } else {
        toast.error('Método de relatório não disponível');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      rascunho: 'bg-gray-100 text-gray-800',
      submetido: 'bg-blue-100 text-blue-800',
      em_revisao: 'bg-yellow-100 text-yellow-800',
      aguardando_aprovacao: 'bg-orange-100 text-orange-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800',
      solicitado_alteracao: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-gray-100 text-gray-600',
      concluido: 'bg-green-100 text-green-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Cálculos de estatísticas
  const estatisticas = {
    total: submissoes.length,
    aprovadas: submissoes.filter(s => s.estado === 'aprovado').length,
    pendentes: submissoes.filter(s => ['submetido', 'em_revisao', 'aguardando_aprovacao'].includes(s.estado)).length,
    rejeitadas: submissoes.filter(s => s.estado === 'rejeitado').length,
    urgentes: submissoes.filter(s => s.urgencia === 'urgente' || s.urgencia === 'muito_urgente').length,
    criticas: submissoes.filter(s => s.prioridade === 'critica').length
  };

  const tiposMaterial = submissoes.reduce((acc, s) => {
    acc[s.tipo_material] = (acc[s.tipo_material] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categorias = submissoes.reduce((acc, s) => {
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
          <h2 className="text-2xl font-bold text-gray-900">Relatório de Submissões de Materiais</h2>
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
              {submissoesSelecionadas.size} de {submissoes.length} selecionados
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
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as any)}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissões</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{estatisticas.aprovadas}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold text-orange-600">{estatisticas.urgentes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-red-600">{estatisticas.criticas}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{estatisticas.rejeitadas}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Análise por Tipo de Material */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Tipo de Material</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Object.entries(tiposMaterial).map(([tipo, count]) => (
            <div key={tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{tipo}</span>
              <span className="text-lg font-bold text-blue-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Análise por Categoria */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Object.entries(categorias).map(([categoria, count]) => (
            <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{categoria}</span>
              <span className="text-lg font-bold text-green-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Submissões */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Submissões de Materiais</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selecaoAtiva && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={submissoesSelecionadas.size === submissoes.length}
                      onChange={() => submissoesSelecionadas.size === submissoes.length ? limparSelecao() : selecionarTodos()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissoes.map((submissao) => (
                <tr key={submissao.id} className="hover:bg-gray-50">
                  {selecaoAtiva && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={submissoesSelecionadas.has(submissao.id)}
                        onChange={() => toggleSelecao(submissao.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submissao.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submissao.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submissao.tipo_material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(submissao.estado)}`}>
                      {submissao.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(submissao.prioridade)}`}>
                      {submissao.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submissao.submissor_nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(submissao.data_submissao).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
