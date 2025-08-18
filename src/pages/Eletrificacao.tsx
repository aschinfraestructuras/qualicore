import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Ruler,
  HardHat,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash,
  Train,
  Shield,
  Database,
  Settings,
  Save,
  Loader2,
  Activity,
  Battery,
  Power,
  Cable,
  Transformer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eletrificacaoAPI } from '../lib/supabase-api/eletrificacaoAPI';
import { EletrificacaoForm } from '../components/EletrificacaoForms';
import { EletrificacaoDetails } from '../components/EletrificacaoDetails';
import { EletrificacaoFilters } from '../components/EletrificacaoFilters';
import { Pagination } from '../components/Pagination';
import { 
  FilterState, 
  applyFilters, 
  getActiveFiltersCount, 
  getDefaultFilters,
  sortData,
  paginateData,
  getTotalPages
} from '../utils/filterUtils';

interface EletrificacaoItem {
  id: string;
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    tensao: number;
    corrente: number;
    potencia: number;
    frequencia: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

interface InspecaoEletrificacao {
  id: string;
  eletrificacao_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

export default function Eletrificacao() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEletrificacao, setSelectedEletrificacao] = useState<Eletrificacao | null>(null);
  const [selectedInspecao, setSelectedInspecao] = useState<InspecaoEletrificacao | null>(null);
  
  // Estados para modais
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalType, setModalType] = useState<'eletrificacao' | 'inspecao'>('eletrificacao');
  const [editData, setEditData] = useState<any>(null);
  
  // Estados para dados reais
  const [eletrificacoes, setEletrificacoes] = useState<Eletrificacao[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoEletrificacao[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('codigo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      const [eletrificacoesData, inspecoesData, statsData] = await Promise.all([
        eletrificacaoAPI.eletrificacoes.getAll(),
        eletrificacaoAPI.inspecoes.getAll(),
        eletrificacaoAPI.stats.getStats()
      ]);
      
      setEletrificacoes(eletrificacoesData);
      setInspecoes(inspecoesData);
      setStats(statsData);
      
      toast.success('Dados da Eletrificação carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da Eletrificação');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados reais do Supabase
  useEffect(() => {
    loadData();
  }, []);

  // Dados simulados para demonstração (mantido como fallback)
  const mockStats = {
    total_eletrificacoes: 156,
    operacionais: 142,
    manutencao: 8,
    avarias: 6,
    conformidade: 91.0,
    ultima_inspecao: '2024-12-15',
    proxima_inspecao: '2024-12-22'
  };

  const mockEletrificacoes: Eletrificacao[] = [
    {
      id: '1',
      codigo: 'CAT-001-2024',
      tipo: 'Catenária',
      categoria: 'Alimentação',
      localizacao: 'Linha Norte - KM 45.2',
      km_inicial: 45.0,
      km_final: 45.5,
      estado: 'Operacional',
      fabricante: 'Siemens',
      modelo: 'CAT-25kV-AC',
      data_instalacao: '2020-03-15',
      status_operacional: 'Ativo',
      observacoes: 'Catenária principal em excelente estado',
      parametros: {
        tensao: 25000,
        corrente: 800,
        potencia: 20000,
        frequencia: 50
      },
      ultima_inspecao: '2024-11-20',
      proxima_inspecao: '2024-12-20',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-11-20T14:30:00Z'
    },
    {
      id: '2',
      codigo: 'SUB-002-2024',
      tipo: 'Subestação',
      categoria: 'Transformação',
      localizacao: 'Estação Central',
      km_inicial: 0.0,
      km_final: 0.0,
      estado: 'Operacional',
      fabricante: 'ABB',
      modelo: 'SUB-110kV',
      data_instalacao: '2019-08-10',
      status_operacional: 'Ativo',
      observacoes: 'Subestação principal com capacidade de 50MW',
      parametros: {
        tensao: 110000,
        corrente: 500,
        potencia: 50000,
        frequencia: 50
      },
      ultima_inspecao: '2024-12-01',
      proxima_inspecao: '2024-12-15',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-12-01T09:15:00Z'
    }
  ];

  const mockInspecoes: InspecaoEletrificacao[] = [
    {
      id: '1',
      eletrificacao_id: '1',
      data_inspecao: '2024-11-20',
      tipo_inspecao: 'Preventiva',
      resultado: 'Conforme',
      observacoes: 'Todos os parâmetros dentro dos limites normais',
      responsavel: 'Eng. João Silva',
      proxima_inspecao: '2024-12-20',
      created_at: '2024-11-20T14:30:00Z',
      updated_at: '2024-11-20T14:30:00Z'
    }
  ];

  // Usar dados reais ou mock
  const currentStats = stats || mockStats;
  const currentEletrificacoes = eletrificacoes.length > 0 ? eletrificacoes : mockEletrificacoes;
  const currentInspecoes = inspecoes.length > 0 ? inspecoes : mockInspecoes;

  // Aplicar filtros e ordenação
  const filteredEletrificacoes = applyFilters(currentEletrificacoes, filters);
  const sortedEletrificacoes = sortData(filteredEletrificacoes, sortBy, sortOrder);
  const paginatedEletrificacoes = paginateData(sortedEletrificacoes, currentPage, itemsPerPage);
  const totalPages = getTotalPages(filteredEletrificacoes.length, itemsPerPage);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const handleDelete = async (id: string, type: 'eletrificacao' | 'inspecao') => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        if (type === 'eletrificacao') {
          await eletrificacaoAPI.eletrificacoes.delete(id);
          toast.success('Eletrificação excluída com sucesso!');
        } else {
          await eletrificacaoAPI.inspecoes.delete(id);
          toast.success('Inspeção excluída com sucesso!');
        }
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir item');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800';
      case 'Avaria': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return <CheckCircle className="h-4 w-4" />;
      case 'Manutenção': return <Clock className="h-4 w-4" />;
      case 'Avaria': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando dados da Eletrificação...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Eletrificação Ferroviária</h1>
                <p className="text-sm text-gray-600">Gestão de sistemas de eletrificação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setModalType('eletrificacao');
                  setEditData(null);
                  setShowFormModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Eletrificação</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('eletrificacoes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'eletrificacoes'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Eletrificações
              </button>
              <button
                onClick={() => setActiveTab('inspecoes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inspecoes'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inspeções
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Eletrificações</p>
                    <p className="text-2xl font-bold text-gray-900">{currentStats.total_eletrificacoes}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Operacionais</p>
                    <p className="text-2xl font-bold text-green-600">{currentStats.operacionais}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Em Manutenção</p>
                    <p className="text-2xl font-bold text-yellow-600">{currentStats.manutencao}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conformidade</p>
                    <p className="text-2xl font-bold text-blue-600">{currentStats.conformidade}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {currentEletrificacoes.slice(0, 5).map((eletrificacao) => (
                  <div key={eletrificacao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{eletrificacao.codigo}</p>
                        <p className="text-sm text-gray-600">{eletrificacao.localizacao}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eletrificacao.status_operacional)}`}>
                        {eletrificacao.status_operacional}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Eletrificações Tab */}
        {activeTab === 'eletrificacoes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Filters */}
            <EletrificacaoFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(getDefaultFilters())}
              activeFiltersCount={getActiveFiltersCount(filters)}
              type="eletrificacoes"
            />

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigo')}>
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('tipo')}>
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('localizacao')}>
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status_operacional')}>
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ultima_inspecao')}>
                        Última Inspeção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedEletrificacoes.map((eletrificacao) => (
                      <tr key={eletrificacao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{eletrificacao.codigo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{eletrificacao.tipo}</div>
                          <div className="text-sm text-gray-500">{eletrificacao.categoria}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{eletrificacao.localizacao}</div>
                          <div className="text-sm text-gray-500">KM {eletrificacao.km_inicial} - {eletrificacao.km_final}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eletrificacao.status_operacional)}`}>
                            {getStatusIcon(eletrificacao.status_operacional)}
                            <span className="ml-1">{eletrificacao.status_operacional}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {eletrificacao.ultima_inspecao ? new Date(eletrificacao.ultima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedEletrificacao(eletrificacao);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setModalType('eletrificacao');
                                setEditData(eletrificacao);
                                setShowFormModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(eletrificacao.id, 'eletrificacao')}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}

        {/* Inspeções Tab */}
        {activeTab === 'inspecoes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInspecoes.map((inspecao) => (
                      <tr key={inspecao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(inspecao.data_inspecao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspecao.tipo_inspecao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inspecao.resultado === 'Conforme' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {inspecao.resultado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inspecao.responsavel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedInspecao(inspecao);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(inspecao.id, 'inspecao')}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <EletrificacaoForm
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          editData={editData}
          onSuccess={handleFormSuccess}
          type={modalType}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <EletrificacaoDetails
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          data={selectedEletrificacao || selectedInspecao}
          type={modalType}
          onEdit={() => {
            setShowDetailsModal(false);
            setModalType(modalType);
            setEditData(selectedEletrificacao || selectedInspecao);
            setShowFormModal(true);
          }}
          onDelete={() => {
            if (selectedEletrificacao) {
              handleDelete(selectedEletrificacao.id, 'eletrificacao');
            } else if (selectedInspecao) {
              handleDelete(selectedInspecao.id, 'inspecao');
            }
            setShowDetailsModal(false);
          }}
        />
      )}
    </div>
  );
}
