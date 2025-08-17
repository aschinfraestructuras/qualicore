import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
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
  Zap,
  Shield,
  Database,
  Settings,
  Save,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { viaFerreaAPI } from '../lib/supabase-api/viaFerreaAPI';
import { TrilhoForm, TravessaForm, InspecaoForm } from '../components/ViaFerreaForms';
import { TrilhoDetails, TravessaDetails, InspecaoDetails } from '../components/ViaFerreaDetails';
import { ViaFerreaFilters } from '../components/ViaFerreaFilters';
import { Pagination } from '../components/Pagination';
import { 
  FilterState, 
  TravessaFilterState,
  InspecaoFilterState,
  applyFilters, 
  applyTravessaFilters,
  applyInspecaoFilters,
  getActiveFiltersCount, 
  getDefaultFilters,
  getDefaultTravessaFilters,
  getDefaultInspecaoFilters,
  sortData,
  paginateData,
  getTotalPages
} from '../utils/filterUtils';

interface Trilho {
  id: string;
  codigo: string;
  tipo: string;
  material: string;
  comprimento: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  tensao: number;
  geometria: {
    alinhamento: number;
    nivel: number;
    bitola: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

interface Travessa {
  id: string;
  codigo: string;
  tipo: string;
  material: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  ultima_inspecao: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

interface Inspecao {
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
  trilho_id: string;
  travessa_id: string;
  parametros_medidos: any;
  created_at: string;
  updated_at: string;
}

export default function ViaFerrea() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTrilho, setSelectedTrilho] = useState<Trilho | null>(null);
  const [selectedTravessa, setSelectedTravessa] = useState<Travessa | null>(null);
  const [selectedInspecao, setSelectedInspecao] = useState<Inspecao | null>(null);
  
  // Estados para modais
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalType, setModalType] = useState<'trilho' | 'travessa' | 'inspecao'>('trilho');
  const [editData, setEditData] = useState<any>(null);
  
  // Estados para dados reais
  const [trilhos, setTrilhos] = useState<Trilho[]>([]);
  const [travessas, setTravessas] = useState<Travessa[]>([]);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para filtros e paginação
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [travessaFilters, setTravessaFilters] = useState<TravessaFilterState>(getDefaultTravessaFilters());
  const [inspecaoFilters, setInspecaoFilters] = useState<InspecaoFilterState>(getDefaultInspecaoFilters());
  const [currentPage, setCurrentPage] = useState(1);
  const [travessaCurrentPage, setTravessaCurrentPage] = useState(1);
  const [inspecaoCurrentPage, setInspecaoCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('codigo');
  const [travessaSortBy, setTravessaSortBy] = useState('codigo');
  const [inspecaoSortBy, setInspecaoSortBy] = useState('data_inspecao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [travessaSortOrder, setTravessaSortOrder] = useState<'asc' | 'desc'>('asc');
  const [inspecaoSortOrder, setInspecaoSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      const [trilhosData, travessasData, inspecoesData, statsData] = await Promise.all([
        viaFerreaAPI.trilhos.getAll(),
        viaFerreaAPI.travessas.getAll(),
        viaFerreaAPI.inspecoes.getAll(),
        viaFerreaAPI.stats.getStats()
      ]);
      
      setTrilhos(trilhosData);
      setTravessas(travessasData);
      setInspecoes(inspecoesData);
      setStats(statsData);
      
      toast.success('Dados da Via Férrea carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados da Via Férrea');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados reais do Supabase
  useEffect(() => {
    loadData();
  }, []);

  // Dados simulados para demonstração (mantido como fallback)
  const trilhosDemo: Trilho[] = [
    {
      id: '1',
      codigo: 'TR-001-2024',
      tipo: 'UIC60',
      material: 'Aço endurecido',
      comprimento: 25,
      peso: 60.3,
      fabricante: 'ArcelorMittal',
      dataFabricacao: '2024-01-15',
      dataInstalacao: '2024-03-20',
      kmInicial: 12.5,
      kmFinal: 12.525,
      estado: 'Bom',
      tensao: 850,
      geometria: {
        alinhamento: 2.1,
        nivel: 1.8,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-05-15',
      proximaInspecao: '2024-08-15'
    },
    {
      id: '2',
      codigo: 'TR-002-2024',
      tipo: 'UIC54',
      material: 'Aço especial',
      comprimento: 25,
      peso: 54.8,
      fabricante: 'Voestalpine',
      dataFabricacao: '2024-02-10',
      dataInstalacao: '2024-04-15',
      kmInicial: 12.525,
      kmFinal: 12.55,
      estado: 'Excelente',
      tensao: 820,
      geometria: {
        alinhamento: 1.5,
        nivel: 1.2,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-06-01',
      proximaInspecao: '2024-09-01'
    },
    {
      id: '3',
      codigo: 'TR-003-2024',
      tipo: 'S49',
      material: 'Aço',
      comprimento: 25,
      peso: 49.4,
      fabricante: 'Tata Steel',
      dataFabricacao: '2023-12-20',
      dataInstalacao: '2024-02-28',
      kmInicial: 12.55,
      kmFinal: 12.575,
      estado: 'Regular',
      tensao: 780,
      geometria: {
        alinhamento: 3.2,
        nivel: 2.8,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-04-20',
      proximaInspecao: '2024-07-20'
    }
  ];

  const travessasDemo: Travessa[] = [
    {
      id: '1',
      codigo: 'TV-001-2024',
      tipo: 'Betão',
      material: 'Betão armado pré-esforçado',
      comprimento: 2.6,
      largura: 0.25,
      altura: 0.22,
      peso: 320,
      fabricante: 'Cimpor',
      dataFabricacao: '2024-02-10',
      dataInstalacao: '2024-03-20',
      kmInicial: 12.5,
      kmFinal: 12.5026,
      estado: 'Excelente',
      inspecoes: [],
      ultimaInspecao: '2024-05-15',
      proximaInspecao: '2024-08-15'
    },
    {
      id: '2',
      codigo: 'TV-002-2024',
      tipo: 'Betão',
      material: 'Betão armado pré-esforçado',
      comprimento: 2.6,
      largura: 0.25,
      altura: 0.22,
      peso: 320,
      fabricante: 'Secil',
      dataFabricacao: '2024-01-20',
      dataInstalacao: '2024-03-25',
      kmInicial: 12.5026,
      kmFinal: 12.5052,
      estado: 'Bom',
      inspecoes: [],
      ultimaInspecao: '2024-05-20',
      proximaInspecao: '2024-08-20'
    },
    {
      id: '3',
      codigo: 'TV-003-2024',
      tipo: 'Madeira',
      material: 'Madeira de carvalho tratada',
      comprimento: 2.4,
      largura: 0.22,
      altura: 0.18,
      peso: 180,
      fabricante: 'Silvapor',
      dataFabricacao: '2023-11-15',
      dataInstalacao: '2024-01-10',
      kmInicial: 12.5052,
      kmFinal: 12.5076,
      estado: 'Mau',
      inspecoes: [],
      ultimaInspecao: '2024-03-15',
      proximaInspecao: '2024-06-15'
    }
  ];

  const inspecoesDemo: Inspecao[] = [
    {
      id: '1',
      data_inspecao: '2024-06-15',
      tipo: 'Geometria',
      inspector: 'João Silva',
      resultado: 'Conforme',
      observacoes: 'Alinhamento e nível dentro dos parâmetros aceitáveis',
      acoes_corretivas: 'Nenhuma ação necessária',
      proxima_inspecao: '2024-09-15',
      fotos: [],
      relatorio_url: '',
      trilho_id: '1',
      travessa_id: '',
      parametros_medidos: {
        alinhamento: 2.1,
        nivel: 1.8,
        bitola: 1435
      },
      created_at: '2024-06-15T10:00:00Z',
      updated_at: '2024-06-15T10:00:00Z'
    },
    {
      id: '2',
      data_inspecao: '2024-06-10',
      tipo: 'Ultrassom',
      inspector: 'Maria Santos',
      resultado: 'Não Conforme',
      observacoes: 'Detetada fissura superficial no trilho',
      acoes_corretivas: 'Marcar para substituição na próxima manutenção',
      proxima_inspecao: '2024-07-10',
      fotos: [],
      relatorio_url: '',
      trilho_id: '3',
      travessa_id: '',
      parametros_medidos: {
        espessura: 58.2,
        defeitos: ['fissura_superficial']
      },
      created_at: '2024-06-10T14:30:00Z',
      updated_at: '2024-06-10T14:30:00Z'
    },
    {
      id: '3',
      data_inspecao: '2024-06-05',
      tipo: 'Visual',
      inspector: 'Pedro Costa',
      resultado: 'Crítico',
      observacoes: 'Travessa com sinais de deterioração avançada',
      acoes_corretivas: 'Substituição imediata necessária',
      proxima_inspecao: '2024-06-20',
      fotos: [],
      relatorio_url: '',
      trilho_id: '',
      travessa_id: '3',
      parametros_medidos: {
        estado_geral: 'critico',
        defeitos: ['fissuras_multiplas', 'degradacao_superficial']
      },
      created_at: '2024-06-05T09:15:00Z',
      updated_at: '2024-06-05T09:15:00Z'
    }
  ];

  const statsDemo = {
    totalTrilhos: 1247,
    totalTravessas: 8923,
    inspecoesPendentes: 23,
    alertasCriticos: 5,
    conformidade: 94.2,
    kmCobertos: 156.8
  };

  const handleAddNew = (type: 'trilho' | 'travessa' | 'inspecao') => {
    setModalType(type);
    setEditData(null);
    setShowFormModal(true);
    toast.success(`🛤️ Abrindo formulário para novo ${type}...`, {
      icon: '🛤️',
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

  const handleEdit = (type: 'trilho' | 'travessa' | 'inspecao', data: any) => {
    setModalType(type);
    setEditData(data);
    setShowFormModal(true);
  };

  const handleView = (type: 'trilho' | 'travessa' | 'inspecao', data: any) => {
    setModalType(type);
    if (type === 'trilho') setSelectedTrilho(data);
    else if (type === 'travessa') setSelectedTravessa(data);
    else if (type === 'inspecao') setSelectedInspecao(data);
    setShowDetailsModal(true);
  };

  const handleDelete = async (type: 'trilho' | 'travessa' | 'inspecao', id: string) => {
    if (!confirm(`Tem certeza que deseja excluir este ${type}?`)) return;

    try {
      if (type === 'trilho') {
        await viaFerreaAPI.trilhos.delete(id);
        setTrilhos(trilhos.filter(t => t.id !== id));
      } else if (type === 'travessa') {
        await viaFerreaAPI.travessas.delete(id);
        setTravessas(travessas.filter(t => t.id !== id));
      } else if (type === 'inspecao') {
        await viaFerreaAPI.inspecoes.delete(id);
        setInspecoes(inspecoes.filter(i => i.id !== id));
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} excluído com sucesso!`);
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error);
      toast.error(`Erro ao excluir ${type}`);
    }
  };

  const handleFormSuccess = () => {
    loadData();
  };

  // Funções de filtro e paginação para Trilhos
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página quando filtros mudam
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

  // Funções de filtro e paginação para Travessas
  const handleTravessaFiltersChange = (newFilters: TravessaFilterState) => {
    setTravessaFilters(newFilters);
    setTravessaCurrentPage(1);
  };

  const handleTravessaClearFilters = () => {
    setTravessaFilters(getDefaultTravessaFilters());
    setTravessaCurrentPage(1);
  };

  const handleTravessaPageChange = (page: number) => {
    setTravessaCurrentPage(page);
  };

  const handleTravessaSort = (field: string) => {
    if (travessaSortBy === field) {
      setTravessaSortOrder(travessaSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTravessaSortBy(field);
      setTravessaSortOrder('asc');
    }
  };

  // Funções de filtro e paginação para Inspeções
  const handleInspecaoFiltersChange = (newFilters: InspecaoFilterState) => {
    setInspecaoFilters(newFilters);
    setInspecaoCurrentPage(1);
  };

  const handleInspecaoClearFilters = () => {
    setInspecaoFilters(getDefaultInspecaoFilters());
    setInspecaoCurrentPage(1);
  };

  const handleInspecaoPageChange = (page: number) => {
    setInspecaoCurrentPage(page);
  };

  const handleInspecaoSort = (field: string) => {
    if (inspecaoSortBy === field) {
      setInspecaoSortOrder(inspecaoSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setInspecaoSortBy(field);
      setInspecaoSortOrder('desc');
    }
  };

  // Aplicar filtros e ordenação aos dados
  const getFilteredAndSortedData = (data: any[]) => {
    let filteredData = applyFilters(data, filters);
    return sortData(filteredData, sortBy, sortOrder);
  };

  const getTravessaFilteredAndSortedData = (data: any[]) => {
    let filteredData = applyTravessaFilters(data, travessaFilters);
    return sortData(filteredData, travessaSortBy, travessaSortOrder);
  };

  const getInspecaoFilteredAndSortedData = (data: any[]) => {
    let filteredData = applyInspecaoFilters(data, inspecaoFilters);
    return sortData(filteredData, inspecaoSortBy, inspecaoSortOrder);
  };

  // Obter dados paginados
  const getPaginatedData = (data: any[]) => {
    const filteredData = getFilteredAndSortedData(data);
    return paginateData(filteredData, currentPage, itemsPerPage);
  };

  const getTravessaPaginatedData = (data: any[]) => {
    const filteredData = getTravessaFilteredAndSortedData(data);
    return paginateData(filteredData, travessaCurrentPage, itemsPerPage);
  };

  const getInspecaoPaginatedData = (data: any[]) => {
    const filteredData = getInspecaoFilteredAndSortedData(data);
    return paginateData(filteredData, inspecaoCurrentPage, itemsPerPage);
  };

  // Usar dados reais se disponíveis, senão usar dados demo
  const trilhosData = trilhos.length > 0 ? trilhos : trilhosDemo;
  const travessasData = travessas.length > 0 ? travessas : travessasDemo;
  const inspecoesData = inspecoes.length > 0 ? inspecoes : inspecoesDemo;
  const statsData = stats || statsDemo;

  // Calcular estatísticas dos filtros
  const activeFiltersCount = getActiveFiltersCount(filters);
  const activeTravessaFiltersCount = getActiveFiltersCount(travessaFilters);
  const activeInspecaoFiltersCount = getActiveFiltersCount(inspecaoFilters);
  
  const filteredTrilhos = getFilteredAndSortedData(trilhosData);
  const filteredTravessas = getTravessaFilteredAndSortedData(travessasData);
  const filteredInspecoes = getInspecaoFilteredAndSortedData(inspecoesData);
  
  const paginatedTrilhos = getPaginatedData(trilhosData);
  const paginatedTravessas = getTravessaPaginatedData(travessasData);
  const paginatedInspecoes = getInspecaoPaginatedData(inspecoesData);
  
  const totalPagesTrilhos = getTotalPages(filteredTrilhos.length, itemsPerPage);
  const totalPagesTravessas = getTotalPages(filteredTravessas.length, itemsPerPage);
  const totalPagesInspecoes = getTotalPages(filteredInspecoes.length, itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Carregando dados da Via Férrea...</h2>
          <p className="text-gray-500">Conectando ao Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Train className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Via Férrea
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <span>🛤️</span>
                <span>Gestão de Trilhos e Travessas - NP EN 13674 / NP EN 13481</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAddNew('trilho')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Trilho</span>
            </button>
            <button
              onClick={() => handleAddNew('travessa')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Nova Travessa</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trilhos</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.totalTrilhos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Travessas</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.totalTravessas}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inspeções Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{statsData.inspecoesPendentes}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas Críticos</p>
              <p className="text-2xl font-bold text-red-600">{statsData.alertasCriticos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conformidade</p>
                             <p className="text-2xl font-bold text-green-600">{statsData.conformidade}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KM Cobertos</p>
                             <p className="text-2xl font-bold text-gray-900">{statsData.kmCobertos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'trilhos', label: 'Trilhos', icon: TrendingUp },
            { id: 'travessas', label: 'Travessas', icon: Database },
            { id: 'inspecoes', label: 'Inspeções', icon: Shield },
            { id: 'normativas', label: 'Normativas', icon: FileText },
            { id: 'configuracoes', label: 'Configurações', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeTab === 'dashboard' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Via Férrea</h2>
            
            {/* Resumo Executivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🛤️</span>
                  Trilhos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold">{trilhos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Excelente:</span>
                    <span className="text-green-600 font-semibold">{trilhos.filter(t => t.estado === 'Excelente').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crítico:</span>
                    <span className="text-red-600 font-semibold">{trilhos.filter(t => t.estado === 'Crítico').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🏗️</span>
                  Travessas
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold">{travessas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Excelente:</span>
                    <span className="text-green-600 font-semibold">{travessas.filter(t => t.estado === 'Excelente').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crítico:</span>
                    <span className="text-red-600 font-semibold">{travessas.filter(t => t.estado === 'Crítico').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Conformidade
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Geral:</span>
                                         <span className="font-semibold text-green-600">{statsData.conformidade}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inspeções:</span>
                    <span className="font-semibold text-yellow-600">{statsData.inspecoesPendentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alertas:</span>
                                         <span className="font-semibold text-red-600">{statsData.alertasCriticos}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos e Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado dos Trilhos</h3>
                <div className="space-y-3">
                  {['Excelente', 'Bom', 'Regular', 'Mau', 'Crítico'].map((estado) => {
                    const count = trilhos.filter(t => t.estado === estado).length;
                    const percentage = trilhos.length > 0 ? (count / trilhos.length) * 100 : 0;
                    const color = estado === 'Excelente' ? 'bg-green-500' : 
                                 estado === 'Bom' ? 'bg-blue-500' : 
                                 estado === 'Regular' ? 'bg-yellow-500' : 
                                 estado === 'Mau' ? 'bg-orange-500' : 'bg-red-500';
                    
                    return (
                      <div key={estado} className="flex items-center space-x-3">
                        <div className="w-20 text-sm font-medium text-gray-700">{estado}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-900">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado das Travessas</h3>
                <div className="space-y-3">
                  {['Excelente', 'Bom', 'Regular', 'Mau', 'Crítico'].map((estado) => {
                    const count = travessas.filter(t => t.estado === estado).length;
                    const percentage = travessas.length > 0 ? (count / travessas.length) * 100 : 0;
                    const color = estado === 'Excelente' ? 'bg-green-500' : 
                                 estado === 'Bom' ? 'bg-blue-500' : 
                                 estado === 'Regular' ? 'bg-yellow-500' : 
                                 estado === 'Mau' ? 'bg-orange-500' : 'bg-red-500';
                    
                    return (
                      <div key={estado} className="flex items-center space-x-3">
                        <div className="w-20 text-sm font-medium text-gray-700">{estado}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-900">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Próximas Inspeções */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Inspeções</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Código</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Tipo</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">KM</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Próxima Inspeção</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...trilhos, ...travessas]
                                             .sort((a, b) => new Date(a.proxima_inspecao || a.proximaInspecao).getTime() - new Date(b.proxima_inspecao || b.proximaInspecao).getTime())
                      .slice(0, 5)
                      .map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 px-4">
                            <span className="font-medium text-gray-900">{item.codigo}</span>
                          </td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {('tensao' in item) ? 'Trilho' : 'Travessa'}
                            </span>
                          </td>
                                                     <td className="py-2 px-4 text-gray-600">{(item.km_inicial || item.kmInicial)} - {(item.km_final || item.kmFinal)}</td>
                           <td className="py-2 px-4 text-gray-600">{item.proxima_inspecao || item.proximaInspecao}</td>
                          <td className="py-2 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                              item.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                              item.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                              item.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trilhos' && (
          <div className="space-y-6">
            {/* Filtros */}
            <ViaFerreaFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              type="trilhos"
            />

            {/* Tabela de Trilhos */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestão de Trilhos</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredTrilhos.length} trilho{filteredTrilhos.length !== 1 ? 's' : ''} encontrado{filteredTrilhos.length !== 1 ? 's' : ''}
                    {activeFiltersCount > 0 && ` (${trilhosData.length} total)`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAddNew('trilho')}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Novo Trilho</span>
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
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Material</th>
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
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrilhos.map((trilho) => (
                      <tr key={trilho.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">{trilho.codigo}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {trilho.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{trilho.material}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            trilho.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                            trilho.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                            trilho.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                            trilho.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {trilho.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{trilho.km_inicial} - {trilho.km_final}</td>
                        <td className="py-4 px-6 text-gray-600">{trilho.proxima_inspecao}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleView('trilho', trilho)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit('trilho', trilho)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('trilho', trilho.id)}
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
              {totalPagesTrilhos > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesTrilhos}
                    onPageChange={handlePageChange}
                    totalItems={filteredTrilhos.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'travessas' && (
          <div className="space-y-6">
            {/* Filtros */}
            <ViaFerreaFilters
              filters={travessaFilters}
              onFiltersChange={handleTravessaFiltersChange}
              onClearFilters={handleTravessaClearFilters}
              activeFiltersCount={activeTravessaFiltersCount}
              type="travessas"
            />

            {/* Tabela de Travessas */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestão de Travessas</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredTravessas.length} travessa{filteredTravessas.length !== 1 ? 's' : ''} encontrada{filteredTravessas.length !== 1 ? 's' : ''}
                    {activeTravessaFiltersCount > 0 && ` (${travessasData.length} total)`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAddNew('travessa')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nova Travessa</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTravessaSort('codigo')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Código</span>
                          {travessaSortBy === 'codigo' && (
                            <span className="text-blue-500">
                              {travessaSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTravessaSort('tipo')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Tipo</span>
                          {travessaSortBy === 'tipo' && (
                            <span className="text-blue-500">
                              {travessaSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTravessaSort('material')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Material</span>
                          {travessaSortBy === 'material' && (
                            <span className="text-blue-500">
                              {travessaSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTravessaSort('estado')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Estado</span>
                          {travessaSortBy === 'estado' && (
                            <span className="text-blue-500">
                              {travessaSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTravessaSort('km_inicial')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>KM</span>
                          {travessaSortBy === 'km_inicial' && (
                            <span className="text-blue-500">
                              {travessaSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTravessas.map((travessa) => (
                      <tr key={travessa.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">{travessa.codigo}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {travessa.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{travessa.material}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            travessa.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                            travessa.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                            travessa.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                            travessa.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {travessa.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{travessa.km_inicial} - {travessa.km_final}</td>
                        <td className="py-4 px-6 text-gray-600">{travessa.proxima_inspecao}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleView('travessa', travessa)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit('travessa', travessa)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('travessa', travessa.id)}
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
              {totalPagesTravessas > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={travessaCurrentPage}
                    totalPages={totalPagesTravessas}
                    onPageChange={handleTravessaPageChange}
                    totalItems={filteredTravessas.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inspecoes' && (
          <div className="space-y-6">
            {/* Filtros */}
            <ViaFerreaFilters
              filters={inspecaoFilters}
              onFiltersChange={handleInspecaoFiltersChange}
              onClearFilters={handleInspecaoClearFilters}
              activeFiltersCount={activeInspecaoFiltersCount}
              type="inspecoes"
            />

            {/* Tabela de Inspeções */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestão de Inspeções</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredInspecoes.length} inspeção{filteredInspecoes.length !== 1 ? 'ões' : ''} encontrada{filteredInspecoes.length !== 1 ? 's' : ''}
                    {activeInspecaoFiltersCount > 0 && ` (${inspecoesData.length} total)`}
                  </p>
                </div>
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

              {/* Estatísticas de Inspeções */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Inspeções</p>
                      <p className="text-2xl font-bold text-gray-900">{inspecoesData.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conformes</p>
                      <p className="text-2xl font-bold text-green-600">
                        {inspecoesData.filter(i => i.resultado === 'Conforme').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Não Conformes</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {inspecoesData.filter(i => i.resultado === 'Não Conforme').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Críticos</p>
                      <p className="text-2xl font-bold text-red-600">
                        {inspecoesData.filter(i => i.resultado === 'Crítico').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Inspeções */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleInspecaoSort('data_inspecao')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Data</span>
                          {inspecaoSortBy === 'data_inspecao' && (
                            <span className="text-blue-500">
                              {inspecaoSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleInspecaoSort('tipo')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Tipo</span>
                          {inspecaoSortBy === 'tipo' && (
                            <span className="text-blue-500">
                              {inspecaoSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleInspecaoSort('inspector')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Inspector</span>
                          {inspecaoSortBy === 'inspector' && (
                            <span className="text-blue-500">
                              {inspecaoSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-4 px-6 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleInspecaoSort('resultado')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Resultado</span>
                          {inspecaoSortBy === 'resultado' && (
                            <span className="text-blue-500">
                              {inspecaoSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Elemento</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInspecoes.map((inspecao) => (
                      <tr key={inspecao.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-gray-600">{inspecao.data_inspecao}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            inspecao.tipo === 'Geometria' ? 'bg-blue-100 text-blue-800' :
                            inspecao.tipo === 'Visual' ? 'bg-green-100 text-green-800' :
                            inspecao.tipo === 'Ultrassom' ? 'bg-purple-100 text-purple-800' :
                            inspecao.tipo === 'Magnetoscopia' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
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
                          {inspecao.trilho_id ? `TR-${inspecao.trilho_id}` : inspecao.travessa_id ? `TV-${inspecao.travessa_id}` : 'N/A'}
                        </td>
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

              {/* Paginação */}
              {totalPagesInspecoes > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={inspecaoCurrentPage}
                    totalPages={totalPagesInspecoes}
                    onPageChange={handleInspecaoPageChange}
                    totalItems={filteredInspecoes.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'normativas' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Normativas Aplicáveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13674</h3>
                <p className="text-gray-600 mb-4">Trilhos ferroviários - Trilhos Vignole de 46 kg/m e superiores</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Especificações técnicas</li>
                  <li>• Ensaios de qualidade</li>
                  <li>• Marcagem e identificação</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13481</h3>
                <p className="text-gray-600 mb-4">Travessas ferroviárias - Travessas de betão armado pré-esforçado</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Especificações de fabrico</li>
                  <li>• Ensaios de resistência</li>
                  <li>• Controlo de qualidade</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13848</h3>
                <p className="text-gray-600 mb-4">Geometria da via - Parâmetros de qualidade</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tolerâncias de alinhamento</li>
                  <li>• Tolerâncias de nível</li>
                  <li>• Tolerâncias de bitola</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulamento Nacional</h3>
                <p className="text-gray-600 mb-4">Regulamento da Infraestrutura Ferroviária Nacional</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Requisitos de segurança</li>
                  <li>• Procedimentos de manutenção</li>
                  <li>• Inspeções obrigatórias</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'configuracoes' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações Via Férrea</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configurações de Inspeção */}
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔍</span>
                    Configurações de Inspeção
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Inspeção (dias)
                      </label>
                      <input
                        type="number"
                        defaultValue="90"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tolerância de Alinhamento (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="2.5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tolerância de Nível (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="2.0"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bitola Padrão (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="1435"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações de Notificações */}
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔔</span>
                    Notificações
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertas de Inspeção</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertas de Estado Crítico</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Relatórios Automáticos</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configurações de Relatórios */}
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Configurações de Relatórios
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Relatório
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="word">Word</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Relatórios
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="semestral">Semestral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinatários (emails)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="email1@exemplo.com, email2@exemplo.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações de Backup */}
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💾</span>
                    Backup e Sincronização
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Backup Automático</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Backup
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sincronização em Tempo Real</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200">
                Cancelar
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
                 )}

         {/* Modais de Formulário */}
         {showFormModal && (
           <>
             {modalType === 'trilho' && (
               <TrilhoForm
                 isOpen={showFormModal}
                 onClose={() => setShowFormModal(false)}
                 type="trilho"
                 editData={editData}
                 onSuccess={handleFormSuccess}
               />
             )}
             {modalType === 'travessa' && (
               <TravessaForm
                 isOpen={showFormModal}
                 onClose={() => setShowFormModal(false)}
                 type="travessa"
                 editData={editData}
                 onSuccess={handleFormSuccess}
               />
             )}
             {modalType === 'inspecao' && (
               <InspecaoForm
                 isOpen={showFormModal}
                 onClose={() => setShowFormModal(false)}
                 type="inspecao"
                 editData={editData}
                 onSuccess={handleFormSuccess}
               />
             )}
           </>
         )}

         {/* Modais de Detalhes */}
         {showDetailsModal && (
           <>
             {modalType === 'trilho' && selectedTrilho && (
               <TrilhoDetails
                 isOpen={showDetailsModal}
                 onClose={() => setShowDetailsModal(false)}
                 data={selectedTrilho}
                 type="trilho"
               />
             )}
             {modalType === 'travessa' && selectedTravessa && (
               <TravessaDetails
                 isOpen={showDetailsModal}
                 onClose={() => setShowDetailsModal(false)}
                 data={selectedTravessa}
                 type="travessa"
               />
             )}
             {modalType === 'inspecao' && selectedInspecao && (
               <InspecaoDetails
                 isOpen={showDetailsModal}
                 onClose={() => setShowDetailsModal(false)}
                 data={selectedInspecao}
                 type="inspecao"
               />
             )}
           </>
         )}
       </motion.div>
     </div>
   );
 }
