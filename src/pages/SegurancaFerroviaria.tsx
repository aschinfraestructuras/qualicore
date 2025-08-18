import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Shield, MapPin, Calendar, AlertTriangle, CheckCircle, Clock,
  Plus, Search, Filter, Download, Eye, Edit, Trash, Users, Gauge, Lock, Camera, Bell, FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { segurancaFerroviariaAPI } from '../lib/supabase-api/segurancaFerroviariaAPI';
import { SegurancaFerroviariaFilters } from '../components/SegurancaFerroviariaFilters';
import { SegurancaFerroviariaForms } from '../components/SegurancaFerroviariaForms';
import { SegurancaFerroviariaDetails } from '../components/SegurancaFerroviariaDetails';
import RelatorioSegurancaFerroviariaPremium from '../components/RelatorioSegurancaFerroviariaPremium';
import Modal from '../components/Modal';
import { applyFilters, getDefaultFilters, getActiveFiltersCount } from '../utils/filterUtils';
import { exportToExcel, exportToCSV, exportToPDF } from '../utils/exportUtils';

interface SistemaSeguranca {
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
    nivel_seguranca: number;
    raio_cobertura: number;
    tempo_resposta: number;
    capacidade_deteccao: number;
  };
  ultima_inspecao: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

interface InspecaoSeguranca {
  id: string;
  seguranca_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
  created_at: string;
  updated_at: string;
}

export default function SegurancaFerroviaria() {
  const [segurancaItems, setSegurancaItems] = useState<SistemaSeguranca[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoSeguranca[]>([]);
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
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('sistemas');
  const [sistemasSelecionados, setSistemasSelecionados] = useState<SistemaSeguranca[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [segurancaData, inspecoesData, statsData] = await Promise.all([
        segurancaFerroviariaAPI.seguranca.getAll(),
        segurancaFerroviariaAPI.inspecoes.getAll(),
        segurancaFerroviariaAPI.stats.getStats()
      ]);

      setSegurancaItems(segurancaData || []);
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
      await segurancaFerroviariaAPI.seguranca.create(data);
      toast.success('Sistema de segurança criado com sucesso!');
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar:', error);
      toast.error('Erro ao criar sistema de segurança');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await segurancaFerroviariaAPI.seguranca.update(id, data);
      toast.success('Sistema de segurança atualizado com sucesso!');
      setShowForm(false);
      setShowDetails(false);
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar sistema de segurança');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este sistema de segurança?')) {
      try {
        await segurancaFerroviariaAPI.seguranca.delete(id);
        toast.success('Sistema de segurança excluído com sucesso!');
        setShowDetails(false);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir sistema de segurança');
      }
    }
  };

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      const filteredData = applyFilters(segurancaItems, filters);
      const filename = `seguranca-ferroviaria-${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'excel':
          await exportToExcel(filteredData, filename, 'Segurança Ferroviária');
          break;
        case 'csv':
          await exportToCSV(filteredData, filename);
          break;
        case 'pdf':
          await exportToPDF(filteredData, filename, 'Segurança Ferroviária');
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

  const filteredData = applyFilters(segurancaItems, filters);
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField as keyof SegurancaFerroviaria];
    const bValue = b[sortField as keyof SegurancaFerroviaria];
    
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
      case 'Sistema de Detecção':
        return <Bell className="h-5 w-5" />;
      case 'Sistema de Vigilância':
        return <Camera className="h-5 w-5" />;
      case 'Sistema de Controle':
        return <Shield className="h-5 w-5" />;
      case 'Sistema de Alarme':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
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
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Segurança Ferroviária</h1>
              <p className="text-gray-600">Gestão de sistemas de segurança ferroviária</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setTipoRelatorio('sistemas');
                setShowRelatorio(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Relatório</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Sistema</span>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.total_sistemas || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.ativos || 0}</p>
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
      <SegurancaFerroviariaFilters
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
            <thead className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors" onClick={() => handleSort('codigo')}>
                  <div className="flex items-center space-x-2">
                    <span>Código</span>
                    {sortField === 'codigo' && (
                      <TrendingUp className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors" onClick={() => handleSort('tipo')}>
                  <div className="flex items-center space-x-2">
                    <span>Tipo</span>
                    {sortField === 'tipo' && (
                      <TrendingUp className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Localização</th>
                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-red-600 transition-colors" onClick={() => handleSort('estado')}>
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
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                        {getTipoIcon(item.tipo)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.codigo}</p>
                        <p className="text-sm text-gray-600">{item.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{item.tipo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.localizacao}</p>
                      <p className="text-sm text-gray-600">KM {item.km_inicial} - {item.km_final}</p>
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
                <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg">
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
        <SegurancaFerroviariaForms
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
        <SegurancaFerroviariaDetails
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
          data={selectedItem}
          type="seguranca"
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
          onDelete={() => handleDelete(selectedItem.id)}
        />
      )}

      {/* Relatório Modal */}
      <Modal
        isOpen={showRelatorio}
        onClose={() => setShowRelatorio(false)}
        size="xl"
        title={`Relatório de ${tipoRelatorio === 'sistemas' ? 'Sistemas de Segurança' : 'Inspeções de Segurança'}`}
      >
        <div className="space-y-4">
          <RelatorioSegurancaFerroviariaPremium
            tipoRelatorio={tipoRelatorio as 'sistemas' | 'inspecoes'}
            onSelecaoChange={setSistemasSelecionados}
          />

          {sistemasSelecionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-900">
                    {sistemasSelecionados.length} sistema(s) selecionado(s)
                  </span>
                </div>
                <button
                  onClick={() => setSistemasSelecionados([])}
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
