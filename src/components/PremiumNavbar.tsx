import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Command,
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
} from "lucide-react";

interface PremiumNavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function PremiumNavbar({ onToggleSidebar, sidebarOpen }: PremiumNavbarProps) {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  
  // Modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSearchResultsModal, setShowSearchResultsModal] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // User menu actions
  const handleProfile = () => {
    console.log("Abrir perfil do usuário");
    window.location.href = '/profile';
    setUserMenuOpen(false);
  };

  const handleSettings = () => {
    console.log("Abrir configurações");
    setShowSettingsModal(true);
    setUserMenuOpen(false);
  };

  const handleExportData = () => {
    console.log("Exportar dados");
    const data = {
      obras: 1,
      ensaios: 1,
      ncs: 2,
      documentos: 1,
      data: new Date().toLocaleDateString('pt-BR')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qualicore-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Exportação concluída! Ficheiro baixado.");
    setUserMenuOpen(false);
  };

  const handleUpgradePremium = () => {
    console.log("Upgrade para Premium");
    setShowUpgradeModal(true);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("Fazer logout");
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem('user');
      sessionStorage.clear();
      alert("Logout realizado com sucesso");
      window.location.href = '/login';
    }
    setUserMenuOpen(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
    
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: ${darkMode ? '#fbbf24' : '#1f2937'}; color: ${darkMode ? '#1f2937' : 'white'}; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>${darkMode ? '☀️' : '🌙'}</span>
          <span>Modo ${darkMode ? 'claro' : 'escuro'} ativado</span>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Notificações premium
  const notifications = [
    { 
      id: 1, 
      title: "Nova obra criada", 
      message: "Linha do Sado foi adicionada com sucesso", 
      time: "2 min", 
      type: "success",
      icon: Building2,
      action: "Ver obra"
    },
    { 
      id: 2, 
      title: "Ensaio pendente", 
      message: "3 ensaios aguardam aprovação técnica", 
      time: "15 min", 
      type: "warning",
      icon: ClipboardList,
      action: "Revisar"
    },
    { 
      id: 3, 
      title: "Relatório pronto", 
      message: "Relatório mensal de qualidade disponível", 
      time: "1 hora", 
      type: "info",
      icon: FileText,
      action: "Download"
    },
    { 
      id: 4, 
      title: "NC registada", 
      message: "Nova não conformidade registada", 
      time: "2 horas", 
      type: "error",
      icon: AlertTriangle,
      action: "Ver detalhes"
    },
  ];

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: location.pathname === "/dashboard" },
    { name: "Obras", href: "/obras", icon: Building2, current: location.pathname === "/obras" },
  ];

  const quickActions = [
    { name: "Nova Obra", icon: Building2, href: "/obras/nova", color: "blue", shortcut: "⌘+O" },
    { name: "Registar Ensaio", icon: ClipboardList, href: "/ensaios/novo", color: "green", shortcut: "⌘+E" },
    { name: "Criar Checklist", icon: FileText, href: "/checklists/novo", color: "orange", shortcut: "⌘+C" },
    { name: "Novo Documento", icon: FolderOpen, href: "/documentos/novo", color: "indigo", shortcut: "⌘+D" },
    { name: "Nova NC", icon: AlertTriangle, href: "/nao-conformidades/nova", color: "red", shortcut: "⌘+N" },
  ];

  const commandPaletteItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard", category: "Navegação" },
    { name: "Obras", icon: Building2, href: "/obras", category: "Navegação" },
    { name: "Ensaios", icon: ClipboardList, href: "/ensaios", category: "Módulos" },
    { name: "Checklists", icon: FileText, href: "/checklists", category: "Módulos" },
    { name: "Documentos", icon: FolderOpen, href: "/documentos", category: "Módulos" },
    { name: "Não Conformidades", icon: AlertTriangle, href: "/nao-conformidades", category: "Módulos" },
    { name: "RFIs", icon: HelpCircle, href: "/rfis", category: "Módulos" },
    { name: "Materiais", icon: Grid3X3, href: "/materiais", category: "Módulos" },
    { name: "Fornecedores", icon: Users, href: "/fornecedores", category: "Módulos" },
    { name: "PIE", icon: Shield, href: "/pie", category: "Módulos" },
    { name: "Nova Obra", icon: Plus, href: "/obras/nova", category: "Ações" },
    { name: "Novo Ensaio", icon: Plus, href: "/ensaios/novo", category: "Ações" },
    { name: "Configurações", icon: Settings, href: "/settings", category: "Sistema" },
    { name: "Relatórios", icon: BarChart3, href: "/relatorios", category: "Sistema" },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setSearchOpen(!searchOpen);
            break;
          case 'p':
            e.preventDefault();
            setCommandPaletteOpen(!commandPaletteOpen);
            break;
          case 'o':
            e.preventDefault();
            window.location.href = '/obras/nova';
            break;
          case 'e':
            e.preventDefault();
            window.location.href = '/ensaios/novo';
            break;
        }
      }
      
      // ESC para fechar menus
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
        setQuickActionsOpen(false);
        setCommandPaletteOpen(false);
        setShowSettingsModal(false);
        setShowUpgradeModal(false);
        setShowSearchResultsModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, commandPaletteOpen]);

  // Load dark mode state from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const filteredCommands = commandPaletteItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeAllMenus = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setQuickActionsOpen(false);
    setCommandPaletteOpen(false);
  };

  // Global search functionality
  const handleGlobalSearch = () => {
    if (globalSearchQuery.trim()) {
      console.log("Buscando globalmente:", globalSearchQuery);
      
      const results = [
        { type: 'obra', name: 'Linha do Sado', match: globalSearchQuery.toLowerCase().includes('sado') },
        { type: 'ensaio', name: 'Ensaio de Compactação', match: globalSearchQuery.toLowerCase().includes('ensaio') },
        { type: 'documento', name: 'Relatório Mensal', match: globalSearchQuery.toLowerCase().includes('relatório') },
        { type: 'nc', name: 'Não Conformidade #001', match: globalSearchQuery.toLowerCase().includes('conformidade') }
      ].filter(result => result.match);
      
      if (results.length > 0) {
        setSearchResults(results);
        setShowSearchResultsModal(true);
      } else {
        alert(`Nenhum resultado encontrado para "${globalSearchQuery}"`);
      }
      
      setGlobalSearchQuery("");
    } else {
      alert("Por favor, insira um termo de busca");
    }
  };

  // Notification actions
  const handleMarkAllAsRead = () => {
    console.log("Marcar todas as notificações como lidas");
    const notificationBadge = document.querySelector('.animate-pulse');
    if (notificationBadge) {
      notificationBadge.remove();
    }
    
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 1rem; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>✅</span>
          <span>Todas as notificações marcadas como lidas</span>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    setNotificationsOpen(false);
  };

  const handleNotificationAction = (notification: any) => {
    console.log("Ação da notificação:", notification.action);
    
    switch (notification.action) {
      case "Ver obra":
        window.location.href = '/obras';
        break;
      case "Revisar":
        window.location.href = '/ensaios';
        break;
      case "Download":
        const blob = new Blob(['Relatório mensal de qualidade'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio-mensal.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Download iniciado!");
        break;
      case "Ver detalhes":
        window.location.href = '/nao-conformidades';
        break;
      default:
        alert(`Executando: ${notification.action}`);
    }
    
    setNotificationsOpen(false);
  };

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-300 backdrop-blur-xl border-b border-blue-400/60 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo e Navegação Principal */}
            <div className="flex items-center space-x-4">
              {/* Botão Sidebar */}
              <button
                onClick={onToggleSidebar}
                className="p-3 rounded-xl text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 group"
              >
                <Menu className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>

                             {/* Logo Premium */}
               <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                 <div className="relative">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                     <Shield className="h-7 w-7 text-white" />
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                   </div>
                 </div>
                 <div className="hidden sm:block">
                   <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                     Qualicore
                   </h1>
                   <p className="text-sm text-blue-600/80 flex items-center">
                     <Sparkles className="h-4 w-4 mr-1" />
                     Premium
                   </p>
                 </div>
               </Link>

              {/* Navegação Principal */}
              <div className="hidden md:flex items-center space-x-2 ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 relative group ${
                      item.current
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.current && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Ações da Direita */}
            <div className="flex items-center space-x-2">
              
              {/* Global Search */}
              <div className="relative">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/80 border border-blue-200/60 text-blue-700 hover:bg-blue-50 transition-all duration-200 shadow-sm">
                  <Search 
                    className="h-5 w-5 cursor-pointer" 
                    onClick={handleGlobalSearch}
                  />
                  <input
                    type="text"
                    placeholder="Busca Global..."
                    className="bg-transparent outline-none text-base placeholder-blue-500/70 w-40 sm:w-48"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch()}
                  />
                  <kbd 
                    className="hidden sm:block px-2 py-1 text-sm bg-blue-100 rounded border border-blue-200 cursor-pointer hover:bg-blue-200 text-blue-700"
                    onClick={handleGlobalSearch}
                  >
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Command Palette */}
              <button
                onClick={() => setCommandPaletteOpen(!commandPaletteOpen)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/80 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 border border-blue-200/60 text-sm shadow-sm hover:shadow-md"
              >
                                 <Command className="h-5 w-5" />
                 <span className="hidden sm:block">Módulos</span>
                 <kbd className="hidden sm:block px-2 py-1 text-sm bg-blue-100 rounded border border-blue-200 text-blue-700">⌘P</kbd>
              </button>

              {/* Quick Actions */}
              <div className="relative">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Zap className="h-5 w-5" />
                </button>
                
                {quickActionsOpen && (
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-3">
                    <div className="flex items-center justify-between px-2 py-2 mb-3">
                      <div className="text-sm font-medium text-gray-500">Ações Rápidas</div>
                      <button 
                        onClick={() => setQuickActionsOpen(false)}
                        className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.href}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
                        onClick={() => setQuickActionsOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${action.color}-100 to-${action.color}-200 flex items-center justify-center shadow-sm`}>
                            <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{action.name}</span>
                        </div>
                        <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">{action.shortcut}</kbd>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 relative shadow-sm hover:shadow-md"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center animate-pulse shadow-sm font-bold">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">Notificações</h3>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Marcar todas como lidas
                        </button>
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border border-gray-100 transition-all duration-200">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : notification.type === 'error' ? 'red' : 'blue'}-100 to-${notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : notification.type === 'error' ? 'red' : 'blue'}-200 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <notification.icon className={`h-4 w-4 text-${notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : notification.type === 'error' ? 'red' : 'blue'}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">{notification.time}</p>
                              <button 
                                onClick={() => handleNotificationAction(notification)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {notification.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={handleDarkModeToggle}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Nova Obra Button */}
              <Link
                to="/obras/nova"
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">Nova Obra</span>
              </Link>

              {/* User Menu Premium */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">José Antunes</p>
                    <p className="text-xs text-blue-200">Premium</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-3">
                    <div className="px-3 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">José Antunes</p>
                          <p className="text-xs text-gray-500">jose.antunes@qualicore.pt</p>
                          <div className="flex items-center mt-1">
                            <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-yellow-600 font-medium">Premium</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={handleProfile}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-lg transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>Perfil</span>
                      </button>
                      <button 
                        onClick={handleSettings}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </button>
                      <button 
                        onClick={handleExportData}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Download className="h-4 w-4" />
                        <span>Exportar Dados</span>
                      </button>
                      <button 
                        onClick={handleUpgradePremium}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Upgrade Premium</span>
                      </button>
                    </div>
                    <div className="px-3 py-3 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden backdrop-blur-xl">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                      <Command className="h-4 w-4 text-white" />
                    </div>
                                         <input
                       type="text"
                       placeholder="Pesquisar módulos..."
                       className="flex-1 text-base outline-none bg-transparent placeholder-gray-500"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       autoFocus
                     />
                    <kbd className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md text-gray-600 font-medium shadow-sm">ESC</kbd>
                  </div>
                  <button 
                    onClick={() => setCommandPaletteOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-all duration-200 shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200/60 transition-all duration-200 group"
                      onClick={() => setCommandPaletteOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200 shadow-sm">
                        <item.icon className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900">{item.name}</p>
                        <p className="text-xs text-gray-500 group-hover:text-blue-600">{item.category}</p>
                      </div>
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-200">
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-8 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                                         <p className="text-gray-500 font-medium">Nenhum módulo encontrado</p>
                     <p className="text-xs text-gray-400 mt-1">Tente uma pesquisa diferente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSettingsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">Notificações por email</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Português</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('Configurações salvas!');
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-4">👑</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upgrade para Premium</h2>
            <p className="text-gray-600 mb-6">Desbloqueie todas as funcionalidades avançadas</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li>• Relatórios ilimitados</li>
                <li>• Exportação avançada</li>
                <li>• Suporte prioritário</li>
                <li>• Backup automático</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Mais tarde
              </button>
              <button 
                onClick={() => {
                  alert('Contacte-nos: premium@qualicore.pt');
                  setShowUpgradeModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Modal */}
      {showSearchResultsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSearchResultsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Resultados da busca</h2>
              <button 
                onClick={() => setShowSearchResultsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                      {result.type.toUpperCase()}
                    </span>
                    <span className="text-gray-900">{result.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert(`Navegando para ${result.name}`);
                      setShowSearchResultsModal(false);
                    }}
                    className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar menus */}
      {(searchOpen || notificationsOpen || userMenuOpen || quickActionsOpen || commandPaletteOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
}
