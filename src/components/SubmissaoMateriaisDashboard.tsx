import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  PieLabel
} from 'recharts';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Activity,
  Zap,
  Shield,
  Eye,
  BarChart3,
  Calendar,
  Users,
  Building,
  FileText,
  Download,
  Filter,
  Search,
  Settings,
  RefreshCw,
  Award,
  TrendingDown,
  Percent,
  Hash,
  Thermometer,
  Gauge,
  Layers,
  AlertCircle,
  Clock3,
  CheckSquare,
  Square,
  Upload,
  Star,
  DollarSign,
  CalendarDays,
  Tag,
  FileCheck,
  FileX,
  FileClock
} from 'lucide-react';
import { SubmissaoMateriaisServices, SubmissaoMateriaisEnhancements } from '../lib/submissao-materiais-enhancements';
import { AdvancedSearchBar } from './AdvancedSearchBar';
import { submissaoMateriaisCache } from '../lib/submissao-materiais-cache';
import { PDFService } from '@/services/pdfService';
import toast from 'react-hot-toast';

interface SubmissaoMateriaisDashboardProps {
  submissoes: any[];
  onSearch: (query: string, options: any) => void;
  onFilterChange: (filters: any) => void;
}

const COLORS = {
  aprovado: '#10B981',
  rejeitado: '#EF4444',
  pendente: '#F59E0B',
  em_revisao: '#3B82F6',
  submetido: '#8B5CF6',
  rascunho: '#6B7280',
  critica: '#DC2626',
  alta: '#F97316',
  media: '#F59E0B',
  baixa: '#10B981',
  urgente: '#EF4444',
  normal: '#6B7280',
  muito_urgente: '#7C2D12',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  orange: '#F97316',
  teal: '#14B8A6'
};

const GRADIENT_COLORS = {
  primary: ['#3B82F6', '#1D4ED8'],
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  danger: ['#EF4444', '#DC2626'],
  purple: ['#8B5CF6', '#7C3AED'],
  teal: ['#14B8A6', '#0D9488']
};

export const SubmissaoMateriaisDashboard: React.FC<SubmissaoMateriaisDashboardProps> = ({
  submissoes,
  onSearch,
  onFilterChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'enhancements' | 'reports'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [enhancements, setEnhancements] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnhancement, setSelectedEnhancement] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const pdfService = new PDFService();

  // Funções para gerar relatórios
  const handleGeneratePerformanceReport = async () => {
    setLoadingReport('performance');
    try {
      await pdfService.generateSubmissaoMateriaisPerformanceReport(submissoes);
      toast.success('Relatório de Performance gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório de performance:', error);
      toast.error('Erro ao gerar relatório de performance');
    } finally {
      setLoadingReport(null);
    }
  };

  const handleGenerateTrendsReport = async () => {
    setLoadingReport('trends');
    try {
      await pdfService.generateSubmissaoMateriaisTrendsReport(submissoes);
      toast.success('Relatório de Tendências gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório de tendências:', error);
      toast.error('Erro ao gerar relatório de tendências');
    } finally {
      setLoadingReport(null);
    }
  };

  const handleGenerateAnomaliesReport = async () => {
    setLoadingReport('anomalies');
    try {
      await pdfService.generateSubmissaoMateriaisAnomaliesReport(submissoes);
      toast.success('Relatório de Anomalias gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório de anomalias:', error);
      toast.error('Erro ao gerar relatório de anomalias');
    } finally {
      setLoadingReport(null);
    }
  };

  useEffect(() => {
    console.log("🔍 SubmissaoMateriaisDashboard - Dados recebidos:", submissoes);
    
    if (submissoes && submissoes.length > 0) {
      const calculatedMetrics = SubmissaoMateriaisServices.calculateMetrics(submissoes);
      setMetrics(calculatedMetrics);
      console.log("📊 Métricas calculadas:", calculatedMetrics);
    }

    const allEnhancements = SubmissaoMateriaisEnhancements.getAll();
    setEnhancements(allEnhancements);
  }, [submissoes]);

  const handleSearch = (query: string, options: any) => {
    setSearchQuery(query);
    onSearch(query, options);
  };

  const handleEnhancementClick = (enhancement: any) => {
    setSelectedEnhancement(enhancement);
  };

  const getEstadoColor = (estado: string) => {
    return COLORS[estado as keyof typeof COLORS] || COLORS.primary;
  };

  const getPrioridadeColor = (prioridade: string) => {
    return COLORS[prioridade as keyof typeof COLORS] || COLORS.primary;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatDays = (days: number) => {
    return `${days.toFixed(1)} dias`;
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  // Dados para gráficos
  const estadoData = [
    { name: 'Aprovadas', value: metrics.aprovadas, color: COLORS.aprovado },
    { name: 'Rejeitadas', value: metrics.rejeitadas, color: COLORS.rejeitado },
    { name: 'Pendentes', value: metrics.pendentes, color: COLORS.pendente },
    { name: 'Em Revisão', value: metrics.emRevisao, color: COLORS.em_revisao }
  ];

  const prioridadeData = [
    { name: 'Crítica', value: metrics.criticas, color: COLORS.critica },
    { name: 'Alta', value: metrics.altas, color: COLORS.alta },
    { name: 'Média', value: metrics.medias, color: COLORS.media },
    { name: 'Baixa', value: metrics.baixas, color: COLORS.baixa }
  ];

  const trendData = metrics.tendencias || [];

  return (
    <div className="space-y-6">
      {/* Header com Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Submissão de Materiais</h2>
              <p className="text-gray-600">Analytics e métricas avançadas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AdvancedSearchBar
              onSearch={handleSearch}
              placeholder="Pesquisar submissões..."
              className="w-80"
            />
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'enhancements', label: 'Melhorias', icon: TrendingUp },
            { id: 'reports', label: 'Relatórios', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* KPIs Principais */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Submissões</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{metrics.total}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>+8% este mês</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Taxa Aprovação</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{metrics.taxaAprovacao.toFixed(1)}%</h3>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>+3% este mês</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Tempo Médio</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatDays(metrics.tempoMedioAprovacao)}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                <span>-1.5 dias este mês</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">Urgentes</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{metrics.urgentes}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                <span>Requer atenção</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Estado */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Estado</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {estadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Prioridade */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Prioridade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prioridadeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {prioridadeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tendências Temporais */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências Mensais</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="aprovadas" stroke="#10B981" strokeWidth={2} name="Aprovadas" />
                  <Line type="monotone" dataKey="pendentes" stroke="#F59E0B" strokeWidth={2} name="Pendentes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'enhancements' && (
          <div className="space-y-6">
            {/* Roadmap de Melhorias */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap de Melhorias</h3>
              <div className="space-y-4">
                {SubmissaoMateriaisEnhancements.getRoadmap().map((phase, phaseIndex) => (
                  <div key={phaseIndex} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{phase.phase}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {phase.enhancements.map((enhancement) => (
                        <div
                          key={enhancement.id}
                          onClick={() => handleEnhancementClick(enhancement)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{enhancement.title}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              enhancement.impact === 'high' ? 'bg-red-100 text-red-700' :
                              enhancement.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {enhancement.impact}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{enhancement.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Esforço: {enhancement.effort}</span>
                            <span className="text-xs text-gray-500">Status: {enhancement.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anomalias Detetadas */}
            {metrics.anomalias && metrics.anomalias.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomalias Detetadas</h3>
                <div className="space-y-3">
                  {metrics.anomalias.map((anomalia: any, index: number) => (
                    <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-red-900">{anomalia.tipo}</p>
                            <p className="text-sm text-red-700">{anomalia.descricao}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                          Investigar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Relatórios Rápidos */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Rápidos</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleGeneratePerformanceReport}
                  disabled={loadingReport === 'performance'}
                  className={`w-full p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left ${
                    loadingReport === 'performance' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Relatório de Performance</p>
                      <p className="text-sm text-gray-600">Métricas e KPIs mensais</p>
                    </div>
                    {loadingReport === 'performance' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    ) : (
                      <Download className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <button 
                  onClick={handleGenerateTrendsReport}
                  disabled={loadingReport === 'trends'}
                  className={`w-full p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left ${
                    loadingReport === 'trends' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Análise de Tendências</p>
                      <p className="text-sm text-gray-600">Padrões e previsões</p>
                    </div>
                    {loadingReport === 'trends' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    ) : (
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <button 
                  onClick={handleGenerateAnomaliesReport}
                  disabled={loadingReport === 'anomalies'}
                  className={`w-full p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left ${
                    loadingReport === 'anomalies' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Relatório de Anomalias</p>
                      <p className="text-sm text-gray-600">Itens que requerem atenção</p>
                    </div>
                    {loadingReport === 'anomalies' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Métricas Detalhadas */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Detalhadas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Impacto Total de Custo</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(metrics.impactoCustoTotal)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Impacto Total de Prazo</span>
                  <span className="font-semibold text-gray-900">{metrics.impactoPrazoTotal} dias</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Submissões por Mês</span>
                  <span className="font-semibold text-gray-900">{Math.round(metrics.total / 3)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Taxa de Urgência</span>
                  <span className="font-semibold text-gray-900">{((metrics.urgentes / metrics.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Estatísticas do Cache */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Inteligente</h3>
              <div className="space-y-4">
                {(() => {
                  const cacheStats = submissaoMateriaisCache.getStats();
                  return (
                    <>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Entradas no Cache</span>
                        <span className="font-semibold text-green-900">{cacheStats.totalEntries}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Taxa de Hit</span>
                        <span className="font-semibold text-blue-900">{(cacheStats.hitRate * 100).toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Uso de Memória</span>
                        <span className="font-semibold text-purple-900">{(cacheStats.memoryUsage / 1024).toFixed(1)} KB</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-gray-700">Entradas Válidas</span>
                        <span className="font-semibold text-orange-900">{cacheStats.validEntries}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Melhoria */}
      {selectedEnhancement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{selectedEnhancement.title}</h3>
                <button
                  onClick={() => setSelectedEnhancement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                  <p className="text-gray-600">{selectedEnhancement.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Implementação</h4>
                  <p className="text-gray-600">{selectedEnhancement.implementation}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Impacto</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedEnhancement.impact === 'high' ? 'bg-red-100 text-red-700' :
                      selectedEnhancement.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedEnhancement.impact}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Esforço</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedEnhancement.effort === 'high' ? 'bg-red-100 text-red-700' :
                      selectedEnhancement.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedEnhancement.effort}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {selectedEnhancement.status}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedEnhancement(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Implementar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
