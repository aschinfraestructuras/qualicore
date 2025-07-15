import React, { useState } from 'react';
import { FileText, Download, X, Filter, Calendar, Building, TrendingUp, Users, MapPin, DollarSign, Clock, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';
import { pdfService } from '../services/pdfService';
import { Obra } from '../types';

interface RelatorioObrasPremiumProps {
  obras: Obra[];
  onClose: () => void;
}

export default function RelatorioObrasPremium({ obras, onClose }: RelatorioObrasPremiumProps) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    tipo_obra: '',
    categoria: '',
    dataInicio: '',
    dataFim: '',
  });

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      console.log('Iniciando geração de relatório:', reportType);
      console.log('Obras disponíveis:', obras.length);
      
      const filteredObras = applyFilters(obras);
      console.log('Obras filtradas:', filteredObras.length);
      
      switch (reportType) {
        case 'executivo':
          console.log('Gerando relatório executivo...');
          await pdfService.generateObrasExecutiveReport(filteredObras);
          console.log('Relatório executivo gerado com sucesso!');
          break;
        case 'filtrado':
          console.log('Gerando relatório filtrado...');
          await pdfService.generateObrasFilteredReport(filteredObras, filters);
          console.log('Relatório filtrado gerado com sucesso!');
          break;
        case 'comparativo':
          console.log('Gerando relatório comparativo...');
          await pdfService.generateObrasComparativeReport(filteredObras);
          console.log('Relatório comparativo gerado com sucesso!');
          break;
        default:
          throw new Error('Tipo de relatório não reconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert(`Erro ao gerar relatório: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (obras: Obra[]) => {
    return obras.filter(obra => {
      const matchesStatus = !filters.status || obra.status === filters.status;
      const matchesTipo = !filters.tipo_obra || obra.tipo_obra === filters.tipo_obra;
      const matchesCategoria = !filters.categoria || obra.categoria === filters.categoria;
      
      const matchesData = !filters.dataInicio || !filters.dataFim || 
        (obra.data_inicio >= filters.dataInicio && obra.data_inicio <= filters.dataFim);

      return matchesStatus && matchesTipo && matchesCategoria && matchesData;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_execucao': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'paralisada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'planeamento': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_execucao': return 'Em Execução';
      case 'concluida': return 'Concluída';
      case 'paralisada': return 'Paralisada';
      case 'cancelada': return 'Cancelada';
      case 'planeamento': return 'Planeamento';
      default: return status;
    }
  };

  const stats = {
    total: obras.length,
    em_execucao: obras.filter(o => o.status === 'em_execucao').length,
    concluidas: obras.filter(o => o.status === 'concluida').length,
    paralisadas: obras.filter(o => o.status === 'paralisada').length,
    valor_total: obras.reduce((acc, o) => acc + o.valor_contrato, 0),
    valor_executado: obras.reduce((acc, o) => acc + o.valor_executado, 0),
    percentual_medio: obras.length > 0 ? obras.reduce((acc, o) => acc + o.percentual_execucao, 0) / obras.length : 0,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios de Obras</h2>
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
                  <p className="text-sm font-medium text-blue-600">Total Obras</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Em Execução</p>
                  <p className="text-2xl font-bold text-green-900">{stats.em_execucao}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Valor Total</p>
                  <p className="text-lg font-bold text-purple-900">
                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.valor_total)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Progresso Médio</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.percentual_medio.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
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
                  <li>• Indicadores de performance</li>
                  <li>• Análise financeira</li>
                  <li>• Status por categoria</li>
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
                  <li>• Comparação entre obras</li>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Status</option>
                    <option value="planeamento">Planeamento</option>
                    <option value="em_execucao">Em Execução</option>
                    <option value="paralisada">Paralisada</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Obra</label>
                  <select
                    value={filters.tipo_obra}
                    onChange={(e) => setFilters({...filters, tipo_obra: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Tipos</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="infraestrutura">Infraestrutura</option>
                    <option value="reabilitacao">Reabilitação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={filters.categoria}
                    onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as Categorias</option>
                    <option value="pequena">Pequena</option>
                    <option value="media">Média</option>
                    <option value="grande">Grande</option>
                    <option value="mega">Mega</option>
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
                  Para relatórios individuais de obras específicas, use o botão de relatório em cada obra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 