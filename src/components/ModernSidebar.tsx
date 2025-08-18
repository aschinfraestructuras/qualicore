import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
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
  ChevronRight,
  Database,
  Target,
  CheckCircle,
  Plus,
  X as XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModernSidebar({ isOpen, onClose }: ModernSidebarProps) {
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
      color: "blue",
      items: [
        { name: "Ensaios", description: "Controlo de ensaios técnicos", icon: ClipboardList, href: "/ensaios", badge: "12" },
        { name: "Ensaios Compactação", description: "Ensaios Proctor e compactação", icon: BarChart3, href: "/ensaios-compactacao", badge: "3" },
        { name: "Checklists", description: "Inspeções e verificações", icon: FileText, href: "/checklists", badge: "8" },
        { name: "Não Conformidades", description: "Gestão de NCs", icon: AlertTriangle, href: "/nao-conformidades", badge: "5" },
      ]
    },
    {
      category: "GESTÃO",
      icon: Database,
      color: "purple",
      items: [
        { name: "Documentos", description: "Gestão de documentação", icon: FolderOpen, href: "/documentos", badge: "24" },
        { name: "RFIs", description: "Pedidos de Informação", icon: HelpCircle, href: "/rfis", badge: "7" },
        { name: "Materiais", description: "Gestão de materiais", icon: Grid3X3, href: "/materiais", badge: "15" },
        { name: "Fornecedores", description: "Gestão de fornecedores", icon: Users, href: "/fornecedores", badge: "32" },
      ]
    }
  ];

  const quickStats = [
    { label: "Obras Ativas", value: "12", icon: Building2, color: "blue" },
    { label: "Ensaios Hoje", value: "8", icon: ClipboardList, color: "green" },
    { label: "NCs Pendentes", value: "3", icon: AlertTriangle, color: "red" },
    { label: "Documentos", value: "156", icon: FileText, color: "purple" },
  ];

  const recentActivity = [
    { action: "Nova obra criada", item: "Linha do Sado", time: "2 min", icon: Plus, color: "green" },
    { action: "Ensaio aprovado", item: "Ensaio #1234", time: "15 min", icon: CheckCircle, color: "blue" },
    { action: "NC registada", item: "NC-2024-001", time: "1 hora", icon: AlertTriangle, color: "red" },
    { action: "Documento atualizado", item: "Relatório Mensal", time: "2 horas", icon: FileText, color: "purple" },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Qualicore
                  </h2>
                  <p className="text-xs text-gray-500">Módulos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 lg:hidden"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Quick Stats */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Visão Geral</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                          <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div className="px-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Módulos</h3>
                <div className="space-y-2">
                  {modules.map((section) => (
                    <div key={section.category} className="bg-white rounded-xl border border-gray-200/50 overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.category)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-${section.color}-100 flex items-center justify-center`}>
                            <section.icon className={`h-4 w-4 text-${section.color}-600`} />
                          </div>
                          <span className="font-medium text-gray-900">{section.category}</span>
                        </div>
                        <ChevronRight 
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedSections.includes(section.category) ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedSections.includes(section.category) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                          >
                            <div className="p-2 space-y-1">
                              {section.items.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                                    location.pathname === item.href
                                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50"
                                      : "hover:bg-gray-50"
                                  }`}
                                  onClick={onClose}
                                >
                                  <div className="flex items-center space-x-3">
                                    <item.icon className="h-4 w-4 text-gray-600" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                  </div>
                                  {item.badge && (
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Atividade Recente</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <activity.icon className={`h-3 w-3 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.item}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200/50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Nova Obra</span>
                  </button>
                  <button className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-sm font-medium">Novo Ensaio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <p>Qualicore v1.0.0</p>
                  <p>Desenvolvido por José Antunes</p>
                </div>
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
