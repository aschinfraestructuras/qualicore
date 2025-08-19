import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import PDFService from '../services/pdfService';
import toast from 'react-hot-toast';

interface NaoConformidadeDashboardProps {
  naoConformidades: any[];
  onSearch: (query: string, options?: any) => void;
  onFilterChange: (filters: any) => void;
}

const COLORS = {
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  critical: '#DC2626',
  low: '#6B7280',
  medium: '#F59E0B',
  high: '#EF4444'
};

const GRADIENT_COLORS = {
  blue: ['#3B82F6', '#1D4ED8'],
  green: ['#10B981', '#059669'],
  orange: ['#F59E0B', '#D97706'],
  red: ['#EF4444', '#DC2626'],
  purple: ['#8B5CF6', '#7C3AED'],
  teal: ['#14B8A6', '#0D9488']
};

export default function NaoConformidadeDashboard({ 
  naoConformidades, 
  onSearch, 
  onFilterChange 
}: NaoConformidadeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'enhancements' | 'reports'>('overview');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular métricas
  const calculateMetrics = () => {
    console.log('NaoConformidadeDashboard: Calculando métricas com', naoConformidades.length, 'NCs');
    if (!naoConformidades.length) {
      console.log('NaoConformidadeDashboard: Nenhuma NC encontrada');
      setMetrics({
        total: 0,
        pendentes: 0,
        resolvidas: 0,
        criticas: 0,
        esteMes: 0,
        esteAno: 0,
        porTipo: {},
        porSeveridade: {},
        porCategoria: {},
        porArea: {},
        evolucaoTemporal: [],
        custoTotal: 0,
        tempoMedioResolucao: 0
      });
      return;
    }

    const total = naoConformidades.length;
    const pendentes = naoConformidades.filter(nc => !nc.data_resolucao).length;
    const resolvidas = naoConformidades.filter(nc => nc.data_resolucao).length;
    const criticas = naoConformidades.filter(nc => nc.severidade === 'critica').length;
    
    // Este mês
    const esteMes = naoConformidades.filter(nc => {
      const data = new Date(nc.data_deteccao);
      const hoje = new Date();
      return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
    }).length;

    // Este ano
    const esteAno = naoConformidades.filter(nc => {
      const data = new Date(nc.data_deteccao);
      const hoje = new Date();
      return data.getFullYear() === hoje.getFullYear();
    }).length;

    // Por tipo
    const porTipo = naoConformidades.reduce((acc, nc) => {
      const tipo = nc.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por severidade
    const porSeveridade = naoConformidades.reduce((acc, nc) => {
      const severidade = nc.severidade || 'Não especificado';
      acc[severidade] = (acc[severidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por categoria
    const porCategoria = naoConformidades.reduce((acc, nc) => {
      const categoria = nc.categoria || 'Não especificado';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por área afetada
    const porArea = naoConformidades.reduce((acc, nc) => {
      const area = nc.area_afetada || 'Não especificado';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Custo total
    const custoTotal = naoConformidades.reduce((total, nc) => {
      return total + (nc.custo_real || 0) + (nc.custo_estimado || 0);
    }, 0);

    // Tempo médio de resolução (em dias)
    const ncsResolvidas = naoConformidades.filter(nc => nc.data_resolucao && nc.data_deteccao);
    const tempoMedioResolucao = ncsResolvidas.length > 0 
      ? ncsResolvidas.reduce((total, nc) => {
          const deteccao = new Date(nc.data_deteccao);
          const resolucao = new Date(nc.data_resolucao);
          return total + (resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / ncsResolvidas.length
      : 0;

    // Evolução temporal (últimos 12 meses)
    const evolucaoTemporal = [];
    for (let i = 11; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = data.toLocaleString('pt-PT', { month: 'short' });
      const count = naoConformidades.filter(nc => {
        const dataNC = new Date(nc.data_deteccao);
        return dataNC.getMonth() === data.getMonth() && dataNC.getFullYear() === data.getFullYear();
      }).length;
      evolucaoTemporal.push({ mes, count });
    }

    setMetrics({
      total,
      pendentes,
      resolvidas,
      criticas,
      esteMes,
      esteAno,
      porTipo,
      porSeveridade,
      porCategoria,
      porArea,
      evolucaoTemporal,
      custoTotal,
      tempoMedioResolucao
    });
  };

  useEffect(() => {
    calculateMetrics();
  }, [naoConformidades]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleExportData = () => {
    // TODO: Implementar exportação de dados
    console.log('Exportando dados das NCs...');
  };

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      
      switch (reportType) {
        case 'executivo':
          await pdfService.generateNaoConformidadesExecutiveReport(naoConformidades);
          toast.success('Relatório executivo gerado com sucesso!');
          break;
        case 'detalhado':
          await pdfService.generateNaoConformidadesFilteredReport(naoConformidades, {});
          toast.success('Relatório detalhado gerado com sucesso!');
          break;
        case 'tendencias':
          await pdfService.generateNaoConformidadesComparativeReport(naoConformidades);
          toast.success('Relatório de tendências gerado com sucesso!');
          break;
        case 'comparativo':
          await pdfService.generateNaoConformidadesComparativeReport(naoConformidades);
          toast.success('Relatório comparativo gerado com sucesso!');
          break;
        default:
          toast.error('Tipo de relatório não reconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Temporal */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Temporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics?.evolucaoTemporal || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribuição por Severidade */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Severidade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(metrics?.porSeveridade || {}).map(([key, value]) => ({
                  name: key,
                  value
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {Object.entries(metrics?.porSeveridade || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Análise por Tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(metrics?.porTipo || {}).map(([key, value]) => ({
            tipo: key,
            quantidade: value
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análise por Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(metrics?.porCategoria || {}).map(([key, value]) => ({
            categoria: key,
            quantidade: value
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Análise por Área */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Área Afetada</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(metrics?.porArea || {}).map(([key, value]) => ({
            area: key,
            quantidade: value
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );

  const renderEnhancementsTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Melhorias Sugeridas</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">Reduzir Tempo de Resolução</h4>
              <p className="text-sm text-blue-700">
                Implementar processo de escalação automática para NCs críticas
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-green-900">Prevenção de NCs</h4>
              <p className="text-sm text-green-700">
                Análise de tendências para identificar causas raiz comuns
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <h4 className="font-medium text-orange-900">Otimização de Custos</h4>
              <p className="text-sm text-orange-700">
                Implementar medidas preventivas para reduzir custos de correção
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Relatórios Disponíveis
          {loading && (
            <span className="ml-2 text-sm text-blue-600">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Gerando...
            </span>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleGenerateReport('executivo')}
            disabled={loading}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Relatório Executivo</h4>
              <p className="text-sm text-gray-600">Visão geral e indicadores</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleGenerateReport('detalhado')}
            disabled={loading}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Relatório Detalhado</h4>
              <p className="text-sm text-gray-600">Análise completa por período</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleGenerateReport('tendencias')}
            disabled={loading}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Relatório de Tendências</h4>
              <p className="text-sm text-gray-600">Evolução temporal e previsões</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleGenerateReport('comparativo')}
            disabled={loading}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5 text-orange-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Relatório Comparativo</h4>
              <p className="text-sm text-gray-600">Comparação entre períodos</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Não Conformidades</h1>
            <p className="text-gray-600">Análise e monitorização de não conformidades</p>
          </div>
          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Pesquisar NCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <button
              onClick={handleExportData}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
              <AlertTriangle className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pendentes</p>
                <p className="text-2xl font-bold">{metrics.pendentes}</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Resolvidas</p>
                <p className="text-2xl font-bold">{metrics.resolvidas}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Críticas</p>
                <p className="text-2xl font-bold">{metrics.criticas}</p>
              </div>
              <Shield className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Este Mês</p>
                <p className="text-2xl font-bold">{metrics.esteMes}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Custo Total</p>
                <p className="text-2xl font-bold">€{(metrics.custoTotal || 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tempo Médio</p>
                <p className="text-2xl font-bold">{Math.round(metrics.tempoMedioResolucao || 0)}d</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'analytics', label: 'Análises', icon: BarChart },
              { id: 'enhancements', label: 'Melhorias', icon: TrendingUp },
              { id: 'reports', label: 'Relatórios', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'enhancements' && renderEnhancementsTab()}
          {activeTab === 'reports' && renderReportsTab()}
        </div>
      </div>
    </div>
  );
}
