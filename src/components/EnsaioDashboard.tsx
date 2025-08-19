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
  ClipboardList, 
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
  Layers
} from 'lucide-react';
import { EnsaioServices, EnsaioEnhancements } from '../lib/ensaio-enhancements';
import { AdvancedSearchBar } from './AdvancedSearchBar';
import { ReportService } from '../services/reportService';

interface EnsaioDashboardProps {
  ensaios: any[];
  onSearch: (query: string, options: any) => void;
  onFilterChange: (filters: any) => void;
}

const COLORS = {
  aprovado: '#10B981',
  reprovado: '#EF4444',
  pendente: '#F59E0B',
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

export const EnsaioDashboard: React.FC<EnsaioDashboardProps> = ({
  ensaios,
  onSearch,
  onFilterChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'enhancements' | 'reports'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [enhancements, setEnhancements] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [usingMockData, setUsingMockData] = useState(false);

  // Dados mockados padrão
  const defaultMockMetrics = {
    total: 35,
    aprovados: 25,
    reprovados: 5,
    pendentes: 5,
    taxaAprovacao: 83.3,
    tempoMedio: 2.5,
    conformidade: 85.7
  };
  
  const defaultMockTrends = [
    { month: 'Jan', total: 8, aprovados: 7, reprovados: 1, taxaAprovacao: 87.5 },
    { month: 'Fev', total: 12, aprovados: 10, reprovados: 2, taxaAprovacao: 83.3 },
    { month: 'Mar', total: 15, aprovados: 8, reprovados: 2, taxaAprovacao: 80.0 }
  ];

  const defaultMockAnomalies = [
    { id: 1, tipo: 'Taxa de reprovação alta', descricao: 'Betão C25/30 abaixo do especificado', severidade: 'alta', data: '2024-02-15', laboratorio: 'Laboratório Central', taxa: 45, media: 85, diferenca: 40 },
    { id: 2, tipo: 'Tempo de análise longo', descricao: 'Ensaio de solos demorou 5 dias', severidade: 'média', data: '2024-02-10', laboratorio: 'Laboratório Externo', taxa: 60, media: 85, diferenca: 25 }
  ];

  const defaultMockEnhancements = [
    { id: 1, titulo: 'Implementar automação de relatórios', prioridade: 'alta', status: 'pendente', impact: 'high', effort: 'medium', description: 'Automatizar geração de relatórios para reduzir tempo manual', implementation: 'Integrar com sistema de templates e dados em tempo real' },
    { id: 2, titulo: 'Melhorar sistema de alertas', prioridade: 'média', status: 'pendente', impact: 'medium', effort: 'low', description: 'Sistema de notificações para anomalias', implementation: 'Configurar webhooks e notificações push' },
    { id: 3, titulo: 'Integrar com laboratórios externos', prioridade: 'baixa', status: 'pendente', impact: 'low', effort: 'high', description: 'API para comunicação com laboratórios', implementation: 'Desenvolver API REST e sistema de autenticação' }
  ];

  useEffect(() => {
    console.log("🔍 EnsaioDashboard - Dados recebidos:", ensaios);
    
    if (ensaios.length > 0) {
      const calculatedMetrics = EnsaioServices.calculateQualityMetrics(ensaios);
      const calculatedTrends = EnsaioServices.analyzeTrends(ensaios);
      const detectedAnomalies = EnsaioServices.detectAnomalies(ensaios);
      const availableEnhancements = EnsaioEnhancements.getNextRecommendations(5);

      console.log("📊 Métricas calculadas:", calculatedMetrics);
      console.log("📈 Tendências calculadas:", calculatedTrends);

      setMetrics(calculatedMetrics);
      setTrends(calculatedTrends);
      setAnomalies(detectedAnomalies);
      setEnhancements(availableEnhancements);
    } else {
      // Dados mockados para demonstração quando não há dados reais
      console.log("⚠️ Sem dados reais, usando dados mockados para demonstração");
      setUsingMockData(true);
      setMetrics(defaultMockMetrics);
      setTrends(defaultMockTrends);
      setAnomalies(defaultMockAnomalies);
      setEnhancements(defaultMockEnhancements);
    }
  }, [ensaios]);

  const handleSearch = (query: string, options: any) => {
    onSearch(query, options);
  };

  // Funções de geração de relatórios
  const handleGenerateExecutiveReport = async () => {
    try {
      console.log('Iniciando geração do relatório executivo...');
      const reportData = {
        metrics,
        trends,
        anomalies,
        enhancements,
        ensaios
      };
      console.log('Dados do relatório:', reportData);
      console.log('ReportService:', ReportService);
      await ReportService.generateExecutiveReport(reportData);
      console.log('Relatório executivo gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório executivo:', error);
      alert('Erro ao gerar relatório: ' + error.message);
    }
  };

  const handleGenerateAnalyticsReport = async () => {
    try {
      const reportData = {
        metrics,
        trends,
        anomalies,
        enhancements,
        ensaios
      };
      await ReportService.generateAnalyticsReport(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório de analytics:', error);
    }
  };

  const handleGenerateComplianceReport = async () => {
    try {
      const reportData = {
        metrics,
        trends,
        anomalies,
        enhancements,
        ensaios
      };
      await ReportService.generateComplianceReport(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório de conformidade:', error);
    }
  };

  // Dados para gráficos
  const pieData = [
    { name: 'Aprovados', value: 25, color: COLORS.aprovado, fill: COLORS.aprovado },
    { name: 'Reprovados', value: 5, color: COLORS.reprovado, fill: COLORS.reprovado },
    { name: 'Pendentes', value: 5, color: COLORS.pendente, fill: COLORS.pendente }
  ];

  const performanceData = [
    { month: 'Jan', 'Taxa Aprovação': 87.5, 'Total Ensaios': 8, 'Aprovados': 7, 'Reprovados': 1 },
    { month: 'Fev', 'Taxa Aprovação': 83.3, 'Total Ensaios': 12, 'Aprovados': 10, 'Reprovados': 2 },
    { month: 'Mar', 'Taxa Aprovação': 80.0, 'Total Ensaios': 15, 'Aprovados': 8, 'Reprovados': 2 }
  ];

  const radarData = [
    { subject: 'Taxa Aprovação', Atual: 83.3, Objetivo: 80, fullMark: 100 },
    { subject: 'Tempo Médio', Atual: 75, Objetivo: 60, fullMark: 100 },
    { subject: 'Conformidade', Atual: 85, Objetivo: 90, fullMark: 100 },
    { subject: 'Documentação', Atual: 92, Objetivo: 85, fullMark: 100 },
    { subject: 'Auditoria', Atual: 78, Objetivo: 88, fullMark: 100 },
    { subject: 'Qualidade', Atual: 88, Objetivo: 95, fullMark: 100 }
  ];

  // Dados para gráfico de área
  const areaData = [
    { month: 'Jan', 'Taxa Aprovação': 87.5, 'Meta': 80 },
    { month: 'Fev', 'Taxa Aprovação': 83.3, 'Meta': 80 },
    { month: 'Mar', 'Taxa Aprovação': 80.0, 'Meta': 80 }
  ];

  // Dados para gráfico de funil
  const funnelData = [
    { value: 35, name: 'Total Ensaios', fill: COLORS.primary },
    { value: 25, name: 'Aprovados', fill: COLORS.success },
    { value: 5, name: 'Reprovados', fill: COLORS.danger },
    { value: 5, name: 'Pendentes', fill: COLORS.warning }
  ];

  // Dados para gráfico de dispersão
  const scatterData = [
    { x: 8, y: 87.5, month: 'Jan' },
    { x: 12, y: 83.3, month: 'Fev' },
    { x: 15, y: 80.0, month: 'Mar' },
    { x: 18, y: 85.2, month: 'Abr' },
    { x: 22, y: 78.9, month: 'Mai' },
    { x: 25, y: 82.1, month: 'Jun' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm font-semibold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Debug logs
  console.log("🔍 Debug - pieData:", pieData);
  console.log("🔍 Debug - performanceData:", performanceData);
  console.log("🔍 Debug - metrics:", metrics);
  console.log("🔍 Debug - trends:", trends);
  console.log("🔍 Debug - scatterData:", scatterData);
  console.log("🔍 Debug - scatterData length:", scatterData.length);

  // Dados para tabela de tendências
  const tableTrends = [
    { month: 'Jan', total: 8, aprovados: 7, reprovados: 1, taxaAprovacao: 87.5 },
    { month: 'Fev', total: 12, aprovados: 10, reprovados: 2, taxaAprovacao: 83.3 },
    { month: 'Mar', total: 15, aprovados: 8, reprovados: 2, taxaAprovacao: 80.0 }
  ];

  // Dados para anomalias
  const tableAnomalies = [
    { id: 1, tipo: 'Taxa de reprovação alta', descricao: 'Betão C25/30 abaixo do especificado', severidade: 'alta', data: '2024-02-15', laboratorio: 'Laboratório Central', taxa: 45, media: 85, diferenca: 40 },
    { id: 2, tipo: 'Tempo de análise longo', descricao: 'Ensaio de solos demorou 5 dias', severidade: 'média', data: '2024-02-10', laboratorio: 'Laboratório Externo', taxa: 60, media: 85, diferenca: 25 }
  ];

  // Dados para melhorias
  const tableEnhancements = [
    { id: 1, titulo: 'Implementar automação de relatórios', prioridade: 'alta', status: 'pendente', impact: 'high', effort: 'medium', description: 'Automatizar geração de relatórios para reduzir tempo manual', implementation: 'Integrar com sistema de templates e dados em tempo real' },
    { id: 2, titulo: 'Melhorar sistema de alertas', prioridade: 'média', status: 'pendente', impact: 'medium', effort: 'low', description: 'Sistema de notificações para anomalias', implementation: 'Configurar webhooks e notificações push' },
    { id: 3, titulo: 'Integrar com laboratórios externos', prioridade: 'baixa', status: 'pendente', impact: 'low', effort: 'high', description: 'API para comunicação com laboratórios', implementation: 'Desenvolver API REST e sistema de autenticação' }
  ];

  return (
    <div className="space-y-6">
      {/* Header com pesquisa avançada */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Dashboard de Ensaios
              </h1>
              <p className="text-gray-600 text-lg">Análise avançada e métricas de qualidade em tempo real</p>
              {usingMockData && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    Dados de demonstração
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white rounded-xl p-1 shadow-md">
              <button
                onClick={() => setSelectedPeriod('7d')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === '7d' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setSelectedPeriod('30d')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === '30d' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setSelectedPeriod('90d')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === '90d' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                90D
              </button>
              <button
                onClick={() => setSelectedPeriod('1y')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === '1y' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                1A
              </button>
            </div>
          </div>
        </div>

        <AdvancedSearchBar
          onSearch={handleSearch}
          placeholder="Pesquisar ensaios, normas ou laboratórios..."
          tableName="ensaios"
          className="w-full"
        />
      </div>

      {/* Tabs de navegação */}
      <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Visão Geral</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'reports' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Relatórios</span>
          </button>
          <button
            onClick={() => setActiveTab('enhancements')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'enhancements' 
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Melhorias</span>
          </button>
        </div>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12%
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-blue-700 mb-2">Total Ensaios</h3>
              <p className="text-3xl font-bold text-blue-900 mb-1">{metrics?.total || 0}</p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min((metrics?.total || 0) / 100 * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <Target className="h-4 w-4 mr-1" />
                    Meta: 80%
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-green-700 mb-2">Taxa Aprovação</h3>
              <p className="text-3xl font-bold text-green-900 mb-1">{metrics?.taxaAprovacao || 0}%</p>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${metrics?.taxaAprovacao || 0}%` }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-600 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Requer atenção
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-yellow-700 mb-2">Pendentes</h3>
              <p className="text-3xl font-bold text-yellow-900 mb-1">{metrics?.pendentes || 0}</p>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min((metrics?.pendentes || 0) / (metrics?.total || 1) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-red-600 text-sm font-medium">
                    <Shield className="h-4 w-4 mr-1" />
                    Crítico
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-red-700 mb-2">Reprovados</h3>
              <p className="text-3xl font-bold text-red-900 mb-1">{metrics?.reprovados || 0}</p>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min((metrics?.reprovados || 0) / (metrics?.total || 1) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Resultado */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Distribuição por Resultado</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Aprovados</span>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Reprovados</span>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Pendentes</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Performance ao Longo do Tempo */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Performance Mensal</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Taxa Aprovação</span>
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Total Ensaios</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="Taxa Aprovação" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Bar 
                    dataKey="Total Ensaios" 
                    fill={COLORS.secondary} 
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Anomalias */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              Anomalias Detetadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tableAnomalies.map((anomaly, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-red-800">Laboratório: {anomaly.laboratorio}</h4>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-medium">
                      Crítico
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Taxa de aprovação:</span>
                      <span className="font-semibold text-red-800">{anomaly.taxa}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Média geral:</span>
                      <span className="font-semibold text-red-800">{anomaly.media}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Diferença:</span>
                      <span className="font-semibold text-red-800">-{anomaly.diferenca}%</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-red-600 text-white text-xs py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Investigar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Análise de Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                <Radar 
                  name="Atual" 
                  dataKey="Atual" 
                  stroke={COLORS.primary} 
                  fill={COLORS.primary} 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="Objetivo" 
                  dataKey="Objetivo" 
                  stroke={COLORS.secondary} 
                  fill={COLORS.secondary} 
                  fillOpacity={0.3} 
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráficos adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funil de Conversão */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Funil de Conversão</h3>
                             <ResponsiveContainer width="100%" height={300}>
                 <FunnelChart>
                   <Tooltip content={<CustomTooltip />} />
                   <Funnel
                     dataKey="value"
                     data={funnelData}
                     isAnimationActive
                   />
                 </FunnelChart>
               </ResponsiveContainer>
            </div>

            {/* Dispersão */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Correlação: Volume vs Taxa</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart 
                  width={400} 
                  height={300} 
                  data={scatterData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Total Ensaios"
                    stroke="#6b7280"
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Taxa Aprovação"
                    stroke="#6b7280"
                    domain={['dataMin - 5', 'dataMax + 5']}
                    unit="%"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any, name: string) => [
                      name === 'x' ? `${value} ensaios` : `${value}%`,
                      name === 'x' ? 'Total Ensaios' : 'Taxa Aprovação'
                    ]}
                    labelFormatter={(label: string) => `Mês: ${label}`}
                  />
                  <Scatter 
                    name="Dados" 
                    dataKey="y" 
                    fill={COLORS.primary}
                    r={8}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabela de Tendências */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tendências Mensais</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mês
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aprovados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reprovados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Aprovação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableTrends.map((trend, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trend.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trend.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {trend.aprovados}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {trend.reprovados}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          trend.taxaAprovacao >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : trend.taxaAprovacao >= 60 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trend.taxaAprovacao}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {trend.taxaAprovacao >= 80 ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : trend.taxaAprovacao >= 60 ? (
                            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className={`text-sm font-medium ${
                            trend.taxaAprovacao >= 80 
                              ? 'text-green-600' 
                              : trend.taxaAprovacao >= 60 
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {trend.taxaAprovacao >= 80 ? 'Excelente' : trend.taxaAprovacao >= 60 ? 'Bom' : 'Necessita Melhoria'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Relatórios Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Relatório Executivo</h4>
                <p className="text-blue-700 text-sm mb-4">Visão geral dos KPIs e métricas principais</p>
                <button onClick={handleGenerateExecutiveReport} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Relatório de Analytics</h4>
                <p className="text-green-700 text-sm mb-4">Análise detalhada com gráficos e tendências</p>
                <button onClick={handleGenerateAnalyticsReport} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">Relatório de Conformidade</h4>
                <p className="text-purple-700 text-sm mb-4">Análise de conformidade com normas EN/ISO</p>
                <button onClick={handleGenerateComplianceReport} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'enhancements' && (
        <div className="space-y-6">
          {/* Progresso das Melhorias */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Melhorias Recomendadas</h3>
            <div className="space-y-4">
              {tableEnhancements.map((enhancement) => (
                <div key={enhancement.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg">{enhancement.titulo}</h4>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          enhancement.impact === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : enhancement.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {enhancement.impact}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          enhancement.effort === 'low' 
                            ? 'bg-green-100 text-green-800' 
                            : enhancement.effort === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {enhancement.effort}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{enhancement.description}</p>
                      <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">{enhancement.implementation}</p>
                    </div>
                    <button className="ml-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      Implementar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas de Progresso */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Progresso das Melhorias</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-sm text-gray-600">Total de Melhorias</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <div className="text-sm text-gray-600">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">2</div>
                <div className="text-sm text-gray-600">Em Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">7</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progresso Geral</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
