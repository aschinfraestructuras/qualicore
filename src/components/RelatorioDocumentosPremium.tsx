import React, { useState } from 'react';
import { X, FileText, Download, Filter, BarChart3, PieChart, User } from 'lucide-react';
import { Documento } from '@/types';
import { PDFService } from "@/services/pdfService";
import toast from 'react-hot-toast';

interface RelatorioDocumentosPremiumProps {
  documentos: Documento[];
  onClose: () => void;
}

export default function RelatorioDocumentosPremium({ documentos, onClose }: RelatorioDocumentosPremiumProps) {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    responsavel: '',
    zona: '',
    dataInicio: '',
    dataFim: '',
  });

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      const filteredDocumentos = applyFilters(documentos);
      const pdfService = new PDFService();
      
      switch (reportType) {
        case 'executivo':
          await pdfService.generateDocumentosExecutiveReport(filteredDocumentos);
          break;
        case 'filtrado':
          await pdfService.generateDocumentosFilteredReport(filteredDocumentos, filters);
          break;
        case 'comparativo':
          await pdfService.generateDocumentosComparativeReport(filteredDocumentos);
          break;
        default:
          throw new Error('Tipo de relatório não reconhecido');
      }
      
      toast.success(`Relatório ${reportType} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (documentos: Documento[]) => {
    return documentos.filter(documento => {
      const matchesTipo = !filters.tipo || documento.tipo === filters.tipo;
      const matchesEstado = !filters.estado || documento.estado === filters.estado;
      const matchesResponsavel = !filters.responsavel || documento.responsavel === filters.responsavel;
      const matchesZona = !filters.zona || documento.zona === filters.zona;
      
      const matchesData = !filters.dataInicio || !filters.dataFim || 
        (documento.data_criacao >= filters.dataInicio && documento.data_criacao <= filters.dataFim);

      return matchesTipo && matchesEstado && matchesResponsavel && 
             matchesZona && matchesData;
    });
  };

  const reportTypes = [
    {
      id: 'executivo',
      title: 'Relatório Executivo',
      description: 'Visão geral e indicadores de conformidade documental',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 'filtrado',
      title: 'Relatório Filtrado',
      description: 'Análise detalhada com filtros aplicados',
      icon: Filter,
      color: 'bg-green-500'
    },
    {
      id: 'comparativo',
      title: 'Relatório Comparativo',
      description: 'Análise comparativa por tipo e estado',
      icon: PieChart,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios Documentos</h2>
              <p className="text-sm text-gray-600">
                {documentos.length} documento{documentos.length !== 1 ? 's' : ''} disponível{documentos.length !== 1 ? 's' : ''} para relatório
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filtros */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <select
                value={filters.tipo}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                className="input"
              >
                <option value="">Todos os tipos</option>
                <option value="projeto">Projeto</option>
                <option value="especificacao">Especificação</option>
                <option value="relatorio">Relatório</option>
                <option value="certificado">Certificado</option>
                <option value="rfi">RFI</option>
                <option value="procedimento">Procedimento</option>
                <option value="plano_ensaio">Plano de Ensaio</option>
                <option value="plano_qualidade">Plano de Qualidade</option>
                <option value="manual">Manual</option>
                <option value="instrucao_trabalho">Instrução de Trabalho</option>
                <option value="formulario">Formulário</option>
                <option value="registro">Registro</option>
                <option value="outro">Outro</option>
              </select>

              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="input"
              >
                <option value="">Todos os estados</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="concluido">Concluído</option>
              </select>

              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                className="input"
                placeholder="Data início"
              />

              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                className="input"
                placeholder="Data fim"
              />
            </div>
          </div>

          {/* Tipos de Relatório */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateReport(report.id);
                    }}
                    disabled={loading}
                    className={`w-full btn ${
                      selectedReport === report.id ? 'btn-primary' : 'btn-outline'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Gerando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Gerar PDF</span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{documentos.length}</div>
                <div className="text-sm text-gray-600">Total Documentos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documentos.filter(d => d.estado === 'aprovado').length}
                </div>
                <div className="text-sm text-gray-600">Aprovados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {documentos.filter(d => d.estado === 'pendente').length}
                </div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {documentos.filter(d => d.estado === 'reprovado').length}
                </div>
                <div className="text-sm text-gray-600">Reprovados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 