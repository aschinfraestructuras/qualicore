import React, { useState } from 'react';
import { FileText, Download, X, Filter, Calendar, Calculator, TrendingUp, Users, MapPin, CheckCircle, AlertCircle, XCircle, Info, Clock, Zap, Award, Database, Globe, Compass, Scale, Droplets } from 'lucide-react';
import { PDFService } from '../services/pdfService';
import { CaracterizacaoSolo } from '../types/solos';

interface RelatorioSolosPremiumProps {
  solos: CaracterizacaoSolo[];
  onClose: () => void;
}

export default function RelatorioSolosPremium({ solos, onClose }: RelatorioSolosPremiumProps) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    obra: '',
    laboratorio: '',
    conforme: '',
    adequacao: '',
    dataInicio: '',
    dataFim: '',
  });

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const filteredSolos = applyFilters(solos);
      const pdfService = new PDFService();
      
      switch (reportType) {
        case 'executivo':
          await pdfService.generateSolosExecutiveReport(filteredSolos);
          break;
        case 'filtrado':
          await pdfService.generateSolosFilteredReport(filteredSolos, filters);
          break;
        case 'comparativo':
          await pdfService.generateSolosComparativeReport(filteredSolos);
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

  const applyFilters = (solos: CaracterizacaoSolo[]) => {
    return solos.filter(solo => {
      const matchesObra = !filters.obra || solo.obra === filters.obra;
      const matchesLaboratorio = !filters.laboratorio || solo.laboratorio === filters.laboratorio;
      
      const matchesConforme = filters.conforme === '' || 
        (filters.conforme === 'true' && solo.conforme) ||
        (filters.conforme === 'false' && !solo.conforme);
      
      const matchesAdequacao = !filters.adequacao || solo.classificacao?.adequacao === filters.adequacao;
      
      const matchesData = !filters.dataInicio || !filters.dataFim || 
        (solo.data_colheita >= filters.dataInicio && solo.data_colheita <= filters.dataFim);

      return matchesObra && matchesLaboratorio && matchesConforme && matchesAdequacao && matchesData;
    });
  };

  const getAdequacaoColor = (adequacao: string) => {
    switch (adequacao) {
      case 'EXCELENTE': return 'bg-purple-100 text-purple-800';
      case 'ADEQUADO': return 'bg-green-100 text-green-800';
      case 'MARGINAL': return 'bg-yellow-100 text-yellow-800';
      case 'TOLERABLE': return 'bg-orange-100 text-orange-800';
      case 'INADECUADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdequacaoText = (adequacao: string) => {
    switch (adequacao) {
      case 'EXCELENTE': return 'Excelente';
      case 'ADEQUADO': return 'Adequado';
      case 'MARGINAL': return 'Marginal';
      case 'TOLERABLE': return 'Tolerável';
      case 'INADECUADO': return 'Inadequado';
      default: return adequacao;
    }
  };

  const stats = {
    total: solos.length,
    conformes: solos.filter(s => s.conforme).length,
    nao_conformes: solos.filter(s => !s.conforme).length,
    adequados: solos.filter(s => 
      s.classificacao?.adequacao === 'ADEQUADO' || s.classificacao?.adequacao === 'EXCELENTE'
    ).length,
    inadequados: solos.filter(s => 
      s.classificacao?.adequacao === 'INADECUADO' || s.classificacao?.adequacao === 'TOLERABLE'
    ).length,
    percentual_conformidade: solos.length > 0 ? (solos.filter(s => s.conforme).length / solos.length) * 100 : 0,
    laboratorios_unicos: new Set(solos.map(s => s.laboratorio)).size,
    obras_unicas: new Set(solos.map(s => s.obra)).size,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Relatórios de Solos</h2>
                <p className="text-green-100">Geração de relatórios profissionais</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.conformes}</div>
              <div className="text-sm text-green-600">Conformes</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.adequados}</div>
              <div className="text-sm text-purple-600">Adequados</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.laboratorios_unicos}</div>
              <div className="text-sm text-orange-600">Laboratórios</div>
            </div>
          </div>

          {/* Tipos de Relatório */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Tipos de Relatório
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleGenerateReport('executivo')}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Relatório Executivo</span>
                </div>
                <p className="text-sm opacity-90">Visão geral para gestão</p>
              </button>

              

              <button
                onClick={() => handleGenerateReport('comparativo')}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Análise Comparativa</span>
                </div>
                <p className="text-sm opacity-90">Comparação entre períodos</p>
              </button>

              <button
                onClick={() => handleGenerateReport('filtrado')}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <div className="flex items-center mb-2">
                  <Filter className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Relatório Filtrado</span>
                </div>
                <p className="text-sm opacity-90">Dados com filtros aplicados</p>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-500" />
                Filtros para Relatórios
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
                <select
                  value={filters.obra}
                  onChange={(e) => setFilters({ ...filters, obra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todas as obras</option>
                  {Array.from(new Set(solos.map(s => s.obra))).map(obra => (
                    <option key={obra} value={obra}>{obra}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório</label>
                <select
                  value={filters.laboratorio}
                  onChange={(e) => setFilters({ ...filters, laboratorio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos os laboratórios</option>
                  {Array.from(new Set(solos.map(s => s.laboratorio))).map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conformidade</label>
                <select
                  value={filters.conforme}
                  onChange={(e) => setFilters({ ...filters, conforme: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Conformes</option>
                  <option value="false">Não Conformes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adequação</label>
                <select
                  value={filters.adequacao}
                  onChange={(e) => setFilters({ ...filters, adequacao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todas</option>
                  <option value="EXCELENTE">Excelente</option>
                  <option value="ADEQUADO">Adequado</option>
                  <option value="MARGINAL">Marginal</option>
                  <option value="TOLERABLE">Tolerável</option>
                  <option value="INADECUADO">Inadequado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Dados Filtrados */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-500" />
              Dados Filtrados ({applyFilters(solos).length} registos)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Total Filtrado:</span>
                  <span className="ml-2 text-gray-900">{applyFilters(solos).length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Conformes:</span>
                  <span className="ml-2 text-green-600">{applyFilters(solos).filter(s => s.conforme).length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Adequados:</span>
                  <span className="ml-2 text-purple-600">{applyFilters(solos).filter(s => 
                    s.classificacao?.adequacao === 'ADEQUADO' || s.classificacao?.adequacao === 'EXCELENTE'
                  ).length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Percentual:</span>
                  <span className="ml-2 text-blue-600">
                    {applyFilters(solos).length > 0 
                      ? ((applyFilters(solos).filter(s => s.conforme).length / applyFilters(solos).length) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Gerando relatório...</p>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleGenerateReport('executivo')}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
