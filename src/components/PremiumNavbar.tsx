import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

interface PremiumNavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function PremiumNavbar({ onToggleSidebar, sidebarOpen }: PremiumNavbarProps) {
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
  const navigate = useNavigate();
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

     // Inicializar tema
   useEffect(() => {
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme) {
       if (savedTheme === 'light') {
         document.documentElement.classList.remove('dark');
         document.documentElement.classList.add('light');
         document.body.classList.remove('dark');
         document.body.classList.add('light');
       } else if (savedTheme === 'dark') {
         document.documentElement.classList.remove('light');
         document.documentElement.classList.add('dark');
         document.body.classList.remove('light');
         document.body.classList.add('dark');
       } else {
         // Auto - detectar preferência do sistema
         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
         if (prefersDark) {
           document.documentElement.classList.remove('light');
           document.documentElement.classList.add('dark');
           document.body.classList.remove('light');
           document.body.classList.add('dark');
         } else {
           document.documentElement.classList.remove('dark');
           document.documentElement.classList.add('light');
           document.body.classList.remove('dark');
           document.body.classList.add('light');
         }
       }
     } else {
       // Primeira vez - detectar preferência do sistema
       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       if (prefersDark) {
         document.documentElement.classList.add('dark');
         document.body.classList.add('dark');
         localStorage.setItem('theme', 'auto');
       } else {
         document.documentElement.classList.add('light');
         document.body.classList.add('light');
         localStorage.setItem('theme', 'auto');
       }
     }
   }, []);

  // Fechar todos os menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Verificar se o clique foi em um modal
      const isModalClick = (target as Element).closest('[data-modal="true"]');
      if (isModalClick) {
        console.log("🎯 Click inside modal detected - keeping menus open");
        return;
      }
      
      const isOutsideQuickActions = !quickActionsRef.current?.contains(target);
      const isOutsideUserMenu = !userMenuRef.current?.contains(target);
      const isOutsideNotifications = !notificationsRef.current?.contains(target);
      
      // Só fechar se clicar fora de todos os menus
      if (isOutsideQuickActions && isOutsideUserMenu && isOutsideNotifications) {
        console.log("🎯 Click outside detected - closing all menus");
        closeAllMenus();
      } else {
        console.log("🎯 Click inside menu detected - keeping menus open");
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

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setShowGlobalSearch(true);
            break;
          case 'm':
            event.preventDefault();
            setShowCommandPalette(true);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
    
         // Aplicar tema imediatamente
     if (newTheme === 'light') {
       document.documentElement.classList.remove('dark');
       document.documentElement.classList.add('light');
       document.body.classList.remove('dark');
       document.body.classList.add('light');
       localStorage.setItem('theme', 'light');
      toast.success(`✨ Tema alterado para ${themeNames[newTheme]}`, {
        icon: '☀️',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
         } else if (newTheme === 'dark') {
       document.documentElement.classList.remove('light');
       document.documentElement.classList.add('dark');
       document.body.classList.remove('light');
       document.body.classList.add('dark');
       localStorage.setItem('theme', 'dark');
      toast.success(`🌙 Tema alterado para ${themeNames[newTheme]}`, {
        icon: '🌙',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
         } else {
       // Auto - remover classes e deixar o sistema decidir
       document.documentElement.classList.remove('light', 'dark');
       document.body.classList.remove('light', 'dark');
       localStorage.setItem('theme', 'auto');
      toast.success(`🔄 Tema definido como ${themeNames[newTheme]}`, {
        icon: '🔄',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    }
  };

  const handleGlobalSearch = () => {
    if (globalSearchQuery.trim()) {
      toast.success(`🔍 Iniciando pesquisa global...`, {
        icon: '🔍',
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
      
      // Simular pesquisa global com resultados mais detalhados
      const searchTerm = globalSearchQuery.toLowerCase();
      const searchResults = [];
      let totalResults = 0;
      
      // Simular resultados de pesquisa mais realistas
      if (searchTerm.includes('obra') || searchTerm.includes('construção')) {
        const obraResults = Math.floor(Math.random() * 10) + 1;
        searchResults.push(`🏗️ **Obras** (${obraResults} resultados)\n   • Ponte Vasco da Gama - Lisboa\n   • Metro do Porto - Linha Vermelha\n   • Hospital de Braga - Ampliação`);
        totalResults += obraResults;
      }
      if (searchTerm.includes('ensaio') || searchTerm.includes('teste')) {
        const ensaioResults = Math.floor(Math.random() * 15) + 3;
        searchResults.push(`🧪 **Ensaios** (${ensaioResults} resultados)\n   • Resistência à compressão - Betão C25\n   • Ensaio de compactação - Solo\n   • Análise granulométrica - Agregados`);
        totalResults += ensaioResults;
      }
      if (searchTerm.includes('material') || searchTerm.includes('cimento')) {
        const materialResults = Math.floor(Math.random() * 20) + 5;
        searchResults.push(`📦 **Materiais** (${materialResults} resultados)\n   • Cimento Portland CEM I 42.5R\n   • Aço A500NR - Perfis estruturais\n   • Betão pré-fabricado - Lajes`);
        totalResults += materialResults;
      }
      if (searchTerm.includes('relatório') || searchTerm.includes('documento')) {
        const docResults = Math.floor(Math.random() * 12) + 2;
        searchResults.push(`📄 **Documentos** (${docResults} resultados)\n   • Relatório de Segurança - Q1 2024\n   • Especificações técnicas - Fundações\n   • Certificados de conformidade`);
        totalResults += docResults;
      }
      
      if (searchResults.length > 0) {
        setTimeout(() => {
          const modalContent = `
🔍 RESULTADOS DA PESQUISA GLOBAL
📝 Termo pesquisado: "${globalSearchQuery}"

${searchResults.join('\n\n')}

📊 ESTATÍSTICAS:
   📈 Total de resultados: ${totalResults}
   📂 Categorias encontradas: ${searchResults.length}
   ⏱️ Tempo de pesquisa: ${(Math.random() * 0.5 + 0.1).toFixed(2)}s

💡 SUGESTÕES:
   🔍 Use aspas para pesquisa exata
   📅 Adicione filtros por data
   💾 Salve pesquisas frequentes

📊 [Ver todos os resultados] 📤 [Exportar] 💾 [Salvar pesquisa]
          `;
          
          if (confirm(modalContent + '\n\nDeseja ver os resultados detalhados?')) {
            toast.success(`📊 Abrindo ${totalResults} resultados detalhados...`, {
              icon: '📊',
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '600'
              }
            });
          }
        }, 800);
      } else {
        toast.error(`🔍 Nenhum resultado encontrado para "${globalSearchQuery}"`, {
          icon: '🔍',
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '600'
          }
        });
      }
      
      setShowGlobalSearch(false);
      setGlobalSearchQuery("");
    } else {
      toast.error("⚠️ Digite algo para pesquisar", {
        icon: '⚠️',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    }
  };

  const handleCommandSelect = (command: any) => {
    console.log("🎯 Command Select:", command);
    console.log("🎯 Navigating to:", command.path);
    console.log("🎯 Current location:", location.pathname);
    
    try {
      navigate(command.path);
      console.log("🎯 Navigation successful");
      setShowCommandPalette(false);
      setCommandSearch("");
      
      // Toast personalizado baseado no tipo de módulo
      const moduleEmojis = {
        "Dashboard": "📊",
        "Obras": "🏗️",
        "Ensaios": "🧪",
        "Checklists": "✅",
        "Materiais": "📦",
        "Fornecedores": "🏢",
        "Não Conformidades": "⚠️",
        "Documentos": "📄",
        "Relatórios": "📈",
        "RFIs": "❓",
        "Ensaios Compactação": "🔧",
        "PIE": "🎯"
      };
      
      const emoji = moduleEmojis[command.name as keyof typeof moduleEmojis] || "🚀";
      
      toast.success(`${emoji} Navegando para ${command.name}...`, {
        icon: emoji,
        duration: 2500,
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    } catch (error) {
      console.error("🎯 Navigation error:", error);
      toast.error("❌ Erro na navegação", {
        icon: '❌',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    }
  };

  const commands = [
    { name: "Dashboard", icon: "📊", category: "Navegação", path: "/dashboard", shortcut: "⌘D" },
    { name: "Obras", icon: "🏗️", category: "Gestão", path: "/obras", shortcut: "⌘O" },
    { name: "Ensaios", icon: "🧪", category: "Laboratório", path: "/ensaios", shortcut: "⌘E" },
    { name: "Checklists", icon: "✅", category: "Inspeção", path: "/checklists", shortcut: "⌘C" },
    { name: "Materiais", icon: "📦", category: "Gestão", path: "/materiais", shortcut: "⌘M" },
    { name: "Fornecedores", icon: "🏢", category: "Gestão", path: "/fornecedores", shortcut: "⌘F" },
    { name: "Não Conformidades", icon: "⚠️", category: "Qualidade", path: "/nao-conformidades", shortcut: "⌘N" },
    { name: "Documentos", icon: "📄", category: "Gestão", path: "/documentos", shortcut: "⌘D" },
    { name: "Relatórios", icon: "📈", category: "Análise", path: "/relatorios", shortcut: "⌘R" },
    { name: "RFIs", icon: "❓", category: "Gestão", path: "/rfis", shortcut: "⌘I" },
    { name: "Ensaios Compactação", icon: "🔧", category: "Especializado", path: "/ensaios-compactacao", shortcut: "⌘A" },
    { name: "PIE", icon: "🎯", category: "Especializado", path: "/pie", shortcut: "⌘P" },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    command.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  // Agrupar por categoria
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, typeof commands>);

  const categoryColors = {
    "Navegação": "blue",
    "Gestão": "emerald", 
    "Laboratório": "purple",
    "Inspeção": "green",
    "Qualidade": "red",
    "Análise": "indigo",
    "Especializado": "orange"
  };

  console.log("🎯 PremiumNavbar render - showCommandPalette:", showCommandPalette);
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 border-b border-blue-600/60 shadow-xl pointer-events-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Toggle Sidebar */}
            <div className="flex items-center space-x-4">
                             <button
                 onClick={() => {
                   console.log("🍔 Menu Toggle clicked!");
                   onToggleSidebar();
                 }}
                 className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200"
               >
                <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
              
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  <span className="text-white font-bold text-lg relative z-10">Q</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-blue-100 group-hover:via-purple-100 group-hover:to-indigo-100 transition-all duration-300">
                    Qualicore
                  </h1>
                  <p className="text-xs text-blue-200/80 group-hover:text-blue-100 transition-colors duration-300 flex items-center space-x-1">
                    <span className="text-xs">👑</span>
                    <span>Premium</span>
                  </p>
                </div>
              </Link>
            </div>

            {/* Espaçador central para distribuir melhor os elementos */}
            <div className="flex-1"></div>

            {/* Ações da Direita */}
            <div className="flex items-center space-x-3">
              {/* Global Search */}
              <div className="relative">
                <button
                  onClick={() => {
                    console.log("🔍 Global Search clicked!");
                    setShowGlobalSearch(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-200 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-sm relative z-10 pointer-events-auto"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Pesquisar...</span>
                  <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-gradient-to-r from-blue-600/40 to-indigo-600/40 rounded border border-blue-400/50 text-blue-200 shadow-sm">
                    ⌘K
                  </kbd>
                </button>
              </div>

                            {/* Command Palette */}
                               <button
                  onClick={() => {
                    console.log("🎯 Command Palette clicked!");
                    console.log("🎯 Current showCommandPalette:", showCommandPalette);
                    setShowCommandPalette(true);
                    console.log("🎯 Set showCommandPalette to true");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-blue-200 hover:bg-white/20 hover:text-white transition-all duration-200 shadow-sm relative z-10 pointer-events-auto"
                >
                  <Command className="h-4 w-4" />
                                     <span className="hidden sm:inline text-sm">Navegação</span>
                  <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded border border-purple-400/50 text-purple-200 shadow-sm">
                    ⌘M
                  </kbd>
                </button>

              {/* Quick Actions */}
              <div className="relative" ref={quickActionsRef}>
                                 <button
                   onClick={() => {
                     console.log("➕ Quick Actions clicked!");
                     setShowQuickActions(!showQuickActions);
                   }}
                   className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 relative overflow-hidden group z-10 pointer-events-auto"
                 >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
                </button>

                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up pointer-events-auto z-[99999]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span className="text-xl">⚡</span>
                        <span>Ações Rápidas</span>
                      </h3>
                      <button
                        onClick={() => setShowQuickActions(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                                                 onClick={() => {
                           console.log("🏗️ Quick Action - Nova Obra clicked!");
                           toast.success("🏗️ Navegando para Gestão de Obras...", {
                             icon: '🏗️',
                             duration: 2500,
                             style: {
                               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                               color: 'white',
                               borderRadius: '12px',
                               padding: '16px',
                               fontSize: '14px',
                               fontWeight: '600'
                             }
                           });
                           navigate('/obras');
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
                           console.log("🧪 Quick Action - Novo Ensaio clicked!");
                           toast.success("🧪 Navegando para Laboratório de Ensaios...", {
                             icon: '🧪',
                             duration: 2500,
                             style: {
                               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                               color: 'white',
                               borderRadius: '12px',
                               padding: '16px',
                               fontSize: '14px',
                               fontWeight: '600'
                             }
                           });
                           navigate('/ensaios');
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
                           console.log("✅ Quick Action - Novo Checklist clicked!");
                           toast.success("✅ Navegando para Sistema de Checklists...", {
                             icon: '✅',
                             duration: 2500,
                             style: {
                               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                               color: 'white',
                               borderRadius: '12px',
                               padding: '16px',
                               fontSize: '14px',
                               fontWeight: '600'
                             }
                           });
                           navigate('/checklists');
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
              <div className="relative" ref={userMenuRef}>
                                 <button
                   onClick={() => {
                     console.log("👤 User Menu clicked!");
                     setShowUserMenu(!showUserMenu);
                   }}
                   className="flex items-center space-x-2 p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200 relative z-10 pointer-events-auto"
                 >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">José Antunes</span>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border border-white"></div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up pointer-events-auto z-[99999]">
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
                      <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🎨</span>
                        TEMA
                      </p>
                      <div className="space-y-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThemeChange('light');
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            theme === 'light' 
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200 shadow-sm' 
                              : 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:border hover:border-yellow-200'
                          }`}
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <Sun className="h-3 w-3 text-white" />
                          </div>
                          <span>Claro</span>
                          {theme === 'light' && <span className="ml-auto text-xs">☀️</span>}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThemeChange('dark');
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' 
                              : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border hover:border-blue-200'
                          }`}
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                            <Moon className="h-3 w-3 text-white" />
                          </div>
                          <span>Escuro</span>
                          {theme === 'dark' && <span className="ml-auto text-xs">🌙</span>}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleThemeChange('auto');
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            theme === 'auto' 
                              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 shadow-sm' 
                              : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border hover:border-purple-200'
                          }`}
                        >
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Monitor className="h-3 w-3 text-white" />
                          </div>
                          <span>Automático</span>
                          {theme === 'auto' && <span className="ml-auto text-xs">🔄</span>}
                        </button>
                      </div>
                    </div>

                                                             <div className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("⚙️ Abrindo painel de configurações...", {
                            icon: '⚙️',
                            duration: 2000,
                            style: {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '16px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }
                          });
                          setShowUserMenu(false);
                          
                          setTimeout(() => {
                            const configContent = `
⚙️ CONFIGURAÇÕES PREMIUM

🔔 NOTIFICAÇÕES
   📧 Email: ✅ Ativado
   📱 Push: ✅ Ativado  
   📞 SMS: ❌ Desativado

🔒 SEGURANÇA
   🔐 2FA: ✅ Ativado
   💻 Sessões: 2 dispositivos

💾 ARMAZENAMENTO
   📊 2.3 GB / 10 GB (23%)
   ████████░░ 23% usado

🎨 PREFERÊNCIAS
   🌍 Idioma: Português (PT)
   🕐 Fuso: Europe/Lisbon
   💰 Moeda: EUR (€)

📈 RELATÓRIOS
   📅 Frequência: Semanal
   📄 Formato: PDF + Excel
   📧 Destinatários: 3 emails
                            `;
                            
                            if (confirm(configContent + '\n\nDeseja alterar alguma configuração?')) {
                              toast.success("✅ Configurações atualizadas com sucesso!", {
                                icon: '✅',
                                duration: 3000,
                                style: {
                                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                  color: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }
                              });
                            }
                          }, 600);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Settings className="h-3 w-3 text-white" />
                        </div>
                        <span>Configurações</span>
                        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">⚙️</span>
                      </button>
                                                                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("👑 Verificando planos premium...", {
                            icon: '👑',
                            duration: 2000,
                            style: {
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '16px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }
                          });
                          setShowUserMenu(false);
                          
                          setTimeout(() => {
                            const upgradeContent = `
👑 QUALICORE PREMIUM - FUNCIONALIDADES

✨ PLANO PROFESSIONAL
   📊 Relatórios avançados ilimitados
   📤 Exportação múltiplos formatos
   🆘 Suporte prioritário 24/7
   ☁️ Backup automático na nuvem
   🔌 API de integração
   👥 Múltiplos usuários (até 10)

🚀 PLANO ENTERPRISE
   ✅ Tudo do Professional
   👥 Usuários ilimitados
   🔗 Integração ERP/CRM
   📈 Relatórios personalizados
   🔍 Auditoria completa
   ⏱️ SLA garantido

💎 PLANO CUSTOM
   🎯 Soluções personalizadas
   🛠️ Implementação dedicada
   📚 Treinamento incluído
   👑 Suporte VIP

🎁 BENEFÍCIOS PREMIUM:
   ⚡ 99.9% uptime garantido
   🔄 Atualizações automáticas
   🛡️ Segurança enterprise-grade
   📋 Conformidade ISO 27001
   💾 Backup em tempo real
   🤖 Análise preditiva com IA

📊 ESTATÍSTICAS:
   🏢 1,247 empresas confiam na Qualicore
   ⭐ 99.2% satisfação dos clientes
   🆘 24/7 suporte técnico
   📈 99.9% disponibilidade

💳 [Solicitar Demonstração] [Falar com Equipa] [Teste Gratuito]
                            `;
                            
                            if (confirm(upgradeContent + '\n\nDeseja conhecer mais detalhes sobre algum plano?')) {
                              toast.success("🎯 Conectando com nossa equipe de vendas...", {
                                icon: '🎯',
                                duration: 3000,
                                style: {
                                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                  color: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }
                              });
                            }
                          }, 600);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200 group"
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                        <span>Upgrade Premium</span>
                        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">👑</span>
                      </button>
                                                                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("🔐 Preparando logout seguro...", {
                            icon: '🔐',
                            duration: 2000,
                            style: {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '16px',
                              fontSize: '14px',
                              fontWeight: '600'
                            }
                          });
                          setShowUserMenu(false);
                          
                          setTimeout(() => {
                            const logoutContent = `
🔐 LOGOUT SEGURO - QUALICORE PREMIUM

👤 SESSÃO ATUAL:
   👨‍💼 Usuário: José Antunes
   🕘 Login: Hoje às 09:15
   ⏱️ Duração: 5h 23m
   💻 Dispositivo: Windows 10 - Chrome

📊 ATIVIDADE DESTA SESSÃO:
   📄 12 páginas visitadas
   📈 3 relatórios gerados
   📝 5 documentos editados
   📤 2 exportações realizadas

💾 BACKUP AUTOMÁTICO:
   ✅ Dados salvos
   ✅ Sincronização
   ✅ Cache limpo

⚠️ ATENÇÃO:
   💾 Todas as alterações foram salvas
   📱 Sessões em outros dispositivos permanecerão ativas
   🔄 Pode fazer login novamente a qualquer momento

🔐 [Confirmar Logout] ❌ [Cancelar] 💾 [Manter Sessão]
                            `;
                            
                            if (confirm(logoutContent + '\n\nTem certeza que deseja terminar esta sessão?')) {
                              toast.success("✅ Logout realizado com sucesso!", {
                                icon: '✅',
                                duration: 2000,
                                style: {
                                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                  color: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }
                              });
                              
                              setTimeout(() => {
                                navigate('/');
                                toast.success("👋 Obrigado por usar o Qualicore Premium!", {
                                  icon: '👋',
                                  duration: 3000,
                                  style: {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                  }
                                });
                              }, 1000);
                            }
                          }, 600);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 group"
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <LogOut className="h-3 w-3 text-white" />
                        </div>
                        <span>Sair</span>
                        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">🔐</span>
                      </button>
                     </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                                 <button
                   onClick={() => {
                     console.log("🔔 Notifications clicked!");
                     setShowNotifications(!showNotifications);
                   }}
                   className="p-2 text-blue-200 hover:bg-blue-700/50 hover:text-white rounded-xl transition-all duration-200 relative z-10 pointer-events-auto"
                 >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse shadow-lg"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/90 rounded-2xl shadow-2xl border border-white/30 p-4 backdrop-blur-xl animate-slide-up pointer-events-auto z-[99999]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span className="text-xl">🔔</span>
                        <span>Notificações</span>
                      </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("✅ Todas as notificações marcadas como lidas!", {
                                icon: '✅',
                                duration: 3000,
                                style: {
                                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                  color: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }
                              });
                              setShowNotifications(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-all duration-200 hover:scale-105"
                          >
                            <span className="text-xs">✅</span>
                            <span>Marcar todas como lidas</span>
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

                    {/* Global Search Modal */}
       {showGlobalSearch && (
         <div 
           className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
           data-modal="true"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               setShowGlobalSearch(false);
             }
           }}
         >
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <span className="text-2xl">🔍</span>
                <span>Pesquisa Global</span>
              </h2>
              <button
                onClick={() => setShowGlobalSearch(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar em todos os módulos..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowGlobalSearch(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center space-x-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-sm">❌</span>
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGlobalSearch();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-sm">🔍</span>
                  <span>Pesquisar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

                    {/* Command Palette Modal */}
       {showCommandPalette && (
         <div 
           className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4" 
           data-modal="true"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               setShowCommandPalette(false);
             }
           }}
         >
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                                     <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                     <span className="text-3xl">🎯</span>
                     <span>Navegação Rápida</span>
                   </h2>
                   <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                     <span>🚀</span>
                     <span>Acesse todos os módulos rapidamente</span>
                   </p>
                </div>
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                                     placeholder="Pesquisar módulos... (⌘M para navegação rápida)"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-2 h-2 rounded-full bg-${categoryColors[category as keyof typeof categoryColors]}-500`}></div>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                      categoryColors[category as keyof typeof categoryColors] === 'blue' ? 'text-blue-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'emerald' ? 'text-emerald-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'purple' ? 'text-purple-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'green' ? 'text-green-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'red' ? 'text-red-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'indigo' ? 'text-indigo-600' :
                      categoryColors[category as keyof typeof categoryColors] === 'orange' ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {commands.map((command) => (
                                             <button
                         key={command.path}
                         onClick={(e) => {
                           e.stopPropagation();
                           console.log("🎯 Command Palette - Button clicked:", command.name);
                           handleCommandSelect(command);
                         }}
                         className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left group border border-transparent hover:border-gray-200"
                       >
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <span className="text-xl">{command.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{command.name}</p>
                          <p className="text-xs text-gray-500">{command.path}</p>
                        </div>
                        <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300 text-gray-600 font-mono">
                          {command.shortcut}
                        </kbd>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Nenhum módulo encontrado</p>
                  <p className="text-gray-400 text-sm mt-1">Tente uma pesquisa diferente</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>⌘K para pesquisa global</span>
                  <span>⌘M para módulos</span>
                  <span>Esc para fechar</span>
                </div>
                <span>{filteredCommands.length} módulo{filteredCommands.length !== 1 ? 's' : ''} encontrado{filteredCommands.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
