import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Plus,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Tag,
  Building,
  Zap,
  Shield,
  Layers,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { normasAPI } from '../lib/supabase-api/normasAPI';
import type { 
  Norma, 
  FiltrosNormas, 
  EstatisticasNormas,
  CategoriaNorma,
  OrganismoNormativo,
  StatusNorma,
  PrioridadeNorma,
  CATEGORIAS_NORMAS,
  SUBCATEGORIAS_NORMAS,
  ORGANISMOS_NORMATIVOS
} from '../types/normas';

interface NormasProps {}

export default function Normas({}: NormasProps) {
  const [normas, setNormas] = useState<Norma[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<EstatisticasNormas | null>(null);
  const [filtros, setFiltros] = useState<FiltrosNormas>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'codigo' | 'titulo' | 'data_publicacao' | 'prioridade'>('codigo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedNorma, setSelectedNorma] = useState<Norma | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadNormas();
    loadEstatisticas();
  }, []);

  useEffect(() => {
    if (searchTerm || Object.keys(filtros).length > 0) {
      searchNormas();
    } else {
      loadNormas();
    }
  }, [searchTerm, filtros]);

  const loadNormas = async () => {
    try {
      setLoading(true);
      const data = await normasAPI.normas.getAll();
      setNormas(data);
    } catch (error) {
      console.error('Erro ao carregar normas:', error);
      toast.error('Erro ao carregar normas');
    } finally {
      setLoading(false);
    }
  };

  const loadEstatisticas = async () => {
    try {
      const stats = await normasAPI.stats.getEstatisticas();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const searchNormas = async () => {
    try {
      setLoading(true);
      const searchFiltros: FiltrosNormas = { ...filtros };
      if (searchTerm) {
        searchFiltros.texto_livre = searchTerm;
      }
      const data = await normasAPI.normas.search(searchFiltros);
      setNormas(data);
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

  const sortedNormas = [...normas].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'data_publicacao') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      if (format === 'csv') {
        const csvContent = await normasAPI.export.toCSV(normas);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `normas_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Exportação CSV concluída');
      } else {
        const pdfContent = await normasAPI.export.toPDF(normas);
        const newWindow = window.open();
        newWindow?.document.write(pdfContent);
        newWindow?.document.close();
        toast.success('Relatório PDF gerado');
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro na exportação');
    }
  };

  const getStatusColor = (status: StatusNorma) => {
    switch (status) {
      case 'ATIVA': return 'text-green-600 bg-green-100';
      case 'REVISAO': return 'text-yellow-600 bg-yellow-100';
      case 'OBSOLETA': return 'text-red-600 bg-red-100';
      case 'SUSPENSA': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadeColor = (prioridade: PrioridadeNorma) => {
    switch (prioridade) {
      case 'CRITICA': return 'text-red-600 bg-red-100';
      case 'ALTA': return 'text-orange-600 bg-orange-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAIXA': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadeIcon = (prioridade: PrioridadeNorma) => {
    switch (prioridade) {
      case 'CRITICA': return <AlertCircle className="h-4 w-4" />;
      case 'ALTA': return <Star className="h-4 w-4" />;
      case 'MEDIA': return <Clock className="h-4 w-4" />;
      case 'BAIXA': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const clearFilters = () => {
    setFiltros({});
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Normas</h1>
                <p className="text-sm text-gray-600">Gestão completa de normas técnicas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Norma</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Normas</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.total_normas}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Normas Ativas</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.normas_ativas}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Revisão</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.normas_revisao}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recentes (30d)</p>
                  <p className="text-2xl font-bold text-purple-600">{estatisticas.normas_recentes}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filtros e Pesquisa */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pesquisa e Filtros</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros Avançados</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Pesquisa Rápida */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por código, título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as CategoriaNorma || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {Object.entries(CATEGORIAS_NORMAS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organismo</label>
                <select
                  value={filtros.organismo || ''}
                  onChange={(e) => setFiltros({ ...filtros, organismo: e.target.value as OrganismoNormativo || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os organismos</option>
                  {Object.entries(ORGANISMOS_NORMATIVOS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filtros.status || ''}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value as StatusNorma || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="ATIVA">Ativa</option>
                  <option value="REVISAO">Em Revisão</option>
                  <option value="OBSOLETA">Obsoleta</option>
                  <option value="SUSPENSA">Suspensa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={filtros.prioridade || ''}
                  onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value as PrioridadeNorma || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as prioridades</option>
                  <option value="CRITICA">Crítica</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Média</option>
                  <option value="BAIXA">Baixa</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {normas.length} norma{normas.length !== 1 ? 's' : ''} encontrada{normas.length !== 1 ? 's' : ''}
              </span>
              {(searchTerm || Object.keys(filtros).length > 0) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                  <span>Limpar filtros</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabela de Normas */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigo')}>
                    <div className="flex items-center space-x-1">
                      <span>Código</span>
                      {sortBy === 'codigo' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('titulo')}>
                    <div className="flex items-center space-x-1">
                      <span>Título</span>
                      {sortBy === 'titulo' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organismo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('data_publicacao')}>
                    <div className="flex items-center space-x-1">
                      <span>Data</span>
                      {sortBy === 'data_publicacao' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Carregando normas...</span>
                      </div>
                    </td>
                  </tr>
                ) : normas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma norma encontrada
                    </td>
                  </tr>
                ) : (
                  sortedNormas.map((norma) => (
                    <tr key={norma.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{norma.codigo}</div>
                        <div className="text-sm text-gray-500">v{norma.versao}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{norma.titulo}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{norma.descricao}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {CATEGORIAS_NORMAS[norma.categoria as keyof typeof CATEGORIAS_NORMAS]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ORGANISMOS_NORMATIVOS[norma.organismo as keyof typeof ORGANISMOS_NORMATIVOS]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(norma.status)}`}>
                          {norma.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadeColor(norma.prioridade)}`}>
                          {getPrioridadeIcon(norma.prioridade)}
                          <span className="ml-1">{norma.prioridade}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(norma.data_publicacao).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedNorma(norma);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetails && selectedNorma && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedNorma.codigo}</h2>
                    <p className="text-sm text-gray-600">Detalhes da Norma</p>
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNorma.titulo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Versão</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNorma.versao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {CATEGORIAS_NORMAS[selectedNorma.categoria as keyof typeof CATEGORIAS_NORMAS]}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organismo</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {ORGANISMOS_NORMATIVOS[selectedNorma.organismo as keyof typeof ORGANISMOS_NORMATIVOS]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição e Escopo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição e Escopo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNorma.descricao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Escopo</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNorma.escopo}</p>
                  </div>
                </div>
              </div>

              {/* Aplicabilidade e Requisitos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aplicabilidade e Requisitos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aplicabilidade</label>
                    <div className="space-y-1">
                      {selectedNorma.aplicabilidade?.map((item, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Principais</label>
                    <ul className="space-y-1">
                      {selectedNorma.requisitos_principais?.map((item, index) => (
                        <li key={index} className="text-sm text-gray-900 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Métodos de Ensaio */}
              {selectedNorma.metodos_ensaio && selectedNorma.metodos_ensaio.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Ensaio</h3>
                  <div className="space-y-1">
                    {selectedNorma.metodos_ensaio.map((metodo, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-900">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span>{metodo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedNorma.tags && selectedNorma.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNorma.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observações */}
              {selectedNorma.observacoes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                  <p className="text-sm text-gray-900">{selectedNorma.observacoes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
