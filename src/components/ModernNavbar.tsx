import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Shield,
  Search,
  Bell,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
  Plus,
  FileText,
  ClipboardList,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  Sun,
  Moon,
  Zap,
  Grid3X3,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Download,
  Upload,
  Star,
  Heart,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModernNavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ModernNavbar({ onToggleSidebar, sidebarOpen }: ModernNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Notificações mock
  const notifications = [
    { id: 1, title: "Nova obra criada", message: "Linha do Sado foi adicionada", time: "2 min", type: "success" },
    { id: 2, title: "Ensaio pendente", message: "3 ensaios aguardam aprovação", time: "15 min", type: "warning" },
    { id: 3, title: "Relatório pronto", message: "Relatório mensal disponível", time: "1 hora", type: "info" },
  ];

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location.pathname === "/" },
    { name: "Obras", href: "/obras", icon: Building2, current: location.pathname === "/obras" },
    { name: "PIE", href: "/pie", icon: Shield, current: location.pathname === "/pie" },
  ];

  const quickActions = [
    { name: "Nova Obra", icon: Building2, href: "/obras", color: "blue" },
    { name: "Novo PIE", icon: Shield, href: "/pie", color: "purple" },
    { name: "Registar Ensaio", icon: ClipboardList, href: "/ensaios", color: "green" },
    { name: "Criar Checklist", icon: FileText, href: "/checklists", color: "orange" },
    { name: "Novo Documento", icon: FolderOpen, href: "/documentos", color: "indigo" },
    { name: "Nova NC", icon: AlertTriangle, href: "/nao-conformidades", color: "red" },
  ];

  const modules = [
    {
      category: "QUALIDADE",
      items: [
        { name: "Ensaios", description: "Controlo de ensaios técnicos", icon: ClipboardList, href: "/ensaios" },
        { name: "Ensaios Compactação", description: "Ensaios Proctor e compactação", icon: BarChart3, href: "/ensaios-compactacao" },
        { name: "Checklists", description: "Inspeções e verificações", icon: FileText, href: "/checklists" },
        { name: "Não Conformidades", description: "Gestão de NCs", icon: AlertTriangle, href: "/nao-conformidades" },
      ]
    },
    {
      category: "GESTÃO",
      items: [
        { name: "Documentos", description: "Gestão de documentação", icon: FolderOpen, href: "/documentos" },
        { name: "RFIs", description: "Pedidos de Informação", icon: HelpCircle, href: "/rfis" },
        { name: "Materiais", description: "Gestão de materiais", icon: Grid3X3, href: "/materiais" },
        { name: "Fornecedores", description: "Gestão de fornecedores", icon: Users, href: "/fornecedores" },
      ]
    }
  ];

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo e Navegação Principal */}
            <div className="flex items-center space-x-4">
              {/* Botão Sidebar */}
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <div 
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Qualicore
                  </h1>
                  <p className="text-xs text-gray-500">Sistema de Gestão da Qualidade</p>
                </div>
              </div>

              {/* Navegação Principal */}
              <div className="hidden md:flex items-center space-x-1 ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.current
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ações da Direita */}
            <div className="flex items-center space-x-2">
              
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  <Search className="h-5 w-5" />
                </button>
                
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Pesquisar obras, ensaios, documentos..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Pressione <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl + K</kbd> para busca global
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <div className="relative">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  <Zap className="h-5 w-5" />
                </button>
                
                <AnimatePresence>
                  {quickActionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-2"
                    >
                      <div className="text-xs font-medium text-gray-500 px-3 py-2">Ações Rápidas</div>
                      {quickActions.map((action) => (
                        <Link
                          key={action.name}
                          to={action.href}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setQuickActionsOpen(false)}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                            <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{action.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                        <button className="text-xs text-blue-600 hover:text-blue-700">Marcar todas como lidas</button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 p-2"
                    >
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">José Antunes</p>
                        <p className="text-xs text-gray-500">jose.antunes@qualicore.pt</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <User className="h-4 w-4" />
                          <span>Perfil</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <Settings className="h-4 w-4" />
                          <span>Configurações</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <Download className="h-4 w-4" />
                          <span>Exportar Dados</span>
                        </button>
                      </div>
                      <div className="px-3 py-2 border-t border-gray-100">
                        <button 
                          onClick={() => navigate("/")}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay para fechar menus */}
      {(searchOpen || notificationsOpen || userMenuOpen || quickActionsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setSearchOpen(false);
            setNotificationsOpen(false);
            setUserMenuOpen(false);
            setQuickActionsOpen(false);
          }}
        />
      )}
    </>
  );
}
