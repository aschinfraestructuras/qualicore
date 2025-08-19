import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart as BarChartIcon,
} from "lucide-react";
import { Fornecedor } from "@/types";
import { PDFService } from "@/services/pdfService";
import toast from "react-hot-toast";

interface FornecedoresDashboardProps {
  fornecedores: Fornecedor[];
  onSearch?: (query: string, options?: any) => void;
  onFilterChange?: (filters: any) => void;
}

export default function FornecedoresDashboard({
  fornecedores,
  onSearch,
  onFilterChange,
}: FornecedoresDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = fornecedores.length;
    const ativos = fornecedores.filter((f) => f.estado === "ativo").length;
    const inativos = fornecedores.filter((f) => f.estado === "inativo").length;
    const esteMes = fornecedores.filter((f) => {
      const dataRegisto = new Date(f.data_registo);
      const agora = new Date();
      return (
        dataRegisto.getMonth() === agora.getMonth() &&
        dataRegisto.getFullYear() === agora.getFullYear()
      );
    }).length;
    const esteAno = fornecedores.filter((f) => {
      const dataRegisto = new Date(f.data_registo);
      const agora = new Date();
      return dataRegisto.getFullYear() === agora.getFullYear();
    }).length;

    // Análise por cidade (extrair da morada)
    const cidades = fornecedores.reduce((acc, f) => {
      const cidade = f.morada.split(",").pop()?.trim() || "Não especificada";
      acc[cidade] = (acc[cidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Evolução temporal (últimos 6 meses)
    const evolucaoTemporal = [];
    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = data.toLocaleDateString("pt-PT", { month: "short" });
      const count = fornecedores.filter((f) => {
        const dataRegisto = new Date(f.data_registo);
        return (
          dataRegisto.getMonth() === data.getMonth() &&
          dataRegisto.getFullYear() === data.getFullYear()
        );
      }).length;
      evolucaoTemporal.push({ mes, fornecedores: count });
    }

    return {
      total,
      ativos,
      inativos,
      esteMes,
      esteAno,
      cidades,
      evolucaoTemporal,
    };
  }, [fornecedores]);

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  const handleExportData = () => {
    // Implementar exportação
    console.log("Exportar dados");
  };

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      
      switch (reportType) {
        case "executivo":
          await pdfService.generateFornecedoresExecutiveReport(fornecedores);
          break;
        case "filtrado":
          await pdfService.generateFornecedoresFilteredReport(fornecedores, {});
          break;
        case "comparativo":
          await pdfService.generateFornecedoresComparativeReport(fornecedores);
          break;
        case "individual":
          if (fornecedores.length > 0) {
            await pdfService.generateFornecedoresIndividualReport([fornecedores[0]]);
          } else {
            toast.error("Nenhum fornecedor disponível para relatório individual");
            return;
          }
          break;
      }
      
      toast.success(`Relatório ${reportType} gerado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard de Fornecedores</h2>
            <p className="text-gray-600">Visão geral e análise dos fornecedores</p>
          </div>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Gerando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
              <Building className="h-8 w-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ativos</p>
                <p className="text-2xl font-bold">{metrics.ativos}</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Inativos</p>
                <p className="text-2xl font-bold">{metrics.inativos}</p>
              </div>
              <XCircle className="h-8 w-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Este Mês</p>
                <p className="text-2xl font-bold">{metrics.esteMes}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Este Ano</p>
                <p className="text-2xl font-bold">{metrics.esteAno}</p>
              </div>
              <Star className="h-8 w-8 opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Visão Geral", icon: BarChartIcon },
              { id: "analytics", label: "Análise", icon: TrendingUp },
              { id: "enhancements", label: "Melhorias", icon: Award },
              { id: "reports", label: "Relatórios", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução Temporal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Evolução Temporal</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.evolucaoTemporal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="fornecedores"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Distribuição por Estado */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Ativos", value: metrics.ativos },
                        { name: "Inativos", value: metrics.inativos },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Distribuição por Cidade */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Cidade</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(metrics.cidades).map(([cidade, count]) => ({
                      cidade,
                      fornecedores: count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cidade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="fornecedores" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "enhancements" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Melhorias Sugeridas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Qualificação de Fornecedores</h4>
                  <p className="text-blue-700 text-sm">
                    Implementar sistema de avaliação e qualificação de fornecedores para melhorar a qualidade dos serviços.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Monitorização de Performance</h4>
                  <p className="text-green-700 text-sm">
                    Criar métricas de performance para acompanhar a qualidade e pontualidade dos fornecedores.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Certificações</h4>
                  <p className="text-purple-700 text-sm">
                    Sistema de gestão de certificações e documentos dos fornecedores.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Avaliações</h4>
                  <p className="text-orange-700 text-sm">
                    Implementar sistema de avaliações periódicas dos fornecedores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relatórios Disponíveis</h3>
                {loading && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Gerando...</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleGenerateReport("executivo")}
                  disabled={loading}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Relatório Executivo</div>
                    <div className="text-sm text-gray-600">Visão geral dos fornecedores</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGenerateReport("filtrado")}
                  disabled={loading}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Relatório Filtrado</div>
                    <div className="text-sm text-gray-600">Dados baseados em filtros</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGenerateReport("comparativo")}
                  disabled={loading}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Análise Comparativa</div>
                    <div className="text-sm text-gray-600">Comparação entre fornecedores</div>
                  </div>
                </button>

                <button
                  onClick={() => handleGenerateReport("individual")}
                  disabled={loading}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-6 w-6 text-orange-600" />
                  <div className="text-left">
                    <div className="font-medium">Relatório Individual</div>
                    <div className="text-sm text-gray-600">Ficha técnica detalhada</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
