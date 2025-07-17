import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  TestTube,
  ClipboardCheck,
  Package,
  Truck,
  AlertTriangle,
  BarChart3,
  FilePlus,
  Shield,
  Settings,
  Menu,
  X,
  ChevronDown,
  Search,
  Building,
  HelpCircle,
  MoreHorizontal,
  Grid3X3,
  Users,
  Calendar,
  Target,
  CheckSquare,
  Database,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Zap,
} from "lucide-react";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

// Categorização dos módulos para melhor organização
const moduleCategories = {
  principal: [
    {
      path: "/dashboard",
      icon: Home,
      label: "Dashboard",
      description: "Visão geral do projeto",
      color: "from-blue-500 to-blue-600",
      priority: 1,
    },
    {
      path: "/obras",
      icon: Building,
      label: "Obras",
      description: "Gestão de projetos e obras",
      color: "from-slate-500 to-slate-600",
      priority: 2,
    },
    {
      path: "/pie",
      icon: Shield,
      label: "PIE",
      description: "Pontos de Inspeção e Ensaios",
      color: "from-pink-500 to-pink-600",
      priority: 3,
    },
  ],
  qualidade: [
    {
      path: "/ensaios",
      icon: TestTube,
      label: "Ensaios",
      description: "Controlo de ensaios técnicos",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      path: "/ensaios-compactacao",
      icon: TestTube,
      label: "Ensaios de Compactação",
      description: "Ensaios Proctor e compactação",
      color: "from-green-500 to-green-600",
    },
    {
      path: "/checklists",
      icon: ClipboardCheck,
      label: "Checklists",
      description: "Inspeções e verificações",
      color: "from-purple-500 to-purple-600",
    },
    {
      path: "/nao-conformidades",
      icon: AlertTriangle,
      label: "Não Conformidades",
      description: "Gestão de NCs",
      color: "from-red-500 to-red-600",
    },
  ],
  gestao: [
    {
      path: "/documentos",
      icon: FileText,
      label: "Documentos",
      description: "Gestão de documentação",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      path: "/rfis",
      icon: HelpCircle,
      label: "RFIs",
      description: "Pedidos de Informação",
      color: "from-blue-400 to-blue-700",
    },
    {
      path: "/materiais",
      icon: Package,
      label: "Materiais",
      description: "Gestão de materiais",
      color: "from-orange-500 to-orange-600",
    },
    {
      path: "/fornecedores",
      icon: Truck,
      label: "Fornecedores",
      description: "Cadastro de fornecedores",
      color: "from-cyan-500 to-cyan-600",
    },
  ],
  relatorios: [
    {
      path: "/relatorios",
      icon: BarChart3,
      label: "Relatórios",
      description: "Análises e relatórios",
      color: "from-violet-500 to-violet-600",
    },
  ],
};

// Exportar menuItems para uso em outros componentes
export const menuItems = [
  ...moduleCategories.principal,
  ...moduleCategories.qualidade,
  ...moduleCategories.gestao,
  ...moduleCategories.relatorios,
];

const quickActions = [
  {
    path: "/obras/nova",
    icon: Building,
    label: "Nova Obra",
    color: "from-slate-500 to-slate-600",
  },
  {
    path: "/pie/editor",
    icon: Shield,
    label: "Novo PIE",
    color: "from-pink-500 to-pink-600",
  },
  {
    path: "/ensaios/novo",
    icon: TestTube,
    label: "Registar Ensaio",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    path: "/ensaios-compactacao/novo",
    icon: TestTube,
    label: "Novo Ensaio Compactação",
    color: "from-green-500 to-green-600",
  },
  {
    path: "/checklists/novo",
    icon: ClipboardCheck,
    label: "Criar Checklist",
    color: "from-purple-500 to-purple-600",
  },
  {
    path: "/documentos/novo",
    icon: FilePlus,
    label: "Novo Documento",
    color: "from-blue-500 to-blue-600",
  },
  {
    path: "/materiais/novo",
    icon: Package,
    label: "Novo Material",
    color: "from-orange-500 to-orange-600",
  },
  {
    path: "/fornecedores/novo",
    icon: Truck,
    label: "Novo Fornecedor",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    path: "/nao-conformidades/nova",
    icon: AlertTriangle,
    label: "Reportar NC",
    color: "from-red-500 to-red-600",
  },
  {
    path: "/rfis/novo",
    icon: HelpCircle,
    label: "Novo RFI",
    color: "from-blue-400 to-blue-700",
  },
  // Removido: não existe rota para novo relatório
  // {
  //   path: "/relatorios/novo",
  //   icon: BarChart3,
  //   label: "Novo Relatório",
  //   color: "from-violet-500 to-violet-600",
  // },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowMoreMenu(false);
        setShowQuickActions(false);
      }
      if (!target.closest('.global-search-container')) {
        setShowGlobalSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atalho de teclado para busca global (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowGlobalSearch(true);
      }
      if (event.key === 'Escape') {
        setShowGlobalSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dados de exemplo para busca global
  const globalSearchData = [
    // Materiais
    { type: 'material', id: '1', title: 'Cimento Portland', description: 'Cimento para construção', path: '/materiais' },
    { type: 'material', id: '2', title: 'Aço CA-50', description: 'Aço para armaduras', path: '/materiais' },
    { type: 'material', id: '3', title: 'Areia', description: 'Areia para betão', path: '/materiais' },
    
    // Fornecedores
    { type: 'fornecedor', id: '1', title: 'Cimpor', description: 'Fornecedor de cimentos', path: '/fornecedores' },
    { type: 'fornecedor', id: '2', title: 'ArcelorMittal', description: 'Fornecedor de aços', path: '/fornecedores' },
    
    // Ensaios
    { type: 'ensaio', id: '1', title: 'Ensaio de Resistência', description: 'Ensaio de betão', path: '/ensaios' },
    { type: 'ensaio', id: '2', title: 'Ensaio de Densidade', description: 'Ensaio de materiais', path: '/ensaios' },
    
    // Documentos
    { type: 'documento', id: '1', title: 'Projeto Estrutural', description: 'Documentação técnica', path: '/documentos' },
    { type: 'documento', id: '2', title: 'Especificações Técnicas', description: 'Especificações de obra', path: '/documentos' },
    
    // Obras
    { type: 'obra', id: '1', title: 'Edifício Residencial', description: 'Obra em construção', path: '/obras' },
    { type: 'obra', id: '2', title: 'Ponte Metálica', description: 'Infraestrutura', path: '/obras' },
    
    // Checklists
    { type: 'checklist', id: '1', title: 'Checklist Fundações', description: 'Verificação de fundações', path: '/checklists' },
    { type: 'checklist', id: '2', title: 'Checklist Estrutura', description: 'Verificação estrutural', path: '/checklists' },
    
    // Não Conformidades
    { type: 'nc', id: '1', title: 'NC-001', description: 'Não conformidade estrutural', path: '/nao-conformidades' },
    { type: 'nc', id: '2', title: 'NC-002', description: 'Não conformidade de materiais', path: '/nao-conformidades' },
    
    // RFIs
    { type: 'rfi', id: '1', title: 'RFI-001', description: 'Pedido de informação técnica', path: '/rfis' },
    { type: 'rfi', id: '2', title: 'RFI-002', description: 'Clarificação de especificações', path: '/rfis' },
  ];

  // Filtrar dados da busca global
  const filteredGlobalData = globalSearchData.filter(item =>
    item.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const handleGlobalSearchSelect = (item: any) => {
    navigate(item.path);
    setShowGlobalSearch(false);
    setGlobalSearchQuery("");
  };

  // Todos os módulos para busca
  const allModules = [
    ...moduleCategories.principal,
    ...moduleCategories.qualidade,
    ...moduleCategories.gestao,
    ...moduleCategories.relatorios,
  ];

  // Módulos filtrados por busca
  const filteredModules = allModules.filter(module =>
    module.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Módulos principais sempre visíveis (PC)
  const mainModules = moduleCategories.principal;

  // Módulos secundários para dropdown (PC)
  const secondaryModules = [
    ...moduleCategories.qualidade,
    ...moduleCategories.gestao,
    ...moduleCategories.relatorios,
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600/95 via-blue-500/95 to-blue-600/95 backdrop-blur-md shadow-xl px-4 lg:px-6 py-0 flex flex-col md:flex-row md:items-center md:justify-between z-40 relative border-b border-white/20">
      {/* Branding & Mobile Menu Button */}
      <div className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-glow border border-white/20 group-hover:scale-105 transition-transform">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white font-display tracking-wide group-hover:text-blue-100 transition">
              Qualicore
            </span>
            <span className="text-sm text-white/70 font-medium tracking-wide">
              Sistema de Gestão da Qualidade
            </span>
            <span className="text-xs text-white/50 font-medium tracking-wide">
              by José Antunes
            </span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
        {/* Módulos Principais */}
        {mainModules.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive(item.path)
                  ? "bg-white/20 text-white shadow-lg border border-white/20"
                  : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`}
            >
              <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} shadow-sm`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="hidden lg:inline font-semibold">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full shadow-sm"></div>
              )}
            </Link>
          );
        })}

        {/* Dropdown "Mais" */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              showMoreMenu
                ? "bg-white/20 text-white shadow-lg border border-white/20"
                : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
            }`}
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm">
              <MoreHorizontal className="h-4 w-4 text-white" />
            </div>
            <span className="hidden lg:inline font-semibold">Mais Módulos</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showMoreMenu && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50">
              {/* Search */}
              <div className="px-4 pb-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Procurar módulos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="max-h-96 overflow-y-auto">
                {searchQuery ? (
                  // Resultados da busca
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Resultados da Busca
                    </h3>
                    {filteredModules.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowMoreMenu(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  // Categorias organizadas
                  <>
                    {/* Qualidade */}
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        Qualidade
                      </h3>
                      {moduleCategories.qualidade.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(item.path)
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Gestão */}
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                        <Database className="h-3 w-3 mr-1" />
                        Gestão
                      </h3>
                      {moduleCategories.gestao.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(item.path)
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Relatórios */}
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Relatórios
                      </h3>
                      {moduleCategories.relatorios.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(item.path)
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                                 </>
             )}
           </div>
           
           {/* Mobile Footer - Removido indicadores mock */}
           {/* <div className="p-4 border-t border-gray-100 bg-gray-50">
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-green-400"></div>
                 <span className="text-gray-600">Sistema Online</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                 <span className="text-gray-600">3 NCs Ativas</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                 <span className="text-gray-600">7 Ensaios Pendentes</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                 <span className="text-gray-600">12 Checklists</span>
               </div>
             </div>
           </div> */}
         </div>
       )}
        </div>

        {/* Separador Visual */}
        <div className="w-px h-8 bg-white/20 mx-2"></div>

        {/* Busca Global */}
        <div className="relative global-search-container">
          <button
            onClick={() => setShowGlobalSearch(!showGlobalSearch)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium hidden lg:inline">Busca Global</span>
            <div className="hidden lg:flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded text-white/70">Ctrl</kbd>
              <span className="text-white/50">+</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded text-white/70">K</kbd>
            </div>
          </button>

          {/* Modal de Busca Global */}
          {showGlobalSearch && (
            <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar em todo o sistema..."
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Resultados */}
                <div className="max-h-80 overflow-y-auto">
                  {globalSearchQuery ? (
                    filteredGlobalData.length > 0 ? (
                      <div className="p-2">
                        {filteredGlobalData.map((item, index) => (
                          <button
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleGlobalSearchSelect(item)}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className={`p-2 rounded-lg ${
                              item.type === 'material' ? 'bg-orange-500' :
                              item.type === 'fornecedor' ? 'bg-cyan-500' :
                              item.type === 'ensaio' ? 'bg-emerald-500' :
                              item.type === 'documento' ? 'bg-indigo-500' :
                              item.type === 'obra' ? 'bg-slate-500' :
                              item.type === 'checklist' ? 'bg-purple-500' :
                              item.type === 'nc' ? 'bg-red-500' :
                              item.type === 'rfi' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}>
                              {item.type === 'material' ? <Package className="h-4 w-4 text-white" /> :
                               item.type === 'fornecedor' ? <Truck className="h-4 w-4 text-white" /> :
                               item.type === 'ensaio' ? <TestTube className="h-4 w-4 text-white" /> :
                               item.type === 'documento' ? <FileText className="h-4 w-4 text-white" /> :
                               item.type === 'obra' ? <Building className="h-4 w-4 text-white" /> :
                               item.type === 'checklist' ? <ClipboardCheck className="h-4 w-4 text-white" /> :
                               item.type === 'nc' ? <AlertTriangle className="h-4 w-4 text-white" /> :
                               item.type === 'rfi' ? <HelpCircle className="h-4 w-4 text-white" /> :
                               <FileText className="h-4 w-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                              <div className="text-xs text-gray-400 capitalize">{item.type}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.path}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                        <p className="text-sm">Tente uma busca diferente</p>
                      </div>
                    )
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Busca Global</p>
                      <p className="text-sm">Digite para começar a buscar</p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <Package className="h-4 w-4 text-orange-500" />
                          <span>Materiais</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <Truck className="h-4 w-4 text-cyan-500" />
                          <span>Fornecedores</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <TestTube className="h-4 w-4 text-emerald-500" />
                          <span>Ensaios</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          <span>Documentos</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separador Visual */}
        <div className="w-px h-8 bg-white/20 mx-2"></div>

        {/* Quick Actions */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md transition-all duration-200"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 shadow-sm">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="hidden lg:inline font-semibold">Ações Rápidas</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
          </button>

          {showQuickActions && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-50">
              <div className="px-3 pb-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Ações Rápidas</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.path}
                      to={action.path}
                      onClick={() => setShowQuickActions(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${action.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white rounded-2xl shadow-2xl border border-gray-200 mt-2 mb-4 mx-2 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Menu de Navegação</h3>
              {/* Removido indicador mock "Online" */}
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Procurar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mobile Menu Content */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery ? (
              // Resultados da busca (mobile)
              <div className="p-2">
                {filteredModules.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-xl text-sm transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              // Categorias organizadas (mobile)
              <>
                {/* Principais */}
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                    Principais
                  </h3>
                  {moduleCategories.principal.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl text-sm transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Qualidade */}
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3 flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Qualidade
                  </h3>
                  {moduleCategories.qualidade.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl text-sm transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Gestão */}
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3 flex items-center">
                    <Database className="h-3 w-3 mr-1" />
                    Gestão
                  </h3>
                  {moduleCategories.gestao.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl text-sm transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Relatórios */}
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Relatórios
                  </h3>
                  {moduleCategories.relatorios.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-3 rounded-xl text-sm transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configurações"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notificações</h4>
                  <p className="text-sm text-gray-600">Gerir notificações do sistema</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Tema</h4>
                  <p className="text-sm text-gray-600">Alterar aparência do sistema</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </nav>
  );
}
