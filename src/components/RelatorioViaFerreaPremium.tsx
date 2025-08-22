import React, { useState, useMemo, useEffect } from 'react';
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
  Train,
  CheckCircle,
  Clock,
  AlertTriangle,
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

interface RelatorioViaFerreaPremiumProps {
  trilhos: any[];
  travessas: any[];
  inspecoes: any[];
  onClose: () => void;
}

// Tipos de relatório disponíveis
const TIPOS_RELATORIO = [
  {
    id: 'estado_via',
    nome: 'Estado da Via',
    descricao: 'Relatório completo do estado atual da via férrea',
    icon: Train,
    color: 'blue'
  },
  {
    id: 'manutencao',
    nome: 'Manutenção',
    descricao: 'Cronograma e custos de manutenção',
    icon: Settings,
    color: 'green'
  },
  {
    id: 'seguranca',
    nome: 'Segurança',
    descricao: 'Pontos críticos e recomendações de segurança',
    icon: Shield,
    color: 'red'
  },
  {
    id: 'executivo',
    nome: 'Executivo',
    descricao: 'Resumo executivo para gestão',
    icon: BarChart3,
    color: 'purple'
  },
  {
    id: 'inspecoes',
    nome: 'Inspeções',
    descricao: 'Relatório detalhado de inspeções realizadas',
    icon: Eye,
    color: 'orange'
  },
  {
    id: 'performance',
    nome: 'Performance',
    descricao: 'Análise de performance e KPIs',
    icon: TrendingUp,
    color: 'teal'
  }
];

// Formatos de exportação
const FORMATOS_EXPORTACAO = [
  { id: 'pdf', nome: 'PDF', icon: FileText, color: 'red' },
  { id: 'excel', nome: 'Excel', icon: Database, color: 'green' },
  { id: 'word', nome: 'Word', icon: FileCheck, color: 'blue' },
  { id: 'html', nome: 'HTML', icon: ExternalLink, color: 'orange' }
];

export default function RelatorioViaFerreaPremium({
  trilhos,
  travessas,
  inspecoes,
  onClose
}: RelatorioViaFerreaPremiumProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState('estado_via');
  const [formatoExportacao, setFormatoExportacao] = useState('pdf');
  const [filtros, setFiltros] = useState({
    periodo: '30d',
    estado: 'todos',
    tipo: 'todos',
    quilometro_inicio: '',
    quilometro_fim: '',
    incluir_fotos: true,
    incluir_graficos: true,
    incluir_recomendacoes: true
  });
  const [showFiltros, setShowFiltros] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Fechar com tecla ESC
  useEffect(() => {
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

    // Filtrar dados baseado nos filtros
    let trilhosFiltrados = trilhos;
    let travessasFiltradas = travessas;
    let inspecoesFiltradas = inspecoes;

    // Filtro por estado
    if (filtros.estado !== 'todos') {
      trilhosFiltrados = trilhosFiltrados.filter(t => t.estado === filtros.estado);
      travessasFiltradas = travessasFiltradas.filter(t => t.estado === filtros.estado);
    }

    // Filtro por tipo
    if (filtros.tipo !== 'todos') {
      trilhosFiltrados = trilhosFiltrados.filter(t => t.tipo === filtros.tipo);
      travessasFiltradas = travessasFiltradas.filter(t => t.tipo === filtros.tipo);
    }

    // Filtro por quilometragem
    if (filtros.quilometro_inicio) {
      const kmInicio = parseFloat(filtros.quilometro_inicio);
      trilhosFiltrados = trilhosFiltrados.filter(t => t.km_inicial >= kmInicio);
      travessasFiltradas = travessasFiltradas.filter(t => t.km_inicial >= kmInicio);
    }

    if (filtros.quilometro_fim) {
      const kmFim = parseFloat(filtros.quilometro_fim);
      trilhosFiltrados = trilhosFiltrados.filter(t => t.km_final <= kmFim);
      travessasFiltradas = travessasFiltradas.filter(t => t.km_final <= kmFim);
    }

    // Calcular métricas
    const totalElementos = trilhosFiltrados.length + travessasFiltradas.length;
    const elementosExcelentes = [...trilhosFiltrados, ...travessasFiltradas].filter(e => e.estado === 'excelente').length;
    const elementosBons = [...trilhosFiltrados, ...travessasFiltradas].filter(e => e.estado === 'bom').length;
    const elementosRegulares = [...trilhosFiltrados, ...travessasFiltradas].filter(e => e.estado === 'regular').length;
    const elementosMaus = [...trilhosFiltrados, ...travessasFiltradas].filter(e => e.estado === 'mau').length;
    const elementosCriticos = [...trilhosFiltrados, ...travessasFiltradas].filter(e => e.estado === 'critico').length;

    const quilometragemTotal = trilhosFiltrados.reduce((acc, trilho) => {
      return acc + (trilho.km_final - trilho.km_inicial);
    }, 0);

    const tensaoMedia = trilhosFiltrados.length > 0 
      ? trilhosFiltrados.reduce((acc, trilho) => acc + (trilho.tensao || 0), 0) / trilhosFiltrados.length 
      : 0;

    // Inspeções no período
    const inspecoesPeriodo = inspecoesFiltradas.filter(insp => {
      const dataInspecao = new Date(insp.data_inspecao);
      return dataInspecao >= periodoInicio && dataInspecao <= hoje;
    });

    // Inspeções pendentes
    const inspecoesPendentes = [...trilhosFiltrados, ...travessasFiltradas].filter(item => {
      const proximaInspecao = new Date(item.proxima_inspecao);
      return proximaInspecao <= hoje;
    }).length;

    // Pontos críticos
    const pontosCriticos = [...trilhosFiltrados, ...travessasFiltradas].filter(item => 
      item.estado === 'critico' || item.estado === 'mau'
    );

    // Distribuição por tipo de trilho
    const distribuicaoTrilhos = trilhosFiltrados.reduce((acc, trilho) => {
      acc[trilho.tipo] = (acc[trilho.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Distribuição por tipo de travessa
    const distribuicaoTravessas = travessasFiltradas.reduce((acc, travessa) => {
      acc[travessa.tipo] = (acc[travessa.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      trilhos: trilhosFiltrados,
      travessas: travessasFiltradas,
      inspecoes: inspecoesFiltradas,
      metricas: {
        totalElementos,
        elementosExcelentes,
        elementosBons,
        elementosRegulares,
        elementosMaus,
        elementosCriticos,
        quilometragemTotal: Math.round(quilometragemTotal * 100) / 100,
        tensaoMedia: Math.round(tensaoMedia * 100) / 100,
        inspecoesPeriodo: inspecoesPeriodo.length,
        inspecoesPendentes,
        pontosCriticos: pontosCriticos.length
      },
      distribuicoes: {
        trilhos: distribuicaoTrilhos,
        travessas: distribuicaoTravessas
      },
      pontosCriticos,
      periodo: {
        inicio: periodoInicio.toLocaleDateString('pt-PT'),
        fim: hoje.toLocaleDateString('pt-PT')
      }
    };
  }, [trilhos, travessas, inspecoes, filtros]);

  const gerarRelatorio = async () => {
    setIsGenerating(true);
    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tipoSelecionado = TIPOS_RELATORIO.find(t => t.id === tipoRelatorio);
      const formatoSelecionado = FORMATOS_EXPORTACAO.find(f => f.id === formatoExportacao);
      
      toast.success(`Relatório "${tipoSelecionado?.nome}" gerado em ${formatoSelecionado?.nome} com sucesso!`);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  const visualizarRelatorio = () => {
    setPreviewData(dadosRelatorio);
    toast.success('Pré-visualização carregada');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios Premium Via Férrea</h2>
              <p className="text-sm text-gray-500">Relatórios avançados com análises detalhadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar - Configurações */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            {/* Tipo de Relatório */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tipo de Relatório</h3>
              <div className="space-y-2">
                {TIPOS_RELATORIO.map(tipo => (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoRelatorio(tipo.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      tipoRelatorio === tipo.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tipo.icon className={`h-5 w-5 ${tipoRelatorio === tipo.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-medium">{tipo.nome}</div>
                        <div className="text-sm text-gray-500">{tipo.descricao}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Formato de Exportação */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Formato</h3>
              <div className="grid grid-cols-2 gap-2">
                {FORMATOS_EXPORTACAO.map(formato => (
                  <button
                    key={formato.id}
                    onClick={() => setFormatoExportacao(formato.id)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      formatoExportacao === formato.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <formato.icon className={`h-5 w-5 mx-auto mb-1 ${formatoExportacao === formato.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="text-sm font-medium">{formato.nome}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros Avançados */}
            <div className="mb-6">
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Filtros Avançados</span>
                </div>
                {showFiltros ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              <AnimatePresence>
                {showFiltros && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-4"
                  >
                    {/* Período */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                      <select
                        value={filtros.periodo}
                        onChange={(e) => setFiltros(prev => ({ ...prev, periodo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="1y">Último ano</option>
                      </select>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        value={filtros.estado}
                        onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="todos">Todos os Estados</option>
                        <option value="excelente">Excelente</option>
                        <option value="bom">Bom</option>
                        <option value="regular">Regular</option>
                        <option value="mau">Mau</option>
                        <option value="critico">Crítico</option>
                      </select>
                    </div>

                    {/* Quilometragem */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">KM Início</label>
                        <input
                          type="number"
                          value={filtros.quilometro_inicio}
                          onChange={(e) => setFiltros(prev => ({ ...prev, quilometro_inicio: e.target.value }))}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">KM Fim</label>
                        <input
                          type="number"
                          value={filtros.quilometro_fim}
                          onChange={(e) => setFiltros(prev => ({ ...prev, quilometro_fim: e.target.value }))}
                          placeholder="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Opções de Conteúdo */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Incluir no Relatório</label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filtros.incluir_fotos}
                          onChange={(e) => setFiltros(prev => ({ ...prev, incluir_fotos: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Fotografias</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filtros.incluir_graficos}
                          onChange={(e) => setFiltros(prev => ({ ...prev, incluir_graficos: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Gráficos e Análises</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filtros.incluir_recomendacoes}
                          onChange={(e) => setFiltros(prev => ({ ...prev, incluir_recomendacoes: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Recomendações</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <button
                onClick={visualizarRelatorio}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Pré-visualizar</span>
              </button>

              <button
                onClick={gerarRelatorio}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Gerar Relatório</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content - Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            {previewData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header do Relatório */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {TIPOS_RELATORIO.find(t => t.id === tipoRelatorio)?.nome} - Via Férrea
                  </h3>
                  <p className="text-gray-600">
                    Período: {previewData.periodo.inicio} a {previewData.periodo.fim}
                  </p>
                </div>

                {/* Métricas Resumo */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{previewData.metricas.quilometragemTotal} km</div>
                    <div className="text-sm text-blue-600">Quilometragem Total</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{previewData.metricas.totalElementos}</div>
                    <div className="text-sm text-green-600">Total de Elementos</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{previewData.metricas.inspecoesPendentes}</div>
                    <div className="text-sm text-orange-600">Inspeções Pendentes</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{previewData.metricas.pontosCriticos}</div>
                    <div className="text-sm text-red-600">Pontos Críticos</div>
                  </div>
                </div>

                {/* Distribuição por Estado */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Estado</h4>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{previewData.metricas.elementosExcelentes}</div>
                      <div className="text-sm text-gray-600">Excelente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{previewData.metricas.elementosBons}</div>
                      <div className="text-sm text-gray-600">Bom</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{previewData.metricas.elementosRegulares}</div>
                      <div className="text-sm text-gray-600">Regular</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{previewData.metricas.elementosMaus}</div>
                      <div className="text-sm text-gray-600">Mau</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{previewData.metricas.elementosCriticos}</div>
                      <div className="text-sm text-gray-600">Crítico</div>
                    </div>
                  </div>
                </div>

                {/* Pontos Críticos */}
                {previewData.pontosCriticos.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Pontos Críticos Identificados</h4>
                    <div className="space-y-3">
                      {previewData.pontosCriticos.slice(0, 5).map((ponto: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <div>
                              <div className="font-medium text-gray-900">{ponto.codigo}</div>
                              <div className="text-sm text-gray-600">KM {ponto.km_inicial} - Estado: {ponto.estado}</div>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            {ponto.estado.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações Adicionais */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Info className="h-5 w-5" />
                    <span>Este é uma pré-visualização do relatório. O documento final incluirá análises detalhadas, gráficos e recomendações técnicas.</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pré-visualização do Relatório</h3>
                  <p className="text-gray-500 mb-4">Selecione o tipo de relatório e clique em "Pré-visualizar" para ver o conteúdo</p>
                  <button
                    onClick={visualizarRelatorio}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gerar Pré-visualização
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
