import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Plus,
  FileText,
  Download,
  Crown,
  X,
  Command,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import toast from "react-hot-toast";

export default function PremiumNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  
  const { theme, isDark, setTheme, toggleTheme } = useAppStore();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inicializar tema
  useEffect(() => {
    useAppStore.getState().initializeTheme();
  }, []);

  // Fechar todos os menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar menus com Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const closeAllMenus = () => {
    setShowQuickActions(false);
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowCommandPalette(false);
    setShowSettings(false);
    setShowUpgrade(false);
    setShowGlobalSearch(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(`Tema alterado para ${isDark ? 'claro' : 'escuro'}`);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    const themeNames = { light: 'claro', dark: 'escuro', auto: 'automático' };
    toast.success(`Tema alterado para ${themeNames[newTheme]}`);
  };

  const commands = [
    { name: "Dashboard", icon: "📊", category: "Navegação", path: "/dashboard" },
    { name: "Obras", icon: "🏗️", category: "Gestão", path: "/obras" },
    { name: "Ensaios", icon: "🧪", category: "Laboratório", path: "/ensaios" },
    { name: "Checklists", icon: "✅", category: "Inspeção", path: "/checklists" },
    { name: "Materiais", icon: "📦", category: "Gestão", path: "/materiais" },
    { name: "Fornecedores", icon: "🏢", category: "Gestão", path: "/fornecedores" },
    { name: "Não Conformidades", icon: "⚠️", category: "Qualidade", path: "/nao-conformidades" },
    { name: "Documentos", icon: "📄", category: "Gestão", path: "/documentos" },
    { name: "Relatórios", icon: "📈", category: "Análise", path: "/relatorios" },
    { name: "RFIs", icon: "❓", category: "Gestão", path: "/rfis" },
    { name: "Ensaios Compactação", icon: "🔧", category: "Especializado", path: "/ensaios-compactacao" },
    { name: "PIE", icon: "🎯", category: "Especializado", path: "/pie" },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    command.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 border-b border-blue-600/60 shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Toggle Sidebar */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                    Qualicore
                  </h1>
                  <p className="text-xs text-blue-200/80">Premium</p>
                </div>
              </Link>
            </div>

            {/* Navegação Central */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: "Dashboard", path: "/dashboard" },
                { name: "Obras", path: "/obras" },
                { name: "Ensaios", path: "/ensaios" },
                { name: "Checklists", path: "/checklists" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "text-white bg-blue-700/50 shadow-lg"
                      : "text-blue-200 hover:bg-blue-700/50 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Ações da Direita */}
            <div className="flex items-center space-x-3">
              {/* Global Search */}
              <div className="relative">
                <button
                  onClick={() => setShowGlobalSearch(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-200 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-sm"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Pesquisar...</span>
                  <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-blue-600/30 rounded border border-blue-400/50 text-blue-200">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* Command Palette */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-200 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-sm"
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Módulos</span>
                <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-blue-600/30 rounded border border-blue-400/50 text-blue-200">
                  ⌘M
                </kbd>
              </button>

              {/* Quick Actions */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 relative overflow-hidden group"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>

                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
                      <button
                        onClick={() => setShowQuickActions(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          // Ação: Nova Obra
                          toast.success("Nova Obra criada!");
                          setShowQuickActions(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm">🏗️</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Nova Obra</p>
                          <p className="text-xs text-gray-500">Criar nova obra</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          // Ação: Novo Ensaio
                          toast.success("Novo Ensaio criado!");
                          setShowQuickActions(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 text-sm">🧪</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Novo Ensaio</p>
                          <p className="text-xs text-gray-500">Criar novo ensaio</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          // Ação: Novo Checklist
                          toast.success("Novo Checklist criado!");
                          setShowQuickActions(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-sm">✅</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Novo Checklist</p>
                          <p className="text-xs text-gray-500">Criar novo checklist</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">José Antunes</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">JA</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">José Antunes</p>
                        <p className="text-xs text-gray-500">jose.antunes@qualicore.pt</p>
                      </div>
                    </div>
                    
                    {/* Theme Options */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">TEMA</p>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === 'light' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Sun className="h-4 w-4" />
                          <span>Claro</span>
                        </button>
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === 'dark' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Moon className="h-4 w-4" />
                          <span>Escuro</span>
                        </button>
                        <button
                          onClick={() => handleThemeChange('auto')}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === 'auto' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Monitor className="h-4 w-4" />
                          <span>Automático</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowSettings(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUpgrade(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Upgrade Premium</span>
                      </button>
                      <button
                        onClick={() => {
                          toast.success("Logout realizado com sucesso!");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                      <button
                        onClick={() => {
                          toast.success("Todas as notificações marcadas como lidas!");
                          setShowNotifications(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Marcar todas como lidas
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 text-sm">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Ensaio Não Conforme</p>
                          <p className="text-xs text-gray-500">Ensaio de resistência do betão não atingiu valores esperados</p>
                          <p className="text-xs text-gray-400 mt-1">Há 2 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm">ℹ️</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Nova Não Conformidade</p>
                          <p className="text-xs text-gray-500">Nova NC registada na zona A - Fundações</p>
                          <p className="text-xs text-gray-400 mt-1">Há 1 hora</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
