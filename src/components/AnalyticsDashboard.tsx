import React, { useState, useEffect } from 'react';
import { PerformanceAnalyzer } from '../lib/performance-analyzer';
import { SecurityScanner } from '../lib/security-scanner';
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
  ResponsiveContainer 
} from 'recharts';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  TrendingUp,
  RefreshCw,
  Eye,
  Lock,
  Gauge
} from 'lucide-react';

interface AnalyticsData {
  performance: any;
  security: any;
  timestamp: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const runAnalytics = async () => {
    setLoading(true);
    try {
      // Executa análises
      const performanceReport = PerformanceAnalyzer.generateReport();
      const securityReport = await SecurityScanner.runFullScan();

      const data: AnalyticsData = {
        performance: performanceReport,
        security: securityReport,
        timestamp: Date.now(),
      };

      setAnalyticsData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao executar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalytics();
    
    // Atualiza a cada 5 minutos
    const interval = setInterval(runAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Carregando Analytics...</h3>
          </div>
        </div>
      </div>
    );
  }

  const { performance, security } = analyticsData;

  // Dados para gráficos de performance
  const performanceData = [
    { name: 'LCP', value: performance.metrics.find((m: any) => m.type === 'LCP')?.value || 0 },
    { name: 'FID', value: performance.metrics.find((m: any) => m.type === 'FID')?.value || 0 },
    { name: 'CLS', value: performance.metrics.find((m: any) => m.type === 'CLS')?.value || 0 },
  ];

  // Dados para gráficos de segurança
  const securityData = [
    { name: 'Críticas', value: security.summary.critical, color: '#ef4444' },
    { name: 'Altas', value: security.summary.high, color: '#f97316' },
    { name: 'Médias', value: security.summary.medium, color: '#eab308' },
    { name: 'Baixas', value: security.summary.low, color: '#22c55e' },
  ];

  // Dados para timeline de performance
  const timelineData = performance.metrics
    .filter((m: any) => ['LCP', 'FID', 'CLS'].includes(m.type))
    .slice(-10)
    .map((m: any) => ({
      time: new Date(m.timestamp).toLocaleTimeString(),
      [m.type]: m.value,
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitorização em tempo real do site</p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <p className="text-sm text-gray-500">
                  Última atualização: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={runAnalytics}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(100 - (performance.errors.length * 10))}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {security.summary.securityScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vulnerabilidades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {security.summary.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Métricas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performance.summary.totalMetrics}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Gauge className="h-5 w-5 mr-2" />
              Core Web Vitals
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Security Vulnerabilities */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Vulnerabilidades por Severidade
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={securityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {securityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline de Performance */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Timeline de Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="LCP" stroke="#8884d8" />
              <Line type="monotone" dataKey="FID" stroke="#82ca9d" />
              <Line type="monotone" dataKey="CLS" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações de Performance</h3>
            <div className="space-y-3">
              {performance.errors.length > 0 ? (
                performance.errors.map((error: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{error.type}</p>
                      <p className="text-sm text-red-600">Valor: {error.value}ms</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-green-800">Performance otimizada!</p>
                </div>
              )}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações de Segurança</h3>
            <div className="space-y-3">
              {security.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{rec.priority}</p>
                    <p className="text-sm text-yellow-600">{rec.action}</p>
                    {rec.count && (
                      <p className="text-sm text-yellow-600">{rec.count} vulnerabilidades</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
