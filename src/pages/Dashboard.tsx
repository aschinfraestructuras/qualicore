import {
  Hammer, Building, Building2, Wrench, Package, Database, Award, FileText, Truck, Bell, ClipboardCheck, AlertTriangle, AlertCircle, Upload, FileCheck,
  RefreshCw, Globe, Shield, TestTube, Train, Zap, Eye, HardHat, CheckCircle, Clock, Target, ChevronRight, TrendingUp, Minus, Users, Settings, BookOpen, BarChart3,
  Activity, Zap as Lightning, TrendingDown, Star, Crown, Sparkles, Rocket, Flame, Heart, Gem, Diamond, Plus, Download, Menu, Play, Pause, RotateCcw,
  ArrowRight, ArrowLeft, Move, GripVertical, Zap as LightningBolt, Sparkles as SparklesIcon, Star as StarIcon, Crown as CrownIcon, Globe as GlobeIcon, 
  Calendar, MapPin, Euro, TrendingUp as TrendingUpIcon, AlertCircle as AlertCircleIcon, CheckSquare, FileText as FileTextIcon, BarChart, PieChart, LineChart, Sun, Moon,
  Linkedin, ExternalLink, Zap as LightningIcon, Sparkles as SparklesIcon2, HelpCircle, Grid3X3, FolderOpen, Layers, LayoutDashboard, ArrowUp, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SGQCharts } from "../components/SGQCharts";
import QuickNavigation from "../components/QuickNavigation";

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'analytics'>('overview');

  // Dados reais - sem valores mock falsos
  const qualicoreData = {
    qualidadeGlobal: { valor: 0, tendencia: 'stable', meta: 95 },
    naoConformidades: { total: 0, criticas: 0, pendentes: 0, resolvidas: 0 },
    ensaios: { realizados: 0, planeados: 0, aprovados: 0, rejeitados: 0 },
    objetivos: { atingidos: 0, total: 0, percentagem: 0 },
    prazos: { emDia: 0, atrasados: 0, criticos: 0 },
    custoQualidade: { valor: 0, percentagem: 0, tendencia: 'stable' },
    eficiencia: { valor: 0, tendencia: 'stable', meta: 90 },
    conformidadeISO: { iso9001: 0, np10005: 0, en1090: 0 }
  };

  // Alertas em tempo real
  const alertas = [
    { id: 1, tipo: 'info', modulo: 'Sistema', mensagem: 'Bem-vindo ao QUALICORE', tempo: 'Agora', prioridade: 'baixa' }
  ];

  // Módulos reorganizados por fluxo de trabalho
  const workflowSections = [
    {
      id: "planeamento-gestao",
      title: "Planeamento, Gestão & Documentação",
      subtitle: "Gestão de projetos, obras, materiais e documentação",
      icon: HardHat,
      color: "from-slate-600 to-gray-700",
      bgColor: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200",
      modules: [
        { id: "documentos", nome: "Documentos", nomeEN: "Documents", path: "/documentos", icon: FolderOpen, priority: "alta" },
        { id: "obras", nome: "Obras", nomeEN: "Projects", path: "/obras", icon: HardHat, priority: "alta" },
        { id: "rfis", nome: "RFIs", nomeEN: "RFIs", path: "/rfis", icon: HelpCircle, priority: "media" },
        { id: "submissao-materiais", nome: "Submissão Materiais", nomeEN: "Material Submission", path: "/submissao-materiais", icon: Upload, priority: "media" },
        { id: "relatorios", nome: "Relatórios", nomeEN: "Reports", path: "/relatorios", icon: BarChart3, priority: "media" },
        { id: "rececao-obra-garantias", nome: "Receção Obra e Garantias", nomeEN: "Work Reception and Guarantees", path: "/rececao-obra-garantias", icon: Building2, priority: "alta" }
      ]
    },
    {
      id: "qualidade",
      title: "Sistemas de Qualidade",
      subtitle: "Gestão da qualidade e conformidade",
      icon: Award,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      modules: [
        { id: "normas", nome: "Sistema de Normas", nomeEN: "Standards System", path: "/normas", icon: BookOpen, priority: "alta" },
        { id: "checklists", nome: "Checklists", nomeEN: "Checklists", path: "/checklists", icon: ClipboardCheck, priority: "alta" },
        { id: "pie", nome: "PIE - Pontos Inspeção", nomeEN: "PIE - Inspection Points", path: "/pie", icon: Eye, priority: "alta" },
        { id: "auditorias", nome: "Auditorias", nomeEN: "Audits", path: "/auditorias", icon: FileCheck, priority: "alta" },
        { id: "certificados", nome: "Certificados", nomeEN: "Certificates", path: "/certificados", icon: Award, priority: "media" },
        { id: "nao-conformidades", nome: "Não Conformidades", nomeEN: "Non-Conformities", path: "/nao-conformidades", icon: AlertTriangle, priority: "alta" }
      ]
    },
    {
      id: "execucao",
      title: "Execução & Controlo",
      subtitle: "Ensaios e controlos técnicos",
      icon: TestTube,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      modules: [
        { id: "caracterizacao-solos", nome: "Caracterização Solos", nomeEN: "Soil Characterization", path: "/caracterizacao-solos", icon: Layers, priority: "media" },
        { id: "ensaios-compactacao", nome: "Ensaios Compactação", nomeEN: "Compaction Tests", path: "/ensaios-compactacao", icon: BarChart3, priority: "alta" },
        { id: "controlo-betonagens", nome: "Controlo Betonagens", nomeEN: "Concrete Control", path: "/controlo-betonagens", icon: Wrench, priority: "alta" },
        { id: "armaduras", nome: "Armaduras", nomeEN: "Reinforcement", path: "/armaduras", icon: Package, priority: "alta" },
        { id: "ensaios", nome: "Ensaios", nomeEN: "Tests", path: "/ensaios", icon: TestTube, priority: "alta" }
      ]
    },
    {
      id: "especializacao",
      title: "Infraestrutura Ferroviária",
      subtitle: "Especialização em via férrea",
      icon: Train,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      modules: [
        { id: "via-ferrea", nome: "Via Férrea", nomeEN: "Railway", path: "/via-ferrea", icon: Train, priority: "alta" },
        { id: "pontes-tuneis", nome: "Pontes & Túneis", nomeEN: "Bridges & Tunnels", path: "/pontes-tuneis", icon: Building2, priority: "alta" },
        { id: "eletrificacao", nome: "Eletrificação", nomeEN: "Electrification", path: "/eletrificacao", icon: Zap, priority: "alta" },
        { id: "sinalizacao", nome: "Sinalização", nomeEN: "Signaling", path: "/sinalizacao", icon: Bell, priority: "alta" },
        { id: "estacoes", nome: "Estações", nomeEN: "Stations", path: "/estacoes", icon: Building, priority: "media" },
        { id: "seguranca-ferroviaria", nome: "Segurança Ferroviária", nomeEN: "Railway Safety", path: "/seguranca-ferroviaria", icon: Shield, priority: "alta" }
      ]
    },
    {
      id: "recursos",
      title: "Gestão de Recursos",
      subtitle: "Materiais, fornecedores e equipamentos",
      icon: Settings,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      modules: [
        { id: "materiais", nome: "Materiais", nomeEN: "Materials", path: "/materiais", icon: Grid3X3, priority: "alta" },
        { id: "fornecedores", nome: "Fornecedores", nomeEN: "Suppliers", path: "/fornecedores", icon: Users, priority: "media" },
        { id: "fornecedores-avancados", nome: "Fornecedores Avançados", nomeEN: "Advanced Suppliers", path: "/fornecedores-avancados", icon: Building2, priority: "alta" },
        { id: "calibracoes-equipamentos", nome: "Calibrações e Equipamentos", nomeEN: "Calibrations and Equipment", path: "/calibracoes-equipamentos", icon: Settings, priority: "media" }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'from-red-500 to-orange-500';
      case 'media': return 'from-yellow-500 to-orange-500';
      case 'baixa': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'bg-red-500';
      case 'aviso': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Carregando...</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Carregando sistema...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} relative overflow-hidden transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20' : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-cyan-50/50'}`}></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute top-20 left-20 w-96 h-96 ${darkMode ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10'} rounded-full blur-3xl`}
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute top-40 right-20 w-80 h-80 ${darkMode ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'} rounded-full blur-3xl`}
          />
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 ${darkMode ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95' : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-blue-200/50'} transition-colors duration-500`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                onClick={() => navigate("/dashboard")}
                className="relative w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer overflow-hidden border-2 border-blue-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 animate-pulse"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <LayoutDashboard className="h-8 w-8 text-white relative z-10" />
              </motion.div>
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}
                >
                  <SparklesIcon2 className="h-4 w-4 mr-2 text-blue-400" />
                  Sistema de Gestão da Qualidade - Referência Europeia
                </motion.p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/80 text-yellow-400' : 'bg-white/80 text-gray-700'} shadow-lg border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAlerts(!showAlerts)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/80 text-red-400' : 'bg-white/80 text-red-600'} shadow-lg border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} backdrop-blur-sm transition-all duration-300 hover:shadow-xl relative`}
              >
                <Bell className="h-5 w-5" />
                {alertas.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                  >
                    {alertas.length}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Exportar
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky top-0 z-40"
      >
        <QuickNavigation darkMode={darkMode} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Alertas */}
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Alertas em Tempo Real</h2>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alertas.length} alertas ativos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alertas.map((alerta, index) => (
                <motion.div
                  key={alerta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 ${getAlertColor(alerta.tipo)} rounded-full mt-1`}></div>
                      <div className="flex-1">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{alerta.modulo}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{alerta.mensagem}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>há {alerta.tempo}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prioridade: {alerta.prioridade}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dashboard Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className={`text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4`}
          >
            Dashboard Executivo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            Visão geral das métricas e indicadores de qualidade
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex justify-center mb-8"
        >
          <div className={`inline-flex rounded-2xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'modules', label: 'Módulos', icon: Grid3X3 },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} shadow-lg`
                      : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* SGQ Global Charts */}
              <SGQCharts darkMode={darkMode} />
              
              {/* Quick Access to Most Used Modules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
                                 <div className="text-center mb-8">
                   <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
                     Todos os Módulos do Sistema
                   </h2>
                   <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     23 módulos organizados por categoria para acesso direto
                   </p>
                 </div>

                                 {/* All Modules Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                   {[
                     // Planeamento & Gestão
                     { id: "obras", nome: "Obras", path: "/obras", icon: HardHat, color: "from-slate-600 to-gray-700" },
                     { id: "documentos", nome: "Documentos", path: "/documentos", icon: FolderOpen, color: "from-indigo-500 to-purple-500" },
                     { id: "rfis", nome: "RFIs", path: "/rfis", icon: HelpCircle, color: "from-blue-500 to-cyan-500" },
                     { id: "submissao-materiais", nome: "Submissão", path: "/submissao-materiais", icon: Upload, color: "from-purple-500 to-pink-500" },
                     { id: "relatorios", nome: "Relatórios", path: "/relatorios", icon: BarChart3, color: "from-orange-500 to-red-500" },
                     { id: "rececao-obra-garantias", nome: "Receção Obra", path: "/rececao-obra-garantias", icon: Building2, color: "from-indigo-500 to-purple-500" },
                     
                     // Qualidade
                     { id: "normas", nome: "Normas", path: "/normas", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
                     { id: "checklists", nome: "Checklists", path: "/checklists", icon: ClipboardCheck, color: "from-purple-500 to-pink-500" },
                     { id: "pie", nome: "PIE", path: "/pie", icon: Eye, color: "from-blue-500 to-cyan-500" },
                     { id: "auditorias", nome: "Auditorias", path: "/auditorias", icon: FileCheck, color: "from-indigo-500 to-purple-500" },
                     { id: "certificados", nome: "Certificados", path: "/certificados", icon: Award, color: "from-yellow-500 to-orange-500" },
                     { id: "nao-conformidades", nome: "Não Conformidades", path: "/nao-conformidades", icon: AlertTriangle, color: "from-red-500 to-pink-500" },
                     
                     // Execução
                     { id: "caracterizacao-solos", nome: "Solos", path: "/caracterizacao-solos", icon: Layers, color: "from-emerald-500 to-teal-500" },
                     { id: "ensaios-compactacao", nome: "Compactação", path: "/ensaios-compactacao", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
                     { id: "controlo-betonagens", nome: "Betonagens", path: "/controlo-betonagens", icon: Wrench, color: "from-slate-600 to-gray-700" },
                     { id: "armaduras", nome: "Armaduras", path: "/armaduras", icon: Package, color: "from-indigo-500 to-purple-500" },
                     { id: "ensaios", nome: "Ensaios", path: "/ensaios", icon: TestTube, color: "from-purple-500 to-pink-500" },
                     
                     // Ferroviária
                     { id: "via-ferrea", nome: "Via Férrea", path: "/via-ferrea", icon: Train, color: "from-indigo-500 to-purple-500" },
                     { id: "pontes-tuneis", nome: "Pontes & Túneis", path: "/pontes-tuneis", icon: Building2, color: "from-slate-600 to-gray-700" },
                     { id: "eletrificacao", nome: "Eletrificação", path: "/eletrificacao", icon: Zap, color: "from-yellow-500 to-orange-500" },
                     { id: "sinalizacao", nome: "Sinalização", path: "/sinalizacao", icon: Bell, color: "from-red-500 to-pink-500" },
                     { id: "estacoes", nome: "Estações", path: "/estacoes", icon: Building, color: "from-blue-500 to-cyan-500" },
                     { id: "seguranca-ferroviaria", nome: "Segurança", path: "/seguranca-ferroviaria", icon: Shield, color: "from-green-500 to-emerald-500" },
                     
                     // Recursos
                     { id: "materiais", nome: "Materiais", path: "/materiais", icon: Grid3X3, color: "from-purple-500 to-pink-500" },
                     { id: "fornecedores", nome: "Fornecedores", path: "/fornecedores", icon: Users, color: "from-emerald-500 to-teal-500" },
                     { id: "fornecedores-avancados", nome: "Fornecedores Av.", path: "/fornecedores-avancados", icon: Building2, color: "from-indigo-500 to-purple-500" },
                     { id: "calibracoes-equipamentos", nome: "Calibrações", path: "/calibracoes-equipamentos", icon: Settings, color: "from-slate-600 to-gray-700" }
                   ].map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(module.path)}
                      className={`relative p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} border-2 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group backdrop-blur-sm overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10 text-center">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <module.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} leading-tight`}>
                          {module.nome}
                        </h4>
                      </div>

                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Categorias de Módulos */}
              <div className="space-y-8">
                {workflowSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Cabeçalho da Categoria */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {section.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {section.subtitle}
                        </p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {section.modules.length} módulos
                      </span>
                    </div>

                    {/* Grid de Módulos da Categoria */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {section.modules.map((module, moduleIndex) => (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: sectionIndex * 0.1 + moduleIndex * 0.05 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(module.path)}
                          className={`relative p-5 rounded-2xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} border-2 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group backdrop-blur-sm overflow-hidden`}
                        >
                          {/* Background Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                          
                          {/* Priority Badge */}
                          {module.priority === 'alta' && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                          
                          <div className="relative z-10 text-center">
                            <motion.div 
                              className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                            >
                              <module.icon className="h-6 w-6 text-white" />
                            </motion.div>
                            <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-1 leading-tight`}>
                              {module.nome}
                            </h4>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                              {module.nomeEN}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-300"></div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* SGQ Global Charts */}
              <SGQCharts darkMode={darkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className={`text-center text-sm mt-16 pt-8 border-t ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}
        >
          <p className="text-lg font-medium">© 2025 QUALICORE - Sistema de Gestão da Qualidade</p>
          <p className="mt-2">Conformidade: ISO 9001 • NP ISO 10005 • EN 1090 • RGPD</p>
          <p className="mt-1">Referência Europeia em Gestão da Qualidade para Obra Civil</p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <span>Desenvolvido por José Antunes</span>
            <a 
              href="https://www.linkedin.com/in/antunesmartins/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors duration-300`}
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Quick Access Menu */}
      <AnimatePresence>
        {showQuickAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 left-6 z-50"
          >
                         <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} p-4 w-80`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Acesso Rápido</h3>
                <button
                  onClick={() => setShowQuickAccess(false)}
                  className={`p-1 rounded-lg ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
                             <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                 {[
                   { id: "obras", nome: "Obras", path: "/obras", icon: HardHat, color: "from-slate-600 to-gray-700" },
                   { id: "documentos", nome: "Documentos", path: "/documentos", icon: FolderOpen, color: "from-emerald-500 to-teal-500" },
                   { id: "pie", nome: "PIE", path: "/pie", icon: Eye, color: "from-blue-500 to-cyan-500" },
                   { id: "ensaios", nome: "Ensaios", path: "/ensaios", icon: TestTube, color: "from-indigo-500 to-purple-500" },
                   { id: "checklists", nome: "Checklists", path: "/checklists", icon: ClipboardCheck, color: "from-purple-500 to-pink-500" },
                   { id: "normas", nome: "Normas", path: "/normas", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
                   { id: "via-ferrea", nome: "Via Férrea", path: "/via-ferrea", icon: Train, color: "from-indigo-500 to-purple-500" },
                   { id: "controlo-betonagens", nome: "Betonagens", path: "/controlo-betonagens", icon: Wrench, color: "from-slate-600 to-gray-700" }
                 ].map((module) => (
                  <motion.button
                    key={module.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate(module.path);
                      setShowQuickAccess(false);
                    }}
                    className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-all duration-200 text-left`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center mb-2`}>
                      <module.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {module.nome}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Quick Access Toggle */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickAccess(!showQuickAccess)}
          className={`w-14 h-14 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-full shadow-2xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} flex items-center justify-center transition-all duration-300 hover:shadow-3xl`}
        >
          <Grid3X3 className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
        </motion.button>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:shadow-3xl`}
            >
              <ArrowUp className="h-6 w-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

