import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  Plus,
  RefreshCw,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  ExternalLink,
  Database,
  Layers,
  GitBranch,
  Users,
  Building,
  HardHat,
  TestTube,
  Package,
  Clipboard,
  Award,
  Star,
  Award as Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NaoConformidadeDashboardPremiumProps {
  naoConformidades: any[];
  onSearch: (query: string, options?: any) => void;
  onFilterChange: (filters: any) => void;
  onCreateNC: () => void;
  onViewDetails: (nc: any) => void;
  onRefresh: () => void;
}

// Cores para o tema de construção civil
const CIVIL_COLORS = {
  primary: '#1E40AF', // Azul construção
  secondary: '#059669', // Verde qualidade
  warning: '#D97706', // Laranja alerta
  danger: '#DC2626', // Vermelho crítico
  success: '#059669', // Verde sucesso
  info: '#0891B2', // Azul informação
  dark: '#374151', // Cinza escuro
  light: '#F3F4F6' // Cinza claro
};

// Tipos de NC específicos para construção civil
const TIPOS_NC_CIVIL = {
  material: { label: 'Material', icon: Package, color: '#DC2626' },
  execucao: { label: 'Execução', icon: HardHat, color: '#D97706' },
  documentacao: { label: 'Documentação', icon: FileText, color: '#0891B2' },
  seguranca: { label: 'Segurança', icon: Shield, color: '#DC2626' },
  ambiente: { label: 'Ambiente', icon: MapPin, color: '#059669' },
  qualidade: { label: 'Qualidade', icon: Award, color: '#1E40AF' },
  prazo: { label: 'Prazo', icon: Clock, color: '#D97706' },
  custo: { label: 'Custo', icon: DollarSign, color: '#DC2626' },
  outro: { label: 'Outro', icon: AlertTriangle, color: '#6B7280' }
};

export default function NaoConformidadeDashboardPremium({
  naoConformidades,
  onSearch,
  onFilterChange,
  onCreateNC,
  onViewDetails,
  onRefresh
}: NaoConformidadeDashboardPremiumProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'trends' | 'alerts'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calcular métricas avançadas
  const metrics = useMemo(() => {
    if (!naoConformidades.length) {
      return {
        total: 0,
        pendentes: 0,
        resolvidas: 0,
        criticas: 0,
        tempoMedioResolucao: 0,
        custoTotal: 0,
        taxaResolucao: 0,
        tendencia: 0,
        porTipo: {},
        porSeveridade: {},
        porArea: {},
        evolucaoTemporal: [],
        ncsEmRisco: [],
        topResponsaveis: [],
        areasCriticas: []
      };
    }

    const hoje = new Date();
    const periodoInicio = new Date();
    
    switch (selectedPeriod) {
      case '7d':
        periodoInicio.setDate(hoje.getDate() - 7);
        break;
      case '30d':
        periodoInicio.setDate(hoje.getDate() - 30);
        break;
      case '90d':
        periodoInicio.setDate(hoje.getDate() - 90);
        break;
      case '1y':
        periodoInicio.setFullYear(hoje.getFullYear() - 1);
        break;
    }

    const ncsPeriodo = naoConformidades.filter(nc => 
      new Date(nc.data_deteccao) >= periodoInicio
    );

    const total = ncsPeriodo.length;
    const pendentes = ncsPeriodo.filter(nc => !nc.data_resolucao).length;
    const resolvidas = ncsPeriodo.filter(nc => nc.data_resolucao).length;
    const criticas = ncsPeriodo.filter(nc => nc.severidade === 'critica').length;

    // Calcular tempo médio de resolução
    const ncsResolvidas = ncsPeriodo.filter(nc => nc.data_resolucao);
    const tempoMedioResolucao = ncsResolvidas.length > 0 
      ? ncsResolvidas.reduce((acc, nc) => {
          const deteccao = new Date(nc.data_deteccao);
          const resolucao = new Date(nc.data_resolucao);
          return acc + (resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / ncsResolvidas.length
      : 0;

    // Calcular custo total
    const custoTotal = ncsPeriodo.reduce((acc, nc) => 
      acc + (nc.custo_real || 0) + (nc.custo_estimado || 0), 0
    );

    // Taxa de resolução
    const taxaResolucao = total > 0 ? (resolvidas / total) * 100 : 0;

    // Análise por tipo
    const porTipo = ncsPeriodo.reduce((acc, nc) => {
      acc[nc.tipo] = (acc[nc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por severidade
    const porSeveridade = ncsPeriodo.reduce((acc, nc) => {
      acc[nc.severidade] = (acc[nc.severidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por área
    const porArea = ncsPeriodo.reduce((acc, nc) => {
      acc[nc.area_afetada] = (acc[nc.area_afetada] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // NCs em risco (prazos vencidos ou próximos)
    const ncsEmRisco = ncsPeriodo.filter(nc => {
      if (nc.data_resolucao) return false;
      if (!nc.data_limite_resolucao) return false;
      
      const limite = new Date(nc.data_limite_resolucao);
      const diasAteLimite = (limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
      
      return diasAteLimite <= 7; // 7 dias ou menos
    });

    // Top responsáveis
    const responsaveis = ncsPeriodo.reduce((acc, nc) => {
      acc[nc.responsavel_deteccao] = (acc[nc.responsavel_deteccao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topResponsaveis = Object.entries(responsaveis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }));

    // Áreas críticas (mais NCs)
    const areasCriticas = Object.entries(porArea)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));

    // Evolução temporal (últimos 12 meses)
    const evolucaoTemporal = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesEnd = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
      
      const ncsMes = ncsPeriodo.filter(nc => {
        const dataNC = new Date(nc.data_deteccao);
        return dataNC >= mes && dataNC <= mesEnd;
      });

      return {
        mes: mes.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
        total: ncsMes.length,
        resolvidas: ncsMes.filter(nc => nc.data_resolucao).length,
        criticas: ncsMes.filter(nc => nc.severidade === 'critica').length
      };
    }).reverse();

    // Calcular tendência (comparação com período anterior)
    const periodoAnterior = new Date(periodoInicio);
    const duracaoPeriodo = hoje.getTime() - periodoInicio.getTime();
    periodoAnterior.setTime(periodoAnterior.getTime() - duracaoPeriodo);

    const ncsPeriodoAnterior = naoConformidades.filter(nc => {
      const dataNC = new Date(nc.data_deteccao);
      return dataNC >= periodoAnterior && dataNC < periodoInicio;
    }).length;

    const tendencia = ncsPeriodoAnterior > 0 
      ? ((total - ncsPeriodoAnterior) / ncsPeriodoAnterior) * 100 
      : 0;

    return {
      total,
      pendentes,
      resolvidas,
      criticas,
      tempoMedioResolucao,
      custoTotal,
      taxaResolucao,
      tendencia,
      porTipo,
      porSeveridade,
      porArea,
      evolucaoTemporal,
      ncsEmRisco,
      topResponsaveis,
      areasCriticas
    };
  }, [naoConformidades, selectedPeriod]);

  const getTendenciaIcon = (tendencia: number) => {
    if (tendencia > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (tendencia < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTendenciaColor = (tendencia: number) => {
    if (tendencia > 0) return 'text-red-600';
    if (tendencia < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard de Não Conformidades</h2>
              <p className="text-sm text-gray-500">Gestão inteligente de qualidade em obra civil</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <button
            onClick={onRefresh}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={onCreateNC}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova NC</span>
          </button>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: Activity },
          { id: 'trends', label: 'Tendências', icon: TrendingUp },
          { id: 'alerts', label: 'Alertas', icon: Bell }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de NCs</p>
                    <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {getTendenciaIcon(metrics.tendencia)}
                      <span className={`text-sm font-medium ${getTendenciaColor(metrics.tendencia)}`}>
                        {Math.abs(metrics.tendencia).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500">vs período anterior</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Resolução</p>
                    <p className="text-3xl font-bold text-green-600">{metrics.taxaResolucao.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {metrics.resolvidas} de {metrics.total} resolvidas
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                    <p className="text-3xl font-bold text-orange-600">{metrics.tempoMedioResolucao.toFixed(1)}d</p>
                    <p className="text-sm text-gray-500 mt-2">Dias para resolução</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Custo Total</p>
                    <p className="text-3xl font-bold text-red-600">
                      {metrics.custoTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Custos das NCs</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Gráficos e Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição por Tipo */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Tipo</h3>
                <div className="space-y-3">
                  {Object.entries(metrics.porTipo).map(([tipo, count]) => {
                    const tipoInfo = TIPOS_NC_CIVIL[tipo as keyof typeof TIPOS_NC_CIVIL];
                    const percentual = (count / metrics.total) * 100;
                    
                    return (
                      <div key={tipo} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${tipoInfo?.color}20` }}
                          >
                            {tipoInfo?.icon && <tipoInfo.icon className="h-4 w-4" style={{ color: tipoInfo.color }} />}
                          </div>
                          <span className="font-medium text-gray-700">{tipoInfo?.label || tipo}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${percentual}%`, 
                                backgroundColor: tipoInfo?.color 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NCs em Risco */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">NCs em Risco</h3>
                {metrics.ncsEmRisco.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.ncsEmRisco.slice(0, 5).map((nc) => {
                      const limite = new Date(nc.data_limite_resolucao);
                      const hoje = new Date();
                      const diasAteLimite = Math.ceil((limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div 
                          key={nc.id}
                          className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                          onClick={() => onViewDetails(nc)}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="font-medium text-gray-900">{nc.codigo}</p>
                              <p className="text-sm text-gray-600">{nc.descricao.substring(0, 50)}...</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-red-600">
                              {diasAteLimite <= 0 ? 'Vencida' : `${diasAteLimite}d`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {limite.toLocaleDateString('pt-PT')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma NC em risco</p>
                  </div>
                )}
              </div>
            </div>
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
            {/* Analytics Avançados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Responsáveis */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Responsáveis</h3>
                <div className="space-y-3">
                  {metrics.topResponsaveis.map((responsavel, index) => (
                    <div key={responsavel.nome} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{responsavel.nome}</p>
                          <p className="text-sm text-gray-500">{responsavel.count} NCs</p>
                        </div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${(responsavel.count / Math.max(...metrics.topResponsaveis.map(r => r.count))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Áreas Críticas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas Críticas</h3>
                <div className="space-y-3">
                  {metrics.areasCriticas.map((area, index) => (
                    <div key={area.area} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-red-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{area.area}</p>
                          <p className="text-sm text-gray-500">{area.count} NCs</p>
                        </div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-red-600 rounded-full"
                          style={{ width: `${(area.count / Math.max(...metrics.areasCriticas.map(a => a.count))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Análise de Severidade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Severidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { key: 'baixa', label: 'Baixa', color: 'green', icon: CheckCircle },
                  { key: 'media', label: 'Média', color: 'yellow', icon: Clock },
                  { key: 'alta', label: 'Alta', color: 'orange', icon: AlertTriangle },
                  { key: 'critica', label: 'Crítica', color: 'red', icon: Shield }
                ].map((severidade) => {
                  const count = metrics.porSeveridade[severidade.key] || 0;
                  const percentual = metrics.total > 0 ? (count / metrics.total) * 100 : 0;
                  
                  return (
                    <div key={severidade.key} className="text-center p-4 rounded-lg bg-gray-50">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center bg-${severidade.color}-100`}>
                        <severidade.icon className={`h-6 w-6 text-${severidade.color}-600`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600">{severidade.label}</p>
                      <p className="text-xs text-gray-500">{percentual.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Evolução Temporal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Temporal</h3>
              <div className="space-y-4">
                {metrics.evolucaoTemporal.map((mes, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{mes.mes}</span>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-gray-900">{mes.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Resolvidas</p>
                        <p className="text-lg font-bold text-green-600">{mes.resolvidas}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Críticas</p>
                        <p className="text-lg font-bold text-red-600">{mes.criticas}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sistema de Alertas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Notificações</h3>
              
              <div className="space-y-4">
                {/* Alertas Críticos */}
                {metrics.criticas > 0 && (
                  <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">{metrics.criticas} NCs Críticas</p>
                      <p className="text-sm text-red-700">Requerem atenção imediata</p>
                    </div>
                  </div>
                )}

                {/* Alertas de Prazo */}
                {metrics.ncsEmRisco.length > 0 && (
                  <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">{metrics.ncsEmRisco.length} NCs em Risco</p>
                      <p className="text-sm text-orange-700">Prazos vencidos ou próximos</p>
                    </div>
                  </div>
                )}

                {/* Alertas de Tendência */}
                {metrics.tendencia > 10 && (
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Tendência de Aumento</p>
                      <p className="text-sm text-yellow-700">
                        {metrics.tendencia.toFixed(1)}% mais NCs que no período anterior
                      </p>
                    </div>
                  </div>
                )}

                {/* Alertas de Performance */}
                {metrics.taxaResolucao < 70 && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Taxa de Resolução Baixa</p>
                      <p className="text-sm text-blue-700">
                        Apenas {metrics.taxaResolucao.toFixed(1)}% das NCs foram resolvidas
                      </p>
                    </div>
                  </div>
                )}

                {/* Sem Alertas */}
                {metrics.criticas === 0 && metrics.ncsEmRisco.length === 0 && metrics.tendencia <= 10 && metrics.taxaResolucao >= 70 && (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Tudo em Ordem</p>
                      <p className="text-sm text-green-700">Nenhum alerta crítico identificado</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
