import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  X,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { normasAPI } from '../lib/supabase-api/normasAPI';
import { storageService } from '../lib/supabase-storage';
import NormasForms from '../components/NormasForms';
import RelatorioNormasPremium from '../components/RelatorioNormasPremium';
import Modal from '../components/Modal';
import NormasPesquisaAvancada from '../components/NormasPesquisaAvancada';
import NormasDashboard from '../components/NormasDashboard';
import PDFProfessionalButton from '../components/PDFProfessionalButton';
import { NormasNotificacoes } from '../components/NormasNotificacoes';
import { NormasCacheService } from '../lib/normas-cache';
import { NormasPesquisaService } from '../lib/normas-pesquisa-avancada';
import { NormasAnalyticsService } from '../lib/normas-analytics';
import type { 
  Norma, 
  FiltrosNormas, 
  EstatisticasNormas,
  CategoriaNorma,
  OrganismoNormativo,
  StatusNorma,
  PrioridadeNorma
} from '../types/normas';
import {
  CATEGORIAS_NORMAS,
  SUBCATEGORIAS_NORMAS,
  ORGANISMOS_NORMATIVOS
} from '../types/normas';

interface NormasProps {}

export default function Normas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [normas, setNormas] = useState<Norma[]>([]);
  const [normasFiltradas, setNormasFiltradas] = useState<Norma[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<EstatisticasNormas | null>(null);
  const [filtros, setFiltros] = useState<FiltrosNormas>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'codigo' | 'titulo' | 'data_publicacao' | 'prioridade'>('codigo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedNorma, setSelectedNorma] = useState<Norma | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRelatorioPremium, setShowRelatorioPremium] = useState(false);
  const [deletingNorma, setDeletingNorma] = useState<string | null>(null);
  const [editingNorma, setEditingNorma] = useState<Norma | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    loadNormas();
    loadEstatisticas();
  }, []);

  useEffect(() => {
    // Aplicar filtros baseados nos parâmetros da URL
    aplicarFiltrosURL();
  }, [normas, searchParams]);

  const aplicarFiltrosURL = () => {
    let normasFiltradasTemp = [...normas];
    
    // Filtro por status
    const status = searchParams.get('status');
    if (status) {
      if (status === 'vencidas') {
        const hoje = new Date();
        normasFiltradasTemp = normasFiltradasTemp.filter(norma => {
          const dataVencimento = new Date(norma.data_entrada_vigor);
          return dataVencimento < hoje;
        });
      } else {
        normasFiltradasTemp = normasFiltradasTemp.filter(norma => norma.status === status);
      }
    }

    // Filtro por prioridade
    const prioridade = searchParams.get('prioridade');
    if (prioridade) {
      normasFiltradasTemp = normasFiltradasTemp.filter(norma => norma.prioridade === prioridade);
    }

    // Filtro por categoria
    const categoria = searchParams.get('categoria');
    if (categoria) {
      normasFiltradasTemp = normasFiltradasTemp.filter(norma => norma.categoria === categoria);
    }

    // Filtro por organismo
    const organismo = searchParams.get('organismo');
    if (organismo) {
      normasFiltradasTemp = normasFiltradasTemp.filter(norma => norma.organismo === organismo);
    }

    setNormasFiltradas(normasFiltradasTemp);
  };

  const loadNormas = async () => {
    try {
      setLoading(true);
      
      // Verificar cache primeiro
      const cachedNormas = NormasCacheService.getCachedNormas();
      if (cachedNormas) {
        setNormas(cachedNormas);
        setLoading(false);
        return;
      }

      const data = await normasAPI.normas.getAll();
      setNormas(data);
      
      // Cache dos dados
      NormasCacheService.cacheNormas(data);
    } catch (error) {
      console.error('Erro ao carregar normas:', error);
      toast.error('Erro ao carregar normas');
    } finally {
      setLoading(false);
    }
  };

  const loadEstatisticas = async () => {
    try {
      // Verificar cache primeiro
      const cachedStats = NormasCacheService.getCachedEstatisticas();
      if (cachedStats) {
        setEstatisticas(cachedStats);
        return;
      }

      const stats = await normasAPI.stats.getEstatisticas();
      setEstatisticas(stats);
      
      // Cache das estatísticas
      NormasCacheService.cacheEstatisticas(stats);
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

  const sortedNormas = [...normasFiltradas].sort((a, b) => {
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

  // Download de um anexo (abre numa nova aba ou inicia download)
  const handleDownloadDocumento = async (documento: any) => {
    try {
      if (documento.path) {
        // Download via Supabase Storage (bucket normas -> mapeado para 'documents' por default)
        await storageService.downloadFile(documento.path, documento.nome, (import.meta as any).env?.VITE_SUPABASE_BUCKET_NORMAS || 'documents');
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        // Fallback para URL direta (para documentos antigos)
        const a = document.createElement('a');
        a.href = documento.url;
        a.download = documento.nome || 'documento';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro no download do anexo:', error);
      toast.error(`Erro ao descarregar o anexo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Funções do Dashboard
  const handleDashboardNormaClick = (norma: Norma) => {
    setSelectedNorma(norma);
    setShowDetails(true);
  };

  const handleDashboardRefresh = () => {
    loadNormas();
    loadEstatisticas();
  };

  // Eliminar uma norma
  const handleDeleteNorma = async (norma: Norma) => {
    if (!confirm(`Tem certeza que deseja eliminar a norma "${norma.titulo}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setDeletingNorma(norma.id);

      // Eliminar documentos anexos do storage primeiro
      if (norma.documentos_anexos && norma.documentos_anexos.length > 0) {
        for (const doc of norma.documentos_anexos) {
          if (doc.path) {
            try {
              await storageService.deleteFile(
                doc.path,
                (import.meta as any).env?.VITE_SUPABASE_BUCKET_NORMAS || 'documents'
              );
            } catch (error) {
              console.warn('Erro ao eliminar documento do storage:', error);
              // Continua mesmo se falhar a eliminação do documento
            }
          }
        }
      }

      // Eliminar a norma da base de dados
      await normasAPI.normas.delete(norma.id);

      // Atualizar a lista local
      setNormas(prev => prev.filter(n => n.id !== norma.id));

      toast.success(`Norma "${norma.titulo}" eliminada com sucesso!`);

      // Fechar modal de detalhes se estiver aberto
      if (selectedNorma?.id === norma.id) {
        setShowDetails(false);
        setSelectedNorma(null);
      }
    } catch (error) {
      console.error('Erro ao eliminar norma:', error);
      toast.error(`Erro ao eliminar norma: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setDeletingNorma(null);
    }
  };

  // Download rápido: primeiro anexo da norma
  const downloadFirstAttachment = (norma: Norma) => {
    const docs = (norma as any).documentos_anexos || [];
    if (docs.length === 0) {
      toast.error('Esta norma não tem anexos');
      return;
    }
    handleDownloadDocumento(docs[0]);
  };

  const clearFilters = () => {
    setFiltros({});
    setSearchTerm('');
    setSearchParams({});
  };

  const limparFiltrosURL = () => {
    setSearchParams({});
  };

  const temFiltrosAtivos = () => {
    return searchParams.toString() !== '';
  };

  const handleCreate = () => {
    setEditingNorma(null);
    setShowForm(true);
  };

  const handleEdit = (norma: Norma) => {
    setEditingNorma(norma);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    loadNormas();
    loadEstatisticas();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="px-4 sm:px-6 lg:px-8">
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
              {/* Sistema de Notificações */}
              <NormasNotificacoes />
              
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 ${
                  showDashboard 
                    ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
                             <PDFProfessionalButton 
                 normas={normasFiltradas}
                 variant="primary"
                 size="md"
               />

               <button
                 onClick={() => setShowRelatorioPremium(true)}
                 className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 flex items-center space-x-2"
               >
                 <BarChart3 className="h-4 w-4" />
                 <span>Relatório Premium</span>
               </button>
              <button 
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Norma</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Premium */}
        {showDashboard && (
          <div className="mb-8">
            <NormasDashboard
              normas={normas}
              onNormaClick={handleDashboardNormaClick}
              onRefresh={handleDashboardRefresh}
              loading={loading}
            />
          </div>
        )}

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

        {/* Pesquisa Avançada */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pesquisa Avançada</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {normasFiltradas.length} norma(s) encontrada(s)
              </span>
            </div>
          </div>
          
          <NormasPesquisaAvancada
            normas={normas}
            onResultadosChange={setNormasFiltradas}
            onLoadingChange={setLoading}
            onSugestoesChange={setSugestoes}
          />
        </div>

        {/* Indicadores de Filtros Ativos */}
        {temFiltrosAtivos() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Filtros Ativos:</span>
                <div className="flex flex-wrap gap-2">
                  {searchParams.get('status') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {searchParams.get('status') === 'vencidas' ? 'Vencidas' : searchParams.get('status')}
                      <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('status');
                          setSearchParams(newParams);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchParams.get('prioridade') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Prioridade: {searchParams.get('prioridade')}
                      <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('prioridade');
                          setSearchParams(newParams);
                        }}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchParams.get('categoria') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Categoria: {searchParams.get('categoria')}
                      <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('categoria');
                          setSearchParams(newParams);
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchParams.get('organismo') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Organismo: {searchParams.get('organismo')}
                      <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.delete('organismo');
                          setSearchParams(newParams);
                        }}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={limparFiltrosURL}
                  className="flex items-center space-x-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Ver Todas as Normas</span>
                </button>
                <button
                  onClick={limparFiltrosURL}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
            
            {/* Resumo dos resultados filtrados */}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">
                  <strong>{normasFiltradas.length}</strong> de <strong>{normas.length}</strong> normas encontradas
                </span>
                <span className="text-blue-600">
                  {Math.round((normasFiltradas.length / normas.length) * 100)}% dos dados
                </span>
              </div>
            </div>
          </div>
        )}

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
                          {Array.isArray((norma as any).documentos_anexos) && (norma as any).documentos_anexos.length > 0 && (
                            <button
                              onClick={() => downloadFirstAttachment(norma)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Descarregar norma (primeiro anexo)"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedNorma(norma);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                                                     <button 
                             onClick={() => handleEdit(norma)}
                             className="text-gray-600 hover:text-gray-900"
                           >
                             <Edit className="h-4 w-4" />
                           </button>
                          <button
                            onClick={() => handleDeleteNorma(norma)}
                            disabled={deletingNorma === norma.id}
                            className={`text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                              deletingNorma === norma.id ? 'animate-pulse' : ''
                            }`}
                            title="Eliminar norma"
                          >
                            {deletingNorma === norma.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteNorma(selectedNorma)}
                    disabled={deletingNorma === selectedNorma.id}
                    className={`p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      deletingNorma === selectedNorma.id ? 'animate-pulse' : ''
                    }`}
                    title="Eliminar norma"
                  >
                    {deletingNorma === selectedNorma.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
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

              {/* Documentos Anexos */}
              {Array.isArray((selectedNorma as any).documentos_anexos) && (selectedNorma as any).documentos_anexos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Anexos</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedNorma as any).documentos_anexos.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                        <span className="mr-2">📎</span>
                        <span className="font-medium truncate max-w-48">{doc.nome}</span>
                        <span className="ml-2 text-gray-600 text-xs">{doc.tamanho ? `(${(doc.tamanho / 1024 / 1024).toFixed(2)} MB)` : ''}</span>
                        <button
                          onClick={() => handleDownloadDocumento(doc)}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded"
                          title="Descarregar documento"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
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

       {/* Form Modal */}
       <NormasForms
         isOpen={showForm}
         onClose={() => setShowForm(false)}
         editingNorma={editingNorma}
         onSuccess={handleFormSuccess}
       />



       {/* Relatório Premium Modal */}
       <RelatorioNormasPremium
         normas={normasFiltradas}
         isOpen={showRelatorioPremium}
         onClose={() => setShowRelatorioPremium(false)}
         filtros={filtros}
       />
     </div>
   );
 }
