import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Building, MapPin, Calendar, AlertTriangle, CheckCircle, Clock,
  Plus, Search, Filter, Download, Eye, Edit, Trash, Users, Gauge, Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { estacoesAPI } from '../lib/supabase-api/estacoesAPI';
import { EstacoesFilters } from '../components/EstacoesFilters';
import { EstacoesForms } from '../components/EstacoesForms';
import { EstacoesDetails } from '../components/EstacoesDetails';
import { applyFilters, getDefaultFilters, getActiveFiltersCount } from '../utils/filterUtils';
import { exportToExcel, exportToCSV, exportToPDF } from '../utils/exportUtils';

interface Estacao {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km: number;
  estado: string;
  operador: string;
  data_inauguracao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    num_plataformas: number;
    num_vias: number;
    area_total: number;
    capacidade_passageiros: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

interface InspecaoEstacoes {
  id: string;
  estacao_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

export default function Estacoes() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoEstacoes[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filters, setFilters] = useState(getDefaultFilters());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('codigo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [estacoesData, inspecoesData, statsData] = await Promise.all([
        estacoesAPI.estacoes.getAll(),
        estacoesAPI.inspecoes.getAll(),
        estacoesAPI.stats.getStats()
      ]);

      setEstacoes(estacoesData || []);
      setInspecoes(inspecoesData || []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await estacoesAPI.estacoes.create(data);
      toast.success('Estação criada com sucesso!');
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar:', error);
      toast.error('Erro ao criar estação');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await estacoesAPI.estacoes.update(id, data);
      toast.success('Estação atualizada com sucesso!');
      setShowForm(false);
      setShowDetails(false);
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar estação');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta estação?')) {
      try {
        await estacoesAPI.estacoes.delete(id);
        toast.success('Estação excluída com sucesso!');
        setShowDetails(false);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir estação');
      }
    }
  };

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      const filteredData = applyFilters(estacoes, filters);
      const filename = `estacoes-${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'excel':
          await exportToExcel(filteredData, filename, 'Estações');
          break;
        case 'csv':
          await exportToCSV(filteredData, filename);
          break;
        case 'pdf':
          await exportToPDF(filteredData, filename, 'Estações');
          break;
      }
      
      toast.success(`Exportação ${format.toUpperCase()} concluída!`);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro na exportação');
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = applyFilters(estacoes, filters);
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField as keyof Estacoes];
    const bValue = b[sortField as keyof Estacoes];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
      case 'Operacional':
      case 'Conforme':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Manutenção':
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avaria':
      case 'Não Conforme':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Inativo':
      case 'Desligado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
      case 'Operacional':
      case 'Conforme':
        return <CheckCircle className="h-4 w-4" />;
      case 'Manutenção':
      case 'Pendente':
        return <Clock className="h-4 w-4" />;
      case 'Avaria':
      case 'Não Conforme':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Inativo':
      case 'Desligado':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Principal':
        return <Building className="h-5 w-5" />;
      case 'Secundária':
        return <Building className="h-5 w-5" />;
      case 'Terminal':
        return <Building className="h-5 w-5" />;
      case 'Intercambiador':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Estações</h1>
              <p className="text-gray-600">Gestão de estações ferroviárias</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Estação</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_estacoes || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.ativas || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Manutenção</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.em_manutencao || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inspeções Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.inspecoes_pendentes || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <EstacoesFilters
        filters={filters}
        onFiltersChange={setFilters}
        activeFiltersCount={getActiveFiltersCount(filters)}
      />

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-purple-600 transition-colors" onClick={() => handleSort('codigo')}>
                  <div className="flex items-center space-x-2">
                    <span>Código</span>
                    {sortField === 'codigo' && (
                      <TrendingUp className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-purple-600 transition-colors" onClick={() => handleSort('nome')}>
                  <div className="flex items-center space-x-2">
                    <span>Nome</span>
                    {sortField === 'nome' && (
                      <TrendingUp className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Localização</th>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-purple-600 transition-colors" onClick={() => handleSort('estado')}>
                  <div className="flex items-center space-x-2">
                    <span>Estado</span>
                    {sortField === 'estado' && (
                      <TrendingUp className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Próxima Inspeção</th>
                <th className="px-6 py-4 text-left font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        {getTipoIcon(item.tipo)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.codigo}</p>
                        <p className="text-sm text-gray-600">{item.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{item.nome}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.localizacao}</p>
                      <p className="text-sm text-gray-600">KM {item.km}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.estado)}`}>
                      {getStatusIcon(item.estado)}
                      <span className="ml-1">{item.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {item.proxima_inspecao ? new Date(item.proxima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowForm(true);
                        }}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} resultados
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg">
                  {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Forms */}
      {showForm && (
        <EstacoesForms
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          data={selectedItem}
          onSubmit={selectedItem ? (data) => handleUpdate(selectedItem.id, data) : handleCreate}
        />
      )}

      {/* Details */}
      {showDetails && selectedItem && (
        <EstacoesDetails
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
          data={selectedItem}
          type="estacoes"
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
          onDelete={() => handleDelete(selectedItem.id)}
        />
      )}
    </div>
  );
}
