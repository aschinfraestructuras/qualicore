import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Target, 
  BarChart3, PieChart, Activity,
  CheckCircle, AlertTriangle, Clock,
  DollarSign, Users, Award, Zap,
  Shield, Star, Crown, Rocket,
  Globe, Lightbulb, Leaf, Cpu
} from 'lucide-react';

interface SGQChartsProps {
  darkMode: boolean;
}

interface SGQData {
  qualidadeGlobal: number;
  eficienciaOperacional: number;
  gestaoRiscos: number;
  roiSistema: number;
  objetivosEstrategicos: number;
  projetosAtivos: number;
  tendenciaQualidade: number[];
  performanceCategorias: {
    gestao: number;
    qualidade: number;
    execucao: number;
    especializacao: number;
  };
  distribuicaoRecursos: {
    planeamento: number;
    controlo: number;
    execucao: number;
    auditoria: number;
  };
  metricasAvancadas: {
    inovacao: number;
    sustentabilidade: number;
    digitalizacao: number;
    conformidade: number;
  };
}

export const SGQCharts: React.FC<SGQChartsProps> = ({ darkMode }) => {
  // Mock data for SGQ global metrics
  const sgqData: SGQData = {
    qualidadeGlobal: 94.2,
    eficienciaOperacional: 87.5,
    gestaoRiscos: 91.8,
    roiSistema: 23.4,
    objetivosEstrategicos: 89.7,
    projetosAtivos: 12,
    tendenciaQualidade: [88, 89, 91, 90, 92, 93, 94, 93, 95, 94, 96, 94.2],
    performanceCategorias: {
      gestao: 92,
      qualidade: 95,
      execucao: 89,
      especializacao: 91
    },
    distribuicaoRecursos: {
      planeamento: 25,
      controlo: 30,
      execucao: 35,
      auditoria: 10
    },
    metricasAvancadas: {
      inovacao: 88,
      sustentabilidade: 92,
      digitalizacao: 85,
      conformidade: 96
    }
  };

  const getQualidadeColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 80) return 'text-amber-500';
    return 'text-red-500';
  };

  // Ultra Premium Gauge Chart Component
  const UltraPremiumGaugeChart: React.FC<{ value: number; title: string; subtitle: string; icon: any; color: string; gradient: string }> = ({ value, title, subtitle, icon: Icon, color, gradient }) => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/90 to-gray-50/90'} backdrop-blur-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} overflow-hidden group`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-2xl`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Gauge */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width="240" height="240" className="transform -rotate-90">
                {/* Background Circle with Pattern */}
                <defs>
                  <pattern id={`${title.replace(/\s+/g, '')}Pattern`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill={darkMode ? '#374151' : '#E5E7EB'} opacity="0.3"/>
                  </pattern>
                </defs>
                
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke={`url(#${title.replace(/\s+/g, '')}Pattern)`}
                  strokeWidth="16"
                  fill="none"
                  opacity="0.5"
                />
                
                {/* Progress Circle with Glow */}
                <motion.circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke={`url(#${title.replace(/\s+/g, '')}Gradient)`}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  filter="drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
                />
                
                {/* Inner Glow */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius - 8}
                  stroke={`url(#${title.replace(/\s+/g, '')}Gradient)`}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                  filter="blur(4px)"
                />
              </svg>
              
              {/* Gradient Definitions */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id={`${title.replace(/\s+/g, '')}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color.split('-')[1] === 'emerald' ? '#10B981' : color.split('-')[1] === 'amber' ? '#F59E0B' : color.split('-')[1] === 'blue' ? '#3B82F6' : '#8B5CF6'} stopOpacity="0.8" />
                    <stop offset="50%" stopColor={color.split('-')[1] === 'emerald' ? '#059669' : color.split('-')[1] === 'amber' ? '#D97706' : color.split('-')[1] === 'blue' ? '#2563EB' : '#7C3AED'} stopOpacity="1" />
                    <stop offset="100%" stopColor={color.split('-')[1] === 'emerald' ? '#047857' : color.split('-')[1] === 'amber' ? '#B45309' : color.split('-')[1] === 'blue' ? '#1D4ED8' : '#6D28D9'} stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className={`text-5xl font-bold ${getQualidadeColor(value)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    {value}%
                  </motion.div>
                  <motion.div 
                    className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {value >= 90 ? 'Excelente' : value >= 80 ? 'Bom' : 'Melhorar'}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 }}
              className={`w-3 h-3 rounded-full ${value >= 90 ? 'bg-emerald-500' : value >= 80 ? 'bg-amber-500' : 'bg-red-500'} shadow-lg`}
            />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {value >= 90 ? 'Meta atingida' : value >= 80 ? 'Em progresso' : 'Ação necessária'}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Ultra Premium Line Chart Component
  const UltraPremiumLineChart: React.FC<{ data: number[]; title: string; subtitle: string }> = ({ data, title, subtitle }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 320;
      const y = 100 - ((value - minValue) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${points} L 320,100 L 0,100 Z`;

    return (
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/90 to-gray-50/90'} backdrop-blur-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} overflow-hidden group`}
      >
        {/* Header */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{title}</h3>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
        </div>

        {/* Chart */}
        <div className="relative">
          <svg width="340" height="120" className="w-full">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Area Fill */}
            <motion.path
              d={`M ${areaPoints}`}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
            />
            
            {/* Line */}
            <motion.path
              d={`M ${points}`}
              stroke="url(#lineGradient)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              filter="url(#glow)"
              strokeLinecap="round"
            />
            
            {/* Data Points */}
            {data.map((value, index) => {
              const x = (index / (data.length - 1)) * 320;
              const y = 100 - ((value - minValue) / range) * 80;
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#3B82F6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="drop-shadow-2xl"
                  filter="url(#glow)"
                />
              );
            })}
          </svg>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200/30">
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Média</div>
            <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tendência</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span className={`text-lg font-medium text-emerald-500`}>+2.1%</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Ultra Premium Bar Chart Component
  const UltraPremiumBarChart: React.FC<{ data: any; title: string; subtitle: string }> = ({ data, title, subtitle }) => {
    const maxValue = Math.max(...Object.values(data));
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    
    return (
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/90 to-gray-50/90'} backdrop-blur-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} overflow-hidden group`}
      >
        {/* Header */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{title}</h3>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
        </div>

        {/* Bars */}
        <div className="space-y-6">
          {Object.entries(data).map(([key, value], index) => (
            <motion.div 
              key={key}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {value}%
                </span>
              </div>
              <div className="relative">
                <div className={`h-4 bg-gray-200 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <motion.div
                    className={`h-full rounded-full shadow-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(value as number / maxValue) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 1.5, ease: "easeOut" }}
                    style={{
                      background: `linear-gradient(90deg, ${colors[index % colors.length]}80, ${colors[index % colors.length]}, ${colors[index % colors.length]}CC)`
                    }}
                  />
                </div>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Ultra Premium Radar Chart Component
  const UltraPremiumRadarChart: React.FC<{ data: any; title: string; subtitle: string }> = ({ data, title, subtitle }) => {
    const categories = Object.keys(data);
    const values = Object.values(data) as number[];
    const maxValue = Math.max(...values);
    
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    
    const points = categories.map((_, index) => {
      const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
      const value = values[index];
      const r = (value / maxValue) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return { x, y, value, category: categories[index] };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/90 to-gray-50/90'} backdrop-blur-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} overflow-hidden group`}
      >
        {/* Header */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{title}</h3>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
        </div>

        {/* Radar Chart */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width="260" height="260" className="transform -rotate-90">
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                </linearGradient>
                <filter id="radarGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Grid Circles */}
              {[20, 40, 60, 80].map((r, i) => (
                <circle
                  key={i}
                  cx={centerX}
                  cy={centerY}
                  r={r}
                  stroke={darkMode ? '#374151' : '#E5E7EB'}
                  strokeWidth="1"
                  fill="none"
                  opacity="0.2"
                />
              ))}
              
              {/* Grid Lines */}
              {categories.map((_, index) => {
                const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return (
                  <line
                    key={index}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke={darkMode ? '#374151' : '#E5E7EB'}
                    strokeWidth="1"
                    opacity="0.2"
                  />
                );
              })}
              
              {/* Data Polygon */}
              <motion.polygon
                points={polygonPoints}
                fill="url(#radarGradient)"
                stroke="#3B82F6"
                strokeWidth="3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                filter="url(#radarGlow)"
              />
              
              {/* Data Points */}
              {points.map((point, index) => (
                <motion.circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#3B82F6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="drop-shadow-2xl"
                  filter="url(#radarGlow)"
                />
              ))}
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Média</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {points.map((point, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {point.category.charAt(0).toUpperCase() + point.category.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3`}>
          Métricas Globais
        </h2>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Indicadores de performance e qualidade
        </p>
      </motion.div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <UltraPremiumGaugeChart 
          value={sgqData.qualidadeGlobal} 
          title="Qualidade Global" 
          subtitle="Indicador principal do sistema"
          icon={Shield}
          color="from-emerald-500 to-emerald-600"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <UltraPremiumGaugeChart 
          value={sgqData.eficienciaOperacional} 
          title="Eficiência Operacional" 
          subtitle="Performance operacional"
          icon={Zap}
          color="from-blue-500 to-blue-600"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <UltraPremiumGaugeChart 
          value={sgqData.gestaoRiscos} 
          title="Gestão de Riscos" 
          subtitle="Controlo de riscos"
          icon={AlertTriangle}
          color="from-amber-500 to-amber-600"
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <UltraPremiumGaugeChart 
          value={sgqData.roiSistema} 
          title="ROI do Sistema" 
          subtitle="Retorno sobre investimento"
          icon={DollarSign}
          color="from-purple-500 to-purple-600"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UltraPremiumLineChart 
          data={sgqData.tendenciaQualidade} 
          title="Tendência de Qualidade" 
          subtitle="Evolução dos últimos 12 meses"
        />
        <UltraPremiumBarChart 
          data={sgqData.performanceCategorias} 
          title="Performance por Categoria" 
          subtitle="Análise por área de atividade"
        />
        <UltraPremiumRadarChart 
          data={sgqData.metricasAvancadas} 
          title="Métricas Avançadas" 
          subtitle="Indicadores estratégicos"
        />
        
        {/* Summary Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/90 to-gray-50/90'} backdrop-blur-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} overflow-hidden group`}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Resumo Executivo
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Visão consolidada do sistema
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center space-x-4">
                <Target className="h-6 w-6 text-blue-500" />
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Objetivos Estratégicos
                </span>
              </div>
              <span className={`text-xl font-bold ${getQualidadeColor(sgqData.objetivosEstrategicos)}`}>
                {sgqData.objetivosEstrategicos}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center space-x-4">
                <Users className="h-6 w-6 text-emerald-500" />
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Projetos Ativos
                </span>
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {sgqData.projetosAtivos}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-6 w-6 text-purple-500" />
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ROI Anual
                </span>
              </div>
              <span className="text-xl font-bold text-emerald-500">
                +{sgqData.roiSistema}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div className="flex items-center space-x-4">
                <Award className="h-6 w-6 text-amber-500" />
                <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Status Sistema
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-lg font-medium text-emerald-500">Excelente</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
