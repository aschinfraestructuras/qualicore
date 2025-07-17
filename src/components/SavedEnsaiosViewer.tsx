import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, FileText, Calendar, User, FlaskConical } from 'lucide-react';
import { ShareService } from '@/services/shareService';
import toast from 'react-hot-toast';

interface SavedEnsaiosViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedEnsaio {
  id: string;
  filename: string;
  ensaio: any;
  savedAt: string;
  size: string;
}

export function SavedEnsaiosViewer({ isOpen, onClose }: SavedEnsaiosViewerProps) {
  const [savedEnsaios, setSavedEnsaios] = useState<SavedEnsaio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSavedEnsaios();
    }
  }, [isOpen]);

  const loadSavedEnsaios = async () => {
    setLoading(true);
    try {
      const ensaios = await ShareService.getSavedEnsaios();
      setSavedEnsaios(ensaios);
    } catch (error) {
      console.error('Erro ao carregar ensaios guardados:', error);
      toast.error('Erro ao carregar ensaios guardados');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (ensaio: SavedEnsaio) => {
    try {
      await ShareService.downloadEnsaioLocally(ensaio.ensaio);
      toast.success('Ensaio descarregado com sucesso!');
    } catch (error) {
      console.error('Erro ao descarregar ensaio:', error);
      toast.error('Erro ao descarregar ensaio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este ensaio guardado?')) {
      return;
    }

    try {
      await ShareService.deleteSavedEnsaio(id);
      toast.success('Ensaio eliminado com sucesso!');
      loadSavedEnsaios();
    } catch (error) {
      console.error('Erro ao eliminar ensaio:', error);
      toast.error('Erro ao eliminar ensaio');
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
            <h2 className="text-lg font-semibold text-gray-900">Ensaios Guardados</h2>
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
          ) : savedEnsaios.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum ensaio guardado encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedEnsaios.map((ensaio) => (
                <div
                  key={ensaio.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FlaskConical className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {ensaio.ensaio?.codigo || ensaio.ensaio?.tipo}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {ensaio.size}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {ensaio.ensaio?.tipo} - {ensaio.ensaio?.laboratorio}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(ensaio.savedAt).toLocaleDateString('pt-PT')}</span>
                          </div>
                          {ensaio.ensaio?.responsavel && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{ensaio.ensaio.responsavel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(ensaio)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Descarregar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ensaio.id)}
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