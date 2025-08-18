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
      case "controlo-betonagens":
        navigate("/controlo-betonagens");
        break;
      case "caracterizacao-solos":
        navigate("/caracterizacao-solos");
        break;
      case "via-ferrea":
        navigate("/via-ferrea");
        break;
      case "pontes-tuneis":
        navigate("/pontes-tuneis");
        break;
      case "sinalizacao":
        navigate("/sinalizacao");
        break;
      case "eletrificacao":
        navigate("/eletrificacao");
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

  // Dados reais para gráficos baseados nas métricas da Supabase
  const realChartData = [
    { name: 'Ensaios', value: metricas.ensaios.total_ensaios, color: '#8b5cf6', percentage: ((metricas.ensaios.total_ensaios / metricas.geral.total_registros) * 100).toFixed(1) },
    { name: 'Checklists', value: metricas.checklists.total_checklists, color: '#10b981', percentage: ((metricas.checklists.total_checklists / metricas.geral.total_registros) * 100).toFixed(1) },
    { name: 'Materiais', value: metricas.materiais.total_materiais, color: '#f59e0b', percentage: ((metricas.materiais.total_materiais / metricas.geral.total_registros) * 100).toFixed(1) },
    { name: 'Documentos', value: metricas.documentos.total_documentos, color: '#3b82f6', percentage: ((metricas.documentos.total_documentos / metricas.geral.total_registros) * 100).toFixed(1) },
    { name: 'Betonagens', value: metricas.betonagens?.total_betonagens || 0, color: '#ef4444', percentage: metricas.betonagens?.total_betonagens ? ((metricas.betonagens.total_betonagens / metricas.geral.total_registros) * 100).toFixed(1) : '0.0' },
    { name: 'Via Férrea', value: metricas.ferroviario?.via_ferrea?.total_trilhos || 0, color: '#06b6d4', percentage: metricas.ferroviario?.via_ferrea?.total_trilhos ? ((metricas.ferroviario.via_ferrea.total_trilhos / metricas.geral.total_registros) * 100).toFixed(1) : '0.0' },
  ].filter(item => item.value > 0); // Filtrar apenas itens com dados

  // Dados de tendências baseados em métricas reais
  const realTrendData = [
    { 
      name: 'Conformidade', 
      ensaios: metricas.ensaios.taxa_conformidade, 
      checklists: metricas.checklists.conformidade_media, 
      materiais: metricas.materiais.taxa_aprovacao,
      betonagens: metricas.betonagens?.conformes ? ((metricas.betonagens.conformes / metricas.betonagens.total_betonagens) * 100) : 0,
      via_ferrea: metricas.ferroviario?.via_ferrea?.conformidade || 0
    },
    { 
      name: 'Pendentes', 
      ensaios: metricas.ensaios.ensaios_pendentes, 
      checklists: metricas.checklists.checklists_pendentes, 
      materiais: metricas.materiais.materiais_pendentes,
      betonagens: metricas.betonagens?.ensaios_7d_pendentes || 0,
      via_ferrea: metricas.ferroviario?.via_ferrea?.km_pendentes || 0
    },
    { 
      name: 'Críticos', 
      ensaios: metricas.ensaios.ensaios_nao_conformes, 
      checklists: metricas.checklists.checklists_nao_conformes, 
      materiais: metricas.materiais.materiais_rejeitados,
      betonagens: metricas.betonagens?.ensaios_28d_pendentes || 0,
      via_ferrea: metricas.ferroviario?.via_ferrea?.trilhos_criticos || 0
    }
  ];

  // Dados para gráficos animados (usando dados reais)
  const chartData = realChartData;
  const trendData = realTrendData;

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

      {/* Módulos Especializados */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Betonagens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="group cursor-pointer relative"
          onClick={() => handleVerDetalhes('controlo-betonagens')}
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metricas.betonagens?.conformes || 0} conformes</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Betonagens</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metricas.betonagens?.total_betonagens || 0}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(metricas.betonagens?.conformes || 0) / (metricas.betonagens?.total_betonagens || 1) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Via Férrea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="group cursor-pointer relative"
          onClick={() => handleVerDetalhes('via-ferrea')}
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metricas.ferroviario?.via_ferrea?.km_cobertos || 0} km</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Via Férrea</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metricas.ferroviario?.via_ferrea?.total_trilhos || 0}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(metricas.ferroviario?.via_ferrea?.conformidade || 0)}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pontes & Túneis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="group cursor-pointer relative"
          onClick={() => handleVerDetalhes('pontes-tuneis')}
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metricas.ferroviario?.pontes_tuneis?.ativas || 0} ativas</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pontes & Túneis</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metricas.ferroviario?.pontes_tuneis?.total_pontes_tuneis || 0}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(metricas.ferroviario?.pontes_tuneis?.ativas || 0) / (metricas.ferroviario?.pontes_tuneis?.total_pontes_tuneis || 1) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sinalização */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="group cursor-pointer relative"
          onClick={() => handleVerDetalhes('sinalizacao')}
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>{metricas.ferroviario?.sinalizacao?.operacionais || 0} operacionais</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Sinalização</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metricas.ferroviario?.sinalizacao?.total_sinalizacoes || 0}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(metricas.ferroviario?.sinalizacao?.operacionais || 0) / (metricas.ferroviario?.sinalizacao?.total_sinalizacoes || 1) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
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
              <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart - Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Métricas de Performance</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <BarChart className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={trendData}>
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
                <Legend />
                <Bar 
                  dataKey="ensaios" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                  name="Ensaios"
                />
                <Bar 
                  dataKey="checklists" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  name="Checklists"
                />
                <Bar 
                  dataKey="materiais" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                  name="Materiais"
                />
                <Bar 
                  dataKey="betonagens" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  name="Betonagens"
                />
                <Bar 
                  dataKey="via_ferrea" 
                  fill="#06b6d4" 
                  radius={[4, 4, 0, 0]}
                  name="Via Férrea"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="h-6 w-6 mr-3 text-blue-500" />
          Visão Geral de Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Conformidade Geral */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{metricas.geral.conformidade_geral.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Conformidade</div>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Conformidade Geral</h4>
              <p className="text-gray-600 text-sm mb-4">Taxa média de conformidade em todos os módulos</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${metricas.geral.conformidade_geral}%` }}></div>
              </div>
            </div>
          </motion.div>

          {/* Alertas Críticos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-red-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{metricas.geral.alertas_criticos}</div>
                  <div className="text-sm text-gray-500">Críticos</div>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Alertas Críticos</h4>
              <p className="text-gray-600 text-sm mb-4">Itens que requerem atenção imediata</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ensaios não conformes:</span>
                  <span className="font-semibold text-red-600">{metricas.ensaios.ensaios_nao_conformes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Materiais rejeitados:</span>
                  <span className="font-semibold text-red-600">{metricas.materiais.materiais_rejeitados}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Eficiência Operacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{metricas.geral.total_registros}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Eficiência Operacional</h4>
              <p className="text-gray-600 text-sm mb-4">Total de registos processados</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Checklists concluídos:</span>
                  <span className="font-semibold text-green-600">{metricas.checklists.checklists_concluidos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documentos ativos:</span>
                  <span className="font-semibold text-blue-600">{metricas.documentos.total_documentos}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-blue-500" />
            Status dos Módulos
          </h3>
          <button 
            onClick={() => handleVerDetalhes("relatorios")}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Ver relatórios
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Ensaios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200 cursor-pointer"
            onClick={() => handleVerDetalhes("ensaios")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TestTube className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Ensaios</p>
                <p className="text-xs text-gray-500">{metricas.ensaios.total_ensaios} total</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Conformes:</span>
                <span className="font-semibold text-green-600">{metricas.ensaios.ensaios_conformes}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-semibold text-orange-600">{metricas.ensaios.ensaios_pendentes}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Não conformes:</span>
                <span className="font-semibold text-red-600">{metricas.ensaios.ensaios_nao_conformes}</span>
              </div>
            </div>
          </motion.div>

          {/* Status Checklists */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200 cursor-pointer"
            onClick={() => handleVerDetalhes("checklists")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Checklists</p>
                <p className="text-xs text-gray-500">{metricas.checklists.total_checklists} total</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Concluídos:</span>
                <span className="font-semibold text-green-600">{metricas.checklists.checklists_concluidos}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-semibold text-orange-600">{metricas.checklists.checklists_pendentes}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Não conformes:</span>
                <span className="font-semibold text-red-600">{metricas.checklists.checklists_nao_conformes}</span>
              </div>
            </div>
          </motion.div>

          {/* Status Materiais */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200 cursor-pointer"
            onClick={() => handleVerDetalhes("materiais")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Materiais</p>
                <p className="text-xs text-gray-500">{metricas.materiais.total_materiais} total</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Aprovados:</span>
                <span className="font-semibold text-green-600">{metricas.materiais.materiais_aprovados}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-semibold text-orange-600">{metricas.materiais.materiais_pendentes}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Rejeitados:</span>
                <span className="font-semibold text-red-600">{metricas.materiais.materiais_rejeitados}</span>
              </div>
            </div>
          </motion.div>

          {/* Status Betonagens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200 cursor-pointer"
            onClick={() => handleVerDetalhes("controlo-betonagens")}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Betonagens</p>
                <p className="text-xs text-gray-500">{metricas.betonagens?.total_betonagens || 0} total</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Conformes:</span>
                <span className="font-semibold text-green-600">{metricas.betonagens?.conformes || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">7d pendentes:</span>
                <span className="font-semibold text-orange-600">{metricas.betonagens?.ensaios_7d_pendentes || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">28d pendentes:</span>
                <span className="font-semibold text-red-600">{metricas.betonagens?.ensaios_28d_pendentes || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

