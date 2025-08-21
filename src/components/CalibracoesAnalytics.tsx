import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
  Award,
  Trophy,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao 
} from '../types/calibracoes';

interface CalibracoesAnalyticsProps {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  onRefresh: () => void;
}

// Cores para gráficos
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316',
  teal: '#14B8A6',
  pink: '#EC4899'
};

export default function CalibracoesAnalytics({ 
  equipamentos, 
  calibracoes, 
  manutencoes, 
  inspecoes, 
  onRefresh 
}: CalibracoesAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('conformidade');

  // Calcular métricas avançadas
  const analytics = useMemo(() => {
    if (!equipamentos.length) return null;

    const hoje = new Date();
    const periodStart = new Date();
    
    switch (selectedPeriod) {
      case '7d':
        periodStart.setDate(hoje.getDate() - 7);
        break;
      case '30d':
        periodStart.setDate(hoje.getDate() - 30);
        break;
      case '90d':
        periodStart.setDate(hoje.getDate() - 90);
        break;
      case '1y':
        periodStart.setFullYear(hoje.getFullYear() - 1);
        break;
    }

    // Filtrar dados do período
    const calibracoesPeriodo = calibracoes.filter(c => 
      new Date(c.data_calibracao) >= periodStart
    );
    const manutencoesPeriodo = manutencoes.filter(m => 
      new Date(m.data_manutencao) >= periodStart
    );
    const inspecoesPeriodo = inspecoes.filter(i => 
      new Date(i.data_inspecao) >= periodStart
    );

    // Tendências de conformidade
    const conformidadeMensal = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesEnd = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
      
      const equipamentosMes = equipamentos.filter(e => 
        new Date(e.data_aquisicao) <= mesEnd
      );
      
      const calibracoesValidas = equipamentosMes.filter(e => 
        calibracoes.some(c => 
          c.equipamento_id === e.id && 
          new Date(c.data_proxima_calibracao) > hoje
        )
      );
      
      return {
        mes: mes.toLocaleDateString('pt-PT', { month: 'short' }),
        conformidade: equipamentosMes.length > 0 ? 
          (calibracoesValidas.length / equipamentosMes.length) * 100 : 0
      };
    }).reverse();

    // Análise de custos
    const custosCalibracoes = calibracoesPeriodo.reduce((acc, c) => acc + (c.custo || 0), 0);
    const custosManutencoes = manutencoesPeriodo.reduce((acc, m) => acc + (m.custo || 0), 0);
    const custosInspecoes = inspecoesPeriodo.reduce((acc, i) => acc + (i.custo || 0), 0);
    const custoTotal = custosCalibracoes + custosManutencoes + custosInspecoes;

    // Performance por categoria
    const performanceCategoria = equipamentos.reduce((acc, e) => {
      if (!acc[e.categoria]) {
        acc[e.categoria] = {
          total: 0,
          ativos: 0,
          calibrados: 0,
          valor: 0
        };
      }
      
      acc[e.categoria].total++;
      acc[e.categoria].valor += e.valor_atual || 0;
      
      if (e.estado === 'ativo') {
        acc[e.categoria].ativos++;
      }
      
      if (calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > hoje
      )) {
        acc[e.categoria].calibrados++;
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Análise preditiva de falhas
    const equipamentosRisco = equipamentos.filter(e => {
      const ultimaCalibracao = calibracoes
        .filter(c => c.equipamento_id === e.id)
        .sort((a, b) => new Date(b.data_calibracao).getTime() - new Date(a.data_calibracao).getTime())[0];
      
      if (!ultimaCalibracao) return true;
      
      const diasDesdeCalibracao = Math.floor(
        (hoje.getTime() - new Date(ultimaCalibracao.data_calibracao).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return diasDesdeCalibracao > 365; // Mais de 1 ano sem calibração
    });

    // ROI por equipamento
    const roiEquipamentos = equipamentos.map(e => {
      const custosEquipamento = calibracoes
        .filter(c => c.equipamento_id === e.id)
        .reduce((acc, c) => acc + (c.custo || 0), 0);
      
      const manutencoesEquipamento = manutencoes
        .filter(m => m.equipamento_id === e.id)
        .reduce((acc, m) => acc + (m.custo || 0), 0);
      
      const custoTotalEquipamento = custosEquipamento + manutencoesEquipamento;
      const valorAtual = e.valor_atual || 0;
      const roi = valorAtual > 0 ? ((valorAtual - custoTotalEquipamento) / custoTotalEquipamento) * 100 : 0;
      
      return {
        equipamento: e.nome,
        roi: roi,
        custoTotal: custoTotalEquipamento,
        valorAtual: valorAtual
      };
    }).sort((a, b) => b.roi - a.roi);

    return {
      conformidadeMensal,
      custosCalibracoes,
      custosManutencoes,
      custosInspecoes,
      custoTotal,
      performanceCategoria,
      equipamentosRisco,
      roiEquipamentos,
      totalEquipamentos: equipamentos.length,
      equipamentosAtivos: equipamentos.filter(e => e.estado === 'ativo').length,
      calibracoesPeriodo: calibracoesPeriodo.length,
      manutencoesPeriodo: manutencoesPeriodo.length
    };
  }, [equipamentos, calibracoes, manutencoes, inspecoes, selectedPeriod]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com Controles */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Avançados</h2>
            <p className="text-gray-600">Análise detalhada e preditiva do sistema de calibrações</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            <button
              onClick={onRefresh}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Equipamentos</p>
                <p className="text-3xl font-bold">{analytics.totalEquipamentos}</p>
                <p className="text-blue-100 text-sm mt-1">
                  {analytics.equipamentosAtivos} ativos
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Calibrações ({selectedPeriod})</p>
                <p className="text-3xl font-bold">{analytics.calibracoesPeriodo}</p>
                <p className="text-green-100 text-sm mt-1">
                  {analytics.manutencoesPeriodo} manutenções
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Custos ({selectedPeriod})</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat('pt-PT', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(analytics.custoTotal)}
                </p>
                <p className="text-orange-100 text-sm mt-1">
                  Calibrações + Manutenções
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Equipamentos em Risco</p>
                <p className="text-3xl font-bold">{analytics.equipamentosRisco.length}</p>
                <p className="text-red-100 text-sm mt-1">
                  Requer atenção
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gráfico de Tendência de Conformidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Tendência de Conformidade</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Taxa de Conformidade (%)</span>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.conformidadeMensal.map((item, index) => (
            <motion.div
              key={item.mes}
              initial={{ height: 0 }}
              animate={{ height: `${item.conformidade}%` }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
              style={{ minHeight: '20px' }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.conformidade.toFixed(1)}%
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                {item.mes}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance por Categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance por Categoria</h3>
          <div className="space-y-4">
            {Object.entries(analytics.performanceCategoria).map(([categoria, data], index) => (
              <motion.div
                key={categoria}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{categoria}</h4>
                  <p className="text-sm text-gray-600">
                    {data.ativos} ativos de {data.total} total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {data.total > 0 ? Math.round((data.calibrados / data.total) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">Conformidade</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Análise de Custos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Análise de Custos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Calibrações</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat('pt-PT', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(analytics.custosCalibracoes)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Manutenções</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('pt-PT', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(analytics.custosManutencoes)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Inspeções</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {new Intl.NumberFormat('pt-PT', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(analytics.custosInspecoes)}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-PT', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(analytics.custoTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Equipamentos em Risco */}
      {analytics.equipamentosRisco.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Equipamentos em Risco</h3>
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Requer Atenção Imediata</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.equipamentosRisco.slice(0, 6).map((equipamento, index) => (
              <motion.div
                key={equipamento.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{equipamento.nome}</h4>
                    <p className="text-sm text-gray-600">{equipamento.codigo}</p>
                    <p className="text-xs text-red-600 mt-1">Sem calibração recente</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top ROI Equipamentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Top ROI - Equipamentos</h3>
          <div className="flex items-center space-x-2 text-green-600">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">Melhor Retorno</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {analytics.roiEquipamentos.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {index === 0 ? <Trophy className="h-4 w-4" /> :
                   index === 1 ? <Award className="h-4 w-4" /> :
                   index === 2 ? <Star className="h-4 w-4" /> :
                   <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.equipamento}</h4>
                  <p className="text-sm text-gray-600">
                    Custo: {new Intl.NumberFormat('pt-PT', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(item.custoTotal)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  item.roi > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.roi > 0 ? '+' : ''}{item.roi.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">ROI</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
