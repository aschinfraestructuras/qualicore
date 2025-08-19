import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Thermometer,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel
} from 'recharts';
import toast from 'react-hot-toast';
import { betonagensAPI } from '@/lib/supabase-api/betonagensAPI';
import { ReportService } from '@/services/reportService';

interface Betonagem {
  id: string;
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
  created_at: string;
  updated_at: string;
}

const COLORS = {
  primary: [59, 130, 246],
  secondary: [99, 102, 241],
  success: [34, 197, 94],
  warning: [245, 158, 11],
  danger: [239, 68, 68],
  info: [6, 182, 212],
  light: [241, 245, 249],
  dark: [51, 65, 85]
};

export default function BetonagemDashboard() {
  const [betonagens, setBetonagens] = useState<Betonagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBetonagens();
  }, []);

  const loadBetonagens = async () => {
    try {
      setLoading(true);
      const response = await betonagensAPI.betonagens.getAll();
      setBetonagens(response || []);
      
      if (!response || response.length === 0) {
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Erro ao carregar betonagens:', error);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Mock data para gráficos quando não há dados reais
  const mockData = {
    areaData: [
      { mes: 'Jan', resistencia: 32.5, temperatura: 18, slump: 12 },
      { mes: 'Fev', resistencia: 35.2, temperatura: 20, slump: 14 },
      { mes: 'Mar', resistencia: 33.8, temperatura: 22, slump: 11 },
      { mes: 'Abr', resistencia: 37.1, temperatura: 19, slump: 13 },
      { mes: 'Mai', resistencia: 36.4, temperatura: 21, slump: 15 },
      { mes: 'Jun', resistencia: 38.9, temperatura: 24, slump: 16 }
    ],
    barData: [
      { elemento: 'Pilares', quantidade: 45, resistencia_media: 35.2 },
      { elemento: 'Vigas', quantidade: 38, resistencia_media: 33.8 },
      { elemento: 'Lajes', quantidade: 52, resistencia_media: 36.1 },
      { elemento: 'Fundações', quantidade: 28, resistencia_media: 34.5 },
      { elemento: 'Muros', quantidade: 22, resistencia_media: 32.9 }
    ],
    pieData: [
      { name: 'Conformes', value: 68, color: '#22c55e' },
      { name: 'Não Conformes', value: 12, color: '#ef4444' },
      { name: 'Pendentes', value: 20, color: '#f59e0b' }
    ],
    funnelData: [
      { value: 100, name: 'Total Betonagens', fill: '#3b82f6' },
      { value: 85, name: 'Ensaios 7d', fill: '#06b6d4' },
      { value: 72, name: 'Ensaios 28d', fill: '#8b5cf6' },
      { value: 68, name: 'Conformes', fill: '#22c55e' }
    ],
    scatterData: [
      { temperatura: 15, resistencia: 30.2, slump: 10 },
      { temperatura: 18, resistencia: 32.8, slump: 12 },
      { temperatura: 20, resistencia: 35.1, slump: 14 },
      { temperatura: 22, resistencia: 36.5, slump: 13 },
      { temperatura: 25, resistencia: 37.8, slump: 16 },
      { temperatura: 28, resistencia: 38.2, slump: 15 },
      { temperatura: 30, resistencia: 39.1, slump: 17 }
    ]
  };

  // Calcular dados reais ou usar mock
  const getChartData = () => {
    if (usingMockData || betonagens.length === 0) {
      return mockData;
    }

    // Processar dados reais
    const areaData = betonagens.slice(0, 6).map((b, index) => ({
      mes: `Bet${index + 1}`,
      resistencia: ((b.resistencia_28d_1 + b.resistencia_28d_2 + b.resistencia_28d_3) / 3) || 30,
      temperatura: b.temperatura || 20,
      slump: b.slump || 12
    }));

    const barData = Object.entries(
      betonagens.reduce((acc, b) => {
        acc[b.elemento_estrutural] = (acc[b.elemento_estrutural] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([elemento, quantidade]) => ({
      elemento,
      quantidade,
      resistencia_media: 35
    }));

    const conformes = betonagens.filter(b => b.status_conformidade === 'Conforme').length;
    const naoConformes = betonagens.filter(b => b.status_conformidade === 'Não Conforme').length;
    const pendentes = betonagens.filter(b => b.status_conformidade === 'Pendente').length;

    const pieData = [
      { name: 'Conformes', value: conformes, color: '#22c55e' },
      { name: 'Não Conformes', value: naoConformes, color: '#ef4444' },
      { name: 'Pendentes', value: pendentes, color: '#f59e0b' }
    ];

    const funnelData = [
      { value: betonagens.length, name: 'Total Betonagens', fill: '#3b82f6' },
      { value: betonagens.filter(b => b.data_ensaio_7d).length, name: 'Ensaios 7d', fill: '#06b6d4' },
      { value: betonagens.filter(b => b.data_ensaio_28d).length, name: 'Ensaios 28d', fill: '#8b5cf6' },
      { value: conformes, name: 'Conformes', fill: '#22c55e' }
    ];

    const scatterData = betonagens
      .filter(b => b.temperatura > 0 && b.resistencia_28d_1 > 0)
      .map(b => ({
        temperatura: b.temperatura,
        resistencia: (b.resistencia_28d_1 + b.resistencia_28d_2 + b.resistencia_28d_3) / 3,
        slump: b.slump
      }));

    return { areaData, barData, pieData, funnelData, scatterData };
  };

  const chartData = getChartData();

  // Calcular KPIs
  const calculateKPIs = () => {
    if (usingMockData || betonagens.length === 0) {
      return {
        total: 120,
        conformes: 82,
        naoConformes: 14,
        pendentes: 24,
        resistenciaMedia: 35.8,
        temperaturaMedia: 21.2,
        slumpMedia: 13.5,
        taxaConformidade: 68.3
      };
    }

    const total = betonagens.length;
    const conformes = betonagens.filter(b => b.status_conformidade === 'Conforme').length;
    const naoConformes = betonagens.filter(b => b.status_conformidade === 'Não Conforme').length;
    const pendentes = betonagens.filter(b => b.status_conformidade === 'Pendente').length;

    const resistencias = betonagens
      .map(b => (b.resistencia_28d_1 + b.resistencia_28d_2 + b.resistencia_28d_3) / 3)
      .filter(r => r > 0);
    const resistenciaMedia = resistencias.length > 0 
      ? Math.round((resistencias.reduce((a, b) => a + b, 0) / resistencias.length) * 10) / 10
      : 0;

    const temperaturas = betonagens.map(b => b.temperatura).filter(t => t > 0);
    const temperaturaMedia = temperaturas.length > 0
      ? Math.round((temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length) * 10) / 10
      : 0;

    const slumps = betonagens.map(b => b.slump).filter(s => s > 0);
    const slumpMedia = slumps.length > 0
      ? Math.round((slumps.reduce((a, b) => a + b, 0) / slumps.length) * 10) / 10
      : 0;

    const taxaConformidade = total > 0 ? Math.round((conformes / total) * 100 * 10) / 10 : 0;

    return {
      total,
      conformes,
      naoConformes,
      pendentes,
      resistenciaMedia,
      temperaturaMedia,
      slumpMedia,
      taxaConformidade
    };
  };

  const kpis = calculateKPIs();

  const handleGenerateExecutiveReport = async () => {
    try {
      console.log('Gerando relatório executivo...');
      await ReportService.generateBetonagemExecutiveReport(betonagens, kpis);
      toast.success('Relatório executivo gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const handleGenerateAnalyticsReport = async () => {
    try {
      await ReportService.generateBetonagemAnalyticsReport(betonagens, chartData);
      toast.success('Relatório analítico gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const handleGenerateComplianceReport = async () => {
    try {
      await ReportService.generateBetonagemComplianceReport(betonagens, kpis);
      toast.success('Relatório de conformidade gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Betonagens</h2>
          <p className="text-gray-600">Visão geral e análise de controlo de betonagens</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
            { id: 'charts', name: 'Gráficos', icon: PieChart },
            { id: 'reports', name: 'Relatórios', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Betonagens</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Conformidade</p>
                  <p className="text-2xl font-bold text-green-600">{kpis.taxaConformidade}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resistência Média</p>
                  <p className="text-2xl font-bold text-indigo-600">{kpis.resistenciaMedia} MPa</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperatura Média</p>
                  <p className="text-2xl font-bold text-orange-600">{kpis.temperaturaMedia}°C</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Conformes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{kpis.conformes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Não Conformes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{kpis.naoConformes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pendentes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{kpis.pendentes}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Técnicas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Slump Médio</span>
                  <span className="text-sm font-medium text-gray-900">{kpis.slumpMedia} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ensaios 7d</span>
                  <span className="text-sm font-medium text-gray-900">
                    {betonagens.filter(b => b.data_ensaio_7d).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ensaios 28d</span>
                  <span className="text-sm font-medium text-gray-900">
                    {betonagens.filter(b => b.data_ensaio_28d).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Monitorizar temperaturas elevadas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Acelerar ensaios pendentes</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Otimizar slump para melhor trabalhabilidade</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolução da Resistência */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução da Resistência</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="resistencia" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribuição por Elemento */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Elemento</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="elemento" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="quantidade" fill="#3b82f6" />
                  <Line yAxisId="right" type="monotone" dataKey="resistencia_media" stroke="#ef4444" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status de Conformidade */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Conformidade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Funil de Ensaios */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Ensaios</h3>
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={chartData.funnelData}
                    isAnimationActive
                  />
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Correlação: Temperatura vs Resistência */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlação: Temperatura vs Resistência</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="temperatura" 
                  name="Temperatura" 
                  unit="°C"
                  domain={[10, 35]}
                />
                <YAxis 
                  type="number" 
                  dataKey="resistencia" 
                  name="Resistência" 
                  unit=" MPa"
                  domain={[25, 45]}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [value, name === 'resistencia' ? 'Resistência (MPa)' : 'Temperatura (°C)']}
                />
                <Scatter name="Betonagens" data={chartData.scatterData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Relatório Executivo</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Visão geral dos KPIs principais e métricas de performance
                </p>
                <button
                  onClick={handleGenerateExecutiveReport}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <h4 className="font-medium text-gray-900">Relatório Analítico</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Análise detalhada com gráficos e tendências
                </p>
                <button
                  onClick={handleGenerateAnalyticsReport}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Relatório Conformidade</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Análise de conformidade e não conformidades
                </p>
                <button
                  onClick={handleGenerateComplianceReport}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>
            </div>
          </div>

          {usingMockData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Utilizando dados de exemplo. Adicione betonagens reais para ver dados personalizados.
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
