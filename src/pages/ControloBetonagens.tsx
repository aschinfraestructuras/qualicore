import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Save,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { betonagensAPI } from '@/lib/supabase-api/betonagensAPI';
import ControloBetonagensForms from '@/components/ControloBetonagensForms';
import ControloBetonagensFilters from '@/components/ControloBetonagensFilters';
import ControloBetonagensDetails from '@/components/ControloBetonagensDetails';
import { applyFilters, getDefaultFilters, getActiveFiltersCount, sortData } from '@/utils/filterUtils';

interface Betonagem {
  id: string;
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
  created_at: string;
  updated_at: string;
}

interface EnsaioBetonagem {
  id: string;
  betonagem_id: string;
  data_ensaio: string;
  tipo_ensaio: string;
  resultado: number;
  observacoes: string;
  responsavel: string;
  created_at: string;
  updated_at: string;
}

export default function ControloBetonagens() {
  const [betonagens, setBetonagens] = useState<Betonagem[]>([]);
  const [ensaios, setEnsaios] = useState<EnsaioBetonagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBetonagem, setSelectedBetonagem] = useState<Betonagem | null>(null);
  const [editingBetonagem, setEditingBetonagem] = useState<Betonagem | null>(null);
  const [filters, setFilters] = useState(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Betonagem>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadBetonagens();
  }, []);

  const loadBetonagens = async () => {
    try {
      setLoading(true);
      const response = await betonagensAPI.betonagens.getAll();
      setBetonagens(response || []);
      
      // Calcular estatísticas localmente após carregar os dados
      const localStats = calculateLocalStats(response || []);
      setStats(localStats);
    } catch (error) {
      console.error('Erro ao carregar betonagens:', error);
      setBetonagens([]);
      setStats({
        total_betonagens: 0,
        conformes: 0,
        nao_conformes: 0,
        pendentes: 0,
        resistencia_media_28d: 0,
        betonagens_7d: 0,
        betonagens_28d: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Tentar usar a função RPC primeiro
      const response = await betonagensAPI.stats.getStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas via RPC, calculando localmente:', error);
      // Calcular estatísticas localmente como fallback
      const localStats = calculateLocalStats(betonagens);
      setStats(localStats);
    }
  };

  const calculateLocalStats = (betonagensData: Betonagem[]) => {
    const total = betonagensData.length;
    const conformes = betonagensData.filter(b => b.status_conformidade === 'Conforme').length;
    const naoConformes = betonagensData.filter(b => b.status_conformidade === 'Não Conforme').length;
    const pendentes = betonagensData.filter(b => b.status_conformidade === 'Pendente').length;
    
    // Calcular resistência média 28d
    const resistencias28d = betonagensData
      .filter(b => b.resistencia_28d_1 > 0 || b.resistencia_28d_2 > 0 || b.resistencia_28d_3 > 0)
      .map(b => {
        const valores = [b.resistencia_28d_1, b.resistencia_28d_2, b.resistencia_28d_3].filter(v => v > 0);
        return valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
      })
      .filter(v => v > 0);
    
    const resistenciaMedia28d = resistencias28d.length > 0 
      ? Math.round((resistencias28d.reduce((a, b) => a + b, 0) / resistencias28d.length) * 10) / 10
      : 0;

    return {
      total_betonagens: total,
      conformes: conformes,
      nao_conformes: naoConformes,
      pendentes: pendentes,
      resistencia_media_28d: resistenciaMedia28d,
      betonagens_7d: betonagensData.filter(b => b.data_ensaio_7d).length,
      betonagens_28d: betonagensData.filter(b => b.data_ensaio_28d).length
    };
  };

  const handleCreate = async (data: any) => {
    try {
      // Clean and validate the data before sending to API
      const cleanData = {
        codigo: data.codigo.trim(),
        obra: data.obra.trim(),
        elemento_estrutural: data.elemento_estrutural,
        localizacao: data.localizacao.trim(),
        data_betonagem: data.data_betonagem,
        data_ensaio_7d: data.data_ensaio_7d || null,
        data_ensaio_28d: data.data_ensaio_28d || null,
        fornecedor: data.fornecedor.trim(),
        guia_remessa: data.guia_remessa.trim(),
        tipo_betao: data.tipo_betao || '',
        aditivos: data.aditivos || 'Nenhum',
        hora_limite_uso: data.hora_limite_uso || '',
        slump: data.slump || 0,
        temperatura: data.temperatura || 0,
        resistencia_7d_1: data.resistencia_7d_1 || 0,
        resistencia_7d_2: data.resistencia_7d_2 || 0,
        resistencia_28d_1: data.resistencia_28d_1 || 0,
        resistencia_28d_2: data.resistencia_28d_2 || 0,
        resistencia_28d_3: data.resistencia_28d_3 || 0,
        resistencia_rotura: data.resistencia_rotura || 0,
        dimensoes_provete: data.dimensoes_provete,
        status_conformidade: data.status_conformidade || 'Pendente',
        observacoes: data.observacoes || '',
        relatorio_rotura: data.relatorio_rotura || ''
      };

      console.log('Creating betonagem with data:', cleanData);
      await betonagensAPI.betonagens.create(cleanData);
      toast.success('Betonagem criada com sucesso!');
      setShowForm(false);
      loadBetonagens();
    } catch (error) {
      console.error('Erro ao criar betonagem:', error);
      toast.error('Erro ao criar betonagem');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await betonagensAPI.betonagens.update(id, data);
      toast.success('Betonagem atualizada com sucesso!');
      setShowForm(false);
      setEditingBetonagem(null);
      loadBetonagens();
    } catch (error) {
      console.error('Erro ao atualizar betonagem:', error);
      toast.error('Erro ao atualizar betonagem');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar esta betonagem?')) {
      try {
        await betonagensAPI.betonagens.delete(id);
        toast.success('Betonagem eliminada com sucesso!');
        loadBetonagens();
      } catch (error) {
        console.error('Erro ao eliminar betonagem:', error);
        toast.error('Erro ao eliminar betonagem');
      }
    }
  };

  const handleSort = (field: keyof Betonagem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredBetonagens = applyFilters(betonagens, filters);
  const sortedBetonagens = sortData(filteredBetonagens, sortField, sortDirection);
  const totalPages = Math.ceil(sortedBetonagens.length / itemsPerPage);
  const paginatedBetonagens = sortedBetonagens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFiltersCount = getActiveFiltersCount(filters);

  const exportData = (format: 'excel' | 'csv' | 'pdf') => {
    // Implementar exportação
    toast.success(`Exportação ${format.toUpperCase()} iniciada!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conforme': return 'text-green-600 bg-green-100';
      case 'Não Conforme': return 'text-red-600 bg-red-100';
      case 'Pendente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Conforme': return <CheckCircle className="h-4 w-4" />;
      case 'Não Conforme': return <XCircle className="h-4 w-4" />;
      case 'Pendente': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getResistenciaColor = (valor: number, limite: number) => {
    if (valor >= limite) return 'text-green-600';
    if (valor < limite) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleView = (betonagem: Betonagem) => {
    setSelectedBetonagem(betonagem);
    setShowDetails(true);
  };

  const handleEdit = (betonagem: Betonagem) => {
    setEditingBetonagem(betonagem);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Controlo de Betonagens
            </h1>
            <p className="text-gray-600">
              Gestão técnica de betonagens, ensaios de resistência e controlo de qualidade
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Betonagem</span>
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Betonagens</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_betonagens || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conformes</p>
              <p className="text-2xl font-bold text-green-600">{stats?.conformes || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Não Conformes</p>
              <p className="text-2xl font-bold text-red-600">{stats?.nao_conformes || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resistência Média 28d</p>
              <p className="text-2xl font-bold text-indigo-600">{stats?.resistencia_media_28d || 0} MPa</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar betonagens..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportData('excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportData('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <ControloBetonagensFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigo')}>
                   <div className="flex items-center space-x-1">
                     <span>Código</span>
                     {sortField === 'codigo' && (
                       sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                     )}
                   </div>
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('obra')}>
                   <div className="flex items-center space-x-1">
                     <span>Obra</span>
                     {sortField === 'obra' && (
                       sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                     )}
                   </div>
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('elemento_estrutural')}>
                  <div className="flex items-center space-x-1">
                    <span>Elemento</span>
                    {sortField === 'elemento_estrutural' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('localizacao')}>
                  <div className="flex items-center space-x-1">
                    <span>Localização</span>
                    {sortField === 'localizacao' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('data_betonagem')}>
                  <div className="flex items-center space-x-1">
                    <span>Data Betonagem</span>
                    {sortField === 'data_betonagem' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Datas Ensaios</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fornecedor')}>
                  <div className="flex items-center space-x-1">
                    <span>Fornecedor</span>
                    {sortField === 'fornecedor' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Resistências (MPa)</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status_conformidade')}>
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === 'status_conformidade' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                             {loading ? (
                 <tr>
                   <td colSpan={12} className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center space-x-2">
                       <Loader className="h-5 w-5 animate-spin text-blue-600" />
                       <span className="text-gray-600">A carregar betonagens...</span>
                     </div>
                   </td>
                 </tr>
               ) : paginatedBetonagens.length === 0 ? (
                 <tr>
                   <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                     Nenhuma betonagem encontrada
                   </td>
                 </tr>
              ) : (
                paginatedBetonagens.map((betonagem) => (
                                     <tr key={betonagem.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">{betonagem.codigo}</div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="text-sm text-gray-900 max-w-xs truncate" title={betonagem.obra}>
                         {betonagem.obra}
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{betonagem.elemento_estrutural}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={betonagem.localizacao}>
                        {betonagem.localizacao}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(betonagem.data_betonagem).toLocaleDateString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-blue-600">7d:</span>
                          <span className="text-xs">
                            {betonagem.data_ensaio_7d ? new Date(betonagem.data_ensaio_7d).toLocaleDateString('pt-PT') : '-'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600">28d:</span>
                          <span className="text-xs">
                            {betonagem.data_ensaio_28d ? new Date(betonagem.data_ensaio_28d).toLocaleDateString('pt-PT') : '-'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{betonagem.fornecedor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-blue-600">7d:</span>
                          <span className={`text-xs font-medium ${getResistenciaColor(((betonagem.resistencia_7d_1 + betonagem.resistencia_7d_2) / 2), 20)}`}>
                            {((betonagem.resistencia_7d_1 + betonagem.resistencia_7d_2) / 2).toFixed(1)} MPa
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-green-600">28d:</span>
                          <span className={`text-xs font-medium ${getResistenciaColor(((betonagem.resistencia_28d_1 + betonagem.resistencia_28d_2 + betonagem.resistencia_28d_3) / 3), 30)}`}>
                            {((betonagem.resistencia_28d_1 + betonagem.resistencia_28d_2 + betonagem.resistencia_28d_3) / 3).toFixed(1)} MPa
                          </span>
                        </div>
                        {betonagem.resistencia_rotura > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-orange-600">Rotura:</span>
                            <span className={`text-xs font-medium ${getResistenciaColor(betonagem.resistencia_rotura, 35)}`}>
                              {betonagem.resistencia_rotura} MPa
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(betonagem.status_conformidade)}`}>
                        {getStatusIcon(betonagem.status_conformidade)}
                        <span className="ml-1">{betonagem.status_conformidade}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(betonagem)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(betonagem)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(betonagem.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredBetonagens.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredBetonagens.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <ControloBetonagensForms
          betonagem={editingBetonagem}
          onSubmit={editingBetonagem ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingBetonagem(null);
          }}
        />
      )}

      {showDetails && selectedBetonagem && (
        <ControloBetonagensDetails
          betonagem={selectedBetonagem}
          onClose={() => {
            setShowDetails(false);
            setSelectedBetonagem(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setEditingBetonagem(selectedBetonagem);
            setShowForm(true);
          }}
          onDelete={() => {
            setShowDetails(false);
            handleDelete(selectedBetonagem.id);
          }}
        />
      )}
    </div>
  );
}
