import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, FileText, Calendar, User, Building } from 'lucide-react';
import { ShareService } from '@/services/shareService';
import toast from 'react-hot-toast';

interface SavedObrasViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedObra {
  id: string;
  filename: string;
  obra: any;
  savedAt: string;
  size: string;
}

export function SavedObrasViewer({ isOpen, onClose }: SavedObrasViewerProps) {
  const [savedObras, setSavedObras] = useState<SavedObra[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSavedObras();
    }
  }, [isOpen]);

  const loadSavedObras = async () => {
    setLoading(true);
    try {
      const obras = await ShareService.getSavedObras();
      setSavedObras(obras);
    } catch (error) {
      console.error('Erro ao carregar obras guardadas:', error);
      toast.error('Erro ao carregar obras guardadas');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (obra: SavedObra) => {
    try {
      await ShareService.downloadObraLocally(obra.obra);
      toast.success('Obra descarregada com sucesso!');
    } catch (error) {
      console.error('Erro ao descarregar obra:', error);
      toast.error('Erro ao descarregar obra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta obra guardada?')) {
      return;
    }

    try {
      await ShareService.deleteSavedObra(id);
      toast.success('Obra eliminada com sucesso!');
      loadSavedObras();
    } catch (error) {
      console.error('Erro ao eliminar obra:', error);
      toast.error('Erro ao eliminar obra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Obras Guardadas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">A carregar...</span>
            </div>
          ) : savedObras.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma obra guardada encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedObras.map((obra) => (
                <div
                  key={obra.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {obra.obra?.nome || obra.obra?.codigo}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {obra.size}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {obra.obra?.tipo} - {obra.obra?.localizacao}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(obra.savedAt).toLocaleDateString('pt-PT')}</span>
                          </div>
                          {obra.obra?.responsavel && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{obra.obra.responsavel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(obra)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Descarregar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(obra.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
