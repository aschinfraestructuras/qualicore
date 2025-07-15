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
} from "lucide-react";

import React, { useState } from "react";
import Modal from "./Modal";

const menuItems = [
  {
    path: "/dashboard",
    icon: Home,
    label: "Dashboard",
    description: "Visão geral do projeto",
    color: "from-blue-500 to-blue-600",
  },
  {
    path: "/obras",
    icon: Building,
    label: "Obras",
    description: "Gestão de projetos e obras",
    color: "from-slate-500 to-slate-600",
  },
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
    path: "/ensaios",
    icon: TestTube,
    label: "Ensaios",
    description: "Controlo de ensaios técnicos",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    path: "/checklists",
    icon: ClipboardCheck,
    label: "Checklists",
    description: "Inspeções e verificações",
    color: "from-purple-500 to-purple-600",
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
  {
    path: "/nao-conformidades",
    icon: AlertTriangle,
    label: "Não Conformidades",
    description: "Gestão de NCs",
    color: "from-red-500 to-red-600",
  },
  {
    path: "/relatorios",
    icon: BarChart3,
    label: "Relatórios",
    description: "Análises e relatórios",
    color: "from-violet-500 to-violet-600",
  },
];

const quickActions = [
  {
    path: "/obras/nova",
    icon: Building,
    label: "Nova Obra",
    color: "from-slate-500 to-slate-600",
  },
  {
    path: "/documentos/novo",
    icon: FilePlus,
    label: "Novo Documento",
    color: "from-blue-500 to-blue-600",
  },
  {
    path: "/ensaios/novo",
    icon: TestTube,
    label: "Registar Ensaio",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    path: "/checklists/novo",
    icon: ClipboardCheck,
    label: "Criar Checklist",
    color: "from-purple-500 to-purple-600",
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
  {
    path: "/relatorios/novo",
    icon: BarChart3,
    label: "Novo Relatório",
    color: "from-violet-500 to-violet-600",
  },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg px-6 py-0 flex flex-col md:flex-row md:items-center md:justify-between z-40 relative">
      {/* Branding & Mobile Menu Button */}
      <div className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-glow border border-white/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white font-display tracking-wide group-hover:text-blue-100 transition">
              Qualicore
            </span>
            <span className="text-xs text-white/70 font-medium tracking-wide">
              by José Antunes
            </span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/20"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8 py-3">
        <div className="flex items-center space-x-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isActive ? `bg-white/20 text-white shadow-glow scale-105 border border-white/20` : "text-blue-100 hover:bg-white/10 hover:text-white hover:scale-102"}`}
                title={item.description}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Quick Actions & Stats */}
      <div className="hidden md:flex items-center space-x-6 py-2">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-48 border border-white/20 rounded-xl bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
          />
        </div>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-white/20 text-white shadow-glow hover:bg-white/30 transition-all duration-200 border border-white/20"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Ações Rápidas
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${showQuickActions ? "rotate-180" : ""}`}
            />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-strong border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Ações Rápidas
                </h3>
              </div>
              <div className="py-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowQuickActions(false)}
                    >
                      <Icon className="h-4 w-4 mr-3 text-gray-500" />
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {/* REMOVIDO: Indicadores/KPIs da barra superior */}
        {/* <div className="flex flex-col items-center">
          <span className="text-xs text-blue-200">Conformidade</span>
          <span className="text-sm font-bold text-white">94.2%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-blue-200">NCs Abertas</span>
          <span className="text-xs font-bold text-red-200">3</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-blue-200">Ensaios Pendentes</span>
          <span className="text-xs font-bold text-yellow-200">7</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-blue-200">Documentos</span>
          <span className="text-xs font-bold text-white">156</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-blue-200">Materiais</span>
          <span className="text-xs font-bold text-white">67</span>
        </div> */}

        {/* Perfil do utilizador */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-glow border border-white/20">
            <span className="text-sm font-bold text-white">JA</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              José Antunes
            </p>
            <p className="text-xs text-blue-200 truncate">
              jose.antunes@qualicore.pt
            </p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-300 mr-2"></div>
              <span className="text-xs text-green-200">Online</span>
            </div>
          </div>
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/20" onClick={() => setShowSettingsModal(true)}>
            <Settings className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
            />
          </div>

          {/* Mobile Navigation */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive ? `bg-white/20 text-white shadow-glow border border-white/20` : "text-blue-100 hover:bg-white/10 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Quick Actions */}
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3 px-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold bg-white/20 text-white shadow-glow hover:bg-white/30 transition-all duration-200 border border-white/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3 px-4">
              Estatísticas
            </h3>
            <div className="grid grid-cols-2 gap-4 px-4">
              {/* <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200">Conformidade</span>
                <span className="text-sm font-bold text-white">94.2%</span>
              </div> */}
              {/* <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200">NCs Abertas</span>
                <span className="text-xs font-bold text-red-200">3</span>
              </div> */}
              {/* <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200">Ensaios Pendentes</span>
                <span className="text-xs font-bold text-yellow-200">7</span>
              </div> */}
              {/* <div className="flex flex-col items-center">
                <span className="text-xs text-blue-200">Documentos</span>
                <span className="text-xs font-bold text-white">156</span>
              </div> */}
            </div>
          </div>

          {/* Mobile Profile */}
          <div className="border-t border-white/20 pt-4 px-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shadow-glow border border-white/20">
                <span className="text-sm font-bold text-white">JA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  José Antunes
                </p>
                <p className="text-xs text-blue-200 truncate">
                  jose.antunes@qualicore.pt
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-300 mr-2"></div>
                  <span className="text-xs text-green-200">Online</span>
                </div>
              </div>
              <button className="p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/20">
                <Settings className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showQuickActions && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowQuickActions(false)}
        />
      )}

      {/* Modal de Configurações */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Ações e Preferências"
      >
        <div className="space-y-4">
          <button className="btn btn-outline w-full" onClick={() => { setShowSettingsModal(false); alert('Notificações por email ativadas!'); }}>Ativar notificações por email</button>
          <button className="btn btn-outline w-full" onClick={() => { setShowSettingsModal(false); alert('Alertas críticos ativados!'); }}>Ativar alertas críticos</button>
          <button className="btn btn-outline w-full" onClick={() => { setShowSettingsModal(false); alert('Exportação de dados realizada!'); }}>Exportar dados</button>
          <button className="btn btn-outline w-full" onClick={() => { setShowSettingsModal(false); alert('Backup realizado!'); }}>Backup manual</button>
        </div>
      </Modal>
    </nav>
  );
}
