import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  Target,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  BarChart,
  LineChart
} from 'lucide-react';
import { Checklist } from '@/types';
import { ChecklistsServices, checklistsEnhancements } from '@/lib/checklists-enhancements';
import { checklistsCache } from '@/lib/checklists-cache';
import { PDFService } from '@/services/pdfService';
import toast from 'react-hot-toast';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface ChecklistsDashboardProps {
  checklists: Checklist[];
  onRefresh: () => void;
}

export default function ChecklistsDashboard({ checklists, onRefresh }: ChecklistsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'improvements' | 'reports'>('overview');
  const [loadingReport, setLoadingReport] = useState(false);

  const kpis = ChecklistsServices.calculateKPIs(checklists);
  const trends = ChecklistsServices.calculateTrends(checklists);
  const anomalies = ChecklistsServices.detectAnomalies(checklists);
  const recommendations = ChecklistsServices.generateRecommendations(checklists);
  const enhancements = checklistsEnhancements.getAll();
  const cacheStats = checklistsCache.getStats();

  // Dados para gráficos
  const statusData = [
    { name: 'Completados', value: kpis.completados, color: '#10b981' },
    { name: 'Em Progresso', value: kpis.emProgresso, color: '#f59e0b' },
    { name: 'Pendentes', value: kpis.pendentes, color: '#ef4444' }
  ];

  const conformidadeData = [
    { name: 'Conformes', value: kpis.conformes, color: '#10b981' },
    { name: 'Não Conformes', value: kpis.naoConformes, color: '#ef4444' }
  ];

  const trendData = [
    { name: 'Semana 1', completados: 12, pendentes: 8 },
    { name: 'Semana 2', completados: 15, pendentes: 6 },
    { name: 'Semana 3', completados: 18, pendentes: 4 },
    { name: 'Semana 4', completados: 22, pendentes: 3 }
  ];

  const handleGeneratePerformanceReport = async () => {
    setLoadingReport(true);
    try {
      const pdfService = new PDFService();
      await pdfService.generateChecklistsPerformanceReport({
        checklists,
        kpis,
        trends,
        anomalies
      });
      toast.success('Relatório de Performance gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerateTrendsReport = async () => {
    setLoadingReport(true);
    try {
      const pdfService = new PDFService();
      await pdfService.generateChecklistsTrendsReport({
        checklists,
        trends,
        recommendations
      });
      toast.success('Relatório de Tendências gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerateAnomaliesReport = async () => {
    setLoadingReport(true);
    try {
      const pdfService = new PDFService();
      await pdfService.generateChecklistsAnomaliesReport({
        checklists,
        anomalies,
        recommendations
      });
      toast.success('Relatório de Anomalias gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoadingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo': return 'text-green-600 bg-green-100';
      case 'em_progresso': return 'text-yellow-600 bg-yellow-100';
      case 'pendente': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Checklists</h1>
          <p className="text-gray-600">Visão geral e analytics avançados</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'improvements', label: 'Melhorias', icon: Target },
            { id: 'reports', label: 'Relatórios', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Checklists</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Conformidade</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis.taxaConformidade.toFixed(1)}%</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Completude</p>
                    <p className="text-2xl font-bold text-gray-900">{kpis.taxaCompletude.toFixed(1)}%</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tendência</p>
                    <div className="flex items-center space-x-1">
                      {trends.tendencia === 'crescente' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <p className="text-2xl font-bold text-gray-900">
                        {trends.crescimentoMensal.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Checklists</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conformidade</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={conformidadeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cache Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Cache</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Hit Rate</p>
                  <p className="text-xl font-bold text-gray-900">{cacheStats.hitRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hits</p>
                  <p className="text-xl font-bold text-gray-900">{cacheStats.hits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Misses</p>
                  <p className="text-xl font-bold text-gray-900">{cacheStats.misses}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tamanho</p>
                  <p className="text-xl font-bold text-gray-900">{cacheStats.size}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Trends Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências Semanais</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completados" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="pendentes" stroke="#ef4444" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            {/* Anomalies */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomalias Detectadas</h3>
              <div className="space-y-4">
                {anomalies.length > 0 ? (
                  anomalies.map((anomaly, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">{anomaly.message}</p>
                        <p className="text-sm text-red-700 mt-1">{anomaly.recommendation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma anomalia detectada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">{rec.title}</p>
                      <p className="text-sm text-blue-700 mt-1">{rec.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <span className="text-xs text-blue-600">{rec.impact}</span>
                        <span className="text-xs text-blue-600">{rec.effort}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'improvements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Roadmap */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Roadmap de Melhorias</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{enhancements.filter(e => e.status === 'pending').length}</p>
                  <p className="text-sm text-yellow-700">Pendentes</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{enhancements.filter(e => e.status === 'in_progress').length}</p>
                  <p className="text-sm text-blue-700">Em Progresso</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{enhancements.filter(e => e.status === 'completed').length}</p>
                  <p className="text-sm text-green-700">Concluídas</p>
                </div>
              </div>

              <div className="space-y-4">
                {enhancements.map((enhancement) => (
                  <div key={enhancement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{enhancement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{enhancement.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(enhancement.priority)}`}>
                            {enhancement.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enhancement.status)}`}>
                            {enhancement.status}
                          </span>
                          <span className="text-xs text-gray-500">{enhancement.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Benefícios:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {enhancement.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Rápidos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleGeneratePerformanceReport}
                  disabled={loadingReport}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Activity className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="font-medium text-gray-900">Performance</span>
                  <span className="text-sm text-gray-500">KPIs e métricas</span>
                </button>

                <button
                  onClick={handleGenerateTrendsReport}
                  disabled={loadingReport}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <span className="font-medium text-gray-900">Tendências</span>
                  <span className="text-sm text-gray-500">Análise temporal</span>
                </button>

                <button
                  onClick={handleGenerateAnomaliesReport}
                  disabled={loadingReport}
                  className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                  <span className="font-medium text-gray-900">Anomalias</span>
                  <span className="text-sm text-gray-500">Problemas detectados</span>
                </button>
              </div>

              {loadingReport && (
                <div className="mt-4 text-center">
                  <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Gerando relatório...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
