import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  FileText,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Settings,
  Award,
  Target,
  TrendingUp,
  Users,
  Building2,
  Zap,
  Star,
  CheckSquare,
  AlertCircle,
  CalendarDays,
  PieChart,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Auditoria, EstatisticasAuditoria, FiltrosAuditoria } from '../types/auditorias';
import { auditoriasAPI } from '../lib/supabase-api/auditoriasAPI';
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
import AuditoriaForm from '../components/forms/AuditoriaForm';
import ExportarAuditoria from '../components/ExportarAuditoria';

export default function Auditorias() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<Auditoria | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FiltrosAuditoria>({});
  const [stats, setStats] = useState<EstatisticasAuditoria>({
    total_auditorias: 0,
    auditorias_este_ano: 0,
    auditorias_este_mes: 0,
    percentagem_conformidade_geral: 0,
    nao_conformidades_abertas: 0,
    acoes_corretivas_pendentes: 0,
    auditorias_por_tipo: [],
    conformidade_por_obra: [],
    tendencia_mensal: []
  });

  useEffect(() => {
    loadAuditorias();
    loadStats();
  }, []);

  useEffect(() => {
    filterAuditorias();
  }, [auditorias, searchTerm, filters]);

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      const data = await auditoriasAPI.getAuditorias();
      setAuditorias(data);
    } catch (error) {
      console.error('Erro ao carregar auditorias:', error);
      toast.error('Erro ao carregar auditorias');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await auditoriasAPI.getEstatisticas();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const filterAuditorias = () => {
    let filtered = auditorias;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.escopo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.obra_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.auditor_principal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.tipo) {
      filtered = filtered.filter(a => a.tipo === filters.tipo);
    }

    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }

    if (filters.resultado) {
      filtered = filtered.filter(a => a.resultado === filters.resultado);
    }

    if (filters.classificacao) {
      filtered = filtered.filter(a => a.classificacao === filters.classificacao);
    }

    setFilteredAuditorias(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programada': return 'text-blue-600 bg-blue-100';
      case 'em_curso': return 'text-yellow-600 bg-yellow-100';
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      case 'adiada': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'conforme': return 'text-green-600';
      case 'nao_conforme': return 'text-red-600';
      case 'conforme_com_observacoes': return 'text-yellow-600';
      case 'pendente': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'excelente': return 'text-green-600';
      case 'bom': return 'text-blue-600';
      case 'satisfatorio': return 'text-yellow-600';
      case 'insatisfatorio': return 'text-orange-600';
      case 'critico': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleDeleteAuditoria = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta auditoria?')) {
      try {
        await auditoriasAPI.deleteAuditoria(id);
        toast.success('Auditoria excluída com sucesso!');
        loadAuditorias();
        loadStats();
      } catch (error) {
        console.error('Erro ao excluir auditoria:', error);
        toast.error('Erro ao excluir auditoria');
      }
    }
  };

  const handleSaveAuditoria = (auditoria: Auditoria) => {
    setShowForm(false);
    setSelectedAuditoria(null);
    loadAuditorias();
    loadStats();
  };

  const handleEditAuditoria = (auditoria: Auditoria) => {
    setSelectedAuditoria(auditoria);
    setShowForm(true);
  };

  const handleExportAuditoria = (auditoria: Auditoria) => {
    setSelectedAuditoria(auditoria);
    setShowExport(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      <div className="space-y-8 animate-fade-in">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-sm border-b border-gray-200 mb-8"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Shield className="h-8 w-8 mr-3 text-blue-600" />
                  Auditorias SGQ
                </h1>
                <p className="text-xl text-gray-600 flex items-center mt-2">
                  <Target className="h-5 w-5 mr-2 text-purple-500" />
                  Sistema de Gestão da Qualidade - Auditorias Internas e Externas
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <Plus className="h-5 w-5" />
                  <span>Nova Auditoria</span>
                </button>
                
                <button
                  onClick={() => {/* Implementar exportação */}}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  <Download className="h-5 w-5" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_auditorias}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Ano</p>
                <p className="text-2xl font-bold text-green-600">{stats.auditorias_este_ano}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-purple-600">{stats.auditorias_este_mes}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformidade</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.percentagem_conformidade_geral}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NCs Abertas</p>
                <p className="text-2xl font-bold text-red-600">{stats.nao_conformidades_abertas}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ações Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.acoes_corretivas_pendentes}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </motion.div>

        {/* Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Gráfico de Pizza - Auditorias por Tipo */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auditorias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={stats.auditorias_por_tipo}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                >
                  {stats.auditorias_por_tipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras - Conformidade por Obra */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conformidade por Obra</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.conformidade_por_obra}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="obra" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentagem" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar auditorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filters.tipo || ''}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value || undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Tipos</option>
              <option value="interna">Interna</option>
              <option value="externa">Externa</option>
              <option value="certificacao">Certificação</option>
              <option value="seguimento">Seguimento</option>
              <option value="surpresa">Surpresa</option>
            </select>
            
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Status</option>
              <option value="programada">Programada</option>
              <option value="em_curso">Em Curso</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
              <option value="adiada">Adiada</option>
            </select>
            
            <select
              value={filters.resultado || ''}
              onChange={(e) => setFilters({ ...filters, resultado: e.target.value || undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os Resultados</option>
              <option value="conforme">Conforme</option>
              <option value="nao_conforme">Não Conforme</option>
              <option value="conforme_com_observacoes">Conforme com Observações</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </motion.div>

        {/* Lista de Auditorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auditoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classificação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conformidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAuditorias.map((auditoria) => (
                  <motion.tr
                    key={auditoria.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{auditoria.codigo}</div>
                          <div className="text-sm text-gray-500">{auditoria.escopo}</div>
                          <div className="text-sm text-gray-500">{auditoria.obra_nome}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auditoria.status)}`}>
                        {auditoria.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getResultadoColor(auditoria.resultado)}`}>
                        {auditoria.resultado}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getClassificacaoColor(auditoria.classificacao)}`}>
                        {auditoria.classificacao}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${auditoria.percentagem_conformidade}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{auditoria.percentagem_conformidade}%</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAuditoria(auditoria);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditAuditoria(auditoria)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Editar auditoria"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExportAuditoria(auditoria)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="Exportar auditoria"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAuditoria(auditoria.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Excluir auditoria"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAuditorias.length === 0 && (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma auditoria encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(f => f !== '' && f !== undefined)
                  ? 'Tente ajustar os filtros de pesquisa.'
                  : 'Comece criando uma nova auditoria.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Formulário de Nova/Editar Auditoria */}
      {showForm && (
        <AuditoriaForm
          auditoria={selectedAuditoria}
          onSave={handleSaveAuditoria}
          onCancel={() => {
            setShowForm(false);
            setSelectedAuditoria(null);
          }}
        />
      )}

      {/* Componente de Exportação */}
      {showExport && selectedAuditoria && (
        <ExportarAuditoria
          auditoria={selectedAuditoria}
          onClose={() => {
            setShowExport(false);
            setSelectedAuditoria(null);
          }}
        />
      )}
    </div>
  );
}
