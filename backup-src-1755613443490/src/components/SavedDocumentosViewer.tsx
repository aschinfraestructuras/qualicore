import React, { useState, useEffect } from "react";
import { ShareService } from "@/services/shareService";
import toast from "react-hot-toast";
import {
  X,
  Download,
  Trash2,
  Eye,
  FileText,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface SavedDocumento {
  id: string;
  nome: string;
  arquivo_url: string;
  created_at: string;
  documento_data: any;
}

interface SavedDocumentosViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedDocumentosViewer: React.FC<SavedDocumentosViewerProps> = ({
  isOpen,
  onClose,
}) => {
  const [savedDocumentos, setSavedDocumentos] = useState<SavedDocumento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocumento, setSelectedDocumento] = useState<SavedDocumento | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedDocumentos();
    }
  }, [isOpen]);

  const loadSavedDocumentos = async () => {
    setIsLoading(true);
    try {
      const documentos = await shareService.getSavedDocumentos();
      setSavedDocumentos(documentos);
    } catch (error) {
      console.error("Erro ao carregar documentos guardados:", error);
      toast.error("Erro ao carregar documentos guardados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (documento: SavedDocumento) => {
    try {
      await shareService.downloadSavedDocumento(documento.id);
      toast.success("Documento descarregado com sucesso!");
    } catch (error) {
      console.error("Erro ao descarregar documento:", error);
      toast.error("Erro ao descarregar documento");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este documento guardado?")) {
      return;
    }

    try {
      await shareService.deleteSavedDocumento(id);
      toast.success("Documento eliminado com sucesso!");
      loadSavedDocumentos();
    } catch (error) {
      console.error("Erro ao eliminar documento:", error);
      toast.error("Erro ao eliminar documento");
    }
  };

  const handleViewDetails = (documento: SavedDocumento) => {
    setSelectedDocumento(documento);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Documentos Guardados
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">A carregar...</span>
              </div>
            ) : savedDocumentos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum documento guardado
                </h3>
                <p className="text-gray-500">
                  Os documentos que guardar no backend aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedDocumentos.map((documento) => (
                  <div
                    key={documento.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {documento.nome}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Guardado em {formatDate(documento.created_at)}
                        </p>
                        {documento.documento_data && (
                          <p className="text-xs text-gray-400 mt-1">
                            {documento.documento_data.codigo} - {documento.documento_data.tipo}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(documento)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(documento)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Descarregar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(documento.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDocumento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Documento
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Ficheiro
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedDocumento.nome}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Guardado
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedDocumento.created_at)}
                  </p>
                </div>
                {selectedDocumento.documento_data && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDocumento.documento_data.codigo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedDocumento.documento_data.tipo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Versão
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDocumento.documento_data.versao}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Responsável
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDocumento.documento_data.responsavel}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Zona
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDocumento.documento_data.zona}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedDocumento.documento_data.estado}
                      </p>
                    </div>
                    {selectedDocumento.documento_data.observacoes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Observações
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedDocumento.documento_data.observacoes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDownload(selectedDocumento)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descarregar
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 