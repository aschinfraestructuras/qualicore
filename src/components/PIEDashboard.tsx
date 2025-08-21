import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  MapPin,
  Calendar,
  Tag,
  Download,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Settings,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { PIEInstancia } from '@/types/pie';
import { pieEnhancements, PIEServices } from '@/lib/pie-enhancements';
import { pieCache } from '@/lib/pie-cache';
import { PDFService } from '@/services/pdfService';
import toast from 'react-hot-toast';
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

interface PIEDashboardProps {
  pies: PIEInstancia[];
  onRefresh: () => void;
}

export default function PIEDashboard({ pies, onRefresh }: PIEDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'enhancements' | 'reports'>('overview');
  const [loadingReport, setLoadingReport] = useState(false);

  // Calcular KPIs e métricas
  const kpis = PIEServices.calculateKPIs(pies);
  const trends = PIEServices.calculateTrends(pies);
  const anomalies = PIEServices.detectAnomalies(pies, kpis);
  const recommendations = PIEServices.generateRecommendations(pies, kpis, trends);

  // Dados para gráficos
  const statusData = [
    { name: 'Em Andamento', value: kpis.emAndamento, color: '#3B82F6' },
    { name: 'Concluídos', value: kpis.concluidos, color: '#10B981' },
    { name: 'Aprovados', value: kpis.aprovados, color: '#059669' },
    { name: 'Reprovados', value: kpis.reprovados, color: '#EF4444' },
    { name: 'Rascunho', value: kpis.rascunho, color: '#6B7280' }
  ];

  const priorityData = [
    { name: 'Alta', value: kpis.altaPrioridade, color: '#EF4444' },
    { name: 'Média', value: kpis.mediaPrioridade, color: '#F59E0B' },
    { name: 'Baixa', value: kpis.baixaPrioridade, color: '#10B981' }
  ];

  const trendData = [
    { name: 'Este Mês', value: trends.thisMonth },
    { name: 'Mês Passado', value: trends.lastMonthCount }
  ];

  // Gerar relatórios
  const handleGeneratePerformanceReport = async () => {
    setLoadingReport(true);
    try {
      const pdfService = new PDFService();
      await pdfService.generatePIEPerformanceReport({
        pies,
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
      await pdfService.generatePIETrendsReport({
        pies,
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
      await pdfService.generatePIEAnomaliesReport({
        pies,
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

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard PIE Premium</h2>
          <p className="text-gray-600">Análise avançada de Pontos de Inspeção e Ensaios</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'enhancements', label: 'Melhorias', icon: Settings },
            { id: 'reports', label: 'Relatórios', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total PIEs</p>
                      <p className="text-2xl font-bold text-gray-900">{kpis.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {getTrendIcon(trends.crescimentoMensal)}
                    <span className={`ml-1 font-medium ${getTrendColor(trends.crescimentoMensal)}`}>
                      {Math.abs(trends.crescimentoMensal).toFixed(1)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa Conclusão</p>
                      <p className="text-2xl font-bold text-gray-900">{kpis.taxaConclusao.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${kpis.taxaConclusao}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                      <p className="text-2xl font-bold text-gray-900">{kpis.emAndamento}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {((kpis.emAndamento / kpis.total) * 100).toFixed(1)}% do total
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Alta Prioridade</p>
                      <p className="text-2xl font-bold text-gray-900">{kpis.altaPrioridade}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Requer atenção imediata
                  </div>
                </motion.div>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Prioridade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Métricas Avançadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Crescimento Mensal</span>
                      <div className="flex items-center">
                        {getTrendIcon(trends.crescimentoMensal)}
                        <span className={`ml-1 font-medium ${getTrendColor(trends.crescimentoMensal)}`}>
                          {trends.crescimentoMensal.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Crescimento Semanal</span>
                      <div className="flex items-center">
                        {getTrendIcon(trends.crescimentoSemanal)}
                        <span className={`ml-1 font-medium ${getTrendColor(trends.crescimentoSemanal)}`}>
                          {trends.crescimentoSemanal.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Média Diária</span>
                      <span className="font-medium">{trends.mediaDiaria.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomalias</h3>
                  <div className="space-y-3">
                    {anomalies.length > 0 ? (
                      anomalies.slice(0, 3).map((anomaly, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{anomaly.type}</p>
                            <p className="text-xs text-gray-600">{anomaly.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Nenhuma anomalia detectada</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações</h3>
                  <div className="space-y-3">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                          <p className="text-xs text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gráfico de Tendências */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Temporal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Melhorias */}
          {activeTab === 'enhancements' && (
            <div className="space-y-6">
              {/* Progresso Geral */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Roadmap de Melhorias</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{pieEnhancements.getProgress()}%</p>
                    <p className="text-sm text-gray-600">Concluído</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${pieEnhancements.getProgress()}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{pieEnhancements.getCompleted().length}</p>
                    <p className="text-sm text-gray-600">Concluídas</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{pieEnhancements.getPending().length}</p>
                    <p className="text-sm text-gray-600">Pendentes</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{pieEnhancements.getTotalHours()}</p>
                    <p className="text-sm text-gray-600">Horas Totais</p>
                  </div>
                </div>
              </div>

              {/* Lista de Melhorias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pieEnhancements.getAll().map((enhancement) => (
                  <motion.div
                    key={enhancement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${
                      enhancement.status === 'completed' ? 'ring-2 ring-green-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{enhancement.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          enhancement.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : enhancement.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {enhancement.status === 'completed' ? 'Concluído' :
                         enhancement.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{enhancement.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Prioridade: {enhancement.priority}</span>
                      <span>{enhancement.estimatedHours}h</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {enhancement.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Relatórios */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Estatísticas do Cache */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas do Cache</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const stats = pieCache.getStats();
                    return [
                      { label: 'Entradas', value: stats.totalEntries },
                      { label: 'Hit Rate', value: `${stats.hitRate.toFixed(1)}%` },
                      { label: 'Hits', value: stats.totalHits },
                      { label: 'Misses', value: stats.totalMisses }
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.label}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Relatórios Rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8" />
                    <span className="text-sm opacity-90">Performance</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Relatório de Performance</h3>
                  <p className="text-sm opacity-90 mb-4">
                    KPIs principais, métricas de conclusão e indicadores de qualidade
                  </p>
                  <button
                    onClick={handleGeneratePerformanceReport}
                    disabled={loadingReport}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {loadingReport ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{loadingReport ? 'Gerando...' : 'Gerar PDF'}</span>
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8" />
                    <span className="text-sm opacity-90">Tendências</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Relatório de Tendências</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Análise de crescimento, padrões temporais e projeções futuras
                  </p>
                  <button
                    onClick={handleGenerateTrendsReport}
                    disabled={loadingReport}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {loadingReport ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{loadingReport ? 'Gerando...' : 'Gerar PDF'}</span>
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8" />
                    <span className="text-sm opacity-90">Anomalias</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Relatório de Anomalias</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Deteção de problemas, alertas e recomendações de correção
                  </p>
                  <button
                    onClick={handleGenerateAnomaliesReport}
                    disabled={loadingReport}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {loadingReport ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{loadingReport ? 'Gerando...' : 'Gerar PDF'}</span>
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
