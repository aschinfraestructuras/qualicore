import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Target, 
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  BookOpen,
  Award,
  Zap,
  Users,
  Globe,
  Building,
  Settings,
  Lightbulb
} from 'lucide-react';
import { NormasAnalyticsService } from '../lib/normas-analytics';
import { NormasCacheService } from '../lib/normas-cache';
import type { Norma, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';

interface NormasDashboardProps {
  normas: Norma[];
  onNormaClick?: (norma: Norma) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  action?: () => void;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  norma?: Norma;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export default function NormasDashboard({ normas, onNormaClick, onRefresh, loading = false }: NormasDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [showAlerts, setShowAlerts] = useState(true);
  const [dashboardView, setDashboardView] = useState<'overview' | 'analytics' | 'compliance'>('overview');

  // Calcular métricas usando o serviço de analytics
  const metrics = useMemo(() => {
    if (!normas.length) return null;
    return NormasAnalyticsService.calcularKPIs(normas);
  }, [normas]);

  const tendencias = useMemo(() => {
    if (!normas.length) return [];
    return NormasAnalyticsService.calcularTendencias(normas);
  }, [normas]);

  const anomalias = useMemo(() => {
    if (!normas.length) return [];
    return NormasAnalyticsService.detectarAnomalias(normas);
  }, [normas]);

  const recomendacoes = useMemo(() => {
    if (!normas.length || !metrics) return [];
    return NormasAnalyticsService.gerarRecomendacoes(normas, metrics, anomalias);
  }, [normas, metrics, anomalias]);

  // Filtrar normas por período
  const normasFiltradas = useMemo(() => {
    const now = new Date();
    const periodMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = periodMap[selectedPeriod];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return normas.filter(norma => {
      const dataNorma = new Date(norma.dataCriacao);
      return dataNorma >= cutoffDate;
    });
  }, [normas, selectedPeriod]);

  // Gerar alertas inteligentes
  const alertas = useMemo((): AlertItem[] => {
    const alerts: AlertItem[] = [];
    
    // Alertas de normas vencendo
    const normasVencendo = normas.filter(norma => {
      const dataVencimento = new Date(norma.dataVencimento);
      const hoje = new Date();
      const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diasAteVencimento <= 30 && diasAteVencimento > 0;
    });

    normasVencendo.forEach(norma => {
      const dataVencimento = new Date(norma.dataVencimento);
      const hoje = new Date();
      const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      alerts.push({
        id: `vencimento-${norma.id}`,
        type: diasAteVencimento <= 7 ? 'error' : 'warning',
        title: `Norma vencendo em ${diasAteVencimento} dias`,
        message: `${norma.codigo} - ${norma.titulo}`,
        norma,
        priority: diasAteVencimento <= 7 ? 'high' : 'medium',
        timestamp: new Date()
      });
    });

    // Alertas de normas vencidas
    const normasVencidas = normas.filter(norma => {
      const dataVencimento = new Date(norma.dataVencimento);
      const hoje = new Date();
      return dataVencimento < hoje;
    });

    normasVencidas.forEach(norma => {
      alerts.push({
        id: `vencida-${norma.id}`,
        type: 'error',
        title: 'Norma vencida',
        message: `${norma.codigo} - ${norma.titulo}`,
        norma,
        priority: 'high',
        timestamp: new Date()
      });
    });

    // Alertas de conformidade
    const normasNaoConformes = normas.filter(norma => norma.status === 'NaoConforme');
    if (normasNaoConformes.length > 0) {
      alerts.push({
        id: 'conformidade',
        type: 'warning',
        title: `${normasNaoConformes.length} normas não conformes`,
        message: 'Requer atenção imediata',
        priority: 'high',
        timestamp: new Date()
      });
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [normas]);

  // Cards do dashboard
  const dashboardCards: DashboardCard[] = useMemo(() => {
    if (!metrics) return [];

    return [
      {
        id: 'total-normas',
        title: 'Total de Normas',
        value: metrics.totalNormas,
        change: metrics.normasRecentes,
        icon: <FileText className="w-6 h-6" />,
        color: 'bg-blue-500',
        description: `${metrics.normasRecentes} novas este mês`
      },
      {
        id: 'conformidade',
        title: 'Taxa de Conformidade',
        value: `${metrics.taxaConformidade}%`,
        change: metrics.taxaConformidade >= 95 ? 5 : -2,
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'bg-green-500',
        description: 'Normas em conformidade'
      },
      {
        id: 'vencendo',
        title: 'Vencendo em 30 dias',
        value: metrics.normasVencendo,
        icon: <Clock className="w-6 h-6" />,
        color: 'bg-orange-500',
        description: 'Requer renovação'
      },
      {
        id: 'vencidas',
        title: 'Normas Vencidas',
        value: metrics.normasVencidas,
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'bg-red-500',
        description: 'Ação urgente necessária'
      },
      {
        id: 'organismos',
        title: 'Organismos Ativos',
        value: metrics.organismosAtivos,
        icon: <Building className="w-6 h-6" />,
        color: 'bg-purple-500',
        description: 'Organismos normativos'
      },
      {
        id: 'categorias',
        title: 'Categorias Cobertas',
        value: metrics.categoriasCobertas,
        icon: <Target className="w-6 h-6" />,
        color: 'bg-indigo-500',
        description: 'Áreas técnicas'
      }
    ];
  }, [metrics]);

  const handleRefresh = () => {
    NormasCacheService.invalidateAll();
    onRefresh?.();
  };

  const handleNormaClick = (norma: Norma) => {
    onNormaClick?.(norma);
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'info': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Normas</h1>
          <p className="text-gray-600">Gestão avançada de normas técnicas e regulamentares</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navegação do Dashboard */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'compliance', label: 'Conformidade', icon: <Shield className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDashboardView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dashboardView === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {dashboardView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                      {card.change !== undefined && (
                        <div className="flex items-center mt-2">
                          <TrendingUp className={`w-4 h-4 ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={`text-sm ml-1 ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {card.change >= 0 ? '+' : ''}{card.change}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${card.color} text-white`}>
                      {card.icon}
                    </div>
                  </div>
                  {card.description && (
                    <p className="text-xs text-gray-500 mt-3">{card.description}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Alertas e Recomendações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
                  <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showAlerts ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                {showAlerts && (
                  <div className="space-y-3">
                    {alertas.slice(0, 5).map((alerta) => (
                      <motion.div
                        key={alerta.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border ${getAlertColor(alerta.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alerta.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{alerta.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{alerta.message}</p>
                            {alerta.norma && (
                              <button
                                onClick={() => handleNormaClick(alerta.norma!)}
                                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                              >
                                Ver norma →
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {alertas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                        <p>Nenhum alerta ativo</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recomendações */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Recomendações</h3>
                </div>
                
                <div className="space-y-3">
                  {recomendacoes.slice(0, 4).map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="text-sm font-medium text-blue-900">{rec.titulo}</p>
                      <p className="text-xs text-blue-700 mt-1">{rec.descricao}</p>
                      {rec.prioridade && (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                          rec.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                          rec.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.prioridade}
                        </span>
                      )}
                    </motion.div>
                  ))}
                  
                  {recomendacoes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-2 text-green-500" />
                      <p>Sistema otimizado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {normas.filter(n => n.status === 'Ativa').length}
                  </div>
                  <div className="text-sm text-gray-600">Normas Ativas</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {normas.filter(n => n.status === 'Conforme').length}
                  </div>
                  <div className="text-sm text-gray-600">Conformes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {normas.filter(n => n.prioridade === 'Alta').length}
                  </div>
                  <div className="text-sm text-gray-600">Prioridade Alta</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(normas.map(n => n.organismoNormativo)).size}
                  </div>
                  <div className="text-sm text-gray-600">Organismos</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {dashboardView === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Gráficos e Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição por Categoria */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>
                <div className="space-y-3">
                  {Object.entries(
                    normas.reduce((acc, norma) => {
                      acc[norma.categoria] = (acc[norma.categoria] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([categoria, count]) => (
                    <div key={categoria} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{categoria}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / normas.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tendências Temporais */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências</h3>
                <div className="space-y-3">
                  {tendencias.slice(0, 5).map((tendencia, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tendencia.categoria}</p>
                        <p className="text-xs text-gray-600">{tendencia.descricao}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        tendencia.tipo === 'crescimento' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{tendencia.valor}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anomalias Detectadas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomalias Detectadas</h3>
              <div className="space-y-3">
                {anomalias.slice(0, 5).map((anomalia, index) => (
                  <div key={index} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">{anomalia.tipo}</p>
                        <p className="text-xs text-orange-700 mt-1">{anomalia.descricao}</p>
                        {anomalia.norma && (
                          <button
                            onClick={() => handleNormaClick(anomalia.norma!)}
                            className="text-xs text-orange-600 hover:text-orange-800 mt-1"
                          >
                            Ver norma →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {anomalias.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Nenhuma anomalia detectada</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {dashboardView === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Status de Conformidade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Conformidade</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {normas.filter(n => n.status === 'Conforme').length}
                  </div>
                  <div className="text-sm text-green-700">Conformes</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {normas.filter(n => n.status === 'Pendente').length}
                  </div>
                  <div className="text-sm text-orange-700">Pendentes</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {normas.filter(n => n.status === 'NaoConforme').length}
                  </div>
                  <div className="text-sm text-red-700">Não Conformes</div>
                </div>
              </div>
            </div>

            {/* Normas Críticas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Normas Críticas</h3>
              
              <div className="space-y-3">
                {normas
                  .filter(n => n.prioridade === 'Alta' || n.status === 'NaoConforme')
                  .slice(0, 5)
                  .map((norma) => (
                    <div key={norma.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-900">{norma.codigo}</p>
                          <p className="text-xs text-red-700">{norma.titulo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            norma.prioridade === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {norma.prioridade}
                          </span>
                          <button
                            onClick={() => handleNormaClick(norma)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Ver →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Organismos Normativos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organismos Normativos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(
                  normas.reduce((acc, norma) => {
                    acc[norma.organismoNormativo] = (acc[norma.organismoNormativo] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([organismo, count]) => (
                  <div key={organismo} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{organismo}</p>
                        <p className="text-xs text-gray-600">{count} normas</p>
                      </div>
                      <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
