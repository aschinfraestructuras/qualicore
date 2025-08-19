import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  BarChart3,
  Shield,
  Cloud,
  ArrowUpRight,
  Share2,
  Calendar,
  MapPin,
  TestTube,
  User,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CaracterizacaoSolo, FiltroSolos } from '@/types/solos';
import { solosAPI } from '@/lib/supabase-api/solosAPI';
import CaracterizacaoSolosForms from '@/components/CaracterizacaoSolosForms';
import CaracterizacaoSolosDetails from '@/components/CaracterizacaoSolosDetails';
import { AnimatePresence } from 'framer-motion';
import { SolosDashboard } from '@/components/SolosDashboard';
import RelatorioSolosPremium from '@/components/RelatorioSolosPremium';

export default function CaracterizacaoSolos() {
  const [solos, setSolos] = useState<CaracterizacaoSolo[]>([]);
  const [filteredSolos, setFilteredSolos] = useState<CaracterizacaoSolo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSolo, setSelectedSolo] = useState<CaracterizacaoSolo | null>(null);
  const [editingSolo, setEditingSolo] = useState<CaracterizacaoSolo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof CaracterizacaoSolo>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRelatorioPremium, setShowRelatorioPremium] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState<FiltroSolos>({
    search: '',
    obra: '',
    laboratorio: '',
    dataInicio: '',
    dataFim: '',
    conforme: '',
    tipo_amostra: '',
    profundidade_min: 0,
    profundidade_max: 0,
    adequacao: ''
  });

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    conformes: 0,
    nao_conformes: 0,
    adequados: 0,
    inadequados: 0,
    esteMes: 0,
    esteAno: 0
  });

  useEffect(() => {
    loadSolos();
  }, []);

  useEffect(() => {
    filterSolos();
  }, [solos, filtros, sortField, sortDirection]);

  const loadSolos = async () => {
    try {
      setLoading(true);
      const data = await solosAPI.caracterizacoes.getAll();
      setSolos(data);
      
      // Calcular estatísticas
      const total = data.length;
      const conformes = data.filter(s => s.conforme).length;
      const nao_conformes = total - conformes;
      const adequados = data.filter(s => s.classificacao && s.classificacao.adequacao && (s.classificacao.adequacao === 'ADEQUADO' || s.classificacao.adequacao === 'EXCELENTE')).length;
      const inadequados = total - adequados;

      // Estatísticas por período
      const agora = new Date();
      const esteMes = data.filter(s => {
        const dataSolo = new Date(s.created_at);
        return dataSolo.getMonth() === agora.getMonth() && dataSolo.getFullYear() === agora.getFullYear();
      }).length;

      const esteAno = data.filter(s => {
        const dataSolo = new Date(s.created_at);
        return dataSolo.getFullYear() === agora.getFullYear();
      }).length;

      setStats({ total, conformes, nao_conformes, adequados, inadequados, esteMes, esteAno });
    } catch (error) {
      console.error('Erro ao carregar solos:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filterSolos = () => {
    let filtered = [...solos];

    // Aplicar filtros
    if (filtros.search) {
      const search = filtros.search.toLowerCase();
      filtered = filtered.filter(solo =>
        solo.codigo.toLowerCase().includes(search) ||
        solo.obra.toLowerCase().includes(search) ||
        solo.localizacao.toLowerCase().includes(search) ||
        solo.laboratorio.toLowerCase().includes(search)
      );
    }

    if (filtros.obra) {
      filtered = filtered.filter(solo => solo.obra === filtros.obra);
    }

    if (filtros.laboratorio) {
      filtered = filtered.filter(solo => solo.laboratorio === filtros.laboratorio);
    }

    if (filtros.conforme !== '') {
      filtered = filtered.filter(solo => solo.conforme === (filtros.conforme === 'true'));
    }

    if (filtros.tipo_amostra) {
      filtered = filtered.filter(solo => solo.tipo_amostra === filtros.tipo_amostra);
    }

    if (filtros.adequacao) {
      filtered = filtered.filter(solo => solo.classificacao && solo.classificacao.adequacao && solo.classificacao.adequacao === filtros.adequacao);
    }

    if (filtros.profundidade_min > 0) {
      filtered = filtered.filter(solo => solo.profundidade_colheita >= filtros.profundidade_min);
    }

    if (filtros.profundidade_max > 0) {
      filtered = filtered.filter(solo => solo.profundidade_colheita <= filtros.profundidade_max);
    }

    if (filtros.dataInicio && filtros.dataFim) {
      filtered = filtered.filter(solo => {
        const dataColheita = new Date(solo.data_colheita);
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        return dataColheita >= inicio && dataColheita <= fim;
      });
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
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

    setFilteredSolos(filtered);
  };

  const handleCreate = async (data: CaracterizacaoSolo) => {
    try {
      await solosAPI.caracterizacoes.create(data);
      toast.success('Caracterização de solo criada com sucesso!');
      loadSolos();
    } catch (error) {
      console.error('Erro ao criar solo:', error);
      toast.error('Erro ao criar caracterização');
    }
  };

  const handleUpdate = async (data: CaracterizacaoSolo) => {
    if (!data.id) return;
    
    try {
      await solosAPI.caracterizacoes.update(data.id, data);
      toast.success('Caracterização de solo atualizada com sucesso!');
      loadSolos();
      setEditingSolo(null);
    } catch (error) {
      console.error('Erro ao atualizar solo:', error);
      toast.error('Erro ao atualizar caracterização');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta caracterização?')) return;
    
    try {
      await solosAPI.caracterizacoes.delete(id);
      toast.success('Caracterização de solo eliminada com sucesso!');
      loadSolos();
    } catch (error) {
      console.error('Erro ao eliminar solo:', error);
      toast.error('Erro ao eliminar caracterização');
    }
  };

  const handleExport = async () => {
    try {
      const csvContent = await solosAPI.export.toCSV(filteredSolos);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `caracterizacao_solos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exportação concluída!');
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro na exportação');
    }
  };

  const handleSort = (field: keyof CaracterizacaoSolo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getAdequacaoColor = (adequacao: string) => {
    switch (adequacao) {
      case 'EXCELENTE': return 'text-green-600 bg-green-100';
      case 'ADEQUADO': return 'text-blue-600 bg-blue-100';
      case 'MARGINAL': return 'text-yellow-600 bg-yellow-100';
      case 'TOLERABLE': return 'text-orange-600 bg-orange-100';
      case 'INADECUADO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConformidadeIcon = (conforme: boolean) => {
    return conforme ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Caracterização de Solos</h1>
                <p className="text-sm text-gray-600">Documentação de resultados de laboratório</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showDashboard ? 'Lista' : 'Dashboard'}</span>
              </button>
              
              <button
                onClick={() => setShowRelatorioPremium(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Relatórios</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Caracterização</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformes</p>
                <p className="text-2xl font-bold text-green-600">{stats.conformes}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Conformes</p>
                <p className="text-2xl font-bold text-red-600">{stats.nao_conformes}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Adequados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.adequados}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inadequados</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inadequados}</p>
              </div>
              <X className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-purple-600">{stats.esteMes}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Ano</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.esteAno}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
          </motion.div>
        </div>

        {/* Conteúdo principal - Dashboard ou Lista */}
        {showDashboard ? (
          <SolosDashboard
            solos={filteredSolos}
            onSearch={(query, options) => {
              setFiltros(prev => ({ ...prev, search: query }));
            }}
            onFilterChange={(newFilters) => {
              setFiltros(prev => ({ ...prev, ...newFilters }));
            }}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar por código, obra, localização..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
                  <input
                    type="text"
                    value={filtros.obra}
                    onChange={(e) => setFiltros(prev => ({ ...prev, obra: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório</label>
                  <input
                    type="text"
                    value={filtros.laboratorio}
                    onChange={(e) => setFiltros(prev => ({ ...prev, laboratorio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conformidade</label>
                  <select
                    value={filtros.conforme}
                    onChange={(e) => setFiltros(prev => ({ ...prev, conforme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todos</option>
                    <option value="true">Conformes</option>
                    <option value="false">Não Conformes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adequação</label>
                  <select
                    value={filtros.adequacao}
                    onChange={(e) => setFiltros(prev => ({ ...prev, adequacao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Todas</option>
                    <option value="EXCELENTE">Excelente</option>
                    <option value="ADEQUADO">Adequado</option>
                    <option value="MARGINAL">Marginal</option>
                    <option value="TOLERABLE">Tolerável</option>
                    <option value="INADECUADO">Inadequado</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('codigo')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Código
                  </th>
                  <th
                    onClick={() => handleSort('obra')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Obra
                  </th>
                  <th
                    onClick={() => handleSort('localizacao')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Localização
                  </th>
                  <th
                    onClick={() => handleSort('laboratorio')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Laboratório
                  </th>
                  <th
                    onClick={() => handleSort('data_colheita')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Data Colheita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adequação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conformidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredSolos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma caracterização encontrada
                    </td>
                  </tr>
                ) : (
                  filteredSolos.map((solo) => (
                    <tr key={solo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {solo.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solo.obra}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solo.localizacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solo.laboratorio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(solo.data_colheita).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAdequacaoColor(solo.classificacao?.adequacao || 'N/A')}`}>
                          {solo.classificacao?.adequacao || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getConformidadeIcon(solo.conforme)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSolo(solo);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingSolo(solo);
                              setShowForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => solo.id && handleDelete(solo.id)}
                            className="text-red-600 hover:text-red-900"
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
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-gray-700 text-center">
          Mostrando {filteredSolos.length} de {solos.length} caracterizações
        </div>
      </>
        )}
      </div>

      {/* Forms and Details Modals */}
      <CaracterizacaoSolosForms
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSolo(null);
        }}
        onSubmit={editingSolo ? handleUpdate : handleCreate}
        editingSolo={editingSolo}
      />

      <CaracterizacaoSolosDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedSolo(null);
        }}
        solo={selectedSolo}
      />

      {/* Modal de Relatórios Premium */}
      {showRelatorioPremium && (
        <RelatorioSolosPremium
          solos={filteredSolos}
          onClose={() => setShowRelatorioPremium(false)}
        />
      )}
    </div>
  );
}
