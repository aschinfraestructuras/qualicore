import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  TestTube,
  ClipboardCheck,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart3,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  Bell,
  Filter,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Building,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calcularMetricasReais,
  MetricasReais,
} from "@/services/metricsService";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [metricas, setMetricas] = useState<MetricasReais | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
      const dados = await calcularMetricasReais();
      setMetricas(dados);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    carregarMetricas();
    toast.success("Dados atualizados");
  };

  const handleVerDetalhes = (modulo: string) => {
    navigate(`/${modulo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="modern-loader">
          <div className="modern-loader-dot"></div>
          <div className="modern-loader-dot" style={{animationDelay: '0.1s'}}></div>
          <div className="modern-loader-dot" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados do dashboard</p>
        <button onClick={carregarMetricas} className="btn btn-primary mt-4">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Simples */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard de Qualidade
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral do sistema de qualidade
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* KPIs Principais - 4 Cards Essenciais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Conformidade Geral */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("relatorios")}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.geral.conformidade_geral}%
          </div>
          <div className="text-sm text-gray-600">Conformidade Geral</div>
        </div>

        {/* Total de Registos */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("relatorios")}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.geral.total_registros}
          </div>
          <div className="text-sm text-gray-600">Total de Registos</div>
        </div>

        {/* Ensaios */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("ensaios")}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <TestTube className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.ensaios.total_ensaios}
          </div>
          <div className="text-sm text-gray-600">Ensaios ({metricas.ensaios.taxa_conformidade}% conformes)</div>
        </div>

        {/* Checklists */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("checklists")}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.checklists.total_checklists}
          </div>
          <div className="text-sm text-gray-600">Checklists ({metricas.checklists.conformidade_media}% conformes)</div>
        </div>
      </div>

      {/* 4 Gráficos Principais - Mais Pequenos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Distribuição de Ensaios */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Distribuição de Ensaios</h3>
          </div>
          <div className="card-content">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Conformes",
                        value: metricas.ensaios.ensaios_conformes,
                        color: "#10B981",
                      },
                      {
                        name: "Não Conformes",
                        value: metricas.ensaios.ensaios_nao_conformes,
                        color: "#EF4444",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - Performance por Módulo */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance por Módulo</h3>
          </div>
          <div className="card-content">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Ensaios", conformidade: metricas.ensaios.taxa_conformidade },
                    { name: "Checklists", conformidade: metricas.checklists.conformidade_media },
                    { name: "Materiais", conformidade: metricas.materiais.taxa_aprovacao },
                    { name: "NCs", conformidade: metricas.naoConformidades.taxa_resolucao },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Conformidade']} />
                  <Bar dataKey="conformidade" radius={[4, 4, 0, 0]} fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Pizza - Estado dos Materiais */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Estado dos Materiais</h3>
          </div>
          <div className="card-content">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Aprovados", value: metricas.materiais.materiais_aprovados, color: "#10B981" },
                      { name: "Pendentes", value: metricas.materiais.materiais_pendentes, color: "#F59E0B" },
                      { name: "Reprovados", value: metricas.materiais.materiais_reprovados, color: "#EF4444" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - NCs por Severidade */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">NCs por Severidade</h3>
          </div>
          <div className="card-content">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Crítica", value: metricas.naoConformidades.ncs_por_severidade?.critica || 0, color: "#EF4444" },
                    { name: "Alta", value: metricas.naoConformidades.ncs_por_severidade?.alta || 0, color: "#F59E0B" },
                    { name: "Média", value: metricas.naoConformidades.ncs_por_severidade?.media || 0, color: "#3B82F6" },
                    { name: "Baixa", value: metricas.naoConformidades.ncs_por_severidade?.baixa || 0, color: "#10B981" },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any, name: any) => [value, 'Quantidade']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo dos Módulos - Cards Simples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Materiais */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("materiais")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Materiais</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {metricas.materiais.total_materiais}
          </div>
          <div className="text-sm text-gray-600">
            {metricas.materiais.taxa_aprovacao}% aprovados
          </div>
        </div>

        {/* Não Conformidades */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("nao-conformidades")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">NCs</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {metricas.naoConformidades.total_ncs}
          </div>
          <div className="text-sm text-gray-600">
            {metricas.naoConformidades.taxa_resolucao}% resolvidas
          </div>
        </div>

        {/* Obras */}
        <div className="card cursor-pointer" onClick={() => handleVerDetalhes("obras")}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-indigo-100">
              <Building className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500">Obras</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {metricas.obras.total_obras}
          </div>
          <div className="text-sm text-gray-600">
            {metricas.obras.obras_em_execucao} em execução
          </div>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Status do Sistema</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-green-800">Sistema Online</div>
                <div className="text-sm text-green-600">Todos os serviços ativos</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium text-blue-800">Dados Atualizados</div>
                <div className="text-sm text-blue-600">Última atualização: {new Date().toLocaleTimeString("pt-PT")}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <div className="font-medium text-orange-800">{metricas.naoConformidades.ncs_pendentes} NCs Pendentes</div>
                <div className="text-sm text-orange-600">Requerem atenção</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

