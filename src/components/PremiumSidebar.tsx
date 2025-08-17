import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Search,
  X,
  ChevronRight,
  Building2,
  ClipboardList,
  FileText,
  AlertTriangle,
  HelpCircle,
  Grid3X3,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  TrendingUp,
  Activity,
  Database,
  Archive,
  BookOpen,
  Target,
  Award,
  CheckCircle,
  XCircle,
  Minus,
  Filter,
  SortAsc,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Share2,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Crown,
  Gift,
  Rocket,
  Infinity,
  Layers,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  VideoOff,
  Image,
  File,
  Folder,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Move,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Code,
  Quote,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Hash as HashIcon,
  Hash as HashIcon2,
  Hash as HashIcon3,
  Hash as HashIcon4,
  Hash as HashIcon5,
  Hash as HashIcon6,
  Hash as HashIcon7,
  Hash as HashIcon8,
  Hash as HashIcon9,
  Hash as HashIcon10,
  Zap,
  Building,
} from "lucide-react";
import { obrasAPI, ensaiosAPI, checklistsAPI, documentosAPI, naoConformidadesAPI } from "@/lib/supabase-api";

interface PremiumSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumSidebar({ isOpen, onClose }: PremiumSidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['qualidade', 'ferroviario']);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ obras: 0, ensaios: 0, ncs: 0, documentos: 0 });
  const [loading, setLoading] = useState(true);

  console.log("🔍 PremiumSidebar renderizando...", { isOpen, location: location.pathname });

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [obras, ensaios, checklists, documentos, ncs] = await Promise.all([
          obrasAPI.getAll(),
          ensaiosAPI.getAll(),
          checklistsAPI.getAll(),
          documentosAPI.getAll(),
          naoConformidadesAPI.getAll()
        ]);

        setStats({
          obras: obras.length,
          ensaios: ensaios.length,
          ncs: ncs.length,
          documentos: documentos.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const quickStats = [
    { label: "Obras", value: loading ? "..." : stats.obras.toString(), icon: Building2, color: "blue" },
    { label: "Ensaios", value: loading ? "..." : stats.ensaios.toString(), icon: ClipboardList, color: "green" },
    { label: "NCs", value: loading ? "..." : stats.ncs.toString(), icon: AlertTriangle, color: "red" },
    { label: "Docs", value: loading ? "..." : stats.documentos.toString(), icon: FileText, color: "purple" },
  ];

  const modules = [
    {
      section: "qualidade",
      title: "QUALIDADE",
      items: [
        { name: "Ensaios", href: "/ensaios", icon: ClipboardList, badge: stats.ensaios.toString() },
        { name: "Ensaios Compactação", href: "/ensaios-compactacao", icon: Database, badge: "0" },
        { name: "Checklists", href: "/checklists", icon: FileText, badge: "0" },
        { name: "Não Conformidades", href: "/nao-conformidades", icon: AlertTriangle, badge: stats.ncs.toString() },
      ]
    },
    {
      section: "gestao",
      title: "GESTÃO",
      items: [
        { name: "Obras", href: "/obras", icon: Building2, badge: stats.obras.toString() },
        { name: "RFIs", href: "/rfis", icon: HelpCircle, badge: "0" },
        { name: "Materiais", href: "/materiais", icon: Grid3X3, badge: "0" },
        { name: "Fornecedores", href: "/fornecedores", icon: Users, badge: "0" },
      ]
    },
    {
      section: "especializados",
      title: "ESPECIALIZADOS",
      items: [
        { name: "PIE", href: "/pie", icon: Shield, badge: "0" },
        { name: "Relatórios", href: "/relatorios", icon: BarChart3, badge: "0" },
        { name: "Documentos", href: "/documentos", icon: Folder, badge: stats.documentos.toString() },
      ]
    },
    {
      section: "ferroviario",
      title: "FERROVIÁRIO",
      items: [
        { name: "Via Férrea", href: "/via-ferrea", icon: TrendingUp, badge: "0" },
        { name: "Sinalização", href: "/sinalizacao", icon: Activity, badge: "0" },
        { name: "Eletrificação", href: "/eletrificacao", icon: Zap, badge: "0" },
        { name: "Pontes & Túneis", href: "/pontes-tuneis", icon: Archive, badge: "0" },
        { name: "Estações", href: "/estacoes", icon: Building, badge: "0" },
        { name: "Segurança", href: "/seguranca-ferroviaria", icon: Shield, badge: "0" },
      ]
    }
  ];

  const filteredModules = modules.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-96 bg-gradient-to-b from-slate-800/95 via-blue-800/95 to-indigo-800/95 backdrop-blur-xl border-r border-blue-600/60 shadow-2xl transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-blue-600/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Qualicore
                  </h1>
                  <p className="text-xs text-blue-200/70 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-blue-200/70 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-blue-600/40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
              <input
                type="text"
                placeholder="Pesquisar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-blue-200 placeholder-blue-300/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-blue-600/40">
            <h3 className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider mb-3">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickStats.map((stat) => (
                <div key={stat.label} className="p-2 bg-gradient-to-br from-white/10 to-blue-500/20 rounded-lg border border-blue-500/30 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br from-${stat.color}-500/30 to-${stat.color}-600/30 flex items-center justify-center shadow-sm`}>
                      <stat.icon className={`h-3 w-3 text-${stat.color}-300`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-200/70 truncate">{stat.label}</p>
                      <p className="text-sm font-semibold text-blue-100">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 320px)' }}>
            <div className="p-4 space-y-4">
              {filteredModules.map((section) => (
                <div key={section.section} className="space-y-2">
                  <button
                    onClick={() => toggleSection(section.section)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-200 group"
                  >
                    <span className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider group-hover:text-blue-100">
                      {section.title}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 text-blue-300/70 transition-transform duration-200 ${
                        expandedSections.includes(section.section) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSections.includes(section.section) && (
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 group ${
                            location.pathname === item.href
                              ? "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-500/50 shadow-sm"
                              : "hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-indigo-600/20"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center shadow-sm`}>
                              <item.icon className="h-3 w-3 text-blue-300" />
                            </div>
                            <span className={`text-sm font-medium ${
                              location.pathname === item.href ? "text-blue-100" : "text-blue-200"
                            }`}>
                              {item.name}
                            </span>
                          </div>
                          {item.badge !== "0" && (
                            <span className="px-2 py-0.5 text-xs bg-blue-500/40 text-blue-100 rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-600/40">
            <div className="text-center">
              <p className="text-xs text-blue-200/70">
                Qualicore Premium v1.0.0
              </p>
              <p className="text-xs text-blue-300/60 mt-1">
                Desenvolvido com ❤️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-800/95 via-blue-800/95 to-indigo-800/95 backdrop-blur-xl border-r border-blue-600/60 shadow-2xl z-50 overflow-hidden transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-blue-600/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Qualicore
                  </h1>
                  <p className="text-xs text-blue-200/70 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-blue-200/70 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-blue-600/40">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
              <input
                type="text"
                placeholder="Pesquisar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-blue-200 placeholder-blue-300/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-blue-600/40">
            <h3 className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider mb-3">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickStats.map((stat) => (
                <div key={stat.label} className="p-2 bg-gradient-to-br from-white/10 to-blue-500/20 rounded-lg border border-blue-500/30 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br from-${stat.color}-500/30 to-${stat.color}-600/30 flex items-center justify-center shadow-sm`}>
                      <stat.icon className={`h-3 w-3 text-${stat.color}-300`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-200/70 truncate">{stat.label}</p>
                      <p className="text-sm font-semibold text-blue-100">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 320px)' }}>
            <div className="p-4 space-y-4">
              {filteredModules.map((section) => (
                <div key={section.section} className="space-y-2">
                  <button
                    onClick={() => toggleSection(section.section)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-200 group"
                  >
                    <span className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider group-hover:text-blue-100">
                      {section.title}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 text-blue-300/70 transition-transform duration-200 ${
                        expandedSections.includes(section.section) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSections.includes(section.section) && (
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 group ${
                            location.pathname === item.href
                              ? "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 border border-blue-500/50 shadow-sm"
                              : "hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-indigo-600/20"
                          }`}
                          onClick={onClose}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center shadow-sm`}>
                              <item.icon className="h-3 w-3 text-blue-300" />
                            </div>
                            <span className={`text-sm font-medium ${
                              location.pathname === item.href ? "text-blue-100" : "text-blue-200"
                            }`}>
                              {item.name}
                            </span>
                          </div>
                          {item.badge !== "0" && (
                            <span className="px-2 py-0.5 text-xs bg-blue-500/40 text-blue-100 rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-600/40">
            <div className="text-center">
              <p className="text-xs text-blue-200/70">
                Qualicore Premium v1.0.0
              </p>
              <p className="text-xs text-blue-300/60 mt-1">
                Desenvolvido com ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
