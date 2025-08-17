import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  TestTube,
  ClipboardCheck,
  FileText,
  Building,
  Users,
  Calendar,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart,
  LineChart,
  AreaChart,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  ComposedChart,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  Sector,
} from "recharts";
import { calcularMetricasReais } from "@/services/metricsService";
import { MetricasReais } from "@/services/metricsService";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState<MetricasReais | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"overview" | "detailed">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
      const data = await calcularMetricasReais();
      setMetricas(data);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    carregarMetricas();
    toast.success("Métricas atualizadas!");
  };

  const handleVerDetalhes = (modulo: string) => {
    // Navegar para módulos específicos
    console.log(`Navegando para módulo: ${modulo}`);
    switch (modulo) {
      case "ensaios":
        navigate("/ensaios");
        break;
      case "checklists":
        navigate("/checklists");
        break;
      case "materiais":
        navigate("/materiais");
        break;
      case "fornecedores":
        navigate("/fornecedores");
        break;
      case "nao-conformidades":
        navigate("/nao-conformidades");
        break;
      case "documentos":
        navigate("/documentos");
        break;
      case "obras":
        navigate("/obras");
        break;
      case "relatorios":
        navigate("/relatorios");
        break;
      default:
        console.log(`Módulo ${modulo} não mapeado`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Carregando centro de comando...</p>
        </div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar métricas</p>
        </div>
      </div>
    );
  }

  // Dados para gráficos animados
  const chartData = [
    { name: 'Ensaios', value: metricas.ensaios.total_ensaios, color: '#8b5cf6' },
    { name: 'Checklists', value: metricas.checklists.total_checklists, color: '#10b981' },
    { name: 'Materiais', value: metricas.materiais.total_materiais, color: '#f59e0b' },
    { name: 'Documentos', value: metricas.documentos.total_documentos, color: '#3b82f6' },
  ];

  const trendData = [
    { name: 'Jan', ensaios: 65, checklists: 28, materiais: 45 },
    { name: 'Fev', ensaios: 59, checklists: 48, materiais: 52 },
    { name: 'Mar', ensaios: 80, checklists: 40, materiais: 61 },
    { name: 'Abr', ensaios: 81, checklists: 19, materiais: 55 },
    { name: 'Mai', ensaios: 56, checklists: 96, materiais: 48 },
    { name: 'Jun', ensaios: 55, checklists: 27, materiais: 67 },
  ];

  const kpiCards = [
    {
      title: "Conformidade Geral",
      value: `${metricas.geral.conformidade_geral.toFixed(1)}%`,
      change: "+2.5%",
      changeType: "positive" as const,
      icon: Target,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-100 to-green-100",
      borderColor: "border-emerald-200/50",
      onClick: () => handleVerDetalhes("geral"),
    },
    {
      title: "Total de Registos",
      value: metricas.geral.total_registros.toLocaleString(),
      change: "+12",
      changeType: "positive" as const,
      icon: BarChart3,
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-100 to-indigo-100",
      borderColor: "border-blue-200/50",
      onClick: () => handleVerDetalhes("relatorios"),
    },
    {
      title: "Ensaios",
      value: metricas.ensaios.total_ensaios.toLocaleString(),
      change: `${metricas.ensaios.taxa_conformidade.toFixed(1)}% conformes`,
      changeType: "positive" as const,
      icon: TestTube,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-100 to-pink-100",
      borderColor: "border-purple-200/50",
      onClick: () => handleVerDetalhes("ensaios"),
    },
    {
      title: "Materiais",
      value: metricas.materiais.total_materiais.toLocaleString(),
      change: `${metricas.materiais.taxa_aprovacao.toFixed(1)}% aprovados`,
      changeType: "positive" as const,
      icon: Package,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-100 to-red-100",
      borderColor: "border-orange-200/50",
      onClick: () => handleVerDetalhes("materiais"),
    },
  ];

  const quickActions = [
    {
      title: "Novo Ensaio",
      description: "Criar ensaio laboratorial",
      icon: TestTube,
      color: "from-purple-500 to-pink-500",
      onClick: () => navigate("/ensaios"),
    },
    {
      title: "Checklist",
      description: "Inspeção de qualidade",
      icon: ClipboardCheck,
      color: "from-emerald-500 to-green-500",
      onClick: () => navigate("/checklists"),
    },
    {
      title: "Material",
      description: "Registar material",
      icon: Package,
      color: "from-orange-500 to-red-500",
      onClick: () => navigate("/materiais"),
    },
    {
      title: "Relatório",
      description: "Gerar relatório",
      icon: FileText,
      color: "from-blue-500 to-indigo-500",
      onClick: () => navigate("/relatorios"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              Centro de Comando Qualicore
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              Visão geral da qualidade e conformidade em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
              {(["7d", "30d", "90d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {period === "7d" ? "7 dias" : period === "30d" ? "30 dias" : "90 dias"}
                </button>
              ))}
            </div>
            <button 
              onClick={handleRefresh} 
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principais - Ultra Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {kpiCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="group cursor-pointer relative"
            onClick={card.onClick}
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} rounded-t-3xl`}></div>
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.changeType === "positive" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {card.changeType === "positive" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div className={`h-1 bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000 ease-out`} 
                       style={{ width: `${Math.random() * 100}%` }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart - Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Distribuição por Módulo</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <PieChartIcon className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={2000}
                  animationBegin={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Line Chart - Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Tendências dos Últimos 6 Meses</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ensaios" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="checklists" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="materiais" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-blue-500" />
          Ações Rápidas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="group cursor-pointer"
              onClick={action.onClick}
            >
              <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                  
                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-500" />
            Atividade Recente
          </h3>
          <button className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200">
            Ver tudo
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { icon: TestTube, text: "Novo ensaio de compactação criado", time: "2 min atrás", color: "text-purple-500" },
            { icon: ClipboardCheck, text: "Checklist de segurança concluído", time: "15 min atrás", color: "text-green-500" },
            { icon: Package, text: "Material aprovado para uso", time: "1 hora atrás", color: "text-orange-500" },
            { icon: FileText, text: "Relatório mensal gerado", time: "2 horas atrás", color: "text-blue-500" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200"
            >
              <div className={`w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center`}>
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.text}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

