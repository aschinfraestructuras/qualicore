import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  Printer,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Settings,
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  Users,
  MapPin,
  Building,
  HardHat,
  Package,
  FileCheck,
  Database,
  Layers,
  GitBranch,
  Star,
  Trophy,
  Zap,
  RefreshCw,
  Share2,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
// Removido import não utilizado

interface RelatorioNaoConformidadesPremiumProps {
  naoConformidades: any[];
  onClose: () => void;
}

// Tipos de relatório disponíveis
const TIPOS_RELATORIO = [
  {
    id: 'completo',
    nome: 'Relatório Completo',
    descricao: 'Análise detalhada de todas as não conformidades',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'executivo',
    nome: 'Relatório Executivo',
    descricao: 'Resumo executivo para gestão',
    icon: BarChart3,
    color: 'purple'
  },
  {
    id: 'tendencias',
    nome: 'Análise de Tendências',
    descricao: 'Evolução temporal e padrões',
    icon: TrendingUp,
    color: 'green'
  },
  {
    id: 'custos',
    nome: 'Análise de Custos',
    descricao: 'Impacto financeiro das NCs',
    icon: DollarSign,
    color: 'red'
  },
  {
    id: 'compliance',
    nome: 'Relatório de Compliance',
    descricao: 'Conformidade com normas e regulamentos',
    icon: Shield,
    color: 'orange'
  },
  {
    id: 'performance',
    nome: 'Performance e KPIs',
    descricao: 'Indicadores de performance',
    icon: Target,
    color: 'indigo'
  }
];

// Formatos de exportação
const FORMATOS_EXPORTACAO = [
  { id: 'pdf', nome: 'PDF', icon: FileText, color: 'red' },
  { id: 'excel', nome: 'Excel', icon: BarChart3, color: 'green' },
  { id: 'word', nome: 'Word', icon: FileText, color: 'blue' },
  { id: 'html', nome: 'HTML', icon: ExternalLink, color: 'orange' }
];

export default function RelatorioNaoConformidadesPremium({
  naoConformidades,
  onClose
}: RelatorioNaoConformidadesPremiumProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [formatoExportacao, setFormatoExportacao] = useState('pdf');
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    severidade: 'todas',
    status: 'todos',
    area: 'todas',
    responsavel: 'todos'
  });
  const [showFiltros, setShowFiltros] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Fechar com tecla ESC
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Calcular dados para o relatório
  const dadosRelatorio = useMemo(() => {
    if (!naoConformidades.length) {
      return {
        total: 0,
        pendentes: 0,
        resolvidas: 0,
        criticas: 0,
        tempoMedioResolucao: 0,
        custoTotal: 0,
        taxaResolucao: 0,
        porTipo: {},
        porSeveridade: {},
        porArea: {},
        porResponsavel: {},
        evolucaoTemporal: [],
        topResponsaveis: [],
        areasCriticas: [],
        ncsEmRisco: []
      };
    }

    const hoje = new Date();
    const periodoInicio = new Date();
    
    switch (filtros.periodo) {
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

    let ncsFiltradas = naoConformidades.filter(nc => 
      new Date(nc.data_deteccao) >= periodoInicio
    );

    // Aplicar filtros adicionais
    if (filtros.severidade !== 'todas') {
      ncsFiltradas = ncsFiltradas.filter(nc => nc.severidade === filtros.severidade);
    }

    if (filtros.status !== 'todos') {
      if (filtros.status === 'pendentes') {
        ncsFiltradas = ncsFiltradas.filter(nc => !nc.data_resolucao);
      } else if (filtros.status === 'resolvidas') {
        ncsFiltradas = ncsFiltradas.filter(nc => nc.data_resolucao);
      }
    }

    if (filtros.area !== 'todas') {
      ncsFiltradas = ncsFiltradas.filter(nc => nc.area_afetada === filtros.area);
    }

    if (filtros.responsavel !== 'todos') {
      ncsFiltradas = ncsFiltradas.filter(nc => nc.responsavel_deteccao === filtros.responsavel);
    }

    const total = ncsFiltradas.length;
    const pendentes = ncsFiltradas.filter(nc => !nc.data_resolucao).length;
    const resolvidas = ncsFiltradas.filter(nc => nc.data_resolucao).length;
    const criticas = ncsFiltradas.filter(nc => nc.severidade === 'critica').length;

    // Calcular tempo médio de resolução
    const ncsResolvidas = ncsFiltradas.filter(nc => nc.data_resolucao);
    const tempoMedioResolucao = ncsResolvidas.length > 0 
      ? ncsResolvidas.reduce((acc, nc) => {
          const deteccao = new Date(nc.data_deteccao);
          const resolucao = new Date(nc.data_resolucao);
          return acc + (resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24);
        }, 0 as number) / ncsResolvidas.length
      : 0;

    // Calcular custo total
    const custoTotal = ncsFiltradas.reduce((acc, nc) => 
      acc + (nc.custo_real || 0) + (nc.custo_estimado || 0), 0
    );

    // Taxa de resolução
    const taxaResolucao = total > 0 ? (resolvidas / total) * 100 : 0;

    // Análises por categoria
    const porTipo = ncsFiltradas.reduce((acc, nc) => {
      acc[nc.tipo] = (acc[nc.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porSeveridade = ncsFiltradas.reduce((acc, nc) => {
      acc[nc.severidade] = (acc[nc.severidade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porArea = ncsFiltradas.reduce((acc, nc) => {
      acc[nc.area_afetada] = (acc[nc.area_afetada] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porResponsavel = ncsFiltradas.reduce((acc, nc) => {
      acc[nc.responsavel_deteccao] = (acc[nc.responsavel_deteccao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // NCs em risco
    const ncsEmRisco = ncsFiltradas.filter(nc => {
      if (nc.data_resolucao) return false;
      if (!nc.data_limite_resolucao) return false;
      
      const limite = new Date(nc.data_limite_resolucao);
      const diasAteLimite = (limite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
      
      return diasAteLimite <= 7;
    });

    // Top responsáveis
    const topResponsaveis = Object.entries(porResponsavel)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }));

    // Áreas críticas
    const areasCriticas = Object.entries(porArea)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));

    // Evolução temporal
    const evolucaoTemporal = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesEnd = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
      
      const ncsMes = ncsFiltradas.filter(nc => {
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

    return {
      total,
      pendentes,
      resolvidas,
      criticas,
      tempoMedioResolucao,
      custoTotal,
      taxaResolucao,
      porTipo,
      porSeveridade,
      porArea,
      porResponsavel,
      evolucaoTemporal,
      topResponsaveis,
      areasCriticas,
      ncsEmRisco,
      ncsFiltradas
    };
  }, [naoConformidades, filtros]);

  const gerarRelatorio = async () => {
    setIsGenerating(true);
    
    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nomeArquivo = `relatorio_ncs_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}`;
      
      switch (formatoExportacao) {
        case 'pdf':
          // Aqui seria integrado com o serviço de PDF profissional
          toast.success('Relatório PDF gerado com sucesso!');
          break;
        case 'excel':
          toast.success('Relatório Excel gerado com sucesso!');
          break;
        case 'word':
          toast.success('Relatório Word gerado com sucesso!');
          break;
        case 'html':
          toast.success('Relatório HTML gerado com sucesso!');
          break;
      }
      
      // Simular download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${nomeArquivo}.${formatoExportacao}`;
      link.click();
      
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  const visualizarRelatorio = () => {
    setPreviewData(dadosRelatorio);
  };

  const getTipoRelatorioInfo = (tipo: string) => {
    return TIPOS_RELATORIO.find(t => t.id === tipo) || TIPOS_RELATORIO[0];
  };

  const getFormatoInfo = (formato: string) => {
    return FORMATOS_EXPORTACAO.find(f => f.id === formato) || FORMATOS_EXPORTACAO[0];
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Fechar se clicar no overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios Premium</h2>
              <p className="text-sm text-gray-500">Geração de relatórios avançados de Não Conformidades</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            {/* Tipo de Relatório */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo de Relatório</h3>
              <div className="space-y-2">
                {TIPOS_RELATORIO.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoRelatorio(tipo.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      tipoRelatorio === tipo.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${tipo.color}-100`}>
                        <tipo.icon className={`w-4 h-4 text-${tipo.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tipo.nome}</p>
                        <p className="text-xs text-gray-500">{tipo.descricao}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Formato de Exportação */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Formato de Exportação</h3>
              <div className="grid grid-cols-2 gap-2">
                {FORMATOS_EXPORTACAO.map((formato) => (
                  <button
                    key={formato.id}
                    onClick={() => setFormatoExportacao(formato.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      formatoExportacao === formato.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <formato.icon className={`w-4 h-4 text-${formato.color}-600`} />
                      <span className="text-sm font-medium">{formato.nome}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-6">
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filtros</span>
                </div>
                {showFiltros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showFiltros && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                      <select
                        value={filtros.periodo}
                        onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="1y">Último ano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Severidade</label>
                      <select
                        value={filtros.severidade}
                        onChange={(e) => setFiltros({ ...filtros, severidade: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="todas">Todas</option>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={filtros.status}
                        onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="todos">Todos</option>
                        <option value="pendentes">Pendentes</option>
                        <option value="resolvidas">Resolvidas</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <button
                onClick={visualizarRelatorio}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Visualizar</span>
              </button>

              <button
                onClick={gerarRelatorio}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Gerando...' : 'Gerar Relatório'}</span>
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            {previewData ? (
              <div className="space-y-6">
                {/* Header do Preview */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getTipoRelatorioInfo(tipoRelatorio).nome}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Período: {filtros.periodo === '7d' ? 'Últimos 7 dias' : 
                               filtros.periodo === '30d' ? 'Últimos 30 dias' :
                               filtros.periodo === '90d' ? 'Últimos 90 dias' : 'Último ano'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewData(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Voltar
                  </button>
                </div>

                {/* Resumo Executivo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total NCs</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{previewData.total}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Resolvidas</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-2">{previewData.resolvidas}</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">Tempo Médio</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 mt-2">{previewData.tempoMedioResolucao.toFixed(1)}d</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Custo Total</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900 mt-2">
                      {previewData.custoTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                </div>

                {/* Análises Detalhadas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribuição por Tipo */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Distribuição por Tipo</h4>
                                         <div className="space-y-2">
                       {Object.entries(previewData.porTipo).map(([tipo, count]) => (
                         <div key={tipo} className="flex items-center justify-between">
                           <span className="text-sm text-gray-700">{tipo}</span>
                           <span className="text-sm font-medium text-gray-900">{count as number}</span>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Distribuição por Severidade */}
                   <div className="bg-white border border-gray-200 rounded-lg p-4">
                     <h4 className="text-sm font-semibold text-gray-900 mb-3">Distribuição por Severidade</h4>
                     <div className="space-y-2">
                       {Object.entries(previewData.porSeveridade).map(([severidade, count]) => (
                         <div key={severidade} className="flex items-center justify-between">
                           <span className="text-sm text-gray-700">{severidade}</span>
                           <span className="text-sm font-medium text-gray-900">{count as number}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>

                {/* Lista de NCs */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Lista de Não Conformidades</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {previewData.ncsFiltradas.slice(0, 10).map((nc: any) => (
                      <div key={nc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{nc.codigo}</p>
                          <p className="text-xs text-gray-500">{nc.descricao.substring(0, 50)}...</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{nc.severidade}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(nc.data_deteccao).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getTipoRelatorioInfo(tipoRelatorio).nome}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {getTipoRelatorioInfo(tipoRelatorio).descricao}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{dadosRelatorio.total} NCs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{dadosRelatorio.resolvidas} resolvidas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{dadosRelatorio.custoTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
