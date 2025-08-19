import React, { useState } from 'react';
import { X, Download, Share2, Filter, FileText, BarChart3 } from 'lucide-react';
import { EnsaioCompactacao } from '../types';
import { PDFService } from '../services/pdfService';
import toast from 'react-hot-toast';

interface RelatorioEnsaiosCompactacaoPremiumProps {
  ensaios: EnsaioCompactacao[];
  onClose: () => void;
}

export default function RelatorioEnsaiosCompactacaoPremium({ ensaios, onClose }: RelatorioEnsaiosCompactacaoPremiumProps) {
  const [selectedReport, setSelectedReport] = useState<'individual' | 'filtrado' | 'executivo'>('individual');
  const [selectedEnsaio, setSelectedEnsaio] = useState<EnsaioCompactacao | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedEnsaio && selectedReport === 'individual') {
      toast.error('Selecione um ensaio para gerar o relatório individual');
      return;
    }

    setLoading(true);
    try {
      switch (selectedReport) {
        case 'individual':
          if (selectedEnsaio) {
            const pdfUrl = await PDFService.exportEnsaioCompactacao(selectedEnsaio);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Ensaio-${selectedEnsaio.numeroEnsaio}-${selectedEnsaio.codigo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Relatório individual gerado com sucesso!');
          }
          break;
        case 'filtrado': {
          const pdfService = new PDFService();
          await pdfService.generateEnsaiosCompactacaoFilteredReport(ensaios);
          toast.success('Relatório filtrado gerado com sucesso!');
          break;
        }
        case 'executivo': {
          const pdfServiceExec = new PDFService();
          await pdfServiceExec.generateEnsaiosCompactacaoExecutiveReport(ensaios);
          toast.success('Relatório executivo gerado com sucesso!');
          break;
        }
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReport = async () => {
    if (!selectedEnsaio && selectedReport === 'individual') {
      toast.error('Selecione um ensaio para partilhar');
      return;
    }

    setLoading(true);
    try {
      let pdfUrl: string;
      
      switch (selectedReport) {
        case 'individual':
          if (selectedEnsaio) {
            pdfUrl = await PDFService.exportEnsaioCompactacao(selectedEnsaio);
            // Aqui você pode implementar a lógica de partilha
            toast.success('Relatório individual pronto para partilha!');
          }
          break;
        case 'filtrado': {
          const pdfService = new PDFService();
          await pdfService.generateEnsaiosCompactacaoFilteredReport(ensaios);
          toast.success('Relatório filtrado pronto para partilha!');
          break;
        }
        case 'executivo': {
          const pdfServiceExec = new PDFService();
          await pdfServiceExec.generateEnsaiosCompactacaoExecutiveReport(ensaios);
          toast.success('Relatório executivo pronto para partilha!');
          break;
        }
      }
    } catch (error) {
      console.error('Erro ao preparar relatório para partilha:', error);
      toast.error('Erro ao preparar relatório para partilha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Relatórios Premium - Ensaios de Compactação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedReport('individual')}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedReport === 'individual'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-medium">Individual</span>
              </button>
              <button
                onClick={() => setSelectedReport('filtrado')}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedReport === 'filtrado'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Filter className="h-6 w-6" />
                <span className="text-sm font-medium">Filtrado</span>
              </button>
              <button
                onClick={() => setSelectedReport('executivo')}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedReport === 'executivo'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm font-medium">Executivo</span>
              </button>
            </div>
          </div>

          {/* Seleção de Ensaio (apenas para relatório individual) */}
          {selectedReport === 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Ensaio
              </label>
              <select
                value={selectedEnsaio?.id || ''}
                onChange={(e) => {
                  const ensaio = ensaios.find(e => e.id === e.target.value);
                  setSelectedEnsaio(ensaio || null);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um ensaio...</option>
                {ensaios.map(ensaio => (
                  <option key={ensaio.id} value={ensaio.id}>
                    {ensaio.numeroEnsaio} - {ensaio.codigo} - {ensaio.obra}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Informações do Relatório */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Informações do Relatório</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedReport === 'individual' && selectedEnsaio && (
                <>
                  <p><strong>Ensaio:</strong> {selectedEnsaio.numeroEnsaio}</p>
                  <p><strong>Código:</strong> {selectedEnsaio.codigo}</p>
                  <p><strong>Obra:</strong> {selectedEnsaio.obra}</p>
                  <p><strong>Localização:</strong> {selectedEnsaio.localizacao}</p>
                </>
              )}
              {selectedReport === 'filtrado' && (
                <p><strong>Total de Ensaios:</strong> {ensaios.length}</p>
              )}
              {selectedReport === 'executivo' && (
                <p><strong>Resumo Executivo:</strong> Estatísticas gerais dos ensaios</p>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={loading || (selectedReport === 'individual' && !selectedEnsaio)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
            <button
              onClick={handleShareReport}
              disabled={loading || (selectedReport === 'individual' && !selectedEnsaio)}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              {loading ? 'Preparando...' : 'Partilhar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
