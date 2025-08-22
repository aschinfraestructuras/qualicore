import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Ruler,
  HardHat,
  FileText,
  BarChart3,
  Activity,
  Shield,
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
  Building,
  TestTube,
  Package,
  Award,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ViaFerreaDashboardPremiumProps {
  trilhos: any[];
  travessas: any[];
  inspecoes: any[];
  onSearch: (query: string, options?: any) => void;
  onFilterChange: (filters: any) => void;
  onCreateTrilho: () => void;
  onCreateTravessa: () => void;
  onCreateInspecao: () => void;
  onViewDetails: (item: any, type: 'trilho' | 'travessa' | 'inspecao') => void;
  onRefresh: () => void;
}

// Cores para o tema ferroviário
const RAILWAY_COLORS = {
  primary: '#1E40AF', // Azul ferrovia
  secondary: '#059669', // Verde
  warning: '#F59E0B', // Âmbar
  danger: '#DC2626', // Vermelho
  info: '#3B82F6', // Azul claro
  success: '#10B981', // Verde claro
  gray: '#6B7280', // Cinza
  steel: '#475569' // Cinza aço
};

// Tipos de trilhos e travessas
const TIPOS_TRILHO = {
  UIC60: { label: 'UIC 60', icon: Train, color: '#1E40AF' },
  UIC54: { label: 'UIC 54', icon: Train, color: '#059669' },
  S49: { label: 'S49', icon: Train, color: '#F59E0B' },
  devaneio: { label: 'Desvio', icon: GitBranch, color: '#DC2626' },
  outro: { label: 'Outro', icon: Minus, color: '#6B7280' }
};

const TIPOS_TRAVESSA = {
  betao: { label: 'Betão', icon: Building, color: '#475569' },
  madeira: { label: 'Madeira', icon: Package, color: '#92400E' },
  aco: { label: 'Aço', icon: Shield, color: '#374151' },
  sintetica: { label: 'Sintética', icon: TestTube, color: '#7C3AED' },
  outro: { label: 'Outro', icon: Minus, color: '#6B7280' }
};

export default function ViaFerreaDashboardPremium({
  trilhos,
  travessas,
  inspecoes,
  onSearch,
  onFilterChange,
  onCreateTrilho,
  onCreateTravessa,
  onCreateInspecao,
  onViewDetails,
  onRefresh
}: ViaFerreaDashboardPremiumProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'safety' | 'maintenance'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calcular métricas avançadas
  const metrics = useMemo(() => {
    if (!trilhos.length && !travessas.length && !inspecoes.length) {
      return {
        totalKm: 0,
        trilhosAtivos: 0,
        travessasAtivas: 0,
        inspecoesPendentes: 0,
        estadoGeral: 0,
        tensaoMedia: 0,
        desgasteMedio: 0,
        proximasInspecoes: 0,
        pontosCriticos: 0,
        porTipoTrilho: {},
        porTipoTravessa: {},
        porEstado: {},
        evolucaoTemporal: [],
        alertasSeguranca: [],
        manutencoesPendentes: [],
        estatisticasGeometricas: {}
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

    // Calcular KMs totais
    const totalKm = trilhos.reduce((acc, trilho) => {
      return acc + (trilho.km_final - trilho.km_inicial);
    }, 0);

    // Trilhos por estado
    const trilhosAtivos = trilhos.filter(t => t.estado === 'ativo' || t.estado === 'operacional').length;
    const travessasAtivas = travessas.filter(t => t.estado === 'ativo' || t.estado === 'operacional').length;

    // Inspeções pendentes
    const inspecoesPendentes = trilhos.filter(t => {
      const proximaInspecao = new Date(t.proxima_inspecao);
      return proximaInspecao <= hoje;
    }).length + travessas.filter(t => {
      const proximaInspecao = new Date(t.proxima_inspecao);
      return proximaInspecao <= hoje;
    }).length;

    // Estado geral (baseado na média dos estados)
    const estadosNumericos = [...trilhos, ...travessas].map(item => {
      switch (item.estado) {
        case 'excelente': return 100;
        case 'bom': return 80;
        case 'regular': return 60;
        case 'mau': return 40;
        case 'critico': return 20;
        default: return 70;
      }
    });
    const estadoGeral = estadosNumericos.length > 0 
      ? estadosNumericos.reduce((a, b) => a + b, 0) / estadosNumericos.length 
      : 0;

    // Tensão média dos trilhos
    const tensaoMedia = trilhos.length > 0 
      ? trilhos.reduce((acc, trilho) => acc + (trilho.tensao || 0), 0) / trilhos.length 
      : 0;

    // Próximas inspeções (próximas 30 dias)
    const proximaData = new Date();
    proximaData.setDate(hoje.getDate() + 30);
    const proximasInspecoes = [...trilhos, ...travessas].filter(item => {
      const proxInsp = new Date(item.proxima_inspecao);
      return proxInsp >= hoje && proxInsp <= proximaData;
    }).length;

    // Pontos críticos
    const pontosCriticos = [...trilhos, ...travessas].filter(item => 
      item.estado === 'critico' || item.estado === 'mau'
    ).length;

    // Distribuição por tipo
    const porTipoTrilho = trilhos.reduce((acc, trilho) => {
      acc[trilho.tipo] = (acc[trilho.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porTipoTravessa = travessas.reduce((acc, travessa) => {
      acc[travessa.tipo] = (acc[travessa.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Distribuição por estado
    const porEstado = [...trilhos, ...travessas].reduce((acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Alertas de segurança
    const alertasSeguranca = [...trilhos, ...travessas].filter(item => {
      const ultimaInspecao = new Date(item.ultima_inspecao);
      const diasSemInspecao = Math.floor((hoje.getTime() - ultimaInspecao.getTime()) / (1000 * 60 * 60 * 24));
      return diasSemInspecao > 180 || item.estado === 'critico';
    });

    // Manutenções pendentes
    const manutencoesPendentes = [...trilhos, ...travessas].filter(item => {
      return item.estado === 'mau' || item.estado === 'critico';
    });

    return {
      totalKm: Math.round(totalKm * 100) / 100,
      trilhosAtivos,
      travessasAtivas,
      inspecoesPendentes,
      estadoGeral: Math.round(estadoGeral),
      tensaoMedia: Math.round(tensaoMedia * 100) / 100,
      desgasteMedio: Math.round((100 - estadoGeral) * 100) / 100,
      proximasInspecoes,
      pontosCriticos,
      porTipoTrilho,
      porTipoTravessa,
      porEstado,
      evolucaoTemporal: [],
      alertasSeguranca,
      manutencoesPendentes,
      estatisticasGeometricas: {}
    };
  }, [trilhos, travessas, inspecoes, selectedPeriod]);

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Train className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard Via Férrea</h2>
              <p className="text-sm text-gray-500">Gestão inteligente da infraestrutura ferroviária</p>
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
          
          <div className="flex space-x-2">
            <button
              onClick={onCreateTrilho}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Trilho</span>
            </button>
            <button
              onClick={onCreateTravessa}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Travessa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'safety', label: 'Segurança', icon: Shield },
          { id: 'maintenance', label: 'Manutenção', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Quilómetros Totais</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalKm} km</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(5)}
                      <span className="text-sm text-gray-500">+5% este mês</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Ruler className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Estado Geral</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.estadoGeral}%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(-2)}
                      <span className="text-sm text-gray-500">-2% este mês</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getHealthColor(metrics.estadoGeral)}`}>
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Inspeções Pendentes</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.inspecoesPendentes}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(-8)}
                      <span className="text-sm text-gray-500">-8 esta semana</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pontos Críticos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.pontosCriticos}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(0)}
                      <span className="text-sm text-gray-500">Sem alterações</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Resumo por Componentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trilhos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Trilhos</h3>
                  <Train className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Ativo</span>
                    <span className="font-medium">{metrics.trilhosAtivos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tensão Média</span>
                    <span className="font-medium">{metrics.tensaoMedia} MPa</span>
                  </div>
                  {Object.entries(metrics.porTipoTrilho).slice(0, 3).map(([tipo, count]) => (
                    <div key={tipo} className="flex justify-between items-center">
                      <span className="text-gray-600">{TIPOS_TRILHO[tipo as keyof typeof TIPOS_TRILHO]?.label || tipo}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Travessas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Travessas</h3>
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Ativa</span>
                    <span className="font-medium">{metrics.travessasAtivas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Próximas Inspeções</span>
                    <span className="font-medium">{metrics.proximasInspecoes}</span>
                  </div>
                  {Object.entries(metrics.porTipoTravessa).slice(0, 3).map(([tipo, count]) => (
                    <div key={tipo} className="flex justify-between items-center">
                      <span className="text-gray-600">{TIPOS_TRAVESSA[tipo as keyof typeof TIPOS_TRAVESSA]?.label || tipo}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Avançados</h3>
              <p className="text-gray-600">Análise detalhada de desgaste, predição de vida útil e otimização de manutenção em desenvolvimento...</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'safety' && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas de Segurança</h3>
              <div className="space-y-3">
                {metrics.alertasSeguranca.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{item.codigo}</p>
                      <p className="text-sm text-gray-600">{item.estado === 'critico' ? 'Estado crítico' : 'Inspeção vencida'}</p>
                    </div>
                  </div>
                ))}
                {metrics.alertasSeguranca.length === 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-gray-600">Nenhum alerta de segurança ativo</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'maintenance' && (
          <motion.div
            key="maintenance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manutenções Pendentes</h3>
              <div className="space-y-3">
                {metrics.manutencoesPendentes.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900">{item.codigo}</p>
                        <p className="text-sm text-gray-600">Estado: {item.estado}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewDetails(item, item.comprimento ? 'trilho' : 'travessa')}
                      className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                ))}
                {metrics.manutencoesPendentes.length === 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-gray-600">Nenhuma manutenção pendente</p>
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
