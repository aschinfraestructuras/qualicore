import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, Plus, Package, AlertCircle, CheckCircle, Clock, Star, Eye, Edit, Trash2, FileText, Calendar, Tag, Building, Zap, Shield, Layers, Settings, Bell, ChevronDown, ChevronUp, X, TrendingUp, TrendingDown, Users, Target, AlertTriangle, CheckSquare, Clock as ClockIcon, DollarSign, CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submissaoMateriaisAPI } from '../lib/supabase-api/submissaoMateriaisAPI';
import SubmissaoMateriaisForms from '../components/SubmissaoMateriaisForms';
import RelatorioSubmissaoMateriaisPremium from '../components/RelatorioSubmissaoMateriaisPremium';
import Modal from '../components/Modal';
import type {
  SubmissaoMaterial, FiltrosSubmissao, EstatisticasSubmissao, EstadoSubmissao, TipoMaterial, CategoriaMaterial, PrioridadeSubmissao, UrgenciaSubmissao
} from '../types/submissaoMateriais';
import {
  TIPOS_MATERIAL, CATEGORIAS_MATERIAL, PRIORIDADES_SUBMISSAO, URGENCIAS_SUBMISSAO, ESTADOS_SUBMISSAO
} from '../types/submissaoMateriais';

interface SubmissaoMateriaisProps {}

export default function SubmissaoMateriais() {
  const [submissoes, setSubmissoes] = useState<SubmissaoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<EstatisticasSubmissao | null>(null);
  const [filtros, setFiltros] = useState<FiltrosSubmissao>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'codigo' | 'titulo' | 'data_submissao' | 'prioridade' | 'estado'>('data_submissao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmissao, setSelectedSubmissao] = useState<SubmissaoMaterial | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSubmissao, setEditingSubmissao] = useState<SubmissaoMaterial | null>(null);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('filtrado');
  const [submissoesSelecionadas, setSubmissoesSelecionadas] = useState<SubmissaoMaterial[]>([]);

  useEffect(() => {
    loadSubmissoes();
    loadEstatisticas();
  }, []);

  useEffect(() => {
    if (searchTerm || Object.keys(filtros).length > 0) {
      searchSubmissoes();
    } else {
      loadSubmissoes();
    }
  }, [searchTerm, filtros]);

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

  const loadEstatisticas = async () => {
    try {
      const data = await submissaoMateriaisAPI.stats.getEstatisticas();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const searchSubmissoes = async () => {
    try {
      setLoading(true);
      const data = await submissaoMateriaisAPI.submissoes.search(filtros);
      setSubmissoes(data);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      toast.error('Erro na pesquisa');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      let content: string;
      if (format === 'csv') {
        content = await submissaoMateriaisAPI.export.toCSV(submissoes);
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissoes_materiais_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else {
        content = await submissaoMateriaisAPI.export.toPDF(submissoes);
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(content);
          newWindow.document.close();
        }
      }
      toast.success(`Exportação ${format.toUpperCase()} concluída`);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro na exportação');
    }
  };

  const getEstadoColor = (estado: EstadoSubmissao) => {
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
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (prioridade: PrioridadeSubmissao) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[prioridade];
  };

  const getUrgenciaIcon = (urgencia: UrgenciaSubmissao) => {
    const icons = {
      normal: ClockIcon,
      urgente: AlertTriangle,
      muito_urgente: AlertCircle
    };
    return icons[urgencia];
  };

  const clearFilters = () => {
    setFiltros({});
    setSearchTerm('');
  };

  const handleCreate = () => {
    setEditingSubmissao(null);
    setShowForm(true);
  };

  const handleEdit = (submissao: SubmissaoMaterial) => {
    setEditingSubmissao(submissao);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    loadSubmissoes();
    loadEstatisticas();
  };

  const sortedSubmissoes = [...submissoes].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'data_submissao') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Submissão de Materiais</h1>
                <p className="text-sm text-gray-600">Gestão de submissões e aprovações de materiais</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => {
                  setTipoRelatorio('filtrado');
                  setShowRelatorio(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Relatório</span>
              </button>
              <button 
                onClick={handleCreate}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Submissão</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissões</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.total_submissoes}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Aprovação</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.taxa_aprovacao.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgentes</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.submissoes_urgentes}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Atrasadas</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.submissoes_atrasadas}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Filtros e Pesquisa */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar submissões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {(Object.keys(filtros).length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as EstadoSubmissao || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os estados</option>
                    {Object.entries(ESTADOS_SUBMISSAO).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Material</label>
                  <select
                    value={filtros.tipo_material || ''}
                    onChange={(e) => setFiltros({ ...filtros, tipo_material: e.target.value as TipoMaterial || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os tipos</option>
                    {Object.entries(TIPOS_MATERIAL).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={filtros.categoria || ''}
                    onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as CategoriaMaterial || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {Object.entries(CATEGORIAS_MATERIAL).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    value={filtros.prioridade || ''}
                    onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value as PrioridadeSubmissao || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas as prioridades</option>
                    {Object.entries(PRIORIDADES_SUBMISSAO).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tabela de Submissões */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigo')}>
                    <div className="flex items-center space-x-1">
                      <span>Código</span>
                      {sortBy === 'codigo' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('titulo')}>
                    <div className="flex items-center space-x-1">
                      <span>Título</span>
                      {sortBy === 'titulo' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('prioridade')}>
                    <div className="flex items-center space-x-1">
                      <span>Prioridade</span>
                      {sortBy === 'prioridade' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('estado')}>
                    <div className="flex items-center space-x-1">
                      <span>Estado</span>
                      {sortBy === 'estado' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('data_submissao')}>
                    <div className="flex items-center space-x-1">
                      <span>Data</span>
                      {sortBy === 'data_submissao' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="text-gray-500">Carregando submissões...</span>
                      </div>
                    </td>
                  </tr>
                ) : sortedSubmissoes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <Package className="h-12 w-12 text-gray-400" />
                        <span className="text-gray-500">Nenhuma submissão encontrada</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedSubmissoes.map((submissao) => {
                    const UrgenciaIcon = getUrgenciaIcon(submissao.urgencia);
                    return (
                      <tr key={submissao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{submissao.codigo}</span>
                            {submissao.urgencia !== 'normal' && (
                              <UrgenciaIcon className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{submissao.titulo}</div>
                          <div className="text-sm text-gray-500">{submissao.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{TIPOS_MATERIAL[submissao.tipo_material]}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(submissao.prioridade)}`}>
                            {PRIORIDADES_SUBMISSAO[submissao.prioridade]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(submissao.estado)}`}>
                            {ESTADOS_SUBMISSAO[submissao.estado]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(submissao.data_submissao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {submissao.submissor_nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedSubmissao(submissao);
                                setShowDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                                                         <button 
                               onClick={() => handleEdit(submissao)}
                               className="text-gray-600 hover:text-gray-900 p-1"
                             >
                               <Edit className="h-4 w-4" />
                             </button>
                            <button className="text-red-600 hover:text-red-900 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetails && selectedSubmissao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedSubmissao.titulo}</h2>
                    <p className="text-sm text-gray-600">{selectedSubmissao.codigo}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Descrição</label>
                      <p className="text-sm text-gray-900">{selectedSubmissao.descricao}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo de Material</label>
                      <p className="text-sm text-gray-900">{TIPOS_MATERIAL[selectedSubmissao.tipo_material]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Categoria</label>
                      <p className="text-sm text-gray-900">{CATEGORIAS_MATERIAL[selectedSubmissao.categoria]}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(selectedSubmissao.estado)}`}>
                        {ESTADOS_SUBMISSAO[selectedSubmissao.estado]}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Submissão</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Submissor</label>
                      <p className="text-sm text-gray-900">{selectedSubmissao.submissor_nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Data de Submissão</label>
                      <p className="text-sm text-gray-900">{new Date(selectedSubmissao.data_submissao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Prioridade</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(selectedSubmissao.prioridade)}`}>
                        {PRIORIDADES_SUBMISSAO[selectedSubmissao.prioridade]}
                      </span>
                    </div>
                                         <div>
                       <label className="text-sm font-medium text-gray-600">Urgência</label>
                       <div className="flex items-center space-x-2">
                         <span className="text-sm text-gray-900">{URGENCIAS_SUBMISSAO[selectedSubmissao.urgencia]}</span>
                         {selectedSubmissao.urgencia !== 'normal' && (
                           (() => {
                             const UrgenciaIcon = getUrgenciaIcon(selectedSubmissao.urgencia);
                             return <UrgenciaIcon className="h-4 w-4 text-orange-500" />;
                           })()
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Especificações Técnicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações Técnicas</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{selectedSubmissao.especificacoes_tecnicas}</p>
                </div>
              </div>

              {/* Normas e Certificados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Normas de Referência</h3>
                  <div className="space-y-2">
                    {selectedSubmissao.normas_referencia.map((norma, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-900">{norma}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificados Necessários</h3>
                  <div className="space-y-2">
                    {selectedSubmissao.certificados_necessarios.map((certificado, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-900">{certificado}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impacto */}
              {(selectedSubmissao.impacto_custo || selectedSubmissao.impacto_prazo) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedSubmissao.impacto_custo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto Financeiro</h3>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {selectedSubmissao.impacto_custo.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedSubmissao.impacto_prazo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto no Prazo</h3>
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-5 w-5 text-blue-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {selectedSubmissao.impacto_prazo} dias
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {selectedSubmissao.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmissao.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
                 </div>
       )}

       {/* Form Modal */}
       <SubmissaoMateriaisForms
         isOpen={showForm}
         onClose={() => setShowForm(false)}
         editingSubmissao={editingSubmissao}
         onSuccess={handleFormSuccess}
       />

       {/* Relatório Modal */}
       <Modal
         isOpen={showRelatorio}
         onClose={() => setShowRelatorio(false)}
         size="xl"
         title="Relatório de Submissões de Materiais"
       >
         <div className="space-y-4">
           <RelatorioSubmissaoMateriaisPremium 
             onSelecaoChange={setSubmissoesSelecionadas}
           />
           
           {submissoesSelecionadas.length > 0 && (
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <span className="text-sm font-medium text-blue-900">
                     {submissoesSelecionadas.length} submissão(ões) selecionada(s)
                   </span>
                 </div>
                 <button
                   onClick={() => setSubmissoesSelecionadas([])}
                   className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                 >
                   Limpar seleção
                 </button>
               </div>
             </div>
           )}
         </div>
       </Modal>
     </div>
   );
 }
