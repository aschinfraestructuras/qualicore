import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Share2,
  Printer
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { PDFService } from '@/services/pdfService';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

interface Obra {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  localizacao: string;
  data_inicio: string;
  data_fim_prevista: string;
  valor_contrato: number;
  valor_executado: number;
  percentual_execucao: number;
  status: string;
  tipo_obra: string;
  categoria: string;
  responsavel_tecnico: string;
  coordenador_obra: string;
  fiscal_obra: string;
  engenheiro_responsavel: string;
  arquiteto: string;
  data_criacao: string;
  data_atualizacao: string;
}

interface ObraDashboardProps {
  obras: Obra[];
  onSearch: (search: string) => void;
  onFilterChange: (filters: any) => void;
  onAddObra: () => void;
  onEditObra: (obra: Obra) => void;
  onDeleteObra: (obra: Obra) => void;
  onViewObra: (obra: Obra) => void;
}

const GRADIENT_COLORS = {
  blue: ['#3B82F6', '#1D4ED8'],
  green: ['#10B981', '#059669'],
  purple: ['#8B5CF6', '#7C3AED'],
  orange: ['#F59E0B', '#D97706'],
  red: ['#EF4444', '#DC2626'],
  teal: ['#14B8A6', '#0D9488']
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];

export default function ObraDashboard({
  obras,
  onSearch,
  onFilterChange,
  onAddObra,
  onEditObra,
  onDeleteObra,
  onViewObra
}: ObraDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'reports'>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estatísticas calculadas com métricas avançadas
  const stats = {
    total: obras.length,
    em_execucao: obras.filter(o => o.status === 'em_execucao').length,
    concluidas: obras.filter(o => o.status === 'concluida').length,
    planeadas: obras.filter(o => o.status === 'planeada').length,
    suspensas: obras.filter(o => o.status === 'suspensa').length,
    valor_total: obras.reduce((acc, o) => acc + o.valor_contrato, 0),
    valor_executado: obras.reduce((acc, o) => acc + o.valor_executado, 0),
    percentual_medio: obras.length > 0 ? obras.reduce((acc, o) => acc + o.percentual_execucao, 0) / obras.length : 0,
    // Métricas de gestão de projetos
    obras_no_prazo: obras.filter(o => {
      const hoje = new Date();
      const dataFim = new Date(o.data_fim_prevista);
      return dataFim >= hoje && o.status !== 'suspensa';
    }).length,
    obras_atrasadas: obras.filter(o => {
      const hoje = new Date();
      const dataFim = new Date(o.data_fim_prevista);
      return dataFim < hoje && o.status === 'em_execucao';
    }).length,
    // ROI médio (Return on Investment)
    roi_medio: obras.length > 0 ? obras.reduce((acc, o) => {
      const roi = ((o.valor_executado - o.valor_contrato) / o.valor_contrato) * 100;
      return acc + (isNaN(roi) ? 0 : roi);
    }, 0) / obras.length : 0,
    // Eficiência média (progresso vs tempo decorrido)
    eficiencia_media: obras.length > 0 ? obras.reduce((acc, o) => {
      const dataInicio = new Date(o.data_inicio);
      const dataFim = new Date(o.data_fim_prevista);
      const hoje = new Date();
      const tempoTotal = dataFim.getTime() - dataInicio.getTime();
      const tempoDecorrido = hoje.getTime() - dataInicio.getTime();
      const progressoEsperado = Math.min((tempoDecorrido / tempoTotal) * 100, 100);
      const eficiencia = progressoEsperado > 0 ? (o.percentual_execucao / progressoEsperado) * 100 : 100;
      return acc + (isNaN(eficiencia) ? 100 : Math.min(eficiencia, 200));
    }, 0) / obras.length : 100
  };

  // Dados para gráficos avançados
  const statusData = [
    { name: 'Em Execução', value: stats.em_execucao, color: '#3B82F6' },
    { name: 'Concluídas', value: stats.concluidas, color: '#10B981' },
    { name: 'Planeadas', value: stats.planeadas, color: '#F59E0B' },
    { name: 'Suspensas', value: stats.suspensas, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Distribuição por valor de contrato
  const valorContratoData = obras.map(obra => ({
    nome: obra.nome.substring(0, 12) + '...',
    valor: obra.valor_contrato / 1000000, // Em milhões
    executado: obra.valor_executado / 1000000,
    percentual: obra.percentual_execucao
  })).sort((a, b) => b.valor - a.valor).slice(0, 8);

  // Análise de cronograma vs progresso
  const cronogramaData = obras.map(obra => {
    const dataInicio = new Date(obra.data_inicio);
    const dataFim = new Date(obra.data_fim_prevista);
    const hoje = new Date();
    const tempoTotal = dataFim.getTime() - dataInicio.getTime();
    const tempoDecorrido = Math.max(0, hoje.getTime() - dataInicio.getTime());
    const progressoTempo = Math.min((tempoDecorrido / tempoTotal) * 100, 100);
    
    return {
      nome: obra.nome.substring(0, 12) + '...',
      progressoReal: obra.percentual_execucao,
      progressoEsperado: Math.max(0, progressoTempo),
      status: obra.status,
      eficiencia: progressoTempo > 0 ? (obra.percentual_execucao / progressoTempo) * 100 : 100
    };
  }).filter(item => item.progressoEsperado > 0).slice(0, 8);

  // Análise financeira por categoria
  const categoriaFinanceiraData = obras.reduce((acc, obra) => {
    const categoria = obra.categoria || 'Não definida';
    if (!acc[categoria]) {
      acc[categoria] = { 
        categoria, 
        quantidade: 0, 
        valorTotal: 0, 
        valorExecutado: 0,
        percentualMedio: 0
      };
    }
    acc[categoria].quantidade += 1;
    acc[categoria].valorTotal += obra.valor_contrato;
    acc[categoria].valorExecutado += obra.valor_executado;
    acc[categoria].percentualMedio += obra.percentual_execucao;
    return acc;
  }, {} as Record<string, any>);

  const categoriaData = Object.values(categoriaFinanceiraData).map((cat: any) => ({
    categoria: cat.categoria,
    quantidade: cat.quantidade,
    valorTotal: cat.valorTotal / 1000000,
    valorExecutado: cat.valorExecutado / 1000000,
    percentualMedio: cat.percentualMedio / cat.quantidade,
    roi: ((cat.valorExecutado - cat.valorTotal) / cat.valorTotal) * 100
  }));

  // Dados de performance temporal (últimos 6 meses)
  const performanceTemporalData = (() => {
    const meses = [];
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const nomeMes = mes.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' });
      
      const obrasDoMes = obras.filter(obra => {
        const dataInicio = new Date(obra.data_inicio);
        return dataInicio.getMonth() === mes.getMonth() && 
               dataInicio.getFullYear() === mes.getFullYear();
      });

      const obrasConcluidas = obras.filter(obra => {
        const dataFim = new Date(obra.data_fim_prevista);
        return dataFim.getMonth() === mes.getMonth() && 
               dataFim.getFullYear() === mes.getFullYear() && 
               obra.status === 'concluida';
      });

      meses.push({
        mes: nomeMes,
        iniciadas: obrasDoMes.length,
        concluidas: obrasConcluidas.length,
        valorIniciado: obrasDoMes.reduce((acc, o) => acc + o.valor_contrato, 0) / 1000000,
        valorConcluido: obrasConcluidas.reduce((acc, o) => acc + o.valor_contrato, 0) / 1000000
      });
    }
    return meses;
  })();

  // Análise de riscos e alertas
  const riscosData = obras.map(obra => {
    const hoje = new Date();
    const dataFim = new Date(obra.data_fim_prevista);
    const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    let nivelRisco = 'Baixo';
    let cor = '#10B981';
    
    // Obra atrasada
    if (diasRestantes < 0 && obra.status === 'em_execucao') {
      nivelRisco = 'Alto';
      cor = '#EF4444';
    }
    // Obra com pouco tempo e baixo progresso
    else if (diasRestantes < 30 && obra.percentual_execucao < 80 && obra.status === 'em_execucao') {
      nivelRisco = 'Alto';
      cor = '#EF4444';
    }
    // Progresso muito abaixo do esperado
    else if (obra.percentual_execucao < 30 && obra.status === 'em_execucao') {
      nivelRisco = 'Médio';
      cor = '#F59E0B';
    }

    return {
      nome: obra.nome,
      nivelRisco,
      cor,
      diasRestantes,
      percentual: obra.percentual_execucao,
      valor: obra.valor_contrato
    };
  });

  const alertasData = riscosData.reduce((acc, obra) => {
    acc[obra.nivelRisco] = (acc[obra.nivelRisco] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const alertasChartData = [
    { name: 'Baixo Risco', value: alertasData['Baixo'] || 0, color: '#10B981' },
    { name: 'Médio Risco', value: alertasData['Médio'] || 0, color: '#F59E0B' },
    { name: 'Alto Risco', value: alertasData['Alto'] || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      
      switch (reportType) {
        case 'executivo':
          await pdfService.generateObrasExecutiveReport(obras);
          break;
        case 'comparativo':
          await pdfService.generateObrasComparativeReport(obras);
          break;
        case 'filtrado':
          await pdfService.generateObrasFilteredReport(obras, {});
          break;
        case 'individual':
          if (obras.length > 0) {
            await pdfService.generateObrasIndividualReport(obras);
          }
          break;
        default:
          throw new Error('Tipo de relatório não reconhecido');
      }
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_execucao': return 'text-blue-600 bg-blue-50';
      case 'concluida': return 'text-green-600 bg-green-50';
      case 'planeada': return 'text-orange-600 bg-orange-50';
      case 'suspensa': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_execucao': return <Activity className="h-4 w-4" />;
      case 'concluida': return <CheckCircle className="h-4 w-4" />;
      case 'planeada': return <Clock className="h-4 w-4" />;
      case 'suspensa': return <AlertCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Tabs */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard de Obras</h2>
              <p className="text-gray-600">Gestão e monitorização de projetos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onAddObra}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Obra</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'analytics', label: 'Análises', icon: BarChart3 },
            { id: 'reports', label: 'Relatórios', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{stats.total}</h3>
                <p className="text-blue-700 font-medium">Total de Obras</p>
                <p className="text-blue-600 text-sm mt-1">Projetos ativos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">{stats.em_execucao}</h3>
                <p className="text-green-700 font-medium">Em Execução</p>
                <p className="text-green-600 text-sm mt-1">Obras ativas</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-2">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(stats.valor_total / 1000000)}M
                </h3>
                <p className="text-purple-700 font-medium">Valor Total</p>
                <p className="text-purple-600 text-sm mt-1">Contratos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">{stats.eficiencia_media.toFixed(1)}%</h3>
                <p className="text-orange-700 font-medium">Eficiência Média</p>
                <p className="text-orange-600 text-sm mt-1">Performance vs cronograma</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">{stats.obras_atrasadas}</h3>
                <p className="text-red-700 font-medium">Obras Atrasadas</p>
                <p className="text-red-600 text-sm mt-1">Requerem atenção</p>
              </motion.div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Gráfico de Análise Financeira */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Valor Contrato vs Executado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valorContratoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      `€${Number(value).toFixed(1)}M`, 
                      name === 'valor' ? 'Valor Contrato' : 'Valor Executado'
                    ]} />
                    <Bar dataKey="valor" fill="#3B82F6" name="Contrato" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="executado" fill="#10B981" name="Executado" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Lista de Obras Recentes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Obras Recentes</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Pesquisar obras..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {obras.slice(0, 5).map((obra) => (
                        <tr key={obra.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{obra.nome}</div>
                              <div className="text-sm text-gray-500">{obra.codigo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{obra.cliente}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(obra.status)}`}>
                              {getStatusIcon(obra.status)}
                              <span className="ml-1">{obra.status.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${obra.percentual_execucao}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{obra.percentual_execucao}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(obra.valor_contrato)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onViewObra(obra)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onEditObra(obra)}
                                className="text-green-600 hover:text-green-900"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onDeleteObra(obra)}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Análises Avançadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Temporal */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Temporal (6 meses)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceTemporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'valorIniciado' || name === 'valorConcluido' ? `€${Number(value).toFixed(1)}M` : value,
                      name === 'iniciadas' ? 'Obras Iniciadas' :
                      name === 'concluidas' ? 'Obras Concluídas' :
                      name === 'valorIniciado' ? 'Valor Iniciado' : 'Valor Concluído'
                    ]} />
                    <Area type="monotone" dataKey="iniciadas" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="concluidas" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Análise de Riscos */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Riscos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={alertasChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {alertasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Cronograma vs Progresso */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronograma vs Progresso Real</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cronogramaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name === 'progressoReal' ? 'Progresso Real' : 'Progresso Esperado'
                    ]} />
                    <Bar dataKey="progressoEsperado" fill="#94A3B8" name="Esperado" />
                    <Bar dataKey="progressoReal" fill="#3B82F6" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Análise por Categoria */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Categoria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoriaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'valorTotal' || name === 'valorExecutado' ? `€${Number(value).toFixed(1)}M` :
                      name === 'percentualMedio' || name === 'roi' ? `${Number(value).toFixed(1)}%` : value,
                      name === 'quantidade' ? 'Quantidade' :
                      name === 'valorTotal' ? 'Valor Total' :
                      name === 'valorExecutado' ? 'Valor Executado' :
                      name === 'percentualMedio' ? 'Progresso Médio' : 'ROI'
                    ]} />
                    <Bar dataKey="valorTotal" fill="#3B82F6" name="Valor Total" />
                    <Bar dataKey="valorExecutado" fill="#10B981" name="Valor Executado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabela de Obras com Alertas */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Obras que Requerem Atenção</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risco</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias Restantes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {riscosData
                      .filter(obra => obra.nivelRisco !== 'Baixo')
                      .slice(0, 5)
                      .map((obra, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {obra.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: obra.cor + '20', 
                                color: obra.cor 
                              }}
                            >
                              {obra.nivelRisco}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {obra.diasRestantes < 0 ? 
                              <span className="text-red-600 font-medium">
                                {Math.abs(obra.diasRestantes)} dias atraso
                              </span> : 
                              `${obra.diasRestantes} dias`
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${obra.percentual}%`,
                                    backgroundColor: obra.percentual < 30 ? '#EF4444' : 
                                                   obra.percentual < 70 ? '#F59E0B' : '#10B981'
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{obra.percentual}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Intl.NumberFormat('pt-PT', { 
                              style: 'currency', 
                              currency: 'EUR', 
                              minimumFractionDigits: 0 
                            }).format(obra.valor)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {loading && (
              <div className="flex items-center justify-center p-8 mb-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Gerando relatório...</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Relatório Executivo</h4>
                <p className="text-blue-700 text-sm mb-4">Visão geral completa das obras com KPIs principais</p>
                <button 
                  onClick={() => handleGenerateReport('executivo')}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Relatório Comparativo</h4>
                <p className="text-green-700 text-sm mb-4">Análise comparativa entre obras e períodos</p>
                <button 
                  onClick={() => handleGenerateReport('comparativo')}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Filter className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-purple-900 mb-2">Relatório Filtrado</h4>
                <p className="text-purple-700 text-sm mb-4">Dados específicos com filtros personalizados</p>
                <button 
                  onClick={() => handleGenerateReport('filtrado')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-orange-900 mb-2">Relatório Individual</h4>
                <p className="text-orange-700 text-sm mb-4">Detalhes específicos de cada obra</p>
                <button 
                  onClick={() => handleGenerateReport('individual')}
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Gerar PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
