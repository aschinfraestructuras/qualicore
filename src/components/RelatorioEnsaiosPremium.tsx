import React, { useState } from 'react';
import { FileText, Download, X, Filter, Calendar, TestTube, TrendingUp, Users, MapPin, CheckCircle, AlertCircle, XCircle, Info, Clock, Zap } from 'lucide-react';
import PDFService from '../services/pdfService';
import { Ensaio } from '../types';

interface RelatorioEnsaiosPremiumProps {
  ensaios: Ensaio[];
  onClose: () => void;
}

export default function RelatorioEnsaiosPremium({ ensaios, onClose }: RelatorioEnsaiosPremiumProps) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    laboratorio: '',
    conforme: '',
    dataInicio: '',
    dataFim: '',
  });

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const filteredEnsaios = applyFilters(ensaios);
      const pdfService = new PDFService();
      
      switch (reportType) {
        case 'executivo':
          await pdfService.generateEnsaiosExecutiveReport(filteredEnsaios);
          break;
        case 'filtrado':
          await pdfService.generateEnsaiosFilteredReport(filteredEnsaios, filters);
          break;
        case 'comparativo':
          await pdfService.generateEnsaiosComparativeReport(filteredEnsaios);
          break;
        default:
          throw new Error('Tipo de relatório não reconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (ensaios: Ensaio[]) => {
    return ensaios.filter(ensaio => {
      const matchesTipo = !filters.tipo || ensaio.tipo === filters.tipo;
      const matchesEstado = !filters.estado || ensaio.estado === filters.estado;
      const matchesLaboratorio = !filters.laboratorio || ensaio.laboratorio === filters.laboratorio;
      
      const matchesConforme = filters.conforme === '' || 
        (filters.conforme === 'true' && ensaio.conforme) ||
        (filters.conforme === 'false' && !ensaio.conforme);
      
      const matchesData = !filters.dataInicio || !filters.dataFim || 
        (ensaio.data_ensaio >= filters.dataInicio && ensaio.data_ensaio <= filters.dataFim);

      return matchesTipo && matchesEstado && matchesLaboratorio && matchesConforme && matchesData;
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      case 'reprovado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'aprovado': return 'Aprovado';
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'reprovado': return 'Reprovado';
      case 'concluido': return 'Concluído';
      default: return estado;
    }
  };

  const stats = {
    total: ensaios.length,
    conformes: ensaios.filter(e => e.conforme).length,
    nao_conformes: ensaios.filter(e => !e.conforme).length,
    aprovados: ensaios.filter(e => e.estado === 'aprovado').length,
    pendentes: ensaios.filter(e => e.estado === 'pendente').length,
    percentual_conformidade: ensaios.length > 0 ? (ensaios.filter(e => e.conforme).length / ensaios.length) * 100 : 0,
    laboratorios_unicos: new Set(ensaios.map(e => e.laboratorio)).size,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios de Ensaios</h2>
              <p className="text-sm text-gray-600">Gerar relatórios PDF profissionais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Ensaios</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <TestTube className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Conformes</p>
                  <p className="text-2xl font-bold text-green-900">{stats.conformes}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Taxa Conformidade</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.percentual_conformidade.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Laboratórios</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.laboratorios_unicos}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Tipos de Relatório */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Selecione o Tipo de Relatório</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Relatório Executivo */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                   onClick={() => setSelectedReport('executivo')}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Relatório Executivo</h4>
                    <p className="text-sm text-gray-600">Visão geral e KPIs</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Resumo executivo</li>
                  <li>• Indicadores de conformidade</li>
                  <li>• Análise por laboratório</li>
                  <li>• Performance por tipo</li>
                </ul>
              </div>

              {/* Relatório Filtrado */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer"
                   onClick={() => setSelectedReport('filtrado')}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Filter className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Relatório Filtrado</h4>
                    <p className="text-sm text-gray-600">Dados específicos</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Filtros personalizados</li>
                  <li>• Análise detalhada</li>
                  <li>• Comparações específicas</li>
                  <li>• Dados segmentados</li>
                </ul>
              </div>

              {/* Relatório Comparativo */}
              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
                   onClick={() => setSelectedReport('comparativo')}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Relatório Comparativo</h4>
                    <p className="text-sm text-gray-600">Análise comparativa</p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Comparação entre ensaios</li>
                  <li>• Análise de performance</li>
                  <li>• Benchmarks</li>
                  <li>• Tendências</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Filtros (apenas para relatório filtrado) */}
          {selectedReport === 'filtrado' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Filtros do Relatório</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ensaio</label>
                  <select
                    value={filters.tipo}
                    onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Tipos</option>
                    <option value="Ensaio de Resistência à Compressão">Resistência à Compressão</option>
                    <option value="Ensaio de Resistência à Tração">Resistência à Tração</option>
                    <option value="Ensaio de Flexão">Flexão</option>
                    <option value="Ensaio de Densidade">Densidade</option>
                    <option value="Ensaio de Absorção">Absorção</option>
                    <option value="Ensaio de Permeabilidade">Permeabilidade</option>
                    <option value="Ensaio de Durabilidade">Durabilidade</option>
                    <option value="Ensaio de Consistência">Consistência</option>
                    <option value="Ensaio de Slump">Slump</option>
                    <option value="Ensaio de Temperatura">Temperatura</option>
                    <option value="Ensaio de Umidade">Umidade</option>
                    <option value="Ensaio de Granulometria">Granulometria</option>
                    <option value="Ensaio de Adensamento">Adensamento</option>
                    <option value="Ensaio de Cisalhamento">Cisalhamento</option>
                    <option value="Ensaio de Penetração">Penetração</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.estado}
                    onChange={(e) => setFilters({...filters, estado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Estados</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conformidade</label>
                  <select
                    value={filters.conforme}
                    onChange={(e) => setFilters({...filters, conforme: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="true">Conformes</option>
                    <option value="false">Não Conformes</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                  <input
                    type="date"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
                  <input
                    type="date"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botão Gerar */}
          {selectedReport && (
            <div className="flex justify-center">
              <button
                onClick={() => handleGenerateReport(selectedReport)}
                disabled={loading}
                className="btn btn-primary btn-lg flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Download className="h-5 w-5" />
                )}
                <span>
                  {loading ? 'Gerando...' : `Gerar Relatório ${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}`}
                </span>
              </button>
            </div>
          )}

          {/* Dica */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Dica</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Os relatórios são gerados em PDF profissional com cabeçalho, rodapé e formatação otimizada para impressão.
                  Para relatórios individuais de ensaios específicos, use o botão de relatório em cada ensaio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 