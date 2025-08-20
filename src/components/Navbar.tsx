import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Plus,
  LogOut,
  DoorOpen,
  Shield,
  ClipboardList,
  FileText,
  AlertTriangle,
  Building2,
  Users,
  Grid3X3,
  HelpCircle,
  Award,
  BookOpen,
  Package,
  Database,
  Layers,
  Train,
  Activity,
  Zap,
  Archive,
  BarChart3,
  Eye,
  Settings,
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    description: "Painel principal"
  },
  {
    label: "Ensaios",
    path: "/ensaios",
    icon: ClipboardList,
    color: "from-green-500 to-green-600",
    description: "Gestão de ensaios"
  },
  {
    label: "Controlo Betonagens",
    path: "/controlo-betonagens",
    icon: Building2,
    color: "from-orange-500 to-orange-600",
    description: "Controlo de betonagens"
  },
  {
    label: "Caracterização Solos",
    path: "/caracterizacao-solos",
    icon: Layers,
    color: "from-brown-500 to-brown-600",
    description: "Caracterização de solos"
  },
  {
    label: "Armaduras",
    path: "/armaduras",
    icon: Package,
    color: "from-red-500 to-red-600",
    description: "Gestão de armaduras"
  },
  {
    label: "Sistema de Normas",
    path: "/normas",
    icon: BookOpen,
    color: "from-green-400 to-green-600",
    description: "Sistema de normas"
  },
  {
    label: "Submissão Materiais",
    path: "/submissao-materiais",
    icon: Package,
    color: "from-blue-300 to-blue-500",
    description: "Submissão de materiais"
  },
  {
    label: "Certificados",
    path: "/certificados",
    icon: Award,
    color: "from-gold-400 to-gold-600",
    description: "Certificados e registos"
  },
  {
    label: "Checklists",
    path: "/checklists",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    description: "Sistema de checklists"
  },
  {
    label: "Não Conformidades",
    path: "/nao-conformidades",
    icon: AlertTriangle,
    color: "from-red-500 to-pink-600",
    description: "Gestão de NCs"
  },
  {
    label: "Obras",
    path: "/obras",
    icon: Building2,
    color: "from-yellow-500 to-orange-600",
    description: "Gestão de obras"
  },
  {
    label: "Materiais",
    path: "/materiais",
    icon: Grid3X3,
    color: "from-teal-500 to-cyan-600",
    description: "Gestão de materiais"
  },
  {
    label: "Fornecedores",
    path: "/fornecedores",
    icon: Users,
    color: "from-indigo-500 to-purple-600",
    description: "Gestão de fornecedores"
  },
  {
    label: "Fornecedores Avançados",
    path: "/fornecedores-avancados",
    icon: Building2,
    color: "from-blue-600 to-indigo-700",
    description: "Gestão avançada de fornecedores"
  },
  {
    label: "RFIs",
    path: "/rfis",
    icon: HelpCircle,
    color: "from-red-300 to-red-500",
    description: "Pedidos de informação"
  },
  {
    label: "Via Férrea",
    path: "/via-ferrea",
    icon: Train,
    color: "from-gray-500 to-slate-600",
    description: "Gestão da via férrea"
  },
  {
    label: "Sinalização",
    path: "/sinalizacao",
    icon: Activity,
    color: "from-blue-400 to-blue-600",
    description: "Sistema de sinalização"
  },
  {
    label: "Eletrificação",
    path: "/eletrificacao",
    icon: Zap,
    color: "from-yellow-400 to-yellow-600",
    description: "Sistema de eletrificação"
  },
  {
    label: "Pontes & Túneis",
    path: "/pontes-tuneis",
    icon: Archive,
    color: "from-gray-400 to-gray-600",
    description: "Gestão de pontes e túneis"
  },
  {
    label: "Estações",
    path: "/estacoes",
    icon: Building2,
    color: "from-purple-400 to-purple-600",
    description: "Gestão de estações"
  },
  {
    label: "Segurança",
    path: "/seguranca-ferroviaria",
    icon: Shield,
    color: "from-red-400 to-red-600",
    description: "Segurança ferroviária"
  },
  {
    label: "Documentos",
    path: "/documentos",
    icon: FileText,
    color: "from-purple-500 to-pink-600",
    description: "Gestão de documentos"
  },
  {
    label: "PIE",
    path: "/pie",
    icon: Eye,
    color: "from-cyan-400 to-cyan-600",
    description: "Pontos de inspeção e ensaios"
  },
  {
    label: "Calibrações e Equipamentos",
    path: "/calibracoes-equipamentos",
    icon: Settings,
    color: "from-purple-400 to-purple-600",
    description: "Gestão de calibrações e equipamentos"
  },
  {
    label: "Relatórios",
    path: "/relatorios",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-600",
    description: "Sistema de relatórios"
  }
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Logo Qualicore - clica para ir ao dashboard */}
            <div 
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Qualicore</div>
                <div className="text-xs text-purple-600 font-medium">Premium</div>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Botão de saída - Porta aberta */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-300 group"
              title="Sair do site"
            >
              <DoorOpen className="h-4 w-4 text-gray-600 group-hover:text-red-600 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-sm text-gray-700 group-hover:text-red-700 hidden sm:inline">Sair</span>
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Plus className="h-5 w-5 text-gray-600" />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </button>
            
            {/* Botão de Configuração de PDFs */}
            <button 
              onClick={() => {
                // Abrir modal de configuração de PDFs
                const event = new CustomEvent('openPDFConfig');
                window.dispatchEvent(event);
              }}
              className="p-2 rounded-lg hover:bg-blue-50 transition-colors group relative"
              title="Configuração de PDFs"
            >
              <Settings className="h-5 w-5 text-blue-600 group-hover:text-blue-700 group-hover:rotate-90 transition-all duration-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
