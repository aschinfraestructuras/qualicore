import React, { useState, useEffect } from 'react';
import { AuditTools } from '../lib/audit-tools';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Shield, 
  Zap, 
  Eye, 
  Search, 
  Package, 
  Activity, 
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Target
} from 'lucide-react';

interface AuditData {
  overallScore: number;
  categories: any;
  recommendations: string[];
  summary: any;
  timestamp: number;
  duration: number;
}

export const AuditDashboard: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const runAudit = async () => {
    setLoading(true);
    try {
      const audit = await AuditTools.runFullAudit();
      setAuditData(audit);
      setLastUpdate(new Date());
      setAuditHistory(AuditTools.getAuditHistory());
    } catch (error) {
      console.error('Erro ao executar auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
    setAuditHistory(AuditTools.getAuditHistory());
  }, []);

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Executando Auditoria Completa...</h3>
          </div>
        </div>
      </div>
    );
  }

  const { categories, overallScore, recommendations, summary } = auditData;

  // Dados para radar chart
  const radarData = [
    { category: 'Segurança', value: categories.security.score, fullMark: 100 },
    { category: 'Performance', value: categories.performance.score, fullMark: 100 },
    { category: 'Acessibilidade', value: categories.accessibility.score, fullMark: 100 },
    { category: 'SEO', value: categories.seo.score, fullMark: 100 },
    { category: 'Bundle', value: categories.bundle.score, fullMark: 100 },
  ];

  // Dados para pie chart de recomendações
  const recommendationData = [
    { name: 'Críticas', value: summary.critical, color: '#ef4444' },
    { name: 'Avisos', value: summary.warnings, color: '#f97316' },
    { name: 'Info', value: summary.info, color: '#22c55e' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auditoria Completa</h1>
              <p className="text-gray-600">Análise detalhada de qualidade e performance</p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Última auditoria: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={runAudit}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Nova Auditoria</span>
              </button>
            </div>
          </div>
        </div>

        {/* Score Geral */}
        <div className="mb-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(overallScore)} mb-4`}>
                <Target className={`h-12 w-12 ${getScoreColor(overallScore)}`} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{overallScore}/100</h2>
              <p className="text-gray-600">Score Geral de Qualidade</p>
              <div className="mt-4 flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">{summary.critical} críticas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{summary.warnings} avisos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{summary.info} info</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas por Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getScoreBgColor(categories.security.score)}`}>
                <Shield className={`h-6 w-6 ${getScoreColor(categories.security.score)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Segurança</p>
                <p className={`text-2xl font-bold ${getScoreColor(categories.security.score)}`}>
                  {categories.security.score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getScoreBgColor(categories.performance.score)}`}>
                <Zap className={`h-6 w-6 ${getScoreColor(categories.performance.score)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className={`text-2xl font-bold ${getScoreColor(categories.performance.score)}`}>
                  {categories.performance.score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getScoreBgColor(categories.accessibility.score)}`}>
                <Eye className={`h-6 w-6 ${getScoreColor(categories.accessibility.score)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acessibilidade</p>
                <p className={`text-2xl font-bold ${getScoreColor(categories.accessibility.score)}`}>
                  {categories.accessibility.score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getScoreBgColor(categories.seo.score)}`}>
                <Search className={`h-6 w-6 ${getScoreColor(categories.seo.score)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SEO</p>
                <p className={`text-2xl font-bold ${getScoreColor(categories.seo.score)}`}>
                  {categories.seo.score}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getScoreBgColor(categories.bundle.score)}`}>
                <Package className={`h-6 w-6 ${getScoreColor(categories.bundle.score)}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bundle</p>
                <p className={`text-2xl font-bold ${getScoreColor(categories.bundle.score)}`}>
                  {categories.bundle.score}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Recomendações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recommendationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {recommendationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações de Melhoria</h3>
          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {rec.includes('crítico') || rec.includes('segurança') ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : rec.includes('performance') || rec.includes('otimizar') ? (
                    <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium text-green-800">Excelente! Nenhuma melhoria necessária.</p>
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Auditorias */}
        {auditHistory.length > 1 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Auditorias</h3>
            <div className="space-y-3">
              {auditHistory.slice(-5).reverse().map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${getScoreColor(audit.overallScore)}`}>
                      {audit.overallScore}/100
                    </span>
                    <span className="text-sm text-gray-500">
                      {audit.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
