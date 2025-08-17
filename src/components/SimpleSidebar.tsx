import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Shield,
  FileText,
  ClipboardList,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  Grid3X3,
  BarChart3,
  Users,
  Settings,
  X,
  Plus,
  Target,
  Database,
} from "lucide-react";

interface SimpleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleSidebar({ isOpen, onClose }: SimpleSidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['QUALIDADE']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const modules = [
    {
      category: "QUALIDADE",
      icon: Target,
      items: [
        { name: "Ensaios", icon: ClipboardList, href: "/ensaios" },
        { name: "Ensaios Compactação", icon: BarChart3, href: "/ensaios-compactacao" },
        { name: "Checklists", icon: FileText, href: "/checklists" },
        { name: "Não Conformidades", icon: AlertTriangle, href: "/nao-conformidades" },
      ]
    },
    {
      category: "GESTÃO",
      icon: Database,
      items: [
        { name: "Documentos", icon: FolderOpen, href: "/documentos" },
        { name: "RFIs", icon: HelpCircle, href: "/rfis" },
        { name: "Materiais", icon: Grid3X3, href: "/materiais" },
        { name: "Fornecedores", icon: Users, href: "/fornecedores" },
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Qualicore</h2>
              <p className="text-xs text-gray-500">Módulos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link
                to="/obras/nova"
                className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Nova Obra</span>
              </Link>
              <Link
                to="/ensaios/novo"
                className="flex items-center space-x-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={onClose}
              >
                <ClipboardList className="h-4 w-4" />
                <span className="font-medium">Novo Ensaio</span>
              </Link>
            </div>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Módulos</h3>
            <div className="space-y-2">
              {modules.map((section) => (
                <div key={section.category} className="bg-gray-50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.category)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{section.category}</span>
                    </div>
                    <svg 
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        expandedSections.includes(section.category) ? 'rotate-90' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {expandedSections.includes(section.category) && (
                    <div className="border-t border-gray-200">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-3 p-3 transition-colors ${
                            location.pathname === item.href
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={onClose}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estatísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Obras Ativas:</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ensaios Hoje:</span>
                <span className="font-medium text-gray-900">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">NCs Pendentes:</span>
                <span className="font-medium text-red-600">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            <p>Qualicore v1.0.0</p>
            <p>Desenvolvido por José Antunes</p>
          </div>
        </div>
      </div>
    </>
  );
}
