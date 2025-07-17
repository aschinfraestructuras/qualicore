import React, { useState, useEffect } from 'react';
import { ShareService } from '@/services/shareService';
import { Material } from '@/types';

interface SavedMateriaisViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedMateriaisViewer: React.FC<SavedMateriaisViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedMateriais();
    }
  }, [isOpen]);

  const loadSavedMateriais = async () => {
    setLoading(true);
    try {
      const data = await shareService.getSavedMateriais();
      setMateriais(data);
    } catch (error) {
      console.error('Erro ao carregar Materiais salvos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Tem certeza que deseja excluir este Material do backend?')) {
      return;
    }

    try {
      const result = await shareService.deleteMaterialFromBackend(materialId);
      if (result.success) {
        setMateriais(prev => prev.filter(m => m.id !== materialId));
        alert('Material excluído com sucesso');
      } else {
        alert(`Erro ao excluir: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir Material:', error);
      alert('Erro ao excluir Material');
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

  const handleViewDetails = (material: Material) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Materiais Salvos no Backend
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
        ) : materiais.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum Material salvo no backend.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {materiais.map((material) => (
              <div
                key={material.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-800">
                        {material.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        material.estado === 'aprovado' ? 'bg-green-100 text-green-800' :
                        material.estado === 'em_analise' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {material.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Código: {material.codigo}</p>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div><span className="font-medium">Tipo:</span> {material.tipo}</div>
                      <div><span className="font-medium">Quantidade:</span> {material.quantidade} {material.unidade}</div>
                      <div><span className="font-medium">Lote:</span> {material.lote}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(material)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver Detalhes
                    </button>
                    {material.arquivo_url && (
                      <button
                        onClick={() => handleDownload(material.arquivo_url!, `Material_${material.nome}.pdf`)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(material.id)}
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
        {showDetailModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detalhes do Material
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
                    <p className="text-sm text-gray-900">{selectedMaterial.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.tipo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.estado}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.quantidade} {selectedMaterial.unidade}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lote</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.lote}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Receção</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.data_rececao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsável</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.responsavel}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zona</label>
                    <p className="text-sm text-gray-900">{selectedMaterial.zona}</p>
                  </div>
                </div>

                {selectedMaterial.observacoes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedMaterial.observacoes}</p>
                  </div>
                )}

                {selectedMaterial.arquivo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arquivo PDF</label>
                    <div className="mt-2">
                      <button
                        onClick={() => handleDownload(selectedMaterial.arquivo_url!, `Material_${selectedMaterial.nome}.pdf`)}
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