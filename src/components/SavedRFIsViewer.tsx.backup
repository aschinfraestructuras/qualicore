import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  Calendar,
  User,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { ShareService } from '@/services/shareService';
import { RFI } from '@/types';

interface SavedRFIsViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedRFIsViewer({ isOpen, onClose }: SavedRFIsViewerProps) {
  const [savedRFIs, setSavedRFIs] = useState<RFI[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(null);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedRFIs();
    }
  }, [isOpen]);

  const loadSavedRFIs = async () => {
    setLoading(true);
    try {
      const rfis = await shareService.getSavedRFIs();
      setSavedRFIs(rfis);
    } catch (error) {
      console.error('Erro ao carregar RFIs salvos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rfiId: string) => {
    if (confirm('Tem certeza que deseja excluir este RFI do backend?')) {
      try {
        const result = await shareService.deleteRFIFromBackend(rfiId);
        if (result.success) {
          await loadSavedRFIs();
          alert('RFI excluído com sucesso!');
        } else {
          alert(`Erro ao excluir: ${result.message}`);
        }
      } catch (error) {
        console.error('Erro ao excluir RFI:', error);
        alert('Erro ao excluir RFI');
      }
    }
  };

  const handleDownload = async (rfi: RFI) => {
    try {
      const result = await shareService.downloadRFILocal(rfi);
      if (result.success) {
        alert('Download iniciado!');
      } else {
        alert(`Erro no download: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      alert('Erro no download');
    }
  };

  const handleView = (rfi: RFI) => {
    setSelectedRFI(rfi);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">RFIs Salvos no Backend</h2>
              <p className="text-sm text-gray-600">
                Gerir documentos armazenados no servidor
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadSavedRFIs}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Atualizar"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : savedRFIs.length === 0 ? (
            <div className="text-center py-12">
              <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum RFI salvo</h3>
              <p className="text-gray-600">
                Os RFIs salvos no backend aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedRFIs.map((rfi) => (
                <div
                  key={rfi.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          RFI {rfi.numero} - {rfi.titulo}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{rfi.solicitante}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(rfi.data_solicitacao)}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rfi.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                            rfi.status === 'em_analise' ? 'bg-blue-100 text-blue-700' :
                            rfi.status === 'respondido' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rfi.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rfi.arquivo_url && (
                        <a
                          href={rfi.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-outline"
                          title="Ver no navegador"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        onClick={() => handleView(rfi)}
                        className="btn btn-xs btn-outline"
                        title="Ver detalhes"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDownload(rfi)}
                        className="btn btn-xs btn-outline"
                        title="Download local"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(rfi.id)}
                        className="btn btn-xs btn-danger"
                        title="Excluir do backend"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        {selectedRFI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  Detalhes do RFI {selectedRFI.numero}
                </h3>
                <button
                  onClick={() => setSelectedRFI(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número</label>
                    <p className="text-gray-900">{selectedRFI.numero}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Título</label>
                    <p className="text-gray-900">{selectedRFI.titulo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Solicitante</label>
                    <p className="text-gray-900">{selectedRFI.solicitante}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Destinatário</label>
                    <p className="text-gray-900">{selectedRFI.destinatario}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Solicitação</label>
                    <p className="text-gray-900">{formatDate(selectedRFI.data_solicitacao)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p className="text-gray-900">{selectedRFI.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Prioridade</label>
                    <p className="text-gray-900">{selectedRFI.prioridade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Resposta</label>
                    <p className="text-gray-900">
                      {selectedRFI.data_resposta ? formatDate(selectedRFI.data_resposta) : 'Pendente'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Descrição</label>
                  <p className="text-gray-900 mt-1">{selectedRFI.descricao}</p>
                </div>
                
                {selectedRFI.resposta && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resposta</label>
                    <p className="text-gray-900 mt-1">{selectedRFI.resposta}</p>
                  </div>
                )}
                
                {selectedRFI.observacoes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Observações</label>
                    <p className="text-gray-900 mt-1">{selectedRFI.observacoes}</p>
                  </div>
                )}

                {selectedRFI.arquivo_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Arquivo PDF</label>
                    <div className="mt-2">
                      <a
                        href={selectedRFI.arquivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline flex items-center space-x-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Abrir PDF</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 