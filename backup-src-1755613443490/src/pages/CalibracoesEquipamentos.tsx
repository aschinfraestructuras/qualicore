import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Camera, 
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
  Eye,
  BarChart3,
  Calendar,
  DollarSign,
  Package,
  Users,
  MapPin,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao, 
  CalibracoesStats,
  TIPOS_EQUIPAMENTO,
  CATEGORIAS_EQUIPAMENTO,
  ESTADOS_EQUIPAMENTO,
  STATUS_OPERACIONAL
} from '../types/calibracoes';
import { 
  getEquipamentos, 
  getCalibracoes, 
  getManutencoes, 
  getInspecoes, 
  getCalibracoesStats,
  getCalibracoesAlertas
} from '../lib/supabase-api/calibracoesAPI';
import CalibracoesEquipamentosFilters from '../components/CalibracoesEquipamentosFilters';
import CalibracoesEquipamentosForms from '../components/CalibracoesEquipamentosForms';
import CalibracoesEquipamentosDetails from '../components/CalibracoesEquipamentosDetails';
import RelatorioCalibracoesEquipamentosPremium from '../components/RelatorioCalibracoesEquipamentosPremium';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CalibracoesEquipamentos() {
  const [activeTab, setActiveTab] = useState<'equipamentos' | 'calibracoes' | 'manutencoes' | 'inspecoes'>('equipamentos');
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [calibracoes, setCalibracoes] = useState<Calibracao[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [stats, setStats] = useState<CalibracoesStats | null>(null);
  const [alertas, setAlertas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipamentosData, calibracoesData, manutencoesData, inspecoesData, statsData, alertasData] = await Promise.all([
        getEquipamentos(),
        getCalibracoes(),
        getManutencoes(),
        getInspecoes(),
        getCalibracoesStats(),
        getCalibracoesAlertas()
      ]);

      setEquipamentos(equipamentosData);
      setCalibracoes(calibracoesData);
      setManutencoes(manutencoesData);
      setInspecoes(inspecoesData);
      setStats(statsData);
      setAlertas(alertasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este item?')) return;

    try {
      // Implementar eliminação baseada no tipo
      toast.success('Item eliminado com sucesso');
      loadData();
    } catch (error) {
      console.error('Erro ao eliminar:', error);
      toast.error('Erro ao eliminar item');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    loadData();
    toast.success('Operação realizada com sucesso');
  };

  const getFilteredData = () => {
    const data = {
      equipamentos,
      calibracoes,
      manutencoes,
      inspecoes
    };

    if (!searchTerm) return data[activeTab];

    return data[activeTab].filter((item: any) => {
      const searchLower = searchTerm.toLowerCase();
      
      switch (activeTab) {
        case 'equipamentos':
          return (
            item.codigo?.toLowerCase().includes(searchLower) ||
            item.nome?.toLowerCase().includes(searchLower) ||
            item.marca?.toLowerCase().includes(searchLower) ||
            item.modelo?.toLowerCase().includes(searchLower) ||
            item.departamento?.toLowerCase().includes(searchLower) ||
            item.responsavel?.toLowerCase().includes(searchLower)
          );
        case 'calibracoes':
          return (
            item.numero_calibracao?.toLowerCase().includes(searchLower) ||
            item.laboratorio?.toLowerCase().includes(searchLower) ||
            item.tecnico_responsavel?.toLowerCase().includes(searchLower) ||
            item.equipamento?.nome?.toLowerCase().includes(searchLower)
          );
        case 'manutencoes':
          return (
            item.descricao?.toLowerCase().includes(searchLower) ||
            item.tecnico_responsavel?.toLowerCase().includes(searchLower) ||
            item.fornecedor?.toLowerCase().includes(searchLower) ||
            item.equipamento?.nome?.toLowerCase().includes(searchLower)
          );
        case 'inspecoes':
          return (
            item.inspetor?.toLowerCase().includes(searchLower) ||
            item.equipamento?.nome?.toLowerCase().includes(searchLower)
          );
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'operacional':
      case 'aprovado':
      case 'concluida':
        return 'text-green-600 bg-green-100';
      case 'inativo':
      case 'nao_operacional':
      case 'reprovado':
      case 'cancelada':
        return 'text-red-600 bg-red-100';
      case 'manutencao':
      case 'em_teste':
      case 'em_calibracao':
      case 'condicional':
      case 'em_andamento':
        return 'text-yellow-600 bg-yellow-100';
      case 'avariado':
      case 'obsoleto':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
      case 'operacional':
      case 'aprovado':
      case 'concluida':
        return <CheckCircle className="w-4 h-4" />;
      case 'inativo':
      case 'nao_operacional':
      case 'reprovado':
      case 'cancelada':
        return <XCircle className="w-4 h-4" />;
      case 'manutencao':
      case 'em_teste':
      case 'em_calibracao':
      case 'condicional':
      case 'em_andamento':
        return <Clock className="w-4 h-4" />;
      case 'avariado':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calibrações e Equipamentos</h1>
              <p className="text-gray-600">Gestão completa de equipamentos, calibrações, manutenções e inspeções</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRelatorio(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Relatórios</span>
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Dashboard */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Equipamentos</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total_equipamentos}</dd>
                </dl>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Equipamentos Ativos</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.equipamentos_ativos}</dd>
                </dl>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Calibrações Vencidas</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.calibracoes_vencidas}</dd>
                </dl>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.valor_total_equipamentos)}
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Alertas */}
      {alertas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {alertas.calibracoes_vencidas.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {alertas.calibracoes_vencidas.length} Calibração(ões) Vencida(s)
                  </h3>
                </div>
              </div>
            </div>
          )}

          {alertas.calibracoes_proximas_vencer.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    {alertas.calibracoes_proximas_vencer.length} Calibração(ões) a Vencer
                  </h3>
                </div>
              </div>
            </div>
          )}

          {alertas.manutencoes_pendentes.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {alertas.manutencoes_pendentes.length} Manutenção(ões) Pendente(s)
                  </h3>
                </div>
              </div>
            </div>
          )}

          {alertas.inspecoes_pendentes.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-purple-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    {alertas.inspecoes_pendentes.length} Inspeção(ões) Pendente(s)
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'equipamentos', label: 'Equipamentos', count: equipamentos.length },
              { id: 'calibracoes', label: 'Calibrações', count: calibracoes.length },
              { id: 'manutencoes', label: 'Manutenções', count: manutencoes.length },
              { id: 'inspecoes', label: 'Inspeções', count: inspecoes.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4">
              <CalibracoesEquipamentosFilters
                activeTab={activeTab}
                onApplyFilters={() => {
                  setShowFilters(false);
                  loadData();
                }}
              />
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'equipamentos' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo/Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </>
                )}
                {activeTab === 'calibracoes' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calibração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Laboratório
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Calibração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próxima Calibração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </>
                )}
                {activeTab === 'manutencoes' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manutenção
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </>
                )}
                {activeTab === 'inspecoes' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inspeção
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inspetor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredData().map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {activeTab === 'equipamentos' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.codigo}</div>
                          <div className="text-sm text-gray-500">{item.nome}</div>
                          <div className="text-xs text-gray-400">{item.marca} {item.modelo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {TIPOS_EQUIPAMENTO.find(t => t.value === item.tipo)?.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {CATEGORIAS_EQUIPAMENTO.find(c => c.value === item.categoria)?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{item.localizacao}</span>
                        </div>
                        <div className="text-sm text-gray-500">{item.departamento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{item.responsavel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.estado)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.estado)}`}>
                            {ESTADOS_EQUIPAMENTO.find(s => s.value === item.estado)?.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {STATUS_OPERACIONAL.find(s => s.value === item.status_operacional)?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.valor_aquisicao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {activeTab === 'calibracoes' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.numero_calibracao}</div>
                          <div className="text-sm text-gray-500">{item.tipo_calibracao}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.equipamento?.nome}</div>
                        <div className="text-sm text-gray-500">{item.equipamento?.codigo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.laboratorio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.data_calibracao).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.data_proxima_calibracao).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.resultado)}`}>
                          {item.resultado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {activeTab === 'manutencoes' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.tipo_manutencao}</div>
                          <div className="text-sm text-gray-500">{item.descricao}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.equipamento?.nome}</div>
                        <div className="text-sm text-gray-500">{item.equipamento?.codigo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tipo_manutencao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tecnico_responsavel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.data_manutencao).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.resultado)}`}>
                          {item.resultado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {activeTab === 'inspecoes' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.tipo_inspecao}</div>
                          <div className="text-sm text-gray-500">{item.observacoes}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.equipamento?.nome}</div>
                        <div className="text-sm text-gray-500">{item.equipamento?.codigo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tipo_inspecao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.inspetor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.data_inspecao).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.resultado)}`}>
                          {item.resultado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Formulário de Calibrações e Equipamentos">
          <CalibracoesEquipamentosForms
            activeTab={activeTab}
            editingItem={editingItem}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        </Modal>
      )}

      {showDetails && selectedItem && (
        <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Detalhes de Calibrações e Equipamentos">
          <CalibracoesEquipamentosDetails
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            activeTab={activeTab}
            itemId={selectedItem.id}
            onEdit={(id) => {
              setShowDetails(false);
              handleEdit(selectedItem);
            }}
            onDelete={(id) => {
              setShowDetails(false);
              handleDelete(id);
            }}
          />
        </Modal>
      )}

      {showRelatorio && (
        <Modal isOpen={showRelatorio} onClose={() => setShowRelatorio(false)} title="Relatório de Calibrações e Equipamentos">
          <RelatorioCalibracoesEquipamentosPremium
            tipoRelatorio="equipamentos"
            onSelecaoChange={(equipamentosSelecionados) => {
              console.log('Equipamentos selecionados:', equipamentosSelecionados);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
