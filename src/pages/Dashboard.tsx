import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  TestTube,
  ClipboardCheck,
  FileText,
  Building,
  Users,
  Calendar,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart,
  LineChart,
  AreaChart,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  ComposedChart,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  Sector,
} from "recharts";
import { calcularMetricasReais } from "@/services/metricsService";
import { MetricasReais } from "@/services/metricsService";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [metricas, setMetricas] = useState<MetricasReais | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"overview" | "detailed">("overview");

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
      const data = await calcularMetricasReais();
      setMetricas(data);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    carregarMetricas();
    toast.success("Métricas atualizadas!");
  };

  const handleVerDetalhes = (modulo: string) => {
    // Implementar navegação para módulos específicos
    console.log(`Ver detalhes do módulo: ${modulo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar métricas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Qualicore</h1>
            <p className="text-gray-600 mt-2">Visão geral da qualidade e conformidade</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleRefresh} className="btn btn-outline">
              <Activity className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Conformidade Geral */}
        <motion.div 
          className="card cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleVerDetalhes("geral")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.geral.conformidade_geral.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Conformidade Geral</div>
        </motion.div>

        {/* Total de Registos */}
        <motion.div 
          className="card cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleVerDetalhes("relatorios")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.geral.total_registros}
          </div>
          <div className="text-sm text-gray-600">Total de Registos</div>
        </motion.div>

        {/* Ensaios */}
        <motion.div 
          className="card cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleVerDetalhes("ensaios")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <TestTube className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.ensaios.total_ensaios}
          </div>
          <div className="text-sm text-gray-600">
            Ensaios ({metricas.ensaios.taxa_conformidade.toFixed(1)}% conformes)
          </div>
        </motion.div>

        {/* Materiais */}
        <motion.div 
          className="card cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleVerDetalhes("materiais")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {metricas.materiais.total_materiais}
          </div>
          <div className="text-sm text-gray-600">
            Materiais ({metricas.materiais.taxa_aprovacao.toFixed(1)}% aprovados)
          </div>
        </motion.div>
      </div>

      {/* Gráficos Profissionais - 6 Gráficos Avançados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* 1. Gráfico de Gauge - Conformidade Geral */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Conformidade Geral
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Gauge Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={metricas.geral.conformidade_geral >= 80 ? "#10B981" : metricas.geral.conformidade_geral >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(metricas.geral.conformidade_geral / 100) * 251.2} 251.2`}
                      style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {metricas.geral.conformidade_geral.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Conformidade</div>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>Crítico</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>Atenção</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Bom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Gráfico de Barras Empilhadas - Distribuição por Módulo */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Distribuição por Módulo
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={[
                  {
                    modulo: "Ensaios",
                    conformes: metricas.ensaios.ensaios_conformes,
                    naoConformes: metricas.ensaios.ensaios_nao_conformes,
                    total: metricas.ensaios.total_ensaios
                  },
                  {
                    modulo: "Checklists",
                    conformes: metricas.checklists.checklists_concluidos,
                    naoConformes: metricas.checklists.checklists_pendentes,
                    total: metricas.checklists.total_checklists
                  },
                  {
                    modulo: "Materiais",
                    conformes: metricas.materiais.materiais_aprovados,
                    naoConformes: metricas.materiais.materiais_pendentes + metricas.materiais.materiais_reprovados,
                    total: metricas.materiais.total_materiais
                  },
                  {
                    modulo: "NCs",
                    conformes: metricas.naoConformidades.ncs_resolvidas,
                    naoConformes: metricas.naoConformidades.ncs_pendentes,
                    total: metricas.naoConformidades.total_ncs
                  }
                ].filter(item => item.total > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="modulo" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [value, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar dataKey="conformes" stackId="a" fill="#10B981" name="Conformes/Aprovados" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="naoConformes" stackId="a" fill="#EF4444" name="Não Conformes/Pendentes" radius={[0, 0, 4, 4]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Gráfico de Linha - Tendência de Qualidade */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Tendência de Qualidade
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={[
                  { mes: "Jan", qualidade: 65, meta: 85 },
                  { mes: "Fev", qualidade: 72, meta: 85 },
                  { mes: "Mar", qualidade: 78, meta: 85 },
                  { mes: "Abr", qualidade: 75, meta: 85 },
                  { mes: "Mai", qualidade: 82, meta: 85 },
                  { mes: "Jun", qualidade: metricas.geral.conformidade_geral, meta: 85 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="qualidade" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Qualidade Atual"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Meta"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Gráfico de Pizza - Estado dos Materiais */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Estado dos Materiais
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80">
              {(() => {
                const totalMateriais = metricas.materiais.materiais_aprovados + 
                                     metricas.materiais.materiais_pendentes + 
                                     metricas.materiais.materiais_reprovados +
                                     metricas.materiais.materiais_em_analise;
                
                if (totalMateriais === 0) {
                  return (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum material registado</p>
                      </div>
                    </div>
                  );
                }
                
                const pieData = [
                  { name: "Aprovados", value: metricas.materiais.materiais_aprovados, color: "#10B981", icon: "✅" },
                  { name: "Pendentes", value: metricas.materiais.materiais_pendentes, color: "#F59E0B", icon: "⏳" },
                  { name: "Reprovados", value: metricas.materiais.materiais_reprovados, color: "#EF4444", icon: "❌" },
                  { name: "Em Análise", value: metricas.materiais.materiais_em_analise, color: "#3B82F6", icon: "🔍" },
                ].filter(item => item.value > 0);
                
                return (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-full max-w-md">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            dataKey="value"
                            label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={true}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any, name: any) => [value, name]}
                            labelStyle={{ color: '#374151' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Legenda personalizada */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {pieData.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* 5. Gráfico de Radar - Performance por Dimensão */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Performance por Dimensão
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { subject: "Qualidade", A: metricas.ensaios.taxa_conformidade, B: 90, fullMark: 100 },
                  { subject: "Eficiência", A: metricas.checklists.conformidade_media, B: 85, fullMark: 100 },
                  { subject: "Aprovação", A: metricas.materiais.taxa_aprovacao, B: 95, fullMark: 100 },
                  { subject: "Resolução", A: metricas.naoConformidades.taxa_resolucao, B: 80, fullMark: 100 },
                  { subject: "Conformidade", A: metricas.geral.conformidade_geral, B: 88, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Radar
                    name="Atual"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Meta"
                    dataKey="B"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Legend />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 6. Gráfico de Área - KPIs de Qualidade */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              KPIs de Qualidade
            </h3>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={[
                  { 
                    periodo: "Q1", 
                    conformidade: 68, 
                    eficiencia: 72,
                    resolucao: 65,
                    meta: 85
                  },
                  { 
                    periodo: "Q2", 
                    conformidade: 75, 
                    eficiencia: 78,
                    resolucao: 70,
                    meta: 85
                  },
                  { 
                    periodo: "Q3", 
                    conformidade: 82, 
                    eficiencia: 85,
                    resolucao: 78,
                    meta: 85
                  },
                  { 
                    periodo: "Q4", 
                    conformidade: metricas.geral.conformidade_geral, 
                    eficiencia: metricas.checklists.conformidade_media,
                    resolucao: metricas.naoConformidades.taxa_resolucao,
                    meta: 85
                  },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="conformidade" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Conformidade"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="eficiencia" 
                    stackId="2" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.4}
                    name="Eficiência"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolucao" 
                    stackId="3" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.4}
                    name="Resolução"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Meta"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

