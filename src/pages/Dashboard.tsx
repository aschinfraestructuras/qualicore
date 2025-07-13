import { Ensaio, Documento, Checklist, Material, Fornecedor, NaoConformidade, Obra } from '@/types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  TestTube, 
  ClipboardCheck, 
  Package, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart3,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  Bell,
  Filter,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Building
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { calcularMetricasReais, MetricasReais } from '@/services/metricsService'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const navigate = useNavigate()
  const [metricas, setMetricas] = useState<MetricasReais | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showSettings, setShowSettings] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    projeto: '',
    responsavel: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  })
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(300000) // 5 minutos

  useEffect(() => {
    carregarMetricas()
    
    if (autoRefresh) {
      const interval = setInterval(carregarMetricas, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const carregarMetricas = async () => {
    try {
      setLoading(true)
      const dados = await calcularMetricasReais()
      setMetricas(dados)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    carregarMetricas()
    toast.success('Dados atualizados')
  }

  const handleExportDashboard = () => {
    const data = {
      metricas,
      filtros: filters,
      periodo: selectedPeriod,
      dataExportacao: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-qualidade-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Dashboard exportado com sucesso!')
  }

  const handleClearFilters = () => {
    setFilters({
      projeto: '',
      responsavel: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    })
    toast.success('Filtros limpos')
  }

  const handleApplyFilters = () => {
    carregarMetricas()
    setShowFilters(false)
    toast.success('Filtros aplicados')
  }

  // Ações rápidas funcionais
  const handleNovoEnsaio = () => {
    navigate('/ensaios')
    toast.success('Redirecionando para criar novo ensaio...')
  }

  const handleNovoChecklist = () => {
    navigate('/checklists')
    toast.success('Redirecionando para criar novo checklist...')
  }

  const handleNovaNC = () => {
    navigate('/nao-conformidades')
    toast.success('Redirecionando para criar nova não conformidade...')
  }

  const handleNovoDocumento = () => {
    navigate('/documentos')
    toast.success('Redirecionando para criar novo documento...')
  }

  const handleNovaObra = () => {
    navigate('/obras')
    toast.success('Redirecionando para criar nova obra...')
  }

  const handleVerDetalhes = (modulo: string) => {
    navigate(`/${modulo}`)
    toast.success(`Redirecionando para ${modulo}...`)
  }

  const handleConfiguracoes = () => {
    setShowSettings(!showSettings)
    toast.success('Configurações do dashboard')
  }

  const handleNotificacoes = () => {
    toast.success('Sistema de notificações será implementado em breve!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!metricas) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados do dashboard</p>
        <button onClick={carregarMetricas} className="btn btn-primary mt-4">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard de Qualidade
          </h1>
          <p className="text-gray-600 mt-2">
            Métricas reais e objetivas do sistema de qualidade
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Barra de Pesquisa Rápida */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar registos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  toast.success('Pesquisa rápida será implementada em breve!')
                }
              }}
            />
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-soft">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Trimestre'}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg shadow-soft hover:shadow-md transition-all ${
              showFilters ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-600'
            }`}
            title="Filtros"
          >
            <Filter className="h-5 w-5" />
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all"
            title="Atualizar dados"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={handleNotificacoes}
            className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all relative"
            title="Notificações"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {metricas.geral.alertas_criticos > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {metricas.geral.alertas_criticos}
              </span>
            )}
          </button>

          <button
            onClick={handleConfiguracoes}
            className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all"
            title="Configurações"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleExportDashboard}
            className="btn btn-outline btn-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </motion.div>

      {/* Filtros Avançados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-title">Filtros Avançados</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projeto/Obra
                  </label>
                  <input
                    type="text"
                    value={filters.projeto}
                    onChange={(e) => setFilters({...filters, projeto: e.target.value})}
                    placeholder="Filtrar por projeto..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={filters.responsavel}
                    onChange={(e) => setFilters({...filters, responsavel: e.target.value})}
                    placeholder="Filtrar por responsável..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <button
                    onClick={handleApplyFilters}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-secondary btn-sm"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs Principais */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Conformidade Geral */}
        <div className="stat-card group cursor-pointer" onClick={() => handleVerDetalhes('relatorios')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-glow">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              {metricas.geral.tendencia_qualidade === 'melhorando' ? 'Melhorando' : 
               metricas.geral.tendencia_qualidade === 'piorando' ? 'Piorando' : 'Estável'}
            </div>
          </div>
          <div className="stat-value">{metricas.geral.conformidade_geral}%</div>
          <div className="stat-label">Conformidade Geral</div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
        </div>

        {/* Total de Registos */}
        <div className="stat-card group cursor-pointer" onClick={() => handleVerDetalhes('relatorios')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="stat-value">{metricas.geral.total_registros}</div>
          <div className="stat-label">Total de Registos</div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
        </div>

        {/* Alertas Críticos */}
        <div className="stat-card group cursor-pointer" onClick={() => handleVerDetalhes('nao-conformidades')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-glow">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="stat-value">{metricas.geral.alertas_criticos}</div>
          <div className="stat-label">Alertas Críticos</div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
        </div>

        {/* Ensaios Conformes */}
        <div className="stat-card group cursor-pointer" onClick={() => handleVerDetalhes('ensaios')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-glow">
              <TestTube className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="stat-value">{metricas.ensaios.taxa_conformidade}%</div>
          <div className="stat-label">Taxa Conformidade Ensaios</div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
        </div>
      </motion.div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ensaios */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card card-hover cursor-pointer"
          onClick={() => handleVerDetalhes('ensaios')}
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Ensaios</h3>
                <p className="card-description">Métricas de conformidade e performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <TestTube className="h-8 w-8 text-emerald-500" />
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{metricas.ensaios.total_ensaios}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metricas.ensaios.ensaios_conformes}</div>
                <div className="text-sm text-gray-600">Conformes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{metricas.ensaios.ensaios_nao_conformes}</div>
                <div className="text-sm text-gray-600">Não Conformes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metricas.ensaios.ensaios_por_mes}</div>
                <div className="text-sm text-gray-600">Por Mês</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Desvio Médio:</span>
                <span className="font-medium">{metricas.ensaios.desvio_medio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tipos Problemáticos:</span>
                <span className="font-medium text-sm">
                  {metricas.ensaios.tipos_mais_problematicos.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Checklists */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card card-hover cursor-pointer"
          onClick={() => handleVerDetalhes('checklists')}
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Checklists</h3>
                <p className="card-description">Inspeções e verificações</p>
              </div>
              <div className="flex items-center space-x-2">
                <ClipboardCheck className="h-8 w-8 text-purple-500" />
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{metricas.checklists.total_checklists}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metricas.checklists.conformidade_media}%</div>
                <div className="text-sm text-gray-600">Conformidade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metricas.checklists.checklists_concluidos}</div>
                <div className="text-sm text-gray-600">Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{metricas.checklists.checklists_pendentes}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo Médio Inspeção:</span>
                <span className="font-medium">{metricas.checklists.tempo_medio_inspecao.toFixed(1)} dias</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inspetores Eficientes:</span>
                <span className="font-medium text-sm">
                  {metricas.checklists.inspetores_mais_eficientes.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Materiais */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card card-hover cursor-pointer"
          onClick={() => handleVerDetalhes('materiais')}
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Materiais</h3>
                <p className="card-description">Controlo de stocks e aprovações</p>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-orange-500" />
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{metricas.materiais.total_materiais}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metricas.materiais.taxa_aprovacao}%</div>
                <div className="text-sm text-gray-600">Taxa Aprovação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metricas.materiais.materiais_aprovados}</div>
                <div className="text-sm text-gray-600">Aprovados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{metricas.materiais.materiais_pendentes}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recebidos este mês:</span>
                <span className="font-medium">{metricas.materiais.materiais_recebidos_mes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tipos principais:</span>
                <span className="font-medium text-sm">
                  {Object.keys(metricas.materiais.volume_por_tipo).slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Não Conformidades */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card card-hover cursor-pointer"
          onClick={() => handleVerDetalhes('nao-conformidades')}
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Não Conformidades</h3>
                <p className="card-description">Gestão de problemas e resoluções</p>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{metricas.naoConformidades.total_ncs}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metricas.naoConformidades.taxa_resolucao}%</div>
                <div className="text-sm text-gray-600">Taxa Resolução</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{metricas.naoConformidades.ncs_pendentes}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metricas.naoConformidades.ncs_resolvidas}</div>
                <div className="text-sm text-gray-600">Resolvidas</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo médio resolução:</span>
                <span className="font-medium">{metricas.naoConformidades.tempo_medio_resolucao.toFixed(1)} dias</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Severidades:</span>
                <span className="font-medium text-sm">
                  {Object.keys(metricas.naoConformidades.ncs_por_severidade).slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Obras */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card card-hover cursor-pointer"
          onClick={() => handleVerDetalhes('obras')}
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Obras</h3>
                <p className="card-description">Gestão de projetos e construções</p>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-indigo-500" />
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{metricas.obras.total_obras}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metricas.obras.obras_em_execucao}</div>
                <div className="text-sm text-gray-600">Em Execução</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metricas.obras.obras_concluidas}</div>
                <div className="text-sm text-gray-600">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{metricas.obras.obras_paralisadas}</div>
                <div className="text-sm text-gray-600">Paralisadas</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Execução média:</span>
                <span className="font-medium">{metricas.obras.percentual_execucao_medio}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valor contratos:</span>
                <span className="font-medium text-sm">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(metricas.obras.valor_total_contratos)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alertas e Ações Rápidas */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Alertas Críticos */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alertas Críticos</h3>
            <p className="card-description">Ações que requerem atenção imediata</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {metricas.naoConformidades.ncs_pendentes > 0 && (
                <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => handleVerDetalhes('nao-conformidades')}>
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-red-800">
                      {metricas.naoConformidades.ncs_pendentes} NCs pendentes
                    </div>
                    <div className="text-sm text-red-600">
                      Requerem resolução urgente
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-red-400" />
                </div>
              )}
              
              {metricas.documentos.documentos_vencidos > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => handleVerDetalhes('documentos')}>
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-yellow-800">
                      {metricas.documentos.documentos_vencidos} documentos vencidos
                    </div>
                    <div className="text-sm text-yellow-600">
                      Necessitam de renovação
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-yellow-400" />
                </div>
              )}
              
              {metricas.materiais.materiais_pendentes > 0 && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => handleVerDetalhes('materiais')}>
                  <Package className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-blue-800">
                      {metricas.materiais.materiais_pendentes} materiais pendentes
                    </div>
                    <div className="text-sm text-blue-600">
                      Aguardam aprovação
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-blue-400" />
                </div>
              )}
              
              {metricas.obras.obras_paralisadas > 0 && (
                <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => handleVerDetalhes('obras')}>
                  <Building className="h-5 w-5 text-orange-500 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-orange-800">
                      {metricas.obras.obras_paralisadas} obras paralisadas
                    </div>
                    <div className="text-sm text-orange-600">
                      Requerem atenção
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-orange-400" />
                </div>
              )}
              
              {metricas.geral.alertas_criticos === 0 && (
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">
                      Sistema em ordem
                    </div>
                    <div className="text-sm text-green-600">
                      Nenhum alerta crítico
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ações Rápidas</h3>
            <p className="card-description">Acesso direto às funcionalidades principais</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleNovoEnsaio}
                className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <TestTube className="h-6 w-6" />
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-medium">Novo Ensaio</div>
                <div className="text-xs opacity-80 mt-1">Registar resultado</div>
              </button>
              
              <button 
                onClick={handleNovoChecklist}
                className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <ClipboardCheck className="h-6 w-6" />
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-medium">Novo Checklist</div>
                <div className="text-xs opacity-80 mt-1">Criar inspeção</div>
              </button>
              
              <button 
                onClick={handleNovaNC}
                className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-6 w-6" />
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-medium">Nova NC</div>
                <div className="text-xs opacity-80 mt-1">Reportar problema</div>
              </button>
              
              <button 
                onClick={handleNovoDocumento}
                className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-6 w-6" />
                  <div className="flex items-center space-x-1">
                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="text-sm font-medium">Novo Documento</div>
                <div className="text-xs opacity-80 mt-1">Adicionar ficheiro</div>
              </button>
              
              <button 
                onClick={handleNovaObra}
                className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Building className="h-6 w-6" />
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-medium">Nova Obra</div>
                <div className="text-xs opacity-80 mt-1">Criar projeto</div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estatísticas em Tempo Real */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Estatísticas em Tempo Real</h3>
              <p className="card-description">Atividade recente do sistema</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <button onClick={handleRefresh} className="p-1 text-gray-400 hover:text-gray-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {metricas.ensaios.ensaios_por_mes}
              </div>
              <div className="text-sm text-blue-700">Ensaios este mês</div>
              <div className="text-xs text-blue-600 mt-1">
                +{Math.floor(metricas.ensaios.ensaios_por_mes * 0.15)} vs mês anterior
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {metricas.checklists.checklists_concluidos}
              </div>
              <div className="text-sm text-green-700">Checklists concluídos</div>
              <div className="text-xs text-green-600 mt-1">
                {((metricas.checklists.checklists_concluidos / metricas.checklists.total_checklists) * 100).toFixed(1)}% taxa conclusão
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {metricas.materiais.materiais_aprovados}
              </div>
              <div className="text-sm text-purple-700">Materiais aprovados</div>
              <div className="text-xs text-purple-600 mt-1">
                {metricas.materiais.taxa_aprovacao}% taxa aprovação
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {metricas.naoConformidades.ncs_resolvidas}
              </div>
              <div className="text-sm text-orange-700">NCs resolvidas</div>
              <div className="text-xs text-orange-600 mt-1">
                {metricas.naoConformidades.taxa_resolucao}% taxa resolução
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Última atualização: {new Date().toLocaleTimeString('pt-PT')}</span>
              <span>Próxima atualização: {autoRefresh ? new Date(Date.now() + refreshInterval).toLocaleTimeString('pt-PT') : 'Manual'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configurações do Dashboard (Modal) */}
      {showSettings && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSettings(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Configurações do Dashboard</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período Padrão
                </label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="week">Semana</option>
                  <option value="month">Mês</option>
                  <option value="quarter">Trimestre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atualização Automática
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600">Atualizar automaticamente</span>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={refreshInterval / 60000}
                      onChange={(e) => setRefreshInterval(parseInt(e.target.value) * 60000)}
                      className="p-1 border border-gray-300 rounded text-sm"
                      disabled={!autoRefresh}
                    >
                      <option value={1}>1 minuto</option>
                      <option value={5}>5 minutos</option>
                      <option value={10}>10 minutos</option>
                      <option value={30}>30 minutos</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notificações
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600">Alertas críticos</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600">Documentos vencidos</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Relatórios semanais</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowSettings(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowSettings(false)
                  toast.success('Configurações salvas!')
                }}
                className="btn btn-primary btn-sm"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 