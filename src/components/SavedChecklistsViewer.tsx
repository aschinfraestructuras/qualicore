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
  ClipboardList,
} from "lucide-react";

interface SavedChecklist {
  id: string;
  nome: string;
  arquivo_url: string;
  created_at: string;
  checklist_data: any;
}

interface SavedChecklistsViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedChecklistsViewer: React.FC<SavedChecklistsViewerProps> = ({
  isOpen,
  onClose,
}) => {
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChecklist, setSelectedChecklist] = useState<SavedChecklist | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const shareService = new ShareService();

  useEffect(() => {
    if (isOpen) {
      loadSavedChecklists();
    }
  }, [isOpen]);

  const loadSavedChecklists = async () => {
    setIsLoading(true);
    try {
      const checklists = await shareService.getSavedChecklists();
      setSavedChecklists(checklists);
    } catch (error) {
      console.error("Erro ao carregar checklists guardados:", error);
      toast.error("Erro ao carregar checklists guardados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (checklist: SavedChecklist) => {
    try {
      await shareService.downloadSavedChecklist(checklist.id);
      toast.success("Checklist descarregado com sucesso!");
    } catch (error) {
      console.error("Erro ao descarregar checklist:", error);
      toast.error("Erro ao descarregar checklist");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este checklist guardado?")) {
      return;
    }

    try {
      await shareService.deleteSavedChecklist(id);
      toast.success("Checklist eliminado com sucesso!");
      loadSavedChecklists();
    } catch (error) {
      console.error("Erro ao eliminar checklist:", error);
      toast.error("Erro ao eliminar checklist");
    }
  };

  const handleViewDetails = (checklist: SavedChecklist) => {
    setSelectedChecklist(checklist);
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
              <ClipboardList className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Checklists Guardados
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
            ) : savedChecklists.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum checklist guardado
                </h3>
                <p className="text-gray-500">
                  Os checklists que guardar no backend aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedChecklists.map((checklist) => (
                  <div
                    key={checklist.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardList className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {checklist.nome}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Guardado em {formatDate(checklist.created_at)}
                        </p>
                        {checklist.checklist_data && (
                          <p className="text-xs text-gray-400 mt-1">
                            {checklist.checklist_data.codigo} - {checklist.checklist_data.tipo}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(checklist)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(checklist)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Descarregar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(checklist.id)}
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
      {showDetailModal && selectedChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Checklist
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
                    {selectedChecklist.nome}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Guardado
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedChecklist.created_at)}
                  </p>
                </div>
                {selectedChecklist.checklist_data && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedChecklist.checklist_data.codigo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedChecklist.checklist_data.tipo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Responsável
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedChecklist.checklist_data.responsavel}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Zona
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedChecklist.checklist_data.zona}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedChecklist.checklist_data.estado}
                      </p>
                    </div>
                    {selectedChecklist.checklist_data.observacoes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Observações
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedChecklist.checklist_data.observacoes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDownload(selectedChecklist)}
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
