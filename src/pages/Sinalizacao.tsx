import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Signal,
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
  Zap,
  Shield,
  Database,
  Settings,
  Save,
  Loader2,
  Activity,
  Wifi,
  Radio,
  Satellite,
  Lightbulb,
  Bell,
  Camera,
  Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sinalizacaoAPI } from '../lib/supabase-api/sinalizacaoAPI';
import { SinalizacaoForm } from '../components/SinalizacaoForms';
import { SinalizacaoDetails } from '../components/SinalizacaoDetails';
import { SinalizacaoFilters } from '../components/SinalizacaoFilters';
import { Pagination } from '../components/Pagination';
import { ExportButtons } from '../components/ExportButtons';
import { 
  FilterState, 
  applyFilters,
  getActiveFiltersCount, 
  getDefaultFilters,
  sortData,
  paginateData,
  getTotalPages
} from '../utils/filterUtils';
import {
  formatSinalizacaoForExport
} from '../utils/exportUtils';

interface SistemaSinalizacao {
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
  ultima_inspecao: string;
  proxima_inspecao: string;
  parametros: {
    alcance: number;
    frequencia: string;
    potencia: number;
    sensibilidade: number;
  };
  status_operacional: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

interface InspecaoSinalizacao {
  id: string;
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  fotos: string[];
  relatorio_url: string;
  sinalizacao_id: string;
  parametros_medidos: any;
  created_at: string;
  updated_at: string;
}

interface SinalizacaoStats {
  totalSinalizacoes: number;
  operacionais: number;
  manutencao: number;
  avariadas: number;
  inspecoesPendentes: number;
  alertasCriticos: number;
  conformidade: number;
  kmCobertos: number;
}

export default function Sinalizacao() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSinalizacao, setSelectedSinalizacao] = useState<SistemaSinalizacao | null>(null);
  const [selectedInspecao, setSelectedInspecao] = useState<InspecaoSinalizacao | null>(null);
  
  // Estados para modais
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalType, setModalType] = useState<'sinalizacao' | 'inspecao'>('sinalizacao');
  const [editData, setEditData] = useState<any>(null);
  
  // Estados para dados reais
  const [sinalizacoes, setSinalizacoes] = useState<SistemaSinalizacao[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoSinalizacao[]>([]);
  const [stats, setStats] = useState<SinalizacaoStats | null>(null);
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
      const [sinalizacoesData, inspecoesData, statsData] = await Promise.all([
        sinalizacaoAPI.sinalizacoes.getAll(),
        sinalizacaoAPI.inspecoes.getAll(),
        sinalizacaoAPI.stats.getStats()
      ]);
      
      setSinalizacoes(sinalizacoesData);
      setInspecoes(inspecoesData);
      setStats(statsData);
      
      toast.success('Dados de Sinalização carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de Sinalização');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados reais do Supabase
  useEffect(() => {
    loadData();
  }, []);

  // Dados simulados para demonstração (mantido como fallback)
  const sinalizacoesDemo: SistemaSinalizacao[] = [
    {
      id: '1',
      codigo: 'SIG-001-2024',
      tipo: 'Sinal Luminoso',
      categoria: 'Sinalização de Via',
      localizacao: 'Entrada Norte',
      km_inicial: 12.5,
      km_final: 12.6,
      estado: 'Operacional',
      fabricante: 'Siemens',
      modelo: 'SIGMA-2000',
      data_instalacao: '2024-01-15',
      ultima_inspecao: '2024-05-15',
      proxima_inspecao: '2024-08-15',
      parametros: {
        alcance: 500,
        frequencia: '2.4 GHz',
        potencia: 25,
        sensibilidade: -85
      },
      status_operacional: 'Ativo',
      observacoes: 'Sinalização funcionando perfeitamente',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-05-15T14:30:00Z'
    },
    {
      id: '2',
      codigo: 'SIG-002-2024',
      tipo: 'Sinal Sonoro',
      categoria: 'Sinalização de Passagem',
      localizacao: 'Cruzamento Central',
      km_inicial: 15.2,
      km_final: 15.3,
      estado: 'Manutenção',
      fabricante: 'Alstom',
      modelo: 'AUDIO-3000',
      data_instalacao: '2024-02-20',
      ultima_inspecao: '2024-06-10',
      proxima_inspecao: '2024-09-10',
      parametros: {
        alcance: 300,
        frequencia: '1.8 GHz',
        potencia: 20,
        sensibilidade: -80
      },
      status_operacional: 'Inativo',
      observacoes: 'Necessita substituição de componentes',
      created_at: '2024-02-20T09:00:00Z',
      updated_at: '2024-06-10T11:15:00Z'
    },
    {
      id: '3',
      codigo: 'SIG-003-2024',
      tipo: 'Sinal Eletrônico',
      categoria: 'Sinalização de Velocidade',
      localizacao: 'Curva Perigosa',
      km_inicial: 18.7,
      km_final: 18.8,
      estado: 'Operacional',
      fabricante: 'Bombardier',
      modelo: 'SPEED-5000',
      data_instalacao: '2024-03-10',
      ultima_inspecao: '2024-06-20',
      proxima_inspecao: '2024-09-20',
      parametros: {
        alcance: 800,
        frequencia: '3.0 GHz',
        potencia: 30,
        sensibilidade: -90
      },
      status_operacional: 'Ativo',
      observacoes: 'Sistema de controle de velocidade ativo',
      created_at: '2024-03-10T08:30:00Z',
      updated_at: '2024-06-20T16:45:00Z'
    }
  ];

  const inspecoesDemo: InspecaoSinalizacao[] = [
    {
      id: '1',
      data_inspecao: '2024-06-15',
      tipo: 'Verificação Funcional',
      inspector: 'João Silva',
      resultado: 'Conforme',
      observacoes: 'Todos os parâmetros dentro dos limites aceitáveis',
      acoes_corretivas: 'Nenhuma ação necessária',
      proxima_inspecao: '2024-09-15',
      fotos: [],
      relatorio_url: '',
      sinalizacao_id: '1',
      parametros_medidos: {
        alcance: 495,
        frequencia: '2.4 GHz',
        potencia: 24.8,
        sensibilidade: -84
      },
      created_at: '2024-06-15T10:00:00Z',
      updated_at: '2024-06-15T10:00:00Z'
    },
    {
      id: '2',
      data_inspecao: '2024-06-10',
      tipo: 'Manutenção Preventiva',
      inspector: 'Maria Santos',
      resultado: 'Não Conforme',
      observacoes: 'Detetada falha no sistema de comunicação',
      acoes_corretivas: 'Substituição do módulo de comunicação',
      proxima_inspecao: '2024-07-10',
      fotos: [],
      relatorio_url: '',
      sinalizacao_id: '2',
      parametros_medidos: {
        alcance: 0,
        frequencia: 'N/A',
        potencia: 0,
        sensibilidade: 0
      },
      created_at: '2024-06-10T14:30:00Z',
      updated_at: '2024-06-10T14:30:00Z'
    }
  ];

  const statsDemo: SinalizacaoStats = {
    totalSinalizacoes: 156,
    operacionais: 142,
    manutencao: 8,
    avariadas: 6,
    inspecoesPendentes: 23,
    alertasCriticos: 3,
    conformidade: 91.0,
    kmCobertos: 89.5
  };

  const handleAddNew = (type: 'sinalizacao' | 'inspecao') => {
    setModalType(type);
    setEditData(null);
    setShowFormModal(true);
    toast.success(`🚦 Abrindo formulário para nova ${type}...`, {
      icon: '🚦',
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '600'
      }
    });
  };

  const handleEdit = (type: 'sinalizacao' | 'inspecao', data: any) => {
    setModalType(type);
    setEditData(data);
    setShowFormModal(true);
  };

  const handleView = (type: 'sinalizacao' | 'inspecao', data: any) => {
    setModalType(type);
    if (type === 'sinalizacao') setSelectedSinalizacao(data);
    else if (type === 'inspecao') setSelectedInspecao(data);
    setShowDetailsModal(true);
  };

  const handleDelete = async (type: 'sinalizacao' | 'inspecao', id: string) => {
    if (!confirm(`Tem certeza que deseja excluir esta ${type}?`)) return;

    try {
      if (type === 'sinalizacao') {
        await sinalizacaoAPI.sinalizacoes.delete(id);
        setSinalizacoes(sinalizacoes.filter(s => s.id !== id));
      } else if (type === 'inspecao') {
        await sinalizacaoAPI.inspecoes.delete(id);
        setInspecoes(inspecoes.filter(i => i.id !== id));
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} excluída com sucesso!`);
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error);
      toast.error(`Erro ao excluir ${type}`);
    }
  };

  const handleFormSuccess = () => {
    loadData();
  };

  // Funções de filtro e paginação
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(getDefaultFilters());
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Aplicar filtros e ordenação aos dados
  const getFilteredAndSortedData = (data: any[]) => {
    let filteredData = applyFilters(data, filters);
    return sortData(filteredData, sortBy, sortOrder);
  };

  // Obter dados paginados
  const getPaginatedData = (data: any[]) => {
    const filteredData = getFilteredAndSortedData(data);
    return paginateData(filteredData, currentPage, itemsPerPage);
  };

  // Usar dados reais se disponíveis, senão usar dados demo
  const sinalizacoesData = sinalizacoes.length > 0 ? sinalizacoes : sinalizacoesDemo;
  const inspecoesData = inspecoes.length > 0 ? inspecoes : inspecoesDemo;
  const statsData = stats || statsDemo;

  // Calcular estatísticas dos filtros
  const activeFiltersCount = getActiveFiltersCount(filters);
  const filteredSinalizacoes = getFilteredAndSortedData(sinalizacoesData);
  const paginatedSinalizacoes = getPaginatedData(sinalizacoesData);
  const totalPages = getTotalPages(filteredSinalizacoes.length, itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Carregando Sinalização...</h2>
          <p className="text-gray-500 mt-2">Aguarde enquanto carregamos os dados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Signal className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sinalização Ferroviária</h1>
                <p className="text-gray-600 mt-1">
                  Gestão completa dos sistemas de sinalização e comunicação
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAddNew('sinalizacao')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Sinalização</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'sinalizacoes', label: 'Sinalizações', icon: Signal },
              { id: 'inspecoes', label: 'Inspeções', icon: CheckCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sinalizações</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{statsData.totalSinalizacoes}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Signal className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Operacionais</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{statsData.operacionais}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Em Manutenção</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{statsData.manutencao}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avariadas</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{statsData.avariadas}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Gráficos e Métricas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Operacional</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conformidade Geral</span>
                    <span className="text-lg font-semibold text-green-600">{statsData.conformidade}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${statsData.conformidade}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cobertura da Via</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KM Cobertos</span>
                    <span className="text-lg font-semibold text-blue-600">{statsData.kmCobertos} km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(statsData.kmCobertos / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Sinalizações Tab */}
        {activeTab === 'sinalizacoes' && (
          <div className="space-y-6">
            {/* Filtros */}
            <SinalizacaoFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
            />

            {/* Tabela de Sinalizações */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestão de Sinalizações</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredSinalizacoes.length} sinalização{filteredSinalizacoes.length !== 1 ? 'ões' : ''} encontrada{filteredSinalizacoes.length !== 1 ? 's' : ''}
                    {activeFiltersCount > 0 && ` (${sinalizacoesData.length} total)`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <ExportButtons
                    data={formatSinalizacaoForExport(paginatedSinalizacoes)}
                    entityType="sinalizacoes"
                  />
                  <button
                    onClick={() => handleAddNew('sinalizacao')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nova Sinalização</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSort('codigo')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Código</span>
                          {sortBy === 'codigo' && (
                            <span className="text-blue-500">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSort('tipo')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Tipo</span>
                          {sortBy === 'tipo' && (
                            <span className="text-blue-500">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSort('categoria')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Categoria</span>
                          {sortBy === 'categoria' && (
                            <span className="text-blue-500">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSort('estado')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Estado</span>
                          {sortBy === 'estado' && (
                            <span className="text-blue-500">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleSort('km_inicial')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>KM</span>
                          {sortBy === 'km_inicial' && (
                            <span className="text-blue-500">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSinalizacoes.map((sinalizacao) => (
                      <tr key={sinalizacao.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">{sinalizacao.codigo}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {sinalizacao.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{sinalizacao.categoria}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            sinalizacao.estado === 'Operacional' ? 'bg-green-100 text-green-800' :
                            sinalizacao.estado === 'Manutenção' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sinalizacao.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{sinalizacao.km_inicial} - {sinalizacao.km_final}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            sinalizacao.status_operacional === 'Ativo' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sinalizacao.status_operacional}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{sinalizacao.proxima_inspecao}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView('sinalizacao', sinalizacao)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit('sinalizacao', sinalizacao)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('sinalizacao', sinalizacao.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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

              {/* Paginação */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredSinalizacoes.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </div>
          </div>
        )}

        {/* Inspeções Tab */}
        {activeTab === 'inspecoes' && (
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Inspeções de Sinalização</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAddNew('inspecao')}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Inspeção</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Data</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Inspector</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Resultado</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Sinalização</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inspecoesData.slice(0, 10).map((inspecao) => (
                    <tr key={inspecao.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-gray-600">{inspecao.data_inspecao}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {inspecao.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{inspecao.inspector}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          inspecao.resultado === 'Conforme' ? 'bg-green-100 text-green-800' :
                          inspecao.resultado === 'Não Conforme' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inspecao.resultado}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {sinalizacoesData.find(s => s.id === inspecao.sinalizacao_id)?.codigo || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{inspecao.proxima_inspecao}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView('inspecao', inspecao)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit('inspecao', inspecao)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('inspecao', inspecao.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        )}

        {/* Modais */}
        {showFormModal && (
          <SinalizacaoForm
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            editData={editData}
            onSuccess={handleFormSuccess}
            type={modalType}
          />
        )}

        {showDetailsModal && (
          <SinalizacaoDetails
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            data={modalType === 'sinalizacao' ? selectedSinalizacao : selectedInspecao}
            type={modalType}
          />
        )}
      </div>
    </div>
  );
}
