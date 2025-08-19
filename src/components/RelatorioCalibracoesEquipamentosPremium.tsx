import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Filter, CheckSquare, Square, BarChart3, 
  TrendingUp, AlertTriangle, CheckCircle, Clock, Activity,
  Settings, Camera, Bell, Lock, Users, Gauge, MapPin, Calendar,
  X, RefreshCw, Info, Wrench, Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getCalibracoesStats,
  getEquipamentos,
  getCalibracoes,
  getManutencoes,
  getInspecoes
} from '../lib/supabase-api/calibracoesAPI';
import { CalibracoesStats, Equipamento, Calibracao, Manutencao, Inspecao } from '../types/calibracoes';
import { PDFService } from '../services/pdfService';

interface RelatorioCalibracoesEquipamentosPremiumProps {
  onSelecaoChange?: (equipamentosSelecionados: Equipamento[]) => void;
  tipoRelatorio?: 'equipamentos' | 'calibracoes' | 'manutencoes' | 'inspecoes';
}

const RelatorioCalibracoesEquipamentosPremium: React.FC<RelatorioCalibracoesEquipamentosPremiumProps> = ({
  onSelecaoChange,
  tipoRelatorio = 'equipamentos'
}) => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState<CalibracoesStats | null>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [calibracoes, setCalibracoes] = useState<Calibracao[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<Set<string>>(new Set());
  const [calibracoesSelecionadas, setCalibracoesSelecionadas] = useState<Set<string>>(new Set());
  const [manutencoesSelecionadas, setManutencoesSelecionadas] = useState<Set<string>>(new Set());
  const [inspecoesSelecionadas, setInspecoesSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);
  const [tipoRelatorioSelecionado, setTipoRelatorioSelecionado] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('filtrado');
  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    categoria: '',
    responsavel: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  // Atualizar seleção quando mudar
  useEffect(() => {
    if (onSelecaoChange) {
      const equipamentosSelecionadosArray = equipamentos.filter(e => equipamentosSelecionados.has(e.id));
      onSelecaoChange(equipamentosSelecionadosArray);
    }
  }, [equipamentosSelecionados, equipamentos, onSelecaoChange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, equipamentosData, calibracoesData, manutencoesData, inspecoesData] = await Promise.all([
        getCalibracoesStats(),
        getEquipamentos(),
        getCalibracoes(),
        getManutencoes(),
        getInspecoes()
      ]);
      
      // Corrigir mapeamento dos dados de estatísticas
      console.log('Stats data recebido:', statsData);
      const statsCorrigidos = {
        total_equipamentos: statsData?.total_equipamentos || 0,
        equipamentos_ativos: statsData?.equipamentos_ativos || 0,
        equipamentos_manutencao: statsData?.equipamentos_manutencao || 0,
        equipamentos_avariados: statsData?.equipamentos_avariados || 0,
        calibracoes_vencidas: statsData?.calibracoes_vencidas || 0,
        calibracoes_proximas_vencer: statsData?.calibracoes_proximas_vencer || 0,
        manutencoes_pendentes: statsData?.manutencoes_pendentes || 0,
        inspecoes_pendentes: statsData?.inspecoes_pendentes || 0,
        valor_total_equipamentos: Number(statsData?.valor_total_equipamentos) || 0,
        custo_total_calibracoes: Number(statsData?.custo_total_calibracoes) || 0,
        custo_total_manutencoes: Number(statsData?.custo_total_manutencoes) || 0
      };
      console.log('Stats corrigidos:', statsCorrigidos);
      
      setStats(statsCorrigidos);
      setEquipamentos(equipamentosData || []);
      setCalibracoes(calibracoesData || []);
      setManutencoes(manutencoesData || []);
      setInspecoes(inspecoesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Lógica de seleção
  const toggleSelecao = (id: string) => {
    if (tipoRelatorio === 'equipamentos') {
      const newSelecao = new Set(equipamentosSelecionados);
      if (newSelecao.has(id)) {
        newSelecao.delete(id);
      } else {
        newSelecao.add(id);
      }
      setEquipamentosSelecionados(newSelecao);
    } else if (tipoRelatorio === 'calibracoes') {
      const newSelecao = new Set(calibracoesSelecionadas);
      if (newSelecao.has(id)) {
        newSelecao.delete(id);
      } else {
        newSelecao.add(id);
      }
      setCalibracoesSelecionadas(newSelecao);
    } else if (tipoRelatorio === 'manutencoes') {
      const newSelecao = new Set(manutencoesSelecionadas);
      if (newSelecao.has(id)) {
        newSelecao.delete(id);
      } else {
        newSelecao.add(id);
      }
      setManutencoesSelecionadas(newSelecao);
    } else if (tipoRelatorio === 'inspecoes') {
      const newSelecao = new Set(inspecoesSelecionadas);
      if (newSelecao.has(id)) {
        newSelecao.delete(id);
      } else {
        newSelecao.add(id);
      }
      setInspecoesSelecionadas(newSelecao);
    }
  };

  const selecionarTodos = () => {
    if (tipoRelatorio === 'equipamentos') {
      const todosIds = equipamentos.map(e => e.id);
      setEquipamentosSelecionados(new Set(todosIds));
    } else if (tipoRelatorio === 'calibracoes') {
      const todosIds = calibracoes.map(c => c.id);
      setCalibracoesSelecionadas(new Set(todosIds));
    } else if (tipoRelatorio === 'manutencoes') {
      const todosIds = manutencoes.map(m => m.id);
      setManutencoesSelecionadas(new Set(todosIds));
    } else if (tipoRelatorio === 'inspecoes') {
      const todosIds = inspecoes.map(i => i.id);
      setInspecoesSelecionadas(new Set(todosIds));
    }
  };

  const limparSelecao = () => {
    setEquipamentosSelecionados(new Set());
    setCalibracoesSelecionadas(new Set());
    setManutencoesSelecionadas(new Set());
    setInspecoesSelecionadas(new Set());
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      limparSelecao();
    }
  };

  // Obter dados para relatório
  const getEquipamentosParaRelatorio = () => {
    if (equipamentosSelecionados.size > 0) {
      return equipamentos.filter(e => equipamentosSelecionados.has(e.id));
    }
    return equipamentos;
  };

  const getCalibracoesParaRelatorio = () => {
    if (calibracoesSelecionadas.size > 0) {
      return calibracoes.filter(c => calibracoesSelecionadas.has(c.id));
    }
    return calibracoes;
  };

  const getManutencoesParaRelatorio = () => {
    if (manutencoesSelecionadas.size > 0) {
      return manutencoes.filter(m => manutencoesSelecionadas.has(m.id));
    }
    return manutencoes;
  };

  const getInspecoesParaRelatorio = () => {
    if (inspecoesSelecionadas.size > 0) {
      return inspecoes.filter(i => inspecoesSelecionadas.has(i.id));
    }
    return inspecoes;
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const pdfService = new PDFService();
      
      // Filtrar dados baseado nos filtros
      const equipamentosFiltrados = equipamentos.filter(equip => {
        if (filtros.status && equip.status_operacional !== filtros.status) return false;
        if (filtros.tipo && equip.tipo !== filtros.tipo) return false;
        if (filtros.categoria && equip.categoria !== filtros.categoria) return false;
        if (filtros.responsavel && equip.responsavel !== filtros.responsavel) return false;
        return true;
      });

      const calibracoesFiltradas = calibracoes.filter(cal => {
        if (filtros.data_inicio && new Date(cal.data_calibracao) < new Date(filtros.data_inicio)) return false;
        if (filtros.data_fim && new Date(cal.data_calibracao) > new Date(filtros.data_fim)) return false;
        return true;
      });

      const manutencoesFiltradas = manutencoes.filter(man => {
        if (filtros.data_inicio && new Date(man.data_manutencao) < new Date(filtros.data_inicio)) return false;
        if (filtros.data_fim && new Date(man.data_manutencao) > new Date(filtros.data_fim)) return false;
        return true;
      });

      const inspecoesFiltradas = inspecoes.filter(insp => {
        if (filtros.data_inicio && new Date(insp.data_inspecao) < new Date(filtros.data_inicio)) return false;
        if (filtros.data_fim && new Date(insp.data_inspecao) > new Date(filtros.data_fim)) return false;
        return true;
      });

      // Gerar relatório baseado no tipo selecionado
      switch (tipoRelatorio) {
        case 'equipamentos':
          await pdfService.gerarRelatorioExecutivoCalibracoesEquipamentos({
            titulo: 'Relatório Executivo - Calibrações e Equipamentos',
            subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
            stats: stats,
            equipamentos: equipamentosFiltrados,
            calibracoes: calibracoesFiltradas,
            manutencoes: manutencoesFiltradas,
            inspecoes: inspecoesFiltradas,
            filtros: filtros
          });
          break;
        case 'calibracoes':
          await pdfService.gerarRelatorioCalibracoes({
            titulo: 'Relatório de Calibrações',
            subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
            calibracoes: calibracoesFiltradas,
            filtros: filtros
          });
          break;
        case 'manutencoes':
          await pdfService.gerarRelatorioManutencoes({
            titulo: 'Relatório de Manutenções',
            subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
            manutencoes: manutencoesFiltradas,
            filtros: filtros
          });
          break;
        case 'inspecoes':
          await pdfService.gerarRelatorioInspecoes({
            titulo: 'Relatório de Inspeções',
            subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
            inspecoes: inspecoesFiltradas,
            filtros: filtros
          });
          break;
      }

      toast.success('Relatório PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (value: number) => {
    // Verificar se o valor é válido
    if (value === null || value === undefined || isNaN(value)) {
      return '0,00 €';
    }
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operacional':
      case 'aprovado':
      case 'concluida':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'nao_operacional':
      case 'reprovado':
      case 'cancelada':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'em_manutencao':
      case 'em_andamento':
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ativo':
      case 'operacional':
        return 'text-green-600 bg-green-100';
      case 'manutencao':
      case 'teste':
        return 'text-yellow-600 bg-yellow-100';
      case 'avariado':
      case 'nao_conforme':
        return 'text-red-600 bg-red-100';
      case 'inativo':
      case 'desligado':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
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
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Relatório de {tipoRelatorio === 'equipamentos' ? 'Equipamentos' : 
                           tipoRelatorio === 'calibracoes' ? 'Calibrações' :
                           tipoRelatorio === 'manutencoes' ? 'Manutenções' : 'Inspeções'}
            </h2>
            <p className="text-sm text-gray-600">
              {tipoRelatorio === 'equipamentos' 
                ? `${equipamentos.length} equipamentos registados`
                : tipoRelatorio === 'calibracoes'
                ? `${calibracoes.length} calibrações realizadas`
                : tipoRelatorio === 'manutencoes'
                ? `${manutencoes.length} manutenções realizadas`
                : `${inspecoes.length} inspeções realizadas`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleModoSelecao}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selecaoAtiva 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selecaoAtiva ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            <span className="ml-1">Seleção</span>
          </button>
          
          {selecaoAtiva && (
            <>
              <button
                onClick={selecionarTodos}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
              >
                Selecionar Todos
              </button>
              <button
                onClick={limparSelecao}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                Limpar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Configuração do Relatório */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorioSelecionado}
              onChange={(e) => setTipoRelatorioSelecionado(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="executivo">Executivo</option>
              <option value="filtrado">Filtrado</option>
              <option value="comparativo">Comparativo</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtros
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Responsável..."
                value={filtros.responsavel}
                onChange={(e) => setFiltros({...filtros, responsavel: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Equipamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_equipamentos}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Equipamentos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.equipamentos_ativos}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calibrações Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.calibracoes_vencidas}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.valor_total_equipamentos)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {tipoRelatorio === 'equipamentos' ? 'Equipamentos' : 
               tipoRelatorio === 'calibracoes' ? 'Calibrações' :
               tipoRelatorio === 'manutencoes' ? 'Manutenções' : 'Inspeções'}
            </h3>
            <button
              onClick={generatePDF}
              disabled={generating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Gerar Relatório PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {tipoRelatorio === 'equipamentos' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={equipamentosSelecionados.size === equipamentos.length && equipamentos.length > 0}
                        onChange={selecionarTodos}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipamentos.map((equipamento) => (
                  <tr key={equipamento.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={equipamentosSelecionados.has(equipamento.id)}
                          onChange={() => toggleSelecao(equipamento.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {equipamento.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipamento.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipamento.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipamento.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(equipamento.status_operacional)}`}>
                        {equipamento.status_operacional}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(equipamento.estado)}`}>
                        {equipamento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipamento.responsavel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Informação de Seleção */}
      {selecaoAtiva && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-purple-900">
                {tipoRelatorio === 'equipamentos' 
                  ? `${equipamentosSelecionados.size} equipamento(s) selecionado(s)`
                  : tipoRelatorio === 'calibracoes'
                  ? `${calibracoesSelecionadas.size} calibração(ões) selecionada(s)`
                  : tipoRelatorio === 'manutencoes'
                  ? `${manutencoesSelecionadas.size} manutenção(ões) selecionada(s)`
                  : `${inspecoesSelecionadas.size} inspeção(ões) selecionada(s)`
                }
              </span>
            </div>
            <button
              onClick={limparSelecao}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200"
            >
              Limpar seleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioCalibracoesEquipamentosPremium;
