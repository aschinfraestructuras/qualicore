import React, { useState, useEffect } from 'react';
import { ShareService } from '@/services/shareService';
import { NaoConformidade } from '@/types';

interface SavedNaoConformidadesViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedNaoConformidadesViewer: React.FC<SavedNaoConformidadesViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [naoConformidades, setNaoConformidades] = useState<NaoConformidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NaoConformidade | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedNaoConformidades();
    }
  }, [isOpen]);

  const loadSavedNaoConformidades = async () => {
    setLoading(true);
    try {
      const data = await shareService.getSavedNaoConformidades();
      setNaoConformidades(data);
    } catch (error) {
      console.error('Erro ao carregar Não Conformidades salvas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ncId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta Não Conformidade do backend?')) {
      return;
    }

    try {
      const result = await shareService.deleteNaoConformidadeFromBackend(ncId);
      if (result.success) {
        setNaoConformidades(prev => prev.filter(nc => nc.id !== ncId));
        alert('Não Conformidade excluída com sucesso');
      } else {
        alert(`Erro ao excluir: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir Não Conformidade:', error);
      alert('Erro ao excluir Não Conformidade');
    }
  };

  const handleDownload = (arquivoUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = arquivoUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (nc: NaoConformidade) => {
    setSelectedNC(nc);
    setShowDetailModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Não Conformidades Salvas no Backend
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">A carregar...</p>
          </div>
        ) : naoConformidades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhuma Não Conformidade salva no backend.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {naoConformidades.map((nc) => (
              <div
                key={nc.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-800">
                        {nc.codigo} - {nc.tipo}
                      </h3>
                                             <span className={`px-2 py-1 text-xs rounded ${
                         nc.severidade === 'alta' ? 'bg-red-100 text-red-800' :
                         nc.severidade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                         'bg-green-100 text-green-800'
                       }`}>
                         {nc.severidade}
                       </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{nc.descricao}</p>
                                         <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                       <div><span className="font-medium">Categoria:</span> {nc.categoria}</div>
                       <div><span className="font-medium">Data Deteção:</span> {nc.data_deteccao}</div>
                       <div><span className="font-medium">Estado:</span> {nc.estado}</div>
                     </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(nc)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver Detalhes
                    </button>
                    {nc.arquivo_url && (
                      <button
                        onClick={() => handleDownload(nc.arquivo_url!, `NC_${nc.codigo}.pdf`)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(nc.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes */}
        {showDetailModal && selectedNC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detalhes da Não Conformidade
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <p className="text-sm text-gray-900">{selectedNC.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="text-sm text-gray-900">{selectedNC.tipo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severidade</label>
                    <p className="text-sm text-gray-900">{selectedNC.severidade}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <p className="text-sm text-gray-900">{selectedNC.categoria}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Deteção</label>
                    <p className="text-sm text-gray-900">{selectedNC.data_deteccao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsável Deteção</label>
                    <p className="text-sm text-gray-900">{selectedNC.responsavel_deteccao}</p>
                  </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-700">Estado</label>
                     <p className="text-sm text-gray-900">{selectedNC.estado}</p>
                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Área Afetada</label>
                    <p className="text-sm text-gray-900">{selectedNC.area_afetada}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedNC.descricao}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Impacto</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedNC.impacto}</p>
                </div>

                {selectedNC.acao_corretiva && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ação Corretiva</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedNC.acao_corretiva}</p>
                  </div>
                )}

                                 {selectedNC.data_resolucao && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Data de Resolução</label>
                     <p className="text-sm text-gray-900 mt-1">{selectedNC.data_resolucao}</p>
                   </div>
                 )}

                 {selectedNC.responsavel_resolucao && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Responsável Resolução</label>
                     <p className="text-sm text-gray-900 mt-1">{selectedNC.responsavel_resolucao}</p>
                   </div>
                 )}

                {selectedNC.observacoes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedNC.observacoes}</p>
                  </div>
                )}

                {selectedNC.arquivo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arquivo PDF</label>
                    <div className="mt-2">
                      <button
                        onClick={() => handleDownload(selectedNC.arquivo_url!, `NC_${selectedNC.codigo}.pdf`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
