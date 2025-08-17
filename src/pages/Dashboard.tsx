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
    return <LoadingSpinner message="Carregando métricas..." variant="dots" />;
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
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
              Dashboard Qualicore
            </h1>
            <p className="text-xl text-gray-600">
              Visão geral da qualidade e conformidade
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRefresh} 
              className="btn btn-outline btn-md group"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Atualizar
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs Principais */}
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
            className="glass-card p-8 rounded-3xl cursor-pointer group hover:scale-105 transition-all duration-500 relative overflow-hidden"
            onClick={card.onClick}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {card.changeType === "positive" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                {card.value}
              </div>
              
              <div className="text-sm font-semibold text-gray-600 mb-1">
                {card.title}
              </div>
              
              <div className={`text-sm font-bold ${
                card.changeType === "positive" 
                  ? "text-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                  : "text-red-600 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
              }`}>
                {card.change}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass-card p-6 rounded-3xl cursor-pointer group hover:scale-105 transition-all duration-500 relative overflow-hidden"
              onClick={action.onClick}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        {/* Conformidade Chart */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
              Conformidade por Módulo
            </h3>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={[
                { name: "Ensaios", conformidade: metricas.ensaios.taxa_conformidade },
                { name: "Checklists", conformidade: metricas.checklists.conformidade_media },
                { name: "Materiais", conformidade: metricas.materiais.taxa_aprovacao },
                { name: "Documentos", conformidade: 85 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Bar 
                  dataKey="conformidade" 
                  fill="url(#conformidadeGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="conformidadeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
              Atividade Recente
            </h3>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={[
                { name: "Jan", ensaios: 12, checklists: 8, materiais: 15 },
                { name: "Fev", ensaios: 18, checklists: 12, materiais: 22 },
                { name: "Mar", ensaios: 15, checklists: 10, materiais: 18 },
                { name: "Abr", ensaios: 25, checklists: 16, materiais: 28 },
                { name: "Mai", ensaios: 22, checklists: 14, materiais: 24 },
                { name: "Jun", ensaios: 30, checklists: 20, materiais: 32 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ensaios" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="checklists" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="materiais" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
            Atividade Recente
          </h3>
          <button className="btn btn-ghost btn-sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Tudo
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { type: "Ensaio", action: "Novo ensaio criado", time: "2 min atrás", icon: TestTube, color: "from-purple-500 to-pink-500" },
            { type: "Checklist", action: "Inspeção concluída", time: "15 min atrás", icon: ClipboardCheck, color: "from-emerald-500 to-green-500" },
            { type: "Material", action: "Material aprovado", time: "1 hora atrás", icon: Package, color: "from-orange-500 to-red-500" },
            { type: "Documento", action: "Relatório gerado", time: "2 horas atrás", icon: FileText, color: "from-blue-500 to-indigo-500" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/50 transition-colors duration-300"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <activity.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.type}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

