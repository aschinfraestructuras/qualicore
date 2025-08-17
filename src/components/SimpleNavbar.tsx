import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Shield,
  Search,
  Bell,
  User,
  Menu,
  Plus,
  FileText,
  ClipboardList,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  Grid3X3,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

interface SimpleNavbarProps {
  onToggleSidebar: () => void;
}

export default function SimpleNavbar({ onToggleSidebar }: SimpleNavbarProps) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Obras", href: "/obras", icon: Building2 },
    { name: "PIE", href: "/pie", icon: Shield },
  ];

  const modules = [
    { name: "Ensaios", href: "/ensaios", icon: ClipboardList },
    { name: "Ensaios Compactação", href: "/ensaios-compactacao", icon: BarChart3 },
    { name: "Checklists", href: "/checklists", icon: FileText },
    { name: "Não Conformidades", href: "/nao-conformidades", icon: AlertTriangle },
    { name: "Documentos", href: "/documentos", icon: FolderOpen },
    { name: "RFIs", href: "/rfis", icon: HelpCircle },
    { name: "Materiais", href: "/materiais", icon: Grid3X3 },
    { name: "Fornecedores", href: "/fornecedores", icon: Users },
  ];

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Qualicore</h1>
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
                      location.pathname === item.href
                        ? "bg-blue-600 text-white"
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
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Nova Obra Button */}
              <Link
                to="/obras/nova"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block">Nova Obra</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">José Antunes</p>
                      <p className="text-xs text-gray-500">jose.antunes@qualicore.pt</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </button>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="h-4 w-4" />
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

      {/* Overlay para fechar menus */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
