import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, 
  TestTube, AlertTriangle, Clock, 
  CheckCircle, XCircle, Activity,
  RefreshCw, BarChart3, Target
} from 'lucide-react';
import { kpiService, KPIData, NCData, SLAData, GlobalData } from '../lib/kpiService';
import { alertService } from '../lib/alertService';
import { SparklineChart } from './SparklineChart';

interface KPIBarProps {
  darkMode: boolean;
}

export const KPIBar: React.FC<KPIBarProps> = ({ darkMode }) => {
  const [kpiData, setKpiData] = useState<{
    today: KPIData | null;
    week: KPIData | null;
    month: KPIData | null;
    nc: NCData[];
    sla: SLAData[];
    global: GlobalData | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kpiService.getAllKPIs();
      setKpiData(data);
      setLastUpdate(new Date());

      // Analisar alertas
      const newAlerts = alertService.analyzeKPIs(data);
      setActiveAlerts(alertService.getActiveAlerts());
    } catch (err) {
      setError('Erro ao carregar KPIs');
      console.error('Erro ao buscar KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
    
    // Polling a cada 30 segundos
    const interval = setInterval(fetchKPIs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getTendenciaIcon = (atual: number, anterior: number) => {
    if (atual > anterior) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (atual < anterior) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getQualidadeColor = (percent: number) => {
    if (percent >= 90) return 'text-green-500';
    if (percent >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-PT').format(num);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `há ${Math.floor(diff / 60)}m`;
    return `há ${Math.floor(diff / 3600)}h`;
  };

  // Gerar dados de tendência para sparklines
  const generateTrendData = (baseValue: number, days: number = 7): number[] => {
    return Array.from({ length: days }, (_, i) => {
      const variation = (Math.random() - 0.5) * 20; // ±10% variação
      return Math.max(0, Math.min(100, baseValue + variation));
    });
  };

  if (loading && !kpiData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}
      >
        <div className="flex items-center justify-center space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-6 w-6 text-blue-500" />
          </motion.div>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Carregando métricas em tempo real...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border ${darkMode ? 'border-red-700' : 'border-red-200'} shadow-xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <XCircle className="h-6 w-6 text-red-500" />
            <span className={`${darkMode ? 'text-red-300' : 'text-red-700'}`}>
              {error}
            </span>
          </div>
          <button
            onClick={fetchKPIs}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </motion.div>
    );
  }

  if (!kpiData) return null;

  // Dados para sparklines
  const qualityTrendData = generateTrendData(kpiData.month?.qualidade_percent || 85);
  const testsTrendData = generateTrendData(kpiData.week?.total_ensaios || 50);
  const ncTrendData = generateTrendData(kpiData.month?.reprovados || 5);
  const slaTrendData = generateTrendData(kpiData.sla[0]?.taxa_aprovacao || 95);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg`}>
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Métricas em Tempo Real
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Dados atualizados {formatTimeAgo(lastUpdate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Alert Counter */}
          {activeAlerts.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                {activeAlerts.length} alertas
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}
          
          <button
            onClick={fetchKPIs}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Qualidade Global */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Qualidade
                </span>
              </div>
              {kpiData.month && getTendenciaIcon(kpiData.month.qualidade_percent, 85)}
            </div>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className={`text-2xl font-bold ${getQualidadeColor(kpiData.month?.qualidade_percent || 0)}`}>
                {kpiData.month?.qualidade_percent || 0}%
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                últimos 30d
              </span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 mb-3">
              {kpiData.month?.aprovados || 0} aprovados / {kpiData.month?.total_ensaios || 0} total
            </div>

            {/* Sparkline */}
            <div className="flex justify-end">
              <SparklineChart
                data={qualityTrendData}
                width={80}
                height={30}
                color="#10B981"
                showAlert={alertService.hasActiveAlerts('quality')}
                animate={true}
              />
            </div>
          </div>
        </motion.div>

        {/* Ensaios Realizados */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5 text-blue-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ensaios
                </span>
              </div>
              {kpiData.week && getTendenciaIcon(kpiData.week.total_ensaios, 50)}
            </div>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatNumber(kpiData.week?.total_ensaios || 0)}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                últimos 7d
              </span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 mb-3">
              {kpiData.week?.pendentes || 0} pendentes
            </div>

            {/* Sparkline */}
            <div className="flex justify-end">
              <SparklineChart
                data={testsTrendData}
                width={80}
                height={30}
                color="#3B82F6"
                showAlert={alertService.hasActiveAlerts('tests')}
                animate={true}
              />
            </div>
          </div>
        </motion.div>

        {/* Não Conformidades */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  NCs
                </span>
              </div>
              {kpiData.nc.length > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {kpiData.month?.reprovados || 0}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                últimos 30d
              </span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 mb-3">
              {kpiData.nc.length} categorias afetadas
            </div>

            {/* Sparkline */}
            <div className="flex justify-end">
              <SparklineChart
                data={ncTrendData}
                width={80}
                height={30}
                color="#EF4444"
                showAlert={alertService.hasActiveAlerts('nc')}
                animate={true}
              />
            </div>
          </div>
        </motion.div>

        {/* SLA Laboratório */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Taxa Aprovação
                </span>
              </div>
              {kpiData.sla.length > 0 && (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
            </div>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {kpiData.sla.length > 0 ? Math.round(kpiData.sla[0]?.taxa_aprovacao || 0) : 0}%
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                laboratórios
              </span>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 mb-3">
              {kpiData.sla.length > 0 ? kpiData.sla[0]?.total_ensaios || 0 : 0} ensaios processados
            </div>

            {/* Sparkline */}
            <div className="flex justify-end">
              <SparklineChart
                data={slaTrendData}
                width={80}
                height={30}
                color="#8B5CF6"
                showAlert={alertService.hasActiveAlerts('sla')}
                animate={true}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dados Globais */}
      {kpiData.global && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatNumber(kpiData.global.total_ensaios_historico)}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Histórico
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {kpiData.global.total_laboratorios}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Laboratórios
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {kpiData.global.total_tipos_ensaios}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tipos Ensaios
              </div>
            </div>
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {kpiData.global.total_zonas}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Zonas Ativas
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
