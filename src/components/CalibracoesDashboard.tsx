import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Package, 
  Wrench, 
  Eye, 
  FileText, 
  Shield, 
  Target, 
  Zap, 
  Calendar, 
  MapPin, 
  Users, 
  Building, 
  HardHat, 
  TestTube, 
  Ruler, 
  Thermometer,
  Gauge,
  Scale,
  Microscope,
  Calculator,
  Database,
  RefreshCw,
  Download,
  Filter,
  Search,
  Plus,
  Settings as SettingsIcon,
  Bell,
  Star,
  Award,
  Certificate,
  Clipboard,
  CheckSquare,
  XSquare,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao, 
  CalibracoesStats,
  TIPOS_EQUIPAMENTO,
  CATEGORIAS_EQUIPAMENTO,
  ESTADOS_EQUIPAMENTO,
  STATUS_OPERACIONAL
} from '../types/calibracoes';
import CalibracoesCompliance from './CalibracoesCompliance';
import { CalibracoesNotificacoes } from './CalibracoesNotificacoes';
import CalibracoesCalendario from './CalibracoesCalendario';

interface CalibracoesDashboardProps {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  stats: CalibracoesStats | null;
  onRefresh: () => void;
  onAddEquipamento: () => void;
  onViewDetails: (type: string, id: string) => void;
  onBackToList: () => void;
  loading?: boolean;
}

// Cores específicas para obra civil
const CIVIL_COLORS = {
  primary: '#1E40AF', // Azul profissional
  secondary: '#059669', // Verde qualidade
  warning: '#D97706', // Laranja alerta
  danger: '#DC2626', // Vermelho crítico
  success: '#059669', // Verde sucesso
  info: '#0891B2', // Azul informação
  dark: '#1F2937', // Cinza escuro
  light: '#F3F4F6' // Cinza claro
};

// Tipos de equipamentos específicos para obra civil
const EQUIPAMENTOS_CIVIL = {
  ENSAIOS_BETAO: ['Prensa Universal', 'Esclerómetro', 'Peneiro', 'Máquina de Compressão', 'Consistómetro'],
  ENSAIOS_SOLOS: ['Peneiro', 'Cilindro de Proctor', 'Máquina de Cisalhamento', 'Permeâmetro', 'Compactador'],
  ENSAIOS_ACOS: ['Máquina de Tração', 'Durómetro', 'Esclerómetro', 'Máquina de Dobragem'],
  MEDICAO: ['Fita Métrica', 'Nível', 'Teodolito', 'Estação Total', 'GPS'],
  LABORATORIO: ['Balança', 'Estufa', 'Agitador', 'pHmetro', 'Condutivímetro'],
  SEGURANCA: ['Detetor de Gás', 'Medidor de Ruído', 'Medidor de Vibração', 'Detetor de Fumo']
};

export default function CalibracoesDashboard({ 
  equipamentos, 
  calibracoes, 
  manutencoes, 
  inspecoes, 
  stats, 
  onRefresh, 
  onAddEquipamento, 
  onViewDetails, 
  onBackToList,
  loading = false 
}: CalibracoesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'compliance' | 'calendar'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showAlerts, setShowAlerts] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Calcular métricas específicas para obra civil
  const metrics = useMemo(() => {
    if (!equipamentos.length) return null;

    const totalEquipamentos = equipamentos.length;
    const equipamentosAtivos = equipamentos.filter(e => e.estado === 'ativo').length;
    const equipamentosEnsaio = equipamentos.filter(e => e.tipo === 'ensaio').length;
    const equipamentosMedicao = equipamentos.filter(e => e.tipo === 'medicao').length;
    const equipamentosLaboratorio = equipamentos.filter(e => e.tipo === 'laboratorio').length;

    // Calibrações específicas
    const calibracoesVencidas = calibracoes.filter(c => {
      const dataVencimento = new Date(c.data_proxima_calibracao);
      return dataVencimento < new Date();
    }).length;

    const calibracoesProximas = calibracoes.filter(c => {
      const dataVencimento = new Date(c.data_proxima_calibracao);
      const hoje = new Date();
      const diffTime = dataVencimento.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;

    // Valor total dos equipamentos
    const valorTotal = equipamentos.reduce((acc, e) => acc + (e.valor_atual || 0), 0);
    const custoCalibracoes = calibracoes.reduce((acc, c) => acc + (c.custo || 0), 0);
    const custoManutencoes = manutencoes.reduce((acc, m) => acc + (m.custo || 0), 0);

    // Taxa de conformidade (equipamentos calibrados e operacionais)
    const equipamentosConformes = equipamentos.filter(e => 
      e.estado === 'ativo' && 
      calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > new Date()
      )
    ).length;

    const taxaConformidade = totalEquipamentos > 0 ? (equipamentosConformes / totalEquipamentos) * 100 : 0;

    // Distribuição por categoria
    const distribuicaoCategoria = equipamentos.reduce((acc, e) => {
      acc[e.categoria] = (acc[e.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Equipamentos críticos (sem calibração válida)
    const equipamentosCriticos = equipamentos.filter(e => {
      const calibracaoValida = calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > new Date()
      );
      return !calibracaoValida && e.estado === 'ativo';
    }).length;

    return {
      totalEquipamentos,
      equipamentosAtivos,
      equipamentosEnsaio,
      equipamentosMedicao,
      equipamentosLaboratorio,
      calibracoesVencidas,
      calibracoesProximas,
      valorTotal,
      custoCalibracoes,
      custoManutencoes,
      taxaConformidade,
      equipamentosConformes,
      equipamentosCriticos,
      distribuicaoCategoria
    };
  }, [equipamentos, calibracoes, manutencoes]);

  // Gerar alertas inteligentes
  const alertas = useMemo(() => {
    if (!equipamentos.length) return [];

    const alertasArray = [];

    // Calibrações vencidas
    const calibracoesVencidas = calibracoes.filter(c => {
      const dataVencimento = new Date(c.data_proxima_calibracao);
      return dataVencimento < new Date();
    });

    if (calibracoesVencidas.length > 0) {
      alertasArray.push({
        id: 'calibracoes-vencidas',
        tipo: 'CRITICO',
        titulo: `${calibracoesVencidas.length} Calibração(ões) Vencida(s)`,
        descricao: 'Equipamentos com calibração expirada - requer ação imediata',
        equipamentos: calibracoesVencidas.map(c => c.equipamento_id),
        acao: 'Verificar Calibrações',
        cor: CIVIL_COLORS.danger
      });
    }

    // Calibrações próximas de vencer
    const calibracoesProximas = calibracoes.filter(c => {
      const dataVencimento = new Date(c.data_proxima_calibracao);
      const hoje = new Date();
      const diffTime = dataVencimento.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    });

    if (calibracoesProximas.length > 0) {
      alertasArray.push({
        id: 'calibracoes-proximas',
        tipo: 'ALERTA',
        titulo: `${calibracoesProximas.length} Calibração(ões) a Vencer`,
        descricao: 'Agendar calibrações nos próximos 30 dias',
        equipamentos: calibracoesProximas.map(c => c.equipamento_id),
        acao: 'Agendar Calibrações',
        cor: CIVIL_COLORS.warning
      });
    }

    // Equipamentos em manutenção
    const equipamentosManutencao = equipamentos.filter(e => e.estado === 'manutencao');
    if (equipamentosManutencao.length > 0) {
      alertasArray.push({
        id: 'equipamentos-manutencao',
        tipo: 'INFO',
        titulo: `${equipamentosManutencao.length} Equipamento(s) em Manutenção`,
        descricao: 'Acompanhar progresso das manutenções',
        equipamentos: equipamentosManutencao.map(e => e.id),
        acao: 'Ver Manutenções',
        cor: CIVIL_COLORS.info
      });
    }

    // Equipamentos críticos sem calibração
    const equipamentosCriticos = equipamentos.filter(e => {
      const calibracaoValida = calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > new Date()
      );
      return !calibracaoValida && e.estado === 'ativo';
    });

    if (equipamentosCriticos.length > 0) {
      alertasArray.push({
        id: 'equipamentos-criticos',
        tipo: 'CRITICO',
        titulo: `${equipamentosCriticos.length} Equipamento(s) Crítico(s)`,
        descricao: 'Equipamentos ativos sem calibração válida',
        equipamentos: equipamentosCriticos.map(e => e.id),
        acao: 'Calibrar Equipamentos',
        cor: CIVIL_COLORS.danger
      });
    }

    return alertasArray;
  }, [equipamentos, calibracoes]);

  // Toggle card expansion
  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HardHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Controlo de Qualidade</h1>
              <p className="text-xl text-gray-600">Gestão Premium de Equipamentos e Calibrações</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">Obra Civil • Ensaios • Certificações</span>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Sistema Certificado</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToList}
              className="px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Voltar à Lista</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <CalibracoesNotificacoes onViewDetails={onViewDetails} />
            <button
              onClick={onAddEquipamento}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Equipamento</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs de Navegação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'calendar', label: 'Calendário', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* KPIs Principais */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Equipamentos</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.totalEquipamentos}</p>
                      <p className="text-sm text-green-600 mt-1">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {metrics.equipamentosAtivos} Ativos
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Conformidade</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.taxaConformidade.toFixed(1)}%</p>
                      <p className="text-sm text-blue-600 mt-1">
                        <Shield className="w-4 h-4 inline mr-1" />
                        {metrics.equipamentosConformes} Conformes
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Calibrações Vencidas</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.calibracoesVencidas}</p>
                      <p className="text-sm text-red-600 mt-1">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Requer Ação
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {new Intl.NumberFormat('pt-PT', { 
                          style: 'currency', 
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(metrics.valorTotal)}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Património
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Alertas Inteligentes */}
            {alertas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Alertas Inteligentes</h3>
                  <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showAlerts ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {showAlerts && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      {alertas.map((alerta, index) => (
                        <motion.div
                          key={alerta.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer`}
                          style={{ borderLeftColor: alerta.cor }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: alerta.cor }}
                              ></div>
                              <div>
                                <h4 className="font-medium text-gray-900">{alerta.titulo}</h4>
                                <p className="text-sm text-gray-600">{alerta.descricao}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => onViewDetails('alertas', alerta.id)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {alerta.acao} →
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Distribuição por Categoria */}
            {metrics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>
                  <div className="space-y-3">
                    {Object.entries(metrics.distribuicaoCategoria).map(([categoria, quantidade], index) => (
                      <motion.div
                        key={categoria}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="font-medium text-gray-700">{categoria}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{quantidade}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Custos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-700">Calibrações</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat('pt-PT', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        }).format(metrics.custoCalibracoes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wrench className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-700">Manutenções</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('pt-PT', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        }).format(metrics.custoManutencoes)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Analytics Avançados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tendências de Conformidade */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências de Conformidade</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-700">Taxa de Conformidade</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{metrics?.taxaConformidade.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Objetivo</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">95%</span>
                  </div>
                </div>
              </div>

              {/* Análise de Custos */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Custos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Calibrações</span>
                    <span className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat('pt-PT', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(metrics?.custoCalibracoes || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">Manutenções</span>
                    <span className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('pt-PT', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(metrics?.custoManutencoes || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-purple-600">
                      {new Intl.NumberFormat('pt-PT', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format((metrics?.custoCalibracoes || 0) + (metrics?.custoManutencoes || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipamentos em Risco */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos em Risco</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Críticos</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{metrics?.equipamentosCriticos || 0}</p>
                  <p className="text-sm text-red-700">Sem calibração válida</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800">A Vencer</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{metrics?.calibracoesProximas || 0}</p>
                  <p className="text-sm text-orange-700">Próximos 30 dias</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Wrench className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Manutenção</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {equipamentos.filter(e => e.estado === 'manutencao').length}
                  </p>
                  <p className="text-sm text-yellow-700">Em manutenção</p>
                </div>
              </div>
            </div>

            {/* Performance por Categoria */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Categoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <TestTube className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Ensaio</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics?.equipamentosEnsaio || 0}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <Ruler className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Medição</p>
                  <p className="text-2xl font-bold text-green-600">{metrics?.equipamentosMedicao || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <Microscope className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Laboratório</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics?.equipamentosLaboratorio || 0}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Segurança</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {equipamentos.filter(e => e.tipo === 'seguranca').length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

                 {activeTab === 'compliance' && (
           <motion.div
             key="compliance"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="space-y-8"
           >
             <CalibracoesCompliance
               equipamentos={equipamentos}
               calibracoes={calibracoes}
               manutencoes={manutencoes}
               inspecoes={inspecoes}
               onRefresh={onRefresh}
             />
           </motion.div>
         )}

         {activeTab === 'calendar' && (
           <motion.div
             key="calendar"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="space-y-8"
           >
             <CalibracoesCalendario
               equipamentos={equipamentos}
               calibracoes={calibracoes}
               manutencoes={manutencoes}
               inspecoes={inspecoes}
               onViewDetails={onViewDetails}
               onAddEvent={(tipo) => {
                 // Implementar adição de eventos
                 toast.success(`Adicionar ${tipo} - Funcionalidade em desenvolvimento`);
               }}
             />
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
