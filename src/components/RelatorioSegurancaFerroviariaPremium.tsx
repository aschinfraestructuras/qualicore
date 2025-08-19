import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Filter, CheckSquare, Square, BarChart3, 
  TrendingUp, AlertTriangle, CheckCircle, Clock, Activity,
  Shield, Camera, Bell, Lock, Users, Gauge, MapPin, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PDFService } from '@/services/pdfService';
import { segurancaFerroviariaAPI } from '@/lib/supabase-api/segurancaFerroviariaAPI';
import type { SistemaSeguranca, InspecaoSeguranca } from '@/types/segurancaFerroviaria';
import {
  TIPOS_SISTEMA_SEGURANCA,
  CATEGORIAS_SEGURANCA,
  ESTADOS_SISTEMA,
  STATUS_OPERACIONAL,
  TIPOS_INSPECAO_SEGURANCA,
  RESULTADOS_INSPECAO,
  PRIORIDADES
} from '@/types/segurancaFerroviaria';

interface RelatorioSegurancaFerroviariaPremiumProps {
  onSelecaoChange?: (sistemasSelecionados: SistemaSeguranca[]) => void;
  tipoRelatorio?: 'sistemas' | 'inspecoes';
}

export default function RelatorioSegurancaFerroviariaPremium({
  onSelecaoChange,
  tipoRelatorio = 'sistemas'
}: RelatorioSegurancaFerroviariaPremiumProps) {
  const [sistemas, setSistemas] = useState<SistemaSeguranca[]>([]);
  const [inspecoes, setInspecoes] = useState<InspecaoSeguranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [sistemasSelecionados, setSistemasSelecionados] = useState<Set<string>>(new Set());
  const [inspecoesSelecionadas, setInspecoesSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);
  const [tipoRelatorioSelecionado, setTipoRelatorioSelecionado] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('filtrado');
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    estado: '',
    status_operacional: '',
    fabricante: '',
    responsavel: '',
    localizacao: '',
    data_instalacao_inicio: '',
    data_instalacao_fim: '',
    ultima_inspecao_inicio: '',
    ultima_inspecao_fim: ''
  });

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  // Atualizar seleção quando mudar
  useEffect(() => {
    if (onSelecaoChange) {
      const sistemasSelecionadosArray = sistemas.filter(s => sistemasSelecionados.has(s.id));
      onSelecaoChange(sistemasSelecionadosArray);
    }
  }, [sistemasSelecionados, sistemas, onSelecaoChange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sistemasData, inspecoesData] = await Promise.all([
        segurancaFerroviariaAPI.seguranca.getAll(),
        segurancaFerroviariaAPI.inspecoes.getAll()
      ]);
      
      setSistemas(sistemasData || []);
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
    if (tipoRelatorio === 'sistemas') {
      const newSelecao = new Set(sistemasSelecionados);
      if (newSelecao.has(id)) {
        newSelecao.delete(id);
      } else {
        newSelecao.add(id);
      }
      setSistemasSelecionados(newSelecao);
    } else {
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
    if (tipoRelatorio === 'sistemas') {
      const todosIds = sistemas.map(s => s.id);
      setSistemasSelecionados(new Set(todosIds));
    } else {
      const todosIds = inspecoes.map(i => i.id);
      setInspecoesSelecionadas(new Set(todosIds));
    }
  };

  const limparSelecao = () => {
    setSistemasSelecionados(new Set());
    setInspecoesSelecionadas(new Set());
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      limparSelecao();
    }
  };

  // Obter dados para relatório
  const getSistemasParaRelatorio = () => {
    if (sistemasSelecionados.size > 0) {
      return sistemas.filter(s => sistemasSelecionados.has(s.id));
    }
    return sistemas;
  };

  const getInspecoesParaRelatorio = () => {
    if (inspecoesSelecionadas.size > 0) {
      return inspecoes.filter(i => inspecoesSelecionadas.has(i.id));
    }
    return inspecoes;
  };

  // Gerar relatório
  const handleGerarRelatorio = async () => {
    try {
      const pdfService = new PDFService();
      
      if (tipoRelatorio === 'sistemas') {
        const sistemasParaRelatorio = getSistemasParaRelatorio();
        await pdfService.gerarRelatorioSegurancaFerroviaria({
          tipo: tipoRelatorioSelecionado,
          titulo: 'Relatório de Sistemas de Segurança Ferroviária',
          subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
          filtros: filtros,
          sistemasSelecionados: sistemasParaRelatorio,
          periodo: new Date().toLocaleDateString('pt-PT')
        });
      } else {
        const inspecoesParaRelatorio = getInspecoesParaRelatorio();
        await pdfService.gerarRelatorioInspecaoSeguranca({
          tipo: tipoRelatorioSelecionado,
          titulo: 'Relatório de Inspeções de Segurança Ferroviária',
          subtitulo: `Período: ${new Date().toLocaleDateString('pt-PT')}`,
          filtros: {
            tipo_inspecao: filtros.tipo,
            resultado: filtros.estado,
            prioridade: filtros.status_operacional,
            responsavel: filtros.responsavel,
            data_inspecao_inicio: filtros.data_instalacao_inicio,
            data_inspecao_fim: filtros.data_instalacao_fim
          },
          inspecoesSelecionadas: inspecoesParaRelatorio,
          periodo: new Date().toLocaleDateString('pt-PT')
        });
      }
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  // Funções auxiliares para cores
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Ativo':
      case 'Operacional':
        return 'text-green-600 bg-green-100';
      case 'Manutenção':
      case 'Teste':
        return 'text-yellow-600 bg-yellow-100';
      case 'Avaria':
      case 'Não Conforme':
        return 'text-red-600 bg-red-100';
      case 'Inativo':
      case 'Desligado':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conforme':
        return 'text-green-600 bg-green-100';
      case 'Não Conforme':
        return 'text-red-600 bg-red-100';
      case 'Pendente':
        return 'text-yellow-600 bg-yellow-100';
      case 'Crítico':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  // Estatísticas
  const estatisticasSistemas = {
    total: sistemas.length,
    operacionais: sistemas.filter(s => s.status_operacional === 'Operacional').length,
    manutencao: sistemas.filter(s => s.status_operacional === 'Manutenção').length,
    avaria: sistemas.filter(s => s.status_operacional === 'Avaria').length,
    ativos: sistemas.filter(s => s.estado === 'Ativo').length,
    inativos: sistemas.filter(s => s.estado === 'Inativo').length,
    criticos: sistemas.filter(s => s.parametros?.nivel_seguranca > 8).length
  };

  const estatisticasInspecoes = {
    total: inspecoes.length,
    conformes: inspecoes.filter(i => i.resultado === 'Conforme').length,
    naoConformes: inspecoes.filter(i => i.resultado === 'Não Conforme').length,
    pendentes: inspecoes.filter(i => i.resultado === 'Pendente').length,
    criticas: inspecoes.filter(i => i.prioridade === 'Crítica').length,
    altas: inspecoes.filter(i => i.prioridade === 'Alta').length
  };

  const tiposSistema = Object.values(TIPOS_SISTEMA_SEGURANCA).reduce((acc, tipo) => {
    acc[tipo] = sistemas.filter(s => s.tipo === tipo).length;
    return acc;
  }, {} as Record<string, number>);

  const categorias = Object.values(CATEGORIAS_SEGURANCA).reduce((acc, categoria) => {
    acc[categoria] = sistemas.filter(s => s.categoria === categoria).length;
    return acc;
  }, {} as Record<string, number>);

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
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Relatório de {tipoRelatorio === 'sistemas' ? 'Sistemas de Segurança' : 'Inspeções de Segurança'}
            </h2>
            <p className="text-sm text-gray-600">
              {tipoRelatorio === 'sistemas' 
                ? `${sistemas.length} sistemas registados`
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Fabricante..."
                value={filtros.fabricante}
                onChange={(e) => setFiltros({...filtros, fabricante: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tipoRelatorio === 'sistemas' ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticasSistemas.total}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Operacionais</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticasSistemas.operacionais}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Manutenção</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticasSistemas.manutencao}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avaria</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticasSistemas.avaria}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticasInspecoes.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conformes</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticasInspecoes.conformes}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Não Conformes</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticasInspecoes.naoConformes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Críticas</p>
                  <p className="text-2xl font-bold text-red-800">{estatisticasInspecoes.criticas}</p>
                </div>
                <Activity className="h-8 w-8 text-red-800" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Análise por Tipo */}
      {tipoRelatorio === 'sistemas' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Tipo de Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tiposSistema).map(([tipo, count]) => (
              <div key={tipo} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600">{tipo}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análise por Categoria */}
      {tipoRelatorio === 'sistemas' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise por Categoria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categorias).map(([categoria, count]) => (
              <div key={categoria} className="text-center">
                <div className="text-2xl font-bold text-green-600">{count}</div>
                <div className="text-sm text-gray-600">{categoria}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {tipoRelatorio === 'sistemas' ? 'Sistemas de Segurança' : 'Inspeções de Segurança'}
            </h3>
            <button
              onClick={handleGerarRelatorio}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Gerar Relatório PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {tipoRelatorio === 'sistemas' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={sistemasSelecionados.size === sistemas.length && sistemas.length > 0}
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fabricante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Inspeção
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sistemas.map((sistema) => (
                  <tr key={sistema.id} className="hover:bg-gray-50">
                    {selecaoAtiva && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={sistemasSelecionados.has(sistema.id)}
                          onChange={() => toggleSelecao(sistema.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sistema.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sistema.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sistema.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(sistema.status_operacional)}`}>
                        {sistema.status_operacional}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(sistema.estado)}`}>
                        {sistema.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sistema.fabricante}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sistema.ultima_inspecao ? new Date(sistema.ultima_inspecao).toLocaleDateString('pt-PT') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selecaoAtiva && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={inspecoesSelecionadas.size === inspecoes.length && inspecoes.length > 0}
                        onChange={selecionarTodos}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Inspeção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
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
                          checked={inspecoesSelecionadas.has(inspecao.id)}
                          onChange={() => toggleSelecao(inspecao.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inspecao.seguranca_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspecao.tipo_inspecao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inspecao.resultado)}`}>
                        {inspecao.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inspecao.prioridade)}`}>
                        {inspecao.prioridade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspecao.responsavel}
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {tipoRelatorio === 'sistemas' 
                  ? `${sistemasSelecionados.size} sistema(s) selecionado(s)`
                  : `${inspecoesSelecionadas.size} inspeção(ões) selecionada(s)`
                }
              </span>
            </div>
            <button
              onClick={limparSelecao}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
            >
              Limpar seleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
