import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, BarChart3, Filter, Download, CheckSquare, Square, 
  Building, Mountain, Calendar, MapPin, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Activity, Shield, Gauge, Target, Star, Zap, Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PDFService } from '../services/pdfService';
import { pontesTuneisAnalyticsService } from '../lib/pontes-tuneis-analytics';
import {
  PonteTunel,
  InspecaoPontesTuneis,
  RelatorioPontesTuneisOptions,
  RelatorioInspecaoPontesTuneisOptions,
  TIPOS_PONTE_TUNEL,
  CATEGORIAS_PONTE_TUNEL,
  ESTADOS_PONTE_TUNEL,
  STATUS_OPERACIONAL,
  TIPOS_INSPECAO_PONTES_TUNEIS,
  RESULTADOS_INSPECAO
} from '../types/pontesTuneis';

interface RelatorioPontesTuneisPremiumProps {
  tipoRelatorio?: 'pontesTuneis' | 'inspecoesPontesTuneis';
  onSelecaoChange?: (selecionados: string[]) => void;
}

export default function RelatorioPontesTuneisPremium({ 
  tipoRelatorio = 'pontesTuneis',
  onSelecaoChange 
}: RelatorioPontesTuneisPremiumProps) {
  const [pontesTuneis, setPontesTuneis] = useState<PonteTunel[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoPontesTuneis[]>([]);
  const [loading, setLoading] = useState(true);
  const [pontesTuneisSelecionadas, setPontesTuneisSelecionadas] = useState<string[]>([]);
  const [inspecoesSelecionadas, setInspecoesSelecionadas] = useState<string[]>([]);
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);
  const [tipoRelatorioSelecionado, setTipoRelatorioSelecionado] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual' | 'analytics' | 'estrutural' | 'seguranca' | 'predictivo'>('executivo');
  const [filtros, setFiltros] = useState({
    search: '',
    tipo: '',
    categoria: '',
    estado: '',
    status_operacional: '',
    fabricante: '',
    responsavel: '',
    localizacao: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (onSelecaoChange) {
      const selecionados = tipoRelatorio === 'pontesTuneis' ? pontesTuneisSelecionadas : inspecoesSelecionadas;
      onSelecaoChange(selecionados);
    }
  }, [pontesTuneisSelecionadas, inspecoesSelecionadas, tipoRelatorio, onSelecaoChange]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados - substituir por chamadas reais da API
      const mockPontesTuneis: PonteTunel[] = [
        {
          id: '1',
          codigo: 'PT-001',
          tipo: 'PONTE',
          categoria: 'ESTRUTURAL',
          localizacao: 'Rio Douro, Porto',
          km_inicial: 15.5,
          km_final: 15.8,
          estado: 'ATIVO',
          fabricante: 'Construtora Nacional',
          modelo: 'Ponte Metálica',
          data_construcao: '2020-03-15',
          status_operacional: 'OPERACIONAL',
          observacoes: 'Ponte principal sobre o Rio Douro',
          parametros: {
            comprimento: 350,
            largura: 12,
            altura: 25,
            capacidade_carga: 50
          },
          ultima_inspecao: '2024-01-15',
          proxima_inspecao: '2024-07-15',
          responsavel: 'Eng. João Silva',
          created_at: '2020-03-15T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          codigo: 'TN-001',
          tipo: 'TUNEL',
          categoria: 'GEOTECNICA',
          localizacao: 'Serra da Estrela',
          km_inicial: 45.2,
          km_final: 47.8,
          estado: 'ATIVO',
          fabricante: 'Túneis Portugal',
          modelo: 'Túnel Escavado',
          data_construcao: '2019-08-20',
          status_operacional: 'OPERACIONAL',
          observacoes: 'Túnel principal da linha da Beira Alta',
          parametros: {
            comprimento: 2600,
            largura: 8,
            altura: 6.5,
            capacidade_carga: 25
          },
          ultima_inspecao: '2024-02-10',
          proxima_inspecao: '2024-08-10',
          responsavel: 'Eng. Maria Santos',
          created_at: '2019-08-20T09:00:00Z',
          updated_at: '2024-02-10T11:15:00Z'
        }
      ];

      const mockInspecoes: InspecaoPontesTuneis[] = [
        {
          id: '1',
          ponte_tunel_id: '1',
          data_inspecao: '2024-01-15',
          tipo_inspecao: 'ROTINA',
          resultado: 'CONFORME',
          observacoes: 'Estrutura em bom estado geral',
          responsavel: 'Eng. Carlos Oliveira',
          proxima_inspecao: '2024-07-15',
          created_at: '2024-01-15T14:30:00Z',
          updated_at: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          ponte_tunel_id: '2',
          data_inspecao: '2024-02-10',
          tipo_inspecao: 'MANUTENCAO',
          resultado: 'NAO_CONFORME',
          observacoes: 'Detetadas infiltrações na zona norte',
          responsavel: 'Eng. Ana Costa',
          proxima_inspecao: '2024-05-10',
          created_at: '2024-02-10T11:15:00Z',
          updated_at: '2024-02-10T11:15:00Z'
        }
      ];

      setPontesTuneis(mockPontesTuneis);
      setInspecoes(mockInspecoes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelecao = (id: string) => {
    if (tipoRelatorio === 'pontesTuneis') {
      setPontesTuneisSelecionadas(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setInspecoesSelecionadas(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    }
  };

  const selecionarTodos = () => {
    if (tipoRelatorio === 'pontesTuneis') {
      const todosIds = pontesTuneis.map(pt => pt.id);
      setPontesTuneisSelecionadas(todosIds);
    } else {
      const todosIds = inspecoes.map(ins => ins.id);
      setInspecoesSelecionadas(todosIds);
    }
  };

  const limparSelecao = () => {
    setPontesTuneisSelecionadas([]);
    setInspecoesSelecionadas([]);
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      limparSelecao();
    }
  };

  const getPontesTuneisParaRelatorio = () => {
    if (pontesTuneisSelecionadas.length > 0) {
      return pontesTuneis.filter(pt => pontesTuneisSelecionadas.includes(pt.id));
    }
    return pontesTuneis;
  };

  const getInspecoesParaRelatorio = () => {
    if (inspecoesSelecionadas.length > 0) {
      return inspecoes.filter(ins => inspecoesSelecionadas.includes(ins.id));
    }
    return inspecoes;
  };

  const handleGerarRelatorio = async () => {
    try {
      toast.loading('Gerando relatório premium...');
      const pdfService = new PDFService();
      
      // Buscar analytics se for relatório avançado
      let analyticsData = null;
      if (['analytics', 'estrutural', 'seguranca', 'predictivo'].includes(tipoRelatorioSelecionado)) {
        analyticsData = await pontesTuneisAnalyticsService.getCompleteAnalytics('30d');
      }
      
      if (tipoRelatorio === 'pontesTuneis') {
        const pontesTuneisParaRelatorio = getPontesTuneisParaRelatorio();
        
        await pdfService.gerarRelatorioPontesTuneis({
          tipo: tipoRelatorioSelecionado,
          pontesTuneis: pontesTuneisParaRelatorio,
          filtros: filtros,
          titulo: `Relatório de Pontes e Túneis - ${tipoRelatorioSelecionado.toUpperCase()}`,
          incluirEstatisticas: true,
          incluirGraficos: true,
          analytics: analyticsData
        });
        toast.dismiss();
        toast.success('Relatório premium de Pontes e Túneis gerado com sucesso!');
      } else {
        const inspecoesParaRelatorio = getInspecoesParaRelatorio();
        
        await pdfService.gerarRelatorioInspecaoPontesTuneis({
          tipo: tipoRelatorioSelecionado,
          inspecoes: inspecoesParaRelatorio,
          filtros: filtros,
          titulo: `Relatório de Inspeções de Pontes e Túneis - ${tipoRelatorioSelecionado.toUpperCase()}`,
          incluirEstatisticas: true,
          incluirGraficos: true,
          analytics: analyticsData
        });
        toast.dismiss();
        toast.success('Relatório premium de Inspeções gerado com sucesso!');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório premium');
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'PONTE': return 'bg-blue-100 text-blue-800';
      case 'TUNEL': return 'bg-purple-100 text-purple-800';
      case 'VIADUTO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ATIVO': return 'bg-green-100 text-green-800';
      case 'MANUTENCAO': return 'bg-yellow-100 text-yellow-800';
      case 'AVARIA': return 'bg-red-100 text-red-800';
      case 'CONSTRUCAO': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERACIONAL': return 'bg-green-100 text-green-800';
      case 'MANUTENCAO': return 'bg-yellow-100 text-yellow-800';
      case 'AVARIA': return 'bg-red-100 text-red-800';
      case 'EMERGENCIA': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'CONFORME': return 'bg-green-100 text-green-800';
      case 'NAO_CONFORME': return 'bg-red-100 text-red-800';
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CRITICO': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Cálculos de estatísticas
  const stats = {
    total: pontesTuneis.length,
    pontes: pontesTuneis.filter(pt => pt.tipo === 'PONTE').length,
    tuneis: pontesTuneis.filter(pt => pt.tipo === 'TUNEL').length,
    operacionais: pontesTuneis.filter(pt => pt.status_operacional === 'OPERACIONAL').length,
    manutencao: pontesTuneis.filter(pt => pt.status_operacional === 'MANUTENCAO').length,
    avaria: pontesTuneis.filter(pt => pt.status_operacional === 'AVARIA').length,
    ativos: pontesTuneis.filter(pt => pt.estado === 'ATIVO').length,
    inativos: pontesTuneis.filter(pt => pt.estado === 'INATIVO').length,
    inspecoes_total: inspecoes.length,
    inspecoes_conformes: inspecoes.filter(ins => ins.resultado === 'CONFORME').length,
    inspecoes_nao_conformes: inspecoes.filter(ins => ins.resultado === 'NAO_CONFORME').length,
    inspecoes_pendentes: inspecoes.filter(ins => ins.resultado === 'PENDENTE').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {tipoRelatorio === 'pontesTuneis' ? 'Relatórios de Pontes e Túneis' : 'Relatórios de Inspeções'}
          </h2>
          <p className="text-gray-600">Gere relatórios profissionais com dados detalhados</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleModoSelecao}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              selecaoAtiva 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {selecaoAtiva ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
            Seleção
          </button>
          <button
            onClick={handleGerarRelatorio}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gerar PDF Premium
          </button>
        </div>
      </div>

      {/* Controles de Seleção */}
      {selecaoAtiva && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selecionarTodos}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Selecionar Todos
              </button>
              <button
                onClick={limparSelecao}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Limpar Seleção
              </button>
            </div>
            <div className="text-sm text-blue-600">
              {tipoRelatorio === 'pontesTuneis' 
                ? `${pontesTuneisSelecionadas.length} ponte(s)/túnel(is) selecionado(s)`
                : `${inspecoesSelecionadas.length} inspeção(ões) selecionada(s)`
              }
            </div>
          </div>
        </div>
      )}

      {/* Configuração do Relatório */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorioSelecionado}
              onChange={(e) => setTipoRelatorioSelecionado(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <optgroup label="Relatórios Básicos">
                <option value="executivo">📊 Executivo</option>
                <option value="filtrado">🔍 Filtrado</option>
                <option value="comparativo">📈 Comparativo</option>
                <option value="individual">📄 Individual</option>
              </optgroup>
              <optgroup label="Relatórios Premium com Analytics">
                <option value="analytics">📊 Analytics Completos</option>
                <option value="estrutural">🏗️ Análise Estrutural</option>
                <option value="seguranca">🛡️ Análise de Segurança</option>
                <option value="predictivo">🔮 Análise Preditiva</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Módulo
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pontesTuneis">Pontes e Túneis</option>
              <option value="inspecoesPontesTuneis">Inspeções</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Mountain className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pontes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pontes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Túneis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tuneis}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Operacionais</p>
              <p className="text-2xl font-bold text-gray-900">{stats.operacionais}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Manutenção</p>
              <p className="text-2xl font-bold text-gray-900">{stats.manutencao}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avaria</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avaria}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Análise por Tipo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Tipo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(TIPOS_PONTE_TUNEL).map(([key, value]) => {
            const count = pontesTuneis.filter(pt => pt.tipo === value).length;
            const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Análise por Categoria */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CATEGORIAS_PONTE_TUNEL).map(([key, value]) => {
            const count = pontesTuneis.filter(pt => pt.categoria === value).length;
            const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : '0';
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela de Pontes e Túneis */}
      {tipoRelatorio === 'pontesTuneis' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pontes e Túneis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={pontesTuneisSelecionadas.length === pontesTuneis.length && pontesTuneis.length > 0}
                        onChange={selecionarTodos}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Inspeção
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pontesTuneis.map((ponteTunel) => (
                  <tr key={ponteTunel.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={pontesTuneisSelecionadas.includes(ponteTunel.id)}
                          onChange={() => toggleSelecao(ponteTunel.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ponteTunel.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(ponteTunel.tipo)}`}>
                        {ponteTunel.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ponteTunel.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(ponteTunel.estado)}`}>
                        {ponteTunel.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ponteTunel.status_operacional)}`}>
                        {ponteTunel.status_operacional}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ponteTunel.responsavel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(ponteTunel.ultima_inspecao).toLocaleDateString('pt-PT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabela de Inspeções */}
      {tipoRelatorio === 'inspecoesPontesTuneis' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inspeções</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={inspecoesSelecionadas.length === inspecoes.length && inspecoes.length > 0}
                        onChange={selecionarTodos}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Inspeção
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspecoes.map((inspecao) => (
                  <tr key={inspecao.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={inspecoesSelecionadas.includes(inspecao.id)}
                          onChange={() => toggleSelecao(inspecao.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspecao.tipo_inspecao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultadoColor(inspecao.resultado)}`}>
                        {inspecao.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspecao.responsavel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspecao.proxima_inspecao).toLocaleDateString('pt-PT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
