import {
  Hammer, Building, Building2, Wrench, Package, Database, Award, FileText, Truck, Bell, ClipboardCheck, AlertTriangle, AlertCircle, Upload, FileCheck,
  RefreshCw, Globe, Shield, TestTube, Train, Zap, Eye, HardHat, CheckCircle, Clock, Target, ChevronRight, TrendingUp, Minus, Users, Settings, BookOpen, BarChart3,
  Activity, Zap as Lightning, TrendingDown, Star, Crown, Sparkles, Rocket, Flame, Heart, Gem, Diamond, Plus, Filter, Download, Search, Menu, X, Play, Pause, RotateCcw,
  ArrowRight, ArrowLeft, Move, GripVertical, Zap as LightningBolt, Sparkles as SparklesIcon, Star as StarIcon, Crown as CrownIcon, Globe as GlobeIcon, 
  Calendar, MapPin, Euro, TrendingUp as TrendingUpIcon, AlertCircle as AlertCircleIcon, CheckSquare, FileText as FileTextIcon, BarChart, PieChart, LineChart, Sun, Moon,
  Linkedin, ExternalLink, Zap as LightningIcon, Sparkles as SparklesIcon2, HelpCircle, Grid3X3, FolderOpen, Layers, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedObra, setSelectedObra] = useState<string>("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  // Obras disponíveis
  const obras = [
    { id: "all", nome: "Todas as Obras", localizacao: "Portugal", status: "ativo" },
    { id: "setubal", nome: "Obra de Setúbal", localizacao: "Setúbal", status: "ativo" },
    { id: "porto", nome: "Metro do Porto", localizacao: "Porto", status: "ativo" },
    { id: "lisboa", nome: "Linha Vermelha", localizacao: "Lisboa", status: "ativo" }
  ];

  // Módulos reorganizados por fluxo de trabalho
  const workflowSections = [
    {
      id: "planeamento-gestao",
      title: "Planeamento, Gestão & Documentação",
      subtitle: "Gestão de projetos, obras, materiais e documentação",
      icon: HardHat,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
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

  // Filtro de módulos por pesquisa
  const filteredSections = workflowSections.map(section => ({
    ...section,
    modules: section.modules.filter(module => 
      module.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.nomeEN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.modules.length > 0);

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
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>QUALICORE</h2>
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
        className={`relative z-10 p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} transition-colors duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate("/dashboard")}
              className="relative w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer overflow-hidden border-2 border-gray-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 animate-pulse"></div>
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
                <SparklesIcon2 className="h-4 w-4 mr-2 text-gray-400" />
                Sistema de Gestão da Qualidade - Referência Europeia
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAlerts(!showAlerts)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} relative`}
            >
              <Bell className="h-5 w-5" />
              {alertas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {alertas.length}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 inline mr-2" />
              Exportar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className="relative">
            <select
              value={selectedObra}
              onChange={(e) => setSelectedObra(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {obras.map(obra => (
                <option key={obra.id} value={obra.id}>
                  {obra.nome} - {obra.localizacao}
                </option>
              ))}
            </select>
          </div>

          <div className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'} flex items-center space-x-2`}>
            <Search className="h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar módulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'}`}
            />
          </div>
        </motion.div>

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

        {/* Workflow Sections - Reorganizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-8"
        >
          {filteredSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + sectionIndex * 0.1 }}
              className={`relative overflow-hidden rounded-3xl ${darkMode ? 'bg-gray-800/30' : 'bg-white'} backdrop-blur-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl group hover:shadow-2xl transition-all duration-500`}
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${section.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
              
              {/* Section Header */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <section.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{section.title}</h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{section.subtitle}</p>
                    </div>
                  </div>
                  <div className={`text-right ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div className="text-3xl font-bold">{section.modules.length}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Módulos</div>
                  </div>
                </div>

                {/* Modules Flow - Layout Orgânico com Variação Inteligente */}
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                    {section.modules.map((module, moduleIndex) => {
                      // Determinar tamanho baseado na prioridade e posição
                      const isPrimary = module.priority === "alta" && moduleIndex < 2;
                      const isSecondary = module.priority === "alta" || moduleIndex < 3;
                      const cardSize = isPrimary ? "col-span-1 row-span-2" : isSecondary ? "col-span-1 row-span-1" : "col-span-1 row-span-1";
                      
                      return (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            delay: 1.2 + sectionIndex * 0.1 + moduleIndex * 0.05,
                            duration: 0.6,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -5,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(module.path)}
                          className={`${cardSize} relative cursor-pointer group/module transition-all duration-300`}
                        >
                          {/* Module Card - Design Orgânico Premium */}
                          <div className={`relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-lg group-hover/module:shadow-2xl transition-all duration-500 h-full group-hover/module:border-opacity-80`}>
                            {/* Animated Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover/module:opacity-5 transition-opacity duration-500`}></div>
                            
                            {/* Hover Effect - Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/module:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover/module:translate-x-full transition-transform duration-1000"></div>
                            
                            {/* Content - Adaptável ao tamanho */}
                            <div className="relative z-10 p-4 h-full flex flex-col">
                              {/* Header - Sempre presente */}
                              <div className="flex items-center space-x-3 mb-3">
                                <motion.div 
                                  className={`${isPrimary ? 'w-12 h-12' : 'w-10 h-10'} bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover/module:shadow-lg transition-all duration-300`}
                                  whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                  <module.icon className={`${isPrimary ? 'h-6 w-6' : 'h-5 w-5'} text-white`} />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} ${isPrimary ? 'text-base' : 'text-sm'} truncate group-hover/module:text-opacity-90 transition-colors duration-300`}>{module.nome}</h3>
                                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate group-hover/module:text-opacity-80 transition-colors duration-300`}>{module.nomeEN}</p>
                                </div>
                              </div>
                              
                              {/* Priority Badge - Enhanced */}
                              <div className="flex justify-end mb-3">
                                <motion.span 
                                  className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(module.priority)} text-white font-medium shadow-sm`}
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {module.priority}
                                </motion.span>
                              </div>
                              
                              {/* Conteúdo adicional para cards maiores */}
                              {isPrimary && (
                                <motion.div 
                                  className="flex-1 flex flex-col justify-end"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <div className="space-y-2">
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      <div className="flex items-center space-x-1">
                                        <motion.div 
                                          className="w-2 h-2 bg-green-400 rounded-full"
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        ></motion.div>
                                        <span>Módulo Principal</span>
                                      </div>
                                    </div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                                      Clique para aceder ao módulo completo
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Indicador de ação para cards menores - Enhanced */}
                              {!isPrimary && (
                                <div className="flex-1 flex items-end justify-end">
                                  <motion.div
                                    className={`p-1 rounded-full ${darkMode ? 'bg-gray-600/50' : 'bg-gray-100'} group-hover/module:bg-blue-500/20 transition-colors duration-300`}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <ChevronRight className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} group-hover/module:text-blue-500 transition-all duration-300 group-hover/module:translate-x-0.5`} />
                                  </motion.div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
    </div>
  );
}

