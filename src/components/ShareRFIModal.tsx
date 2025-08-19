import React, { useState } from 'react';
import { 
  Share2, 
  Mail, 
  Download, 
  Cloud, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Send,
  Save
} from 'lucide-react';
import { ShareService, ShareOptions, ShareResult } from '@/services/shareService';
import { RFI } from '@/types';

interface ShareRFIModalProps {
  rfi: RFI;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareRFIModal({ rfi, isOpen, onClose }: ShareRFIModalProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShareResult[]>([]);
  const [options, setOptions] = useState<ShareOptions>({
    email: '',
    subject: `RFI ${rfi.numero} - ${rfi.titulo}`,
    message: '',
    saveToBackend: false,
    downloadLocal: false
  });

  const handleShare = async () => {
    setLoading(true);
    setResults([]);

    try {
      const shareService = new ShareService();
      const shareResults = await shareService.shareRFI(rfi, options);
      setResults(shareResults);
    } catch (error) {
      console.error('Erro ao partilhar RFI:', error);
      setResults([{
        success: false,
        message: 'Erro ao partilhar RFI'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action: 'email' | 'backend' | 'download') => {
    setLoading(true);
    setResults([]);

    try {
      const shareService = new ShareService();
      let result: ShareResult;

      switch (action) {
        case 'email':
          result = await shareService.shareRFIByEmail(rfi, {
            email: options.email || 'admin@qualicore.pt',
            subject: options.subject,
            message: options.message
          });
          break;
        case 'backend':
          result = await shareService.saveRFIToBackend(rfi);
          break;
        case 'download':
          result = await shareService.downloadRFILocal(rfi);
          break;
        default:
          throw new Error('Ação não reconhecida');
      }

      setResults([result]);
    } catch (error) {
      console.error('Erro na ação rápida:', error);
      setResults([{
        success: false,
        message: 'Erro na ação'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Share2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Partilhar RFI</h2>
              <p className="text-sm text-gray-600">
                RFI {rfi.numero} - {rfi.titulo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ações Rápidas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleQuickAction('email')}
                disabled={loading}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Enviar por Email</p>
                  <p className="text-sm text-gray-600">Partilhar via email</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('backend')}
                disabled={loading}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <Cloud className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Salvar no Backend</p>
                  <p className="text-sm text-gray-600">Armazenar no servidor</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('download')}
                disabled={loading}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                <Download className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download Local</p>
                  <p className="text-sm text-gray-600">Descarregar para PC</p>
                </div>
              </button>
            </div>
          </div>

          {/* Opções Avançadas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Opções Avançadas</h3>
            
            {/* Email */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email para partilha
                </label>
                <input
                  type="email"
                  value={options.email}
                  onChange={(e) => setOptions({ ...options, email: e.target.value })}
                  placeholder="exemplo@empresa.com"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto do email
                </label>
                <input
                  type="text"
                  value={options.subject}
                  onChange={(e) => setOptions({ ...options, subject: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem personalizada
                </label>
                <textarea
                  value={options.message}
                  onChange={(e) => setOptions({ ...options, message: e.target.value })}
                  rows={4}
                  placeholder="Mensagem opcional para incluir no email..."
                  className="input w-full"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.saveToBackend}
                  onChange={(e) => setOptions({ ...options, saveToBackend: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Salvar no backend</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={options.downloadLocal}
                  onChange={(e) => setOptions({ ...options, downloadLocal: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Download local</span>
                </div>
              </label>
            </div>
          </div>

          {/* Botão Partilhar */}
          <button
            onClick={handleShare}
            disabled={loading || (!options.email && !options.saveToBackend && !options.downloadLocal)}
            className="w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{loading ? 'A partilhar...' : 'Partilhar RFI'}</span>
          </button>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Resultados:</h4>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.message}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Informações do RFI */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Detalhes do RFI</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Número:</span>
                <p className="font-medium">{rfi.numero}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium">{rfi.status}</p>
              </div>
              <div>
                <span className="text-gray-600">Solicitante:</span>
                <p className="font-medium">{rfi.solicitante}</p>
              </div>
              <div>
                <span className="text-gray-600">Destinatário:</span>
                <p className="font-medium">{rfi.destinatario}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
