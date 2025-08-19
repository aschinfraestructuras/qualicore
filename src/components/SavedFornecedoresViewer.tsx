import React, { useState, useEffect } from 'react';
import { ShareService } from '@/services/shareService';
import { Fornecedor } from '@/types';

interface SavedFornecedoresViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedFornecedoresViewer: React.FC<SavedFornecedoresViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedFornecedores();
    }
  }, [isOpen]);

  const loadSavedFornecedores = async () => {
    setLoading(true);
    try {
      const data = await shareService.getSavedFornecedores();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao carregar Fornecedores salvos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fornecedorId: string) => {
    if (!confirm('Tem certeza que deseja excluir este Fornecedor do backend?')) {
      return;
    }

    try {
      const result = await shareService.deleteFornecedorFromBackend(fornecedorId);
      if (result.success) {
        setFornecedores(prev => prev.filter(f => f.id !== fornecedorId));
        alert('Fornecedor excluído com sucesso');
      } else {
        alert(`Erro ao excluir: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir Fornecedor:', error);
      alert('Erro ao excluir Fornecedor');
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

  const handleViewDetails = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setShowDetailModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Fornecedores Salvos no Backend
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
        ) : fornecedores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum Fornecedor salvo no backend.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-800">
                        {fornecedor.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        fornecedor.estado === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fornecedor.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">NIF: {fornecedor.nif}</p>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div><span className="font-medium">Telefone:</span> {fornecedor.telefone}</div>
                      <div><span className="font-medium">Email:</span> {fornecedor.email}</div>
                      <div><span className="font-medium">Data Registo:</span> {fornecedor.data_registo}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(fornecedor)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver Detalhes
                    </button>
                    {fornecedor.arquivo_url && (
                      <button
                        onClick={() => handleDownload(fornecedor.arquivo_url!, `Fornecedor_${fornecedor.nome}.pdf`)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(fornecedor.id)}
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
        {showDetailModal && selectedFornecedor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detalhes do Fornecedor
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
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NIF</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.nif}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.estado}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Registo</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.data_registo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.telefone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contacto</label>
                    <p className="text-sm text-gray-900">{selectedFornecedor.contacto}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Morada</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedFornecedor.morada}</p>
                </div>



                {selectedFornecedor.arquivo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arquivo PDF</label>
                    <div className="mt-2">
                      <button
                        onClick={() => handleDownload(selectedFornecedor.arquivo_url!, `Fornecedor_${selectedFornecedor.nome}.pdf`)}
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
