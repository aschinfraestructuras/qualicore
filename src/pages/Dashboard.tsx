import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Settings,
  Database,
  Globe,
  Lock,
  Target as TargetIcon,
  Gauge,
  TrendingDown,
  AlertCircle,
  Star,
  Award as AwardIcon,
  Trophy,
  Medal,
  Crown,
  Lightbulb,
  Rocket,
  Flame,
  Heart,
  Gem,
  Diamond,
  Crown as CrownIcon,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Upload,
  Bell,
  Search,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
  BarChart4,
  PieChart,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  AlertOctagon,
  CheckSquare,
  FileCheck,
  HardHat,
  Wrench,
  Truck,
  Factory,
  MapPin,
  Building2,
  Timer,
  CalendarDays,
  Clock4,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarClock,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  Train,
} from "lucide-react";
import TestPDF from '../components/TestPDF';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "reports">("overview");

  // Dados reais simulados para todos os módulos
  const realData = {
    ensaios: { total: 45, aprovados: 38, pendentes: 5, rejeitados: 2 },
    checklists: { total: 32, concluidos: 28, pendentes: 3, rejeitados: 1 },
    documentos: { total: 28, aprovados: 25, pendentes: 2, rejeitados: 1 },
    armaduras: { total: 15, aprovados: 13, pendentes: 1, rejeitados: 1 },
    materiais: { total: 18, aprovados: 16, pendentes: 1, rejeitados: 1 },
    fornecedores: { total: 22, aprovados: 20, pendentes: 1, rejeitados: 1 },
    naoConformidades: { total: 5, aprovados: 3, pendentes: 1, rejeitados: 1 },
    obras: { total: 3, aprovados: 2, pendentes: 1, rejeitados: 0 },
    viaFerrea: { total: 10, aprovados: 9, pendentes: 1, rejeitados: 0 },
    sinalizacao: { total: 8, aprovados: 7, pendentes: 1, rejeitados: 0 },
    eletrificacao: { total: 7, aprovados: 6, pendentes: 1, rejeitados: 0 },
    pontesTuneis: { total: 12, aprovados: 11, pendentes: 1, rejeitados: 0 },
    estacoes: { total: 4, aprovados: 3, pendentes: 1, rejeitados: 0 },
    segurancaFerroviaria: { total: 9, aprovados: 8, pendentes: 1, rejeitados: 0 },
    controloBetonagens: { total: 14, aprovados: 12, pendentes: 2, rejeitados: 0 },
    caracterizacaoSolos: { total: 6, aprovados: 5, pendentes: 1, rejeitados: 0 },
    normas: { total: 25, aprovados: 22, pendentes: 2, rejeitados: 1 },
    submissaoMateriais: { total: 11, aprovados: 10, pendentes: 1, rejeitados: 0 },
    certificados: { total: 8, aprovados: 7, pendentes: 1, rejeitados: 0 },
    rfis: { total: 3, aprovados: 2, pendentes: 1, rejeitados: 0 },
    pontosInspecao: { total: 16, aprovados: 14, pendentes: 2, rejeitados: 0 },
    registos: { total: 20, aprovados: 18, pendentes: 2, rejeitados: 0 },
    termos: { total: 7, aprovados: 6, pendentes: 1, rejeitados: 0 }
  };

  // Cálculos baseados em dados reais
  const totalEnsaios = realData.ensaios.total;
  const totalChecklists = realData.checklists.total;
  const totalDocumentos = realData.documentos.total;
  const totalArmaduras = realData.armaduras.total;
  const totalMateriais = realData.materiais.total;
  const totalFornecedores = realData.fornecedores.total;
  const totalObras = realData.obras.total;
  const totalViaFerrea = realData.viaFerrea.total;
  const totalSinalizacao = realData.sinalizacao.total;
  const totalEletrificacao = realData.eletrificacao.total;
  const totalPontesTuneis = realData.pontesTuneis.total;
  const totalEstacoes = realData.estacoes.total;
  const totalSegurancaFerroviaria = realData.segurancaFerroviaria.total;
  const totalControloBetonagens = realData.controloBetonagens.total;
  const totalCaracterizacaoSolos = realData.caracterizacaoSolos.total;
  const totalNormas = realData.normas.total;
  const totalSubmissaoMateriais = realData.submissaoMateriais.total;
  const totalCertificados = realData.certificados.total;
  const totalRfis = realData.rfis.total;
  const totalPontosInspecao = realData.pontosInspecao.total;
  const totalRegistos = realData.registos.total;
  const totalTermos = realData.termos.total;

  const totalRegistros = Object.values(realData).reduce((sum, module) => sum + module.total, 0);
  
  // Calcular score de qualidade baseado em dados reais
  const totalAprovados = Object.values(realData).reduce((sum, module) => {
    const aprovados = 'aprovados' in module ? module.aprovados : 
                     'concluidos' in module ? module.concluidos : 0;
    return sum + aprovados;
  }, 0);
  
  const scoreQualidade = totalRegistros > 0 ? Math.round((totalAprovados / totalRegistros) * 100) : 0;

  // Dados para gráficos de análise
  const analysisData = {
    ensaiosPorTipo: [
      { name: 'Conformes', value: realData.ensaios.aprovados, color: '#10B981' },
      { name: 'Pendentes', value: realData.ensaios.pendentes, color: '#F59E0B' },
      { name: 'Rejeitados', value: realData.ensaios.rejeitados, color: '#EF4444' }
    ],
    performanceMensal: [
      { mes: 'Jan', Conformidade: 85, Qualidade: 78, Segurança: 92 },
      { mes: 'Fev', Conformidade: 88, Qualidade: 82, Segurança: 89 },
      { mes: 'Mar', Conformidade: 92, Qualidade: 87, Segurança: 94 },
      { mes: 'Abr', Conformidade: 89, Qualidade: 84, Segurança: 91 },
      { mes: 'Mai', Conformidade: 94, Qualidade: 89, Segurança: 96 },
      { mes: 'Jun', Conformidade: 91, Qualidade: 86, Segurança: 93 }
    ],
    tendenciasQualidade: [
      { periodo: 'Semana 1', Ensaios: 12, Checklists: 8, Documentos: 6 },
      { periodo: 'Semana 2', Ensaios: 15, Checklists: 10, Documentos: 8 },
      { periodo: 'Semana 3', Ensaios: 18, Checklists: 14, Documentos: 12 },
      { periodo: 'Semana 4', Ensaios: 22, Checklists: 18, Documentos: 15 },
      { periodo: 'Semana 5', Ensaios: 25, Checklists: 22, Documentos: 18 },
      { periodo: 'Semana 6', Ensaios: 28, Checklists: 26, Documentos: 22 }
    ]
  };

  // Dados para gráfico radar
  const radarData = [
    { 
      subject: 'Ensaios', 
      Atual: totalEnsaios > 0 ? Math.round((realData.ensaios.aprovados / totalEnsaios) * 100) : 0, 
      Anterior: 85, 
      Meta: 98, 
      fullMark: 100 
    },
    { 
      subject: 'Checklists', 
      Atual: totalChecklists > 0 ? Math.round((realData.checklists.concluidos / totalChecklists) * 100) : 0, 
      Anterior: 78, 
      Meta: 92, 
      fullMark: 100 
    },
    { 
      subject: 'Documentos', 
      Atual: totalDocumentos > 0 ? Math.round((realData.documentos.aprovados / totalDocumentos) * 100) : 0, 
      Anterior: 82, 
      Meta: 95, 
      fullMark: 100 
    },
    { 
      subject: 'Armaduras', 
      Atual: totalArmaduras > 0 ? Math.round((realData.armaduras.aprovados / totalArmaduras) * 100) : 0, 
      Anterior: 88, 
      Meta: 99, 
      fullMark: 100 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header Limpo e Profissional */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div onClick={() => navigate("/dashboard")} title="Ir para o Dashboard" aria-label="Ir para o Dashboard" className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent mb-2">
                    Dashboard Qualicore
                  </h1>
                  <p className="text-xl text-gray-600 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    Sistema de Gestão da Qualidade 2025
                  </p>
                </div>

              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Atualizado agora</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Portugal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <a 
                  href="https://www.linkedin.com/in/antunesmartins/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-blue-600 transition-colors"
                >
                  José Antunes
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white rounded-2xl p-1 shadow-lg">
            {[
              { id: "overview", label: "Visão Geral", icon: ActivityIcon },
              { id: "analytics", label: "Análises", icon: BarChart3 },
              { id: "reports", label: "Relatórios", icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Módulos do Sistema - Acesso Direto */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos do Sistema</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[
                    // ENSAIOS E CONTROLO
                    { name: "Ensaios", icon: TestTube, color: "from-blue-500 to-indigo-600", path: "/ensaios", count: totalEnsaios },
                    { name: "Controlo Betonagens", icon: Wrench, color: "from-orange-400 to-orange-600", path: "/controlo-betonagens", count: totalControloBetonagens },
                    { name: "Caracterização Solos", icon: Database, color: "from-brown-400 to-brown-600", path: "/caracterizacao-solos", count: totalCaracterizacaoSolos },
                    { name: "Armaduras", icon: Package, color: "from-orange-500 to-red-600", path: "/armaduras", count: totalArmaduras },
                    
                    // QUALIDADE
                    { name: "Sistema de Normas", icon: FileCheck, color: "from-green-400 to-green-600", path: "/normas", count: totalNormas },
                    { name: "Submissão Materiais", icon: Upload, color: "from-blue-300 to-blue-500", path: "/submissao-materiais", count: totalSubmissaoMateriais },
                    { name: "Certificados e Registos", icon: Award, color: "from-gold-400 to-gold-600", path: "/certificados", count: totalCertificados },
                    { name: "Calibrações e Equipamentos", icon: Settings, color: "from-purple-400 to-purple-600", path: "/calibracoes-equipamentos", count: 0 },
                    { name: "Auditorias SGQ", icon: Shield, color: "from-indigo-400 to-indigo-600", path: "/auditorias", count: 0 },
                    { name: "Receção de Obra e Garantias", icon: Building2, color: "from-green-500 to-emerald-600", path: "/rececao-obra-garantias", count: 0 },
                    { name: "Checklists", icon: ClipboardCheck, color: "from-green-500 to-emerald-600", path: "/checklists", count: totalChecklists },
                    { name: "Não Conformidades", icon: AlertTriangle, color: "from-red-500 to-pink-600", path: "/nao-conformidades", count: realData.naoConformidades.total },
                    
                    // GESTÃO
                    { name: "Obras", icon: HardHat, color: "from-yellow-500 to-orange-600", path: "/obras", count: totalObras },
                    { name: "Materiais", icon: Building, color: "from-teal-500 to-cyan-600", path: "/materiais", count: totalMateriais },
                    { name: "Fornecedores", icon: Truck, color: "from-indigo-500 to-purple-600", path: "/fornecedores", count: totalFornecedores },
                    { name: "Fornecedores Avançados", icon: Building2, color: "from-blue-600 to-indigo-700", path: "/fornecedores-avancados", count: 0 },
                    { name: "RFIs", icon: AlertCircle, color: "from-red-300 to-red-500", path: "/rfis", count: totalRfis },
                    
                    // INFRAESTRUTURA
                    { name: "Via Férrea", icon: MapPin, color: "from-gray-500 to-slate-600", path: "/via-ferrea", count: totalViaFerrea },
                    { name: "Pontes & Túneis", icon: Building, color: "from-gray-400 to-gray-600", path: "/pontes-tuneis", count: totalPontesTuneis },
                    { name: "Estações", icon: Building, color: "from-purple-400 to-purple-600", path: "/estacoes", count: totalEstacoes },
                    
                    // SISTEMAS
                    { name: "Sinalização", icon: Bell, color: "from-blue-400 to-blue-600", path: "/sinalizacao", count: totalSinalizacao },
                    { name: "Eletrificação", icon: Zap, color: "from-yellow-400 to-yellow-600", path: "/eletrificacao", count: totalEletrificacao },
                    { name: "Segurança Ferroviária", icon: Shield, color: "from-red-400 to-red-600", path: "/seguranca-ferroviaria", count: totalSegurancaFerroviaria },
                    
                    // DOCUMENTAÇÃO
                    { name: "Documentos", icon: FileText, color: "from-purple-500 to-pink-600", path: "/documentos", count: totalDocumentos },
                    { name: "Pontos Inspeção", icon: Eye, color: "from-cyan-400 to-cyan-600", path: "/pie", count: totalPontosInspecao }
                  ].map((module, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.02 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      onClick={() => navigate(module.path)}
                      className="group p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-left"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{module.name}</h3>
                      <p className="text-xs text-gray-600">{module.count} registos</p>
                    </motion.button>
                  ))}
                </div>
              </motion.section>

                             {/* Teste de Funcionalidades - VISÍVEL */}
               <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="mb-8"
               >
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Teste de Funcionalidades</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button 
                     onClick={async () => {
                       try {
                         console.log('🔍 Iniciando teste de PDF...');
                         const { PDFService } = await import('../services/pdfService');
                         const pdfService = new PDFService();
                         await pdfService.testPDFGeneration();
                         alert('✅ PDF de teste gerado com sucesso! Verifica a pasta de downloads.');
                       } catch (error) {
                         console.error('❌ Erro no teste de PDF:', error);
                         alert('❌ Erro ao gerar PDF de teste: ' + error.message);
                       }
                     }}
                     className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 hover:shadow-lg transition-all duration-300"
                   >
                     <div className="flex items-center space-x-3">
                       <FileText className="h-8 w-8 text-red-600" />
                       <div className="text-left">
                         <div className="font-bold text-gray-900 text-lg">Testar PDF</div>
                         <div className="text-sm text-gray-600">Verificar se PDF generation funciona</div>
                       </div>
                     </div>
                   </button>
                   <button 
                     onClick={() => {
                       console.log('🔍 Verificando console...');
                       alert('Verifica o console (F12) para ver os logs de debug');
                     }}
                     className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-lg transition-all duration-300"
                   >
                     <div className="flex items-center space-x-3">
                       <Settings className="h-8 w-8 text-blue-600" />
                       <div className="text-left">
                         <div className="font-bold text-gray-900 text-lg">Ver Console</div>
                         <div className="text-sm text-gray-600">Verificar logs de debug</div>
                       </div>
                     </div>
                   </button>
                 </div>
               </motion.section>

               {/* Métricas Principais */}
               <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.3 }}
                 className="mb-8"
               >
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Métricas Principais</h2>
                
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: "Score de Qualidade",
                      value: `${scoreQualidade}%`,
                      subtitle: "Conformidade geral",
                      icon: Target,
                      color: "from-green-500 to-emerald-600",
                      trend: "+2.3%",
                      trendColor: "text-green-600"
                    },
                    {
                      title: "Total de Registos",
                      value: totalRegistros.toString(),
                      subtitle: "Todos os módulos",
                      icon: Database,
                      color: "from-blue-500 to-indigo-600",
                      trend: "+8.5%",
                      trendColor: "text-green-600"
                    },
                    {
                      title: "Ensaios Conformes",
                      value: `${realData.ensaios.aprovados}/${totalEnsaios}`,
                      subtitle: "Taxa de conformidade",
                      icon: CheckCircle,
                      color: "from-emerald-500 to-green-600",
                      trend: "+5.2%",
                      trendColor: "text-green-600"
                    },
                    {
                      title: "Checklists Concluídos",
                      value: `${realData.checklists.concluidos}/${totalChecklists}`,
                      subtitle: "Taxa de conclusão",
                      icon: ClipboardCheck,
                      color: "from-purple-500 to-pink-600",
                      trend: "+3.8%",
                      trendColor: "text-green-600"
                    }
                  ].map((kpi, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center`}>
                          <kpi.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className={`text-sm font-medium ${kpi.trendColor}`}>
                          {kpi.trend}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                      <p className="text-sm text-gray-600 mb-2">{kpi.title}</p>
                      <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Resumo de Performance */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo de Performance</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Métricas de Conformidade */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Conformidade</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Aprovados</span>
                        <span className="text-sm font-medium text-green-600">{totalAprovados}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pendentes</span>
                        <span className="text-sm font-medium text-yellow-600">{totalRegistros - totalAprovados - (totalRegistros - totalAprovados - (totalRegistros - totalAprovados))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rejeitados</span>
                        <span className="text-sm font-medium text-red-600">{totalRegistros - totalAprovados - (totalRegistros - totalAprovados - (totalRegistros - totalAprovados))}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${scoreQualidade}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Performance por Módulo */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Módulo</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Ensaios", count: totalEnsaios, percentage: Math.round((totalEnsaios / totalRegistros) * 100) },
                        { name: "Checklists", count: totalChecklists, percentage: Math.round((totalChecklists / totalRegistros) * 100) },
                        { name: "Documentos", count: totalDocumentos, percentage: Math.round((totalDocumentos / totalRegistros) * 100) },
                        { name: "Armaduras", count: totalArmaduras, percentage: Math.round((totalArmaduras / totalRegistros) * 100) }
                      ].map((module, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{module.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{module.count}</span>
                            <span className="text-xs text-gray-500">({module.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Análises Avançadas</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Gráfico de Pizza - Distribuição por Tipo de Ensaio */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Ensaios</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={analysisData.ensaiosPorTipo}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analysisData.ensaiosPorTipo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras - Performance por Mês */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensal</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={analysisData.performanceMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Conformidade" fill="#3B82F6" />
                      <Bar dataKey="Qualidade" fill="#10B981" />
                      <Bar dataKey="Segurança" fill="#F59E0B" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Área - Tendências de Qualidade */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências de Qualidade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsAreaChart data={analysisData.tendenciasQualidade}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Ensaios" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="Checklists" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="Documentos" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico Radar - Performance por Módulo */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Módulo</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Atual" dataKey="Atual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Radar name="Anterior" dataKey="Anterior" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Radar name="Meta" dataKey="Meta" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios Disponíveis</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[
                  { 
                    title: "Relatório Executivo", 
                    icon: FileText, 
                    color: "from-blue-500 to-indigo-600",
                    description: "Visão geral de todos os módulos",
                    action: () => alert("Funcionalidade em desenvolvimento. Dados insuficientes para gerar relatório."),
                    stats: "Em desenvolvimento"
                  },
                  { 
                    title: "Relatório de Ensaios", 
                    icon: TestTube, 
                    color: "from-green-500 to-emerald-600",
                    description: "Análise detalhada de ensaios",
                    action: () => alert("Funcionalidade em desenvolvimento. Dados insuficientes para gerar relatório."),
                    stats: "Em desenvolvimento"
                  },
                  { 
                    title: "Relatório de Qualidade", 
                    icon: Award, 
                    color: "from-teal-500 to-cyan-600",
                    description: "Relatório focado em métricas de qualidade",
                    action: () => alert("Funcionalidade em desenvolvimento. Dados insuficientes para gerar relatório."),
                    stats: "Em desenvolvimento"
                  },
                  { 
                    title: "Relatório de Segurança", 
                    icon: Shield, 
                    color: "from-gray-500 to-slate-600",
                    description: "Análise de segurança e prevenção de riscos",
                    action: () => alert("Funcionalidade em desenvolvimento. Dados insuficientes para gerar relatório."),
                    stats: "Em desenvolvimento"
                  }
                ].map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={report.action}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${report.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <report.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    <div className="text-xs text-gray-500 mb-4 bg-gray-50 px-2 py-1 rounded">
                      {report.stats}
                    </div>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          report.action();
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <span>Gerar Relatório</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="text-xs text-gray-400">Clique para aceder</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Teste de PDF */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Teste de Funcionalidades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={async () => {
                      try {
                        console.log('🔍 Iniciando teste de PDF...');
                        const { PDFService } = await import('../services/pdfService');
                        const pdfService = new PDFService();
                        await pdfService.testPDFGeneration();
                        alert('✅ PDF de teste gerado com sucesso! Verifica a pasta de downloads.');
                      } catch (error) {
                        console.error('❌ Erro no teste de PDF:', error);
                        alert('❌ Erro ao gerar PDF de teste: ' + error.message);
                      }
                    }}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FileText className="h-6 w-6 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Testar PDF</div>
                      <div className="text-sm text-gray-600">Verificar se PDF generation funciona</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      console.log('🔍 Verificando console...');
                      alert('Verifica o console (F12) para ver os logs de debug');
                    }}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Settings className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Ver Console</div>
                      <div className="text-sm text-gray-600">Verificar logs de debug</div>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Ações Rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => navigate("/ensaios")}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <TestTube className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Ver Ensaios</div>
                      <div className="text-sm text-gray-600">Aceder aos ensaios</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate("/checklists")}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <ClipboardCheck className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Ver Checklists</div>
                      <div className="text-sm text-gray-600">Aceder aos checklists</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigate("/documentos")}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <FileText className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Ver Documentos</div>
                      <div className="text-sm text-gray-600">Aceder aos documentos</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
