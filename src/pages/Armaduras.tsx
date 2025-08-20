import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  FileText,
  Hash,
  Building,
  Truck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { armadurasAPI } from '@/lib/supabase-api/armadurasAPI';
import { Armadura, ArmaduraFilters, ArmaduraStats } from '@/types/armaduras';
import ArmaduraForm from '@/components/forms/ArmaduraForm';
import Modal from '@/components/Modal';
import RelatorioArmadurasPremium from '@/components/RelatorioArmadurasPremium';
import ArmaduraDashboard from '@/components/ArmaduraDashboard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Armaduras() {
  const [armaduras, setArmaduras] = useState<Armadura[]>([]);
  const [stats, setStats] = useState<ArmaduraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedArmadura, setSelectedArmadura] = useState<Armadura | null>(null);
  const [tipoRelatorio, setTipoRelatorio] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('executivo');
  const [armadurasSelecionadas, setArmadurasSelecionadas] = useState<Armadura[]>([]);
  const [filters, setFilters] = useState<ArmaduraFilters>({
    search: '',
    tipo: '',
    estado: '',
    zona: '',
    fornecedor: '',
    obra: '',
    fabricante: '',
    numero_colada: '',
    numero_guia_remessa: '',
    local_aplicacao: '',
    dataInicio: '',
    dataFim: '',
    diametroMin: 0,
    diametroMax: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [armadurasData, statsData] = await Promise.all([
        armadurasAPI.getAll(),
        armadurasAPI.getStats()
      ]);
      setArmaduras(armadurasData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await armadurasAPI.create(data);
      toast.success('Armadura criada com sucesso');
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao criar armadura:', error);
      toast.error('Erro ao criar armadura');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedArmadura) return;
    try {
      await armadurasAPI.update(selectedArmadura.id, data);
      toast.success('Armadura atualizada com sucesso');
      setShowForm(false);
      setSelectedArmadura(null);
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar armadura:', error);
      toast.error('Erro ao atualizar armadura');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta armadura?')) return;
    try {
      await armadurasAPI.delete(id);
      toast.success('Armadura eliminada com sucesso');
      loadData();
    } catch (error) {
      console.error('Erro ao eliminar armadura:', error);
      toast.error('Erro ao eliminar armadura');
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filteredData = await armadurasAPI.getWithFilters(filters);
      setArmaduras(filteredData);
    } catch (error) {
      console.error('Erro ao filtrar dados:', error);
      toast.error('Erro ao filtrar dados');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tipo: '',
      estado: '',
      zona: '',
      fornecedor: '',
      obra: '',
      fabricante: '',
      numero_colada: '',
      numero_guia_remessa: '',
      local_aplicacao: '',
      dataInicio: '',
      dataFim: '',
      diametroMin: 0,
      diametroMax: 0,
    });
    loadData();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprovado': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'reprovado': return 'text-red-600 bg-red-100';
      case 'instalado': return 'text-blue-600 bg-blue-100';
      case 'concluido': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'reprovado': return <AlertCircle className="w-4 h-4" />;
      case 'instalado': return <CheckCircle className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Preparar dados para gráficos
  const estadoChartData = stats ? Object.entries(stats.estado_distribuicao).map(([estado, count]) => ({
    name: estado.charAt(0).toUpperCase() + estado.slice(1),
    value: count
  })) : [];

  const pesoPorDiametroData = stats ? Object.entries(stats.peso_por_diametro).map(([diametro, peso]) => ({
    name: `Ø${diametro}mm`,
    peso: peso
  })) : [];

  const aplicacaoPorZonaData = stats ? Object.entries(stats.aplicacao_por_zona).map(([zona, count]) => ({
    name: zona,
    quantidade: count
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Gestão de Armaduras
            </h1>
            <p className="text-gray-600 mt-2">
              Controlo e rastreamento de armaduras de aço em obra
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setTipoRelatorio('filtrado');
                setShowRelatorio(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Relatório
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Armadura
            </button>
          </div>
        </motion.div>

        {/* Dashboard */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* KPI Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Armaduras</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_armaduras}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Peso Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.peso_total.toFixed(1)} kg</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conformidade</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.conformidade_media.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fabricantes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.fabricantes_unicos}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Estado Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Distribuição por Estado
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadoChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {estadoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Peso por Diâmetro */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Peso por Diâmetro
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pesoPorDiametroData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} kg`} />
                  <Bar dataKey="peso" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Conteúdo principal - Dashboard ou Lista */}
        {showDashboard ? (
          <>
            {console.log('Armaduras page: Mostrando dashboard com', armaduras.length, 'armaduras')}
            <ArmaduraDashboard
              armaduras={armaduras}
              onSearch={(query, options) => {
                setFilters(prev => ({ ...prev, search: query }));
              }}
              onFilterChange={(newFilters) => {
                setFilters(prev => ({ ...prev, ...newFilters }));
              }}
            />
          </>
        ) : (
          <>
            {/* Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filtros
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              <option value="feixe">Feixe</option>
              <option value="estribo">Estribo</option>
              <option value="cintas">Cintas</option>
              <option value="armadura_negativa">Armadura Negativa</option>
              <option value="armadura_positiva">Armadura Positiva</option>
              <option value="outro">Outro</option>
            </select>

            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os estados</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
              <option value="instalado">Instalado</option>
              <option value="concluido">Concluído</option>
            </select>

            <input
              type="text"
              placeholder="Fabricante"
              value={filters.fabricante}
              onChange={(e) => setFilters({ ...filters, fabricante: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="Número de Colada"
              value={filters.numero_colada}
              onChange={(e) => setFilters({ ...filters, numero_colada: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="Número Guia de Remessa"
              value={filters.numero_guia_remessa}
              onChange={(e) => setFilters({ ...filters, numero_guia_remessa: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="Local de Aplicação"
              value={filters.local_aplicacao}
              onChange={(e) => setFilters({ ...filters, local_aplicacao: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="Data Início"
              value={filters.dataInicio}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="Data Fim"
              value={filters.dataFim}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diâmetro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nº Colada
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricante
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local Aplicação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {armaduras.map((armadura) => (
                  <tr key={armadura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{armadura.codigo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {armadura.tipo === 'outro' ? armadura.tipo_outro : armadura.tipo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Ø{armadura.diametro}mm</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Hash className="w-4 h-4 mr-1 text-gray-400" />
                        {armadura.numero_colada}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Building className="w-4 h-4 mr-1 text-gray-400" />
                        {armadura.fabricante}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {armadura.local_aplicacao}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(armadura.estado)}`}>
                        {getEstadoIcon(armadura.estado)}
                        <span className="ml-1">{armadura.estado}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{armadura.peso_total.toFixed(1)} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedArmadura(armadura);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArmadura(armadura);
                            setShowForm(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(armadura.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </>
        )}
      </div>

      {/* Modal do Formulário */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedArmadura(null);
        }}
        title={selectedArmadura ? 'Editar Armadura' : 'Nova Armadura'}
      >
                  <ArmaduraForm
            initialData={selectedArmadura}
            onSubmit={selectedArmadura ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setSelectedArmadura(null);
            }}
            isEditing={!!selectedArmadura}
          />
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedArmadura(null);
        }}
        title="Detalhes da Armadura"
      >
        {selectedArmadura && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo</label>
                    <p className="text-sm text-gray-900">
                      {selectedArmadura.tipo === 'outro' ? selectedArmadura.tipo_outro : selectedArmadura.tipo}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diâmetro</label>
                    <p className="text-sm text-gray-900">Ø{selectedArmadura.diametro}mm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comprimento</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.comprimento}m</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantidade</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.quantidade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Peso Total</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.peso_total.toFixed(1)} kg</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Identificação e Rastreamento</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número de Colada</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.numero_colada}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Número Guia de Remessa</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.numero_guia_remessa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fabricante</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.fabricante}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fornecedor do Aço em Obra</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.fornecedor_aco_obra}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Local de Aplicação</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.local_aplicacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Zona de Aplicação</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.zona_aplicacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lote de Aplicação</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.lote_aplicacao}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado e Localização</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(selectedArmadura.estado)}`}>
                      {getEstadoIcon(selectedArmadura.estado)}
                      <span className="ml-1">{selectedArmadura.estado}</span>
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Receção</label>
                    <p className="text-sm text-gray-900">{new Date(selectedArmadura.data_rececao).toLocaleDateString('pt-PT')}</p>
                  </div>
                  {selectedArmadura.data_instalacao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data de Instalação</label>
                      <p className="text-sm text-gray-900">{new Date(selectedArmadura.data_instalacao).toLocaleDateString('pt-PT')}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsável</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.responsavel}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Zona</label>
                    <p className="text-sm text-gray-900">{selectedArmadura.zona}</p>
                  </div>
                  {selectedArmadura.fornecedor_nome && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fornecedor</label>
                      <p className="text-sm text-gray-900">{selectedArmadura.fornecedor_nome}</p>
                    </div>
                  )}
                  {selectedArmadura.obra_nome && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Obra</label>
                      <p className="text-sm text-gray-900">{selectedArmadura.obra_nome}</p>
                    </div>
                  )}
                  {selectedArmadura.certificado_qualidade && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Certificado de Qualidade</label>
                      <p className="text-sm text-gray-900">{selectedArmadura.certificado_qualidade}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedArmadura.observacoes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                <p className="text-sm text-gray-900">{selectedArmadura.observacoes}</p>
              </div>
            )}

            {(selectedArmadura.fotos.length > 0 || selectedArmadura.documentos.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ficheiros Anexos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedArmadura.fotos.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Fotos ({selectedArmadura.fotos.length})</h4>
                      <div className="space-y-2">
                        {selectedArmadura.fotos.map((foto) => (
                          <div key={foto.id} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{foto.nome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedArmadura.documentos.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Documentos ({selectedArmadura.documentos.length})</h4>
                      <div className="space-y-2">
                        {selectedArmadura.documentos.map((doc) => (
                          <div key={doc.id} className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{doc.nome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Relatórios */}
      <Modal
        isOpen={showRelatorio}
        onClose={() => setShowRelatorio(false)}
        title="Relatórios de Armaduras"
        size="xl"
      >
        <div className="space-y-6">
          {/* Seletor de Tipo de Relatório */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Relatório</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setTipoRelatorio('executivo')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  tipoRelatorio === 'executivo'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Executivo</span>
                </div>
              </button>
              <button
                onClick={() => setTipoRelatorio('filtrado')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  tipoRelatorio === 'filtrado'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Filter className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Filtrado</span>
                </div>
              </button>
              <button
                onClick={() => setTipoRelatorio('comparativo')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  tipoRelatorio === 'comparativo'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Comparativo</span>
                </div>
              </button>
              <button
                onClick={() => setTipoRelatorio('individual')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  tipoRelatorio === 'individual'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Individual</span>
                </div>
              </button>
            </div>
          </div>

                                {/* Informação sobre seleção */}
                      {armadurasSelecionadas.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                              <span className="text-blue-800 font-medium">
                                {armadurasSelecionadas.length} armadura(s) selecionada(s) para relatório
                              </span>
                            </div>
                            <button
                              onClick={() => setArmadurasSelecionadas([])}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Limpar seleção
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Relatório */}
                      <RelatorioArmadurasPremium
                        armaduras={armaduras}
                        filtros={filters}
                        tipoRelatorio={tipoRelatorio}
                        armaduraEspecifica={tipoRelatorio === 'individual' ? selectedArmadura || undefined : undefined}
                        colunas={{
                          codigo: true,
                          tipo: true,
                          diametro: true,
                          quantidade: true,
                          peso_total: true,
                          fabricante: true,
                          numero_colada: true,
                          estado: true,
                          local_aplicacao: true,
                          responsavel: true,
                          data_rececao: true,
                        }}
                        mostrarCusto={false}
                        onSelecaoChange={setArmadurasSelecionadas}
                      />
        </div>
      </Modal>
    </div>
  );
}
