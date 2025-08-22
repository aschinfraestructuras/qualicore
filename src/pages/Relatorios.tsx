import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Filter,
  RefreshCw,
  Printer,
  Share2,
  Eye,
  PieChart,
  Activity,
  Clock,
  Search,
  XCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Zap,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Relatorios() {
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Dados atualizados");
    }, 1000);
  };

  const handleExportRelatorio = (tipo: string) => {
    toast.success(`Relatório ${tipo} exportado com sucesso!`);
  };

  const relatoriosDisponiveis = [
    {
      id: "ensaios",
      titulo: "Relatório de Ensaios",
      descricao: "Análise detalhada dos ensaios realizados",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      status: "disponivel"
    },
    {
      id: "checklists",
      titulo: "Relatório de Checklists",
      descricao: "Conformidade e status dos checklists",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      status: "disponivel"
    },
    {
      id: "materiais",
      titulo: "Relatório de Materiais",
      descricao: "Controle de qualidade dos materiais",
      icon: Package,
      color: "from-purple-500 to-pink-500",
      status: "disponivel"
    },
    {
      id: "ncs",
      titulo: "Relatório de Não Conformidades",
      descricao: "Análise de não conformidades e resoluções",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
      status: "disponivel"
    },
    {
      id: "documentos",
      titulo: "Relatório de Documentos",
      descricao: "Status e controle de documentos",
      icon: FileText,
      color: "from-indigo-500 to-purple-500",
      status: "disponivel"
    },
    {
      id: "geral",
      titulo: "Relatório Geral",
      descricao: "Visão geral de todos os módulos",
      icon: Activity,
      color: "from-slate-600 to-gray-700",
      status: "disponivel"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Relatórios
              </h1>
              <p className="text-gray-600">
                Gere relatórios detalhados de todos os módulos do sistema
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Relatórios Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {relatoriosDisponiveis.map((relatorio, index) => {
            const Icon = relatorio.icon;
            return (
              <motion.div
                key={relatorio.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${relatorio.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Disponível
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {relatorio.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {relatorio.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExportRelatorio(relatorio.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Exportar</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExportRelatorio(relatorio.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">Visualizar</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {relatoriosDisponiveis.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou criar um novo relatório
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
