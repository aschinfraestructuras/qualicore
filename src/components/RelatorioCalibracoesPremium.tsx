import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  Settings, 
  Calendar, 
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Wrench,
  Shield,
  X,
  Plus,
  Save,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao 
} from '../types/calibracoes';
import { calibracoesRelatoriosAvancados, RelatorioConfig as RelatorioConfigLib, RelatorioDados } from '../lib/calibracoes-relatorios-avancados';

interface RelatorioCalibracoesPremiumProps {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  onClose: () => void;
}

interface RelatorioConfig {
  titulo: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  filtros: {
    equipamentos: string[];
    categorias: string[];
    status: string[];
  };
  secoes: {
    resumo: boolean;
    calibracoes: boolean;
    manutencoes: boolean;
    inspecoes: boolean;
    analytics: boolean;
    compliance: boolean;
  };
  formato: 'pdf' | 'excel' | 'word' | 'html';
}

export default function RelatorioCalibracoesPremium({
  equipamentos,
  calibracoes,
  manutencoes,
  inspecoes,
  onClose
}: RelatorioCalibracoesPremiumProps) {
  const [config, setConfig] = useState<RelatorioConfig>({
    titulo: 'Relatório de Calibrações e Equipamentos',
    periodo: {
      inicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      fim: new Date().toISOString().split('T')[0]
    },
    filtros: {
      equipamentos: [],
      categorias: [],
      status: []
    },
    secoes: {
      resumo: true,
      calibracoes: true,
      manutencoes: true,
      inspecoes: true,
      analytics: true,
      compliance: true
    },
    formato: 'pdf'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcular métricas para o relatório
  const metrics = useMemo(() => {
    const hoje = new Date();
    const inicioPeriodo = new Date(config.periodo.inicio);
    const fimPeriodo = new Date(config.periodo.fim);

    // Filtrar dados por período
    const calibracoesPeriodo = calibracoes.filter(c => {
      const dataCalibracao = new Date(c.data_calibracao);
      return dataCalibracao >= inicioPeriodo && dataCalibracao <= fimPeriodo;
    });

    const manutencoesPeriodo = manutencoes.filter(m => {
      const dataManutencao = new Date(m.data_manutencao);
      return dataManutencao >= inicioPeriodo && dataManutencao <= fimPeriodo;
    });

    const inspecoesPeriodo = inspecoes.filter(i => {
      const dataInspecao = new Date(i.data_inspecao);
      return dataInspecao >= inicioPeriodo && dataInspecao <= fimPeriodo;
    });

    // Calcular métricas
    const totalEquipamentos = equipamentos.length;
    const equipamentosAtivos = equipamentos.filter(e => e.estado === 'ativo').length;
    const calibracoesVencidas = calibracoes.filter(c => new Date(c.data_proxima_calibracao) < hoje).length;
    const calibracoesProximas = calibracoes.filter(c => {
      const dataVencimento = new Date(c.data_proxima_calibracao);
      const diffDays = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;

    const custoTotalCalibracoes = calibracoesPeriodo.reduce((acc, c) => acc + (c.custo || 0), 0);
    const custoTotalManutencoes = manutencoesPeriodo.reduce((acc, m) => acc + (m.custo || 0), 0);
    const valorTotalEquipamentos = equipamentos.reduce((acc, e) => acc + (e.valor_atual || 0), 0);

    // Taxa de conformidade
    const equipamentosConformes = equipamentos.filter(e => 
      e.estado === 'ativo' && 
      calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > hoje
      )
    ).length;

    const taxaConformidade = totalEquipamentos > 0 ? (equipamentosConformes / totalEquipamentos) * 100 : 0;

    return {
      totalEquipamentos,
      equipamentosAtivos,
      calibracoesVencidas,
      calibracoesProximas,
      custoTotalCalibracoes,
      custoTotalManutencoes,
      valorTotalEquipamentos,
      taxaConformidade,
      calibracoesPeriodo: calibracoesPeriodo.length,
      manutencoesPeriodo: manutencoesPeriodo.length,
      inspecoesPeriodo: inspecoesPeriodo.length
    };
  }, [equipamentos, calibracoes, manutencoes, inspecoes, config.periodo]);

  // Gerar relatório
  const gerarRelatorio = async () => {
    setIsGenerating(true);
    try {
      const filename = `relatorio_calibracoes_${new Date().toISOString().split('T')[0]}.${config.formato}`;
      
      // Configurar dados para o serviço de relatórios
      const relatorioConfig: RelatorioConfigLib = {
        titulo: config.titulo,
        periodo: config.periodo,
        secoes: {
          resumo: config.secoes.resumo,
          equipamentos: true,
          calibracoes: config.secoes.calibracoes,
          manutencoes: config.secoes.manutencoes,
          inspecoes: config.secoes.inspecoes,
          analytics: config.secoes.analytics,
          compliance: config.secoes.compliance
        },
        formato: config.formato
      };

      const relatorioDados: RelatorioDados = {
        equipamentos,
        calibracoes,
        manutencoes,
        inspecoes,
        config: relatorioConfig
      };

      let blob: Blob;
      let mimeType: string;

      // Gerar relatório baseado no formato selecionado
      switch (config.formato) {
        case 'pdf':
          blob = await calibracoesRelatoriosAvancados.gerarPDF(relatorioDados);
          mimeType = 'application/pdf';
          break;
        case 'excel':
          blob = await calibracoesRelatoriosAvancados.gerarExcel(relatorioDados);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'word':
          blob = await calibracoesRelatoriosAvancados.gerarWord(relatorioDados);
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'html':
          const htmlContent = calibracoesRelatoriosAvancados.gerarHTML(relatorioDados);
          blob = new Blob([htmlContent], { type: 'text/html' });
          mimeType = 'text/html';
          break;
        default:
          throw new Error('Formato não suportado');
      }

      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Relatório gerado: ${filename}`);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview do relatório
  const renderPreview = () => (
    <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.titulo}</h1>
        <p className="text-gray-600">
          Período: {new Date(config.periodo.inicio).toLocaleDateString('pt-PT')} - {new Date(config.periodo.fim).toLocaleDateString('pt-PT')}
        </p>
        <p className="text-gray-600">Gerado em: {new Date().toLocaleDateString('pt-PT')}</p>
      </div>

      {config.secoes.resumo && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumo Executivo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalEquipamentos}</div>
              <div className="text-sm text-blue-700">Total Equipamentos</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.taxaConformidade.toFixed(1)}%</div>
              <div className="text-sm text-green-700">Taxa Conformidade</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.calibracoesVencidas}</div>
              <div className="text-sm text-red-700">Calibrações Vencidas</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{metrics.calibracoesProximas}</div>
              <div className="text-sm text-orange-700">A Vencer (30d)</div>
            </div>
          </div>
        </div>
      )}

      {config.secoes.calibracoes && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Análise de Calibrações</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Calibrações no período:</strong> {metrics.calibracoesPeriodo}</p>
            <p><strong>Custo total:</strong> {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(metrics.custoTotalCalibracoes)}</p>
            <p><strong>Calibrações vencidas:</strong> {metrics.calibracoesVencidas}</p>
            <p><strong>Calibrações próximas:</strong> {metrics.calibracoesProximas}</p>
          </div>
        </div>
      )}

      {config.secoes.manutencoes && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Análise de Manutenções</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Manutenções no período:</strong> {metrics.manutencoesPeriodo}</p>
            <p><strong>Custo total:</strong> {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(metrics.custoTotalManutencoes)}</p>
          </div>
        </div>
      )}

      {config.secoes.analytics && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Avançados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Distribuição por Categoria</h3>
              <p>Análise detalhada da distribuição de equipamentos por categoria...</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Tendências de Conformidade</h3>
              <p>Evolução da taxa de conformidade ao longo do tempo...</p>
            </div>
          </div>
        </div>
      )}

      {config.secoes.compliance && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance e Certificações</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Status de Compliance:</strong> {metrics.taxaConformidade >= 95 ? 'EXCELENTE' : metrics.taxaConformidade >= 85 ? 'BOM' : 'REQUER ATENÇÃO'}</p>
            <p><strong>Equipamentos em conformidade:</strong> {equipamentos.filter(e => e.estado === 'ativo').length}</p>
            <p><strong>Valor total do património:</strong> {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(metrics.valorTotalEquipamentos)}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatório Premium</h2>
              <p className="text-sm text-gray-600">Gerar relatório avançado de calibrações</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar de Configuração */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
            
            {/* Título */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Título do Relatório</label>
              <input
                type="text"
                value={config.titulo}
                onChange={(e) => setConfig(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Período */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={config.periodo.inicio}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    periodo: { ...prev.periodo, inicio: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={config.periodo.fim}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    periodo: { ...prev.periodo, fim: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Seções */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seções do Relatório</label>
              <div className="space-y-2">
                {Object.entries(config.secoes).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        secoes: { ...prev.secoes, [key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Formato */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Saída</label>
              <select
                value={config.formato}
                onChange={(e) => setConfig(prev => ({ ...prev, formato: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="html">HTML</option>
              </select>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Ocultar' : 'Ver'} Preview</span>
              </button>
              
              <button
                onClick={gerarRelatorio}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isGenerating ? 'Gerando...' : 'Gerar Relatório'}</span>
              </button>
            </div>
          </div>

          {/* Área de Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            {showPreview ? (
              renderPreview()
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Preview do Relatório</p>
                  <p className="text-sm">Clique em "Ver Preview" para visualizar o relatório</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
