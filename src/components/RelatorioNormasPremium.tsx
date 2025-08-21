import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Printer, Eye, Filter, Calendar, BarChart3,
  CheckCircle, AlertTriangle, Clock, Shield, Target, BookOpen,
  X, Loader2, FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';
import { normasRelatoriosAvancados } from '../lib/normas-relatorios-avancados';
import type { Norma } from '../types/normas';

interface RelatorioNormasPremiumProps {
  normas: Norma[];
  isOpen: boolean;
  onClose: () => void;
  filtros?: any;
}

interface TemplateRelatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  formato: string;
}

export default function RelatorioNormasPremium({
  normas,
  isOpen,
  onClose,
  filtros
}: RelatorioNormasPremiumProps) {
  const [templates, setTemplates] = useState<TemplateRelatorio[]>([]);
  const [templateSelecionado, setTemplateSelecionado] = useState<string>('');
  const [formatoSelecionado, setFormatoSelecionado] = useState<string>('pdf');
  const [gerando, setGerando] = useState(false);
  const [relatorioGerado, setRelatorioGerado] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      carregarTemplates();
    }
  }, [isOpen]);

  const carregarTemplates = () => {
    try {
      const templatesDisponiveis = normasRelatoriosAvancados.getTemplates();
      setTemplates(templatesDisponiveis);
      if (templatesDisponiveis.length > 0) {
        setTemplateSelecionado(templatesDisponiveis[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates de relatório');
    }
  };

  const gerarRelatorio = async () => {
    if (!templateSelecionado) {
      toast.error('Selecione um template de relatório');
      return;
    }

    setGerando(true);
    try {
      const relatorio = await normasRelatoriosAvancados.gerarRelatorio(
        templateSelecionado,
        normas,
        filtros,
        formatoSelecionado
      );

      setRelatorioGerado(relatorio);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  const baixarRelatorio = () => {
    if (!relatorioGerado?.url) {
      toast.error('Nenhum relatório disponível para download');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = relatorioGerado.url;
      link.download = `relatorio-normas-${new Date().toISOString().split('T')[0]}.${formatoSelecionado}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      toast.error('Erro ao baixar relatório');
    }
  };

  const imprimirRelatorio = () => {
    if (!relatorioGerado?.url) {
      toast.error('Nenhum relatório disponível para impressão');
      return;
    }

    try {
      const printWindow = window.open(relatorioGerado.url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Erro ao imprimir relatório:', error);
      toast.error('Erro ao imprimir relatório');
    }
  };

  const visualizarRelatorio = () => {
    if (!relatorioGerado?.url) {
      toast.error('Nenhum relatório disponível para visualização');
      return;
    }

    try {
      window.open(relatorioGerado.url, '_blank');
    } catch (error) {
      console.error('Erro ao visualizar relatório:', error);
      toast.error('Erro ao visualizar relatório');
    }
  };

  const getIconeFormato = (formato: string) => {
    switch (formato) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'word': return <FileText className="w-4 h-4" />;
      case 'html': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatosDisponiveis = [
    { id: 'pdf', nome: 'PDF', descricao: 'Documento PDF' },
    { id: 'excel', nome: 'Excel', descricao: 'Planilha Excel' },
    { id: 'word', nome: 'Word', descricao: 'Documento Word' },
    { id: 'html', nome: 'HTML', descricao: 'Página Web' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-semibold">Relatório Premium de Normas</h2>
                    <p className="text-blue-100 text-sm">
                      {normas.length} normas disponíveis para relatório
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Configuração do Relatório */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template de Relatório
                  </label>
                  <select
                    value={templateSelecionado}
                    onChange={(e) => setTemplateSelecionado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Formato */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Saída
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formatosDisponiveis.map((formato) => (
                      <button
                        key={formato.id}
                        onClick={() => setFormatoSelecionado(formato.id)}
                        className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                          formatoSelecionado === formato.id
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {getIconeFormato(formato.id)}
                        <span className="text-sm font-medium">{formato.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Estatísticas Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-semibold text-gray-800">{normas.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Ativas</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {normas.filter(n => n.status === 'ATIVA').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Críticas</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {normas.filter(n => n.prioridade === 'CRITICA').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Alta Prioridade</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {normas.filter(n => n.prioridade === 'ALTA').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={gerarRelatorio}
                  disabled={gerando || !templateSelecionado}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {gerando ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <BarChart3 className="w-5 h-5" />
                  )}
                  <span>{gerando ? 'Gerando...' : 'Gerar Relatório'}</span>
                </button>

                {relatorioGerado && (
                  <>
                    <button
                      onClick={baixarRelatorio}
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Baixar</span>
                    </button>

                    <button
                      onClick={visualizarRelatorio}
                      className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Visualizar</span>
                    </button>

                    <button
                      onClick={imprimirRelatorio}
                      className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Imprimir</span>
                    </button>
                  </>
                )}
              </div>

              {/* Informações do Relatório Gerado */}
              {relatorioGerado && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Relatório Gerado com Sucesso!
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 font-medium">Formato:</p>
                      <p className="text-blue-800">{formatoSelecionado.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Tamanho:</p>
                      <p className="text-blue-800">
                        {(relatorioGerado.tamanho / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-medium">Status:</p>
                      <p className="text-blue-800">Pronto para download</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
