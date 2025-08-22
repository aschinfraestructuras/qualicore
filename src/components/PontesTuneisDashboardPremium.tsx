import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Mountain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Shield,
  Activity,
  FileText,
  BarChart3,
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
  Ruler,
  HardHat,
  TestTube,
  Package,
  Award,
  Star,
  Construction,
  Wrench,
  Calendar,
  Users,
  DollarSign,
  Truck,
  Timer,
  Scale,
  Thermometer,
  Wind,
  Droplets
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PontesTuneisDashboardPremiumProps {
  pontesTuneis: any[];
  inspecoes: any[];
  stats: any;
  onSearch: (query: string, options?: any) => void;
  onFilterChange: (filters: any) => void;
  onCreatePonteTunel: () => void;
  onCreateInspecao: () => void;
  onViewDetails: (item: any, type: 'ponte' | 'tunel' | 'inspecao') => void;
  onRefresh: () => void;
}

// Cores para o tema estrutural
const STRUCTURAL_COLORS = {
  primary: '#1E40AF', // Azul estrutural
  secondary: '#059669', // Verde segurança
  warning: '#F59E0B', // Âmbar alerta
  danger: '#DC2626', // Vermelho crítico
  info: '#3B82F6', // Azul informação
  success: '#10B981', // Verde sucesso
  gray: '#6B7280', // Cinza neutro
  concrete: '#71717A', // Cinza betão
  steel: '#475569' // Cinza aço
};

// Tipos e categorias
const TIPOS_ESTRUTURA = {
  ponte: { label: 'Ponte', icon: Building, color: '#1E40AF' },
  tunel: { label: 'Túnel', icon: Mountain, color: '#059669' },
  viaduto: { label: 'Viaduto', icon: GitBranch, color: '#F59E0B' },
  passagem: { label: 'Passagem', icon: ArrowUpRight, color: '#DC2626' }
};

const MATERIAIS_ESTRUTURA = {
  betao: { label: 'Betão Armado', icon: Construction, color: '#71717A' },
  aco: { label: 'Aço', icon: Shield, color: '#475569' },
  misto: { label: 'Misto', icon: Layers, color: '#6B7280' },
  pedra: { label: 'Pedra', icon: Mountain, color: '#92400E' },
  madeira: { label: 'Madeira', icon: Package, color: '#059669' }
};

export default function PontesTuneisDashboardPremium({
  pontesTuneis,
  inspecoes,
  stats,
  onSearch,
  onFilterChange,
  onCreatePonteTunel,
  onCreateInspecao,
  onViewDetails,
  onRefresh
}: PontesTuneisDashboardPremiumProps) {
  // Memoizar callbacks para evitar re-renders desnecessários
  const handleCreatePonteTunel = useCallback(() => {
    onCreatePonteTunel();
  }, [onCreatePonteTunel]);

  const handleCreateInspecao = useCallback(() => {
    onCreateInspecao();
  }, [onCreateInspecao]);
  const [activeTab, setActiveTab] = useState<'overview' | 'structural' | 'safety' | 'maintenance'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);

  // Calcular métricas estruturais avançadas - otimizado
  const metrics = useMemo(() => {
    // Retorno rápido se não há dados
    if (!pontesTuneis?.length && !inspecoes?.length) {
      return {
        estruturas: { total: 0, pontes: 0, tuneis: 0, viadutos: 0, operacionais: 0, manutencao: 0, criticas: 0 },
        seguranca: { integridade: 0, conformidade: 0, alertas: 0, risco: 'baixo' },
        inspecoes: { realizadas: 0, pendentes: 0, vencidas: 0, proximas: 0 },
        estrutural: { carga_media: 0, vida_util_media: 0, estado_medio: 0, deformacao_media: 0 },
        custos: { manutencao_mensal: 0, investimento_anual: 0, economia_preventiva: 0 }
      };
    }

    const now = new Date();
    const periodos = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const diasPeriodo = periodos[selectedPeriod];
    const dataLimite = new Date(now.getTime() - diasPeriodo * 24 * 60 * 60 * 1000);

    // Métricas de estruturas
    const totalEstruturas = pontesTuneis.length;
    const pontes = pontesTuneis.filter(p => p.tipo === 'ponte').length;
    const tuneis = pontesTuneis.filter(p => p.tipo === 'tunel').length;
    const viadutos = pontesTuneis.filter(p => p.tipo === 'viaduto').length;
    const operacionais = pontesTuneis.filter(p => p.status_operacional === 'ativo').length;
    const manutencao = pontesTuneis.filter(p => p.status_operacional === 'manutencao').length;
    const criticas = pontesTuneis.filter(p => p.estado === 'critico').length;

    // Métricas de segurança
    const inspecoesRecentes = inspecoes.filter(i => 
      new Date(i.created_at) >= dataLimite
    );
    
    const conformes = inspecoesRecentes.filter(i => i.resultado === 'conforme').length;
    const conformidade = inspecoesRecentes.length > 0 
      ? (conformes / inspecoesRecentes.length) * 100 
      : 0;

    const alertas = inspecoesRecentes.filter(i => 
      i.resultado === 'nao_conforme' || i.resultado === 'critico'
    ).length;

    const integridade = pontesTuneis.length > 0
      ? (pontesTuneis.filter(p => ['excelente', 'bom'].includes(p.estado)).length / pontesTuneis.length) * 100
      : 0;

    // Calcular risco estrutural
    let nivelRisco = 'baixo';
    if (criticas > 0 || conformidade < 70) nivelRisco = 'critico';
    else if (alertas > 5 || conformidade < 85) nivelRisco = 'alto';
    else if (alertas > 2 || conformidade < 95) nivelRisco = 'medio';

    // Métricas de inspeções
    const hoje = new Date().toISOString().split('T')[0];
    const inspecoesPendentes = pontesTuneis.filter(p => 
      p.proxima_inspecao && p.proxima_inspecao <= hoje
    ).length;
    
    const inspecoesVencidas = pontesTuneis.filter(p => 
      p.proxima_inspecao && p.proxima_inspecao < hoje
    ).length;

    const proximasInspecoes = pontesTuneis.filter(p => {
      if (!p.proxima_inspecao) return false;
      const proximaData = new Date(p.proxima_inspecao);
      const em7Dias = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return proximaData > now && proximaData <= em7Dias;
    }).length;

    // Métricas estruturais
    const cargaMedia = pontesTuneis.length > 0
      ? pontesTuneis.reduce((acc, p) => acc + (p.parametros?.capacidade_carga || 0), 0) / pontesTuneis.length
      : 0;

    const estadoNumerico = {
      'excelente': 5,
      'bom': 4,
      'regular': 3,
      'mau': 2,
      'critico': 1
    };

    const estadoMedio = pontesTuneis.length > 0
      ? pontesTuneis.reduce((acc, p) => acc + (estadoNumerico[p.estado] || 3), 0) / pontesTuneis.length
      : 3;

    // Métricas de custos (simuladas)
    const custoManutencaoMensal = totalEstruturas * 1500 + criticas * 5000;
    const investimentoAnual = totalEstruturas * 25000;
    const economiaPreventiva = alertas * 8000;

    return {
      estruturas: {
        total: totalEstruturas,
        pontes,
        tuneis,
        viadutos,
        operacionais,
        manutencao,
        criticas
      },
      seguranca: {
        integridade: Math.round(integridade),
        conformidade: Math.round(conformidade),
        alertas,
        risco: nivelRisco
      },
      inspecoes: {
        realizadas: inspecoesRecentes.length,
        pendentes: inspecoesPendentes,
        vencidas: inspecoesVencidas,
        proximas: proximasInspecoes
      },
      estrutural: {
        carga_media: Math.round(cargaMedia),
        vida_util_media: 75, // anos (simulado)
        estado_medio: Math.round(estadoMedio * 20), // em percentagem
        deformacao_media: 2.5 // mm (simulado)
      },
      custos: {
        manutencao_mensal: custoManutencaoMensal,
        investimento_anual: investimentoAnual,
        economia_preventiva: economiaPreventiva
      }
    };
  }, [pontesTuneis, inspecoes, selectedPeriod]);

  // Componente para KPI Card
  const KPICard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color, 
    trend, 
    trendValue, 
    onClick,
    className = ""
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className={`text-${color}-600`} />
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-100 text-green-600' 
              : trend === 'down'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : 
             trend === 'down' ? <TrendingDown size={12} /> : 
             <Minus size={12} />}
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total de Estruturas"
                value={metrics.estruturas.total}
                subtitle={`${metrics.estruturas.pontes} pontes, ${metrics.estruturas.tuneis} túneis`}
                icon={Building}
                color="blue"
                trend={metrics.estruturas.total > 0 ? 'up' : 'neutral'}
                trendValue="+2"
              />
              <KPICard
                title="Integridade Estrutural"
                value={`${metrics.seguranca.integridade}%`}
                subtitle="Estado geral das estruturas"
                icon={Shield}
                color={metrics.seguranca.integridade >= 90 ? 'green' : metrics.seguranca.integridade >= 70 ? 'yellow' : 'red'}
                trend={metrics.seguranca.integridade >= 85 ? 'up' : 'down'}
                trendValue={`${metrics.seguranca.integridade >= 85 ? '+' : '-'}${Math.abs(90 - metrics.seguranca.integridade)}`}
              />
              <KPICard
                title="Estruturas Críticas"
                value={metrics.estruturas.criticas}
                subtitle="Requerem atenção imediata"
                icon={AlertTriangle}
                color="red"
                trend={metrics.estruturas.criticas === 0 ? 'neutral' : 'down'}
                trendValue={metrics.estruturas.criticas > 0 ? `-${metrics.estruturas.criticas}` : "0"}
              />
              <KPICard
                title="Conformidade"
                value={`${metrics.seguranca.conformidade}%`}
                subtitle="Inspeções conformes"
                icon={CheckCircle}
                color={metrics.seguranca.conformidade >= 95 ? 'green' : 'yellow'}
                trend={metrics.seguranca.conformidade >= 90 ? 'up' : 'down'}
                trendValue={`${metrics.seguranca.conformidade >= 90 ? '+' : '-'}${Math.abs(95 - metrics.seguranca.conformidade)}`}
              />
            </div>

            {/* Distribuição por Tipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-600" />
                  Distribuição por Tipo
                </h3>
                <div className="space-y-4">
                  {Object.entries(TIPOS_ESTRUTURA).map(([key, tipo]) => {
                    const count = pontesTuneis.filter(p => p.tipo === key).length;
                    const percentage = metrics.estruturas.total > 0 ? (count / metrics.estruturas.total) * 100 : 0;
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <tipo.icon size={16} style={{ color: tipo.color }} />
                          <span className="text-sm font-medium text-gray-700">{tipo.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: tipo.color 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 min-w-[2rem]">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-green-600" />
                  Estado Operacional
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Operacionais</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{metrics.estruturas.operacionais}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wrench size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Em Manutenção</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">{metrics.estruturas.manutencao}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Críticas</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">{metrics.estruturas.criticas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'structural':
        return (
          <div className="space-y-6">
            {/* Métricas Estruturais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Capacidade de Carga Média"
                value={`${metrics.estrutural.carga_media}t`}
                subtitle="Carga máxima suportada"
                icon={Scale}
                color="blue"
              />
              <KPICard
                title="Vida Útil Média"
                value={`${metrics.estrutural.vida_util_media} anos`}
                subtitle="Expectativa de vida"
                icon={Timer}
                color="green"
              />
              <KPICard
                title="Estado Estrutural"
                value={`${metrics.estrutural.estado_medio}%`}
                subtitle="Condição geral"
                icon={Gauge}
                color={metrics.estrutural.estado_medio >= 80 ? 'green' : 'yellow'}
              />
              <KPICard
                title="Deformação Média"
                value={`${metrics.estrutural.deformacao_media}mm`}
                subtitle="Deslocamento medido"
                icon={Ruler}
                color="blue"
              />
            </div>

            {/* Análise por Material */}
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers size={20} className="text-blue-600" />
                Análise por Material
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(MATERIAIS_ESTRUTURA).map(([key, material]) => {
                  const count = pontesTuneis.filter(p => 
                    p.modelo?.toLowerCase().includes(key) || 
                    p.observacoes?.toLowerCase().includes(key)
                  ).length;
                  
                  return (
                    <div key={key} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <material.icon size={16} style={{ color: material.color }} />
                        <span className="text-sm font-medium text-gray-700">{material.label}</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">estruturas</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="space-y-6">
            {/* Indicadores de Segurança */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Nível de Risco"
                value={metrics.seguranca.risco.toUpperCase()}
                subtitle="Avaliação geral"
                icon={Shield}
                color={
                  metrics.seguranca.risco === 'baixo' ? 'green' :
                  metrics.seguranca.risco === 'medio' ? 'yellow' :
                  metrics.seguranca.risco === 'alto' ? 'orange' : 'red'
                }
              />
              <KPICard
                title="Alertas Ativos"
                value={metrics.seguranca.alertas}
                subtitle="Requerem ação"
                icon={Bell}
                color="red"
              />
              <KPICard
                title="Inspeções Vencidas"
                value={metrics.inspecoes.vencidas}
                subtitle="Ultrapassaram prazo"
                icon={Clock}
                color="red"
              />
              <KPICard
                title="Próximas Inspeções"
                value={metrics.inspecoes.proximas}
                subtitle="Próximos 7 dias"
                icon={Calendar}
                color="yellow"
              />
            </div>

            {/* Mapa de Calor de Risco */}
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target size={20} className="text-red-600" />
                Mapa de Risco por Quilómetro
              </h3>
              <div className="space-y-3">
                {pontesTuneis.slice(0, 5).map((estrutura, index) => {
                  const risco = ['baixo', 'medio', 'alto', 'critico'][
                    estrutura.estado === 'critico' ? 3 :
                    estrutura.estado === 'mau' ? 2 :
                    estrutura.estado === 'regular' ? 1 : 0
                  ];
                  
                  const corRisco = {
                    'baixo': 'bg-green-500',
                    'medio': 'bg-yellow-500',
                    'alto': 'bg-orange-500',
                    'critico': 'bg-red-500'
                  };
                  
                  return (
                    <div key={estrutura.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${corRisco[risco]}`} />
                        <div>
                          <div className="font-medium text-gray-900">{estrutura.codigo}</div>
                          <div className="text-sm text-gray-500">
                            KM {estrutura.km_inicial} - {estrutura.km_final}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 capitalize">{risco}</div>
                        <div className="text-xs text-gray-500">{estrutura.tipo}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            {/* Métricas de Manutenção */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Custo Mensal"
                value={`€${(metrics.custos.manutencao_mensal / 1000).toFixed(0)}K`}
                subtitle="Manutenção preventiva"
                icon={DollarSign}
                color="blue"
              />
              <KPICard
                title="Investimento Anual"
                value={`€${(metrics.custos.investimento_anual / 1000).toFixed(0)}K`}
                subtitle="Previsão orçamental"
                icon={TrendingUp}
                color="green"
              />
              <KPICard
                title="Economia Preventiva"
                value={`€${(metrics.custos.economia_preventiva / 1000).toFixed(0)}K`}
                subtitle="Poupança evitando falhas"
                icon={Star}
                color="yellow"
              />
              <KPICard
                title="Estruturas em Manutenção"
                value={metrics.estruturas.manutencao}
                subtitle="Atualmente em intervenção"
                icon={Wrench}
                color="orange"
              />
            </div>

            {/* Cronograma de Manutenção */}
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                Cronograma de Manutenção
              </h3>
              <div className="space-y-3">
                {pontesTuneis
                  .filter(p => p.proxima_inspecao)
                  .sort((a, b) => new Date(a.proxima_inspecao).getTime() - new Date(b.proxima_inspecao).getTime())
                  .slice(0, 6)
                  .map((estrutura) => {
                    const diasRestantes = Math.ceil((new Date(estrutura.proxima_inspecao).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const urgencia = diasRestantes < 0 ? 'vencida' : diasRestantes <= 7 ? 'urgente' : diasRestantes <= 30 ? 'proxima' : 'programada';
                    
                    const cores = {
                      'vencida': 'bg-red-100 text-red-800 border-red-200',
                      'urgente': 'bg-orange-100 text-orange-800 border-orange-200',
                      'proxima': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      'programada': 'bg-green-100 text-green-800 border-green-200'
                    };
                    
                    return (
                      <div key={estrutura.id} className={`p-3 rounded-lg border ${cores[urgencia]}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock size={16} />
                            <div>
                              <div className="font-medium">{estrutura.codigo}</div>
                              <div className="text-sm opacity-75">{estrutura.tipo} - KM {estrutura.km_inicial}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {diasRestantes < 0 ? `${Math.abs(diasRestantes)} dias em atraso` : `${diasRestantes} dias`}
                            </div>
                            <div className="text-sm opacity-75">
                              {new Date(estrutura.proxima_inspecao).toLocaleDateString('pt-PT')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="text-blue-600" size={28} />
            Dashboard Premium - Pontes e Túneis
          </h1>
          <p className="text-gray-600 mt-1">
            Monitorização estrutural avançada e gestão de segurança
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Visão Geral', icon: Eye },
            { key: 'structural', label: 'Análise Estrutural', icon: Construction },
            { key: 'safety', label: 'Segurança', icon: Shield },
            { key: 'maintenance', label: 'Manutenção', icon: Wrench }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCreatePonteTunel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Estrutura
        </button>
        
        <button
          onClick={handleCreateInspecao}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <TestTube size={16} />
          Nova Inspeção
        </button>
        
        <button
          onClick={() => onSearch('', { estado: 'critico' })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <AlertTriangle size={16} />
          Ver Estruturas Críticas
        </button>
        
        <button
          onClick={() => onFilterChange({ proxima_inspecao: 'vencida' })}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Clock size={16} />
          Inspeções Vencidas
        </button>
      </div>
    </div>
  );
}
