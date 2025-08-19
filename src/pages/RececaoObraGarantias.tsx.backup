import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  FileText,
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Edit,
  Trash2,
  Settings,
  Users,
  Award,
  Zap,
  Wrench,
  FileCheck,
  ClipboardList,
  MapPin,
  Star,
  Bell,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  RececaoObra, 
  Garantia, 
  Defeito, 
  ManutencaoPreventiva, 
  Seguro, 
  Sinistro, 
  PunchList,
  EstatisticasRececao,
  FiltrosRececao
} from '../types/rececaoObra';

// Importar formulários
import RececaoObraForm from '../components/forms/RececaoObraForm';
import GarantiaForm from '../components/forms/GarantiaForm';
import DefeitoForm from '../components/forms/DefeitoForm';
import ManutencaoForm from '../components/forms/ManutencaoForm';
import SeguroForm from '../components/forms/SeguroForm';
import SinistroForm from '../components/forms/SinistroForm';
import PunchListForm from '../components/forms/PunchListForm';
import { rececaoObraAPI } from '../lib/supabase-api/rececaoObraAPI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

export default function RececaoObraGarantias() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rececoes' | 'garantias' | 'defeitos' | 'manutencoes' | 'seguros' | 'sinistros' | 'punchlist'>('dashboard');
  const [rececoes, setRececoes] = useState<RececaoObra[]>([]);
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [defeitos, setDefeitos] = useState<Defeito[]>([]);
  const [manutencoes, setManutencoes] = useState<ManutencaoPreventiva[]>([]);
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [punchLists, setPunchLists] = useState<PunchList[]>([]);
  const [stats, setStats] = useState<EstatisticasRececao | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosRececao>({});
  const [filteredRececoes, setFilteredRececoes] = useState<RececaoObra[]>([]);
  const [filteredGarantias, setFilteredGarantias] = useState<Garantia[]>([]);
  const [filteredDefeitos, setFilteredDefeitos] = useState<Defeito[]>([]);
  const [filteredManutencoes, setFilteredManutencoes] = useState<ManutencaoPreventiva[]>([]);
  const [filteredSeguros, setFilteredSeguros] = useState<Seguro[]>([]);
  const [filteredSinistros, setFilteredSinistros] = useState<Sinistro[]>([]);
  const [filteredPunchLists, setFilteredPunchLists] = useState<PunchList[]>([]);
  
  // Estados para modais e ações
  const [showRececaoModal, setShowRececaoModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [showDefeitoModal, setShowDefeitoModal] = useState(false);
  const [showManutencaoModal, setShowManutencaoModal] = useState(false);
  const [showSeguroModal, setShowSeguroModal] = useState(false);
  const [showSinistroModal, setShowSinistroModal] = useState(false);
  const [showPunchListModal, setShowPunchListModal] = useState(false);
  
  // Estados para itens selecionados
  const [selectedRececao, setSelectedRececao] = useState<RececaoObra | null>(null);
  const [selectedGarantia, setSelectedGarantia] = useState<Garantia | null>(null);
  const [selectedDefeito, setSelectedDefeito] = useState<Defeito | null>(null);
  const [selectedManutencao, setSelectedManutencao] = useState<ManutencaoPreventiva | null>(null);
  const [selectedSeguro, setSelectedSeguro] = useState<Seguro | null>(null);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);
  const [selectedPunchList, setSelectedPunchList] = useState<PunchList | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [rececoes, garantias, defeitos, manutencoes, seguros, sinistros, punchLists, searchTerm, filtros]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        rececoesData,
        garantiasData,
        defeitosData,
        manutencoesData,
        segurosData,
        sinistrosData,
        punchListsData,
        statsData
      ] = await Promise.all([
        rececaoObraAPI.getRececoes(),
        rececaoObraAPI.getGarantias(),
        rececaoObraAPI.getDefeitos(),
        rececaoObraAPI.getManutencoes(),
        rececaoObraAPI.getSeguros(),
        rececaoObraAPI.getSinistros(),
        rececaoObraAPI.getPunchLists(),
        rececaoObraAPI.getEstatisticas()
      ]);

      setRececoes(rececoesData);
      setGarantias(garantiasData);
      setDefeitos(defeitosData);
      setManutencoes(manutencoesData);
      setSeguros(segurosData);
      setSinistros(sinistrosData);
      setPunchLists(punchListsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    // Filtrar receções
    let rececoesFiltradas = rececoes.filter(rececao => {
      const matchSearch = !searchTerm || 
        rececao.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rececao.responsavel_rececao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = !filtros.status || rececao.status === filtros.status;
      const matchTipo = !filtros.tipoRececao || rececao.tipo_rececao === filtros.tipoRececao;
      const matchResponsavel = !filtros.responsavel || 
        rececao.responsavel_rececao.toLowerCase().includes(filtros.responsavel.toLowerCase());
      
      return matchSearch && matchStatus && matchTipo && matchResponsavel;
    });
    setFilteredRececoes(rececoesFiltradas);

    // Filtrar garantias
    let garantiasFiltradas = garantias.filter(garantia => {
      const matchSearch = !searchTerm || 
        garantia.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.seguradora.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSeguradora = !filtros.seguradora || 
        garantia.seguradora.toLowerCase().includes(filtros.seguradora.toLowerCase());
      
      return matchSearch && matchSeguradora;
    });
    setFilteredGarantias(garantiasFiltradas);

    // Filtrar defeitos
    let defeitosFiltrados = defeitos.filter(defeito => {
      const matchSearch = !searchTerm || 
        defeito.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        defeito.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSeveridade = !filtros.severidade || defeito.severidade === filtros.severidade;
      
      return matchSearch && matchSeveridade;
    });
    setFilteredDefeitos(defeitosFiltrados);

    // Filtrar manutenções
    let manutencoesFiltradas = manutencoes.filter(manutencao => {
      const matchSearch = !searchTerm || 
        manutencao.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchSearch;
    });
    setFilteredManutencoes(manutencoesFiltradas);

    // Filtrar seguros
    let segurosFiltrados = seguros.filter(seguro => {
      const matchSearch = !searchTerm || 
        seguro.seguradora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seguro.apolice.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchSeguradora = !filtros.seguradora || 
        seguro.seguradora.toLowerCase().includes(filtros.seguradora.toLowerCase());
      
      return matchSearch && matchSeguradora;
    });
    setFilteredSeguros(segurosFiltrados);

    // Filtrar sinistros
    let sinistrosFiltrados = sinistros.filter(sinistro => {
      const matchSearch = !searchTerm || 
        sinistro.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchSearch;
    });
    setFilteredSinistros(sinistrosFiltrados);

    // Filtrar punch lists
    let punchListsFiltradas = punchLists.filter(punchList => {
      const matchSearch = !searchTerm || 
        punchList.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        punchList.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategoria = !filtros.categoria || punchList.categoria === filtros.categoria;
      
      return matchSearch && matchCategoria;
    });
    setFilteredPunchLists(punchListsFiltradas);
  };

  const limparFiltros = () => {
    setFiltros({});
    setSearchTerm('');
  };

  const handleFiltroChange = (campo: keyof FiltrosRececao, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'em_curso': return 'bg-blue-100 text-blue-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'com_reservas': return 'bg-orange-100 text-orange-800';
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'expirada': return 'bg-red-100 text-red-800';
      case 'cancelada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#ff6b6b'];

  // Funções para gerenciar ações
  const handleView = (item: any, type: string) => {
    switch (type) {
      case 'rececao':
        setSelectedRececao(item);
        setShowRececaoModal(true);
        break;
      case 'garantia':
        setSelectedGarantia(item);
        setShowGarantiaModal(true);
        break;
      case 'defeito':
        setSelectedDefeito(item);
        setShowDefeitoModal(true);
        break;
      case 'manutencao':
        setSelectedManutencao(item);
        setShowManutencaoModal(true);
        break;
      case 'seguro':
        setSelectedSeguro(item);
        setShowSeguroModal(true);
        break;
      case 'sinistro':
        setSelectedSinistro(item);
        setShowSinistroModal(true);
        break;
      case 'punchlist':
        setSelectedPunchList(item);
        setShowPunchListModal(true);
        break;
    }
  };

  const handleEdit = (item: any, type: string) => {
    switch (type) {
      case 'rececao':
        setSelectedRececao(item);
        setShowRececaoModal(true);
        break;
      case 'garantia':
        setSelectedGarantia(item);
        setShowGarantiaModal(true);
        break;
      case 'defeito':
        setSelectedDefeito(item);
        setShowDefeitoModal(true);
        break;
      case 'manutencao':
        setSelectedManutencao(item);
        setShowManutencaoModal(true);
        break;
      case 'seguro':
        setSelectedSeguro(item);
        setShowSeguroModal(true);
        break;
      case 'sinistro':
        setSelectedSinistro(item);
        setShowSinistroModal(true);
        break;
      case 'punchlist':
        setSelectedPunchList(item);
        setShowPunchListModal(true);
        break;
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        switch (type) {
          case 'rececao':
            await rececaoObraAPI.deleteRececao(id);
            toast.success('Receção excluída com sucesso');
            break;
          case 'garantia':
            await rececaoObraAPI.deleteGarantia(id);
            toast.success('Garantia excluída com sucesso');
            break;
          case 'defeito':
            await rececaoObraAPI.deleteDefeito(id);
            toast.success('Defeito excluído com sucesso');
            break;
          case 'manutencao':
            await rececaoObraAPI.deleteManutencao(id);
            toast.success('Manutenção excluída com sucesso');
            break;
          case 'seguro':
            await rececaoObraAPI.deleteSeguro(id);
            toast.success('Seguro excluído com sucesso');
            break;
          case 'sinistro':
            await rececaoObraAPI.deleteSinistro(id);
            toast.success('Sinistro excluído com sucesso');
            break;
          case 'punchlist':
            await rececaoObraAPI.deletePunchList(id);
            toast.success('Item da Punch List excluído com sucesso');
            break;
        }
        loadData(); // Recarregar dados
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir item');
      }
    }
  };

  const handleNew = (type: string) => {
    switch (type) {
      case 'rececao':
        setSelectedRececao(null);
        setShowRececaoModal(true);
        break;
      case 'garantia':
        setSelectedGarantia(null);
        setShowGarantiaModal(true);
        break;
      case 'defeito':
        setSelectedDefeito(null);
        setShowDefeitoModal(true);
        break;
      case 'manutencao':
        setSelectedManutencao(null);
        setShowManutencaoModal(true);
        break;
      case 'seguro':
        setSelectedSeguro(null);
        setShowSeguroModal(true);
        break;
      case 'sinistro':
        setSelectedSinistro(null);
        setShowSinistroModal(true);
        break;
      case 'punchlist':
        setSelectedPunchList(null);
        setShowPunchListModal(true);
        break;
    }
  };

  // Funções para salvar dados dos formulários
  const handleSaveRececao = async (data: Partial<RececaoObra>) => {
    try {
      if (selectedRececao) {
        await rececaoObraAPI.updateRececao(selectedRececao.id, data);
        toast.success('Receção atualizada com sucesso!');
      } else {
        await rececaoObraAPI.createRececao(data);
        toast.success('Receção criada com sucesso!');
      }
      setShowRececaoModal(false);
      setSelectedRececao(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar receção:', error);
      toast.error('Erro ao salvar receção');
    }
  };

  const handleSaveGarantia = async (data: Partial<Garantia>) => {
    try {
      if (selectedGarantia) {
        await rececaoObraAPI.updateGarantia(selectedGarantia.id, data);
        toast.success('Garantia atualizada com sucesso!');
      } else {
        await rececaoObraAPI.createGarantia(data);
        toast.success('Garantia criada com sucesso!');
      }
      setShowGarantiaModal(false);
      setSelectedGarantia(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar garantia:', error);
      toast.error('Erro ao salvar garantia');
    }
  };

  const handleSaveDefeito = async (data: Partial<Defeito>) => {
    try {
      if (selectedDefeito) {
        await rececaoObraAPI.updateDefeito(selectedDefeito.id, data);
        toast.success('Defeito atualizado com sucesso!');
      } else {
        await rececaoObraAPI.createDefeito(data);
        toast.success('Defeito criado com sucesso!');
      }
      setShowDefeitoModal(false);
      setSelectedDefeito(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar defeito:', error);
      toast.error('Erro ao salvar defeito');
    }
  };

  const handleSaveManutencao = async (data: Partial<ManutencaoPreventiva>) => {
    try {
      if (selectedManutencao) {
        await rececaoObraAPI.updateManutencao(selectedManutencao.id, data);
        toast.success('Manutenção atualizada com sucesso!');
      } else {
        await rececaoObraAPI.createManutencao(data);
        toast.success('Manutenção criada com sucesso!');
      }
      setShowManutencaoModal(false);
      setSelectedManutencao(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      toast.error('Erro ao salvar manutenção');
    }
  };

  const handleSaveSeguro = async (data: Partial<Seguro>) => {
    try {
      if (selectedSeguro) {
        await rececaoObraAPI.updateSeguro(selectedSeguro.id, data);
        toast.success('Seguro atualizado com sucesso!');
      } else {
        await rececaoObraAPI.createSeguro(data);
        toast.success('Seguro criado com sucesso!');
      }
      setShowSeguroModal(false);
      setSelectedSeguro(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar seguro:', error);
      toast.error('Erro ao salvar seguro');
    }
  };

  const handleSaveSinistro = async (data: Partial<Sinistro>) => {
    try {
      if (selectedSinistro) {
        await rececaoObraAPI.updateSinistro(selectedSinistro.id, data);
        toast.success('Sinistro atualizado com sucesso!');
      } else {
        await rececaoObraAPI.createSinistro(data);
        toast.success('Sinistro criado com sucesso!');
      }
      setShowSinistroModal(false);
      setSelectedSinistro(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar sinistro:', error);
      toast.error('Erro ao salvar sinistro');
    }
  };

  const handleSavePunchList = async (data: Partial<PunchList>) => {
    try {
      if (selectedPunchList) {
        await rececaoObraAPI.updatePunchList(selectedPunchList.id, data);
        toast.success('Punch List atualizada com sucesso!');
      } else {
        await rececaoObraAPI.createPunchList(data);
        toast.success('Punch List criada com sucesso!');
      }
      setShowPunchListModal(false);
      setSelectedPunchList(null);
      loadData();
    } catch (error) {
      console.error('Erro ao salvar punch list:', error);
      toast.error('Erro ao salvar punch list');
    }
  };

  // Componente de botões de ação reutilizável
  const ActionButtons = ({ item, type }: { item: any; type: string }) => (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => handleView(item, type)}
        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
        title="Ver detalhes"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button 
        onClick={() => handleEdit(item, type)}
        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
        title="Editar"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button 
        onClick={() => handleDelete(item.id, type)}
        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
        title="Excluir"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Carregando Receção de Obra e Garantias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Receção de Obra e Garantias</h1>
                <p className="text-gray-600 mt-1">
                  Gestão completa de receção, garantias, defeitos e manutenções
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </button>
              <button
                onClick={loadData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'rececoes', label: 'Receções', icon: FileCheck },
              { id: 'garantias', label: 'Garantias', icon: Shield },
              { id: 'defeitos', label: 'Defeitos', icon: AlertTriangle },
              { id: 'manutencoes', label: 'Manutenções', icon: Wrench },
              { id: 'seguros', label: 'Seguros', icon: Award },
              { id: 'sinistros', label: 'Sinistros', icon: Bell },
              { id: 'punchlist', label: 'Punch List', icon: ClipboardList }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Receções</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_rececoes || 0}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Garantias Ativas</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.garantias_ativas || 0}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Defeitos Abertos</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.defeitos_abertos || 0}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Garantias</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats?.valor_total_garantias || 0)}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receções por Status */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Receções por Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={stats?.por_status || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, quantidade }) => `${status}: ${quantidade}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                      nameKey="status"
                    >
                      {(stats?.por_status || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Garantias por Tipo */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Garantias por Tipo
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.por_tipo_garantia || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Atividade Recente
              </h3>
              <div className="space-y-4">
                {rececoes.slice(0, 5).map((rececao) => (
                  <div key={rececao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{rececao.codigo}</p>
                        <p className="text-sm text-gray-600">Receção de obra</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rececao.status)}`}>
                        {rececao.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(rececao.data_rececao).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rececoes' && (
          <motion.div
            key="rececoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="pendente">Pendente</option>
                      <option value="em_curso">Em Curso</option>
                      <option value="concluida">Concluída</option>
                      <option value="com_reservas">Com Reservas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Receção</label>
                    <select
                      value={filtros.tipoRececao || ''}
                      onChange={(e) => handleFiltroChange('tipoRececao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="provisoria">Provisória</option>
                      <option value="definitiva">Definitiva</option>
                      <option value="parcial">Parcial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                    <input
                      type="text"
                      value={filtros.responsavel || ''}
                      onChange={(e) => handleFiltroChange('responsavel', e.target.value)}
                      placeholder="Nome do responsável"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Receções Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Receções de Obra</h2>
                  <button 
                    onClick={() => handleNew('rececao')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Receção</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Receção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
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
                    {filteredRececoes.map((rececao) => (
                      <tr key={rececao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rececao.codigo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(rececao.data_rececao).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rececao.tipo_rececao.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rececao.status)}`}>
                            {rececao.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rececao.responsavel_rececao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={rececao} type="rececao" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'garantias' && (
          <motion.div
            key="garantias"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Garantias */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seguradora</label>
                    <input
                      type="text"
                      value={filtros.seguradora || ''}
                      onChange={(e) => handleFiltroChange('seguradora', e.target.value)}
                      placeholder="Nome da seguradora"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="ativa">Ativa</option>
                      <option value="expirada">Expirada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Garantias Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Garantias</h2>
                  <button 
                    onClick={() => handleNew('garantia')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Garantia</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seguradora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Fim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGarantias.map((garantia) => (
                      <tr key={garantia.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {garantia.tipo_garantia.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {garantia.seguradora}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(garantia.valor_garantia)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(garantia.data_fim).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(garantia.status)}`}>
                            {garantia.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={garantia} type="garantia" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'defeitos' && (
          <motion.div
            key="defeitos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Defeitos */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severidade</label>
                    <select
                      value={filtros.severidade || ''}
                      onChange={(e) => handleFiltroChange('severidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todas</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="reportado">Reportado</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="em_correcao">Em Correção</option>
                      <option value="corrigido">Corrigido</option>
                      <option value="verificado">Verificado</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Defeitos Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Defeitos</h2>
                  <button 
                    onClick={() => handleNew('defeito')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Reportar Defeito</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Custo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDefeitos.map((defeito) => (
                      <tr key={defeito.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {defeito.titulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {defeito.localizacao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(defeito.severidade)}`}>
                            {defeito.severidade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(defeito.status)}`}>
                            {defeito.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(defeito.custo_correcao)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={defeito} type="defeito" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'punchlist' && (
          <motion.div
            key="punchlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Punch List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={filtros.categoria || ''}
                      onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todas</option>
                      <option value="acabamentos">Acabamentos</option>
                      <option value="instalacoes">Instalações</option>
                      <option value="estrutura">Estrutura</option>
                      <option value="equipamentos">Equipamentos</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="pendente">Pendente</option>
                      <option value="em_curso">Em Curso</option>
                      <option value="concluida">Concluída</option>
                      <option value="verificada">Verificada</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Punch List Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Punch List</h2>
                  <button 
                    onClick={() => handleNew('punchlist')}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Novo Item</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Limite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPunchLists.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.titulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.prioridade)}`}>
                            {item.prioridade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.responsavel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.data_limite).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={item} type="punchlist" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'manutencoes' && (
          <motion.div
            key="manutencoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Manutenções */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={filtros.tipoRececao || ''}
                      onChange={(e) => handleFiltroChange('tipoRececao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="preventiva">Preventiva</option>
                      <option value="corretiva">Corretiva</option>
                      <option value="preditiva">Preditiva</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="agendada">Agendada</option>
                      <option value="em_curso">Em Curso</option>
                      <option value="concluida">Concluída</option>
                      <option value="atrasada">Atrasada</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Manutenções Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Manutenções Preventivas</h2>
                  <button 
                    onClick={() => handleNew('manutencao')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nova Manutenção</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequência
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Próxima Manutenção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsável
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredManutencoes.map((manutencao) => (
                      <tr key={manutencao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {manutencao.titulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {manutencao.tipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {manutencao.frequencia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(manutencao.proxima_manutencao).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {manutencao.responsavel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(manutencao.status)}`}>
                            {manutencao.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={manutencao} type="manutencao" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'seguros' && (
          <motion.div
            key="seguros"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Seguros */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seguradora</label>
                    <input
                      type="text"
                      value={filtros.seguradora || ''}
                      onChange={(e) => handleFiltroChange('seguradora', e.target.value)}
                      placeholder="Nome da seguradora"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="ativa">Ativa</option>
                      <option value="expirada">Expirada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Seguros Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Seguros</h2>
                  <button 
                    onClick={() => handleNew('seguro')}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Novo Seguro</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seguradora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Apólice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Segurado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Fim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSeguros.map((seguro) => (
                      <tr key={seguro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {seguro.tipo_seguro}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {seguro.seguradora}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {seguro.apolice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(seguro.valor_segurado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(seguro.data_fim).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(seguro.status)}`}>
                            {seguro.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={seguro} type="seguro" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sinistros' && (
          <motion.div
            key="sinistros"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros para Sinistros */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => handleFiltroChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="reportado">Reportado</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="pago">Pago</option>
                      <option value="rejeitado">Rejeitado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={filtros.dataInicio || ''}
                      onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={limparFiltros}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sinistros Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Sinistros</h2>
                  <button 
                    onClick={() => handleNew('sinistro')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Reportar Sinistro</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Ocorrência
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Sinistro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Indemnização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSinistros.map((sinistro) => (
                      <tr key={sinistro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sinistro.titulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(sinistro.data_ocorrencia).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(sinistro.valor_sinistro)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sinistro.valor_indemnizacao ? formatCurrency(sinistro.valor_indemnizacao) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sinistro.status)}`}>
                            {sinistro.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ActionButtons item={sinistro} type="sinistro" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        
              </AnimatePresence>

        {/* Modais */}
        {showRececaoModal && (
          <RececaoObraForm
            rececao={selectedRececao}
            onSave={handleSaveRececao}
            onCancel={() => setShowRececaoModal(false)}
          />
        )}

        {showGarantiaModal && (
          <GarantiaForm
            garantia={selectedGarantia}
            onSave={handleSaveGarantia}
            onCancel={() => setShowGarantiaModal(false)}
          />
        )}

        {showDefeitoModal && (
          <DefeitoForm
            defeito={selectedDefeito}
            onSave={handleSaveDefeito}
            onCancel={() => setShowDefeitoModal(false)}
          />
        )}

        {showManutencaoModal && (
          <ManutencaoForm
            manutencao={selectedManutencao}
            onSave={handleSaveManutencao}
            onCancel={() => setShowManutencaoModal(false)}
          />
        )}

        {showSeguroModal && (
          <SeguroForm
            seguro={selectedSeguro}
            onSave={handleSaveSeguro}
            onCancel={() => setShowSeguroModal(false)}
          />
        )}

        {showSinistroModal && (
          <SinistroForm
            sinistro={selectedSinistro}
            onSave={handleSaveSinistro}
            onCancel={() => setShowSinistroModal(false)}
          />
        )}

        {showPunchListModal && (
          <PunchListForm
            punchList={selectedPunchList}
            onSave={handleSavePunchList}
            onCancel={() => setShowPunchListModal(false)}
          />
        )}
      </div>
    );
  }
