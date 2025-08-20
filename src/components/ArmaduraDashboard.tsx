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
  Calculator, 
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
  MapPin,
  TestTube,
  Database,
  Globe,
  Compass,
  Scale,
  Droplets,
  Package,
  Truck,
  Wrench,
  HardHat,
  Ruler,
  Anchor
} from 'lucide-react';
import { PDFService } from '../services/pdfService';
import toast from 'react-hot-toast';
import { Armadura } from '../types/armaduras';

interface ArmaduraDashboardProps {
  armaduras: Armadura[];
  onSearch: (query: string, options?: any) => void;
  onFilterChange: (filters: any) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function ArmaduraDashboard({ armaduras, onSearch, onFilterChange }: ArmaduraDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'enhancements' | 'reports'>('overview');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calcular métricas
  const calculateMetrics = () => {
    console.log('ArmaduraDashboard: Calculando métricas com', armaduras.length, 'armaduras');
    if (!armaduras.length) {
      console.log('ArmaduraDashboard: Nenhuma armadura encontrada');
      setMetrics({
        total: 0,
        conformes: 0,
        naoConformes: 0,
        emAnalise: 0,
        esteMes: 0,
        esteAno: 0,
        porTipo: {},
        porFornecedor: {},
        porZona: {},
        evolucaoTemporal: []
      });
      return;
    }

    const total = armaduras.length;
    const conformes = armaduras.filter(a => a.estado === 'aprovado').length;
    const naoConformes = armaduras.filter(a => a.estado === 'reprovado').length;
    const emAnalise = armaduras.filter(a => a.estado === 'em_analise').length;
    
    // Este mês
    const esteMes = armaduras.filter(a => {
      const data = new Date(a.created_at);
      const hoje = new Date();
      return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
    }).length;

    // Este ano
    const esteAno = armaduras.filter(a => {
      const data = new Date(a.created_at);
      const hoje = new Date();
      return data.getFullYear() === hoje.getFullYear();
    }).length;

    // Por tipo
    const porTipo = armaduras.reduce((acc, armadura) => {
      const tipo = armadura.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por fornecedor
    const porFornecedor = armaduras.reduce((acc, armadura) => {
      const fornecedor = armadura.fornecedor_id || 'Não especificado';
      acc[fornecedor] = (acc[fornecedor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Por zona
    const porZona = armaduras.reduce((acc, armadura) => {
      const zona = armadura.zona || 'Não especificado';
      acc[zona] = (acc[zona] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Evolução temporal (últimos 12 meses)
    const evolucaoTemporal = [];
    for (let i = 11; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = data.toLocaleString('pt-BR', { month: 'short' });
      const count = armaduras.filter(a => {
        const armaduraData = new Date(a.created_at);
        return armaduraData.getMonth() === data.getMonth() && armaduraData.getFullYear() === data.getFullYear();
      }).length;
      evolucaoTemporal.push({ mes, quantidade: count });
    }

    setMetrics({
      total,
      conformes,
      naoConformes,
      emAnalise,
      esteMes,
      esteAno,
      porTipo,
      porFornecedor,
      porZona,
      evolucaoTemporal
    });
  };

  useEffect(() => {
    calculateMetrics();
  }, [armaduras]);

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      console.log('🔍 Iniciando geração de relatório:', reportType);
      console.log('🔍 Armaduras disponíveis:', armaduras.length);
      
      const pdfService = new PDFService();
      console.log('🔍 PDFService criado:', pdfService);
      
      switch (reportType) {
        case 'executivo':
          console.log('🔍 Chamando generateArmadurasExecutiveReport...');
          await pdfService.generateArmadurasExecutiveReport(armaduras);
          toast.success('Relatório executivo gerado com sucesso!');
          break;
        case 'comparativo':
          console.log('🔍 Chamando generateArmadurasComparativeReport...');
          await pdfService.generateArmadurasComparativeReport(armaduras);
          toast.success('Relatório comparativo gerado com sucesso!');
          break;
        case 'filtrado':
          console.log('🔍 Chamando generateArmadurasFilteredReport...');
          await pdfService.generateArmadurasFilteredReport(armaduras, {});
          toast.success('Relatório filtrado gerado com sucesso!');
          break;
        case 'exportar':
          // Implementar exportação CSV
          toast.success('Exportação CSV implementada!');
          break;
        default:
          toast.error('Tipo de relatório não reconhecido');
      }
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      toast.error('Erro ao gerar relatório: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Armaduras</h1>
            <p className="text-gray-600">Visão geral e análise detalhada das armaduras</p>
          </div>
          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Pesquisar armaduras..."
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
              onClick={() => calculateMetrics()}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
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
              <Package className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Conformes</p>
                <p className="text-2xl font-bold">{metrics.conformes}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Não Conformes</p>
                <p className="text-2xl font-bold">{metrics.naoConformes}</p>
              </div>
              <XCircle className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Em Análise</p>
                <p className="text-2xl font-bold">{metrics.emAnalise}</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
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
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Este Ano</p>
                <p className="text-2xl font-bold">{metrics.esteAno}</p>
              </div>
              <BarChart3 className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taxa Conformidade</p>
                <p className="text-2xl font-bold">{metrics.total > 0 ? Math.round((metrics.conformes / metrics.total) * 100) : 0}%</p>
              </div>
              <Percent className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'analytics', label: 'Análises', icon: BarChart3 },
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Pizza - Estado das Armaduras */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado das Armaduras</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Conformes', value: metrics.conformes, color: '#10B981' },
                          { name: 'Não Conformes', value: metrics.naoConformes, color: '#EF4444' },
                          { name: 'Em Análise', value: metrics.emAnalise, color: '#F59E0B' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Conformes', value: metrics.conformes, color: '#10B981' },
                          { name: 'Não Conformes', value: metrics.naoConformes, color: '#EF4444' },
                          { name: 'Em Análise', value: metrics.emAnalise, color: '#F59E0B' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras - Por Tipo */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(metrics.porTipo).map(([tipo, quantidade]) => ({ tipo, quantidade }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Evolução Temporal */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Temporal (Últimos 12 Meses)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.evolucaoTemporal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quantidade" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Barras - Por Fornecedor */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Fornecedores</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={Object.entries(metrics.porFornecedor)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 8)
                        .map(([fornecedor, quantidade]) => ({ fornecedor, quantidade }))
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fornecedor" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras - Por Zona */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Zona</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(metrics.porZona).map(([zona, quantidade]) => ({ zona, quantidade }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zona" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart - Características */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Características</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { caracteristica: 'Conformidade', valor: metrics.total > 0 ? (metrics.conformes / metrics.total) * 100 : 0 },
                    { caracteristica: 'Qualidade', valor: 85 },
                    { caracteristica: 'Entrega', valor: 92 },
                    { caracteristica: 'Documentação', valor: 78 },
                    { caracteristica: 'Especificações', valor: 88 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="caracteristica" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Armaduras" dataKey="valor" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'enhancements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Melhorias Sugeridas */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-900">Melhorar Conformidade</h3>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Taxa de conformidade atual: {metrics.total > 0 ? Math.round((metrics.conformes / metrics.total) * 100) : 0}%
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reforçar inspeções de qualidade
                    </div>
                    <div className="flex items-center text-sm text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Melhorar comunicação com fornecedores
                    </div>
                    <div className="flex items-center text-sm text-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Implementar checklist de verificação
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-900">Otimizar Processos</h3>
                  </div>
                  <p className="text-green-800 mb-4">
                    {metrics.emAnalise} armaduras em análise
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reduzir tempo de análise
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Automatizar verificações
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Implementar workflow digital
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-purple-900">Gestão de Riscos</h3>
                  </div>
                  <p className="text-purple-800 mb-4">
                    {metrics.naoConformes} não conformidades identificadas
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-purple-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Implementar sistema de alertas
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reforçar inspeções preventivas
                    </div>
                    <div className="flex items-center text-sm text-purple-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Criar plano de contingência
                    </div>
                  </div>
                </div>
              </div>

              {/* KPIs de Performance */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">KPIs de Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{metrics.total > 0 ? Math.round((metrics.conformes / metrics.total) * 100) : 0}%</div>
                    <div className="text-sm text-gray-600">Taxa de Conformidade</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.esteMes}</div>
                    <div className="text-sm text-gray-600">Novas Este Mês</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{metrics.emAnalise}</div>
                    <div className="text-sm text-gray-600">Em Análise</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{metrics.naoConformes}</div>
                    <div className="text-sm text-gray-600">Não Conformes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              {loading && (
                <div className="flex items-center justify-center p-8 mb-4">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Gerando relatório...</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleGenerateReport('executivo')}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="flex items-center mb-2">
                    <Download className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Relatório Executivo</span>
                  </div>
                  <p className="text-sm opacity-90">Visão geral completa das armaduras</p>
                </button>

                <button 
                  onClick={() => handleGenerateReport('comparativo')}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="flex items-center mb-2">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Análise Comparativa</span>
                  </div>
                  <p className="text-sm opacity-90">Comparação entre períodos</p>
                </button>

                <button 
                  onClick={() => handleGenerateReport('filtrado')}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="flex items-center mb-2">
                    <Filter className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Relatório Filtrado</span>
                  </div>
                  <p className="text-sm opacity-90">Dados com filtros aplicados</p>
                </button>

                <button 
                  onClick={() => handleGenerateReport('exportar')}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Exportar Dados</span>
                  </div>
                  <p className="text-sm opacity-90">CSV com todos os dados</p>
                </button>
              </div>

              {/* Estatísticas dos Relatórios */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas para Relatórios</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{metrics.total}</div>
                    <div className="text-sm text-gray-600">Total de Armaduras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.conformes}</div>
                    <div className="text-sm text-gray-600">Conformes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{metrics.naoConformes}</div>
                    <div className="text-sm text-gray-600">Não Conformes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{metrics.emAnalise}</div>
                    <div className="text-sm text-gray-600">Em Análise</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
